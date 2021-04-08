import { Row, Col, Form, Button } from 'react-bootstrap';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { create_response, fetch_responses } from '../api';
import pick from 'lodash/pick';


export default function ReviewNew() {
  let history = useHistory();
  const [review, setReview] = useState({
    body: ""
  });


  function submit(ev) {
    ev.preventDefault();
    let data = pick(review, ['body']);
    create_review(data).then(() => {
      fetch_reviews();
      history.push("/");
    });
  }



  function update(field, ev) {
    let c1 = Object.assign({}, review);
    c1[field] = ev.target.value;
    setResponse(c1);
  }


  return (
    <Row>
      <Col>
        <h2>Leave a Review</h2>
        <Form onSubmit={submit}>
        <Form.Group>
          <Form.Label>Body</Form.Label>
          <Form.Control type="number" onChange={
            (ev) => update("body", ev)} value={review.body} />
        </Form.Group>
          <Button variant="primary" type="submit">
            Send Review
          </Button>
        </Form>
      </Col>
    </Row>
  );
}
