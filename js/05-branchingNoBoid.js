//This script emits a series of particles which branch based on various rules 
//and then builds geometry on the paths the particles leave

if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

//-------------------------------------------
var text;

var starfield = function()
{
	this.branches = 3;
	this.minBranch = 2;
	this.tubeDivs = 10;
	this.gravity = 10;
	this.gravity2= 0.0;
	this.trunk = 10;
	this.trunkAmount = 10;
	this.pos = 0;
	this.fatness = 8;
	this.shrink = .96;
	this.size = 100;
	this.rebuild = false;
	this.message = "type a to save";
};

//-------------------------------------------
text = new starfield();
var gui = new dat.GUI();
gui.add(text, 'message');
gui.add(text, 'branches', 2, 9);
gui.add(text, 'tubeDivs', 3, 12);
gui.add(text, 'minBranch', 1, 10);
gui.add(text, 'trunk', 0,60);
gui.add(text, 'trunkAmount', 2,20);
gui.add(text, 'gravity', -30,30);
gui.add(text, 'gravity2', -1.01,1.01);
gui.add(text, 'size', 20, 1000);
gui.add(text, 'fatness', .1, 30);
gui.add(text, 'shrink', .93,1.01);
gui.add(text, 'pos', -500, 0);
gui.add(text, 'rebuild');
//-------------------------------------------

var container, stats;
var camera, controls, scene, renderer;
var cross;
			
var things = [];
var branch = [];
var limb = [];
var limbSize = [];

var trunkDown = 0;
var trunkPosDown = .1;

var zeroVec = new THREE.Vector3(0,0,0);
var tree = new THREE.Object3D();
var fruit = new THREE.Object3D();

var branchSize = text.fatness;

//when okdone becomes true, totally done is a switch hit after the tree geo is made
var totallyDone = false;

//this is used to keep animating based on the size of an array
var okDone = false;

//changing this number will cause some strange results
var avoidDistance = 100;

//initial branches in the trunk
var ballAmount = text.trunkAmount;

//-------------------------------------------
init();
animate();
//-------------------------------------------

