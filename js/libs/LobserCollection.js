var fromPrototype = function(prototype, object) {
  var newObject = Object.create(prototype);
 
  for (var prop in object) {
    if (object.hasOwnProperty(prop)) {
      newObject[prop] = object[prop];      
    }
  }
 
  return newObject;
};

function makeLimbGeo(things,width){

	var material =  new THREE.MeshLambertMaterial( { color:0xffffff, shading: THREE.FlatShading } );
	var geo = new THREE.Geometry();
	var tree = new THREE.Object3D();
	
	//thisScene.updateMatrixWorld();
	
	
	for ( var j = 0; j < things.branches.length ; j ++ ) {
	
		if(things.branches[j].length > 3){

			//var newSize = map_range(j,0,things.length,30,1);
			//var sized = Math.max(newSize,1);
			//var size = limb[j].scalar;

			for ( var i = 1 ; i < things.branches[j].length-1 ; i++ ){
			
				var thisVert = new THREE.Vector3(0,0,0);
				var nextVert = new THREE.Vector3(0,0,0);
				
				things.branches[j][i].children[1].updateMatrixWorld();
				
				console.log(things.branches[j][i]);
			
				thisVert.getPositionFromMatrix(things.branches[j][i].children[1].matrixWorld);
				nextVert.getPositionFromMatrix(things.branches[j][i-1].children[1].matrixWorld);
				
				var dist = thisVert.distanceTo(nextVert);
					
				var geometry = new THREE.SphereGeometry2( 3, 6, 5, 0, Math.PI*2, 0, Math.PI, dist,width,width);
				
				//from Garner: rotates the link 90 degrees so that later on the aim will work properly - a hack?  Perhaps - Is there a better way? Perhaps
				geometry.applyMatrix( new THREE.Matrix4().setRotationFromEuler(new THREE.Vector3(Math.PI/2, 0, 0), 'XYZ'));
				
			//	if(size > text.minBranch)
				//	size *= text.shrink;
				
				var mesh = new THREE.Mesh( geometry, material );
				
				mesh.updateMatrix();
				mesh.matrixAutoUpdate = true;
				
				mesh.rotation.x = Math.PI/2;

				mesh.position = thisVert;
				mesh.lookAt(nextVert);
	
				mesh.geometry.mergeVertices();
				THREE.GeometryUtils.merge(geo, mesh);
				
			}
		}	
	}
	mesh = new THREE.Mesh( geo,material );

	tree.add(mesh);
	

	
	return tree;
	//scene.add( tree );
	
	
}

function map_range(value, low1, high1, low2, high2) {
	return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

//object, normalized direction vector, rotation in radians
function align(target, dir, rot) {
    //Three.js uses a Y up coordinate system, so the cube inits with this vector
    var up = new THREE.Vector3(0, 1, 0);

    //euler angle between direction vector and up vector
    var angle = Math.acos(up.dot(dir));

    //cross product of the up vector and direction vector
    var axis = new THREE.Vector3();
    axis.crossVectors(up, dir);
    axis.normalize();

    //rotation to aligns the target with the direction vector
    var rotate = THREE.Matrix4.rotationAxisAngleMatrix(axis, angle);

    //rotation around direction vector
    var revolve = THREE.Matrix4.rotationAxisAngleMatrix(dir, rot);

    //compose the rotations (order matters, can be done other ways)
    revolve.multiplySelf(rotate);

    //assign matrix (autoUpdateMatrix = false)
    target.matrix = revolve;
}

function randly(off,mult){

	var offs = off || -.5;
	var mults = mult || 1;

	return((Math.random()+offs)*mults);

}

function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}

function killEverything(scene){
	//console.log(scene.scene.children);
	var l = scene.scene.children.length;

	//remove everything
	while (l--) {
		
		if(scene.scene.children[l] instanceof THREE.Camera) continue; //leave camera in the scene
		
		if(scene.scene.children[l] instanceof THREE.Light) continue;
		
		if(scene.scene.children[l] instanceof THREE.Object3D){
			scene.scene.remove(scene.scene.children[l]);

	}
}
}	

THREE.saveGeometryToObj = function (geo,nums) {

geo.updateMatrixWorld();

var num = parseInt(nums);

var s = '';
for (i = 0; i < geo.geometry.vertices.length; i++) {

	var vector = new THREE.Vector3( geo.geometry.vertices[i].x, geo.geometry.vertices[i].y, geo.geometry.vertices[i].z );
	geo.matrixWorld.multiplyVector3( vector );
	
	//vector.applyProjection( matrix )
	
    s+= 'v '+(vector.x) + ' ' +
    vector.y + ' '+
    vector.z + '</br>';
}

for (i = 0; i < geo.geometry.faces.length; i++) {

    s+= 'f '+ (geo.geometry.faces[i].a+1+num) + ' ' +
    (geo.geometry.faces[i].b+1+num) + ' '+
    (geo.geometry.faces[i].c+1+num);

    if (geo.geometry.faces[i].d!==undefined) {
        s+= ' '+ (geo.geometry.faces[i].d+1+num);
    }
    s+= '</br>';
}

return s;
}

//var rotWorldMatrix;

function debug(stringer,bool){

	byul = bool || true;

	if(byul){
		console.log(stringer);
	}

}

function rotateAroundWorldAxis(object, axis, radians) {
    rotWorldMatrix = new THREE.Matrix4();
    rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);
    rotWorldMatrix.multiply(object.matrix);        // pre-multiply
    object.matrix = rotWorldMatrix;
    object.rotation.setEulerFromRotationMatrix(object.matrix, object.scale);
}

function parameters2(params,defaults){

	this.params = params;
	this.defaults = defaults;
	this.all = $.extend(this.defaults,this.params);	
	
	this.getter = function(string){
	/*
		if (this.params.hasOwnProperty(string){
			return this.params[string]
		}else{
			return this.defaults[string]
		}
		*/
	}
	
}

THREE.saveGeometryToObj4 = function (geo,nums,scalar) {

	geo.updateMatrixWorld();

	var num = parseInt(nums);

	var s = '';
	for (i = 0; i < geo.geometry.vertices.length; i++) {

		var vector = new THREE.Vector3( geo.geometry.vertices[i].x, geo.geometry.vertices[i].y, geo.geometry.vertices[i].z );
		
		geo.matrixWorld.multiplyVector3( vector );
		vector.multiplyScalar(scalar);
		//vector.applyProjection( matrix )
		
		s+= 'v '+(vector.x) + ' ' +
		vector.y + ' '+
		vector.z + '\n';
	}

	for (i = 0; i < geo.geometry.faces.length; i++) {

		s+= 'f '+ (geo.geometry.faces[i].a+1+num) + ' ' +
		(geo.geometry.faces[i].b+1+num) + ' '+
		(geo.geometry.faces[i].c+1+num);

		if (geo.geometry.faces[i].d!==undefined) {
			s+= ' '+ (geo.geometry.faces[i].d+1+num);
		}
		s+= '\n';
	}

	return s;
}

THREE.saveGeometryToObj3 = function (geo,nums) {

	geo.updateMatrixWorld();

	var num = parseInt(nums);

	var s = '';
	for (i = 0; i < geo.geometry.vertices.length; i++) {

		var vector = new THREE.Vector3( geo.geometry.vertices[i].x, geo.geometry.vertices[i].y, geo.geometry.vertices[i].z );
		//vector.multiplyScalar(.0001);
		geo.matrixWorld.multiplyVector3( vector );
		
		//vector.applyProjection( matrix )
		
		s+= 'v '+(vector.x) + ' ' +
		vector.y + ' '+
		vector.z + '\n';
	}

	for (i = 0; i < geo.geometry.faces.length; i++) {

		s+= 'f '+ (geo.geometry.faces[i].a+1+num) + ' ' +
		(geo.geometry.faces[i].b+1+num) + ' '+
		(geo.geometry.faces[i].c+1+num);

		if (geo.geometry.faces[i].d!==undefined) {
			s+= ' '+ (geo.geometry.faces[i].d+1+num);
		}
		s+= '\n';
	}

	return s;
}


THREE.saveGeometryToObj2 = function (geo,nums) {

	geo.updateMatrixWorld();

	var num = parseInt(nums);

	var s = '';
	for (i = 0; i < geo.geometry.vertices.length; i++) {

		var vector = new THREE.Vector3( geo.geometry.vertices[i].x, geo.geometry.vertices[i].y, geo.geometry.vertices[i].z );
		vector.multiplyScalar(.0001);
		geo.matrixWorld.multiplyVector3( vector );
		
		//vector.applyProjection( matrix )
		
		s+= 'v '+(vector.x) + ' ' +
		vector.y + ' '+
		vector.z + '\n';
	}

	for (i = 0; i < geo.geometry.faces.length; i++) {

		s+= 'f '+ (geo.geometry.faces[i].a+1+num) + ' ' +
		(geo.geometry.faces[i].b+1+num) + ' '+
		(geo.geometry.faces[i].c+1+num);

		if (geo.geometry.faces[i].d!==undefined) {
			s+= ' '+ (geo.geometry.faces[i].d+1+num);
		}
		s+= '\n';
	}

	return s;
}

