### Props Defination
| Props | Type | Required or optional |
|--------| ------------| ---------- |
| message | string | required


### Components

```
import toast from "react-hot-toast";

export interface ErrorMessage {
  message: string;
}

export const ErrorMessage = (
  message: ErrorMessage,
): void => {
    toast.error(`${message}`);
};
```
### Calling Component
```
return ErrorMessage("Something went wrong. Please try again");
```

### Output Structure
```
In Toaster Display: Something went wrong. Please try again
```