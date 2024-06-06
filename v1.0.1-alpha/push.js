//Push notifications
async function initServiceWorker() {
	try{
		let swRegistration = await navigator.serviceWorker.register("serviceworker.js")
		let pushManager = swRegistration.pushManager;

		if(!isPushManagerActive(pushManager)) {
			$("debug").innerHTML += "<span>&gt;initServiceWorker() Pushmanager is not active</span>";
//			$("settings-btn").classList.remove("fa-disabled");
			$("sub-info").innerHTML = langData["pushmanager-is-not-active"][lang];
			$("sub-info").style.display = "block";
			gotoView("settings");
			return;
		}
		else{
			$("debug").innerHTML += "<span>&gt;initServiceWorker() Pushmanager is active</span>";
		}

		pushPermissionState = await pushManager.permissionState({userVisibleOnly: true});
		$("debug").innerHTML += "<span>&gt;initServiceWorker() pushPermissionState: "+pushPermissionState+"</span>";
		switch (pushPermissionState) {
			case "prompt":
				$("subscribe-notif-btn").style.display = "block";
				$("subscribe-notif-btn").disabled = false;
				$("subscribe-notif-btn").classList.add("pulse");
				$("sub-info").style.display = "block";
				$("sub-info").innerHTML = langData["not-subscribed-yet"][lang];
				//$("settings-btn").classList.remove("fa-disabled");
				gotoView("settings");
				$("debug").innerHTML += "<span>&gt;initServiceWorker() pushPermissionState prompt</span>";
				break;
			case "granted":
				$("test-send-btn").style.display = "block";
				$("test-send-btn").disabled = false;
				$("subscribe-notif-btn").style.display = "none";
				$("subscribe-notif-btn").disabled = true;
				$("subscribe-notif-btn").classList.remove("pulse");
				$("sub-info").style.display = "block";
				$("sub-info").innerHTML = langData["subscribed-to-notifications"][lang];
				//$("orientation-btn").classList.remove("fa-disabled");
				//$("settings-btn").classList.remove("fa-disabled");

				$("debug").innerHTML += "<span>&gt;initServiceWorker() orientationPermissionState: "+orientationPermissionState+"</span>";
				if(orientationPermissionState === "granted"){
					gotoView("orientation");
					orientationCounter = 7;
					$("orientation-delay-timer").style.display = "block";
					$("orientation").classList.add("blur");
					orientationDelayTimer();
					orientationTimer = setInterval(function(){
						orientationDelayTimer();
					}, 1000);
				}
				else{
					gotoView("settings");
				}

				$("debug").innerHTML += "<span>&gt;initServiceWorker() pushPermissionState granted</span>";
				displaySubscriptionInfo(await pushManager.getSubscription());
				break;
			case "denied":
				$("subscribe-notif-btn").style.display = "none";
				$("subscribe-notif-btn").disabled = true;
				$("subscribe-notif-btn").classList.remove("pulse");
				$("test-send-btn").style.display = "none";
				$("test-send-btn").disabled = true;
				$("sub-info").style.display = "block";
				$("sub-info").innerHTML = langData["user-denied-push-permission"][lang];
				$("debug").innerHTML += "<span>&gt;initServiceWorker() pushPermissionState denied</span>";
		}

	}
	catch(err){
		$("debug").innerHTML += "<span>&gt;initServiceWorker() "+err+"</span>";
	}
}

function isPushManagerActive(pushManager) {
	try{
		$("debug").innerHTML += "<span>&gt;isPushManagerActive()</span>";
		$("debug").innerHTML += "<span>&gt;isPushManagerActive() pushManager: "+pushManager+"</span>";
		if(!pushManager || pushManager == "undefined"){
			$("subscribe-notif-btn").style.display = "none";
			$("subscribe-notif-btn").disabled = false;
			$("subscribe-notif-btn").classList.add("pulse");
			$("sub-info").style.display = "block";
			$("sub-info").innerHTML = langData["pushmanager-is-not-available"][lang];
			return false;
		}
		else {
			$("debug").innerHTML += "<span>&gt;isPushManagerActive() Has Pushmanager</span>";
			return true;
		}
	}
	catch(err){
			$("debug").innerHTML += "<span>&gt;isPushManagerActive() "+err+"</span>";
	}
}

