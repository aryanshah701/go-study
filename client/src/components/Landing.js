import { Row, Col } from "react-bootstrap";

function Landing() {
  return (
    <Row>
      <Col>
        <Row className="my-5">
          <Col>
            <h1>Welcome to GoStudy!</h1>
          </Col>
        </Row>
        <Row>
          <Col>
            <img
              class="img-fluid"
              src="https://media.istockphoto.com/vectors/young-people-studying-together-outdoors-on-nature-background-exam-vector-id1208142883?b=1&k=6&m=1208142883&s=170667a&w=0&h=WIPSA8AX7WNvgYt8QtucnLzlXi8YhGh4G2GrM_tlBGE="
              alt="landing page"
            ></img>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

export default Landing;
