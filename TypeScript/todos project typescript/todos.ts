
const TodosItemsContainer=document.getElementById("TodosItemsContainer")! as HTMLDivElement;
const AddToBtn=document.getElementById("AddToBtn") ! as HTMLButtonElement;

interface todolist{
    text:string;
    uniqueNo:number;
    labelId:number;
}
//for default 

const todoList=[{text:"html",uniqueNo:1}];

let todosCount:number =todoList.length;

//To check and uncheck the tasks//

const onTodoStatusChange=(labelId:any)=>{

    const labelElement = document.getElementById(labelId)! as HTMLLabelElement;
  
    labelElement.classList.toggle('checked');
  }


const createAndAppendTodo=(todo:{text:string,uniqueNo:number})=>{
    const todoId='todo'+todo.uniqueNo;
    const labelId='label'+todo.uniqueNo;
    const checkboxId='checkbox'+todo.uniqueNo;
    
    //for list
    const todoElement=document.createElement("li")! as HTMLLIElement;
    todoElement.classList.add("todo-item-container", "d-flex", "flex-row");
    todoElement.id=todoId;
    TodosItemsContainer.appendChild(todoElement);

    //checkbox
    const inputElement =document.createElement("input")! as HTMLInputElement;
    inputElement.type="checkbox";
    inputElement.id=checkboxId;
    inputElement.classList.add("checkbox-input");

    todoElement.appendChild(inputElement);


  inputElement.onclick = ()=> {
    onTodoStatusChange(labelId);
  }



    //label container 
    const labelContainer=document.createElement("div")! as HTMLDivElement;
    labelContainer.classList.add("label-container","d-flex","flex-row");
    todoElement.appendChild(labelContainer);

    const labelElement = document.createElement("label")! as HTMLLabelElement;
    labelElement.setAttribute("for", checkboxId);
    labelElement.id = labelId;
    labelElement.classList.add("checkbox-label");
    labelElement.textContent=todo.text;
    labelContainer.appendChild(labelElement);

    const editBtn=document.createElement("input")! as HTMLInputElement;
    editBtn.type="text";
    editBtn.classList.add("editBtn");
    labelContainer.append(editBtn);

    editBtn.addEventListener("keydown",(event:any)=>{
        if (event.key==="Enter"){
            labelElement.textContent=event.target.value;
            editBtn.value="";
        }
    });


  //................select options.......................................//

    const select=document.createElement("select") ! as HTMLSelectElement;
    labelContainer.appendChild(select);
    

    const option1 = document.createElement("option")! as HTMLOptionElement;
    option1.textContent="--Select--";
    select.appendChild(option1);

    const option2 = document.createElement("option")! as HTMLOptionElement;
    option2.textContent="todo";
    select.appendChild(option2);

    const option3= document.createElement("option")! as HTMLOptionElement;
    option3.textContent="in-progress";
    select.appendChild(option3);

    const option4= document.createElement("option")! as HTMLOptionElement;
    option4.textContent="testing";
    select.appendChild(option4);

    const option5= document.createElement("option")! as HTMLOptionElement;
    option5.textContent="Completed";
    select.appendChild(option5);

    select.addEventListener("change",function(event:any){
        if (event.target.value==="Completed"){
            labelContainer.removeChild(deleteIconContainer);
        }
        else if (event.target.value==="testing"){
            select.removeChild(option3);
        }

        else{
            labelContainer.appendChild(deleteIconContainer);
            select.appendChild(option3);
        };
    })


//delete container

    const deleteIconContainer = document.createElement("div") ! as HTMLDivElement;
    deleteIconContainer.classList.add("delete-icon-container");
    labelContainer.appendChild(deleteIconContainer);

    const deleteIcon=document.createElement("i") ! as HTMLIFrameElement;
    deleteIcon.classList.add("far", "fa-trash-alt", "delete-icon");
    deleteIconContainer.appendChild(deleteIcon);

    deleteIcon.onclick=()=>{
        onDeleteTodo(todoId);
    };
}
const onDeleteTodo=(todoId:string)=>{
    const todoElement=document.getElementById(todoId)! as HTMLInputElement;
    TodosItemsContainer.removeChild(todoElement);
}


for (let todo of todoList){
    createAndAppendTodo(todo);
}

//if input empty

const onAddTodo=()=>{
    const userInputElement=document.getElementById('todoUserInput') ! as HTMLInputElement;
    const userInputValue:string=userInputElement.value;

    if(userInputValue===""){
        alert("add something");
        return;
    }

todosCount=todosCount+1;
//apending new todo// 

const newTodo:{text:string,uniqueNo:number}={
    text:userInputValue,
    uniqueNo:todosCount
};

createAndAppendTodo(newTodo);
userInputElement.value="";
todoList.push(newTodo);
}
// add button 

AddToBtn.onclick=()=>{
    onAddTodo();
   
}


const sorting=document.getElementById("menu") ! as HTMLSelectElement;

sorting.addEventListener("click", function () {

    const selectedOption = sorting.value;
  

    if (selectedOption === "Ascending") {
        todoList.sort((a:any, b:any) => (a.text).localeCompare(b.text));
        TodosItemsContainer.innerHTML = "";

        for (let todo of todoList) {
            createAndAppendTodo(todo);
        }
    } else if (selectedOption === "Descending") {
        todoList.sort((a:any, b:any) => (b.text).localeCompare(a.text));
        TodosItemsContainer.innerHTML = "";

        for (let todo of todoList) {
            createAndAppendTodo(todo);
        }
    }
});