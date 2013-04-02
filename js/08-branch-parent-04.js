var num = 0;

sc1 = function(){

	var container,
	camera, 
	controls, 
	scene,
	renderer;	
	this.things = [];
	
	var text;

	//setup dat.gui
	var starfield = function()
	{
		this.speed = 0.00001;
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
		this.sizerx = 5;
		this.sizery = 5;
		this.sizerz = 5;
		this.length = 1.6;
		this.test = 0;
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
	gui.add(this.text, 'test', -Math.PI,Math.PI*2);
//	gui.add(this.text, 'sizerx', 0,10);
//	gui.add(this.text, 'sizery', 0,10);
//	gui.add(this.text, 'sizerz', 0,10);
}

//sets up the three scene and calls addGeo
sc1.prototype.init = function() {

	this.camera = new THREE.PerspectiveCamera( 25, window.innerWidth / window.innerHeight, 1, 10000 );
	this.camera.position.z = 0;
	this.camera.position.y = 0;
	this.camera.position.x = -550;

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
	
	//( radius, widthSegments, heightSegments, height, topScale, botScale )
	
	/*
	var geometry2 = new THREE.SphereGeometry3( 10, 10, 11, 1, 1,1 );
	var material2 =  new THREE.MeshLambertMaterial( { color:0xffffff, shading: THREE.FlatShading } );
	
	console.log("top: " +geometry2.topVerts.length);
	
	for(i in geometry2.topVerts){
		
		geometry2.topVerts[i].y += -100;
		console.log(geometry2.topVerts[i]);
	}
	
	this.mesh = new THREE.Mesh( geometry2, material2 );
	this.scene.add(this.mesh);
*/
	
	var parms={color1:0x003399,color2:0xbbffdd,color3:0x0099ff};
	
	for ( var i = 0 ; i < 1 ; i++){
		var cuber = new peep({leaves:3,geo:g2,geo2:g1});
		//console.log(cuber.rt);
		//check out peep.js to see what this function does - 
		//(recurions, scale xyz, scale of each increment)
		cuber.set(2);
		cuber.branchSquares(30,2,10,2,1);
		this.mesh = new THREE.Mesh( geometry, material );
		this.scene.add(cuber.pos_big);
		this.things.push(cuber);
	}
	
	//console.log("LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL");
	//console.log(this.things);
	//console.log("here" + this.things[0].msh.length);
	
	for (i in this.things[0].msh){
	//console.log(i);
		//console.log("i: " + i);
		//console.log(this.things[0].pos[i].position);
	}
//	console.log(this.things[0].branches);
		//	this.things[0].pos[8].position.y = 6;
		//this.things[0].pos[7].position.y = 6;
		//console.log("fuck id up:   " +this.things[0].pos[7].id);
		//this.things[0].pos[8].rotation.x = 1;
	for(i in this.things[0].msh){
		//console.log(this.things[0].msh[i].position);
	}
		for(i in this.things[0].sc){
		//console.log(this.things[0].sc[i].position);
	}
		for(i in this.things[0].pos){
		//console.log("pos  "+i);
		//console.log(this.things[0].pos[i].position);
	}
	

			for(i in this.things[0].rt){
		//console.log(this.things[0].rt[i].position);
	}
	
	for(i in this.things[0].branches){
	//console.log("hi");
		if(this.things[0].branches[i].name==1){
						//console.log("ieeeeeeeee" + i);
						console.log(this.things[0].branches[i][0]);
						}
		}
	for (i in this.things[0].pos)
		//console.log(i + "  " + this.things[0].pos[i].name);
	
	for (var i = 0 ; i< this.things[0].pos.length; i++){
		if(this.things[0].pos[i].name == "pos_big0"){
	//		console.log(this.things[0].pos[i]);

			//this.things[0].pos[i].rotation.x = Math.random(Math.PI);
		}
	}
	
	var thing=this.things[0];
	//console.log(thing.branches);
		for ( i in thing.branches ){
		if(i>0){
			for(j in thing.branches[i])
				if(j>-1){
				//	console.log(thing.branches[i].name);
					var l = thing.branches[i][j].length-1;
					//thing.branches[i][j].rotation.x = 0;
					//console.log("i: " + i + " j: " + j + " item: " + thing.branches[i][j].name);
				}
			}
		
		}
	/*
	for(i in this.things[0].branches){
		console.log(this.things[0].branches[i][0]);
	}
	*/
	
}

sc1.prototype.moveThings = function(){

	for ( var j = 0 ; j <   this.things.length  ; j++){
	
		var thing = this.things[j];
		
		//console.log(thing);
		//thing array has two cubers, I'm just rotating the first one around for symmetry
		if(j==0){
			//thing.rt[0].rotation.x = Math.PI;
			//thing.children[0].position.y = -100;
		}
		
		thing.rt[0].position.y = -75;
		//thing.rt[0].children[0].scale.y = this.text.length;
		
	
		var sizer = new THREE.Vector3(1,1,1);
		
		//peep creates an array called rot with a list of all the required joints
		//the alternate method would involve tracing through the heirarchy by finding links to children[]
		
for (var i = 0 ; i< thing.pos.length; i++){
	//if (thing.pos[i].name == "pos_big159")
		//thing.pos[i].rotation.x = 1;
}
		
		for (var i = 1 ; i< thing.rt.length; i++){
		/*
			sizer.multiplyScalar(2);
			thing.rt[i].rotation.x = (Math.sin((i/this.text.size)+num)*(i*this.text.x))+(Math.sin(this.text.x2)*(i/thing.rt.length))+(Math.sin(this.text.x1));
			thing.rt[i].rotation.z = (Math.sin((i/this.text.size)+num)*(i*this.text.y))+(Math.sin(this.text.y2)*(i/thing.rt.length))+(Math.sin(this.text.y1));
			thing.rt[i].rotation.y = (Math.sin((i/this.text.size)+num)*(i*this.text.z))+(Math.sin(this.text.z2)*(i/thing.rt.length))+(Math.sin(this.text.z1));
			*/
			//if(thing.rt[i].name != "rt_big0")
			//thing.pos[i].position.y = this.text.length;
			//thing.rt[i].children[0].scale.y = this.text.length;
			//thing.rt[i].children[0].scale.y = this.text.length;
			//console.log(thing.rt[i].children[0]);
	
			
			//when enabled, these options would allow for the scaling of each joint in isolation without respect to the heirarchy
			
		//	thing.rot[i].children[0].scale.x = this.text.sizerx;
		//	thing.rot[i].children[0].scale.y = this.text.sizery;
		//	thing.rot[i].children[0].scale.z = this.text.sizerz;
		}
		
		for ( i in thing.branches ){
		if(i>=0){
			for(j in thing.branches[i])
				if(j>=0){
					if(thing.branches[i].name==1 && j<thing.branches[i].length-1){
						//thing.branches[i][j].rotation.x = this.text.test*(.3)*(thing.branches[i][1].idq/10);
						//thing.branches[i][j].rotation.x =(Math.sin((i/this.text.size)+num)*(i*this.text.x))+(Math.sin(this.text.x2)*(i/thing.rt.length))+(Math.sin(this.text.x1));
						/*
						thing.branches[i][0].children[0].scale.x = 2;//thing.branches[i][1].children[0].scale.x;
						thing.branches[i][0].children[0].scale.y = 5;//thing.branches[i][1].children[0].scale.y;
						thing.branches[i][0].children[0].scale.z = 2;//thing.branches[i][1].children[0].scale.z;
						*/
					}
					if(thing.branches[i].name==0 && j<thing.branches[i].length-1)
						thing.branches[i][j].rotation.x = (Math.sin((j/this.text.size)+num)*(j*this.text.x))+(Math.sin(this.text.x2)*(j/thing.branches[i].length))+(Math.sin(this.text.x1))+(Math.sin(j)*this.text.test);
					//if(thing.branches[i].name==1)
					//	thing.branches[i][j].rotation.x = (Math.sin((j/this.text.size)+num)) + this.text.test*(.8);
					if(thing.branches[i].name==1 && j<thing.branches[i].length-1)
						thing.branches[i][j].rotation.x = this.text.test;//*;//(j/10);
					if(thing.branches[i].name==2  && j<thing.branches[i].length-1)
						thing.branches[i][j].rotation.x = this.text.test;
					//console.log(thing.branches[i][j]);
				}
			}
		
		}
		
		//*(thing.branches[i][0].idq);
		
	}
		
		num-=i*this.text.speed*this.text.speed2;
}	


sc1.prototype.animate = function(){
	
	//this.render();
	this.renderer.render( this.scene, this.camera );
	if(this.text.speed*this.text.speed2 !=0){
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
