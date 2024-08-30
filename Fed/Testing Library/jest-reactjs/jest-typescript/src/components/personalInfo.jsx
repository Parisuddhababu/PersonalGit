import React from "react";
import '../assets/main.css';
const PersonalInfo = () => {

  return (
    <>
      <form>
        <h1>Personal Info</h1>

        <label htmlFor="first_name">First Name:</label>
        <input type="text" id="first_name" name="first_name" required pattern="/^([^0-9]*)$/" />
        
        <label htmlFor="last_name">Last Name:</label>
        <input type="text" id="last_name" name="last_name" required pattern="/^([^0-9]*)$/" />
        
        <label htmlFor="job_title">Job Title:</label>
        <input type="text" id="job_title" name="job_title" />

        <label htmlFor="phone_number">Phone Number:</label>
        <input type="text" id="phone_number" name="phone_number" required pattern="/^\+(?=.{10})\d{10,15}_{0,5}$/" />
        
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" required />
        
        <button type="submit">Save</button>
      </form>
    </>
  )
}

export default PersonalInfo;