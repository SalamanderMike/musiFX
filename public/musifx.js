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

var canvas = (function(){

  // Need a place to control some basic params
  var parameters = {
    color: Math.floor(Math.random()* 360)
  };

  var canvas,
      ctx,
      windowWidth,
      windowHeight,
      particleDensity = 2,
      allParticles = 0,
      lonelyParticle,
      particles = [];

  // Must define a particle
  function Particle(id){
    // make this persistant through functions, just in case we need it
    self = this;

    // Where the hell is this particle on the screen? Ah, x,y
    // within the parameters of the window size
    self.x = Math.floor(Math.random()*windowWidth);
    self.y = Math.floor(Math.random()*windowHeight);

    // and every dot needs somewhere to go
    self.velocityX = Math.random() * 2 - 1;
    self.velocityY = Math.random() * 2 - 1;

    // Let's give the dot some color
    self.hue = parameters.color;
    // and yes, size matters
    self.radius = 1;
  }

  function start(){

    // Create a canvas, put it into our document, make it 2 dimensional
    canvas = document.createElement("canvas");
    document.body.appendChild(canvas);
    ctx = canvas.getContext("2d"); // ctx = 'context'

    // // Just in case user wants to resize window, canvas will follow
    // resize();
    // window.addEventListener( 'resize', resize, false );
    // totalParticles = Math.round(windowWidth/100) * Math.round(windowHeight/100) * particleDensity;

    // Finally, create particles according to window dimesions
    // Get one working, first...
    lonelyParticle = new Particle(0);
    // // Create many later
    // for(var dot = 0; dot < allParticles; dot++){
    //   particles.push(new Particle(dot));
    // }
    // ...then draw them
    drawParticle(lonelyParticle);
  }









  start();
})();












