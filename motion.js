


//Caravan angle
function handleOrientation(event) {
	try{
/*
		b = lastBeepTS + Math.max(250, Math.min(4000, (event.beta / 0.004 )));
		if(event.beta != null && Date.now() >= b){
			beep(200,1);
			lastBeepTS=Date.now();
		}
*/

		//Z-axis gamma (right/left wheel up/down)
		if(event.gamma>=0){
			frontView.style.transformOrigin = "23% 13%";
		}
		else{
			frontView.style.transformOrigin = "23% 65%";
		}
		frontView.style.transform = "rotate("+(Math.max((maxAngle*-1),Math.min(maxAngle,(event.gamma*-1))))+"deg)";
		//Update only on a specified interval to prevent fast switching numbers
		if(event.gamma != null && Date.now() >= (lastZupdateTS+xzUpdateIntervalMS)){
			if(calibrationStart){
				calibrationZ.push(event.gamma);
			}

//			debugView.innerHTML += "<span>g"+Date.now()+" "+lastZupdateTS+" "+xzUpdateIntervalMS+" "+(Date.now()-(lastZupdateTS+xzUpdateIntervalMS))+"</span>";
	//		lastZupdateTS=Date.now();
			zAxis.innerHTML = Math.ceil(event.gamma*10)/10;
			if(Math.abs(event.gamma) >= 5){
				frontIcon.classList.remove("beat");
				frontIcon.style.color = "red";
			}
			else if(Math.abs(event.gamma) >= 2){
				frontIcon.classList.remove("beat");
				frontIcon.style.color = "orange";
			}
			else if(Math.abs(event.gamma) >= 1){
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
			degreeDistance = Math.ceil((circumference/360)*event.gamma);
//			if(Math.abs(degreeDistance) < 500){
				zDist.innerHTML = degreeDistance;
//			}
//			else{
//				zDist.innerHTML = ">500";
//			}
	
			if((Date.now()-lastPushTS) > pushIntervalMS){
				//Send push
				if(Math.abs(lastZangle-event.gamma)>=Math.max(0.5,Math.abs(lastZangle-event.gamma))){
//					debugView.innerHTML += "<span>&gt;Send?"+lastZangle+"-"+event.gamma+" ("+Math.abs(lastZangle-event.gamma).toFixed(2)+") >="+localStorage.getItem("angleStepsForPush")+"</span>";
					if(event.gamma > 0){
	//					sendPush("Side to side","Right wheel up by "+Math.abs(degreeDistance)+"mm ("+Math.ceil(event.gamma)+"&deg;)");
						debugView.innerHTML += "<span>&gt;Side to side: Right wheel up by "+Math.abs(degreeDistance)+"mm ("+Math.ceil(event.gamma)+"&deg;)</span>";
					}
					else{
	//					sendPush("Side to side","Left wheel up by "+Math.abs(degreeDistance)+"mm ("+Math.ceil(event.gamma)+"&deg;)");
						debugView.innerHTML += "<span>&gt;Side to side: Left wheel up by "+Math.abs(degreeDistance)+"mm ("+Math.ceil(event.gamma)+"&deg;)</span>";
					}
					lastPushTS = Date.now();
					lastZangle=event.gamma;
				}
			}

			lastZupdateTS=Date.now();
		}
	
		//X-axis beta (jockey wheel up/down)
		sideView.style.transformOrigin = "28% 60%";
		sideView.style.transform = "rotate("+(Math.max((maxAngle*-1),Math.min(maxAngle,(event.beta*-1))))+"deg)";
		//Update only on a specified interval to prevent fast switching numbers
		if(event.beta != null && Date.now() >= (lastXupdateTS+xzUpdateIntervalMS)){	
			if(calibrationStart){
				calibrationX.push(event.beta);
			}

			xAxis.innerHTML = Math.ceil(event.beta*10)/10;
			if(Math.abs(event.beta) >= 5){
				sideIcon.classList.remove("beatFlipH");
				sideIcon.style.color = "red";
			}
			else if(Math.abs(event.beta) >= 2){
				sideIcon.classList.remove("beatFlipH");
				sideIcon.style.color = "orange";
			}
			else if(Math.abs(event.beta) >= 1){
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
			degreeDistance = Math.ceil((circumference/360)*event.beta);
//			if(Math.abs(degreeDistance) < 500){
				xDist.innerHTML = degreeDistance;
//			}
//			else{
//				xDist.innerHTML = ">500";
//			}
//			if((Date.now()-lastPushTS) > pushIntervalMS){
			if(Date.now() >= lastPushTS+pushIntervalMS){
				//Send push
//				debugView.innerHTML += "<span>&gt;Send Push?</span>";
				if(Math.abs(lastXangle-event.beta)>=Math.max(0.5,Math.abs(lastXangle-event.beta))){
//					debugView.innerHTML += "<span>&gt;Send push?"+lastXangle.toFixed(2)+"-"+event.beta.toFixed(2)+" ("+Math.ceil(Math.abs(lastXangle-event.beta))+") >="+localStorage.getItem("angleStepsForPush")+"</span>";
					if(event.beta < 0){
	//					sendPush("Jockey Up/down","Jockey wheel up by "+degreeDistance+"mm ("+Math.ceil(event.beta)+"&deg;)");
						debugView.innerHTML += "<span>&gt;Jockey wheel up by "+degreeDistance+"mm ("+Math.ceil(event.beta)+"&deg;)</span>";
					}
					else{
	//					sendPush("Jockey Up/down","Jockey wheel down by "+degreeDistance+"mm ("+Math.ceil(event.beta)+"&deg;)");
						debugView.innerHTML += "<span>&gt;Jockey wheel down by "+degreeDistance+"mm ("+Math.ceil(event.beta)+"&deg;)</span>";
					}
					lastPushTS = Date.now();
					lastXangle=event.beta;
				}
			}
			lastXupdateTS=Date.now();
		}
	}
	catch(err){
			debugView.innerHTML = "<span>"+err.message+"</span>";
	}
}

async function requestPermForMotion() {
	try{
	//	e.preventDefault();
		// Request permission for iOS 13+ devices
		if (DeviceMotionEvent && typeof DeviceMotionEvent.requestPermission === "function"){
			debugView.innerHTML += "<span>&gt;DeviceMotion True AND reqMotion = function</span>";
	
			const permissionState = await DeviceOrientationEvent.requestPermission();
			
			if (permissionState === "granted") {
				debugView.innerHTML += "<span>&gt;Device motion was Granted__</span>";
	//			reqMotionPermBtn.style.display = "none";
				reqMotionPermBtn.disabled = true;
				calibrateBn.disabled = false;
				motionInfo.innerHTML = "Motion was Granted";
	//			orientView.style.display = "block";
	pushHashAndFixTargetSelector("#orientation");
			}
			else{
				debugView.innerHTML += "<span>&gt;Device motion was Denied</span>";
				//Permission was denied
				motionInfo.innerHTML = "Device motion was Denied";
	//			reqMotionPermBtn.style.display = "none";
				reqMotionPermBtn.disabled = true;
				calibrateBn.disabled = false;
				motionInfo.innerHTML = "Motion was Granted";
				orientView.style.display = "none";
			}
		}
		else{
			debugView.innerHTML += "<span>&gt;Device motion not asked yet</span>";
			motionInfo.innerHTML = "Device motion not asked yet";
		}
	
		//Here we only process while motion is running/or not
		if (is_running){
			//debugView.innerHTML += "<br>Device motion is running";
			window.removeEventListener("deviceorientation", handleOrientation);
//			window.removeEventListener("deviceorientation", calibrate);
			is_running = false;
		}
		else{
			//debugView.innerHTML += "<br>Device motion is not running";
			window.addEventListener("deviceorientation", handleOrientation);
//			window.addEventListener("deviceorientation", calibrate);
			is_running = true;
		}
	}
	catch(err){
			debugView.innerHTML = "<span>"+err.message+"</span>";
	}
};