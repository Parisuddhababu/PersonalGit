const express = require("express");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs").promises;
const path = require("path");
const cors = require("cors");
const { body, validationResult } = require("express-validator");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors("*"));

const userData = path.join(__dirname, "/user.json");

// helper to read the file
const readUsersFileData = async () => {
  try {
    const data = await fs.readFile(userData, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    return err;
  }
};
// helper to write the file
const writeUsersData = async (users) => {
  await fs.writeFile(userData, JSON.stringify(users, null, 2));
};

const getErrorMessages = (errors) => {
  return errors.array().map((error) => error.msg);
};

app.post(
  "/api/users/create",
  [
    body("firstname").notEmpty().withMessage("First name is required"),
    body("lastname").notEmpty().withMessage("Last name is required"),
    body("email").isEmail().withMessage("Invalid email address"),
    body("phoneNumber")
      .isNumeric()
      .withMessage("Phone number must be a number"),
    body("status").isIn([0, 1]).withMessage("Status must be either 0 or 1"),
    body("company.companyName")
      .notEmpty()
      .withMessage("Company name is required"),
    body("company.employeeNo")
      .isNumeric()
      .withMessage("Employee number must be a number"),
    body("company.skills.front")
      .notEmpty()
      .withMessage("Frontend skills are required"),
    body("company.skills.backend")
      .notEmpty()
      .withMessage("Backend skills are required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = getErrorMessages(errors);
      return res.status(400).json({ errors: errorMessages });
    }
    try {
      const userData = await readUsersFileData();
      let newUsers = {
        id: uuidv4(),
        firstName: req.body.firstname,
        lastName: req.body.lastname,
        email: req.body.email,
        phoneNo: req.body.phoneNumber,
        status: req.body.status,
        company: {
          companyName: req.body.company.companyName,
          employeeNo: req.body.company.employeeNo,
          skills: {
            front: req.body.company.skills.front,
            backend: req.body.company.skills.backend,
          },
        },
      };
      userData.push(newUsers);
      await writeUsersData(userData);
      res.status(201).json(newUsers);
    } catch (err) {
      res.status(400).json(err);
    }
  }
);
//get users
app.get("/api/users", async (req, res) => {
  try {
    let usersData = await readUsersFileData();
    let filterUsersData = usersData;

    // Search filter
    if (req.query.search) {
      const searchTerm = req.query.search.toLowerCase();
      filterUsersData = filterUsersData.filter(
        (user) =>
          user.firstName.toLowerCase().includes(searchTerm) ||
          user.lastName.toLowerCase().includes(searchTerm) ||
          user.email.toLowerCase().includes(searchTerm)
      );
    }

    // First name filter
    if (req.query.firstName) {
      const firstNameFilter = req.query.firstName.toLowerCase();
      filterUsersData = filterUsersData.filter((user) =>
        user.firstName.toLowerCase().includes(firstNameFilter)
      );
    }

    // Last name filter
    if (req.query.lastName) {
      const lastnameFilter = req.query.lastName.toLowerCase();
      filterUsersData = filterUsersData.filter((user) =>
        user.lastName.toLowerCase().includes(lastnameFilter)
      );
    }

    // Sorting
    if (req.query.sortBy) {
      const sortBy = req.query.sortBy;
      const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
      filterUsersData.sort((a, b) => {
        if (a[sortBy] < b[sortBy]) return -1 * sortOrder;
        if (a[sortBy] > b[sortBy]) return 1 * sortOrder;
        return 0;
      });
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = {};

    if (endIndex < filterUsersData.length) {
      results.next = {
        page: page + 1,
        limit: limit
      };
    }

    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit
      };
    }

    results.results = filterUsersData.slice(startIndex, endIndex);
    results.totalPages = Math.ceil(filterUsersData.length / limit);
    results.currentPage = page;

    res.json(results);
  } catch (err) {
    res.status(400).json({ message: error.message });
  }
});

app.delete("/api/users/delete/:id", async (req, res) => {
  try {
    let userData = await readUsersFileData();
    const initialData = userData.length;
    userData = userData.filter((user) => user.id !== req.params.id);
    if (userData.length === initialData) {
      return res.status(401).json({ message: "user not found" });
    }
    await writeUsersData(userData);
    res.json({ message: "user deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err });
  }
});

app.put(
  "/api/users/update/:id",
  [
    body("firstname")
      .optional()
      .notEmpty()
      .withMessage("First name is required"),
    body("lastname").optional().notEmpty().withMessage("Last name is required"),
    body("email").optional().isEmail().withMessage("Invalid email address"),
    body("phoneNumber")
      .optional()
      .isNumeric()
      .withMessage("Phone number must be a number"),
    body("status")
      .optional()
      .isIn([0, 1])
      .withMessage("Status must be either 0 or 1"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = getErrorMessages(errors);
      return res.status(400).json({ errors: errorMessages });
    }
    try {
      let userData = await readUsersFileData();
      const index = userData.findIndex((user) => user.id === req.params.id);
      if (index === -1) return res.json({ message: "no user found" });
      userData[index] = {
        ...userData[index],
        firstName: req.body.firstname || userData[index].firstName,
        lastName: req.body.lastname || userData[index].lastName,
        email: req.body.email || userData[index].email,
        phoneNo: req.body.phoneNumber || userData[index].phoneNo,
        status: req.body.status || userData[index].status,
      };
      await writeUsersData(userData);
      res.status(200).json(userData[index]);
    } catch (err) {
      res.status(400).json({ message: "user not updated" });
    }
  }
);

app.get("/api/users/:id", async (req, res) => {
  try {
    let userData = await readUsersFileData();
    const index = userData.findIndex((user) => user.id === req.params.id);
    if (index === -1) return res.json({ message: "no user found" });
    res.json(userData[index]);
  } catch (err) {
    res.status(400).json({ message: err });
  }
});

app.listen(5558, () => {
  console.log("server started successfully");
});
