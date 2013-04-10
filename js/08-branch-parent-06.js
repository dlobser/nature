var num = 0;
var rebuild = false;
var things = [];
var boxes = [];

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
		
		this.num=10;
		//this.scale:new THREE.Vector3(5,10,5);
		this.ss=.96;
		//this.leaf1ss:.8;
		//this.leaf0ss:.9;
		this.leaves=1;
		this.divs=2;
		this.rads=2;
		
		this.rebuilder = function() { 
			//console.log(scene.text);
			//killEverything(scene);
			console.log(rebuild);
			rebuild = true;
			console.log(rebuild);
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
		f0.add(this.text, 'num',1,100);
		f0.add(this.text, 'ss',.8,1.2);
		f0.add(this.text, 'leaves',0,6);
		f0.add(this.text, 'divs',1,30);
		f0.add(this.text, 'rads',1,20);
		f0.add(this.text, 'rebuilder');
	
	
	var f1 = gui.addFolder('motion');
		f1.add(this.text, 'speed', -.0001, .001);
		f1.add(this.text, 'speed2', 0,10);
		f1.add(this.text, 'size', 1, 100);
		f1.add(this.text, 'x', 0,.01);
		f1.add(this.text, 'y', 0,.01);
		f1.add(this.text, 'z', 0,.01);
	
	for( var i = 0 ; i < 6 ; i++){
		console.log("pre: " + rAm);
		if(i<1){
			rAm=.5;
		}
		else
			rAm = Math.PI/2;
		console.log("rArm: " + rAm);
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
f0.open();
}

//sets up the three scene and calls addGeo
sc1.prototype.init = function() {

	this.camera = new THREE.PerspectiveCamera( 25, window.innerWidth / window.innerHeight, 1, 10000 );
	this.camera.position.z = 0;
	this.camera.position.y = 0;
	this.camera.position.x = -600;

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
	console.log(this.text);
	for ( var i = 0 ; i < 1 ; i++){
		var cuber = new peep({geo_not:g2,geo2_not:g1});
		//console.log(cuber.rt);
		//check out peep.js to see what this function does - 
		//(recurions, scale xyz, scale of each increment)
		cuber.set(12);
		
		/*
			leafJoint1:8,
			jScale1:new THREE.Vector3(1,10,1),
			leafDiv1:1,
		*/
		
		cuber.branchSquares({
			num:Math.floor(this.text.num),
			scale:new THREE.Vector3(5,10,5),
			ss:this.text.ss,
			leaves:Math.floor(this.text.leaves),
			divs:Math.floor(this.text.divs),
			rads:Math.floor(this.text.rads),

			angle2:1,
			term1:1,
			term2:0,
			term3:2,

			fruit:true,
			fruitScale:new THREE.Vector3(5,5,5)

		});
		
		for (var i = 0 ; i < cuber.pos.length ; i++){
			var mesh = new THREE.Mesh(g2,material);
			mesh.matrixAutoUpdate = true;	
			mesh.updateMatrix();	
			mesh.position.x = Math.random()*100;
			mesh.scale.y = 100;
			console.log(mesh);
			boxes.push(mesh);
			this.scene.add(mesh);
		
		}
		
		console.log("BOXES: ");
		console.log(boxes);
		
		console.log(cuber.pos.length + "  cuber pos length ");
		for(i in cuber.pos){
			console.log("POSER");
			
			//console.log(cuber.children[0].traverse());;
			console.log(cuber.rt[i].scale.x);
		}

		console.log(cuber);
		
		this.mesh = new THREE.Mesh( geometry, material );
		this.scene.add(cuber.pos_big);
		things.push(cuber);
	}
	
	//console.log("LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL");
	console.log(things);
	//console.log("here" + things[0].msh.length);
	
	for (i in things[0].msh){
	//console.log(i);
		//console.log("i: " + i);
		//console.log(things[0].pos[i].position);
	}
//	console.log(things[0].branches);
		//	things[0].pos[8].position.y = 6;
		//things[0].pos[7].position.y = 6;
		//console.log("fuck id up:   " +things[0].pos[7].id);
		//things[0].pos[8].rotation.x = 1;
	for(i in things[0].msh){
		//console.log(things[0].msh[i].position);
	}
		for(i in things[0].sc){
		//console.log(things[0].sc[i].position);
	}
		for(i in things[0].pos){
		//console.log("pos  "+i);
		//console.log(things[0].pos[i].position);
	}
	

			for(i in things[0].rt){
		//console.log(things[0].rt[i].position);
	}
	
	for(i in things[0].branches){
	//console.log("hi");
		if(things[0].branches[i].name==1){
						//console.log("ieeeeeeeee" + i);
						console.log(things[0].branches[i][0]);
						}
		}
	for (i in things[0].pos)
		//console.log(i + "  " + things[0].pos[i].name);
	
	for (var i = 0 ; i< things[0].pos.length; i++){
		if(things[0].pos[i].name == "pos_big0"){
	//		console.log(things[0].pos[i]);

			//things[0].pos[i].rotation.x = Math.random(Math.PI);
		}
	}
	
	console.log(things[0].rt);
	
	var thing=things[0];
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
	for(i in things[0].branches){
		console.log(things[0].branches[i][0]);
	}
	*/
	
}

sc1.prototype.moveThings = function(){

	for (var i = 0 ; i < boxes.length ; i++){
	
		boxes[i].position = things[0].pos[i].position;
		
		for (var i = 0 ; i < thing.pos.length; i++){
	
		this.scene.updateMatrixWorld();
		vector = new THREE.Vector3(Math.random()*100,Math.random()*100,Math.random()*100);
		vector.getPositionFromMatrix( thing.pos[i].matrixWorld );
		pointss.push(vector);
		
	}
		
	}

	for ( var j = 0 ; j <   things.length  ; j++){
	
		var thing = things[j];
		
		//console.log(thing);
		//thing array has two cubers, I'm just rotating the first one around for symmetry
		if(j==0){
			//thing.rt[0].rotation.x = Math.PI;
			//thing.children[0].position.y = -100;
		}
		
		thing.pos[0].position.y = -100;
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
		/*
		for ( i in thing.branches ){
		if(i>=0){
			for(j in thing.branches[i])
				if(j>=0){
				if(thing.branches[i].length-1){
					 //thing.branches[i][j].rotation.x = this.text.test;
				}
					if(thing.branches[i].name==1 && j<thing.branches[i].length-1){
						//thing.branches[i][j].rotation.x = this.text.test*(.3)*(thing.branches[i][1].idq/10);
						//thing.branches[i][j].rotation.x =(Math.sin((i/this.text.size)+num)*(i*this.text.x))+(Math.sin(this.text.x2)*(i/thing.rt.length))+(Math.sin(this.text.x1));
						thing.branches[i][0].children[0].scale.x = 2;//thing.branches[i][1].children[0].scale.x;
						thing.branches[i][0].children[0].scale.y = 5;//thing.branches[i][1].children[0].scale.y;
						thing.branches[i][0].children[0].scale.z = 2;//thing.branches[i][1].children[0].scale.z;
					
					}
					
					if(thing.branches[i].name==0 && j<thing.branches[i].length-1)
						thing.branches[i][j].rotation.x = (Math.sin((j/this.text.size)+num)*(j*this.text.x*5))+(Math.sin(this.text.x)*(j/thing.branches[i].length))+(Math.sin(this.text.x))+(Math.sin(j)*this.text.test);
					//if(thing.branches[i].name==1)
					//	thing.branches[i][j].rotation.x = (Math.sin((j/this.text.size)+num)) + this.text.test*(.8);
					if(thing.branches[i].name==1 && j<thing.branches[i].length-1){
					    thing.branches[i][j].rotation.x = (Math.sin((j/this.text.size*2+(thing.branches[i][1].idq*6))+num)*(j*this.text.x*15))+(Math.sin(this.text.x1)*(j/thing.branches[i].length))+(Math.sin(this.text.x1))+(Math.sin(j)*this.text.test);
						//thing.branches[i][j].rotation.x = this.text.x1*thing.branches[i][1].idq/10;
					//	thing.branches[i][j].rotation.y = this.text.y1 + Math.sin(num*thing.branches[i][1].idq);
					//	thing.branches[i][j].rotation.z = this.text.z1*thing.branches[i][1].idq;
						}
					if(thing.branches[i].name==5  && j<thing.branches[i].length-1){
						//thing.branches[i][j].rotation.x = (Math.sin((j/this.text.size+(thing.branches[i][1].idq))+num)*(j*this.text.x*15))+(Math.sin(this.text.x2)*(j/thing.branches[i].length))+(Math.sin(this.text.x2))+(Math.sin(j)*this.text.test);
						//thing.branches[i][j].rotation.x = this.text.x2*thing.branches[i][1].idq/10;
					//	thing.branches[i][j].rotation.y = this.text.y2*thing.branches[i][1].idq/10;
					//	thing.branches[i][j].rotation.z = this.text.z2*thing.branches[i][1].idq/10;
						}	
					//console.log(thing.branches[i][j]);
				}
			}
		
		}
		*/
		for ( i in thing.rt ) {
		//	thing.rt[i].useQuaternion = true;
			this.rotateAroundWorldAxis(thing.pos[i], new THREE.Vector3(1,1,0), 3);
			//thing.pos[i].rotation.x = 1;
		}
		
		//branches is a two dimensional array
		for ( i in thing.branches ){
			if(i>=0){
			
				for(j in thing.branches[i]){
					if(j>=0){
					
						for (var q = 0 ; q <= thing.leaves ; q++){
							if( thing.branches[i].name==q && j < thing.branches[i].length-1 ){
							
								var rot1 = new THREE.Vector3(this.text["x1-"+q],this.text["y1-"+q],this.text["z1-"+q]);
								var rot2 = new THREE.Vector3(this.text["x2-"+q],this.text["y2-"+q],this.text["z2-"+q]);
								
								var sinR = new THREE.Vector3(
									Math.sin(j*this.text["x3-"+q]*3),
									Math.sin(j*this.text["y3-"+q]*3),
									Math.sin(j*this.text["y3-"+q]*3)
								);
								
								var spine = new THREE.Vector3(
								this.text["x4-"+q]*thing.branches[i][1].idq*this.text["off-"+q],
								this.text["y4-"+q]*thing.branches[i][1].idq*this.text["off-"+q],
								this.text["z4-"+q]*thing.branches[i][1].idq*this.text["off-"+q]
								);
								
								var scalar = new THREE.Vector3(this.text["sc-"+q],this.text["sc-"+q],this.text["sc-"+q]);
								
								var motion = new THREE.Vector3(
									(Math.sin(((j+1)/this.text.size)+num)*((j+1)*this.text.x))*(i+1)*(this.text["x3-"+q]/(i+1)),
									(Math.sin(((j+1)/this.text.size)+num)*((j+1)*this.text.y))*(i+1)*(this.text["x3-"+q]/(i+1)),
									(Math.sin(((j+1)/this.text.size)+num)*((j+1)*this.text.z))*(i+1)*(this.text["x3-"+q]/(i+1))
								);
								
								thing.branches[i][j].rotation = spine.add(rot1.add(motion));
								thing.branches[i][0].rotation = rot2;
								thing.branches[i][j].scale = scalar;
							
							}
						}
					}
				}
			}
		//*(thing.branches[i][0].idq);
		
		}
		
		num-=i*this.text.speed*this.text.speed2;
	}	
}

sc1.prototype.animate = function(){

	console.log(rebuild);
	if(rebuild){
		console.log("ITS SO TRUE");
		console.log(things);
		things = [];
		killEverything(scene);
		this.addGeo();
			console.log(things);
		rebuild = false;
	}
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

sc1.prototype.rotateAroundWorldAxis=function(object, axis, radians) {
    rotWorldMatrix = new THREE.Matrix4();

    rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);
    rotWorldMatrix.multiply(object.matrix);        // pre-multiply
    object.matrix = rotWorldMatrix;
    object.rotation.setEulerFromRotationMatrix(object.matrix, object.scale);
}


