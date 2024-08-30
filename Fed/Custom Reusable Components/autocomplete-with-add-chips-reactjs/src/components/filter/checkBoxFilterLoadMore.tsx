import React, { useCallback, useEffect, useState } from 'react';
import { Stack } from '@mui/system';
import {
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Menu,
  OutlinedInput,
} from '@mui/material';
import './filter.scss';
import {
  Cvcheckbox,
  CvcheckboxChecked,
  Cvdropdown,
  Cvsearch,
  Cvreset,
  CvCheckboxIndeterminate,
} from '../icons/icons';

interface ICheckBoxFilterProps {
  title?: string;
  list?: IListObjects[];
}

interface IListObjects {
  company_uuid?: string;
  name?: string;
  title?: string;
  parent_uuid?: string;
  type?: string;
  grand_uuid?: string;
  [key: string]: string | undefined;
}
interface ICustomChipsProps {
  ele: IListObjects;
  checkboxChangeTrigger: any;
  selectedCheckbox: string[];
  indeterminateCheckboxes: string[];
}
const CustomCheckbox = ({
  ele,
  checkboxChangeTrigger,
  selectedCheckbox,
  indeterminateCheckboxes,
}: ICustomChipsProps) => {
  const handleCheckbox = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      checkboxChangeTrigger(event, ele.parent_uuid, ele.type, ele.grand_uuid);
    },
    [ele, checkboxChangeTrigger, selectedCheckbox, indeterminateCheckboxes]
  );
  return (
    <Checkbox
      value={ele?.company_uuid}
      icon={<Cvcheckbox />}
      checked={
        selectedCheckbox?.includes(ele?.company_uuid ?? '') ? true : false
      }
      indeterminateIcon={<CvCheckboxIndeterminate />}
      checkedIcon={<CvcheckboxChecked />}
      onChange={handleCheckbox}
      indeterminate={
        indeterminateCheckboxes?.includes(ele?.company_uuid ?? '')
          ? true
          : false
      }
    />
  );
};

