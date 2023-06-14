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
