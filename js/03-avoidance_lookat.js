


//dat.gui adds controls----------------------------

// var ctrl;

// window.onload = function() {
	// ctrl = new world();
	// var gui = new dat.GUI();
	//gui.add(text, 'message');
	// gui.add(ctrl, 'speed', -1, 1);
	// gui.add(ctrl, 'size', .1, 5);
// };

// var world = function()
// {
	// this.speed = 0.1;
	// this.size = 1;
// };

//dat.gui adds controls----------------------------


if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var container, stats;
var camera, controls, scene, renderer;
var cross;			
var things = [];
var branch = [];
var limb = [];
var gogo = 0;
var gogoarray = [];

var avoidDistance = 100;
var ballAmount = 3;

init();
animate();


function init() {

	camera = new THREE.PerspectiveCamera( 100, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.z = 180;

	controls = new THREE.OrbitControls( camera );
	controls.addEventListener( 'change', render );

	scene = new THREE.Scene();
	
	var myColor = ("0x" + Math.floor(Math.random()*16777215).toString(16));
			var hexValue = parseInt(myColor , 16);
			
	scene.fog = new THREE.FogExp2( hexValue, 0.002 );

	// world

	addGeo();
	



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

function addGeo(){

	var myColor = ("0x" + Math.floor(Math.random()*16777215).toString(16));
			var hexValue = parseInt(myColor , 16);
			
	scene.fog = new THREE.FogExp2( hexValue, 0.002 );

	var geometry = new THREE.SphereGeometry( 10,8,5 );
	

	for ( var i = 0; i < ballAmount; i ++ ) {
	
		var myColor = THREE.Vector3( ( Math.random() - 0.5 ) * 10, ( Math.random() - 0.5 ) * 10, ( Math.random() - 0.5 ) * 10);
		
		var myColor = ("0x" + Math.floor(Math.random()*16777215).toString(16));
		//console.log(myColor);
	
		var material =  new THREE.MeshLambertMaterial( { color:myColor, shading: THREE.FlatShading } );
		
		var mesh = new THREE.Mesh( geometry, material );
		
		var pos = new THREE.Vector3( ( Math.random() - 0.5 ) * 10, (( Math.random() - 0.5 ) * 10), ( Math.random() - 0.5 ) * 10);
		var zeroVec = new THREE.Vector3(0,0,0);
				
		
		mesh.go = true;
		mesh.dist = 1;
		mesh.count = 0;

		mesh.position = pos;
		mesh.velocity = zeroVec;
		mesh.acceleration = zeroVec;
		
		mesh.updateMatrix();
		mesh.matrixAutoUpdate = true;
			
		//scene.add( mesh );
		things.push(mesh);

	}
	
	//things.others = things;
}

function makeTree(){

	//var geometry = new THREE.SphereGeometry( 10,8,5 );
	//var material =  new THREE.MeshLambertMaterial( { color:0xffffff, shading: THREE.FlatShading } );


	for(var i = 1 ; i < things.length ; i++){
		
		other = things[i-1];
		thing = things[i];
		
		var diffVec = THREE.Vector3.prototype.subVectors(thing.position,other.position);
		//console.log(thing.position);
		//console.log(diffVec);
		diffVec.normalize();
		// diffVec.multiplyScalar(dist/50);
		// thing.position.add(diffVec);			

		//thing.rotation.add(diffVec);// += 1;
		
		//var rot = new THREE.Vector3(thing.rotation.x,thing.rotation.y,thing.rotation.z);
	
	}

}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight-100 );



}

function animate() {
	render();

	
	//console.log(branch.length);
	
	//if(moveThings.go){
	
	
	//makeTree();
	
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
	

	
	if(gogo < things.length-1){
	
		for ( var i = 0; i<things.length; i ++ ) {
			gogo = 0;
			if(gogoarray[i] == 1){
				gogo ++;
			}
		}
		moveThings();
		makeBranch();
		//console.log(gogo);
	}
	
	if(gogo >= things.length-1){
		for ( var i = 0; i<things.length; i ++ ) {
			var thing = things[i];
			//console.log(thing.dist);
		}
	}
	
	//}
	//Mover();
	requestAnimationFrame( animate );
	controls.update();
		moveBranch();
}

document.addEventListener( 'mousedown', onDocumentMouseDown, false );

