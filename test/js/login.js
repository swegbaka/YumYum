/* eslint-disable */
// import axios from "axios";

document.querySelector(".login").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("Uname").value;
  const password = document.getElementById("Pass").value;
  login(email, password);
});
