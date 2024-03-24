/*
Errors
frontend.js reference error cant find variable initServiceWorker()
*/

//iOS device orientation
function deviceOrientation() {
	var body = document.body;
	switch(window.orientation) {
	case 90:
		body.classList = "";
		body.classList.add("rotation90");
		break;
	case -90:
		body.classList = "";
		body.classList.add("rotation-90");
		break;
	default:
		body.classList = "";
		body.classList.add("portrait");
		break;
	}
}

function is_iOS() {
	devices = [
		"iPad Simulator",
		"iPhone Simulator",
		"iPod Simulator",
		"iPad",
		"iPhone",
		"iPod"
	];
	return devices.includes(navigator.platform) || (navigator.userAgent.includes("Mac") && "ontouchend" in document)
}

function is_Android(){
	const ua = navigator.userAgent.toLowerCase() + navigator?.platform.toLowerCase();
	const isAndroid = ua.indexOf("android") > -1;
	return isAndroid;
}

function pushHashAndFixTargetSelector(hash) {
	history.pushState({}, document.title, hash); //called as you would normally
	const onpopstate = window.onpopstate; //store the old event handler to restore it later
	window.onpopstate = function() { //this will be called when we call history.back()
		window.onpopstate = onpopstate; //restore the original handler
		history.forward(); //go forward again to update the CSS
	};
	history.back(); //go back to trigger the above function
}

function beep(duration=200, pan) {	//pan: -1=left, 0=center, 1=right
	try{
	audioCtx = new(window.AudioContext || window.webkitAudioContext)();

	var oscillator = audioCtx.createOscillator();
	var gainNode = audioCtx.createGain();
	
	const stereoNode = new StereoPannerNode(audioCtx, { pan: pan });
	//oscillator.connect(gainNode);
	oscillator.connect(gainNode);
	gainNode.connect(stereoNode);
	//gainNode.connect(audioCtx.destination);
	stereoNode.connect(audioCtx.destination);
	
	gainNode.gain.value = 0.5;
	oscillator.frequency.value = 1500;
	oscillator.type = "triangle";

	oscillator.start();	
	setTimeout(
		function() {
			oscillator.stop();
		},
		duration
	);
	}
	catch(err){
			debugView.innerHTML += "<span>&gt;beep(): "+err.message+"</span>";
	}
}


function calibrate(event){
	try{
	//	debugView.innerHTML += "<span>&gt;Gamma: "+event.gamma+"</span>";
		document.getElementById("calibrate-btn").disabled = true;
		if(counterS + calibrationHoldS + 1 <= 0){
			document.getElementById("calibration-timer").innerText = "";
			document.getElementById("calibration-timer").style.display = "none";
			calibrationStart = true;
			document.getElementById("calibrate-btn").disabled = false;
			clearInterval(calibrationTimer);
		}
		else if(counterS + calibrationHoldS <= 0){
			document.getElementById("calibration-timer").classList.remove("calibrate-wait");
			sumZ = calibrationZArr.reduce((a, b) => a + b, 0);
			sumX = calibrationXArr.reduce((a, b) => a + b, 0);
			calibratedZOffsetVal = Math.round(((sumZ / calibrationZArr.length) || 0)*10)/10;
			calibratedXOffsetVal = Math.round(((sumX / calibrationXArr.length) || 0)*10)/10;

			if(Math.abs(calibratedZOffsetVal)<5 || Math.abs(calibratedXOffsetVal)<5){
				document.getElementById("calibration-timer").innerText = "DONE";
				debugView.innerHTML += "<span>&gt;avgZ: "+calibratedZOffsetVal+"</span>";
				debugView.innerHTML += "<span>&gt;avgX: "+calibratedXOffsetVal+"</span>";
		
				document.getElementById("calibratedZOffset").value = calibratedZOffsetVal;
				document.getElementById("calibratedZOffset").dispatchEvent(new Event('input'));
				document.getElementById("calibratedZOffset").nextElementSibling.value=calibratedZOffsetVal+String.fromCharCode(176);	//176 = degree symbol
				document.getElementById("calibratedXOffset").value = calibratedXOffsetVal;
				document.getElementById("calibratedXOffset").dispatchEvent(new Event('input'));
				document.getElementById("calibratedXOffset").nextElementSibling.value=calibratedXOffsetVal+String.fromCharCode(176);	//176 = degree symbol				
			}
			else{
				document.getElementById("calibration-timer").innerText = "ERROR";
			}
			calibrationZArr = [];
			calibrationXArr = [];
		}
		else if(counterS <= 0){
			calibrationStart = true;
			document.getElementById("calibration-timer").innerText = "WAIT";
			document.getElementById("calibration-timer").classList.add("calibrate-wait");
		}
		else{
			document.getElementById("calibration-timer").innerText = counterS;
		}
	
		counterS -= 1;
	}
	catch(err){
			debugView.innerHTML += "<span>&gt;calibrate(): "+err+"</span>";
	}
}