THREE.SphereGeometry3 = function ( radius, widthSegments, heightSegments, height, topScale, botScale ) {

	THREE.Geometry.call( this );

	this.radius = radius || 50;
	
	this.topVerts = [];
	this.botVerts = [];

	this.widthSegments = Math.max( 3, Math.floor( widthSegments ) || 8 );
	this.heightSegments = Math.max( 2, Math.floor( heightSegments ) || 6 );

	/*
	phiStart = phiStart !== undefined ? phiStart : 0;
	phiLength = phiLength !== undefined ? phiLength : Math.PI * 2;

	thetaStart = thetaStart !== undefined ? thetaStart : 0;
	thetaLength = thetaLength !== undefined ? thetaLength : Math.PI;
	*/
	
	phiStart = 0;
	phiLength =  Math.PI * 2;

	thetaStart = 0;
	thetaLength =  Math.PI;

	var x, y, vertices = [], uvs = [];

	for ( y = 0; y <= this.heightSegments; y ++ ) {

		var verticesRow = [];
		var uvsRow = [];

		for ( x = 0; x <= this.widthSegments; x ++ ) {

			var u = x / this.widthSegments;
			var v = y / this.heightSegments;
			
			var scalar;
			
			if (y >(this.heightSegments)/2){
				scalar = topScale;
			}
			else{
				scalar = botScale;
			}

			var vertex = new THREE.Vector3();
			vertex.x = - this.radius * Math.cos( phiStart + u * phiLength ) * Math.sin( thetaStart + v * thetaLength )*scalar;
			vertex.y = this.radius * Math.cos( thetaStart + v * thetaLength )*scalar;
			vertex.z = this.radius * Math.sin( phiStart + u * phiLength ) * Math.sin( thetaStart + v * thetaLength )*scalar;
			
			if (y <= (this.heightSegments)/2){
				vertex.y += height;
			}
			
			if (y >(this.heightSegments)/2){
				this.topVerts.push(vertex);
			}
			else{
				this.botVerts.push(vertex);
			}

			this.vertices.push( vertex );

			verticesRow.push( this.vertices.length - 1 );
			uvsRow.push( new THREE.Vector2( u, 1 - v ) );

		}

		vertices.push( verticesRow );
		uvs.push( uvsRow );

	}

	for ( y = 0; y < this.heightSegments; y ++ ) {

		for ( x = 0; x < this.widthSegments; x ++ ) {

			var v1 = vertices[ y ][ x + 1 ];
			var v2 = vertices[ y ][ x ];
			var v3 = vertices[ y + 1 ][ x ];
			var v4 = vertices[ y + 1 ][ x + 1 ];

			var n1 = this.vertices[ v1 ].clone().normalize();
			var n2 = this.vertices[ v2 ].clone().normalize();
			var n3 = this.vertices[ v3 ].clone().normalize();
			var n4 = this.vertices[ v4 ].clone().normalize();

			var uv1 = uvs[ y ][ x + 1 ].clone();
			var uv2 = uvs[ y ][ x ].clone();
			var uv3 = uvs[ y + 1 ][ x ].clone();
			var uv4 = uvs[ y + 1 ][ x + 1 ].clone();

			if ( Math.abs( this.vertices[ v1 ].y ) === this.radius ) {

				this.faces.push( new THREE.Face3( v1, v3, v4, [ n1, n3, n4 ] ) );
				this.faceVertexUvs[ 0 ].push( [ uv1, uv3, uv4 ] );

			} else if ( Math.abs( this.vertices[ v3 ].y ) === this.radius ) {

				this.faces.push( new THREE.Face3( v1, v2, v3, [ n1, n2, n3 ] ) );
				this.faceVertexUvs[ 0 ].push( [ uv1, uv2, uv3 ] );

			} else {

				this.faces.push( new THREE.Face4( v1, v2, v3, v4, [ n1, n2, n3, n4 ] ) );
				this.faceVertexUvs[ 0 ].push( [ uv1, uv2, uv3, uv4 ] );

			}

		}

	}

	this.computeCentroids();
	this.computeFaceNormals();

    this.boundingSphere = new THREE.Sphere( new THREE.Vector3(), radius );

};

THREE.SphereGeometry3.prototype = Object.create( THREE.Geometry.prototype );


THREE.SphereGeometry2 = function ( radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength, height, topScale, botScale ) {

	THREE.Geometry.call( this );

	this.radius = radius || 50;

	this.widthSegments = Math.max( 3, Math.floor( widthSegments ) || 8 );
	this.heightSegments = Math.max( 2, Math.floor( heightSegments ) || 6 );

	phiStart = phiStart !== undefined ? phiStart : 0;
	phiLength = phiLength !== undefined ? phiLength : Math.PI * 2;

	thetaStart = thetaStart !== undefined ? thetaStart : 0;
	thetaLength = thetaLength !== undefined ? thetaLength : Math.PI;

	var x, y, vertices = [], uvs = [];

	for ( y = 0; y <= this.heightSegments; y ++ ) {

		var verticesRow = [];
		var uvsRow = [];

		for ( x = 0; x <= this.widthSegments; x ++ ) {

			var u = x / this.widthSegments;
			var v = y / this.heightSegments;
			
			var scalar;
			
			if (y >(this.heightSegments)/2){
				scalar = topScale;
			}
			else{
				scalar = botScale;
			}

			var vertex = new THREE.Vector3();
			vertex.x = - this.radius * Math.cos( phiStart + u * phiLength ) * Math.sin( thetaStart + v * thetaLength )*scalar;
			vertex.y = this.radius * Math.cos( thetaStart + v * thetaLength )*scalar;
			vertex.z = this.radius * Math.sin( phiStart + u * phiLength ) * Math.sin( thetaStart + v * thetaLength )*scalar;
			
			if (y <= (this.heightSegments)/2){
				vertex.y += height;
			}

			this.vertices.push( vertex );

			verticesRow.push( this.vertices.length - 1 );
			uvsRow.push( new THREE.Vector2( u, 1 - v ) );

		}

		vertices.push( verticesRow );
		uvs.push( uvsRow );

	}

	for ( y = 0; y < this.heightSegments; y ++ ) {

		for ( x = 0; x < this.widthSegments; x ++ ) {

			var v1 = vertices[ y ][ x + 1 ];
			var v2 = vertices[ y ][ x ];
			var v3 = vertices[ y + 1 ][ x ];
			var v4 = vertices[ y + 1 ][ x + 1 ];

			var n1 = this.vertices[ v1 ].clone().normalize();
			var n2 = this.vertices[ v2 ].clone().normalize();
			var n3 = this.vertices[ v3 ].clone().normalize();
			var n4 = this.vertices[ v4 ].clone().normalize();

			var uv1 = uvs[ y ][ x + 1 ].clone();
			var uv2 = uvs[ y ][ x ].clone();
			var uv3 = uvs[ y + 1 ][ x ].clone();
			var uv4 = uvs[ y + 1 ][ x + 1 ].clone();

			if ( Math.abs( this.vertices[ v1 ].y ) === this.radius ) {

				this.faces.push( new THREE.Face3( v1, v3, v4, [ n1, n3, n4 ] ) );
				this.faceVertexUvs[ 0 ].push( [ uv1, uv3, uv4 ] );

			} else if ( Math.abs( this.vertices[ v3 ].y ) === this.radius ) {

				this.faces.push( new THREE.Face3( v1, v2, v3, [ n1, n2, n3 ] ) );
				this.faceVertexUvs[ 0 ].push( [ uv1, uv2, uv3 ] );

			} else {

				this.faces.push( new THREE.Face4( v1, v2, v3, v4, [ n1, n2, n3, n4 ] ) );
				this.faceVertexUvs[ 0 ].push( [ uv1, uv2, uv3, uv4 ] );

			}

		}

	}

	this.computeCentroids();
	this.computeFaceNormals();

    this.boundingSphere = new THREE.Sphere( new THREE.Vector3(), radius );

};

THREE.SphereGeometry2.prototype = Object.create( THREE.Geometry.prototype );



/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.OBJLoader = function () {

	THREE.EventDispatcher.call( this );

};

