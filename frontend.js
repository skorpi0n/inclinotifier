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

function pushHashAndFixTargetSelector(hash){
		console.log(4);
	history.pushState({}, document.title, hash); //called as you would normally
	const onpopstate = window.onpopstate; //store the old event handler to restore it later
	window.onpopstate = function() { //this will be called when we call history.back()
		window.onpopstate = onpopstate; //restore the original handler
		history.forward(); //go forward again to update the CSS
	};
	history.back(); //go back to trigger the above function
}
function calibrate(event){
	try{
		$("calibrate-btn").disabled = true;
		if(counterS + calibrationHoldS + 1 <= 0){
			$("calibration-timer").innerText = "";
			$("calibration-timer").style.display = "none";
			calibrationStart = true;
			$("calibrate-btn").disabled = false;
			clearInterval(calibrationTimer);
		}
		else if(counterS + calibrationHoldS <= 0){
			$("calibration-timer").classList.remove("calibrate-wait");
			sumZ = calibrationZArr.reduce((a, b) => a + b, 0);
			sumX = calibrationXArr.reduce((a, b) => a + b, 0);
			calibratedZOffsetVal = Math.round(((sumZ / calibrationZArr.length) || 0)*10)/10;
			calibratedXOffsetVal = Math.round(((sumX / calibrationXArr.length) || 0)*10)/10;

			if(Math.abs(calibratedZOffsetVal)<5 || Math.abs(calibratedXOffsetVal)<5){
				$("calibration-timer").innerText = "DONE";
				$("debug").innerHTML += "<span>&gt;avgZ: "+calibratedZOffsetVal+"</span>";
				$("debug").innerHTML += "<span>&gt;avgX: "+calibratedXOffsetVal+"</span>";
				$("calibrated-z-offset").value = calibratedZOffsetVal;
				$("calibrated-z-offset").dispatchEvent(new Event('input'));
				$("calibrated-z-offset").nextElementSibling.value=calibratedZOffsetVal+String.fromCharCode(176);	//176 = degree symbol
				$("calibrated-x-offset").value = calibratedXOffsetVal;
				$("calibrated-x-offset").dispatchEvent(new Event('input'));
				$("calibrated-x-offset").nextElementSibling.value=calibratedXOffsetVal+String.fromCharCode(176);	//176 = degree symbol				
			}
			else{
				$("calibration-timer").innerText = "ERROR";
			}
			calibrationZArr = [];
			calibrationXArr = [];
		}
		else if(counterS <= 0){
			calibrationStart = true;
			$("calibration-timer").innerText = "WAIT";
			$("calibration-timer").classList.add("calibrate-wait");
		}
		else{
			$("calibration-timer").innerText = counterS;
		}
		counterS -= 1;
	}
	catch(err){
			$("debug").innerHTML += "<span>&gt;calibrate(): "+err+"</span>";
	}
}

// Push Variables
var lastPushTS = Date.now();
const pushIntervalMS = 10000;
const wheelTrackDistanceMM = 2300;
const axleToJockeyWheelMM = 3000;
var angleStepsForPush;

// Motion Variables
const maxAngle = 30;
var lastXangle = 180;	//Set it to something big initially
var lastZangle = 180;	//Set it to something big initially
const xzUpdateIntervalMS = 400;	//200 is too fast, 400 is good
var lastXupdateTS = Date.now();
var lastZupdateTS = Date.now();

// Calibration Variables
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

var $ = function(id){
	return document.getElementById(id);
};

