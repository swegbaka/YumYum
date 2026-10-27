// import Beef from "../models/beefMode.js";
// const Beef = require("../models/beefMode");

let b = 1;

var meatButtons = document.querySelectorAll(".meat-butn-on");
var foodNames = document.querySelectorAll(".testing");

// const food = Beef({}, { _id: 0, foodName: 0, Link: 1, emoji: 0 });

// assign each button using className
meatButtons.forEach((t, i) => {
  t.addEventListener("click", function () {
    b++;
    if (b % 2 == 0) {
      foodNames[i].style.display = "block";
    } else {
      foodNames[i].style.display = "none";
    }
  });
});
