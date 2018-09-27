var currAnim = 'fractalPlant'
var drawSpeed = 10
var point = 0

//Drawing setup, add canvas to the html page

window.requestAnimationFrame = (function(){
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
})();


  function recursivelyProduceLSystem(string, n,rules){
    let  array = string.split('')
    for(q=0;q<array.length;q++){
      for(a=0;a<rules.length;a++){
        if(array[q]==rules[a][0]){
          array[q]=rules[a][1];
          break;
        }
      }
    }
    string = array.join('')
    if (n> 1){
      return recursivelyProduceLSystem(string, n-1,rules);
    } else {
      return string;
    }
  }



function createPointsForCurve(startX,startY,length,angle,startingAngle,points, string){
  stringToDraw = string;
  array = stringToDraw.split('');
  currentDir=startingAngle
  currentPos=[startX,startY]
  currDirBuffer = []
  currPosBuffer = []
  for(rule =0;rule<array.length;rule++){
    switch(array[rule]){
      case 'f':
      points.push([currentPos[0],currentPos[1],currentPos[0]+length*Math.cos(currentDir/180*Math.PI),currentPos[1]-length*Math.sin(currentDir/180*Math.PI)]);
      currentPos[0]+= length*Math.cos(currentDir/180*Math.PI);
      currentPos[1]-= length*Math.sin(currentDir/180*Math.PI);
      break;
      case 'g':
      points.push([currentPos[0],currentPos[1],currentPos[0]+length*Math.cos(currentDir/180*Math.PI),currentPos[1]-length*Math.sin(currentDir/180*Math.PI)]);
      currentPos[0]+= length*Math.cos(currentDir/180*Math.PI);
      currentPos[1]-= length*Math.sin(currentDir/180*Math.PI);
      break;
    case '+':
      currentDir -=angle;
      if(currentDir<0){
        currentDir=360+currentDir;
      }
      break;
    case '-':
      currentDir =(currentDir+angle)%360
      break;
    case '[':
      currDirBuffer.push(currentDir);
      currPosBuffer.push([currentPos[0],currentPos[1]]);
      break;
    case ']':
      currentDir =currDirBuffer.pop();
      currentPos =currPosBuffer.pop();
      break;

  }

  }

}


