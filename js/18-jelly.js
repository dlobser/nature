/*
todo - incorporate offset into the anim params
figure out how to rotate around arbitrary axis
add scale controls for helper geo and exporter
make better camera controls - or see if you can just orbit when something is true
add controller to grow limbs, one after the next
see why built in per limb ss is setting position of joints incorrectly
add a way for subleafs to see where they are on the bigger tree


*/

var num = 0;
var rebuild = false;
var things = [];
var boxes = [];
var vector = new THREE.Vector3(0,0,0);
var objRotate = false;
var sizeCounter=0;
var helpGeo = false;
var paint = [];
var particleTimer = 0;
var particleIn = true;
readyToBurst = true;
var push = 0;
var jigCounter = 0;
var debug = false;
var built = false;

var mx = 0;
var my = 0;
var mz = 0;



var noise = new ImprovedNoise();

var thisKey = 1;
var objLoaded = 0;

var parenter = new THREE.Object3D();

var counter = 0;
var count = 0;
var spine = [];

var up = 0;

helperGeo = function(){
	helpGeo = !helpGeo;
}

writePaint = function(){
	saver2();
}

slidersToParams = function(){
	var div = document.getElementById('user');
	var options = document.getElementById('select').options;
	//var divAnim = document.getElementById('anim');
	
	div.value = JSON.stringify(things[0].p);
	//divAnim.value = "{}";	
}

applyPreset = function(){

	var div = document.getElementById('user');
	var options = document.getElementById('select').options;
	var divAnim = document.getElementById('anim');
	
	switch(options.selectedIndex)
	{
	case 0:
		div.value = '{"geoDivs":3,"color1":16777215,"color2":16777215,"color3":16777215,"color4":16777215,"color5":16777215,"anim":{"size":47.94137209302124,"speed":0.01127554615926709,"speed2":5.073995820930233,"num":-214.52494437326584,"x":0.0020954678614509737,"y":0.0014658210007047218,"z":0,"x1":[0,0,0.2,0.3,0],"y1":[0.1,0],"z1":[0,null],"x2":[0,1.1567879926008926,0],"y2":[-0.8,null],"z2":[0,null],"x3":[0.07505285412262153,1.5464428953717198,1],"y3":[0.2441860465116279,null],"z3":[0,null],"x4":[0,null],"y4":[0,null],"z4":[0,null],"off":[0,0],"sc":[1,1,1,1,1,1,1,1,1,1],"def":[0]},"fruitSize":{"x":5,"y":5,"z":5},"num":20,"scale":[5,8,5],"sx":5,"sy":8,"sz":5,"ss":1,"leaves":1,"divs":20,"rads":25,"animFunc":2,"fruit":true,"fruitScale":{"x":5,"y":5,"z":5},"leafJoints":[10,20],"leafDivs":[2,4],"leafss":[0.96,0.95],"angles":[0.6283185307179586,0.6283185307179586],"term":[0,1],"jScale":[{"x":-1,"y":-1,"z":-1},{"x":3,"y":12,"z":3}],"leafRads":[25,25]}';
		rebuilder();
		break;
	

	default:
	   div.value = '{"num":200,"scale":[2,8,2],"ss":1,"leaves":1,"divs":2,"rads":1,"leafss":[0.95,0.8,0.2],"leafDivs":[2,2,2],"fruit":true,"term":[0,1,2,3],"leafJoints":[10,15,10],"jScale1":[2,5,2],"anim":{"num":2.7}}';
	
	}
	

}

