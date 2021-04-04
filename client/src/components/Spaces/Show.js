import { Row, Col } from "react-bootstrap";

import { useParams } from "react-router-dom";

// The SHOW event page
function ShowEvent() {
  const { id } = useParams();

  return (
    <Row className="my-5">
      <Col>
        <Row>
          <Col>
            <h1>Event {id}</h1>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

export default ShowEvent;
