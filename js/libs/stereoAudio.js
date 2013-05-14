window.onload = init;


var context;
var buffer;
var convolver;
var panner;
var source;
var dryGainNode;
var wetGainNode;
var oscillator,oscillator2,oscillator3;


var siner = 0;

var lowFilter;

var bufferList;
var hihatShort;

var fileCount = 8;

var fileList = [
	"audio/eerie.wav",
	"audio/white-noise.wav",
	"audio/lalala.mp3",
];

var kInitialReverbLevel = 0.6;

function setAudioSource(i) {
    var buffer = bufferList[i];

    // See if we have cached buffer
    if (buffer) {
        source.buffer = buffer;
    } else {
        // Load asynchronously
        var url = fileList[i];

        var request = new XMLHttpRequest();
        request.open("GET", url, true);
        request.responseType = "arraybuffer";

        request.onload = function() { 
            var buffer = context.createBuffer(request.response, true);
            
            source.buffer = buffer;
            bufferList[i] = buffer;  // cache it
        }

        request.send();
    }
}

 function init() {
 
     context = new webkitAudioContext();
	 gainNode2 = context.createGainNode(); // Create gain node 2
	 gainNode2.gain.value = 0.01;
	 gainNode2.connect(context.destination);
	
    oscillator = context.createOscillator();
	
	oscillator.type = 0; // sine wave
	oscillator.frequency.value = 2000;

	oscillator.connect(gainNode2);
	
	oscillator.connect(context.destination);
	oscillator.noteOn && oscillator.noteOn(0);
	
	 

     source = context.createBufferSource();
     dryGainNode = context.createGainNode();
     wetGainNode = context.createGainNode();
     panner = context.createPanner();
	 

   
     lowFilter = context.createBiquadFilter();
     lowFilter.frequency.value = 44050.0;
     lowFilter.Q.value = 5.0;

     convolver = context.createConvolver();

     // Connect audio processing graph
     source.connect(lowFilter);
     lowFilter.connect(panner);

     // Connect dry mix
     panner.connect(dryGainNode);
     dryGainNode.connect(context.destination);
     
     // Connect wet mix
     panner.connect(convolver);
     convolver.connect(wetGainNode);
     wetGainNode.connect(context.destination);
     wetGainNode.gain.value = kInitialReverbLevel;
     
     bufferList = new Array(fileCount);
     for (var i = 0; i < fileCount; ++i) {
         bufferList[i] = 0;
     }

     //loadHihat("sounds/drum-samples/hihat-short.wav");

     //setReverbImpulseResponse('http://chromium.googlecode.com/svn/trunk/samples/audio/impulse-responses/spatialized3.wav');

     source.playbackRate.value = 1.0;

	 
	    dryGainNode.gain.value = 1;
		
     panner.setPosition(0, 0, -4.0);
     source.loop = true;

     // Load up initial sound
     setAudioSource(0);

     var cn = {x: 0.0, y: -0.5};
     //gTopProjection.drawDotNormalized(cn);
     
     cn.y = 0.0;
    // gFrontProjection.drawDotNormalized(cn);

     var currentTime = context.currentTime;
     source.noteOn(currentTime + 0.020);
	 
	 function loop(){
	  //lowFilter.frequency.value = (Math.sin(siner*0.5)+1.2)*4050.0;

		siner+=.055;
		var m = Math.sin(siner)*125;
		var y = Math.cos(siner)*125;
		panner.setPosition(-mz*2,(1+my)*2,-mx*2);
		requestAnimationFrame( loop );
		oscillator.frequency.value = 0;//(mz*2)+1;//mz*100;

		//  wetGainNode.gain.value = my;
		 lowFilter.Q.value = mx;
		 //console.log(mx);

	}
	 loop();
 }

