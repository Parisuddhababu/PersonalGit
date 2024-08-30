import AddTodo from "./component/addTodo";
import EditForm from "./component/editForm";
import GetTodo from "./component/getTodo";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function Home(): JSX.Element {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<GetTodo />} />
          <Route path="/addform" element={<AddTodo />} />
          <Route path="/editForm" element={<EditForm />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
export default Home;
