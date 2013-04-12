var num = 0;
var rebuild = false;
var things = [];
var boxes = [];
var vector = new THREE.Vector3(0,0,0);
var objRotate = false;
var helpGeo = false;

rebuilder = function(){

	console.log(user.value);
	console.log(anim.value);
	rebuild = true;

}

helperGeo = function(){

	helpGeo = !helpGeo;

}

sc1 = function(){

	var container,
	camera, 
	controls, 
	renderer;	
	//things = [];
	var rAm = Math.PI/2;
	this.scene;
	var text;
	this.rebuild = false;
	this.pos = new THREE.Vector3(0,0,0);
	//setup dat.gui
	var starfield = function()
	{
		this.speed = 0.01;
		this.speed2 = 1;
		this.size = 43.9;
		this.x = 0.0001;
		this.y = 0.0001;
		this.z = 0.0001;
		this.x2 = 0.000;
		this.y2 = 0.000;
		this.z2 = 0.000;
		this.xw = 0.000;
		this.yw = 0.000;
		this.zw = 0.000;
		this.x1 = 0.000;
		this.y1 = 0.000;
		this.z1 = 0.000;
		this.fruitSize = 4.6;
		
		this.num=20;
		//this.scale:new THREE.Vector3(5,10,5);
		this.ss=.96;
		//this.leaf1ss:.8;
		//this.leaf0ss:.9;
		this.leaves=1;
		this.divs=2;
		this.rads=2;
		
		this.rotatorx=0;
		this.rotatory=0;
		this.rotatorz=0;
		
		this.rebuilder = function() { 
			//console.log(scene.text);
			//killEverything(scene);
			//console.log(rebuild);
			rebuild = true;
			//console.log(rebuild);
			//sc1.prototype.addGeo();

		};
		//this.term1:0;
		//this.term2:1;
		//this.term3:2;
		//this.term4:3;
		//this.angle1:.5;
		//this.angle2:.1;
		//this.fruit:true;
		//this.fruitScale:new THREE.Vector3(5,5,5)
		
		for( var i = 0 ; i < 6 ; i++){
		
			this["x1-"+i] = 0;
			this["y1-"+i] = 0;
			this["z1-"+i] = 0;
			
			this["x2-"+i] = 0;
			this["y2-"+i] = 0;
			this["z2-"+i] = 0;
			
			this["x3-"+i] = 0;
			this["y3-"+i] = 0;
			this["z3-"+i] = 0;
			
			this["x4-"+i] = 0;
			this["y4-"+i] = 0;
			this["z4-"+i] = 0;
			
			this["off-"+i] = 0;
			
			this["sc-"+i] = 1;
		}
	};
	
    this.text = new starfield();
	var gui = new dat.GUI();
	//gui.remember(this.text);
	// gui.add(text, 'message');
	var f0 = gui.addFolder('constructdor');
		//f0.add(this.text, 'num',1,100);
	//	f0.add(this.text, 'ss',.8,1.2);
		//f0.add(this.text, 'leaves',0,6);
		//f0.add(this.text, 'divs',1,30);
		//f0.add(this.text, 'rads',1,20);
		//f0.add(this.text, 'rebuilder');
		//f0.add(this.text, 'rotatorx',-3,3);
		//f0.add(this.text, 'rotatory',-3,3);
		//f0.add(this.text, 'rotatorz',-3,3);
		f0.add(this.text, 'fruitSize',0.01,10);
	
	var f1 = gui.addFolder('motion');
		f1.add(this.text, 'speed', -.0001, .1);
		f1.add(this.text, 'speed2', 0,10);
		f1.add(this.text, 'size', 1, 100);
		f1.add(this.text, 'x', 0,.01);
		f1.add(this.text, 'y', 0,.01);
		f1.add(this.text, 'z', 0,.01);
	
	for( var i = 0 ; i < 6 ; i++){
		//console.log("pre: " + rAm);
		if(i<1){
			rAm=.5;
		}
		else
			rAm = Math.PI/2;
	//	console.log("rArm: " + rAm);
		this['fol'+i] = gui.addFolder('level' + i);
		
		this['fol'+i].add(this.text, 'x1-'+i, -rAm,rAm);
		this['fol'+i].add(this.text, 'y1-'+i, -rAm,rAm);
		this['fol'+i].add(this.text, 'z1-'+i, -rAm,rAm);
		
		this['fol'+i].add(this.text, 'x2-'+i, -rAm,rAm);
		this['fol'+i].add(this.text, 'y2-'+i, -rAm,rAm);
		this['fol'+i].add(this.text, 'z2-'+i, -rAm,rAm);
		
		this['fol'+i].add(this.text, 'x3-'+i, -rAm,rAm);
		this['fol'+i].add(this.text, 'y3-'+i, -rAm,rAm);
		this['fol'+i].add(this.text, 'z3-'+i, -rAm,rAm);
		
		this['fol'+i].add(this.text, 'x4-'+i, -rAm,rAm);
		this['fol'+i].add(this.text, 'y4-'+i, -rAm,rAm);
		this['fol'+i].add(this.text, 'z4-'+i, -rAm,rAm);
		
		this['fol'+i].add(this.text, 'off-'+i, -.1,.1);
		
		this['fol'+i].add(this.text, 'sc-'+i, .8,1.5);
		
	}

//	gui.add(this.text, 'sizerx', 0,10);
//	gui.add(this.text, 'sizery', 0,10);
//	gui.add(this.text, 'sizerz', 0,10);
f1.open();
}

