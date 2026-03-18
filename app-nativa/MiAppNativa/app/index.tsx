// app/index.tsx

import { Link } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🌍 PMAC/EMAC - TGP</Text>
        <Text style={styles.subtitle}>
          Sistema de Gestión de Información Ambiental
        </Text>
      </View>

      <View style={styles.menu}>
        <Link href="/users" asChild>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuIcon}>👥</Text>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>Usuarios</Text>
              <Text style={styles.menuDescription}>
                Gestión de usuarios del sistema
              </Text>
            </View>
          </TouchableOpacity>
        </Link>

        <TouchableOpacity style={[styles.menuItem, styles.disabled]}>
          <Text style={styles.menuIcon}>📊</Text>
          <View style={styles.menuTextContainer}>
            <Text style={styles.menuTitle}>Monitoreo</Text>
            <Text style={styles.menuDescription}>
              Próximamente - Monitoreo geotécnico
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.menuItem, styles.disabled]}>
          <Text style={styles.menuIcon}>🌱</Text>
          <View style={styles.menuTextContainer}>
            <Text style={styles.menuTitle}>Educación Ambiental</Text>
            <Text style={styles.menuDescription}>
              Próximamente - Programas educativos
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>v1.0.0 - David Mamani © 2026</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#0070f3',
    padding: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    opacity: 0.9,
  },
  menu: {
    padding: 20,
    gap: 16,
  },
  menuItem: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  disabled: {
    opacity: 0.6,
  },
  menuIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  menuDescription: {
    fontSize: 14,
    color: '#666',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    color: '#999',
    fontSize: 12,
  },
});