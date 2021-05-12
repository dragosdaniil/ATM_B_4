function newPoint(a, b) {
  return (b - a) * Math.random() + a;
}

function linspace(startValue, stopValue, noElements) {
  /* MATLAB's linspace is <3 */
  var arr = [];
  var step = (stopValue - startValue) / (noElements - 1);
  for (var i = 0; i < noElements; i++) {
    arr.push(startValue + step * i);
  }
  return arr;
}

function calcLine(x, x0, y0, tg) {
  return x.map((i) => tg * (i - x0) + y0);
}

function solve(lat1, long1, hdg, step) {
  let alpha;
  /* If heading is 90 or 270, the tangent will be inf
  If the heading is 0,180,360, the tangent is 0
  We check each case
  for the other cases, we just calculate alpha wrt heading
  This function returns a LatLng object */

  if (hdg === 0 || hdg === 180 || hdg === 360) {
    lat1 = lat1 + Math.sign(Math.cos((hdg * Math.PI) / 180)) * step;
    return new google.maps.LatLng(lat1, long1);
  } else if (hdg === 90 || hdg === 270) {
    long1 = long1 + Math.sign(Math.sin((hdg * Math.PI) / 180)) * step;
    return new google.maps.LatLng(lat1, long1);
  } else if (hdg < 90) {
    alpha = hdg;
  } else if (hdg < 180) {
    alpha = hdg - 90;
    lat1 =
      lat1 +
      Math.sign(Math.cos((hdg * Math.PI) / 180)) *
        step *
        Math.sin((alpha * Math.PI) / 180);
    long1 =
      long1 +
      Math.sign(Math.sin((hdg * Math.PI) / 180)) *
        step *
        Math.cos((alpha * Math.PI) / 180);
  } else if (hdg < 270) {
    alpha = 270 - hdg;
  } else if (hdg < 360) {
    alpha = 360 - hdg;
    lat1 =
      lat1 +
      Math.sign(Math.cos((hdg * Math.PI) / 180)) *
        step *
        Math.cos((alpha * Math.PI) / 180);
    long1 =
      long1 +
      Math.sign(Math.sin((hdg * Math.PI) / 180)) *
        step *
        Math.sin((alpha * Math.PI) / 180);
  }

  return new google.maps.LatLng(lat1, long1);
}

export { newPoint, linspace, calcLine, solve };
