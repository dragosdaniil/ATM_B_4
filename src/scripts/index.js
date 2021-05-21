import { Sector, Flight } from "./drawUtils.js";
import * as constants from "./constants.js";
import { newPoint } from "./utils.js";

const noFlights = 8;
let simTimeoutUp;
let simTimeoutDown;
let countTimeout;
let counterMopug = 0;
let counterBudop = 0;
let map;

let elemMopug = document.getElementById("MOPUG");
let elemBudop = document.getElementById("BUDOP");
let elemNW = document.getElementById("UP");
let elemSE = document.getElementById("DOWN");

const myLatLng = new google.maps.LatLng(46.493055, 23.168889);

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 7,
    center: myLatLng,
    styles: [
      { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
      { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
      { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
      {
        featureType: "administrative.locality",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },
      {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },
      {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [{ color: "#263c3f" }],
      },
      {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [{ color: "#6b9a76" }],
      },
      {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#38414e" }],
      },
      {
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: [{ color: "#212a37" }],
      },
      {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [{ color: "#9ca5b3" }],
      },
      {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [{ color: "#746855" }],
      },
      {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [{ color: "#1f2835" }],
      },
      {
        featureType: "road.highway",
        elementType: "labels.text.fill",
        stylers: [{ color: "#f3d19c" }],
      },
      {
        featureType: "transit",
        elementType: "geometry",
        stylers: [{ color: "#2f3948" }],
      },
      {
        featureType: "transit.station",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#17263c" }],
      },
      {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [{ color: "#515c6d" }],
      },
      {
        featureType: "water",
        elementType: "labels.text.stroke",
        stylers: [{ color: "#17263c" }],
      },
    ],
  });
}
window.init = initMap();

let Mopug = new Sector(
  constants.MOPUG,
  map,
  18,
  "MOPUG",
  constants.colours.green
);
let Mopug1 = new Sector(
  constants.MOPUG1,
  null,
  14,
  "MOPUG1",
  constants.colours.blue
);
let Mopug2 = new Sector(
  constants.MOPUG2,
  null,
  14,
  "MOPUG2",
  constants.colours.yellow
);
let Budop = new Sector(
  constants.BUDOP,
  map,
  18,
  "BUDOP",
  constants.colours.purple
);
let Budop1 = new Sector(
  constants.BUDOP1,
  null,
  16,
  "BUDOP1",
  constants.colours.cyan
);
let Budop2 = new Sector(
  constants.BUDOP2,
  null,
  16,
  "BUDOP2",
  constants.colours.orange
);

function simulateUp() {
  // Create n = (1 to noFlights) flights, with a random heading, at a random period of time
  // The headings used here are predefined and they are in the direction SE => NW

  let time = newPoint(4000, 10000);
  let no_flights = newPoint(1, noFlights);
  for (let i = 0; i < no_flights; i++) {
    let index = Math.floor(newPoint(0, constants.UP[0].length));
    let dir = Math.floor(newPoint(0, constants.directionsUp.length)); // direction / heading
    let startpoint = new google.maps.LatLng(
      constants.UP[1][index],
      constants.UP[0][index]
    );
    let flight = new Flight(
      startpoint,
      constants.directionsUp[dir],
      map,
      0.1,
      constants.iconUp
    );
    flight.updatePos();
  }
  elemNW.textContent = Flight.counterUp.length;
  simTimeoutUp = setTimeout(simulateUp, time);
}

function simulateDown() {
  // Create n = (1 to noFlights) flights, with a random heading, at a random period of time
  // The headings used here are predefined and they are in the direction NW => SE

  let time = newPoint(4000, 10000);
  let no_flights = newPoint(1, noFlights);
  for (let i = 0; i < no_flights; i++) {
    let index = Math.floor(newPoint(0, constants.DOWN[0].length));
    let dir = Math.floor(newPoint(0, constants.directionsDown.length));
    let startpoint = new google.maps.LatLng(
      constants.DOWN[1][index],
      constants.DOWN[0][index]
    );
    let flight = new Flight(
      startpoint,
      constants.directionsDown[dir],
      map,
      0.1,
      constants.iconDown
    );
    flight.updatePos();
  }
  elemSE.textContent = Flight.counterDown.length;
  simTimeoutDown = setTimeout(simulateDown, time);
}

function checkMopug(no) {
  /* no - the number of flights currently being present in Mopug
  This function checks if the capacity of the sector has been exceeded
  When exceeded, the big sector is split in two smaller subsectors
  If for 5 iterations the capacity is under the sector capacity, then the
  small subsectors are merged */

  if (no > Mopug.capacity) {
    Mopug.setMap(null);
    Mopug1.setMap(map);
    Mopug2.setMap(map);
    counterMopug = 0;
  } else if (!Mopug.map && no <= Mopug.capacity) {
    counterMopug += 1;
  }

  if (counterMopug >= 5) {
    Mopug.setMap(map);
    Mopug1.setMap(null);
    Mopug2.setMap(null);
    counterMopug = 0;
  }
}

