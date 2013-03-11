if ( ! Detector.webgl ) Detector.addGetWebGLMessage();




var text;

var starfield = function()
{
	this.branches = 3;
	this.gravity = 10;
	this.gravity2= 0.0;
	this.trunk = 10;
	this.pos = -200;
	this.fatness = 8;
	this.shrink = .96;
	this.size = 200;
	this.rebuild = false;
};


text = new starfield();
var gui = new dat.GUI();
// gui.add(text, 'message');
gui.add(text, 'branches', 2, 9);
gui.add(text, 'trunk', 0,60);
gui.add(text, 'gravity', -30,30);
gui.add(text, 'gravity2', -1.01,1.01);
gui.add(text, 'size', 100, 1000);
//gui.add(text, 'fatness', .1, 30);
//gui.add(text, 'shrink', .1,5);
gui.add(text, 'pos', -500, 0);
gui.add(text, 'rebuild');





var container, stats;
var camera, controls, scene, renderer;
var cross;			
var things = [];
var branch = [];
var limb = [];
var limbSize = [];

var makeCounter = 0;

var spheres = [];
var gogo = 0;
var gogoarray = [];
var made = false;
var madeBranch = true;
var doneAnimating = false;
var zeroVec = new THREE.Vector3(0,0,0);
var tree = new THREE.Object3D();
var fruit = new THREE.Object3D();

var branchSize = 5;

totallyDone = false;

var okDone = false;


var avoidDistance = 100;
var ballAmount = 10;

init();
animate();


function init() {

	camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.z = 1200;
	camera.position.y = 400;
	var camLook = new THREE.Vector3(0,500,0);

	camera.lookAt(camLook);
	
	//console.log(camera);
	
	var camParent = new THREE.Object3D();
	
	//camParent.add(camera);
	//camParent.position.y = 1000;
	
	controls = new THREE.OrbitControls( camera );
	controls.addEventListener( 'change', render );

	scene = new THREE.Scene();
	
	var myColor = ("0x" + Math.floor(Math.random()*16777215).toString(16));
			var hexValue = parseInt(myColor , 16);
			
	scene.fog = new THREE.FogExp2( hexValue, 0.0002 );
	
	//-------------------------------------------
	addGeo(10,0,0,0,true);
	//-------------------------------------------
	
	// lights

	light = new THREE.DirectionalLight( 0xffffff );
	light.position.set( 1, 1, 1 );
	scene.add( light );

	light = new THREE.DirectionalLight( 0x002288 );
	light.position.set( -1, -1, -1 );
	scene.add( light );

	light = new THREE.AmbientLight( 0x222222 );
	scene.add( light );


	// renderer

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setClearColor( scene.fog.color, 1 );
	renderer.setSize( window.innerWidth, window.innerHeight-100 );
	
	//renderer = new THREE.WebGLRenderer();

	container = document.getElementById( 'container' );
	container.appendChild( renderer.domElement );
	
	//stats will display an fps counter in the upper left
	/*
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	stats.domElement.style.zIndex = 100;
	container.appendChild( stats.domElement );
	*/
	//

	window.addEventListener( 'resize', onWindowResize, false );

}

