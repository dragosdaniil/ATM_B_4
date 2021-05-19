const button = document.querySelector(".nav-toggle");
const navbar = document.querySelector(".menu-bar");
const goUp = document.querySelector(".go-up");

button.addEventListener("click", () => {
  navbar.querySelector(".links").classList.toggle("show");
});

/* Functionality for the nav-bar; it becomes fixed
after a certain scroll length is exceeded 
I purposedly avoided using position:sticky */

window.addEventListener("scroll", () => {
  if (window.scrollY >= 150) {
    navbar.classList.add("move-bar");
    goUp.style.display = "block";
  } else {
    navbar.classList.remove("move-bar");
    goUp.style.display = "none";
  }
});

window.addEventListener("resize", () => {
  console.log(window.innerWidth);
  if (window.innerWidth >= 992) {
    navbar.querySelector(".links").classList.remove("show");
  }
});

goUp.addEventListener("click", () => {
  window.scrollTo(0, 0);
});

const year = document.querySelector(".date");
let date = new Date();
year.textContent = date.getFullYear();
