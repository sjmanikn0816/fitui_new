import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { Calendar, ChefHat, Clock, Flame, Activity, ChevronDown, Award, Apple } from 'lucide-react-native';
import { moderateScale, scale, verticalScale } from '@/utils/responsive';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '@/constants/Colors';

const { width, height } = Dimensions.get('window');
const isSmallDevice = width < 375;
const isMediumDevice = width >= 375 && width < 768;
const isTablet = width >= 768;

const MealPlannerApp = () => {
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [selectedDate, setSelectedDate] = useState('2025-11-25');
  const [expandedMeal, setExpandedMeal] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
const navigation=useNavigation()
  // Responsive scaling
  const scale = (size) => (width / 375) * size;
  const verticalScale = (size) => (height / 812) * size;
  const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

  // Sample data structure based on the JSON
  const mealData = {
    breakfast: {
      name: "Roasted Vegetable Hash",
      description: "Vegetarian breakfast dish with roasted vegetables and whole grains",
      calories: 750,
      protein: 17.5,
      carbs: 119.3,
      fat: 24.5,
      fiber: 20.4,
      prepTime: 20,
      difficulty: "Easy",
      ingredients: ["Sweet Potatoes", "Carrots", "Zucchini", "Red Bell Pepper", "Onion", "Olive Oil", "Salt", "Pepper", "Whole Wheat Bread"],
      instructions: [
        "Preheat oven to 400F (200C)",
        "Toss vegetables with olive oil, salt, and pepper in a bowl",
        "Spread vegetables on a baking sheet and roast for 20 minutes",
        "Serve roasted vegetables with whole wheat bread"
      ]
    },
    lunch: {
      name: "Roasted Vegetable Wrap",
      description: "Veggie-focused meal with roasted vegetables and lean beef for protein",
      calories: 1050,
      protein: 42.5,
      carbs: 30.5,
      fat: 86.6,
      fiber: 9.4,
      prepTime: 20,
      difficulty: "Easy",
      ingredients: ["Whole Wheat Tortilla", "Lean Beef Strips", "Roasted Red Bell Pepper", "Roasted Zucchini", "Roasted Eggplant", "Feta Cheese", "Olive Oil", "Salt", "Pepper"],
      instructions: [
        "Preheat oven to 400F (200C)",
        "Season beef strips with salt and pepper",
        "Grill beef strips in a skillet over medium-high heat for 3-4 minutes per side",
        "Toss sliced vegetables with olive oil, salt, and pepper, and roast in the oven for 20-25 minutes",
        "Assemble wrap by placing grilled beef strips and roasted vegetables in a whole wheat tortilla"
      ]
    },
    dinner: {
      name: "Roasted Vegetable Stuffed Portobello Mushrooms",
      description: "Vegetarian meal rich in fiber and antioxidants",
      calories: 1200,
      protein: 52.5,
      carbs: 196.5,
      fat: 39.6,
      fiber: 75.8,
      prepTime: 20,
      difficulty: "Easy",
      ingredients: ["Portobello Mushrooms", "Quinoa", "Black Beans", "Red Bell Pepper", "Onion", "Garlic", "Olive Oil", "Cumin", "Paprika", "Salt", "Pepper"],
      instructions: [
        "Preheat oven to 400F (200C)",
        "Sauté onion, garlic, and red bell pepper in olive oil until tender",
        "In a bowl, mix cooked quinoa, black beans, cumin, paprika, salt, and pepper",
        "Fill each mushroom cap with the quinoa mixture and top with sautéed vegetables",
        "Bake for 20-25 minutes or until mushrooms are tender and golden brown"
      ]
    }
  };

  const dailyTarget = {
    calories: 3000,
    protein: 170.2,
    carbs: 306.3,
    fat: 90.8
  };

  const weeks = [
    { id: 1, label: 'Week 1', dates: ['Nov 25 - Dec 1'] },
    { id: 2, label: 'Week 2', dates: ['Dec 2 - Dec 8'] },
    { id: 3, label: 'Week 3', dates: ['Dec 9 - Dec 15'] },
    { id: 4, label: 'Week 4', dates: ['Dec 16 - Dec 22'] }
  ];

  const dates = [
    { date: '2025-11-25', day: 'Mon', dayNum: '25' },
    { date: '2025-11-26', day: 'Tue', dayNum: '26' },
    { date: '2025-11-27', day: 'Wed', dayNum: '27' },
    { date: '2025-11-28', day: 'Thu', dayNum: '28' },
    { date: '2025-11-29', day: 'Fri', dayNum: '29' },
    { date: '2025-11-30', day: 'Sat', dayNum: '30' },
    { date: '2025-12-01', day: 'Sun', dayNum: '01' }
  ];

  const totalDailyCalories = mealData.breakfast.calories + mealData.lunch.calories + mealData.dinner.calories;
  const totalProtein = mealData.breakfast.protein + mealData.lunch.protein + mealData.dinner.protein;
  const calorieProgress = (totalDailyCalories / dailyTarget.calories) * 100;
  const proteinProgress = (totalProtein / dailyTarget.protein) * 100;

  const MealCard = ({ meal, type, data }) => {
    const isExpanded = expandedMeal === type;
    const mealTypeColors = {
      breakfast: { bg: 'rgba(251, 191, 36, 0.15)', border: 'rgba(251, 191, 36, 0.3)' },
      lunch: { bg: 'rgba(59, 130, 246, 0.15)', border: 'rgba(59, 130, 246, 0.3)' },
      dinner: { bg: 'rgba(168, 85, 247, 0.15)', border: 'rgba(168, 85, 247, 0.3)' }
    };
    const iconColors = {
      breakfast: '#FBBF24',
      lunch: '#3B82F6',
      dinner: '#A855F7'
    };

    return (
      <View style={[styles.mealCard, { backgroundColor: Colors.bgCard, borderColor: mealTypeColors[type].border }]}>
        <TouchableOpacity
          style={styles.mealCardHeader}
          onPress={() => setExpandedMeal(isExpanded ? null : type)}
          activeOpacity={0.7}
        >
          <View style={styles.mealCardTop}>
            <View style={styles.mealCardTitleSection}>
              <View style={[styles.mealIconContainer, { backgroundColor: mealTypeColors[type].bg }]}>
                <Apple color={iconColors[type]} size={moderateScale(24)} />
              </View>
              <View style={styles.mealTitleText}>
                <Text style={styles.mealType}>{type.toUpperCase()}</Text>
                <Text style={styles.mealName}>{data.name}</Text>
              </View>
            </View>
            <View style={[styles.chevronContainer, isExpanded && styles.chevronRotated]}>
              <ChevronDown color="#9CA3AF" size={moderateScale(20)} />
            </View>
          </View>

          <Text style={styles.mealDescription}>{data.description}</Text>

          <View style={styles.macroGrid}>
            <View style={styles.macroItem}>
              <Flame color="#F97316" size={moderateScale(16)} />
              <Text style={styles.macroValue}>{data.calories}</Text>
              <Text style={styles.macroLabel}>kcal</Text>
            </View>
            <View style={styles.macroItem}>
              <Activity color="#EF4444" size={moderateScale(16)} />
              <Text style={styles.macroValue}>{data.protein}g</Text>
              <Text style={styles.macroLabel}>Protein</Text>
            </View>
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>{data.carbs}g</Text>
              <Text style={styles.macroLabel}>Carbs</Text>
            </View>
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>{data.fat}g</Text>
              <Text style={styles.macroLabel}>Fat</Text>
            </View>
          </View>

          <View style={styles.mealMeta}>
            <View style={styles.metaItem}>
              <Clock color="#6B7280" size={moderateScale(16)} />
              <Text style={styles.metaText}>{data.prepTime} min</Text>
            </View>
            <View style={styles.metaItem}>
              <Award color="#6B7280" size={moderateScale(16)} />
              <Text style={styles.metaText}>{data.difficulty}</Text>
            </View>
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.expandedContent}>
            <View style={styles.expandedSection}>
              <View style={styles.sectionHeader}>
                <ChefHat color="#374151" size={moderateScale(20)} />
                <Text style={styles.sectionTitle}>Ingredients</Text>
              </View>
              <View style={styles.ingredientsGrid}>
                {data.ingredients.map((ingredient, idx) => (
                  <View key={idx} style={styles.ingredientItem}>
                    <View style={styles.ingredientDot} />
                    <Text style={styles.ingredientText}>{ingredient}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.expandedSection}>
              <Text style={styles.sectionTitle}>Instructions</Text>
              <View style={styles.instructionsList}>
                {data.instructions.map((instruction, idx) => (
                  <View key={idx} style={styles.instructionItem}>
                    <View style={styles.instructionNumber}>
                      <Text style={styles.instructionNumberText}>{idx + 1}</Text>
                    </View>
                    <Text style={styles.instructionText}>{instruction}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#059669" />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
    <View style={styles.headerTop}>
  <TouchableOpacity
    onPress={() => navigation.goBack()}
    style={styles.backButton}
  >
    <Ionicons name="arrow-back" size={moderateScale(26)} color="#FFFFFF" />
  </TouchableOpacity>

  <View style={{ flex: 1 }}>
    <Text style={styles.headerTitle}>Meal Planner</Text>
    <Text style={styles.headerSubtitle}>Your personalized nutrition guide</Text>
  </View>

  <View style={styles.headerIcon}>
    <ChefHat color="#FFFFFF" size={moderateScale(28)} />
  </View>
</View>


          {/* Week Selector */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.weekScroll}>
            {weeks.map((week) => (
              <TouchableOpacity
                key={week.id}
                onPress={() => setSelectedWeek(week.id)}
                style={[
                  styles.weekButton,
                  selectedWeek === week.id ? styles.weekButtonActive : styles.weekButtonInactive
                ]}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.weekButtonText,
                  selectedWeek === week.id ? styles.weekButtonTextActive : styles.weekButtonTextInactive
                ]}>
                  {week.label}
                </Text>
                <Text style={[
                  styles.weekButtonDate,
                  selectedWeek === week.id ? styles.weekButtonDateActive : styles.weekButtonDateInactive
                ]}>
                  {week.dates[0]}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Date Selector */}
        <View style={styles.dateSelector}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {dates.map((dateObj) => (
              <TouchableOpacity
                key={dateObj.date}
                onPress={() => setSelectedDate(dateObj.date)}
                style={[
                  styles.dateButton,
                  selectedDate === dateObj.date ? styles.dateButtonActive : styles.dateButtonInactive
                ]}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.dateDay,
                  selectedDate === dateObj.date ? styles.dateDayActive : styles.dateDayInactive
                ]}>
                  {dateObj.day}
                </Text>
                <Text style={[
                  styles.dateNum,
                  selectedDate === dateObj.date ? styles.dateNumActive : styles.dateNumInactive
                ]}>
                  {dateObj.dayNum}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          {['overview', 'meals', 'nutrition'].map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={styles.tabButton}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.tabText,
                activeTab === tab ? styles.tabTextActive : styles.tabTextInactive
              ]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
              {activeTab === tab && <View style={styles.tabIndicator} />}
            </TouchableOpacity>
          ))}
        </View>

        {/* Content */}
        <View style={styles.content}>
          {activeTab === 'overview' && (
            <View>
              {/* Daily Summary Card */}
              <View style={styles.summaryCard}>
                <View style={styles.summaryHeader}>
                  <Calendar color="#059669" size={moderateScale(20)} />
                  <Text style={styles.summaryTitle}>Daily Summary</Text>
                </View>
                
                <View style={styles.progressSection}>
                  <View style={styles.progressItem}>
                    <View style={styles.progressHeader}>
                      <Text style={styles.progressLabel}>Calories</Text>
                      <Text style={styles.progressValue}>{totalDailyCalories} / {dailyTarget.calories} kcal</Text>
                    </View>
                    <View style={styles.progressBar}>
                      <View style={[styles.progressFill, { width: `${Math.min(calorieProgress, 100)}%`, backgroundColor: '#10B981' }]} />
                    </View>
                  </View>

                  <View style={styles.progressItem}>
                    <View style={styles.progressHeader}>
                      <Text style={styles.progressLabel}>Protein</Text>
                      <Text style={styles.progressValue}>{totalProtein.toFixed(1)}g / {dailyTarget.protein}g</Text>
                    </View>
                    <View style={styles.progressBar}>
                      <View style={[styles.progressFill, { width: `${Math.min(proteinProgress, 100)}%`, backgroundColor: '#3B82F6' }]} />
                    </View>
                  </View>
                </View>
              </View>

              {/* Meal Cards */}
              <MealCard meal="breakfast" type="breakfast" data={mealData.breakfast} />
              <MealCard meal="lunch" type="lunch" data={mealData.lunch} />
              <MealCard meal="dinner" type="dinner" data={mealData.dinner} />
            </View>
          )}

          {activeTab === 'meals' && (
            <View>
              <MealCard meal="breakfast" type="breakfast" data={mealData.breakfast} />
              <MealCard meal="lunch" type="lunch" data={mealData.lunch} />
              <MealCard meal="dinner" type="dinner" data={mealData.dinner} />
            </View>
          )}

          {activeTab === 'nutrition' && (
            <View style={styles.nutritionCard}>
              <Text style={styles.nutritionTitle}>Nutritional Breakdown</Text>
              <View style={styles.nutritionGrid}>
                {[
                  { label: 'Calories', value: totalDailyCalories, unit: 'kcal', target: dailyTarget.calories },
                  { label: 'Protein', value: totalProtein.toFixed(1), unit: 'g', target: dailyTarget.protein },
                  { label: 'Carbs', value: (mealData.breakfast.carbs + mealData.lunch.carbs + mealData.dinner.carbs).toFixed(1), unit: 'g', target: dailyTarget.carbs },
                  { label: 'Fat', value: (mealData.breakfast.fat + mealData.lunch.fat + mealData.dinner.fat).toFixed(1), unit: 'g', target: dailyTarget.fat },
                  { label: 'Fiber', value: (mealData.breakfast.fiber + mealData.lunch.fiber + mealData.dinner.fiber).toFixed(1), unit: 'g', target: 38 }
                ].map((item, idx) => (
                  <View key={idx} style={styles.nutritionItem}>
                    <Text style={styles.nutritionItemLabel}>{item.label}</Text>
                    <Text style={styles.nutritionItemValue}>
                      {item.value}<Text style={styles.nutritionItemUnit}>{item.unit}</Text>
                    </Text>
                    <Text style={styles.nutritionItemTarget}>Target: {item.target}{item.unit}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
    paddingBottom: verticalScale(60)
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: Colors.bgPrimary,
    paddingHorizontal: moderateScale(20),
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(20),
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDark,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(20),
  },
  headerTitle: {
    fontSize: moderateScale(24),
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: verticalScale(4),
  },
  headerSubtitle: {
    fontSize: moderateScale(13),
    color: Colors.emerald,
  },
  headerIcon: {
    backgroundColor: Colors.bgCard,
    padding: moderateScale(12),
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: Colors.borderDark,
  },
  weekScroll: {
    marginTop: verticalScale(10),
  },
  weekButton: {
    paddingHorizontal: moderateScale(20),
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(12),
    marginRight: moderateScale(8),
    minWidth: scale(120),
    borderWidth: 1,
    borderColor: Colors.borderDark,
  },
  weekButtonActive: {
    backgroundColor: Colors.emerald,
    borderColor: Colors.emerald,
  },
  weekButtonInactive: {
    backgroundColor: Colors.bgCard,
  },
  weekButtonText: {
    fontSize: moderateScale(14),
    fontWeight: '600',
  },
  weekButtonTextActive: {
    color: Colors.bgPrimary,
  },
  weekButtonTextInactive: {
    color: Colors.textPrimary,
  },
  weekButtonDate: {
    fontSize: moderateScale(11),
    marginTop: verticalScale(4),
  },
  weekButtonDateActive: {
    color: Colors.bgPrimary,
    opacity: 0.7,
  },
  weekButtonDateInactive: {
    color: Colors.textSecondary,
    opacity: 0.7,
  },
  dateSelector: {
    backgroundColor: Colors.bgCard,
    paddingVertical: verticalScale(16),
    paddingHorizontal: moderateScale(16),
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDark,
  },
  dateButton: {
    alignItems: 'center',
    paddingHorizontal: moderateScale(16),
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(12),
    marginRight: moderateScale(8),
    minWidth: scale(60),
    borderWidth: 1,
    borderColor: Colors.borderDark,
  },
  dateButtonActive: {
    backgroundColor: Colors.emerald,
    borderColor: Colors.emerald,
  },
  dateButtonInactive: {
    backgroundColor: Colors.bgCardHover,
  },
  dateDay: {
    fontSize: moderateScale(11),
    fontWeight: '500',
    marginBottom: verticalScale(4),
  },
  dateDayActive: {
    color: Colors.bgPrimary,
  },
  dateDayInactive: {
    color: Colors.textSecondary,
  },
  dateNum: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
  },
  dateNumActive: {
    color: Colors.bgPrimary,
  },
  dateNumInactive: {
    color: Colors.textPrimary,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.bgCard,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDark,
    paddingHorizontal: moderateScale(16),
  },
  tabButton: {
    paddingVertical: verticalScale(16),
    paddingHorizontal: moderateScale(20),
    position: 'relative',
  },
  tabText: {
    fontSize: moderateScale(14),
    fontWeight: '600',
  },
  tabTextActive: {
    color: Colors.emerald,
  },
  tabTextInactive: {
    color: Colors.textSecondary,
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: Colors.emerald,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  content: {
    padding: moderateScale(16),
  },
  summaryCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: moderateScale(16),
    padding: moderateScale(20),
    marginBottom: verticalScale(16),
    borderWidth: 1,
    borderColor: Colors.borderDark,
    ...Platform.select({
      ios: {
        shadowColor: Colors.emerald,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(16),
  },
  summaryTitle: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginLeft: moderateScale(8),
  },
  progressSection: {
    gap: verticalScale(16),
  },
  progressItem: {
    marginBottom: verticalScale(12),
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(8),
  },
  progressLabel: {
    fontSize: moderateScale(14),
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  progressValue: {
    fontSize: moderateScale(13),
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  progressBar: {
    height: verticalScale(12),
    backgroundColor: Colors.bgCardHover,
    borderRadius: moderateScale(6),
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: moderateScale(6),
  },
  mealCard: {
    borderRadius: moderateScale(16),
    marginBottom: verticalScale(16),
    borderWidth: 1,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: Colors.emerald,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  mealCardHeader: {
    padding: moderateScale(20),
  },
  mealCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: verticalScale(12),
  },
  mealCardTitleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  mealIconContainer: {
    padding: moderateScale(12),
    borderRadius: moderateScale(12),
    marginRight: moderateScale(12),
  },
  mealTitleText: {
    flex: 1,
  },
  mealType: {
    fontSize: moderateScale(11),
    fontWeight: '600',
    color: Colors.textSecondary,
    letterSpacing: 0.5,
    marginBottom: verticalScale(4),
  },
  mealName: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: Colors.textPrimary,
    flexWrap: 'wrap',
  },
  chevronContainer: {
    padding: moderateScale(8),
    borderRadius: moderateScale(8),
  },
  chevronRotated: {
    transform: [{ rotate: '180deg' }],
  },
  mealDescription: {
    fontSize: moderateScale(13),
    color: Colors.textSecondary,
    marginBottom: verticalScale(16),
    lineHeight: moderateScale(20),
  },
  macroGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: moderateScale(12),
    marginBottom: verticalScale(16),
  },
  macroItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.bgCardHover,
    padding: moderateScale(12),
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: Colors.borderDark,
  },
  macroValue: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginTop: verticalScale(4),
  },
  macroLabel: {
    fontSize: moderateScale(10),
    color: Colors.textSecondary,
    marginTop: verticalScale(2),
  },
  mealMeta: {
    flexDirection: 'row',
    gap: moderateScale(16),
    paddingTop: verticalScale(16),
    borderTopWidth: 1,
    borderTopColor: Colors.borderDark,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(8),
  },
  metaText: {
    fontSize: moderateScale(13),
    color: Colors.textSecondary,
  },
  expandedContent: {
    backgroundColor: Colors.bgCardHover,
    borderTopWidth: 1,
    borderTopColor: Colors.borderDark,
    padding: moderateScale(20),
  },
  expandedSection: {
    marginBottom: verticalScale(24),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(12),
  },
  sectionTitle: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginLeft: moderateScale(8),
  },
  ingredientsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: moderateScale(8),
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgCard,
    paddingHorizontal: moderateScale(12),
    paddingVertical: verticalScale(10),
    borderRadius: moderateScale(8),
    width: isTablet ? '48%' : '100%',
    borderWidth: 1,
    borderColor: Colors.borderDark,
  },
  ingredientDot: {
    width: moderateScale(6),
    height: moderateScale(6),
    borderRadius: moderateScale(3),
    backgroundColor: Colors.emerald,
    marginRight: moderateScale(8),
  },
  ingredientText: {
    fontSize: moderateScale(13),
    color: Colors.textSecondary,
    flex: 1,
  },
  instructionsList: {
    gap: verticalScale(12),
  },
  instructionItem: {
    flexDirection: 'row',
    backgroundColor: Colors.bgCard,
    padding: moderateScale(12),
    borderRadius: moderateScale(12),
    gap: moderateScale(12),
    borderWidth: 1,
    borderColor: Colors.borderDark,
  },
  instructionNumber: {
    width: moderateScale(28),
    height: moderateScale(28),
    borderRadius: moderateScale(14),
    backgroundColor: Colors.emerald,
    alignItems: 'center',
    justifyContent: 'center',
  },
  instructionNumberText: {
    fontSize: moderateScale(13),
    fontWeight: 'bold',
    color: Colors.bgPrimary,
  },
  instructionText: {
    flex: 1,
    fontSize: moderateScale(13),
    color: Colors.textSecondary,
    lineHeight: moderateScale(20),
  },
  nutritionCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: moderateScale(16),
    padding: moderateScale(20),
    borderWidth: 1,
    borderColor: Colors.borderDark,
    ...Platform.select({
      ios: {
        shadowColor: Colors.emerald,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  backButton: {
    padding: moderateScale(6),
    marginRight: moderateScale(10),
  },
  nutritionTitle: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: verticalScale(20),
  },
  nutritionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: moderateScale(12),
  },
  nutritionItem: {
    backgroundColor: Colors.bgCardHover,
    padding: moderateScale(16),
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: Colors.borderDark,
    width: isTablet ? '48%' : '47%',
  },
  nutritionItemLabel: {
    fontSize: moderateScale(13),
    color: Colors.textSecondary,
    marginBottom: verticalScale(4),
  },
  nutritionItemValue: {
    fontSize: moderateScale(24),
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: verticalScale(4),
  },
  nutritionItemUnit: {
    fontSize: moderateScale(13),
    color: Colors.textSecondary,
    fontWeight: 'normal',
  },
  nutritionItemTarget: {
    fontSize: moderateScale(11),
    color: Colors.textMuted,
  },
});

export default MealPlannerApp;