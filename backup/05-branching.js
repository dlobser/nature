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


var avoidDistance = 150;
var ballAmount = 5;

init();
animate();


function init() {

	camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 1000 );
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
			
	scene.fog = new THREE.FogExp2( hexValue, 0.002 );
	
	//-------------------------------------------
	addGeo();
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
function addGeo(){

	var myColor = ("0x" + Math.floor(Math.random()*16777215).toString(16));
	var hexValue = parseInt(myColor , 16);

	var geometry = new THREE.CubeGeometry( 10,8,5 );
	
	for ( var i = 0; i < ballAmount; i ++ ) {
	
		var myColor = THREE.Vector3( ( Math.random() - 0.5 ) * 10, ( Math.random() - 0.5 ) * 10, ( Math.random() - 0.5 ) * 10);	
		var myColor = ("0x" + Math.floor(Math.random()*16777215).toString(16));
		var material =  new THREE.MeshLambertMaterial( { color:myColor, shading: THREE.FlatShading } );
		
		var mesh = new THREE.Mesh( geometry, material );
		var pos = new THREE.Vector3( ( Math.random() - 0.5 ) * 10, (( Math.random() - 0.5 ) * 10), ( Math.random() - 0.5 ) * 10);
		
		var zeroVec = new THREE.Vector3(0,0,0);
		var upVec = new THREE.Vector3(0,10,0);
		
		mesh.go = true;
		mesh.dist = 1;
		mesh.count = 0;

		mesh.position = pos;
		mesh.velocity = zeroVec;
		mesh.acceleration = zeroVec;
		
		mesh.updateMatrix();
		mesh.matrixAutoUpdate = true;
			
		scene.add( mesh );
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
		if(gogo <= things.length-1 && !doneAnimating ){
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
	
	requestAnimationFrame( animate );
	controls.update();
	
}

/*
document.addEventListener( 'mousedown', onDocumentMouseDown, false );
function onDocumentMouseDown( event ) {

	var l = Math.min(spheres.length,900);
	var j = 0;


    //remove everything
    while (l--) {
		
       // if(scene.children[l] instanceof THREE.Camera) continue; //leave camera in the scene
		
		//if(scene.children[l] instanceof THREE.Light) continue;
			
			console.log(spheres[l].geometry.vertices);
			var numVerts = spheres[l].geometry.vertices.length;
			document.writeln("g obj" + l + "</br>");
			document.writeln(THREE.saveGeometryToObj(spheres[l],j*numVerts));

		
		j++;
		
        scene.remove(scene.children[l]);

	}

			things = [];
			branch = [];
			limb = [];
			
			addGeo();
			gogo = 0;
}
*/
/*
function moveThings(){

	this.go = false;
	
	for ( var i = 0, il = things.length; i < il; i ++ ) {
	
		var thing = things[i];
		
		thing.position.add(thing.velocity);
		thing.velocity.add(thing.acceleration);
		
		thing.count = 0;
		
		//animate all the things away from each other with a little noise
		//when they're far enough away add count - if count is high enough - stop them and make thing.go false
		for ( var j = 0; j < things.length ; j ++ ) {
		
			if ( j==i && j< things.length-1){
				j++;	
			}

			
			var other = things[j];
			
			var zeroVec = new THREE.Vector3(0,0,0);
			
			var dist = thing.position.distanceTo(other.position);
								
			if ( dist < avoidDistance){
			
				thing.acceleration = new THREE.Vector3( ( Math.random() - 0.5 ) * 1, (( Math.random() - 0.5) * 1), ( Math.random() - 0.5 ) * 1);	
			
				var diffVec = THREE.Vector3.prototype.subVectors(thing.position,other.position);
				
				diffVec.normalize();
				diffVec.multiplyScalar(Math.max(dist/50,1));
				thing.position.add(diffVec);	
				
				thing.dist = dist;
				
				thing.rotation.y = Math.atan2( - thing.velocity.z, thing.velocity.x );
				thing.rotation.z = (Math.asin( thing.velocity.y / thing.velocity.length() ) - 3.1415/2);
			
							
			}
			
			else{
				thing.count++;		
			}

			if(thing.count >= things.length-1){
				thing.acceleration = zeroVec;
				thing.velocity.multiplyScalar(0);
				thing.go = false;
			}
			
		
		}
		
			
		
		
	}
	if(avoidDistance<100){
		avoidDistance+=.5;
	}
}	
*/

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
				thing.acceleration = new THREE.Vector3( 0,0,0);	
				
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
			
			//console.log("count: " + thing.count);
			
			if(thing.count >= things.length-1){
				thing.acceleration = zeroVec;
				thing.velocity.multiplyScalar(0);
				thing.go = false;
				thing.scale.y = .01;
				//console.log(j + ": I'm done");
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
				
				//tree.add(parent);
				
			
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

THREE.SphereGeometry2 = function ( radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength, height, topScale, botScale ) {

	THREE.Geometry.call( this );

	this.radius = radius || 50;

	this.widthSegments = Math.max( 3, Math.floor( widthSegments ) || 8 );
	this.heightSegments = Math.max( 2, Math.floor( heightSegments ) || 6 );

	phiStart = phiStart !== undefined ? phiStart : 0;
	phiLength = phiLength !== undefined ? phiLength : Math.PI * 2;

	thetaStart = thetaStart !== undefined ? thetaStart : 0;
	thetaLength = thetaLength !== undefined ? thetaLength : Math.PI;

	var x, y, vertices = [], uvs = [];

	for ( y = 0; y <= this.heightSegments; y ++ ) {

		var verticesRow = [];
		var uvsRow = [];

		for ( x = 0; x <= this.widthSegments; x ++ ) {

			var u = x / this.widthSegments;
			var v = y / this.heightSegments;
			
			var scalar;
			
			if (y >(this.heightSegments)/2){
				scalar = topScale;
			}
			else{
				scalar = botScale;
			}

			var vertex = new THREE.Vector3();
			vertex.x = - this.radius * Math.cos( phiStart + u * phiLength ) * Math.sin( thetaStart + v * thetaLength )*scalar;
			vertex.y = this.radius * Math.cos( thetaStart + v * thetaLength )*scalar;
			vertex.z = this.radius * Math.sin( phiStart + u * phiLength ) * Math.sin( thetaStart + v * thetaLength )*scalar;
			
			if (y <= (this.heightSegments)/2){
				vertex.y += height;
			}

			this.vertices.push( vertex );

			verticesRow.push( this.vertices.length - 1 );
			uvsRow.push( new THREE.Vector2( u, 1 - v ) );

		}

		vertices.push( verticesRow );
		uvs.push( uvsRow );

	}

	for ( y = 0; y < this.heightSegments; y ++ ) {

		for ( x = 0; x < this.widthSegments; x ++ ) {

			var v1 = vertices[ y ][ x + 1 ];
			var v2 = vertices[ y ][ x ];
			var v3 = vertices[ y + 1 ][ x ];
			var v4 = vertices[ y + 1 ][ x + 1 ];

			var n1 = this.vertices[ v1 ].clone().normalize();
			var n2 = this.vertices[ v2 ].clone().normalize();
			var n3 = this.vertices[ v3 ].clone().normalize();
			var n4 = this.vertices[ v4 ].clone().normalize();

			var uv1 = uvs[ y ][ x + 1 ].clone();
			var uv2 = uvs[ y ][ x ].clone();
			var uv3 = uvs[ y + 1 ][ x ].clone();
			var uv4 = uvs[ y + 1 ][ x + 1 ].clone();

			if ( Math.abs( this.vertices[ v1 ].y ) === this.radius ) {

				this.faces.push( new THREE.Face3( v1, v3, v4, [ n1, n3, n4 ] ) );
				this.faceVertexUvs[ 0 ].push( [ uv1, uv3, uv4 ] );

			} else if ( Math.abs( this.vertices[ v3 ].y ) === this.radius ) {

				this.faces.push( new THREE.Face3( v1, v2, v3, [ n1, n2, n3 ] ) );
				this.faceVertexUvs[ 0 ].push( [ uv1, uv2, uv3 ] );

			} else {

				this.faces.push( new THREE.Face4( v1, v2, v3, v4, [ n1, n2, n3, n4 ] ) );
				this.faceVertexUvs[ 0 ].push( [ uv1, uv2, uv3, uv4 ] );

			}

		}

	}

	this.computeCentroids();
	this.computeFaceNormals();

    this.boundingSphere = new THREE.Sphere( new THREE.Vector3(), radius );

};

THREE.SphereGeometry2.prototype = Object.create( THREE.Geometry.prototype );