sc1 = function(){

	var container,
	camera, 
	controls, 
	renderer;	
	//things = [];
	var rAm = Math.PI/2;
	this.scene;
	this.aud;
	this.ball;
	this.grad;
	var text;
	this.rebuild = false;
	this.pos = new THREE.Vector3(0,0,0);
	this.particleSystem;
	this.particleCounter = 0;
	this.particles;
	
	this.keyAvg = [];
	this.defCamPose = new THREE.Vector3(550,-50,0);
	//setup dat.gui
	var starfield = function()
	{
		this.speed = 0.01;
		this.speed2 = 2;
		this.size = 1;
		this.x = 0.0001;
		this.y = 0.0001;
		this.z = 0.0001;
		this.x2 = 0.000;
		this.y2 = 0.000;
		this.z2 = 0.000;
		this.xw = 0.000;
		this.yw = 0.000;
		this.zw = 0.000;
		this.x1 = 0.000;
		this.y1 = 0.000;
		this.z1 = 0.000;
		this.fruitSize = 0;
		
		this.num=20;
		//this.scale:new THREE.Vector3(5,10,5);
		this.ss=.96;
		//this.leaf1ss:.8;
		//this.leaf0ss:.9;
		this.leaves=1;
		this.divs=2;
		this.rads=2;
		
		this.rotatorx=0;
		this.rotatory=0;
		this.rotatorz=0;
		
		this.rebuilder = function() { 
			//console.log(scene.text);
			//killEverything(scene);
			//console.log(rebuild);
			rebuild = true;
			//console.log(rebuild);
			//sc1.prototype.addGeo();

		};
		//this.term1:0;
		//this.term2:1;
		//this.term3:2;
		//this.term4:3;
		//this.angle1:.5;
		//this.angle2:.1;
		//this.fruit:true;
		//this.fruitScale:new THREE.Vector3(5,5,5)
		
		for( var i = 0 ; i < 6 ; i++){
		
			this["x1-"+i] = 0;
			this["y1-"+i] = 0;
			this["z1-"+i] = 0;
			
			this["x2-"+i] = 0;
			this["y2-"+i] = 0;
			this["z2-"+i] = 0;
			
			this["x3-"+i] = 0;
			this["y3-"+i] = 0;
			this["z3-"+i] = 0;
			
			this["x4-"+i] = 0;
			this["y4-"+i] = 0;
			this["z4-"+i] = 0;
			
			this["off-"+i] = 0;
			
			this["sc-"+i] = 1;
		}
	};
	
    this.text = new starfield();
	
	/*
	var gui = new dat.GUI();
	//gui.remember(this.text);
	// gui.add(text, 'message');
	var f0 = gui.addFolder('constructdor');
		//f0.add(this.text, 'num',1,100);
	//	f0.add(this.text, 'ss',.8,1.2);
		//f0.add(this.text, 'leaves',0,6);
		//f0.add(this.text, 'divs',1,30);
		//f0.add(this.text, 'rads',1,20);
		//f0.add(this.text, 'rebuilder');
		//f0.add(this.text, 'rotatorx',-3,3);
		//f0.add(this.text, 'rotatory',-3,3);
		//f0.add(this.text, 'rotatorz',-3,3);
		f0.add(this.text, 'fruitSize',0.01,10);
	
	var f1 = gui.addFolder('motion');
		f1.add(this.text, 'speed', 0, .1);
		f1.add(this.text, 'speed2', 0.0000001,10);
		f1.add(this.text, 'size', 1, 100);
		f1.add(this.text, 'x', 0,.01);
		f1.add(this.text, 'y', 0,.01);
		f1.add(this.text, 'z', 0,.01);
	
	for( var i = 0 ; i < 6 ; i++){
		//console.log("pre: " + rAm);
		if(i<1){
			rAm=.5;
		}
		else
			rAm = Math.PI/2;
	//	console.log("rArm: " + rAm);
		this['fol'+i] = gui.addFolder('level' + i);
		
		this['fol'+i].add(this.text, 'x1-'+i, -rAm,rAm).listen();
		this['fol'+i].add(this.text, 'y1-'+i, -rAm,rAm);
		this['fol'+i].add(this.text, 'z1-'+i, -rAm,rAm);
		
		this['fol'+i].add(this.text, 'x2-'+i, -rAm,rAm);
		this['fol'+i].add(this.text, 'y2-'+i, -rAm,rAm);
		this['fol'+i].add(this.text, 'z2-'+i, -rAm,rAm);
		
		this['fol'+i].add(this.text, 'x3-'+i, -rAm,rAm);
		this['fol'+i].add(this.text, 'y3-'+i, -rAm,rAm);
		this['fol'+i].add(this.text, 'z3-'+i, -rAm,rAm);
		
		this['fol'+i].add(this.text, 'x4-'+i, -rAm,rAm);
		this['fol'+i].add(this.text, 'y4-'+i, -rAm,rAm);
		this['fol'+i].add(this.text, 'z4-'+i, -rAm,rAm);
		
		this['fol'+i].add(this.text, 'off-'+i, -10,10);
		
		this['fol'+i].add(this.text, 'sc-'+i, .8,1.5).listen();
		
	}
//console.log(this.text);
//	gui.add(this.text, 'sizerx', 0,10);
//	gui.add(this.text, 'sizery', 0,10);
//	gui.add(this.text, 'sizerz', 0,10);
f1.open();
*/
}

//sets up the three scene and calls addGeo
sc1.prototype.init = function() {
	$(".everything").hide();
	this.noiseMap = THREE.ImageUtils.loadTexture('textures/noise.png');
	this.gradMap = THREE.ImageUtils.loadTexture('textures/particle.png');
	

	this.camera = new THREE.PerspectiveCamera( 25, window.innerWidth / window.innerHeight, 1, 10000 );
	this.camera.position = 	this.defCamPose;

	//this.controls = new THREE.OrbitControls( this.camera );
	//this.controls.addEventListener( 'change', this.render );

	this.scene = new THREE.Scene();
	this.scene.fog = new THREE.FogExp2( 0x000000, 0.005 );
	//console.log(this.scene.fog.density);
	this.camera.lookAt(new THREE.Vector3(0,-10,0));
	//this.scene.add(this.camera);
	this.aud = new Audio('audio/water-bowl.wav');
	this.aud.init();

	var loader2 = new THREE.OBJLoader();
				
	loader2.addEventListener( 'load', function ( event ) {

		var object = event.content;

		object.position = new THREE.Vector3(  0,-25,0  );
		object.scale.x = 10000;
		spine.push(object);
		loader2.object = object;
		objLoaded+=1;

		
	});
	
	loader2.load( 'models/vertebrae_lorez.obj' );
	loader2.load( 'models/bone.obj' );
	
	
	parenter = new THREE.Object3D();
	
	this.makeBall();
	
	this.addGeo();

	var light = new THREE.DirectionalLight( 0xffffff );
	light.position.set( 1, 1, 1 );
	this.scene.add( light );
	
	var light = new THREE.AmbientLight( 0xff9933 );
	light.intensity = 50;
	this.scene.add( light );

	light = new THREE.DirectionalLight( 0x002288 );
	light.position.set( -1, -1, -1 );
	this.scene.add( light );

	light = new THREE.AmbientLight( 0x222222 );
	//this.scene.add( light );

	this.renderer = new THREE.WebGLRenderer( { antialias: true } );
	//this.renderer.setClearColor( scene.fog.color, 1 );
	this.renderer.setSize( window.innerWidth, window.innerHeight-5);	

	this.container = document.getElementById( 'container' );
	this.container.appendChild( this.renderer.domElement );
	this.makeNoise();
	//window.addEventListener( 'resize', onWindowResize, false );
	//console.log(this.renderer, + " " + this.scene.children.length + " " + this.camera.toString());

	
}

