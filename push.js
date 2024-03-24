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
			$("test-send-btn").style.display = "block";
		}

		let permissionState = await pushManager.permissionState({userVisibleOnly: true});
//		$("debug").innerHTML += "<span>&gt;initServiceWorker() permissionState: "+permissionState+"</span>";
		switch (permissionState) {
			case "prompt":
				$("subscribe-notif-btn").style.display = "block";
				$("subscribe-notif-btn").disabled = false;
				$("sub-info").style.display = "none";
				$("sub-info").innerHTML = "Choose";
				$("debug").innerHTML += "<span>&gt;initServiceWorker() permissionState prompt</span>";
				break;
			case "granted":
				$("test-send-btn").style.display = "block";
				$("test-send-btn").disabled = false;
				$("subscribe-notif-btn").style.display = "none";
				$("subscribe-notif-btn").disabled = true;
				$("sub-info").style.display = "block";
				$("sub-info").innerHTML = "Subscribed to Push Notifications";
				$("debug").innerHTML += "<span>&gt;initServiceWorker() permissionState granted</span>";
				displaySubscriptionInfo(await pushManager.getSubscription());
//				await pushManager.getSubscription();
				break;
			case "denied":
				$("subscribe-notif-btn").style.display = "none";
				$("subscribe-notif-btn").disabled = true;
				$("sub-info").style.display = "block";
				$("sub-info").innerHTML = "User denied push permission";
				$("debug").innerHTML += "<span>&gt;initServiceWorker() permissionState denied</span>";
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
			//What should I do if pushmanager is false?
	//		$("subscribe-notif-btn").style.display = "block";
	//		reqMotionPermBtn.style.display = "block";
			$("subscribe-notif-btn").disabled = false;
			reqMotionPermBtn.disabled = false;
			return false;
		}
		else {
			$("debug").innerHTML += "<span>&gt;isPushManagerActive() Has Pushmanager</span>";
			return true;
		}
	}
	catch(err){
			$("debug").innerHTML += "<span>&gt;isPushManagerActive() "+err.message+"</span>";
	}
}

//Called from <button>
async function subscribeToPush() {
	$("debug").innerHTML += "<span>&gt;subscribeToPush()</span>";

	try{
		// Public part of VAPID key, generation of that covered in README
		// All subscription tokens associated with that key, so if you change it - you may lose old subscribers
		const VAPID_PUBLIC_KEY = "BFPmwTmsONIPnl4UBrQVE9k1K5dpHFN85CIbnXmWWn2LrT9bdBaCU2l8R-l5BQVPRcAi8GOf39XSDS7v-LvW1UU";
	
		let swRegistration = await navigator.serviceWorker.getRegistration();
		let pushManager = swRegistration.pushManager;
		if (!isPushManagerActive(pushManager)) {
			$("debug").innerHTML += "<span>&gt;subscribeToPush() Pushmanager is not active0</span>";
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
		$("debug").innerHTML += "<span>"+err.message+"</span>";
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
			tag: "inclinotifier",	//Using same ID will replace/overwrite previous notification
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