//sets up the three scene and calls addGeo
sc1.prototype.init = function() {

	this.camera = new THREE.PerspectiveCamera( 25, window.innerWidth / window.innerHeight, 1, 10000 );
	this.camera.position.z = 0;
	this.camera.position.y = 0;
	this.camera.position.x = 600;

	//this.controls = new THREE.OrbitControls( this.camera );
	//this.controls.addEventListener( 'change', this.render );

	this.scene = new THREE.Scene();
	this.scene.fog = new THREE.FogExp2( 0x000000, 0.00052 );
	this.camera.lookAt(new THREE.Vector3(0,0,0));
	//this.scene.add(this.camera);
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

	this.container = document.getElementById( 'container' );
	this.container.appendChild( this.renderer.domElement );

	//window.addEventListener( 'resize', onWindowResize, false );
	//console.log(this.renderer, + " " + this.scene.children.length + " " + this.camera.toString());

	
}

sc1.prototype.addGeo = function(){

	var geometry = new THREE.CylinderGeometry( 0, 10, 30, 4, 1 );
	var g2 = new THREE.CubeGeometry( 1,1,1 );
	var g1 = new THREE.Geometry();
	var material =  new THREE.MeshLambertMaterial( { color:0xffffff, shading: THREE.FlatShading } );

	var div = document.getElementById('user');
	var divAnim = document.getElementById('anim');
	user.defaultValue = '{"num":25,"scale":[5,16,5],"ss":0.92,"leaves":2,"divs":5,"rads":2,"leaf1ss":0.9,"leaf0ss":0.9,"fruit":true,"term0":0,"term1":1,"term2":2,"leafDiv1":3,"jScale2":[1,6,1],"leafJoint2":8}';
	anim.defaultValue = '{"x1":[0,0.1,0.2,0.3,0],"x2":[0,0,-0.6],"y1":[0.1,0.2],"y2":[-0.8],"x3":[1,1,1]}';
	
	var your_object = JSON.parse(user.value);
	this.animObject = JSON.parse(anim.value);

	var parms={color1:0x225577,color2:0xbbffdd,color3:0x0099ff};
	
	this.rotator = new THREE.Object3D(0,0,0);

	for ( var i = 0 ; i < 1 ; i++){
		var cuber = new peep(parms);

		cuber.branchSquares(your_object);
		console.log(cuber);
		cuber.big.position.y = -100;
		
		this.rotator.add(cuber.big);
		this.scene.add(this.rotator);
		things.push(cuber);
		things[i].animVals = cuber.options.anim;
		//console.log(things[i].animVals);
		
		for(key in this.animObject){
			if(this.animObject[key] instanceof Array){
				for( i in this.animObject[key] )
					if (this.animObject[key][i] !== undefined){
						
					//	console.log(this.animObject.x1);
						//console.log(this.animObject[key][i]);

						
					}
			}
		}
		
	}

//	console.log(things);
	
	
}

