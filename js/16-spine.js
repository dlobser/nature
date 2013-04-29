/*
todo - incorporate offset into the anim params
figure out how to rotate around arbitrary axis
add scale controls for helper geo and exporter
make better camera controls - or see if you can just orbit when something is true
add controller to grow limbs, one after the next
see why built in per limb ss is setting position of joints incorrectly
add a way for subleafs to see where they are on the bigger tree


*/

var num = 0;
var rebuild = false;
var things = [];
var boxes = [];
var vector = new THREE.Vector3(0,0,0);
var objRotate = false;
var sizeCounter=0;
var helpGeo = false;
var paint = [];

var counter = 0;
var spine = [];

var up = 0;

helperGeo = function(){

	helpGeo = !helpGeo;

}

writePaint = function(){

	saver2();
}

slidersToParams = function(){
	var div = document.getElementById('user');
	var options = document.getElementById('select').options;
	//var divAnim = document.getElementById('anim');
	
	div.value = JSON.stringify(things[0].p);
	//divAnim.value = "{}";	
}

applyPreset = function(){

	var div = document.getElementById('user');
	var options = document.getElementById('select').options;
	var divAnim = document.getElementById('anim');
	
	switch(options.selectedIndex)
	{
	case 0:
		div.value = '{"geoDivs":3,"color1":16777215,"color2":16777215,"color3":16777215,"color4":16777215,"color5":16777215,"anim":{"size":47.94137209302124,"speed":0.01127554615926709,"speed2":5.073995820930233,"num":-214.52494437326584,"x":0.0020954678614509737,"y":0.0014658210007047218,"z":0,"x1":[0,0,0.2,0.3,0],"y1":[0.1,0],"z1":[0,null],"x2":[0,1.1567879926008926,0],"y2":[-0.8,null],"z2":[0,null],"x3":[0.07505285412262153,1.5464428953717198,1],"y3":[0.2441860465116279,null],"z3":[0,null],"x4":[0,null],"y4":[0,null],"z4":[0,null],"off":[0,0],"sc":[1,1,1,1,1,1,1,1,1,1],"def":[0]},"fruitSize":{"x":5,"y":5,"z":5},"num":20,"scale":[5,8,5],"sx":5,"sy":8,"sz":5,"ss":1,"leaves":1,"divs":20,"rads":25,"animFunc":2,"fruit":true,"fruitScale":{"x":5,"y":5,"z":5},"leafJoints":[10,20],"leafDivs":[2,4],"leafss":[0.96,0.95],"angles":[0.6283185307179586,0.6283185307179586],"term":[0,1],"jScale":[{"x":-1,"y":-1,"z":-1},{"x":3,"y":12,"z":3}],"leafRads":[25,25]}';
		rebuilder();
		break;
	case 1:
	  div.value = '{"geoDivs":3,"color1":16777215,"color2":16777215,"color3":16777215,"color4":16777215,"color5":16777215,"anim":{"size":29.584678959158914,"speed":0.014337411683611925,"speed2":7.278993651197657,"num":-352.6514378402901,"x":0.005073237980354989,"y":0,"z":0,"x1":[0,0.1,0.2,0.3,0],"y1":[0.1,0.2],"z1":[0],"x2":[0,0,0],"y2":[-0.8],"z2":[0],"x3":[0.45950370498018267,1,1],"y3":[0],"z3":[0],"x4":[0],"y4":[0],"z4":[0],"off":[0],"sc":[1,1,1,1,1,1,1,1,1,1],"def":[0]},"fruitSize":{"x":5,"y":5,"z":5},"num":75,"scale":[5,5,5],"sx":5,"sy":5,"sz":5,"ss":1,"leaves":0,"divs":5,"rads":2,"animFunc":2,"fruit":true,"fruitScale":{"x":5,"y":5,"z":5},"leafJoints":[10],"leafDivs":[2],"leafss":[0.95],"angles":[0.6283185307179586],"term":[0],"jScale":[{"x":-1,"y":-1,"z":-1}],"leafRads":[2]}';
	  rebuilder();
	  break;
	case 2:
		div.value = '{"geoDivs":3,"color1":16777215,"color2":16777215,"color3":16777215,"color4":16777215,"color5":16777215,"anim":{"size":15.787641392383241,"num":-60.56000000000387,"x":0.007499569188350853,"y":0.0001,"z":0.0001,"x1":[0,-0.254175038921318,-0.0809353957800576,0.3,0],"y1":[0.1,0.2,null],"z1":[0,null,null],"x2":[0,0.750614891297992,0],"y2":[-0.8,null,null],"z2":[0,null,null],"x3":[0.2,0.2,1.5707963267948966],"y3":[0,null,null],"z3":[0,null,null],"x4":[0,null,null],"y4":[0,null,null],"z4":[0,null,null],"off":[0,0,0],"sc":[1,1,1,1,1,1,1,1,1,1],"def":[0]},"fruitSize":{"x":5,"y":5,"z":5},"num":25,"scale":[5,8,5],"sx":5,"sy":8,"sz":5,"ss":0.96,"leaves":2,"divs":10,"rads":2,"animFunc":"if(q>0)this.branches[i][1].parent.parent.parent.rotation.y += .0051;","fruit":true,"fruitScale":{"x":5,"y":5,"z":5},"leafJoints":[10,10,10],"leafDivs":[2,10,2],"leafss":[0.95,0.8,0.2],"angles":[0.6283185307179586,0.6283185307179586,0.6283185307179586],"term":[0,1,2],"jScale":[{"x":-1,"y":-1,"z":-1},{"x":-1,"y":-1,"z":-1},{"x":1,"y":13,"z":1}],"leafRads":[2,5,2]}';
		rebuilder();
		break;
	case 3:
		div.value = '{"geoDivs":3,"color1":16777215,"color2":16777215,"color3":16777215,"color4":16777215,"color5":16777215,"anim":{"size":36.64623255813561,"speed":0.04397463002114165,"speed2":5.75052858372093,"num":-1240.0682519908075,"x":0.002255109231853418,"y":0.0029316420014094437,"z":0,"x1":[0,0.4,-0.4,0],"y1":[-0.003875968992248069,0.1,null],"z1":[0,null,null],"x2":[0,-0.6,-1.2],"y2":[-0.015151515151515138,null,null],"z2":[0,null,null],"x3":[0,0.3066318411009066,null],"y3":[0.18780831571529244,null,null],"z3":[0,null,null],"x4":[0,1.5707963267948966,null],"y4":[0,null,null],"z4":[0,null,null],"off":[0,-0.032346723044397466,0],"sc":[0.95,0.98,0.8],"def":[0]},"fruitSize":{"x":5,"y":5,"z":5},"num":25,"scale":[12,12,12],"sx":12,"sy":12,"sz":12,"ss":1,"leaves":2,"divs":9,"rads":2,"animFunc":2,"fruit":true,"fruitScale":{"x":5,"y":5,"z":5},"leafJoints":[10,30,6],"leafDivs":[2,5,6],"leafss":[0.95,1,1],"angles":[0.6283185307179586,0.6283185307179586,0.6283185307179586],"term":[0,1,2],"jScale":[{"x":-1,"y":-1,"z":-1},{"x":-1,"y":-1,"z":-1},{"x":-1,"y":-1,"z":-1}],"leafRads":[2,1,1]}';
		rebuilder();
		break;
		case 3:
		div.value = '{"geoDivs":3,"color1":16777215,"color2":16777215,"color3":16777215,"color4":16777215,"color5":16777215,"anim":{"size":36.64623255813561,"speed":0.04397463002114165,"speed2":5.75052858372093,"num":-1240.0682519908075,"x":0.002255109231853418,"y":0.0029316420014094437,"z":0,"x1":[0,0.4,-0.4,0],"y1":[-0.003875968992248069,0.1,null],"z1":[0,null,null],"x2":[0,-0.6,-1.2],"y2":[-0.015151515151515138,null,null],"z2":[0,null,null],"x3":[0,0.3066318411009066,null],"y3":[0.18780831571529244,null,null],"z3":[0,null,null],"x4":[0,1.5707963267948966,null],"y4":[0,null,null],"z4":[0,null,null],"off":[0,-0.032346723044397466,0],"sc":[0.95,0.98,0.8],"def":[0]},"fruitSize":{"x":5,"y":5,"z":5},"num":25,"scale":[12,12,12],"sx":12,"sy":12,"sz":12,"ss":1,"leaves":2,"divs":9,"rads":2,"animFunc":2,"fruit":true,"fruitScale":{"x":5,"y":5,"z":5},"leafJoints":[10,30,6],"leafDivs":[2,5,6],"leafss":[0.95,1,1],"angles":[0.6283185307179586,0.6283185307179586,0.6283185307179586],"term":[0,1,2],"jScale":[{"x":-1,"y":-1,"z":-1},{"x":-1,"y":-1,"z":-1},{"x":-1,"y":-1,"z":-1}],"leafRads":[2,1,1]}';
		rebuilder();
		break;

case 4:
		div.value = '{"geoDivs":3,"color1":16777215,"color2":16777215,"color3":16777215,"color4":16777215,"color5":16777215,"anim":{"size":40.07886748233662,"speed":0.015785764622973927,"speed2":7.720144775512666,"num":-1931.1613748139728,"x":0.0028188865398167725,"y":0.002029598308668076,"z":0.002029598308668076,"x1":[-0.003875968992248069,-0.08302306166992057,-0.08302306166992057,0.3,0],"y1":[-0.047820093055316204,-0.04759988869075449,0.058669630246743765],"z1":[0,-0.012176715711588404,null],"x2":[-0.015151515151515138,0.09409280322591007,0.12695217598945496],"y2":[-0.2022229881095985,0.12951597620507616,null],"z2":[0,-1.5707963267948966,null],"x3":[0.04041013268998794,-0.08302306166992057,1],"y3":[0.02995066948555325,-0.08302306166992057,null],"z3":[0.02995066948555325,-0.6852170023157442,null],"x4":[0,-0.18929258060741883,0.02324645726757768],"y4":[0,-0.11844623464908666,null],"z4":[0,null,null],"off":[0,0,0],"sc":[0.9736434108527132,1.052572233967583,1.5,1,1,1,1,1,1,1],"def":[0]},"fruitSize":{"x":5,"y":5,"z":5},"num":45,"scale":[5,5,5],"sx":5,"sy":5,"sz":5,"ss":1,"leaves":2,"divs":45,"rads":2,"animFunc":2,"fruit":true,"fruitScale":{"x":5,"y":5,"z":5},"leafJoints":[10,18,3],"leafDivs":[45,1,2],"leafss":[0.95,0.99,1],"angles":[0.6283185307179586,0.6283185307179586,0.6283185307179586],"term":[0,1,2],"jScale":[{"x":-1,"y":-1,"z":-1},{"x":4,"y":11,"z":4},{"x":1,"y":24,"z":1}],"leafRads":[2,1,5]}';
		rebuilder();
		break;

case 5:
		div.value = '{"geoDivs":3,"color1":16777215,"color2":16777215,"color3":16777215,"color4":16777215,"color5":16777215,"anim":{"size":14.339339479579493,"speed":0.04622973925299507,"speed2":6.3966914025676385,"num":-416.4346237434354,"x":0.004411511287265208,"y":0.0054122621564482035,"z":0.005750528541226215,"x1":[-0.015151515151515138,-0.08302306166992057,-0.7206401752949102,0.3,0],"y1":[0.1,-0.04759988869075449,null,null],"z1":[0,-0.012176715711588404,null,null],"x2":[-0.03770260747004933,-0.614370656357412,-0.7045981110885947,-0.18487918166481365],"y2":[-0.8,-0.08302306166992057,null,null],"z2":[0,null,null,null],"x3":[0.02995066948555325,0.09409280322591007,0.8199107485544963,0.4387835336437238],"y3":[0,null,null,null],"z3":[0,null,null,null],"x4":[0,null,null,null],"y4":[0,null,null,null],"z4":[0,null,null,null],"off":[0,0,0,0],"sc":[0.9815362931642002,1,1.000723763570567,1,1,1,1,1,1,1],"def":[0]},"fruitSize":{"x":5,"y":5,"z":5},"num":25,"scale":[5,8,5],"sx":5,"sy":8,"sz":5,"ss":0.96,"leaves":3,"divs":10,"rads":4,"animFunc":2,"fruit":true,"fruitScale":{"x":5,"y":5,"z":5},"leafJoints":[10,10,4,10],"leafDivs":[2,10,5,10],"leafss":[0.95,1,1,0.96],"angles":[0.6283185307179586,0.6283185307179586,0.6283185307179586,0.6283185307179586],"term":[0,1,2,3],"jScale":[{"x":-1,"y":-1,"z":-1},{"x":-1,"y":-1,"z":-1},{"x":1,"y":9,"z":1},{"x":-1,"y":-1,"z":-1}],"leafRads":[3,9,1,4]}';
	rebuilder();
		break;

case 6:
		div.value = '{"geoDivs":3,"color1":16777215,"color2":16777215,"color3":16777215,"color4":16777215,"color5":16777215,"anim":{"size":83.18095348835782,"speed":0.01654316732724453,"speed2":0.1127555604651163,"num":-940.549444235234,"x":0.01,"y":0.0032699083861874563,"z":0.01,"x1":[0,0.1,0.023008390104698684,0.3,0],"y1":[0.1,0.2,null],"z1":[0,null,null],"x2":[0,1,1],"y2":[-0.8,null,null],"z2":[0,null,null],"x3":[-0.015151515151515138,-0.08302306166992057,1],"y3":[-0.003875968992248069,1.5707963267948966,null],"z3":[0,1.5707963267948966,null],"x4":[0,2,null],"y4":[0,null,null],"z4":[0,null,null],"off":[0,0,0],"sc":[0.9852834740651387,1,1,1,1,1,1,1,1,1],"def":[0]},"fruitSize":{"x":5,"y":5,"z":5},"num":45,"scale":[5,5,5],"sx":5,"sy":5,"sz":5,"ss":1,"leaves":2,"divs":5,"rads":1,"animFunc":"this.branches[i][1].parent.parent.parent.rotation.y+=((this.branches[i][1].idq/-10000));if(i>0)this.branches[i][0].rotation.x=Math.sin(this.p.anim.num*2+ this.branches[i][0].id)/6;if(q>1)this.branches[i][1].parent.parent.parent.rotation.y+=0.03","fruit":true,"fruitScale":{"x":5,"y":5,"z":5},"leafJoints":[10,8,3],"leafDivs":[2,8,5],"leafss":[0.95,0.92,1],"angles":[0.6283185307179586,0.6283185307179586,0.6283185307179586],"term":[0,1,2],"jScale":[{"x":-1,"y":-1,"z":-1},{"x":4,"y":24,"z":4},{"x":1,"y":24,"z":1}],"leafRads":[1,5,5]}';
		rebuilder();
		break;

case 7:
		div.value = '{"geoDivs":3,"color1":16777215,"color2":16777215,"color3":16777215,"color4":16777215,"color5":16777215,"anim":{"size":321.29741860471756,"speed":0.04622973925299507,"speed2":2.3678647697674418,"num":-593.7243406469867,"x":0.007499569188350853,"y":0.0054122621564482035,"z":0.005750528541226215,"x1":[-0.015151515151515138,-0.18929258060741883,-0.4726779644407477,-0.04759988869075449,0],"y1":[-0.22938689217758984,-0.08302306166992057,null,-0.40183161848241533],"z1":[0,-0.012176715711588404,null,0.4483245330175709],"x2":[-0.03770260747004933,-0.614370656357412,-1.328260826397132,0.9931503916957567],"y2":[-0.8,-0.08302306166992057,null,null],"z2":[0,0,null,null],"x3":[0,0,-0.1502312530365617,1.5707963267948966],"y3":[0.01867512332628607,0,0.3348397477589673,null],"z3":[0,0,0.750614891297992,null],"x4":[0,null,null,null],"y4":[0,-1.5707963267948966,null,null],"z4":[0,0,null,null],"off":[0,0,0,0],"sc":[0.9815362931642002,1,1.1551797040169134,0.8552501761804088,1,1,1,1,1,1],"def":[0]},"fruitSize":{"x":5,"y":5,"z":5},"num":45,"scale":[5,8,5],"sx":5,"sy":8,"sz":5,"ss":0.98,"leaves":3,"divs":15,"rads":1,"animFunc":2,"fruit":true,"fruitScale":{"x":5,"y":5,"z":5},"leafJoints":[10,10,9,10],"leafDivs":[2,15,10,10],"leafss":[0.95,1,1,0.96],"angles":[0.6283185307179586,0.6283185307179586,0.6283185307179586,0.6283185307179586],"term":[0,1,2,3],"jScale":[{"x":-1,"y":-1,"z":-1},{"x":-1,"y":-1,"z":-1},{"x":1,"y":12,"z":1},{"x":1,"y":4,"z":1}],"leafRads":[1,2,9,4]}';
		rebuilder();
		break;

	default:
	   div.value = '{"num":200,"scale":[2,8,2],"ss":1,"leaves":1,"divs":2,"rads":1,"leafss":[0.95,0.8,0.2],"leafDivs":[2,2,2],"fruit":true,"term":[0,1,2,3],"leafJoints":[10,15,10],"jScale1":[2,5,2],"anim":{"num":2.7}}';
	
	}
	

}

