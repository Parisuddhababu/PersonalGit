import React, { useState, useEffect, useCallback } from 'react';
import * as Yup from 'yup';
import { MenuItem, TextField } from '@mui/material';
import { Field } from 'formik';
import { validationMessages } from '../../constants';
import statesAndProvinces from './statesAndProvinces';

const StateOrProvince = ({
  onChange,
  onBlur,
  countrycode,
  name,
  ...props
}: any) => {
  const { label = 'State or Province' } = props;
  // eslint-disable-next-line
  const validate = useCallback(
    async (value: string) => {
      const validationSchema = Yup.string()
        .required(validationMessages(label).isRequired)
        .max(50, validationMessages(label, '50').maximumCharacter);

      try {
        await validationSchema.validate(value);
      } catch (err: any) {
        return err.message;
      }
    },
    [label]
  );

  const [provinceOptions, setProvinceOptions] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const countryCode = countrycode === 'CA' ? 'CA' : 'US';
    const provinces = statesAndProvinces[countryCode];
    const menuItems = provinces.map((province) => {
      return (
        <MenuItem value={province.code} key={province.code}>
          {province.name}
        </MenuItem>
      );
    });
    setProvinceOptions(menuItems);
  }, [countrycode]);

  return (
    <Field validate={validate} name={name} onBlur={onBlur} onChange={onChange}>
      {({ field, meta }: any) => {
        return (
          <TextField
            required
            fullWidth
            select
            defaultValue=''
            onBlur={onBlur}
            onChange={onChange}
            helperText={meta.touched && meta.error}
            name={field.name}
            label={label}
            error={!!(meta.touched && meta.error)}
            {...props}
          >
            {provinceOptions}
          </TextField>
        );
      }}
    </Field>
  );
};

export default StateOrProvince;
