# dependency

```gradle
// Top-level build file where you can add configuration options common to all sub-projects/modules.

buildscript {
    repositories {
        google()
        jcenter()
        
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:3.3.2'
        classpath 'com.google.gms:google-services:4.2.0'


        // NOTE: Do not place your application dependencies here; they belong
        // in the individual module build.gradle files
    }
}

allprojects {
    repositories {
        google()
        jcenter()
        maven { url = 'https://jitpack.io' }

    }
}

task clean(type: Delete) {
    delete rootProject.buildDir
}
```


### app gradle


```gradle
apply plugin: 'com.android.application'
apply plugin: 'com.google.gms.google-services'


android {
    compileSdkVersion 29
    buildToolsVersion '29.0.2'
    defaultConfig {
        applicationId "probus.malikkurosaki.probussystem"
        minSdkVersion 22
        targetSdkVersion 29
        versionCode 2
        versionName "2.0"
        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
    }
    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }

    }
    compileOptions {
        sourceCompatibility = '1.8'
        targetCompatibility = '1.8'
    }
    
    /*
    compileOptions {
    sourceCompatibility JavaVersion.VERSION_1_8
    targetCompatibility JavaVersion.VERSION_1_8
  }
  */
  
}

dependencies {
    implementation fileTree(dir: 'libs', include: ['*.jar'])
    implementation 'androidx.appcompat:appcompat:1.0.2'
    implementation 'androidx.constraintlayout:constraintlayout:2.0.0-beta2'



    testImplementation 'junit:junit:4.12'
    androidTestImplementation 'androidx.test:runner:1.3.0-alpha02'
    androidTestImplementation 'androidx.test.espresso:espresso-core:3.3.0-alpha02'

    // firebase
    implementation 'com.google.firebase:firebase-core:17.2.0'
    implementation 'com.google.firebase:firebase-messaging:20.0.0'
    implementation 'com.google.firebase:firebase-auth:19.1.0'
    implementation 'com.google.firebase:firebase-database:19.1.0'
    implementation 'com.firebaseui:firebase-ui-auth:4.3.1'

    //tambahan
    implementation 'androidx.gridlayout:gridlayout:1.0.0'
    implementation 'androidx.recyclerview:recyclerview:1.1.0-beta03'
    implementation 'androidx.annotation:annotation:1.1.0'
    implementation 'com.google.android.material:material:1.1.0-alpha09'
    implementation 'androidx.browser:browser:1.0.0'
    implementation 'androidx.cardview:cardview:1.0.0'
// tulisan jadi suara
    implementation 'com.mapzen.android:speakerbox:1.4.1'
    // yoyo
    implementation 'com.daimajia.androidanimations:library:2.3@aar'
    // retrofit
    implementation 'com.squareup.retrofit2:converter-gson:2.6.1'
    implementation 'com.timqi.sectorprogressview:library:2.0.1'
    implementation 'com.google.code.gson:gson:2.8.5'
    implementation 'com.github.smart-fun:XmlToJson:1.4.5'
    // pie view
    implementation 'com.white:progressview:1.0.1'
    // wave progress
    implementation 'me.itangqi.waveloadingview:library:0.3.5'
    // folding view
    implementation 'com.ramotion.foldingcell:folding-cell:1.2.3'
    // butter knife
    implementation 'com.jakewharton:butterknife:10.1.0'
    annotationProcessor 'com.jakewharton:butterknife-compiler:10.1.0'
    // support design
    implementation 'com.google.android.material:material:1.1.0-alpha09'
    // emoji
    implementation 'com.rockerhieu.emojicon:library:1.3.3'
    // live animation
    implementation 'com.github.ibrahimsn98:android-particles:1.5'

    // slide unlock
    implementation 'com.ncorti:slidetoact:0.7.0'

    // chart view
    implementation 'com.github.lecho:hellocharts-android:v1.5.8'

    //date picker
    implementation 'com.github.florent37:singledateandtimepicker:2.1.4'

    // chache controll
    implementation 'com.ncornette.cache:okcache-control:1.1.1'

    // dougnut chart
    implementation 'com.github.PhilJay:MPAndroidChart:v3.1.0'

    // stack progress view
    implementation 'devlight.io:arcprogressstackview:1.0.4'

    // typing effect
    implementation 'com.krsticdragan:autotypetextview:1.1'

    // like button
    implementation 'com.github.jd-alexander:LikeButton:0.2.3'

    // supplort fragment
    implementation 'androidx.fragment:fragment:1.1.0'

    // animasi gif
    implementation 'pl.droidsonroids.gif:android-gif-drawable:1.2.3'

    //picaso
    implementation 'com.squareup.picasso:picasso:2.71828'
    
    // room database
    implementation "androidx.room:room-runtime:2.2.0"
    annotationProcessor "androidx.room:room-compiler:2.2.0"
    
    
    //json konverter
    implementation 'org.glassfish:javax.annotation:10.0-b28'
    implementation 'com.google.code.gson:gson:2.8.6'


    // tambahan excel reader
    implementation "org.apache.poi:poi:3.17"
    implementation "org.apache.poi:poi-ooxml:3.17"

}
```


