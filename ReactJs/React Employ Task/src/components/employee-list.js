
import Employee from "./employee";
import Card from '../UI/Card';
import classes from '../components/employee-list';

const EMPLOYEES = [
  {
    id: 'a1',
    name: "leela",
    age: 25,
    employ_id: 123,
    department: "reactjs",
  },
  {
    id: 'a2',
    name: "umesh",
    age: 28,
    employ_id: 456,
    department: "reactjs",
  },
  {
    id: 'a3',
    name: "Pavan",
    age: 24,
    employ_id: 789,
    department: "reactjs",
  },
  {
    id: 'a4',
    name: "Bharat",
    age: 23,
    employ_id: 146,
    department: "reactjs",
  },
  {
    id: 'a5',
    name: "srikanth",
    age: 23,
    employ_id: 146,
    department: "node js",
  },

  {
    id: 'a6',
    name: "siva",
    age: 23,
    employ_id: 146,
    department: "node js",
  },
];


const Employees = () => {
// const [isVisible, setIsVisible] = useState(false);

  const employeeList = EMPLOYEES.map((emp) => (
    <Employee
      key={emp.id}
      id={emp.id}
      name={emp.name}
      age={emp.age}
      employ_id={emp.employ_id}
      department={emp.department}
    />
  ));

  return (
    <div>
      <Card>
        <h2 >Employee Names</h2>
        <ul className={classes.ul}>
            {employeeList}
        </ul>
      </Card>
    </div>
  );
};
export default Employees;
