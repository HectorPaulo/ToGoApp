import React from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { useTheme } from './context/ThemeProvider';

export default function Settings() {
    const { theme, toggleTheme, colors } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Text style={[styles.title, { color: colors.text }]}>Ajustes</Text>
            <View style={styles.row}>
                <Text style={{ color: colors.text, marginRight: 8 }}>Modo oscuro</Text>
                <Switch value={theme === 'dark'} onValueChange={toggleTheme} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: 40, paddingHorizontal: 20 },
    title: { fontSize: 22, fontWeight: '600', marginBottom: 20 },
    row: { flexDirection: 'row', alignItems: 'center' }
});
