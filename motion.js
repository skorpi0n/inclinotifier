//Caravan angle
function handleOrientation(event) {
	try{
/*
		b = lastBeepTS + Math.max(250, Math.min(4000, (calibratedBeta / 0.004 )));
		if(calibratedBeta != null && Date.now() >= b){
			beep(200,1);
			lastBeepTS=Date.now();
		}
*/

		calibratedGamma = event.gamma - calibratedZOffsetVal;
		calibratedBeta = event.beta - calibratedXOffsetVal;

		//Z-axis gamma (right/left wheel up/down)
		if(calibratedGamma>=0){
			frontView.style.transformOrigin = "23% 13%";
		}
		else{
			frontView.style.transformOrigin = "23% 65%";
		}
		frontView.style.transform = "rotate("+(Math.max((maxAngle*-1),Math.min(maxAngle,(calibratedGamma*-1))))+"deg)";
		//Update only on a specified interval to prevent fast switching numbers
		if(calibratedGamma != null && Date.now() >= (lastZupdateTS+xzUpdateIntervalMS)){
			if(calibrationStart){
				calibrationZArr.push(event.gamma);
			}
//			debugView.innerHTML += "<span>g"+Date.now()+" "+lastZupdateTS+" "+xzUpdateIntervalMS+" "+(Date.now()-(lastZupdateTS+xzUpdateIntervalMS))+"</span>";
			zAxis.innerHTML = Math.ceil(calibratedBeta*10)/10;
			if(Math.abs(calibratedGamma) >= 5){
				frontIcon.classList.remove("beat");
				frontIcon.style.color = "red";
			}
			else if(Math.abs(calibratedGamma) >= 2){
				frontIcon.classList.remove("beat");
				frontIcon.style.color = "orange";
			}
			else if(Math.abs(calibratedGamma) >= 1){
				frontIcon.classList.remove("beat");
				frontIcon.style.color = "green";
			}
			else{
				if(!frontIcon.classList.contains("beat")){
					frontIcon.classList.add("beat");
				}
				frontIcon.style.color = "lime";
			}
			circumference = localStorage.getItem("wheelTrackDistanceMM")*2*Math.PI;
			degreeDistance = Math.ceil((circumference/360)*calibratedGamma);
			zDist.innerHTML = degreeDistance;
	
			if((Date.now()-lastPushTS) > pushIntervalMS){
				//Send push
				if(Math.abs(lastZangle-calibratedGamma)>=Math.max(0.5,Math.abs(lastZangle-calibratedGamma))){
					if(calibratedGamma > 0){
						sendPush("Side to side","Right wheel up by "+Math.abs(degreeDistance)+"mm ("+Math.ceil(calibratedGamma)+"&deg;)");
						debugView.innerHTML += "<span>&gt;Side to side: Right wheel up by "+Math.abs(degreeDistance)+"mm ("+Math.ceil(calibratedGamma)+"&deg;)</span>";
					}
					else{
						sendPush("Side to side","Left wheel up by "+Math.abs(degreeDistance)+"mm ("+Math.ceil(calibratedGamma)+"&deg;)");
						debugView.innerHTML += "<span>&gt;Side to side: Left wheel up by "+Math.abs(degreeDistance)+"mm ("+Math.ceil(calibratedGamma)+"&deg;)</span>";
					}
					lastPushTS = Date.now();
					lastZangle=calibratedGamma;
				}
			}

			lastZupdateTS=Date.now();
		}
	
		//X-axis beta (jockey wheel up/down)
		sideView.style.transformOrigin = "28% 60%";
		sideView.style.transform = "rotate("+(Math.max((maxAngle*-1),Math.min(maxAngle,(calibratedBeta*1))))+"deg)";
		//Update only on a specified interval to prevent fast switching numbers
		if(calibratedBeta != null && Date.now() >= (lastXupdateTS+xzUpdateIntervalMS)){	
			if(calibrationStart){
				calibrationXArr.push(event.beta);
			}

			xAxis.innerHTML = Math.ceil(calibratedBeta*10)/10;
			if(Math.abs(calibratedBeta) >= 5){
				sideIcon.classList.remove("beatFlipH");
				sideIcon.style.color = "red";
			}
			else if(Math.abs(calibratedBeta) >= 2){
				sideIcon.classList.remove("beatFlipH");
				sideIcon.style.color = "orange";
			}
			else if(Math.abs(calibratedBeta) >= 1){
				sideIcon.classList.remove("beatFlipH");
				sideIcon.style.color = "green";
			}
			else{
				if(!sideIcon.classList.contains("beatFlipH")){
					sideIcon.classList.add("beatFlipH");
				}
				sideIcon.style.color = "lime";
			}
			circumference = localStorage.getItem("axleToJockeyWheelMM")*2*Math.PI;
			degreeDistance = Math.ceil((circumference/360)*calibratedBeta);
			xDist.innerHTML = degreeDistance;
			if(Date.now() >= lastPushTS+pushIntervalMS){
				//Send push
				if(Math.abs(lastXangle-calibratedBeta)>=Math.max(0.5,Math.abs(lastXangle-calibratedBeta))){
					if(calibratedBeta < 0){
						sendPush("Jockey Up/down","Jockey wheel up by "+degreeDistance+"mm ("+Math.ceil(calibratedBeta)+"&deg;)");
						debugView.innerHTML += "<span>&gt;Jockey wheel up by "+degreeDistance+"mm ("+Math.ceil(calibratedBeta)+"&deg;)</span>";
					}
					else{
						sendPush("Jockey Up/down","Jockey wheel down by "+degreeDistance+"mm ("+Math.ceil(calibratedBeta)+"&deg;)");
						debugView.innerHTML += "<span>&gt;Jockey wheel down by "+degreeDistance+"mm ("+Math.ceil(calibratedBeta)+"&deg;)</span>";
					}
					lastPushTS = Date.now();
					lastXangle=calibratedBeta;
				}
			}
			lastXupdateTS=Date.now();
		}
	}
	catch(err){
			debugView.innerHTML += "<span>"+err.message+"</span>";
	}
}