function onDocumentMouseDown( event ) {
		for(var i = 0 ; i<10000; i++){
		
		var l = scene.children.length
        ;

    //remove everything
    while (l--) {

        if(scene.children[l] instanceof THREE.Camera) continue; //leave camera in the scene
		
		if(scene.children[l] instanceof THREE.Light) continue;

        scene.remove(scene.children[l]);

    }
			//scene.remove(i);
			//console.log("gone: " + i);
		
		}
			things = [];
			branch = [];
			limb = [];
			
			addGeo();
			gogo = 0;
}

function moveThings(){

	this.go = false;
	
	//if


	for ( var i = 0, il = things.length; i < il; i ++ ) {
		var thing = things[i];
		
		thing.position.add(thing.velocity);
		thing.velocity.add(thing.acceleration);
		
		thing.count = 0;//things.length;
		
		for ( var j = 0; j < things.length ; j ++ ) {
		
			if ( j==i && j< things.length-1){
				j++;	
			}
			
			if (i==things.length-1 && j==things.length-1){
			//	return;
			}
			
			var other = things[j];
			
			//console.log(count);
			
			var zeroVec = new THREE.Vector3(0,0,0);
			
			var dist = thing.position.distanceTo(other.position);
								
			if ( dist < avoidDistance){
			
				thing.acceleration = new THREE.Vector3( ( Math.random() - 0.5 ) * 2, ( Math.random() - 0.5) * 2, ( Math.random() - 0.5 ) * 2);	
				//thing.rotation.x += .1;
				
				var diffVec = THREE.Vector3.prototype.subVectors(thing.position,other.position);
				
				diffVec.normalize();
				diffVec.multiplyScalar(Math.max(dist/50,1));
				thing.position.add(diffVec);	
				
				thing.dist = dist;
				
				
				
				thing.rotation.y = Math.atan2( - thing.velocity.z, thing.velocity.x );
				thing.rotation.z = (Math.asin( thing.velocity.y / thing.velocity.length() ) - 3.1415/2);
				
				if(thing.position.y<-100){
					//thing.velocity.y = 1;
				}
			
							
			}
			

			
			else{
				thing.count++;
				
			}
			
			console.log("count: " + thing.count);
			
			if(thing.count >= things.length-1){
				thing.acceleration = zeroVec;
				thing.velocity.multiplyScalar(0);
				thing.go = false;
				//console.log(j + ": I'm done");
			}
		
		}
			
		
		
	}
}	

function moveBranch(){

	//console.log(branch.length);

	for ( var j = 0; j < things.length ; j ++ ) {
	//console.log(things.length);
	
		for ( var i = 1 ; i < limb[j].length ; i++){
		
			
	
			var myPos = new THREE.Vector3(0,0,0);
			
			var thing = limb[j][i];
			var other = limb[j][i-1];
			
			var dist = thing.position.distanceTo(other.position);
			var diffVec = THREE.Vector3.prototype.subVectors(thing.position,other.position);
			diffVec.normalize();
			diffVec.multiplyScalar(dist);
			
			if(dist>0){
				thing.scale.z = dist/3;
			}
			//thing.rotate += .5;
			thing.lookAt(other.position);
			
			// var pos = new THREE.Vector3((Math.random()-0.5)/2,(Math.random()-0.5)/2,(Math.random()-0.5)/2);
			
			// br.position.add(pos);
			// br.rotation.x += .1;
			// br.rotation.y += .01;
			//br.color.setHex( 0xFF0000 );
		
		}
	
	function map_range(value, low1, high1, low2, high2) {
		return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
	}
	
	//var rotColor = map_range(br.rotation.x,0,Math.PI,0,16777215);
	//var hexValue = parseInt(rotColor , 16);
	
	//br.material.color.setHex(hexValue);
	
	}
		
		

}

