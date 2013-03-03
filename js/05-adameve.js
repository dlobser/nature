

//dat.gui adds controls----------------------------
var ctrl;

var world = function(){this.speed = 0.25;this.size = 1;};

ctrl = new world();
var gui = new dat.GUI();
// gui.add(text, 'message');
gui.add(ctrl, 'speed', 0, 1);

//dat.gui adds controls----------------------------

if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var container, stats;
var camera, controls, scene, renderer;
var cross;			
var things = [];
var peepers = [];
//var man;
//var woman;
init();
animate();

function init() {

	camera = new THREE.PerspectiveCamera( 25, window.innerWidth / window.innerHeight, 1, 5000 );
	camera.position.z = 700;

	controls = new THREE.OrbitControls( camera );
	controls.addEventListener( 'change', render );

	scene = new THREE.Scene();
	scene.fog = new THREE.FogExp2( 0x77bbff, 0.001 );

	// world

	addMan();
	addWoman();
	addCat();
	addEnv();


	// lights
/*
	light = new THREE.DirectionalLight( 0xffffff );
	light.position.set( 0, 1, 1 );
	scene.add( light );

	light = new THREE.DirectionalLight( 0x002288 );
	light.position.set( -1, -1, -1 );
	scene.add( light );

	light = new THREE.AmbientLight( 0x222222 );
	scene.add( light );
*/			
	// spotlight #1 -- yellow, dark shadow
	var spotlight = new THREE.SpotLight(0xffff00);
	spotlight.position.set(200,500,500);
	//spotlight.shadowCameraVisible = true;
	spotlight.shadowDarkness = 0.95;
	spotlight.intensity = 2;
	// must enable shadow casting ability for the light
	spotlight.castShadow = true;
	scene.add(spotlight);

	// renderer

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setClearColor( scene.fog.color, 1 );
	renderer.setSize( window.innerWidth, window.innerHeight-100 );
	renderer.shadowMapEnabled = true;
	//renderer = new THREE.WebGLRenderer();

	container = document.getElementById( 'container' );
	container.appendChild( renderer.domElement );


	window.addEventListener( 'resize', onWindowResize, false );

}

function addEnv(){

	var planegeo = new THREE.PlaneGeometry(20,20,20,20);
	var spheregeo = new THREE.SphereGeometry(20,20,20);
	var cylgeo = new THREE.CylinderGeometry(6,6, 500, 10 )
	this.material =  new THREE.MeshLambertMaterial( { color:0x33ff77} );
	this.material2 =  new THREE.MeshLambertMaterial( { color:0xaa7722 } );
	

	
	mesh = new THREE.Mesh( planegeo, material );
	mesh.rotation.x = -Math.PI/2;
	mesh.position.y = -75;
	mesh.scale.x = 500;
	mesh.scale.y = 500;
	
	mesh.receiveShadow = true;
	
	scene.add(mesh);
	
	for(var i = 0 ; i < 30 ; i++){
		mesh = new THREE.Mesh( spheregeo, material );
		mesh2 = new THREE.Mesh( cylgeo, material2 );
		
		var ball = new THREE.Object3D();
		mesh.position.y = 10;
		mesh.castShadow = true;	
		mesh2.castShadow = true;	
		
		mesh.receiveShadow = false;
		mesh2.receiveShadow = false;
		
		ball.add(mesh);
		ball.add(mesh2);
		
		ball.children[0].position.y=20;
		ball.children[1].position.y=-240;
		
		var scalar = (Math.random() * 8)+1;
		var scaleme = new THREE.Vector3(scalar,scalar,scalar*.2);
		var pos = new THREE.Vector3( (( Math.random()) * 2000)-1000, 0, (( Math.random()) * -680)-300);
		ball.scale = scaleme;
		ball.position = pos;
		
		scene.add(ball);
	}

}

