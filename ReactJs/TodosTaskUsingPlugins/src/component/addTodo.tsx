import { useMutation } from "@apollo/client";
import { Create_Todo } from "../framework/graphQl/location/mutation";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import classes from "../styles/getTodo.module.css";

function AddTodo() {
  const navigate = useNavigate();
  type formValues = {
    id: string;
    title: string;
  };

  const form = useForm<formValues>();
  const { register, handleSubmit, formState, reset } = form;
  const { errors } = formState;

  const [create, { loading, error, data }] = useMutation(Create_Todo);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  const onsubmit: any = (data: any) => {
    console.log(data);

    create({
      variables: {
        title: data?.title,
        completed: true,
      },
    });
    reset();
  };

  return (
    <>
      <h1>Add Task</h1>
      <form onSubmit={handleSubmit(onsubmit)}>
        <label>Title</label>
        <input
          type="text"
          id="title"
          {...register("title", {
            required: {
              value: true,
              message: "title is required *",
            },
          })}
        />
        <p className={classes.error}>{errors.title?.message}</p>
        <button>Submit</button>
        <br />
        <button
          onClick={() => {
            navigate("/");
          }}
        >
          Back
        </button>

        <p>{data?.createTodo?.title}</p>
      </form>
    </>
  );
}
export default AddTodo;
