var fromPrototype = function(prototype, object) {
  var newObject = Object.create(prototype);
 
  for (var prop in object) {
    if (object.hasOwnProperty(prop)) {
      newObject[prop] = object[prop];      
    }
  }
 
  return newObject;
};


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