var lastPushTS = Date.now();
const pushIntervalMS = 10000;
const wheelTrackDistanceMM = 2300;
const axleToJockeyWheelMM = 3000;
var angleStepsForPush;

var lastBeepTS = Date.now();

const maxAngle = 30;
var lastXangle = 180;	//Set it to something big initially
var lastZangle = 180;	//Set it to something big initially

const xzUpdateIntervalMS = 400;	//200 is too fast, 400 is good
var lastXupdateTS = Date.now();
var lastZupdateTS = Date.now();

var calibrationTimer;
var counterS;
const calibrationHoldS = 2;
var calibrationStart = false;
const calibrationWaitS = 5;
var calibrationZArr = [];
var calibrationXArr = [];

var calibratedZOffsetVal = 0;
var calibratedXOffsetVal = 0;


let is_running = false;
var sleepSetTimeout_ctrl;

//Simplify getElement
addToHomeScreen = document.getElementById("add-to-home-screen");
calibrateBn = document.getElementById("calibrate-btn");
debugBtn = document.getElementById("show-debug");
debugView = document.getElementById("debug");
frontIcon = document.getElementById("front-icon");
motionInfo = document.getElementById("motion-info");
notValidDeviceView = document.getElementById("not-a-valid-device");
orientView = document.getElementById("orientation");
rateInput = document.getElementById("rate");
resetButton = document.getElementById("reset-btn");
reqMotionPermBtn = document.getElementById("request-perm-for-motion-btn");
scanQrCodeView = document.getElementById("scan-qr-code");
settingsView = document.getElementById("settings");
homeBtn = document.getElementById("show-home");
settingsBtn = document.getElementById("show-settings");
qrCodeBtn = document.getElementById("show-qr-code");
sideIcon = document.getElementById("side-icon");
//	speakButton = document.getElementById("speak");
subInfo = document.getElementById("sub-info");
subscribeNotifBtn = document.getElementById("subscribe-to-notifications-btn");
testSendBtn = document.getElementById("test-send-btn");

frontView = document.getElementById("front-view");
sideView = document.getElementById("side-view");

zAxis = document.getElementById("z-axis");
zDist = document.getElementById("z-distance");
xAxis = document.getElementById("x-axis");
xDist = document.getElementById("x-distance");
/*
if (navigator.serviceWorker) {
	try{
			debugView.innerHTML += "<span>&gt;frontend.js: exec initServiceWorker()</span>";

		initServiceWorker();
			debugView.innerHTML += "<span>&gt;frontend.js: after initServiceWorker()</span>";

	}
	catch(err){
			debugView.innerHTML += "<span>&gt;frontend.js: "+err+"</span>";
	}
}
*/

