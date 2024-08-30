import React, { useCallback, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { APIServices } from "../services/Common";
import { COUNTRY } from "../constant/Api";
import CountryDetailsShow from "./CountryDetailsShow";
import Alert from "@mui/material/Alert";
import "../component/Country.css";
export default function CountryDetails() {
  const [country, setCountry] = useState("");
  const [countryDetails, setCountryDetails] = useState([]);
  const [error, setError] = useState("");

  const setCountryName = useCallback((e: any) => {
    setCountry(e.target.value);
  }, []);

  const getCountryDetails = useCallback(
    (e: any) => {
      if (country) {
        APIServices.getData(`${COUNTRY}/${country}`).then(
          (res) => {
            setCountryDetails(res.data);
            setError('');
          },
          (err) => {
            setError(err.response.data.message);
          }
        );
      }
    },
    [country]
  );

  const reSetCountryDetails = useCallback(() => {
    setCountryDetails([]);
  }, []);

  return (
    <>
      <h2>COUNTRY WEATHER</h2>
      <div className="country-inputbox">
        <TextField
          id="outlined-basic"
          label="Enter Countery"
          variant="outlined"
          onChange={setCountryName}
        />
      </div>
      <div>
        <Button
          variant="contained"
          disabled={!country}
          onClick={getCountryDetails}
          style={{ margin: "20px" }}
        >
          Submit
        </Button>
        <Button variant="contained" onClick={reSetCountryDetails} color="error">
          cancel
        </Button>
      </div>
      <hr />
      <div>
        {countryDetails.length > 0 && (
          <CountryDetailsShow countryData={countryDetails} />
        )}
        {error.length ? <Alert severity="error">{error}</Alert> : ""}
      </div>
    </>
  );
}
