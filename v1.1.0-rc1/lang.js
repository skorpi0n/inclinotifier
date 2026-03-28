/*
	This is the language file for Inclinotifier

	If you wnat to translate to another language, please follow instructions below

	Instructions
		Append the new language to the object "langAvailable"
			example:
				"de": "Deutch",
		For every key (like scan-qr-code) in the object "langData", a new language key has to be defined (like de, matching the language code specified in the object langAvailable)
		If the phrase doesn't have adjacent numeric keys, then the phrase will be on a single line.
		If the phrase have numeric keys (like 0, 1, 2...), the phrase will be separated in multiple lines.
		Just try to follow how the existing languages are defined.


	When you have translated the file, please mail it to niclas@skorpion.se
*/

langAvailable = {
	"en": "English",
	"sv": "Svenska",
}
langData = {
	//index.html
	"scan-qr-code": {
		"en": {
			0: "Looks like you're not on an mobile device!",
			1: "Scan this QR code to open it in your mobile device",
		},
		"sv": {
			0: "Det verkar inte som att du använder en mobil enhet!",
			1: "Skanna denna QR-kod för att öppna sidan i en mobil enhet",
		}
	},
	"share-qr-code": {
		"en": {
			0: "If you like this Web App, please",
			1: "And share it by letting",
			2: "others scan this QR-code",
		},
		"sv": {
			0: "Om du gillar denna Web App, glöm inte att",
			1: "Och dela den genom att",
			2: "låta andra skanna denna QR-kod",
		},
	},
	"not-a-valid-device": {
		"en": {
			0: "Looks like you're neither on a iOS or Android device",
			1: "If this is incorrect, ",
			2: "report issue at GitHub",
			3: " with copied text from the debug view ",
			4: "(</>)",
		},
		"sv": {
			0: "Det verkar som att du varken använder dig av en iOS- eller Android-enhet",
			1: "Om detta är inkorrekt, ",
			2: "rapportera felet hos GitHub,",
			3: " med kopierad text från felsökningsfönstret ",
			4: "(</>)",
		}

	},
	"add-to-home-screen": {
		"en": "For Inclinotifier to work, you need to add it to your Home Screen.",
		"sv": "För att Inclinotifier ska fungera, krävs det att du lägger till det på din hemskärm.",
	},
	"z-axis": {
		"en": "Z-axis: ",
		"sv": "Z-axel: ",
	},
	"z-distance": {
		"en": "Z-distance: ",
		"sv": "Z-avstånd: ",
	},
	"x-axis": {
		"en": "X-axis: ",
		"sv": "X-axel: ",
	},
	"x-distance": {
		"en": "X-distance: ",
		"sv": "X-avstånd: ",
	},
	"x-turns": {
		"en": "X-turns: ",
		"sv": "X-varv: ",
	},
	"sub-to-push": {
		"en": "Subscribe to notifications",
		"sv": "Prenumerera på notiser",
	},
	"test-push-title": {
		"en": "Push notification test",
		"sv": "Pushnotis test",
	},
	"test-push-body": {	
		"en": "Push notification is working if you can read this",
		"sv": "Pushnotiser fungerar om du kan läsa detta",
	},
	"send-test-push": {
		"en": "Send test notification",
		"sv": "Skicka en testnotis",
	},
	"req-perm-for-orient": {
		"en": "Request permission for orientation",
		"sv": "Begär tillstånd för rörelse",
	},
	"push-intrval": {
		"en": "Push Interval",
		"sv": "Push Intervall",
	},
	"wheel-track-dist": {
		"en": "Wheel Track Distance",
		"sv": "Spårvidd hjul",
	},
	"axle-to-jockey": {
		"en": "Axle To Jockey wheel",
		"sv": "Axel Till Stödhjul",
	},
	"jockey-wheel-thread-pitch-mm": {
		"en": "Jockey Wheel Thread Pitch",
		"sv": "Stödhjul Gängstigning",
	},
	"calibrate": {
		"en": "Calibrate",
		"sv": "Kalibrera",
	},
	"calibrated-offset-z": {
		"en": "Calibrated Offset Z",
		"sv": "Kalibrerad Offset Z",
	},
	"calibrated-offset-x": {
		"en": "Calibrated Offset X",
		"sv": "Kalibrerad Offset X",
	},
	"language": {
		"en": "Language",
		"sv": "Språk",
	},
	"units": {
		"en": "Units",
		"sv": "Enheter",
	},
	"metric": {
		"en": "Metric",
		"sv": "Meter",
	},
	"imperial": {
		"en": "Imperial",
		"sv": "Tum",
	},
	"clockwise": {
		"en": "cw",
		"sv": "medurs",
	},
	"counter-clockwise": {
		"en": "ccw",
		"sv": "moturs",
	},
	"reset": {
		"en": "Reset to defaults",
		"sv": "Återställ till standard",
	},
	"visit-code-github": {
		"en": "Visit this code at GitHub",
		"sv": "Besök denna kod hos GitHub",
	},
	"report-issue-github": {
		"en": "Report issue at GitHub",
		"sv": "Rapportera problem via GitHub",
	},

	//frontend.js
	"not-https": {
		"en": "Not HTTPS://",
		"sv": "Ej HTTPS://",
	},
	"unknown-error": {
		"en": "Unknown Error",
		"sv": "Okänt fel",
	},
	"not-standalone-add-to-home-screen": {
		"en": "Not Standalone, add to home screen",
		"sv": "Ej fristående, lägg till på hemskärmen",
	},
	"neither-ios-or-android": {
		"en": "Neither iOS or Android",
		"sv": "Varken iOS eller Android",
	},
	"device-orientation-is-available": {
		"en": "DeviceOrientationEvent is available",
		"sv": "DeviceOrientationEvent är tillgänglig",
	},
	"device-orientation-is-not-available": {
		"en": "DeviceOrientationEvent is not available",
		"sv": "DeviceOrientationEvent är inte tillgänglig",
	},
	"device-orientation-requestPermission-is-not-a-function": {
		"en": "DeviceOrientationEvent is not a function",
		"sv": "DeviceOrientationEvent är inte en funktion",
	},

	//push.js
	"not-subscribed-yet": {
		"en": "Not subscribed yet",
		"sv": "Prenumeration saknas",
	},
	"subscribed-to-notifications": {
		"en": "Subscribed to Push Notifications",
		"sv": "Prenumererar på notiser",
	},
	"user-denied-push-permission": {
		"en": "User denied push permission",
		"sv": "Användare nekade tillstånd för notiser",
	},
	"pushmanager-is-not-available": {
		"en": "PushManager is not available",
		"sv": "PushManager är inte tillgänglig",
	},
	"pushmanager-is-not-active": {
		"en": "Pushmanager is not active",
		"sv": "Pushmanager är inte aktiv",
	},

	//orientation.js
	"done": {
		"en": "DONE",
		"sv": "KLAR",
	},
	"error": {
		"en": "ERROR",
		"sv": "FEL",
	},
	"wait": {
		"en": "WAIT",
		"sv": "VÄNTA",
	},
	"place-device": {
		"en":"PLACE DEVICE ON A FLAT SURFACE",
		"sv":"PLACERA ENHETEN PÅ EN PLAN YTA",
	},
	"jockeywheel": {
		"en": "Jockey wheel",
		"sv": "Stödhjul",
	},
	"jockeywheel": {
		"en": "Jockey wheel",
		"sv": "Stödhjul",
	},
	"jockeywheel-up-by": {
		"en": "Jockey wheel up by",
		"sv": "Stödhjul upp",
	},
	"jockeywheel-down-by": {
		"en": "Jockey wheel down by",
		"sv": "Stödhjul ned",
	},
	"side-to-side": {
		"en": "Side to side",
		"sv": "Sida till sida",
	},
	"right-wheel-up-by": {
		"en": "Right wheel up by",
		"sv": "Höger hjul upp",
	},
	"left-wheel-up-by": {
		"en": "Left wheel up by",
		"sv": "Vänster hjul upp",
	},
	"orientation-granted": {
		"en": "Orientation was Granted",
		"sv": "Orientering godkänd",
	},
	"orientation-denied": {
		"en": "Orientation was Denied",
		"sv": "Orientation ej godkänd",
	},
	"orientation-not-asked": {
		"en": "Device orientation not asked yet",
		"sv": "Enhetsorientering ej tillfrågad",
	},
}
