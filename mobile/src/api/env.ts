import { Platform } from "react-native";

const LOCAL_BASE_URL = Platform.select({
  android: "http://10.0.2.2:5001/api",
  default: "http://localhost:5001/api",
});

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? LOCAL_BASE_URL;

export const env = {
  apiBaseUrl: API_BASE_URL,
};
