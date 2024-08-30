# REACT-HOOK-FORM

### Installation command

```
$ npm install react-hook-form
```

#### Description

- usage of this package is when we have a multiple form in our react application and we need to handle validation of that form at that time we can used react-hook-form
- React-hook-form used `only on functional component`
- React-hook-form `can not be used with class based component`
- React-hook-form also support `yup validation`

### Concept of React-hook-form

> Here given below is the concept of react-hook-form

- Register field
- Apply Validation
- Integrating the existing form
- Integrating with the UI library
- Integrating with Controlled Input
- Integrating with global state
- Handle Error
- Schema Validation
- React native
- Type Script

> React hook form API

- useForm
- useController
- useFormContext
- useWatch
- useFormState
- useFieldArray

---

## API - useForm

> ### register

- register field is used for the registering your component to the hook.
- Each of the field is required a `name` as a key for the registration process

### Props

| Props    | Type           | Description                                |
| -------- | -------------- | ------------------------------------------ |
| onChange | ChangeHandler  | subscribe the input change event           |
| onBlur   | ChangeHandler  | subscribe the input blur event.            |
| ref      | React.Ref<any> | Input reference for hook form to register. |
| name     | stirng         | Input name to be register                  |

### Example

```
const { onChange, onBlur, name, ref } = register('firstName');
// include type check against field path with the name you have supplied.

<input
  onChange={onChange} // assign onChange event
  onBlur={onBlur} // assign onBlur event
  name={name} // assign name prop
  ref={ref} // assign ref prop
/>
// same as above
<input {...register('firstName')} />
```

> Other options: https://react-hook-form.com/api/useform/register

> Video Example: https://youtu.be/JFIpCoajYkA

### Custom Register

- we can register inputs with useEffect and treat them as virtual inputs. For controlled components, we provide a custom hook useController and Controller component to take care this process for you.

```
register('firstName', { required: true, min: 8 });

<TextInput onTextChange={(value) => setValue('lastChange', value))} />
```

### Work with innerRef, inputRef

```
// not working, because ref is not assigned
<TextInput {...register('test')} />

const firstName = register('firstName', { required: true })
<TextInput
  onChange={firstName.onChange}
  onBlur={firstName.onBlur}
  inputRef={firstName.ref} // you can achieve the same for different ref name such as innerRef
/>

// correct way to forward input's ref
const Select = React.forwardRef(({ onChange, onBlur, name, label }, ref) => (
  <select name={name} ref={ref} onChange={onChange} onBlur={onBlur}>
    <option value="20">20</option>
    <option value="30">30</option>
  </select>
));
```

---

> ### unregister

- This method allows you to unregister a single input or an array of inputs. It also provides a second optional argument to keep state after unregistering an input.

### Props

| Props | Type   | Description               |
| ----- | ------ | ------------------------- |
| name  | stirng | Input name to be register |

### Example

```
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

interface IFormInputs {
  firstName: string;
  lastName?: string;
}

export default function App() {
  const { register, handleSubmit, unregister } = useForm<IFormInputs>();
  const onSubmit = (data: IFormInputs) => console.log(data);

  React.useEffect(() => {
    register("lastName");
  }, [register])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <button type="button" onClick={() => unregister("lastName")}>unregister</button>
      <input type="submit" />
    </form>
  );
};
```

> Other Options: https://react-hook-form.com/api/useform/unregister

> Video Example: https://youtu.be/TM99g_NW5Gk

---

> ### formState

- This object contains information about the entire form state. It helps you to keep on track with the user's interaction with your form application.

- formState retrun below things

| Props              | Type    | Description                                                                                                                                                |
| ------------------ | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| isDirty            | boolean | Set to true after the user modifies any of the inputs.                                                                                                     |
| dirtyFields        | object  | An object with the user-modified fields. Make sure to provide all inputs' defaultValues via useForm, so the library can compare against the defaultValues. |
| touchedFields      | object  | An object containing all the inputs the user has interacted with.                                                                                          |
| isSubmitted        | boolean | Set to true after the form is submitted. Will remain true until the reset method is invoked.                                                               |
| isSubmitSuccessful | boolean | Indicate the form was successfully submitted without any Promise rejection or Error been thrown within the handleSubmit callback.                          |
| isSubmitting       | boolean | true if the form is currently being submitted. false otherwise.                                                                                            |
| submitCount        | number  | Number of times the form was submitted.                                                                                                                    |
| isValid            | boolean | Set to true if the form doesn't have any errors.                                                                                                           |
| isValidating       | boolean | Set to true during validation.                                                                                                                             |
| errors             | object  | An object with field errors. There is also an ErrorMessage component to retrieve error message easily.                                                     |

### Example

