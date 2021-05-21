const images = [
  "./images/presentation/slide1.png",
  "./images/presentation/slide2.png",
  "./images/presentation/slide3.png",
  "./images/presentation/slide4.png",
  "./images/presentation/slide5.png",
  "./images/presentation/slide6.png",
  "./images/presentation/slide7.png",
  "./images/presentation/slide8.png",
  "./images/presentation/slide9.png",
  "./images/presentation/slide10.png",
  "./images/presentation/slide11.png",
  "./images/presentation/slide12.png",
];

const data = ["Team B", "Bla Bla Bla"];

const next = document.querySelector("#next");
const prev = document.querySelector("#prev");

// CHANGES FOR A BETTER SLIDER
const slideContainer = document.querySelector(".slide-container");
const nextSlide = "nextSlide";
const activeSlide = "activeSlide";
const prevSlide = "prevSlide";

const createSlide = (image, index) => {
  const slide = document.createElement("div");
  const imgSlide = document.createElement("img");

  slide.setAttribute("id", "slide-" + index.toString());
  slide.classList.add("slide");
  slide.classList.add(nextSlide);

  imgSlide.setAttribute("src", image);
  imgSlide.classList.add("slide-img");

  slide.appendChild(imgSlide);
  slideContainer.appendChild(slide);

  return slide;
};

images.map((image, index) => createSlide(image, index));

// END OF CODE
let indexPos = 0;

window.addEventListener("DOMContentLoaded", () => {
  const slide = slideContainer.querySelector(`#slide-${indexPos}`);
  slide.classList.add(activeSlide);
  slide.classList.remove(nextSlide);
});

// SLIDE INFINITELY THROUGH IMAGES
// also doesn't have the fade-in fade-out effect implemented
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

/* The code below creates the "slide-show" for the presentation by using
  predefined CSS classes and attributes. It also has a "fade-in fade-out" 
  effect when changing slides. */

next.addEventListener("click", (e) => {
  e.currentTarget.previousElementSibling.classList.add("show-btn");
  const slideCurrent = slideContainer.querySelector(`#slide-${indexPos}`);

  if (indexPos < images.length - 1) {
    indexPos += 1;

    const slideNext = slideContainer.querySelector(`#slide-${indexPos}`);
    slideCurrent.classList.remove(activeSlide);
    slideCurrent.classList.add(prevSlide);
    slideNext.classList.remove(nextSlide);
    slideNext.classList.add(activeSlide);
    console.log(slideNext);
  }
  if (indexPos === images.length - 1) {
    e.currentTarget.classList.add("hide-btn");
  }
});

prev.addEventListener("click", (e) => {
  e.currentTarget.nextElementSibling.classList.remove("hide-btn");
  const slideCurrent = slideContainer.querySelector(`#slide-${indexPos}`);
  if (indexPos > 0) {
    indexPos -= 1;
    const slidePrev = slideContainer.querySelector(`#slide-${indexPos}`);
    slideCurrent.classList.remove(activeSlide);
    slideCurrent.classList.add(nextSlide);
    slidePrev.classList.remove(prevSlide);
    slidePrev.classList.add(activeSlide);
    console.log(slidePrev);
  }
  if (indexPos === 0) {
    e.currentTarget.classList.remove("show-btn");
  }
});
