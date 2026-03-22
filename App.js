import React from "react";
import { Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./src/screens/HomeScreen";
import TasksScreen from "./src/screens/TasksScreen";
import TimerScreen from "./src/screens/TimerScreen";
import StatsScreen from "./src/screens/StatsScreen";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: "#4a90e2",
          tabBarInactiveTintColor: "#999",
          headerStyle: { backgroundColor: "#4a90e2" },
          headerTintColor: "#fff",
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
          name="Zadania"
          component={TasksScreen}
          options={{
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
