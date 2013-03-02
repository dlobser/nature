//dat.gui adds controls----------------------------
var ctrl;

var world = function(){this.speed = 0.25;this.size = 1;};

ctrl = new world();
var gui = new dat.GUI();
// gui.add(text, 'message');
gui.add(ctrl, 'speed', -1, 1);

//dat.gui adds controls----------------------------
if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
//-------------------------------------------Global Variables

var container, stats;
var camera, controls, scene, renderer;		
var peepers = [];

//q is counter
var q = 0;
var q2 = 0;

var man;

//-------------------------------------------

init();
animate();

//peep is the class of people.  Client calls the function 'dude' which in turn calls 'part'.

function peep(){

	this.geometry = new THREE.CubeGeometry( 1,1,1,1,1,1 );
	
	this.id;
	this.speed;
	
	//q is counter
	this.q;
	
	//client calls dude, dude calls parts
	//function(body size xyz (mx,my,mz), arm length/width(al,aw),leg length,width and separation(ll,lw,ls),eye scale x and y and eye separation(ey,es))
	
	this.dude = function (mx,my,mz,al,aw,ll,lw,ls,ex,ey,es) {
		
		var rotColor = Math.random() * 16777215;
		var hexValue = parseInt(rotColor , 16);
		
		var white = hexValue;
		var black = 0x000000;
		
		this.CTRL = new THREE.Object3D();
		this.CTRL.name = "CTRL";
		
		this[  this.CTRL.name ] = this.CTRL;
		
		//(mesh offset xyz, scale xyz, controller position xyz, name, color)
		var rlArm = this.part(0,-.5,0,aw,al,aw,0,-al,0,"rlarm",white);
		var ruArm = this.part(0,-.5,0,aw,al,aw,(mx+(aw))*.5,0,0,"ruarm",white);
		
		var llArm =	this.part(0,-.5,0,aw,al,aw,0,-al,0,"llarm",white);
		var luArm =	this.part(0,-.5,0,aw,al,aw,(mx+(aw))*-.5,0,0,"luarm",white);
		
		var lLeg =	this.part(0,-.5,0,lw,ll,lw,ls,-(my*.5),0,"lleg",white);
		var rLeg =	this.part(0,-.5,0,lw,ll,lw,-ls,-(my*.5),0,"rleg",white);
		
		var leye =	this.part(0,0,.5,ex,ey,ex,es,0,mz*.5,"leye",black);
		var reye =	this.part(0,0,.5,ex,ey,ex,-es,0,mz*.5,"reye",black);
	
		var bod =	this.part(0,0,0,mx,my,mz,0,0,0,"bod",white);
		
		this.rotation_ruarm.add(rlArm);			
		this.rotation_luarm.add(llArm);
		
		this.rotation_bod.add(ruArm);
		this.rotation_bod.add(luArm);
		
		this.rotation_bod.add(lLeg);
		this.rotation_bod.add(rLeg);
		
		this.rotation_bod.add(leye);
		this.rotation_bod.add(reye);
		
		this.CTRL.add(bod);
		
		this.CTRL.position.y = my+ll;
	}	
	
	/*
	//this.geometry is a cube set to a scale of 1,1,1 - this is true of every object that's created
	//It is placed inside a group which scales it to the desired size
	//this group is placed inside a group designated for 'rotation' although you can do anything with it
	//this group is placed inside 'poser' the top group, which is returned
	//each item's name is assigned to the peep object so it can be easily accessed later
	
	//(mesh offset xyz, scale xyz, controller position xyz, name, color)
	*/
	this.part = function(px,py,pz,	sx,sy,sz,	p2x,p2y,p2z,	namer,color){
		
		this.material =  new THREE.MeshLambertMaterial( { color:0xffffff, shading: THREE.FlatShading } );
		this.material.color.setHex(color);
		
		var pos = new THREE.Vector3(px,py,pz);
		var scl = new THREE.Vector3(sx,sy,sz);
		var pos2 = new THREE.Vector3(p2x,p2y,p2z);
		
		this.mesh = new THREE.Mesh( this.geometry, this.material );
							
		this.mesh.updateMatrix();
		this.mesh.matrixAutoUpdate = true;					
		this.mesh.position = pos;				
		this.scalar = new THREE.Object3D();	

		this.mesh.name = "mesh_"+namer;
		
		this[ this.mesh.name ] = this.mesh;
		
		this.scalar.name = "scale_"+namer;	
		
		this[ this.scalar.name ] = this.scalar;
		
		this.scalar.matrixAutoUpdate = true;					
		this.scalar.add(this.mesh);					
		this.scalar.scale = scl;					
		this.rotator = new THREE.Object3D();

		this.rotator.name = "rotation_"+namer;	

		this[ this.rotator.name ] = this.rotator;
		
		this.rotator.matrixAutoUpdate = true;					
		this.rotator.add(this.scalar);					
		this.poser = new THREE.Object3D();	
		
		this.poser.name = "position_"+namer;
		
		this.poser.matrixAutoUpdate = true;					
		this.poser.add(this.rotator);					
		this.poser.position = pos2;	

		this[ this.poser.name ] = this.poser;	

		return this.poser;
	}
}
	
