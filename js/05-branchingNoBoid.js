if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var container, stats;
var camera, controls, scene, renderer;
var cross;			
var things = [];
var branch = [];
var limb = [];

var spheres = [];
var gogo = 0;
var gogoarray = [];
var made = false;
var madeBranch = true;
var doneAnimating = false;
var zeroVec = new THREE.Vector3(0,0,0);
var tree = new THREE.Object3D();

totallyDone = false;

var okDone = false;


var avoidDistance = 100;
var ballAmount = 5;

init();
animate();


function init() {

	camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.z = 400;
	camera.position.y = 400;
	var camLook = new THREE.Vector3(0,500,0);

	camera.lookAt(camLook);
	
	console.log(camera);
	
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
	addGeo(2,0,0,0,true);
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
function addGeo(amount,tx,ty,tz,yes){

	var myColor = ("0x" + Math.floor(Math.random()*16777215).toString(16));
	var hexValue = parseInt(myColor , 16);

	var geometry = new THREE.CubeGeometry( 1,1,1 );
	var material =  new THREE.MeshLambertMaterial( { color:0xffffff, shading: THREE.FlatShading } );
	
	var mesh = new THREE.Mesh( geometry, material );
		//	scene.add( mesh );

	for ( var i = 0; i < amount; i ++ ) {
	
		var myColor = THREE.Vector3( ( Math.random() - 0.5 ) * 10, ( Math.random() - 0.5 ) * 10, ( Math.random() - 0.5 ) * 10);	
		var myColor = ("0x" + Math.floor(Math.random()*16777215).toString(16));
		var material =  new THREE.MeshLambertMaterial( { color:myColor, shading: THREE.FlatShading } );
		
		var mesh = new THREE.Mesh( geometry, material );
		var zeroVec = new THREE.Vector3(0,0,0 );
		
		
		var pos = new THREE.Vector3(tx + (( Math.random() - 0.5 ) * 10) ,ty + (( Math.random() - 0.5 ) * 10),tz +(( Math.random() - 0.5 ) * 10));
		var upVec = new THREE.Vector3(0,.01,0);
		
		mesh.go = true;
		mesh.dist = 1;
		mesh.count = 0;
		mesh.made = true;

		mesh.position = pos;
		mesh.velocity = zeroVec;
		mesh.acceleration = upVec;
		
		mesh.updateMatrix();
		mesh.matrixAutoUpdate = true;
			
		scene.add( mesh );
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
		makeBranch();
	}
	else if(!totallyDone){
		makeLimbGeo();
		totallyDone = true;
	}
	
	
	requestAnimationFrame( animate );
	controls.update();
	
}

function moveThings(){

	this.go = false;
	
	for ( var i = 0, il = things.length; i < il; i ++ ) {
	
		var thing = things[i];
		
		thing.position.add(thing.velocity);
		thing.velocity.add(thing.acceleration);
		
		thing.count = 0;//things.length;
		
		for ( var j = 0; j < things.length ; j ++ ) {
		
			if ( j==i && j< things.length-1){
				j++;	
			}
			
			var other = things[j];
			
			var zeroVec = new THREE.Vector3(0,0,0);
			
			var dist = thing.position.distanceTo(other.position);
								
			if ( dist < avoidDistance){
			
				//thing.acceleration = new THREE.Vector3( ( Math.random() - 0.5 ) * 2, ( Math.random() - 0.5) * 2, ( Math.random() - 0.5 ) * 2);	
				//thing.acceleration = new THREE.Vector3( 0,0,0);	
				
				var diffVec = THREE.Vector3.prototype.subVectors(thing.position,other.position);
				
				diffVec.normalize();
				diffVec.multiplyScalar(Math.max(dist/10,1));
				thing.position.add(diffVec);	
				
				thing.dist = dist;
				
				thing.rotation.y = Math.atan2( - thing.velocity.z, thing.velocity.x );
				thing.rotation.z = (Math.asin( thing.velocity.y / thing.velocity.length() ) - 3.1415/2);
					
			}
		
			else{
				thing.count++;
			}
			
			if(thing.count >= things.length-1){
				//thing.acceleration = zeroVec;
				//thing.velocity.multiplyScalar(0);
				thing.go = false;
				console.log("spoon");
				//thing.scale.y = .01;
				
			}
			
			if(!thing.go && thing.made){
				if(things.length < 250){
				addGeo(Math.floor(Math.random()*6),thing.position.x,thing.position.y,thing.position.z,true);
				console.log(thing.position);
				thing.made = false;
				thing.count = 0;
				console.log(things);
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
		
			var size = limb[j].length/10;
		
			for ( var i = 1 ; i < limb[j].length ; i++){
			
				var thisVert = limb[j][i];
				var nextVert = limb[j][i-1];
				
				var dist = thisVert.distanceTo(nextVert);
						
				var geometry = new THREE.SphereGeometry2( 3, 4, 5, 0, Math.PI*2, 0, Math.PI, dist,size*.9,size );
				
				size *= .95;
				
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
function makeBranch(){

	var geometry = new THREE.CylinderGeometry( 3, 3, 3, 8 );
	geometry.applyMatrix( new THREE.Matrix4().setRotationFromEuler( new THREE.Vector3( Math.PI / 2, Math.PI, 0 ) ) );

	var material =  new THREE.MeshLambertMaterial( { color:0xffffff, shading: THREE.FlatShading } );
	
	for( ball in things) {
		limb.push(new Array());
	}
	
	for ( var i = 0; i < things.length; i ++ ) {
	
		var thing = things[i];		
		
		if(thing.go==true){
			var pos = new THREE.Vector3(thing.position.x,thing.position.y,thing.position.z);
			limb[i].push(pos);
		}
	}
}	

function render() {
	//moveThings();
	renderer.render( scene, camera );
	//stats.update();
}

