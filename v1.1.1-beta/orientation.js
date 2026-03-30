function calibrationDelay(event){
	try{
		$("calibrate-btn").disabled = true;
		if(calibrationCounter + 3 <= 0){
			$("calibration-timer").style.fontSize = null;
			$("calibration-timer").innerText = "";
			$("calibration-timer").style.display = "none";
			$("calibrate-btn").disabled = false;
			$("settings").classList.remove("blur");
			clearInterval(calibrationTimer);
			$("debug").innerHTML += "<span>&gt;calibrationDelay(): finished</span>";
			window.removeEventListener("deviceorientation", orientationSnapshot);
		}
		else if(calibrationCounter + 2 <= 0){
			$("calibration-timer").style.fontSize = "5em";
			$("calibration-timer").classList.remove("calibrate-wait");
			sumZ = calibrationZArr.reduce((a, b) => a + b, 0);
			sumX = calibrationXArr.reduce((a, b) => a + b, 0);
			calibratedZOffsetVal = Math.round(((sumZ / calibrationZArr.length) || 0)*10)/10;
			calibratedXOffsetVal = Math.round(((sumX / calibrationXArr.length) || 0)*10)/10;

			if(Math.abs(calibratedZOffsetVal)<=5 && Math.abs(calibratedXOffsetVal)<=5){
				$("calibration-timer").innerText = langData["done"][lang];
				$("debug").innerHTML += "<span>&gt;calibrationDelay() avgZ: " + calibratedZOffsetVal + "</span>";
				$("debug").innerHTML += "<span>&gt;calibrationDelay() avgX: " + calibratedXOffsetVal + "</span>";
				$("calibrated-z-offset").value = calibratedZOffsetVal;
				$("calibrated-z-offset").dispatchEvent(new Event('input'));
				$("calibrated-z-offset").nextElementSibling.value = calibratedZOffsetVal + String.fromCharCode(176);	//176 = degree symbol
				$("calibrated-x-offset").value = calibratedXOffsetVal;
				$("calibrated-x-offset").dispatchEvent(new Event('input'));
				$("calibrated-x-offset").nextElementSibling.value = calibratedXOffsetVal + String.fromCharCode(176);	//176 = degree symbol
			}
			else{
				$("calibration-timer").innerText = langData["error"][lang];
				$("debug").innerHTML += "<span>&gt;calibrationDelay(): X or Z angle greater than 5 </span>";
			}
			calibrationZArr = [];
			calibrationXArr = [];
		}
		else if(calibrationCounter <= 0){
			$("calibration-timer").style.fontSize = "5em";
			$("calibration-timer").innerText = langData["wait"][lang];
			$("calibration-timer").classList.add("calibrate-wait");
		}
		else if(calibrationCounter <= 5){
			$("calibration-timer").style.fontSize = null;
			$("calibration-timer").innerText = calibrationCounter;
		}
		else{
			$("calibration-timer").style.fontSize = "3em";
			$("calibration-timer").innerText = langData["place-device"][lang];
		}
		calibrationCounter -= 1;
	}
	catch(err){
		$("debug").innerHTML += "<span>&gt;calibrationDelay(): " + err + "</span>";
	}
}

function orientationDelay(){
	try{
		if(orientationCounter  <= 0){
			$("orientation-delay-timer").innerText = "";
			$("orientation-delay-timer").style.display = "none";
			$("orientation").classList.remove("blur");
			$("debug").innerHTML += "<span>&gt;orientationDelay(): finished</span>";
			window.removeEventListener("deviceorientation", orientationSnapshot);
			window.addEventListener("deviceorientation", handleOrientation);
			clearInterval(orientationTimer);
		}
		else if(orientationCounter <= 5){
			$("orientation-delay-timer").style.fontSize = null;
			$("orientation-delay-timer").innerText = orientationCounter;
		}
		else{
			$("orientation-delay-timer").style.fontSize = "3em";
			$("orientation-delay-timer").innerText = langData["place-device"][lang];
		}
		orientationCounter -= 1;
	}
	catch(err){
		$("debug").innerHTML += "<span>&gt;orientationDelay(): " + err + "</span>";
	}
}