sc1 = function(){

	var container,
	camera, 
	controls, 
	renderer;	
	//things = [];
	var rAm = Math.PI/2;
	this.scene;
	var text;
	this.rebuild = false;
	this.pos = new THREE.Vector3(0,0,0);
	//setup dat.gui
	var starfield = function()
	{
		this.speed = 0.01;
		this.speed2 = 2;
		this.size = 1;
		this.x = 0.0001;
		this.y = 0.0001;
		this.z = 0.0001;
		this.x2 = 0.000;
		this.y2 = 0.000;
		this.z2 = 0.000;
		this.xw = 0.000;
		this.yw = 0.000;
		this.zw = 0.000;
		this.x1 = 0.000;
		this.y1 = 0.000;
		this.z1 = 0.000;
		this.fruitSize = 0;
		
		this.num=20;
		//this.scale:new THREE.Vector3(5,10,5);
		this.ss=.96;
		//this.leaf1ss:.8;
		//this.leaf0ss:.9;
		this.leaves=1;
		this.divs=2;
		this.rads=2;
		
		this.rotatorx=0;
		this.rotatory=0;
		this.rotatorz=0;
		
		this.rebuilder = function() { 
			//console.log(scene.text);
			//killEverything(scene);
			//console.log(rebuild);
			rebuild = true;
			//console.log(rebuild);
			//sc1.prototype.addGeo();

		};
		//this.term1:0;
		//this.term2:1;
		//this.term3:2;
		//this.term4:3;
		//this.angle1:.5;
		//this.angle2:.1;
		//this.fruit:true;
		//this.fruitScale:new THREE.Vector3(5,5,5)
		
		for( var i = 0 ; i < 6 ; i++){
		
			this["x1-"+i] = 0;
			this["y1-"+i] = 0;
			this["z1-"+i] = 0;
			
			this["x2-"+i] = 0;
			this["y2-"+i] = 0;
			this["z2-"+i] = 0;
			
			this["x3-"+i] = 0;
			this["y3-"+i] = 0;
			this["z3-"+i] = 0;
			
			this["x4-"+i] = 0;
			this["y4-"+i] = 0;
			this["z4-"+i] = 0;
			
			this["off-"+i] = 0;
			
			this["sc-"+i] = 1;
		}
	};
	
    this.text = new starfield();
	var gui = new dat.GUI();
	//gui.remember(this.text);
	// gui.add(text, 'message');
	var f0 = gui.addFolder('constructdor');
		//f0.add(this.text, 'num',1,100);
	//	f0.add(this.text, 'ss',.8,1.2);
		//f0.add(this.text, 'leaves',0,6);
		//f0.add(this.text, 'divs',1,30);
		//f0.add(this.text, 'rads',1,20);
		//f0.add(this.text, 'rebuilder');
		//f0.add(this.text, 'rotatorx',-3,3);
		//f0.add(this.text, 'rotatory',-3,3);
		//f0.add(this.text, 'rotatorz',-3,3);
		f0.add(this.text, 'fruitSize',0.01,10);
	
	var f1 = gui.addFolder('motion');
		f1.add(this.text, 'speed', 0, .1);
		f1.add(this.text, 'speed2', 0.0000001,10);
		f1.add(this.text, 'size', 1, 100);
		f1.add(this.text, 'x', 0,.01);
		f1.add(this.text, 'y', 0,.01);
		f1.add(this.text, 'z', 0,.01);
	
	for( var i = 0 ; i < 6 ; i++){
		//console.log("pre: " + rAm);
		if(i<1){
			rAm=.5;
		}
		else
			rAm = Math.PI/2;
	//	console.log("rArm: " + rAm);
		this['fol'+i] = gui.addFolder('level' + i);
		
		this['fol'+i].add(this.text, 'x1-'+i, -rAm,rAm).listen();
		this['fol'+i].add(this.text, 'y1-'+i, -rAm,rAm);
		this['fol'+i].add(this.text, 'z1-'+i, -rAm,rAm);
		
		this['fol'+i].add(this.text, 'x2-'+i, -rAm,rAm);
		this['fol'+i].add(this.text, 'y2-'+i, -rAm,rAm);
		this['fol'+i].add(this.text, 'z2-'+i, -rAm,rAm);
		
		this['fol'+i].add(this.text, 'x3-'+i, -rAm,rAm);
		this['fol'+i].add(this.text, 'y3-'+i, -rAm,rAm);
		this['fol'+i].add(this.text, 'z3-'+i, -rAm,rAm);
		
		this['fol'+i].add(this.text, 'x4-'+i, -rAm,rAm);
		this['fol'+i].add(this.text, 'y4-'+i, -rAm,rAm);
		this['fol'+i].add(this.text, 'z4-'+i, -rAm,rAm);
		
		this['fol'+i].add(this.text, 'off-'+i, -10,10);
		
		this['fol'+i].add(this.text, 'sc-'+i, .8,1.5).listen();
		
	}
//console.log(this.text);
//	gui.add(this.text, 'sizerx', 0,10);
//	gui.add(this.text, 'sizery', 0,10);
//	gui.add(this.text, 'sizerz', 0,10);
f1.open();
}

