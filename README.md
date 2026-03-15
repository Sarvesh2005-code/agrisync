# 🌾 AgriSync — Smart Farming Assistant

AgriSync is an offline-first mobile app that empowers Indian farmers with AI-powered crop advisory, disease diagnosis, soil management, and weather insights — all in their local language.

## ✨ Features

| Feature | Description |
|---|---|
| 🏠 **Smart Dashboard** | Weather, crop alerts, market prices, and quick actions |
| 🌱 **Crop Tracker** | Track sowing-to-harvest timeline for your crops |
| 🔬 **Plant Clinic** | Diagnose crop diseases by selecting symptoms |
| 🌍 **Soil Info** | Detailed soil analysis, treatments, and fertilizer plans |
| 🤖 **AI Assistant** | Ask farming questions (online via Gemini AI + offline fallback) |
| 🌐 **Multilingual** | English, Hindi, and Marathi support |
| 📶 **Offline-First** | Works without internet — all core features run locally |

## 📱 Download

Download the latest APK from [**GitHub Releases**](https://github.com/Sarvesh2005-code/agrisync/releases).

## 🛠️ Tech Stack

- **Framework:** React Native (Expo SDK 54)
- **Navigation:** React Navigation
- **State:** Zustand + AsyncStorage
- **AI:** Google Gemini 1.5 Flash (with offline fallback)
- **i18n:** i18next
- **Database:** Expo SQLite

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start the development server
npx expo start

# Run on Android
npx expo start --android
```

## 📦 Building APK

```bash
# Login to your Expo account
npx eas-cli login

# Build Android APK
npx eas-cli build -p android --profile preview
```

## 📄 License

MIT License — built with ❤️ for farmers.