function orientationSnapshot(event){
	try{
		//Update with calibrated values
		if(Math.abs(event.beta) <= 180){
			calibratedGamma = event.gamma - calibratedZOffsetVal;
			calibratedBeta = event.beta - calibratedXOffsetVal;
		}
		else{
			calibratedGamma = (event.gamma - calibratedZOffsetVal) * -1;
			calibratedBeta = (event.beta - calibratedXOffsetVal) * -1;
		}

		if(calibratedBeta != null && Date.now() >= (lastXupdateTS + xzUpdateIntervalMS)){	
			calibrationXArr.push(event.beta);
			lastXupdateTS=Date.now();
		}
		if(calibratedGamma != null && Date.now() >= (lastZupdateTS + xzUpdateIntervalMS)){
			calibrationZArr.push(event.gamma);
			lastZupdateTS=Date.now();
		}
	}
	catch(err){
		$("debug").innerHTML += "<span>&gt;orientationSnapshot() " + err + "</span>";
	}
}

//Caravan angle
function handleOrientation(event) {
	try{
		//Update with calibrated values
		if(Math.abs(event.beta) <= 180){
			calibratedGamma = event.gamma - calibratedZOffsetVal;
			calibratedBeta = event.beta - calibratedXOffsetVal;
		}
		else{
			calibratedGamma = (event.gamma - calibratedZOffsetVal) * -1;
			calibratedBeta = (event.beta - calibratedXOffsetVal) * -1;
		}
	
		//X-axis beta (jockey wheel up/down)
		//Set he pivot point for the visual representation
		$("side-view").style.transformOrigin = "28% 60%";
		$("side-view").style.transform = "rotate(" + (Math.max((maxAngle * -1), Math.min(maxAngle, (calibratedBeta * 1)))) + "deg)";
		//Update only on a specified interval to prevent fast switching numbers

		if(calibratedBeta != null && Date.now() >= (lastXupdateTS + xzUpdateIntervalMS)){
			$("x-axis").innerHTML = Math.round(calibratedBeta * 10) / 10;
			if(Math.abs(calibratedBeta) > 3){
				$("side-icon").classList.remove("beatFlipH");
				$("side-icon").style.color = "red";
			}
			else if(Math.abs(calibratedBeta) > 1){
				$("side-icon").classList.remove("beatFlipH");
				$("side-icon").style.color = "orange";
			}
			else if(Math.abs(calibratedBeta) > 0.5){
				$("side-icon").classList.remove("beatFlipH");
				$("side-icon").style.color = "green";
			}
			else{
				if(!$("side-icon").classList.contains("beatFlipH")){
					$("side-icon").classList.add("beatFlipH");
				}
				$("side-icon").style.color = "lime";
			}
			circumference = localStorage.getItem("axleToJockeyWheelMM") * 2 * Math.PI;

			if(unit == "imperial"){
				degreeDistance = Math.abs(Math.ceil(((circumference / 360) * calibratedBeta) / 25.4 * 10) / 10);
			}
			else{
				degreeDistance = Math.abs(Math.ceil((circumference / 360) * calibratedBeta));
			}
			jockeyWheelTurns = Math.round((degreeDistance / localStorage.getItem("jockeyWheelThreadPitchMM")) * 10) / 10;

			//Append unit
			degreeDistance += " " + unitData["distance"][unit];
			$("x-dist").innerHTML = degreeDistance;

			//Append direction of turns
			if(calibratedBeta < 0){
				jockeyWheelTurns += " " + langData["counter-clockwise"][lang]
				$("x-turns").innerHTML = jockeyWheelTurns;
			}
			else{
				jockeyWheelTurns += " " + langData["clockwise"][lang]
				$("x-turns").innerHTML = jockeyWheelTurns;
			}

			if((Date.now() - lastPushTS) > pushIntervalMS){
				//Send push
				$("debug").innerHTML += "<span>&gt;handleOrientation() X diff: " + Math.abs(lastXangle-calibratedBeta) + "</span>";
				if(Math.abs(lastXangle-calibratedBeta) >= Math.abs(lastZangle-calibratedGamma)){
					if(calibratedBeta < 0){
						sendPush(langData["jockeywheel"][lang], langData["jockeywheel-up-by"][lang] + " "+degreeDistance + " / " + jockeyWheelTurns + " (" + (Math.round(calibratedBeta * 10) / 10) + String.fromCharCode(176)+")");
						$("debug").innerHTML += "<span>&gt;Jockey wheel up by "+degreeDistance+" / " + jockeyWheelTurns + " ("+(Math.round(calibratedBeta * 10) / 10) + "&deg;)</span>";
					}
					else{
						sendPush(langData["jockeywheel"][lang], langData["jockeywheel-down-by"][lang] + " " + degreeDistance + " / " + jockeyWheelTurns + " (" + (Math.round(calibratedBeta * 10) / 10) + String.fromCharCode(176) + ")");
						$("debug").innerHTML += "<span>&gt;Jockey wheel down by " + degreeDistance + " / " + jockeyWheelTurns + " (" + (Math.round(calibratedBeta * 10) / 10) + "&deg;)</span>";
					}
					lastPushTS = Date.now();
					lastXangle = calibratedBeta;
				}
			}
			lastXupdateTS = Date.now();
		}

		//Z-axis gamma (right/left wheel up/down)
		//Set he pivot point for the visual representation
		if(calibratedGamma>=0){
			$("front-view").style.transformOrigin = "23% 13%";
		}
		else{
			$("front-view").style.transformOrigin = "23% 65%";
		}
		$("front-view").style.transform = "rotate(" + (Math.max((maxAngle * -1), Math.min(maxAngle, (calibratedGamma * -1)))) + "deg)";

		if(calibratedGamma != null && Date.now() >= (lastZupdateTS + xzUpdateIntervalMS)){
			$("z-axis").innerHTML = Math.round(calibratedGamma * 10) / 10;
			if(Math.abs(calibratedGamma) > 3){
				$("front-icon").classList.remove("beat");
				$("front-icon").style.color = "red";
			}
			else if(Math.abs(calibratedGamma) > 1){
				$("front-icon").classList.remove("beat");
				$("front-icon").style.color = "orange";
			}
			else if(Math.abs(calibratedGamma) > 0.5){
				$("front-icon").classList.remove("beat");
				$("front-icon").style.color = "green";
			}
			else{
				if(!$("front-icon").classList.contains("beat")){
					$("front-icon").classList.add("beat");
				}
				$("front-icon").style.color = "lime";
			}
			circumference = localStorage.getItem("wheelTrackDistanceMM") * 2 * Math.PI;
			if(unit == "imperial"){
				degreeDistance = Math.abs(Math.ceil(((circumference / 360) * calibratedGamma) / 25.4 * 10) / 10);
			}
			else{
				degreeDistance = Math.abs(Math.ceil((circumference / 360) * calibratedGamma));
			}
			jockeyWheelTurns = Math.round((degreeDistance / localStorage.getItem("jockeyWheelThreadPitchMM")) * 10) / 10;

			//Append unit
			degreeDistance += " " + unitData["distance"][unit];
			$("z-dist").innerHTML = degreeDistance;

			if((Date.now() - lastPushTS) > pushIntervalMS){
				//Send push
				$("debug").innerHTML += "<span>&gt;handleOrientation() Z diff: " + Math.abs(lastZangle - calibratedGamma) + "</span>";
//				if(Math.abs(lastZangle-calibratedGamma) > Math.abs(lastXangle-calibratedBeta) && Math.abs(lastZangle - calibratedGamma) >= Math.max(0.5, Math.abs(lastZangle - calibratedGamma))){
				if(Math.abs(lastZangle - calibratedGamma) > Math.abs(lastXangle - calibratedBeta)){
					if(calibratedGamma > 0){
						sendPush(langData["side-to-side"][lang], langData["right-wheel-up-by"][lang] + " " + degreeDistance + " (" + (Math.round(calibratedGamma*10)/10) + String.fromCharCode(176) + ")");
						$("debug").innerHTML += "<span>&gt;Side to side: Right wheel up by " + degreeDistance + " (" + (Math.round(calibratedGamma * 10) / 10) + "&deg;)</span>";
					}
					else{
						sendPush(langData["side-to-side"][lang], langData["left-wheel-up-by"][lang] + " " + degreeDistance + " (" + (Math.round(calibratedGamma * 10) / 10) + String.fromCharCode(176) + ")");
						$("debug").innerHTML += "<span>&gt;Side to side: Left wheel up by " + degreeDistance + " (" + (Math.round(calibratedGamma * 10) / 10) + "&deg;)</span>";
					}
					lastPushTS = Date.now();
					lastZangle = calibratedGamma;
				}
			}
			lastZupdateTS = Date.now();
		}
	}
	catch(err){
		$("debug").innerHTML += "<span>&gt;handleOrientation() " + err + "</span>";
	}
}

