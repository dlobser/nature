function peep(params){
	
	if(params.altGeo !=undefined)
	this.altGeo = params.altGeo;
		

//	console.log(this.altGeo);
	this.params = this.makeParams(params);
	//console.log(this.params);
	this.CTRL = new THREE.Object3D();
	//( radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded )
	
	//attempting to use geoDivs to set the divs on my geo does NOT work - fix later
	this.defaults = {
		geo:new THREE.CylinderGeometry( 0.01,0.01,1,2,1),
		geo2:new THREE.SphereGeometry(0.0058,12,6)
	}

	
	this.geometry = (this.params.geo !== undefined) ? this.params.geo : this.defaults.geo;
	this.geometry2 = (this.params.geo2 !== undefined) ? this.params.geo2 : this.defaults.geo2;
	this.geometry.mergeVertices();
	this.geometry2.mergeVertices();
	
	this.rotColor = Math.random() * 16777215;
	this.hexValue = parseInt(this.rotColor , 16);
	
	
	this.geoDivs = (this.params.geoDivs !== undefined) ? this.params.geoDivs : this.defaults.geoDivs;
	this.color1 = (this.params.color1 !== undefined) ? this.params.color1 : this.hexValue;
	this.color2 = (this.params.color2 !== undefined) ? this.params.color2 : this.defaults.color2;
	this.color3 = (this.params.color3 !== undefined) ? this.params.color3 : this.defaults.color3;
	this.color4 = (this.params.color4 !== undefined) ? this.params.color4 : this.defaults.color4;
	this.color5 = (this.params.color5 !== undefined) ? this.params.color5 : this.defaults.color5;
	
	this.material =  new THREE.MeshLambertMaterial( { color:this.color1, shading: THREE.SmoothShading } );
	
	this.path = "textures/dmap.";
	this.format = '.jpg';
	this.urls = [
		this.path + '04' + this.format, this.path + '02' + this.format,
		this.path + '05' + this.format, this.path + '06' + this.format,
		this.path + '01' + this.format, this.path + '03' + this.format
	];
	
	
	this.material_depth = new THREE.MeshDepthMaterial();

	this.textureCube = THREE.ImageUtils.loadTextureCube( this.urls );
	this.mat = new THREE.MeshLambertMaterial( { color: 0xffffff, envMap: this.textureCube } );
	
	
	
	this.branches = [];
	this.fruit = [];
	this.msh = [];
	this.sc = [];
	this.rt = [];
	this.pos = [];
	this.joints = [];
	
}

