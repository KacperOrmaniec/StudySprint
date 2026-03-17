import React from "react";
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
      <Tab.Navigator>
        <Tab.Screen name="Główna" component={HomeScreen} />
        <Tab.Screen name="Zadania" component={TasksScreen} />
        <Tab.Screen name="Timer" component={TimerScreen} />
        <Tab.Screen name="Statystyki" component={StatsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
