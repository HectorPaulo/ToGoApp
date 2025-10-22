import React from "react";
import { Image, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { useTheme } from './context/ThemeProvider';

export default function Index() {
  const { colors } = useTheme();

  return (
    <SafeAreaView
      style={[styles.root, { backgroundColor: colors.background }]}
    >
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>¡Estás al inicio de la aplicación!</Text>
        <Image
          source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNQ8Nq6Nl2Y3LZDNuPskbiacqy5Psb_mEVyw&s' }}
          style={{ width: 200, height: 320, marginTop: 16 }}
        />
      </View>
    </SafeAreaView>
  );

}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 18, fontWeight: '600' }
});