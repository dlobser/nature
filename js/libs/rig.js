function peep(params){
	
	this.params;
	this.CTRL = new THREE.Object3D();
	//( radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded )
	
	//attempting to use geoDivs to set the divs on my geo does NOT work - fix later
	this.options = {
		geoDivs:3,
		geo:new THREE.CylinderGeometry( 1,1,1,6,1),
		geo2:new THREE.SphereGeometry(1,6,6),
		color1:0xffffff,
		color2:0xffffff,
		color3:0xffffff,
		color4:0xffffff,
		color5:0xffffff,
		
		anim:{
			size:0,
			num:0,
			x:0,
			y:0,
			z:0,
			x1:[],
			y1:[],
			z1:[],
			x2:[],
			y2:[],
			z2:[],
			x3:[],
			y3:[],
			z3:[],
			x4:[],
			y4:[],
			z4:[],
			off:[],
			sc:[],
			def:[]
		}
		
	};
	
	for (key in this.options.anim){
		if (this.options.anim[key] instanceof Array){
			this.options.anim[key] = Array.apply(null, new Array(100)).map(Number.prototype.valueOf,0);
		}
	}

	this.options.anim.sc = Array.apply(null, new Array(100)).map(Number.prototype.valueOf,1);
	
	
	if(params === undefined) this.params = this.options;
	else this.params = params;

	this.geometry = (this.params.geo !== undefined) ? this.params.geo : this.options.geo;
	this.geometry2 = (this.params.geo2 !== undefined) ? this.params.geo2 : this.options.geo2;
	this.geometry.mergeVertices();
	this.geometry2.mergeVertices();
	
	this.rotColor = Math.random() * 16777215;
	this.hexValue = parseInt(this.rotColor , 16);
	
	
	this.geoDivs = (this.params.geoDivs !== undefined) ? this.params.geoDivs : this.options.geoDivs;
	this.color1 = (this.params.color1 !== undefined) ? this.params.color1 : this.hexValue;
	this.color2 = (this.params.color2 !== undefined) ? this.params.color2 : this.options.color2;
	this.color3 = (this.params.color3 !== undefined) ? this.params.color3 : this.options.color3;
	this.color4 = (this.params.color4 !== undefined) ? this.params.color4 : this.options.color4;
	this.color5 = (this.params.color5 !== undefined) ? this.params.color5 : this.options.color5;
	
	this.material =  new THREE.MeshLambertMaterial( { color:this.color1, shading: THREE.SmoothShading } );
	
	this.branches = [];
	this.fruit = [];
	this.msh = [];
	this.sc = [];
	this.rt = [];
	this.pos = [];
	
}

