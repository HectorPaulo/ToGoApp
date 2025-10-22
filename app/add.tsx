import { ToGoType } from '@/.expo/types/ToGo';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, Keyboard, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from './context/ThemeProvider';

const Add = () => {
  const router = useRouter();
  const { colors } = useTheme();
  // Start with an empty list, then load stored items on mount
  const [togos, setTogos] = useState<ToGoType[]>([]);
  const [togoText, setTogoText] = useState<string>('');

  // Load existing togos from AsyncStorage when the screen mounts
  React.useEffect(() => {
    const load = async () => {
      try {
        const stored = await AsyncStorage.getItem('my-togo');
        if (stored) {
          const parsed: ToGoType[] = JSON.parse(stored);
          setTogos(parsed);
        }
      } catch (e) {
        console.log('Error loading stored togos', e);
      }
    };
    load();
  }, []);

  const addTogo = async () => {
    if (!togoText || togoText.trim() === '') return;

    try {
      const newTogo: ToGoType = {
        id: Date.now(),
        title: togoText.trim(),
        isDone: false,
      };

      // create a new array rather than mutating the existing one
      const newTogos = [...togos, newTogo];
      setTogos(newTogos);
      await AsyncStorage.setItem('my-togo', JSON.stringify(newTogos));
      setTogoText('');
      Keyboard.dismiss();
      router.navigate('/');
    } catch (e) {
      alert("Error: " + e);
    }
  }

  // (no refresh logic needed on Add screen)
  return (
    <SafeAreaView
      style={[styles.rootContainer, { backgroundColor: colors.background }]}
    >
      {/* apply theme */}
      {/* Note: useTheme below to avoid hooks at top-level causing reorder on earlier code */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.navigate('/')}
          activeOpacity={0.2}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          delayLongPress={500}
          delayPressIn={0}
          delayPressOut={100}
          pressRetentionOffset={{ top: 20, left: 20, bottom: 20, right: 20 }}
          accessibilityLabel={'Descriptive label'}
          accessibilityRole={'button'}
          accessibilityState={{ disabled: false }}
        >
          <Ionicons name="chevron-back" size={34} color={colors.text} />
        </TouchableOpacity>
        <Image
          source={{ uri: 'http://github.com/HectorPaulo.png' }}
          style={{ width: 40, height: 40, borderRadius: 20 }}
        />
      </View>
      <View style={styles.footer}>
        <TextInput
          style={[styles.newTogoInput, { backgroundColor: colors.card, color: colors.text }]}
          value={togoText}
          onChangeText={(text) => setTogoText(text)}
          placeholder={'Nuevo lugar a agregar'}
          placeholderTextColor={'#999'}
          keyboardType={'default'}
          secureTextEntry={false}
          autoCapitalize={'none'}
          autoCorrect={true}
          autoFocus={false}
          editable={true}
          maxLength={100}
          multiline={false}
          numberOfLines={1}
          onBlur={() => console.log('Input blurred')}
          onFocus={() => console.log('Input focused')}
          onSubmitEditing={() => console.log('Input submitted')}
          returnKeyType={'done'}
          selectTextOnFocus={false}
          clearButtonMode={'always'}
          textAlign={'left'}
          textContentType={'none'}
        />
        <TouchableOpacity style={[styles.newTogoButton, { backgroundColor: colors.primary }]} onPress={addTogo}>
          <Ionicons name="checkmark" size={24} color={'#fff'} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Add;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
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
  newTogoButton: {
    backgroundColor: '#25702aff',
    padding: 8,
    borderRadius: 50,
    marginLeft: 20
  },
})