import Link from "next/link";
import { useState } from "react";

type usersProps = {
  users: {
    firstName: string;
    id: number;
    image: string;
    age: number;
    gender: string;
  }[];
};

const Home = (props: usersProps) => {
  const [searchResults, setSearchResults] = useState("");

  const searchHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 1) {
      setSearchResults(e.target.value);
    } else {
      setSearchResults("");
    }
  };

  return (
    <>
      <form>
        <div>
          <label id="search">Search Here</label>
          <input type="text" id="search" onChange={searchHandler} />
        </div>
        <br />
      </form>
      <div>
        {props.users
          .filter((user) => user.firstName.includes(searchResults))
          .map((user) => (
            <Link href={`users/${user.id}`}>
              <p> {user.firstName}</p>
            </Link>
          ))}
      </div>
      <div>
        <Link href={`/`}>
          <button>Back</button>
        </Link>
      </div>
    </>
  );
};

export async function getStaticProps() {
  const res = await fetch("https://dummyjson.com/users");
  const data = await res.json();

  return {
    props: data,
  };
}
export default Home;