sc1.prototype.moveThings = function(){
	
	for ( var j = 0 ; j <   things.length  ; j++){
	
		var thing = things[j];
		
		for (var q = 0 ; q <= thing.leaves ; q++){
		
			if(this.animObject.x1 !== undefined)
			var myx1 = ( this.animObject.x1[q] === undefined ) ? 0:this.animObject.x1[q];
			else myx1 = thing.options.anim.def[q];
			if(this.animObject.y1 !== undefined)
			var myy1 = ( this.animObject.y1[q] === undefined ) ? 0:this.animObject.y1[q];
			else myy1 = thing.options.anim.def[q];
			if(this.animObject.z1 !== undefined)
			var myz1 = ( this.animObject.z1[q] === undefined ) ? 0:this.animObject.z1[q];
			else myz1 = thing.options.anim.def[q];
			if(this.animObject.x2 !== undefined)
			var myx2 = ( this.animObject.x2[q] === undefined ) ? 0:this.animObject.x2[q];
			else myx2 = thing.options.anim.def[q];
			if(this.animObject.y2 !== undefined)
			var myy2 = ( this.animObject.y2[q] === undefined ) ? 0:this.animObject.y2[q];
			else myy2 = thing.options.anim.def[q];
			if(this.animObject.z2 !== undefined)
			var myz2 = ( this.animObject.z2[q] === undefined ) ? 0:this.animObject.z2[q];
			else myz2 = thing.options.anim.def[q];
			if(this.animObject.x3 !== undefined)
			var myx3 = ( this.animObject.x3[q] === undefined ) ? 0:this.animObject.x3[q];
			else myx3 = thing.options.anim.def[q];
			if(this.animObject.y3 !== undefined)
			var myy3 = ( this.animObject.y3[q] === undefined ) ? 0:this.animObject.y3[q];
			else myy3 = thing.options.anim.def[q];
			if(this.animObject.z3 !== undefined)
			var myz3 = ( this.animObject.z3[q] === undefined ) ? 0:this.animObject.z3[q];
			else myz3 = thing.options.anim.def[q];
			if(this.animObject.x4 !== undefined)
			var myx4 = ( this.animObject.x4[q] === undefined ) ? 0:this.animObject.x4[q];
			else myx4 = thing.options.anim.def[q];
			if(this.animObject.y4 !== undefined)
			var myy4 = ( this.animObject.y4[q] === undefined ) ? 0:this.animObject.y4[q];
			else myy4 = thing.options.anim.def[q];
			if(this.animObject.z4 !== undefined)
			var myz4 = ( this.animObject.z4[q] === undefined ) ? 0:this.animObject.z4[q];
			else myz4 = thing.options.anim.def[q];
			//if(this.animObject.def !== undefined)
			//var myx1 = ( this.animObject.def[q] === undefined ) ? 0:this.animObject.def[q];
		//	else myx1 = thing.options.anim.def[q];
			

		
			thing.options.anim.x1[q] = this.text["x1-"+q] + myx1;
			thing.options.anim.y1[q] = this.text["y1-"+q] + myy1;
			thing.options.anim.z1[q] = this.text["z1-"+q] + myz1;
			thing.options.anim.x2[q] = this.text["x2-"+q] + myx2;
			thing.options.anim.y2[q] = this.text["y2-"+q] + myy2;
			thing.options.anim.z2[q] = this.text["z2-"+q] + myz2;
			thing.options.anim.x3[q] = this.text["x3-"+q] + myx3;
			thing.options.anim.y3[q] = this.text["y3-"+q] + myy3;
			thing.options.anim.z3[q] = this.text["z3-"+q] + myz3;
			thing.options.anim.x4[q] = this.text["x4-"+q] + myx4;
			thing.options.anim.y4[q] = this.text["y4-"+q] + myy4;
			thing.options.anim.z4[q] = this.text["z4-"+q] + myz4;
			thing.options.anim.off[q] = this.text["off-"+q];
			thing.options.anim.sc[q] = this.text["sc-"+q];
		}

		
		for (var q = 0 ; q < thing.fruit.length ; q++){
			thing.fruit[q].scale = new THREE.Vector3(this.text.fruitSize,this.text.fruitSize,this.text.fruitSize);
		
		}
		
		thing.options.anim.size = this.text.size;
		thing.options.anim.x = this.text.x;
		thing.options.anim.y = this.text.y;
		thing.options.anim.z = this.text.z;
		
		thing.animate();
		thing.options.anim.num-=this.text.speed*this.text.speed2;
	}	
	
	var rot = new THREE.Vector3(this.text.rotatorx,this.text.rotatory,this.text.rotatorz);

	this.rotator.rotation = vector;
}

