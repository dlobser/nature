var num = 0;

sc1 = function(){

	var container,
	camera, 
	controls, 
	scene,
	renderer;	
	this.things = [];
	
	var text;
/*
	//setup dat.gui
	var starfield = function()
	{
		this.speed = 0.00001;
		this.speed2 = 1;
		this.size = 43.9;
		this.x = 0.0046;
		this.y = 0.001;
		this.z = 0.001;
		this.x2 = 0.000;
		this.y2 = 0.000;
		this.z2 = 0.000;
		this.xw = 0.000;
		this.yw = 0.000;
		this.zw = 0.000;
		this.x1 = 0.000;
		this.y1 = 0.000;
		this.z1 = 0.000;
		this.sizerx = 5;
		this.sizery = 5;
		this.sizerz = 5;
		this.length = 1;
	};
	
    this.text = new starfield();
	var gui = new dat.GUI();
	gui.remember(this.text);
	// gui.add(text, 'message');
	gui.add(this.text, 'speed', -.0001, .001);
	gui.add(this.text, 'speed2', 0,10);
	gui.add(this.text, 'size', 1, 100);
	gui.add(this.text, 'x', 0,.01);
	gui.add(this.text, 'y', 0,.01);
	gui.add(this.text, 'z', 0,.01);
	//gui.add(this.text, 'xw', 0,.01);
	//gui.add(this.text, 'yw', 0,.01);
	//gui.add(this.text, 'zw', 0,.01);
	gui.add(this.text, 'x2', 0,1);
	gui.add(this.text, 'y2', 0,1);
	gui.add(this.text, 'z2', 0,1);
	gui.add(this.text, 'x1', 0,1);
	gui.add(this.text, 'y1', 0,1);
	gui.add(this.text, 'z1', 0,1);
	gui.add(this.text, 'length', 0,10);
//	gui.add(this.text, 'sizerx', 0,10);
//	gui.add(this.text, 'sizery', 0,10);
//	gui.add(this.text, 'sizerz', 0,10);*/
}

//sets up the three scene and calls addGeo
sc1.prototype.init = function() {

	this.camera = new THREE.PerspectiveCamera( 25, window.innerWidth / window.innerHeight, 1, 2000 );
	this.camera.position.z = 2;
	this.camera.position.y = 0;
	this.camera.position.x = 0;

	this.controls = new THREE.OrbitControls( this.camera );
	this.controls.addEventListener( 'change', this.render );

	this.scene = new THREE.Scene();
	this.scene.fog = new THREE.FogExp2( 0xffffff, 0.001 );

	//this.addGeo();
	this.addEnv();

	var light = new THREE.DirectionalLight( 0x111111 );
	light.position.set( 1, 1, 1 );
	this.scene.add( light );

	light = new THREE.DirectionalLight( 0x002288 );
	light.position.set( -1, -1, -1 );
	this.scene.add( light );

	light = new THREE.AmbientLight( 0x222222 );
	this.scene.add( light );

	this.renderer = new THREE.WebGLRenderer( { antialias: true } );
	//this.renderer.setClearColor( scene.fog.color, 1 );
	this.renderer.setSize( window.innerWidth, window.innerHeight -100);	

	this.container = document.getElementById( 'container' );
	this.container.appendChild( this.renderer.domElement );

	//window.addEventListener( 'resize', onWindowResize, false );
	//console.log(this.renderer, + " " + this.scene.children.length + " " + this.camera.toString());

	
}

sc1.prototype.addGeo = function(){

	var geometry = new THREE.CylinderGeometry( 0, 10, 30, 4, 1 );
	var material =  new THREE.MeshLambertMaterial( { color:0xffffff, shading: THREE.FlatShading } );
	
	var parms={color1:0x003399,color2:0xbbffdd,color3:0x0099ff};
	
	for ( var i = 0 ; i < 2 ; i++){
		var cuber = new peep();
		//check out peep.js to see what this function does - 
		//(recurions, scale xyz, scale of each increment)
		cuber.parentSquares(200,3,0,3,.99);
		this.mesh = new THREE.Mesh( geometry, material );
		this.scene.add(cuber.pos_big);
		this.things.push(cuber);
	}
	console.log(this.things);
	
}

