import {useEffect, useRef,useState} from "react";

const SimpleInput = (props) => {
  const nameInputRef=useRef();
  const [enteredInput, setEnterdInput]=useState();
  const [enterdInputIsValid, setEnterdInputIsValid]=useState(false);
  const [enterNameIsTouched,setEnteredNameIsTouched]= useState(false);


  useEffect(()=>{
    if(enterdInputIsValid){
      console.log("Name Input Is Valid");
    }
  },[enterdInputIsValid])

  const nameInputChangeHandler=(event)=>{
       setEnterdInput(event.target.value);

       if(enteredInput.trim() !== ""){
        setEnterdInputIsValid(true);
        
      } 
  } ;

  const nameInputBlurHandler=(event)=>{
    setEnteredNameIsTouched(true);

    if(enteredInput.trim() === ""){
      setEnterdInputIsValid(false);
     
    } 
     
  };

  const formSubmitHandler=(event)=>{
    event.preventDefault();
    setEnteredNameIsTouched(true);

    if(enteredInput.trim() === ""){
      setEnterdInputIsValid(false);
      return;
    }
    setEnterdInputIsValid(true);

    console.log(enteredInput);
    setEnterdInput('');

  };
  
  const nameInputIsInvalid= !enterdInputIsValid && enterNameIsTouched;
  const nameInputClasses=nameInputIsInvalid ? 'form-control invalid':'form-control' ;

  return (
    <form onSubmit={formSubmitHandler}>
      <div className={nameInputClasses}>
        <label htmlFor='name'>Your Name</label>
        <input 
        ref={nameInputRef}
        type = 'text' 
        id = 'name' 
        onBlur={nameInputBlurHandler}
        onChange={nameInputChangeHandler}
        />
      {nameInputIsInvalid && <p className="error-text">name is not be empty</p>}
        
      </div>
      <div className="form-actions">
        <button>Submit</button>
      </div>
    </form>
  );
};

export default SimpleInput;
