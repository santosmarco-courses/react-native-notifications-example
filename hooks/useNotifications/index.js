import React, { useState, useEffect } from "react";
import * as Notifications from "expo-notifications";

import useNotificationsPermissions from "../useNotificationsPermissions";
import useNotificationsBadgeCount from "../useNotificationsBadgeCount";

const useNotifications = ({ permissions }) => {
  const [
    permission,
    askPermission,
    getPermission,
  ] = useNotificationsPermissions({ permissions });
  const [badgeCount, setBadgeCount] = useNotificationsBadgeCount();

  const [state, setState] = useState({
    permissions: {
      value: permission,
      ask: askPermission,
      get: getPermission,
    },
    badgeCount: {
      value: badgeCount,
      set: setBadgeCount,
    },
  });

  useEffect(() => {
    setState({
      ...state,
      permissions: {
        ...state.permissions,
        value: permission,
      },
    });
  }, [permission]);

  useEffect(() => {
    setState({
      ...state,
      badgeCount: {
        ...state.badgeCount,
        value: badgeCount,
      },
    });
  }, [badgeCount]);

  return state;
};

export default useNotifications;