```
import React from "react";
import { useForm } from "react-hook-form";

type FormInputs = {
  test: string
}

export default function App() {
  const {
    register,
    handleSubmit,
    // Read the formState before render to subscribe the form state through Proxy
    formState: { errors, isDirty, isSubmitting, touchedFields, submitCount },
  } = useForm<FormInputs>();
  const onSubmit = (data: FormInputs) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("test")} />
      <input type="submit" />
    </form>
  );
}
```

> Video Example: https://youtu.be/4kzd572NbkM

---

> ### Watch

- This method will watch specified inputs and return their values. It is useful to render input value and for determining what to render by condition.

| Props | Type                                                          |
| ----- | ------------------------------------------------------------- |
| name  | string `or` string[] `or` (data, options) => void) => unknown |

### Example

```
import React from "react";
import { useForm } from "react-hook-form";

interface IFormInputs {
  name: string
  showAge: boolean
  age: number
}

function App() {
  const { register, watch, formState: { errors }, handleSubmit } = useForm<IFormInputs>();
  const watchShowAge = watch("showAge", false); // you can supply default value as second argument
  const watchAllFields = watch(); // when pass nothing as argument, you are watching everything
  const watchFields = watch(["showAge", "age"]); // you can also target specific fields by their names

  // Callback version of watch.  It's your responsibility to unsubscribe when done.
  React.useEffect(() => {
    const subscription = watch((value, { name, type }) => console.log(value, name, type));
    return () => subscription.unsubscribe();
  }, [watch]);

  const onSubmit = (data: IFormInputs) => console.log(data);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register("name", { required: true, maxLength: 50 })} />
        <input type="checkbox" {...register("showAge")} />
        {/* based on yes selection to display Age Input*/}
        {watchShowAge && (
          <input type="number" {...register("age", { min: 50 })} />
        )}
        <input type="submit" />
      </form>
    </>
  );
}
```

> Video Example: https://youtu.be/3qLd69WMqKk

---

> ### handleSubmit

- This function will receive the form data if form validation is successful.

| Props              | Type                                | Description            |
| ------------------ | ----------------------------------- | ---------------------- |
| SubmitHandler      | (data: Object, e?: Event) => void   | A successful callback. |
| SubmitErrorHandler | (errors: Object, e?: Event) => void | An error callback.     |

### Example

```
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";

type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
};

export default function App() {
  const { register, handleSubmit } = useForm<FormValues>();
  const onSubmit: SubmitHandler<FormValues> = data => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("firstName")} />
      <input {...register("lastName")} />
      <input type="email" {...register("email")} />

      <input type="submit" />
    </form>
  );
}
```

> Video Example: https://youtu.be/KzcPKB9SOEk

---

> ### reset

- Reset the entire form state, fields reference, and subscriptions. There are optional arguments and will allow partial form state reset.

| Props             | Type    | Description                                                                                                                                                                                                      |
| ----------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| values            | object  | An optional object to reset form values, and it's recommended to provide the entire defaultValues when supplied.                                                                                                 |
| keepErrors        | boolean | All errors will remain. This will not guarantee with further user actions.                                                                                                                                       |
| keepDirty         | boolean | DirtyFields form state will remain, and isDirty will temporarily remain as the current state until further user's action. `this keep option doesn't reflect form input values but only dirty fields form state.` |
| keepValues        | boolean | Form input values will be unchanged.                                                                                                                                                                             |
| keepDefaultValues | boolean | Keep the same defaultValues which are initialised via useForm.                                                                                                                                                   |
| keepIsSubmitted   | boolean | isSubmitted state will be unchanged.                                                                                                                                                                             |
| keepTouched       | boolean | isTouched state will be unchanged.                                                                                                                                                                               |
| keepIsValid       | boolean | isValid will temporarily persist as the current state until additional user actions.                                                                                                                             |
| keepSubmitCount   | boolean | submitCount state will be unchanged.                                                                                                                                                                             |

### Uncontrolled Example

```
import React from "react";
import { useForm } from "react-hook-form";

interface UseFormInputs {
  firstName: string
  lastName: string
}

export default function Form() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<UseFormInputs>();
  const onSubmit = (data: UseFormInputs) => {
    console.log(data)
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>First name</label>
      <input {...register("firstName", { required: true })} />

      <label>Last name</label>
      <input {...register("lastName")} />

      <input type="submit" />
      <input
        type="reset"
        value="Standard Reset Field Values"
      />
      <input
        type="button"
        onClick={() => reset()}
        value="Custom Reset Field Values & Errors"
      />
    </form>
  );
}
```

### Controlled Example

```
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField } from "@material-ui/core";

interface IFormInputs {
  firstName: string
  lastName: string
}