//Called from <button>
async function subscribeToPush() {
	$("debug").innerHTML += "<span>&gt;subscribeToPush()</span>";

	try{
		const VAPID_PUBLIC_KEY = "BFPmwTmsONIPnl4UBrQVE9k1K5dpHFN85CIbnXmWWn2LrT9bdBaCU2l8R-l5BQVPRcAi8GOf39XSDS7v-LvW1UU";
	
		let swRegistration = await navigator.serviceWorker.getRegistration();
		let pushManager = swRegistration.pushManager;
		if (!isPushManagerActive(pushManager)){
			$("debug").innerHTML += "<span>&gt;subscribeToPush() Pushmanager is not active</span>";
			$("subscribe-notif-btn").disabled = true;
			$("subscribe-notif-btn").style.display = "none";
			$("subscribe-notif-btn").classList.remove("pulse");
			$("sub-info").style.display = "block";
			$("sub-info").innerHTML = langData["pushmanager-is-not-active"][lang];
			return;
		}
		else{
			$("debug").innerHTML += "<span>&gt;subscribeToPush() Pushmanager is active</span>";
		}
		let subscriptionOptions = {
			userVisibleOnly: true,
			applicationServerKey: VAPID_PUBLIC_KEY
		};

		try {
			let subscription = await pushManager.subscribe(subscriptionOptions);
			$("subscribe-notif-btn").style.display = "none";
			$("subscribe-notif-btn").disabled = true;
			$("subscribe-notif-btn").classList.remove("pulse");
			$("sub-info").style.display = "block";
			$("sub-info").innerHTML = langData["subscribed-to-notifications"][lang];
			$("test-send-btn").style.display = "block";
			$("test-send-btn").disabled = false;

			pushPermissionState = "granted";

			$("debug").innerHTML += "<span>&gt;subscribeToPush() orientationPermissionState: "+orientationPermissionState+"</span>";
			if(orientationPermissionState === "granted"){
				gotoView("orientation");
			}

			displaySubscriptionInfo(subscription);
		}
		catch(err) {
			$("sub-info").style.display = "block";
			$("sub-info").innerHTML = err;
			$("debug").innerHTML += "<span>&gt;subscribeToPush() "+err+"</span>";
			$("subscribe-notif-btn").style.display = "none";
			$("subscribe-notif-btn").disabled = true;
			$("subscribe-notif-btn").classList.remove("pulse");
		}

	}
	catch(err){
			$("debug").innerHTML += "<span>&gt;subscribeToPush() "+err+"</span>";
	}
}

function displaySubscriptionInfo(subscription) {
	try{
		$("debug").innerHTML += "<span>&gt;displaySubscriptionInfo() "+JSON.stringify(subscription.toJSON())+"</span>";
	}
	catch(err){
		$("debug").innerHTML += "<span>"+err+"</span>";
	}
}

function sendPush(title, mess) {
	try{
	$("debug").innerHTML += "<span>&gt;SendPush() "+title+"</span>";

	$("debug").innerHTML += "<span>&gt;SendPush() "+mess+"</span>";
	$("debug").innerHTML += "<span>&gt;SendPush() "+lang+"</span>";
	$("debug").innerHTML += "<span>&gt;SendPush()</span>";
		//https://developer.mozilla.org/en-US/docs/Web/API/Notification
		const options = {
			body: mess,
			icon: "https://skorpi0n.github.io/inclinotifier/images/favicon.png",
			renotify: true,	//Not supported in iOS
			silent: false,
			tag: "inclinotifier",	//Exposed, but not implemented in iOS (https://developer.mozilla.org/en-US/docs/Web/API/Notification/tag)
	//		image: ?	//Not supported in iOS
		};
		navigator.serviceWorker.ready.then(async function (serviceWorker) {
			await serviceWorker.showNotification(title, options);
		});
	}
	catch(err){
		$("debug").innerHTML += "<span>&gt;sendPush() "+err+"</span>";
	}

}

//$("debug").innerHTML += "<span>&gt;push.js was loaded to the end</span>";