sc1.prototype.addGeo = function(){

	

	var geometry = new THREE.CylinderGeometry( 0, 10, 30, 4, 1 );
	var g2 = new THREE.CubeGeometry( 1,1,1 );
	var g1 = new THREE.Geometry();
	var material =  new THREE.MeshLambertMaterial( { color:0xffffff, shading: THREE.FlatShading } );

	var div = document.getElementById('user');
	//var divAnim = document.getElementById('anim');
	user.defaultValue ='{"geoDivs":3,"color1":16777215,"color2":16777215,"color3":16777215,"color4":16777215,"color5":16777215,"anim":{"size":58.714930232559325,"speed":0.004510218463706836,"speed2":3.833685755813953,"num":0,"x":0.004397463002114165,"y":0.01,"z":0,"x1":[0,0.19624803324595885,0.2,0.3,0],"y1":[0.1990838618745595,0.2],"z1":[0,null],"x2":[0,0.36948767638721924,0],"y2":[0,-0.21952711029306582],"z2":[0,null],"x3":[0.26673713883016203,1,1],"y3":[0,1.5707963267948966],"z3":[0,null],"x4":[0,1.5707963267948966],"y4":[0,null],"z4":[0,null],"off":[0,0],"sc":[0.94,0.9240410132689988,1,1,1,1,1,1,1,1],"def":[0]},"fruitSize":{"x":5,"y":5,"z":5},"num":55,"scale":[9,9,9],"sx":12,"sy":12,"sz":12,"ss":1,"leaves":1,"divs":2,"rads":3,"animFunc":2,"fruit":true,"fruitScale":{"x":1,"y":1,"z":1},"leafJoints":[10,5],"leafDivs":[2,4],"leafss":[1,0.9],"angles":[0.6283185307179586,0.6283185307179586],"term":[0,1],"jScale":[{"x":-1,"y":-1,"z":-1},{"x":1,"y":24,"z":1}],"leafRads":[2,2]}';
	
	var defaultValue2 ='{"geoDivs":3,"color1":16777215,"color2":16777215,"color3":16777215,"color4":16777215,"color5":16777215,"anim":{"size":58.714930232559325,"speed":0.004510218463706836,"speed2":3.833685755813953,"num":0.5,"x":0.004397463002114165,"y":0.01,"z":0,"x1":[0,-0.09624803324595885,0.2,0.3,0],"y1":[0,0.0],"z1":[0,null],"x2":[0,1.36948767638721924,0],"y2":[0,-0.21952711029306582],"z2":[0,null],"x3":[0,0.4,0],"y3":[0,0],"z3":[0,null],"x4":[0,1.5707963267948966],"y4":[0,null],"z4":[0,null],"off":[0,0],"sc":[0.97,0.9540410132689988,1,1,1,1,1,1,1,1],"def":[0]},"fruitSize":{"x":5,"y":5,"z":5},"num":4,"scale":[8,4,8],"sx":12,"sy":12,"sz":12,"ss":1,"leaves":1,"divs":4,"rads":33,"animFunc":2,"fruit":true,"fruitScale":{"x":1,"y":1,"z":1},"leafJoints":[10,25],"leafDivs":[4,4],"leafss":[1,0.95],"angles":[0.6283185307179586,0.6283185307179586],"term":[0,1,2,3,4],"jScale":[{"x":-1,"y":-1,"z":-1},{"x":3,"y":16,"z":3}],"leafRads":[33,12]}';
	
	//console.log(parenter);
	//console.log("parenter");
	
	
	var your_object = JSON.parse(user.value);
	var parms={color1:0x225577,color2:0xbbffdd,color3:0x0099ff,geo2:new THREE.SphereGeometry(0.1,12,6)};
	this.rotator = new THREE.Object3D(0,0,0);
	var mesh = new THREE.Mesh(geometry);
	var dir = new THREE.Vector3(.1,.5,-.4);
	
		var totalJoints = 1000;
	
		var numJoints = 1000;
	
		//trying to count total joints - my technique is not working 
		while(totalJoints > 250 || totalJoints < -500){
			
			//totalJoints = 0;
			numJoints = 1000;
			
			while(numJoints > 250 || numJoints < 20){
			
				your_object.scale = [9,rand(8,16),9];
				your_object.anim.size = rand(15,80);
				your_object.num = randInt(10,50);
				your_object.anim.y1[0] = 0;
				your_object.anim.x3[0] = rand(0.3,0.9);
				your_object.anim.y3[0] = rand(-1,1);
				your_object.anim.z3[0] = rand(0.1,0.81);
				your_object.anim.x3[1] = rand(0.1,3);
				your_object.anim.y3[1] = rand(0.001,1);
				your_object.anim.z3[1] = rand(0.1,1);
				your_object.anim.speed = rand(0.0001,0.0051);
				your_object.divs = randInt(2,5);
				your_object.anim.num = rand(1,100);
				your_object.leafRads[0] = randInt(2,5);
				your_object.anim.x2[1] = rand(-0.5,0);
				
				your_object.jScale[1].y = rand(8,32);
				your_object.jScale[1].x = rand(1,8);
				your_object.jScale[1].z = your_object.jScale[1].x;
				your_object.leafJoints[1] = randInt(6,18);
				numJoints = your_object.num + ( (your_object.num/your_object.divs) * your_object.leafJoints[1] * your_object.rads);
			}
			
			if(your_object.num > 20){
				your_object.anim.x3[0] = rand(0.6,0.9);
			}
			
			totalJoints -= numJoints;
			var your_object2 = JSON.parse(defaultValue2);
			var numJoints2 = 0;
				
			while(numJoints2 > 500 || numJoints2 < 200){
				your_object2.leafRads[0] = randInt(6,25);
				your_object2.leafJoints[1] = randInt(15,42);
				your_object2.jScale[1].y = rand(8,20);
				your_object2.jScale[1].x = rand(2,5);
				your_object2.jScale[1].z = your_object2.jScale[1].x;
				your_object2.anim.size = rand(15,30);
				your_object2.anim.x3[0] = rand(0.1,1.5);
				your_object2.anim.x1[1] = rand(-0.1,-0.2);
				your_object2.anim.x2[1] = rand(1.1,1.5);
				your_object2.anim.y3[1] = rand(-.1,.1);
				
				numJoints2 = your_object2.num + ( (your_object2.num/your_object2.divs) * your_object2.leafJoints[1] * your_object2.rads);
				//console.log(numJoints);
			}
			
			totalJoints -= numJoints2;
				console.log(totalJoints);
		}
	
		//console.log ("numb joints: " + numJoints);
		
		if(spine.length>0){
			your_object.altGeo = [];
			your_object.altGeo[0] = spine[0].children[0].geometry;
			your_object.altGeo[1] = spine[1].children[0].geometry;
		}
		
		//console.log(your_object.altGeo || "boof");
		
		your_object.fruitScale = new THREE.Vector3(0,0,0);
		your_object.geo2 = new THREE.SphereGeometry(0.1,12,6);
		
		for ( var i = 0 ; i < 1 ; i++){
		
			var cuber = new peep(your_object);
			
			cuber.makeParams(your_object);
			//console.log(JSON.stringify(cuber.p));
			//console.log(cuber.joints);
			cuber.branchSquares();
			cuber.big.position.y = 20;
			cuber.big.rotation.x = Math.PI;
			
			parenter.add(cuber.big);

			//this.scene.add(this.rotator);
			things.push(cuber);
			things[i].animVals = cuber.p.anim;
			
			for(var i = 0 ; i < cuber.branches.length ; i++){
				
					//console.log(cuber.branches[i][0].parent.parent.rotation.y);
				
			
			}
			for (var q = 0 ; q <= things[0].p.leaves ; q++){
			
				this.text["x1-"+q]=things[0].p.anim.x1[q];
				this.text["y1-"+q]=things[0].p.anim.y1[q];
				this.text["z1-"+q]=things[0].p.anim.z1[q];
				this.text["x2-"+q]=things[0].p.anim.x2[q];
				this.text["y2-"+q]=things[0].p.anim.y2[q];
				this.text["z2-"+q]=things[0].p.anim.z2[q];
				this.text["x3-"+q]=things[0].p.anim.x3[q];
				this.text["y3-"+q]=things[0].p.anim.y3[q];
				this.text["z3-"+q]=things[0].p.anim.z3[q];
				this.text["x4-"+q]=things[0].p.anim.x4[q];
				this.text["y4-"+q]=things[0].p.anim.y4[q];
				this.text["z4-"+q]=things[0].p.anim.z4[q];
				this.text["sc-"+q]=things[0].p.anim.sc[q];
				
			}
			
			this.text.speed = things[0].p.anim.speed;
			this.text.speed2 = things[0].p.anim.speed2;
			this.text.x = things[0].p.anim.x;
			this.text.y = things[0].p.anim.y;
			this.text.z = things[0].p.anim.z;
			this.text.size = things[0].p.anim.size;
			
			//this.text

			
			
			
				totalJoints+= numJoints2;
					
		
		

		
	/*
		while(numJoints > 350 || numJoints < 100){
		
			your_object2.leafRads[0] = randInt(12,35);
			your_object2.leafJoints[1] = randInt(16,32);
			your_object2.jScale[1].y = rand(12,20);
			your_object2.jScale[1].x = rand(1,8);
			your_object2.jScale[1].z = your_object2.jScale[1].x;
		
			your_object2.anim.size = randly(1,100);
			your_object2.num = randInt(10,20);
			
			your_object2.anim.x3[0] = randly(0.1,0.81);
			your_object2.anim.y3[0] = randly(0.001,0.1);
			your_object2.anim.z3[0] = randly(0.1,0.41);
			your_object2.anim.x3[1] = randly(0.1,3);
			your_object2.anim.y3[1] = randly(0.001,1);
			your_object2.anim.z3[1] = randly(0.1,1);
			your_object2.anim.speed = randly(0.01,0.05);
			your_object2.divs = randInt(2,5);
			your_object2.anim.num = rand(1,100);
			your_object2.leafRads[0] = randInt(2,5);
			your_object2.anim.x2[1] = rand(-0.5,0);
			your_object2.jScale[1].y = rand(6,12);
			your_object2.jScale[1].x = rand(1,8);
			your_object2.jScale[1].z = your_object2.jScale[1].x;
			your_object2.leafJoints[1] = randInt(6,12);
		
		
			numJoints = your_object2.num + ( (your_object2.num/your_object2.divs) * your_object2.leafJoints[1] * your_object2.rads);
		
		}
				*/
		if(spine.length>0){
			your_object2.altGeo = [];
			your_object2.altGeo[0] = spine[0].children[0].geometry;
			your_object2.altGeo[1] = spine[1].children[0].geometry;
		}
		
		var cuber2 = new peep(your_object2);
		
		cuber2.makeParams(your_object2);
		cuber2.branchSquares();
		cuber2.big.position.y = 20;
		cuber2.big.rotation.x = Math.PI;
		
		parenter.add(cuber2.big);

		this.scene.add(parenter);
		things.push(cuber2);
		
	}
	


	console.log(things);

}

