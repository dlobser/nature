
		
			//dat.gui adds controls----------------------------
		
	
			
			//dat.gui adds controls----------------------------
			

			if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

			var container, stats;
			var camera, controls, scene, renderer;
			var cross;			
			var things = [];
			var q= 0;
			init();
			animate();

			function init() {

				camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
				camera.position.z = 500;

				controls = new THREE.OrbitControls( camera );
				controls.addEventListener( 'change', render );

				scene = new THREE.Scene();
				scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );

				// world

				addGeo();


				// lights

				light = new THREE.DirectionalLight( 0xffffff );
				light.position.set( 1, 1, 1 );
				scene.add( light );

				light = new THREE.DirectionalLight( 0x002288 );
				light.position.set( -1, -1, -1 );
				scene.add( light );

				light = new THREE.AmbientLight( 0x222222 );
				scene.add( light );


				// renderer

				renderer = new THREE.CanvasRenderer( { antialias: false } );
				renderer.setClearColor( scene.fog.color, 1 );
				renderer.setSize( window.innerWidth, window.innerHeight );
				
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
			
			function addGeo(){
				var geometry = new THREE.PlaneGeometry( 400, 400, 2,2 );
				
			
				for ( var i = 0; i < 25; i ++ ) {
				
					
					var numName = i + "";
					
					if (i < 10){
						numName="0"+i;
					}
					
					var textString = "textures/garlic/garlic_00" + i + ".jpg";
					var floorTexture = new THREE.ImageUtils.loadTexture( textString );
					var material =  new THREE.MeshLambertMaterial( { color:0xffffff, shading: THREE.FlatShading, map:floorTexture,transparent: true, opacity: 0.2 } );
					
					var mesh = new THREE.Mesh( geometry, material );
					var pos = new THREE.Vector3( 0,0,0);
					var zeroVec = new THREE.Vector3(0,0,0);
	
					mesh.position = pos;
					mesh.velocity = zeroVec;
					mesh.acceleration = zeroVec;
					
					mesh.updateMatrix();
					mesh.matrixAutoUpdate = true;
						
					scene.add( mesh );
					things.push(mesh);
					pos.z = i*6;
					
				}
				
				//things.others = things;
			}

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight-100);

			

			}

			function animate() {
				render();
				
				
				//moveThings();
				//Mover();
				requestAnimationFrame( animate );
				controls.update();
				
			}
			
			function moveThings(){
			
				this.go = false;
				
				//if
			
			
				for ( var i = 1, il = things.length; i < il; i ++ ) {
					
					thing = things[i];
					thing.rotation.z = i*q;
					
					
				}
				q+=.001;
						
					
					
				
				
				
			}
			
			

			function render() {
				//moveThings();
				renderer.render( scene, camera );
				//stats.update();
				

			}
			
			function Mover(){
				//set up
				this.location = new THREE.Vector3(0,0,0);
				this.velocity = new THREE.Vector3(0,0,0);
				this.acceleration = new THREE.Vector3(0.01,0.01,0.01);
				
				
				//console.log(this.velocity);
				this.step = function(){
					this.velocity.addSelf(this.acceleration);
					this.location.addSelf(this.velocity);
					this.mesh.position = this.location;
					//this.mesh1.position = this.location;
					checkBounds(this);
					limit(this.velocity ,10);
					this.acceleration = new THREE.Vector3((Math.random()-0.5)/100,(Math.random()-0.5)/100,(Math.random()-0.5)/100);
			};
		}

