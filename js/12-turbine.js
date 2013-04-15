var num = 0;
var rebuild = false;
var things = [];
var boxes = [];
var vector = new THREE.Vector3(0,0,0);
var objRotate = false;
var helpGeo = false;

rebuilder = function(){

	//console.log(user.value);
	//console.log(anim.value);
	//console.log(JSON.stringify(things[0].p));
	console.log(things[0].p);
	//console.log($.extend(things[0].p,this.animObject));	
	rebuild = true;

}

helperGeo = function(){

	helpGeo = !helpGeo;

}

applyPreset = function(){

	var div = document.getElementById('user');
	var options = document.getElementById('select').options;
	var divAnim = document.getElementById('anim');
	
	switch(options.selectedIndex)
	{
	case 0:
		div.value = '{"num":25,"scale":[5,16,5],"ss":0.92,"leaves":2,"divs":5,"rads":2,"leafss":[0.95,0.8,0.2],"leafDivs":[2,4,2],"fruit":true,"term":[0,1,2,3],"leafJoints":[10,10,10],"jScale2":[2,10,2],"anim":{"num":2.7}}';
		divAnim.value = '{"x1":[0,0.1,0.2,0.3,0],"x2":[0,0,-0.6],"y1":[0.1,0.2],"y2":[-0.8],"x3":[1,1,1]}';
		rebuilder();
		break;
	case 1:
	  div.value = '{"num":200,"scale":[2,8,2],"ss":1,"leaves":1,"divs":2,"rads":1,"leafss":[0.95,0.8,0.2],"leafDivs":[2,2,2],"fruit":true,"term":[0,1,2,3],"leafJoints":[10,15,10],"jScale1":[2,5,2],"anim":{"num":2.7}}';
	  divAnim.value = '{"x1":[0,0,0],"x2":[0,0.9,0],"y1":[0.0051],"z1":[0.1],"y2":[-0.8],"x3":[0,0,0],"x4":[1,1,-1],"y4":[1,1,1],"off":[0,1]}';
	  rebuilder();
	  break;
	case 2:
		div.value = '{"num":55,"scale":[2,8,2],"ss":0.98,"leaves":1,"divs":7,"rads":2,"leaf1ss":0.98,"leaf0ss":0.98,"fruit":true,"term0":0,"term1":1,"term2":2,"leafDiv1":3,"jScale2":[1,6,1],"leafJoints":[10,30]}';
		divAnim.value = '{"x1":[0,0.1,0.2,0.3,0],"x2":[0,-0.5,-0.6],"y1":[0.1,0.2],"y2":[-0.8],"x3":[24,24,1]}';
		rebuilder();
		break;
	case 3:
		div.value = '{"num":25,"scale":[5,16,5],"ss":0.95,"leaves":2,"divs":10,"rads":2,"leafss":[0.95,0.95,0.2],"leafDivs":[2,4,2],"fruit":true,"term":[0,1,2,3],"leafJoints":[10,10,5],"jScale2":[2,10,2],"anim":{"num":2.7}}';
		divAnim.value = '{"x1":[0,0,0],"x2":[0,0,0],"y1":[0,0,0],"y2":[0,0,0],"x3":[0,0,0]}';
		rebuilder();
		break;
	default:
	   div.value = '{"num":200,"scale":[2,8,2],"ss":1,"leaves":1,"divs":2,"rads":1,"leafss":[0.95,0.8,0.2],"leafDivs":[2,2,2],"fruit":true,"term":[0,1,2,3],"leafJoints":[10,15,10],"jScale1":[2,5,2],"anim":{"num":2.7}}';
	
	}
	

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
		f1.add(this.text, 'speed', 0, .1);
		f1.add(this.text, 'speed2', 0.0000001,10);
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
	user.defaultValue ='{"num":25,"scale":[5,16,5],"ss":0.92,"leaves":2,"divs":5,"rads":2,"leafss":[0.95,0.8,0.2],"leafDivs":[2,4,2],"fruit":true,"term":[0,1,2,3],"leafJoints":[10,10,10],"jScale2":[2,10,2],"anim":{"num":2.7}}';
	anim.defaultValue = '{"x1":[0,0.1,0.2,0.3,0],"x2":[0,0,-0.6],"y1":[0.1,0.2],"y2":[-0.8],"x3":[1,1,1]}';
	
	var your_object = JSON.parse(user.value);
	this.animObject = JSON.parse(anim.value);

	var parms={color1:0x225577,color2:0xbbffdd,color3:0x0099ff};
	
	this.rotator = new THREE.Object3D(0,0,0);
	
	var mesh = new THREE.Mesh(geometry);
	
	var dir = new THREE.Vector3(.1,.5,-.4);
	
	//align(mesh,dir,1);
	
	//this.scene.add(mesh);
	
	
	
	

	for ( var i = 0 ; i < 1 ; i++){
	
		var cuber = new peep(your_object);
		
		cuber.makeParams(your_object);
		console.log(JSON.stringify(cuber.p));

		cuber.branchSquares();
		console.log(cuber);
		cuber.big.position.y = -100;
		
		this.rotator.add(cuber.big);

		this.scene.add(this.rotator);
		things.push(cuber);
		things[i].animVals = cuber.p.anim;
		
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
		
		for (var q = 0 ; q <= thing.p.leaves ; q++){
		
			if(this.animObject.x1 !== undefined)
			var myx1 = ( this.animObject.x1[q] === undefined ) ? 0:this.animObject.x1[q];
			else myx1 = thing.p.anim.def[q];
			if(this.animObject.y1 !== undefined)
			var myy1 = ( this.animObject.y1[q] === undefined ) ? 0:this.animObject.y1[q];
			else myy1 = thing.p.anim.def[q];
			if(this.animObject.z1 !== undefined)
			var myz1 = ( this.animObject.z1[q] === undefined ) ? 0:this.animObject.z1[q];
			else myz1 = thing.p.anim.def[q];
			if(this.animObject.x2 !== undefined)
			var myx2 = ( this.animObject.x2[q] === undefined ) ? 0:this.animObject.x2[q];
			else myx2 = thing.p.anim.def[q];
			if(this.animObject.y2 !== undefined)
			var myy2 = ( this.animObject.y2[q] === undefined ) ? 0:this.animObject.y2[q];
			else myy2 = thing.p.anim.def[q];
			if(this.animObject.z2 !== undefined)
			var myz2 = ( this.animObject.z2[q] === undefined ) ? 0:this.animObject.z2[q];
			else myz2 = thing.p.anim.def[q];
			if(this.animObject.x3 !== undefined)
			var myx3 = ( this.animObject.x3[q] === undefined ) ? 0:this.animObject.x3[q];
			else myx3 = thing.p.anim.def[q];
			if(this.animObject.y3 !== undefined)
			var myy3 = ( this.animObject.y3[q] === undefined ) ? 0:this.animObject.y3[q];
			else myy3 = thing.p.anim.def[q];
			if(this.animObject.z3 !== undefined)
			var myz3 = ( this.animObject.z3[q] === undefined ) ? 0:this.animObject.z3[q];
			else myz3 = thing.p.anim.def[q];
			if(this.animObject.x4 !== undefined)
			var myx4 = ( this.animObject.x4[q] === undefined ) ? 0:this.animObject.x4[q];
			else myx4 = thing.p.anim.def[q];
			if(this.animObject.y4 !== undefined)
			var myy4 = ( this.animObject.y4[q] === undefined ) ? 0:this.animObject.y4[q];
			else myy4 = thing.p.anim.def[q];
			if(this.animObject.z4 !== undefined)
			var myz4 = ( this.animObject.z4[q] === undefined ) ? 0:this.animObject.z4[q];
			else myz4 = thing.p.anim.def[q];
			//if(this.animObject.def !== undefined)
			//var myx1 = ( this.animObject.def[q] === undefined ) ? 0:this.animObject.def[q];
		//	else myx1 = thing.defaults.anim.def[q];
			//console.log(myx1);

		
			thing.p.anim.x1[q] = this.text["x1-"+q] + myx1;
			thing.p.anim.y1[q] = this.text["y1-"+q] + myy1;
			thing.p.anim.z1[q] = this.text["z1-"+q] + myz1;
			thing.p.anim.x2[q] = this.text["x2-"+q] + myx2;
			thing.p.anim.y2[q] = this.text["y2-"+q] + myy2;
			thing.p.anim.z2[q] = this.text["z2-"+q] + myz2;
			thing.p.anim.x3[q] = this.text["x3-"+q] + myx3;
			thing.p.anim.y3[q] = this.text["y3-"+q] + myy3;
			thing.p.anim.z3[q] = this.text["z3-"+q] + myz3;
			thing.p.anim.x4[q] = this.text["x4-"+q] + myx4;
			thing.p.anim.y4[q] = this.text["y4-"+q] + myy4;
			thing.p.anim.z4[q] = this.text["z4-"+q] + myz4;
			thing.p.anim.off[q] = this.text["off-"+q];
			thing.p.anim.sc[q] = this.text["sc-"+q];
		}

		
		for (var q = 0 ; q < thing.fruit.length ; q++){
			thing.fruit[q].scale = new THREE.Vector3(this.text.fruitSize,this.text.fruitSize,this.text.fruitSize);
		
		}
		
		thing.p.anim.size = this.text.size;
		thing.p.anim.x = this.text.x;
		thing.p.anim.y = this.text.y;
		thing.p.anim.z = this.text.z;
		
		thing.animate();
		thing.p.anim.num-=this.text.speed*this.text.speed2;
	}	
	
	var rot = new THREE.Vector3(this.text.rotatorx,this.text.rotatory,this.text.rotatorz);

	this.rotator.rotation = vector;
}

sc1.prototype.animate = function(){
	
	if(rebuild){
		//make a fake tree
		if(helpGeo){
			var tree = new THREE.Object3D();
			for (var i in things){
				tree.add(makeLimbGeo(things[i],.5));
			}
		}
		
		things = [];
		killEverything(scene);
		this.addGeo();
		
		if (helpGeo){
			this.scene.add(tree);
			things[0].msh.push(tree.children[0].children[0]);
		}
		
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
		//things[0].big.position.y = 0;
		
		for (var i = 0 ; i < things[0].msh.length ; i++){
			

			
			//grrr - somehow two extra objects are being added to the msh array - so I'm manually skipping them, messy
			if(i == things[0].msh.length-2 || i == things[0].msh.length-3) i++;
			else{
				output += THREE.saveGeometryToObj4(things[0].msh[i],j,.0002);
				j += things[0].msh[i].geometry.vertices.length;
			}
		}
		
		//console.log(output);
		output.replace("undefined","");
		alert("saved!");
		var blob = new Blob([output], {type: "text/plain;charset=ANSI"});
		saveAs(blob, "tree.obj");
	//}
	
}
