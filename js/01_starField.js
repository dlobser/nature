
/*
var FizzyText = function() {
  this.message = 'Nature of Asteroids';
  this.speed = 0.8;

};
*/

var text;

window.onload = function() {
    text = new starfield();
	var gui = new dat.GUI();
	// gui.add(text, 'message');
	gui.add(text, 'speed', -1, 1);
	gui.add(text, 'size', .1, 5);
};

var starfield = function()
{
	this.speed = 0.1;
	this.size = 1;
};




var scene = new THREE.Scene();

var myNoise = new SimplexNoise();

var camera = new THREE.PerspectiveCamera(35, window.innerWidth/window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();

var rotSpeed;

renderer.setSize(window.innerWidth, window.innerHeight-100);
document.body.appendChild(renderer.domElement);

var geometry = new THREE.SphereGeometry(.2,5,5);
//var material = new THREE.MeshBasicMaterial({color: 0x99ff00});

scene.add( new THREE.AmbientLight( 0x225599 ) );

// create a point light
var pointLight =
  new THREE.PointLight(0xFFFFFF);
  pointLight.intensity = 1;
  pointLight.distance = 50;
  
  var pointLight2 =
  new THREE.PointLight(0xFF0000);
  pointLight2.intensity = .5;
  pointLight2.distance = 400;


// set its position


// add to the scene
scene.add(pointLight);
scene.add(pointLight2);

var map = THREE.ImageUtils.loadTexture( 'smile.jpg' );
var material = new THREE.MeshBasicMaterial( { ambient: 0xFFFFFF, side: THREE.DoubleSide } );
var material2 = new THREE.MeshLambertMaterial( { ambient: 0xbbbbbb, side: THREE.DoubleSide } );

camera.position.z = 40;

group = new THREE.Object3D();

var boxes = [];


var randX = 0;
var randY = 0;

var q =0;





for ( var i = 0; i < 500; i ++ ) {

	var mesh = new THREE.Mesh( geometry, material2 );
	mesh.position.x = Math.random() * 50 - 25;
	mesh.position.y = Math.random() * 2 - 1;
	mesh.position.z = Math.random() * 50 - 25;

	mesh.rotation.x = Math.random() * 2 * Math.PI;
	mesh.rotation.y = Math.random() * 2 * Math.PI;
	
	mesh.randX = 0;
	mesh.randY = 0;
	
	mesh.pickRand = Math.floor(Math.random()*91)+1;
	
	mesh.id = i;

	mesh.matrixAutoUpdate = true;
	//mesh.updateMatrix();

	scene.add( mesh );
	boxes.push(mesh);

}

var cube = new THREE.Mesh(geometry, material); 
scene.add(cube);

animate();



function animate() {

	requestAnimationFrame( animate );
	render();

}
/*
var speeder = function(){
	this.message = "gogogo";
	this.setSpeed = 0;
	this.camMove = function(){
		camera.position.x = 50 * Math.cos( timer * 4 * setSpeed);
		camera.position.z = 50 * Math.sin( timer *5);
	}
}

window.onload = function() {
var text = new speeder();
var gui = new dat.GUI();
gui.add(text, 'message');
gui.add(text, 'setSpeed',-5,5);
gui.close();
}
*/

function render() {



	//console.log(FizzyText.speed);
	cube.rotation.x += 1;
	cube.rotation.y += 1;
	//cube.position.x += (Math.random()-0.5)/10;
	//cube.position.y += (Math.random()-0.5)/10;
	
		var timer = 0.0001 * Date.now();
		

			camera.position.x = 50 * Math.cos( timer * .5);
		camera.position.z = 50 * Math.sin( timer *.65);

	
	
					
	camera.lookAt( cube.position );
	
	//console.log(myNoise.noise(timer,timer));
	

	
	q++;

	
	for ( var i = 0, il = boxes.length; i < il; i ++ ) {

		var sphere = boxes.shift();
		
		//pick a different random number every time q meets the sphere's pickRand - an arbitrary ID value
		
		if(q % sphere.pickRand == 0){
			sphere.randX = (Math.random()-0.5)/10;
			sphere.randY = (Math.random()-0.5)/10;
		}

		sphere.position.x += sphere.randX;//(Math.random()-0.5)/10;
		sphere.position.y += myNoise.noise(100,timer*sphere.pickRand/5)*text.speed;//sphere.randY;//(Math.random()-0.5)/10;
		
		var scaler = Math.abs((Math.sin(q/10 + sphere.pickRand)));
		
		sphere.scale.x = scaler * text.size;
		sphere.scale.y = scaler * text.size;
		sphere.scale.z = scaler * text.size;
		
		//sphere.position.x += SimplexNoise(timer)*100;
		//sphere.position.y += SimplexNoise(timer);
		
		//console.log(randX);
		//sconsole.log(text.speed);
		
		boxes.push(sphere);
		

	}
	
	for ( var i = 0, il = boxes.length; i < il; i ++ ) {

		var sphere = boxes[ i ];
		//console.log(boxes.length + " ID: " + sphere.id + ", " + "xPos: " + sphere.position.x);
	}
	
	renderer.render(scene, camera); 
}


    