// Initialize
function _init() {

    // More setup for the canvas
    var canvas  = document.getElementById("canvas");
    var bufferCvs = document.createElement('canvas');

    var BACKGROUND_COLOR      = '#090a0b',
        PEN_COLOR             = '#fff'
        PARTICLE_RADIUS       = 1,
        DATA_SIZE = 1000

    var context,
        bufferCtx,
        screenWidth, screenHeight,
        grad;

    function resize(e) {
        screenWidth  = canvas.width  = window.innerWidth;
        screenHeight = canvas.height = window.innerHeight;
        bufferCvs.width  = screenWidth;
        bufferCvs.height = screenHeight;
        context   = canvas.getContext('2d');
        bufferCtx = bufferCvs.getContext('2d');

        var cx = canvas.width * 0.5,
            cy = canvas.height * 0.5;

        grad = context.createRadialGradient(cx, cy, 0, cx, cy, Math.sqrt(cx * cx + cy * cy));
        grad.addColorStop(0, '#344851');
        grad.addColorStop(1, '#344851');
    }


    // Init

    window.addEventListener('resize', resize, false);
    resize(null);

    //Variables for the Fractal curves
    tree1Counter= 0
    tree2Counter= 0
    tree3Counter= 0
    tree4Counter= 0
    //Rules for the Lindenmayer Systems
    dragonCurveRules =[
      ['x','x+yf'],
      ['y','fx-y'],
    ]
    peanoGosperRules =[
      ['x','x+yf++yf-fx--fxfx-yf+'],
      ['y','-fx+yfyf++yf+fx--fx-y'],
    ]

    hilberRules =[
      ['x','-yf+xfx+fy-'],
      ['y','+xf-yfy-fx+'],
    ]
    sierpinskiRules =[
      ['f','f-g+f+g-f'],
      ['g','gg'],
    ]
    fractalPlantRules =[
      ['x','f[-x][x]f[-x]+fx'],
      ['f','ff'],
    ]


    tree1Coords=[]
    tree2Coords= []
    tree3Coords= []
    tree4Coords = []

    //Populate the String that defines the Curve to draw with a start string, the amount of recursive steps wanted and the rules for the L-Systems.
    tree1 = recursivelyProduceLSystem('x',4,fractalPlantRules)
    tree2 = recursivelyProduceLSystem('x',5,fractalPlantRules)
    tree3 = recursivelyProduceLSystem('x',6,fractalPlantRules)
    tree4 = recursivelyProduceLSystem('x',7,fractalPlantRules)
    //Convert the generated String into a drawable form (Points with start and end coordinates to draw a line from and to)
    createPointsForCurve(200,600,3,25,90,tree1Coords,tree1)
    createPointsForCurve(400,600,3,25,90,tree2Coords,tree2)
    createPointsForCurve(600,600,3,25,90,tree3Coords,tree3)
    createPointsForCurve(800,600,3,25,90,tree4Coords,tree4)

context.save();
context.fillStyle = BACKGROUND_COLOR;
context.fillRect(0, 0, screenWidth, screenHeight);
context.fillStyle = grad;
context.fillRect(0, 0, screenWidth, screenHeight);
context.restore();

    var loop = function() {
        var i, len, g, p;

        bufferCtx.save();
        bufferCtx.globalCompositeOperation = 'destination-out';
        // bufferCtx.globalAlpha = 0.35;
        bufferCtx.fillRect(0, 0, screenWidth, screenHeight);
        bufferCtx.restore();


        bufferCtx.save();
        bufferCtx.fillStyle = bufferCtx.strokeStyle = PEN_COLOR;
        bufferCtx.lineCap = bufferCtx.lineJoin = 'butt';
        bufferCtx.lineWidth = PARTICLE_RADIUS * ((screenWidth/2)/DATA_SIZE);
        bufferCtx.beginPath();


        //--------------------------Fractal Plant-----------------------

          for(let l = 0;l<tree4Counter;l++){
            pointToDraw4 = tree4Coords[l];
            bufferCtx.moveTo(pointToDraw4[0], pointToDraw4[1]);
            bufferCtx.lineTo(pointToDraw4[2],pointToDraw4[3]);
        }
        tree4Counter +=drawSpeed
        if(tree4Counter>=tree4Coords.length){
          tree4Counter=0
        }

        for(let l = 0;l<tree3Counter;l++){
            pointToDraw3 = tree3Coords[l];
            bufferCtx.moveTo(pointToDraw3[0], pointToDraw3[1]);
            bufferCtx.lineTo(pointToDraw3[2],pointToDraw3[3]);
        }
        tree3Counter +=drawSpeed
        if(tree3Counter>=tree4Coords.length){
          tree3Counter=0
        }


        for(let l = 0;l<tree2Counter;l++){
            pointToDraw2 = tree2Coords[l];
            bufferCtx.moveTo(pointToDraw2[0], pointToDraw2[1]);
            bufferCtx.lineTo(pointToDraw2[2],pointToDraw2[3]);
        }
        tree2Counter +=drawSpeed
        if(tree2Counter>=tree4Coords.length){
          tree2Counter=0
        }


        for(let l = 0;l<tree1Counter;l++){
            pointToDraw1 = tree1Coords[l];
            bufferCtx.moveTo(pointToDraw1[0], pointToDraw1[1]);
            bufferCtx.lineTo(pointToDraw1[2],pointToDraw1[3]);
        }
        tree1Counter +=drawSpeed
        if(tree1Counter>=tree4Coords.length){
          tree1Counter=0
        }




        context.fillStyle = BACKGROUND_COLOR;
        context.fillRect(0, 0, screenWidth, screenHeight);

        bufferCtx.stroke();
        bufferCtx.beginPath();

        bufferCtx.fill();
        bufferCtx.restore();

        context.drawImage(bufferCvs, 0, 0);

        requestAnimationFrame(loop);
    };




    //curve.draw(bufferCtx)
    loop();

}