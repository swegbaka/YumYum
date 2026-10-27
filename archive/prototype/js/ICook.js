var menuBotton = document.getElementById("menuBotton");
var NavPanel = document.getElementById("NavPanel");
var menu = document.getElementById("menu");
var autotype = document.getElementsByClassName("auto-input");

NavPanel.style.right = "-250px";

menuBotton.onclick = function () {
  if (NavPanel.style.right == "-250px") {
    NavPanel.style.right = "0";
    menu.src = "img/close.png";
  } else {
    NavPanel.style.right = "-250px";
    menu.src = "img/menu.png";
  }
};

autotype = new Typed(".auto-input", {
  strings: [
    "Don't know what to eat? No worry we gotcha!",
    "Ready to cook?",
    "Cooking isn't that hard",
  ],
  typeSpeed: 110,
  backSpeed: 100,
  loop: true,
});

// let img = document.querySelector("#display > img");
// let btn_veg = document.querySelectorAll(".veg-table > button");
// let btn_meat = document.querySelectorAll(".meat-table > button");
// let btn_cookware = document.querySelectorAll(".cookware-table > button");

// // display vegetable
// for (let i = 0; i < btn_veg.length; i++) {
//   btn_veg[i].onclick = function () {
//     document
//       .querySelector(".veg-table > button.veg-butn-on ")
//       .classList.remove("-on");
//     this.classList.add("-on");
//     result.innerHTML = btn_veg[i].innerHTML;
//   };
// }

// for (let i = 0; i < btn_meat.length; i++) {
//   btn_meat[i].onclick = function () {
//     document
//       .querySelector(".meat-table > button.meat-butn-on ")
//       .classList.remove("-on");
//     this.classList.add("-on");
//     result.innerHTML = btn_meat[i].innerHTML;
//   };
// }

// for (let i = 0; i < btn_cookware.length; i++) {
//   btn_cookware[i].onclick = function () {
//     document
//       .querySelector(".cookware-table > button.cookware-butn-on ")
//       .classList.remove("-on");
//     this.classList.add("-on");
//     result.innerHTML = btn_cookware[i].innerHTML;
//   };
// }