try{
	//Event listeners

	//Listens on hash change to hide previous and show current
	window.onhashchange = function(e){
		if(e.oldURL.split('#').length == 2){
			console.log(e.oldURL.split('#')[1]);
			document.getElementById(e.oldURL.split('#')[1]).style.display = "none";
		}
		if(location.hash!=""){
			document.getElementById(location.hash.replace("#","")).style.display = "block";
		}
	}

	//Header button
	homeBtn.addEventListener("click", () => {
		if(window.location.hash=="#orientation"){
			history.back();
		}
		else{
			pushHashAndFixTargetSelector("#orientation");
		}
	});

	settingsBtn.addEventListener("click", () => {
		if(window.location.hash=="#settings"){
			history.back();
		}
		else{
			pushHashAndFixTargetSelector("#settings");
		}
	});
	qrCodeBtn.addEventListener("click", function(e) {
		if(window.location.hash=="#distribute-qr-code"){
			history.back();
		}
		else{
			pushHashAndFixTargetSelector("#distribute-qr-code");
		}
	});

	debugBtn.addEventListener("click", function(e) {
		if(window.location.hash=="#debug"){
			history.back();
		}
		else{
			pushHashAndFixTargetSelector("#debug");
		}
	});

	// SAVE TO LOCALSTORAGE AND UPDATE VISUAL VALUE
	document.getElementById("pushIntervalMS").addEventListener("input", function(e) {
		localStorage.setItem("pushIntervalMS", e.target.value);
		document.getElementById("pushIntervalMS").value = e.target.value;
		e.target.nextElementSibling.value=Math.ceil(this.value)/1000+"s";
	});

/*
	document.getElementById("angleStepsForPush").addEventListener("input", function(e) {
		localStorage.setItem("angleStepsForPush", e.target.value);
		document.getElementById("angleStepsForPush").value = e.target.value;
		e.target.nextElementSibling.value=this.value+String.fromCharCode(176);	//176 = degree symbol
	});
*/

	document.getElementById("wheelTrackDistanceMM").addEventListener("input", function(e) {
		localStorage.setItem("wheelTrackDistanceMM", e.target.value);
		document.getElementById("wheelTrackDistanceMM").value = e.target.value;
		e.target.nextElementSibling.value=this.value+"mm";
	});

	document.getElementById("axleToJockeyWheelMM").addEventListener("input", function(e) {
		localStorage.setItem("axleToJockeyWheelMM", e.target.value);
		document.getElementById("axleToJockeyWheelMM").value = e.target.value;
		e.target.nextElementSibling.value=this.value+"mm";
	});

	document.getElementById("calibrate-btn").addEventListener("click", function(e) {
		counterS = calibrationWaitS;

		calibrate();
		document.getElementById("calibration-timer").style.display = "block";
		calibrationTimer = setInterval(function(){
			calibrate();
		}, 1000);
	});

	//Even though no input is possible from user, we use this when calibration sets this value, thus triggering the eventListener

	document.getElementById("calibratedZOffset").addEventListener("input", function(e) {
		localStorage.setItem("calibratedZOffset", e.target.value);
//debugView.innerHTML += "<span>&gt;localstoragteZ: "+e.target.value+"</span>";

		document.getElementById("calibratedZOffset").value = e.target.value;
		e.target.nextElementSibling.value=this.value+String.fromCharCode(176);	//176 = degree symbol
	});
	document.getElementById("calibratedXOffset").addEventListener("input", function(e) {
		localStorage.setItem("calibratedXOffset", e.target.value);
//debugView.innerHTML += "<span>&gt;localstoragteX: "+e.target.value+"</span>";
		document.getElementById("calibratedXOffset").value = e.target.value;
		e.target.nextElementSibling.value=this.value+String.fromCharCode(176);	//176 = degree symbol
	});

	resetButton.addEventListener("click", function(e){
		localStorage.clear();

		document.getElementById("pushIntervalMS").value = pushIntervalMS;
		document.getElementById("pushIntervalMS").dispatchEvent(new Event('input'));

//		document.getElementById("angleStepsForPush").value = angleStepsForPush;
//		document.getElementById("angleStepsForPush").dispatchEvent(new Event('input'));

		document.getElementById("wheelTrackDistanceMM").value = wheelTrackDistanceMM;
		document.getElementById("wheelTrackDistanceMM").dispatchEvent(new Event('input'));

		document.getElementById("axleToJockeyWheelMM").value = axleToJockeyWheelMM;
		document.getElementById("axleToJockeyWheelMM").dispatchEvent(new Event('input'));

		document.getElementById("calibratedZOffset").value = 0;
		document.getElementById("calibratedZOffset").dispatchEvent(new Event('input'));
		document.getElementById("calibratedZOffset").nextElementSibling.value=0+this.value+String.fromCharCode(176);	//176 = degree symbol

		document.getElementById("calibratedXOffset").value = 0;
		document.getElementById("calibratedXOffset").dispatchEvent(new Event('input'));
		document.getElementById("calibratedXOffset").nextElementSibling.value=0+this.value+String.fromCharCode(176);	//176 = degree symbol
	});


	//Main JS code
	if(window.location.hash==""){
		pushHashAndFixTargetSelector("#orientation");
	}

	// LOAD DEFAULTS
	if(localStorage.getItem("pushIntervalMS")!==null){
		document.getElementById("pushIntervalMS").setAttribute("value",localStorage.getItem("pushIntervalMS"));
	}
	else{
		document.getElementById("pushIntervalMS").setAttribute("value",pushIntervalMS);
	}
	document.getElementById("pushIntervalMS").dispatchEvent(new Event('input'));

/*
	if(localStorage.getItem("angleStepsForPush")!==null){
		document.getElementById("angleStepsForPush").setAttribute("value",localStorage.getItem("angleStepsForPush"));
	}
	else{
		document.getElementById("angleStepsForPush").setAttribute("value",angleStepsForPush);
	}
	document.getElementById("angleStepsForPush").dispatchEvent(new Event('input'));
*/

	if(localStorage.getItem("wheelTrackDistanceMM")!==null){
		document.getElementById("wheelTrackDistanceMM").setAttribute("value",localStorage.getItem("wheelTrackDistanceMM"));
	}
	else{
		document.getElementById("wheelTrackDistanceMM").setAttribute("value",wheelTrackDistanceMM);
	}
	document.getElementById("wheelTrackDistanceMM").dispatchEvent(new Event('input'));

	if(localStorage.getItem("axleToJockeyWheelMM")!==null){
		document.getElementById("axleToJockeyWheelMM").setAttribute("value",localStorage.getItem("axleToJockeyWheelMM"));
	}
	else{
		document.getElementById("axleToJockeyWheelMM").setAttribute("value",axleToJockeyWheelMM);
	}
	document.getElementById("axleToJockeyWheelMM").dispatchEvent(new Event('input'));

	if(localStorage.getItem("calibratedZOffset")!==null){
		document.getElementById("calibratedZOffset").setAttribute("value",localStorage.getItem("calibratedZOffset"));
	}
	else{
		document.getElementById("calibratedZOffset").setAttribute("value",0);
	}
	document.getElementById("calibratedZOffset").dispatchEvent(new Event('input'));
	if(localStorage.getItem("calibratedXOffset")!==null){
		document.getElementById("calibratedXOffset").setAttribute("value",localStorage.getItem("calibratedXOffset"));
	}
	else{
		document.getElementById("calibratedXOffset").setAttribute("value",0);
	}
	document.getElementById("calibratedXOffset").dispatchEvent(new Event('input'));


	//Custom Fontawesome icon - Caravan front view
	var faCaravanFront = {
		prefix: "fac",
		iconName: "caravan-front",
		icon: [
			448, 448,
			[],
			null,
			 "M414, 0V0C432, 0, 447, 22, 447, 40V386C447, 403.7, 432.7, 418, 415, 418V450C415, 467.7, 400.7, 482, 383, 482H352C334.3, 482, 320, 467.7, 320, 450V418L238, 440C238, 470, 200, 470, 200, 440L118, 418V450C118, 467.7, 103.7, 482, 86, 482H54C36.3, 482, 22, 467.7, 22, 450L22, 418C4.3, 418-10, 403.7-10, 386V40C-10, 20, 7.7, 2, 22, 0ZM64, 98V196C64, 213.7, 78.3, 228, 96, 228H352C369.7, 228, 384, 213.7, 384, 196V98C384, 80.3, 369.7, 66, 352, 66H96C78.3, 66, 64, 80.3, 64, 98ZM221, 168Z"
		]
	}
	FontAwesome.library.add(faCaravanFront)

	debugView.innerHTML += "<span>"+new Date(document.lastModified).toLocaleString()+"</span>";

	//Orientation, Portrait or Landscape
	window.addEventListener("orientationchange", deviceOrientation);
	deviceOrientation();

/*
Work to do

Check motion availability?

Check mobile device
if ios
	if standalone
		initServiceWorker
	else
		not standalone
		add to home screen
if android
	initServiceWorker()

*/
	//Verify Push Availability
	if(is_iOS()){
		debugView.innerHTML += "<span>&gt;frontend.js is_iOS()</span>";
		if(window.navigator.standalone){
			debugView.innerHTML += "<span>&gt;frontend.js navigator.standalone is TRUE</span>";
			if(navigator.serviceWorker) {
				subInfo.innerHTML = "exec initServiceWorker";
				subInfo.style.display = "none";
				subscribeNotifBtn.disabled = false;
				subscribeNotifBtn.style.display = "block";
				debugView.innerHTML += "<span>&gt;frontend.js navigator.serviceWorker is TRUE, exec initServiceWorker()</span>";
				initServiceWorker();
			}
			else{
				debugView.innerHTML += "<span>&gt;navigator.serviceWorker is FALSE</span>";
				if (location.protocol !== "https:") {
					subInfo.innerHTML = "Not HTTPS://";
					subInfo.style.display = "block";
					subscribeNotifBtn.disabled = true;
					subscribeNotifBtn.style.display = "none";
					debugView.innerHTML += "<span>&gt;frontend.js You need to visit this page with a secure connection (https://)</span>";
				}
				else{
					subInfo.innerHTML = "Unknown Error";
					subInfo.style.display = "block";
					subscribeNotifBtn.disabled = true;
					subscribeNotifBtn.style.display = "none";
					debugView.innerHTML += "<span>&gt;frontend.js navigator.serviceWorker failed by unknown reason</span>";
				}
			}
		}
		else{
			subInfo.innerHTML = "Not Standalone, add to home screen";
			subInfo.style.display = "block";
			subscribeNotifBtn.disabled = true;
			subscribeNotifBtn.style.display = "none";
			debugView.innerHTML += "<span>&gt;frontend.js navigator.standalone is FALSE</span>";
		}
	}
	else if(is_Android()){
			subInfo.style.display = "none";
			subscribeNotifBtn.disabled = false;
			subscribeNotifBtn.style.display = "block";
			debugView.innerHTML += "<span>&gt;frontend.js is_android()</span>";
			debugView.innerHTML += "<span>&gt;frontend.js exec initServiceWorker()</span>";
			initServiceWorker();
	}
	else{
		subInfo.innerHTML = "Neither iOS or Android";
		subInfo.style.display = "block";
		subscribeNotifBtn.disabled = true;
		subscribeNotifBtn.style.display = "none";

		debugView.innerHTML += "<span>&gt;frontend.js neither is_iOS() or is_android()</span>";
	}

/*
	if(window.navigator.standalone){
		debugView.innerHTML += "<span>&gt;frontend.js navigator.standalone is TRUE</span>";
		if (navigator.serviceWorker) {
			debugView.innerHTML += "<span>&gt;frontend.js navigator.serviceWorker is TRUE, exec initServiceWorker()</span>";
//				subscribeNotifBtn.disabled = false;
//				reqMotionPermBtn.disabled = false;

//			initServiceWorker();
		}
		else{
			debugView.innerHTML += "<span>&gt;navigator.serviceWorker is FALSE</span>";
			if (location.protocol !== "https:") {
				debugView.innerHTML += "<span>&gt;frontend.js You need to visit this page with a secure connection (https://)</span>";
			}
			else{
				debugView.innerHTML += "<span>&gt;frontend.js navigator.serviceWorker failed by unknown reason</span>";
			}
		}
	}
	else if(!window.navigator.standalone && is_iOS()){
		debugView.innerHTML += "<span>&gt;frontend.js iOS but not Standalone</span>";
		subscribeNotifBtn.disabled = true;
		subInfo.innerHTML = "iOS but not Standalone";
		addToHomeScreen.style.display = "block";
	}
	else if(window.navigator.standalone=="undefined" && is_Android()){
		debugView.innerHTML += "<span>&gt;frontend.js navigator.standalone is undefined and is_Android is TRUE, init serviceworker?</span>";
		subInfo.innerHTML = "Android?";
		//Need to init serviceworker when device is android
	}
	else{
		pushHashAndFixTargetSelector("#scan-qr-code");
		debugView.innerHTML += "<span>&gt;frontend.js navigator.standalone is undefined and not a iOS or Android device (redirect to QR-code)</span>";
		subInfo.innerHTML = "Neither Standalone iOS or Android";	//Add to home screen
		scanQrCodeView.style.display = "block";
		homeBtn.classList.add("fa-disabled");
		settingsBtn.classList.add("fa-disabled");
//		qrCodeBtn.classList.add("fa-disabled");
//		notValidDeviceView.style.display = "block";
	}
*/
	//Verify Motion Availability
	if(DeviceMotionEvent && typeof DeviceMotionEvent.requestPermission === "function"){
		debugView.innerHTML += "<span>&gt;frontend.js DeviceMotionEvent is TRUE</span>";
		if(typeof DeviceMotionEvent.requestPermission === "function"){
			debugView.innerHTML += "<span>&gt;frontend.js DeviceMotionEvent.requestPermission is FUNCTION</span>";
			motionInfo.innerHTML = "DeviceMotionEvent is available";
			motionInfo.style.display = "none";
			reqMotionPermBtn.disabled = false;
			reqMotionPermBtn.style.display = "block";
		}
		else{
			debugView.innerHTML += "<span>&gt;frontend.js DeviceMotionEvent.requestPermission is not a FUNCTION</span>";
			motionInfo.innerHTML = "DeviceMotionEvent is not available";
			reqMotionPermBtn.disabled = true;
			reqMotionPermBtn.style.display = "block";
		}
	}
	else{
		debugView.innerHTML += "<span>&gt;frontend.js DeviceMotionEvent FALSE OR reqMotion != function</span>";
		motionInfo.innerHTML = "DeviceMotionEvent is not available";
		reqMotionPermBtn.disabled = true;
		reqMotionPermBtn.style.display = "none";
	}

	debugView.innerHTML += "<span>&gt;frontend.js was loaded to the end</span>";
}
catch(err){
		debugView.innerHTML += "<span>&gt;frontend.js: "+err+"</span>";
}

