import { useState } from "react";
import {
  View,
  StatusBar,
  TouchableOpacity,
  Text,
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import DashboardHeader from "@/components/DashboardHeader";
import DineInScreen from "./Dashboardtabs/DineInScreen";
import MomItScreen from "./Dashboardtabs/MomitScreen";
import { ShoppingScreen } from "./Dashboardtabs/GoShopScreen";
import { useAppSelector } from "@/redux/store/hooks";
import MealPlannerScreen from "@/components/mealplan/MealPlannerScreen";
import GoalCustomizationScreen from "./Dashboardtabs/GoalCustomizationTab";
import ProfileScreen from "./ProfileScreen";
import FuturisticStatsScreen from "./Dashboardtabs/FuturisticStatsScreen";
import { styles } from "./Dashboardtabs/styles/DashboardScreenStyles";
const DashboardScreen = ({ route }: any) => {
  const [activeHeaderTab, setActiveHeaderTab] = useState("stats");
  const [menuVisible, setMenuVisible] = useState(false);
  const slideAnim = useState(new Animated.Value(0))[0];

  const navigation = useNavigation();
  const { user } = useAppSelector((state) => state.auth);

  const mealType = route?.params?.mealType;
  const surpriseMode = route?.params?.surpriseMode;
  const fromLanding = route?.params?.fromLanding;

  const allScreens = [
    { id: "stats", label: "Stats", description: "Track your daily metrics" },
    { id: "make-it", label: "Make It", description: "Cook healthy meals" },
    { id: "go-shop", label: "Go Shop", description: "Shop ingredients" },
    { id: "dine-in", label: "Dine-In", description: "Find restaurants nearby" },
    { id: "mom-it", label: "Mom It", description: "Mom's favorite recipes" },
    {
      id: "Goal-customization",
      label: "Goals",
      description: "Customize fitness goals",
    },
    { id: "profile", label: "Profile", description: "Manage your profile" },
  ];

  const renderScreen = () => {
    switch (activeHeaderTab) {
      case "stats":
        return <FuturisticStatsScreen />;
      case "make-it":
        return (
          <MealPlannerScreen
            mealType={mealType}
            surpriseMode={surpriseMode}
            fromLanding={fromLanding}
          />
        );
      case "go-shop":
        return <ShoppingScreen />;
      case "dine-in":
        return <DineInScreen />;
      case "mom-it":
        return <MomItScreen />;
      case "Goal-customization":
        return <GoalCustomizationScreen />;
      case "profile":
        return <ProfileScreen />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <DashboardHeader
        activeTab={activeHeaderTab}
        onTabChange={setActiveHeaderTab}
      />
      {renderScreen()}
    </View>
  );
};

export default DashboardScreen;