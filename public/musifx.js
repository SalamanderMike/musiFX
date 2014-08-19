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

  // Canvas
  var canvas,
      ctx,
      windowWidth,
      windowHeight,
      particleDensity = 2,
      allParticles = 0,
      particles = [];

  // inMotion
  var baseRenderSpeed = 60,
      renderTimer = (new Date()).getTime(),
      FPS = 0,
      mX = 0,
      mY = 0,
      mouseIsDown = false,
      exploding = 200,
      explodeTime = 100;

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
    self.hue = parameters.color;
    self.af = 1 / allParticles;

    // and yes, size matters
    self.radius = 1;

    // Sets the radius of attraction
    self.attractionRadius = 100;

    // How many dots is this dot attracting
    self.attracting = 0;

    // this will serve as a temporary holding bin for
    // how many particles we are attracting.
    // updated by the inMotion function, and then used
    // to fill the main attracting value.
    self.attractingNext = 0;

  }
  Particle.prototype.drawParticle = function(){
    var self = this;
    // self.hue = 184;// test color
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

// Got much help with the logic of the following function from CodePen
  function inMotion(){
// timer will be used to calculate our FPS
    var timer = (new Date()).getTime();

    // 1000ms divided by the number of ms it took
    // us since last update gives us how many times we
    // could have performed this frame within 1 second (FPS)
    FPS = (FPS + (1000 / (timer - renderTimer))) / 2;
    if(FPS === Infinity) FPS = 0;

    // timeAdjust is how far from the ideal speed we are
    // if we are rendering slower, this number will be higher.
    // we'll use this to adjust the amount of movement we perform
    // on each particle per frame.
    var timeAdjust = baseRenderSpeed / FPS;
    if(timeAdjust > 5) timeAdjust = 5;

    // set our renderTimer to now in preparation for next
    // time we update.
    renderTimer = timer;

    if(exploding) exploding--;
    var boom = exploding ? -1 : 1;

    // look at each particle and evaluate how it should move
    // next based on it's current valocity and attraction to
    // any other particles that are close enough.
    for(var i=0; i < particles.length; i++){ // **
      var dot = particles[i];

      dot.x += dot.velx * timeAdjust;
      dot.y += dot.vely * timeAdjust;

      if(dot.af > 0.8 && !exploding){
        exploding = explodeTime;
      }

      // check if other particles are affecting this particle
      // we use i+1 because we only need to check the
      // relationship between 2 particles once.
      for(var ii=i+1; ii < particles.length; ii++){
        var dot2 = particles[ii];

        // to get the distance between our 2 points we need
        // to calculate the difference for the x and y axis
        // then get the length of the hypotenuse
        // more info at: http://en.wikipedia.org/wiki/Pythagoreantheorem
        var diffX = dot2.x - dot.x;
        var diffY = dot2.y - dot.y;
        var distance = Math.sqrt(diffX*diffX + diffY*diffY);

        // attractAmt is the amount of attraction between the 2 points
        // numberOfAttrators tells whether both particles are attracting
        // each other, or if only one is. We need this because a particle's
        // attraction Radius is dependant on the number of particles it
        // is within range of.
        var attractAmt = 0,
          numberOfAttractors = 0;

        if(distance < dot.attractionRadius) {
          attractAmt += (dot.attractionRadius - distance) / dot.attractionRadius;
          attractAmt *= 1 - (dot.af * 0.01);
          numberOfAttractors++;
          dot.attractingNext++;
        }
        if(distance < dot2.attractionRadius) {
          attractAmt += (dot2.attractionRadius - distance) / dot2.attractionRadius;
          attractAmt *= 1 - (dot2.af * 0.01);
          numberOfAttractors++;
          dot2.attractingNext++;
        }

        // if either particle is attracting the other, make our adjustments
        if(numberOfAttractors > 0){

          // cut the attraction amount in 1/2 if only one is attracting
          attractAmt *= numberOfAttractors/2;
          // adjust for how fast our FPS clock is moving
          attractAmt *= timeAdjust;

          // diffX and diffY are used because we want to attract along the x and
          // y axis proportionately. we divide by 2000 to slow things a bit
          var vx = diffX * attractAmt / 500;
          var vy = diffY * attractAmt / 500;

          dot.velx += vx * boom;
          dot.vely += vy * boom;

          dot2.velx -= vx * boom;
          dot2.vely -= vy * boom;
        }
      }

      // We don't want to let the particles leave the
      // area, so just change their position when they
      // touch the walls of the window
      if(dot.x + dot.radius >= windowWidth && dot.velx > 0){
        dot.velx *= 0.1;
      } else if(dot.x - dot.radius < 0 && dot.velx < 0) {
        dot.velx *= -0.1;
      }

      if(dot.y + dot.radius > windowHeight && dot.vely > 0){
        dot.vely *= -0.8;
      } else if(dot.y - dot.radius < 0 && dot.vely < 0) {
        dot.vely *= -0.8;
      }

      if(mouseIsDown){
        var mdx = dot.x - mX;
        var mdy = dot.y - mY;

        mdist = Math.sqrt(mdx*mdx + mdy*mdy);
        var maxDist = windowWidth > windowHeight ? windowHeight : windowWidth;
        if(mdist < maxDist){
          var af = (maxDist-mdist)/maxDist;

          dot.velx -= (mdx*af)/1000;
          dot.vely -= (mdy*af)/1000;
        }
      }

      // We now know all the particles that dot is attracting
      // so we can set that value for use on the next update
      dot.attracting = dot.attractingNext;

      // and clear it out so it's ready to use next time.
      dot.attractingNext = 0;

      // what fraction of the overall particles are we attracting?
      // I call it the attraction fraction (af)
      dot.af = (dot.attracting + 1) / allParticles;

      // set this particle's hue based on how many other
      // particles it is attracting.
      dot.hue = parameters.color + (dot.af/0.8) * -200;

      // set the radius around the particle within which it will
      // attract other particles. we're using the startingAttractionRadius
      // and adding 1 pixel more for each particle we are already attracting.
      dot.attractionRadius = 100 + (dot.attracting);
    } // **
  }// *















// BEGIN HERE **********************************************************
  function start(){
    // Create a canvas, put it into our document, make it 2 dimensional
    canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
    ctx = canvas.getContext('2d'); // ctx = 'context'

    // Just in case user wants to resize window, canvas will follow
    windowSize();
    window.addEventListener( 'resize', windowSize, false );
    allParticles = Math.floor(windowWidth/80) * Math.floor(windowHeight/80) * particleDensity;

    // Finally, create particles according to window dimesions
    for(var i = 0; i < allParticles; i++){
      particles.push(new Particle(i));
    }
    // ...then draw them
    drawCanvas();
    mouseEvents();
  }

  function mouseEvents(){

    // Track mouse position
    window.addEventListener('mousemove', function(e){
      mX = e.x;
      mY = e.y;
    }, false);
    // Track mouse press
    window.addEventListener('mousedown', function(event){
      mouseIsDown = true;
    }, false);

    // Track mouse release
    window.addEventListener('mouseup', function(event){
      mouseIsDown = false;
    }, false);
  }

  start();
  return {
    parameters: parameters
  };
})();












