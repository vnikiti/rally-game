document.addEventListener('DOMContentLoaded', init, false);

var image = new Image();
var curb = new Image();
var tree = new Image();
var localCX;// x coordinate of the center the car
var localCY;// y coordinate of the center the car
var bordNum;
var canvas;
var triiz = new Array();
var t;
var time = 0;
var increment = 0.001;
var some_other_increment = 0;
var theta;
var alpha;
var lives = 3;
var gameOver = false;
var score = 0;

function init() {
  canvas = document.getElementById("game_window");
  localCY = canvas.height / 2;
  curb.src = "img/asteroid.png";
  tree.src = "img/comet.png";
  image.src = "img/ship.png";
               
                
  image.onload = function() {
    bordNum = canvas.width / curb.width;
    document.onmousemove = rotate;
    t=setTimeout("onTimeEvent()",25);
  };
                
                 
}
            
function canGenerateCone() {
  var i,j;
  if(triiz.length == 0) {
    return true;
  }
  if(triiz.length < 5) {
    for(i=0;i<triiz.length;i++) {
      var distance = 2 + 6 * Math.random();
      if(triiz[i].x > canvas.width - distance*image.width) {
        return false;
      }
    }
    return true;
  }
  else {
    return false;
  }
}
            
function onTimeEvent()
{
  if(canGenerateCone()) {
    generateCone();
  }
  time = time + increment + some_other_increment;
  shiftCones();
  draw();
  doChecks();
  score = score + 1;
  document.getElementById("score").innerHTML = score;
  t=setTimeout("onTimeEvent()",25);
  if(gameOver) {
    clearTimeout(t);
  }
}
            
function die() {
  lives = lives - 1;
  localCY =( lowerBound(localCX) + upperBound(localCX) ) / 2;
  if(lives == 2) {
    document.getElementById("lives").innerHTML="&#x2665;&nbsp;&#x2665;&nbsp;&#x2661;";
  }
  else if(lives == 1) {
    document.getElementById("lives").innerHTML="&#x2665;&nbsp;&#x2661;&nbsp;&#x2661;";
  }
  else if(lives == 0) {
    document.getElementById("lives").innerHTML="&#x2661;&nbsp;&#x2661;&nbsp;&#x2661;";
    alert("Game Over. Click the refresh button to restart the game.");
    document.onmousemove = function() {};
    gameOver = true;
  }
}
            
function shiftCones()
{
  for(i=0;i<triiz.length;i++) {
    triiz[i].x = triiz[i].x - tree.width*0.1;
    if(triiz[i].x < -tree.width) {
      triiz.shift();
      score = score + 10;
    }
  }
}
            
function doChecks() {
  check(localCX -image.width/2,localCY -image.height/2);
  check(localCX +image.width/2,localCY +image.height/2);
  check(localCX -image.width/2,localCY +image.height/2);
  check(localCX +image.width/2,localCY -image.height/2);
  for(i=0;i<triiz.length;i++) {
    if(window.localCX && window.localCY) {
      if( localCX -image.width/2 < triiz[i].x +tree.width/2 && triiz[i].x+tree.width/2 < localCX +image.width/2 &&
        localCY -image.height/2 < triiz[i].y + shift(triiz[i].y) && triiz[i].y + shift(triiz[i].y) < localCY +image.height/2) {
        triiz.splice(i, 1);
        die();
      }
    }
  }
}
            
function generateCone() {
  var coneX = canvas.width - tree.width;
  var upperLimit = upperBound(coneX) + curb.height + tree.height;
  var lowerLimit = lowerBound(coneX) - curb.height - tree.height;
  var coneY = upperLimit + Math.random() * (lowerLimit - upperLimit);
  triiz.push({
    x: coneX, 
    y: coneY
  });
}
                        
function check(u, v) {
  var tran = transf({
    x: u, 
    y: v
  });
  var transX = tran.x;
  var transY = tran.y;
  if(transY > lowerBound(transX) + curb.height/2 || transY < upperBound(transX) + curb.height/2) {
    die();
  }
}
                 
function getPosition(e) {
  var cursor = {
    x:0, 
    y:0
  };
  cursor.x = (window.Event) ? e.pageX : event.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
  cursor.y = (window.Event) ? e.pageY : event.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);
  return cursor;
}
	 
function rotate(e) {
  var cursor = getPosition(e);
  var x = cursor.x;
  var y = cursor.y;
  offset = findPos(canvas);
  var directionX = x - (offset.top+image.width/2);
  var directionY = y - (offset.left+canvas.height /2);
  localCX = image.width / 2;
  var sign;
  if(directionY < 0) {
    sign = -1;
  }
  else {
    sign = 1;
  }
  localCY = localCY + sign* Math.sqrt(directionX*directionX+directionY*directionY)*0.01;
  some_other_increment = 0.1*Math.sqrt(directionX*directionX+directionY*directionY)/canvas.width;
  alpha = Math.acos(directionX/Math.sqrt(directionX*directionX+directionY*directionY));
  theta=0;
  draw();
  doChecks();
  return true;
}
            
function draw() {
  var context = canvas.getContext("2d");
  context.clearRect(0,0,canvas.width,canvas.height);
  context.save();
                
  context.drawImage(image, 0, localCY-image.height/2, image.width, image.height);
  context.restore();
  var i=0;
  for (i=0;i<bordNum;i++) {
    context.drawImage(curb, i*curb.width, upperBound(i*curb.width));
    context.drawImage(curb, i*curb.width, lowerBound(i*curb.width));
  }
  for(i=0;i<triiz.length;i++) {
    context.drawImage(tree, triiz[i].x, triiz[i].y + shift(triiz[i].x));
  }
  return;
}

function findPos(obj) {  
  var curleft = curtop = 0;  
  if (obj.offsetParent) {  
    curleft = obj.offsetLeft  
    curtop = obj.offsetTop  
    while (obj = obj.offsetParent) {  
      curleft += obj.offsetLeft  
      curtop += obj.offsetTop  
    }  
  }  
  return {
    top: curleft, 
    left: curtop
  };  
}
            
function shift(Xpos) {
  return curb.height*Math.cos(Xpos/(curb.width*2*Math.PI)+time);
}
            
function upperBound(w) {
  return shift(w)+canvas.height/5;
}
            
function lowerBound(w) {
  return shift(w)+4*canvas.height/5;
}
            
function transf(p) {
  var n = {
    x: -localCX, 
    y: -localCY
    };
  var m = translate(p,n);
  m = rot(m);
  n = {
    x: localCX, 
    y: localCY
  };
  return translate(m,n);
}
                        
function rot(p) {
  return {
    x: Math.cos(theta)*p.x-Math.sin(theta)*p.y,
    y: Math.sin(theta)*p.x+Math.cos(theta)*p.y
    };
}
                        
function translate(q,r) {
  return {
    x: q.x + r.x, 
    y: q.y + r.y
    };
}