THREE.OBJLoader.prototype = {

	constructor: THREE.OBJLoader,

	load: function ( url, callback ) {

		var scope = this;
		var request = new XMLHttpRequest();

		request.addEventListener( 'load', function ( event ) {

			var hierarchy = scope.parse( event.target.responseText );

			scope.dispatchEvent( { type: 'load', content: hierarchy } );

			if ( callback ) callback( hierarchy );

		}, false );

		request.addEventListener( 'progress', function ( event ) {

			scope.dispatchEvent( { type: 'progress', loaded: event.loaded, total: event.total } );

		}, false );

		request.addEventListener( 'error', function () {

			scope.dispatchEvent( { type: 'error', message: 'Couldn\'t load URL [' + url + ']' } );

		}, false );

		request.open( 'GET', url, true );
		request.send( null );

	},

	parse: function ( data ) {

		// fixes

		data = data.replace( /\ \\\r\n/g, '' ); // rhino adds ' \\r\n' some times.

		//

		function vector( x, y, z ) {

			return new THREE.Vector3( x, y, z );

		}

		function uv( u, v ) {

			return new THREE.Vector2( u, v );

		}

		function face3( a, b, c, normals ) {

			return new THREE.Face3( a, b, c, normals );

		}

		function face4( a, b, c, d, normals ) {

			return new THREE.Face4( a, b, c, d, normals );

		}

		function meshN( meshName, materialName ) {

			if ( geometry.vertices.length > 0 ) {

				geometry.mergeVertices();
				geometry.computeCentroids();
				geometry.computeFaceNormals();
				geometry.computeBoundingSphere();

				object.add( mesh );

				geometry = new THREE.Geometry();
				mesh = new THREE.Mesh( geometry, material );

				verticesCount = 0;

			}

			if ( meshName !== undefined ) mesh.name = meshName;
			if ( materialName !== undefined ) {

				material = new THREE.MeshLambertMaterial();
				material.name = materialName;

				mesh.material = material;

			}

		}

		var group = new THREE.Object3D();
		var object = group;

		var geometry = new THREE.Geometry();
		var material = new THREE.MeshLambertMaterial();
		var mesh = new THREE.Mesh( geometry, material );

		var vertices = [];
		var verticesCount = 0;
		var normals = [];
		var uvs = [];

		// v float float float

		var vertex_pattern = /v( +[\d|\.|\+|\-|e]+)( [\d|\.|\+|\-|e]+)( [\d|\.|\+|\-|e]+)/;

		// vn float float float

		var normal_pattern = /vn( +[\d|\.|\+|\-|e]+)( [\d|\.|\+|\-|e]+)( [\d|\.|\+|\-|e]+)/;

		// vt float float

		var uv_pattern = /vt( +[\d|\.|\+|\-|e]+)( [\d|\.|\+|\-|e]+)/;

		// f vertex vertex vertex ...

		var face_pattern1 = /f( +[\d]+)( [\d]+)( [\d]+)( [\d]+)?/;

		// f vertex/uv vertex/uv vertex/uv ...

		var face_pattern2 = /f( +([\d]+)\/([\d]+))( ([\d]+)\/([\d]+))( ([\d]+)\/([\d]+))( ([\d]+)\/([\d]+))?/;

		// f vertex/uv/normal vertex/uv/normal vertex/uv/normal ...

		var face_pattern3 = /f( +([\d]+)\/([\d]+)\/([\d]+))( ([\d]+)\/([\d]+)\/([\d]+))( ([\d]+)\/([\d]+)\/([\d]+))( ([\d]+)\/([\d]+)\/([\d]+))?/;

		// f vertex//normal vertex//normal vertex//normal ...

		var face_pattern4 = /f( +([\d]+)\/\/([\d]+))( ([\d]+)\/\/([\d]+))( ([\d]+)\/\/([\d]+))( ([\d]+)\/\/([\d]+))?/;

		//

		var lines = data.split( "\n" );

		for ( var i = 0; i < lines.length; i ++ ) {

			var line = lines[ i ];
			line = line.trim();

			var result;

			if ( line.length === 0 || line.charAt( 0 ) === '#' ) {

				continue;

			} else if ( ( result = vertex_pattern.exec( line ) ) !== null ) {

				// ["v 1.0 2.0 3.0", "1.0", "2.0", "3.0"]

				vertices.push( vector(
					parseFloat( result[ 1 ] ),
					parseFloat( result[ 2 ] ),
					parseFloat( result[ 3 ] )
				) );

			} else if ( ( result = normal_pattern.exec( line ) ) !== null ) {

				// ["vn 1.0 2.0 3.0", "1.0", "2.0", "3.0"]

				normals.push( vector(
					parseFloat( result[ 1 ] ),
					parseFloat( result[ 2 ] ),
					parseFloat( result[ 3 ] )
				) );

			} else if ( ( result = uv_pattern.exec( line ) ) !== null ) {

				// ["vt 0.1 0.2", "0.1", "0.2"]

				uvs.push( uv(
					parseFloat( result[ 1 ] ),
					parseFloat( result[ 2 ] )
				) );

			} else if ( ( result = face_pattern1.exec( line ) ) !== null ) {

				// ["f 1 2 3", "1", "2", "3", undefined]

				if ( result[ 4 ] === undefined ) {

					geometry.vertices.push(
						vertices[ parseInt( result[ 1 ] ) - 1 ],
						vertices[ parseInt( result[ 2 ] ) - 1 ],
						vertices[ parseInt( result[ 3 ] ) - 1 ]
					);

					geometry.faces.push( face3(
						verticesCount ++,
						verticesCount ++,
						verticesCount ++
					) );

				} else {

					geometry.vertices.push(
						vertices[ parseInt( result[ 1 ] ) - 1 ],
						vertices[ parseInt( result[ 2 ] ) - 1 ],
						vertices[ parseInt( result[ 3 ] ) - 1 ],
						vertices[ parseInt( result[ 4 ] ) - 1 ]
					);

					geometry.faces.push( face4(
						verticesCount ++,
						verticesCount ++,
						verticesCount ++,
						verticesCount ++
					) );

				}

			} else if ( ( result = face_pattern2.exec( line ) ) !== null ) {

				// ["f 1/1 2/2 3/3", " 1/1", "1", "1", " 2/2", "2", "2", " 3/3", "3", "3", undefined, undefined, undefined]

				if ( result[ 10 ] === undefined ) {

					geometry.vertices.push(
						vertices[ parseInt( result[ 2 ] ) - 1 ],
						vertices[ parseInt( result[ 5 ] ) - 1 ],
						vertices[ parseInt( result[ 8 ] ) - 1 ]
					);

					geometry.faces.push( face3(
						verticesCount ++,
						verticesCount ++,
						verticesCount ++
					) );

					geometry.faceVertexUvs[ 0 ].push( [
						uvs[ parseInt( result[ 3 ] ) - 1 ],
						uvs[ parseInt( result[ 6 ] ) - 1 ],
						uvs[ parseInt( result[ 9 ] ) - 1 ]
					] );

				} else {

					geometry.vertices.push(
						vertices[ parseInt( result[ 2 ] ) - 1 ],
						vertices[ parseInt( result[ 5 ] ) - 1 ],
						vertices[ parseInt( result[ 8 ] ) - 1 ],
						vertices[ parseInt( result[ 11 ] ) - 1 ]
					);

					geometry.faces.push( face4(
						verticesCount ++,
						verticesCount ++,
						verticesCount ++,
						verticesCount ++
					) );

					geometry.faceVertexUvs[ 0 ].push( [
						uvs[ parseInt( result[ 3 ] ) - 1 ],
						uvs[ parseInt( result[ 6 ] ) - 1 ],
						uvs[ parseInt( result[ 9 ] ) - 1 ],
						uvs[ parseInt( result[ 12 ] ) - 1 ]
					] );

				}

			} else if ( ( result = face_pattern3.exec( line ) ) !== null ) {

				// ["f 1/1/1 2/2/2 3/3/3", " 1/1/1", "1", "1", "1", " 2/2/2", "2", "2", "2", " 3/3/3", "3", "3", "3", undefined, undefined, undefined, undefined]

				if ( result[ 13 ] === undefined ) {

					geometry.vertices.push(
						vertices[ parseInt( result[ 2 ] ) - 1 ],
						vertices[ parseInt( result[ 6 ] ) - 1 ],
						vertices[ parseInt( result[ 10 ] ) - 1 ]
					);

					geometry.faces.push( face3(
						verticesCount ++,
						verticesCount ++,
						verticesCount ++,
						[
							normals[ parseInt( result[ 4 ] ) - 1 ],
							normals[ parseInt( result[ 8 ] ) - 1 ],
							normals[ parseInt( result[ 12 ] ) - 1 ]
						]
					) );

					geometry.faceVertexUvs[ 0 ].push( [
						uvs[ parseInt( result[ 3 ] ) - 1 ],
						uvs[ parseInt( result[ 7 ] ) - 1 ],
						uvs[ parseInt( result[ 11 ] ) - 1 ]
					] );

				} else {

					geometry.vertices.push(
						vertices[ parseInt( result[ 2 ] ) - 1 ],
						vertices[ parseInt( result[ 6 ] ) - 1 ],
						vertices[ parseInt( result[ 10 ] ) - 1 ],
						vertices[ parseInt( result[ 14 ] ) - 1 ]
					);

					geometry.faces.push( face4(
						verticesCount ++,
						verticesCount ++,
						verticesCount ++,
						verticesCount ++,
						[
							normals[ parseInt( result[ 4 ] ) - 1 ],
							normals[ parseInt( result[ 8 ] ) - 1 ],
							normals[ parseInt( result[ 12 ] ) - 1 ],
							normals[ parseInt( result[ 16 ] ) - 1 ]
						]
					) );

					geometry.faceVertexUvs[ 0 ].push( [
						uvs[ parseInt( result[ 3 ] ) - 1 ],
						uvs[ parseInt( result[ 7 ] ) - 1 ],
						uvs[ parseInt( result[ 11 ] ) - 1 ],
						uvs[ parseInt( result[ 15 ] ) - 1 ]
					] );

				}

			} else if ( ( result = face_pattern4.exec( line ) ) !== null ) {

				// ["f 1//1 2//2 3//3", " 1//1", "1", "1", " 2//2", "2", "2", " 3//3", "3", "3", undefined, undefined, undefined]

				if ( result[ 10 ] === undefined ) {

					geometry.vertices.push(
						vertices[ parseInt( result[ 2 ] ) - 1 ],
						vertices[ parseInt( result[ 5 ] ) - 1 ],
						vertices[ parseInt( result[ 8 ] ) - 1 ]
					);

					geometry.faces.push( face3(
						verticesCount ++,
						verticesCount ++,
						verticesCount ++,
						[
							normals[ parseInt( result[ 3 ] ) - 1 ],
							normals[ parseInt( result[ 6 ] ) - 1 ],
							normals[ parseInt( result[ 9 ] ) - 1 ]
						]
					) );

				} else {

					geometry.vertices.push(
						vertices[ parseInt( result[ 2 ] ) - 1 ],
						vertices[ parseInt( result[ 5 ] ) - 1 ],
						vertices[ parseInt( result[ 8 ] ) - 1 ],
						vertices[ parseInt( result[ 11 ] ) - 1 ]
					);

					geometry.faces.push( face4(
						verticesCount ++,
						verticesCount ++,
						verticesCount ++,
						verticesCount ++,
						[
							normals[ parseInt( result[ 3 ] ) - 1 ],
							normals[ parseInt( result[ 6 ] ) - 1 ],
							normals[ parseInt( result[ 9 ] ) - 1 ],
							normals[ parseInt( result[ 12 ] ) - 1 ]
						]
					) );

				}

			} else if ( /^o /.test( line ) ) {

				// object

				object = new THREE.Object3D();
				object.name = line.substring( 2 ).trim();
				group.add( object );

			} else if ( /^g /.test( line ) ) {

				// group

				meshN( line.substring( 2 ).trim(), undefined );

			} else if ( /^usemtl /.test( line ) ) {

				// material

				meshN( undefined, line.substring( 7 ).trim() );

			} else if ( /^mtllib /.test( line ) ) {

				// mtl file

			} else if ( /^s /.test( line ) ) {

				// smooth shading

			} else {

				// console.log( "THREE.OBJLoader: Unhandled line " + line );

			}

		}

		// add the last group
		meshN( undefined, undefined );

		return group;

	}

}