export default function App() {
  const { register, handleSubmit, reset, setValue, control } = useForm<IFormInputs>();
  const onSubmit = (data: IFormInputs) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        render={({ field }) => <TextField {...field} />}
        name="firstName"
        control={control}
        rules={{ required: true }}
        defaultValue=""
      />
      <Controller
        render={({ field }) => <TextField {...field} />}
        name="lastName"
        control={control}
        defaultValue=""
      />

      <input type="submit" />
      <input type="button" onClick={reset} />
      <input
        type="button"
        onClick={() => {
          reset({
            firstName: "bill",
            lastName: "luo"
          });
        }}
      />
    </form>
  );
}
```

### FieldArray Example

```
import React, { useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";

function App() {
  const { register, control, handleSubmit, reset } = useForm({
    defaultValues: {
      loadState: "unloaded",
      names: [{ firstName: "Bill", lastName: "Luo" }]
    }
  });
  const { fields, remove } = useFieldArray({
    control,
    name: "names"
  });

  useEffect(() => {
    reset({
      names: [
        {
          firstName: "Bob",
          lastName: "Actually"
        },
        {
          firstName: "Jane",
          lastName: "Actually"
        }
      ]
    });
  }, [reset]);

  const onSubmit = (data) => console.log("data", data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ul>
        {fields.map((item, index) => (
          <li key={item.id}>
            <input {...register(`names.${index}.firstName`)} />

            <Controller
              render={({ field }) => <input {...field} />}
              name={`names.${index}.lastName`}
              control={control}
            />
            <button type="button" onClick={() => remove(index)}>Delete</button>
          </li>
        ))}
      </ul>

      <input type="submit" />
    </form>
  );
}
```

> Video Example: https://youtu.be/qmCLBjyPwVk

---

> ### resetField

- Reset an individual field state.

| Props   | inside Options | Type    | Description                                                                      |
| ------- | -------------- | ------- | -------------------------------------------------------------------------------- |
| name    |                | string  | registered field name.                                                           |
| options | keepError      | boolean | When set to true, field error will be retained.                                  |
| options | keepDirty      | boolean | When set to true, dirtyFields will be retained.                                  |
| options | keepTouched    | boolean | When set to true, touchedFields state will be unchanged.                         |
| options | defaultValue   | unknown | When this value is not provided, field will be revert back to it's defaultValue. |

### Example

```
import * as React from "react";
import { useForm } from "react-hook-form";

export default function App() {
  const {
    register,
    resetField,
    formState: { isDirty, isValid }
  } = useForm({
    mode: "onChange",
    defaultValues: {
      firstName: ""
    }
  });
  const handleClick = () => resetField("firstName");

  return (
    <form>
      <input {...register("firstName", { required: true })} />

      <p>{isDirty && "dirty"}</p>
      <p>{isValid && "valid"}</p>

      <button type="button" onClick={handleClick}>
        Reset
      </button>
    </form>
  );
}
```

> Video Example: https://youtu.be/IdLFcNaEFEo

---

> ### setError

- The function allows you to manually set one or more errors.

| Props  | Type                                                           | Description                                                                                                                                            |
| ------ | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| name   | string                                                         | Input name                                                                                                                                             |
| error  | { type: string, message?: string, types: MultipleFieldErrors } | Set an error with its type and message                                                                                                                 |
| config | { shouldFocus?: boolean }                                      | Should focus the input during setting an error. This only works when the input's reference is registered, it will not work for custom register as well |

### Single Error Example

```
import * as React from "react";
import { useForm } from "react-hook-form";

type FormInputs = {
  username: string;
};

const App = () => {
  const { register, handleSubmit, setError, formState: { errors } } = useForm<FormInputs>();
  const onSubmit = (data: FormInputs) => {
    console.log(data)
  };

  React.useEffect(() => {
    setError("username", {
      type: "manual",
      message: "Dont Forget Your Username Should Be Cool!"
    });
  }, [setError])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("username")} />
      {errors.username && <p>{errors.username.message}</p>}

      <input type="submit" />
    </form>
  );
};
```

### Multiple Error Example

```
import * as React from "react";
import { useForm } from "react-hook-form";

type FormInputs = {
  username: string;
  firstName: string;
};

const App = () => {
  const { register, handleSubmit, setError, formState: { errors } } = useForm<FormInputs>();

  const onSubmit = (data: FormInputs) => {
    console.log(data)
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>Username</label>
      <input {...register("username")} />
      {errors.username && <p>{errors.username.message}</p>}
      <label>First Name</label>
      <input {...register("firstName")} />
      {errors.firstName && <p>{errors.firstName.message}</p>}
      <button
        type="button"
        onClick={() => {
          [
            {
              type: "manual",
              name: "username",
              message: "Double Check This"
            },
            {
              type: "manual",
              name: "firstName",
              message: "Triple Check This"
            }
          ].forEach(({ name, type, message }) =>
            setError(name, { type, message })
          );
        }}
      >
        Trigger Name Errors
      </button>
      <input type="submit" />
    </form>
  );
};
```

### Single Field Error Example

```
import * as React from "react";
import { useForm } from "react-hook-form";