function addMan(){


	var geom =  new THREE.SphereGeometry(.5,10,10);
	 //man = new peep({geo: new THREE.SphereGeometry(.5,10,10),color:0xbbbbbb});
	 var peeparams = {color2:0x000000,color1:0xff8833,color3:0xdd5522,color4:0x332211,color5:0x000000};
	 var man = new peep(peeparams);
	//(mx,my,mz,al,aw,ll,lw,ls,ex,ey,es)
	//(bod scale xyz, arm length/width, leg length/width/separation,eye x/y/separation, n
	/*
	var pos = new THREE.Vector3( (( Math.random()) * 150)+20, (( Math.random()) * 150)+20, (( Math.random()) * 80)+20);
	var armWidth = (( Math.random()) * 8)+4;
	var armLength = (( Math.random()) * 50)+10;
	var eyeX = (( Math.random()) * 5)+4;
	var eyeY = (( Math.random()) * 15)+4;
	var legWidth = (( Math.random()) * 8)+4;
	var legLength = (( Math.random()) * 50)+10;
	*/
	
	var pos = new THREE.Vector3( 80,100,30);
	var armWidth = 10;
	var armLength = 35;
	var eyeX = 5;
	var eyeY = 2;
	var legWidth = 10;
	var legLength = 30;
	
	//man.creature(pos.x,pos.y,pos.z,	armLength, armWidth,	legLength,legWidth,pos.x/3,	eyeX,eyeY,pos.x/3);
	man.dude(pos.x,pos.y,pos.z,	armLength, armWidth,	legLength,legWidth,pos.x/3,	eyeX,eyeY,pos.x/6);
	man.frontSquares(man,20,20,30);
	man.frontTail(man,5,20);
	man.hair(man,10);
	
	man.pos_reye.position.y = 15;
	man.pos_leye.position.y = 15;
	man.id = 1;
	man.q = 0;
	man.speed = Math.random() +1.2;
	
	man.pos_luarm.position.x += armWidth/2;
	man.pos_ruarm.position.x -= armWidth/2;
	
	man.pos_rboob.position.z=0;
	man.pos_lboob.position.z=0;
	
		var zerovec = new THREE.Vector3(0,0,0);
	man.sc_rboob.scale = zerovec;
	man.sc_lboob.scale = zerovec;
	
	man.CTRL.position.x = 75;
	man.CTRL.rotation.y = -.5
	man.CTRL.position.y = -75;
	

	 
	 /*to list attributes in object
	 for (var key in man) {
			if (man.hasOwnProperty(key)) {
				console.log(key);
			}
		}
	*/
	console.log(man.speed);
	
	peepers.push(man);
	scene.add(man.CTRL);

	


}

function addWoman(){


	 var peeparams2 = {color2:0x000000,color1:0xff8833,color3:0xdd0022,color4:0xffcc00,color5:0xff00ff};
	 var woman = new peep(peeparams2);
	
	var pos = new THREE.Vector3( 70,80,30);
	var armWidth = 7;
	var armLength = 25;
	var eyeX = 5;
	var eyeY = 9;
	var legWidth = 10;
	var legLength = 30;
	
	//woman.creature(pos.x,pos.y,pos.z,	armLength, armWidth,	legLength,legWidth,pos.x/3,	eyeX,eyeY,pos.x/3);
	woman.dude(pos.x,pos.y,pos.z,	armLength, armWidth,	legLength,legWidth,pos.x/3,	eyeX,eyeY,pos.x/6);
	woman.frontSquares(woman,20,20,20);
	//woman.frontTail(woman,5,20);
	woman.hair(woman,26);
	
	woman.pos_luarm.position.x += armWidth/2;
	woman.pos_ruarm.position.x -= armWidth/2;
	woman.CTRL.rotation.y = .5
	
	
	woman.pos_reye.position.y = 15;
	woman.pos_leye.position.y = 15;
	woman.id = 1;
	woman.q = 0;
	woman.speed = Math.random() +1.2;
	
	woman.CTRL.position.x = -75;
	woman.CTRL.position.y = -75;

	
	peepers.push(woman);
	scene.add(woman.CTRL);

}

function addCat(){


	var peeparams3 = {color2:0xffff00,color1:0x001133,color3:0xdd0022,color4:0xffcc00,color5:0xff00ff};
	var cat = new peep(peeparams3);
	
	var pos = new THREE.Vector3( 30,40,60);
	var armWidth = 7;
	var armLength = 15;
	var eyeX = .5;
	var eyeY = 4;
	var legWidth = 10;
	var legLength = 30;
	
	cat.creature(pos.x,pos.y,pos.z,	armLength, armWidth,	legLength,legWidth,pos.x/3,	eyeX,eyeY,pos.x/3);
	//cat.dude(pos.x,pos.y,pos.z,	armLength, armWidth,	legLength,legWidth,pos.x/3,	eyeX,eyeY,pos.x/6);
	//cat.frontSquares(cat,20,20,20);
	//cat.frontTail(cat,5,20);
	//cat.hair(cat,26);
	
	//cat.pos_luarm.position.x += armWidth/2;
	//cat.pos_ruarm.position.x -= armWidth/2;
	cat.pos_bod.position.x = 200;
	cat.pos_lear.scale.x = 10;
	cat.pos_lear.scale.y = 1.5;
	cat.pos_lear.position.x = 12;
	
	cat.pos_rear.scale.x = 10;
	cat.pos_rear.scale.y = 1.5;
	cat.pos_rear.position.x = -12;
	
	//cat.pos_reye.position.y = 15;
	//cat.pos_leye.position.y = 15;
	cat.sc_tail.scale.y = 30;
	cat.pos_tail.position.y-=4;
	cat.id = 1;
	cat.q = 0;
	cat.speed = Math.random() +2;
	
	cat.CTRL.position.y = -75;

	
	peepers.push(cat);
	scene.add(cat.CTRL);

}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );



}

function animate() {
	render();
	moveCreature();
	moveThings();
	requestAnimationFrame( animate );
	controls.update();
	
}

