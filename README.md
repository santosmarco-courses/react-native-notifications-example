# What to do with this EXAMPLE

Transform this into a bit.dev component that renders a `<NotificationsProvider>`.

Right after rendering, this component (w/ `useEffect`) gets and stores:

- Expo's `pushToken` (`getExpoPushTokenAsync()`)

- Device's `pushToken` (`getDevicePushTokenAsync()`)

- The permissions

- Asks if `permission.status !== "granted"`

- Implements a notification handler that always shows the notification when it is received:

```js
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});
```

- And much more to make Notifications **EASIER** (TO-DO)