//instantiates the objects whose trails we'll follow
function addGeo(amount,tx,ty,tz,yes,thing){

	
	//console.log(thing);
	var myColor = ("0x" + Math.floor(Math.random()*16777215).toString(16));
	var hexValue = parseInt(myColor , 16);

	var geometry = new THREE.CubeGeometry( 5,5,5 );
	var material =  new THREE.MeshLambertMaterial( { color:0xffffff, shading: THREE.FlatShading } );
	
	var mesh = new THREE.Mesh( geometry, material );
		//	scene.add( mesh );

	for ( var i = 0; i < amount; i ++ ) {
	
		var myColor = THREE.Vector3( ( Math.random() - 0.5 ) * 10, ( Math.random() - 0.5 ) * 10, ( Math.random() - 0.5 ) * 10);	
		var myColor = ("0x" + Math.floor(Math.random()*16777215).toString(16));
		var material =  new THREE.MeshLambertMaterial( { color:myColor, shading: THREE.FlatShading } );
		
		var mesh = new THREE.Mesh( geometry, material );
		var zeroVec = new THREE.Vector3(0,0,0 );
		
		var randVec = new THREE.Vector3((( Math.random() - 0.5 ) * .01) , (( Math.random() - 0.5 ) * .01),(( Math.random() - 0.5 ) * .01));
		var pos = new THREE.Vector3(tx + (( Math.random() - 0.5 ) * 1) ,ty + (( Math.random() - 0.5 ) * 1),tz +(( Math.random() - 0.5 ) * 1));
		var upVec = new THREE.Vector3(0,text.trunk,0);
		
			mesh.go = true;
			mesh.dist = 1;
			mesh.count = 0;
			mesh.counter = 0;
			mesh.made = true;
			mesh.position = pos;
			
		if (thing == undefined){
		
			
			mesh.velocity = zeroVec;
			mesh.acceleration = upVec;
			mesh.damp = .9;
			mesh.scalar = text.fatness;
			mesh.layer = 0;
			mesh.bLength = 500;
		}
		
		else
		{	
			var mover = new THREE.Vector3();
			mover.copy( thing.velocity );
			//mover.multiply(randVec);
			
			var newVel = mover;
			mesh.velocity = mover;
			
			var mover = new THREE.Vector3();
			mover.copy( thing.acceleration );
			
			mesh.acceleration = zeroVec;
			mesh.bLength = thing.bLength;
			mesh.damp = .9;
			mesh.scalar = thing.scalar*.5;
			mesh.layer = thing.layer+1;
			
		}
		mesh.updateMatrix();
		mesh.matrixAutoUpdate = true;
		
		limb.push(new Array());
		limbSize.push(new Array());
		
		fruit.add(mesh);
		
		scene.add( fruit );
		if(yes)
		things.push(mesh);
	}
}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight-100 );
}

function animate() {
	
	render();
/*
	//this section checks to see if all the branches are done drawing
	if(gogo < things.length-1){
		for ( var i = 0; i<things.length; i ++ ) {
			var thing = things[i];
			
			if(thing.go==false){
				gogoarray[i] = 1;			
			}
			else{
				gogoarray[i] = 0;			
			}
		}
	}
	
	if(gogo < things.length){
	
		gogo = 0;

		for ( var i = 0; i<things.length; i ++ ) {	
			if(gogoarray[i] == 1){
				gogo ++;
			}
		}
		if(gogo < things.length && !doneAnimating ){
			moveThings();
			makeBranch();
		}
	}
	
	//when the branches are done drawing, create branch geo, but only once
	if(gogo >= things.length-1 && madeBranch){
		makeLimbGeo();
		
			//scene.add(tree);
		//tree.position.y = -100;
		doneAnimating = !doneAnimating;
		madeBranch = !madeBranch;
	}
	*/
	if(!okDone){
		moveThings();
		makeBranch(branchSize);
		if (branchSize>.5)
		branchSize *=.97;
	}
	else if(!totallyDone){
		makeLimbGeo();
		scene.add(tree);
		totallyDone = true;
	}
	
	if(text.rebuild){
		killEverything();
		addGeo(10,0,0,0,true);
		text.rebuild = false;
	}
	
	tree.position.y = text.pos;
	fruit.position.y = text.pos;
	requestAnimationFrame( animate );
	controls.update();
	
	
}

