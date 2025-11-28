import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';


interface MenuItem {
  id: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  hasArrow?: boolean;
  onPress?: () => void;
}

interface MenuSectionProps {
  title: string;
  items: MenuItem[];
}

const MenuSection: React.FC<MenuSectionProps> = ({ title, items }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.content}>
        {items.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            onPress={item.onPress}
            style={[
              styles.item,
              index < items.length - 1 && styles.itemBorder
            ]}
            activeOpacity={0.7}
          >
            <View style={styles.itemLeft}>
              <MaterialIcons
                name={item.icon}
                size={20}
                color={Colors.textSecondary}
                style={styles.icon}
              />
              <Text style={styles.itemTitle}>{item.title}</Text>
            </View>
            {item.hasArrow && (
              <MaterialIcons
                name="chevron-right"
                size={20}
                color={Colors.textMuted}
              />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bgCard,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDark,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  content: {
    paddingBottom: 4,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  itemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDark,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    marginRight: 12,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
});

export default MenuSection