import React from "react";
import { Text } from "react-native";
import { colors } from "../theme";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import SubjectsScreen from "../screens/SubjectsScreen";
import TasksScreen from "../screens/TasksScreen";
import TaskDetailScreen from "../screens/TaskDetailScreen";
import TimerScreen from "../screens/TimerScreen";
import StatsScreen from "../screens/StatsScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Stack zagnieżdżony w zakładce „Zadania". DLACZEGO dwa typy nawigacji:
// taby dają szybkie przełączanie sekcji, a stack pozwala wejść „w głąb"
// (lista → szczegóły) z przyciskiem wstecz i przekazaniem parametru taskId.
function TasksStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.white,
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      <Stack.Screen
        name="TasksList"
        component={TasksScreen}
        options={{ title: "Zadania" }}
      />
      <Stack.Screen
        name="TaskDetail"
        component={TaskDetailScreen}
        options={{ title: "Szczegóły zadania" }}
      />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textMuted,
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: colors.white,
          headerTitleStyle: { fontWeight: "bold" },
        }}
      >
        <Tab.Screen
          name="Główna"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <Text style={{ fontSize: 20, color }}>🏠</Text>
            ),
          }}
        />
        <Tab.Screen
          name="Przedmioty"
          component={SubjectsScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <Text style={{ fontSize: 20, color }}>📚</Text>
            ),
          }}
        />
        <Tab.Screen
          name="Zadania"
          component={TasksStack}
          options={{
            // Nagłówek dostarcza zagnieżdżony Stack — wyłączamy nagłówek taba,
            // żeby nie pojawiał się podwójny pasek tytułu.
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <Text style={{ fontSize: 20, color }}>📋</Text>
            ),
          }}
        />
        <Tab.Screen
          name="Timer"
          component={TimerScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <Text style={{ fontSize: 20, color }}>⏱️</Text>
            ),
          }}
        />
        <Tab.Screen
          name="Statystyki"
          component={StatsScreen}
          options={{
            tabBarIcon: ({ color }) => (
              <Text style={{ fontSize: 20, color }}>📊</Text>
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
