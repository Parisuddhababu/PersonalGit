import Link from "next/link";

interface UserProps {
  firstName: string;
  lastName: string;
  id: number;
  image: string;
  age: number;
  gender: string;
  birthDate: string;
}

const userPageId = (props: UserProps) => {
  return (
    <>
      <div>
        <div>
          <img src={props.image} alt="image" />
          <h1>FirstName:{props.firstName}</h1>
          <p>LastName:{props.lastName}</p>
          <p>Age:{props.age}</p>
          <p>DOB:{props.birthDate}</p>
        </div>
        <div>
          <Link href={`/users`}>
            <button>Back</button>
          </Link>
        </div>
      </div>
    </>
  );
};

type Params = {
  params: {
    id: number;
  };
};

export async function getServerSideProps(context: Params) {
  const { params } = context;
  const id = params.id;
  const res = await fetch(`https://dummyjson.com/users/${id}`);
  const data = await res.json();
  return {
    props: data,
  };
}

export default userPageId;
