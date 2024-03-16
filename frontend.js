function is_iOS() {
	devices = [
		'iPad Simulator',
		'iPhone Simulator',
		'iPod Simulator',
		'iPad',
		'iPhone',
		'iPod'
	];
	return devices.includes(navigator.platform) || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
}

function is_Android(){
	const ua = navigator.userAgent.toLowerCase() + navigator?.platform.toLowerCase();
	const isAndroid = ua.indexOf("android") > -1;
	return isAndroid;
}

var lastPushTS = Date.now();
const pushIntervalMS = 5000;
const maxAngle = 30;
var lastXangle;
var lastZangl;
const angleStepsForPush=5;

const xzUpdateIntervalMS = 400;	//200 is too fast
var lastXupdateTS = Date.now();
var lastZupdateTS = Date.now();

//Put in local storage?
var wheelTrackDistance = 2300;
var axleToJockeyWheelMM = 3000;

let is_running = false;
var sleepSetTimeout_ctrl;


document.addEventListener("DOMContentLoaded", () => {


//Move this up out of DOMready?
	//Main JS code


/*
	//Speech Synthesis

	//Check if browser supports Speech Synthesis API
	var supportMsg = document.getElementById('msg');
	
	console.log(supportMsg);
	
	if ('speechSynthesis' in window) {
		supportMsg.innerHTML = 'Your browser <strong>supports</strong> speech synthesis.';
	}
	else {
		supportMsg.innerHTML = 'Sorry your browser <strong>does not support</strong> speech synthesis.<br>Try this in <a href="https://www.google.co.uk/intl/en/chrome/browser/canary.html">Chrome Canary</a>.';
		supportMsg.classList.add('not-supported');
	}
	
	// Get the 'speak' button
	var button = document.getElementById('speak');
	
	// Get the text input element.
	var speechMsgInput = document.getElementById('speech-msg');
	
	// Get the voice select element.
	var voiceSelect = document.getElementById('voice');
	
	// Get the attribute controls.
	var volumeInput = document.getElementById('volume');
	var rateInput = document.getElementById('rate');
	var pitchInput = document.getElementById('pitch');
	
	// Execute loadVoices.
	loadVoices();
	
	// Chrome loads voices asynchronously.
	window.speechSynthesis.onvoiceschanged = function(e) {
		loadVoices();
	};
*/	


	//Custom Fontawesome icon - Caravan front view
	var faCaravanFront = {
		prefix: 'fac',
		iconName: 'caravan-front',
		icon: [
			448, 448,
			[],
			null,
			 'M414, 0V0C432, 0, 447, 22, 447, 40V386C447, 403.7, 432.7, 418, 415, 418V450C415, 467.7, 400.7, 482, 383, 482H352C334.3, 482, 320, 467.7, 320, 450V418L238, 440C238, 470, 200, 470, 200, 440L118, 418V450C118, 467.7, 103.7, 482, 86, 482H54C36.3, 482, 22, 467.7, 22, 450L22, 418C4.3, 418-10, 403.7-10, 386V40C-10, 20, 7.7, 2, 22, 0ZM64, 98V196C64, 213.7, 78.3, 228, 96, 228H352C369.7, 228, 384, 213.7, 384, 196V98C384, 80.3, 369.7, 66, 352, 66H96C78.3, 66, 64, 80.3, 64, 98ZM221, 168Z'
		]
	}
	FontAwesome.library.add(faCaravanFront)
	
/*
	//Event listeners
	//Speech
	button.addEventListener('click', function(e) {
		if (speechMsgInput.value.length > 0) {
			speak(speechMsgInput.value);
		}
	});
*/
	
	//Touch Events
//	document.body.addEventListener('touchstart', function(e){ e.preventDefault(); });
//	document.body.addEventListener('touchmove', function(e){ e.preventDefault(); });
	
	/*
	document.getElementById("side-view").addEventListener("touchstart", process_touchstart, false);
	document.getElementById("side-view").addEventListener("touchend", process_touchend, false);
	document.getElementById("side-view").addEventListener("touchmove", process_touchmove, false);
	document.getElementById("side-view").addEventListener("touchcancel", process_touchcancel, false);
	*/

	//Orientation, Portrait or Landscape
	window.addEventListener('orientationchange', deviceOrientation);
	deviceOrientation();

	document.getElementById('debug').innerHTML += '<br>navigator.standalone is '+window.navigator.standalone;
	if(window.navigator.standalone){
		document.getElementById('debug').innerHTML += '<br>navigator.standalone is TRUE';
		if (navigator.serviceWorker) {
			document.getElementById('debug').innerHTML += '<br>navigator.serviceWorker is TRUE';
			initServiceWorker();
		}
		else{
			document.getElementById('debug').innerHTML += '<br>navigator.serviceWorker is FALSE';
			if (location.protocol !== 'https:') {
				document.getElementById('debug').innerHTML += '<br>You need to visit this page with a secure connection (https://)';
			}
			else{
				document.getElementById('debug').innerHTML += '<br>navigator.serviceWorker failed by unknown reason';
			}
		}
	}
	else if(!window.navigator.standalone && is_iOS()){
		document.getElementById('debug').innerHTML += '<br>is NOT standalone and is iOS';
		document.getElementById('add-to-home-screen').style.display = 'block';
	}
	else if(window.navigator.standalone=='undefined' && is_Android()){
		document.getElementById('debug').innerHTML += '<br>navigator.standalone is undefined and is_Android is TRUE, init serviceworker?';
		//Need to init serviceworker when device is android
	}
	else{
		document.getElementById('debug').innerHTML += '<br>navigator.standalone is undefined (not iOS?) or FALSE and is not Android, show QR-code';
		document.getElementById('scan-qr-code').style.display = 'block';
	}

	//FOR DEBUGGING
	//Get URL parameters
	const urlParams = new URLSearchParams(window.location.search);
	const debug = typeof urlParams.get('debug') === 'string' ? true : false;
	
	document.getElementsByTagName('h2')[0].innerHTML = new Date(document.lastModified).toLocaleString();
	
	//Toggle debug show
	document.querySelector("h1").addEventListener('click', () => {
		if(document.getElementById("debug").style.display != "block"){
			document.getElementById("debug").style.display = "block";
		}
		else{
			document.getElementById("debug").style.display = "none";
		}
	});
	
	if(debug){
		console.log("debug is active")
		document.getElementsByTagName('h2')[0].innerHTML = new Date(document.lastModified).toLocaleString();
	}
	
	//standaloen in chrome/android
	//navigator.standalone = navigator.standalone || (screen.height-document.documentElement.clientHeight<40)

});