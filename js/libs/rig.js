function peep(params){
	
	//if you give it geo, it will use that, otherwise it will use a default cube

	this.params;
	this.CTRL = new THREE.Object3D();
	//( radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded )
	
	//attempting to use geoDivs to set the divs on my geo does NOT work - fix later
	this.options = {
		geoDivs:3,
		geo:new THREE.CylinderGeometry( 1,1,1,6,1),
		geo2:new THREE.SphereGeometry(1,6,6),
		color1:0xffffff,
		color2:0x00ffff,
		color3:0xffffff,
		color4:0xffffff,
		color5:0xffffff
	};
	
	
	if(params === undefined) this.params = this.options;
	else this.params = params;
	
	//console.log(this.params.color2);
	//console.log("BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB");
	//console.log(params);
	this.geometry = (this.params.geo !== undefined) ? this.params.geo : this.options.geo;
	this.geometry2 = (this.params.geo2 !== undefined) ? this.params.geo2 : this.options.geo2;
	
	this.rotColor = Math.random() * 16777215;
	this.hexValue = parseInt(this.rotColor , 16);
	
	
	this.geoDivs = (this.params.geoDivs !== undefined) ? this.params.geoDivs : this.options.geoDivs;
	this.color1 = (this.params.color1 !== undefined) ? this.params.color1 : this.hexValue;
	this.color2 = (this.params.color2 !== undefined) ? this.params.color2 : this.options.color2;
	this.color3 = (this.params.color3 !== undefined) ? this.params.color3 : this.options.color3;
	this.color4 = (this.params.color4 !== undefined) ? this.params.color4 : this.options.color4;
	this.color5 = (this.params.color5 !== undefined) ? this.params.color5 : this.options.color5;
	
	this.material =  new THREE.MeshLambertMaterial( { color:0xffffff, shading: THREE.SmoothShading } );
	
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
	//CTRL:new THREE.Object3D(),
	
	
	/*
	//this.geometry is a cube set to a scale of 1,1,1 - this is true of every object that's created
	//It is placed inside a group which scales it to the desired size
	//this group is placed inside a group designated for 'rotation' although you can do anything with it
	//this group is placed inside 'poser' the top group, which is returned
	//each item's name is assigned to the peep object so it can be easily accessed later
	
	//(mesh offset xyz, scale xyz, controller position xyz, name, color)
	*/
	
	set:function(id){
		this.id = id;
	},
	
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
		
		this.poser.add(this.mesh2);					
		
		
		this.poser.position = pos2;	

		this[ this.poser.name ] = this.poser;	
		
		this.pos.push(this.poser);
		return this.poser;
	},
	
	creature:function(mx,my,mz,al,aw,ll,lw,ls,ex,ey,es) {
		
		
		this.CTRL.name = "CTRL";
		this.CTRL.mx = mx;
		this.CTRL.my = my;
		this.CTRL.mz = mz;
		
		this[  this.CTRL.name ] = this.CTRL;
		
		//(mesh offset xyz, scale xyz, controller position xyz, name, color)
		var rflArm = this.part(0,-.5,0,aw,al,aw,0,-al,0,								"rflarm",this.color1);
		var rfuArm = this.part(0,-.5,0,aw,al,aw,	(mx-aw)*.5,(my)*-.5,(mz-aw)*.5,		"rfuarm",this.color1);
		
		var lflArm =	this.part(0,-.5,0,aw,al,aw,0,-al,0,								"lflarm",this.color1);
		var lfuArm =	this.part(0,-.5,0,aw,al,aw,	(mx-aw)*-.5,(my)*-.5,(mz-aw)*.5,	"lfuarm",this.color1);
		
		var rblArm = this.part(0,-.5,0,aw,al,aw,0,-al,0,								"rblarm",this.color1);
		var rbuArm = this.part(0,-.5,0,aw,al,aw,	(mx-aw)*.5,(my)*-.5,(mz-aw)*-.5,	"rbuarm",this.color1);
		
		var lblArm =	this.part(0,-.5,0,aw,al,aw,0,-al,0,								"lblarm",this.color1);
		var lbuArm =	this.part(0,-.5,0,aw,al,aw,	(mx-aw)*-.5,(my)*-.5,(mz-aw)*-.5,	"lbuarm",this.color1);
	
		var tail =	this.part(0,.5,0,aw,al,aw,		0,my*.5,(mz-aw)*-.5,				"tail",this.color1);
		
		var leye =	this.part(0,0,0,ex,ey,ex,es,0,mz*.5,								"leye",this.color2);
		var reye =	this.part(0,0,0,ex,ey,ex,-es,0,mz*.5,								"reye",this.color2);
		
		var lear =	this.part(0,.5,.5,ex,ey,ex,	mx*.5-(ex/2),(my*.5),(mz*.5)-(ex),					"lear",this.color1);
		var rear =	this.part(0,.5,.5,ex,ey,ex,	-1*((mx*.5)-(ex/2)),(my*.5),(mz*.5)-(ex),			"rear",this.color1);
	
		var bod =	this.part(0,0,0,mx,my,mz,0,0,0,										"bod",this.color1);
		
		this.rt_rfuarm.add(rflArm);			
		this.rt_lfuarm.add(lflArm);
		
		this.rt_rbuarm.add(rblArm);			
		this.rt_lbuarm.add(lblArm);
		
		this.rt_bod.add(rfuArm);
		this.rt_bod.add(lfuArm);
		
		this.rt_bod.add(rbuArm);
		this.rt_bod.add(lbuArm);
		
		this.rt_bod.add(lear);
		this.rt_bod.add(rear);
		
		this.rt_bod.add(tail);
		
		
		this.rt_bod.add(leye);
		this.rt_bod.add(reye);
		
		this.CTRL.add(bod);
		
		this.pos_bod.position.y = (my/2)+(al*2);
	},	
	
	frontSquares:function(obj,sx,sy,sz){
		
		var lboob =	this.part(0,0,0,	sx,sy,sz,	obj.sc_bod.scale.x/4,obj.sc_bod.scale.y/-6,obj.sc_bod.scale.z/2,								"lboob",obj.color1);
		var lnip=	this.part(0,0,0,	sx/5,sy/5,sz+(sz/10),	0,0,0,																				"lnip",obj.color3);
		
		var rboob =	this.part(0,0,0,	sx,sy,sz,	obj.sc_bod.scale.x/-4,obj.sc_bod.scale.y/-6,obj.sc_bod.scale.z/2,								"rboob",obj.color1);
		var rnip=	this.part(0,0,0,	sx/5,sy/5,sz+(sz/10),	0,0,0,																				"rnip",obj.color3);
		
		this.rt_lboob.add(lnip);
		this.rt_rboob.add(rnip);
		obj.rt_bod.add(lboob);
		obj.rt_bod.add(rboob);
		
	},
	
	groundSquares:function(obj,sx,sy,sz){
		
		var big =	this.part(0,-.5,0,	sx,sy,sz,	0,0,0,								"big",obj.color1);
		var med =	this.part(0,-.5,0,	sx-(sx*.5),sy+(sy/10),sx-(sx*.5),	0,sy,0,		"med",obj.color2);
		var small=	this.part(0,-.5,0,	sx-(sx*.8),sy+(sy/9),sx-(sx*.8),	0,sy*2,0,	"small",obj.color3);
		
		this.rt_med.add(small);
		this.rt_big.add(med);
		obj.CTRL.add(big);
		
	},
	
	parentSquares:function(num,sx,sy,sz,ss){
		
		this.big = this.part(0,.5,0,	sx,sy,sz,	0,0,0,   "big",this.color1);
		var i = 1;
		var that = this;
		
		
		stringer(this.big,num,sx,sy,sz,ss);
		
		function stringer(obj,num,sx,sy,sz,ss)
		{		
			
			var move = sy;
			
			if(num>0){
				
				num--;
				move++;
				
				this.big = that.part(0,.5,0,	sx,sy,sz,	0,sy,0,   "big"+num,that.color1);
				this.big.idq = move;
				obj.children[0].add(stringer(this.big,num,sx*ss,sy*ss,sz*ss,ss));
				
				return obj;
			}

		}
		
		
		return this.big;
		
		
	},
	
	branchSquares:function(params){
	
	
		var fruitSize = new THREE.Vector3(5,5,5);
		
		//number of joints on each branch
		var num = (params.num!==undefined) ? params.num : 10;
		var sx  = (params.scale!==undefined) ? params.scale.x : 2;
		var sy  = (params.scale!==undefined) ? params.scale.y : 10;
		var sz  = (params.scale!==undefined) ? params.scale.z : 2;
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
			jScale[i] = (params["jScale" + i]!==undefined) ? params["jScale" + i] : new THREE.Vector3(-1,-1,-1);
			leafDivs[i] = (params["leafDiv" + i]!==undefined) ? params["leafDiv" + i] : divs;
		}

		
		//term is terminal - which branch needs a cap basically
		//this seems not very smart at the moment
		//in the params if you specify a term, fruits or branches will spring forth - 
		//term1:1, term2:2 is the same as term2:1, term1:2
		for ( var i = 0 ; i < 6 ; i++){
			term[i] = (params["term" + i]!==undefined) ? params["term" + i] : -100;
			console.log(term[i]);
		}
		
		this.big = this.part(0,.5,0,	sx,sy,sz,	0,0,0,   "big",this.color1);
		var that = this;
		
		var geo = new THREE.SphereGeometry(1,6,6);
		var mat =  new THREE.MeshLambertMaterial( { shading: THREE.SmoothShading } );
		
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
							var scalar = (jScale[leaf].x != -1 && jScale[leaf].x <= szr.x) ? jScale[leaf] : szr;
							//var scalar = jScale[leaf];
							
							console.log("leaf: " + leaf + " theseDivs: " + theseDivs + " leafJoints: " + leafJoints[leaf] + " divs: " + divs);
							var joint = new THREE.Object3D();
							var divisions = (leafDivs[leaf+1].x != divs) ? leafDivs[leaf+1] : divs;
							//var divisions  = leafDivs[leaf] || divs;
							console.log("divisions:  " + divisions);
							
							joint.matrixAutoUpdate = true;	
							joint.updateMatrix();						
							joint.name = "joint";
							
							obj.children[0].add(joint);
							console.log(obj.children[0].children[i+child]);
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
							obj.children[0].add(mesh);
						}
				}
				
				return obj;
			}
		}
		that.branches.sort(function(a,b){return a-b});
		return this.big;
	},
	
	next:function(obj){
		
		if(obj==undefined)
			console.log("here");
		else if(obj.children[0].children[1]==undefined)
			console.log("here2");
		else
			return true;
	},
	
	iterate:function(obj){
		
		
		
		function stringer(){
		
		
		}
	
	},
	
	frontTail:function(obj,sx,sy){
		
		var weenie =	this.part(0,-.5,0,	sx,sy,sx,	0,(obj.sc_bod.scale.y/-2),(obj.sc_bod.scale.z/2)-sx/2,								"dk",obj.color1);
		
		obj.rt_bod.add(weenie);
		
	},
	
	hair:function(obj,sy){
		//console.log(this.color4);
		this.hair =	this.part(0,.5,0,	obj.sc_bod.scale.x,sy,obj.sc_bod.scale.z,	0,(obj.sc_bod.scale.y/2),0,								"hair",obj.color4);
		
		obj.rt_bod.add(this.hair);
		
	},
	
	dude:function(mx,my,mz,al,aw,ll,lw,ls,ex,ey,es) {
	
		this.CTRL.mx = mx;
		this.CTRL.my = my;
		this.CTRL.mz = mz;
		
		
		//this.CTRL = new THREE.Object3D();
		this.CTRL.name = "CTRL";
		
		this[  this.CTRL.name ] = this.CTRL;
		
		//(mesh offset xyz, scale xyz, controller position xyz, name, color)
		var rlArm = this.part(0,-.5,0,aw,al,aw,0,-al,0,"rlarm",this.color1);
		var ruArm = this.part(0,-.5,0,aw,al,aw,(mx+(aw))*.5,0,0,"ruarm",this.color1);
		
		var llArm =	this.part(0,-.5,0,aw,al,aw,0,-al,0,"llarm",this.color1);
		var luArm =	this.part(0,-.5,0,aw,al,aw,(mx+(aw))*-.5,0,0,"luarm",this.color1);
		
		var lLeg =	this.part(0,-.5,0,lw,ll,lw,ls,-(my*.5),0,"lleg",this.color1);
		var rLeg =	this.part(0,-.5,0,lw,ll,lw,-ls,-(my*.5),0,"rleg",this.color1);
		
		var leye =	this.part(0,0,0,ex,ey,ex,es,0,mz*.5,"leye",this.color2);
		var reye =	this.part(0,0,0,ex,ey,ex,-es,0,mz*.5,"reye",this.color2);
	
		var bod =	this.part(0,0,0,mx,my,mz,0,0,0,"bod",this.color1);
		
		this.rt_ruarm.add(rlArm);			
		this.rt_luarm.add(llArm);
		
		this.rt_bod.add(ruArm);
		this.rt_bod.add(luArm);
		
		this.rt_bod.add(lLeg);
		this.rt_bod.add(rLeg);
		
		this.rt_bod.add(leye);
		this.rt_bod.add(reye);
		
		this.CTRL.add(bod);
		
		this.pos_bod.position.y = (my/2)+(ll);
	}
	
}