import {
  Row,
  Col,
  Image,
  Button,
  OverlayTrigger,
  Popover,
  Table,
  Badge,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import StarRatings from "react-star-ratings";
import { FiWifiOff } from "react-icons/fi";
import { FiWifi } from "react-icons/fi";

import { useParams, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { fetchSpace } from "../../api";
import { useState } from "react";
import { apiPostReview, apiPostComment, apiDeleteComment } from "../../api";

// The SHOW event page
function ShowEvent(props) {
  // List of all spaces in the store
  const { spaces, session } = props;

  // Id of the space to render
  const { id } = useParams();

  // For redirection
  const history = useHistory();

  let spaceInfo = null;

  if (spaces !== null && spaces !== undefined) {
    // Get the appropriate space
    const storeSpace = getSpace(spaces, id);

    if (storeSpace) {
      spaceInfo = (
        <SpaceInfo space={storeSpace} session={session} history={history} />
      );
    } else {
      // If the space isn't found, fetch it
      fetchSpace(id).then((space) => {
        if (!space) {
          history.push("/feed");
        }
      });
    }
  }

  return (
    <Row className="my-5">
      <Col>{spaceInfo}</Col>
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

function SpaceInfo({ space, session, history }) {
  let image = null;
  if (space.photo !== "") {
    image = <Image className="image" src={space.photo} alt="..." fluid />;
  }
  return (
    <Row>
      <Col>
        <Row>
          <Col>
            <h1>{space.name}</h1>
          </Col>
        </Row>
        <Row className="my-3">
          <Col lg={6} md={9} xs={12}>
            {image}
          </Col>
        </Row>
        <Row className="mt-5 border-top">
          <Col>
            <SpaceDescription space={space} />
          </Col>
        </Row>
        <Comments
          comments={space.comments.data}
          space={space}
          session={session}
          history={history}
        />
      </Col>
    </Row>
  );
}

function SpaceDescription({ space }) {
  // For copy popover when share button is clicked
  const copyPopover = (
    <Popover>
      <Popover.Content>Link copied!</Popover.Content>
    </Popover>
  );

  const spaceUrl = "https://go-study.aryanshah.tech/spaces/" + space.id;

  let wifiIcon;
  if (space.wifi) {
    wifiIcon = <FiWifi />;
  } else {
    wifiIcon = <FiWifiOff />;
  }

  let websiteButton = null;
  if (space.website !== "") {
    websiteButton = (
      <div className="mr-2">
        <a
          className="btn btn-primary"
          href={space.website}
          target="_blank"
          rel="noreferrer"
        >
          Website
        </a>
      </div>
    );
  }

  return (
    <Row className="p-3">
      <Col>
        <Row className="justify-content-start">
          <div className="mr-2">
            <Button>{wifiIcon}</Button>
          </div>
          {websiteButton}
          <div className="mr-2">
            <OverlayTrigger
              trigger="click"
              placement="top"
              overlay={copyPopover}
            >
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(spaceUrl);
                }}
              >
                Share
              </Button>
            </OverlayTrigger>
          </div>
          <div className="mr-2">
            <Button variant="primary">
              Google Rating <Badge variant="light">{space.google_rating}</Badge>
              <span className="sr-only">google's review</span>
            </Button>
          </div>
          <div className="mr-2">
            <Button variant="primary">
              GoStudy Rating{" "}
              <Badge variant="light">
                {space.avg_rating === 0 ? "NA" : space.avg_rating}
              </Badge>
              <span className="sr-only">gostudy's review</span>
            </Button>
          </div>
          <div className="mr-2">
            <ReviewInput space={space} />
          </div>
        </Row>
        <Row className="mt-4 mb-2">
          <Col>
            <h3>From the author</h3>
          </Col>
        </Row>
        <Row>
          <Col>
            <p>{space.description}</p>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

// Star rating display
function ReviewInput({ space }) {
  // State for the user rating
  const [userRating, setUserRating] = useState(space.avg_review);

  // Send review
  function sendReview(rating) {
    apiPostReview(rating, space.id);
  }

  return (
    <StarRatings
      starRatedColor="#5b54da"
      starHoverColor="#5b54da"
      starEmptyColor="#aaa9ad"
      starDimension="30px"
      starSpacing="3px"
      rating={userRating}
      changeRating={(rating) => {
        setUserRating(rating);
        sendReview(rating);
      }}
    />
  );
}

// Comments display UI
function Comments({ comments, space, session }) {
  // Deletes the comment
  function deleteComment(commentId) {
    apiDeleteComment(commentId, space.id);
  }

  // Checks if the logged in owner is authorised
  function commentOwner(comment) {
    return session.id === comment.user_id;
  }

  let commentList;
  if (comments) {
    commentList = comments.map((comment, idx) => {
      // If authorised to delete the comment, add delete button
      let deleteButton = null;
      if (commentOwner(comment)) {
        deleteButton = (
          <td>
            <button
              className="btn btn-link text-danger"
              onClick={() => deleteComment(comment.id)}
            >
              Delete
            </button>
          </td>
        );
      }

      return (
        <tr key={idx}>
          <td className="col-lg-6">{comment.body}</td>
          <td className="col-lg-3">
            <Badge variant="primary">by {comment.user}</Badge>
          </td>
          {deleteButton}
        </tr>
      );
    });
  }

  return (
    <Row className="my-2">
      <Col>
        <Row>
          <Col>
            <h3>Comments</h3>
          </Col>
        </Row>
        <CommentForm space={space} />
        <Row>
          <Col>
            <Table hover>
              <tbody>{commentList}</tbody>
            </Table>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

function CommentForm({ space }) {
  // Controlled comment form
  const [comment, setComment] = useState("");

  // Submits the comment
  function submitComment() {
    // Post the comment
    apiPostComment(comment, space.id);

    // Clear the input field
    setComment("");
  }

  return (
    <Row className="my-3">
      <Col className="col-lg-9 col-md-12">
        <Row>
          <Col>
            <InputGroup className="mb-3">
              <FormControl
                placeholder="Comment"
                aria-label="Comment"
                aria-describedby="basic-addon2"
                value={comment}
                onChange={(ev) => setComment(ev.target.value)}
                onKeyPress={(ev) => {
                  if (ev.key === "Enter") {
                    submitComment();
                  }
                }}
              />
            </InputGroup>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button variant="primary" onClick={submitComment}>
              Comment
            </Button>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

function stateToProps(state) {
  const { showSpaces, session } = state;
  return { spaces: showSpaces, session: session };
}

export default connect(stateToProps)(ShowEvent);
