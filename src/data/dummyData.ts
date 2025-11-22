// healthConditions.ts
import { Colors } from "@/constants/Colors";
import { ConsultationType, Doctor, HealthCondition } from "../types";

export const healthConditions: HealthCondition[] = [
  { id: "hc1", name: "Pre-Diabetes", key: "preDiabetes", selected: false },
  { id: "hc2", name: "Diabetes (Type 1 & Type 2)", key: "diabetes", selected: false },
  { id: "hc3", name: "High or abnormal cholesterol", key: "highOrAbnormalCholesterol", selected: false },
  { id: "hc4", name: "Depression", key: "depression", selected: false },
  { id: "hc5", name: "Sleep apnea", key: "sleepApnea", selected: false },
  { id: "hc6", name: "Obesity", key: "obesity", selected: false },
  { id: "hc7", name: "Hypertension (High BP)", key: "hypertension", selected: false },
  { id: "hc8", name: "Asthma", key: "asthma", selected: false },
  { id: "hc9", name: "Kidney disease", key: "kidneyDisease", selected: false },
  { id: "hc10", name: "Liver disease (hepatitis, cirrhosis)", key: "liverDisease", selected: false },
  { id: "hc11", name: "Migraines", key: "migraines", selected: false },
];

// 🛡️ Immune disorders
export const immuneDisorders: HealthCondition[] = [
  { id: "im1", name: "HIV or AIDS", key: "hivOrAids", selected: false },
  { id: "im2", name: "Thyroid Disorders", key: "thyroidDisorders", selected: false },
  { id: "im3", name: "Rheumatoid Arthritis", key: "rheumatoidArthritis", selected: false },
  { id: "im4", name: "Crohn's Disease", key: "crohnsDisease", selected: false },
];

// 🧠 Neurological conditions
export const neurologicalConditions: HealthCondition[] = [
  { id: "n1", name: "Epilepsy", key: "epilepsy", selected: false },
  { id: "n2", name: "Multiple Sclerosis", key: "multipleSclerosis", selected: false },
  { id: "n3", name: "Parkinson's Disease", key: "parkInSonsDisease", selected: false },
  { id: "n4", name: "Alzheimer's Disease", key: "alzhemersDisease", selected: false },
  { id: "n5", name: "Anxiety Disorders", key: "anxietyDisorders", selected: false },
  { id: "n6", name: "Bipolar Disorder", key: "bipolarDisorder", selected: false },
  { id: "n7", name: "Schizophrenia", key: "schizophrenia", selected: false },
];

// 🎗️ Cancer history
export const cancerConditions: HealthCondition[] = [
  { id: "c1", name: "Any Type of Cancer", key: "anyTypeOfCancer", selected: false },
  { id: "c2", name: "Leukemia", key: "leukemia", selected: false },
];

// 🥜 Food allergies / intolerances
export const foodAllergies: HealthCondition[] = [
  { id: "fa1", name: "Peanuts", key: "peanuts", selected: false },
  { id: "fa2", name: "Tree Nuts", key: "treeNuts", selected: false },
  { id: "fa3", name: "Milk", key: "milk", selected: false },
  { id: "fa4", name: "Eggs", key: "eggs", selected: false },
  { id: "fa5", name: "Wheat / Gluten", key: "wheatGluten", selected: false },
  { id: "fa6", name: "Soy", key: "soy", selected: false },
  { id: "fa7", name: "Fish", key: "fish", selected: false },
  { id: "fa8", name: "Shellfish", key: "shellfish", selected: false },
];



