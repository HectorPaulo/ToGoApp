/* eslint-disable react-hooks/exhaustive-deps */
import { ToGoType } from '@/.expo/types/ToGo';
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Checkbox } from 'expo-checkbox';
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Image, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableHighlight, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from './context/ThemeProvider';


export default function Lugares() {
    const [togos, setTogos] = useState<ToGoType[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [oldTogos, setOldTogos] = useState<ToGoType[]>([]);
    const router = useRouter();
    // colorScheme not used; theme comes from useTheme inside components
    const { colors } = useTheme();

    useEffect(() => {
        const getTogos = async () => {
            try {
                const togos = await AsyncStorage.getItem('my-togo');
                if (togos !== null) {
                    setTogos(JSON.parse(togos));
                    setOldTogos(JSON.parse(togos));
                }
            } catch (e) {
                console.log(e);
            }
        };
        getTogos();
    }, [])

    const deleteTogo = async (id: number) => {
        try {
            const newTogos = togos.filter((togo) => togo.id !== id);
            await AsyncStorage.setItem("my-togo", JSON.stringify(newTogos));
            setTogos(newTogos);
            setOldTogos(newTogos);
        } catch (e) {
            console.log(e);
        }
    }

    const handleDone = async (id: number) => {
        try {
            const newTogos = togos.map((togo) => {
                if (togo.id === id) {
                    togo.isDone = !togo.isDone;
                }
                return togo;
            });
            await AsyncStorage.setItem("my-togo", JSON.stringify(newTogos));
            setTogos(newTogos);
            setOldTogos(newTogos);
        } catch (e) {
            console.log("Error: ", e);
        }
    }

    const onSearch = (query: string) => {
        if (query === '') {
            setTogos(oldTogos);
        } else {

            const filteredTogos = togos.filter((todo) =>
                todo.title.toLowerCase().includes(query.toLowerCase())
            );
            setTogos(filteredTogos);
        }
    };

    useEffect(() => {
        onSearch(searchQuery);
    }, [onSearch, searchQuery]);

    return (

        <SafeAreaView
            style={[styles.container, { backgroundColor: colors.background }]}
        >
            <View style={styles.header}>
                <TouchableOpacity onPress={() => { alert('Clicked') }}>
                    <Ionicons name="menu" size={24} color={colors.text} />
                </TouchableOpacity>
                <Image
                    source={{ uri: 'http://github.com/HectorPaulo.png' }}
                    style={{ width: 40, height: 40, borderRadius: 20 }}
                />
            </View>

            <View style={[styles.searchBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Ionicons name="search" size={24} color={colors.text} />
                <TextInput
                    placeholder="Buscar"
                    value={searchQuery}
                    onChangeText={(text) => setSearchQuery(text)}
                    style={styles.searchInput}
                    clearButtonMode="always"
                />
            </View>

            {togos.length === 0 && (
                <View style={{ alignItems: 'center', marginTop: 50 }}>
                    <Text style={{ fontSize: 18, color: colors.text }}>No hay lugares agregados.</Text>
                    <Text style={{ fontSize: 16, color: colors.text, opacity: 0.7, marginTop: 10 }}>Agrega un lugar para empezar la lista.</Text>
                </View>
            )}
            <FlatList
                data={[...togos].reverse()}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TogoItem togo={item} deleteTogo={deleteTogo} handleDone={handleDone} />
                )}
            />
            <KeyboardAvoidingView
                behavior="padding"
                keyboardVerticalOffset={10}
                style={styles.footer}
            >
                {/* <TextInput
          onChangeText={(text) => setTogoText(text)}
          value={togoText}
          style={styles.newTogoInput}
          placeholder="Agregar lugar" />
         */}
            </KeyboardAvoidingView>
            {/* <TouchableOpacity
        style={styles.addButton}
        onPress={() => addTogo()}
      > */}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: '#f5f5f5'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    searchBar: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingVertical: Platform.OS === 'ios' ? 16 : 8,
        borderRadius: 10,
        gap: 10,
        marginBottom: 20,
        alignItems: 'center',
    },
    searchInput: {
        flex: 1,
    },
    togoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 10,
        marginBottom: 20,
    },
    togoInfoContainer: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center'
    },
    togoText: {
        fontSize: 16,
        color: '#333',
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    newTogoInput: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 10,
        fontSize: 16,
        color: '#333'
    },
    addButton: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        backgroundColor: '#322a6aff',
        padding: 8,
        borderRadius: 50,
        marginLeft: 20
    },
});

const TogoItem = ({
    togo,
    deleteTogo,
    handleDone,
}: {
    togo: ToGoType,
    deleteTogo: (id: number) => void,
    handleDone: (id: number) => void
}) => {
    const { colors } = useTheme();
    return (
        <View
            style={[styles.togoContainer, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
            <View
                style={styles.togoInfoContainer}
            >
                <Checkbox
                    value={togo.isDone}
                    onValueChange={() => handleDone(togo.id)}
                    color={togo.isDone
                        ? colors.primary
                        : undefined} />
                <Text style={[styles.togoText, { color: colors.text }, togo.isDone && { textDecorationLine: 'line-through' }]}>{togo.title}</Text>
            </View>
            <TouchableOpacity onPress={() => {
                deleteTogo(togo.id);
                alert(togo.title + " ha sido borrado de la lista.");
            }}
            >
                <Ionicons name="trash" size={24} color={'red'} />
            </TouchableOpacity>
        </View>
    );
}