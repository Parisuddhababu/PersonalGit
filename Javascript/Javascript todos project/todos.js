'use strict';
let TodosItemsContainer=document.getElementById("TodosItemsContainer");
let AddToBtn=document.getElementById("AddToBtn");


let todoList=[
    {
        text:"html",
        uniqueNo:1
    },
    {
        text:"css",
        uniqueNo:2
    }
 
];




let todosCount=todoList.length;



function onTodoStatusChange(checkboxId, labelId) {
    let checkboxElement = document.getElementById(checkboxId);
    let labelElement = document.getElementById(labelId);
  
    labelElement.classList.toggle('checked');
  }
  


//delete element

function onDeleteTodo(todoId){
let todoElement=document.getElementById(todoId);
TodosItemsContainer.removeChild(todoElement);
}

function createAndAppendTodo(todo){
    let todoId='todo'+todo.uniqueNo;
    let labelId='label'+todo.uniqueNo;
    let checkboxId='checkbox'+todo.uniqueNo;
    
    //for list
    let todoElement=document.createElement("li");
    todoElement.classList.add("todo-item-container", "d-flex", "flex-row");
    todoElement.id=todoId;
    TodosItemsContainer.appendChild(todoElement);
    //checkbox
    let inputElement =document.createElement("input");
    inputElement.type="checkbox";
    inputElement.id=checkboxId;
    inputElement.classList.add("checkbox-input");

    todoElement.appendChild(inputElement);


  inputElement.onclick = function() {
    onTodoStatusChange(checkboxId, labelId);
  }


    //label container 
    let labelContainer=document.createElement("div");
    labelContainer.classList.add("label-container","d-flex","flex-row");
    todoElement.appendChild(labelContainer);

    let labelElement = document.createElement("label");
    labelElement.setAttribute("for", checkboxId);
    labelElement.id = labelId;
    labelElement.classList.add("checkbox-label");
    labelElement.textContent=todo.text;
    labelContainer.appendChild(labelElement);

    let editBtn=document.createElement("input");
    editBtn.type="text";
    editBtn.classList.add("editBtn");
    labelContainer.append(editBtn);

    editBtn.addEventListener("keyup",function(event){
        if (event.key==="Enter"){
            labelElement.textContent=event.target.value;
            editBtn.value="";
        }
    });





  //select options
    const select=document.createElement("select");
    labelContainer.appendChild(select);
    

    const option1 = document.createElement("option");
    option1.textContent="--Select--";
    select.appendChild(option1);

    const option2 = document.createElement("option");
    option2.textContent="todo";
    select.appendChild(option2);

    const option3= document.createElement("option");
    option3.textContent="in-progress";
    select.appendChild(option3);

    const option4= document.createElement("option");
    option4.textContent="testing";
    select.appendChild(option4);

    const option5= document.createElement("option");
    option5.textContent="Completed";
    select.appendChild(option5);

    select.addEventListener("change",function(event){
        if (event.target.value==="Completed"){
            labelContainer.removeChild(deleteIconContainer);
        }
        else{
            labelContainer.appendChild(deleteIconContainer);
        };
    })

//delete container

    let deleteIconContainer = document.createElement("div");
    deleteIconContainer.classList.add("delete-icon-container");
    labelContainer.appendChild(deleteIconContainer);

    let deleteIcon=document.createElement("i");
    deleteIcon.classList.add("far", "fa-trash-alt", "delete-icon");
    deleteIconContainer.appendChild(deleteIcon);

    deleteIcon.onclick=function(){
        onDeleteTodo(todoId);
    };
}

for (let todo of todoList){
    createAndAppendTodo(todo);
}

//if input empty

function onAddTodo(){
    let userInputElement=document.getElementById('todoUserInput');
    let userInputValue=userInputElement.value;

    if(userInputValue===""){
        alert("add something");
        return;
    }

todosCount=todosCount+1;

let newTodo={
    text:userInputValue,
    uniqueNo:todosCount
};

createAndAppendTodo(newTodo);
userInputElement.value="";

}

AddToBtn.onclick=function(){
    onAddTodo();
}
let sorting=document.getElementById("menu");

sorting.addEventListener("click", function () {

    let selectedOption = sorting.value;
    console.log(selectedOption)

    if (selectedOption === "Ascending") {
        todoList.sort((a, b) => a.text.localeCompare(b.text));
        TodosItemsContainer.innerHTML = "";
        for (let todo of todoList) {
            createAndAppendTodo(todo);
        }
    } else if (selectedOption === "Descending") {
        todoList.sort((a, b) => b.text.localeCompare(a.text));
        TodosItemsContainer.innerHTML = "";
        for (let todo of todoList) {
            createAndAppendTodo(todo);
        }
    }
});