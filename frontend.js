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

var lastPushTS = Date.now();
const pushIntervalMS = 5000;
const angleStepsForPush=5;
const wheelTrackDistanceMM = 2300;
const axleToJockeyWheelMM = 3000;

const maxAngle = 30;	//IS THIS USED?
var lastXangle = 180;	//Set it to something big initially
var lastZangle = 180;	//Set it to something big initially

const xzUpdateIntervalMS = 400;	//200 is too fast, 400 is good
var lastXupdateTS = Date.now();
var lastZupdateTS = Date.now();


let is_running = false;
var sleepSetTimeout_ctrl;
//document.addEventListener("DOMContentLoaded", () => {		//No need when we laod script in the HTML end

	//Simplify getElement
	addToHomeScreen = document.getElementById("add-to-home-screen");
	debugBtn = document.getElementById("show-debug");
	debugView = document.getElementById("debug");
	frontView = document.getElementById("front-view");
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
	sideView = document.getElementById("side-view");
	speakButton = document.getElementById("speak");
	subInfo = document.getElementById("sub-info");
	subscribeNotifBtn = document.getElementById("subscribe-to-notifications-btn");

	xAxis = document.getElementById("x-axis");
	xDist = document.getElementById("x-distance");
	zDist = document.getElementById("z-distance");
	zAxis = document.getElementById("z-axis");

	//Event listeners
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

	document.getElementById("angleStepsForPush").addEventListener("input", function(e) {
		localStorage.setItem("angleStepsForPush", e.target.value);
		document.getElementById("angleStepsForPush").value = e.target.value;
		e.target.nextElementSibling.value=this.value+String.fromCharCode(176);	//176 = degree symbol
	});

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

	resetButton.addEventListener("click", function(e){
		localStorage.clear();

		document.getElementById("pushIntervalMS").value = pushIntervalMS;
		document.getElementById("pushIntervalMS").dispatchEvent(new Event('input'));

		document.getElementById("angleStepsForPush").value = angleStepsForPush;
		document.getElementById("angleStepsForPush").dispatchEvent(new Event('input'));

		document.getElementById("wheelTrackDistanceMM").value = wheelTrackDistanceMM;
		document.getElementById("wheelTrackDistanceMM").dispatchEvent(new Event('input'));

		document.getElementById("axleToJockeyWheelMM").value = axleToJockeyWheelMM;		document.getElementById("axleToJockeyWheelMM").dispatchEvent(new Event('input'));

	});


	//Main JS code
	if(window.location.hash==""){
		pushHashAndFixTargetSelector("#home");
	}

	// LOAD DEFAULTS
	if(localStorage.getItem("pushIntervalMS")!==null){
		document.getElementById("pushIntervalMS").setAttribute("value",localStorage.getItem("pushIntervalMS"));
	}
	else{
		document.getElementById("pushIntervalMS").setAttribute("value",pushIntervalMS);
	}
	document.getElementById("pushIntervalMS").dispatchEvent(new Event('input'));

	if(localStorage.getItem("angleStepsForPush")!==null){
		document.getElementById("angleStepsForPush").setAttribute("value",localStorage.getItem("angleStepsForPush"));
	}
	else{
		document.getElementById("angleStepsForPush").setAttribute("value",angleStepsForPush);
	}
	document.getElementById("angleStepsForPush").dispatchEvent(new Event('input'));

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

/*
	//retrieve localstorage variables
	if(localStorage.getItem("volume")!==null){
		volumeInput.value = localStorage.getItem("volume");
	}
	if(localStorage.getItem("rate")!==null){
		rateInput.value = localStorage.getItem("rate");
	}
	if(localStorage.getItem("pitch")!==null){
		pitchInput.value = localStorage.getItem("pitch");
	}
*/

	//Touch Events
//	document.body.addEventListener("touchstart", function(e){ e.preventDefault(); });
//	document.body.addEventListener("touchmove", function(e){ e.preventDefault(); });
	
	/*
	document.getElementById("side-view").addEventListener("touchstart", process_touchstart, false);
	document.getElementById("side-view").addEventListener("touchend", process_touchend, false);
	document.getElementById("side-view").addEventListener("touchmove", process_touchmove, false);
	document.getElementById("side-view").addEventListener("touchcancel", process_touchcancel, false);
	*/

	//Orientation, Portrait or Landscape
	window.addEventListener("orientationchange", deviceOrientation);
	deviceOrientation();

	if(window.navigator.standalone){
		debugView.innerHTML += "<span>&gt;navigator.standalone is TRUE</span>";
		if (navigator.serviceWorker) {
			debugView.innerHTML += "<span>&gt;navigator.serviceWorker is TRUE</span>";
			initServiceWorker();
		}
		else{
			debugView.innerHTML += "<span>&gt;navigator.serviceWorker is FALSE</span>";
			if (location.protocol !== "https:") {
				debugView.innerHTML += "<span>&gt;You need to visit this page with a secure connection (https://)</span>";
			}
			else{
				debugView.innerHTML += "<span>&gt;navigator.serviceWorker failed by unknown reason</span>";
			}
		}
	}
	else if(!window.navigator.standalone && is_iOS()){
		debugView.innerHTML += "<span>&gt;is NOT standalone and is iOS</span>";
		subscribeNotifBtn.disabled = true;
		subInfo.innerHTML = "Not Standalone and not iOS";
		addToHomeScreen.style.display = "block";
	}
	else if(window.navigator.standalone=="undefined" && is_Android()){
		debugView.innerHTML += "<span>&gt;navigator.standalone is undefined and is_Android is TRUE, init serviceworker?</span>";
		subInfo.innerHTML = "Android?";
		//Need to init serviceworker when device is android
	}
	else{
		window.location.hash = "scan-qr-code";
		debugView.innerHTML += "<span>&gt;navigator.standalone is undefined and not a iOS or Android device (redirect to QR-code)</span>";
		subInfo.innerHTML = "Neither Standalone iOS or Android";	//Add to home screen
		scanQrCodeView.style.display = "block";
		homeBtn.classList.add("fa-disabled");
		settingsBtn.classList.add("fa-disabled");
//		qrCodeBtn.classList.add("fa-disabled");
	}

	if (DeviceMotionEvent && typeof DeviceMotionEvent.requestPermission === "function"){
		debugView.innerHTML += "<span>&gt;DeviceMotion True AND reqMotion = function</span>";
		motionInfo.innerHTML = "DeviceMotion function exist";
		reqMotionPermBtn.disabled = false;
	}
	else{
		debugView.innerHTML += "<span>&gt;DeviceMotion False OR reqMotion != function</span>";
		motionInfo.innerHTML = "DeviceMotion is not accessible";
	}

//});