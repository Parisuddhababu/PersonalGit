import React from "react";

const Employee = (props) => {


const alertHandler = () => {

  alert(
 `Department: ${props.department} 

Employee_id:${props.employ_id}

Employee_age:${props.age}`);


};

  return (
    <div>
      <p>
        <label onClick={alertHandler}> {props.name}</label>
      </p>
 
    </div>
  );
};
export default Employee;