try{
	//Event listeners
	if(location.hash!=""){
		console.log(1);
		$(location.hash.replace("#","")).style.display = "block";
			$("debug").innerHTML += "<span>&gt;"+location.hash.replace("#","")+"</span>";

//		$(location.hash.replace("#","")+"-btn").classList.add("active");
	}
	//Listens on hash change to hide previous and show current
	window.onhashchange = function(e){
		$("orientation-btn").classList.remove("active");
		$("settings-btn").classList.remove("active");
		$("qr-code-btn").classList.remove("active");
		$("debug-btn").classList.remove("active");
//		$("orientation-btn").classList.add("fa-disabled");
//		$("settings-btn").classList.add("fa-disabled");
//		$("qr-code-btn").classList.add("fa-disabled");

		if(e.oldURL.split('#').length == 2){
		console.log(2);

//			$(e.oldURL.split('#')[1]).style.display = "none";
		}
		if(location.hash!=""){
		console.log(3);
			$(location.hash.replace("#","")).style.display = "block";
		}
	}

	//Header buttons
	$("orientation-btn").addEventListener("click", () => {
		pushHashAndFixTargetSelector("#orientation");
		$("orientation-btn").classList.add("active");
		$("orientation-btn").classList.remove("fa-disabled");
	});

	$("settings-btn").addEventListener("click", () => {
		pushHashAndFixTargetSelector("#settings");
		$("settings-btn").classList.add("active");
		$("settings-btn").classList.remove("fa-disabled");
	});
	$("qr-code-btn").addEventListener("click", function(e) {
		pushHashAndFixTargetSelector("#distribute-qr-code");
		$("qr-code-btn").classList.add("active");
		$("qr-code-btn").classList.remove("fa-disabled");
	});

	$("debug-btn").addEventListener("click", function(e) {
		pushHashAndFixTargetSelector("#debug");
		$("debug-btn").classList.add("active");
		$("debug-btn").classList.remove("fa-disabled");
	});

	// SAVE TO LOCALSTORAGE AND UPDATE VISUAL VALUE
	$("push-interval-ms").addEventListener("input", function(e) {
		localStorage.setItem("pushIntervalMS", e.target.value);
		$("push-interval-ms").value = e.target.value;
		e.target.nextElementSibling.value=Math.ceil(this.value)/1000+"s";
	});

/*
	document.getElementById("angleStepsForPush").addEventListener("input", function(e) {
		localStorage.setItem("angleStepsForPush", e.target.value);
		document.getElementById("angleStepsForPush").value = e.target.value;
		e.target.nextElementSibling.value=this.value+String.fromCharCode(176);	//176 = degree symbol
	});
*/

	$("wheel-track-distance-mm").addEventListener("input", function(e) {
		localStorage.setItem("wheelTrackDistanceMM", e.target.value);
		$("wheel-track-distance-mm").value = e.target.value;
		e.target.nextElementSibling.value=this.value+"mm";
	});

	$("axle-to-jockey-wheel-mm").addEventListener("input", function(e) {
		localStorage.setItem("axleToJockeyWheelMM", e.target.value);
		$("axle-to-jockey-wheel-mm").value = e.target.value;
		e.target.nextElementSibling.value=this.value+"mm";
	});

	$("calibrate-btn").addEventListener("click", function(e) {
		counterS = calibrationWaitS;
		calibrate();
		$("calibration-timer").style.display = "block";
		calibrationTimer = setInterval(function(){
			calibrate();
		}, 1000);
	});

	//Even though no input is possible from user, we use this when calibration sets this value, thus triggering the eventListener
	$("calibrated-z-offset").addEventListener("input", function(e) {
		localStorage.setItem("calibratedZOffset", e.target.value);
		$("calibrated-z-offset").value = e.target.value;
		e.target.nextElementSibling.value=this.value+String.fromCharCode(176);	//176 = degree symbol
	});
	$("calibrated-x-offset").addEventListener("input", function(e) {
		localStorage.setItem("calibratedXOffset", e.target.value);
		$("calibrated-x-offset").value = e.target.value;
		e.target.nextElementSibling.value=this.value+String.fromCharCode(176);	//176 = degree symbol
	});

	$("reset-btn").addEventListener("click", function(e){
		localStorage.clear();

		$("push-interval-ms").value = pushIntervalMS;
		$("push-interval-ms").dispatchEvent(new Event('input'));

//		document.getElementById("angleStepsForPush").value = angleStepsForPush;
//		document.getElementById("angleStepsForPush").dispatchEvent(new Event('input'));

		$("wheel-track-distance-mm").value = wheelTrackDistanceMM;
		$("wheel-track-distance-mm").dispatchEvent(new Event('input'));

		$("axle-to-jockey-wheel-mm").value = axleToJockeyWheelMM;
		$("axle-to-jockey-wheel-mm").dispatchEvent(new Event('input'));

		$("calibrated-z-offset").value = 0;
		$("calibrated-z-offset").dispatchEvent(new Event('input'));
		$("calibrated-z-offset").nextElementSibling.value=0+this.value+String.fromCharCode(176);	//176 = degree symbol

		$("calibrated-x-offset").value = 0;
		$("calibrated-x-offset").dispatchEvent(new Event('input'));
		$("calibrated-x-offset").nextElementSibling.value=0+this.value+String.fromCharCode(176);	//176 = degree symbol
	});


	//Main JS code
//	if(window.location.hash==""){
//		pushHashAndFixTargetSelector("#orientation");
//		window.location.hash = "#orientation";
//history.pushState(null,null,"#orientation");
//	}

	// LOAD DEFAULTS
	if(localStorage.getItem("pushIntervalMS")!==null){
		$("push-interval-ms").setAttribute("value",localStorage.getItem("pushIntervalMS"));
	}
	else{
		$("push-interval-ms").setAttribute("value",pushIntervalMS);
	}
	$("push-interval-ms").dispatchEvent(new Event('input'));

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
		$("wheel-track-distance-mm").setAttribute("value",localStorage.getItem("wheelTrackDistanceMM"));
	}
	else{
		$("wheel-track-distance-mm").setAttribute("value",wheelTrackDistanceMM);
	}
	$("wheel-track-distance-mm").dispatchEvent(new Event('input'));

	if(localStorage.getItem("axleToJockeyWheelMM")!==null){
		$("axle-to-jockey-wheel-mm").setAttribute("value",localStorage.getItem("axleToJockeyWheelMM"));
	}
	else{
		$("axle-to-jockey-wheel-mm").setAttribute("value",axleToJockeyWheelMM);
	}
	$("axle-to-jockey-wheel-mm").dispatchEvent(new Event('input'));

	if(localStorage.getItem("calibratedZOffset")!==null){
		$("calibrated-z-offset").setAttribute("value",localStorage.getItem("calibratedZOffset"));
	}
	else{
		$("calibrated-z-offset").setAttribute("value",0);
	}
	$("calibrated-z-offset").dispatchEvent(new Event('input'));
	if(localStorage.getItem("calibratedXOffset")!==null){
		$("calibrated-x-offset").setAttribute("value",localStorage.getItem("calibratedXOffset"));
	}
	else{
		$("calibrated-x-offset").setAttribute("value",0);
	}
	$("calibrated-x-offset").dispatchEvent(new Event('input'));


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

	$("debug").innerHTML += "<span>"+new Date(document.lastModified).toLocaleString()+"</span>";

	//Orientation, Portrait or Landscape
	window.addEventListener("orientationchange", deviceOrientation);
	deviceOrientation();

	//Verify Push Availability
	if(is_iOS()){
		$("debug").innerHTML += "<span>&gt;frontend.js is_iOS()</span>";
		if(window.navigator.standalone){
			$("debug").innerHTML += "<span>&gt;frontend.js navigator.standalone is TRUE</span>";
			if(navigator.serviceWorker) {
				$("sub-info").innerHTML = "exec initServiceWorker";
				$("sub-info").style.display = "none";
				$("subscribe-notif-btn").disabled = false;
				$("subscribe-notif-btn").style.display = "block";
				$("debug").innerHTML += "<span>&gt;frontend.js navigator.serviceWorker is TRUE, exec initServiceWorker()</span>";
				initServiceWorker();
			}
			else{
				$("debug").innerHTML += "<span>&gt;navigator.serviceWorker is FALSE</span>";
				if (location.protocol !== "https:") {
					$("sub-info").innerHTML = "Not HTTPS://";
					$("sub-info").style.display = "block";
					$("subscribe-notif-btn").disabled = true;
					$("subscribe-notif-btn").style.display = "none";
					$("debug").innerHTML += "<span>&gt;frontend.js You need to visit this page with a secure connection (https://)</span>";
				}
				else{
					$("sub-info").innerHTML = "Unknown Error";
					$("sub-info").style.display = "block";
					$("subscribe-notif-btn").disabled = true;
					$("subscribe-notif-btn").style.display = "none";
					$("debug").innerHTML += "<span>&gt;frontend.js navigator.serviceWorker failed by unknown reason</span>";
				}
			}
		}
		else{
pushHashAndFixTargetSelector("#add-to-home-screen");
			$("sub-info").innerHTML = "Not Standalone, add to home screen";
			$("sub-info").style.display = "block";
			$("subscribe-notif-btn").disabled = true;
			$("subscribe-notif-btn").style.display = "none";
			$("debug").innerHTML += "<span>&gt;frontend.js navigator.standalone is FALSE</span>";
		}
	}
	else if(is_Android()){
			$("sub-info").style.display = "none";
			$("subscribe-notif-btn").disabled = false;
			$("subscribe-notif-btn").style.display = "block";
			$("debug").innerHTML += "<span>&gt;frontend.js is_android()</span>";
			$("debug").innerHTML += "<span>&gt;frontend.js exec initServiceWorker()</span>";
			initServiceWorker();
	}
	else{
pushHashAndFixTargetSelector("#not-a-valid-device");
		$("sub-info").innerHTML = "Neither iOS or Android";
		$("sub-info").style.display = "block";
		$("subscribe-notif-btn").disabled = true;
		$("subscribe-notif-btn").style.display = "none";

		$("debug").innerHTML += "<span>&gt;frontend.js neither is_iOS() or is_android()</span>";
	}

	//Verify Motion Availability
	if(DeviceMotionEvent && typeof DeviceMotionEvent.requestPermission === "function"){
		$("debug").innerHTML += "<span>&gt;frontend.js DeviceMotionEvent is TRUE</span>";
		if(typeof DeviceMotionEvent.requestPermission === "function"){
			$("debug").innerHTML += "<span>&gt;frontend.js DeviceMotionEvent.requestPermission is FUNCTION</span>";
			$("motion-info").innerHTML = "DeviceMotionEvent is available";
			$("motion-info").style.display = "none";
			$("req-motion-perm-btn").disabled = false;
			$("req-motion-perm-btn").style.display = "block";
		}
		else{
			$("debug").innerHTML += "<span>&gt;frontend.js DeviceMotionEvent.requestPermission is not a FUNCTION</span>";
			$("motion-info").innerHTML = "DeviceMotionEvent is not available";
			$("req-motion-perm-btn").disabled = true;
			$("req-motion-perm-btn").style.display = "block";
		}
	}
	else{
		$("debug").innerHTML += "<span>&gt;frontend.js DeviceMotionEvent FALSE OR reqMotion != function</span>";
		$("motion-info").innerHTML = "DeviceMotionEvent is not available";
		$("req-motion-perm-btn").disabled = true;
		$("req-motion-perm-btn").style.display = "none";
	}

	$("debug").innerHTML += "<span>&gt;frontend.js was loaded to the end</span>";

}
catch(err){
		$("debug").innerHTML += "<span>&gt;frontend.js: "+err+"</span>";
}
