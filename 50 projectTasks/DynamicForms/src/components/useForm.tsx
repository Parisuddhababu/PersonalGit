import React, { useState } from "react";
import {
  Button,
  RadioGroup,
  TextField,
  Grid,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  FormControlLabel,
  FormLabel,
  Radio,
  Checkbox,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import FormData from "./forms.json";
import { useForm } from "react-hook-form";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import PasswordChecklist from "react-password-checklist";
interface FormValues {
  text: string;
  number: number;
  email: string;
  password: string;
  date: string;
  time: string;
  phone: string;
  search: string;
  file: string;
  url: string;
  color: string;
  select: string;
  range: number;
  radio: string;
  checkbox: boolean;
}

const UseForm = () => {
  const [range, setRange] = useState(1);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [value, setValue] = useState("");
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };
  const { register, handleSubmit, formState, reset, resetField } = useForm<
    FormValues
  >({
    mode: "all",
    defaultValues: { select: "" },
  });

  const { errors } = formState;
  const [checked, setChecked] = React.useState(false);
  const [age, setAge] = React.useState<string>(" ");
  const [open, setOpen] = React.useState(false);

  const selectHandleChange = (event: SelectChangeEvent<typeof age>) => {
    setAge(event.target.value);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  /*submit form */
  const submitHandler = (e: FormValues) => {
    if (age === "" || checked === false) {
      setAge("");
    } else {
      console.log(e);
      alert("Data submitted Successfully");
      setAge("");
      setOpen(false);
      setValue("");
      setChecked(false);
      setRange(0);
      reset();
      setPassword("");
      resetField("select");
    }
  };
  return (
    <form
      noValidate
      onSubmit={(...args) => void handleSubmit(submitHandler)(...args)}
    >
      <h2 style={{ color: "blue", textAlign: "center" }}>UseForm</h2>
      <div style={{ marginLeft: 500 }}>
        {FormData.formTypes.map((item) => {
          switch (item.type) {
            /*text*/
            case "text":
              return (
                <Grid item xs={2} sm={4} md={4} key={item.id}>
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    style={{ width: 335 }}
                    label={item.label}
                    type={item.type}
                    {...register("text", {
                      required: {
                        value: true,
                        message: `${item.label} is required`,
                      },
                      validate: {
                        alphabets: (value) => isNaN(+value),
                        matchPattern: (v) =>
                          /^[a-zA-Z ]*$/.test(v) ||
                          "Please Enter only alphabets",
                      },
                      maxLength: {
                        value: 10,
                        message: `${item.label} should not exceed 10 alphabets`,
                      },
                    })}
                  />
                  <p style={{ color: "red" }}>{errors.text?.message}</p>
                  {errors.text?.type === "alphabets" && (
                    <p style={{ color: "red" }}>
                      {item.label} must be in alphabetical
                    </p>
                  )}
                </Grid>
              );

            /*Number*/
            case "number":
              return (
                <Grid item xs={2} sm={4} md={4} key={item.id}>
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    style={{ width: 335 }}
                    label={item.label}
                    type={item.type}
                    placeholder="enter your age"
                    {...register("number", {
                      required: {
                        value: true,
                        message: `${item.label} is required`,
                      },
                      validate: {
                        age: (value) => +value > 0 && +value < 100,
                      },
                      maxLength: {
                        value: 2,
                        message: `${item.label} should be less than 100`,
                      },
                    })}
                  />

                  <p style={{ color: "red" }}>{errors.number?.message}</p>
                  {errors.number?.type === "age" && (
                    <p style={{ color: "red" }}>
                      {item.label} must be between(1-100) in number.
                    </p>
                  )}
                </Grid>
              );
            /*Email*/
            case "email":
              return (
                <Grid item xs={2} sm={4} md={4} key={item.id}>
                  <TextField
                    id="outlined-basic"
                    variant="outlined"
                    style={{ width: 335 }}
                    label={item.label}
                    type={item.type}
                    {...register("email", {
                      required: {
                        value: true,
                        message: `${item.label} is required`,
                      },
                      validate: {
                        matchPattern: (v) =>
                          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,5})+$/.test(
                            v
                          ) || "Email address must be a valid address",
                      },
                    })}
                  />
                  <p style={{ color: "red" }}>{errors.email?.message}</p>
                </Grid>
              );
            /*Password*/
            case "password":
              return (
                <Grid item xs={2} sm={4} md={4} key={item.id}>
                  <FormControl sx={{ width: 335, marginBottom: 1 }}>
                    <InputLabel htmlFor="outlined-adornment-password">
                      Password
                    </InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-password"
                      placeholder={item.type}
                      type={showPassword ? "text" : "password"}
                      {...register("password", {
                        required: {
                          value: true,
                          message: `${item.label} is required`,
                        },
                        validate: {
                          matchPattern: (value) =>
                            /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,16}$/.test(
                              value
                            ) || "Pleas Enter Strong Password",
                        },
                      })}
                      name={item.type}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="off"
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Password"
                    />
                  </FormControl>
                  {errors.password?.message && (
                    <PasswordChecklist
                      rules={[
                        "minLength",
                        "specialChar",
                        "number",
                        "capital",
                        "lowercase",
                      ]}
                      minLength={8}
                      value={password}
                    />
                  )}
                </Grid>
              );
            /*Date*/
            case "date":
              return (
                <Grid item xs={2} sm={4} md={4} key={item.id}>
                  <p>when will you join</p>
                  <FormControl
                    fullWidth
                    sx={{ width: "25ch", marginBottom: "10px" }}
                  >
                    <TextField
                      id={`${item.id}`}
                      type={item.type}
                      min={`${new Date()}`}
                      autoComplete="off"
                      {...register("date", {
                        required: {
                          value: true,
                          message: `${item.label} is required`,
                        },
                        min: {
                          value: new Date().toISOString().split("T")[0],
                          message: `Past ${item.label} is not valid.Please Select date from Today`,
                        },
                      })}
                    />

                    <p style={{ color: "red" }}>{errors.date?.message}</p>
                  </FormControl>
                </Grid>
              );
            /*time*/
            case "time":
              return (
                <>
                  <p>when will you submit your certificates today</p>
                  <Grid key={item.id} item md={4} style={{ color: "red" }}>
                    <TextField
                      style={{ width: 335 }}
                      type={item.type}
                      id={item.id}
                      {...register("time", {
                        required: {
                          value: true,
                          message: `${item.label} is required *`,
                        },
                        min: {
                          value: new Date().toISOString().split("T")[1],
                          message: `Past ${item.label} is not valid`,
                        },
                      })}
                    />
                    <p>{errors.time?.message}</p>
                  </Grid>
                </>
              );
            /*telephone*/
            case "tel":
              return (
                <Grid key={item.id} item md={4} style={{ color: "red" }}>
                  <TextField
                    style={{ width: 335 }}
                    type={"text"}
                    label={item.label}
                    id={item.id}
                    {...register("phone", {
                      required: {
                        value: true,
                        message: `${item.label} is required *`,
                      },
                      validate: {
                        number: (value) => !isNaN(+value),
                        length: (value) => value.length === 10,
                      },
                    })}
                  />
                  <p>{errors.phone?.message}</p>
                  {errors.phone?.type === "number" && (
                    <p>{item.label} must be only numbers</p>
                  )}
                  {errors.phone?.type === "length" && (
                    <p>{item.label} must be 10 digits only</p>
                  )}
                </Grid>
              );
            /*Search */
            case "search":
              return (
                <Grid key={item.id} item md={4} style={{ color: "red" }}>
                  <TextField
                    style={{ width: 335 }}
                    label={item.label}
                    type={item.type}
                    id={item.id}
                    {...register("search", {
                      required: {
                        value: true,
                        message: `${item.label} something *`,
                      },
                    })}
                  />
                  <p>{errors.search?.message}</p>
                </Grid>
              );
            /*file */
            case "file":
              return (
                <Grid item xs={2} sm={4} md={4} key={item.id}>
                  <FormControl
                    fullWidth
                    sx={{ width: "25ch", marginBottom: "10px" }}
                  >
                    <TextField
                      variant="outlined"
                      id={`${item.id}`}
                      type={item.type}
                      min={`${new Date()}`}
                      autoComplete="off"
                      {...register("file", {
                        required: {
                          value: true,
                          message: `${item.label} is required`,
                        },
                      })}
                    />
                    <p style={{ color: "red" }}>{errors.file?.message}</p>
                  </FormControl>
                </Grid>
              );
            /*url */
            case "url":
              return (
                <Grid item xs={2} sm={4} md={4} key={item.id}>
                  <FormControl
                    fullWidth
                    sx={{ width: "25ch", marginBottom: "10px" }}
                  >
                    <TextField
                      variant="outlined"
                      style={{ width: 335 }}
                      label={item.label}
                      type={item.type}
                      id={item.id}
                      {...register("url", {
                        required: {
                          value: true,
                          message: `${item.label} is required`,
                        },
                        validate: {
                          matchPattern: (v) =>
                            /(https:\/\/[a-z]{2,8}\.[a-zA-Z0-9]{2,})\.[a-z]{2,8}/.test(
                              v
                            ) || "Invalid Url",
                        },
                      })}
                    />

                    <p style={{ color: "red" }}>{errors.url?.message}</p>
                  </FormControl>
                </Grid>
              );
            /*color*/
            case "color":
              return (
                <Grid item xs={2} sm={4} md={4} key={item.id}>
                  <p>Choose Color </p>
                  <FormControl
                    fullWidth
                    sx={{ width: "25ch", marginBottom: "10px" }}
                  >
                    <label htmlFor={item.id}>{item.label}</label>
                    <input
                      type={item.type}
                      id={item.id}
                      {...register("color")}
                    />
                  </FormControl>
                </Grid>
              );
            /*range*/
            case "range":
              return (
                <Grid item xs={2} sm={4} md={4} key={item.id}>
                  <p>Choose Range between 0 to 100</p>
                  <FormControl
                    fullWidth
                    sx={{ width: "25ch", marginBottom: "10px" }}
                  >
                    <label htmlFor={item.id}>{item.label}</label>

                    <input
                      type={item.type}
                      id={item.id}
                      defaultValue="1"
                      max="100"
                      {...register("range", {
                        onChange(e) {
                          setRange(+e.target.value);
                        },
                      })}
                    />

                    <output id="data" name="amount" htmlFor="rangeInput">
                      {range}
                    </output>

                    <p style={{ color: "red" }}>{errors.range?.message}</p>
                  </FormControl>
                </Grid>
              );
            /*radio */
            case "radio":
              return (
                <Grid item xs={2} sm={4} md={4} key={item.id}>
                  <FormControl
                    fullWidth
                    sx={{ width: "25ch", marginBottom: "10px" }}
                  >
                    <FormLabel id="demo-controlled-radio-buttons-group">
                      {item.label}
                    </FormLabel>
                    <RadioGroup
                      aria-labelledby="demo-radio-buttons-group-label"
                      value={value}
                    >
                      {item.options?.map((item) => {
                        return (
                          <>
                            <FormControlLabel
                              id={item.id}
                              value={item.value}
                              control={
                                <Radio
                                  {...register("radio", {
                                    required: {
                                      value: true,
                                      message: "Gender is required*",
                                    },
                                    onChange(event) {
                                      setValue(event.target.value);
                                    },
                                  })}
                                />
                              }
                              label={item.value}
                            />
                          </>
                        );
                      })}
                    </RadioGroup>
                    <p style={{ color: "red" }}>{errors.radio?.message}</p>
                  </FormControl>
                </Grid>
              );
            /*select*/
            case "select":
              return (
                <Grid key={item.id} item md={4} style={{ color: "red" }}>
                  <FormControl sx={{ marginBottom: 1, minWidth: 335 }}>
                    <InputLabel id="demo-controlled-open-select-label">
                      City
                    </InputLabel>
                    <Select
                      aria-placeholder="select city"
                      labelId="demo-controlled-open-select-label"
                      id="select"
                      label="City"
                      value={age}
                      onClose={handleClose}
                      onOpen={handleOpen}
                      open={open}
                      placeholder="select city"
                      {...register("select", {
                        required: {
                          value: true,
                          message: "Please select",
                        },
                        onChange: (e) => {
                          selectHandleChange(e);
                        },
                      })}
                    >
                      <MenuItem disabled selected value="">
                        --select--
                      </MenuItem>
                      {item.options?.map((i) => (
                        <MenuItem key={i.id} value={i.value}>
                          {i.value}
                        </MenuItem>
                      ))}
                    </Select>
                    <p style={{ color: "red" }}>{errors.select?.message}</p>
                  </FormControl>
                </Grid>
              );
            /*checkbox*/
            case "checkbox":
              return (
                <Grid item xs={2} sm={4} md={4} key={item.id}>
                  <FormControl
                    fullWidth
                    sx={{ width: "25ch", marginBottom: "10px" }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={checked}
                          inputProps={{ "aria-label": "controlled" }}
                          {...register("checkbox", {
                            required: {
                              value: true,
                              message: "Please select checkbox",
                            },
                            onChange(event) {
                              setChecked(event.target.checked);
                            },
                          })}
                        />
                      }
                      label=" Terms and conditions"
                    />
                    {<p style={{ color: "red" }}>{errors.checkbox?.message}</p>}
                  </FormControl>
                </Grid>
              );
            /*submit*/
            case "submit":
              return (
                <Grid item xs={2} sm={4} md={4} key={item.id}>
                  <Button variant="outlined" id={item.id} type={item.type}>
                    {item.label}
                  </Button>
                </Grid>
              );
            default:
              return <></>;
          }
        })}
      </div>
    </form>
  );
};

export default UseForm;
