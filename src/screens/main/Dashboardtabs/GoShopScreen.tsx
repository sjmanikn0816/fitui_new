import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./styles/GoShopScreenStyles";
import { productCategories, stores } from "@/data/dummyData";
import { Colors } from "@/constants/Colors";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

// ----- Components ----- //
const StoreCard = ({ store }) => (
  <TouchableOpacity style={styles.storeCard}>
    <View style={styles.storeHeader}>
      <View style={styles.storeInfo}>
        <Text style={styles.storeName}>{store.name}</Text>
        <Text style={styles.storeDistance}>{store.distance}</Text>
      </View>
      <View style={styles.storeRating}>
        <Ionicons name="star" size={14} color={Colors.warning} />
        <Text style={styles.ratingText}>{store.rating}</Text>
      </View>
    </View>
    <View style={styles.storeDetails}>
      <View>
        <Text style={styles.storeTotal}>{store.total}</Text>
        <Text style={styles.storeItems}>{store.items} available</Text>
      </View>
      <Text style={styles.deliveryTime}>organic</Text>
    </View>
  </TouchableOpacity>
);

const ProductCard = ({ product }) => (
  <TouchableOpacity style={styles.productCard} activeOpacity={0.8}>
    <View style={styles.productImageContainer}>
      <Image source={{ uri: product.image }} style={styles.productImage} />
    </View>
    <View style={styles.productInfo}>
      <Text style={styles.productName} numberOfLines={2}>
        {product.name}
      </Text>
    </View>
  </TouchableOpacity>
);

const ShoppingSummary = () => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>Shopping Summary</Text>
      <TouchableOpacity>
        <Text style={styles.viewAllText}>View all</Text>
      </TouchableOpacity>
    </View>
    <View style={styles.summaryCard}>
      <View style={styles.summaryRow}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>5/7</Text>
          <Text style={styles.summaryLabel}>Items Checked</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>₹61.91</Text>
          <Text style={styles.summaryLabel}>Total Cost</Text>
        </View>
      </View>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: "71%" }]} />
      </View>
    </View>
  </View>
);

// ----- Main Screen ----- //
export const ShoppingScreen = () => {
  const [activeTab, setActiveTab] = useState(0);
  const allProducts = productCategories.flatMap((cat) => cat.products);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <ShoppingSummary />

        {/* Recommended Stores */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Ionicons
                name="storefront"
                size={20}
                color={Colors.green}
                style={styles.sectionIcon}
              />
              <Text style={styles.sectionTitle}>Recommended Stores</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View all</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.storeScrollContainer}
          >
            {stores.map((store) => (
              <StoreCard key={store.id} store={store} />
            ))}
          </ScrollView>
        </View>

        {/* Products */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Ionicons
                name="grid"
                size={20}
                color={Colors.green}
                style={styles.sectionIcon}
              />
              <Text style={styles.sectionTitle}>Products</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View all</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={allProducts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <ProductCard product={item} />}
            numColumns={2}
            scrollEnabled={false}
            columnWrapperStyle={styles.productRow}
            contentContainerStyle={styles.productsContainer}
          />
        </View>
      </ScrollView>

      {/* 🌫️ Blur + Gradient + Center Message */}
      <BlurView
        intensity={80}
        tint="dark"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width,
          height,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <LinearGradient
          colors={["rgba(10, 10, 12, 0.7)", "rgba(10, 10, 12, 0.9)"]}
          style={StyleSheet.absoluteFillObject}
        />

        <View style={localStyles.centerBox}>
          <Text style={localStyles.comingSoonText}>Coming Soon</Text>
          <Text style={localStyles.subText}>
            We're working on something exciting.{"\n"}Stay tuned for updates.
          </Text>
        </View>
      </BlurView>
    </View>
  );
};

const localStyles = StyleSheet.create({
  centerBox: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.bgCard,
    paddingVertical: 32,
    paddingHorizontal: 48,
    bottom: 150,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    shadowColor: Colors.emerald,
    shadowOpacity: 0.3,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  comingSoonText: {
    fontSize: 32,
    fontWeight: "700",
    color: Colors.emerald,
    textAlign: "center",
  },
  subText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
    marginTop: 12,
  },
});

export default ShoppingScreen;