export const restaurants = [
  {
    id: 1,
    name: "Green Garden Bistro",
    cuisine: "Mediterranean",
    rating: "4.8",
    time: "25-30 min",
    price: "$12",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=200&fit=crop",
    specialties: ["Healthy", "Fresh", "Organic"],
    badge: "Healthy Choices",
  dietType: "Non-Veg. Veg. Vegan",
  },
  {
    id: 2,
    name: "Egg It",
    cuisine: "American",
    rating: "4.6",
    time: "20-25 min",
    price: "$12",
    image:
      "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=200&fit=crop",
    specialties: ["Breakfast", "Brunch", "Eggs"],
    badge: "Quick Service",
    dietType: "Non-Veg. Veg. Vegan",
  },
  {
    id: 3,
    name: "Protein Palace",
    cuisine: "Fitness Food",
    rating: "4.7",
    time: "15-20 min",
    price: "$$12",
    image:
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=200&fit=crop",
    specialties: ["High Protein", "Low Carb", "Meal Prep"],
    badge: "High Protein",
    dietType: "Vegan",
  },
];


   export const reservations = [
    {
      id: 1,
      restaurant: "The Healthy Bowl",
      date: "Today",
      time: "7:30 PM",
      guests: "2 people",
      status: "Confirmed",
    },
    {
      id: 2,
      restaurant: "Green Leaf Cafe",
      date: "Tomorrow",
      time: "12:30 PM",
      guests: "4 people",
      status: "Pending",
    },
  ];


   export const clinicalData = [
    {
      title: "Pre-diabetes Management - Week 1",
      value: "1020",
      unit: "kcal",
      color: Colors.error,
      isMainTitle: true,
    },
    { title: "Carbs", value: "77g", unit: "", color: Colors.primary },
    { title: "Protein", value: "65g", unit: "", color: Colors.info },
    { title: "Fats", value: "48g", unit: "", color: Colors.success },
  ];

   export const todaysMeals = [
    {
      title: "Greek Yogurt Berry Bowl",
      subtitle: "Breakfast",
      calories: "320",
      time: "8:00 AM",
      color: Colors.breakfast,
      imageUrl:
        "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=400&h=300&fit=crop",
    },
    {
      title: "Mediterranean Quinoa Salad",
      subtitle: "Lunch",
      calories: "450",
      time: "12:30 PM",
      color: Colors.lunch,
      imageUrl:
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
    },
    {
      title: "Baked Salmon with Vegetables",
      subtitle: "Dinner",
      calories: "380",
      time: "7:00 PM",
      color: Colors.dinner,
      imageUrl:
        "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop",
    },
  ];

   export const recipes = [
    {
      title: "Greek Yogurt Berry Bowl",
      description: "Perfect for managing blood sugar levels",
      calories: "320",
      time: "10",
      difficulty: "Breakfast",
      imageUrl:
        "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=400&h=200&fit=crop",
    },
    {
      title: "Mediterranean Quinoa Salad",
      description: "Balanced meal with complete nutrition",
      calories: "380",
      time: "15",
      difficulty: "Lunch",
      imageUrl:
        "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=200&fit=crop",
    },
  ];

   export const mealKits = [
    {
      title: "Brand Factor75",
      subtitle: "Non-Keto Vegetarian - Week",
      rating: "75",
      price: "11.00",
      originalPrice: "13.00",
      imageUrl:
        "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=200&h=200&fit=crop",
      color: Colors.success,
    },
    {
      title: "Brand Factor75",
      subtitle: "Non-Keto Vegetarian - Week",
      rating: "75",
      price: "11.00",
      originalPrice: "13.00",
      imageUrl:
        "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=200&h=200&fit=crop",
      color: Colors.success,
    },
  ];


     export const consultationTypes: ConsultationType[] = [
      {
        id: 'video',
        icon: '📹',
        title: 'Video Call',
        subtitle: 'High-quality video consultation',
        price: '$50',
      },
      {
        id: 'phone',
        icon: '📞',
        title: 'Voice Call',
        subtitle: 'Voice-only consultation',
        price: '$30',
      },
      {
        id: 'chat',
        icon: '💬',
        title: 'Live Chat',
        subtitle: 'Real-time text consultation',
        price: '$20',
      },
    ];
  
     export const doctors: Doctor[] = [
      {
        id: 1,
        name: 'Dr. Santhosh Kumar',
        specialty: 'Nutritionist',
        rating: '4.9',
        reviews: '2.3k reviews',
        experience: '15+ Experience',
        nextSlot: 'Today at 2:00 PM',
        image:
          'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&crop=face',
      },
      {
        id: 2,
        name: 'Dr. Michael Chen',
        specialty: 'Dietitian',
        rating: '4.8',
        reviews: '1.8k reviews',
        experience: '12+ Experience',
        nextSlot: 'Today at 4:30 PM',
        image:
          'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=100&h=100&fit=crop&crop=face',
      },
      {
        id: 3,
        name: 'Dr. Emma Watson',
        specialty: 'Health Coach',
        rating: '4.7',
        reviews: '1.2k reviews',
        experience: '8+ Experience',
        nextSlot: 'Tomorrow at 10:00 AM',
        image:
          'https://images.unsplash.com/photo-1594824388853-1c1d4d3ef08a?w=100&h=100&fit=crop&crop=face',
      },
    ];
  
    export const timeSlots: string[] = [
      '9:00 AM',
      '10:00 AM',
      '11:00 AM',
      '12:00 PM',
      '1:00 PM',
      '2:00 PM',
      '3:00 PM',
      '4:00 PM',
      '5:00 PM',
    ];

