import { solve } from "./utils.js";

export class Sector {
  /* This class generates sectors
  Each sector has its own characteristics, like instantaneous capacity
  name, currentCapacity, sector color and coordinates.
  When initialized, the class Sector saves all the instances into a class object */

  constructor(coords, map, capacity, name, pathColor) {
    this.coords = coords;
    this.map = map;
    this.capacity = capacity;
    this.name = name;
    this.currentCapacity = 0;
    this._display(pathColor);
    this.color = pathColor;
    this._create();
    Sector.sectors[this.name] = { sector: this };
  }

  _create() {
    // Initializes the class objects that saves all the class instances IF
    // it has not been already initialized
    if (!Sector.sectors) {
      Sector.sectors = {};
    }
  }

  _display(pathColor = "#00FA00", pathOpacity = 1.0, pathWeight = 2) {
    // Draws the sector on the map
    this.poly = new google.maps.Polygon({
      map: this.map,
      paths: this.coords,
      strokeColor: pathColor,
      strokeOpacity: pathOpacity,
      strokeWeight: pathWeight,
      fillColor: pathColor,
      fillOpacity: 0.3,
    });
  }

  setMap(map) {
    // Sets the map it is drawn on
    // Used when the sectors are redrawn after sectorization
    this.map = map;
    this.poly.setMap(map);
  }

  checkCapacity() {
    /* Checks if the capacity has been exceeded by more than 5%,
    in which case, it emits alerts for the sector.
    In case that the currentCapacity is less than the instantaneous
    capacity, the alerts will be deleted */
    if (this.currentCapacity >= 1.05 * this.capacity) {
      if (!document.getElementById("alert" + this.name)) {
        let alerrt = document.createElement("h3");
        let node = document.createTextNode(
          `${this.name} has reached maximum capacity!`
        );
        alerrt.appendChild(node);
        alerrt.setAttribute("id", "alert" + this.name);
        alerrt.setAttribute("class", "alert");
        alerrt.style.color = "red";
        alerrt.style.backgroundColor = this.color;
        alerrt.style.textAlign = "center";
        alerrt.style.margin = "0";
        alerrt.style.padding = "0";
        let div = document.querySelector(".alert-section");
        div.appendChild(alerrt);
      }
    } else if (
      this.currentCapacity < 1.05 * this.capacity &&
      document.getElementById("alert" + this.name)
    ) {
      let alerrt = document.getElementById("alert" + this.name);
      alerrt.innerHTML = "";
      alerrt.remove();
    }
  }

  checkPosition(obj) {
    /* Checks the position of a flight. If a flight is present in this sector, then
    the flight will save the name of the sector it currently belongs to */
    if (
      google.maps.geometry.poly.containsLocation(
        obj.marker.getPosition(),
        this.poly
      ) &&
      !obj.sector
    ) {
      obj.changeSector(this.name);
    }
  }
}

export class Flight {
  /* Generates "flights" that are flying according to a given heading, the "speed"
  is defined by a given step. Each flight is initialized from a random point on
  predefined initialization zones (lines) outside of the sectors.
  The instances are saved in a class list upon creation in order to keep track of the 
  flights that are still or have left the area of interest.
  - id is created in order to facilitate the elimination of flights that left the area of interest
  - hdg gives the heading of the flight */

  constructor(startpoint, hdg, map, step, icon) {
    this.step = step;
    this.map = map;
    this.id = (new Date().getTime() * Math.random()).toString();
    this.heading = hdg;
    this.icon = icon;
    this.sector = null;
    this._create();
    this._separate();
    this.createMarker(startpoint);
  }

  changeSector(name) {
    // Used to keep track of the sector the flight currently flies through
    this.sector = name;
  }

  _create() {
    /* Creates a class list for the flights that are going SE - NW
    and another for flights going NW - SE*/
    if (!Flight.counterUp) {
      Flight.counterUp = [];
    }
    if (!Flight.counterDown) {
      Flight.counterDown = [];
    }
  }

  _separate() {
    /* At initialization, separates the instances in flightsUp of flightsDown 
    It reduces the amount of time when deleting a flight */
    if (this.heading > 270 && this.heading < 360) {
      Flight.counterUp.push(this);
    } else {
      Flight.counterDown.push(this);
    }
  }

  createMarker(point, title = "None") {
    /* creates a new Marker object */
    this.marker = new google.maps.Marker({
      position: point,
      map: this.map,
      title: title,
      icon: this.icon,
    });
  }

  deleteFlight() {
    this.marker.setMap(null);
    if (this.heading > 270 && this.heading < 360) {
      Flight.counterUp = Flight.counterUp.filter(
        (flight) => flight.id !== this.id
      );
      // console.log(Flight.counterUp.length);
    } else {
      Flight.counterDown = Flight.counterDown.filter(
        (flight) => flight.id !== this.id
      );
      // console.log(Flight.counterDown.length);
    }
  }

  updatePos() {
    //console.log("STARTING THE UPDATE");
    /* Updates the position of the marker;
    if the marker exceeds a specified boundary, it is deleted.
    The update is done every second. */
    if (
      this.marker.position.lat() < 44.55 ||
      this.marker.position.lat() > 48.1 ||
      this.marker.position.lng() < 21.2 ||
      this.marker.position.lng() > 23.6
    ) {
      // console.log(`The flight ${this.id} has been eliminated`);
      clearTimeout(this.timeout);
      this.deleteFlight();
      return true;
    } else {
      this.marker.setMap(null);
      let point = solve(
        this.marker.position.lat(),
        this.marker.position.lng(),
        this.heading,
        this.step
      );
      this.createMarker(point);
      this.timeout = setTimeout(() => this.updatePos(), 1000);
    }
  }
}
