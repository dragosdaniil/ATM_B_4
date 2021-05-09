const images = [
  "./images/img1.jpg",
  "./images/img2.jpg",
  "./images/img3.jpg",
  "./images/img4.jpg",
];

const next = document.querySelector("#next");
const prev = document.querySelector("#prev");

// CHANGES FOR A BETTER SLIDER
const slideContainer = document.querySelector(".slide-container");
const nextSlide = "nextSlide";
const activeSlide = "activeSlide";
const prevSlide = "prevSlide";

const slides = images.map((image, index) => {
  const slide = document.createElement("img");
  slide.setAttribute("src", image);
  slide.setAttribute("id", "img-" + index.toString());
  slide.classList.add("slide");
  slide.classList.add(nextSlide);
  slideContainer.appendChild(slide);
  return slide;
});

console.log(slides);

// END OF CODE
let indexPos = 0;

window.addEventListener("DOMContentLoaded", () => {
  const slide = slideContainer.querySelector(`#img-${indexPos}`);
  slide.classList.add(activeSlide);
  slide.classList.remove(nextSlide);
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
  const slideCurrent = slideContainer.querySelector(`#img-${indexPos}`);

  if (indexPos < images.length - 1) {
    indexPos += 1;

    const slideNext = slideContainer.querySelector(`#img-${indexPos}`);
    slideCurrent.classList.remove(activeSlide);
    slideCurrent.classList.add(prevSlide);
    slideNext.classList.remove(nextSlide);
    slideNext.classList.add(activeSlide);
    console.log(slideNext);
  }
  if (indexPos === images.length - 1) {
    e.currentTarget.classList.add("hide");
  }
});

prev.addEventListener("click", (e) => {
  e.currentTarget.nextElementSibling.classList.remove("hide");
  const slideCurrent = slideContainer.querySelector(`#img-${indexPos}`);
  if (indexPos > 0) {
    indexPos -= 1;
    const slidePrev = slideContainer.querySelector(`#img-${indexPos}`);
    slideCurrent.classList.remove(activeSlide);
    slideCurrent.classList.add(nextSlide);
    slidePrev.classList.remove(prevSlide);
    slidePrev.classList.add(activeSlide);
    console.log(slidePrev);
  }
  if (indexPos === 0) {
    e.currentTarget.classList.remove("show");
  }
});
