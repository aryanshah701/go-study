import { Nav, Row, Col, Alert } from "react-bootstrap";
import { NavLink, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import store from "../store";

// Navbar component
function NavBar(props) {
  const { success, error } = props;

  // Alerts
  let successAlert = null;
  let errorAlert = null;
  if (success) {
    successAlert = <Alert variant="success">{success}</Alert>;
  }

  if (error) {
    errorAlert = <Alert variant="danger">{error}</Alert>;
  }

  return (
    <Row>
      <Col>
        <Row>
          <Col>{successAlert}</Col>
        </Row>
        <Row>
          <Col>{errorAlert}</Col>
        </Row>
        <Row>
          <Col>
            <Nav as="ul">
              <NavInfo />
            </Nav>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

// Login/Register, or Logout component based on whether the user is authenticated or not
const NavInfo = connect(stateToProps)(({ session }) => {
  if (!session) {
    return (
      <Row>
        <Nav.Item>
          <NavLink to="/" className="nav-link mx-2">
            Home
          </NavLink>
        </Nav.Item>
        <Nav.Item>
          <NavLink to="/login" className="nav-link mx-2">
            Login
          </NavLink>
        </Nav.Item>
        <Nav.Item>
          <NavLink to="/users/new" className="nav-link mx-2">
            Register
          </NavLink>
        </Nav.Item>
      </Row>
    );
  } else {
    const userShowPath = "/users/show";
    const eventNewPath = "/spaces/new";
    return (
      <Row>
        <Nav.Item>
          <NavLink to="/" className="nav-link mx-2">
            Home
          </NavLink>
        </Nav.Item>
        <Nav.Item>
          <NavLink to={userShowPath} className="nav-link mx-2 text-capitalize">
            {session.name}
          </NavLink>
        </Nav.Item>
        <LogoutButton />
        <Nav.Item>
          <NavLink to={eventNewPath} className="nav-link">
            Create New Study Space
          </NavLink>
        </Nav.Item>
      </Row>
    );
  }
});

// Logout functionality
const LogoutButton = connect()(({ dispatch }) => {
  const history = useHistory();
  function logoutUser() {
    const successAction = {
      data: "Logout successfull",
      type: "success/set",
    };

    // Logout
    dispatch({ type: "session/logout" });

    // Dispatch success message
    store.dispatch(successAction);

    // Redirect to Login page
    history.push("/");
  }

  return (
    <Nav.Item>
      <button onClick={logoutUser} className="btn btn-link nav-link mx-2">
        Logout
      </button>
    </Nav.Item>
  );
});

function stateToProps(state) {
  const { session } = state;
  return { session: session };
}

function navStateToProps(state) {
  const { success, error } = state;
  return { success: success, error: error };
}

export default connect(navStateToProps)(NavBar);
