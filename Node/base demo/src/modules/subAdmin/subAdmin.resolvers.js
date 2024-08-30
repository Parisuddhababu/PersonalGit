import validate, { subAdminSchema, updateSubAdminSchema } from "../../validations/subAdmin.js";

let SubAdmins = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phoneNo: "123-456-7890",
    company: {
      companyName: "brain",
      employeeId: "321323",
      skills: ["react", "next"],
    },
  },
];

// Function to create meta object
const createMeta = (message, messagecode, status) => ({
  message,
  messagecode,
  status,
});

export const subAdminResolvers = {
  Query: {
    subAdmins: () => {
      return SubAdmins.map((admin) => ({
        ...admin,
        meta: createMeta("SubAdmins fetched successfully", "200", "success"),
      }));
    },
    subAdmin: (parent, args) => {
      const admin = SubAdmins.find((admin) => admin.id === args.id);
      if (!admin) {
        return {
          meta: createMeta("SubAdmin not found", "404", "error"),
        };
      }
      return {
        ...admin,
        meta: createMeta("SubAdmin fetched successfully", "200", "success"),
      };
    },
  },
  Mutation: {
    createSubAdmin: (parent, args) => {
      validate(subAdminSchema, args);
      const newSubAdmin = {
        id: Number(SubAdmins.length + 1).toString(),
        ...args,
        meta: createMeta("SubAdmin created successfully", "201", "success"),
      };
      SubAdmins.push(newSubAdmin);
      return newSubAdmin;
    },

    updateSubAdmin: (parent, args) => {
      validate(updateSubAdminSchema, args);
      const updateAdmin = SubAdmins.find((admin) => admin.id === args.id);
      if (!updateAdmin)
        return {
          meta: createMeta("SubAdmin not found", "404", "error"),
        };
      Object.assign(updateAdmin, args);
      updateAdmin.meta = createMeta(
        "SubAdmin updated successfully",
        "200",
        "success"
      );
      return updateAdmin;
    },
    deleteSubAdmin: (parent, args) => {
      const deleteAdmin = SubAdmins.findIndex((admin) => admin.id === args.id);
      if (deleteAdmin === -1)
        return {
          meta: createMeta("SubAdmin not found", "404", "error"),
        };
      const [deletedAdmin] = SubAdmins.splice(deleteAdmin, 1);
      deletedAdmin.meta = createMeta(
        "SubAdmin deleted successfully",
        "200",
        "success"
      );
      return deletedAdmin;
    },
  },
};
