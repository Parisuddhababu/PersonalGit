// resolvers.js
let users = [
    { id: "1", firstname: "John", lastname: "Doe", email: "john@example.com", phone: "123-456-7890", company: "Company A" },
    { id: "2", firstname: "Jane", lastname: "Doe", email: "jane@example.com", phone: "098-765-4321", company: "Company B" },
  ];
  
  export const resolvers = {
    Query: {
      users: () => users,
      user: (parent, args) => users.find(user => user.id === args.id),
    },
    Mutation: {
      createUser: (parent, args) => {
        const newUser = { id: String(users.length + 1), ...args };
        users.push(newUser);
        return newUser;
      },
      updateUser: (parent, args) => {
        const user = users.find(user => user.id === args.id);
        if (!user) return null;
        Object.assign(user, args);
        return user;
      },
      deleteUser: (parent, args) => {
        const userIndex = users.findIndex(user => user.id === args.id);
        if (userIndex === -1) return null;
        const [deletedUser] = users.splice(userIndex, 1);
        return deletedUser;
      },
    },
  };
  