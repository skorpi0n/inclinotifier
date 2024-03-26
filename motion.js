//Caravan angle
function handleOrientation(event) {
	try{
if($("orientation").style.display != "none"){


		calibratedGamma = event.gamma - calibratedZOffsetVal;
		calibratedBeta = event.beta - calibratedXOffsetVal;

		//Z-axis gamma (right/left wheel up/down)
		if(calibratedGamma>=0){
			$("front-view").style.transformOrigin = "23% 13%";
		}
		else{
			$("front-view").style.transformOrigin = "23% 65%";
		}
		$("front-view").style.transform = "rotate("+(Math.max((maxAngle*-1),Math.min(maxAngle,(calibratedGamma*-1))))+"deg)";
		//Update only on a specified interval to prevent fast switching numbers
		if(calibratedGamma != null && Date.now() >= (lastZupdateTS+xzUpdateIntervalMS)){
			if(calibrationStart){
				calibrationZArr.push(event.gamma);
			}
			$("z-axis").innerHTML = Math.ceil(calibratedBeta*10)/10;
			if(Math.abs(calibratedGamma) >= 5){
				$("front-icon").classList.remove("beat");
				$("front-icon").style.color = "red";
			}
			else if(Math.abs(calibratedGamma) >= 2){
				$("front-icon").classList.remove("beat");
				$("front-icon").style.color = "orange";
			}
			else if(Math.abs(calibratedGamma) >= 1){
				$("front-icon").classList.remove("beat");
				$("front-icon").style.color = "green";
			}
			else{
				if(!$("front-icon").classList.contains("beat")){
					$("front-icon").classList.add("beat");
				}
				$("front-icon").style.color = "lime";
			}
			circumference = localStorage.getItem("wheelTrackDistanceMM")*2*Math.PI;
			degreeDistance = Math.ceil((circumference/360)*calibratedGamma);
			$("z-dist").innerHTML = degreeDistance;
	
			if((Date.now()-lastPushTS) > pushIntervalMS){
				//Send push
				if(Math.abs(lastZangle-calibratedGamma)>=Math.max(0.5,Math.abs(lastZangle-calibratedGamma))){
					if(calibratedGamma > 0){
						sendPush("Side to side","Right wheel up by "+Math.abs(degreeDistance)+"mm ("+Math.ceil(calibratedGamma)+String.fromCharCode(176)+")");
						$("debug").innerHTML += "<span>&gt;Side to side: Right wheel up by "+Math.abs(degreeDistance)+"mm ("+Math.ceil(calibratedGamma)+"&deg;)</span>";
					}
					else{
						sendPush("Side to side","Left wheel up by "+Math.abs(degreeDistance)+"mm ("+Math.ceil(calibratedGamma)+String.fromCharCode(176)+")");
						$("debug").innerHTML += "<span>&gt;Side to side: Left wheel up by "+Math.abs(degreeDistance)+"mm ("+Math.ceil(calibratedGamma)+"&deg;)</span>";
					}
					lastPushTS = Date.now();
					lastZangle=calibratedGamma;
				}
			}

			lastZupdateTS=Date.now();
		}
	
		//X-axis beta (jockey wheel up/down)
		$("side-view").style.transformOrigin = "28% 60%";
		$("side-view").style.transform = "rotate("+(Math.max((maxAngle*-1),Math.min(maxAngle,(calibratedBeta*1))))+"deg)";
		//Update only on a specified interval to prevent fast switching numbers
		if(calibratedBeta != null && Date.now() >= (lastXupdateTS+xzUpdateIntervalMS)){	
			if(calibrationStart){
				calibrationXArr.push(event.beta);
			}

			$("x-axis").innerHTML = Math.ceil(calibratedBeta*10)/10;
			if(Math.abs(calibratedBeta) >= 5){
				$("side-icon").classList.remove("beatFlipH");
				$("side-icon").style.color = "red";
			}
			else if(Math.abs(calibratedBeta) >= 2){
				$("side-icon").classList.remove("beatFlipH");
				$("side-icon").style.color = "orange";
			}
			else if(Math.abs(calibratedBeta) >= 1){
				$("side-icon").classList.remove("beatFlipH");
				$("side-icon").style.color = "green";
			}
			else{
				if(!$("side-icon").classList.contains("beatFlipH")){
					$("side-icon").classList.add("beatFlipH");
				}
				$("side-icon").style.color = "lime";
			}
			circumference = localStorage.getItem("axleToJockeyWheelMM")*2*Math.PI;
			degreeDistance = Math.ceil((circumference/360)*calibratedBeta);
			$("x-dist").innerHTML = degreeDistance;
			if(Date.now() >= lastPushTS+pushIntervalMS){
				//Send push
				if(Math.abs(lastXangle-calibratedBeta)>=Math.max(0.5,Math.abs(lastXangle-calibratedBeta))){
					if(calibratedBeta < 0){
						sendPush("Jockey Up/down","Jockey wheel up by "+degreeDistance+"mm ("+Math.ceil(calibratedBeta)+String.fromCharCode(176)+")");
						$("debug").innerHTML += "<span>&gt;Jockey wheel up by "+degreeDistance+"mm ("+Math.ceil(calibratedBeta)+"&deg;)</span>";
					}
					else{
						sendPush("Jockey Up/down","Jockey wheel down by "+degreeDistance+"mm ("+Math.ceil(calibratedBeta)+String.fromCharCode(176)+")");
						$("debug").innerHTML += "<span>&gt;Jockey wheel down by "+degreeDistance+"mm ("+Math.ceil(calibratedBeta)+"&deg;)</span>";
					}
					lastPushTS = Date.now();
					lastXangle=calibratedBeta;
				}
			}
			lastXupdateTS=Date.now();
		}


}
else{
			$("debug").innerHTML += "<span>&gt;stopped</span>";

}



	}
	catch(err){
			$("debug").innerHTML += "<span>&gt;"+err+"</span>";
	}
}