function moveThings(){

//peepers[0].pos_bod.position.x = 100;
//peepers[1].pos_bod.position.x = -100;

for(var i = 0 ; i < 2 ; i++){

	var p = peepers[i];

	p.pos_ruarm.rotation.z=Math.sin(p.q+p.id)/2;
	p.rt_rlarm.rotation.z=Math.sin(p.q+p.id-1)/2;
	p.pos_ruarm.position.y=Math.sin((p.q*2+p.id)-3)*3;
	
	p.pos_ruarm.rotation.z=((Math.sin(p.q+p.id)/4)+2)+Math.sin(p.q+p.id)/2;
	

	p.rt_llarm.rotation.z=Math.sin(p.q+p.id-1)/2;
	p.pos_luarm.position.y=Math.sin((p.q*2+p.id)-3)*3;
	
	p.pos_luarm.rotation.z=(((Math.sin(p.q+p.id)/4)+2)+Math.sin(p.q+p.id)/2)+2.5;
	

	p.pos_lleg.rotation.x=Math.sin(p.q+p.id-4)/4;
	p.rt_rleg.rotation.x=Math.sin(p.q+p.id-1)/4;
	
	if(p.rt_dk !== undefined){
		p.rt_dk.rotation.x=((Math.sin(p.q+p.id-1)/2)+((Math.sin((p.q/10)+p.id-1)/4)-.5)+Math.abs(((Math.sin(2+(p.q*2)))/2)+5))+1;
	}
	
	if(p.pos_rboob !== undefined && i==1){
		p.pos_rboob.position.y=  (Math.sin(((p.q*2)+p.id)-1.4)*3)-15;
		p.pos_rnip.position.y=  (Math.sin(((p.q*2)+p.id)-1.6)*3);
		p.pos_lboob.position.y=  (Math.sin(((p.q*2)+p.id)-1.4)*3)-15;
		p.pos_lnip.position.y=  (Math.sin(((p.q*2)+p.id)-1.6)*3);
	}
		
	var rotator = new THREE.Vector3(Math.sin(p.q+p.id)/4,  Math.sin((p.q+p.id)*2)/16,  Math.sin((p.q+p.id)*4)/64);
	
	p.rt_bod.rotation = rotator;
	p.rt_bod.position.y= Math.abs(((Math.sin(1+(p.q)))*25)+5);
	p.q += p.speed * ctrl.speed/3;
	
	p.CTRL.rotation.z = (Math.sin(((p.q)+p.id)-1.4)*.3);
	p.CTRL.scale.y = ((Math.abs(Math.sin(p.q+p.id)/4))+2)/2;
	p.CTRL.scale.z = ((Math.abs(Math.sin(p.q+p.id+(Math.PI/2))/4))+4)/4;
	p.CTRL.scale.x = ((Math.abs(Math.sin(p.q+p.id+(Math.PI/2))/4))+4)/4;
	
	//p.CTRL.position.y = -90;
	
}

	
	
}

function moveCreature(){

//for(var i = 0 ; i < peepers.length ; i++){

	var p = peepers[2];
	
	p.pos_rfuarm.rotation.x=	Math.sin(p.q+p.id-.4)/2;
	p.rt_rflarm.rotation.x=		Math.sin(p.q+p.id-1-.4)/2;

	p.pos_lfuarm.rotation.x=	Math.sin(p.q+p.id)/2;
	p.rt_lflarm.rotation.x=		Math.sin(p.q+p.id-1)/2;
	
	p.pos_rbuarm.rotation.x=	(Math.sin(p.q+p.id+1)/2);
	p.rt_rblarm.rotation.x=		(Math.sin(p.q+p.id)/2);

	p.pos_lbuarm.rotation.x=	(Math.sin(p.q+p.id+1.5)/2);
	p.rt_lblarm.rotation.x=		(Math.sin(p.q+p.id+.5)/2);

	p.rt_tail.rotation.x = (Math.sin((p.q+p.id+.5)*2)/2)-1;
	
	p.rt_lear.rotation.x=	(Math.sin(p.q+p.id-1)/4);
	p.rt_rear.rotation.x=	(Math.sin(p.q+p.id-1)/4);
	
	//p.pos_lflarm.rotation.x=Math.sin(p.q+p.id-1)/4;
	//p.rt_rflarm.rotation.x=Math.sin(p.q+p.id-1)/4;
	
	p.CTRL.scale.y = ((Math.abs(Math.sin(p.q+p.id)/4))+1);
	//p.CTRL.scale.z = ((Math.abs(Math.sin(p.q+p.id+(Math.PI/2))/4))+1);
	//p.CTRL.scale.x = ((Math.abs(Math.sin(p.q+p.id+(Math.PI/2))/4))+1);
	p.CTRL.rotation.y = -p.q/8;
	var rotator = new THREE.Vector3(Math.sin(p.q+p.id)/4,  Math.sin((p.q+p.id)*2)/16,  Math.sin((p.q+p.id)*4)/64);
	
	p.rt_bod.rotation = rotator;
	//p.pos_bod.position.y= ((Math.sin(1+(p.q*2)))*5)+5;
	p.q += p.speed * ctrl.speed/3;
	
	//p.CTRL.position.y = -90;
	
//}
}

function render() {
	//moveThings();
	renderer.render( scene, camera );
	//stats.update();
	

}
