# PWA

install package

`
yarn add @ducanh2912/next-pwa && yarn add -D webpack
`

next.config.mjs

```js
const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
});

module.exports = withPWA({
  // Your Next.js config
});
```

```json
{
  "name": "wibu example",
  "id": "makuro.bip.wibu.example",
  "dir": "auto",
  "short_name": "WXM",
  "description": "wibu example",
  "lang": "en",
  "scope": "/",
  "version": "0.0.1",
  "prefer_related_applications": true,
  "handle_links": "preferred",
  "launch_handler": {
    "client_mode": [
      "navigate-existing",
      "auto"
    ]
  },
  "edge_side_panel": {
    "preferred_width": 400
  },
  "scope_extensions": [
    {
      "origin": "*.ravenstone.cloud"
    }
  ],
  "categories": [
    "utility"
  ],
  "screenshots": [
    {
      "src": "/icons/base.png",
      "sizes": "1280x720",
      "type": "image/jpg",
      "platform": "wide"
    }
  ],
  "shortcuts": [
    {
      "name": "Home",
      "url": "/"
    }
  ],
  "protocol_handlers": [
    {
      "protocol": "web+music",
      "url": "/play?track=%s"
    }
  ],
  "iarc_rating_id": "e58c174a-81d2-5c3c-32cc-34b8de4a52e9",
  "related_applications": [
    {
      "platform": "windows",
      "url": "https://www.example-app.com",
      "id": "example.ExampleApp"
    },
    {
      "platform": "play",
      "url": "https://www.example-app-2.com"
    }
  ],
  "icons": [
    {
      "src": "/icons/manifest-icon-192.maskable.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/manifest-icon-192.maskable.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable"
    },
    {
      "src": "/icons/manifest-icon-512.maskable.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/manifest-icon-512.maskable.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    },
    {
      "src": "icons/android-chrome-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable"
    }
  ],
  "theme_color": "#FFFFFF",
  "background_color": "#FFFFFF",
  "start_url": "/",
  "display": "standalone",
  "orientation": "portrait"
}
```


install pwa button

```tsx
'use client'
import { Button, Card, Stack } from '@mantine/core';
import { useEffect, useState } from 'react';

export function PWAInstall() {
    const [deferredPrompt, setDeferredPrompt] = useState<any | null>(null);
    const [installPromptVisible, setInstallPromptVisible] = useState(false);

    useEffect(() => {
        const beforeInstallPromptHandler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as any);
            setInstallPromptVisible(true);
        };

        window.addEventListener('beforeinstallprompt', beforeInstallPromptHandler);

        return () => {
            window.removeEventListener('beforeinstallprompt', beforeInstallPromptHandler);
        };
    }, []);

    const handleInstallClick = () => {
        if (deferredPrompt) {
            setInstallPromptVisible(false);
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult: any) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the install prompt');
                } else {
                    console.log('User dismissed the install prompt');
                }
                setDeferredPrompt(null);
            });
        }
    };

    const listMenu = [
        {
            id: "1",
            title: "tools",
            link: "/tools"
        }
    ]
    return (
        <Stack flex={1} align='center' justify='center' h={"100vh"}>
            {installPromptVisible && (
                <Card withBorder>
                    <div id="installPromotion">
                        <Button id="installButton" onClick={handleInstallClick}>
                            Install App
                        </Button>
                    </div>
                </Card>
            )}
        </Stack>
    );
}
```
