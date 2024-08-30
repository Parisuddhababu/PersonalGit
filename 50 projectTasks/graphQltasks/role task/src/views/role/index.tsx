import Role from "./role";
import RolePermissions from "./rolePermissions";

const RolesManager = () => {
  return (
    <div className="w-full md:flex lg:justify-between sm:flex-row">
      <div className="w-1/3  sm:w-full">
        <RolePermissions />
      </div>
      <div className="w-2/3 sm:w-full">
        <Role />
      </div>
    </div>
  );
};
export default RolesManager;
