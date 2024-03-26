# Inclinotifier

## What is it?

## What does it do?

## History
This idea came to my mind shortly after I bought my first caravan and thought that it should be possible to utilize my smartphone (iPhone 8) as an inclinometer (spirit level) and send push notifications to itself which would then show up on my smart watch (Garmin Forerunner 935) with guidence how level my caravan.

At first look, It looked like push notifications was only possible from a native app and since I wasnt't very fond of spending $99 per year for a Apple Dev-account, the idea was postponed.

In mid March 2024 I finally found out that Push Notifications indeed worked with JavaScript, aslong as you provide a secure connection (https://) and add it as a bookmark on "Home Screen", which will let it run almost like a native app.

The work then began to make this Web App.


If you like my Web App, please support my Work!
<br>
<a href="https://www.buymeacoffee.com/skorpi0n" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" height="41" width="174"></a>


## Milestones already reached
1. Proof of concept with working caravan X/Z tilt visualization (build 3e385b8)

## Not working (not possible at the moment)
1. Audio notifications / SpeechSynthesis
	For SpeechSynthesis to work, it needs user interactionin the form of a click or similar

## Milestones to reach
1. Toggle Push / ~Audio notification~ (when smartwatch is not available)
	Text to speech
	https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API
	https://codepen.io/matt-west/pen/DpmMgE
	<br>**NOTE: Not possible since it can only be triggered by user interaction.**

2. Public Release with caravan X/Z tilt visualization with working push/audio notifications
	Need to also show how to use it properly

3. Add ability to change icon to RV, car, spirit level. Anything more?

## TODO list

:white_check_mark: Replace home icon with tilted caravan icon

:white_check_mark: Calibration ability in the settings view

:white_large_square:	 Add to settings
	if degree <= x, send push with level completed message

:white_large_square:	When should push be sent?
	Send push only on +/-1 change and max every 5s?
	On every change 1 degree, check if currentTS is greater than timerStartTS+5s, then do a push?

:white_check_mark: Add ability to change axleToJockeyWheel distance by clicking on the caravan image
	---Push on wheel base should increase length to jockey wheel by 250mm?---
	---touchstart and touchend should increase length by 100 each x?
		Read more at https://developer.mozilla.org/en-US/docs/Web/API/Touch_events/Using_Touch_Events
		How to destinguis a horizontal touchmove? Can I use vertical touchmove to something else?
			If vertical move is within 20% of start, then it should be considered as horizontal and vice versa
			How will horizontal touchmove react in portrait/landscape mode?---

:white_check_mark: Show distance in image

:white_check_mark: Save variables to local storage?
	
:white_check_mark: Add icon with transparent bg in favicon.png

:white_check_mark: Investigate what can be put in manifest.json

## <ins>Version History</ins>




**March 15th 2024 (build 3e385b8)**
First release with proof of concept.