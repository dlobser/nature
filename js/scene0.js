

sc1 = function(){

	var container,
	camera, 
	controls, 
	scene, 
	renderer;		
	var things = [];
	var that = this;

	this.init = function() {

		that.camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
		that.camera.position.z = 500;

		controls = new THREE.OrbitControls( camera );
		controls.addEventListener( 'change', render );

		scene = new THREE.Scene();
		scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );

		addGeo();

		light = new THREE.DirectionalLight( 0xffffff );
		light.position.set( 1, 1, 1 );
		scene.add( light );

		light = new THREE.DirectionalLight( 0x002288 );
		light.position.set( -1, -1, -1 );
		scene.add( light );

		light = new THREE.AmbientLight( 0x222222 );
		scene.add( light );

		renderer = new THREE.CanvasRenderer( { antialias: false } );
		renderer.setClearColor( scene.fog.color, 1 );
		renderer.setSize( window.innerWidth, window.innerHeight );
		

		container = document.getElementById( 'container' );
		container.appendChild( renderer.domElement );

		window.addEventListener( 'resize', onWindowResize, false );

	}

	this.addGeo = function(){
	
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
		
	}


	this.animate = function() {
	
		render();
		moveThings();
		requestAnimationFrame( animate );
		controls.update();
		
	}


	this.render = function() {
	
		renderer.render( scene, camera );
	}
	
}