sc1.prototype.moveThings = function(){

	for ( var j = 0 ; j <   this.things.length  ; j++){
	
		var thing = this.things[j];
		
		//thing array has two cubers, I'm just rotating the first one around for symmetry
		if(j==0){
			thing.rt[0].rotation.x = Math.PI;
		}
		
		thing.rt[0].position.y = 0;
		thing.rt[0].children[0].scale.y = this.text.length;
	
		var sizer = new THREE.Vector3(1,1,1);
		
		//peep creates an array called rot with a list of all the required joints
		//the alternate method would involve tracing through the heirarchy by finding links to children[]
		
		for (var i = 1 ; i< thing.rt.length; i++){
			sizer.multiplyScalar(2);
			thing.rt[i].rotation.x = (Math.sin((i/this.text.size)+num)*(i*this.text.x))+(Math.sin(this.text.x2)*(i/thing.rt.length))+(Math.sin(this.text.x1));
			thing.rt[i].rotation.z = (Math.sin((i/this.text.size)+num)*(i*this.text.y))+(Math.sin(this.text.y2)*(i/thing.rt.length))+(Math.sin(this.text.y1));
			thing.rt[i].rotation.y = (Math.sin((i/this.text.size)+num)*(i*this.text.z))+(Math.sin(this.text.z2)*(i/thing.rt.length))+(Math.sin(this.text.z1));
			thing.rt[i].position.y = this.text.length;
			thing.rt[i].children[0].scale.y = this.text.length;
			
			//when enabled, these options would allow for the scaling of each joint in isolation without respect to the heirarchy
			
		//	thing.rot[i].children[0].scale.x = this.text.sizerx;
		//	thing.rot[i].children[0].scale.y = this.text.sizery;
		//	thing.rot[i].children[0].scale.z = this.text.sizerz;
		}
		num-=i*this.text.speed*this.text.speed2;
	}	
}

sc1.prototype.animate = function(){
	
	//this.render();
	
	this.renderer.render( this.scene, this.camera );
	/*
	if(this.text.speed*this.text.speed2 !=0){
		this.moveThings();
	}
	*/
	this.moveEnv();
	var that = this;
	requestAnimationFrame( function() { that.animate(); });
	this.controls.update();
	
}

sc1.prototype.render = function() {
	//console.log("wtf");
	//wtf does this throw errors even when it's not being used?
	//this.renderer.render( this.scene, this.camera );

}
sc1.prototype.moveEnv = function(){

	this.scene.children[1].position.z+=10;
}

sc1.prototype.addEnv = function(){

	var planegeo = new THREE.PlaneGeometry(20,20,20,20);
	var spheregeo = new THREE.SphereGeometry(10,10,10);
	var cylgeo = new THREE.CylinderGeometry(6,6, 500, 10 )
	this.material =  new THREE.MeshLambertMaterial( { color:0x33ff77} );
	this.material2 =  new THREE.MeshLambertMaterial( { color:0xaa7722 } );
	

	
	mesh = new THREE.Mesh( planegeo, this.material );
	mesh.rotation.x = -Math.PI/2;
	mesh.position.y = -65;
	mesh.scale.x = 500;
	mesh.scale.y = 500;
	
	mesh.receiveShadow = true;
	
	this.scene.add(mesh);
	var balls = new THREE.Object3D();
	
	for(var i = 0 ; i < 2000 ; i++){
		mesh = new THREE.Mesh( spheregeo, this.material );
		mesh2 = new THREE.Mesh( cylgeo, this.material2 );
		
		var ball = new THREE.Object3D();
		mesh.position.y = -20;
		mesh.castShadow = true;	
		mesh2.castShadow = true;	
		
		mesh.receiveShadow = false;
		mesh2.receiveShadow = false;
		
		ball.add(mesh);
		ball.add(mesh2);
		
		ball.children[0].position.y=10;
		ball.children[1].position.y=-240;
		
		var scalar = (Math.random() * 3)+1;
		var scaleme = new THREE.Vector3(scalar,scalar,scalar);

		var randValue;
		var finished = false;
		while(!finished){
			randValue = randly();
			if(randValue > 30 || randValue < -30){
				finished = true;
			}
		}
		
		
		var pos = new THREE.Vector3( randValue,(( Math.random()) * 30)+30, (( Math.random()) * -20000));
		ball.scale = scaleme;
		ball.position = pos;
		balls.add(ball);
		
	}
	this.scene.add(balls);
	console.log(this.scene);

}

function randly(){
	var returner = (Math.random() -.5)*300;
	return returner;
}

