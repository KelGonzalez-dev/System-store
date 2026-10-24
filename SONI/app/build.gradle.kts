import java.util.Properties

plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
    alias(libs.plugins.ksp)
}

// Clave de Gemini leída de local.properties (ese archivo no se sube a git).
val localProps = Properties().apply {
    val file = rootProject.file("local.properties")
    if (file.exists()) file.inputStream().use { load(it) }
}

android {
    namespace = "com.soni.assistant"
    compileSdk = 36

    defaultConfig {
        applicationId = "com.soni.assistant"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"

        // El SDK de Spotify (auth) exige estos placeholders en su manifiesto; es el redirect de SONI.
        manifestPlaceholders["redirectSchemeName"] = "soni"
        manifestPlaceholders["redirectHostName"] = "callback"

        buildConfigField("String", "GEMINI_API_KEY", "\"${localProps.getProperty("GEMINI_API_KEY", "")}\"")
        buildConfigField("String", "GEMINI_MODEL", "\"${localProps.getProperty("GEMINI_MODEL", "gemini-2.5-flash")}\"")
        buildConfigField("String", "SPOTIFY_CLIENT_ID", "\"${localProps.getProperty("SPOTIFY_CLIENT_ID", "")}\"")
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }
    kotlinOptions {
        jvmTarget = "11"
    }
    buildFeatures {
        compose = true
        buildConfig = true
    }
}

// Room exporta el esquema de cada versión de la base de datos para poder escribir migraciones.
ksp {
    arg("room.schemaLocation", "$projectDir/schemas")
}

dependencies {

    implementation(libs.androidx.core.ktx)
    implementation("androidx.lifecycle:lifecycle-viewmodel-ktx:2.8.7")
    implementation(libs.androidx.lifecycle.runtime.ktx)
    implementation(libs.androidx.activity.compose)
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.ui)
    implementation(libs.androidx.ui.graphics)
    implementation(libs.androidx.ui.tooling.preview)
    implementation(libs.androidx.material3)
    implementation(libs.vosk.android)
    // Extrae el texto de los PDF para leerlos en voz alta.
    implementation("com.tom-roush:pdfbox-android:2.0.27.0")
    // Para leer la orientación de las fotos (EXIF) al describirlas.
    implementation("androidx.exifinterface:exifinterface:1.3.7")

    // SDK de Spotify (reproducir la canción exacta por debajo). El .aar va en app/libs/.
    implementation(fileTree(mapOf("dir" to "libs", "include" to listOf("*.aar"))))
    implementation("com.spotify.android:auth:2.1.1")
    // El App Remote de Spotify usa Gson por dentro, pero no lo trae; hay que añadirlo.
    implementation("com.google.code.gson:gson:2.10.1")

    // Cámara: tomar fotos y grabar video por detrás (CameraX).
    implementation("androidx.camera:camera-core:1.3.4")
    implementation("androidx.camera:camera-camera2:1.3.4")
    implementation("androidx.camera:camera-lifecycle:1.3.4")
    implementation("androidx.camera:camera-video:1.3.4")
    implementation("androidx.lifecycle:lifecycle-process:2.8.7")
    // Desbloqueo con huella/rostro al abrir apps con el teléfono bloqueado.
    implementation("androidx.biometric:biometric:1.1.0")
    implementation("androidx.fragment:fragment-ktx:1.8.5")
    implementation(libs.androidx.datastore.preferences)
    implementation(libs.androidx.room.runtime)
    implementation(libs.androidx.room.ktx)
    ksp(libs.androidx.room.compiler)
    testImplementation(libs.junit)
    androidTestImplementation(libs.androidx.junit)
    androidTestImplementation(libs.androidx.espresso.core)
    androidTestImplementation(platform(libs.androidx.compose.bom))
    androidTestImplementation(libs.androidx.ui.test.junit4)
    debugImplementation(libs.androidx.ui.tooling)
    debugImplementation(libs.androidx.ui.test.manifest)
}