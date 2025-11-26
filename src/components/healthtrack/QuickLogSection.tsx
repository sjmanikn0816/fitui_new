import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { styles } from "./styles/QuickLogsSectionStyles";
import { useLiveHealthMetrics } from "../../hooks/useLiveHealthMetrics";

interface HealthMetricItemProps {
  title: string;
  value: number | null;
  unit: string;
  icon: string;
  bgColor: string;
  freshnessColor: string;
  isLoading: boolean;
}

const HealthMetricItem: React.FC<HealthMetricItemProps> = ({
  title,
  value,
  unit,
  icon,
  bgColor,
  freshnessColor,
  isLoading
}) => (
  <View style={styles.item}>
    <View style={[styles.iconBox, { backgroundColor: bgColor }]}>
      <Text style={styles.emoji}>{icon}</Text>
      <View style={[styles.freshnessIndicator, { backgroundColor: freshnessColor }]} />
    </View>
    <Text style={styles.itemTitle}>{title}</Text>
    <View style={styles.valueContainer}>
      {isLoading ? (
        <ActivityIndicator size="small" color="#666" />
      ) : (
        <>
          <Text style={styles.itemValue}>
            {value !== null ? value.toLocaleString() : '--'}
          </Text>
          <Text style={styles.itemSubtitle}>{unit}</Text>
        </>
      )}
    </View>
  </View>
);

const QuickLogSection: React.FC = () => {
  const { state, actions } = useLiveHealthMetrics();
  const { data, freshness, isLoading, isRefreshing } = state;

  const healthMetrics = [
    {
      id: "steps",
      title: "Steps",
      value: data?.steps || null,
      unit: "steps",
      icon: "👣",
      bgColor: "#BFDBFE"
    },
    {
      id: "calories",
      title: "Calories",
      value: data?.calories || null,
      unit: "kcal",
      icon: "🔥",
      bgColor: "#FECACA"
    },
    {
      id: "heart_rate",
      title: "Heart Rate",
      value: data?.heartRate || null,
      unit: "bpm",
      icon: "❤️",
      bgColor: "#FDE68A"
    },
    {
      id: "active_minutes",
      title: "Active Minutes",
      value: data?.activeMinutes || null,
      unit: "min",
      icon: "⚡",
      bgColor: "#BBF7D0"
    }
  ];

  const handleRefresh = async () => {
    await actions.refreshData();
  };

  const handleSyncToDatabase = async () => {
    await actions.syncToDatabase();
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Live Health Metrics</Text>
          <View style={[styles.statusIndicator, { backgroundColor: freshness.color }]} />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.refreshButton]} 
            onPress={handleRefresh}
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.refreshButtonText}>🔄</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.syncButton]} 
            onPress={handleSyncToDatabase}
          >
            <Text style={styles.syncButtonText}>💾</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.grid}>
        {healthMetrics.map((metric) => (
          <HealthMetricItem
            key={metric.id}
            title={metric.title}
            value={metric.value}
            unit={metric.unit}
            icon={metric.icon}
            bgColor={metric.bgColor}
            freshnessColor={freshness.color}
            isLoading={isLoading}
          />
        ))}
      </View>

      {state.error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>⚠️ {state.error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          Data freshness: {freshness.status} • Last updated: {state.lastUpdated?.toLocaleTimeString() || 'Never'}
        </Text>
      </View>
    </View>
  );
};



export default QuickLogSection;
