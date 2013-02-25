

//dat.gui adds controls----------------------------

var ctrl;

		var world = function()
{
	this.speed = 0.25;
	this.size = 1;
};

//window.onload = function() {
	ctrl = new world();
	var gui = new dat.GUI();
	// gui.add(text, 'message');
	gui.add(ctrl, 'speed', -1, 1);
	//gui.add(ctrl, 'size', .1, 5);
//};



//dat.gui adds controls----------------------------


if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var container, stats;
var camera, controls, scene, renderer;
var cross;			
var things = [];
var parts = [];
var peepers = [];

var man;

init();
animate();

function party(){
	var leye = 0;
	this.reye = 0;
}

var partis = party();

//console.log(partis.leye);

function peep(){

	this.parts = [];
	this.id;
	this.speed;
	this.q;

	this.dude = function (mx,my,mz,al,aw,ll,lw,ls,ex,ey,es) {
		
		var rotColor = Math.random() * 16777215;
		var hexValue = parseInt(rotColor , 16);
		var white = hexValue;
		var black = 0x000000;
		this.CTRL = new THREE.Object3D();
		this.CTRL.name = "CTRL";
					
		var rlArm = new part(0,-.5,0,aw,al,aw,0,-al,0,"rlarm",white);
		var ruArm = new part(0,-.5,0,aw,al,aw,(mx+(aw))*.5,0,0,"ruarm",white);
		
		var llArm = new part(0,-.5,0,aw,al,aw,0,-al,0,"llarm",white);
		var luArm = new part(0,-.5,0,aw,al,aw,(mx+(aw))*-.5,0,0,"luarm",white);
		
		var lLeg = new part(0,-.5,0,lw,ll,lw,ls,-(my*.5),0,"lleg",white);
		var rLeg = new part(0,-.5,0,lw,ll,lw,-ls,-(my*.5),0,"rleg",white);
		
		var leye = new part(0,0,.5,ex,ey,ex,es,0,mz*.5,"leye",black);
		var reye = new part(0,0,.5,ex,ey,ex,-es,0,mz*.5,"reye",black);
	
		var bod = new part(0,0,0,mx,my,mz,0,0,0,"bod",white);
		
		ruArm.rotator.add(rlArm.wer);			
		luArm.rotator.add(llArm.wer);
		
		bod.rotator.add(ruArm.wer);
		bod.rotator.add(luArm.wer);
		
		bod.rotator.add(lLeg.wer);
		bod.rotator.add(rLeg.wer);
		
		bod.rotator.add(leye.wer);
		bod.rotator.add(reye.wer);
		
		this.CTRL.add(bod.wer);
		
		this.CTRL.position.y = my+ll;
	}	
		
	function part(px,py,pz,sx,sy,sz,p2x,p2y,p2z,namer,color){
								
		var geometry = new THREE.CubeGeometry( 1,1,1,1,1,1 );
		var material =  new THREE.MeshLambertMaterial( { color:color, shading: THREE.FlatShading } );
	
		var pos = new THREE.Vector3(px,py,pz);
		var scl = new THREE.Vector3(sx,sy,sz);
		var pos2 = new THREE.Vector3(p2x,p2y,p2z);
		
		this.mesh = new THREE.Mesh( geometry, material );
							
		this.mesh.updateMatrix();
		this.mesh.matrixAutoUpdate = true;					
		this.mesh.position = pos;				
		this.scalar = new THREE.Object3D();	

		this.mesh.name = "mesh_"+namer;
		this.scalar.name = "scale_"+namer;	
		
		this.scalar.matrixAutoUpdate = true;					
		this.scalar.add(this.mesh);					
		this.scalar.scale = scl;					
		this.rotator = new THREE.Object3D();

		this.rotator.name = "rotation_"+namer;					
		
		this.rotator.matrixAutoUpdate = true;					
		this.rotator.add(this.scalar);					
		this.wer = new THREE.Object3D();	
		
		this.wer.name = "position_"+namer;
		
		this.wer.matrixAutoUpdate = true;					
		this.wer.add(this.rotator);					
		this.wer.position = pos2;			
	}
	
	//traverses the heirarchy and creates an array with all the controls
	this.makeSet = function(node,array) {
		for(var i = 0, count = node.children.length; i < count; i++) {
			//console.log(array.length);
			var w = 0;
			if(array.length > 0){							
				for(var j = 0 ; j<array.length ; j++){
					if(node.name != array[j].name){
						//console.log("w: " + w + " array.length: " + array.length);
						w++;
					}
				}
			}
			if(w == array.length){
				array.push(node);
			}				
			this.makeSet(node.children[i],array);					
		}
	}
	
	//use this function to print the contents of the parts array
	this.printParts = function(){
		for(thing in man.parts) {
			console.log("this." + man.parts[thing].name + "=man.parts[" + thing + "]" + ";");
		}
	}
	
	//Use makeset to print this out, copied and pasted from the console
	this.makeParts = function(){
		this.CTRL=man.parts[0]; 
		this.position_bod=man.parts[1]; 
		this.rotation_bod=man.parts[2]; 
		this.scale_bod=man.parts[3]; 
		this.position_ruarm=man.parts[4]; 
		this.rotation_ruarm=man.parts[5]; 
		this.scale_ruarm=man.parts[6]; 
		this.position_rlarm=man.parts[7]; 
		this.rotation_rlarm=man.parts[8]; 
		this.scale_rlarm=man.parts[9]; 
		this.position_luarm=man.parts[10]; 
		this.rotation_luarm=man.parts[11]; 
		this.scale_luarm=man.parts[12]; 
		this.position_llarm=man.parts[13]; 
		this.rotation_llarm=man.parts[14]; 
		this.scale_llarm=man.parts[15]; 
		this.position_lleg=man.parts[16]; 
		this.rotation_lleg=man.parts[17]; 
		this.scale_lleg=man.parts[18]; 
		this.position_rleg=man.parts[19]; 
		this.rotation_rleg=man.parts[20]; 
		this.scale_rleg=man.parts[21]; 
		this.position_leye=man.parts[22]; 
		this.rotation_leye=man.parts[23]; 
		this.scale_leye=man.parts[24]; 
		this.position_reye=man.parts[25]; 
		this.rotation_reye=man.parts[26]; 
		this.scale_reye=man.parts[27]; 
	}
}
	