type FormInputs = {
  lastName: string;
};

const App = () => {
  const { register, handleSubmit, setError, formState: { errors } } = useForm<FormInputs>({
    criteriaMode: 'all',
  });

  const onSubmit = (data: FormInputs) => console.log(data);

  React.useEffect(() => {
    setError("lastName", {
      types: {
        required: "This is required",
        minLength: "This is minLength"
      }
    });
  }, [setValue])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>Last Name</label>
      <input {...register("lastName")} />
      {errors.lastName && errors.lastName.types && (
        <p>{errors.lastName.types.required}</p>
      )}
      {errors.lastName && errors.lastName.types && (
        <p>{errors.lastName.types.minLength}</p>
      )}
      <input type="submit" />
    </form>
  );
};
```

> Video Example: https://youtu.be/raMqvE0YyIY

---

> ### clearErrors

- This function can manually clear errors in the form.

| Props | Type                                | Description |
| ----- | ----------------------------------- | ----------- |
| name  | string `or` string[] `or` undefined | input name  |

### Example

```
import * as React from "react";
import { useForm } from "react-hook-form";

type FormInputs = {
  firstName: string;
  lastName: string;
  username: string;
};

const App = () => {
  const { register, formState: { errors }, handleSubmit, clearErrors } = useForm<FormInputs>();

  const onSubmit = (data: FormInputs) => {
    console.log(data)
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('firstName', { required: true })} />
      <input {...register('lastName', { required: true })} />
      <input {...register('username', { required: true })} />
      <button type="button" onClick={() => clearErrors("firstName")}>
        Clear First Name Errors
      </button>
      <button
        type="button"
        onClick={() => clearErrors(["firstName", "lastName"])}
      >
        Clear First and Last Name Errors
      </button>
      <button type="button" onClick={() => clearErrors()}>
        Clear All Errors
      </button>
      <input type="submit" />
    </form>
  );
};
```

---

> ### setValue

- This function allows you to dynamically set the value of a registered field and have the options to validate and update the form state. At the same time, it tries to avoid unnecessary rerender.

| Props   | inside Options | Type    | Description                                                                                              | Example                                             |
| ------- | -------------- | ------- | -------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| name    | -              | string  | Target a single field by name.                                                                           | replace([{data: 'test'}])                           |
| value   | -              | unknown | The value for the field. This argument is required and can not be undefined                              |
| options | shouldValidate | boolean | Whether to compute if your input is valid or not (subscribed to errors)                                  | setValue('name', 'value', { shouldValidate: true }) |
| options | shouldDirty    | boolean | Whether to compute if your input is dirty or not against your defaultValues (subscribed to dirtyFields). | setValue('name', 'value', { shouldDirty: true })    |
| options | shouldTouch    | boolean | Whether to set the input itself to be touched.                                                           | setValue('name', 'value', { shouldTouch: true })    |

### Example

```
import { useForm } from "react-hook-form";

const App = () => {
  const { register, setValue } = useForm({
    firstName: ''
  });

  return (
    <form>
      <input {...register("firstName", { required: true })} />
      <button onClick={() => setValue("firstName", "Bill")}>
        setValue
      </button>
      <button
        onClick={() =>
          setValue("firstName", "Luo", {
            shouldValidate: true,
            shouldDirty: true
          })
        }
      >
        setValue options
      </button>
    </form>
  );
};
```

> Video Example: https://youtu.be/qpv51sCH3fI

---

> ### setFocus

- This method will allow users to programmatically focus on input. Make sure input's ref is registered into the hook form.

| Props   | inside Options | Type    | Description                                   | Example                                                                  |
| ------- | -------------- | ------- | --------------------------------------------- | ------------------------------------------------------------------------ |
| name    |                | string  | A input field name to focus                   | -                                                                        |
| options | shouldSelect   | boolean | Whether to select the input content on focus. | const { setFocus } = useForm(); setFocus("name", { shouldSelect: true }) |

### Example

```
import * as React from "react";
import { useForm } from "./src";

type FormValues = {
  firstName: string;
};

export default function App() {
  const { register, handleSubmit, setFocus } = useForm<FormValues>();
  const onSubmit = (data: FormValues) => console.log(data);
  renderCount++;

  React.useEffect(() => {
    setFocus("firstName");
  }, [setFocus]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("firstName")} placeholder="First Name" />
      <input type="submit" />
    </form>
  );
}
```

---

> ### getValues

- An optimized helper for reading form values. The difference between watch and getValues is that getValues will not trigger re-renders or subscribe to input changes.

### Example

```
import React from "react";
import { useForm } from "react-hook-form";

