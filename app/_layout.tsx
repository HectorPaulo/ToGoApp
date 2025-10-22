import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from "react";
import { ThemeProvider, useTheme } from './context/ThemeProvider';

const tabs = [
  { name: 'index', title: 'Inicio', icon: 'home' },
  { name: 'lugares', title: 'Lugares', icon: 'list' },
  { name: 'add', title: 'Agregar', icon: 'add' },
  { name: 'settings', title: 'Configuración', icon: 'settings' },
];

export default function RootLayout() {
  return (
    <ThemeProvider>
      <InnerTabs />
    </ThemeProvider>
  );
}

function InnerTabs() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text,
      }}
    >
      {tabs.map((t) => (
        <Tabs.Screen
          key={t.name}
          name={t.name}
          options={{
            title: t.title, tabBarIcon: ({ color, size }) => (
              <Ionicons name={t.icon as any} size={size} color={color} />
            )
          }}
        />
      ))}
    </Tabs>
  );
}
