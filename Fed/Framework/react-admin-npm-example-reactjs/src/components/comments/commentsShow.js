import { EmailField, ReferenceField, Show, SimpleShowLayout, TextField } from "react-admin";

export const CommentShow = props => (
  <Show {...props}>
      <SimpleShowLayout>
          <ReferenceField source="postId" reference="posts"><TextField source="id" /></ReferenceField>
          <TextField source="id" />
          <TextField source="name" />
          <EmailField source="email" />
          <TextField source="body" />
      </SimpleShowLayout>
  </Show>
);