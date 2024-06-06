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
	case 180:
		body.classList = "";
		body.classList.add("rotation180");
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
	const ua = navigator.userAgent.toLowerCase(); + navigator.platform.toLowerCase();
	const isAndroid = ua.indexOf("android") > -1;
	return isAndroid;
}

function gotoView(view){
	try{
		//Cancel any calibration that was interrupted
		$("calibration-timer").innerText = "";
		$("calibration-timer").style.display = "none";
		$("settings").classList.remove("blur");
		clearInterval(calibrationTimer);

		//Cancel any orientation that was interrupted
		$("orientation-delay-timer").innerText = "";
		$("orientation-delay-timer").style.display = "none";
		$("orientation").classList.remove("blur");

		$("side-view").style.transform = "rotate(0deg)";
		$("side-icon").classList.remove("beatFlipH");
		$("side-icon").style.color = null;
		$("z-axis").innerHTML = "";
		$("z-dist").innerHTML = "";

		$("front-view").style.transform = "rotate(0deg)";
		$("front-icon").classList.remove("beat");
		$("front-icon").style.color = null;
		$("x-axis").innerHTML = "";
		$("x-dist").innerHTML = "";
		$("x-turns").innerHTML = "";

		clearInterval(orientationTimer);

		if($(view)){
			if(firstView == undefined){
				firstView=view;
			}
		
			$("debug").innerHTML += "<span>&gt;gotoView() " + view + "</span>";
			//Hide all element with class "views"
			document.querySelectorAll(".views").forEach(el => el.style.display = "none");
			//Show the designated view
			$(view).style.display = "block";
			//Set the designated view to a hash in the url
			history.pushState(null, null, "#" + view);
		
			//Remove class "active" from all header buttons
			$("orientation-btn").classList.remove("active");
			$("settings-btn").classList.remove("active");
			$("share-qr-code-btn").classList.remove("active");
			$("debug-btn").classList.remove("active");
		
			if($(view + "-btn")!=null){
				$(view + "-btn").classList.add("active");
				$(view + "-btn").classList.remove("fa-disabled");
			}
			else{
				$("orientation-btn").classList.add("fa-disabled");
				$("settings-btn").classList.add("fa-disabled");
			}
		
			//If target view is "orientation", then we are happy with all the verifications and can show all header buttons
			if(view=="orientation"){
				localStorage.setItem("usageCounter",parseInt(localStorage.getItem("usageCounter") || 0) + 1);
				$("debug").innerHTML += "<span>&gt;orientationDelay() Remind To Share " + localStorage.getItem("usageCounter") + "</span>";

				//usageCounter is incremented every time orientation view is called
				if(parseInt(localStorage.getItem("usageCounter")) == 5 || parseInt(localStorage.getItem("usageCounter")) % 20 == 0){
					gotoView("share-qr-code");
					$("debug").innerHTML += "<span>&gt;gotoView() Remind To Share</span>";
				}
				else{
					orientationCounter = 7;
					$("orientation-delay-timer").style.display = "block";
					$("orientation").classList.add("blur");
					orientationDelay();
					orientationTimer = setInterval(function(){
						orientationDelay();
					}, 1000);
					$("orientation-btn").classList.remove("fa-disabled");
					$("settings-btn").classList.remove("fa-disabled");
				}
			}
			else{
				window.removeEventListener("deviceorientation", handleOrientation);
			}
		}
		else{
			$("debug").innerHTML += "<span>&gt;gotoView(): view not found " + view + "</span>";
		}
	}
	catch(err){
		$("debug").innerHTML += "<span>&gt;gotoView(): " + err + "</span>";
	}
}


function setLanguage(lang){
	document.querySelectorAll('[data-lang]').forEach(element => {
		const key = element.getAttribute('data-lang');
		var i=0;

		var childElements = Array.from(element.childNodes);
		//console.log(elements);
		for(node=0; node<childElements.length; node++){
			if(element.childNodes[node].textContent.trim().length > 0){
				if(typeof langData[key] !== "undefined" && typeof langData[key][lang] !== "undefined" && i <= (Object.keys(langData[key][lang]).length-1)){
					if(typeof langData[key][lang] == "string"){
						element.childNodes[node].textContent = langData[key][lang];
						break;
					}
					else{
						element.childNodes[node].textContent = langData[key][lang][i];
					}
				}
				i++;
			}
		}
	});
}

