import { Row, Col } from "react-bootstrap";

import { useParams, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { fetchSpace } from "../../api";

// The SHOW event page
function ShowEvent(props) {
  // List of all spaces in the store
  const { spaces } = props;

  // Id of the space to render
  const { id } = useParams();

  // For redirection
  const history = useHistory();

  let spaceInfo = null;

  if (spaces !== null && spaces !== undefined) {
    // Get the appropriate space
    const storeSpace = getSpace(spaces, id);

    if (storeSpace) {
      spaceInfo = <SpaceInfo space={storeSpace} />;
    } else {
      // If the space isn't found, fetch it
      console.log("Space not found: ", storeSpace);
      fetchSpace(id).then((space) => {
        if (!space) {
          history.push("/feed");
        }
      });
    }
  }

  return (
    <Row className="my-5">
      <Col>
        <Row>
          <Col>
            <h1>Space {id}</h1>
          </Col>
        </Row>
        {spaceInfo}
      </Col>
    </Row>
  );
}

function SpaceInfo({ space }) {
  return (
    <Row>
      <Col>{space.name}</Col>
    </Row>
  );
}

function getSpace(spaces, id) {
  const space = spaces.filter((space) => space.id === parseInt(id));
  if (space !== []) {
    return space[0];
  } else {
    return null;
  }
}

function stateToProps(state) {
  console.log("Store: ", state);
  const { showSpaces } = state;
  return { spaces: showSpaces };
}

export default connect(stateToProps)(ShowEvent);
