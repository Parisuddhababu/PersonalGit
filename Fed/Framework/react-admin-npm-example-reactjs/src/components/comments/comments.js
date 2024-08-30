import {
  Datagrid,
  EditButton,
  EmailField,
  List,
  ShowButton,
  TextField,
  TextInput,
} from 'react-admin';
import ListActions from './commentsActions';

const postFilters = [
  <TextInput source='q' label='Search' alwaysOn key='searchInput' />,
];

export const CommentList = (props) => (
  <List {...props} filters={postFilters} actions={<ListActions />}>
    <Datagrid rowClick='edit'>
      <TextField source='id' />
      <TextField source='name' />
      <EmailField source='email' />
      <TextField source='body' />
      <ShowButton />
      <EditButton />
    </Datagrid>
  </List>
);
