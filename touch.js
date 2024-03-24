//Touch Events
//	document.body.addEventListener("touchstart", function(e){ e.preventDefault(); });
//	document.body.addEventListener("touchmove", function(e){ e.preventDefault(); });

/*
document.getElementById("side-view").addEventListener("touchstart", process_touchstart, false);
document.getElementById("side-view").addEventListener("touchend", process_touchend, false);
document.getElementById("side-view").addEventListener("touchmove", process_touchmove, false);
document.getElementById("side-view").addEventListener("touchcancel", process_touchcancel, false);
*/

// touchstart handler
function process_touchstart(ev){
	console.log(ev);
	// Use the event's data to call out to the appropriate gesture handlers
	switch (ev.touches.length) {
		case 1:
			handle_one_touch(ev);
			break;
		case 2:
			handle_two_touches(ev);
			break;
		case 3:
			handle_three_touches(ev);
			break;
		default:
			gesture_not_supported(ev);
			break;
	}
}
// touchend handler
function process_touchend(ev){
	console.log(ev);
}

//touchmove handler
function process_touchmove(ev) {
	ev.preventDefault();
}

//touchcancel handler
function process_touchcancel(ev) {
	ev.preventDefault();
}
