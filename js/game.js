var myPoint1 = null;
var toggle = false;
initializeDots();
$("button#playAgain").click(resetBoard);
function dotClick() {
  $("div.alert").removeAttr("style");
  if (toggle == false) {
    myPoint1 = $(this).attr("id")[1];
    toggle = true;
    return;
  }
  var myPoint2 = $(this).attr("id")[1];
  toggle = false;
  if (myPoint1 == myPoint2) {
    errorConnectDotToItself();
    return;
  }
  var cRed = new connector(myPoint1, myPoint2);
  if (!addIsOK(cRed, "RED")) {
    errorConnectorAlreadyExists(cRed);
    return;
  }
  placeConnectorOnBoard(cRed, "RED");
  if (formsTriangle(cRed, "RED")) {
    var cnctrs = formsTriangle(cRed, "RED", true);
    cnctrs.push(cRed);
    disableBoard("LOST", cnctrs);
    return;
  }
  add(cRed, "RED");
  var cBlue = choice();
  placeConnectorOnBoard(cBlue, "BLUE");
  if (formsTriangle(cBlue, "BLUE")) {
    var cnctrs = formsTriangle(cBlue, "BLUE", true);
    cnctrs.push(cBlue);
    disableBoard("WON", cnctrs);
    return;
  }
  add(cBlue, "BLUE");
}
function errorConnectDotToItself() {
  console.log("Can't connect a dot to itself!");
  initializeAlerts();
  $("div#alertErrorConnectDotToItself").css("display", "inherit");
}
function errorConnectorAlreadyExists(cnctr) {
  console.log("Connector " + cnctr.toString() + " already exists on the board!");
  initializeAlerts();
  $("div#alertErrorConnectorAlreadyExists").css("display", "inherit");
}
function placeConnectorOnBoard(cnctr, color) {
  if (color == "RED") {
    console.log("Your move: " + cnctr.toString());
  } else if (color == "BLUE") {
    console.log("Computer does: " + cnctr.toString());
  }
  $("#c" + cnctr.toString()).css("background-color", color);
  $("#c" + cnctr.toString()).css("display", "inherit");
}
function disableBoard(status, cnctrs) {
  initializeAlerts();
  $("div.dot").removeAttr("style");
  $("div.dot").removeClass("hover");
  $("div.dot").off();
  if (status == "LOST") {
    console.log("You lost!");
    $("div#alertLost").css("display", "inherit");
  } else if (status == "WON") {
    console.log("You won!");
    $("div#alertWon").css("display", "inherit");
  }
  for (var i = 0; i < cnctrs.length; i++) {
    $("#c" + cnctrs[i].toString()).css("box-shadow", "0px 0px 10px #000000");
  }
}
function resetBoard() {
  $("div.connector").removeAttr("style");
  initializeAlerts();
  initializeDots();
  initializeBoard();
}
function initializeAlerts() {
  $("div.alert").removeAttr("style");
}
function initializeDots() {
  $("div.dot").on("click", dotClick);
  $("div.dot").addClass("hover");
  $("div.dot.hover").bind("mouseover", function () {
    $(this).css("background", "#f5f5f5");
    $(this).css("cursor", "pointer");
  });
  $("div.dot.hover").bind("mouseout", function () {
    $(this).removeAttr("style");
  });
}
// Puzzle board
var RED;
var BLUE;
var WHITE;
initializeBoard();
function initializeBoard() {
	RED = new Array();
	BLUE = new Array();
	WHITE = new Array();
	WHITE.push(new connector(1, 2));
	WHITE.push(new connector(1, 3));
	WHITE.push(new connector(1, 4));
	WHITE.push(new connector(1, 5));
	WHITE.push(new connector(1, 6));
	WHITE.push(new connector(2, 6));
	WHITE.push(new connector(2, 5));
	WHITE.push(new connector(2, 4));
	WHITE.push(new connector(2, 3));
	WHITE.push(new connector(3, 6));
	WHITE.push(new connector(3, 5));
	WHITE.push(new connector(3, 4));
	WHITE.push(new connector(4, 5));
	WHITE.push(new connector(4, 6));
	WHITE.push(new connector(5, 6));
}
function add(cnctr, color) {
	for (var i = 0; i < WHITE.length; i++) {
		if (WHITE[i].equals(cnctr)) {
      WHITE.splice(i, 1);
			break;
		}
	}
	if (color == "RED") {
		RED.push(cnctr);
	} else if (color == "BLUE") {
		BLUE.push(cnctr);
	}
}
function addIsOK(cnctr, color) {
  return containsConnector(WHITE, cnctr);
}
function formsTriangle(cnctr, color, returnTriangleConnectors) {
	var colToIterate = new Array();
  var triangleConnectors = new Array();
	if (color == "RED") {
		colToIterate = RED;
	} else if (color == "BLUE") {
		colToIterate = BLUE;
	} else {
		return false;
	}
	var y1 = new Array();
	var y2 = new Array();
	var x1 = new Array();
	var x2 = new Array();
	for (var i = 0; i < colToIterate.length; i++) {
		var c = colToIterate[i];
		if (cnctr.myPoint1 == c.myPoint2) {
			y1.push(c);
		}
		if (cnctr.myPoint2 == c.myPoint2) {
			y2.push(c);
		}
		if (cnctr.myPoint1 == c.myPoint1) {
			x1.push(c);
		}
		if (cnctr.myPoint2 == c.myPoint1) {
			x2.push(c);
		}
	}
	for (var i = 0; i < y1.length; i++) {
		var c1 = y1[i];
		for (var k = 0; k < y2.length; k++) {
			var c2 = y2[k];
			if (c1.myPoint1 == c2.myPoint1) {
        if (returnTriangleConnectors) {
          triangleConnectors.push(c1);
          triangleConnectors.push(c2);
          return triangleConnectors;
        } else {
          return true;
        }
			}
		}
	}
	for (var i = 0; i < x1.length; i++) {
		var c1 = x1[i];
		for (var k = 0; k < x2.length; k++) {
			var c2 = x2[k];
			if (c1.myPoint2 == c2.myPoint2) {
        if (returnTriangleConnectors) {
          triangleConnectors.push(c1);
          triangleConnectors.push(c2);
          return triangleConnectors;
        } else {
          return true;
        }
			}
		}
	}
	y1 = new Array();
	y2 = new Array();
	x1 = new Array();
	x2 = new Array();
	for (var i = 0; i < colToIterate.length; i++) {
		var c = colToIterate[i];
		if (cnctr.myPoint1 == c.myPoint2) {
			x1.push(c);
		}
		if (cnctr.myPoint2 == c.myPoint1) {
			x2.push(c);
		}
		if (cnctr.myPoint1 == c.myPoint1) {
			y1.push(c);
		}
		if (cnctr.myPoint2 == c.myPoint2) {
			y2.push(c);
		}
	}
	for (var i = 0; i < x1.length; i++) {
		var c1 = x1[i];
		for (var k = 0; k < x2.length; k++) {
			var c2 = x2[k];
			if (c1.myPoint1 == c2.myPoint2) {
        if (returnTriangleConnectors) {
          triangleConnectors.push(c1);
          triangleConnectors.push(c2);
          return triangleConnectors;
        } else {
          return true;
        }
			}
		}
	}
	for (var i = 0; i < y1.length; i++) {
		var c1 = y1[i];
		for (var k = 0; k < y2.length; k++) {
			var c2 = y2[k];
			if (c1.myPoint2 == c2.myPoint1) {
        if (returnTriangleConnectors) {
          triangleConnectors.push(c1);
          triangleConnectors.push(c2);
          return triangleConnectors;
        } else {
          return true;
        }
			}
		}
	}
	return false;
}
function choice() {
	var posConnectors = new Array();
	var cBlue = "BLUE";
	var cRed = "RED";
	for (var i = 0; i < WHITE.length; i++) {
		var c = WHITE[i];
		posConnectors.push(c);
	}
	for (var i = 0; i < posConnectors.length; i++) {
		var c = posConnectors[i];
		if (formsTriangle(c, cBlue)) {
			posConnectors.splice(i, 1);
      i--;
		}
	}
	for (var i = 0; i < posConnectors.length; i++) {
		var c = posConnectors[i];
		if (formsTriangle(c, cRed)) {
			posConnectors.splice(i, 1);
      i--;
		}
	}
	for (var i = 0; i < RED.length; i++) {
		var r = RED[i];
		for (var j = 0; j < BLUE.length; j++) {
			var b = BLUE[j];
			var rEndPt1 = r.myPoint1;
			var rEndPt2 = r.myPoint2;
			var bEndPt1 = b.myPoint1;
			var bEndPt2 = b.myPoint2;
			var c = null;
			if (rEndPt2 == bEndPt1) {
				c = new connector(rEndPt1, bEndPt2);
				if (containsConnector(posConnectors, c)) {
					return c;
				}
			}
			if (rEndPt1 == bEndPt2) {
				c = new connector(rEndPt2, bEndPt1);
				if (containsConnector(posConnectors, c)) {
					return c;
				}
			}
			if (rEndPt1 == bEndPt1) {
				c = new connector(rEndPt2, bEndPt2);
				if (containsConnector(posConnectors, c)) {
					return c;
				}
			}
			if (rEndPt2 == bEndPt2) {
				c = new connector(rEndPt1, bEndPt1);
				if (containsConnector(posConnectors, c)) {
					return c;
				}
			}
		}
	}
	if (posConnectors.length != 0) {
		return posConnectors[0];
	}
	posConnectors = new Array();
	for (var i = 0; i < WHITE.length; i++) {
		var c = WHITE[i];
		posConnectors.push(c);
	}
	for (var i = 0; i < posConnectors.length; i++) {
    var c = posConnectors[i];
		if (formsTriangle(c, cBlue)) {
			posConnectors.splice(i, 1);
      i--;
		}
	}
	if (posConnectors.length != 0) {
		return posConnectors[0];
	}
	return WHITE[0];
}
// Connector
function connector(myPoint1, myPoint2) {
	if (myPoint1 > myPoint2) {
		this.myPoint1 = myPoint2;
		this.myPoint2 = myPoint1;
	} else {
		this.myPoint1 = myPoint1;
		this.myPoint2 = myPoint2;
	}
	this.equals = function(cnctr) {
		return ((this.myPoint1 == cnctr.myPoint1) &&
						(this.myPoint2 == cnctr.myPoint2));
	}
	this.toString = function() {
		return ("" + this.myPoint1 + this.myPoint2);
	}
}
// Utilities
function containsConnector(connectors, cnctr) {
  for (var i = 0; i < connectors.length; i++) {
    if (connectors[i].equals(cnctr)) {
      return true;
    }
  }
  return false;
}