function init() {

	


	camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 10000 );
	//camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 7, - 1000, 1000 );
	camera.position.x = 0;
	camera.position.y = 0;
	camera.position.z = 600;
	//camera.fov = 100;
//	camera.position.z = 250;

	controls = new THREE.OrbitControls( camera );
	controls.addEventListener( 'change', render );

	scene = new THREE.Scene();
	//scene.fog = new THREE.FogExp2( 0xffffff, 0.1 );

	// world

	//addGeo();
	
	 man = new peep();
			//(mx,my,mz,al,aw,ll,lw,ls,ex,ey,es)
			//(bod scale xyz, arm length/width, leg length/width/separation,eye x/y/separation, n
	 man.dude(100,150,25,30,10,50,5,30,4,8,30);
	 man.makeSet(man.CTRL,man.parts);
	 man.makeParts();
	 
	 
	 //addPeeps();
	 addPeepBoids();
	 
	 for(thing in man.parts) {
		//console.log("this." + man.parts[thing].name + "=man.parts[" + thing + "]" + ";");
	 }
	 
	 //man.parts[5].scale.x = 200;
	 
	 
	 var parts = [];
	 
	 function func(node) {
		for(var i = 0, count = node.children.length; i < count; i++) {
			parts.push(node);
			func(node.children[i]);			
		}
	}
	
	func(man.CTRL);
	
	
	
	var dooder;
	
	for(thing in man.parts) {
		if(man.parts[thing].name == "rotate_leye"){
			console.log("name_" + man.parts[thing].name);
			dooder = parts[thing];
		}
	} 
	
	//dooder.position.y = 10;
	
	//man.part(0,-.5,0,20,100,20,0,0,0);
	
	var geometry = new THREE.CubeGeometry( 10,10,10,1,1,1 );
	var material =  new THREE.MeshLambertMaterial( { color:0xff33ff, transparency:0, shading: THREE.FlatShading } );
	
	var mesh = new THREE.Mesh( geometry, material );
	
	scene.add(man.CTRL);


	// lights

	light = new THREE.DirectionalLight( 0xffffff );
	light.position.set( 1, 1, 1 );
	light.intensity = 2;
	scene.add( light );

	light = new THREE.DirectionalLight( 0x4477dd );
	light.position.set( -1, -1, -1 );
	scene.add( light );

	light = new THREE.AmbientLight( 0x222222 );
	scene.add( light );


	// renderer

	renderer = new THREE.WebGLRenderer( { antialias: true} );
	renderer.setClearColor( 0 );
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


