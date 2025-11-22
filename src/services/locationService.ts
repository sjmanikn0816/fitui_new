// services/locationService.ts
import { Alert } from "react-native";
import * as Location from "expo-location";

import { AppDispatch } from "@/redux/store";
import { fetchNearbyRestaurants } from "@/redux/slice/restaurantSlice";

export const requestLocation = async (dispatch: AppDispatch) => {
  const { status } = await Location.requestForegroundPermissionsAsync();

  if (status !== "granted") {
    Alert.alert(
      "Permission denied",
      "We need location permission to give personalized recommendations"
    );
    return null;
  }

  const location = await Location.getCurrentPositionAsync({});
  console.log("Latitude:", location.coords.latitude);
  console.log("Longitude:", location.coords.longitude);


  dispatch(
    fetchNearbyRestaurants({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    })
  );

  return location;
};