async function requestPermForMotion() {
	try{
		// Request permission for iOS 13+ devices
		if (DeviceMotionEvent && typeof DeviceMotionEvent.requestPermission === "function"){
			debugView.innerHTML += "<span>&gt;requestPermForMotion() DeviceMotion True AND reqMotion = function</span>";
	
			const permissionState = await DeviceOrientationEvent.requestPermission();
			
			if (permissionState === "granted") {
				debugView.innerHTML += "<span>&gt;requestPermForMotion() Device motion was Granted__</span>";
				reqMotionPermBtn.style.display = "none";
				reqMotionPermBtn.disabled = true;
				calibrateBn.disabled = false;
				motionInfo.innerHTML = "Motion was Granted";
				orientView.style.display = "block";
				pushHashAndFixTargetSelector("#orientation");
			}
			else{
				debugView.innerHTML += "<span>&gt;requestPermForMotion() Device motion was Denied</span>";
				motionInfo.innerHTML = "Device motion was Denied";
				reqMotionPermBtn.style.display = "none";
				reqMotionPermBtn.disabled = true;
				calibrateBn.disabled = false;
				motionInfo.innerHTML = "Motion was Granted";
				orientView.style.display = "none";
			}
		}
		else{
			debugView.innerHTML += "<span>&gt;requestPermForMotion() Device motion not asked yet</span>";
			motionInfo.innerHTML = "Device motion not asked yet";
		}
	
		//Here we only process while motion is running/or not
		if (is_running){
			window.removeEventListener("deviceorientation", handleOrientation);
			is_running = false;
		}
		else{
			window.addEventListener("deviceorientation", handleOrientation);
			is_running = true;
		}
	}
	catch(err){
			debugView.innerHTML += "<span>"+err.message+"</span>";
	}
};