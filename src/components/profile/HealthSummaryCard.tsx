import React, { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { MaterialIcons } from "@expo/vector-icons";

// More specific type definitions
type HealthData = Record<string, boolean | string | number | null | undefined>;

interface HealthSection {
  title: string;
  data: string[];
  icon: keyof typeof MaterialIcons.glyphMap;
}

interface HealthSummaryCardProps {
  healthCondition?: HealthData;
  immuneDisorder?: HealthData;
  neurologicalHealth?: HealthData;
  cancer?: HealthData;
  showEmptyMessage?: boolean;
  maxItemsPerSection?: number;
}

const HealthSummaryCard: React.FC<HealthSummaryCardProps> = ({
  healthCondition = {},
  immuneDisorder = {},
  neurologicalHealth = {},
  cancer = {},
  showEmptyMessage = true,
  maxItemsPerSection,
}) => {
  // Helper function: return only keys where value === true
  const getTrueFields = (data: HealthData): string[] =>
    Object.entries(data)
      .filter(([_, value]) => value === true)
      .map(([key]) => formatLabel(key));

  // Helper to format key names → readable
  const formatLabel = (key: string): string =>
    key
      .replace(/([A-Z])/g, " $1")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase())
      .trim();

  // Memoize sections to avoid recalculation on every render
  const sections: HealthSection[] = useMemo(() => {
    const allSections = [
      {
        title: "General Health Conditions",
        data: getTrueFields(healthCondition),
        icon: "local-hospital" as keyof typeof MaterialIcons.glyphMap,
      },
      {
        title: "Immune Disorders",
        data: getTrueFields(immuneDisorder),
        icon: "shield" as keyof typeof MaterialIcons.glyphMap,
      },
      {
        title: "Neurological Health",
        data: getTrueFields(neurologicalHealth),
        icon: "psychology" as keyof typeof MaterialIcons.glyphMap,
      },
      {
        title: "Cancer",
        data: getTrueFields(cancer),
        icon: "coronavirus" as keyof typeof MaterialIcons.glyphMap,
      },
    ];

    // Apply max items limit if specified
    if (maxItemsPerSection) {
      return allSections.map((section) => ({
        ...section,
        data: section.data.slice(0, maxItemsPerSection),
      }));
    }

    return allSections;
  }, [healthCondition, immuneDisorder, neurologicalHealth, cancer, maxItemsPerSection]);

  // Check if user has any true conditions at all
  const hasConditions = useMemo(
    () => sections.some((s) => s.data.length > 0),
    [sections]
  );

  // Calculate total conditions count
  const totalConditions = useMemo(
    () => sections.reduce((acc, s) => acc + s.data.length, 0),
    [sections]
  );

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Health Summary</Text>
        {hasConditions && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{totalConditions}</Text>
          </View>
        )}
      </View>

      {hasConditions ? (
        sections.map(
          (section) =>
            section.data.length > 0 && (
              <View key={section.title} style={styles.section}>
                <View style={styles.sectionHeader}>
                  <MaterialIcons
                    name={section.icon}
                    size={16}
                    color={Colors.emerald}
                  />
                  <Text style={styles.sectionTitle}>{section.title}</Text>
                </View>
                {section.data.map((item) => (
                  <View style={styles.item} key={item}>
                    <MaterialIcons
                      name="check-circle"
                      size={18}
                      color={Colors.emerald}
                    />
                    <Text style={styles.label}>{item}</Text>
                  </View>
                ))}
              </View>
            )
        )
      ) : (
        showEmptyMessage && (
          <View style={styles.noCondition}>
            <MaterialIcons
              name="health-and-safety"
              size={24}
              color={Colors.textSecondary}
            />
            <Text style={styles.noConditionText}>
              No active health conditions reported
            </Text>
          </View>
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.bgCard,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  badge: {
    backgroundColor: Colors.emerald,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  badgeText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: "700",
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginLeft: 6,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    paddingLeft: 4,
  },
  label: {
    marginLeft: 8,
    fontSize: 14,
    color: Colors.textSecondary,
    flex: 1,
  },
  noCondition: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    paddingVertical: 20,
  },
  noConditionText: {
    fontSize: 14,
    color: Colors.textMuted,
    marginLeft: 8,
  },
});

export default HealthSummaryCard;