function setUnits(unit){
//	console.log("set unit started");
//	console.log(unit);
	document.querySelectorAll('[data-unit]').forEach(element => {
		const key = element.getAttribute('data-unit');
		var node=0
		var i=0;
		[].forEach.call(element.childNodes, function(child) {
			//Used for debugging
			if(1==2 && key=="share-qr-code"){
				console.log(key);
				console.log(element.childNodes);
				console.log(element.childNodes[node].textContent);
				console.log(element.childNodes[node].textContent.trim().length);
				console.log(unitData[key][unit]);
			}
			element.childNodes[node].textContent = " " + unitData[key][unit];
			node++;
		});
	});
}


// Push Variables
var pushPermissionState;
var lastPushTS = Date.now();
const pushIntervalMS = 5000;
const wheelTrackDistanceMM = 2050;
const axleToJockeyWheelMM = 2500;
const jockeyWheelThreadPitchMM = 4;
var angleStepsForPush;

// Orientation Variables
var orientationPermissionState;
const maxAngle = 30;
var lastXangle = 0;//180;	//Set it to something big initially
var lastZangle = 0;//180;	//Set it to something big initially
const xzUpdateIntervalMS = 400;	//200 is too fast, 400 is good
var lastXupdateTS = Date.now();
var lastZupdateTS = Date.now();

var orientationTimer;
var orientationCounter;

// Calibration Variables
var calibrationTimer;
var calibrationCounter;
var calibrationZArr = [];
var calibrationXArr = [];
var calibratedZOffsetVal = 0;
var calibratedXOffsetVal = 0;

var firstView;

var lang;
var unit;

var unitData = {
	"distance": {
		"metric": "mm",
		"imperial": "inch",
	},
}

//		console.log(window.location.pathname.substring(0, loc.lastIndexOf('/')););

