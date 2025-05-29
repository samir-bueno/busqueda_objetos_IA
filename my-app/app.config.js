import 'dotenv/config';

export default {
  expo: {
    name: "Busqueda de Objetos con IA",
    slug: "object-hunt-mobile",
    version: "1.0.0",
    orientation: "portrait",
    userInterfaceStyle: "light",
    scheme: "object-hunt-mobile",
    platforms: ["ios", "android", "web"],
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      infoPlist: {
        NSCameraUsageDescription: "Esta aplicación necesita acceso a la cámara para tomar fotos de objetos.",
        NSPhotoLibraryUsageDescription: "Esta aplicación necesita acceso a la galería para guardar fotos."
      }
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#ffffff"
      },
      permissions: [
        "android.permission.CAMERA",
        "android.permission.RECORD_AUDIO",
        "android.permission.WRITE_EXTERNAL_STORAGE"
      ]
    },
    plugins: [
      [
        "expo-camera",
        {
          cameraPermission: "Permitir que $(PRODUCT_NAME) acceda a tu cámara",
          microphonePermission: "Permitir que $(PRODUCT_NAME) acceda a tu micrófono",
          recordAudioAndroid: true
        }
      ],
      "expo-router"
    ],
    sdkVersion: "53.0.0",
    extra: {
      huggingFaceToken: process.env.HUGGING_FACE_TOKEN,
    }
  }
};