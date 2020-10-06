var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
ctx.fillStyle = "#FF0000";

var width = canvas.clientWidth;
var height = canvas.clientHeight;

function SetSize(w, h) {
  canvas.width = h;
  canvas.height = w;

  width = canvas.clientWidth;
  height = canvas.clientHeight;
}
function ClearCanvas() {
  ctx.clearRect(0, 0, width, height);
}
