import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { styles } from "./styles/BalananceScoreCardStyles";

interface BalanceScoreCardProps {
  score: number;
}

const BalanceScoreCard: React.FC<BalanceScoreCardProps> = ({ score }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Health Balance Score</Text>
      <View style={styles.row}>
        <View style={styles.left}>
          <Text style={styles.scoreNumber}>{score}</Text>
          <Text style={styles.scoreLabel}>/100</Text>
        </View>
        <View style={styles.right}>
          <Text style={styles.status}>Good Progress!</Text>
          <Text style={styles.description}>
            Your health metrics are trending in the right direction.
          </Text>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBar, { width: `${score}%` }]} />
          </View>
        </View>
      </View>
    </View>
  );
};



export default BalanceScoreCard;
