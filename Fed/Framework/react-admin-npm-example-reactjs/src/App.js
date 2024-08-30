import "./App.css";
import {
  Admin,
  Resource,
  ListGuesser,
  EditGuesser,
} from "react-admin";
import jsonServerProvider from "ra-data-json-server";
import { CommentList } from "./components/comments/comments";
import { CommentShow } from "./components/comments/commentsShow";

const dataProvider = jsonServerProvider("https://jsonplaceholder.typicode.com");

const App = () => (
  <Admin dataProvider={dataProvider}>
    <Resource name="users" list={ListGuesser} edit={EditGuesser} />
    <Resource name="posts" list={ListGuesser} edit={EditGuesser} />

    <Resource name="comments" list={CommentList} edit={EditGuesser} show={CommentShow} />

  </Admin>
);

export default App;