### manifest

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="probus.malikkurosaki.probussystem">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.RECORD_AUDIO" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />

    <application
        android:allowBackup="true"
        android:fullBackupContent="true"
        android:hardwareAccelerated="false"
        android:icon="@mipmap/ic_launcherp"
        android:label="@string/app_name"
        android:largeHeap="true"
        android:roundIcon="@mipmap/ic_launcherp_round"
        android:supportsRtl="true"
        android:theme="@style/AppTheme"
        android:windowSoftInputMode="adjustResize|adjustPan">
        <activity android:name=".Helper_login"></activity>
        <activity android:name=".NewProbus_layout" />

        <service
            android:name=".Service_Probus"
            android:enabled="true" />

        <activity android:name=".Activity_Hiburan" />
        <activity android:name=".Activity_User" />
        <activity android:name=".Activity_Probus_Menu" />
        <activity android:name=".Activity_splash">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <action android:name="android.intent.action.VIEW" />

                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
        <activity android:name=".Activity_Probus" />
        <activity android:name=".MainActivity">
            <intent-filter>
                <action android:name="PROBUS_NOTIFICATION" />

                <category android:name="android.intent.category.DEFAULT" />
            </intent-filter>
        </activity>

        <service
            android:name=".Class_MyMessagingService"
            android:enabled="true"
            android:permission="true">
            <intent-filter>
                <action android:name="com.google.firebase.MESSAGING_EVENT" />
            </intent-filter>
        </service>
    </application>

</manifest>
```

### stylensya

```xml
<resources>

    <!-- Base application theme. -->
    <style name="AppTheme" parent="Theme.AppCompat.Light.NoActionBar">
        <!-- Customize your theme here. -->
        <item name="android:fontFamily">@font/roboto</item>
        <item name="colorPrimary">@color/colorPrimary</item>
        <item name="colorPrimaryDark">@color/colorPrimaryDark</item>
        <item name="colorAccent">@color/colorAccent</item>
    </style>

    <style name="DialogFragment_custom" parent="android:Theme">
        <item name="android:windowNoTitle">true</item>
        <item name="android:windowFullscreen">true</item>
        <item name="android:windowIsFloating">false</item>
    </style>

    <style name="ToolBarStyle" parent="Theme.AppCompat.Light.NoActionBar">
        <item name="android:textColorPrimary">@color/colorPutih</item>
        <item name="android:textColorSecondary">@color/colorPutih</item>
        <item name="android:colorAccent">@color/colorPutih</item>
        <item name="android:textSize">12sp</item>
        <item name="android:backgroundTint">@color/colorBg1_transparant</item>
    </style>

</resources>

```
