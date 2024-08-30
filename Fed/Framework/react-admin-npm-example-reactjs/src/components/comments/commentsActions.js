import {
  FilterButton,
  sanitizeListRestProps,
  TopToolbar,
} from "react-admin";

const ListActions = (props) => {
  const { className, maxResults, ...rest } = props;

  return (
    <TopToolbar className={className} {...sanitizeListRestProps(rest)}>
      <FilterButton />
    </TopToolbar>
  );
};

export default ListActions;