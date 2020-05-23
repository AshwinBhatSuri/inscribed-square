// @ts-check
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  getDistance(p) {
    return Math.sqrt(
      (this.x - p.x) * (this.x - p.x) + (this.y - p.y) * (this.y - p.y)
    );
  }
}

var minDistance = 5; // The min distance between 2 points (we get from mouse drag)
var path;

// approx. equal
function equal(a, b) {
  return Math.abs(a - b) < 3 * minDistance;
}
// used for sorting
function compareFunction(a, b) {
  return a.distance - b.distance;
}

function granulatePoints(points) {
  var granulatedPoints = [];
  if (points.length == 0) {
    return granulatedPoints;
  }
  granulatedPoints.push(points[0]);
  for (var i = 1; i < points.length; i++) {
    var currentDistance = points[i].getDistance(points[i - 1]);
    if (currentDistance > minDistance) {
      var cosTheta = (points[i].x - points[i - 1].x) / currentDistance;
      var sinTheta = (points[i].y - points[i - 1].y) / currentDistance;
      for (var j = 5; j < currentDistance; j += 5) {
        granulatedPoints.push(
          new Point(points[i].x + j * cosTheta, points[i].y + j * sinTheta)
        );
      }
    }
    granulatedPoints.push(points[i]);
  }
  return granulatedPoints;
}

function computeSquare(points) {
  /* 
  For a pair of points, they can be opposite ends of a square give we have 2 other points as diagonal. Coordinates of those points can be determined directly. Now the problem remains is to determine whether those points lie on the curve?
      Steps : 
      1. Granulate the path (points), into points which are tool.minDistance apart
      2. for each pair of points, check whether they can be opposite ends of diagonal
  */
  console.log("granulating");
  var granulatedPoints = granulatePoints(points);
  console.log("finding square");
  for (var i = 0; i < granulatedPoints.length; i++) {
    for (var j = i + 1; j < granulatedPoints.length; j++) {
      var a = granulatedPoints[i];
      var c = granulatedPoints[j];
      var b = new Point(
        (a.x + c.x + c.y - a.y) / 2,
        (a.y + c.y + a.x - c.x) / 2
      );
      var d = new Point(
        (a.x + c.x + a.y - c.y) / 2,
        (a.y + c.y + c.x - a.x) / 2
      );
      var diagonalLength = a.getDistance(c);
      var foundB = false;
      var foundD = false;
      for (var k = 0; k < granulatedPoints.length; k++) {
        if (granulatedPoints[k].getDistance(b) / diagonalLength < 0.01) {
          foundB = true;
        }
        if (granulatedPoints[k].getDistance(d) / diagonalLength < 0.01) {
          foundD = true;
        }
      }
      if (foundB && foundD) {
        return [a, b, c, d];
      }
    }
  }
  return null;
}
