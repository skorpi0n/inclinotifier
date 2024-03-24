//Push notifications
async function initServiceWorker() {
	try{
		let swRegistration = await navigator.serviceWorker.register("https://skorpi0n.github.io/inclinotifier/serviceworker.js", {scope: "/inclinotifier/"})
		let pushManager = swRegistration.pushManager;

		if(!isPushManagerActive(pushManager)) {
			debugView.innerHTML += "<span>&gt;initServiceWorker() Pushmanager is not active</span>";
			subInfo.innerHTML = "Pushmanager is not active";
			return;
		}
		else{
			debugView.innerHTML += "<span>&gt;initServiceWorker() Pushmanager is active</span>";
			testSendBtn.style.display = "block";
		}

		let permissionState = await pushManager.permissionState({userVisibleOnly: true});
//		debugView.innerHTML += "<span>&gt;initServiceWorker() permissionState: "+permissionState+"</span>";
		switch (permissionState) {
			case "prompt":
				subscribeNotifBtn.style.display = "block";
				subscribeNotifBtn.disabled = false;
				subInfo.style.display = "none";
				subInfo.innerHTML = "Choose";
				debugView.innerHTML += "<span>&gt;initServiceWorker() permissionState prompt</span>";
				break;
			case "granted":
				testSendBtn.style.display = "block";
				testSendBtn.disabled = false;
				subscribeNotifBtn.style.display = "none";
				subscribeNotifBtn.disabled = true;
				subInfo.style.display = "block";
				subInfo.innerHTML = "Subscribed to Push Notifications";
				debugView.innerHTML += "<span>&gt;initServiceWorker() permissionState granted</span>";
//				displaySubscriptionInfo(await pushManager.getSubscription());
				await pushManager.getSubscription();
				break;
			case "denied":
				subscribeNotifBtn.style.display = "none";
				subscribeNotifBtn.disabled = true;
				subInfo.style.display = "block";
				subInfo.innerHTML = "User denied push permission";
				debugView.innerHTML += "<span>&gt;initServiceWorker() permissionState denied</span>";
		}

	}
	catch(err){
			debugView.innerHTML += "<span>&gt;initServiceWorker() "+err+"</span>";
	}
}

function isPushManagerActive(pushManager) {
	try{
		debugView.innerHTML += "<span>&gt;isPushManagerActive()</span>";
		if (!pushManager) {
			//What should I do if pushmanager is false?
	//		subscribeNotifBtn.style.display = "block";
	//		reqMotionPermBtn.style.display = "block";
			subscribeNotifBtn.disabled = false;
			reqMotionPermBtn.disabled = false;
			return false;
		}
		else {
			debugView.innerHTML += "<span>&gt;isPushManagerActive() Has Pushmanager</span>";
			return true;
		}
	}
	catch(err){
			debugView.innerHTML += "<span>&gt;isPushManagerActive() "+err.message+"</span>";
	}
}

//Called from <button>
async function subscribeToPush() {
	debugView.innerHTML += "<span>&gt;subscribeToPush()</span>";

	try{
		// Public part of VAPID key, generation of that covered in README
		// All subscription tokens associated with that key, so if you change it - you may lose old subscribers
		const VAPID_PUBLIC_KEY = "BFPmwTmsONIPnl4UBrQVE9k1K5dpHFN85CIbnXmWWn2LrT9bdBaCU2l8R-l5BQVPRcAi8GOf39XSDS7v-LvW1UU";
	
		let swRegistration = await navigator.serviceWorker.getRegistration();
		let pushManager = swRegistration.pushManager;
		if (!isPushManagerActive(pushManager)) {
			debugView.innerHTML += "<span>&gt;subscribeToPush() Pushmanager is not active0</span>";
			subscribeNotifBtn.disabled = true;
			subInfo.innerHTML = "subscribeToPush() Pushmanager is not active";
	
	//		reqMotionPermBtn.disabled = false;
	
			return;
		}
		else{
			debugView.innerHTML += "<span>&gt;subscribeToPush() Pushmanager is active</span>";
		}
		let subscriptionOptions = {
			userVisibleOnly: true,
			applicationServerKey: VAPID_PUBLIC_KEY
		};

		try {
			let subscription = await pushManager.subscribe(subscriptionOptions);
			debugView.innerHTML += "<span>&gt;subscribeToPush() "+JSON.stringify(subscription)+"</span>";
			testSendBtn.disabled = false;
//			displaySubscriptionInfo(subscription);
		}
		catch(err) {
			subInfo.style.display = "block";
			subInfo.innerHTML = "subscribeToPush() "+err;
			debugView.innerHTML += "<span>&gt;subscribeToPush() "+err+"</span>";
	//		subscribeNotifBtn.style.display = "none";
			subscribeNotifBtn.disabled = true;
		}

	}
	catch(err){
			debugView.innerHTML += "<span>&gt;subscribeToPush() "+err+"</span>";
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
			debugView.innerHTML += "<span>&gt;displaySubscriptionInfo() is_iOS is TRUE</span>";
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
				debugView.innerHTML += "<span>&gt;displaySubscriptionInfo() DeviceMotionEvent is a function. Should be a iOS device?</span>";
	//			reqMotionPermBtn.style.display = "block";
				reqMotionPermBtn.disabled = false;
			}
			else{
				debugView.innerHTML += "<span>&gt;displaySubscriptionInfo() requestPermission is not undefined and not function.</span>";
			}
		}
		else if(is_Android()){
			debugView.innerHTML += "<span>&gt;displaySubscriptionInfo() is_Android is TRUE</span>";
			debugView.innerHTML += "<span>&gt;displaySubscriptionInfo() DeviceMotionEvent is a function. Should be a iOS device?</span>";
			reqMotionPermBtn.style.display = "block";
			reqMotionPermBtn.disabled = false;
		}
		else{
			debugView.innerHTML += "<span>&gt;displaySubscriptionInfo() is_iOS and is_Android is FALSE. Device not valid</span>";
			notValidDeviceView.style.display = "block";
		}
	}
	catch(err){
			debugView.innerHTML += "<span>"+err.message+"</span>";
	}
}

function sendPush(title, body) {
	debugView.innerHTML += "<span>&gt;SendPush()</span>";

	try{
		const options = {
			body: body,
			icon: "https://skorpi0n.github.io/inclinotifier/images/favicon.png",
			renotify: true,
			silent: false,
			tag: "inclinotifier",	//Using same ID will replace/overwrite previous notification
	//		image: ?
		};
		navigator.serviceWorker.ready.then(async function (serviceWorker) {
			await serviceWorker.showNotification(title, options);
		});
	}
	catch(err){
			debugView.innerHTML += "<span>&gt;sendPush() "+err+"</span>";
	}

}