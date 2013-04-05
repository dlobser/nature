
		
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

				camera = new THREE.PerspectiveCamera( 20, window.innerWidth / window.innerHeight, 200, 10000 );
				camera.position.z = 500;
				camera.position.y = 200;

				controls = new THREE.OrbitControls( camera );
				controls.addEventListener( 'change', render );

				scene = new THREE.Scene();
				scene.fog = new THREE.FogExp2( 0x000000, 0.002 );

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
			
			
			
			function addGeo(){
				var geometry = new THREE.PlaneGeometry( 400, 250, 1,1 );
				var human = new THREE.Object3D();
			
				for ( var i = 1; i < 309; i++ ) {
				
					
					var numName = i + "";
					
					if (i < 10){
						numName="0000"+i;
					}
					if (i>=10 && i < 100){
						numName="000"+i;
					}
					if (i>=100 && i < 1000){
						numName="00"+i;
					}
					
					var empty = new THREE.Object3D();
					
				
					var textString = "C:/projects/ITP/human/sequence/fullBody3_" + numName + ".png";
					var floorTexture = new THREE.ImageUtils.loadTexture( textString );
					var material =  new THREE.MeshLambertMaterial( { color:0xffffff, shading: THREE.FlatShading, map:floorTexture,transparent: true, opacity: 0.2,side:THREE.DoubleSide } );
					
					var mesh = new THREE.Mesh( geometry, material );
					mesh.doubleSided = true;
					var pos = new THREE.Vector3( 200,0,0);
					var zeroVec = new THREE.Vector3(0,0,0);
					
					
	
					mesh.position = pos;
					mesh.velocity = zeroVec;
					mesh.acceleration = zeroVec;
					
					mesh.updateMatrix();
					mesh.matrixAutoUpdate = true;
					
					empty.add(mesh);
					
					empty.rotation.y = i/60;
					
					human.add( empty);
					
					things.push(mesh);
					
					pos.z = i*-1;
					
				}
				scene.add( human );
				//things.others = things;
				human.rotation.x = Math.PI/-2;
				var scalar = new THREE.Vector3(.15,.15,.09);
				human.position.y = 0;
				human.scale = scalar;
				
			}

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight-100);

			

			}

			function animate() {
			//moveThings();
				render();
				
				
				moveThings();
				//Mover();
				requestAnimationFrame( animate );
				controls.update();
				
			}
			
			function moveThings(){
			
				this.go = false;
				
				//if
				//scene.children[0].rotation.z = Math.sin(q);
			
				for ( var i = 1, il = things.length; i < il; i ++ ) {
					
					thing = things[i];
					thing.rotation.z = Math.sin(q+i/100)*2;
					
					
				}
				q+=.1;
						
					
					
				
				
				
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

