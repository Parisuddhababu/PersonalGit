export type RolePermissionsProps = {
  roleId: number | null | string;
};
export interface TreeViewArr {
  label: React.ReactNode;
  value: string;
  children?: Array<Node>;
  className?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  showCheckbox?: boolean;
  title?: string;
  // checked?: boolean;
}
