import { usePermissions } from "expo-permissions";

/*
A hook that returns an array containing three items:
    - [0] (`permission`): An object with information about the Notifications permissions, including status, expiration, and scope (if applicable)
    - [1] (`askPermission`): A callback to ask the user for Notifications permission.
    - [2] (`getPermission`): A callback to get the Notifications permission status without interacting with the user.

As the only parameter, it receives an `options` object, in the form of:
    - `get`: Retrieves the Notifications permission status without interacting with the user, `true` by default.
    - `ask`: Prompts the user with the Notifications permission directly. Without using the `askPermission` callback, `false` by default.
*/
const useNotificationsPermissions = (options) => {
  return usePermissions("notifications", options);
};

export default useNotificationsPermissions;