async function requestPermForMotion() {
	try{
		// Request permission for iOS 13+ devices
		if (DeviceMotionEvent && typeof DeviceMotionEvent.requestPermission === "function"){
			$("debug").innerHTML += "<span>&gt;requestPermForMotion() DeviceMotion True AND reqMotion = function</span>";
	
			const permissionState = await DeviceOrientationEvent.requestPermission();
motionPermissionState = permissionState;
			$("debug").innerHTML += "<span>&gt;requestPermForMotion() permissionState: "+permissionState+"</span>";

			if (permissionState === "granted") {
				$("debug").innerHTML += "<span>&gt;requestPermForMotion() Device motion was Granted</span>";
				$("req-motion-perm-btn").style.display = "none";
				$("req-motion-perm-btn").disabled = true;
				$("calibrate-btn").disabled = false;
				$("motion-info").innerHTML = "Motion was Granted";
//				$("orientation").style.display = "block";

				$("debug").innerHTML += "<span>&gt;frontend.js pushPermissionState: "+pushPermissionState+"</span>";
				if(pushPermissionState === "granted"){
					gotoView("orientation");

				}
				else{
					gotoView("settings");
				}
			window.addEventListener("deviceorientation", handleOrientation);

			}
			else{
				$("debug").innerHTML += "<span>&gt;requestPermForMotion() Device motion was Denied</span>";
				$("motion-info").innerHTML = "Device motion was Denied";
				$("req-motion-perm-btn").style.display = "none";
				$("req-motion-perm-btn").disabled = true;
				$("calibrate-btn").disabled = false;
				$("motion-info").style.display = "block";
				$("motion-info").innerHTML = "Motion Not Granted";
			}
		}
		else{
			$("debug").innerHTML += "<span>&gt;requestPermForMotion() Device motion not asked yet</span>";
			$("motion-info").innerHTML = "Device motion not asked yet";
		}


/*
		//Here we only process while motion is running/or not
		//If orientation view is not active, pause handleOrientation
		if (is_running){
			$("debug").innerHTML += "<span>&gt;frontend.js is_running: true</span>";
			window.removeEventListener("deviceorientation", handleOrientation);
			is_running = false;
		}
		else{
			$("debug").innerHTML += "<span>&gt;frontend.js is_running: false</span>";
			window.addEventListener("deviceorientation", handleOrientation);
			is_running = true;
		}
*/
	}
	catch(err){
			$("debug").innerHTML += "<span>"+err+"</span>";
	}
};

$("debug").innerHTML += "<span>&gt;motion.js was loaded to the end</span>";
