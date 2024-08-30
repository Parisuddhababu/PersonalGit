import * as Yup from 'yup';
import { TextField, MenuItem } from '@mui/material';
import { Field } from 'formik';
import { validationMessages } from '../../constants';
import { useCallback } from 'react';

const Country = ({
  onChange,
  onBlur,
  label = 'Country',
  name,
  ...rest
}: any) => {
  // eslint-disable-next-line
  const validate = useCallback(
    async (value: string) => {
      const validationSchema = Yup.string().required(
        validationMessages(label).isRequired
      );
      try {
        await validationSchema.validate(value);
      } catch (err: any) {
        return err.message;
      }
    },
    [label]
  );

  return (
    <Field name={name} validate={validate} onBlur={onBlur} onChange={onChange}>
      {({ field, meta }: any) => {
        return (
          <TextField
            required
            fullWidth
            label={label}
            select
            name={field.name}
            onBlur={onBlur}
            onChange={onChange}
            helperText={meta.touched && meta.error}
            error={!!(meta.touched && meta.error)}
            {...rest}
          >
            <MenuItem value='IND' key='IND'>
              India
            </MenuItem>
            <MenuItem value='CA' key='CA'>
              Canada
            </MenuItem>
            <MenuItem value='US' key='US'>
              United States
            </MenuItem>
          </TextField>
        );
      }}
    </Field>
  );
};

export default Country;