function init() {

	camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.z = 1200;
	camera.position.y = 400;	
	var camLook = new THREE.Vector3(0,500,0);

	camera.lookAt(camLook);
	
	var camParent = new THREE.Object3D();
	
	controls = new THREE.OrbitControls( camera );
	controls.addEventListener( 'change', render );

	scene = new THREE.Scene();
	
	var myColor = ("0x" + Math.floor(Math.random()*16777215).toString(16));
			var hexValue = parseInt(myColor , 16);
			
	scene.fog = new THREE.FogExp2( 0xccddff, 0.0002 );
	
		scene.add( tree );

	
	//-------------------------------------------
	addGeo(ballAmount,0,0,0);
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
function addGeo(amount,tx,ty,tz,thing){

	//console.log(thing);
	var myColor = ("0x" + Math.floor(Math.random()*16777215).toString(16));
	var hexValue = parseInt(myColor , 16);

	var geometry = new THREE.CubeGeometry( 5,5,5 );
	var material =  new THREE.MeshLambertMaterial( { color:0xffffff, shading: THREE.FlatShading } );
	
	var mesh = new THREE.Mesh( geometry, material );
	
	if(things.length == 0){
		innerAddGeo(true);
	}
	
	innerAddGeo();
	
	function innerAddGeo(root){
		for ( var i = 0; i < amount; i ++ ) {
		
			var myColor = THREE.Vector3( ( Math.random() - 0.5 ) * 10, ( Math.random() - 0.5 ) * 10, ( Math.random() - 0.5 ) * 10);	
			var myColor = ("0x" + Math.floor(Math.random()*16777215).toString(16));
			var material =  new THREE.MeshLambertMaterial( { color:myColor, shading: THREE.FlatShading } );
			
			var mesh = new THREE.Mesh( geometry, material );
			var zeroVec = new THREE.Vector3(0,0,0 );
			
			var randVec = new THREE.Vector3((( Math.random() - 0.5 ) * .01) , (( Math.random() - 0.5 ) * 0),(( Math.random() - 0.5 ) * .01));
			var pos = new THREE.Vector3(tx + (( Math.random() - 0.5 ) * 1) ,ty + (( Math.random() - 0.5 ) * 1),tz +(( Math.random() - 0.5 ) * 1));
			
			if(root)
				var upVec = new THREE.Vector3(0,-text.trunk,0);
			else
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
				
				mesh.scalar = text.fatness;
				
				if(root){
					mesh.layer = -1;
					mesh.damp = .8;
				}
				else{
					mesh.layer = 0;
					mesh.damp = .9;
				}
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

			things.push(mesh);
		}
	}
}

function animate() {
	
	render();

	if(!okDone){
		moveThings();
		makeBranch(branchSize);
		makeLimbGeo();
		if (branchSize > text.minBranch)
		branchSize *=text.shrink;
	}
	
	else if(!totallyDone){
		//makeLimbGeo();
		//scene.add(tree);
		totallyDone = true;
	}
	
	if(text.rebuild){
		console.log(tree);
		killEverything();
		addGeo(text.trunkAmount,0,0,0);
		text.rebuild = false;
	}
	
	tree.position.y = text.pos;
	fruit.position.y = text.pos;
	requestAnimationFrame( animate );
	controls.update();
	
	
}

function moveThings(){

	this.go = false;
	
	//if the distance between this thing and the other thing is less than the avoid distance do the flock Math
	//otherwise add 1 to the thing.count.
	//if thing.count is high enough add more branches until a hard coded number (text.size) is reached
	
	for ( var i = 0, il = things.length; i < il; i ++ ) {
	
		var thing = things[i];
		
		thing.position.add(thing.velocity);
		thing.velocity.add(thing.acceleration);
		thing.velocity.multiplyScalar(thing.damp);
		thing.acceleration.multiplyScalar(thing.damp);
		
		thing.count = 0;
		
		for ( var j = 0; j < things.length ; j ++ ) {
		
			if ( j==i && j< things.length-1){
				j++;	
			}
			
			var other = things[j];
			
			var zeroVec = new THREE.Vector3(0,0,0);
			var dist = thing.position.distanceTo(other.position);
			
			if ( dist < avoidDistance){
			
				var randly = new THREE.Vector3( ( Math.random() - 0.5 ) * 2, ( Math.random() - 0.5) * 2, ( Math.random() - 0.5 ) * 2);	
				//thing.acceleration = new THREE.Vector3( 0,0,0);	
				
				var gravity = new THREE.Vector3( 0,text.gravity,0);	
				var gravity2 = new THREE.Vector3( 0,text.gravity2,0);	
				
				//older method for avoidance
				// var diffVec = THREE.Vector3.prototype.subVectors(thing.position,other.position);
				// diffVec.normalize();
				// diffVec.multiplyScalar(Math.max(dist/100,1));
				
				var diffVec = avoid(thing,other);
				
			
				var suckVec = cheapCohere(thing,other);
				
				
				
				
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
				
				if (thing.acceleration.y < 0 && thing.position.y < 100 && thing.layer >= 0){
					thing.acceleration.y *= .1;
				
				}
				
				if(thing.layer == -1){
				
					thing.acceleration.y = 0;
					thing.position.y = trunkDown;
					
					trunkDown -= trunkPosDown;
					trunkPosDown *= .999;
					
					if (thing.velocity.y > 0 ){
						thing.velocity.y *= .01;
				
					}
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
				thing.go = false;
			}
			
			if(!thing.go && thing.made && thing.layer > -1){
				if(things.length < text.size){
					thing.bLength = thing.bLength *.9;
					thing.count = 0;
					addGeo(Math.floor(text.branches),thing.position.x,thing.position.y,thing.position.z,thing);
					thing.made = false;
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
	var geo = new THREE.Geometry();

	
	
	for ( var j = 0; j < things.length ; j ++ ) {
	
		if(limb[j].length > 3 && limb[j].length % 2 == 0){

			var newSize = map_range(j,0,things.length,30,1);
			var sized = Math.max(newSize,1);
			var size = limb[j].scalar;

			for ( var i = limb[j].length-2 ; i < limb[j].length ; i+=2){
			
				var thisVert = limb[j][i];
				var nextVert = limb[j][i-2];
				
				var dist = thisVert.distanceTo(nextVert);
						
				//var geometry = new THREE.SphereGeometry2( 3, 4, 5, 0, Math.PI*2, 0, Math.PI, dist,size*.9,size );
				var geometry = new THREE.SphereGeometry2( 3, Math.round(text.tubeDivs), 5, 0, Math.PI*2, 0, Math.PI, dist,(limbSize[j][i]*text.shrink)*text.shrink,limbSize[j][i]);
				
				//from Garner: rotates the link 90 degrees so that later on the aim will work properly - a hack?  Perhaps - Is there a better way? Perhaps
				geometry.applyMatrix( new THREE.Matrix4().setRotationFromEuler(new THREE.Vector3(Math.PI/2, 0, 0), 'XYZ'));
				
				if(size > text.minBranch)
					size *= text.shrink;
				
				var mesh = new THREE.Mesh( geometry, material );
				
				mesh.updateMatrix();
				mesh.matrixAutoUpdate = true;
				
				mesh.rotation.x = Math.PI/2;

				mesh.position = thisVert;
				mesh.lookAt(nextVert);
	
				mesh.geometry.mergeVertices();
				THREE.GeometryUtils.merge(geo, mesh);
				
			}
		}	
	}
	mesh = new THREE.Mesh( geo,material );

	tree.add(mesh);
	

	
	
	//scene.add( tree );
	
	
}

//inserts position of balls into limbs array and limbSize array for creation later with makeLimbGeo()
function makeBranch(scalar){

	var geometry = new THREE.CylinderGeometry( 3, 3, 3, 8 );
	geometry.applyMatrix( new THREE.Matrix4().setRotationFromEuler( new THREE.Vector3( Math.PI / 2, Math.PI, 0 ) ) );

	var material =  new THREE.MeshLambertMaterial( { color:0xffffff, shading: THREE.FlatShading } );
	
	for ( var i = 0; i < things.length; i ++ ) {
	
		var thing = things[i];		
		
		var pos = new THREE.Vector3(thing.position.x,thing.position.y,thing.position.z);
		var sized = scalar || 1;
		
		limb[i].push(pos);
		limb[i].scalar = thing.scalar;
		limbSize[i].push(sized);
	
	}
}

function render() {
	renderer.render( scene, camera );
	//stats.update();
}

//-------------------------------------------
//flocking functionality taken from boids.js which is taken from shiffman flocking
//-------------------------------------------

function limit(vToCheck, max){
	if(vToCheck.length() > max){
		vToCheck.setLength(max);		
	}
}

function avoid(thisOne, target ) {
	
	var distance = thisOne.position.distanceTo(target.position );

	if ( distance < 50 ) {

		var steer = new THREE.Vector3();

		steer.subVectors( thisOne.position, target.position );
		steer.multiplyScalar( distance * .1);

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

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight-100 );
}

function killEverything(){

var l = scene.children.length;

//remove everything
while (l--) {
	
	if(scene.children[l] instanceof THREE.Camera) continue; //leave camera in the scene
	
	if(scene.children[l] instanceof THREE.Light) continue;
	
	scene.remove(scene.children[l]);
	
}	

things = [];
branch = [];
limb = [];
limbSize = [];

spheres = [];

zeroVec = new THREE.Vector3(0,0,0);
tree = new THREE.Object3D();
fruit = new THREE.Object3D();
branchSize = text.fatness;

totallyDone = false;
okDone = false;

trunkDown = 0;
trunkPosDown = .1;

avoidDistance = 100;
ballAmount = text.trunkAmount;

scene.add(tree);


}

//-------------------------------------------
//write to a file when you type 'a'
//-------------------------------------------
window.onkeyup = onKeyUp;
window.onkeypress = onKeyPress;



function onKeyUp(evt) {

	if(evt.keyCode == 65){
		alert("saving!");
		var j = 0;
		var output = "";
		
		//console.log(tree.children.length);
		
		/*tried to erase bad vertices, didn't work
		for( var j = 0 ; j < tree.children.length ; j++){
			var b =  tree.children[j].geometry.vertices.length;
			for(var i = 0 ; i < b ; i++){

				if(tree.children[j].geometry.vertices[i].x == 0 && b>1){
					tree.children[j].geometry.vertices.splice(i,1);
					//console.log(tree.children[j].geometry.vertices[i].x);
					i--;
					b--;
				}
			}
		}
		*/
		
		//var scalar = new THREE.Vector3(.001,.001,.001);
		//tree.scale = scalar;
		//tree.updateMatrix();
		for (var i = 0 ; i < tree.children.length ; i++){
			
			
			output += THREE.saveGeometryToObj2(tree.children[i],j);
			j += tree.children[i].geometry.vertices.length
		}
		//console.log(output);
		output.replace("undefined","");
		alert("saved!");
		var blob = new Blob([output], {type: "text/plain;charset=ANSI"});
		saveAs(blob, "tree.obj");
	}
}

document.addEventListener('keypress', onKeyPress, false);