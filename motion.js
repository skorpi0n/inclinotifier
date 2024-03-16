//iOS device orientation
function deviceOrientation() {
	var body = document.body;
	switch(window.orientation) {
	case 90:
		body.classList = '';
		body.classList.add('rotation90');
		break;
	case -90:
		body.classList = '';
		body.classList.add('rotation-90');
		break;
	default:
		body.classList = '';
		body.classList.add('portrait');
		break;
	}
}


//Caravan angle
function handleOrientation(event) {
//	document.getElementById('debug').innerHTML += "handleOrientation is running";
	//X-axis (jockey wheel up/down)
	document.getElementById("side-view").children[0].style.transform = "rotate("+(270+Math.max((maxAngle*-1),Math.min(maxAngle,(event.beta*-1))))+"deg)";
	//Update only on a specified interval to prevent fast switching numbers
	if(event.beta != null && Date.now() >= (lastXupdateTS+xzUpdateIntervalMS)){
		document.getElementById("x-axis").innerHTML = Math.ceil(event.beta*10)/10;
		if(Math.abs(event.beta) >= 5){
			document.getElementById("side-view").classList.remove("beatFlipH");
			document.getElementById("side-view").style.color = "red";
		}
		else if(Math.abs(event.beta) >= 2){
			document.getElementById("side-view").classList.remove("beatFlipH");
			document.getElementById("side-view").style.color = "orange";
		}
		else if(Math.abs(event.beta) >= 1){
			document.getElementById("side-view").classList.remove("beatFlipH");
			document.getElementById("side-view").style.color = "green";
		}
		else{
			if(!document.getElementById("side-view").classList.contains("beatFlipH")){
				document.getElementById("side-view").classList.add("beatFlipH");
			}
			document.getElementById("side-view").style.color = "lime";
		}
		circumference = axleToJockeyWheelMM*2*Math.PI;
		degreeDistance = Math.ceil((circumference/360)*event.beta);
		if(degreeDistance < 500){
			document.getElementById('x-distance').innerHTML = degreeDistance;
		}
		else{
			document.getElementById('x-distance').innerHTML = "Over 500";
		}

//		document.getElementById('debug').innerHTML += '<br>Send push?';
		if((Date.now()-lastPushTS) > pushIntervalMS){
			document.getElementById('debug').innerHTML += '<br>Send push?';

			//Send push
			if(Math.abs(lastXangle-event.beta)>=angleStepsForPush){
				document.getElementById('debug').innerHTML += '<br>Send push?'+lastXangle+'-'+event.beta+' ('+Math.ceil(Math.abs(lastXangle-event.beta))+') >='+angleStepsForPush;
				if(event.beta > 0){
					sendPush('Side to side','Right wheel up by '+Math.abs(degreeDistance)+'mm ('+Math.ceil(event.gamma)+'&deg;)');
				}
				else{
					sendPush('Side to side','Left wheel up by '+Math.abs(degreeDistance)+'mm ('+Math.ceil(event.gamma)+'&deg;)');
				}
				lastPushTS = Date.now();
				lastXangle=event.beta;
			}
		}
		lastXupdateTS=Date.now();

	}

	//Z-axis (right/left wheel up/down)
	document.getElementById("front-view").children[0].style.transform = "rotate("+(90+Math.max((maxAngle*-1),Math.min(maxAngle,(event.gamma*-1))))+"deg)";
	//Update only on a specified interval to prevent fast switching numbers
	if(event.beta != null && Date.now() >= (lastZupdateTS+xzUpdateIntervalMS)){
		document.getElementById("z-axis").innerHTML = Math.ceil(event.gamma*10)/10;
		if(Math.abs(event.gamma) >= 5){
			document.getElementById("front-view").classList.remove("beat");
			document.getElementById("front-view").style.color = "red";
		}
		else if(Math.abs(event.gamma) >= 2){
			document.getElementById("front-view").classList.remove("beat");
			document.getElementById("front-view").style.color = "orange";
		}
		else if(Math.abs(event.gamma) >= 1){
			document.getElementById("front-view").classList.remove("beat");
			document.getElementById("front-view").style.color = "green";
		}
		else{
			if(!document.getElementById("front-view").classList.contains("beat")){
				document.getElementById("front-view").classList.add("beat");
			}
			document.getElementById("front-view").style.color = "lime";
		}
		circumference = wheelTrackDistance*2*Math.PI;
		degreeDistance = Math.ceil((circumference/360)*event.gamma);
		if(degreeDistance < 500){
			document.getElementById('z-distance').innerHTML = degreeDistance;
		}
		else{
			document.getElementById('z-distance').innerHTML = "Over 500";
		}
/*
		if((Date.now()-lastPushTS) > pushIntervalMS){
			//Send push
			if(Math.abs(lastZangle-event.gamma)>=angleStepsForPush){
				document.getElementById('debug').innerHTML += '<br>Send push?'+lastZangle+'-'+event.gamma+' ('+Math.ceil(Math.abs(lastZangle-event.gamma))+') >='+angleStepsForPush;
				if(event.beta < 0){
					sendPush('Jockey Up/down','Jockey wheel up by '+degreeDistance+'mm ('+Math.ceil(event.beta)+'&deg;)');
				}
				else{
					sendPush('Jockey Up/down','Jockey wheel down by '+degreeDistance+'mm ('+Math.ceil(event.beta)+'&deg;)');
				}
				lastPushTS = Date.now();
			}
		}
*/
		lastZupdateTS=Date.now();
		lastZangle=event.gamma;
	}
}

async function requestPermForMotion() {
//	e.preventDefault();
	// Request permission for iOS 13+ devices
	if (DeviceMotionEvent && typeof DeviceMotionEvent.requestPermission === "function"){
		document.getElementById('debug').innerHTML += '<br>DeviceMotion True AND reqMotion = function';

		const permissionState = await DeviceOrientationEvent.requestPermission();
		
		if (permissionState === "granted") {
			document.getElementById('debug').innerHTML += "<br>Device motion was Granted__";
			document.getElementById('request-perm-for-motion-btn').style.display = 'none';
			document.getElementById('orientation').style.display = 'block';
		}
		else{
			document.getElementById('debug').innerHTML += "<br>Device motion was Denied";
			//Permission was denied
			document.getElementById('motion-info').innerHTML = "Device motion was Denied";
			document.getElementById('request-perm-for-motion-btn').style.display = 'none';
			document.getElementById('orientation').style.display = 'none';
		}
	}
	else{
		document.getElementById('debug').innerHTML += '<br>Device motion not asked yet';
		document.getElementById('motion-info').innerHTML = "Device motion not asked yet";
	}

	//Here we only process while motion is running/or not
	if (is_running){
		//document.getElementById('debug').innerHTML += '<br>Device motion is running';
		window.removeEventListener("deviceorientation", handleOrientation);
		is_running = false;
	}
	else{
		//document.getElementById('debug').innerHTML += '<br>Device motion is not running';
		window.addEventListener("deviceorientation", handleOrientation);
		is_running = true;
	}
};