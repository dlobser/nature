



sc1 = function(){

	var container,
	camera, 
	controls, 
	scene,
	renderer;	
	this.things = [];
	
	var text;


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
//	gui.add(this.text, 'sizerz', 0,10);



	
}

sc1.prototype.init = function() {

	this.camera = new THREE.PerspectiveCamera( 25, window.innerWidth / window.innerHeight, 1, 10000 );
	this.camera.position.z = -200;
	this.camera.position.y = 200;
		this.camera.position.x = 200;
	this.doom = 1;

	this.controls = new THREE.OrbitControls( this.camera );
	this.controls.addEventListener( 'change', this.render );

	this.scene = new THREE.Scene();
	this.scene.fog = new THREE.FogExp2( 0x000000, 0.00052 );

	this.addGeo();

	var light = new THREE.DirectionalLight( 0xffffff );
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
	//console.log(this.renderer);
	

	this.container = document.getElementById( 'container' );
	this.container.appendChild( this.renderer.domElement );

	//window.addEventListener( 'resize', onWindowResize, false );
	//console.log(this.renderer, + " " + this.scene.children.length + " " + this.camera.toString());

	
}

sc1.prototype.addGeo = function(){

	var geometry = new THREE.CylinderGeometry( 0, 10, 30, 4, 1 );
	var material =  new THREE.MeshLambertMaterial( { color:0xffffff, shading: THREE.FlatShading } );
	
	var parms={color1:0x003399,color2:0xbbffdd,color3:0x0099ff};
	
	for ( var i = 0 ; i < 2    ; i++){
	
		var cuber = new peep();
		cuber.parentSquares(200,3,0,3,.99);
		this.mesh = new THREE.Mesh( geometry, material );
		this.scene.add(cuber.pos_big);
		//console.log(cuber);
		this.things.push(cuber);
		//cuber.rt_big.rotation.y = 10;	
	}
	console.log(this.things);
	
	}
	var num = 0;
sc1.prototype.moveThings = function(){
	

		for ( var j = 0 ; j <   this.things.length  ; j++){
		
			var thing = this.things[j];
			if(j==0){
				thing.things[0].rotation.x = Math.PI;
			}
			//thing.things[3].rotation.x = 3;
			thing.things[0].position.y = 0;
			thing.things[0].children[0].scale.y = this.text.length;
			//thing.things[0].scale.x = .5;
			//thing.things[0].scale.z = .5;
			
			var sizer = new THREE.Vector3(1,1,1);
			
			
			for (var i = 1 ; i< thing.things.length; i++){
			
				sizer.multiplyScalar(2);
				thing.things[i].rotation.x = (Math.sin((i/this.text.size)+num)*(i*this.text.x))+(Math.sin(this.text.x2)*(i/thing.things.length))+(Math.sin(this.text.x1));
				thing.things[i].rotation.z = (Math.sin((i/this.text.size)+num)*(i*this.text.y))+(Math.sin(this.text.y2)*(i/thing.things.length))+(Math.sin(this.text.y1));
				thing.things[i].rotation.y = (Math.sin((i/this.text.size)+num)*(i*this.text.z))+(Math.sin(this.text.z2)*(i/thing.things.length))+(Math.sin(this.text.z1));
				thing.things[i].position.y = this.text.length;
				thing.things[i].children[0].scale.y = this.text.length;
			//	thing.things[i].children[0].scale.x = this.text.sizerx;
			//	thing.things[i].children[0].scale.y = this.text.sizery;
			//	thing.things[i].children[0].scale.z = this.text.sizerz;
			}
			num-=i*this.text.speed*this.text.speed2;
		}
		
		
}

sc1.prototype.animate = function(){
	
	//this.render();
	this.renderer.render( this.scene, this.camera );
	if(this.text.speed*this.text.speed2 !==0){
		this.moveThings();
	}
	var that = this;
	requestAnimationFrame( function() { that.animate(); });
	this.controls.update();
	
}

sc1.prototype.render = function() {
	//console.log("wtf");
	//wtf does this throw errors even when it's not being used?
	//this.renderer.render( this.scene, this.camera );

}

