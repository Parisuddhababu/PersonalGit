import React, { useState } from "react";
interface UserProps {
  firstName: string;
  lastName: string;
}

const addUser = async (user: UserProps) => {
  const response = await fetch(`${process.env.USERS}/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    throw new Error("Failed to add user");
  }
};

export default function Users() {
  const [emptyForm, setEmptyForm] = useState(true);
  const [firstName, setfirstName] = useState("");
  const [lastName, setlastName] = useState("");
  const [users, setUsers] = useState({ firstName: "", lastName: "" });

  const handleSubmit = async (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (firstName.length > 0 && lastName.length > 0) {
      await addUser({ firstName, lastName });
      alert("Data Sent Sucessfully");
      setUsers({ firstName, lastName });
      setfirstName("");
      setlastName("");
    }
    if (firstName.trim() === "" && lastName.trim() === "") {
      setEmptyForm(false);
    }
  };

  const firstNameHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setfirstName(event.target.value);
    setEmptyForm(true);
  };
  const lastNameHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setlastName(event.target.value);
    setEmptyForm(true);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          firstname
          <input type="text" value={firstName} onChange={firstNameHandler} />
        </label>
        <label>
          lastname
          <input type="text" value={lastName} onChange={lastNameHandler} />
        </label>
        <button type="submit">Add User</button>
        {!emptyForm && <p>enter values in all feilds</p>}
      </form>
      <h3>User List</h3>
      {
        <ul>
          <li style={{ listStyleType: "none" }}>
            {users.firstName} {users.lastName}
          </li>
        </ul>
      }
    </div>
  );
}