/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Port of greggman's ThreeD version of marching cubes to Three.js
 * http://webglsamples.googlecode.com/hg/blob/blob.html
 */

THREE.MarchingCubes = function ( resolution, material ) {

	THREE.Object3D.call( this );

	this.material = material;

	// functions have to be object properties
	// prototype functions kill performance
	// (tested and it was 4x slower !!!)

	this.init = function( resolution ) {

		this.resolution = resolution;

		// parameters

		this.isolation = 80.0;

		// size of field, 32 is pushing it in Javascript :)

		this.size = resolution;
		this.size2 = this.size * this.size;
		this.size3 = this.size2 * this.size;
		this.halfsize = this.size / 2.0;

		// deltas

		this.delta = 2.0 / this.size;
		this.yd = this.size;
		this.zd = this.size2;

		this.field = new Float32Array( this.size3 );
		this.normal_cache = new Float32Array( this.size3 * 3 );

		// temp buffers used in polygonize

		this.vlist = new Float32Array( 12 * 3 );
		this.nlist = new Float32Array( 12 * 3 );

		this.firstDraw = true;

		// immediate render mode simulator

		this.maxCount = 4096; // TODO: find the fastest size for this buffer
		this.count = 0;
		this.hasPos = false;
		this.hasNormal = false;

		this.positionArray = new Float32Array( this.maxCount * 3 );
		this.normalArray   = new Float32Array( this.maxCount * 3 );

	};

	///////////////////////
	// Polygonization
	///////////////////////

	this.lerp = function( a, b, t ) { return a + ( b - a ) * t; };

	this.VIntX = function( q, pout, nout, offset, isol, x, y, z, valp1, valp2 ) {

		var mu = ( isol - valp1 ) / ( valp2 - valp1 ),
		nc = this.normal_cache;

		pout[ offset ] 	   = x + mu * this.delta;
		pout[ offset + 1 ] = y;
		pout[ offset + 2 ] = z;

		nout[ offset ] 	   = this.lerp( nc[ q ],     nc[ q + 3 ], mu );
		nout[ offset + 1 ] = this.lerp( nc[ q + 1 ], nc[ q + 4 ], mu );
		nout[ offset + 2 ] = this.lerp( nc[ q + 2 ], nc[ q + 5 ], mu );

	};

	this.VIntY = function( q, pout, nout, offset, isol, x, y, z, valp1, valp2 ) {

		var mu = ( isol - valp1 ) / ( valp2 - valp1 ),
		nc = this.normal_cache;

		pout[ offset ] 	   = x;
		pout[ offset + 1 ] = y + mu * this.delta;
		pout[ offset + 2 ] = z;

		var q2 = q + this.yd * 3;

		nout[ offset ] 	   = this.lerp( nc[ q ],     nc[ q2 ],     mu );
		nout[ offset + 1 ] = this.lerp( nc[ q + 1 ], nc[ q2 + 1 ], mu );
		nout[ offset + 2 ] = this.lerp( nc[ q + 2 ], nc[ q2 + 2 ], mu );

	};

	this.VIntZ = function( q, pout, nout, offset, isol, x, y, z, valp1, valp2 ) {

		var mu = ( isol - valp1 ) / ( valp2 - valp1 ),
		nc = this.normal_cache;

		pout[ offset ] 	   = x;
		pout[ offset + 1 ] = y;
		pout[ offset + 2 ] = z + mu * this.delta;

		var q2 = q + this.zd * 3;

		nout[ offset ] 	   = this.lerp( nc[ q ],     nc[ q2 ],     mu );
		nout[ offset + 1 ] = this.lerp( nc[ q + 1 ], nc[ q2 + 1 ], mu );
		nout[ offset + 2 ] = this.lerp( nc[ q + 2 ], nc[ q2 + 2 ], mu );

	};

	this.compNorm = function( q ) {

		var q3 = q * 3;

		if ( this.normal_cache [ q3 ] === 0.0 ) {

			this.normal_cache[ q3     ] = this.field[ q - 1  ] 	    - this.field[ q + 1 ];
			this.normal_cache[ q3 + 1 ] = this.field[ q - this.yd ] - this.field[ q + this.yd ];
			this.normal_cache[ q3 + 2 ] = this.field[ q - this.zd ] - this.field[ q + this.zd ];

		}

	};

	// Returns total number of triangles. Fills triangles.
	// (this is where most of time is spent - it's inner work of O(n3) loop )

	this.polygonize = function( fx, fy, fz, q, isol, render_callback ) {

		// cache indices
		var q1 = q + 1,
			qy = q + this.yd,
			qz = q + this.zd,
			q1y = q1 + this.yd,
			q1z = q1 + this.zd,
			qyz = q + this.yd + this.zd,
			q1yz = q1 + this.yd + this.zd;

		var cubeindex = 0,
			field0 = this.field[ q ],
			field1 = this.field[ q1 ],
			field2 = this.field[ qy ],
			field3 = this.field[ q1y ],
			field4 = this.field[ qz ],
			field5 = this.field[ q1z ],
			field6 = this.field[ qyz ],
			field7 = this.field[ q1yz ];

		if ( field0 < isol ) cubeindex |= 1;
		if ( field1 < isol ) cubeindex |= 2;
		if ( field2 < isol ) cubeindex |= 8;
		if ( field3 < isol ) cubeindex |= 4;
		if ( field4 < isol ) cubeindex |= 16;
		if ( field5 < isol ) cubeindex |= 32;
		if ( field6 < isol ) cubeindex |= 128;
		if ( field7 < isol ) cubeindex |= 64;

		// if cube is entirely in/out of the surface - bail, nothing to draw

		var bits = THREE.edgeTable[ cubeindex ];
		if ( bits === 0 ) return 0;

		var d = this.delta,
			fx2 = fx + d,
			fy2 = fy + d,
			fz2 = fz + d;

		// top of the cube

		if ( bits & 1 ) {

			this.compNorm( q );
			this.compNorm( q1 );
			this.VIntX( q * 3, this.vlist, this.nlist, 0, isol, fx, fy, fz, field0, field1 );

		};

		if ( bits & 2 ) {

			this.compNorm( q1 );
			this.compNorm( q1y );
			this.VIntY( q1 * 3, this.vlist, this.nlist, 3, isol, fx2, fy, fz, field1, field3 );

		};

		if ( bits & 4 ) {

			this.compNorm( qy );
			this.compNorm( q1y );
			this.VIntX( qy * 3, this.vlist, this.nlist, 6, isol, fx, fy2, fz, field2, field3 );

		};

		if ( bits & 8 ) {

			this.compNorm( q );
			this.compNorm( qy );
			this.VIntY( q * 3, this.vlist, this.nlist, 9, isol, fx, fy, fz, field0, field2 );

		};

		// bottom of the cube

		if ( bits & 16 )  {

			this.compNorm( qz );
			this.compNorm( q1z );
			this.VIntX( qz * 3, this.vlist, this.nlist, 12, isol, fx, fy, fz2, field4, field5 );

		};

		if ( bits & 32 )  {

			this.compNorm( q1z );
			this.compNorm( q1yz );
			this.VIntY( q1z * 3,  this.vlist, this.nlist, 15, isol, fx2, fy, fz2, field5, field7 );

		};

		if ( bits & 64 ) {

			this.compNorm( qyz );
			this.compNorm( q1yz );
			this.VIntX( qyz * 3, this.vlist, this.nlist, 18, isol, fx, fy2, fz2, field6, field7 );

		};

		if ( bits & 128 ) {

			this.compNorm( qz );
			this.compNorm( qyz );
			this.VIntY( qz * 3,  this.vlist, this.nlist, 21, isol, fx, fy, fz2, field4, field6 );

		};

		// vertical lines of the cube

		if ( bits & 256 ) {

			this.compNorm( q );
			this.compNorm( qz );
			this.VIntZ( q * 3, this.vlist, this.nlist, 24, isol, fx, fy, fz, field0, field4 );

		};

		if ( bits & 512 ) {

			this.compNorm( q1 );
			this.compNorm( q1z );
			this.VIntZ( q1 * 3,  this.vlist, this.nlist, 27, isol, fx2, fy,  fz, field1, field5 );

		};

		if ( bits & 1024 ) {

			this.compNorm( q1y );
			this.compNorm( q1yz );
			this.VIntZ( q1y * 3, this.vlist, this.nlist, 30, isol, fx2, fy2, fz, field3, field7 );

		};

		if ( bits & 2048 ) {

			this.compNorm( qy );
			this.compNorm( qyz );
			this.VIntZ( qy * 3, this.vlist, this.nlist, 33, isol, fx,  fy2, fz, field2, field6 );

		};

		cubeindex <<= 4;  // re-purpose cubeindex into an offset into triTable

		var o1, o2, o3, numtris = 0, i = 0;

		// here is where triangles are created

		while ( THREE.triTable[ cubeindex + i ] != -1 ) {

			o1 = cubeindex + i;
			o2 = o1 + 1;
			o3 = o1 + 2;

			this.posnormtriv( this.vlist, this.nlist,
							  3 * THREE.triTable[ o1 ],
							  3 * THREE.triTable[ o2 ],
							  3 * THREE.triTable[ o3 ],
							  render_callback );

			i += 3;
			numtris ++;

		}

		return numtris;

	};

	/////////////////////////////////////
	// Immediate render mode simulator
	/////////////////////////////////////

	this.posnormtriv = function( pos, norm, o1, o2, o3, render_callback ) {

		var c = this.count * 3;

		this.positionArray[ c ] = pos[ o1 ];
		this.positionArray[ c + 1 ] = pos[ o1 + 1 ];
		this.positionArray[ c + 2 ] = pos[ o1 + 2 ];

		this.positionArray[ c + 3 ] = pos[ o2 ];
		this.positionArray[ c + 4 ] = pos[ o2 + 1 ];
		this.positionArray[ c + 5 ] = pos[ o2 + 2 ];

		this.positionArray[ c + 6 ] = pos[ o3 ];
		this.positionArray[ c + 7 ] = pos[ o3 + 1 ];
		this.positionArray[ c + 8 ] = pos[ o3 + 2 ];

		this.normalArray[ c ] = norm[ o1 ];
		this.normalArray[ c + 1 ] = norm[ o1 + 1 ];
		this.normalArray[ c + 2 ] = norm[ o1 + 2 ];

		this.normalArray[ c + 3 ] = norm[ o2 ];
		this.normalArray[ c + 4 ] = norm[ o2 + 1 ];
		this.normalArray[ c + 5 ] = norm[ o2 + 2 ];

		this.normalArray[ c + 6 ] = norm[ o3 ];
		this.normalArray[ c + 7 ] = norm[ o3 + 1 ];
		this.normalArray[ c + 8 ] = norm[ o3 + 2 ];

		this.hasPos = true;
		this.hasNormal = true;

		this.count += 3;

		if ( this.count >= this.maxCount - 3 ) {

			render_callback( this );

		}

	};

	this.begin = function( ) {

		this.count = 0;
		this.hasPos = false;
		this.hasNormal = false;

	};

	this.end = function( render_callback ) {

		if ( this.count === 0 )
			return;

		for ( var i = this.count * 3; i < this.positionArray.length; i++ )
			this.positionArray[ i ] = 0.0;

		render_callback( this );

	};

	/////////////////////////////////////
	// Metaballs
	/////////////////////////////////////

	// Adds a reciprocal ball (nice and blobby) that, to be fast, fades to zero after
	// a fixed distance, determined by strength and subtract.

	this.addBall = function( ballx, bally, ballz, strength, subtract ) {

		// Let's solve the equation to find the radius:
		// 1.0 / (0.000001 + radius^2) * strength - subtract = 0
		// strength / (radius^2) = subtract
		// strength = subtract * radius^2
		// radius^2 = strength / subtract
		// radius = sqrt(strength / subtract)

		var radius = this.size * Math.sqrt( strength / subtract ),
			zs = ballz * this.size,
			ys = bally * this.size,
			xs = ballx * this.size;

		var min_z = Math.floor( zs - radius ); if ( min_z < 1 ) min_z = 1;
		var max_z = Math.floor( zs + radius ); if ( max_z > this.size - 1 ) max_z = this.size - 1;
		var min_y = Math.floor( ys - radius ); if ( min_y < 1 ) min_y = 1;
		var max_y = Math.floor( ys + radius ); if ( max_y > this.size - 1 ) max_y = this.size - 1;
		var min_x = Math.floor( xs - radius ); if ( min_x < 1  ) min_x = 1;
		var max_x = Math.floor( xs + radius ); if ( max_x > this.size - 1 ) max_x = this.size - 1;


		// Don't polygonize in the outer layer because normals aren't
		// well-defined there.

		var x, y, z, y_offset, z_offset, fx, fy, fz, fz2, fy2, val;

		for ( z = min_z; z < max_z; z++ ) {

			z_offset = this.size2 * z,
			fz = z / this.size - ballz,
			fz2 = fz * fz;

			for ( y = min_y; y < max_y; y++ ) {

				y_offset = z_offset + this.size * y;
				fy = y / this.size - bally;
				fy2 = fy * fy;

				for ( x = min_x; x < max_x; x++ ) {

					fx = x / this.size - ballx;
					val = strength / ( 0.000001 + fx*fx + fy2 + fz2 ) - subtract;
					if ( val > 0.0 ) this.field[ y_offset + x ] += val;

				}

			}

		}

	};

	this.addPlaneX = function( strength, subtract ) {

		var x, y, z, xx, val, xdiv, cxy,

			// cache attribute lookups
			size = this.size,
			yd = this.yd,
			zd = this.zd,
			field = this.field,

			dist = size * Math.sqrt( strength / subtract );

		if ( dist > size ) dist = size;

		for ( x = 0; x < dist; x++ ) {

			xdiv = x / size;
			xx = xdiv * xdiv;
			val = strength / ( 0.0001 + xx ) - subtract;

			if ( val > 0.0 ) {

				for ( y = 0; y < size; y++ ) {

					cxy = x + y * yd;

					for ( z = 0; z < size; z++ ) {

						field[ zd * z + cxy ] += val;

					}

				}

			}

		}

	};

	this.addPlaneY = function( strength, subtract ) {

		var x, y, z, yy, val, ydiv, cy, cxy,

			// cache attribute lookups
			size = this.size,
			yd = this.yd,
			zd = this.zd,
			field = this.field,

			dist = size * Math.sqrt( strength / subtract );

		if ( dist > size ) dist = size;

		for ( y = 0; y < dist; y++ ) {

			ydiv = y / size;
			yy = ydiv * ydiv;
			val = strength / ( 0.0001 + yy ) - subtract;

			if ( val > 0.0 ) {

				cy = y * yd;

				for ( x = 0; x < size; x++ ) {

					cxy = cy + x;

					for ( z = 0; z < size; z++ )
						field[ zd * z + cxy ] += val;

				}

			}

		}

	};

	this.addPlaneZ = function( strength, subtract ) {

		var x, y, z, zz, val, zdiv, cz, cyz,

			// cache attribute lookups
			size = this.size,
			yd = this.yd,
			zd = this.zd,
			field = this.field,

			dist = size * Math.sqrt( strength / subtract );

		if ( dist > size ) dist = size;

		for ( z = 0; z < dist; z++ ) {

			zdiv = z / size;
			zz = zdiv * zdiv;
			val = strength / ( 0.0001 + zz ) - subtract;
			if ( val > 0.0 ) {

				cz = zd * z;

				for ( y = 0; y < size; y++ ) {

						cyz = cz + y * yd;

						for ( x = 0; x < size; x++ )
							field[ cyz + x ] += val;

				}

			}

		}

	};

	/////////////////////////////////////
	// Updates
	/////////////////////////////////////

	this.reset = function() {

		var i;

		// wipe the normal cache

		for ( i = 0; i < this.size3; i++ ) {

			this.normal_cache[ i * 3 ] = 0.0;
			this.field[ i ] = 0.0;

		}

	};

	this.render = function( render_callback ) {

		this.begin();

		// Triangulate. Yeah, this is slow.

		var q, x, y, z, fx, fy, fz, y_offset, z_offset, smin2 = this.size - 2;

		for ( z = 1; z < smin2; z++ ) {

			z_offset = this.size2 * z;
			fz = ( z - this.halfsize ) / this.halfsize; //+ 1

			for ( y = 1; y < smin2; y++ ) {

				y_offset = z_offset + this.size * y;
				fy = ( y - this.halfsize ) / this.halfsize; //+ 1

				for ( x = 1; x < smin2; x++ ) {

					fx = ( x - this.halfsize ) / this.halfsize; //+ 1
					q = y_offset + x;

					this.polygonize( fx, fy, fz, q, this.isolation, render_callback );

				}

			}

		}

		this.end( render_callback );

	};

	this.generateGeometry = function() {

		var start = 0, geo = new THREE.Geometry();
		var normals = [];

		var geo_callback = function( object ) {

			var i, x, y, z, vertex, position, normal,
				face, a, b, c, na, nb, nc, nfaces;


			for ( i = 0; i < object.count; i++ ) {

				a = i * 3;
				b = a + 1;
				c = a + 2;

				x = object.positionArray[ a ];
				y = object.positionArray[ b ];
				z = object.positionArray[ c ];
				position = new THREE.Vector3( x, y, z );

				x = object.normalArray[ a ];
				y = object.normalArray[ b ];
				z = object.normalArray[ c ];
				normal = new THREE.Vector3( x, y, z );
				normal.normalize();

				vertex = new THREE.Vertex( position );

				geo.vertices.push( vertex );
				normals.push( normal );

			}

			nfaces = object.count / 3;

			for ( i = 0; i < nfaces; i++ ) {

				a = ( start + i ) * 3;
				b = a + 1;
				c = a + 2;

				na = normals[ a ];
				nb = normals[ b ];
				nc = normals[ c ];

				face = new THREE.Face3( a, b, c, [ na, nb, nc ] );

				geo.faces.push( face );

			}

			start += nfaces;
			object.count = 0;

		};

		this.render( geo_callback );

		// console.log( "generated " + geo.faces.length + " triangles" );

		return geo;

	};

	this.init( resolution );

};

