import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { LoginScreen } from "../features/auth/screens/LoginScreen";
import { RegisterScreen } from "../features/auth/screens/RegisterScreen";
import { TaskDetailScreen } from "../features/tasks/screens/TaskDetailScreen";
import { TaskEditorScreen } from "../features/tasks/screens/TaskEditorScreen";
import { useAuthStore } from "../store/authStore";
import { AppTabs } from "./AppTabs";
import { AppStackParamList, AuthStackParamList } from "./types";

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const AppStack = createNativeStackNavigator<AppStackParamList>();

export const RootNavigator = () => {
  const user = useAuthStore((state) => state.user);
  const hydrated = useAuthStore((state) => state.hydrated);

  if (!hydrated) return null;

  return (
    user ? (
      <AppStack.Navigator screenOptions={{ headerShown: false }}>
        <AppStack.Screen name="AppTabs" component={AppTabs} />
        <AppStack.Screen name="TaskEditor" component={TaskEditorScreen} />
        <AppStack.Screen name="TaskDetail" component={TaskDetailScreen} />
      </AppStack.Navigator>
    ) : (
      <AuthStack.Navigator screenOptions={{ headerShown: false }}>
        <AuthStack.Screen name="Login">
          {({ navigation }) => <LoginScreen onGoSignup={() => navigation.navigate("Register")} />}
        </AuthStack.Screen>
        <AuthStack.Screen name="Register">
          {({ navigation }) => <RegisterScreen onGoLogin={() => navigation.navigate("Login")} />}
        </AuthStack.Screen>
      </AuthStack.Navigator>
    )
  );
};
