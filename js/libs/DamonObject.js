function create_limb(params){
	// takes a list of bones and makes returns a bone object....


	var scene_geo = null;

	//do stuff that adds scene geometry


	var limb = function(){};

		limb.prototype.animate = function(anim_parms){
			console.log('animating',this,' with ', anim_parms)
			//draw this in canvas
			// or in three.js do stuff to this.scene_geo
		};

		limb.prototype.update = function(params){
			console.log('updating limb with', params.data)
			for (bone in params.data.bones){
				console.log('creating new limb',params.data.bones[bone])
			}
			//do stuff to this.scene_geo
		};

		limb.prototype.destroy = function(){
			//requires a global scene_1 variable or something...
			//removes this.scene_geo from scene...
		}
	

		limb.scene_geo = scene_geo;

		return new limb();

}

var part_factory =  {

	'limb':function(params){
		return create_limb(params)
	}

}

function create_creature(params){

	var c = function(){}

		c.prototype.create = function(params){
			//maybe make a "control node" here
			this.control = 'create a control'
			this.body_parts = params.body_parts;
			this.transforms = params.transforms;
			this.update();
		};

		c.prototype.append = function(new_parts){
			for (p in Object.keys(new_parts)){
				this.body_parts[p.name] = new_parts[p];
			}

		};

		c.prototype.update = function(params){

            if (params){
            	// if this function is called with creature.update({body_parts:{}})
            	this.body_parts = params.body_parts;

                parts = params.body_parts;
            }else{
                parts = this.body_parts;
            }
            
            // console.log(parts);
			for (part in parts){
				var p = parts[part];
                // console.log(part)
				if (!this.body_parts[p.name]){
					console.log('creating body part', p.name, p);
					//if this body part doesn't exist, create it
					this.body_parts[p.name] = part_factory[p.type](p)
				}else{
					console.log('already had part', p)
					this.body_parts[p.name].update(p)
				}
			}

			console.log('creature updated with parts', this.body_parts);
		};
		c.prototype.animate = function(anim_params){
			for (p in this.body_parts){
				this.body_parts[p].animate(anim_params);
			}

		};
	
    return new c().create(params);
}

var blah = create_creature({
	transforms:{
							tx:0,
							ty:0,
							tz:0,
							rx:0,
							ry:0,
							rz:0,
							sx:0,
							sy:0,
							sz:0,
	},

	body_parts:{
		

		'limb1':{
			type:'limb',

			data: {

				attach:{
							tx:0,
							ty:0,
							tz:0,
							rx:0,
							ry:0,
							rz:0,
							sx:0,
							sy:0,
							sz:0,
				},
				bones:[
				//or this could be a number of bones integer... or whatever
					{
						length:3,
						thick:1,
						twist:0,
						offset:5,
						rot:{
							x:0,
							y:0,
							z:0
						}


					},
					{
						length:3,
						thick:1,
						twist:0,
						offset:5,
						rot:{
							x:0,
							y:0,
							z:0
						}
					}
				]
			}
		},
		
		'limb2':{
			//2nd body part
				type:'limb',

				data: {

					attach:{
								tx:0,
								ty:0,
								tz:0,
								rx:0,
								ry:0,
								rz:0,
								sx:0,
								sy:0,
								sz:0,
					},
					bones:[
					//or this could be a number of bones integer... or whatever
						{
							length:3,
							thick:1,
							twist:0,
							offset:5,
							rot:{
								x:0,
								y:0,
								z:0
							}


						},
						{
							length:3,
							thick:1,
							twist:0,
							offset:5,
							rot:{
								x:0,
								y:0,
								z:0
							}
						}
					]
				}
			}
		}
})