THREE.MarchingCubes.prototype = new THREE.Object3D();
THREE.MarchingCubes.prototype.constructor = THREE.MarchingCubes;


/////////////////////////////////////
// Marching cubes lookup tables
/////////////////////////////////////

// These tables are straight from Paul Bourke's page:
// http://local.wasp.uwa.edu.au/~pbourke/geometry/polygonise/
// who in turn got them from Cory Gene Bloyd.

THREE.edgeTable = new Int32Array([
0x0  , 0x109, 0x203, 0x30a, 0x406, 0x50f, 0x605, 0x70c,
0x80c, 0x905, 0xa0f, 0xb06, 0xc0a, 0xd03, 0xe09, 0xf00,
0x190, 0x99 , 0x393, 0x29a, 0x596, 0x49f, 0x795, 0x69c,
0x99c, 0x895, 0xb9f, 0xa96, 0xd9a, 0xc93, 0xf99, 0xe90,
0x230, 0x339, 0x33 , 0x13a, 0x636, 0x73f, 0x435, 0x53c,
0xa3c, 0xb35, 0x83f, 0x936, 0xe3a, 0xf33, 0xc39, 0xd30,
0x3a0, 0x2a9, 0x1a3, 0xaa , 0x7a6, 0x6af, 0x5a5, 0x4ac,
0xbac, 0xaa5, 0x9af, 0x8a6, 0xfaa, 0xea3, 0xda9, 0xca0,
0x460, 0x569, 0x663, 0x76a, 0x66 , 0x16f, 0x265, 0x36c,
0xc6c, 0xd65, 0xe6f, 0xf66, 0x86a, 0x963, 0xa69, 0xb60,
0x5f0, 0x4f9, 0x7f3, 0x6fa, 0x1f6, 0xff , 0x3f5, 0x2fc,
0xdfc, 0xcf5, 0xfff, 0xef6, 0x9fa, 0x8f3, 0xbf9, 0xaf0,
0x650, 0x759, 0x453, 0x55a, 0x256, 0x35f, 0x55 , 0x15c,
0xe5c, 0xf55, 0xc5f, 0xd56, 0xa5a, 0xb53, 0x859, 0x950,
0x7c0, 0x6c9, 0x5c3, 0x4ca, 0x3c6, 0x2cf, 0x1c5, 0xcc ,
0xfcc, 0xec5, 0xdcf, 0xcc6, 0xbca, 0xac3, 0x9c9, 0x8c0,
0x8c0, 0x9c9, 0xac3, 0xbca, 0xcc6, 0xdcf, 0xec5, 0xfcc,
0xcc , 0x1c5, 0x2cf, 0x3c6, 0x4ca, 0x5c3, 0x6c9, 0x7c0,
0x950, 0x859, 0xb53, 0xa5a, 0xd56, 0xc5f, 0xf55, 0xe5c,
0x15c, 0x55 , 0x35f, 0x256, 0x55a, 0x453, 0x759, 0x650,
0xaf0, 0xbf9, 0x8f3, 0x9fa, 0xef6, 0xfff, 0xcf5, 0xdfc,
0x2fc, 0x3f5, 0xff , 0x1f6, 0x6fa, 0x7f3, 0x4f9, 0x5f0,
0xb60, 0xa69, 0x963, 0x86a, 0xf66, 0xe6f, 0xd65, 0xc6c,
0x36c, 0x265, 0x16f, 0x66 , 0x76a, 0x663, 0x569, 0x460,
0xca0, 0xda9, 0xea3, 0xfaa, 0x8a6, 0x9af, 0xaa5, 0xbac,
0x4ac, 0x5a5, 0x6af, 0x7a6, 0xaa , 0x1a3, 0x2a9, 0x3a0,
0xd30, 0xc39, 0xf33, 0xe3a, 0x936, 0x83f, 0xb35, 0xa3c,
0x53c, 0x435, 0x73f, 0x636, 0x13a, 0x33 , 0x339, 0x230,
0xe90, 0xf99, 0xc93, 0xd9a, 0xa96, 0xb9f, 0x895, 0x99c,
0x69c, 0x795, 0x49f, 0x596, 0x29a, 0x393, 0x99 , 0x190,
0xf00, 0xe09, 0xd03, 0xc0a, 0xb06, 0xa0f, 0x905, 0x80c,
0x70c, 0x605, 0x50f, 0x406, 0x30a, 0x203, 0x109, 0x0])