sc1.prototype.moveThings = function(){

	if(thisKey-48 > -1 && thisKey-48 < 11){
		this.keyAvg.push(thisKey-48);
	}
	
	if(this.keyAvg.length>20){
		this.keyAvg.shift();
	}
	
	var sum = 0;
	
	for (var p in this.keyAvg){
		sum += this.keyAvg[p];
	}
	
	var avg = sum/this.keyAvg.length;
	
	for ( var j = 0 ; j <   things.length  ; j++){
	
		var thing = things[j];
		
		for (var q = 0 ; q <= thing.p.leaves ; q++){
			//if(q>0)
			//thing.p.anim.x3[q] = map_range(avg,0,10,0.1,3.2);
		}
		if(j==0){
			for (var q = 0 ; q <= thing.p.leaves ; q++){
			
				//thing.p.anim.x1[q] = this.text["x1-"+q];
				if(q>0)
				thing.p.anim.x1[q] = this.text["x1-"+q] + map_range(avg,0,10,0,0.5);
				else
				thing.p.anim.x1[q] = this.text["x1-"+q];
				
				
				thing.p.anim.y1[q] = this.text["y1-"+q];
				
				if(q>0)
				thing.p.anim.z1[q] = this.text["z1-"+q] + (Math.sin(count*.01))*.3;
				
				else
					thing.p.anim.z1[q] = this.text["z1-"+q];
				thing.p.anim.x2[q] = this.text["x2-"+q];
				thing.p.anim.y2[q] = this.text["y2-"+q];
				thing.p.anim.z2[q] = this.text["z2-"+q];
				//thing.p.anim.x3[q] = this.text["x3-"+q];
				thing.p.anim.y3[q] = this.text["y3-"+q];
				thing.p.anim.z3[q] = this.text["z3-"+q];
				thing.p.anim.x4[q] = this.text["x4-"+q];
				thing.p.anim.y4[q] = this.text["y4-"+q];
				thing.p.anim.z4[q] = this.text["z4-"+q];
				thing.p.anim.off[q] = this.text["off-"+q];
				thing.p.anim.sc[q] = this.text["sc-"+q];// + mysc;
				
			}

			
			for (var q = 0 ; q < thing.fruit.length ; q++){
				thing.fruit[q].scale = new THREE.Vector3(this.text.fruitSize,this.text.fruitSize,this.text.fruitSize);
			
			}
			
			
			
			//thing.p.anim.size += sizeCounter;
			thing.p.anim.x = this.text.x;// + rand(0,.00001);
			thing.p.anim.y = this.text.y;
			thing.p.anim.z = this.text.z;
			thing.p.anim.speed = this.text.speed;
			thing.p.anim.speed2 = this.text.speed2;
		}
		sizeCounter=0.1;
		jigCounter += sizeCounter;
		
		
//		console.log(this.scene.fog.density);
		//if(thing.p.anim.size > 100)
		//	helpGeo = true;
			
		parenter.position.y = 40+Math.sin(thing.p.anim.num)*5;
		parenter.rotation.y = thing.p.anim.num/10;
		
		thing.animate();
		thing.p.anim.num-=(this.text.speed*this.text.speed2) + avg*.03;// * (((thisKey-48)*2)+.21);
		//thing.p.anim.num-=(Math.sin(jigCounter*((thisKey-48)*.6)*12)*((thisKey-48)*.01));// + sizeCounter*.1;
		//console.log((Math.sin(jigCounter*1.3)*.10));
		if(helpGeo)up += map_range(this.text.speed*this.text.speed2,0,Math.PI*2,0,1.27);
	}	
	
	if(thisKey-48 == 9 && particleIn && readyToBurst){
		helpGeo = true;
		readyToBurst = false;
		built = true;
		
	}
	
	this.camera.position.y += rand(-.051,.0510);
	this.camera.position.z += rand(-.051,.051);
	this.camera.position.x += rand(-.051,.05);
	
	count++;
	
	if(count%2==0){
	this.scaleBones((thisKey*.17)-7,things[0].branches);
	this.scaleBones((thisKey*.17)-7,things[1].branches);
	}
	
	var rot = new THREE.Vector3(this.text.rotatorx,this.text.rotatory,this.text.rotatorz);

	this.rotator.rotation = vector;
}

