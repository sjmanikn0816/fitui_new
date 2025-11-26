import { PermissionsAndroid, Platform } from "react-native";

async function requestPermissions() {
  if (Platform.OS === "android") {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    ]);
    return (
      granted["android.permission.CAMERA"] === "granted" &&
      granted["android.permission.READ_EXTERNAL_STORAGE"] === "granted"
    );
  }
  return true;
}
export default requestPermissions;