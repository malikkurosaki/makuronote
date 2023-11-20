#!/usr/bin/env node
const fs = require('fs')
const arg = process.argv.splice(2)
const path = require('path')
const { execSync } = require('child_process')


const list_menu = [
    {
        id: "build",
        arg: "-bs",
        des: "build setup",
        act: async function () {
            await generate_manifest()
            await generate_key_properties()
            await generate_grandle()
        }
    },
    {
        id: "build_release",
        arg: "-br",
        des: "build release apk",
        act: async function () {
            console.log("-- Genrate apk")
            execSync('flutter build apk --release', { stdio: "inherit" })
            console.log("++ generate apk success")
        }
    },
    {
        id: "generate_icon",
        arg: "-gi",
        des: "otomatis generate icon",
        act: async function () {
            generate_icon()
        }
    }
]


function help() {
    console.log(
        `
Menu
----------------
${list_menu.map((v) => v.arg + "\t" + v.des).join("\n")}

`
    )
}

async function main() {
    if (arg.length === 0) return help()
    const act = list_menu.find((v) => v.arg === arg[0])
    if (!act) return help()
    await act.act()
}

main()


async function generate_icon() {
    const launcher_fill = `
flutter_launcher_icons:
android: true
ios: true
image_path: "assets/icon/app_icon.png"  
    `
    const pub = fs.readFileSync(path.join(__dirname, "./pubspec.yaml")).toString()
    const asset_dir = fs.existsSync("./assets/icon/app_icon.png")
    if (!asset_dir) return console.log("!! no app_icon.png")
    const package = pub.match('flutter_launcher_icons')
    if (!package) {
        console.log("-- add package flutter_launcher_icons")
        execSync('flutter pub add flutter_launcher_icons', { stdio: "inherit" })
        console.log("++ success")
    }

    const file_launcher = fs.existsSync('flutter_launcher_icons.yaml')
    if (!file_launcher) {
        console.log("-- create flutter_launcher_icons.yaml")
        fs.writeFileSync('flutter_launcher_icons.yaml', launcher_fill, "utf-8")
        console.log("++ success")
    }

    console.log("-- generate icon launcher")
    execSync('dart run flutter_launcher_icons --file flutter_launcher_icons.yaml', { stdio: "inherit" })
    console.log("++ success")

}

async function generate_manifest() {
    let manifest = fs.readFileSync(path.join(__dirname, "./android/app/src/main/AndroidManifest.xml")).toString()
    let f_manifest = manifest.match(`<uses-permission android:name="android.permission.INTERNET"/>`)
    if (f_manifest) return console.log("?? internet permition sudah ada")

    let replcement = `<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-permission android:name="android.permission.INTERNET"/>
    `
    manifest = manifest.replace(`<manifest xmlns:android="http://schemas.android.com/apk/res/android">`, replcement)
    console.log("-- generate manifest")

    await new Promise(r => {
        fs.writeFileSync(path.join(__dirname, "./android/app/src/main/AndroidManifest.xml"), manifest, "utf-8")
        r()
    })
    console.log("++ generate manifest success")
}

async function generate_key_properties() {
    const properties = `
storePassword=makuro123
keyPassword=makuro123
keyAlias=malikkurosaki
storeFile=/Users/bip/Documents/malikkurosaki.jks
`


    return await new Promise((r) => {
        console.log("-- create file key.properties")
        fs.writeFileSync(path.join(__dirname, "./android/key.properties"), properties, "utf-8")
        console.log("++ create key.properties")
        r()
    })
}

async function generate_grandle() {
    const source_gradle = fs.readFileSync(path.join(__dirname, './android/app/build.gradle'),).toString()
    const np = source_gradle.match("namespace.+")[0].replace("namespace ", "")


    const build_gradle = `
plugins {
    id "com.android.application"
    id "kotlin-android"
    id "dev.flutter.flutter-gradle-plugin"
}

def localProperties = new Properties()
def localPropertiesFile = rootProject.file('local.properties')
if (localPropertiesFile.exists()) {
    localPropertiesFile.withReader('UTF-8') { reader ->
        localProperties.load(reader)
    }
}

def flutterVersionCode = localProperties.getProperty('flutter.versionCode')
if (flutterVersionCode == null) {
    flutterVersionCode = '1'
}

def flutterVersionName = localProperties.getProperty('flutter.versionName')
if (flutterVersionName == null) {
    flutterVersionName = '1.0'
}

def keystoreProperties = new Properties()
def keystorePropertiesFile = rootProject.file('key.properties')
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}

android {
    namespace ""
    compileSdkVersion flutter.compileSdkVersion
    ndkVersion flutter.ndkVersion

    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }

    kotlinOptions {
        jvmTarget = '1.8'
    }

    sourceSets {
        main.java.srcDirs += 'src/main/kotlin'
    }

    defaultConfig {
        // TODO: Specify your own unique Application ID (https://developer.android.com/studio/build/application-id.html).
        applicationId ""
        // You can update the following values to match your application needs.
        // For more information, see: https://docs.flutter.dev/deployment/android#reviewing-the-gradle-build-configuration.
        minSdkVersion flutter.minSdkVersion
        targetSdkVersion flutter.targetSdkVersion
        versionCode flutterVersionCode.toInteger()
        versionName flutterVersionName
    }

        signingConfigs {
        release {
            keyAlias keystoreProperties['keyAlias']
            keyPassword keystoreProperties['keyPassword']
            storeFile keystoreProperties['storeFile'] ? file(keystoreProperties['storeFile']) : null
            storePassword keystoreProperties['storePassword']
        }
    }
    
    buildTypes {
        release {
            signingConfig signingConfigs.release
        }
    }
}

flutter {
    source '../..'
}

dependencies {}   
`.replace(`namespace ""`, `namespace ${np}`).replace(`applicationId ""`, `applicationId ${np}`)

    await new Promise(r => {
        console.log("-- create build.gradle")
        fs.writeFileSync(path.join(__dirname, "./android/app/build.gradle"), build_gradle, "utf-8")
        console.log("++ build.gradle success")
    })
}