THREE.triTable = new Int32Array([
-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
0, 8, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
0, 1, 9, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
1, 8, 3, 9, 8, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
1, 2, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
0, 8, 3, 1, 2, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
9, 2, 10, 0, 2, 9, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
2, 8, 3, 2, 10, 8, 10, 9, 8, -1, -1, -1, -1, -1, -1, -1,
3, 11, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
0, 11, 2, 8, 11, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
1, 9, 0, 2, 3, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
1, 11, 2, 1, 9, 11, 9, 8, 11, -1, -1, -1, -1, -1, -1, -1,
3, 10, 1, 11, 10, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
0, 10, 1, 0, 8, 10, 8, 11, 10, -1, -1, -1, -1, -1, -1, -1,
3, 9, 0, 3, 11, 9, 11, 10, 9, -1, -1, -1, -1, -1, -1, -1,
9, 8, 10, 10, 8, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
4, 7, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
4, 3, 0, 7, 3, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
0, 1, 9, 8, 4, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
4, 1, 9, 4, 7, 1, 7, 3, 1, -1, -1, -1, -1, -1, -1, -1,
1, 2, 10, 8, 4, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
3, 4, 7, 3, 0, 4, 1, 2, 10, -1, -1, -1, -1, -1, -1, -1,
9, 2, 10, 9, 0, 2, 8, 4, 7, -1, -1, -1, -1, -1, -1, -1,
2, 10, 9, 2, 9, 7, 2, 7, 3, 7, 9, 4, -1, -1, -1, -1,
8, 4, 7, 3, 11, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
11, 4, 7, 11, 2, 4, 2, 0, 4, -1, -1, -1, -1, -1, -1, -1,
9, 0, 1, 8, 4, 7, 2, 3, 11, -1, -1, -1, -1, -1, -1, -1,
4, 7, 11, 9, 4, 11, 9, 11, 2, 9, 2, 1, -1, -1, -1, -1,
3, 10, 1, 3, 11, 10, 7, 8, 4, -1, -1, -1, -1, -1, -1, -1,
1, 11, 10, 1, 4, 11, 1, 0, 4, 7, 11, 4, -1, -1, -1, -1,
4, 7, 8, 9, 0, 11, 9, 11, 10, 11, 0, 3, -1, -1, -1, -1,
4, 7, 11, 4, 11, 9, 9, 11, 10, -1, -1, -1, -1, -1, -1, -1,
9, 5, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
9, 5, 4, 0, 8, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
0, 5, 4, 1, 5, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
8, 5, 4, 8, 3, 5, 3, 1, 5, -1, -1, -1, -1, -1, -1, -1,
1, 2, 10, 9, 5, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
3, 0, 8, 1, 2, 10, 4, 9, 5, -1, -1, -1, -1, -1, -1, -1,
5, 2, 10, 5, 4, 2, 4, 0, 2, -1, -1, -1, -1, -1, -1, -1,
2, 10, 5, 3, 2, 5, 3, 5, 4, 3, 4, 8, -1, -1, -1, -1,
9, 5, 4, 2, 3, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
0, 11, 2, 0, 8, 11, 4, 9, 5, -1, -1, -1, -1, -1, -1, -1,
0, 5, 4, 0, 1, 5, 2, 3, 11, -1, -1, -1, -1, -1, -1, -1,
2, 1, 5, 2, 5, 8, 2, 8, 11, 4, 8, 5, -1, -1, -1, -1,
10, 3, 11, 10, 1, 3, 9, 5, 4, -1, -1, -1, -1, -1, -1, -1,
4, 9, 5, 0, 8, 1, 8, 10, 1, 8, 11, 10, -1, -1, -1, -1,
5, 4, 0, 5, 0, 11, 5, 11, 10, 11, 0, 3, -1, -1, -1, -1,
5, 4, 8, 5, 8, 10, 10, 8, 11, -1, -1, -1, -1, -1, -1, -1,
9, 7, 8, 5, 7, 9, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
9, 3, 0, 9, 5, 3, 5, 7, 3, -1, -1, -1, -1, -1, -1, -1,
0, 7, 8, 0, 1, 7, 1, 5, 7, -1, -1, -1, -1, -1, -1, -1,
1, 5, 3, 3, 5, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
9, 7, 8, 9, 5, 7, 10, 1, 2, -1, -1, -1, -1, -1, -1, -1,
10, 1, 2, 9, 5, 0, 5, 3, 0, 5, 7, 3, -1, -1, -1, -1,
8, 0, 2, 8, 2, 5, 8, 5, 7, 10, 5, 2, -1, -1, -1, -1,
2, 10, 5, 2, 5, 3, 3, 5, 7, -1, -1, -1, -1, -1, -1, -1,
7, 9, 5, 7, 8, 9, 3, 11, 2, -1, -1, -1, -1, -1, -1, -1,
9, 5, 7, 9, 7, 2, 9, 2, 0, 2, 7, 11, -1, -1, -1, -1,
2, 3, 11, 0, 1, 8, 1, 7, 8, 1, 5, 7, -1, -1, -1, -1,
11, 2, 1, 11, 1, 7, 7, 1, 5, -1, -1, -1, -1, -1, -1, -1,
9, 5, 8, 8, 5, 7, 10, 1, 3, 10, 3, 11, -1, -1, -1, -1,
5, 7, 0, 5, 0, 9, 7, 11, 0, 1, 0, 10, 11, 10, 0, -1,
11, 10, 0, 11, 0, 3, 10, 5, 0, 8, 0, 7, 5, 7, 0, -1,
11, 10, 5, 7, 11, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
10, 6, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
0, 8, 3, 5, 10, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
9, 0, 1, 5, 10, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
1, 8, 3, 1, 9, 8, 5, 10, 6, -1, -1, -1, -1, -1, -1, -1,
1, 6, 5, 2, 6, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
1, 6, 5, 1, 2, 6, 3, 0, 8, -1, -1, -1, -1, -1, -1, -1,
9, 6, 5, 9, 0, 6, 0, 2, 6, -1, -1, -1, -1, -1, -1, -1,
5, 9, 8, 5, 8, 2, 5, 2, 6, 3, 2, 8, -1, -1, -1, -1,
2, 3, 11, 10, 6, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
11, 0, 8, 11, 2, 0, 10, 6, 5, -1, -1, -1, -1, -1, -1, -1,
0, 1, 9, 2, 3, 11, 5, 10, 6, -1, -1, -1, -1, -1, -1, -1,
5, 10, 6, 1, 9, 2, 9, 11, 2, 9, 8, 11, -1, -1, -1, -1,
6, 3, 11, 6, 5, 3, 5, 1, 3, -1, -1, -1, -1, -1, -1, -1,
0, 8, 11, 0, 11, 5, 0, 5, 1, 5, 11, 6, -1, -1, -1, -1,
3, 11, 6, 0, 3, 6, 0, 6, 5, 0, 5, 9, -1, -1, -1, -1,
6, 5, 9, 6, 9, 11, 11, 9, 8, -1, -1, -1, -1, -1, -1, -1,
5, 10, 6, 4, 7, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
4, 3, 0, 4, 7, 3, 6, 5, 10, -1, -1, -1, -1, -1, -1, -1,
1, 9, 0, 5, 10, 6, 8, 4, 7, -1, -1, -1, -1, -1, -1, -1,
10, 6, 5, 1, 9, 7, 1, 7, 3, 7, 9, 4, -1, -1, -1, -1,
6, 1, 2, 6, 5, 1, 4, 7, 8, -1, -1, -1, -1, -1, -1, -1,
1, 2, 5, 5, 2, 6, 3, 0, 4, 3, 4, 7, -1, -1, -1, -1,
8, 4, 7, 9, 0, 5, 0, 6, 5, 0, 2, 6, -1, -1, -1, -1,
7, 3, 9, 7, 9, 4, 3, 2, 9, 5, 9, 6, 2, 6, 9, -1,
3, 11, 2, 7, 8, 4, 10, 6, 5, -1, -1, -1, -1, -1, -1, -1,
5, 10, 6, 4, 7, 2, 4, 2, 0, 2, 7, 11, -1, -1, -1, -1,
0, 1, 9, 4, 7, 8, 2, 3, 11, 5, 10, 6, -1, -1, -1, -1,
9, 2, 1, 9, 11, 2, 9, 4, 11, 7, 11, 4, 5, 10, 6, -1,
8, 4, 7, 3, 11, 5, 3, 5, 1, 5, 11, 6, -1, -1, -1, -1,
5, 1, 11, 5, 11, 6, 1, 0, 11, 7, 11, 4, 0, 4, 11, -1,
0, 5, 9, 0, 6, 5, 0, 3, 6, 11, 6, 3, 8, 4, 7, -1,
6, 5, 9, 6, 9, 11, 4, 7, 9, 7, 11, 9, -1, -1, -1, -1,
10, 4, 9, 6, 4, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
4, 10, 6, 4, 9, 10, 0, 8, 3, -1, -1, -1, -1, -1, -1, -1,
10, 0, 1, 10, 6, 0, 6, 4, 0, -1, -1, -1, -1, -1, -1, -1,
8, 3, 1, 8, 1, 6, 8, 6, 4, 6, 1, 10, -1, -1, -1, -1,
1, 4, 9, 1, 2, 4, 2, 6, 4, -1, -1, -1, -1, -1, -1, -1,
3, 0, 8, 1, 2, 9, 2, 4, 9, 2, 6, 4, -1, -1, -1, -1,
0, 2, 4, 4, 2, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
8, 3, 2, 8, 2, 4, 4, 2, 6, -1, -1, -1, -1, -1, -1, -1,
10, 4, 9, 10, 6, 4, 11, 2, 3, -1, -1, -1, -1, -1, -1, -1,
0, 8, 2, 2, 8, 11, 4, 9, 10, 4, 10, 6, -1, -1, -1, -1,
3, 11, 2, 0, 1, 6, 0, 6, 4, 6, 1, 10, -1, -1, -1, -1,
6, 4, 1, 6, 1, 10, 4, 8, 1, 2, 1, 11, 8, 11, 1, -1,
9, 6, 4, 9, 3, 6, 9, 1, 3, 11, 6, 3, -1, -1, -1, -1,
8, 11, 1, 8, 1, 0, 11, 6, 1, 9, 1, 4, 6, 4, 1, -1,
3, 11, 6, 3, 6, 0, 0, 6, 4, -1, -1, -1, -1, -1, -1, -1,
6, 4, 8, 11, 6, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
7, 10, 6, 7, 8, 10, 8, 9, 10, -1, -1, -1, -1, -1, -1, -1,
0, 7, 3, 0, 10, 7, 0, 9, 10, 6, 7, 10, -1, -1, -1, -1,
10, 6, 7, 1, 10, 7, 1, 7, 8, 1, 8, 0, -1, -1, -1, -1,
10, 6, 7, 10, 7, 1, 1, 7, 3, -1, -1, -1, -1, -1, -1, -1,
1, 2, 6, 1, 6, 8, 1, 8, 9, 8, 6, 7, -1, -1, -1, -1,
2, 6, 9, 2, 9, 1, 6, 7, 9, 0, 9, 3, 7, 3, 9, -1,
7, 8, 0, 7, 0, 6, 6, 0, 2, -1, -1, -1, -1, -1, -1, -1,
7, 3, 2, 6, 7, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
2, 3, 11, 10, 6, 8, 10, 8, 9, 8, 6, 7, -1, -1, -1, -1,
2, 0, 7, 2, 7, 11, 0, 9, 7, 6, 7, 10, 9, 10, 7, -1,
1, 8, 0, 1, 7, 8, 1, 10, 7, 6, 7, 10, 2, 3, 11, -1,
11, 2, 1, 11, 1, 7, 10, 6, 1, 6, 7, 1, -1, -1, -1, -1,
8, 9, 6, 8, 6, 7, 9, 1, 6, 11, 6, 3, 1, 3, 6, -1,
0, 9, 1, 11, 6, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
7, 8, 0, 7, 0, 6, 3, 11, 0, 11, 6, 0, -1, -1, -1, -1,
7, 11, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
7, 6, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
3, 0, 8, 11, 7, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
0, 1, 9, 11, 7, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
8, 1, 9, 8, 3, 1, 11, 7, 6, -1, -1, -1, -1, -1, -1, -1,
10, 1, 2, 6, 11, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
1, 2, 10, 3, 0, 8, 6, 11, 7, -1, -1, -1, -1, -1, -1, -1,
2, 9, 0, 2, 10, 9, 6, 11, 7, -1, -1, -1, -1, -1, -1, -1,
6, 11, 7, 2, 10, 3, 10, 8, 3, 10, 9, 8, -1, -1, -1, -1,
7, 2, 3, 6, 2, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
7, 0, 8, 7, 6, 0, 6, 2, 0, -1, -1, -1, -1, -1, -1, -1,
2, 7, 6, 2, 3, 7, 0, 1, 9, -1, -1, -1, -1, -1, -1, -1,
1, 6, 2, 1, 8, 6, 1, 9, 8, 8, 7, 6, -1, -1, -1, -1,
10, 7, 6, 10, 1, 7, 1, 3, 7, -1, -1, -1, -1, -1, -1, -1,
10, 7, 6, 1, 7, 10, 1, 8, 7, 1, 0, 8, -1, -1, -1, -1,
0, 3, 7, 0, 7, 10, 0, 10, 9, 6, 10, 7, -1, -1, -1, -1,
7, 6, 10, 7, 10, 8, 8, 10, 9, -1, -1, -1, -1, -1, -1, -1,
6, 8, 4, 11, 8, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
3, 6, 11, 3, 0, 6, 0, 4, 6, -1, -1, -1, -1, -1, -1, -1,
8, 6, 11, 8, 4, 6, 9, 0, 1, -1, -1, -1, -1, -1, -1, -1,
9, 4, 6, 9, 6, 3, 9, 3, 1, 11, 3, 6, -1, -1, -1, -1,
6, 8, 4, 6, 11, 8, 2, 10, 1, -1, -1, -1, -1, -1, -1, -1,
1, 2, 10, 3, 0, 11, 0, 6, 11, 0, 4, 6, -1, -1, -1, -1,
4, 11, 8, 4, 6, 11, 0, 2, 9, 2, 10, 9, -1, -1, -1, -1,
10, 9, 3, 10, 3, 2, 9, 4, 3, 11, 3, 6, 4, 6, 3, -1,
8, 2, 3, 8, 4, 2, 4, 6, 2, -1, -1, -1, -1, -1, -1, -1,
0, 4, 2, 4, 6, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
1, 9, 0, 2, 3, 4, 2, 4, 6, 4, 3, 8, -1, -1, -1, -1,
1, 9, 4, 1, 4, 2, 2, 4, 6, -1, -1, -1, -1, -1, -1, -1,
8, 1, 3, 8, 6, 1, 8, 4, 6, 6, 10, 1, -1, -1, -1, -1,
10, 1, 0, 10, 0, 6, 6, 0, 4, -1, -1, -1, -1, -1, -1, -1,
4, 6, 3, 4, 3, 8, 6, 10, 3, 0, 3, 9, 10, 9, 3, -1,
10, 9, 4, 6, 10, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
4, 9, 5, 7, 6, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
0, 8, 3, 4, 9, 5, 11, 7, 6, -1, -1, -1, -1, -1, -1, -1,
5, 0, 1, 5, 4, 0, 7, 6, 11, -1, -1, -1, -1, -1, -1, -1,
11, 7, 6, 8, 3, 4, 3, 5, 4, 3, 1, 5, -1, -1, -1, -1,
9, 5, 4, 10, 1, 2, 7, 6, 11, -1, -1, -1, -1, -1, -1, -1,
6, 11, 7, 1, 2, 10, 0, 8, 3, 4, 9, 5, -1, -1, -1, -1,
7, 6, 11, 5, 4, 10, 4, 2, 10, 4, 0, 2, -1, -1, -1, -1,
3, 4, 8, 3, 5, 4, 3, 2, 5, 10, 5, 2, 11, 7, 6, -1,
7, 2, 3, 7, 6, 2, 5, 4, 9, -1, -1, -1, -1, -1, -1, -1,
9, 5, 4, 0, 8, 6, 0, 6, 2, 6, 8, 7, -1, -1, -1, -1,
3, 6, 2, 3, 7, 6, 1, 5, 0, 5, 4, 0, -1, -1, -1, -1,
6, 2, 8, 6, 8, 7, 2, 1, 8, 4, 8, 5, 1, 5, 8, -1,
9, 5, 4, 10, 1, 6, 1, 7, 6, 1, 3, 7, -1, -1, -1, -1,
1, 6, 10, 1, 7, 6, 1, 0, 7, 8, 7, 0, 9, 5, 4, -1,
4, 0, 10, 4, 10, 5, 0, 3, 10, 6, 10, 7, 3, 7, 10, -1,
7, 6, 10, 7, 10, 8, 5, 4, 10, 4, 8, 10, -1, -1, -1, -1,
6, 9, 5, 6, 11, 9, 11, 8, 9, -1, -1, -1, -1, -1, -1, -1,
3, 6, 11, 0, 6, 3, 0, 5, 6, 0, 9, 5, -1, -1, -1, -1,
0, 11, 8, 0, 5, 11, 0, 1, 5, 5, 6, 11, -1, -1, -1, -1,
6, 11, 3, 6, 3, 5, 5, 3, 1, -1, -1, -1, -1, -1, -1, -1,
1, 2, 10, 9, 5, 11, 9, 11, 8, 11, 5, 6, -1, -1, -1, -1,
0, 11, 3, 0, 6, 11, 0, 9, 6, 5, 6, 9, 1, 2, 10, -1,
11, 8, 5, 11, 5, 6, 8, 0, 5, 10, 5, 2, 0, 2, 5, -1,
6, 11, 3, 6, 3, 5, 2, 10, 3, 10, 5, 3, -1, -1, -1, -1,
5, 8, 9, 5, 2, 8, 5, 6, 2, 3, 8, 2, -1, -1, -1, -1,
9, 5, 6, 9, 6, 0, 0, 6, 2, -1, -1, -1, -1, -1, -1, -1,
1, 5, 8, 1, 8, 0, 5, 6, 8, 3, 8, 2, 6, 2, 8, -1,
1, 5, 6, 2, 1, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
1, 3, 6, 1, 6, 10, 3, 8, 6, 5, 6, 9, 8, 9, 6, -1,
10, 1, 0, 10, 0, 6, 9, 5, 0, 5, 6, 0, -1, -1, -1, -1,
0, 3, 8, 5, 6, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
10, 5, 6, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
11, 5, 10, 7, 5, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
11, 5, 10, 11, 7, 5, 8, 3, 0, -1, -1, -1, -1, -1, -1, -1,
5, 11, 7, 5, 10, 11, 1, 9, 0, -1, -1, -1, -1, -1, -1, -1,
10, 7, 5, 10, 11, 7, 9, 8, 1, 8, 3, 1, -1, -1, -1, -1,
11, 1, 2, 11, 7, 1, 7, 5, 1, -1, -1, -1, -1, -1, -1, -1,
0, 8, 3, 1, 2, 7, 1, 7, 5, 7, 2, 11, -1, -1, -1, -1,
9, 7, 5, 9, 2, 7, 9, 0, 2, 2, 11, 7, -1, -1, -1, -1,
7, 5, 2, 7, 2, 11, 5, 9, 2, 3, 2, 8, 9, 8, 2, -1,
2, 5, 10, 2, 3, 5, 3, 7, 5, -1, -1, -1, -1, -1, -1, -1,
8, 2, 0, 8, 5, 2, 8, 7, 5, 10, 2, 5, -1, -1, -1, -1,
9, 0, 1, 5, 10, 3, 5, 3, 7, 3, 10, 2, -1, -1, -1, -1,
9, 8, 2, 9, 2, 1, 8, 7, 2, 10, 2, 5, 7, 5, 2, -1,
1, 3, 5, 3, 7, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
0, 8, 7, 0, 7, 1, 1, 7, 5, -1, -1, -1, -1, -1, -1, -1,
9, 0, 3, 9, 3, 5, 5, 3, 7, -1, -1, -1, -1, -1, -1, -1,
9, 8, 7, 5, 9, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
5, 8, 4, 5, 10, 8, 10, 11, 8, -1, -1, -1, -1, -1, -1, -1,
5, 0, 4, 5, 11, 0, 5, 10, 11, 11, 3, 0, -1, -1, -1, -1,
0, 1, 9, 8, 4, 10, 8, 10, 11, 10, 4, 5, -1, -1, -1, -1,
10, 11, 4, 10, 4, 5, 11, 3, 4, 9, 4, 1, 3, 1, 4, -1,
2, 5, 1, 2, 8, 5, 2, 11, 8, 4, 5, 8, -1, -1, -1, -1,
0, 4, 11, 0, 11, 3, 4, 5, 11, 2, 11, 1, 5, 1, 11, -1,
0, 2, 5, 0, 5, 9, 2, 11, 5, 4, 5, 8, 11, 8, 5, -1,
9, 4, 5, 2, 11, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
2, 5, 10, 3, 5, 2, 3, 4, 5, 3, 8, 4, -1, -1, -1, -1,
5, 10, 2, 5, 2, 4, 4, 2, 0, -1, -1, -1, -1, -1, -1, -1,
3, 10, 2, 3, 5, 10, 3, 8, 5, 4, 5, 8, 0, 1, 9, -1,
5, 10, 2, 5, 2, 4, 1, 9, 2, 9, 4, 2, -1, -1, -1, -1,
8, 4, 5, 8, 5, 3, 3, 5, 1, -1, -1, -1, -1, -1, -1, -1,
0, 4, 5, 1, 0, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
8, 4, 5, 8, 5, 3, 9, 0, 5, 0, 3, 5, -1, -1, -1, -1,
9, 4, 5, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
4, 11, 7, 4, 9, 11, 9, 10, 11, -1, -1, -1, -1, -1, -1, -1,
0, 8, 3, 4, 9, 7, 9, 11, 7, 9, 10, 11, -1, -1, -1, -1,
1, 10, 11, 1, 11, 4, 1, 4, 0, 7, 4, 11, -1, -1, -1, -1,
3, 1, 4, 3, 4, 8, 1, 10, 4, 7, 4, 11, 10, 11, 4, -1,
4, 11, 7, 9, 11, 4, 9, 2, 11, 9, 1, 2, -1, -1, -1, -1,
9, 7, 4, 9, 11, 7, 9, 1, 11, 2, 11, 1, 0, 8, 3, -1,
11, 7, 4, 11, 4, 2, 2, 4, 0, -1, -1, -1, -1, -1, -1, -1,
11, 7, 4, 11, 4, 2, 8, 3, 4, 3, 2, 4, -1, -1, -1, -1,
2, 9, 10, 2, 7, 9, 2, 3, 7, 7, 4, 9, -1, -1, -1, -1,
9, 10, 7, 9, 7, 4, 10, 2, 7, 8, 7, 0, 2, 0, 7, -1,
3, 7, 10, 3, 10, 2, 7, 4, 10, 1, 10, 0, 4, 0, 10, -1,
1, 10, 2, 8, 7, 4, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
4, 9, 1, 4, 1, 7, 7, 1, 3, -1, -1, -1, -1, -1, -1, -1,
4, 9, 1, 4, 1, 7, 0, 8, 1, 8, 7, 1, -1, -1, -1, -1,
4, 0, 3, 7, 4, 3, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
4, 8, 7, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
9, 10, 8, 10, 11, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
3, 0, 9, 3, 9, 11, 11, 9, 10, -1, -1, -1, -1, -1, -1, -1,
0, 1, 10, 0, 10, 8, 8, 10, 11, -1, -1, -1, -1, -1, -1, -1,
3, 1, 10, 11, 3, 10, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
1, 2, 11, 1, 11, 9, 9, 11, 8, -1, -1, -1, -1, -1, -1, -1,
3, 0, 9, 3, 9, 11, 1, 2, 9, 2, 11, 9, -1, -1, -1, -1,
0, 2, 11, 8, 0, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
3, 2, 11, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
2, 3, 8, 2, 8, 10, 10, 8, 9, -1, -1, -1, -1, -1, -1, -1,
9, 10, 2, 0, 9, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
2, 3, 8, 2, 8, 10, 0, 1, 8, 1, 10, 8, -1, -1, -1, -1,
1, 10, 2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
1, 3, 8, 9, 1, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
0, 9, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
0, 3, 8, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]);