//sets up the three scene and calls addGeo
sc1.prototype.init = function() {

	this.camera = new THREE.PerspectiveCamera( 25, window.innerWidth / window.innerHeight, 1, 10000 );
	this.camera.position.z = 0;
	this.camera.position.y = 0;
	this.camera.position.x = 450;

	//this.controls = new THREE.OrbitControls( this.camera );
	//this.controls.addEventListener( 'change', this.render );

	this.scene = new THREE.Scene();
	this.scene.fog = new THREE.FogExp2( 0x000000, 0.00052 );
	this.camera.lookAt(new THREE.Vector3(0,0,0));
	//this.scene.add(this.camera);
	var loader2 = new THREE.OBJLoader();
				
	loader2.addEventListener( 'load', function ( event ) {

		var object = event.content;

		object.position = new THREE.Vector3(  0,-25,0  );
		object.scale.x = 10000;
		spine.push(object);
		loader2.object = object;
		
	});
	loader2.load( 'models/vertebrae_lorez.obj' );
	loader2.load( 'models/bone.obj' );
	
	
	
			
	this.addGeo();

	var light = new THREE.DirectionalLight( 0xffffff );
	light.position.set( 1, 1, 1 );
	this.scene.add( light );

	light = new THREE.DirectionalLight( 0x002288 );
	light.position.set( -1, -1, -1 );
	this.scene.add( light );

	light = new THREE.AmbientLight( 0x222222 );
	this.scene.add( light );

	this.renderer = new THREE.WebGLRenderer( { antialias: true } );
	//this.renderer.setClearColor( scene.fog.color, 1 );
	this.renderer.setSize( window.innerWidth, window.innerHeight -100);	

	this.container = document.getElementById( 'container' );
	this.container.appendChild( this.renderer.domElement );

	//window.addEventListener( 'resize', onWindowResize, false );
	//console.log(this.renderer, + " " + this.scene.children.length + " " + this.camera.toString());

	
}

