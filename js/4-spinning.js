
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(20, 1900/1060, 0.1, 1000);

var renderer = new THREE.WebGLRenderer({antialias:true, clearColor: 0x5FC8F5, clearAlpha: 1 });
renderer.setSize(window.innerWidth, window.innerHeight-100);
document.body.appendChild(renderer.domElement);

var geometry = new THREE.SphereGeometry(.4,32,2);
var cubegeometry = new THREE.CubeGeometry(1,1,1);
var material = new THREE.MeshBasicMaterial({color: 0x2BED8C});
var material2 = new THREE.MeshBasicMaterial({color: 0x4288EB});
var material3 = new THREE.MeshBasicMaterial({color: 0x94F4FF});

var ball = new THREE.Object3D();
var balls = new THREE.Object3D();

var numRots = 12;

var numBalls = 10;
var off = .2;

var numCube = 12;

var thing = [];
var parent = [];
var cubes = [];
var cubeParent = [];
var parentCube;
var returnCube;
var renderCube = true;
var pos = new THREE.Vector3(1,0,0);

camera.position.z = 60;

//makes cubes in a cylinder (material, amount, offset, scale xyz, rotate xyz)

var roland = function(mat,num,off,sx,sy,sz,rx,ry,rz){

	returnCube = new THREE.Object3D();
	
	for (var i = 0 ; i < num ; i++){
		parentCube = new THREE.Object3D();
		
		if(i%3 == 0) mat = material;
		if(i%3 == 1) mat = material2;
		if(i%3 == 2) mat = material3;
		
		var cube = new THREE.Mesh(cubegeometry, mat);
		
		var scalar = new THREE.Vector3(sx,sy,sz);
		var rotator = new THREE.Vector3(rx,ry,rz);
		
		cube.position.z = off;
		cube.scale = scalar;
		cube.rotation = rotator;
		
		parentCube.add(cube);
		
		parentCube.rotation.y = ((Math.PI*2)/num)*i;
					
		cubeParent.push(parentCube);
		
		returnCube.add(parentCube);
	
	}
	
	return returnCube;

}

function rollRoland (speed) {

	returnCube.rotation.y += pos.x/10000;
	if(renderCube) returnCube.position.y = -1000;
	else returnCube.position.y = 0;

		

}


function rollBob(){
var zeroVec = new THREE.Vector3(0,0,0);
	for(var i = 0 ; i < parent.length ; i++ ){
		var diffVec = zeroVec.distanceTo(parent[i].children[0].position);
		//console.log(diffVec);
		parent[i].rotation.z += diffVec/1000*(pos.x/30);
		parent[i].position.y = pos.y/5;
		if ( i % 12 == 0 ){
			q = 0;
		}
		console.log(pos.x);
		q = pos.x/.00001;
	}
}
//makes a line of circles

var bob = function(num,dist,offs,mat,start,grow,zed) {

	var returnBall = new THREE.Object3D();
	
	//var dist = 1.3;
	
	for (var i = 0 ; i < num ; i++){
		var parentBall = new THREE.Object3D();
		var sphere = new THREE.Mesh(geometry, mat);
		var scalar = new THREE.Vector3(1,1,1);
		scalar.multiplyScalar((i/start)+((i+1)*grow));
		//console.log(scalar.x);
		sphere.rotation.x = 3.1415/2;
		sphere.position.y = (i*dist)+offs;
		sphere.position.z = zed;
		sphere.scale = scalar;
		parentBall.add(sphere);
		parent.push(parentBall);
		returnBall.add(parentBall);
		dist += off;
		
	}
	
	return returnBall;
}

//console.log(ball.length);

//calls bob inside of this plus other functions (offset, spokes, amount, distance, offset, material, start pos, bigness, z pos)

function copyOff(off,rots,num,dist,offs,mat,start,grow,zed){

	var returnBalls = new THREE.Object3D();
	
	for (var i = 0 ; i < rots ; i++){
		var thingy = new bob(num,dist,offs,mat,start,grow,zed);			
		thingy.rotation.z = ((Math.PI*2)*i/rots)+off;			
		thing.push(thingy);			
		returnBalls.add(thingy);
	
	
	}
	
	return returnBalls;
}


