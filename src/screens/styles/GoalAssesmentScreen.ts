import { Colors } from "@/constants/Colors";
import { verticalScale } from "@/utils/responsive";
import { Platform, StyleSheet } from "react-native";


export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 18,
    color: '#1e293b',
    fontWeight: '600',
  },
  loadingSubtext: {
    marginTop: 8,
    fontSize: 14,
    color: '#64748b',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 24,
  },
  errorText: {
    fontSize: 20,
    color: '#ef4444',
    fontWeight: '700',
    marginTop: 16,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 8,
    marginBottom: 24,
    textAlign: 'center',
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3b82f6',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },

  scrollContent: { paddingBottom: 200 },
  headerGradient: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  header: {
    padding: 24,
    paddingTop: 40,
    paddingBottom: 32,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 12,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#e0e7ff',
  },
  riskCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,

    borderRadius: 16,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  riskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  riskTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },
  riskContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  riskItem: {
    flex: 1,
  },
  riskLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 6,
  },
  riskValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  riskDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#e2e8f0',
    marginHorizontal: 16,
  },
  riskBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  riskBadgeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  statsSection: {
    marginTop: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginHorizontal: 20,
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginHorizontal: 20,
    marginBottom: 12,
  },
  statsScrollContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  statCard: {
    width: 140,
    height: 160,
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  statImageBg: {
    width: '100%',
    height: '100%',
  },
  statImageStyle: {
    borderRadius: 16,
  },
  statOverlay: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#475569',
    marginTop: 8,
    fontWeight: '500',
  },
  statLabelWithBg: {
    fontSize: 13,
    color: 'rgba(255,255,255,1)',
    fontWeight: '700',
    marginTop: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    marginTop: 4,
  },
  statValueWithBg: {
    fontSize: 28,
    fontWeight: '900',
    color: '#fff',
    marginTop: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
    letterSpacing: 0.5,
  },
  statUnit: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  statUnitWithBg: {
    fontSize: 12,
    color: 'rgba(255,255,255,1)',
    fontWeight: '600',
    marginTop: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  // New styles for small vertical grid layout with light backgrounds
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
    justifyContent: 'space-between',
  },
  statCardSmall: {
    width: '48%',
    height: 110,
    borderRadius: 14,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  statImageBgSmall: {
    width: '100%',
    height: '100%',
  },
  statImageStyleSmall: {
    borderRadius: 14,
  },
  statOverlaySmall: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statLabelLight: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '700',
    marginTop: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statValueLight: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1e293b',
    marginTop: 4,
    letterSpacing: 0.3,
  },
  statUnitLight: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '600',
    marginTop: 2,
  },
  timelinesContainer: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  timelineCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  timelineCardSelected: {
    borderColor: '#3b82f6',
    backgroundColor: '#eff6ff',
  },
  recommendedBadge: {
    position: 'absolute',
    top: -1,
    right: -1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderTopRightRadius: 14,
    borderBottomLeftRadius: 12,
    gap: 6,
  },
  recommendedText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  timelineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  timelineName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
  },
  difficultyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  difficultyText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  weeksContainer: {
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  weeksNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
  },
  weeksLabel: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 2,
  },
  quickMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  quickMetric: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  quickMetricText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '600',
  },
  selectedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    gap: 6,
  },
  selectedText: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '600',
  },
  expandedContainer: {
    overflow: 'hidden',
    backgroundColor: '#fff',
    marginTop: -12,
    marginBottom: 12,
    marginHorizontal: 20,
    borderRadius: 16,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  detailedStatsSection: {
    padding: 20,
    backgroundColor: '#f8fafc',
  },
  detailedStatsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
  },
  detailedStatsScroll: {
    gap: 12,
  },
  detailedStatCard: {
    width: 140,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  detailedStatIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#f1f5f9',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailedStatLabel: {
    fontSize: 11,
    color: '#64748b',
    marginBottom: 6,
    textAlign: 'center',
  },
  detailedStatValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1e293b',
  },
  detailedStatUnit: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  detailsContent: {
    padding: 20,
  },
  tagsContainer: {
    marginBottom: 20,
  },
  tagsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 12,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 12,
    color: '#1e40af',
    fontWeight: '500',
  },
  outcomesTag: {
    backgroundColor: '#dcfce7',
  },
  outcomesTagText: {
    color: '#166534',
  },
  emphasisContainer: {
    gap: 16,
  },
  emphasisItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 12,
  },
  emphasisLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
    fontWeight: '600',
  },
  emphasisText: {
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '500',
  },
  notesCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  notesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  notesTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },
  noteItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 10,
  },
  noteText: {
    flex: 1,
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
  },
  disclaimer: {
    flexDirection: 'row',
    backgroundColor: '#fffbeb',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fde68a',
    gap: 12,
  },
  disclaimerText: {
    fontSize: 12,
    color: '#92400e',
    lineHeight: 18,
  },
  disclaimerBold: {
    fontWeight: '700',
  },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 8,
    paddingBottom: Platform.OS === 'ios' ? 34 : 100,


    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    gap: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  customizeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eff6ff',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#3b82f6',
    gap: 8,
  },
  customizeButtonText: {
    fontSize: 16,
    color: '#3b82f6',
    fontWeight: '600',
  },
  startButton: {
    flex: 2,
    borderRadius: 12,
    overflow: 'hidden',
    
  },
  startButtonDisabled: {
    opacity: 0.5,
  },
  startButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  startButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '700',
  },
   headerCard: {
    height: 170,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },

  headerImageBg: {
    flex: 1,
    justifyContent: "center",
  },

  headerImageStyle: {
    borderRadius: 20,
  },

  headerOverlay: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "transparent",
  },

  headerTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  titleWithBg: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
  },

  subtitleWithBg: {
    fontSize: 14,
    color: "#e0e7ff",
    marginTop: 2,
  },

  headerUserBox: {
    backgroundColor: "rgba(255,255,255,0.18)",
    padding: 10,
    borderRadius: 16,
  },

  descriptionWithBg: {
    marginTop: 12,
    fontSize: 13,
    color: "#fff",
    opacity: 0.9,
  },
});