sc1.prototype.addGeo = function(){

	var geometry = new THREE.CylinderGeometry( 0, 10, 30, 4, 1 );
	var g2 = new THREE.CubeGeometry( 1,1,1 );
	var g1 = new THREE.Geometry();
	var material =  new THREE.MeshLambertMaterial( { color:0xffffff, shading: THREE.FlatShading } );

	var div = document.getElementById('user');
	//var divAnim = document.getElementById('anim');
	user.defaultValue ='{"geoDivs":3,"color1":16777215,"color2":16777215,"color3":16777215,"color4":16777215,"color5":16777215,"anim":{"size":58.714930232559325,"speed":0.004510218463706836,"speed2":3.833685755813953,"num":-250.29102036424322,"x":0.004397463002114165,"y":0.01,"z":0,"x1":[0,0.19624803324595885,0.2,0.3,0],"y1":[0.1990838618745595,0.2],"z1":[0,null],"x2":[0,0.36948767638721924,0],"y2":[0.42459478505990134,-0.21952711029306582],"z2":[-0.16173361522198731,null],"x3":[0.26673713883016203,1,1],"y3":[0,1.5707963267948966],"z3":[0,null],"x4":[0,1.5707963267948966],"y4":[0,null],"z4":[0,null],"off":[0,0],"sc":[0.97,0.8540410132689988,1,1,1,1,1,1,1,1],"def":[0]},"fruitSize":{"x":5,"y":5,"z":5},"num":55,"scale":[12,12,12],"sx":12,"sy":12,"sz":12,"ss":1,"leaves":1,"divs":2,"rads":3,"animFunc":2,"fruit":true,"fruitScale":{"x":1,"y":1,"z":1},"leafJoints":[10,5],"leafDivs":[2,4],"leafss":[1,0.9],"angles":[0.6283185307179586,0.6283185307179586],"term":[0,1],"jScale":[{"x":-1,"y":-1,"z":-1},{"x":1,"y":24,"z":1}],"leafRads":[2,2]}';
	
	
	
	
	var your_object = JSON.parse(user.value);
	var parms={color1:0x225577,color2:0xbbffdd,color3:0x0099ff,geo2:new THREE.SphereGeometry(0.1,12,6)};
	this.rotator = new THREE.Object3D(0,0,0);
	var mesh = new THREE.Mesh(geometry);
	var dir = new THREE.Vector3(.1,.5,-.4);
	
	var numJoints = 1000;
	
	while(numJoints > 350 || numJoints < 100){
		your_object.anim.size = randly(1,100);
		your_object.num = randInt(10,100);
		your_object.anim.x3[0] = randly(0.1,1);
		your_object.anim.y3[0] = randly(0.001,0.1);
		your_object.anim.z3[0] = randly(0.1,1);
		your_object.anim.x3[1] = randly(0.1,3);
		your_object.anim.y3[1] = randly(0.001,1);
		your_object.anim.z3[1] = randly(0.1,3);
		your_object.anim.speed = randly(0.001,0.003);
		your_object.divs = randInt(2,5);
		your_object.anim.num = rand(1,100);
		your_object.leafRads[0] = randInt(2,5);
		your_object.anim.x2[1] = rand(-0.5,1.2);
		your_object.jScale[1].y = rand(2,70);
		your_object.jScale[1].x = rand(1,8);
		your_object.jScale[1].z = your_object.jScale[1].x;
		your_object.leafJoints[1] = randInt(3,25);
		numJoints = your_object.num + ( (your_object.num/your_object.divs) * your_object.leafJoints[1] * your_object.rads);
	}
	
	console.log ("numb joints: " + numJoints);
	
	if(spine.length>0){
		your_object.altGeo = [];
		your_object.altGeo[0] = spine[0].children[0].geometry;
		your_object.altGeo[1] = spine[1].children[0].geometry;
	}
	console.log(your_object.altGeo || "boof");
	
	your_object.fruitScale = new THREE.Vector3(0,0,0);
	your_object.geo2 = new THREE.SphereGeometry(0.1,12,6);
	
	for ( var i = 0 ; i < 1 ; i++){
	
		var cuber = new peep(your_object);
		
		cuber.makeParams(your_object);
		//console.log(JSON.stringify(cuber.p));
		//console.log(cuber.joints);
		cuber.branchSquares();
		cuber.big.position.y = -120;
		
		this.rotator.add(cuber.big);

		this.scene.add(this.rotator);
		things.push(cuber);
		things[i].animVals = cuber.p.anim;
		
		for(var i = 0 ; i < cuber.branches.length ; i++){
			
				//console.log(cuber.branches[i][0].parent.parent.rotation.y);
			
		
		}
		for (var q = 0 ; q <= things[0].p.leaves ; q++){
		
			this.text["x1-"+q]=things[0].p.anim.x1[q];
			this.text["y1-"+q]=things[0].p.anim.y1[q];
			this.text["z1-"+q]=things[0].p.anim.z1[q];
			this.text["x2-"+q]=things[0].p.anim.x2[q];
			this.text["y2-"+q]=things[0].p.anim.y2[q];
			this.text["z2-"+q]=things[0].p.anim.z2[q];
			this.text["x3-"+q]=things[0].p.anim.x3[q];
			this.text["y3-"+q]=things[0].p.anim.y3[q];
			this.text["z3-"+q]=things[0].p.anim.z3[q];
			this.text["x4-"+q]=things[0].p.anim.x4[q];
			this.text["y4-"+q]=things[0].p.anim.y4[q];
			this.text["z4-"+q]=things[0].p.anim.z4[q];
			this.text["sc-"+q]=things[0].p.anim.sc[q];
			
		}
		
		this.text.speed = things[0].p.anim.speed;
		this.text.speed2 = things[0].p.anim.speed2;
		this.text.x = things[0].p.anim.x;
		this.text.y = things[0].p.anim.y;
		this.text.z = things[0].p.anim.z;
		this.text.size = things[0].p.anim.size;
		
		//this.text
		for(key in this.animObject){
			if(this.animObject[key] instanceof Array){
				for( i in this.animObject[key] )
					if (this.animObject[key][i] !== undefined){
						
					//	console.log(this.animObject.x1);
						//console.log(this.animObject[key][i]);

						
					}
			}
		}
		
	}

//	console.log(things);
	
	
}

