import { Cvadd, Cvclose, Cvdropdown, Cvsearch } from '../icons/icons';
import {
  Autocomplete,
  AutocompleteRenderGetTagProps,
  AutocompleteRenderInputParams,
  Chip,
  Fab,
  Grid,
  InputLabel,
  Stack,
  TextField,
} from '@mui/material';
import React, { useCallback, useState } from 'react';
import './autoCompleteWithAdd.scss';

export interface IOption {
  uuid: string;
  title: string;
}
interface IAutoCompleteProps {
  id: string;
  placeholder: string;
  labelTitle?: string;
  autocompleteList: IOption[];
  selectedOptions: IOption[];
  removeAutocompleteOption: (uuid: string) => void;
  handleAutocompleteChange: (
    event: React.SyntheticEvent,
    values: (IOption | string)[],
    reason: string
  ) => void;
  addNewValue: (val: string) => void;
  disabled?: boolean;
}
interface ICustomChipsProps {
  value: IOption;
  getTagProps: AutocompleteRenderGetTagProps;
  removeAutocompleteOption: (value: string) => void;
  index: number;
}

const CustomChips = ({
  value,
  index,
  removeAutocompleteOption,
  getTagProps,
}: ICustomChipsProps) => {
  const handleOnRemove = useCallback(() => {
    removeAutocompleteOption(value?.title);
  }, [value?.title, removeAutocompleteOption, index]);
  return (
    <Chip
      variant='filled'
      label={value?.title}
      {...getTagProps({ index })}
      deleteIcon={<Cvclose />}
      color='primary'
      onDelete={handleOnRemove}
    />
  );
};

const AutoCompleteWithAdd = ({
  id,
  placeholder,
  labelTitle = '',
  autocompleteList,
  selectedOptions,
  removeAutocompleteOption,
  handleAutocompleteChange,
  addNewValue,
  disabled,
}: IAutoCompleteProps) => {
  const [isShowAddButton, showAddButton] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const addingNewData = (newInputValue: string) => {
    setInputValue(newInputValue);
    let matchCount = 0;
    if (newInputValue.length > 1) {
      selectedOptions.forEach((skill) => {
        const currentTitle = skill?.title.toLowerCase();
        if (currentTitle.includes(newInputValue.toLowerCase())) {
          matchCount++;
        }
      });
    }
    if (selectedOptions.length < 1 || newInputValue.length > 1) {
      showAddButton(true);
    }
    matchCount > 0 ? showAddButton(false) : showAddButton(true);
  };

  const handleAdd = useCallback(() => {
    addNewValue(inputValue);
    setInputValue('');
  }, [inputValue]);

  return (
    <Grid
      container
      spacing={{ xs: '10px', xl: '15px' }}
      alignItems='end'
      width={'100%'}
    >
      <Grid item width={'100%'}>
        <Autocomplete
          fullWidth
          disabled={disabled}
          multiple
          className='search-skill'
          id={id}
          options={autocompleteList}
          disableClearable
          popupIcon={<Cvdropdown />}
          getOptionLabel={useCallback((option: string | IOption) => {
            if (typeof option === 'string') {
              return option;
            }
            return option?.title;
          }, [])}
          value={selectedOptions}
          filterSelectedOptions
          freeSolo
          renderTags={useCallback(
            (
              values: readonly IOption[],
              getTagProps: AutocompleteRenderGetTagProps
            ) => (
              <Stack flexDirection='row' flexWrap='wrap'>
                {values &&
                  values?.length > 0 &&
                  values?.map((value: IOption, index: number) => (
                    <div key={value.uuid}>
                      {/* <Chip
                        variant="filled"
                        label={value?.title}
                        {...getTagProps({ index })}
                        deleteIcon={<Cvclose />}
                        color="primary"
                        onDelete={() => removeAutocompleteOption(value?.title)}
                      /> */}
                      <CustomChips
                        index={index}
                        removeAutocompleteOption={removeAutocompleteOption}
                        value={value}
                        getTagProps={getTagProps}
                      />
                    </div>
                  ))}
              </Stack>
            ),
            [removeAutocompleteOption]
          )}
          renderOption={useCallback(
            (props: React.HTMLAttributes<HTMLLIElement>, option: IOption) => (
              <li {...props} key={option.uuid}>
                {option.title}
              </li>
            ),
            []
          )}
          onChange={handleAutocompleteChange}
          inputValue={inputValue}
          onInputChange={useCallback(
            (event: React.SyntheticEvent, value: string) => {
              addingNewData(value);
            },
            []
          )}
          renderInput={useCallback(
            (params: AutocompleteRenderInputParams) => (
              <>
                {labelTitle && (
                  <InputLabel htmlFor='outlined-adornment-weight'>
                    {labelTitle}
                  </InputLabel>
                )}
                <TextField {...params} fullWidth placeholder={placeholder} />
                <Cvsearch className='search-icon' />
              </>
            ),
            []
          )}
        />
      </Grid>
      {isShowAddButton && inputValue.length > 0 && (
        <Grid item>
          <Fab
            color='primary'
            aria-label='add'
            variant='extended'
            sx={{ borderRadius: '10px', boxShadow: 'none' }}
            onClick={handleAdd}
          >
            <Cvadd />
          </Fab>
        </Grid>
      )}
    </Grid>
  );
};

export default AutoCompleteWithAdd;
