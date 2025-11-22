import React, { useEffect, useState } from "react";
import { ScrollView, View, Text } from "react-native";
import * as Location from "expo-location";
import { useAppSelector, useAppDispatch } from "@/redux/store/hooks";

import { restaurants as dummyRestaurants } from "@/data/dummyData";
import { styles } from "./styles/DineInScreenStyles";
import HorizontalCardList from "@/components/HorizontalCardList";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { fetchNearbyRestaurants } from "@/redux/slice/restaurantSlice";
import { useNavigation } from "@react-navigation/native";
import { DineInScreenProps } from "@/types";

const DineInScreen: React.FC<DineInScreenProps> = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<any>();

  const {
    list: restaurants,
    loading,
    error,
  } = useAppSelector((state) => state.restaurants);

  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocationAndRestaurants = async () => {
      try {
        console.log("📍 Requesting location permissions...");
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          setLocationError("Location permission denied ❌");
          console.warn("Permission not granted for location");
          return;
        }

        console.log("✅ Location permission granted");
        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;

        console.log("🌍 Current Location:", latitude, longitude);

        dispatch(fetchNearbyRestaurants({ latitude, longitude }));
      } catch (err: any) {
        console.error("❌ Error getting location:", err);
        setLocationError("Unable to fetch location. Please enable GPS.");
      }
    };

    fetchLocationAndRestaurants();
  }, [dispatch]);

  console.log("🍽️ Restaurants fetched:", restaurants);

  const handleRestaurantPress = (restaurant: any) => {
    if (!restaurant.placeId) {
      console.warn("⚠️ Missing placeId for restaurant:", restaurant.name);
      return;
    }
    navigation.navigate("RestaurantDetail", { restaurant });
  };

  const enrichedData = restaurants.map((item) => ({
    id: item.id,
    name: item.name,
    placeId: item.placeId, 
    photoUrl: item.photoUrl,
    badge: item.badge,
    dietType: item.dietType,
    price: item.price,
    rating: item.rating,
    distance: item.distance,
    address: item.address,
    reviews: item.reviews,
    phone: item.phone,
    hours: item.hours,
    website: item.website,
    openNow: item.openNow,
    googleMapsUri: item.googleMapsUri,
    userRatingCount: item.userRatingCount,
  }));

  const renderContent = () => {
    if (loading)
      return <LoadingSpinner message="Fetching restaurants nearby..." />;

    if (locationError) {
      return (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{locationError}</Text>
          <Text style={styles.emptyText}>Please enable location access.</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centered}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
          <Text style={styles.emptyText}>
            Please check your internet connection
          </Text>
        </View>
      );
    }

    if (enrichedData.length === 0) {
      return (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>No nearby restaurants found 🍽️</Text>
          <Text style={styles.emptyText}>
            Try adjusting your location or search filters
          </Text>
        </View>
      );
    }

    return (
      <>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Recommended Restaurants Nearby
          </Text>
          <HorizontalCardList
            data={enrichedData}
            onPress={handleRestaurantPress}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Saved Favorites</Text>
          <HorizontalCardList
            data={dummyRestaurants}
            isSmall
            onPress={handleRestaurantPress}
          />
        </View>
      </>
    );
  };

  return (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      {renderContent()}
      <View style={{ height: 20 }} />
    </ScrollView>
  );
};

export default DineInScreen;
