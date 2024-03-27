//Caravan angle
function handleOrientation(event) {
	try{
		//Run only if orientation view or calibration-timer is visible
		if($("orientation").style.display == "block" || calibrationRunning){
//			$("debug").innerHTML += "<span>&gt;orientation: "+$("orientation").style.display+" calibration-timer: "+$("calibration-timer").style.display+"</span>";

			//Update with calibrated values
			calibratedGamma = event.gamma - calibratedZOffsetVal;
			calibratedBeta = event.beta - calibratedXOffsetVal;
	
			//Z-axis gamma (right/left wheel up/down)
			//Set he pivot point for the visual representation
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
		
				if((Date.now()-lastPushTS) > pushIntervalMS && !calibrationRunning){
					//Send push
					$("debug").innerHTML += "<span>&gt;handleOrientation() Z diff: "+Math.abs(lastZangle-calibratedGamma)+"</span>";
					if(Math.abs(lastZangle-calibratedGamma) > Math.abs(lastXangle-calibratedBeta) && Math.abs(lastZangle-calibratedGamma)>=Math.max(0.5,Math.abs(lastZangle-calibratedGamma))){
						$("debug").innerHTML += "<span>&gt;handleOrientation() Z > X diff: "+Math.abs(lastZangle-calibratedGamma)+">"+Math.abs(lastXangle-calibratedBeta)+"</span>";

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
			//Set he pivot point for the visual representation
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
				if((Date.now()-lastPushTS) > pushIntervalMS && !calibrationRunning){
					//Send push
					$("debug").innerHTML += "<span>&gt;handleOrientation() X diff: "+Math.abs(lastXangle-calibratedBeta)+"</span>";
					if(Math.abs(lastXangle-calibratedBeta) >= Math.abs(lastZangle-calibratedGamma) && Math.abs(lastXangle-calibratedBeta)>=Math.max(0.5,Math.abs(lastXangle-calibratedBeta))){
						$("debug").innerHTML += "<span>&gt;handleOrientation() X >= Z diff: "+Math.abs(lastXangle-calibratedBeta)+">="+Math.abs(lastZangle-calibratedGamma)+"</span>";
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
	}
	catch(err){
			$("debug").innerHTML += "<span>&gt;"+err+"</span>";
	}
}

async function requestPermForOrientation() {
	try{
		// Request permission for iOS 13+ devices
		if (DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission === "function"){
			$("debug").innerHTML += "<span>&gt;requestPermForOrientation() DeviceOrientationEvent True AND reqPerm = function</span>";
	
			orientationPermissionState = await DeviceOrientationEvent.requestPermission();
			$("debug").innerHTML += "<span>&gt;requestPermForOrientation() orientationPermissionState: "+orientationPermissionState+"</span>";

			if (orientationPermissionState === "granted") {
				$("debug").innerHTML += "<span>&gt;requestPermForOrientation() Device orientation was Granted</span>";
				$("req-orientation-perm-btn").style.display = "none";
				$("req-orientation-perm-btn").disabled = true;
				$("calibrate-btn").disabled = false;
				$("orientation-info").innerHTML = "Orientation was Granted";

				$("debug").innerHTML += "<span>&gt;requestPermForOrientation() pushPermissionState: "+pushPermissionState+"</span>";
				if(pushPermissionState === "granted"){
					gotoView("orientation");
				}
				else{
					gotoView(firstView);
				}


				orientationDelayCounterS = 5;
				$("orientation-delay-timer").style.display = "block";
				orientationDelayTimer = setInterval(function(){
					orientationDelay();
				}, 1000);



//				window.addEventListener("deviceorientation", handleOrientation);
			}
			else{
				$("debug").innerHTML += "<span>&gt;requestPermForOrientation() Device orientation was Denied</span>";
				$("orientation-info").innerHTML = "Device orientation was Denied";
				$("req-orientation-perm-btn").style.display = "none";
				$("req-orientation-perm-btn").disabled = true;
				$("calibrate-btn").disabled = false;
				$("orientation-info").style.display = "block";
				$("orientation-info").innerHTML = "Orientation Not Granted";
			}
		}
		else{
			$("debug").innerHTML += "<span>&gt;requestPermForOrientation() Device orientation not asked yet</span>";
			$("orientation-info").innerHTML = "Device orientation not asked yet";
		}
	}
	catch(err){
			$("debug").innerHTML += "<span>"+err+"</span>";
	}
};

$("debug").innerHTML += "<span>&gt;orientation.js was loaded to the end</span>";
