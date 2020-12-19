import React, { useState, useEffect } from "react";
import { View, SafeAreaView, ScrollView, Text, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { TableView, SwitchRow, InfoRow, Button } from "react-native-ios-kit";
import * as Notifications from "expo-notifications";
import { usePermissions } from "expo-permissions";
import tw from "tailwind-rn";

import useNotificationsBadgeCount from "./hooks/useNotificationsBadgeCount";

export default function App() {
  const [notificationsPermission] = usePermissions("notifications", {
    ask: true,
  });
  const [btnsAreEnabled, setBtnsAreEnabled] = useState(true);
  const [pushToken, setPushToken] = useState();

  const [badgeCount, setBadgeCount] = useNotificationsBadgeCount();

  const triggerNotification = (
    id,
    { title = "", body = "", data, triggerInterval = 5 }
  ) => {
    console.log(`TRIGGERED: "${id}"`);
    Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
      },
      trigger: { seconds: triggerInterval },
    });
    setTimeout(() => {
      console.log(`SENT: "${id}"`);
    }, triggerInterval * 1000);
  };

  const triggerPushNotification = (
    id,
    { title = "", body = "", data, triggerInterval = 5, to }
  ) => {
    console.log(`TRIGGERED PUSH: "${id}"`);
    fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-Encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: to ? to : pushToken,
        data: { extraData: data },
        title,
        body,
      }),
    });
  };

  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
      }),
      handleSuccess: () => {
        setBadgeCount((currBadgeCount) => currBadgeCount + 1);
      },
    });

    const backgroundSubscription = Notifications.addNotificationResponseReceivedListener(
      (res) => {
        console.log(res);
      }
    );

    const foregroundSubscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log(notification);
      }
    );

    return () => {
      backgroundSubscription.remove();
      foregroundSubscription.remove();
    };
  }, []);

  useEffect(() => {
    if (notificationsPermission?.status === "granted") {
      Notifications.getExpoPushTokenAsync().then((res) => {
        const token = res.data;
        console.log(Platform.OS, token);
        setPushToken(token);
      });
    }
  }, [notificationsPermission]);

  // useEffect(() => {
  //   console.log(badgeCount);
  // }, [badgeCount]);

  return (
    <>
      <StatusBar style="auto" />
      <SafeAreaView style={tw("flex-1 justify-between py-6")}>
        <ScrollView style={tw("flex-grow")}>
          <TableView header="Settings">
            <SwitchRow
              title="Enable buttons"
              value={btnsAreEnabled}
              onValueChange={setBtnsAreEnabled}
            />
            <InfoRow
              title="Notifications Permission"
              info={
                notificationsPermission
                  ? notificationsPermission.status.slice(0, 1).toUpperCase() +
                    notificationsPermission.status.slice(1)
                  : "Asking..."
              }
            />
          </TableView>
        </ScrollView>
        <View style={{ paddingHorizontal: 15 }}>
          <Button
            onPress={() =>
              triggerNotification("test", {
                title: "Test Notification",
                body: "Test Notification's body",
              })
            }
            style={tw("mb-2")}
            rounded
            inverted
            disabled={!btnsAreEnabled}
          >
            <Text style={tw("text-base text-white text-center")}>
              Trigger Test Notification
            </Text>
          </Button>
          <Button
            onPress={() =>
              triggerNotification("data", {
                title: "Notification w/ Data",
                body: "Just the body...",
                data: {
                  myName: "Marco Santos",
                },
              })
            }
            style={tw("mb-2")}
            rounded
            inverted
            disabled={!btnsAreEnabled}
          >
            <Text style={tw("text-base text-white text-center")}>
              Trigger Notification w/ Data
            </Text>
          </Button>
          <Button
            onPress={() =>
              triggerPushNotification("push", {
                title: "A Push Notification",
                body: "The Push Notification's body",
                data: {
                  myNamePush: "Marco Santos",
                },
              })
            }
            style={tw("mb-2")}
            rounded
            inverted
            disabled={!btnsAreEnabled}
          >
            <Text style={tw("text-base text-white text-center")}>
              Trigger Push Notification
            </Text>
          </Button>
          {Platform.OS === "ios" ? (
            <Button
              onPress={() =>
                triggerPushNotification("pushIOS", {
                  title: "Hello from iOS",
                  body: "Heeeyyyooowwwww!!!",
                  data: {
                    os: "ios",
                  },
                  to: "ExponentPushToken[XeuR1QKVO1_epcMF7tpG3z]",
                })
              }
              rounded
              inverted
              disabled={!btnsAreEnabled}
            >
              <Text style={tw("text-base text-white text-center")}>
                Trigger Push Notification to Android
              </Text>
            </Button>
          ) : (
            <Button
              onPress={() =>
                triggerPushNotification("pushAndroid", {
                  title: "Hello from Android",
                  body: "Heeeyyy!!!",
                  data: {
                    os: "android",
                  },
                  to: "ExponentPushToken[5OmtuEOTwGSBOLRrhZo1Ln]",
                })
              }
              rounded
              inverted
              disabled={!btnsAreEnabled}
            >
              <Text style={tw("text-base text-white text-center")}>
                Trigger Push Notification to iOS
              </Text>
            </Button>
          )}
        </View>
      </SafeAreaView>
    </>
  );
}
