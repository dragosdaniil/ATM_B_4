import { solve } from "./utils.js";

export class Sector {
  /* This class generates sectors
  Each sector has its own characteristics, like instantaneous capacity
  and hourly capacity and name */

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
    if (!Sector.sectors) {
      Sector.sectors = {};
    }
  }

  _display(pathColor = "#00FA00", pathOpacity = 1.0, pathWeight = 2) {
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
    this.map = map;
    this.poly.setMap(map);
  }

  checkCapacity() {
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
  /* Generates "flights" or markers which are saved in an array.
  This helps to check how many flights are currently in the area of interested
  and has references to the this objects that are still in one of */

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
    this.sector = name;
  }

  _create() {
    if (!Flight.counterUp) {
      Flight.counterUp = [];
    }
    if (!Flight.counterDown) {
      Flight.counterDown = [];
    }
    // if (!Flight.counter) {
    //   Flight.counter = [];
    // }
  }

  _separate() {
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
    if the marker exceeded a specified boundary, then it is deleted
    the update is done each 0.5 seconds. 
    If the marker is deleted, returns True*/
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
