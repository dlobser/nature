


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
init();
animate();

function init() {

	camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.z = 500;

	controls = new THREE.OrbitControls( camera );
	controls.addEventListener( 'change', render );

	scene = new THREE.Scene();
	scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );

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

	renderer = new THREE.CanvasRenderer( { antialias: false } );
	renderer.setClearColor( scene.fog.color, 1 );
	renderer.setSize( window.innerWidth, window.innerHeight );
	
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
	var geometry = new THREE.CylinderGeometry( 0, 10, 30, 4, 1 );
	var material =  new THREE.MeshLambertMaterial( { color:0xffffff, shading: THREE.FlatShading } );

	for ( var i = 0; i < 100; i ++ ) {

		var mesh = new THREE.Mesh( geometry, material );
		var pos = new THREE.Vector3( ( Math.random() - 0.5 ) * 100, ( Math.random() - 0.5 ) * 100, ( Math.random() - 0.5 ) * 100);
		var zeroVec = new THREE.Vector3(0,0,0);

		mesh.position = pos;
		mesh.velocity = zeroVec;
		mesh.acceleration = zeroVec;
		
		mesh.updateMatrix();
		mesh.matrixAutoUpdate = true;
			
		scene.add( mesh );
		things.push(mesh);

	}
	
	//things.others = things;
}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );



}

function animate() {
	render();
	
	
	moveThings();
	//Mover();
	requestAnimationFrame( animate );
	controls.update();
	
}

function moveThings(){

	this.go = false;
	
	//if


	for ( var i = 1, il = things.length; i < il; i ++ ) {
		var thing = things[i];
		thing.position.add(thing.velocity);
		thing.velocity.add(thing.acceleration);
		
		var count = 0;//things.length;
		
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
								
			if ( dist < 50){
			
				thing.acceleration = new THREE.Vector3( ( Math.random() - 0.5 ) * 2, ( Math.random() - 0.5 ) * 2, ( Math.random() - 0.5 ) * 2);	
				//thing.rotation.x += .1;
				var diffVec = THREE.Vector3.prototype.subVectors(thing.position,other.position);
				diffVec.normalize();
				diffVec.multiplyScalar(dist/10);
				thing.position.add(diffVec);							
				
			}
									
			
			else{
				count++;
				
			}
			
			if(count >= things.length-1){
				thing.acceleration = zeroVec;
				thing.velocity.multiplyScalar(0);
				thing.done = true;
			}
		
		}
			
		
		
	}
	
	
}		

function render() {
	//moveThings();
	renderer.render( scene, camera );
	//stats.update();
	

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