sc1.prototype.moveThings = function(){
	
	for ( var j = 0 ; j <   things.length  ; j++){
	
		var thing = things[j];
		
		for (var q = 0 ; q <= thing.p.leaves ; q++){
		
			thing.p.anim.x1[q] = this.text["x1-"+q];
			thing.p.anim.y1[q] = this.text["y1-"+q];
			
			thing.p.anim.z1[q] = this.text["z1-"+q];
			thing.p.anim.x2[q] = this.text["x2-"+q];
			thing.p.anim.y2[q] = this.text["y2-"+q];
			thing.p.anim.z2[q] = this.text["z2-"+q];
			thing.p.anim.x3[q] = this.text["x3-"+q];
			thing.p.anim.y3[q] = this.text["y3-"+q];
			thing.p.anim.z3[q] = this.text["z3-"+q];
			thing.p.anim.x4[q] = this.text["x4-"+q];
			thing.p.anim.y4[q] = this.text["y4-"+q];
			thing.p.anim.z4[q] = this.text["z4-"+q];
			thing.p.anim.off[q] = this.text["off-"+q];
			thing.p.anim.sc[q] = this.text["sc-"+q];// + mysc;
			
			
			//thing.p.anim.off[q] = this.text["off-"+q] + myOff;
			//thing.p.anim.sc[q] = this.text["sc-"+q];// + mysc;
		}

		
		for (var q = 0 ; q < thing.fruit.length ; q++){
			thing.fruit[q].scale = new THREE.Vector3(this.text.fruitSize,this.text.fruitSize,this.text.fruitSize);
		
		}
		
		thing.p.anim.size = this.text.size+ sizeCounter;
		thing.p.anim.x = this.text.x;// + rand(0,.00001);
		thing.p.anim.y = this.text.y;
		thing.p.anim.z = this.text.z;
		thing.p.anim.speed = this.text.speed;
		thing.p.anim.speed2 = this.text.speed2;
		
		sizeCounter+=.001;
		
		thing.animate();
		thing.p.anim.num-=this.text.speed*this.text.speed2;
		if(helpGeo)up += map_range(this.text.speed*this.text.speed2,0,Math.PI*2,0,1.27);
	}	
	
	var rot = new THREE.Vector3(this.text.rotatorx,this.text.rotatory,this.text.rotatorz);

	this.rotator.rotation = vector;
}