sc1.prototype.scaleBones = function(amt,array,avg){

	
	for( var q in array ){
	if(q>0){
		array[q][0].children[1].children[0].children[0].children[0].scale = new THREE.Vector3(amt,1,amt);
		array[q][1].children[0].children[1].children[0].children[0].children[0].scale = new THREE.Vector3(amt,1,amt);
		
		for ( var i = array[q].length-3 ; i > 1; i-- ){
		//console.log(array[q][i].children[0]);
		//if(q>1)
		 array[q][i].children[0].children[1].children[0].children[0].children[0].scale = array[q][i-1].children[0].children[1].children[0].children[0].children[0].scale;
		 
		}
	}
	}

}

sc1.prototype.animate = function(){
	//fade it in
	//if(this.scene.fog.density>0.0001)
	//	this.scene.fog.density -= 0.0001;
	this.scene.fog.density =0;
	
	if(built){
		this.setAudioPos();
	}
	
	for (var p in things){
	
		if(particleTimer<things[p].msh.length){
			things[p].msh[particleTimer].visible = true;
		}
		
	}

	if(counter<50){
		counter++;
	}
	
	particleTimer++;

	if(rebuild && particleIn){
		this.makeParticle();
		this.makeBall(300);
			
		this.aud.init();
	
		particleTimer = 0;
		particleIn = false;
		push = 1000;
		
	}
	


	
	if(rebuild || objLoaded==2){
	
		//this.aud.stopper();
		if(!debug)
			var parCount = 170;
		else
			var parCount = 1;
		
		if(particleTimer > parCount){
			counter = 3;
			objLoaded = 0;
			this.scene.fog.density = 0.005;
			//make a fake tree
			if(helpGeo){
		
				var tree = new THREE.Object3D();
				for (var i in things){
					tree.add(makeLimbGeo(things[i],.5));
				}
			}
			
			things = [];
			parenter = new THREE.Object3D();
			killEverything(scene);
			this.makeBall(150);
			
			this.addGeo();
			
			this.camera.position.y = -50;
			this.camera.position.x = 550;
			this.camera.position.z = 0;
			
			if (helpGeo){
				this.scene.add(tree);
				things[0].msh.push(tree.children[0].children[0]);
			}
			
			rebuild = false;
			particleIn = true;
			readyToBurst = true;
			particleTimer = 0;

		}
	}
	
	
	this.scaleBall();
	this.moveNoise();
	this.moveParticle();
	//this.render();
	this.renderer.render( this.scene, this.camera );
	if(this.text.speed*this.text.speed2 !=0){
		this.moveThings();
	}
	var that = this;
	
	 setTimeout( function() {
	requestAnimationFrame( function() { that.animate(); });
	 }, 1000 / 60 );

	
	//this little section is left over from processing - 
	if(helpGeo){
		killEverything(scene);
		counter++;
		if(counter>1){
			helpGeo = false;
			counter = 0;
			rebuild = true;
		}
	}
}

