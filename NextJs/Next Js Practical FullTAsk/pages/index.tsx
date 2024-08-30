import Link from "next/link";

const Home = () => {
  return (
    <>
      <Link href={`/users`}>
        <p>UsersList</p>
      </Link>
    </>
  );
};
export default Home;
