const button = document.querySelector(".nav-toggle");
const navbar = document.querySelector(".menu-bar");
const goUp = document.querySelector(".go-up");
let show = false;
button.addEventListener("click", () => {
  if (!show) {
    const height = navbar.querySelector(".links").offsetHeight;
    navbar.querySelector(".links-container").style.height =
      String(height) + "px";
    show = true;
  } else {
    navbar.querySelector(".links-container").style.height = "0px";
    show = false;
  }
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
  if (window.innerWidth >= 992) {
    const height = navbar.querySelector(".links").offsetHeight;
    navbar.querySelector(".links-container").style.height =
      String(height) + "px";
  } else {
    navbar.querySelector(".links-container").style.height = "0px";
  }
});

goUp.addEventListener("click", () => {
  window.scrollTo(0, 0);
});

const year = document.querySelector(".date");
let date = new Date();
year.textContent = date.getFullYear();
