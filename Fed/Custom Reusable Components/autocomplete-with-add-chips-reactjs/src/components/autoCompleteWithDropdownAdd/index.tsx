import { Cvclose, Cvdropdown, Cvsearch } from '../icons/icons';
import {
  Autocomplete,
  AutocompleteChangeDetails,
  AutocompleteRenderGetTagProps,
  AutocompleteRenderInputParams,
  Chip,
  InputLabel,
  Stack,
  TextField,
} from '@mui/material';
import React, { useCallback } from 'react';
import '../autoCompleteWithAdd/autoCompleteWithAdd.scss';

export interface IOrganizationStructuredDropdown {
  companyUuid: string;
  name: string;
  parentUuid: string;
  type?: string;
  grandUuid?: string;
}

interface IAutoCompleteProps {
  id: string;
  placeholder: string;
  labelTitle?: string;
  autocompleteList: IOrganizationStructuredDropdown[];
  selectedOptions: IOrganizationStructuredDropdown[];
  removeAutocompleteOption: (data: IOrganizationStructuredDropdown) => void;
  handleAutocompleteChange: (
    event: React.SyntheticEvent,
    values: Array<IOrganizationStructuredDropdown>,
    reason: string
  ) => void;
}
interface ICustomChipsProps {
  value: IOrganizationStructuredDropdown;
  getTagProps: AutocompleteRenderGetTagProps;
  removeAutocompleteOption: (value: IOrganizationStructuredDropdown) => void;
  index: number;
}

const CustomChips = ({
  value,
  index,
  removeAutocompleteOption,
  getTagProps,
}: ICustomChipsProps) => {
  const handleOnRemove = useCallback(() => {
    removeAutocompleteOption(value);
  }, [value, index, removeAutocompleteOption]);
  return (
    <Chip
      variant='filled'
      label={value?.name}
      {...getTagProps({ index })}
      deleteIcon={<Cvclose />}
      color='primary'
      onDelete={handleOnRemove}
    />
  );
};
const AutoCompleteWithDropdownAdd = ({
  id,
  placeholder,
  labelTitle = '',
  autocompleteList,
  selectedOptions,
  removeAutocompleteOption,
  handleAutocompleteChange,
}: IAutoCompleteProps) => {
  const handleAutoSelection = useCallback(
    (
      event: React.SyntheticEvent,
      values: Array<IOrganizationStructuredDropdown>,
      reason: string,
      options:
        | AutocompleteChangeDetails<IOrganizationStructuredDropdown>
        | undefined
    ) => {
      if (reason === 'removeOption') {
        if (options?.option) {
          removeAutocompleteOption(options?.option);
        }
      } else {
        let tempData: Array<IOrganizationStructuredDropdown> = [];
        values.forEach((value) => {
          const { companyUuid } = value;
          const alldata = autocompleteList.filter(
            (ele) =>
              ele.parentUuid === companyUuid || ele.grandUuid === companyUuid
          );
          tempData = Array.from(
            new Set([...selectedOptions, ...alldata, value])
          );
        });
        handleAutocompleteChange(event, tempData, reason);
      }
    },
    [selectedOptions]
  );

  const getListClass = (type: string) => {
    if (type === 'parent') {
      return 'parent-menu';
    } else if (type === 'child') {
      return 'child-menu';
    } else {
      return 'grandChild-menu';
    }
  };
  return (
    <Autocomplete
      fullWidth
      multiple
      className='search-skill'
      id={id}
      options={autocompleteList}
      disableClearable
      popupIcon={<Cvdropdown />}
      getOptionLabel={useCallback(
        (option: IOrganizationStructuredDropdown) => option?.name,
        []
      )}
      value={selectedOptions}
      isOptionEqualToValue={useCallback(
        (
          option: IOrganizationStructuredDropdown,
          value: IOrganizationStructuredDropdown
        ) => option.companyUuid === value?.companyUuid,
        [selectedOptions]
      )}
      renderTags={useCallback(
        (
          values: readonly IOrganizationStructuredDropdown[],
          getTagProps: any
        ) => (
          <Stack flexDirection='row' flexWrap='wrap' width={'100%'}>
            {values &&
              values?.length > 0 &&
              values?.map(
                (value: IOrganizationStructuredDropdown, index: number) =>
                  value?.companyUuid && (
                    <div key={value?.companyUuid}>
                      <CustomChips
                        index={index}
                        removeAutocompleteOption={removeAutocompleteOption}
                        value={value}
                        getTagProps={getTagProps}
                      />
                    </div>
                  )
              )}
          </Stack>
        ),
        [removeAutocompleteOption]
      )}
      renderOption={useCallback(
        (
          props: React.HTMLAttributes<HTMLLIElement>,
          option: IOrganizationStructuredDropdown
        ) => (
          <li
            {...props}
            key={option?.companyUuid}
            className={`MuiAutocomplete-option ${getListClass(
              option.type ?? ''
            )}`}
          >
            {option?.name}
          </li>
        ),
        [selectedOptions]
      )}
      onChange={handleAutoSelection}
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
        [selectedOptions]
      )}
    />
  );
};

export default AutoCompleteWithDropdownAdd;
