//Push notifications
async function initServiceWorker() {
	try{
		let swRegistration = await navigator.serviceWorker.register('https://skorpi0n.github.io/inclinotifier/serviceworker.js', {scope: '/inclinotifier/'})
		let pushManager = swRegistration.pushManager;

		if (!isPushManagerActive(pushManager)) {
			document.getElementById('debug').innerHTML += '<br>Pushmanager is not active1';
			return;
		}

		let permissionState = await pushManager.permissionState({userVisibleOnly: true});
		switch (permissionState) {
			case 'prompt':
				document.getElementById('debug').innerHTML += '<br>btns shown by prompt';
				document.getElementById('subscribe-to-notifications-btn').style.display = 'block';
				document.getElementById('request-perm-for-motion-btn').style.display = 'block';
				break;
			case 'granted':
				document.getElementById('debug').innerHTML += '<br>User granted push permission';
				document.getElementById('request-perm-for-motion-btn').style.display = 'none';
				displaySubscriptionInfo(await pushManager.getSubscription())
				break;
			case 'denied':
				document.getElementById('subscribe-to-notifications-btn').style.display = 'none';
				document.getElementById('sub-info').style.display = 'block';
				document.getElementById('sub-info').innerHTML = 'User denied push permission';
				document.getElementById('debug').innerHTML += '<br>User denied push permission';
		}
	}
	catch(error){
		console.error("Error initializing serviceworker: "+error);
	}
}

function isPushManagerActive(pushManager) {
	document.getElementById('debug').innerHTML += '<br>pushManager function init';
	if (!pushManager) {
		//What should I do if pushmanager is false?
		document.getElementById('subscribe-to-notifications-btn').style.display = 'block';
		document.getElementById('request-perm-for-motion-btn').style.display = 'block';
/*
		if (!window.navigator.standalone) {
		}
		else{
			throw new Error('PushManager is not active');
		}
*/
		return false;
	}
	else {
		document.getElementById('debug').innerHTML += '<br>Has Pushmanager';
		return true;
	}
}

//Called from <button>
async function subscribeToPush() {
	// Public part of VAPID key, generation of that covered in README
	// All subscription tokens associated with that key, so if you change it - you may lose old subscribers
	const VAPID_PUBLIC_KEY = 'BFPmwTmsONIPnl4UBrQVE9k1K5dpHFN85CIbnXmWWn2LrT9bdBaCU2l8R-l5BQVPRcAi8GOf39XSDS7v-LvW1UU';

	let swRegistration = await navigator.serviceWorker.getRegistration();
	let pushManager = swRegistration.pushManager;
	if (!isPushManagerActive(pushManager)) {
		document.getElementById('debug').innerHTML += '<br>Pushmanager is not active0';
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
		document.getElementById('sub-info').style.display = 'block';
		document.getElementById('sub-info').innerHTML = 'User has denied subscription';
		document.getElementById('debug').innerHTML += '<br>User has denied subscription '+error;
		document.getElementById('subscribe-to-notifications-btn').style.display = 'none';
	}
}

function displaySubscriptionInfo(subscription) {
	document.getElementById('subscribe-to-notifications-btn').style.display = 'none';
//	document.getElementById('sub-info').style.display = 'block';
//	document.getElementById('sub-info').innerHTML = 'User has accepted subscription';
	document.getElementById('test-send-btn').style.display = 'block';


	if(is_iOS()){
		document.getElementById('debug').innerHTML += "<br>is_iOS is TRUE";
		if(typeof DeviceMotionEvent.requestPermission === "undefined"){
			document.getElementById('subscribe-to-notifications-btn').style.display = 'none';
			document.getElementById('request-perm-for-motion-btn').style.display = 'none';
			document.getElementById('orientation').style.display = 'none';		
			document.getElementById('request-perm-for-motion-btn').style.display = 'none';
		
		}
		else if(typeof DeviceMotionEvent.requestPermission === "function"){
			document.getElementById('debug').innerHTML += "<br>DeviceMotionEvent is a function. Should be a iOS device?";
			document.getElementById('request-perm-for-motion-btn').style.display = 'block';
		}
		else{
			document.getElementById('debug').innerHTML += "<br>requestPermission is not undefined and not function.";
		}
	}
	else if(is_Android()){
		document.getElementById('debug').innerHTML += "<br>is_Android is TRUE";
		document.getElementById('debug').innerHTML += "<br>DeviceMotionEvent is a function. Should be a iOS device?";
		document.getElementById('request-perm-for-motion-btn').style.display = 'block';
	}
	else{
		document.getElementById('debug').innerHTML += "<br>is_iOS and is_Android is FALSE. Device not valid";
		document.getElementById('not-a-valid-device').style.display = 'block';
	}
}

function sendPush(title, body) {
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