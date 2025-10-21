import { Ionicons } from "@expo/vector-icons";
import { Checkbox } from 'expo-checkbox';
import React, { useEffect, useState } from "react";
import { FlatList, Image, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from '@react-native-async-storage/async-storage';

type ToGoType = {
  id: number;
  title: string;
  isDone: boolean;
}

export default function Index() {
  const [togos, setTogos] = useState<ToGoType[]>([]);
  const [togoText, setTogoText] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [oldTogos, setOldTogos] = useState<ToGoType[]>([]);

  useEffect(() => {
    const getTogos = async() => {
      try {
        const togos = await AsyncStorage.getItem('my-togo');
        if ( togos !== null ) {
          setTogos(JSON.parse(togos));
          setOldTogos(JSON.parse(togos));
        }
      } catch (e) {
        console.log(e);
      }
    };
    getTogos();
  }, [])
  

  const addTogo = async () => {
    if (!togoText || togoText.trim() === '') return;

    try {
      const newTogo: ToGoType = {
        id: Date.now(),
        title: togoText.trim(),
        isDone: false,
      };
      togos.push(newTogo);
      setTogos(togos);
      setOldTogos(togos);
      await AsyncStorage.setItem('my-togo', JSON.stringify(togos));
      setTogoText('');
      Keyboard.dismiss();
    } catch (error) {
      console.log(error);
    }
  }

  const deleteTogo = async(id: number) => {
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
    if (query == '') {
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
  }, [searchQuery]);
  
  return (

    <SafeAreaView
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => { alert('Clicked') }}>
          <Ionicons name="menu" size={24} color='#333' />
        </TouchableOpacity>
        <Image
          source={{ uri: 'http://github.com/HectorPaulo.png' }}
          style={{ width: 40, height: 40, borderRadius: 20 }}
        />
      </View>

      <View style={styles.searchBar}>
        <Ionicons name="search" size={24} color={'#333'} />
        <TextInput
          placeholder="Search"
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
          style={styles.searchInput}
          clearButtonMode="always"
        />
      </View>

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
        <TextInput
          onChangeText={(text) => setTogoText(text)}
          value={togoText}
          style={styles.newTogoInput}
          placeholder="Agregar lugar" />
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => addTogo()}
        >
          <Ionicons name="add" size={34} color={'#fff'} />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const TogoItem = ({ 
  togo, 
  deleteTogo,
  handleDone, 
}: { 
  togo: ToGoType, 
  deleteTogo: (id: number) => void,
  handleDone: (id: number) => void
}) => {
  return (
    <View
      style={styles.togoContainer}
    >
      <View
        style={styles.togoInfoContainer}
      >
        <Checkbox 
        value={togo.isDone} 
        onValueChange={() => handleDone(togo.id)}
        color={togo.isDone 
        ? "#322a6aff" 
        : undefined} />
        <Text style={[styles.togoText, togo.isDone && { textDecorationLine: 'line-through' }]}>{togo.title}</Text>
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
    backgroundColor: '#322a6aff',
    padding: 8,
    borderRadius: 10,
    marginLeft: 20
  },
});