try{
	var scriptPath = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/'));

	release=window.location.pathname.split("/").slice(-2, -1)[0];
	$("debug").innerHTML += "<span>&gt;frontend.js release version " + release + "</span>";

	window.onhashchange = function() {
		gotoView(location.hash.replace("#",""));
	}

	//Change add-to-home-screen image to chrome if not safari
	if(navigator.userAgent.toLowerCase().indexOf("safari") != -1 && navigator.userAgent.toLowerCase().indexOf("chrome") == -1){
		$("debug").innerHTML += "<span>&gt;frontend.js userAgent is Safari (" + navigator.userAgent + ")</span>";
	}
	else{
		$("add-to-home-screen").children[0].src = "images/add-to-home-screen-chrome.jpg";
		$("debug").innerHTML += "<span>&gt;frontend.js userAgent is not Safari (" + navigator.userAgent + ")</span>";
	}

	//Fill select-language with available languages
	for(var key in langAvailable){
		var option = document.createElement('option');
		option.value = key;
		option.text = langAvailable[key];
		$("select-language").appendChild(option);
	}

	//Event listeners
	//Header buttons
	$("orientation-btn").addEventListener("click", () => {
		gotoView("orientation");
	});

	$("settings-btn").addEventListener("click", () => {
		gotoView("settings");
	});

	$("share-qr-code-btn").addEventListener("click", () => {
		gotoView("share-qr-code");
	});

	$("debug-btn").addEventListener("click", () => {
		gotoView("debug");
	});

	//Settings
	$("push-interval-ms").addEventListener("input", function(e){
		$("push-interval-ms").value = this.value;
		this.nextElementSibling.value = Math.ceil(this.value) / 1000 + "s";
	});
	$("push-interval-ms").addEventListener("pointerup", function(e){
		localStorage.setItem("pushIntervalMS", this.value);
		this.nextElementSibling.value = Math.ceil(this.value) / 1000 + "s";
	});

	$("wheel-track-distance-mm").addEventListener("input", function(e){
		if(unit == "imperial"){
			this.nextElementSibling.value = Math.round(this.value / 25.4);
		}
		else{
			this.nextElementSibling.value = this.value;
		}
	});
	$("wheel-track-distance-mm").addEventListener("pointerup", function(e){
		if(unit == "imperial"){
			this.nextElementSibling.value = Math.round(this.value / 25.4);
		}
		else{
			this.nextElementSibling.value = this.value;
		}
		localStorage.setItem("wheelTrackDistanceMM", this.value);
	});

	$("axle-to-jockey-wheel-mm").addEventListener("input", function(e){
		if(unit == "imperial"){
			this.nextElementSibling.value=Math.round(this.value / 25.4);
		}
		else{
			this.nextElementSibling.value=this.value;
		}
	});
	$("axle-to-jockey-wheel-mm").addEventListener("pointerup", function(e){
		if(unit == "imperial"){
			this.nextElementSibling.value=Math.round(this.value / 25.4);
		}
		else{
			this.nextElementSibling.value=this.value;
		}
		localStorage.setItem("axleToJockeyWheelMM", this.value);
	});

	$("jockey-wheel-thread-pitch-mm").addEventListener("input", function(e){
		if(unit == "imperial"){
			this.nextElementSibling.value=Math.round(this.value / 25.4);
		}
		else{
			this.nextElementSibling.value=this.value;
		}
	});
	$("jockey-wheel-thread-pitch-mm").addEventListener("pointerup", function(e){
		if(unit == "imperial"){
			this.nextElementSibling.value=Math.round(this.value / 25.4);
		}
		else{
			this.nextElementSibling.value=this.value;
		}
		localStorage.setItem("jockeyWheelThreadPitchMM", this.value);
	});

	$("subscribe-notif-btn").addEventListener("click", () => {
		subscribeToPush();
	});
	$("test-send-btn").addEventListener("click", () => {
		sendPush(langData['test-push-title'][lang],langData['test-push-body'][lang]);
	});
	$("req-orientation-perm-btn").addEventListener("click", () => {
		requestPermForOrientation();
	});

	$("calibrate-btn").addEventListener("click", function(e){
		calibrationCounter = 7;
		$("settings").classList.add("blur");
		window.addEventListener("deviceorientation", orientationSnapshot);

		calibrationDelay();
		$("calibration-timer").style.display = "block";
		calibrationTimer = setInterval(function(){
			calibrationDelay();
		}, 1000);
	});

	//Even though no input is possible from user, we use this when calibration sets this value, thus triggering the eventListener
	$("calibrated-z-offset").addEventListener("input", function(e) {
		localStorage.setItem("calibratedZOffset", this.value);
		$("calibrated-z-offset").value = this.value;
		this.nextElementSibling.value = this.value + String.fromCharCode(176);	//176 = degree symbol
	});
	$("calibrated-x-offset").addEventListener("input", function(e) {
		localStorage.setItem("calibratedXOffset", this.value);
		$("calibrated-x-offset").value = this.value;
		this.nextElementSibling.value = this.value + String.fromCharCode(176);	//176 = degree symbol
	});

	$("select-language").addEventListener("change", function(e) {
		localStorage.setItem("language", this.value);
		$("select-language").value = this.value;
		location.reload();
	});

	$("unit-metric").addEventListener("change", function(e) {
		localStorage.setItem("units", this.value);
		location.reload();
	});
	$("unit-imperial").addEventListener("change", function(e) {
		localStorage.setItem("units", this.value);
		location.reload();
	});

	$("reset-btn").addEventListener("click", function(e){
		localStorage.clear();
		location.reload();
	});

	// LOAD DEFAULTS FROM LOCALSTORAGE
	if(localStorage.getItem("language")!==null){
		lang = localStorage.getItem("language");
		setLanguage(lang);
		$("select-language").value = lang;
	}
	else{
		lang = "en";
		localStorage.setItem("language", "en");
		$("select-language").value = lang;
	}

	if(localStorage.getItem("units")!==null){
		unit = localStorage.getItem("units");
		if(unit=="imperial"){
			$("unit-imperial").checked = true;
			$("unit-imperial").click();
		}
		else{
			$("unit-metric").checked = true;
			$("unit-metric").click();
		}
	}
	else{
		$("unit-metric").checked = true;
		$("unit-metric").click();
		unit = "metric";
	}
	setUnits(unit);

	if(localStorage.getItem("pushIntervalMS")!==null){
		$("push-interval-ms").setAttribute("value",localStorage.getItem("pushIntervalMS"));
	}
	else{
		$("push-interval-ms").setAttribute("value",pushIntervalMS);
	}
	$("push-interval-ms").dispatchEvent(new Event("pointerup"));

	if(localStorage.getItem("wheelTrackDistanceMM")!==null){
		$("wheel-track-distance-mm").setAttribute("value",localStorage.getItem("wheelTrackDistanceMM"));
	}
	else{
		$("wheel-track-distance-mm").setAttribute("value",wheelTrackDistanceMM);
	}
	$("wheel-track-distance-mm").dispatchEvent(new Event("pointerup"));

	if(localStorage.getItem("axleToJockeyWheelMM")!==null){
		$("axle-to-jockey-wheel-mm").setAttribute("value",localStorage.getItem("axleToJockeyWheelMM"));
	}
	else{
		$("axle-to-jockey-wheel-mm").setAttribute("value",axleToJockeyWheelMM);
	}
	$("axle-to-jockey-wheel-mm").dispatchEvent(new Event("pointerup"));

	if(localStorage.getItem("jockeyWheelThreadPitchMM")!==null){
		$("jockey-wheel-thread-pitch-mm").setAttribute("value",localStorage.getItem("jockeyWheelThreadPitchMM"));
	}
	else{
		$("jockey-wheel-thread-pitch-mm").setAttribute("value",jockeyWheelThreadPitchMM);
	}
	$("jockey-wheel-thread-pitch-mm").dispatchEvent(new Event("pointerup"));

	if(localStorage.getItem("calibratedZOffset")!==null){
		$("calibrated-z-offset").setAttribute("value",localStorage.getItem("calibratedZOffset"));
	}
	else{
		$("calibrated-z-offset").setAttribute("value",0);
	}
	$("calibrated-z-offset").dispatchEvent(new Event("input"));
	if(localStorage.getItem("calibratedXOffset")!==null){
		$("calibrated-x-offset").setAttribute("value",localStorage.getItem("calibratedXOffset"));
	}
	else{
		$("calibrated-x-offset").setAttribute("value",0);
	}
	$("calibrated-x-offset").dispatchEvent(new Event("input"));

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

	$("debug").innerHTML += "<span>" + new Date(document.lastModified).toLocaleString() + "</span>";

	//Orientation, Portrait or Landscape
	window.addEventListener("orientationchange", deviceOrientation);
	deviceOrientation();

	if(is_iOS()){
		$("debug").innerHTML += "<span>&gt;frontend.js is_iOS()</span>";

		//Verify Push Availability
		if(window.navigator.standalone){
			$("debug").innerHTML += "<span>&gt;frontend.js navigator.standalone is TRUE</span>";
			if(navigator.serviceWorker) {
				$("sub-info").style.display = "none";
				$("subscribe-notif-btn").disabled = false;
				$("subscribe-notif-btn").style.display = "block";
				$("subscribe-notif-btn").classList.add("pulse");
				$("debug").innerHTML += "<span>&gt;frontend.js navigator.serviceWorker is TRUE, exec initServiceWorker()</span>";
				initServiceWorker();
			}
			else{
				$("debug").innerHTML += "<span>&gt;navigator.serviceWorker is FALSE</span>";
				if (location.protocol !== "https:") {
					$("sub-info").innerHTML = langData["not-https"][lang];
					$("sub-info").style.display = "block";
					$("subscribe-notif-btn").disabled = true;
					$("subscribe-notif-btn").style.display = "none";
					$("subscribe-notif-btn").classList.remove("pulse");
					$("debug").innerHTML += "<span>&gt;frontend.js You need to visit this page with a secure connection (https://)</span>";
				}
				else{
					$("sub-info").innerHTML = langData["unknown error"][lang];
					$("sub-info").style.display = "block";
					$("subscribe-notif-btn").disabled = true;
					$("subscribe-notif-btn").style.display = "none";
					$("subscribe-notif-btn").classList.remove("pulse");
					$("debug").innerHTML += "<span>&gt;frontend.js navigator.serviceWorker failed by unknown reason</span>";
				}
			}
		}
		else{
			gotoView("add-to-home-screen");
			$("sub-info").innerHTML = langData["not-standalone-add-to-home-screen"][lang];
			$("sub-info").style.display = "block";
			$("subscribe-notif-btn").disabled = true;
			$("subscribe-notif-btn").style.display = "none";
			$("subscribe-notif-btn").classList.remove("pulse");
			$("debug").innerHTML += "<span>&gt;frontend.js navigator.standalone is FALSE</span>";
		}

		//Verify Orientation Availability
		//if(DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission === "function"){
		if(DeviceOrientationEvent){
			$("debug").innerHTML += "<span>&gt;frontend.js DeviceOrientationEvent is TRUE</span>";
			if(typeof DeviceOrientationEvent.requestPermission === "function"){
				$("debug").innerHTML += "<span>&gt;frontend.js DeviceOrientationEvent.requestPermission is FUNCTION</span>";
				$("orientation-info").innerHTML = langData["device-orientation-is-available"][lang];
				$("orientation-info").style.display = "block";
				$("req-orientation-perm-btn").disabled = false;
				$("req-orientation-perm-btn").style.display = "block";
				$("req-orientation-perm-btn").classList.add("pulse");
			}
			else{
				$("debug").innerHTML += "<span>&gt;frontend.js DeviceOrientationEvent.requestPermission is not a FUNCTION</span>";
				$("orientation-info").style.background = "red";
				$("orientation-info").innerHTML = langData["device-orientation-requestPermission-is-not-a-function"][lang];
				$("req-orientation-perm-btn").disabled = true;
				$("req-orientation-perm-btn").style.display = "block";
				$("req-orientation-perm-btn").classList.remove("pulse");
			}
		}
		else{
			$("debug").innerHTML += "<span>&gt;frontend.js DeviceOrientationEvent FALSE</span>";
			$("orientation-info").style.background = "red";
			$("orientation-info").innerHTML = langData["device-orientation-is-not-available"][lang];
			$("req-orientation-perm-btn").disabled = true;
			$("req-orientation-perm-btn").style.display = "none";
			$("req-orientation-perm-btn").classList.remove("pulse");
		}

	}
	else if(is_Android()){
		$("sub-info").style.display = "none";
		$("subscribe-notif-btn").disabled = false;
		$("subscribe-notif-btn").style.display = "block";
		$("subscribe-notif-btn").classList.add("pulse");
		$("debug").innerHTML += "<span>&gt;frontend.js is_android()</span>";
		$("debug").innerHTML += "<span>&gt;frontend.js exec initServiceWorker()</span>";
		$("settings-btn").classList.remove("fa-disabled");
		initServiceWorker();

		//Verify Orientation Availability
		if(DeviceOrientationEvent){
			$("debug").innerHTML += "<span>&gt;frontend.js DeviceOrientationEvent is TRUE</span>";
			$("orientation-info").innerHTML = langData["device-orientation-is-available"][lang];
			$("orientation-info").style.display = "block";
			$("req-orientation-perm-btn").disabled = false;
			$("req-orientation-perm-btn").style.display = "block";
			$("req-orientation-perm-btn").classList.add("pulse");
		}
		else{
			$("debug").innerHTML += "<span>&gt;frontend.js DeviceOrientationEvent FALSE</span>";
			$("orientation-info").style.background = "red";
			$("orientation-info").innerHTML = langData["device-orientation-is-not-available"][lang];
			$("req-orientation-perm-btn").disabled = true;
			$("req-orientation-perm-btn").style.display = "none";
			$("req-orientation-perm-btn").classList.remove("pulse");
		}
	}
	else{
		gotoView("not-a-valid-device");
		$("sub-info").innerHTML = langData["neither-ios-or-android"][lang];
		$("sub-info").style.display = "block";
		$("subscribe-notif-btn").disabled = true;
		$("subscribe-notif-btn").style.display = "none";
		$("subscribe-notif-btn").classList.remove("pulse");

		$("debug").innerHTML += "<span>&gt;frontend.js neither is_iOS() or is_android()</span>";
	}
	$("debug").innerHTML += "<span>&gt;frontend.js was loaded to the end</span>";
}
catch(err){
		$("debug").innerHTML += "<span>&gt;frontend.js: " + err + "</span>";
}
