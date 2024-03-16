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