sc1.prototype.render = function() {
	//console.log("wtf");
	//wtf does this throw errors even when it's not being used?
	//this.renderer.render( this.scene, this.camera );

}

sc1.prototype.setAudioPos = function(){

	var poser = things[0].branches[0][things[0].branches[0].length-1];


	var thisVert = new THREE.Vector3(0,0,0);
	this.scene.updateMatrixWorld(true);
	poser.updateMatrixWorld();
	poser.autoUpdateMatrix = true;

	thisVert.getPositionFromMatrix(poser.matrixWorld);
	  
	mx = thisVert.x || 0;
	my = thisVert.y || 0;
	mz = thisVert.z || 0;
	
	//console.log(mx);

}

sc1.prototype.makeParticle = function(){
	

	
	var allmsh = things[0].msh.concat(things[1].msh);
	//console.log(allmsh);
	this.particleCount = allmsh.length,
	this.particles = new THREE.Geometry(),
		pMaterial =
		  new THREE.ParticleBasicMaterial({
			color: 0xFFFFFF,
			size:125
		  });

	// now create the individual particles
	for(var p = 0; p < this.particleCount; p++) {

		// create a particle with random
		// position values, -250 -> 250
		var thing = allmsh[p];
		
		var thisVert = new THREE.Vector3(0,0,0);
		this.scene.updateMatrixWorld(true);
		allmsh[p].updateMatrixWorld();
		allmsh[p].autoUpdateMatrix = true;
		
		thisVert.getPositionFromMatrix(allmsh[p].matrixWorld);
		
		particle = new THREE.Vertex(thisVert);
			  
		particle.velocity = new THREE.Vector3(rand(-.01,.01)+.41, rand(-.1,.1), rand(-.1,.1));  
		particle.acceleration = new THREE.Vector3(0,0,0);  
		
		this.particles.vertices.push(particle);

	}
	
		// create the particle variables
	var pMaterial =
	  new THREE.ParticleBasicMaterial({
		color: 0xFFFFFF,
		depthWrite:false,
		size: 34,
		map: THREE.ImageUtils.loadTexture(
		  "textures/particle.png"
		),
		//blending: THREE.AdditiveBlending,
		transparent: true
	  });

	

	// create the particle system
	this.particleSystem =
	  new THREE.ParticleSystem(
		this.particles,
		pMaterial);

		// also update the particle system to
	// sort the particles which enables
	// the behaviour we want
	this.particleSystem.sortParticles = true;
	// add it to the scene
	var that = this;
	//console.log(this.scene);
	this.scene.add(this.particleSystem);

}

