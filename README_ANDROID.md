# Block Master Android App

This project has been configured with **Capacitor**, allowing you to turn this polished React web application into a native Android application.

## Prerequisites

1. **Android Studio**: Installed on your local machine.
2. **Java JDK 17+**: Installed and configured.

## 🚀 Development & Build

### Prerequisites
- Node.js v22+
- Android Studio (for native Android build)

### Install
```bash
npm install
```

### Dev Server
```bash
npm run dev
# Opens at http://localhost:3000
```

### Production Build
```bash
npm run build
```

### Android Deployment
```bash
# 1. Build web assets
npm run build

# 2. Sync into Capacitor Android project
npx cap sync android

# 3. Open in Android Studio
npx cap open android
# Then: Build → Generate Signed APK / Run on Device
```

## Why Capacitor instead of pure React Native?

We used Capacitor because it allows us to reuse 100% of the highly polished UI, complex drag-and-drop logic, and Framer Motion animations we've already built. A pure React Native rewrite would require rebuilding the entire UI layer from scratch, whereas Capacitor provides a high-performance native container for your existing React app.
