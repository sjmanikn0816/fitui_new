import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { styles } from "./styles/TodayMetricSectionStyles";
import { useLiveHealthMetrics } from "../../hooks/useLiveHealthMetrics";

interface MetricCardProps {
  title: string;
  value: number | null;
  unit: string;
  icon: string;
  bgColor: string;
  freshnessColor: string;
  isLoading: boolean;
  progress?: number; // Optional progress for goals (0-100)
  goal?: number; // Optional goal value
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  icon,
  bgColor,
  freshnessColor,
  isLoading,
  progress,
  goal
}) => (
  <View style={styles.metricCard}>
    <View style={styles.metricHeader}>
      <View style={[styles.metricIconBox, { backgroundColor: bgColor }]}>
        <Text style={styles.metricIcon}>{icon}</Text>
        <View style={[styles.metricFreshnessIndicator, { backgroundColor: freshnessColor }]} />
      </View>
      <Text style={styles.metricTitle}>{title}</Text>
    </View>
    
    <View style={styles.metricContent}>
      {isLoading ? (
        <ActivityIndicator size="small" color="#666" />
      ) : (
        <>
          <Text style={styles.metricValue}>
            {value !== null ? value.toLocaleString() : '--'}
          </Text>
          <Text style={styles.metricUnit}>{unit}</Text>
        </>
      )}
    </View>

    {goal && value !== null && (
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${Math.min((value / goal) * 100, 100)}%` }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>
          {Math.round((value / goal) * 100)}% of {goal.toLocaleString()}
        </Text>
      </View>
    )}
  </View>
);

const TodaysMetricsSection: React.FC = () => {
  const { state, actions } = useLiveHealthMetrics();
  const { data, freshness, isLoading, isRefreshing, error } = state;

  const healthMetrics = [
    {
      id: "steps",
      title: "Steps",
      value: data?.steps || null,
      unit: "steps",
      icon: "👣",
      bgColor: "#BFDBFE",
      goal: 10000
    },
    {
      id: "calories",
      title: "Calories",
      value: data?.calories || null,
      unit: "kcal",
      icon: "🔥",
      bgColor: "#FECACA",
      goal: 500
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
      bgColor: "#BBF7D0",
      goal: 60
    }
  ];

  const handleRefresh = async () => {
    await actions.refreshData();
  };

  const handleViewAll = () => {
    // Navigate to detailed health metrics screen
    console.log('Navigate to detailed health metrics');
  };

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Today's Metrics</Text>
          <TouchableOpacity onPress={handleRefresh}>
            <Text style={styles.viewAll}>Retry</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.errorCard}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorTitle}>Unable to load health data</Text>
          <Text style={styles.errorDesc}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Today's Metrics</Text>
          <View style={[styles.statusIndicator, { backgroundColor: freshness.color }]} />
        </View>
        <TouchableOpacity onPress={handleViewAll}>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.metricsGrid}>
        {healthMetrics.map((metric) => (
          <MetricCard
            key={metric.id}
            title={metric.title}
            value={metric.value}
            unit={metric.unit}
            icon={metric.icon}
            bgColor={metric.bgColor}
            freshnessColor={freshness.color}
            isLoading={isLoading}
            goal={metric.goal}
          />
        ))}
      </View>

      <View style={styles.summaryContainer}>
        <Text style={styles.summaryText}>
          Last updated: {state.lastUpdated?.toLocaleTimeString() || 'Never'} • 
          Data quality: {freshness.status}
        </Text>
        {isRefreshing && (
          <View style={styles.refreshingContainer}>
            <ActivityIndicator size="small" color="#10B981" />
            <Text style={styles.refreshingText}>Updating...</Text>
          </View>
        )}
      </View>
    </View>
  );
};



export default TodaysMetricsSection;