const CheckBoxFilterLoadMore = (props: ICheckBoxFilterProps) => {
  const [finalSeletionList, setFinalSelectionList] = useState<string[]>([]);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [indeterminateCheckboxes, setIndeterminateCheckboxes] = useState<
    string[]
  >([]);
  const [showCompanyFilter, setShowCompanyFilter] = useState<boolean>(false);
  const [selectedCheckbox, setSelectedCheckbox] = useState<string[]>([]);
  const [searchString, setSearchString] = useState('');

  const [listData, setListData] = useState<IListObjects[] | undefined>(
    props.list
  );

  useEffect(() => {
    const searchedData = props?.list?.filter((ele: IListObjects) => {
      return ele?.name?.toLowerCase().includes(searchString.toLowerCase());
    });
    setListData(searchedData);
  }, [searchString]);

  useEffect(() => {
    setSelectedCheckbox(finalSeletionList);
  }, [finalSeletionList]);

  const getAllCategoryUuid = (
    e: React.ChangeEvent<HTMLInputElement>,
    allChildIds: string[]
  ) => {
    let allCategoryUUID: string[] = [...selectedCheckbox] || [];
    if (e.target.checked) {
      if (e.target.value) {
        if (allCategoryUUID) {
          allCategoryUUID = [
            ...allCategoryUUID,
            ...allChildIds,
            e.target.value,
          ];
        }
        setSelectedCheckbox([
          ...Array.from(
            new Set([...selectedCheckbox, ...allChildIds, e.target.value])
          ),
        ]);
      }
    } else {
      const filteredData = allCategoryUUID?.filter(
        (ele: string) => ele !== e.target.value && !allChildIds.includes(ele)
      );
      allCategoryUUID = [...filteredData];
      setSelectedCheckbox([...filteredData]);
    }
    return allCategoryUUID;
  };

  /**
   * While Un Check first Top checkbox
   * @param e
   * @param finalSeletionList
   * @returns final Check List Data
   */
  const unCheckCheckboxesTopLevel = (
    e: React.ChangeEvent<HTMLInputElement>,
    finalSeletionList: string[]
  ) => {
    const finalList = finalSeletionList;
    const secondLevel = props?.list?.filter(
      (pfl) => pfl.parent_uuid === e.target.value
    );
    secondLevel?.forEach((sl) => {
      const slIndex = finalList.findIndex((fl) => fl === sl?.company_uuid);
      if (slIndex !== -1) {
        finalList.splice(slIndex, 1);
      }
      const thirdLevel = props?.list?.filter(
        (pfl) => pfl.grand_uuid === sl.parent_uuid
      );
      thirdLevel?.forEach((tl) => {
        const tlIndex = finalList.findIndex((fl) => fl === tl.company_uuid);
        if (tlIndex !== -1) {
          finalList.splice(tlIndex, 1);
        }
      });
    });
    return finalList;
  };

  /**
   * While Un Check Second Child checkbox
   * @param e
   * @param finalSeletionList
   * @param parentId
   * @returns final Check List Data
   */
  const unCheckCheckboxesSecondLevel = (
    e: React.ChangeEvent<HTMLInputElement>,
    finalSeletionList: string[],
    parentId: string | undefined
  ) => {
    const allIndeterminateCheckboxes = [...indeterminateCheckboxes];
    const finalList = finalSeletionList;
    const thirdLevel = props?.list?.filter(
      (pfl) => pfl.parent_uuid === e.target.value
    );

    thirdLevel?.forEach((tl) => {
      const tlIndex = finalList.findIndex((fl) => fl === tl.company_uuid);
      if (tlIndex !== -1) {
        finalList.splice(tlIndex, 1);
      }
    });
    const secondLevel = props?.list?.filter(
      (pfl) => pfl.parent_uuid === parentId
    );
    let anyChildActive = false;
    secondLevel?.forEach((sl) => {
      if (sl?.parent_uuid && finalList.includes(sl?.parent_uuid)) {
        const flIndex = finalList.findIndex((fl) => fl === sl?.parent_uuid);
        finalList.splice(flIndex, 1);
      }
      if (
        sl?.parent_uuid &&
        !allIndeterminateCheckboxes.includes(sl?.parent_uuid) &&
        secondLevel?.length > 1
      ) {
        allIndeterminateCheckboxes.push(sl?.parent_uuid);
      }
      if (sl?.company_uuid && finalList.includes(sl?.company_uuid)) {
        anyChildActive = true;
      }
    });
    if (!anyChildActive) {
      const aiIndex = allIndeterminateCheckboxes.findIndex(
        (aic) => aic === parentId
      );
      if (aiIndex !== -1) {
        allIndeterminateCheckboxes.splice(aiIndex, 1);
      }
    }
    setIndeterminateCheckboxes(allIndeterminateCheckboxes);
    return finalList;
  };

  /**
   * While un Check Third Level Chirdren checkboxe
   * @param e
   * @param finalSeletionList
   * @param parentId
   * @param grand_uuid
   * @returns final check List Data
   */
  const unCheckCheckboxesThirdLevel = (
    e: React.ChangeEvent<HTMLInputElement>,
    finalSeletionList: string[],
    parentId: string | undefined,
    grand_uuid: string | undefined
  ) => {
    const allIndeterminateCheckboxes = [...indeterminateCheckboxes];
    const finalList = finalSeletionList;
    const thirdLevel = props?.list?.filter(
      (pfl) => pfl.parent_uuid === parentId
    );
    const secondLevel = props?.list?.filter(
      (pfl) => pfl.parent_uuid === grand_uuid
    );
    if (parentId && finalList?.includes(parentId)) {
      const flIndex = finalList?.findIndex((fl) => fl === parentId);
      finalList?.splice(flIndex, 1);
      if (!allIndeterminateCheckboxes.includes(parentId)) {
        allIndeterminateCheckboxes.push(parentId);
      }
    }
    if (grand_uuid && finalList?.includes(grand_uuid)) {
      const flIndex = finalList?.findIndex((fl) => fl === grand_uuid);
      finalList?.splice(flIndex, 1);
      if (!allIndeterminateCheckboxes.includes(grand_uuid)) {
        allIndeterminateCheckboxes.push(grand_uuid);
      }
    }

    let singleChildChecked = false;
    thirdLevel?.forEach((tl) => {
      if (tl.company_uuid && finalList?.includes(tl.company_uuid)) {
        singleChildChecked = true;
      }
    });
    if (!singleChildChecked) {
      const pIndex = allIndeterminateCheckboxes.findIndex(
        (alc) => alc === parentId
      );
      pIndex !== -1 && allIndeterminateCheckboxes.splice(pIndex, 1);
    }
    unCheckChekboxesThirdLevelSecond(
      secondLevel ?? [],
      allIndeterminateCheckboxes,
      finalList,
      grand_uuid ?? ''
    );
  };

  /**
   * While un Check Third Level Chirdren checkbox Continue logic
   * @param secondLevel
   * @param allIndeterminateCheckboxes
   * @param finalList
   * @param grand_uuid
   * @returns
   */
  const unCheckChekboxesThirdLevelSecond = (
    secondLevel: IListObjects[],
    allIndeterminateCheckboxes: string[],
    finalList: string[],
    grand_uuid: string
  ) => {
    let checkboxIntermediateChecked = false;
    let checkboxFinalListChecked = false;
    secondLevel?.forEach((sl) => {
      if (
        sl.company_uuid &&
        allIndeterminateCheckboxes?.includes(sl.company_uuid)
      ) {
        checkboxIntermediateChecked = true;
      }
      if (sl.company_uuid && finalList.includes(sl.company_uuid)) {
        checkboxFinalListChecked = true;
      }
    });
    if (!checkboxIntermediateChecked && !checkboxFinalListChecked) {
      const gIndex = allIndeterminateCheckboxes.findIndex(
        (agc) => agc === grand_uuid
      );
      if (gIndex !== -1) {
        allIndeterminateCheckboxes.splice(gIndex, 1);
      }
    }

    setIndeterminateCheckboxes(allIndeterminateCheckboxes);
    return finalList;
  };

  /**
   * @description Maintains the Array of Checked/unchecked Checkbox in Redux
   */

  /**
   * While Check First Level Checkbox Continue logic
   * @param parentId
   * @param allIndeterminateCheckboxes
   * @param allChildIds
   * @param grand_uuid
   * @returns
   */
  const checkedFirstLevelCheckbox = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement>,
      parentId: string | undefined,
      grand_uuid: string | undefined,
      allChildIds: string[],
      allIndeterminateCheckboxes: string[]
    ) => {
      if (parentId === '' && grand_uuid === undefined) {
        props?.list &&
          props?.list.map((list) => {
            if (
              (list.parent_uuid === e.target.value ||
                list.grand_uuid === e.target.value) &&
              list.company_uuid
            ) {
              allChildIds.push(list.company_uuid);
            }
          });
        const parentIndex = allIndeterminateCheckboxes.findIndex(
          (value: any) => {
            return value === e.target.value;
          }
        );
        if (parentIndex !== -1) {
          allIndeterminateCheckboxes.splice(parentIndex, 1);
        }
        const secondLevel = props?.list?.filter(
          (pfl) => pfl.parent_uuid === e.target.value
        );
        secondLevel?.forEach((sl) => {
          const slIndex = allIndeterminateCheckboxes.findIndex(
            (value: any) => value === sl.company_uuid
          );
          if (slIndex !== -1) {
            allIndeterminateCheckboxes.splice(slIndex, 1);
          }
        });
        setIndeterminateCheckboxes(allIndeterminateCheckboxes);
      }
    },
    [props?.list]
  );

  /**
   * While Check Second Level Checkbox Continue logic
   * @param parentId
   * @param allIndeterminateCheckboxes
   * @param allChildIds
   * @param grand_uuid
   * @returns
   */
  const checkedSecondLevelCheckbox = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement>,
      parentId: string | undefined,
      grand_uuid: string | undefined,
      allChildIds: string[],
      allIndeterminateCheckboxes: string[]
    ) => {
      if (parentId !== '' && grand_uuid === undefined) {
        props?.list &&
          props?.list.map((list) => {
            if (list.parent_uuid === e.target.value && list.company_uuid) {
              allChildIds.push(list.company_uuid);
            }
          });
        if (parentId && e?.target.checked) {
          setIndeterminateCheckboxes([...allIndeterminateCheckboxes, parentId]);
        }
      }
    },
    [props?.list]
  );

  /**
   * While un Check Checkbox Continue logic
   * @param parentId
   * @param finalSeletionList
   * @param grand_uuid
   * @returns
   */
  const unCheckCheckboxChecked = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement>,
      parentId: string | undefined,
      grand_uuid: string | undefined,
      finalSeletionList: string[]
    ) => {
      if (!parentId && !grand_uuid) {
        finalSeletionList = unCheckCheckboxesTopLevel(e, finalSeletionList);
      }
      if (parentId && !grand_uuid) {
        unCheckCheckboxesSecondLevel(e, finalSeletionList, parentId);
      }
      if (parentId && grand_uuid) {
        unCheckCheckboxesThirdLevel(e, finalSeletionList, parentId, grand_uuid);
      }
    },
    [
      unCheckCheckboxesSecondLevel,
      unCheckCheckboxesThirdLevel,
      unCheckCheckboxesTopLevel,
    ]
  );

  /**
   * While Set Second Level Final Data Continue logic
   * @param parentId
   * @param finalSeletionList
   * @param allIndeterminateCheckboxes
   * @returns
   */
  const setSecondLevelFinalData = useCallback(
    (
      allIndeterminateCheckboxes: string[],
      finalSeletionList: string[],
      parentId: string | undefined
    ) => {
      const sldIndex = allIndeterminateCheckboxes.findIndex(
        (aic) => aic === parentId
      );
      if (sldIndex !== -1) {
        allIndeterminateCheckboxes.splice(sldIndex, 1);
      }
      if (parentId && !finalSeletionList.includes(parentId)) {
        finalSeletionList.push(parentId);
      }
    },
    []
  );

  /**
   * While Filter Second Level Final Data Continue logic
   * @param parentId
   * @param finalSeletionList
   * @param allIndeterminateCheckboxes
   * @param secondLevelDataChecked
   * @param secondLevelData
   * @returns
   */
  const filterSecondLevelFinalSeletionList = useCallback(
    (
      secondLevelDataChecked: any,
      allIndeterminateCheckboxes: string[],
      parentId: string | undefined,
      secondLevelData: any,
      finalSeletionList: string[]
    ) => {
      if (secondLevelDataChecked) {
        setSecondLevelFinalData(
          allIndeterminateCheckboxes,
          finalSeletionList,
          parentId
        );
      } else {
        const parentLevelIntermediate = true;
        secondLevelData?.forEach((sld: any) => {
          if (
            sld.company_uuid &&
            !finalSeletionList.includes(sld.company_uuid)
          ) {
            secondLevelDataChecked = false;
          }
        });
        if (
          parentLevelIntermediate &&
          parentId &&
          !allIndeterminateCheckboxes.includes(parentId)
        ) {
          allIndeterminateCheckboxes.push(parentId);
        }
      }
    },
    [setSecondLevelFinalData]
  );

  /**
   * While Handle the Second Level Data Continue logic
   * @param parentId
   * @param finalSeletionList
   * @param allIndeterminateCheckboxes
   * @returns
   */
  const handleSecondLevelCheckbox = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement>,
      parentId: string | undefined,
      allIndeterminateCheckboxes: string[],
      finalSeletionList: string[]
    ) => {
      const secondLevelData = props?.list?.filter(
        (list) => list.parent_uuid === parentId
      );
      let secondLevelDataChecked = true;
      secondLevelData?.forEach((sld) => {
        if (sld.company_uuid && !finalSeletionList.includes(sld.company_uuid)) {
          secondLevelDataChecked = false;
        }
      });
      filterSecondLevelFinalSeletionList(
        secondLevelDataChecked,
        allIndeterminateCheckboxes,
        parentId,
        secondLevelData,
        finalSeletionList
      );
      if (parentId && allIndeterminateCheckboxes.includes(e.target.value)) {
        const index = allIndeterminateCheckboxes.findIndex(
          (ele) => ele === e.target.value
        );
        if (index !== -1) {
          allIndeterminateCheckboxes.splice(index, 1);
        }
      }
      setIndeterminateCheckboxes(allIndeterminateCheckboxes);
    },
    [filterSecondLevelFinalSeletionList, props?.list]
  );

  /**
   * While Check Value All Indeterminate Checkboxes Continue logic
   * @param parentId
   * @param grand_uuid
   * @param allIndeterminateCheckboxes
   * @returns
   */
  const checkValueAllIndeterminateCheckboxes = useCallback(
    (
      allIndeterminateCheckboxes: string[],
      parentId: string,
      grand_uuid: string
    ) => {
      if (!allIndeterminateCheckboxes.includes(parentId)) {
        allIndeterminateCheckboxes.push(parentId);
      }
      if (!allIndeterminateCheckboxes.includes(grand_uuid)) {
        allIndeterminateCheckboxes.push(grand_uuid);
      }
    },
    []
  );

  /**
   * While Check Second Level Based Checked Parent Id Continue logic
   * @param parentId
   * @param finalSeletionList
   * @param allIndeterminateCheckboxes
   * @param secondLevelbasedChecked
   * @returns
   */
  const chcekSecondLevelbasedCheckedParentId = useCallback(
    (
      secondLevelbasedChecked: any,
      allIndeterminateCheckboxes: string[],
      parentId: string,
      finalSeletionList: string[]
    ) => {
      if (secondLevelbasedChecked) {
        const indeteminateInd = allIndeterminateCheckboxes.findIndex(
          (aic) => aic === parentId
        );
        if (indeteminateInd !== -1) {
          allIndeterminateCheckboxes.splice(indeteminateInd, 1);
          if (!finalSeletionList.includes(parentId)) {
            finalSeletionList.push(parentId);
          }
        }
      }
    },
    []
  );

  /**
   * While Check Second Level Based Checked Grand Id Continue logic
   * @param grand_uuid
   * @param finalSeletionList
   * @param allIndeterminateCheckboxes
   * @param secondLevelDataChecked
   * @returns
   */
  const checkSecondLevelbasedCheckedGrandId = useCallback(
    (
      secondLevelDataChecked: any,
      allIndeterminateCheckboxes: string[],
      grand_uuid: string,
      finalSeletionList: string[]
    ) => {
      if (secondLevelDataChecked) {
        const sldIndex = allIndeterminateCheckboxes.findIndex(
          (aic) => aic === grand_uuid
        );
        if (sldIndex !== -1) {
          allIndeterminateCheckboxes.splice(sldIndex, 1);
          if (!finalSeletionList.includes(grand_uuid)) {
            finalSeletionList.push(grand_uuid);
          }
        }
      }
    },
    []
  );

  /**
   * While Handle Third Level Checkbox Continue logic
   * @param parentId
   * @param grand_uuid
   * @param allIndeterminateCheckboxes
   * @param finalSeletionList
   * @returns
   */
  const handleThirdLevelCheckbox = useCallback(
    (
      parentId: string,
      grand_uuid: string,
      allIndeterminateCheckboxes: string[],
      finalSeletionList: string[]
    ) => {
      checkValueAllIndeterminateCheckboxes(
        allIndeterminateCheckboxes,
        parentId,
        grand_uuid
      );
      const secondLevelBasedParentData = props?.list?.filter(
        (list) => list.parent_uuid === parentId
      );
      let secondLevelbasedChecked = true;
      secondLevelBasedParentData?.forEach((slbp) => {
        if (
          slbp.company_uuid &&
          !finalSeletionList.includes(slbp.company_uuid)
        ) {
          secondLevelbasedChecked = false;
        }
      });
      chcekSecondLevelbasedCheckedParentId(
        secondLevelbasedChecked,
        allIndeterminateCheckboxes,
        parentId,
        finalSeletionList
      );
      const secondLevelData = props?.list?.filter(
        (list) => list.parent_uuid === grand_uuid
      );
      let secondLevelDataChecked = true;
      secondLevelData?.forEach((sld) => {
        if (sld.company_uuid && !finalSeletionList.includes(sld.company_uuid)) {
          secondLevelDataChecked = false;
        }
      });
      checkSecondLevelbasedCheckedGrandId(
        secondLevelDataChecked,
        allIndeterminateCheckboxes,
        grand_uuid,
        finalSeletionList
      );
      setIndeterminateCheckboxes(allIndeterminateCheckboxes);
    },
    [
      checkValueAllIndeterminateCheckboxes,
      chcekSecondLevelbasedCheckedParentId,
      checkSecondLevelbasedCheckedGrandId,
      props?.list,
    ]
  );

  /**
   * While Handle Checkbox Change Action Trigger
   * @param parentId
   * @param grand_uuid
   * @param type
   * @returns
   */
  const checkboxChangeTrigger = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement>,
      parentId: string | undefined,
      type: string | undefined,
      grand_uuid: string | undefined
    ) => {
      setShowCompanyFilter(true);
      const allChildIds: string[] = [];
      const allIndeterminateCheckboxes = [...indeterminateCheckboxes];
      if (e.target.checked) {
        // First Level Checkbox Checked
        checkedFirstLevelCheckbox(
          e,
          parentId,
          grand_uuid,
          allChildIds,
          allIndeterminateCheckboxes
        );
        // Second Level Checkbox Checked
        checkedSecondLevelCheckbox(
          e,
          parentId,
          grand_uuid,
          allChildIds,
          allIndeterminateCheckboxes
        );
      }

      const allCategoryUUID = getAllCategoryUuid(e, allChildIds);
      let finalSeletionList = Array.from(new Set(allCategoryUUID));
      // First Level Checkbox Checked
      if (e.target.checked && parentId !== '' && !grand_uuid) {
        handleSecondLevelCheckbox(
          e,
          parentId,
          allIndeterminateCheckboxes,
          finalSeletionList
        );
      }
      // Third Level Checkbox Checked
      if (e.target.checked && parentId && grand_uuid) {
        handleThirdLevelCheckbox(
          parentId,
          grand_uuid,
          allIndeterminateCheckboxes,
          finalSeletionList
        );
      }

      // Un Chcked checkbox checked
      if (!e.target.checked) {
        unCheckCheckboxChecked(e, parentId, grand_uuid, finalSeletionList);
      }
      setFinalSelectionList(finalSeletionList);
    },
    [
      indeterminateCheckboxes,
      getAllCategoryUuid,
      checkedFirstLevelCheckbox,
      checkedSecondLevelCheckbox,
      handleSecondLevelCheckbox,
      handleThirdLevelCheckbox,
      unCheckCheckboxChecked,
    ]
  );

  const resetSearchString = () => {
    setSearchString('');
    setIndeterminateCheckboxes([]);
    setSelectedCheckbox([]);
    setFinalSelectionList([]);
    setListData(props?.list);
  };

  /**
   * @description Empties the data in Redux for Specific Filter
   */
  const resetFilter = useCallback(() => {
    setShowCompanyFilter(false);
    resetSearchString();
  }, []);

  /**
   * @description Maintains The Search Functionality in Checkbox Filter
   */
  const searchInCheckbox = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchString(e.target.value);
    },
    []
  );

  const typeBasedClassName = (ele: string | undefined) => {
    if (ele === 'child') {
      return 'child-menu-filter';
    } else if (ele === 'grandChild') {
      return 'grand-child-menu-filter';
    } else {
      return 'parent-menu-filter';
    }
  };

  return (
    <>
      <Button
        fullWidth
        className='filter-button'
        id='Company-List'
        aria-controls={showCompanyFilter ? 'Company List' : undefined}
        aria-expanded={showCompanyFilter ? 'true' : undefined}
        aria-haspopup='true'
        size='small'
        onClick={useCallback(
          (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            setShowCompanyFilter(true);
            setAnchorEl(event.currentTarget);
          },
          []
        )}
        endIcon={<Cvdropdown />}
      >
        {props?.title}
      </Button>
      <Menu
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        elevation={0}
        className='pop-hover filter-details'
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        id='demo-customized-menu'
        MenuListProps={{
          'aria-labelledby': 'category',
        }}
        sx={{ marginTop: '6px' }}
        anchorEl={anchorEl}
        open={showCompanyFilter}
        onClose={useCallback(() => {
          setShowCompanyFilter(false);
          setAnchorEl(null);
        }, [])}
      >
        <Stack>
          <Stack className='top-section'>
            <FormControl variant='outlined' sx={{ m: { xs: '0' } }}>
              <OutlinedInput
                onChange={searchInCheckbox}
                id='outlined-adornment-password'
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton
                      aria-label='toggle password visibility'
                      edge='end'
                    >
                      <Cvsearch />
                    </IconButton>
                  </InputAdornment>
                }
                value={searchString}
              />
            </FormControl>
          </Stack>

          <Divider></Divider>

          <Stack className='middle-section'>
            <div id='scrollableDiv' style={{ overflowY: 'scroll' }}>
              {listData && listData?.length > 0 ? (
                listData?.map((ele) => {
                  return (
                    <FormControlLabel
                      id={ele?.company_uuid}
                      key={ele?.company_uuid}
                      className={`check-icon ${typeBasedClassName(ele?.type)}`}
                      control={
                        <CustomCheckbox
                          ele={ele}
                          checkboxChangeTrigger={checkboxChangeTrigger}
                          selectedCheckbox={selectedCheckbox}
                          indeterminateCheckboxes={indeterminateCheckboxes}
                        />
                      }
                      label={ele?.name ? ele?.name : ele?.title}
                    />
                  );
                })
              ) : (
                <Stack
                  className='MuiDataGrid-overlay'
                  display='flex'
                  justifyContent='center'
                  alignItems='center'
                >
                  No Records Found
                </Stack>
              )}
            </div>
          </Stack>
          <Divider></Divider>
          <Stack className='bottom-section'>
            <Button
              sx={{ marginLeft: 'auto' }}
              size='small'
              color='primary'
              startIcon={<Cvreset />}
              variant='text'
              onClick={resetFilter}
            >
              Reset
            </Button>
          </Stack>
        </Stack>
      </Menu>
    </>
  );
};

export default CheckBoxFilterLoadMore;
