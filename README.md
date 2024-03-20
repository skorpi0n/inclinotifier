# Inclinotifier
WARNING!

WORK IN PROGRESS!

UNDER DEVELOPMENT!

# Milestones already reached
1. Proof of concept with working caravan X/Z tilt visualization (build 3e385b8)

# Not working (not possible at the moment)
1. Audio notifications / SpeechSynthesis
	For SpeechSynthesis to work, it needs user interactionin the form of a click or similar

# Milestones to reach
1. Toggle Push / Audio notification (when smartwatch is not available)
	Text to speech
	https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API
	https://codepen.io/matt-west/pen/DpmMgE

2. Public Release with caravan X/Z tilt visualization with working push/audio notifications
	Need to also show how to use it properly

3. Add ability to change icon to RV, car, spirit level. Anything more?

# TODO list
Add grass in footer

When should push be sent?
	Send push only on +/-1 change and max every 5?s
	On every change 1 degree, check if currentTS is greater than timerStartTS+5s, then do a push?

Add ability to change axleToJockeyWheel distance by clicking on the caravan image
	Push on wheel base should increase length to jockey wheel by 250mm?
	touchstart and touchend should increase length by 100 each x?
		Read more at https://developer.mozilla.org/en-US/docs/Web/API/Touch_events/Using_Touch_Events
		How to destinguis a horizontal touchmove? Can I use vertical touchmove to something else?
			If vertical move is within 20% of start, then it should be considered as horizontal and vice versa
			How will horizontal touchmove react in portrait/landscape mode?
	Show distance in image

What variables should be saved to local storage?
	Axle to jockey wheel length?

Add icon with transparent bg in favicon.png

Investigate what can be put in manifest.json
	Keep icon pack in manifest.json