sc1.prototype.animate = function(){

	//console.log(rebuild);
	if(rebuild){
		
		//make a fake tree
		
		if(helpGeo){
			var tree = new THREE.Object3D();
			tree.add(makeLimbGeo(things[0],.5));
		}
		//console.log(things[0].msh);
		things = [];
		killEverything(scene);
		this.addGeo();
		
		if (helpGeo){
			this.scene.add(tree);
			things[0].msh.push(tree.children[0].children[0]);
		}
		//console.log(things);
		rebuild = false;
	}
	//this.render();
	this.renderer.render( this.scene, this.camera );
	if(this.text.speed*this.text.speed2 !=0){
		this.moveThings();
	}
	var that = this;
	requestAnimationFrame( function() { that.animate(); });
	//this.controls.update();
	
}

sc1.prototype.render = function() {
	//console.log("wtf");
	//wtf does this throw errors even when it's not being used?
	//this.renderer.render( this.scene, this.camera );

}


document.addEventListener( 'mousemove', onDocumentMouseMove, false );
document.addEventListener( 'mousedown', onDocumentMouseDown, false );
document.addEventListener( 'mouseup', onDocumentMouseUp, false );

var projector;
projector = new THREE.Projector();

function onDocumentMouseMove( event ) {
	if(objRotate){
		vector = new THREE.Vector3(
		0,
		( event.clientX*-3 / window.innerWidth ) * 2 + 1,
		-( event.clientY / window.innerHeight ) * 2 + 1
		);
		
	
	}		
}

function onDocumentMouseDown( event ) {
	if(( event.clientX / window.innerWidth ) < .7 && ( event.clientX/ window.innerWidth ) > .3)
	objRotate = true;
}

function onDocumentMouseUp( event ) {
	objRotate = false;
}



function saver() {

	//if(evt.keyCode == 65){
		alert("saving!");
		var j = 0;
		var output = "";
		
		//console.log(tree.children.length);
		//things[0].big.scale.x = .01;

		for (var i = 0 ; i < things[0].msh.length ; i++){
			output += THREE.saveGeometryToObj4(things[0].msh[i],j,1);
			j += things[0].msh[i].geometry.vertices.length;
		}
		
		//console.log(output);
		output.replace("undefined","");
		alert("saved!");
		var blob = new Blob([output], {type: "text/plain;charset=ANSI"});
		saveAs(blob, "tree.obj");
	//}
	
}
