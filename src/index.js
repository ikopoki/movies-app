import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

// const url =
//   "https://api.themoviedb.org/3/search/movie?include_adult=false&language=en-US&page=1";
// const options = { method: "GET", headers: { accept: "application/json" } };

// fetch(url, options)
//   .then((res) => res.json())
//   .then((json) => console.log(json))
//   .catch((err) => console.error("error:" + err));

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