type FormInputs = {
  test: string
  test1: string
}

export default function App() {
  const { register, getValues } = useForm<FormInputs>();

  return (
    <form>
      <input {...register("test")} />
      <input {...register("test1")} />

      <button
        type="button"
        onClick={() => {
          const values = getValues(); // { test: "test-input", test1: "test1-input" }
          const singleValue = getValues("test"); // "test-input"
          const multipleValues = getValues(["test", "test1"]);
          // ["test-input", "test1-input"]
        }}
      >
        Get Values
      </button>
    </form>
  );
}
```

---

> ### getFieldState

- This method is introduced in react-hook-form (v7.25.0) to return individual field state. It's useful in case you are trying to retrieve nested field state in a typesafe way.

| Props     | Type   | Description                                     |
| --------- | ------ | ----------------------------------------------- |
| name      | string | registered field name.                          |
| formState | object | When set to true, field error will be retained. |

### Return

| Props     | Type      | Description                                |
| --------- | --------- | ------------------------------------------ | ------------------- |
| isDirty   | boolean   | field is modified.                         |
| isTouched | boolean   | field has received a focus and blur event. |
| invalid   | boolean   | field is not valid.                        |
| error     | undefined | FieldError                                 | field error object. |

### Example

```
import * as React from "react";
import { useForm } from "react-hook-form";

export default function App() {
  const {
    register,
    getFieldState,
    formState: { isDirty, isValid }
  } = useForm({
    mode: "onChange",
    defaultValues: {
      firstName: ""
    }
  });

  // you can invoke before render or within the render function
  const fieldState = getFieldState("firstName");

  return (
    <form>
      <input {...register("firstName", { required: true })} />
      <p>{getFieldState("firstName").isDirty && "dirty"}</p>
      <p>{getFieldState("firstName").isTouched && "touched"}</p>
      <button type="button" onClick={() => console.log(getFieldState("firstName"))}>
        field state
      </button>
    </form>
  );
}
```

---

> ### trigger

- Manually triggers form or input validation. This method is also useful when you have dependant validation (input validation depends on another input's value).

| Props       | Type      | Description                                                                                                                                             |
| ----------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| name        | undefined | Triggers validation on all fields.                                                                                                                      |
| name        | string    | Triggers validation on a specific field value by name                                                                                                   |
| name        | string[]  | triggers validation on multiple fields by name.                                                                                                         |
| shouldFocus | boolean   | Should focus the input during setting an error. This only works when the input's reference is registered, it will not work for custom register as well. |

### Example

```
import React from "react";
import { useForm } from "react-hook-form";

type FormInputs = {
  firstName: string
  lastName: string
}

export default function App() {
  const { register, trigger, formState: { errors } } = useForm<FormInputs>();

  return (
    <form>
      <input {...register("firstName", { required: true })} />
      <input {...register("lastName", { required: true })} />
      <button type="button" onClick={() => { trigger("lastName"); }}>Trigger</button>
      <button type="button" onClick={() => { trigger(["firstName", "lastName"]); }}>Trigger Multiple</button>
      <button type="button" onClick={() => { trigger(); }}>Trigger All</button>
    </form>
  );
}
```

> Video Example: https://youtu.be/-bcyJCDjksE

---

> ### control

- This object contains methods for registering components into React Hook Form.

### Example

```
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField } from "@material-ui/core";

type FormInputs = {
  firstName: string
}

