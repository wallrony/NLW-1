import React, { useState, useEffect } from 'react';
import { ImageBackground, View, Image, StyleSheet, Text, Alert } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { Feather as Icon } from '@expo/vector-icons';

import Picker, { Item as PickerItem } from 'react-native-picker-select';

import { useNavigation } from '@react-navigation/native';

import { AppLoading } from 'expo';

import { Roboto_400Regular, Roboto_500Medium } from '@expo-google-fonts/roboto';
import { Ubuntu_700Bold, useFonts } from '@expo-google-fonts/ubuntu';

import axios from 'axios';

interface IBGEUF {
  nome: string;
  sigla: string;
}

interface IBGECity {
  nome: string;
}

const Home = () => {
  const navigation = useNavigation();

  const [ufs, setUFs] = useState<IBGEUF[]>([]);
  const [selectedUF, setSelectedUF] = useState<string>("0");
  const [cities, setCities] = useState<IBGECity[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>("0");

  useEffect(() => {
    axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
      setUFs(response.data);
    });
  }, []);

  useEffect(() => {
    if(selectedUF === '0') {
      return;
    }

    axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUF}/municipios`).then(response => {
      setCities(response.data);
    });
  }, [selectedUF]);

  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Ubuntu_700Bold
  });

  if(!fontsLoaded) {
    return <AppLoading />
  }

  function handleNavigatePoints() {
    if(selectedUF === '0' || selectedCity === '0') {
      Alert.alert("Ooooops...", "Você precisa selecionar o estado e cidade primeiro!");
    }
    else {
      navigation.navigate('Points', {
        selected_uf: selectedUF,
        selected_city: selectedCity
      });
    }
  }

  return (
    <ImageBackground
      source={require('./../../assets/home-background.png')}
      imageStyle={{ width: 274, height: 368 }}
      style={styles.container}>
      <View style={styles.main}>
        <Image source={require("./../../assets/logo.png")} />
        <Text style={styles.title}>
          Seu marketplace de coleta de resíduos
        </Text>
        <Text style={styles.description}>
          Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.
        </Text>
      </View>
      
      <View style={styles.footer}>
        <Picker
          style={{
            viewContainer: styles.select,
            placeholder: styles.placeholder
          }}
          items={ufs.map(uf => {
            return { label: uf.nome, value: uf.sigla } as PickerItem;
          })}
          onValueChange={(value, index) => setSelectedUF(value) }
        />
        {
          selectedUF === '0'
            ? <Text style={styles.description}>Selecione o estado</Text>
            : <Picker
                style={{
                  viewContainer: styles.select,
                  placeholder: styles.placeholder
                }}
                items={cities.map(city => {
                  return { label: city.nome, value: city.nome } as PickerItem;
                })}
                onValueChange={(value, index) => setSelectedCity(value)}
              />
        }
        <RectButton style={styles.button} onPress={handleNavigatePoints}>
          <View style={styles.buttonIcon}>
            <Text>
              <Icon name="arrow-right" color="#FFF" size={24} />
            </Text>
          </View>
          <Text style={styles.buttonText}>Entrar</Text>
        </RectButton>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {
    backgroundColor: '#FFF',
    marginTop: 5,
  },

  placeholder: {
    color: 'black',
  },

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});

export default Home;