function addPeepBoids(){
	birds = [];
	boids = [];

	for ( var i = 0; i < 50; i ++ ) {

		boid = boids[ i ] = new Boid();
		boid.position.x = Math.random() * 400 - 200;
		boid.position.y = Math.random() * 400 - 200;
		boid.position.z = Math.random() * 400 - 200;
		boid.velocity.x = Math.random();// * 2 - 1;
		boid.velocity.y = Math.random();// * 2 - 1;
		boid.velocity.z = Math.random();// * 2 - 1;
		boid.setAvoidWalls( true );
		boid.setWorldSize( 300, 300, 200 );
		
		man = new peep();
		var pos = new THREE.Vector3( (( Math.random()) * 150)+20, (( Math.random()) * 150)+20, (( Math.random()) * 80)+20);
		var armWidth = (( Math.random()) * 8)+4;
		var armLength = (( Math.random()) * 100)+10;
		var eyeX = (( Math.random()) * 20)+4;
		var eyeY = (( Math.random()) * 40)+4;
		var legWidth = (( Math.random()) * 8)+4;
		var legLength = (( Math.random()) * 100)+10;
		man.dude(pos.x,pos.y,pos.z,	armLength, armWidth,	legLength,legWidth,pos.x/3,	eyeX,eyeY,pos.x/3);
		man.makeSet(man.CTRL,man.parts);
		man.makeParts();
		man.id = i;
		man.q = 0;
		man.speed = Math.random()*2 +1;
		peepers.push(man);
		man.CTRL.scale.multiplyScalar(.2);
		man.position_bod.rotation.y = Math.PI/2;
		
		bird = birds[ i ] = man.CTRL;
		bird.phase = Math.floor( Math.random() * 62.83 );
		bird.position = boids[ i ].position;
		scene.add( bird );


	}
}