sc1.prototype.animate = function(){

	//console.log("HIHIHI");
	//console.log(this.text);
	
	if(counter<50){
		counter++;
		//console.log(counter);
	}
	
	if(rebuild || counter==3){
		//make a fake tree
		if(helpGeo){
			var tree = new THREE.Object3D();
			for (var i in things){
				tree.add(makeLimbGeo(things[i],.5));
			}
		}
		
		things = [];
		killEverything(scene);
		this.addGeo();
		
		if (helpGeo){
			this.scene.add(tree);
			things[0].msh.push(tree.children[0].children[0]);
		}
		
		rebuild = false;
	}
	//this.render();
	this.renderer.render( this.scene, this.camera );
	if(this.text.speed*this.text.speed2 !=0){
		this.moveThings();
	}
	var that = this;
	requestAnimationFrame( function() { that.animate(); });
	//this.controls.update();
	
}

sc1.prototype.render = function() {
	//console.log("wtf");
	//wtf does this throw errors even when it's not being used?
	//this.renderer.render( this.scene, this.camera );

}


document.addEventListener( 'mousemove', onDocumentMouseMove, false );
document.addEventListener( 'mousedown', onDocumentMouseDown, false );
document.addEventListener( 'mouseup', onDocumentMouseUp, false );

var projector;
projector = new THREE.Projector();

