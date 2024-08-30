import React, { useCallback, useState } from 'react';
import './App.css';
import { Grid, FormGroup, InputLabel, Paper, Stack } from '@mui/material';
import AutoCompleteWithAdd, { IOption } from './components/autoCompleteWithAdd';
import AutoCompleteWithDropdownAdd, {
  IOrganizationStructuredDropdown,
} from './components/autoCompleteWithDropdownAdd';
import CheckBoxFilterLoadMore from './components/filter/checkBoxFilterLoadMore';

function App() {
  const [skillsList] = useState<IOption[]>([
    // {
    //   uuid: 'c1aae77a-fe70-4d03-a440-10018a3301a2',
    //   title: 'Communication Skills',
    // },
    // {
    //   uuid: '6269c73a-689f-4a2e-aefa-c2fc38178f2b',
    //   title: 'Customer Service',
    // },
    // {
    //   uuid: 'ac7c3716-3b4c-4bbf-958e-ee8d72b0251f',
    //   title: 'Excellent',
    // },
    // {
    //   uuid: 'd62520c0-98f3-4575-9a55-ee5e333a66c9',
    //   title: 'Problem Solving',
    // },
    // {
    //   uuid: '2520f4ed-c3a2-4257-818c-6054506025d9',
    //   title: 'Time Management',
    // },
  ]);
  const [selectedOptions, setSelectedOptions] = useState<IOption[]>([]);
  const [selectedOptions1, setSelectedOptions1] = useState<
    IOrganizationStructuredDropdown[]
  >([]);
  const [companyList] = useState([
    // {
    //   companyUuid: '9d2619c0-c7ab-45dd-935f-711b772425f4',
    //   name: 'Brainvire Ahmedabad',
    //   parentUuid: '',
    //   type: 'parent',
    // },
    // {
    //   name: 'Open Source',
    //   companyUuid: '674fbb3c-4674-4f62-bcca-8868bc797c9a',
    //   parentUuid: '9d2619c0-c7ab-45dd-935f-711b772425f4',
    //   type: 'child',
    // },
    // {
    //   name: 'Brainvire Mumbai',
    //   parentUuid: '',
    //   companyUuid: 'e897f83f-1ad0-48fb-af9c-1bdfdc47164e',
    //   type: 'parent',
    // },
    // {
    //   name: 'System',
    //   parentUuid: 'e897f83f-1ad0-48fb-af9c-1bdfdc47164e',
    //   type: 'child',
    //   companyUuid: 'a8bd12ba-1ba6-4f53-a095-279562cd84e7',
    // },
    // {
    //   companyUuid: 'ef963b5f-5b7f-4c21-b4a6-e7439d14d8ff',
    //   parentUuid: '',
    //   name: 'Brainvire Pune',
    //   type: 'parent',
    // },
    // {
    //   companyUuid: '7f2b8ebb-d19b-4447-bfc5-390313fa501f',
    //   parentUuid: 'ef963b5f-5b7f-4c21-b4a6-e7439d14d8ff',
    //   type: 'child',
    //   name: 'Magento',
    // },
    // {
    //   companyUuid: 'bc830a86-10c8-459a-9b0f-3ce4bdee02fe',
    //   parentUuid: 'ef963b5f-5b7f-4c21-b4a6-e7439d14d8ff',
    //   name: 'Laravel',
    //   type: 'child',
    // },
    // {
    //   companyUuid: '6a46d168-9b84-4fb7-a9ff-0d39adc2dfeb',
    //   name: 'PHP',
    //   type: 'child',
    //   parentUuid: 'ef963b5f-5b7f-4c21-b4a6-e7439d14d8ff',
    // },
    // {
    //   name: 'Brainvire Bangalore',
    //   companyUuid: '40414f2d-7d06-4b8a-b723-ab13fa353373',
    //   parentUuid: '',
    //   type: 'parent',
    // },
    // {
    //   companyUuid: '54b4638e-c6c4-41b6-8b60-922fa2ea2f8b',
    //   type: 'child',
    //   name: 'Andriod Dept.',
    //   parentUuid: '40414f2d-7d06-4b8a-b723-ab13fa353373',
    // },
    // {
    //   companyUuid: '336f4984-8790-4766-8f9d-c70bb5f09f59',
    //   name: 'Bangalore',
    //   parentUuid: '54b4638e-c6c4-41b6-8b60-922fa2ea2f8b',
    //   grandUuid: '40414f2d-7d06-4b8a-b723-ab13fa353373',
    //   type: 'grandChild',
    // },
    // {
    //   companyUuid: '0bc856f4-b068-496a-9c50-bf3f2ceaa1f1',
    //   name: 'IOS Dept.',
    //   parentUuid: '40414f2d-7d06-4b8a-b723-ab13fa353373',
    //   type: 'child',
    // },
    // {
    //   companyUuid: '4995d98c-ffa4-442f-861f-9d5250e2c4a5',
    //   name: 'Accely',
    //   parentUuid: '',
    //   type: 'parent',
    // },
    // {
    //   companyUuid: '0f208f10-d8b7-4b7e-ac83-3db33da4958p',
    //   name: 'Accely Mumbai',
    //   parentUuid: '4995d98c-ffa4-442f-861f-9d5250e2c4a5',
    //   type: 'child',
    // },
    // {
    //   companyUuid: 'ae9d371b-7674-40f0-9df9-2d5c81777e42',
    //   name: 'Accely Brand',
    //   parentUuid: '4995d98c-ffa4-442f-861f-9d5250e2c4a5',
    //   type: 'child',
    // },
    // {
    //   companyUuid: '395b8ad0-ad60-4b82-b34f-9d5ec1527dbv',
    //   name: 'Pune',
    //   parentUuid: 'ae9d371b-7674-40f0-9df9-2d5c81777e42',
    //   grandUuid: '4995d98c-ffa4-442f-861f-9d5250e2c4a5',
    //   type: 'grandChild',
    // },
    // {
    //   type: 'grandChild',
    //   companyUuid: '395b8a50-ad60-4b82-b34f-9d5ec1527dba',
    //   name: 'Mumbai',
    //   parentUuid: 'ae9d371b-7674-40f0-9df9-2d5c81777e42',
    //   grandUuid: '4995d98c-ffa4-442f-861f-9d5250e2c4a5',
    // },
  ]);
  const [filterList] = useState([
    // {
    //   company_uuid: '40414f2d-7d06-4b8a-b723-ab13fa353388',
    //   name: 'Brainvire Five',
    //   parent_uuid: '',
    //   type: 'parent',
    // },
    // {
    //   company_uuid: '0b17f490-90a7-47c7-8f20-b504e24a9cd5',
    //   name: 'Rakhi',
    //   parent_uuid: '40414f2d-7d06-4b8a-b723-ab13fa353388',
    //   type: 'child',
    // },
    // {
    //   company_uuid: '54b4638e-c6c4-41b6-8b60-922fa2ea2f8h',
    //   name: 'RK Fashion -UPDATE',
    //   parent_uuid: '40414f2d-7d06-4b8a-b723-ab13fa353388',
    //   type: 'child',
    // },
    // {
    //   company_uuid: '336f4984-8790-4766-8f9d-c70bb5f09f69',
    //   name: 'Ahmedabad-NEW',
    //   parent_uuid: '54b4638e-c6c4-41b6-8b60-922fa2ea2f8h',
    //   grand_uuid: '40414f2d-7d06-4b8a-b723-ab13fa353388',
    //   type: 'grandChild',
    // },
    // {
    //   company_uuid: '0bc856f4-b068-496a-9c50-bf3f2ceaa1f2',
    //   name: 'Brainvire Five 1',
    //   parent_uuid: '40414f2d-7d06-4b8a-b723-ab13fa353388',
    //   type: 'child',
    // },
    // {
    //   company_uuid: '4995d98c-ffa4-442f-861f-9d5250e2c4a4',
    //   name: 'Brainvire Six',
    //   parent_uuid: '',
    //   type: 'parent',
    // },
    // {
    //   company_uuid: '0f208f10-d8b7-4b7e-ac83-3db33da4958b',
    //   name: 'Brainvire Six Franchise',
    //   parent_uuid: '4995d98c-ffa4-442f-861f-9d5250e2c4a4',
    //   type: 'child',
    // },
    // {
    //   company_uuid: 'ae9d371b-7674-40f0-9df9-2d5c81777e43',
    //   name: 'Jay brand',
    //   parent_uuid: '4995d98c-ffa4-442f-861f-9d5250e2c4a4',
    //   type: 'child',
    // },
    // {
    //   company_uuid: '395b8ad0-ad60-4b82-b34f-9d5ec1527dba',
    //   name: "Jay's Location",
    //   parent_uuid: 'ae9d371b-7674-40f0-9df9-2d5c81777e43',
    //   grand_uuid: '4995d98c-ffa4-442f-861f-9d5250e2c4a4',
    //   type: 'grandChild',
    // },
    // {
    //   company_uuid: 'c8cf8c75-f5b5-4f18-b50a-f93c5952488e',
    //   name: 'BV_QA Organization',
    //   parent_uuid: '',
    //   type: 'parent',
    // },
    // {
    //   company_uuid: '4774eec6-2c4b-4d13-b255-497b007adb65',
    //   name: 'BV Brand Baroda',
    //   parent_uuid: 'c8cf8c75-f5b5-4f18-b50a-f93c5952488e',
    //   type: 'child',
    // },
    // {
    //   company_uuid: '74e56952-8c65-4ff8-9139-c4408fc12bf9',
    //   name: 'Marwadi Baroda',
    //   parent_uuid: '4774eec6-2c4b-4d13-b255-497b007adb65',
    //   grand_uuid: 'c8cf8c75-f5b5-4f18-b50a-f93c5952488e',
    //   type: 'grandChild',
    // },
    // {
    //   company_uuid: 'ade50fc8-0c14-4697-8e2b-b10f6189d673',
    //   name: 'BV_Ahmedabad',
    //   parent_uuid: 'c8cf8c75-f5b5-4f18-b50a-f93c5952488e',
    //   type: 'child',
    // },
    // {
    //   company_uuid: '9fd0759c-e934-420b-a8bf-8704519091fb',
    //   name: 'Brain',
    //   parent_uuid: 'ade50fc8-0c14-4697-8e2b-b10f6189d673',
    //   grand_uuid: 'c8cf8c75-f5b5-4f18-b50a-f93c5952488e',
    //   type: 'grandChild',
    // },
    // {
    //   company_uuid: 'cd4d648d-28db-4954-8a50-93565edda601',
    //   name: 'Jay Org',
    //   parent_uuid: '',
    //   type: 'parent',
    // },
    // {
    //   company_uuid: '99cac615-1e21-420c-9aca-7f246a18efb4',
    //   name: 'Jay Brand',
    //   parent_uuid: 'cd4d648d-28db-4954-8a50-93565edda601',
    //   type: 'child',
    // },
    // {
    //   company_uuid: '9eb52a8a-3f73-4bd3-b831-587851f35cce',
    //   name: 'Jay Location',
    //   parent_uuid: '99cac615-1e21-420c-9aca-7f246a18efb4',
    //   grand_uuid: 'cd4d648d-28db-4954-8a50-93565edda601',
    //   type: 'grandChild',
    // },
    // {
    //   company_uuid: 'e20c91b6-f489-4593-951a-0126c4ea01d9',
    //   name: 'Jay Location 2',
    //   parent_uuid: '99cac615-1e21-420c-9aca-7f246a18efb4',
    //   grand_uuid: 'cd4d648d-28db-4954-8a50-93565edda601',
    //   type: 'grandChild',
    // },
    // {
    //   company_uuid: '61b43578-87d1-4905-97c2-fa37850cfcc5',
    //   name: 'Jay Location 3',
    //   parent_uuid: '99cac615-1e21-420c-9aca-7f246a18efb4',
    //   grand_uuid: 'cd4d648d-28db-4954-8a50-93565edda601',
    //   type: 'grandChild',
    // },
    // {
    //   company_uuid: '9ebce28a-95d1-4849-958b-ec57b11a52e2',
    //   name: "Jay's Location 2",
    //   parent_uuid: '99cac615-1e21-420c-9aca-7f246a18efb4',
    //   grand_uuid: 'cd4d648d-28db-4954-8a50-93565edda601',
    //   type: 'grandChild',
    // },
    // {
    //   company_uuid: 'f7f3be09-590e-421a-9760-95f66d8288b0',
    //   name: "Jay's Location 5",
    //   parent_uuid: '99cac615-1e21-420c-9aca-7f246a18efb4',
    //   grand_uuid: 'cd4d648d-28db-4954-8a50-93565edda601',
    //   type: 'grandChild',
    // },
    // {
    //   company_uuid: '836cc0b4-6ad9-4ce1-adfb-7805694e1f92',
    //   name: "Jay's Location 7",
    //   parent_uuid: '99cac615-1e21-420c-9aca-7f246a18efb4',
    //   grand_uuid: 'cd4d648d-28db-4954-8a50-93565edda601',
    //   type: 'grandChild',
    // },
    // {
    //   company_uuid: 'f23e3c73-2510-4f48-8e97-74a1d519969c',
    //   name: "Jay's Brand 4",
    //   parent_uuid: 'cd4d648d-28db-4954-8a50-93565edda601',
    //   type: 'child',
    // },
    // {
    //   company_uuid: '276cf52b-cfe6-4aaa-ad49-c7dac6c58f8b',
    //   name: "Jay's Location 4",
    //   parent_uuid: 'cd4d648d-28db-4954-8a50-93565edda601',
    //   type: 'child',
    // },
    // {
    //   company_uuid: '72d1e8d9-eff2-4786-9db9-d517e83660e4',
    //   name: "Jay's Organization 10",
    //   parent_uuid: '',
    //   type: 'parent',
    // },
    // {
    //   company_uuid: '6ecbf934-dcfd-4b19-908a-bcc7f22fdfec',
    //   name: 'brand',
    //   parent_uuid: '72d1e8d9-eff2-4786-9db9-d517e83660e4',
    //   type: 'child',
    // },
    // {
    //   company_uuid: '3d41018c-2dfc-4863-8ae5-248152e35c4d',
    //   name: 'location',
    //   parent_uuid: '6ecbf934-dcfd-4b19-908a-bcc7f22fdfec',
    //   grand_uuid: '72d1e8d9-eff2-4786-9db9-d517e83660e4',
    //   type: 'grandChild',
    // },
    // {
    //   company_uuid: '51bebe90-65c2-44a6-be66-9494f62b116a',
    //   name: 'Organization Jay',
    //   parent_uuid: '',
    //   type: 'parent',
    // },
    // {
    //   company_uuid: '4bf7ad5e-73bd-47df-8a02-f29b34effb6b',
    //   name: 'Brand Jay',
    //   parent_uuid: '51bebe90-65c2-44a6-be66-9494f62b116a',
    //   type: 'child',
    // },
    // {
    //   company_uuid: '63110420-11c8-4629-8eb0-7bc7348f1eba',
    //   name: "Jay's Location 1",
    //   parent_uuid: '4bf7ad5e-73bd-47df-8a02-f29b34effb6b',
    //   grand_uuid: '51bebe90-65c2-44a6-be66-9494f62b116a',
    //   type: 'grandChild',
    // },
    // {
    //   company_uuid: '308a8be1-fa35-466b-82a4-f9a8d9041d1f',
    //   name: 'Location Jay',
    //   parent_uuid: '4bf7ad5e-73bd-47df-8a02-f29b34effb6b',
    //   grand_uuid: '51bebe90-65c2-44a6-be66-9494f62b116a',
    //   type: 'grandChild',
    // },
    // {
    //   company_uuid: 'b1d39778-6b1f-4a62-adf5-ca902d026a77',
    //   name: 'Brand Jay 1',
    //   parent_uuid: '51bebe90-65c2-44a6-be66-9494f62b116a',
    //   type: 'child',
    // },
    // {
    //   company_uuid: '3184f27e-9640-446d-9812-0f79765b3d3a',
    //   name: 'Rakhi Main Organization',
    //   parent_uuid: '',
    //   type: 'parent',
    // },
    // {
    //   company_uuid: 'b220bedb-15e5-43dc-9be9-5f821cbcb20f',
    //   name: 'Rakhi Brand 1',
    //   parent_uuid: '3184f27e-9640-446d-9812-0f79765b3d3a',
    //   type: 'child',
    // },
    // {
    //   company_uuid: 'd09e9e79-ad04-4ab2-93bd-bf1408efd13d',
    //   name: "Rakhi Brand 1's Location",
    //   parent_uuid: 'b220bedb-15e5-43dc-9be9-5f821cbcb20f',
    //   grand_uuid: '3184f27e-9640-446d-9812-0f79765b3d3a',
    //   type: 'grandChild',
    // },
    // {
    //   company_uuid: '12939d2c-7ed0-450c-85d4-294fb8735d95',
    //   name: 'Rakhi Org',
    //   parent_uuid: '',
    //   type: 'parent',
    // },
    // {
    //   company_uuid: '49dde603-395e-4fb3-accd-71b66f58eae2',
    //   name: 'Rakhi - Pune',
    //   parent_uuid: '12939d2c-7ed0-450c-85d4-294fb8735d95',
    //   type: 'child',
    // },
    // {
    //   company_uuid: '0ce0a616-0505-4dc6-b87c-4f309fdd2196',
    //   name: 'RK brand',
    //   parent_uuid: '12939d2c-7ed0-450c-85d4-294fb8735d95',
    //   type: 'child',
    // },
    // {
    //   company_uuid: '0f015b6f-c241-471b-af30-f8cd4a01b853',
    //   name: 'RK brand Rajkot',
    //   parent_uuid: '0ce0a616-0505-4dc6-b87c-4f309fdd2196',
    //   grand_uuid: '12939d2c-7ed0-450c-85d4-294fb8735d95',
    //   type: 'grandChild',
    // },
    // {
    //   company_uuid: '87e29ea4-e407-4641-a46b-81fe91e9039f',
    //   name: 'Sanariya Ceramic',
    //   parent_uuid: '',
    //   type: 'parent',
    // },
    // {
    //   company_uuid: '86383914-0a02-4af9-a953-bf7b497406a3',
    //   name: 'wall Tiles',
    //   parent_uuid: '87e29ea4-e407-4641-a46b-81fe91e9039f',
    //   type: 'child',
    // },
    // {
    //   company_uuid: 'b07718c7-e554-47dc-b860-495f42be497a',
    //   name: 'Morbi 2',
    //   grand_uuid: '87e29ea4-e407-4641-a46b-81fe91e9039f',
    //   parent_uuid: '86383914-0a02-4af9-a953-bf7b497406a3',
    //   type: 'grandChild',
    // },
    // {
    //   name: 'morbi',
    //   company_uuid: '0d9aeb81-72ef-4a48-9ce8-6978ae6e1b0b',
    //   parent_uuid: '86383914-0a02-4af9-a953-bf7b497406a3',
    //   grand_uuid: '87e29ea4-e407-4641-a46b-81fe91e9039f',
    //   type: 'grandChild',
    // },
  ]);

  const removeFromNewSkills = useCallback(
    (title: string) => {
      setSelectedOptions(
        selectedOptions.filter((option: IOption) => option?.title !== title)
      );
    },
    [selectedOptions]
  );

  const handleChangeSkill = useCallback(
    (
      event: React.SyntheticEvent,
      values: (IOption | string)[],
      reason: string
    ) => {
      // Don't remove tag with back space
      if (reason === 'removeOption') {
        return;
      }
      // Prevent to add value on enter
      for (const element of values) {
        if (typeof element === 'string') {
          return;
        }
      }
      const newValue = values as IOption[];
      setSelectedOptions(newValue);
    },
    []
  );

  const addNewValue = useCallback(
    (val: string) => {
      if (!val.trim()) {
        return;
      }
      const arrayUniqueByKey = [...selectedOptions, { uuid: '', title: val }];
      setSelectedOptions(
        arrayUniqueByKey.filter(
          (a, i) => arrayUniqueByKey.findIndex((s) => a.title === s.title) === i
        )
      );
    },
    [selectedOptions]
  );

  const removeResponseOption = useCallback(
    (data: IOrganizationStructuredDropdown) => {
      const tempData = [...selectedOptions1];
      if (data.type === 'parent') {
        const secondLevelData = tempData.filter(
          (sld) =>
            sld.grandUuid === data.companyUuid ||
            sld.parentUuid === data.companyUuid
        );
        secondLevelData.forEach((sl) => {
          const index = tempData.findIndex(
            (td) => td.companyUuid === sl.companyUuid
          );
          if (index !== -1) {
            tempData.splice(index, 1);
          }
        });
      }
      if (data.type === 'child') {
        const thirdLevelData = tempData.filter(
          (tld) => tld.parentUuid === data.companyUuid
        );
        thirdLevelData.forEach((tl) => {
          const tindex = tempData.findIndex(
            (td) => td.companyUuid === tl.companyUuid
          );
          if (tindex !== -1) {
            tempData.splice(tindex, 1);
          }
        });
      }
      const mainIndex = tempData.findIndex(
        (ele) => ele.companyUuid === data.companyUuid
      );
      if (mainIndex !== -1) {
        tempData.splice(mainIndex, 1);
      }
      setSelectedOptions1(tempData);
    },
    [selectedOptions1]
  );

  const handleChangeResponseSelectionOption = useCallback(
    (
      event: React.SyntheticEvent,
      values: Array<IOrganizationStructuredDropdown>,
      reason: string
    ) => {
      if (reason === 'removeOption') {
        return;
      }
      setSelectedOptions1(values);
    },
    []
  );

  return (
    <div className='App'>
      <Paper
        elevation={0}
        variant='outlined'
        sx={{ padding: '50px', marginBottom: '30px' }}
      >
        <Paper elevation={0} sx={{ padding: '10px', width: '100%' }}>
          <Grid container>
            <Grid item lg={6} md={6} xs={6} padding={'10px'}>
              <FormGroup>
                <InputLabel
                  htmlFor='row-radio-buttons-group'
                  style={{ alignSelf: 'self-start', fontWeight: 'bold' }}
                >
                  AutoComplete with Adding Chips
                </InputLabel>
                <Paper variant='outlined' className='paper-box'>
                  <Stack flexDirection='row' alignItems='center'>
                    <AutoCompleteWithAdd
                      id='skills'
                      placeholder='AutoComplete with Adding Chips'
                      autocompleteList={skillsList}
                      selectedOptions={selectedOptions}
                      removeAutocompleteOption={removeFromNewSkills}
                      handleAutocompleteChange={handleChangeSkill}
                      addNewValue={addNewValue}
                    />
                  </Stack>
                </Paper>
              </FormGroup>
            </Grid>
            <Grid item lg={6} md={6} xs={6} padding={'10px'}>
              <FormGroup>
                <InputLabel
                  htmlFor='row-radio-buttons-group'
                  style={{ alignSelf: 'self-start', fontWeight: 'bold' }}
                >
                  AutoComplete multi-level Dropdown
                </InputLabel>
                <Paper variant='outlined' className='paper-box'>
                  <Stack flexDirection='row' alignItems='center'>
                    <AutoCompleteWithDropdownAdd
                      id=''
                      placeholder='AutoComplete multi-level Dropdown'
                      autocompleteList={companyList}
                      selectedOptions={selectedOptions1}
                      removeAutocompleteOption={removeResponseOption}
                      handleAutocompleteChange={
                        handleChangeResponseSelectionOption
                      }
                    />
                  </Stack>
                </Paper>
              </FormGroup>
            </Grid>
            <Grid item lg={6} md={6} xs={6} padding={'10px'}>
              <FormGroup>
                <InputLabel
                  htmlFor='row-radio-buttons-group'
                  style={{ alignSelf: 'self-start', fontWeight: 'bold' }}
                >
                  Multi-level checkbox selection
                </InputLabel>

                <Paper variant='outlined' className='paper-box'>
                  <CheckBoxFilterLoadMore
                    list={filterList}
                    title={'Multi-level checkbox selection'}
                  />
                </Paper>
              </FormGroup>
            </Grid>
          </Grid>
        </Paper>
      </Paper>
    </div>
  );
}

export default App;