function addPeeps(){
	var px = -100;
	var py = -100;
	for(var i = 1 ; i < 26 ; i++){
		 man = new peep();
		 //(mx,my,mz,al,aw,ll,lw,ls,ex,ey,es)
		//(bod scale xyz, arm length/width, leg length/width/separation,eye x/y/separation, n
		
		var pos = new THREE.Vector3( (( Math.random()) * 150)+20, (( Math.random()) * 150)+20, (( Math.random()) * 80)+20);
		var armWidth = (( Math.random()) * 8)+4;
		var armLength = (( Math.random()) * 50)+10;
		var eyeX = (( Math.random()) * 5)+4;
		var eyeY = (( Math.random()) * 15)+4;
		var legWidth = (( Math.random()) * 8)+4;
		var legLength = (( Math.random()) * 50)+10;
		
		
		 man.dude(pos.x,pos.y,pos.z,	armLength, armWidth,	legLength,legWidth,pos.x/3,	eyeX,eyeY,pos.x/3);
		 man.makeSet(man.CTRL,man.parts);
		 man.makeParts();
		 man.id = i;
		 man.q = 0;
		 man.speed = Math.random()*2 +1;
		 peepers.push(man);
		 scene.add(man.CTRL);
		 
		 var pos = new THREE.Vector3(px,py,0);
		 
		
		 var scalar = new THREE.Vector3( .2,.2,.2);
		man.CTRL.position = pos;
		man.CTRL.scale = scalar;
		//man.CTRL.rotation.y = -.6;
		
		px += 50;
		if(i % 5 == 0 ){
			px = -100;
			py+=50;
		}

		
	
	}

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

var q = 0;
var q2 = 0;

var q3 = 0;
var boobs = 10;

function animate() {

	q+=(ctrl.speed/3);
	q2+=(ctrl.speed/3);
	render();
	
	if(Math.floor(Math.random()*10)<2){
	//boobs = 0;
	}
	//else {boobs = 10};
	
	q3+=.1;
	
	
	
	
	//smm.x = boobs;
	
	
	//console.log(peepers[0].id);
	
	for(var i = 0 ; i < peepers.length ; i++){
	
		var p = peepers[i];
		
		
		p.position_ruarm.rotation.x=Math.sin(p.q+p.id)/4;
		p.rotation_rlarm.rotation.x=Math.sin(p.q+p.id-1)/4;
		p.position_ruarm.position.y=Math.sin((p.q*2+p.id)-3)*3;
		
		p.position_luarm.rotation.x=Math.sin(p.q+p.id)/4;
		p.rotation_llarm.rotation.x=Math.sin(p.q+p.id-1)/4;
		p.position_luarm.position.y=Math.sin((p.q*2+p.id)-3)*3;
		
		p.position_lleg.rotation.x=Math.sin(p.q+p.id-1)/4;
		p.rotation_rleg.rotation.x=Math.sin(p.q+p.id-1)/4;
		
		var rotator = new THREE.Vector3(Math.sin(p.q+p.id)/4,  Math.sin((p.q+p.id)*2)/16,  Math.sin((p.q+p.id)*4)/64);
		
		p.rotation_bod.rotation = rotator;
		//p.CTRL.rotation.y=p.q/10;
	//	rotateAroundObjectAxis(p.rotation_bod.rotation.y,p.position_bod.rotation,p.q/10);
		p.position_bod.position.y= ((Math.sin(1+(p.q*2)))*5)+5;
		//p.CTRL.rotation.y = -.6;
		p.q += p.speed * ctrl.speed/3;
		
	}
	
	var rotationMatrix;
	function rotateAroundObjectAxis( object, axis, radians ) {
		rotationMatrix = new THREE.Matrix4();
		rotationMatrix.makeRotationAxis( axis.normalize(), radians );
		object.matrix.multiply( rotationMatrix );                       // post-multiply
		object.rotation.setEulerFromRotationMatrix(object.matrix, object.order);
	}
	 
	// Rotate an object around an axis in world space (the axis passes through the object's position) 
	var rotWorldMatrix;      
	function rotateAroundWorldAxis( object, axis, radians ) {
		rotWorldMatrix = new THREE.Matrix4();
		rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);
		rotWorldMatrix.multiply(object.matrix);        // pre-multiply
		object.matrix = rotWorldMatrix;
		object.rotation.setEulerFromRotationMatrix(object.matrix, object.order);
	} 
	//console.log(man.scale_leye.scale);
	/*
	man.rotation_leye.scale.z = 10;
	man.rotation_leye.rotation.z += ctrl.speed;
	man.position_leye.scale.z = 10 + (Math.sin(q));
	console.log(man.scale_leye.position.y);
	*/
	
	//parts[0].rotation = q;

	//man.CTRL.rotation.x = Math.sin(q+.1)/10;
	//man.CTRL.position.y = Math.abs(Math.sin(q2)*40);
	//man.CTRL.scale.x = ctrl.size;
	//man.CTRL.children[0].rotation.x=Math.sin(q)/4;
	//man.CTRL.children[0].children[1].position.y=Math.sin((q*2)-2)*2;
	//man.CTRL.children[0].children[1].rotation.x=Math.sin(q-.5);
	//partis.leye.position.y=Math.sin((q*2)-2)*2;
	//man.CTRL.children[0].children[1].rotation.z=Math.PI/2 + Math.sin(q/2);
	//man.CTRL.children[0].children[1].scale.y = .5;
	//man.CTRL.children[0].children[1].children[1].rotation.x=Math.sin(q-.75);
	//man.CTRL.children[0].children[1].children[1].children[1].rotation.x=Math.sin(q-1);
	
	//man.CTRL.children[0].children[2].rotation.x=Math.sin(q2-3.5);
	//man.CTRL.children[0].children[2].children[1].rotation.x=Math.sin(q2-3.75);
	//man.CTRL.children[0].children[2].children[1].scale.y = .5;
	//man.CTRL.children[0].children[2].children[1].children[1].rotation.x=Math.sin(q-1);
	
	//man.CTRL.children[0].children[3].rotation.x=Math.sin(q-3.8);
	//man.CTRL.children[0].children[4].rotation.x=Math.sin(q-1.5);
	
	//console.log(man.CTRL.children.length);
	
	moveThings();
	//Mover();
	requestAnimationFrame( animate );
	controls.update();
	
}

function moveThings(){

	this.go = false;
	
	//if
	//things = peepers;

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
			
				//thing.acceleration = new THREE.Vector3( ( Math.random() - 0.5 ) * 2, ( Math.random() - 0.5 ) * 2, ( Math.random() - 0.5 ) * 2);	
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
	for ( var i = 0, il = birds.length; i < il; i++ ) {

		boid = boids[ i ];
		boid.run( boids );

		bird = birds[ i ];

		//color = bird.material.color;
		//color.r = color.g = color.b = ( 500 - bird.position.z ) / 1000;

		bird.rotation.y = Math.atan2( - boid.velocity.z, boid.velocity.x );
		bird.rotation.z = Math.asin( boid.velocity.y / boid.velocity.length() );

		bird.phase = ( bird.phase + ( Math.max( 0, bird.rotation.z ) + 0.1 )  ) % 62.83;
		//bird.geometry.vertices[ 5 ].y = bird.geometry.vertices[ 4 ].y = Math.sin( bird.phase ) * 5;

	}

	

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
