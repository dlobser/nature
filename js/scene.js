

function sc1(){

	var container,
	camera, 
	controls, 
	scene;		
	this.things = [];
	var that = this;
	
}

sc1.prototype = {

	init:function() {
	
		this.camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
		this.camera.position.z = 500;

		this.controls = new THREE.OrbitControls( this.camera );
		this.controls.addEventListener( 'change', this.render );

		this.scene = new THREE.Scene();
		this.scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );

		this.addGeo();

		var light = new THREE.DirectionalLight( 0xffffff );
		light.position.set( 1, 1, 1 );
		this.scene.add( light );

		light = new THREE.DirectionalLight( 0x002288 );
		light.position.set( -1, -1, -1 );
		this.scene.add( light );

		light = new THREE.AmbientLight( 0x222222 );
		this.scene.add( light );

		this.renderer = new THREE.CanvasRenderer( { antialias: false } );
		//this.renderer.setClearColor( scene.fog.color, 1 );
		this.renderer.setSize( window.innerWidth, window.innerHeight );
		

		this.container = document.getElementById( 'container' );
		this.container.appendChild( this.renderer.domElement );

		//window.addEventListener( 'resize', onWindowResize, false );

		
	},

	addGeo:function(){

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
				
			this.scene.add( mesh );
			this.things.push(mesh);

		}
		
	},
	
	moveThings:function(){
			
		this.go = false;
		
		//if
	
	
		for ( var i = 1, il = this.things.length; i < il; i ++ ) {
			var thing = this.things[i];
			thing.position.add(thing.velocity);
			thing.velocity.add(thing.acceleration);
			
			var count = 0;//things.length;
			
			for ( var j = 0; j < this.things.length ; j ++ ) {
			
				
			
				if ( j==i && j< this.things.length-1){
					j++;	
				}
				
				if (i==this.things.length-1 && j==this.things.length-1){
				//	return;
				}
				
				var other = this.things[j];
				
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
				
				if(count >= this.things.length-1){
					thing.acceleration = zeroVec;
					thing.velocity.multiplyScalar(0);
					thing.done = true;
				}
			
			}
				
			
			
		}
		
		
	},
	
	animate:function(){

		this.render();
		this.moveThings();
		var that = this;
		requestAnimationFrame( function() { that.animate(); });
		this.controls.update();
		
	},

	render:function() {
	var that = this;
		this.renderer.render( that.scene, that.camera );

	}
	
}
