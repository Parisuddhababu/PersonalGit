### Props Defination
| Props | Type | Required or optional |
|--------| ------------| ---------- |
| action | ReactNode | optional
| title | string | required
| subTitle | string | optional
| icon | ReactNode | optional


### Components

```
import { Box, Typography, Stack } from "@helo/ui";
import { ReactNode } from "react";

interface NoDataAvailableProps {
  action?: ReactNode;
  title: string;
  subTitle?: string;
  icon?: ReactNode;
}

const NoDataAvailable = ({
  action,
  title,
  subTitle,
  icon,
}: NoDataAvailableProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Stack spacing={2} justifyContent="center" alignItems="center">
        <Typography sx={{ m: 2 }} component="div">
          {icon}
        </Typography>
        <Typography sx={{ m: 2 }} variant="h3" component="div">
          {title}
        </Typography>
        <Typography sx={{ m: 2 }} component="div">
          {subTitle}
        </Typography>
        <Typography component="div">{action}</Typography>
      </Stack>
    </Box>
  );
};

export default NoDataAvailable;
```

### Output Structure
```
<NoDataAvailable 
  title="Brainvire" 
  subTitle="info Tech"
  icon={<i class="fa fa-dashboard"></i>}
  action={
    <button type="submit">
      Save
    </button>
    <button type="button">
      Cancel
    </button>
  }
/>
```