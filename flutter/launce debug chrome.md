<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [launch debug chrome](#launch-debug-chrome)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

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