function init() {
	
	scene = new THREE.Scene();
	addPeeps();
	
	//everything else in init() is threejs scene setup stuff and can be safely ignored
	
	//camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
	camera = new THREE.OrthographicCamera( window.innerWidth / - 7, window.innerWidth / 7, window.innerHeight / 7, window.innerHeight / - 7, - 1000, 1000 );
	camera.position.x = -8;
	camera.position.y = 0;
	camera.position.z = 20;
	camera.fov = 100;

	controls = new THREE.OrbitControls( camera );
	controls.addEventListener( 'change', render );

	scene.fog = new THREE.FogExp2( 0xffffff, 0.1 );
	
	light = new THREE.DirectionalLight( 0xffffff );
	light.position.set( 1, 1, 1 );
	light.intensity = 2;
	scene.add( light );

	light = new THREE.DirectionalLight( 0x002288 );
	light.position.set( -1, -1, -1 );
	scene.add( light );

	light = new THREE.AmbientLight( 0x222222 );
	scene.add( light );

	// renderer

	renderer = new THREE.WebGLRenderer( { antialias: true} );
	renderer.setClearColor( 0 );
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

function addPeeps(){
	
	//for positioning, these will be used to make a 5x5 grid
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
		man.id = i;
		man.q = 0;
		man.speed = Math.random()*2 +1;
		 
		 /*to list attributes in object
		 for (var key in man) {
				if (man.hasOwnProperty(key)) {
					console.log(key);
				}
			}
		*/
		
		peepers.push(man);
		scene.add(man.CTRL);
		
		//if you comment this line out the peeps will be placed randomly 
		//based on the 'pos' variable defined earlier
		var pos = new THREE.Vector3(px,py,0);

		var scalar = new THREE.Vector3( .2,.2,.2);
		man.CTRL.position = pos;
		man.CTRL.scale = scalar;
		
		//for positioning in a 25x25 grid
		px += 50;
		
		if(i % 5 == 0 ){
			px = -100;
			py += 50;
		}
	}
}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {

	q+=(ctrl.speed/3);
	q2+=(ctrl.speed/3);
	render();
	
	//animation of the peeps is determined by sin waves which are offset using the peepers 'id' value
	//p.q is the counter for each peeper, and p.speed determines the value by which p.q is incremented
	
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
		p.position_bod.position.y= ((Math.sin(1+(p.q*2)))*5)+5;
		p.q += p.speed * ctrl.speed/3;
		
	}

	requestAnimationFrame( animate );
	controls.update();
	
}

function render() {
	
	renderer.render( scene, camera );
	//stats.update();
	
}
