import React, { useState, useEffect, ChangeEvent} from 'react';
import { View, ImageBackground, Text, Image, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { RectButton, TextInput } from 'react-native-gesture-handler'
import { Feather as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';

interface IBGEUFResponse{
    sigla: string;
}

interface IBGECityResponse{
    nome: string;
}


const Home = () => {
    const navigation = useNavigation();
    const [selectedUf, setSelectedUf] = useState('');
	const [selectedCity, setSelectedCity] = useState('');
	const [ufs, setUfs] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);

    function handleNavigateToPoints(){
		console.log({
			selectedUf,
			selectedCity
		});

		navigation.navigate('Points', {
			uf: selectedUf,
			city: selectedCity
		});
    }

    useEffect(() => {
      axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
			const ufinitials = response.data.map(uf => uf.sigla);

			setUfs(ufinitials);
		});
	}, []);

	useEffect(() => {
		if(selectedUf === '0'){
			return;
		}

		axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`).then(response => {
		const cityNames = response.data.map(city => city.nome);

		setCities(cityNames);
	});
	}, [selectedUf])

    return (
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ImageBackground source={require('../../assets/home-background.png')} style={styles.container} imageStyle={{ width: 274, height: 368}}>
            <View style={styles.main}>
              <Image source={require('../../assets/logo.png')}/>
              <View>
                <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
                <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente</Text>
              </View>
            </View>
          
            <View style={styles.footer}>
				<RNPickerSelect
					style={styles.select}
					onValueChange={setSelectedUf}
					items={ufs.map((uf: string) => {
						return {
							label: uf,
							value: uf,
							key: uf,
						}
					})}
				/>
				<RNPickerSelect
					style={styles.select}
					onValueChange={setSelectedCity}
					items={cities.map((city: string) => {
						return {
							label: city,
							value: city,
							key: city,
						}
					})}
				/>
				<RectButton style={styles.button} onPress={handleNavigateToPoints}>
					<View style={styles.buttonIcon}>
					<Icon name="arrow-right" color="#FFF" size={24} />
					</View>
					<Text style={styles.buttonText}>
					Entrar
					</Text>
				</RectButton>
            </View>
        </ImageBackground>
      </KeyboardAvoidingView>
    );
};

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
  
    select: {},
  
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