import { Row, Col } from "react-bootstrap";

import { useParams } from "react-router-dom";
import { connect } from "react-redux";

// The SHOW event page
function ShowEvent(props) {
  const { spaces } = props;
  const { id } = useParams();
  let spaceInfo = null;

  if (spaces && spaces !== undefined) {
    // Get the appropriate space
    const space = getSpace(spaces, id);

    // Ensure it is found
    if (space) {
      spaceInfo = <SpaceInfo space={space} />;
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
  const space = spaces.filter((space) => space.id === id);
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