sc1.prototype.moveParticle = function(){
	


	
	if(this.particleCount > 0){
	
		  var pCount = this.particleCount;
		  while(pCount--) {

			// get the particle
			var particle = this.particles.vertices[pCount];
	
			//console.log(particle.x);

			// update the velocity with
			// a splat of randomniz

			var zeroVec = new THREE.Vector3(0,40,0);
			
			if(particleTimer >70){
				var suckVec = cohere(particle,zeroVec);
				suckVec.multiplyScalar(0.00011);
				particle.acceleration.add(suckVec);
			}
			if(particleTimer >155){
				var suckVec = cohere(particle,zeroVec);
				suckVec.multiplyScalar(0.011);
				particle.acceleration.add(suckVec);
			}
		
			while (push>0)
			push-=1;
			if(particleTimer<170){
				particle.velocity.x +=  noise.noise((particleTimer*0.001)+(pCount*0.01),particleTimer*0.01,particleTimer*0.01)*push;
				particle.velocity.y +=   noise.noise((particleTimer*0.001)+(pCount*0.01)+100,particleTimer*0.01,particleTimer*0.01)*-push;
				particle.velocity.z +=  noise.noise((particleTimer*0.001)+(pCount*0.01)+1000,particleTimer*0.01,particleTimer*0.001)*push;
				
				particle.velocity.x /= 1 + (particleTimer*.00031);
				particle.velocity.y /= 1 + (particleTimer*.00031);
				particle.velocity.z /= 1 + (particleTimer*.00031);
			}
			
			if(particleTimer<150 && particleTimer > 10){
				particle.velocity.x +=  noise.noise((particleTimer*0.002)+(pCount*0.01),particleTimer*0.01,particleTimer*0.02)*.02;
				particle.velocity.y +=  noise.noise((particleTimer*0.002)+(pCount*0.01)+100,(particleTimer*0.01)+(pCount*0.021),(particleTimer*0.001)+(pCount*0.01))*.02;
				particle.velocity.z +=  noise.noise((particleTimer*0.002)+(pCount*0.01)+1000,particleTimer*0.01,particleTimer*0.021)*.02;
				

			}
			
		
				particle.x += particle.velocity.x;
				particle.y += particle.velocity.y;
				particle.z += particle.velocity.z;
				particle.velocity.add(particle.acceleration);
			
		  }

	
		  this.particleSystem.geometry.verticesNeedUpdate = true;

	}
}

sc1.prototype.makeBall = function(sc, vec){
	
	var scalar = sc || 100;
	var geo = new THREE.PlaneGeometry(sc,sc,10,10);
	
	this.ball = new THREE.Mesh(geo, new THREE.MeshLambertMaterial({color:0xFFFFFF,transparent:true,opacity:2, map: this.gradMap,emissive:0xffffff}));
	this.ball.rotation.y = Math.PI/2;
	this.ball.position = vec || new THREE.Vector3(0,30,0);
	this.ball.position.x = 200;
	
	this.scene.add(this.ball);
	


}

sc1.prototype.scaleBall = function(){

	if(this.ball != undefined && this.ball.scale.x < 10000){
		this.ball.scale.multiplyScalar(1.8);
		this.ball.material.opacity-=0.3
	}
	
	if(this.ball.scale>2000){
		this.ball.visible = false;
	}
}

sc1.prototype.makeNoise = function(sc, vec){
	
	
	
	if(this.noiseMap!=undefined){
		//console.log(this.noiseMap);
		this.noiseMap.wrapS = THREE.RepeatWrapping;
		this.noiseMap.wrapT = THREE.RepeatWrapping;
		this.noiseMap.repeat.x = 20;
		this.noiseMap.repeat.y = 20;
	}
	
	var scalar2 = sc || 800;
	var geo = new THREE.PlaneGeometry(scalar2,scalar2,10,10);
	this.plane = new THREE.Mesh(geo, new THREE.MeshLambertMaterial({color:0xFFFFFF,transparent:true,opacity:1, map: this.noiseMap}));
	this.plane.name = 'noise';
	this.plane.position = vec || new THREE.Vector3(0,40,0);
	this.plane.rotation.y = Math.PI/2;
	this.plane.position.x = 400;
	this.scene.add(this.plane);
	

	this.grad = new THREE.Mesh(geo, new THREE.MeshLambertMaterial({color:0xFFFFFF,transparent:true,opacity:1, map: this.gradMap}));
	this.grad.name = 'noise';
	this.grad.rotation.y = Math.PI/2;
	this.grad.position.x = 450;
	this.grad.position.y = -5;
				this.grad.position.z = 0;
	this.grad.scale.multiplyScalar(.13);
	this.scene.add(this.grad);

}

sc1.prototype.moveNoise = function(){

	if(this.plane != undefined){
		//this.plane.scale.multiplyScalar(1.2);
		this.plane.position.x = rand(200,210);//.opacity-=0.1
		this.plane.position.z = rand(0,10);
		this.plane.position.y = rand(0,10);
		this.plane.rotation.z = rand(0,10);
		
		if(thisKey-49>=-1 && thisKey-49<=9){
			var scalar = new THREE.Vector3((1.2+((thisKey-49)*.01))-1,(1.2+((thisKey-49)*.01))-1,1);
			this.grad.scale = scalar;
		}
	}
}

