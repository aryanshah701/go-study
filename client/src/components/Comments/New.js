import { Row, Col, Form, Button } from 'react-bootstrap';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { create_comment, fetch_comments } from '../api';
import pick from 'lodash/pick';


export default function ResponsesNew() {
  let history = useHistory();
  const [comment, setComment] = useState({
    body: ""
  });


  function submit(ev) {
    ev.preventDefault();
    let data = pick(comment, ['body']);
    create_response(data).then(() => {
      fetch_comments();
      history.push("/");
    });
  }



  function update(field, ev) {
    let c1 = Object.assign({}, comment);
    c1[field] = ev.target.value;
    setComment(c1);
  }


  return (
    <Row>
      <Col>
        <h2>Comment</h2>
        <Form onSubmit={submit}>
        <Form.Group>
          <Form.Label>Body</Form.Label>
          <Form.Control type="text" onChange={
            (ev) => update("body", ev)} value={comment.body} />
        </Form.Group>
          <Button variant="primary" type="submit">
            Send Comment
          </Button>
        </Form>
      </Col>
    </Row>
  );
}
