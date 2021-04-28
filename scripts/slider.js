const images = [
  "../images/img1.jpg",
  "../images/img2.jpg",
  "../images/img3.jpg",
  "../images/img4.jpg",
];

const next = document.querySelector("#next");
const prev = document.querySelector("#prev");
let indexPos = 0;

window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("img").setAttribute("src", images[0]);
});

// SLIDE INFINITELY THROUGH IMAGES
// next.addEventListener("click", () => {
//   if (indexPos < images.length - 1) {
//     indexPos += 1;
//   } else {
//     indexPos = 0;
//   }
//   //   console.log(indexPos);
//   document.getElementById("img").setAttribute("src", images[indexPos]);
// });

// prev.addEventListener("click", () => {
//   if (indexPos > 0) {
//     indexPos -= 1;
//   } else {
//     indexPos = images.length - 1;
//   }
//   document.getElementById("img").setAttribute("src", images[indexPos]);
// });

// STOP WHEN YOU REACHED THE FIRST OR LAST IMAGE

next.addEventListener("click", (e) => {
  e.currentTarget.previousElementSibling.classList.add("show");
  if (indexPos < images.length - 1) {
    indexPos += 1;
  }
  if (indexPos === images.length - 1) {
    e.currentTarget.classList.add("hide");
  }
  document.getElementById("img").setAttribute("src", images[indexPos]);
});

prev.addEventListener("click", (e) => {
  e.currentTarget.nextElementSibling.classList.remove("hide");
  if (indexPos > 0) {
    indexPos -= 1;
  }
  if (indexPos === 0) {
    e.currentTarget.classList.remove("show");
  }
  document.getElementById("img").setAttribute("src", images[indexPos]);
});
