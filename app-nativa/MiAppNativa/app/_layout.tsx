// app/_layout.tsx

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#0070f3',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen 
          name="index" 
          options={{ 
            title: 'Mi App Nativa - TGP',
            headerTitleAlign: 'center',
          }} 
        />
        <Stack.Screen 
          name="users/index"
          options={{ 
            title: 'Usuarios',
            headerTitleAlign: 'center',
          }} 
        />
        <Stack.Screen 
          name="users/[id]"
          options={{ 
            title: 'Detalle de Usuario',
            headerTitleAlign: 'center',
          }} 
        />
        <Stack.Screen 
          name="create-user"
          options={{ 
            title: 'Crear Usuario',
            headerTitleAlign: 'center',
          }} 
        />
      </Stack>
    </>
  );
}