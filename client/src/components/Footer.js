import { Row, Col, Image } from "react-bootstrap";

import googleAttr from "../powered_by_google_on_white.png";

function Footer() {
  return (
    <Row>
      <Col>
        <Image src={googleAttr} alt="..." />
      </Col>
    </Row>
  );
}

export default Footer;