peep.prototype = {
	
	id:0,
	speed:0,
	q:0,
	
	part:function(px,py,pz,	sx,sy,sz,	p2x,p2y,p2z,	namer,color,geom){
	
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
		

		var thisGeo = geom || this.geometry;
		
	
		
		this.mesh = new THREE.Mesh( thisGeo, this.mat );
		this.mesh2 = new THREE.Mesh( this.geometry2, this.mat );
		this.mesh3 = new THREE.Mesh( this.geometry2, this.mat );
		
		if(!debug){
		this.mesh.visible = false;
		this.mesh2.visible = false;
		this.mesh3.visible = false;
		}
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
		
		//add sphere
		this.mesh2.scale.x = sx;
		this.mesh2.scale.y = sx;
		this.mesh2.scale.z = sx;
		
		this.mesh2.rotation.y = Math.PI/6;
		this.mesh2.name = "sphere_" + namer;
		
		this.mesh3.scale.x = sx;
		this.mesh3.scale.y = sx;
		this.mesh3.scale.z = sz;
		
		this.mesh3.position.y = sy;
		
		this.mesh3.rotation.y = Math.PI/6;
		this.mesh3.name = "sphere2_" + namer;
		
		
		this.msh.push(this.mesh2);
		this.poser.add(this.mesh2);		
		//this.poser.add(this.mesh3);							
		
		
		this.poser.position = pos2;	

		this[ this.poser.name ] = this.poser;	
		
		this.pos.push(this.poser);
		return this.poser;
	},
	
	makeParams:function(params){
		//console.log(params);
		this.params = params;
		this.p = {
			
			geoDivs:3,
			color1:0xffffff,
			color2:0xffffff,
			color3:0xffffff,
			color4:0xffffff,
			color5:0xffffff,
			
			anim:{
				size:0,
				speed:0,
				speed2:0,
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
		
		//console.log(params);
		if(params.anim !== undefined)
		this.p.anim.num = params.anim.num || 0 ;
		
		for (key in this.p.anim){
			if (this.p.anim[key] instanceof Array){
				this.p.anim[key] = Array.apply(null, new Array(this.p.leaves)).map(Number.prototype.valueOf,0);
			}
		}
		
		
		this.p.anim.sc = Array.apply(null, new Array(10)).map(Number.prototype.valueOf,1);
		this.p.anim = $.extend(this.p.anim,params.anim);
		this.p.fruitSize = new THREE.Vector3(0.001,0.001,0.001);
		
		//number of joints on each branch
		
		this.p.num = (params.num!==undefined) ? params.num : 10;
		this.p.scale  = (params.scale!==undefined) ? params.scale : [2,10,2];
		this.p.sx  = (params.scale!==undefined) ? params.scale[0] : 2;
		this.p.sy  = (params.scale!==undefined) ? params.scale[1] : 10;
		this.p.sz  = (params.scale!==undefined) ? params.scale[2] : 2;
		//scalar value
		this.p.ss  = (params.ss!==undefined) ? params.ss : 1;
		//console.log(params.anim);
		//console.log(this.p.anim);
		//number of times to branch
		this.p.leaves 	= (params.leaves!==undefined) ? params.leaves : 3;
		
		//divs is the divisor of num to determine where branches branch
		this.p.divs 	= (params.divs!==undefined) ? params.divs : 8;
		
		//when branches branch, how many times
		this.p.rads 	= (params.rads!==undefined) ? params.rads : 2;
		this.p.animFunc 	= (params.animFunc!==undefined) ? params.animFunc : 2;
		
		//whether there is fruit or not
		this.p.fruit 	= (params.fruit!==undefined) ? params.fruit : false;
		this.p.fruitScale = (params.fruitScale!==undefined) ? params.fruitScale : this.p.fruitSize;
		
		this.p.anim.speed = (params.anim != undefined && params.anim.speed!==undefined) ? params.anim.speed : 0.001;
		this.p.anim.speed2  = (params.anim != undefined &&params.anim.speed2!==undefined) ? params.anim.speed2: 0.001;;
		this.p.anim.x  = (params.anim != undefined &&params.anim.x!==undefined) ? params.anim.x : 0;
		this.p.anim.y  = (params.anim != undefined &&params.anim.y!==undefined) ? params.anim.y : 0;
		this.p.anim.z  = (params.anim != undefined &&params.anim.z!==undefined) ? params.anim.z : 0;
		this.p.anim.size  = (params.anim != undefined &&params.anim.size!==undefined) ? params.anim.size : 1;
		//this.p.leaves = leaves;
		
		this.p.leafJoints = [];
		this.p.leafDivs = [];
		this.p.leafss = [];
		this.p.angles = [];
		this.p.term = [];
		this.p.jScale = [];
		this.p.leafRads = [];

		
		for ( var i = 0 ; i < this.p.leaves ; i++){
			this.p.angles[i] = (params["angle" + i]!==undefined) ? params["angle" + i] : Math.PI/5;
			this.p.leafss[i] = (params["leaf" + i + "ss"]!==undefined) ? params["leaf" + i + "ss"] : this.p.ss;
			this.p.leafJoints[i] = (params["leafJoint" + i]!==undefined) ? params["leafJoint" + i] : this.p.divs;
			this.p.jScale[i] = (params["jScale" + i]!==undefined) ? new THREE.Vector3(params["jScale" + i][0],  params["jScale" + i][1],  params["jScale" + i][2]) : new THREE.Vector3(-1,-1,-1);
			this.p.leafDivs[i] = (params["leafDiv" + i]!==undefined) ? params["leafDiv" + i] : this.p.divs;
			this.p.leafRads[i] = (params["leafRads" + i]!==undefined) ? params["leafRads" + i] : this.p.rads;
		}
		
		//console.log(params.angles);
		for ( var i = 0 ; i <= this.p.leaves ; i++){
		
			this.p.angles[i] = (params.angles !== undefined && params.angles[i]!==undefined) ? params.angles[i] : Math.PI/5;
			this.p.leafss[i] = (params.leafss !== undefined && params.leafss[i] !== undefined) ? params.leafss[i] : this.p.ss;
			this.p.leafJoints[i] = (params.leafJoints !== undefined && params.leafJoints[i]!==undefined) ? params.leafJoints[i] : this.p.divs;
			this.p.jScale[i] = (params.jScale !== undefined && params.jScale[i]!==undefined) ? new THREE.Vector3(params.jScale[i].x,  params.jScale[i].y,  params.jScale[i].z) : new THREE.Vector3(-1,-1,-1);
				if(params["jScale" + i]!==undefined) this.p.jScale[i] =  new THREE.Vector3(params["jScale" + i][0],  params["jScale" + i][1],  params["jScale" + i][2]);

			this.p.leafDivs[i] = (params.leafDivs !== undefined && params.leafDivs[i]!==undefined) ? params.leafDivs[i] : this.p.divs;
			this.p.term[i] = (params.term !== undefined && params.term[i]!==undefined) ? params.term[i] : -100;
			this.p.leafRads[i] = (params.leafRads !== undefined && params.leafRads[i]!==undefined) ? params.leafRads[i] : this.p.rads;
			//	if(this.p.leafRads[i] == this.p.leafJoints[i]) this.p.leafRads[i]
		}

		//console.log(this.p);
		//console.log(params);
		return this.p;
	
	},
	
	branchSquares:function(){
	
		this.big = this.part(0,.5,0,	this.p.sx,this.p.sy,this.p.sz,	0,0,0,   "big",this.color1);
	//	this.big = new THREE.Object3D();
	//	this.big.add(new THREE.Object3D());
		var that = this;
		
		var geo = new THREE.SphereGeometry(1,12,12);
		geo.mergeVertices();

	
		stringer(this.big, that.p.num, 0,0,0,Math.floor(that.p.num/2),that.p.sx,that.p.sy,that.p.sz,that.p.ss,that.p.divs);
		
		//len becomes num in the branching part
		function stringer(obj,num,id,idq,leaf,len,sx,sy,sz,ss,divs)
		{		
			
			num--;
			
			//makes a boolean to check if we're at the end, why end isn't 0 I don't know
			if(num==1)
				var end = true;
			else
				var end = false;
			
			if( num > 0 ){
			
				//if it's the first item, make a new array for it and push it onto the array of branches
				if(id==0){
					obj.branch = [];
					obj.branch.name = leaf;
					obj.branch.push(obj.children[0]);
					that.branches.push(obj.branch);
				}
			
			
				id++;
				
//				console.log(that.altGeo);
				var myGeo;
				
				if(that.altGeo != undefined){
					if(that.altGeo.length>0){
						myGeo = that.altGeo[leaf];
					}
				}
				
				//console.log(myGeo);
				this.big = that.part(0,.5,0,	sx,sy,sz,	0,sy,0,   "big"+id, that.color1,myGeo);

				//add items to the last array in the branches array
				that.branches[that.branches.length-1].push(this.big);
				
				this.big.idq = idq;
				
			
				
				obj.children[0].add(stringer(this.big,num,id,num,leaf,len,sx*ss,sy*ss,sz*ss,ss,divs));
				obj.children[0].num=num;
				
				//if we're terminal - this is all messed up
			
				for ( var i = 0 ; i < that.p.term.length ; i++){
					if(end && leaf == that.p.leaves-that.p.term[i]){
					
						if (that.p.fruit){
						
							makeFruit();
							}
						else{
							//console.log("fruit ain't true, and true ain't fruit");
						}
						
					}
				}
			
				var sub;
				if(divs==1)
					sub=0;
				else
					sub=1;
				
				//get variables then make new branches
				if( num % divs-sub == 0 && leaf < that.p.leaves && that.p.num > 1){
				
					//leaf increments per branch
					var leafSS = that.p.leafss[leaf] || 1;
					var angle  = (that.p.angles[leaf]!=undefined) ? that.p.angles[leaf] : Math.PI/5;
					var myRads = that.p.leafRads[leaf] || 2;
					
					//console.log(that.p.angles[leaf]);
					
					makeSplit(2,1,1,leafSS,angle,myRads);
				}
				
				//this is the function that creates branches
				function makeSplit(child,numDiv,lenDiv,newSS,angle,rads){
				
					for (var i = 0 ; i < rads ; i ++){
					
	
							var szr = new THREE.Vector3(sx,sy,sz);
							var theseDivs = that.p.leafJoints[leaf+1];
							var scalar = (that.p.jScale[leaf+1].x != -1 && that.p.jScale[leaf+1].x <= szr.x) ? that.p.jScale[leaf+1] : szr;
							var joint = new THREE.Object3D();
							var divisions = that.p.leafDivs[leaf+1];
							
							//joint is an extra piece made for parenting the new branches to
							joint.matrixAutoUpdate = true;	
							joint.updateMatrix();						
							joint.name = leaf;
							that.joints.push(joint);
						
							obj.children[0].add(joint);
							obj.children[0].children[i+child].rotation.y = i*((Math.PI*2)/rads);
							obj.children[0].children[i+child].add(stringer(this.big,	theseDivs,0,	num,leaf+1,Math.floor(len/lenDiv), 	scalar.x,scalar.y,scalar.z,newSS,	divisions));
							obj.children[0].children[i+child].children[0].rotation.x = angle;
							obj.children[0].children[i+child].children[0].position.y = szr.y;
							obj.children[0].children[i+child].children[0].children[0].children[0].scale = scalar;

							
						}
				}
				
				//this adds fruit
				function makeFruit(child,numDiv,lenDiv){
				
					//for (var i = 0 ; i < that.p.rads ; i ++){
					
							var mesh = new THREE.Mesh(geo,that.mat);
							var positioner = new THREE.Vector3(obj.children[0].position.x,obj.children[0].position.y+sy,obj.children[0].position.z);
							mesh.name = "fruit";
							mesh.position = positioner;
							mesh.matrixAutoUpdate = true;	
							mesh.updateMatrix();	
		
							var scalar = that.p.fruitScale;
							mesh.scale = new THREE.Vector3(0,0,0);
							
							that.fruit.push(mesh);
							that.msh.push(mesh);
							//console.log("fruiter");
							//console.log(obj.children[0].id);
							obj.children[0].add(mesh);
					//	}
				}
				
				return obj;
			}
			
			
		}
		//that.branches.sort(function(a,b){return a-b});
		return this.big;
	},
	
	animate:function(){
	
		for(i in this.joints){
			var thing = this.joints[i];
		//	thing.rotation.y += .1;
		}
		for ( i in this.branches ){
			if(i>=0){
				//j is each branch
				for(j in this.branches[i]){
					if(j>=0){
						
						//separate branches into layers of branches by querying the name of each branch array
						for (var q = 0 ; q <= this.p.leaves ; q++){
						
						
							if( this.branches[i].name==q && j < this.branches[i].length-1 ){
							
								var idq = this.branches[i][1].idq;
								var size = this.p.anim.size;
								var num = this.p.anim.num;
								var angle = this.branches[i][0].parent.parent.rotation.y;
								var limbRot = this.branches[i][j].children[0].rotation;
								var baseRot = this.branches[i][0].rotation;
								
								//this.branches[i][1].parent.parent.parent.rotation.y;
								
								var rot1 = new THREE.Vector3(this.p.anim.x1[q],this.p.anim.y1[q],this.p.anim.z1[q]);
								var rot2 = new THREE.Vector3(this.p.anim.x2[q],this.p.anim.y2[q],this.p.anim.z2[q]);
								//+ Math.sin(this.branches[i][0].parent.parent.rotation.y+this.p.anim.num)
								
								var sinR = new THREE.Vector3(
									Math.sin(j*this.p.anim.x3[q]*3),
									Math.sin(j*this.p.anim.y3[q]*3),
									Math.sin(j*this.p.anim.z3[q]*3)
								);
								
								var R = new THREE.Vector3(
									this.p.anim.x3[q]*3,
									this.p.anim.y3[q]*3,
									this.p.anim.z3[q]*3
								);
								
							
								/*	var spine = new THREE.Vector3(
									this.p.anim.x4[q]*(Math.sin(this.branches[i][1].idq*this.p.anim.off[q]/this.p.anim.size)*(j+1)/10),
									this.p.anim.y4[q]*(Math.sin(this.branches[i][1].idq*this.p.anim.off[q]/this.p.anim.size)*(j+1)/10),
									this.p.anim.z4[q]*(Math.sin(this.branches[i][1].idq*this.p.anim.off[q]/this.p.anim.size)*(j+1)/10)
								
								);
								*/
								var spine = new THREE.Vector3(
									this.p.anim.x4[q]*(Math.sin(this.branches[i][1].idq*this.p.anim.off[q]/this.p.anim.size)*((j+1)/100)),
									this.p.anim.y4[q]*(Math.sin(this.branches[i][1].idq*this.p.anim.off[q]/this.p.anim.size)*((j+1)/100)),
									this.p.anim.z4[q]*(Math.sin(this.branches[i][1].idq*this.p.anim.off[q]/this.p.anim.size)*((j+1)/100))
								
								);
								
								var scalar = new THREE.Vector3(this.p.anim.sc[q],this.p.anim.sc[q],this.p.anim.sc[q]);
								
								var motion = new THREE.Vector3(
									(Math.sin(((j+1)/this.p.anim.size)+this.p.anim.num)*((j+1)*this.p.anim.x))*(i+1)*(this.p.anim.x3[q]/(i+1)),
									(Math.sin(((j+1)/this.p.anim.size)+this.p.anim.num)*((j+1)*this.p.anim.y))*(i+1)*(this.p.anim.y3[q]/(i+1)),
									(Math.sin(((j+1)/this.p.anim.size)+this.p.anim.num)*((j+1)*this.p.anim.z))*(i+1)*(this.p.anim.z3[q]/(i+1))
								);
								
								
								this.branches[i][j].rotation = spine.add(rot1.add(motion));		
								
								//console.log(q);
								//if(q>0)console.log(this.branches[i][1].parent.parent.parent.rotation.y += .01);
								this.branches[i][0].rotation = rot2;
								//this.branches[i][j].children[0].rotation = R;
								this.branches[i][j].scale = scalar;
								
								//if(this.p.animFunc!=undefined){
									eval(this.p.animFunc);
									//this.p.animFunc();
								//}
								
							}
						}
					}
				}
			}	
		}
		
	}
	
}