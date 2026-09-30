<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->



<!-- END doctoc generated TOC please keep comment here to allow auto update -->

```tsx
<MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          fontFamily: "Geneva",
          fontFamilyMonospace: "Monaco, Courier, monospace",
          headings: { fontFamily: "Impact" },
          colorScheme: `${isDarkMode ? "dark" : "light"}`,
        }}
      >
        <FirebaseProvider>
          <AuthProvider>
            <Component {...pageProps} />
          </AuthProvider>
        </FirebaseProvider>
      </MantineProvider>
```
