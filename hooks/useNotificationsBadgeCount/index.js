import { useState, useEffect } from "react";
import * as Notifications from "expo-notifications";

/*
A hook that returns an array containing the current BADGE COUNT (@ idx 0) and a SETTER FUNCTION (idx 1).
It inits with BADGE COUNT === "undefined", but right after it gets updated w/ the actual value.
The SETTER FUNCTION is just a normal useState Setter Function. Using it will set the app's badge count async and also update BADGE COUNT.
*/
const useNotificationsBadgeCount = () => {
  const [badgeCount, setBadgeCount] = useState();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!ready) return setReady(true);

    Notifications.setBadgeCountAsync(badgeCount);
  }, [badgeCount]);

  useEffect(() => {
    Notifications.getBadgeCountAsync().then((newBadgeCount) => {
      setBadgeCount(newBadgeCount);
    });
  }, []);

  return [badgeCount, setBadgeCount];
};

export default useNotificationsBadgeCount;