export const productCategories = [
  {
    id: "1",
    name: "Dairy",
    products: [
      {
        id: "p1",
        name: "Fresh Milk",
        price: "₹58",
        originalPrice: "₹65",
        discount: "11% off",
        image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=400&fit=crop",
        rating: 4.5,
        reviews: "847",
        prime: false,
        freeDelivery: true,
      },
      {
        id: "p2",
        name: "Greek Yogurt",
        price: "₹120",
        originalPrice: "₹140",
        discount: "14% off",
        image: "https://images.unsplash.com/photo-1571212515416-fdf23753461b?w=400&h=400&fit=crop",
        rating: 4.3,
        reviews: "234",
        prime: false,
        freeDelivery: true,
      },
      {
        id: "p3",
        name: "Cottage Cheese",
        price: "₹85",
        originalPrice: "₹95",
        discount: "11% off",
        image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400&h=400&fit=crop",
        rating: 4.7,
        reviews: "429",
        prime: false,
        freeDelivery: true,
      },
    ],
  },
  {
    id: "2",
    name: "Fruits",
    products: [
      {
        id: "p4",
        name: "Fresh Apples",
        price: "₹150",
        originalPrice: "₹180",
        discount: "17% off",
        image: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400&h=400&fit=crop",
        rating: 4.6,
        reviews: "672",
        prime: false,
        freeDelivery: true,
      },
      {
        id: "p5",
        name: "Bananas",
        price: "₹40",
        originalPrice: "₹50",
        discount: "20% off",
        image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop",
        rating: 4.4,
        reviews: "847",
        prime: false,
        freeDelivery: true,
      },
      {
        id: "p6",
        name: "Orange Juice",
        price: "₹95",
        originalPrice: "₹110",
        discount: "14% off",
        image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=400&fit=crop",
        rating: 4.2,
        reviews: "156",
        prime: false,
        freeDelivery: false,
      },
    ],
  },
  {
    id: "3",
    name: "Grains",
    products: [
      {
        id: "p7",
        name: "Brown Rice",
        price: "₹180",
        originalPrice: "₹200",
        discount: "10% off",
        image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop",
        rating: 4.5,
        reviews: "324",
        prime: false,
        freeDelivery: true,
      },
      {
        id: "p8",
        name: "Quinoa",
        price: "₹450",
        originalPrice: "₹520",
        discount: "13% off",
        image: "https://images.unsplash.com/photo-1601043849463-2400e5927e38?w=400&h=400&fit=crop",
        rating: 4.8,
        reviews: "189",
        prime: false,
        freeDelivery: true,
      },
      {
        id: "p9",
        name: "Oats",
        price: "₹220",
        originalPrice: "₹250",
        discount: "12% off",
        image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=400&fit=crop",
        rating: 4.6,
        reviews: "567",
        prime: false,
        freeDelivery: true,
      },
    ],
  },
];

