//Push notifications
async function initServiceWorker() {
	try{
		let swRegistration = await navigator.serviceWorker.register("https://skorpi0n.github.io/inclinotifier/serviceworker.js", {scope: "/inclinotifier/"})
		let pushManager = swRegistration.pushManager;

		if(!isPushManagerActive(pushManager)) {
			$("debug").innerHTML += "<span>&gt;initServiceWorker() Pushmanager is not active</span>";
			$("sub-info").innerHTML = "Pushmanager is not active";
			return;
		}
		else{
			$("debug").innerHTML += "<span>&gt;initServiceWorker() Pushmanager is active</span>";
			//$("test-send-btn").style.display = "block";
		}

		pushPermissionState = await pushManager.permissionState({userVisibleOnly: true});
		switch (pushPermissionState) {
			case "prompt":
				$("subscribe-notif-btn").style.display = "block";
				$("subscribe-notif-btn").disabled = false;
				$("sub-info").style.display = "block";
				$("sub-info").innerHTML = "Not subscribed yet";
				$("settings-btn").classList.remove("fa-disabled");
				gotoView("settings");
				$("debug").innerHTML += "<span>&gt;initServiceWorker() pushPermissionState prompt</span>";
				break;
			case "granted":
				$("test-send-btn").style.display = "block";
				$("test-send-btn").disabled = false;
				$("subscribe-notif-btn").style.display = "none";
				$("subscribe-notif-btn").disabled = true;
				$("sub-info").style.display = "block";
				$("sub-info").innerHTML = "Subscribed to Push Notifications";
				$("orientation-btn").classList.remove("fa-disabled");
				$("settings-btn").classList.remove("fa-disabled");

				$("debug").innerHTML += "<span>&gt;initServiceWorker() pushPermissionState: "+pushPermissionState+"</span>";

				$("debug").innerHTML += "<span>&gt;initServiceWorker() orientationPermissionState: "+orientationPermissionState+"</span>";
				if(orientationPermissionState === "granted"){
					gotoView("orientation");
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
				$("test-send-btn").style.display = "none";
				$("test-send-btn").disabled = true;
				$("sub-info").style.display = "block";
				$("sub-info").innerHTML = "User denied push permission";
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
		if (!pushManager) {
			$("subscribe-notif-btn").style.display = "none";
			$("subscribe-notif-btn").disabled = false;
			$("sub-info").style.display = "block";
			$("sub-info").innerHTML = "PushManager is not available";
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
		if (!isPushManagerActive(pushManager)) {
			$("debug").innerHTML += "<span>&gt;subscribeToPush() Pushmanager is not active</span>";
			$("subscribe-notif-btn").disabled = true;
			$("subscribe-notif-btn").style.display = "none";
			$("sub-info").style.display = "block";
			$("sub-info").innerHTML = "subscribeToPush() Pushmanager is not active";	
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
//			$("debug").innerHTML += "<span>&gt;subscribeToPush() "+JSON.stringify(subscription)+"</span>";
			$("subscribe-notif-btn").style.display = "none";
			$("subscribe-notif-btn").disabled = true;
			$("sub-info").style.display = "block";
			$("sub-info").innerHTML = "Subscribed to Push Notifications";
			$("test-send-btn").style.display = "block";
			$("test-send-btn").disabled = false;
			displaySubscriptionInfo(subscription);
		}
		catch(err) {
			$("sub-info").style.display = "block";
			$("sub-info").innerHTML = "subscribeToPush() "+err;
			$("debug").innerHTML += "<span>&gt;subscribeToPush() "+err+"</span>";
			$("subscribe-notif-btn").style.display = "none";
			$("subscribe-notif-btn").disabled = true;
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

function sendPush(title, body) {
	$("debug").innerHTML += "<span>&gt;SendPush()</span>";

	try{
		const options = {
			body: body,
			icon: "https://skorpi0n.github.io/inclinotifier/images/favicon.png",
			renotify: true,
			silent: false,
			tag: 1234,	//Using same ID will replace/overwrite previous notification
	//		image: ?
		};
		navigator.serviceWorker.ready.then(async function (serviceWorker) {
			await serviceWorker.showNotification(title, options);
		});
	}
	catch(err){
			$("debug").innerHTML += "<span>&gt;sendPush() "+err+"</span>";
	}

}

$("debug").innerHTML += "<span>&gt;push.js was loaded to the end</span>";
