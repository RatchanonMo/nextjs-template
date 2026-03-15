import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { AnalyticsScreen } from "../features/analytics/screens/AnalyticsScreen";
import { FocusPlannerScreen } from "../features/productivity/screens/FocusPlannerScreen";
import { ProjectsScreen } from "../features/projects/screens/ProjectsScreen";
import { ProfileScreen } from "../features/settings/screens/ProfileScreen";
import { SettingsScreen } from "../features/settings/screens/SettingsScreen";
import { InboxScreen } from "../features/tasks/screens/InboxScreen";
import { TodayScreen } from "../features/tasks/screens/TodayScreen";
import { TrashScreen } from "../features/tasks/screens/TrashScreen";
import { UpcomingScreen } from "../features/tasks/screens/UpcomingScreen";
import { colors } from "../theme/tokens";
import { AppTabParamList } from "./types";

const Tab = createBottomTabNavigator<AppTabParamList>();

const iconMap: Record<keyof AppTabParamList, keyof typeof Ionicons.glyphMap> = {
  Inbox: "mail-outline",
  Today: "today-outline",
  Upcoming: "calendar-outline",
  Projects: "layers-outline",
  Analytics: "bar-chart-outline",
  Focus: "timer-outline",
  Trash: "trash-outline",
  Settings: "settings-outline",
  Profile: "person-circle-outline",
};

export const AppTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          borderTopColor: "rgba(17,24,39,0.08)",
          backgroundColor: "rgba(255,255,255,0.95)",
          height: 64,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarIcon: ({ color, size }) => {
          const name = iconMap[route.name as keyof AppTabParamList];
          return <Ionicons name={name} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Inbox" component={InboxScreen} />
      <Tab.Screen name="Today" component={TodayScreen} />
      <Tab.Screen name="Upcoming" component={UpcomingScreen} />
      <Tab.Screen name="Projects" component={ProjectsScreen} />
      <Tab.Screen name="Analytics" component={AnalyticsScreen} />
      <Tab.Screen name="Focus" component={FocusPlannerScreen} />
      <Tab.Screen name="Trash" component={TrashScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};
