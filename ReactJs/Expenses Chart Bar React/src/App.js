// import ExpenseItem from "./components/ExpenseItem";
import React,{useState} from "react";
import NewExpense from "./components/Expenses/NewExpense/NewExpense";
import Expenses  from "./components/Expenses/Expenses";


  const DUMMY_EXPENCES=[
    {id:'e1',
    title:'news paper',
    amount:200,
    date:new Date(2021,5,24)},

    {id:'e2',
    title:'Car Insurence',
    amount:300,
    date:new Date(2021,4,24)},

    {id:'e3',
    title:'Restatrent',
    amount:100,
    date:new Date(2021,8,24)},

    {id:'e4',
    title:'Games',
    amount:500,
    date:new Date(2021,10,24)},
];
const App=()=> {
const[expenses,setExpenses] =useState(DUMMY_EXPENCES);

const addExpenseHandler=expense=>{
  setExpenses(prevExpenses=>{
    return [expense,...prevExpenses];
  });
   
};



return(
  <div>
   <NewExpense onAddExpense={addExpenseHandler}/>
    <Expenses items={expenses}/>
  </div>

);

}

export default App;
