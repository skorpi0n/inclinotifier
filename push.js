//Push notifications
async function initServiceWorker() {
	try{
		let swRegistration = await navigator.serviceWorker.register("https://skorpi0n.github.io/inclinotifier/serviceworker.js", {scope: "/inclinotifier/"})
		let pushManager = swRegistration.pushManager;

		if (!isPushManagerActive(pushManager)) {
			debugView.innerHTML += "<span>&gt;Pushmanager is not active1</span>";
			subInfo.innerHTML = "Pushmanager is not active";
			return;
		}

		let permissionState = await pushManager.permissionState({userVisibleOnly: true});
		switch (permissionState) {
			case "prompt":
				debugView.innerHTML += "<span>&gt;btns shown by prompt</span>";
//				subscribeNotifBtn.style.display = "block";
//				reqMotionPermBtn.style.display = "block";
				subscribeNotifBtn.disabled = false;
				subInfo.innerHTML = "Choose";
				reqMotionPermBtn.disabled = false;
				motionInfo.innerHTML = "Choose";

				break;
			case "granted":
				debugView.innerHTML += "<span>&gt;User granted push permission</span>";
//				reqMotionPermBtn.style.display = "none";
//				reqMotionPermBtn.disabled = true;

				subscribeNotifBtn.disabled = true;
				subInfo.innerHTML = "Subscribed to Push Notifications";
				displaySubscriptionInfo(await pushManager.getSubscription())
				break;
			case "denied":
//				subscribeNotifBtn.style.display = "none";
				subscribeNotifBtn.disabled = true;
//				subInfo.style.display = "block";
				subInfo.innerHTML = "User denied push permission";
				debugView.innerHTML += "<span>&gt;User denied push permission</span>";
		}
	}
	catch(error){
			debugView.innerHTML = "<span>"+err+"</span>";
	}
}

function isPushManagerActive(pushManager) {
	try{
		debugView.innerHTML += "<span>&gt;pushManager function init</span>";
		if (!pushManager) {
			//What should I do if pushmanager is false?
	//		subscribeNotifBtn.style.display = "block";
	//		reqMotionPermBtn.style.display = "block";
			subscribeNotifBtn.disabled = false;
			reqMotionPermBtn.disabled = false;
	
	/*
			if (!window.navigator.standalone) {
			}
			else{
				throw new Error("PushManager is not active");
			}
	*/
			return false;
		}
		else {
			debugView.innerHTML += "<span>&gt;Has Pushmanager</span>";
			return true;
		}
	}
	catch(err){
			debugView.innerHTML = "<span>"+err.message+"</span>";
	}
}

//Called from <button>
async function subscribeToPush() {
	try{
		// Public part of VAPID key, generation of that covered in README
		// All subscription tokens associated with that key, so if you change it - you may lose old subscribers
		const VAPID_PUBLIC_KEY = "BFPmwTmsONIPnl4UBrQVE9k1K5dpHFN85CIbnXmWWn2LrT9bdBaCU2l8R-l5BQVPRcAi8GOf39XSDS7v-LvW1UU";
	
		let swRegistration = await navigator.serviceWorker.getRegistration();
		let pushManager = swRegistration.pushManager;
		if (!isPushManagerActive(pushManager)) {
			debugView.innerHTML += "<span>&gt;Pushmanager is not active0</span>";
			subscribeNotifBtn.disabled = true;
			subInfo.innerHTML = "Pushmanager is not active0";
	
	//		reqMotionPermBtn.disabled = false;
	
			return;
		}
		let subscriptionOptions = {
			userVisibleOnly: true,
			applicationServerKey: VAPID_PUBLIC_KEY
		};
		try {
			let subscription = await pushManager.subscribe(subscriptionOptions);
			displaySubscriptionInfo(subscription);
			// Here you can send fetch request with subscription data to your backend API for next push sends from there
		}
		catch (error) {
			subInfo.style.display = "block";
			subInfo.innerHTML = "Error: "+error;
			debugView.innerHTML += "<span>&gt;Error: "+error+"</span>";
	//		subscribeNotifBtn.style.display = "none";
			subscribeNotifBtn.disabled = true;
		}
	}
	catch(err){
			debugView.innerHTML = "<span>"+err+"</span>";
	}
}

function displaySubscriptionInfo(subscription) {
	try{
	//	subscribeNotifBtn.style.display = "none";
		subscribeNotifBtn.disabled = true;
	//	document.getElementById("sub-info").style.display = "block";
	//	document.getElementById("sub-info").innerHTML = "User has accepted subscription";
	//	testSendBtn.style.display = "block";
		testSendBtn.disabled = false;
	
		if(is_iOS()){
			debugView.innerHTML += "<span>&gt;is_iOS is TRUE</span>";
			if(typeof DeviceMotionEvent.requestPermission === "undefined"){
	//			subscribeNotifBtn.style.display = "none";
	//			reqMotionPermBtn.style.display = "none";
				subscribeNotifBtn.disabled = true;
				reqMotionPermBtn.disabled = true;
				subInfo.innerHTML = "Reqperm is undefined";
				motionInfo.innerHTML = "Reqperm is undefined";
	
				orientView.style.display = "none";
			
			}
			else if(typeof DeviceMotionEvent.requestPermission === "function"){
				debugView.innerHTML += "<span>&gt;DeviceMotionEvent is a function. Should be a iOS device?</span>";
	//			reqMotionPermBtn.style.display = "block";
				reqMotionPermBtn.disabled = false;
			}
			else{
				debugView.innerHTML += "<span>&gt;requestPermission is not undefined and not function.</span>";
			}
		}
		else if(is_Android()){
			debugView.innerHTML += "<span>&gt;is_Android is TRUE</span>";
			debugView.innerHTML += "<span>&gt;DeviceMotionEvent is a function. Should be a iOS device?</span>";
			reqMotionPermBtn.style.display = "block";
			reqMotionPermBtn.disabled = false;
		}
		else{
			debugView.innerHTML += "<span>&gt;is_iOS and is_Android is FALSE. Device not valid</span>";
			notValidDeviceView.style.display = "block";
		}
	}
	catch(err){
			debugView.innerHTML = "<span>"+err.message+"</span>";
	}
}

function sendPush(title, body) {
	try{
		const options = {
			body: body,
			icon: "https://skorpi0n.github.io/inclinotifier/images/favicon.png",
			renotify: false,
			silent: true,
			ID: "inclinotifier",	//Using same ID will replace/overwrite previous notification
	//		image: ?
		};
		navigator.serviceWorker.ready.then(async function (serviceWorker) {
			await serviceWorker.showNotification(title, options);
		});
	}
	catch(err){
			debugView.innerHTML = "<span>"+err.message+"</span>";
	}
}