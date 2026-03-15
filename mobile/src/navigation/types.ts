export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type AppTabParamList = {
  Inbox: undefined;
  Today: undefined;
  Upcoming: undefined;
  Projects: undefined;
  Analytics: undefined;
  Focus: undefined;
  Trash: undefined;
  Settings: undefined;
  Profile: undefined;
};

export type AppStackParamList = {
  AppTabs: undefined;
  TaskEditor: { taskId?: string } | undefined;
  TaskDetail: { taskId: string };
};
