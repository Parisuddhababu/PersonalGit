import React, { useState } from "react";
import Card from "../UI/Card";
import './expenses.css';
import ExpensesList from "./ExpensesList";
import ExpensesFilter from "./NewExpense/ExpenseFilter";
import ExpensesChart from "./ExpensesChart";

const Expenses=(props)=>{
  const [filteredYear,setFilteredYear]=useState('2020');

  const filterChangeHandler=selectedYear=>{
    setFilteredYear(selectedYear);
  };

  const filteredExpenses=props.items.filter(expense=>{
    return expense.date.getFullYear().toString()===filteredYear;
  });

  
    return (
      <div>
        <Card className="expenses">
          <ExpensesFilter 
          selected={filteredYear}
           onChangeFilter={filterChangeHandler}/>

           <ExpensesChart expenses={filteredExpenses}/>
           <ExpensesList items={filteredExpenses}/>
        </Card>
      </div>
      );
    };
    export default Expenses;