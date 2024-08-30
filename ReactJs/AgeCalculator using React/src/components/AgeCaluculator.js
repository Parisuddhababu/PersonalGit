import React, { useState } from "react";
import moment from "moment";
import "./ageCaluculator.css";

const App = () => {
  const [birth, setBirth] = useState("");
  const [today, setToday] = useState(moment().format("YYYY-MM-DD"));

  const changeBirthHandler = (e) => {
    setBirth(e.target.value);
  };

  const changeTodayHandler = (e) => {
    setToday(e.target.value);
  };

  const getYearsMonthsDays = (date1, date2) => {
    const a = moment(date1);
    const b = moment(date2);

    const years = a.diff(b, "year");
    b.add(years, "years");

   
    const noOfDaysIn_A = a.daysInMonth();
    const noOfDaysIn_B = b.daysInMonth();

    let months = 0;

    if (noOfDaysIn_B > noOfDaysIn_A) {
      months = b.diff(a, "months");
      a.add(months, "months");
    }
     else {
      months = a.diff(b, "months");
      b.add(months, "months");
    }
    
    const days = a.diff(b, "days");

    const totalYears = Math.abs(years);
    const totalMonths = Math.abs(months);
    const totalDays = Math.abs(days);


    if (totalMonths === 0 && totalDays === 0 && totalYears > 0) {
      return `Happy Birthday! You are ${totalYears} years old!`;
    }

    return `${totalYears} Years ${totalMonths} Months ${totalDays} Days`;
  };


  return (
    <div className="form-page">
      <div>
        <h1>Age Calculator</h1>
        <div>

          <label htmlFor="birth">Birthday</label>
          <br />
          <input
            type="date"
            name="birth"
            id="birth"
            placeholder="Birthday"
            value={birth.length > 0 ? birth : today}
            onChange={changeBirthHandler}
          />
          <br />
          <label htmlFor="today">Today</label>
          <br />
          <input
            type="date"
            name="today"
            id="today"
            placeholder="Today"
            value={today}
            onChange={changeTodayHandler}
          />
          <br />

          <h3>
            {birth.length > 0 && today.length > 0
              ? getYearsMonthsDays(birth, today)
              : ""}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default App;