function onDocumentMouseMove( event ) {
	if(objRotate){
		vector = new THREE.Vector3(
		0,
		( event.clientX*-3 / window.innerWidth ) * 2 + 1,
		-( event.clientY / window.innerHeight ) * 2 + 1
		);
		
	
	}		
}

function onDocumentMouseDown( event ) {
	if(( event.clientX / window.innerWidth ) < .7 && ( event.clientX/ window.innerWidth ) > .3)
	objRotate = true;
}

function onDocumentMouseUp( event ) {
	objRotate = false;
}


function saver() {

	//if(evt.keyCode == 65){
		alert("saving!");
		var j = 0;
		var output = "";
		
		//console.log(tree.children.length);
		//things[0].big.scale.x = .01;
		//things[0].big.position.y = 0;
		
		for (var i = 0 ; i < things[0].msh.length ; i++){
			

			
			//grrr - somehow two extra objects are being added to the msh array - so I'm manually skipping them, messy
			if(i == things[0].msh.length-2 || i == things[0].msh.length-3) i++;
			else{
				output += THREE.saveGeometryToObj4(things[0].msh[i],j,.0003);
				j += things[0].msh[i].geometry.vertices.length;
			}
		}
		
		//console.log(output);
		output.replace("undefined","");
		alert("saved!");
		var blob = new Blob([output], {type: "text/plain;charset=ANSI"});
		saveAs(blob, "tree.obj");
	//}
	
}


