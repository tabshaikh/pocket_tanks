
  var canvas = document.getElementById("PocketCanvas"); //canvas variable initialized with id of pocketcanvas
  var stage = new createjs.Stage(canvas);
  var control_panel = 100;

  var tanks={};
  var bulletList={};
  var terrain = [];
  
  var firepower = 60;
  document.getElementById("firepower").innerHTML =firepower;
  var fireangle = 60;
  document.getElementById("fireangle").innerHTML =fireangle;

  //The tanks size is 80*30
  var rand=Math.floor(Math.random()*(canvas.width/2)); //variable to randomly position tank 1 on the terrain
  var rand1=Math.floor(Math.random()*(canvas.width/2))+canvas.width/2; //variable to randomly position tank 2 on the terrain
  

  circle = new createjs.Shape();
  circle.graphics.beginFill("black");
  circle.graphics.drawCircle(0,0,5);
  circle.graphics.endFill();
  createjs.MotionGuidePlugin.install();
  
  function init() 
  {
    generate_terrain();
    
    var tank1 = new Image();
    tank1.src = "./Client/img/tankVehicle.png";
    tank1.onload = handletankLoad1;	
    tank(1,rand,terrain[rand]-20);
    
    var tank2 = new Image();
    tank2.src = "./Client/img/tankVehicle.png";
    tank2.onload = handletankLoad2;
    tank(2,rand1,terrain[rand1]-20);

    console.log(tanks);
    this.document.onkeydown = keyPressed;
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick",tickHandler);
    stage.update();
  }
    
  function handletankLoad1(event) {
            var image = event.target;
            var bitmap = new createjs.Bitmap(image);
            stage.addChild(bitmap);
            bitmap.x = rand ;
            bitmap.y = terrain[rand] ;
            var tank1_angle= (Math.atan((terrain[rand + 10]-terrain[rand])/10))*(180/Math.PI);
            console.log(tank1_angle);
            //bitmap.rotation= tank1_angle;
            stage.update();
        }
  function handletankLoad2(event) {
            var image = event.target;
            var bitmap = new createjs.Bitmap(image);
            stage.addChild(bitmap);
            bitmap.x = rand1 ;
            bitmap.y = terrain[rand1] - 25;
            
            bitmap.rotation = 90;
            stage.update();
        }
// Function used to generate the terrain randomly
  function generate_terrain()
  {
    var lineShape = new createjs.Shape();
    
    //Initializing the features of the terrain
    var STEP_MAX = 2.0;
 	var STEP_CHANGE = .5;
 	var HEIGHT_MAX = canvas.height ;

   	// starting conditions
   	var height = (Math.random() * HEIGHT_MAX);
   	var slope = (Math.random() * STEP_MAX) * 2 - STEP_MAX;
   	// creating the landscape
   	for (var x = 0; x < canvas.width; x++) 
    {
        // change height and slope
        height += slope;
        slope += (Math.random() * STEP_CHANGE) * 2 - STEP_CHANGE;

      // clip height and slope to maximum
      if (slope > STEP_MAX) { slope = STEP_MAX };
      if (slope < -STEP_MAX) { slope = -STEP_MAX };
 
      if (height > HEIGHT_MAX) { 
          height = HEIGHT_MAX;
          slope *= -1;
      }
      if (height < 0 || height > 0 && height < 100 ) { 
          height = 105;
          slope *= -1;
      }
      lineShape.graphics.beginLinearGradientFill(["#794c13","green"],[0.8,0.9],x,HEIGHT_MAX,x,height );
  	  lineShape.graphics.setStrokeStyle(10).beginLinearGradientStroke(["#794c13","green"],[0.7,0.9],x,HEIGHT_MAX,x,height).moveTo(x,HEIGHT_MAX).lineTo(x,height);
      terrain.push(height);
      stage.addChild(lineShape);
  	}
  }

  function keyPressed(event) {
    switch(event.keyCode) {
      case 32:
      	var time =  (2 * tanks[1].bullet_speed * Math.	sin(tanks[1].bullet_angle * Math.PI / 180)) / 9.8;
      	var height = Math.pow(tanks[1].bullet_speed * Math.sin(tanks[1].bullet_angle * Math.PI / 180),2) / (2 * 9.8);
      	var range = Math.pow(tanks[1].bullet_speed,2) * Math.sin(2 * tanks[1].bullet_angle * Math.PI / 180) / 9.8;
      	console.log(time);
       	console.log(height);
      	console.log(range);
      	var canvas_height = tanks[1].y - height;
        createjs.Tween.get(circle).to({guide:{ path:[tanks[1].bullet_initial_coor_x,tanks[1].bullet_initial_coor_y, tanks[1].bullet_initial_coor_x,canvas_height,(tanks[1].x)+  (range)/2,canvas_height, (tanks[1].x)+(range),canvas_height,(tanks[1].x)+(range),terrain[Math.floor((tanks[1].x)+(range))]] }},time*200);
        stage.addChild(circle);
        //var path = new createjs.Shape();
		// path.graphics.beginStroke("#ff00ff").moveTo(tanks[1].bullet_initial_coor_x,tanks[1].bullet_initial_coor_y).curveTo(tanks[1].bullet_initial_coor_x,canvas_height,(tanks[1].x)+  (range)/2,canvas_height,).curveTo((tanks[1].x)+(range),canvas_height,(tanks[1].x)+(range),terrain[Math.floor((tanks[1].x)+(range))]);
		// stage.addChild(path)				
        break;  
    }
    stage.update();
  }

  function tickHandler(e){
        stage.update();
      }

  tank = function (id,x,y){
        var asd = {
        		id:id,
                x:x,
                y:y,
                bullet_initial_coor_x:x+2,
                bullet_initial_coor_y:y,
                bullet_speed:fireangle,
                bullet_angle:firepower             
                };
        tanks[id] = asd;
    }

Bullet = function (id,x,y,spdX,spdY,width,height){
        var asd = {
                x:x,
                spdX:spdX,
                y:y,
                spdY:spdY,
                name:'E',
                id:id,
                width:width,
                height:height,
                color:'black',
                timer:0,
        };
        bulletList[id] = asd;
}

function decrease_speed(){
    if(firepower > 0)
    {
        firepower = firepower -1;
        tanks[1].bullet_speed = tanks[1].bullet_speed - 1;
    }
    document.getElementById("firepower").innerHTML =firepower;
}
function increase_speed(){
    if(firepower < 100)
    {
    firepower = firepower + 1;
    tanks[1].bullet_speed = tanks[1].bullet_speed + 1;
    }
    document.getElementById("firepower").innerHTML =firepower;
}
function decrease_angle(){
    if(fireangle > 0)
    {
    fireangle = fireangle -1;
    tanks[1].bullet_angle = tanks[1].bullet_angle - 1;
    }
    document.getElementById("fireangle").innerHTML =fireangle;
}
function increase_angle(){
    if(fireangle < 180)
    {
    fireangle = fireangle + 1;
    tanks[1].bullet_angle = tanks[1].bullet_angle + 1;
    }
    document.getElementById("fireangle").innerHTML =fireangle;
}