function App() {
  const { control, handleSubmit } = useForm<FormInputs>();
  const onSubmit = (data: FormInputs) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        as={TextField}
        name="firstName"
        control={control}
        defaultValue=""
      />

      <input type="submit" />
    </form>
  );
}
```

---

### useController Hooks

- This custom hook powers Controller. Additionally, it shares the same props and methods as Controller. It's useful for creating reusable Controlled input.

| Props            | Type            | Description                                                                                                                   |
| ---------------- | --------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| name             | FieldPath       | Unique name of your input.                                                                                                    |
| control          | Control         | control object provided by invoking useForm. Optional when using FormProvider.                                                |
| defaultValue     | unknown         | Can not apply undefined to defaultValue or defaultValues at useForm.                                                          |
| rules            | object          | Validation rules in the same format for register, which includes: required, min, max, minLength, maxLength, pattern, validate |
| shouldUnregister | boolean = false | Input will be unregistered after unmount and defaultValues will be removed as well.                                           |

> ### Return
>
> | Object Name | Name               | Type                 | Description                                                                                                                                                |
> | ----------- | ------------------ | -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
> | field       | onChange           | (value: any) => void | A function which sends the input's value to the library.                                                                                                   |
> |             | onBlur             | () => void           | A function which sends the input's onBlur event to the library. It should be assigned to the input's onBlur prop.                                          |
> |             | value              | unknown              | The current value of the controlled component.                                                                                                             |
> |             | name               | string               | Input's name being registered                                                                                                                              |
> |             | ref                | React.Ref            | A ref used to connect hook form to the input. Assign ref to component's input ref to allow hook form to focus the error input.                             |
> | fieldState  | invalid            | boolean              | Invalid state for current input.                                                                                                                           |
> |             | isTouched          | boolean              | Touched state for current controlled input.                                                                                                                |
> |             | isDirty            | boolean              | Dirty state for current controlled input.                                                                                                                  |
> |             | error              | object               | error for this specific input.                                                                                                                             |
> | formState   | isDirty            | boolean              | Set to true after the user modifies any of the inputs.                                                                                                     |
> |             | dirtyFields        | object               | An object with the user-modified fields. Make sure to provide all inputs' defaultValues via useForm, so the library can compare against the defaultValues. |
> |             | touchedFields      | object               | An object containing all the inputs the user has interacted with.                                                                                          |
> |             | isSubmitted        | boolean              | Set to true after the form is submitted. Will remain true until the reset method is invoked.                                                               |
> |             | isSubmitSuccessful | boolean              | Indicate the form was successfully submitted without any Promise rejection or Error been thrown within the handleSubmit callback.                          |
> |             | isSubmitting       | boolean              | true if the form is currently being submitted. false otherwise.                                                                                            |
> |             | submitCount        | number               | Number of times the form was submitted.                                                                                                                    |
> |             | isValid            | boolean              | Set to true if the form doesn't have any errors.                                                                                                           |
> |             | isValidating       | boolean              | Set to true during validation.                                                                                                                             |
> |             | errors             | object               | An object with field errors. There is also an ErrorMessage component to retrieve error message easily.                                                     |

### Example

```
import * as React from "react";
import { useForm, useController, UseControllerProps } from "react-hook-form";

type FormValues = {
  FirstName: string;
};

function Input(props: UseControllerProps<FormValues>) {
  const { field, fieldState } = useController(props);

  return (
    <div>
      <input {...field} placeholder={props.name} />
      <p>{fieldState.isTouched && "Touched"}</p>
      <p>{fieldState.isDirty && "Dirty"}</p>
      <p>{fieldState.invalid ? "invalid" : "valid"}</p>
    </div>
  );
}

export default function App() {
  const { handleSubmit, control } = useForm<FormValues>({
    defaultValues: {
      FirstName: ""
    },
    mode: "onChange"
  });
  const onSubmit = (data: FormValues) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input control={control} name="FirstName" rules={{ required: true }} />
      <input type="submit" />
    </form>
  );
}
```

> Video Example: https://youtu.be/N2UNk_UCVyA

---

### useFormContext

- This custom hook allows you to access the form context. useFormContext is intended to be used in deeply nested structures, where it would become inconvenient to pass the context as a prop.

```
import React from "react";
import { useForm, FormProvider, useFormContext } from "react-hook-form";

export default function App() {
  const methods = useForm();
  const onSubmit = data => console.log(data);

  return (
    <FormProvider {...methods} > // pass all methods into the context
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <NestedInput />
        <input type="submit" />
      </form>
    </FormProvider>
  );
}

function NestedInput() {
  const { register } = useFormContext(); // retrieve all hook methods
  return <input {...register("test")} />;
}
```

---

### useWatch

- Behaves similarly to the watch API, however, this will isolate re-rendering at the custom hook level and potentially result in better performance for your application.

| Props        | Type                                | Description                                                                     |
| ------------ | ----------------------------------- | ------------------------------------------------------------------------------- |
| name         | string `or` string[] `or` undefined | Name of the field.                                                              |
| control      | object                              | control object provided by useForm. It's optional if you are using FormContext. |
| defaultValue | unknown                             | default value for useWatch to return before the initial render.                 |
| disabled     | boolean = false                     | Option to disable the subscription.                                             |
| exact        | boolean = false                     | This prop will enable an exact match for input name subscriptions.              |

### Example

```
import React from "react";
import { useForm, useWatch } from "react-hook-form";

interface FormInputs {
  firstName: string;
  lastName: string;
}

function FirstNameWatched({ control }: { control: Control<FormInputs> }) {
  const firstName = useWatch({
    control,
    name: "firstName", // without supply name will watch the entire form, or ['firstName', 'lastName'] to watch both
    defaultValue: "default" // default value before the render
  });

  return <p>Watch: {firstName}</p>; // only re-render at the custom hook level, when firstName changes
}

