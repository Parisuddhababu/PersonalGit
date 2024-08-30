import { TextField } from '@mui/material';
import { Field } from 'formik';
import { VALIDATIONSECHEMA } from '../../constants';
import { useCallback } from 'react';

const AddressLine1 = ({
  onChange,
  onBlur,
  label = 'Address Line 1',
  name,
  isFor,
  ...rest
}: any) => {
  // eslint-disable-next-line
  const validate = useCallback(
    async (value: string) => {
      const validationSchema = VALIDATIONSECHEMA(isFor, label);
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
            fullWidth
            required
            name={field.name}
            label={label}
            onBlur={onBlur}
            onChange={onChange}
            helperText={meta.touched && meta.error}
            error={!!(meta.touched && meta.error)}
            {...rest}
          />
        );
      }}
    </Field>
  );
};

export default AddressLine1;
