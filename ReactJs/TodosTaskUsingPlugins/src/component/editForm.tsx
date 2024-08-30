import { useMutation } from "@apollo/client";
import { Update_Todo } from "../framework/graphQl/location/upadateMutation";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import classes from "../styles/getTodo.module.css";

const EditForm = () => {
  const navigate = useNavigate();

  type formValues = {
    id: string;
    title: string;
  };

  const form = useForm<formValues>();
  const { register, handleSubmit, formState, reset } = form;
  const { errors } = formState;

  const [update, { loading, error, data }] = useMutation(Update_Todo);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  const onsubmit: any = (data: any) => {
    console.log(data);
    update({
      variables: {
        updateTodoId: data?.id,
        input: { title: data?.title, completed: true },
      },
    });
    reset();
  };

  console.log(data);
  return (
    <>
      <h1>Edit Task</h1>
      <form onSubmit={handleSubmit(onsubmit)}>
        <label htmlFor="id">Id</label>
        <br />
        <input
          type="text"
          id="id"
          {...register("id", {
            required: {
              value: true,
              message: "Id is required *",
            },
          })}
        />
        <p className={classes.error}>{errors.id?.message}</p>
        <br />
        <label htmlFor="title">Title</label>
        <br />
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
        <br />
        <button>Add</button>
        <br />
        <button onClick={() => navigate("/")}>Back</button>
      </form>
    </>
  );
};
export default EditForm;
