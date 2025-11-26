// HorizontalCardList.tsx
import React from 'react';
import { 
  FlatList, 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  StyleSheet 
} from 'react-native';
import { Star, MapPin } from 'lucide-react-native';

interface Restaurant {
  id: string | number;
  name: string;
  photoUrl?: string;
  rating?: number;
  address?: string;
  distance?: number;
  badge?: string;
  dietType?: string;
  price?: string;
  reviews?: any[];
  phone?: string;
}

interface HorizontalCardListProps {
  data: Restaurant[];
  isSmall?: boolean;
  onPress?: (restaurant: Restaurant) => void;
}

const HorizontalCardList: React.FC<HorizontalCardListProps> = ({ 
  data, 
  isSmall = false,
  onPress 
}) => {
  const cardWidth = isSmall ? 180 : 280;
  const imageHeight = isSmall ? 120 : 160;

  const formatDistance = (distance?: number) => {
    if (!distance) return null;
    if (distance < 1000) {
      return `${distance}m`;
    }
    return `${(distance / 1000).toFixed(1)}km`;
  };

  const renderItem = ({ item }: { item: Restaurant }) => (
    <TouchableOpacity
      style={[styles.card, { width: cardWidth }]}
      activeOpacity={0.7}
      onPress={() => onPress?.(item)}
    >
      <Image
        source={{ uri: item.photoUrl || 'https://via.placeholder.com/280x160' }}
        style={[styles.image, { height: imageHeight }]}
        resizeMode="cover"
      />
      
      {item.badge && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{item.badge}</Text>
        </View>
      )}

      <View style={styles.cardContent}>
        <Text style={styles.restaurantName} numberOfLines={1}>
          {item.name}
        </Text>

        <View style={styles.infoRow}>
          <View style={styles.ratingContainer}>
            <Star size={14} color="#FFB800" fill="#FFB800" />
            <Text style={styles.rating}>
              {item.rating ? item.rating : 'N/A'}
            </Text>
          </View>

          {item.distance && (
            <View style={styles.distanceContainer}>
              <MapPin size={14} color="#7F8C8D" />
              <Text style={styles.distance}>{formatDistance(item.distance)}</Text>
            </View>
          )}
        </View>

        {item.dietType && (
          <View style={styles.tagsContainer}>
            <View style={[
              styles.tag,
              item.dietType === 'Veg' ? styles.vegTag : styles.nonVegTag
            ]}>
              <Text style={[
                styles.tagText,
                item.dietType === 'Veg' ? styles.vegText : styles.nonVegText
              ]}>
                {item.dietType}
              </Text>
            </View>
            {item.price && (
              <Text style={styles.price}>$12</Text>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => String(item.id)}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    backgroundColor: '#F0F0F0',
  },
  badge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '600',
  },
  cardContent: {
    padding: 12,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 6,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  distance: {
    fontSize: 12,
    color: '#7F8C8D',
  },
  tagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  vegTag: {
    backgroundColor: '#E8F5E9',
  },
  nonVegTag: {
    backgroundColor: '#FFEBEE',
  },
  tagText: {
    fontSize: 11,
    fontWeight: '500',
  },
  vegText: {
    color: '#4CAF50',
  },
  nonVegText: {
    color: '#F44336',
  },
  price: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
});

export default HorizontalCardList;