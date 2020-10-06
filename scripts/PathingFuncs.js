function RemoveElemnentArray(arr, ele) {
  for (i = arr.length - 1; i >= 0; i--) {
    if (arr[i] == ele) {
      arr.splice(i, 1);
    }
  }
}
function heuristic(a, b) {
  //var d = Math.abs(a.i - b.i) + Math.abs(a.j - b.j);
  var d = Math.sqrt(Math.pow(a.i - b.i, 2) + Math.pow(a.j - b.j, 2));
  return d;
}
