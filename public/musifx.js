// MusiFX
// Exploring particle gameplay with music responsiveness

// requestAnimationFrame to deal with looping
// cross browser support. Hopefully...
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame   ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          window.oRequestAnimationFrame      ||
          window.msRequestAnimationFrame     ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
    };
})();

var space = (function(){

  // Need a place to control some basic params
  var parameters = {
      color: Math.floor(Math.random()* 360),

  };

  var canvas,
      ctx,
      windowWidth,
      windowHeight,
      particleDensity = 2,
      allParticles = 0,
      particles = [];

  // Define size of canvas according to size of window
  function windowSize(){
    windowHeight = window.innerHeight;
    windowWidth = window.innerWidth;

    canvas.width = windowWidth;
    canvas.height = windowHeight;
    canvas.style.width = windowWidth + 'px';
    canvas.style.height = windowHeight + 'px';
  }

  // Must define a particle
  function Particle(id){
    // make this persistant through functions, just in case we need it
    var self = this;
    self.id = id;

    // Where the hell is this particle on the screen? Ah, x,y
    // within the parameters of the window size
    self.x = Math.floor(Math.random()*windowWidth);
    self.y = Math.floor(Math.random()*windowHeight);

    // and every dot needs somewhere to go
    self.velx = Math.random() * 2 - 1;
    self.vely = Math.random() * 2 - 1;

    // Let's give the dot some color
    self.hue = 188;
    // and yes, size matters
    self.radius = 100;
  }
  Particle.prototype.drawParticle = function(){
    var self = this;
    self.hue = 184;// test color
    var gradient = ctx.createRadialGradient(self.x, self.y, 3, self.x, self.y, 50);
    gradient.addColorStop(0, "hsla(" + self.hue + ",100%,50%,0.35");
    gradient.addColorStop(0.02, "hsla(" + self.hue + ",100%,50%,0.15)");
    gradient.addColorStop(0.04, "hsla(50,100%,60%,0.05");
    gradient.addColorStop(0.1, "hsla(50,100%,60%,0.03)");
    gradient.addColorStop(0.8, "hsla(50,100%,50%,0.0)");
    gradient.addColorStop(1, "hsla(50,100%,80%,0.0)");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(self.x, self.y, 50, 0, Math.PI * 2, false);
    ctx.fill();
  };

  function drawCanvas(){
    inMotion();

    ctx.fillStyle = "#000";// Redraw black after dot animation
    ctx.fillRect(0, 0, windowWidth, windowHeight);// Black background

    for(var i = 0; i < particles.length; i++){
      particles[i].drawParticle(); // use prototype to color and set path
    }

    // Recursive for redrawing frames
    requestAnimFrame(drawCanvas);
  }

  function inMotion(){


  }













// BEGIN HERE **********************************************************
  function start(){
    // Create a canvas, put it into our document, make it 2 dimensional
    canvas = document.createElement("canvas");
    document.body.appendChild(canvas);
    ctx = canvas.getContext("2d"); // ctx = 'context'

    // Just in case user wants to resize window, canvas will follow
    windowSize();
    window.addEventListener( 'windowSize', windowSize, false );
    allParticles = Math.floor(windowWidth/80) * Math.floor(windowHeight/80) * particleDensity;

    // Finally, create particles according to window dimesions
    // Get one working, first...
    // lonelyParticle = new Particle(0);
    // Create many later
    for(var i = 0; i < allParticles; i++){
      particles.push(new Particle(i));
    }
    // ...then draw them
    drawCanvas();
  }


  start();
  return {
    parameters: parameters
  };
})();