function saver2() {

	alert("saving!");
	var j = 0;
	var output = "";
	
	output +=
	"M73 P0 (enable build progress)" + "\n" +
	"G21 (set units to mm)" + "\n" + 
	"G90 (set positioning to absolute)" + "\n" + 
	"G10 P1 X-16.5 Y0 Z0 (Designate T0 Offset)" + "\n" + 
	"G55 (Recall offset cooridinate system)" + "\n" + 
	"(**** begin homing ****)" + "\n" + 
	"G162 X Y F2500 (home XY axes maximum)" + "\n" + 
	"G161 Z F1100 (home Z axis minimum)" + "\n" + 
	"G92 Z-5 (set Z to -5)" + "\n" + 
	"G1 Z0.0 (move Z to “0?)" + "\n" + 
	"G161 Z F100 (home Z axis minimum)" + "\n" + 
	"M132 X Y Z A B (Recall stored home offsets for XYZAB axis)" + "\n" + 
	"(**** end homing ****)" + "\n" + 
	"G1 X112 Y-73 Z155 F3300.0 (move to waiting position)" + "\n" + 
	"G130 X0 Y0 A0 B0 (Lower stepper Vrefs while heating)" + "\n" + 
	"M6 T0 (wait for toolhead, and HBP to reach temperature)" + "\n" + 
	"M104 S230 T0 (set extruder temperature)" + "\n" + 
	"M6 T0 (wait for toolhead, and HBP to reach temperature)" + "\n" + 
	"G130 X127 Y127 A127 B127 (Set Stepper motor Vref to defaults)" + "\n" + 
	"M108 R3.0 T0" + "\n" + 
	"G0 X112 Y-73 (Position Nozzle)" + "\n" + 
	"G0 Z0.2 (Position Height)" + "\n" + 
	"M108 R4.0 (Set Extruder Speed)" + "\n" + 
	"M101 (Start Extruder)" + "\n" + 
	"G4 P1500 (Create Anchor)" + "\n";
	
	var zed = 0;
	
	
	for (var i = 0 ; i < paint.length ; i+=3){
		
		if(up > Math.PI*2){
			zed+=0.65;
			up=0;
		}
		console.log(up);
		output += "G1 X";
		output += (paint[i]/1.5);
		output += " Y";
		output += (paint[i+1]/1.5);
		output += " Z";
		output += (paint[i+2])+1.27;
		output +=  " F1556.0";
		output += "\n";
	}
	
	alert("saved!");
	var blob = new Blob([output], {type: "text/plain;charset=ANSI"});
	saveAs(blob, "drawing.txt");
	
}


rebuilder = function(){
	var that = this;
	//console.log(user.value);
	//console.log(anim.value);
	console.log(JSON.stringify(things[0].p));
	//console.log(things[0].p);
	//console.log($.extend(things[0].p,this.animObject));	
	rebuild = true;
	

}


$( document ).on( 'keydown', function ( e ) {
	console.log(e.keyCode);
    if ( e.keyCode === 27 ) { // ESC
console.log(e.keyCode);
        $(".everything").hide();
    }
});
$( document ).on( 'keydown', function ( e ) {
	console.log(e.keyCode);
    if ( e.keyCode === 65 ) { // ESC
console.log(e.keyCode);
        $(".everything").show();
    }
});


window.onkeyup = onKeyUp;
window.onkeypress = onKeyPress;



function onKeyUp(evt) {

	if(evt.keyCode == 65){
		console.log(evt.keyCode);
		$("#.enu").css("position","relative");
	}
	
	if(evt.keyCode == 66){
		helpGeo = true;
	}
}