function App() {
  const { register, control, handleSubmit } = useForm<FormInputs>();

  const onSubmit = (data: FormInputs) => {
    console.log(data)
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>First Name:</label>
      <input {...register("firstName")} />
      <input {...register("lastName")} />
      <input type="submit" />

      <FirstNameWatched control={control} />
    </form>
  );
}
```

---

### useFormState

- This custom hook allows you to subscribe to each form state, and isolate the re-render at the custom hook level. It has its scope in terms of form state subscription, so it would not affect other useFormState and useForm. Using this hook can reduce the re-render impact on large and complex form application.

| Props    | Type                 | Description                                                                                  |
| -------- | -------------------- | -------------------------------------------------------------------------------------------- |
| control  | object               | control object provided by useForm. It's optional if you are using FormContext.              |
| name     | string `or` string[] | Provide a single input name, an array of them, or subscribe to all inputs' formState update. |
| disabled | boolean = false      | Option to disable the subscription.                                                          |
| exact    | boolean = false      | This prop will enable an exact match for input name subscriptions.                           |

> ### Return

| name               | Type    | Description                                                                                                                                               |
| ------------------ | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| isDirty            | boolean | Set to true after the user modifies any of the inputs.                                                                                                    |
| dirtyFields        | object  | An object with the user-modified fields. Make sure to provide all inputs' defaultValues via useForm, so the library can compare against the defaultValues |
| touchedFields      | object  | An object containing all the inputs the user has interacted with.                                                                                         |
| isSubmitted        | boolean | Set to true after the form is submitted. Will remain true until the reset method is invoked                                                               |
| isSubmitSuccessful | boolean | Indicate the form was successfully submitted without any Promise rejection or Error been thrown within the handleSubmit callback.                         |
| isSubmitting       | boolean | true if the form is currently being submitted. false otherwise.                                                                                           |
| submitCount        | number  | Number of times the form was submitted.                                                                                                                   |
| isValid            | boolean | Set to true if the form doesn't have any errors.                                                                                                          |
| isValidating       | boolean | Set to true during validation.                                                                                                                            |
| errors             | object  | An object with field errors. There is also an ErrorMessage component to retrieve error message easily.                                                    |
|                    |

### Example

```
import * as React from "react";
import { useForm, useFormState } from "react-hook-form";

export default function App() {
 const { register, handleSubmit, control } = useForm({
   defaultValues: {
     firstName: "firstName"
   }
 });
 const { dirtyFields } = useFormState({
   control
 });
 const onSubmit = (data) => console.log(data);

 return (
   <form onSubmit={handleSubmit(onSubmit)}>
     <input {...register("firstName")} placeholder="First Name" />
     {dirtyFields.firstName && <p>Field is dirty.</p>}

     <input type="submit" />
   </form>
 );
}
```

---

### ErrorMessage

- A simple component to render associated input's error message.

```
$ npm install @hookform/error-message
```

| Props   | Type                           | Description                                                                 |
| ------- | ------------------------------ | --------------------------------------------------------------------------- | -------------------------------------------------------------- |
| name    | string                         | Name of the field.                                                          |
| errors  | object                         | errors object from React Hook Form. Optional if you are using FormProvider. |
| message | string `or` React.ReactElement | inline erroe message                                                        |
| as      | React.ElementType `or` string  | Wrapper component or HTML tag. For example: as="span" or as={<Text />}      |
| render  | ({ message: string             | React.ReactElement, messages?: Object}) => any                              | This is a render prop for rendering error message or messages. |

### Example

```
import React from "react";
import { useForm } from "react-hook-form";
import { ErrorMessage } from '@hookform/error-message';

interface FormInputs {
  singleErrorInput: string
}

export default function App() {
  const { register, formState: { errors }, handleSubmit } = useForm<FormInputs>();
  const onSubmit = (data: FormInputs) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("singleErrorInput", { required: "This is required." })} />
      <ErrorMessage errors={errors} name="singleErrorInput" />

      <ErrorMessage
        errors={errors}
        name="singleErrorInput"
        render={({ message }) => <p>{message}</p>}
      />

      <input type="submit" />
    </form>
  );
}
```

---

### useFieldArray

- Custom hook for working with Field Arrays (dynamic form). The motivation is to provide better user experience and performance. You can watch this short video to visualize the performance enhancement.

| Props            | Type        | Description                                                                                                                                              |
| ---------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| name             | string      | Name of the field array.                                                                                                                                 |
| control          | object      | control object provided by useForm. It's optional if you are using FormContext.                                                                          |
| shouldUnregister | boolean     | Whether Field Array will be unregistered after unmount.                                                                                                  |
| keyName          | string = id | Name of the attribut with autogenerated identifier to use as the key prop. This prop is no longer required and will be removed in the next major version |

### Return

| Name    | Type                                                               | Description                                                                                                        |
| ------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| fields  | object & { id: string }                                            | This object contains the defaultValue and key for your component.                                                  |
| append  | (obj: object `or` object[], focusOptions) => void                  | Append input/inputs to the end of your fields and focus. The input value will be registered during this action.    |
| prepend | (obj: object `or` object[], focusOptions) => void                  | Prepend input/inputs to the start of your fields and focus. The input value will be registered during this action. |
| insert  | (index: number, value: object `or` object[], focusOptions) => void | Insert input/inputs at particular position and focus.                                                              |
| swap    | (from: number, to: number) => void                                 | Swap input/inputs position.                                                                                        |
| move    | (from: number, to: number) => void                                 | Move input/inputs to another position.                                                                             |
| update  | (index: number, obj: object) => void                               | Update input/inputs at particular position.                                                                        |
| replace | (obj: object[]) => void                                            | Replace the entire field array values.                                                                             |
| remove  | (index?: number `or` number[]) => void                             | Remove input/inputs at particular position, or remove all when no index provided.                                  |

### Example

```

