import { Row, Col, Badge, ListGroup, Button } from "react-bootstrap";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";

function ShowUser({ user }) {
  // If the user data wasn't loaded successfully
  if (!user) {
    return (
      <p>
        Loading(Something may have gone wrong... refresh the page or try
        logging/logging out)
      </p>
    );
  }

  return (
    <Row className="my-5">
      <Col>
        <UserInfo user={user} />
        <Spaces user={user} />
        <Activity user={user} />
      </Col>
    </Row>
  );
}

function UserInfo({ user }) {
  return (
    <Row>
      <Col>
        <Row className="mt-2">
          <Col className="mx-auto text-capitalize">
            <h1>Welcome {user.name}</h1>
          </Col>
        </Row>
        <Row>
          <Col>
            <p>Registered Email: {user.email}</p>
          </Col>
        </Row>
        <Row>
          <Col>
            <p>Number of spaces contributed: {user.spaces.data.length}</p>
          </Col>
        </Row>
        <Row>
          <Col>
            <p>Number of reviews left: {user.reviews.data.length}</p>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

function Spaces({ user }) {
  const spaces = user.spaces.data;
  const spacesUI = spaces.map((space, idx) => {
    const spaceData = space.data;
    const spaceUri = "/spaces/" + spaceData.id;
    return (
      <ListGroup.Item key={idx}>
        <NavLink to={spaceUri}>
          {spaceData.name}
          <Button variant="primary float-right">
            Avg Rating{" "}
            <Badge variant="light">
              {spaceData.avg_rating === 0 ? "NA" : spaceData.avg_rating}
            </Badge>
            <span className="sr-only">gostudy's review</span>
          </Button>
        </NavLink>
      </ListGroup.Item>
    );
  });

  return (
    <Row className="my-4">
      <Col className="col-lg-6 col-md-12">
        <Row>
          <Col>
            <h2>Spaces Contributed</h2>
          </Col>
        </Row>
        <Row>
          <Col>
            <ListGroup>{spacesUI}</ListGroup>
          </Col>
        </Row>
        <Row className="my-2">
          <Col>
            <NavLink to={"/spaces/new"}>Contribute a New Space</NavLink>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

function Activity({ user }) {
  return (
    <Row className="my-4">
      <Col>
        <Row>
          <Col>
            <h2>Activity</h2>
          </Col>
        </Row>
        <Row>
          <Col>
            <Comments comments={user.comments.data} />
          </Col>
          <Col>
            <Reviews reviews={user.reviews.data} />
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

function Comments({ comments }) {
  const commentsUI = comments.map((comment, idx) => {
    const spacePath = "/spaces/" + comment.space_id;
    return (
      <ListGroup.Item key={idx}>
        <NavLink to={spacePath}>{comment.body}</NavLink>
      </ListGroup.Item>
    );
  });

  return (
    <Row className="mb-4 mt-2">
      <Col>
        <Row>
          <Col>
            <h3>Comments</h3>
          </Col>
        </Row>
        <Row>
          <Col>
            <ListGroup>{commentsUI}</ListGroup>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

function Reviews({ reviews }) {
  const reviewsUI = reviews.map((review, idx) => {
    const spacePath = "/spaces/" + review.space_id;
    return (
      <ListGroup.Item key={idx}>
        <NavLink to={spacePath}>
          {review.space_name}: {review.rating}
        </NavLink>
        <Button variant="primary float-right">
          Avg Rating{"   "}
          <Badge variant="light">
            {review.space_rating === 0 ? "NA" : review.space_rating}
          </Badge>
          <span className="sr-only">gostudy's review</span>
        </Button>
      </ListGroup.Item>
    );
  });

  return (
    <Row className="mb-4 mt-2">
      <Col>
        <Row>
          <Col>
            <h3>Reviews</h3>
          </Col>
        </Row>
        <Row>
          <Col>
            <ListGroup>{reviewsUI}</ListGroup>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

function stateToProps(state) {
  const { user } = state;
  return {
    user: user,
  };
}

export default connect(stateToProps)(ShowUser);