//             	copyOff(off,rots,num,dist,offs,mat,start,grow)
var binger = 	copyOff(0,			12,	9,	.5,		.6,material,	100,	.33,		-2);
var bing = 		copyOff(Math.PI/4,	6,	19,	-.6,	2,material2,	12,		.01,	0);
var babing = 	copyOff(Math.PI/12,	6,	9,	.25,	2,material3,	6,		.2,		2);
				//		(mat,num,off,sx,sy,sz,rx,ry,rz)
var myCube = 	roland(material2,36*3,25,   .051, 50, 0.051,   .0,0.4,.5);

balls.add(binger);
balls.add(bing);
balls.add(babing);

scene.add(balls);
scene.add(myCube);




function animator(){

	rollRoland();
	
	
	
	rollBob();

}

function render() {

	requestAnimationFrame(render);			
	renderer.render(scene, camera);			
	animator();

}

render();


///////////////////---------------------------/////////////////////////

document.addEventListener( 'mousedown', onDocumentMouseDown, false );

var projector;
projector = new THREE.Projector();




function onDocumentMouseDown( event ) {
	var vector = new THREE.Vector3(
	( event.clientX / window.innerWidth ) * 2 - 1,
	- ( event.clientY / window.innerHeight ) * 2 + 1,
	0.5 );

	projector.unprojectVector( vector, camera );
	var dir = vector.sub( camera.position ).normalize();
	var ray = new THREE.Ray( camera.position, dir );
	var distance = - camera.position.z / dir.z;
	pos = camera.position.clone().add( dir.multiplyScalar( distance ) );		
}

 window.onkeypress = onKeyPress;
 
function onKeyPress(event) {
	var vector = new THREE.Vector3(
	( event.clientX / window.innerWidth ) * 2 - 1,
	- ( event.clientY / window.innerHeight ) * 2 + 1,
	0.5 );

	projector.unprojectVector( vector, camera );
	var dir = vector.sub( camera.position ).normalize();
	var ray = new THREE.Ray( camera.position, dir );
	var distance = - camera.position.z / dir.z;
	pos = camera.position.clone().add( dir.multiplyScalar( distance ) );		
}

 window.onkeyup = onKeyUp;


 function onKeyUp(evt) {
 
	if(evt.keyCode == 82){
	
		var l = parent.length;
		var j = 0;

		while (l--) {
		
			
	
			//if(pos.x > 8){
				//document.writeln("g obj" + l + "</br>");
				var numVerts = parent[l].children[0].geometry.vertices.length;
				document.writeln(THREE.saveGeometryToObj(parent[l].children[0],j*(numVerts)));
				console.log(j);
			//}
			
			j++;
		}
	}
	
	if(evt.keyCode == 81){
		renderCube = !renderCube;
	}
	
}



document.addEventListener('keypress', onKeyPress, false);

THREE.saveGeometryToObj = function (geo,nums) {

	geo.updateMatrixWorld();

	var num = parseInt(nums);

	var s = '';
	for (i = 0; i < geo.geometry.vertices.length; i++) {

		var vector = new THREE.Vector3( geo.geometry.vertices[i].x, geo.geometry.vertices[i].y, geo.geometry.vertices[i].z );
		geo.matrixWorld.multiplyVector3( vector );
		
		//vector.applyProjection( matrix )
		
		s+= 'v '+(vector.x) + ' ' +
		vector.y + ' '+
		vector.z + '</br>';
	}

	for (i = 0; i < geo.geometry.faces.length; i++) {

		s+= 'f '+ (geo.geometry.faces[i].a+1+num) + ' ' +
		(geo.geometry.faces[i].b+1+num) + ' '+
		(geo.geometry.faces[i].c+1+num);

		if (geo.geometry.faces[i].d!==undefined) {
			s+= ' '+ (geo.geometry.faces[i].d+1+num);
		}
		s+= '</br>';
	}

	return s;
}
