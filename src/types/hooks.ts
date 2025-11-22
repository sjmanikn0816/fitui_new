import { useState, useEffect } from "react";

const mealTimeConfig = [
  { type: "breakfast", startHour: 5, endHour: 11, image: require("assets/breakfast.png") },
  { type: "lunch", startHour: 11, endHour: 16, image: require("assets/lunch.png") },
  { type: "evening", startHour: 16, endHour: 20, image: require("assets/evening.png") },
  { type: "dinner", startHour: 20, endHour: 24, image: require("assets/dinner.png") },
];

export const useMealTime = () => {
  const [currentMealType, setCurrentMealType] = useState("breakfast");
  const [mealImage, setMealImage] = useState(require("assets/breakfast.png"));

  useEffect(() => {
    const currentHour = new Date().getHours();
    const meal =
      mealTimeConfig.find(
        (m) => currentHour >= m.startHour && currentHour < m.endHour
      ) || mealTimeConfig[0];

    setCurrentMealType(meal.type);
    setMealImage(meal.image);
  }, []);

  return { currentMealType, mealImage };
};
