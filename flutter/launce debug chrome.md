# launch debug chrome


> folder .vscode/launch.json
```json
{
	"version": "0.2.0",
	"configurations": [
		{
			"name": "Current Device",
			"request": "launch",
			"type": "dart"
		},
		{
			"name": "Android",
			"request": "launch",
			"type": "dart",
			"deviceId": "android"
		},
		{
			"name": "iPhone",
			"request": "launch",
			"type": "dart",
			"deviceId": "iphone"
		},
	],
	"compounds": [
		{
			"name": "All Devices",
			"configurations": ["Android", "iPhone"],
		}
	]
}
```