async function requestPermForOrientation() {
	try{
		if(is_iOS()){
			// Request permission for iOS 13+ devices
			if (DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission === "function"){
				$("debug").innerHTML += "<span>&gt;requestPermForOrientation() DeviceOrientationEvent True AND reqPerm = function</span>";
		
				orientationPermissionState = await DeviceOrientationEvent.requestPermission();
				$("debug").innerHTML += "<span>&gt;requestPermForOrientation() orientationPermissionState: " + orientationPermissionState + "</span>";
	
				if(orientationPermissionState === "granted") {
					$("debug").innerHTML += "<span>&gt;requestPermForOrientation() Device orientation was Granted</span>";
					$("req-orientation-perm-btn").style.display = "none";
					$("req-orientation-perm-btn").disabled = true;
					$("req-orientation-perm-btn").classList.remove("pulse");
					$("calibrate-btn").disabled = false;
					$("orientation-info").innerHTML = langData["orientation-granted"][lang];
	
					$("debug").innerHTML += "<span>&gt;requestPermForOrientation() pushPermissionState: " + pushPermissionState + "</span>";
					if(pushPermissionState === "granted"){
						gotoView("orientation");
					}
				}
				else{
					$("debug").innerHTML += "<span>&gt;requestPermForOrientation() Device orientation was Denied</span>";
					$("req-orientation-perm-btn").style.display = "none";
					$("req-orientation-perm-btn").disabled = true;
					$("req-orientation-perm-btn").classList.remove("pulse");
					$("calibrate-btn").disabled = true;
					$("orientation-info").style.display = "block";
					$("orientation-info").innerHTML = langData["orientation-denied"][lang];
				}
			}
			else{
				$("debug").innerHTML += "<span>&gt;requestPermForOrientation() Device orientation not asked yet</span>";
				$("orientation-info").innerHTML = langData["orientation-not-asked"][lang];
			}
		}
		else if(is_Android()){
			$("debug").innerHTML += "<span>&gt;requestPermForOrientation() Device orientation was Started</span>";
			$("req-orientation-perm-btn").style.display = "none";
			$("req-orientation-perm-btn").disabled = true;
			$("req-orientation-perm-btn").classList.remove("pulse");
			$("calibrate-btn").disabled = false;
			$("orientation-info").innerHTML = langData["orientation-granted"][lang];

			if(pushPermissionState === "granted"){
				gotoView("orientation");
			}
		}
		else{
			console.log("Unhandled exception");
		}
	}
	catch(err){
		$("debug").innerHTML += "<span>&gt;requestPermForOrientation()" + err + "</span>";
	}
};

//$("debug").innerHTML += "<span>&gt;orientation.js was loaded to the end</span>";
