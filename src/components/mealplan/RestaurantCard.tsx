import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { styles } from "@/screens/main/Dashboardtabs/styles/DineInScreenStyles";

type Restaurant = {
  id: string | number;
  photoUrl?: string;
  name: string;
  badge?: string;
  price?: string;
  rating?: number;
  dietType?: string;
  distance?: number;
};

type RestaurantCardProps = {
  restaurant: Restaurant;
  isSmall?: boolean;
};

const RestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant,
  isSmall = false,
}) => {
  // ✅ fallback + console log
  const imageUri =
    restaurant.photoUrl ||
    "https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=800&q=60";

  console.log("🖼️ Restaurant Photo URL:", imageUri);

  return (
    <TouchableOpacity
      style={[
        isSmall ? styles.smallRestaurantCard : styles.smallRestaurantCard,
        { marginRight: 15 },
      ]}
    >
    <Image
  source={{ uri: restaurant.photoUrl }}
  style={isSmall ? styles.smallRestaurantImage : styles.smallRestaurantImage}
/>

      <View
        style={
          isSmall ? styles.smallRestaurantContent : styles.smallRestaurantContent
        }
      >
        <Text
          style={isSmall ? styles.smallRestaurantName : styles.smallRestaurantName}
        >
          {restaurant.name} {restaurant.distance ? `- ${restaurant.distance}m` : ""}
        </Text>

        {restaurant.badge && (
          <View style={isSmall ? styles.smallBadge : styles.badge}>
            <Text style={isSmall ? styles.smallBadgeText : styles.badgeText}>
              {restaurant.badge}
            </Text>
          </View>
        )}

        <View style={styles.restaurantInfo}>
          {restaurant.price && (
            <Text style={isSmall ? styles.smallRestaurantInfo : styles.infoText}>
              {restaurant.price}
            </Text>
          )}

          {typeof restaurant.rating === "number" && !isNaN(restaurant.rating) && (
            <Text style={isSmall ? styles.smallRestaurantInfo : styles.infoText}>
              ⭐ {restaurant.rating.toFixed(1)}
            </Text>
          )}
        </View>

        {restaurant.dietType && (
          <View style={styles.dietBadge}>
            <Text style={styles.dietBadgeText}>{restaurant.dietType}</Text>
          </View>
        )}

        <View style={styles.aiCardInside}>
          <Text style={styles.aiTitleInside}>AI Recommends</Text>
          <View style={styles.aiColumn}>
            <Text style={styles.aiLine}>
              <Text style={styles.aiLabel}>IN: </Text>Chicken Salad
            </Text>
            <Text style={styles.aiLine}>
              <Text style={styles.aiLabel}>OUT: </Text>2 Mile Walk
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default RestaurantCard;
