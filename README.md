# 🏋️‍♂️ Fit AI App

**Fit AI** is a cross-platform fitness assistant built with **React Native (Expo)** and powered by **AI** for personalized workout tracking, nutrition guidance, and smart health recommendations.

---

## 🚀 Tech Stack

- **Node.js**: v23+  
- **Expo SDK**: Latest  
- **React Native** (TypeScript)  
- **Redux Toolkit / Context API** (state management)  
- **Axios** (API communication)  
- **React Navigation v7**  
- **Reanimated**, **Device Info**, **Linear Gradient**  
- **Async Storage**, **React Native Dotenv**, **Google Auth**  

---

## 📦 Installation Guide

### 🧩 Prerequisites

Before starting, make sure you have these installed:

- **Node.js v23+** → [Download Node.js](https://nodejs.org/)
- **Expo CLI** → install globally:
  ```bash
  npm install -g expo-cli
  ```
- **Android Studio** (for emulators & SDK)
  - ✅ Android SDK  
  - ✅ Android SDK Platform  
  - ✅ Android Virtual Device (AVD)  

---

### ⚙️ 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/fitai.git
cd fitai
```

---

### ⚙️ 2. Install Dependencies

```bash
npm install
```

or

```bash
yarn install
```

---

## ▶️ Running the App

### Development Mode

```bash
npm run start
# or
npx expo start
```

Press:
- `i` → Run on iOS Simulator  
- `a` → Run on Android Emulator  
- Scan QR → Run on Expo Go (mobile device)

---

### Production Mode

To simulate a production environment:

```bash
npm run start:prod
```

---

### Building for Production

```bash
npx expo build:android
npx expo build:ios
```

---

### 🧹 Clear Cache (if you face issues)

```bash
npm run clean
```

This command clears the Expo, Metro, and node_modules cache.

---

## 📁 Project Structure

```
fitai/
├── src/
│   ├── api/               # API integrations
│   ├── components/        # Reusable UI components
│   ├── screens/           # App screens (e.g. Home, Goals, Profile)
│   ├── redux/             # Redux slices & store configuration
│   ├── config/            # App-level configuration
│   └── types/             # TypeScript types
│
├── assets/                # Images, fonts, icons
├── App.tsx                # Entry file
├── babel.config.js        # Babel setup
├── package.json
└── README.md
```

---

## 🧠 Useful Commands

| Command | Description |
|----------|--------------|
| `npm run start` | Start in development mode |
| `npm run start:prod` | Start in production mode |
| `npm run android` | Run app on Android emulator |
| `npm run ios` | Run app on iOS simulator |
| `npm run clean` | Clear build caches |
| `npm run lint` | Run linter to check code quality |

---

## 🧩 Features

- 🤖 **AI-driven recommendations** for fitness and nutrition  
- 🧘 **Personalized goal assessments**  
- 🍎 **Meal plans & tracking**  
- 🏋️ **Workout logging and history**  
- 📊 **Progress tracking dashboards**  
- 🔐 **Secure authentication (Google, Apple, SSO)**  
- ⚡ **Offline support with AsyncStorage**  
- 🎨 **Modern UI with gradient backgrounds & icons**  

---

## 🧠 Developer Notes

- Uses `babel.config.js` to automatically switch between development and production modes.  
- Includes `react-native-dotenv` for environment-based configs.  
- Compatible with **Expo Development Build** and **EAS** workflows.  

---

## 📜 License

This project is licensed under the **MIT License** — you are free to use, modify, and distribute it.

---

## 🤝 Contributing

Contributions are welcome!  
1. Fork the repository  
2. Create your feature branch (`git checkout -b feature/awesome-feature`)  
3. Commit your changes (`git commit -m 'Added awesome feature'`)  
4. Push to the branch (`git push origin feature/awesome-feature`)  
5. Open a Pull Request 🚀  

---

## ❤️ Acknowledgements

- [Expo](https://expo.dev/)  
- [React Native](https://reactnative.dev/)  
- [Redux Toolkit](https://redux-toolkit.js.org/)  
- [Google Auth SDK](https://developers.google.com/identity)  
- [OpenAI API / AI Engine (Fit AI Core)]  