function moveThings(){

	this.go = false;
	
	for ( var i = 0, il = things.length; i < il; i ++ ) {
	
		var thing = things[i];
		
		thing.position.add(thing.velocity);
		thing.velocity.add(thing.acceleration);
		thing.velocity.multiplyScalar(thing.damp);
		thing.acceleration.multiplyScalar(thing.damp);
		
		thing.count = 0;//things.length;
		
		for ( var j = 0; j < things.length ; j ++ ) {
		
			if ( j==i && j< things.length-1){
				j++;	
			}
			
			var other = things[j];
			
			var zeroVec = new THREE.Vector3(0,0,0);
			
			var dist = thing.position.distanceTo(other.position);
			//console.log("thing" + thing.layer + "other" + other.layer);
								
			if ( dist < avoidDistance){
			
				var randly = new THREE.Vector3( ( Math.random() - 0.5 ) * 2, ( Math.random() - 0.5) * 2, ( Math.random() - 0.5 ) * 2);	
				//thing.acceleration = new THREE.Vector3( 0,0,0);	
				
				var gravity = new THREE.Vector3( 0,text.gravity,0);	
				var gravity2 = new THREE.Vector3( 0,text.gravity2,0);	
				
				// var diffVec = THREE.Vector3.prototype.subVectors(thing.position,other.position);
				
				// diffVec.normalize();
				// diffVec.multiplyScalar(Math.max(dist/100,1));
				
				var diffVec = avoid(thing,other);
				var suckVec = cheapCohere(thing,other);
				
				//console.log(diffVec);
				
				if(thing.layer == 2){
					thing.acceleration.add(gravity);
				}
				
				if(thing.layer == 0){
					diffVec.multiplyScalar(.010);
					suckVec.multiplyScalar(.010);
					gravity.multiplyScalar(.1);
					thing.acceleration.add(gravity2);
				}
				
				if(thing.layer == 1){
					thing.acceleration.add(randly);
					thing.acceleration.add(gravity2);
				}

				
				thing.acceleration.add(diffVec);
				thing.acceleration.add(suckVec);
				
				if (thing.acceleration.y < 0 && thing.position.y < 100){
					thing.acceleration.y *= .1;
				
				}
				
				
				limit(thing.acceleration, 1);
				
				thing.dist = dist;
				
				thing.rotation.y = Math.atan2( - thing.velocity.z, thing.velocity.x );
				thing.rotation.z = (Math.asin( thing.velocity.y / thing.velocity.length() ) - 3.1415/2);
					
				thing.counter ++;
			}
		
			else{
				thing.count++;
			}
			
			if(thing.count >= things.length-1 || thing.counter > thing.bLength){
				//thing.acceleration = zeroVec;
				//thing.velocity.multiplyScalar(0);
				
				//console.log("spoon");
				//thing.scale.y = .01;
				
				thing.go = false;
				
			}
		
			
			
			/*
			var bob = thing.velocity.length();
			console.log(bob);
			
			if(bob < .0001){
				thing.go = false;
			
			}
			*/
			if(!thing.go && thing.made){
				//okDone = true;
			
				if(things.length < text.size){
					thing.bLength = thing.bLength *.9;
					thing.count = 0;
					addGeo(Math.floor(text.branches),thing.position.x,thing.position.y,thing.position.z,true,thing);
					//console.log(thing.position);
					thing.made = false;
					
					//console.log(things);
				}
				else{
					okDone = true;
				}
				
				
			}
			
		}
	}
}	

//this creates geometry for branches
function makeLimbGeo(){

	var material =  new THREE.MeshLambertMaterial( { color:0xffffff, shading: THREE.FlatShading } );
	
	for ( var j = 0; j < things.length ; j ++ ) {
	
		if(limb[j].length > 1){
		
			//var size = limb[j].length/30;
			var newSize = map_range(j,0,things.length,30,1);
			var sized = Math.max(newSize,1);
			var size = limb[j].scalar;
			//var size = 1;
			//console.log(limb[j].length);
			
			for ( var i = 2 ; i < limb[j].length ; i+=2){
			
				var thisVert = limb[j][i];
				var nextVert = limb[j][i-2];
				
				var dist = thisVert.distanceTo(nextVert);
						
				//var geometry = new THREE.SphereGeometry2( 3, 4, 5, 0, Math.PI*2, 0, Math.PI, dist,size*.9,size );
				var geometry = new THREE.SphereGeometry2( 3, 4, 3, 0, Math.PI*2, 0, Math.PI, dist,limbSize[j][i],limbSize[j][i]);
				
				if(size > 1)
				size *= text.shrink;
				
				var mesh = new THREE.Mesh( geometry, material );
			
				var zeroVec = new THREE.Vector3(0,0,0);
				var parent = new THREE.Object3D();
				
				mesh.updateMatrix();
				mesh.matrixAutoUpdate = true;
				mesh.rotation.x = Math.PI/2;
				
				parent.add(mesh);
				tree.add(parent);
				
				parent.position = thisVert;
				parent.lookAt(nextVert);
				
				parent.updateMatrix();
				parent.matrixAutoUpdate = true;
				
				spheres.push(mesh);
			}
		}
	}
	scene.add( tree );
}

