// Styles and Bootstrap
import './App.scss';
import {Container, Row, Col} from 'react-bootstrap';

// React router and components
import { Switch, Route } from 'react-router-dom';
import NavBar from './components/Nav';
import Feed from './components/Feed';
import Login from './components/Users/Login';

function App() {
  return (
    <Container className="my-5">
      <Row>
        <Col>
          <NavBar />
        </Col>
      </Row>
      <Switch>
        <Route path="/" exact>
          <Feed />
        </Route>
        <Route path="/login" exact>
          <Login />
        </Route>
      </Switch>
    </Container>
  );
}

export default App;