export const stores = [
  {
    id: "1",
    name: "Whole Foods Market",
    distance: "1.2 km",
    rating: "4.5",
    total: "₹74.50 total",
    items: "7",
    deliveryTime: "30-40 mins",
  },
  {
    id: "2",
    name: "Whole Foods Market",
    distance: "2.1 km",
    rating: "4.3",
    total: "₹78.50 total",
    items: "9",
    deliveryTime: "45-60 mins",
  },
];

  



  export const shoppingList = [
    { id: '1', name: 'Fresh Milk', quantity: '2L', price: '₹90', completed: true },
    { id: '2', name: 'Basmati Rice', quantity: '5kg', price: '₹900', completed: false },
    { id: '3', name: 'Olive Oil', quantity: '500ml', price: '₹250', completed: true },
    { id: '4', name: 'Fresh Tomatoes', quantity: '1kg', price: '₹40', completed: false },
  ];

  export const consultationTypesData = [
        {
            id: 'video',
            title: 'Video Call',
            price: '$70',
            icon: 'videocam',
            bgColor: '#E3F2FD',
            iconColor: '#2196F3'
        },
        {
            id: 'phone',
            title: 'Phone Call',
            price: '$40',
            icon: 'phone',
            bgColor: '#E8F5E8',
            iconColor: '#4CAF50'
        },
        {
            id: 'chat',
            title: 'Live Chat',
            price: '$45',
            icon: 'chat',
            bgColor: '#F3E5F5',
            iconColor: '#9C27B0'
        }
    ];
  export const users = {
    name: "Hari haran",
    email: "hari@gmail.com",
    isVerified: true,
    healthCondition: "Pre-Diabetes",
    goalsCompleted: 3,
    memberSince: "January 2025",
  };
  export const nutritionalTargets = [
    {
      id: 'carbs',
      name: 'Carbohydrates',
      amount: '373g',
      percentage: '51% of kcal',
      icon: '🥖',
      bgColor: '#FED7AA',
    },
    {
      id: 'protein',
      name: 'Protein',
      amount: '207g',
      percentage: '25% of kcal',
      icon: '🥩',
      bgColor: '#FECACA',
    },
    {
      id: 'fats',
      name: 'Healthy Fats',
      amount: '111g',
      percentage: '30% of kcal',
      icon: '🥑',
      bgColor: '#BBF7D0',
    },
    {
      id: 'fiber',
      name: 'Fiber',
      amount: '25g',
      percentage: 'Daily Target',
      icon: '🌾',
      bgColor: '#D8B4FE',
    },
  ];

  export const sampleMeals = [
    {
      id: 1,
      title: 'Greek Yogurt Berry Bowl',
      description: 'High-protein with antioxidant-rich berries',
      image: 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=400&h=200&fit=crop',
      calories: '400 cal',
      nutrition: { carbs: '93g', protein: '52g', fats: '28g', fiber: '14g' },
      ingredients: 'Greek yogurt, mixed berries, granola, honey',
      mealType: 'BREAKFAST',
      mealIcon: '🌅',
    },
    {
      id: 2,
      title: 'Quinoa Power Salad',
      description: 'Nutrient-dense with complete proteins',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=200&fit=crop',
      calories: '520 cal',
      nutrition: { carbs: '68g', protein: '24g', fats: '18g', fiber: '12g' },
      ingredients: 'Quinoa, chickpeas, cucumber, tomatoes, olive oil',
      mealType: 'LUNCH',
      mealIcon: '☀️',
    },
    {
      id: 3,
      title: 'Grilled Salmon with Vegetables',
      description: 'Omega-3 rich with seasonal vegetables',
      image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=200&fit=crop',
      calories: '480 cal',
      nutrition: { carbs: '24g', protein: '42g', fats: '28g', fiber: '8g' },
      ingredients: 'Salmon fillet, broccoli, sweet potato, lemon',
      mealType: 'DINNER',
      mealIcon: '🌙',
    },
    {
      id: 4,
      title: 'Almond Protein Smoothie',
      description: 'Post-workout recovery blend',
      image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400&h=200&fit=crop',
      calories: '280 cal',
      nutrition: { carbs: '32g', protein: '25g', fats: '8g', fiber: '6g' },
      ingredients: 'Almond milk, banana, protein powder, spinach',
      mealType: 'SNACK',
      mealIcon: '🥤',
    },
  ];

  export const dayPlans = [
    {
      day: 1,
      meals: sampleMeals,
      totalCalories: 1680,
      isActive: true,
    },
    {
      day: 2,
      meals: sampleMeals.slice(0, 3),
      totalCalories: 1400,
      isActive: false,
    },
    {
      day: 3,
      meals: [...sampleMeals.slice(1, 3), sampleMeals[0]],
      totalCalories: 1400,
      isActive: false,
    },
  ];



  