//inserts position of balls into limbs array for creation later with makeLimbGeo()
function makeBranch(scalar){

	var geometry = new THREE.CylinderGeometry( 3, 3, 3, 8 );
	geometry.applyMatrix( new THREE.Matrix4().setRotationFromEuler( new THREE.Vector3( Math.PI / 2, Math.PI, 0 ) ) );

	var material =  new THREE.MeshLambertMaterial( { color:0xffffff, shading: THREE.FlatShading } );
	
	for( ball in things) {
	//	limb.push(new Array());
	}
	
	
	
	for ( var i = makeCounter; i < things.length; i ++ ) {
	
		var thing = things[i];		
		
		//if(thing.go==true){
			var pos = new THREE.Vector3(thing.position.x,thing.position.y,thing.position.z);
			var sized = scalar || 1;
			limb[i].push(pos);
			limb[i].scalar = thing.scalar;
			limbSize[i].push(sized);
		//}
	}
	
	
}	

function render() {
	//moveThings();
	renderer.render( scene, camera );
	//stats.update();
}

function limit(vToCheck, max){
	if(vToCheck.length() > max){
		vToCheck.setLength(max);		
	}
}

function avoid(thisOne, target ) {
	/*
	var steer = new THREE.Vector3();

	steer.copy( target.position );
	steer.sub( thisOne.position );
	
	steer.normalize();
	
	var dist = thisOne.position.distanceTo(target.position);

	if(dist < 50){
		steer.multiplyScalar( dist*-.001);
	}
	return steer;
	*/
	
	
	var distance = thisOne.position.distanceTo(target.position );

	if ( distance < 50 ) {

		var steer = new THREE.Vector3();

		steer.subVectors( thisOne.position, target.position );
		steer.multiplyScalar( distance * .1);

		//_acceleration.add( steer );
		return(steer);
	}
	else{
		var steer = new THREE.Vector3();
		return(steer);
	}

}

function cheapCohere(thisOne, target ) {
	
	var steer = new THREE.Vector3();

	steer.copy( thisOne.position );
	steer.sub( target.position );
	
	steer.normalize();
	
	var dist = thisOne.position.distanceTo(target.position);

	if(dist > 100){
		steer.multiplyScalar( dist*-.1);
	}
	return steer;

}

function cohesion ( boids ) {

		var boid, distance,
		posSum = new THREE.Vector3(),
		steer = new THREE.Vector3(),
		count = 0;

		for ( var i = 0, il = boids.length; i < il; i ++ ) {

			if ( Math.random() > 0.6 ) continue;

			boid = boids[ i ];
			distance = boid.position.distanceTo( this.position );

			if ( distance > 0 && distance <= _neighborhoodRadius ) {

				posSum.add( boid.position );
				count++;

			}

		}

		if ( count > 0 ) {

			posSum.divideScalar( count );

		}

		steer.subVectors( posSum, this.position );

		var l = steer.length();

		if ( l > _maxSteerForce ) {

			steer.divideScalar( l / _maxSteerForce );

		}

		return steer;

	}

function killEverything(){

var l = scene.children.length;

//remove everything
while (l--) {
	
	if(scene.children[l] instanceof THREE.Camera) continue; //leave camera in the scene
	
	if(scene.children[l] instanceof THREE.Light) continue;
	
	scene.remove(scene.children[l]);
	
	
		
things = [];
branch = [];
limb = [];
limbSize = [];

 makeCounter = 0;

 spheres = [];
 gogo = 0;
 gogoarray = [];
 made = false;
 madeBranch = true;
 doneAnimating = false;
 zeroVec = new THREE.Vector3(0,0,0);
 tree = new THREE.Object3D();
  fruit = new THREE.Object3D();
 branchSize = text.fatness;

totallyDone = false;

 okDone = false;


 avoidDistance = 100;
 ballAmount = 10;
}
}