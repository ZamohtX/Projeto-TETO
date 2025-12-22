import React, {useState} from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import api from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Definimos uma "prop" para receber a função de atualizar a tela principal
interface Props {
    onSucess: () => void;
}


export default function CreateHouse({onSucess}: Props){
    const [houseName, setHouseName] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleCreateHouse() {
        if (!houseName.trim()){
            Alert.alert("Ops", "Dê umm nome para a sua república");
            return;
        }
        
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('@teto_token');

            await api.post('/houses', {
                name: houseName
            }, {
                headers: { Authorization: `Bearer ${token}`} // Enviando o Crachá
            });

            Alert.alert("Sucesso!", `${houseName} foi criada.`);
            onSucess();;
        
        } catch (error) {
            console.error(error);
            Alert.alert("Erro", "Não foi possivel criar o teto. Tente novamente");
        } finally {
            setLoading(false);
        }
    }


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Novo Teto</Text>
            <Text style={styles.subtitle}>Dê um nome para seu novo Teto</Text>

            <TextInput
                style={styles.input}
                placeholder='Ex: Toca do TATU'
                value={houseName}
                onChangeText={setHouseName}
            />

            <TouchableOpacity
                style={styles.button}
                onPress={handleCreateHouse}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#FFF"/>
                ) : (
                    <Text style={styles.buttonText}>Criar Casa</Text>
                )}  
            </TouchableOpacity>            
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#FFF',
        borderRadius: 10,
        margin: 20,
        alignItems: 'center',
        shadowColor: '#000',
        elevation: 3,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#333',
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 8,
        padding: 12,
        marginBottom: 15,
        backgroundColor: '#FAFAFA',
    },
    button: {
        backgroundColor: '#4F46E5',
        width: '100%',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFF',
        fontWeight: 'bold',
    }
});









