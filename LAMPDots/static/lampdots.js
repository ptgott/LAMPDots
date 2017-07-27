'use strict';

(function(){
  var COLOR_CHOICES = 40;
  var RGB_DIVISIONS = Math.ceil(Math.pow(COLOR_CHOICES, (1/3)));

  var colors = [];

  function colorForDivision(division){
    return Math.min(255, Math.floor((255/RGB_DIVISIONS) * division));
  }

  for(var r = 1; r <= RGB_DIVISIONS; r++){
    for(var g = 1; g <= RGB_DIVISIONS; g++){
      for(var b = 1; b <= RGB_DIVISIONS; b++){
        colors.push("rgb("+ colorForDivision(r) + "," + colorForDivision(g) + "," + colorForDivision(b) + ")");
      }
    }
  }

  console.log(colors);

  // [x, y, rgb()]
  // Coordinates for dots are within the canvas, not the page.
  var dots = [];

  function DotCreationRequest(x, y, color){
    var req = new XMLHttpRequest();
    req.open('POST', '/../site/dots/new', );
    req.setRequestHeader("Content-Type", "application/json");
    req.send(JSON.stringify({
      "x": x,
      "y": y,
      "color": color
    }));
    console.log("dot creation request", req);
  }

  function DotFetchRequest(callback){
    var req = new XMLHttpRequest();
    req.open('GET', '/../site/dots/all');
    req.send();
    req.onreadystatechange = function(){
      if(req.readyState === 4){
        parseToArray(JSON.parse(req.responseText), dots);
        callback();
      }
    }

    function parseToArray(responseBody, dotsArray){
      console.log("responseBody", responseBody);
      for(var i in responseBody){
        dotsArray.push([
          responseBody[i].displayX, 
          responseBody[i].displayY, 
          responseBody[i].color
        ]);
      }
      console.log("dots", dots);
    }    
  }

  function DotMenuItem(colorString, menuIdString, dotCanvasObject){
    var colorPattern = /rgb\(\d{1,3}\,\d{1,3}\,\d{1,3}\)/
    if(!colorPattern.test(colorString)){
      throw("You've called DotMenuItem without an actual color");
    }
    var element = document.createElement('div');
    element.classList.add('dotMenuItem');
    element.style.background = colorString;
    element.color = colorString;

    element.addEventListener('click', function(){
      dotCanvasObject.changeColorTo(colorString);
    });

    document.getElementById(menuIdString).appendChild(element);

  }

  function DotCanvas(colors){
    var canvas = document.getElementById("dotsCanvas");
    var context = canvas.getContext('2d');
    var currentColor = colors[0];
    var DOT_RADIUS = 10;
    
    function reset(){
      context.clearRect(0,0, canvas.width, canvas.height);
      reDrawPlacedDots(dots);
    }

    this.reset = reset;

    function fromPageToCanvas(x, y){
      var referenceRectangle = canvas.getBoundingClientRect();
      var xOnCanvas = x - referenceRectangle.left;
      var yOnCanvas = y - referenceRectangle.top;
      return [xOnCanvas, yOnCanvas];
    }

    function reDrawPlacedDots(dotsArray){
      for(var i = 0; i < dotsArray.length; i++){
        context.fillStyle = dotsArray[i][2];
        context.beginPath();
        context.arc(
        dotsArray[i][0], 
        dotsArray[i][1], 
        DOT_RADIUS, 
        0, 
        2 * Math.PI, 
        false);
        context.fill();
      }
    }

    function mapDotToMouseMove(event){
      var onCanvas = fromPageToCanvas(event.pageX, event.pageY);
      reset();
      context.fillStyle = currentColor;
      context.beginPath();
      context.arc(
        onCanvas[0], 
        onCanvas[1], 
        DOT_RADIUS, 
        0, 
        2 * Math.PI, 
        false);
      context.fill();
    }

    function saveDotFromClick(event){
      var coords = fromPageToCanvas(event.pageX, event.pageY);
      dots.push([coords[0], coords[1], currentColor]);
      reDrawPlacedDots(dots);
      new DotCreationRequest(coords[0], coords[1], currentColor);
    }

    this.changeColorTo = function(colorString){
      currentColor = colorString;
    }

    canvas.addEventListener('mousemove', mapDotToMouseMove);
    canvas.addEventListener('click', saveDotFromClick);
  }

  function setup(){
    var canvasForPage = new DotCanvas(colors);

    new DotFetchRequest(function(){
      for(var i = 0; i < colors.length; i++){
        new DotMenuItem(colors[i], 'dotsMenu', canvasForPage);
      }
      canvasForPage.reset();
    });
  }

  window.onload = function(){
    setup();
  }

})();