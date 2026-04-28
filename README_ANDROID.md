# Block Master Android App

This project has been configured with **Capacitor**, allowing you to turn this polished React web application into a native Android application.

## Prerequisites

1. **Android Studio**: Installed on your local machine.
2. **Java JDK 17+**: Installed and configured.

## How to build the Android App

1. **Download the Project**: Export this project as a ZIP or to GitHub.
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Build and Sync**:
   This command builds the web app and copies the files into the Android project.
   ```bash
   npm run mobile:sync
   ```
4. **Open in Android Studio**:
   ```bash
   npm run mobile:open
   ```
5. **Build APK/Bundle**:
   In Android Studio, go to **Build > Build Bundle(s) / APK(s) > Build APK(s)**.

## Why Capacitor instead of pure React Native?

We used Capacitor because it allows us to reuse 100% of the highly polished UI, complex drag-and-drop logic, and Framer Motion animations we've already built. A pure React Native rewrite would require rebuilding the entire UI layer from scratch, whereas Capacitor provides a high-performance native container for your existing React app.