peep.prototype = {
	
	id:0,
	speed:0,
	q:0,
	
	part:function(px,py,pz,	sx,sy,sz,	p2x,p2y,p2z,	namer,color){
	
		/*construction of the heirarchy and best practice for parenting
		  the 'pos' of one link should be parented to the 'rt' of its parent - becoming children[1]
		  
			pos-
				|
				|[0]           [1]
				-rt------------pos-
				  |				|
				  |				|
				  sc		   -rt-
				   |			   |
				   |			   |
				  mesh			   -sc-
									  |
									  |
									  -mesh
	
		*/
		
		
		//this.material.color.setHex(color);
		
		var pos = new THREE.Vector3(px,py,pz);
		var scl = new THREE.Vector3(sx,sy,sz);
		var pos2 = new THREE.Vector3(p2x,p2y,p2z);
		
		
		this.mesh = new THREE.Mesh( this.geometry, this.material );
		this.mesh2 = new THREE.Mesh( this.geometry2, this.material );
							
		this.mesh.updateMatrix();
		this.mesh.matrixAutoUpdate = true;					
		this.mesh.position = pos;	
		this.mesh.castShadow = true;
		
		
		this.scalar = new THREE.Object3D();	

		this.mesh.name = "mesh_"+namer;
		
		this[ this.mesh.name ] = this.mesh;
		
		this.msh.push(this.mesh);
		
		this.scalar.name = "sc_"+namer;	
		
		this[ this.scalar.name ] = this.scalar;
		
		this.sc.push(this.scalar);

		this.scalar.matrixAutoUpdate = true;					
		this.scalar.add(this.mesh);					
		this.scalar.scale = scl;	
		
		this.rotator = new THREE.Object3D();
		//this.rotator.useQuaternion = true;

		this.rotator.name = "rt_"+namer;	

		this[ this.rotator.name ] = this.rotator;
		
		this.rt.push(this.rotator);
		
		this.rotator.matrixAutoUpdate = true;
		
		this.rotator.add(this.scalar);	
		
		this.poser = new THREE.Object3D();	
		
		this.poser.name = "pos_"+namer;
		
		this.poser.matrixAutoUpdate = true;					
		this.poser.add(this.rotator);	
		
		
		this.mesh2.scale.x = sx;
		this.mesh2.scale.y = sx;
		this.mesh2.scale.z = sx;
		
		this.mesh2.rotation.y = Math.PI/6;
		this.mesh2.name = "sphere";
		
		
		this.msh.push(this.mesh2);
		this.poser.add(this.mesh2);					
		
		
		this.poser.position = pos2;	

		this[ this.poser.name ] = this.poser;	
		
		this.pos.push(this.poser);
		return this.poser;
	},
	
	branchSquares:function(params){
	
	
		var fruitSize = new THREE.Vector3(5,5,5);
		
		//number of joints on each branch
		var num = (params.num!==undefined) ? params.num : 10;
		var sx  = (params.scale!==undefined) ? params.scale[0] : 2;
		var sy  = (params.scale!==undefined) ? params.scale[1] : 10;
		var sz  = (params.scale!==undefined) ? params.scale[2] : 2;
		//scalar value
		var ss  = (params.ss!==undefined) ? params.ss : 1;
		
		//number of times to branch
		var leaves 	= (params.leaves!==undefined) ? params.leaves : 3;
		
		//divs is the divisor of num to determine where branches branch
		var divs 	= (params.divs!==undefined) ? params.divs : 8;
		
		//when branches branch, how many times
		var rads 	= (params.rads!==undefined) ? params.rads : 2;
		
		//whether there is fruit or not
		var fruit 	= (params.fruit!==undefined) ? params.fruit : false;
		var fruitScale = (params.fruitScale!==undefined) ? params.fruitScale : fruitSize;
		
		this.leaves = leaves;
		
		var leafJoints = [];
		var leafDivs = [];
		var leafss = [];
		var angles = [];
		var term = [];
		var jScale = [];

		
		for ( var i = 0 ; i <= leaves ; i++){
			angles[i] = (params["angle" + i]!==undefined) ? params["angle" + i] : Math.PI/5;
			leafss[i] = (params["leaf" + i + "ss"]!==undefined) ? params["leaf" + i + "ss"] : ss;
			leafJoints[i] = (params["leafJoint" + i]!==undefined) ? params["leafJoint" + i] : divs;
			jScale[i] = (params["jScale" + i]!==undefined) ? new THREE.Vector3(params["jScale" + i][0],  params["jScale" + i][1],  params["jScale" + i][2]) : new THREE.Vector3(-1,-1,-1);
			leafDivs[i] = (params["leafDiv" + i]!==undefined) ? params["leafDiv" + i] : divs;
		}

		
		//term is terminal - which branch needs a cap basically
		//this seems not very smart at the moment
		//in the params if you specify a term, fruits or branches will spring forth - 
		//term1:1, term2:2 is the same as term2:1, term1:2
		for ( var i = 0 ; i < 6 ; i++){
			term[i] = (params["term" + i]!==undefined) ? params["term" + i] : -100;
			//console.log(term[i]);
		}
		
		this.big = this.part(0,.5,0,	sx,sy,sz,	0,0,0,   "big",this.color1);
		var that = this;
		
		var geo = new THREE.SphereGeometry(1,12,12);
		
				var path = "textures/bmap.";
				var format = '.jpg';
				var urls = [
					path + '04' + format, path + '02' + format,
					path + '05' + format, path + '06' + format,
					path + '01' + format, path + '03' + format
				];

				var textureCube = THREE.ImageUtils.loadTextureCube( urls );
				var mat = new THREE.MeshBasicMaterial( { color: 0xffffff, envMap: textureCube } );
		//var mat =  new THREE.MeshLambertMaterial( { shading: THREE.SmoothShading,color:this.color2 } );
		geo.mergeVertices();
		
		stringer(this.big, num, 0,0,0,Math.floor(num/2),sx,sy,sz,ss,divs);
		
		//len becomes num in the branching part
		function stringer(obj,num,id,idq,leaf,len,sx,sy,sz,ss,divs)
		{		
			
			//if it's the first item, make a new array for it and push it onto the array of branches
			if(id==0){
				obj.branch = [];
				obj.branch.name = leaf;
				obj.branch.push(obj.children[0]);
				that.branches.push(obj.branch);
			}
			

			num--;
			
			//makes a boolean to check if we're at the end, why end isn't 0 I don't know
			if(num==1)
				var end = true;
			else
				var end = false;
			
			if( num > 0 ){
			
				id++;
				
				this.big = that.part(0,.5,0,	sx,sy,sz,	0,sy,0,   "big"+id, that.color1);

				//add items to the last array in the branches array
				that.branches[that.branches.length-1].push(this.big);
				
				this.big.idq = idq;
				
				var joint = new THREE.Object3D();
							joint.matrixAutoUpdate = true;	
							joint.updateMatrix();						
							joint.name = "joint";
							
				//obj.children[0].add(stringer(this.big,num,id,num,leaf,len,sx*ss,sy*ss,sz*ss,ss,divs));
				//obj.children[0].num=num;
				
				obj.children[0].add(stringer(this.big,num,id,num,leaf,len,sx*ss,sy*ss,sz*ss,ss,divs));
				obj.children[0].num=num;
				
				//if we're terminal
				for ( var i = 0 ; i < term.length ; i++){
					if(end && leaf == leaves-term[i]){
					
						if (fruit)
							makeFruit();
						else
							makeSplit(1,2,2);
						
					}
				}
				
				//get variables then make new branches
				if( num % divs == 0 && leaf < leaves && num>1){
				
					//leaf increments per branch
					var leafSS = leafss[leaf] || 1;
					var angle  = angles[leaf] || Math.PI/5;
					
					makeSplit(2,1,1,leafSS,angle);
				}
				
				//this is the function that creates branches
				function makeSplit(child,numDiv,lenDiv,newSS,angle){
				
					for (var i = 0 ; i < rads ; i ++){
							
							//just convert these three values into one for easy access
							var szr = new THREE.Vector3(sx,sy,sz);
						//	var theseDivs = (leafJoints[leaf] == divs) ? Math.floor(len/numDiv) : Math.floor(leafJoints[leaf]);
							
							//just making a new variable for readability
							var theseDivs = leafJoints[leaf+1];
							
							//if that one is the same as the parent number of divs, assume it hasn't been set and automatically set it
							if(theseDivs == divs){
								theseDivs = Math.floor(len/numDiv);
							}
							
							//setting the joint scale based on the leaf level
							var scalar = (jScale[leaf+1].x != -1 && jScale[leaf+1].x <= szr.x) ? jScale[leaf+1] : szr;
							//var scalar = jScale[leaf];
							
						//	console.log("leaf: " + leaf + " theseDivs: " + theseDivs + " leafJoints: " + leafJoints[leaf] + " divs: " + divs);
							var joint = new THREE.Object3D();
							var divisions = (leafDivs[leaf+1].x != divs) ? leafDivs[leaf+1] : divs;
							//var divisions  = leafDivs[leaf] || divs;
						//	console.log("divisions:  " + divisions);
							
							joint.matrixAutoUpdate = true;	
							joint.updateMatrix();						
							joint.name = "joint";
							
							obj.children[0].add(joint);
						//	console.log(obj.children[0].children[i+child]);
							obj.children[0].children[i+child].rotation.y = i*((Math.PI*2)/rads);
							//if(i>0)
							//obj.children[0].children[i+child].scale.x = -1;

							obj.children[0].children[i+child].add(stringer(this.big,	theseDivs,0,	num,leaf+1,Math.floor(len/lenDiv), 	scalar.x,scalar.y,scalar.z,newSS,	divisions));
							obj.children[0].children[i+child].children[0].rotation.x = angle;
							obj.children[0].children[i+child].children[0].position.y = szr.y;
							
							obj.children[0].children[i+child].children[0].children[0].children[0].scale = scalar;
							//obj.children[0].children[i+child].children[0].children[1].scale = new THREE.Vector3(.1,.1,.1);
							
							//console.log(obj.children[0].children[i+child].children[0].children[1].scale.x);
						}
				}
				
				//this adds fruit
				function makeFruit(child,numDiv,lenDiv){
				
					for (var i = 0 ; i < rads ; i ++){
					
							var mesh = new THREE.Mesh(geo,mat);
							var positioner = new THREE.Vector3(obj.children[0].position.x,obj.children[0].position.y+sy,obj.children[0].position.z);
							mesh.position = positioner;
							mesh.matrixAutoUpdate = true;	
							mesh.updateMatrix();	
		
							var scalar = fruitScale;
							mesh.scale = scalar;
							
							that.fruit.push(mesh);
							that.msh.push(mesh);
							obj.children[0].add(mesh);
						}
				}
				
				return obj;
			}
		}
		that.branches.sort(function(a,b){return a-b});
		return this.big;
	},
	
	animate:function(){
	
		for ( i in this.branches ){
			if(i>=0){
				//j is each branch
				for(j in this.branches[i]){
					if(j>=0){
						
						//separate branches into layers of branches by querying the name of each branch array
						for (var q = 0 ; q <= this.leaves ; q++){
							if( this.branches[i].name==q && j < this.branches[i].length-1 ){
							
								var rot1 = new THREE.Vector3(this.options.anim.x1[q],this.options.anim.y1[q],this.options.anim.z1[q]);
								var rot2 = new THREE.Vector3(this.options.anim.x2[q],this.options.anim.y2[q],this.options.anim.z2[q]);
								
								var sinR = new THREE.Vector3(
									Math.sin(j*this.options.anim.x3[q]*3),
									Math.sin(j*this.options.anim.y3[q]*3),
									Math.sin(j*this.options.anim.z3[q]*3)
								);
								
								var R = new THREE.Vector3(
									this.options.anim.x3[q]*3,
									this.options.anim.y3[q]*3,
									this.options.anim.z3[q]*3
								);
								
								var spine = new THREE.Vector3(
									this.options.anim.x4[q]*this.branches[i][1].idq*this.options.anim.off[q],
									this.options.anim.y4[q]*this.branches[i][1].idq*this.options.anim.off[q],
									this.options.anim.z4[q]*this.branches[i][1].idq*this.options.anim.off[q]
								);
								
								var scalar = new THREE.Vector3(this.options.anim.sc[q],this.options.anim.sc[q],this.options.anim.sc[q]);
								
								var motion = new THREE.Vector3(
									(Math.sin(((j+1)/this.options.anim.size)+this.options.anim.num)*((j+1)*this.options.anim.x))*(i+1)*(this.options.anim.x3[q]/(i+1)),
									(Math.sin(((j+1)/this.options.anim.size)+this.options.anim.num)*((j+1)*this.options.anim.y))*(i+1)*(this.options.anim.y3[q]/(i+1)),
									(Math.sin(((j+1)/this.options.anim.size)+this.options.anim.num)*((j+1)*this.options.anim.z))*(i+1)*(this.options.anim.z3[q]/(i+1))
								);
								
								
								this.branches[i][j].rotation = spine.add(rot1.add(motion));							
								this.branches[i][0].rotation = rot2;
								//this.branches[i][j].children[0].rotation = R;
								this.branches[i][j].scale = scalar;
							}
						}
					}
				}
			}	
		}
		
	}
	
}