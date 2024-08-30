### Props Defination
| Props | Type | Required or optional | Use case
|--------| ------------| ---------- | -------- |
| children | ReactNode | optional | display element based on permissions
| permissions | string[] | required | permission list that need to be check

### JSON Structure
```
const currentUserPermissions = [ 'create', 'edit', 'delete'];
```

### Components

```
import React, { createContext, ReactNode, useState, useEffect } from "react";
interface IRoleBaseGuardProps {
  children?: ReactNode;
  permissions: string[];
}
const RoleContext = createContext(false);
const RoleBaseGuard = ({ children, permissions }: IRoleBaseGuardProps) => {
  const [view, setView] = useState<boolean>(false);
  const userPermissions = currentUserPermissions; // globlly available current user permissions
  useEffect(() => {
    if (userPermissions && userPermissions.length > 0) {
      if (permissions.some((perm) => userPermissions.includes(perm))) {
        setView(true);
      }
    }
  }, [userPermissions, permissions]);
  return (
    <RoleContext.Provider value={view}>
      {view ? children : null}
    </RoleContext.Provider>
  );
};
export default RoleBaseGuard;
```
### Calling Component
```
1) 
<RoleBaseGuard permissions={['create', 'edit']}>
  <IconButton
    edge="start"
    color="inherit"
  >
    <EditIcon />
  </IconButton>
</RoleBaseGuard>
---------------
2)
<RoleBaseGuard permissions={['view']}>
  <IconButton
    edge="start"
    color="inherit"
  >
    <EditIcon />
  </IconButton>
</RoleBaseGuard>
```

### Output Structure
```
1) Icon visible to screen
2) Icon not visible to screen
```