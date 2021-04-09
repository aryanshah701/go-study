import { Row, Col, Jumbotron, Container } from "react-bootstrap";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";

//  <img
//    className="img-fluid"
//    src="https://media.istockphoto.com/vectors/young-people-studying-together-outdoors-on-nature-background-exam-vector-id1208142883?b=1&k=6&m=1208142883&s=170667a&w=0&h=WIPSA8AX7WNvgYt8QtucnLzlXi8YhGh4G2GrM_tlBGE="
//    alt="landing page"
//  ></img>;

function Landing({ session }) {
  let loginButton = null;
  if (!session) {
    loginButton = (
      <NavLink
        to="/users/new"
        className="btn btn-primary mx-2"
        variant="primary"
      >
        Sign Up
      </NavLink>
    );
  }

  return (
    <Row className="landing">
      <Col>
        <Jumbotron fluid>
          <Container>
            <h1 className="highlight-title">Welcome to GoStudy!</h1>
            <p className="highlight-paragraph" hideCursor={true} speed={2000}>
              Your curated list of unique study places near you.
            </p>
            <p>
              <NavLink to="/feed" variant="primary" className="btn btn-primary">
                Find Spaces
              </NavLink>
              {loginButton}
            </p>
          </Container>
        </Jumbotron>
      </Col>
    </Row>
  );
}

function stateToProps(state) {
  const { session } = state;
  return { session: session };
}

export default connect(stateToProps)(Landing);