function checkBudop(no) {
  /* no - the number of flights currently being present in Budop
  This function checks if the capacity of the sector has been exceeded
  When exceeded, the big sector is split in two smaller subsectors
  If for 5 iterations the capacity is under the sector capacity, then the
  small subsectors are merged */

  if (no > Budop.capacity) {
    Budop1.setMap(map);
    Budop2.setMap(map);
    Budop.setMap(null);
    counterBudop = 0;
  } else if (!Budop.map && no <= Budop.capacity) {
    counterBudop += 1;
  }

  if (counterBudop >= 5) {
    Budop.setMap(map);
    Budop1.setMap(null);
    Budop2.setMap(null);
    counterBudop = 0;
  }
}

function split() {
  /* Checks the position of each flight instance existing
  and counts the total number of flights present in each sector.
  If the capacity is exceeded, the large sector is split.
  This function displays the current number of flights in each sector, refreshes
  the number of flights present in each sector. */

  let n_Mopug = 0;
  let n_Budop = 0;
  function count() {
    for (let i = 0; i < Flight.counterUp.length; i++) {
      let flight = Flight.counterUp[i];
      Mopug1.checkPosition(flight);
      Mopug2.checkPosition(flight);
      Budop1.checkPosition(flight);
      Budop2.checkPosition(flight);
    }

    for (let i = 0; i < Flight.counterDown.length; i++) {
      let flight = Flight.counterDown[i];
      Mopug1.checkPosition(flight);
      Mopug2.checkPosition(flight);
      Budop1.checkPosition(flight);
      Budop2.checkPosition(flight);
    }

    let flights = [...Flight.counterUp, ...Flight.counterDown];

    for (let i = 0; i < flights.length; i++) {
      if ([Mopug1.name, Mopug2.name].includes(flights[i].sector)) {
        n_Mopug += 1;
      } else if ([Budop1.name, Budop2.name].includes(flights[i].sector)) {
        n_Budop += 1;
      }
    }
  }

  count();
  checkMopug(n_Mopug);
  checkBudop(n_Budop);
  Mopug.currentCapacity = n_Mopug;
  Budop.currentCapacity = n_Budop;
  elemMopug.textContent = Mopug.currentCapacity;
  elemBudop.textContent = Budop.currentCapacity;
  Mopug.checkCapacity();
  Budop.checkCapacity();
  countTimeout = setTimeout(split, 1000);
}

function callback(e) {
  // This function starts the simulation, which is comprised of
  // the flight initializations and the capacity check + split, if the capacity is exceeded
  simulateUp();
  simulateDown();
  split();
  e.currentTarget.setAttribute("disabled", "");
  const stop = document.querySelector(".sim-stop");
  if (stop.hasAttribute("disabled")) {
    stop.removeAttribute("disabled");
  }
}

function stopCallback(e) {
  // This function stops the simulation and resets the map, deletes the flight instances
  // and resets all the data displayed about the flights.

  clearTimeout(simTimeoutUp);
  clearTimeout(simTimeoutDown);
  clearTimeout(countTimeout);

  Flight.counterUp.forEach((item) => {
    item.marker.setMap(null);
    clearTimeout(item.timeout);
  });
  Flight.counterDown.forEach((item) => {
    item.marker.setMap(null);
    clearTimeout(item.timeout);
  });
  Flight.counterUp = [];
  Flight.counterDown = [];

  elemMopug.textContent = 0;
  elemBudop.textContent = 0;
  elemNW.textContent = 0;
  elemSE.textContent = 0;

  Mopug.setMap(map);
  Mopug.currentCapacity = 0;
  Mopug1.setMap(null);
  Mopug2.setMap(null);

  Budop.setMap(map);
  Budop.currentCapacity = 0;
  Budop1.setMap(null);
  Budop2.setMap(null);

  e.currentTarget.setAttribute("disabled", "");
  const start = e.currentTarget.parentElement.querySelector(".sim-start");
  if (start.hasAttribute("disabled")) {
    start.removeAttribute("disabled");
  }
  const alerts = document.querySelector(".alert-section");
  const children = alerts.querySelectorAll(".alert");
  children.forEach((child) => {
    alerts.removeChild(child);
  });
}

document.querySelector(".sim-start").addEventListener("click", callback);
document.querySelector(".sim-stop").addEventListener("click", stopCallback);
document.querySelector(".start").addEventListener("click", (e) => {
  window.location.href = "#sim-map";
  callback(e);
  document.querySelector(".sim-start").setAttribute("disabled", "");
});
