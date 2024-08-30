import Card from '../UI/Card';
import classes from './AvailableMeals.module.css';
import MealItem from './MealItem/MealItem';
import { useEffect,useState } from 'react';

// const DUMMY_MEALS = [
//     {
//       id: 'm1',
//       name: 'Sushi',
//       description: 'Finest fish and veggies',
//       price: 22.99,
//     },
//     {
//       id: 'm2',
//       name: 'Schnitzel',
//       description: 'A german specialty!',
//       price: 16.5,
//     },
//     {
//       id: 'm3',
//       name: 'Barbecue Burger',
//       description: 'American, raw, meaty',
//       price: 12.99,
//     },
//     {
//       id: 'm4',
//       name: 'Green Bowl',
//       description: 'Healthy...and green...',
//       price: 18.99,
//     },
//   ];

  const AvailableMeals=()=>{

    const [meals,setMeals]=useState([]);
    const [isLoading,setIsLoading]=useState(true);
    const [httpError,setHttpError]=useState();

    useEffect(()=>{

      const fetchMeals=async()=>{
        const response=await fetch('https://react-http-4ea8e-default-rtdb.firebaseio.com/meals.json');

        if (!response.ok){
          throw new Error("something went wrong");
        }

        const responseData=await response.json();
         
        const loadedMeals=[];

        for (let key in responseData){
          loadedMeals.push({
            id:key,
            name:responseData[key].name,
            price:responseData[key].price,
            description:responseData[key].description
          });
      };

      setMeals(loadedMeals);
      setIsLoading(false);
   };

      fetchMeals().catch((error)=>{
        setIsLoading(false);
        setHttpError(error.message);
      
      });


    },[])

    if(isLoading){
      return (
        <section className={classes.isLoading}>
          <p>Loading....</p>
        </section>
      )
    };

    if(httpError){
      return(
        <section>
          <p className={classes.mealsError}>{httpError}</p>
        </section>
      )
    };

    const mealsList=meals.map((meal)=>
    <MealItem 
    id={meal.id}
    key={meal.id}
     name={meal.name}
      description={meal.description} 
      price={meal.price} />
      );
    return <section className={classes.meals}>
        <Card>
        <ul>
            {mealsList}
        </ul>
        </Card>
    </section>
  };

  export default AvailableMeals;
