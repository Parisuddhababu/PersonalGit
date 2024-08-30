import { useQuery } from "@apollo/client";
import { Get_Todos } from "../framework/graphQl/query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import classes from "../styles/getTodo.module.css";
import DataTable, { createTheme } from "react-data-table-component";

function GetTodo() {
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState("");
  const { loading, error, data } = useQuery(Get_Todos);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  interface Columns {
    name: string;
    username: string;
    title: string;
    email: string;
    phone: string;
    id: string;
  }

  const columns = [
    {
      name: "name",
      selector: (row: { name: string }) => row.name,
    },
    {
      name: "username",
      selector: (row: { username: string }) => row.username,
    },
    {
      name: "title",
      selector: (row: { title: string }) => row.title,
      sortable: true,
      button: true,
    },
    {
      name: "email",
      selector: (row: { email: string }) => row.email,
    },
    {
      name: "Edit",
      cell: (row: any) => (
        <button
          onClick={() => {
            navigate("/editForm");
          }}
        >
          Edit
        </button>
      ),
    },
  ];
  createTheme(
    "solarized",
    {
      text: {
        primary: "#268bd2",
        secondary: "#2aa198",
      },
      background: {
        default: "#002b36",
      },
      context: {
        background: "#cb4b16",
        text: "#FFFFFF",
      },
      divider: {
        default: "#073642",
      },
      action: {
        button: "rgba(0,0,0,.54)",
        hover: "rgba(0,0,0,.08)",
        disabled: "rgba(0,0,0,.12)",
      },
    },
    "dark"
  );

  const todosTableData: Columns[] = [];

  data?.todos?.data?.map((item: any) =>
    todosTableData.push({
      id: item?.id,
      title: item?.title,
      name: item?.user?.name,
      username: item?.user?.username,
      email: item?.user?.email,
      phone: item?.user?.phone,
    })
  );

  const searchHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 1) {
      setSearchResults(e.target.value);
    } else {
      setSearchResults("");
    }
  };

  const filteredItems = todosTableData.filter((item) =>
    item.title.toLowerCase().includes(searchResults)
  );

  console.log(data);

  return (
    <>
      <h1 className={classes.h1}>Details</h1>
      <div className={classes.container}>
        <label htmlFor="search" className={classes.label}>
          Search
        </label>
        <input type="text" id="search" onChange={searchHandler} />

        <button
          onClick={() => {
            navigate("/addForm");
          }}
        >
          Add User
        </button>
      </div>

      <br />

      <DataTable
        pagination
        columns={columns}
        data={filteredItems}
        selectableRows
        theme="solarized"
      />
    </>
  );
}
export default GetTodo;
