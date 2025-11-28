// RestaurantDetailScreen.tsx
import React, { useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  Linking,
  Platform,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import {
  MapPin,
  Star,
  Phone,
  Clock,
  Navigation,
  Globe,
} from "lucide-react-native";
import { Colors } from "@/constants/Colors";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import {
  fetchRestaurantDetails,
  clearRestaurantDetail,
} from "@/redux/slice/restaurantDetailSlice";

interface Review {
  authorName: string;
  authorPhoto?: string;
  rating: number;
  text?: string;
  relativeTime?: string;
}

interface Restaurant {
  id?: string | number;
  placeId?: string; // ✅ Add placeId
  name: string;
  address: string;
  rating?: number;
  photoUrl?: string;
  phone?: string;
  hours?: string;
  reviews?: Review[];
  openNow?: boolean;
  website?: string;
  googleMapsUri?: string;
  userRatingCount?: number;
  dietType?: string;
  price?: string;
}

const RestaurantDetailScreen = ({ route }: any) => {
  const { restaurant } = route.params as { restaurant: Restaurant };
  const dispatch = useAppDispatch();
  const { data, loading, error } = useAppSelector(
    (state) => state.restaurantDetail
  );
  useEffect(() => {
    if (restaurant?.placeId) {
      dispatch(fetchRestaurantDetails(restaurant.placeId));
    }
    return () => {
      dispatch(clearRestaurantDetail());
    };
  }, [dispatch, restaurant?.placeId]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: Colors.bgPrimary }}>
        <ActivityIndicator size="large" color={Colors.emerald} />
        <Text style={{ color: Colors.textSecondary, marginTop: 12 }}>Fetching restaurant details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: Colors.bgPrimary }}>
        <Text style={{ color: Colors.red }}>⚠️ {error}</Text>
      </View>
    );
  }

  const mergedRestaurant = {
    ...restaurant,
    phone: data?.nationalPhoneNumber || restaurant.phone,
    website: data?.websiteUri || restaurant.website,
    address:
      data?.postalAddress?.addressLines?.join(", ") || restaurant.address,
    openNow: data?.openNow ?? restaurant.openNow,
    rating: data?.rating || restaurant.rating,
    userRatingCount: data?.userRatingCount || restaurant.userRatingCount,
    reviews: data?.reviews || restaurant.reviews,
    googleMapsUri: data?.googleMapsUri || restaurant.googleMapsUri,
  };

  const openInMaps = () => {
    if (mergedRestaurant.googleMapsUri) {
      Linking.openURL(mergedRestaurant.googleMapsUri).catch((err) =>
        console.error("Error opening Google Maps:", err)
      );
    } else {
      const address = encodeURIComponent(mergedRestaurant.address);
      const label = encodeURIComponent(mergedRestaurant.name);
      const url = Platform.select({
        ios: `maps:0,0?q=${label}&address=${address}`,
        android: `geo:0,0?q=${address}`,
        default: `https://www.google.com/maps/search/?api=1&query=${address}`,
      });
      Linking.openURL(url).catch((err) =>
        console.error("Error opening maps:", err)
      );
    }
  };

  const getDirections = () => {
    const address = encodeURIComponent(mergedRestaurant.address);
    const url = Platform.select({
      ios: `maps://?daddr=${address}`,
      android: `google.navigation:q=${address}`,
      default: `https://www.google.com/maps/dir/?api=1&destination=${address}`,
    });
    Linking.openURL(url).catch((err) =>
      console.error("Error opening directions:", err)
    );
  };

  const callRestaurant = () => {
    if (mergedRestaurant.phone) {
      const phoneNumber = mergedRestaurant.phone.replace(/\s+/g, "");
      Linking.openURL(`tel:${phoneNumber}`);
    }
  };

  const openWebsite = () => {
    if (mergedRestaurant.website) {
      Linking.openURL(mergedRestaurant.website).catch((err) =>
        console.error("Error opening website:", err)
      );
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {mergedRestaurant.photoUrl && (
        <Image
          source={{ uri: mergedRestaurant.photoUrl }}
          style={styles.heroImage}
          resizeMode="cover"
        />
      )}

      <View style={styles.content}>
        <Text style={styles.name}>{mergedRestaurant.name}</Text>

        {/* Tags */}
        <View style={styles.tagsRow}>
          {mergedRestaurant.dietType && (
            <View
              style={[
                styles.tag,
                mergedRestaurant.dietType === "Veg"
                  ? styles.vegTag
                  : styles.nonVegTag,
              ]}
            >
              <Text style={styles.tagText}>{mergedRestaurant.dietType}</Text>
            </View>
          )}
          {/* {mergedRestaurant.price && (
            <View style={styles.tag}>
              <Text style={styles.tagText}>{mergedRestaurant.price}</Text>
            </View>
          )} */}
          {mergedRestaurant.openNow !== undefined && (
            <View
              style={[
                styles.tag,
                mergedRestaurant.openNow ? styles.openTag : styles.closedTag,
              ]}
            >
              <Text style={styles.tagText}>
                {mergedRestaurant.openNow ? "Open Now" : "Closed"}
              </Text>
            </View>
          )}
        </View>

        {/* Rating */}
        <View style={styles.ratingContainer}>
          <Star size={20} color="#FFB800" fill="#FFB800" />
          <Text style={styles.rating}>
            {mergedRestaurant.rating?.toFixed(1) || "N/A"}
          </Text>
          <Text style={styles.reviewCount}>
            (
            {mergedRestaurant.userRatingCount ||
              mergedRestaurant.reviews?.length ||
              0}{" "}
            reviews)
          </Text>
        </View>

        {/* Location */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MapPin size={24} color={Colors.emerald} />
            <Text style={styles.sectionTitle}>Location</Text>
          </View>
          <Text style={styles.address}>{mergedRestaurant.address}</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={getDirections}
              activeOpacity={0.7}
            >
              <Navigation size={20} color="#FFF" />
              <Text style={styles.primaryButtonText}>Directions</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={openInMaps}
              activeOpacity={0.7}
            >
              <MapPin size={20} color={Colors.emerald} />
              <Text style={styles.secondaryButtonText}>View Map</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Contact */}
        {mergedRestaurant.phone && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Phone size={24} color={Colors.emerald} />
              <Text style={styles.sectionTitle}>Contact</Text>
            </View>
            <TouchableOpacity onPress={callRestaurant} activeOpacity={0.7}>
              <Text style={styles.phoneNumber}>{mergedRestaurant.phone}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Website */}
        {mergedRestaurant.website && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Globe size={24} color={Colors.emerald} />
              <Text style={styles.sectionTitle}>Website</Text>
            </View>
            <TouchableOpacity onPress={openWebsite} activeOpacity={0.7}>
              <Text style={styles.websiteLink} numberOfLines={1}>
                {mergedRestaurant.website}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Hours */}
        {mergedRestaurant.hours && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Clock size={24} color={Colors.emerald} />
              <Text style={styles.sectionTitle}>Hours</Text>
            </View>
            <Text style={styles.hours}>{mergedRestaurant.hours}</Text>
          </View>
        )}

        {/* Reviews */}
        {mergedRestaurant.reviews && mergedRestaurant.reviews.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { marginBottom: 15 }]}>
              Recent Reviews
            </Text>
            {mergedRestaurant.reviews.map((review, index) => (
              <View key={index} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <View style={styles.reviewAuthorContainer}>
                    {review.authorPhoto && (
                      <Image
                        source={{ uri: review.authorPhoto }}
                        style={styles.authorPhoto}
                      />
                    )}
                    <View>
                      <Text style={styles.reviewAuthor}>
                        {review.authorName}
                      </Text>
                      {review.relativeTime && (
                        <Text style={styles.reviewTime}>
                          {review.relativeTime}
                        </Text>
                      )}
                    </View>
                  </View>
                  <View style={styles.reviewRating}>
                    <Star size={16} color="#FFB800" fill="#FFB800" />
                    <Text style={styles.reviewRatingText}>
                      {review.rating > 0 ? review.rating : 5}
                    </Text>
                  </View>
                </View>
                {review.text && (
                  <Text style={styles.reviewText}>{review.text}</Text>
                )}
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgPrimary },
  heroImage: { width: "100%", height: 250 },
  content: { padding: 20 },
  name: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  tagsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 15 },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: Colors.bgCardHover,
  },
  vegTag: { backgroundColor: "rgba(52, 211, 153, 0.15)" },
  nonVegTag: { backgroundColor: "rgba(248, 113, 113, 0.15)" },
  openTag: { backgroundColor: "rgba(52, 211, 153, 0.15)" },
  closedTag: { backgroundColor: "rgba(248, 113, 113, 0.15)" },
  tagText: { fontSize: 12, fontWeight: "600", color: Colors.textPrimary },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  rating: { fontSize: 18, fontWeight: "600", marginLeft: 5, color: Colors.textPrimary },
  reviewCount: { fontSize: 14, color: Colors.textMuted, marginLeft: 5 },
  section: {
    marginBottom: 25,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDark,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginLeft: 10,
  },
  address: { fontSize: 16, color: Colors.textSecondary, lineHeight: 24, marginBottom: 15 },
  actionButtons: { flexDirection: "row", gap: 10 },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 12,
    gap: 8,
  },
  primaryButton: { backgroundColor: Colors.emerald },
  secondaryButton: {
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.emerald,
  },
  primaryButtonText: { color: Colors.bgPrimary, fontSize: 16, fontWeight: "600" },
  secondaryButtonText: { color: Colors.emerald, fontSize: 16, fontWeight: "600" },
  phoneNumber: { fontSize: 18, color: Colors.emerald, fontWeight: "600" },
  websiteLink: {
    fontSize: 16,
    color: Colors.emerald,
    textDecorationLine: "underline",
  },
  hours: { fontSize: 16, color: Colors.textSecondary, lineHeight: 24 },
  reviewCard: {
    backgroundColor: Colors.bgCard,
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.borderDark,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  reviewAuthorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  authorPhoto: { width: 40, height: 40, borderRadius: 20 },
  reviewAuthor: { fontSize: 16, fontWeight: "600", color: Colors.textPrimary },
  reviewTime: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  reviewRating: { flexDirection: "row", alignItems: "center", gap: 4 },
  reviewRatingText: { fontSize: 14, fontWeight: "600", color: Colors.textPrimary },
  reviewText: { fontSize: 14, color: Colors.textSecondary, lineHeight: 20 },
});

export default RestaurantDetailScreen;