function makeBranch(){

	var geometry = new THREE.CylinderGeometry( 3, 3, 3, 8 );
	geometry.applyMatrix( new THREE.Matrix4().setRotationFromEuler( new THREE.Vector3( Math.PI / 2, Math.PI, 0 ) ) );


	//var geometry = new THREE.SphereGeometry( 3,4,4 );
	var material =  new THREE.MeshLambertMaterial( { color:0xffffff, shading: THREE.FlatShading } );
	
	
	
	for( ball in things) {
		limb.push(new Array());
	}
	//limb[1].push();
	
	for ( var i = 0; i < things.length; i ++ ) {
	
		var thing = things[i];		
		//console.log(thing.go);	
		
		
		
			
		if(thing.go==true){
			
			var myColor = ("0x" + Math.floor(Math.random()*16777215).toString(16));
			var hexValue = parseInt(myColor , 16);
			//var myColor = "0xffffff";
			//console.log(myColor);
			
			var material2 =  new THREE.MeshLambertMaterial( { color:hexValue, shading: THREE.FlatShading } );
			
			//console.log(material2.color);
			
			var mesh = new THREE.Mesh( geometry, material2 );
			var pos = new THREE.Vector3(thing.position.x,thing.position.y,thing.position.z);
			var rot = new THREE.Vector3(thing.rotation.x,thing.rotation.y,thing.rotation.z);
			
			mesh.position = pos;
			mesh.scale.y = 2;//thing.dist*.1;
			
			var small = 1.2;
			
			mesh.scale.x = small;
			mesh.scale.z = small;
			//mesh.rotation = rot;
			
			//mesh.updateMatrix();
			//mesh.matrixAutoUpdate = true;
			
			//branch.push(mesh);
			limb[i].push(mesh);
			scene.add(mesh);
			//scene.add(branch);
			//console.log("adding");
			
			//console.log("branch: " + mesh.position.x);
		}
		
		
		//console.log("limb:" + i + "  " + limb[i][0]);
		//branch.push(limb[i]);
		
		
	}
}	

function makeBranchParticle(){

	// var geometry = new THREE.SphereGeometry( 3,4,4 );
	// var material =  new THREE.MeshLambertMaterial( { color:0xffffff, shading: THREE.FlatShading } );
	
	for ( var i = 0; i<things.length; i ++ ) {
	
		var PI2 = Math.PI * 2;
		var program = function ( context ) {

			context.beginPath();
			context.arc( 0, 0, 1, 0, PI2, true );
			context.closePath();
			context.fill();

		}
	
		var thing = things[i];
		
		//console.log(thing.go);
		
		if(thing.go==true){
		
			var mesh = new THREE.Particle( new THREE.ParticleCanvasMaterial( { color: Math.random() * 0x808008 + 0x808080, program:program} ) );
			var pos = new THREE.Vector3(thing.position.x,thing.position.y,thing.position.z);
		
			mesh.scale.x = mesh.scale.y = 5;//Math.random() * 10 + 5;
			

			
			mesh.position = pos;
			
			mesh.updateMatrix();
			mesh.matrixAutoUpdate = true;
			
			branch.push(mesh);
			scene.add(mesh);
			
			//console.log("adding");
			
			//console.log("branch: " + mesh.position.x);
		}
	}
}	

function render() {
	//moveThings();
	renderer.render( scene, camera );
	//stats.update();
	

}

// Rotate an object around an arbitrary axis in object space
var rotObjectMatrix;
function rotateAroundObjectAxis(object, axis, radians) {
    rotObjectMatrix = new THREE.Matrix4();
    rotObjectMatrix.makeRotationAxis(axis.normalize(), radians);
    object.matrix.multiplySelf(rotObjectMatrix);      // post-multiply
    object.rotation.getRotationFromMatrix(object.matrix, object.scale);
}

var rotWorldMatrix;
// Rotate an object around an arbitrary axis in world space       
function rotateAroundWorldAxis(object, axis, radians) {
    rotWorldMatrix = new THREE.Matrix4();
    rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);
    rotWorldMatrix.multiplySelf(object.matrix);        // pre-multiply
    object.matrix = rotWorldMatrix;

    // new code for Three.js v50+
    object.rotation.setEulerFromRotationMatrix(object.matrix);

    // old code for Three.js v49:
    // object.rotation.getRotationFromMatrix(object.matrix, object.scale);
}

function Mover(){
	//set up
	this.location = new THREE.Vector3(0,0,0);
	this.velocity = new THREE.Vector3(0,0,0);
	this.acceleration = new THREE.Vector3(0.01,0.01,0.01);
	
	
	//console.log(this.velocity);
	this.step = function(){
		this.velocity.addSelf(this.acceleration);
		this.location.addSelf(this.velocity);
		this.mesh.position = this.location;
		//this.mesh1.position = this.location;
		checkBounds(this);
		limit(this.velocity ,10);
		this.acceleration = new THREE.Vector3((Math.random()-0.5)/100,(Math.random()-0.5)/100,(Math.random()-0.5)/100);
};
}