import * as React from "react";
import { useForm, useFieldArray, useWatch, Control } from "react-hook-form";

type FormValues = {
  cart: {
    name: string;
    price: number;
    quantity: number;
  }[];
};

const Total = ({ control }: { control: Control<FormValues> }) => {
  const formValues = useWatch({
    name: "cart",
    control
  });
  const total = formValues.reduce(
    (acc, current) => acc + (current.price || 0) * (current.quantity || 0),
    0
  );
  return <p>Total Amount: {total}</p>;
};

export default function App() {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({
    defaultValues: {
      cart: [{ name: "test", quantity: 1, price: 23 }]
    },
    mode: "onBlur"
  });
  const { fields, append, remove } = useFieldArray({
    name: "cart",
    control
  });
  const onSubmit = (data: FormValues) => console.log(data);

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        {fields.map((field, index) => {
          return (
            <div key={field.id}>
              <section className={"section"} key={field.id}>
                <input
                  placeholder="name"
                  {...register(`cart.${index}.name` as const, {
                    required: true
                  })}
                  className={errors?.cart?.[index]?.name ? "error" : ""}
                />
                <input
                  placeholder="quantity"
                  type="number"
                  {...register(`cart.${index}.quantity` as const, {
                    valueAsNumber: true,
                    required: true
                  })}
                  className={errors?.cart?.[index]?.quantity ? "error" : ""}
                />
                <input
                  placeholder="value"
                  type="number"
                  {...register(`cart.${index}.price` as const, {
                    valueAsNumber: true,
                    required: true
                  })}
                  className={errors?.cart?.[index]?.price ? "error" : ""}
                />
                <button type="button" onClick={() => remove(index)}>
                  DELETE
                </button>
              </section>
            </div>
          );
        })}

        <Total control={control} />

        <button
          type="button"
          onClick={() =>
            append({
              name: "",
              quantity: 0,
              price: 0
            })
          }
        >
          APPEND
        </button>
        <input type="submit" />
      </form>
    </div>
  );
}

```

---

## YUP Schema

- We also support schema-based form validation with Yup, Zod , Superstruct & Joi, where you can pass your schema to useForm as an optional config. It will validate your input data against the schema and return with either errors or a valid result.

> Step 1: Install Yup into your project.

```
$ npm install @hookform/resolvers yup
```

> Step 2: Prepare your schema for validation and register inputs with React Hook Form.

```
import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

interface IFormInputs {
  firstName: string
  age: number
}

const schema = yup.object({
  firstName: yup.string().required(),
  age: yup.number().positive().integer().required(),
}).required();

export default function App() {
  const { register, handleSubmit, formState: { errors } } = useForm<IFormInputs>({
    resolver: yupResolver(schema)
  });
  const onSubmit = (data: IFormInputs) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("firstName")} />
      <p>{errors.firstName?.message}</p>

      <input {...register("age")} />
      <p>{errors.age?.message}</p>

      <input type="submit" />
    </form>
  );
}
```

---

### Snapshot

![React Hook Form](https://dev.azure.com/BrainvireInfo/9e43166a-9cd3-4232-8a59-017698f26e78/_apis/git/repositories/9b507252-6292-49a7-b0b5-3bc86fc9d32d/items?path=/Form%20Handling/react-hook-form-reactjs/Application%20Snapshot/react-hook-form-reactjs.png&versionDescriptor%5BversionOptions%5D=0&versionDescriptor%5BversionType%5D=0&versionDescriptor%5Bversion%5D=feature/folder-structure&resolveLfs=true&%24format=octetStream&api-version=5.0)

> Officail Documentation link: https://react-hook-form.com/get-started#IntegratingwithUIlibraries

> Examples Link: https://github.com/react-hook-form/react-hook-form/tree/master/examples