document.addEventListener( 'mousemove', onDocumentMouseMove, false );
document.addEventListener( 'mousedown', onDocumentMouseDown, false );
document.addEventListener( 'mouseup', onDocumentMouseUp, false );

var projector;
projector = new THREE.Projector();

function onDocumentMouseMove( event ) {
	if(objRotate){
		vector = new THREE.Vector3(
		0,
		( event.clientX*-3 / window.innerWidth ) * 2 + 1,
		-( event.clientY / window.innerHeight ) * 2 + 1
		);
		
	
	}		
}

function onDocumentMouseDown( event ) {
	if(( event.clientX / window.innerWidth ) < .7 && ( event.clientX/ window.innerWidth ) > .3)
	objRotate = true;
}

function onDocumentMouseUp( event ) {
	objRotate = false;
}


function saver() {

	//if(evt.keyCode == 65){
		alert("saving!");
		var j = 0;
		var output = "";
		
		//console.log(tree.children.length);
		//things[0].big.scale.x = .01;
		//things[0].big.position.y = 0;
		
		for( var p in things ){
			for (var i = 0 ; i < things[p].msh.length ; i++){
				

				
				//grrr - somehow two extra objects are being added to the msh array - so I'm manually skipping them, messy
				if(i == things[p].msh.length-2 || i == things[p].msh.length-3) i++;
				else{
					output += THREE.saveGeometryToObj4(things[p].msh[i],j,.0003);
					j += things[p].msh[i].geometry.vertices.length;
				}
			}
		}
		
		//console.log(output);
		output.replace("undefined","");
		alert("saved!");
		var blob = new Blob([output], {type: "text/plain;charset=ANSI"});
		saveAs(blob, "tree.obj");
	//}
	
}


function saver2() {

	alert("saving!");
	var j = 0;
	var output = "";
	
	output +=
	"M73 P0 (enable build progress)" + "\n" +
	"G21 (set units to mm)" + "\n" + 
	"G90 (set positioning to absolute)" + "\n" + 
	"G10 P1 X-16.5 Y0 Z0 (Designate T0 Offset)" + "\n" + 
	"G55 (Recall offset cooridinate system)" + "\n" + 
	"(**** begin homing ****)" + "\n" + 
	"G162 X Y F2500 (home XY axes maximum)" + "\n" + 
	"G161 Z F1100 (home Z axis minimum)" + "\n" + 
	"G92 Z-5 (set Z to -5)" + "\n" + 
	"G1 Z0.0 (move Z to “0?)" + "\n" + 
	"G161 Z F100 (home Z axis minimum)" + "\n" + 
	"M132 X Y Z A B (Recall stored home offsets for XYZAB axis)" + "\n" + 
	"(**** end homing ****)" + "\n" + 
	"G1 X112 Y-73 Z155 F3300.0 (move to waiting position)" + "\n" + 
	"G130 X0 Y0 A0 B0 (Lower stepper Vrefs while heating)" + "\n" + 
	"M6 T0 (wait for toolhead, and HBP to reach temperature)" + "\n" + 
	"M104 S230 T0 (set extruder temperature)" + "\n" + 
	"M6 T0 (wait for toolhead, and HBP to reach temperature)" + "\n" + 
	"G130 X127 Y127 A127 B127 (Set Stepper motor Vref to defaults)" + "\n" + 
	"M108 R3.0 T0" + "\n" + 
	"G0 X112 Y-73 (Position Nozzle)" + "\n" + 
	"G0 Z0.2 (Position Height)" + "\n" + 
	"M108 R4.0 (Set Extruder Speed)" + "\n" + 
	"M101 (Start Extruder)" + "\n" + 
	"G4 P1500 (Create Anchor)" + "\n";
	
	var zed = 0;
	
	
	for (var i = 0 ; i < paint.length ; i+=3){
		
		if(up > Math.PI*2){
			zed+=0.65;
			up=0;
		}
		//console.log(up);
		output += "G1 X";
		output += (paint[i]/1.5);
		output += " Y";
		output += (paint[i+1]/1.5);
		output += " Z";
		output += (paint[i+2])+1.27;
		output +=  " F1556.0";
		output += "\n";
	}
	
	alert("saved!");
	var blob = new Blob([output], {type: "text/plain;charset=ANSI"});
	saveAs(blob, "drawing.txt");
	
}


rebuilder = function(){
	var that = this;
	//console.log(user.value);
	//console.log(anim.value);
	//console.log(JSON.stringify(things[0].p));
	//console.log(things[0].p);
	//console.log($.extend(things[0].p,this.animObject));	
	rebuild = true;
	

}


$( document ).on( 'keydown', function ( e ) {
	//console.log(e.keyCode);
    if ( e.keyCode === 27 ) { // ESC
	//console.log(e.keyCode);
        $(".everything").hide();
    }
});
$( document ).on( 'keydown', function ( e ) {
	//console.log(e.keyCode);
    if ( e.keyCode === 65 ) { // ESC
	//console.log(e.keyCode);
        $(".everything").show();
    }
});


window.onkeydown = onKeyDown;
window.onkeypress = onKeyPress;

function onKeyDown(evt) {

	if(evt.keyCode == 65){
		//console.log(evt.keyCode);
		$("#.enu").css("position","relative");
	}
	
	if(evt.keyCode == 57 && particleIn && readyToBurst){
	//	helpGeo = true;
	//	readyToBurst = false;
		
	}
	
	thisKey = evt.keyCode;
	//console.log(thisKey);
}
