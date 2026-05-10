# ──────────────────────────────────────────────────────────
#  ProGuard rules for Block Master — Capacitor / WebView app
# ──────────────────────────────────────────────────────────

# Keep Capacitor bridge classes (required for JS↔Native communication)
-keep class com.getcapacitor.** { *; }
-keep @com.getcapacitor.annotation.CapacitorPlugin class * { *; }
-dontwarn com.getcapacitor.**

# Keep all plugin classes
-keep class com.blockmasterpuzzle.** { *; }

# Keep WebView JavaScript interface methods
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# AndroidX / Support libraries
-keep class androidx.** { *; }
-dontwarn androidx.**

# Preserve source file names for crash reporting (useful for debugging)
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile

# Keep enums intact
-keepclassmembers enum * {
    public static **[] values();
    public static ** valueOf(java.lang.String);
}

# Prevent stripping Parcelable implementations
-keep class * implements android.os.Parcelable {
    public static final android.os.Parcelable$Creator *;
}

# Prevent stripping Serializable implementations
-keepclassmembers class * implements java.io.Serializable {
    static final long serialVersionUID;
    private static final java.io.ObjectStreamField[] serialPersistentFields;
    !static !transient <fields>;
    private void writeObject(java.io.ObjectOutputStream);
    private void readObject(java.io.ObjectInputStream);
    java.lang.Object writeReplace();
    java.lang.Object readResolve();
}
