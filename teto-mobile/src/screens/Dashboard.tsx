import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity, Alert } from 'react-native';
import api from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Member {
  id: string;
  name: string;
  points: number;
}

interface House {
  id: string;
  name: string;
  inviteCode: string;
  users: Member[];
}

interface Props {
  onLogout: () => void;
}

export default function Dashboard({ onLogout }: Props) {
  const [house, setHouse] = useState<House | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHouseData();
  }, []);

  async function loadHouseData() {
    try {
      const token = await AsyncStorage.getItem('@teto_token');
      // Passamos o token no header (melhoraremos isso com interceptors depois)
      const response = await api.get('/houses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setHouse(response.data);
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível carregar sua casa.");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#4F46E5" /></View>;
  }

  if (!house) {
    return (
      <View style={styles.center}>
        <Text>Você ainda não tem uma casa!</Text>
        <TouchableOpacity onPress={onLogout}><Text style={styles.logout}>Sair</Text></TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Cabeçalho da Casa */}
      <View style={styles.header}>
        <Text style={styles.houseName}>{house.name}</Text>
        <View style={styles.codeTag}>
          <Text style={styles.codeText}>Código: {house.inviteCode}</Text>
        </View>
      </View>

      {/* Lista de Moradores */}
      <Text style={styles.sectionTitle}>Moradores</Text>
      <FlatList 
        data={house.users}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={styles.memberCard}>
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarLetter}>{item.name.charAt(0)}</Text>
            </View>
            <View>
              <Text style={styles.memberName}>{item.name}</Text>
              <Text style={styles.memberPoints}>{item.points || 0} pontos</Text>
            </View>
          </View>
        )}
      />

      <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
        <Text style={styles.logoutText}>Sair da Conta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F5F5F5', paddingTop: 60 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { marginBottom: 30, alignItems: 'center' },
  houseName: { fontSize: 28, fontWeight: 'bold', color: '#1F2937' },
  codeTag: { backgroundColor: '#E0E7FF', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, marginTop: 10 },
  codeText: { color: '#4F46E5', fontWeight: 'bold', fontSize: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 15, color: '#374151' },
  memberCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 15, borderRadius: 12, marginBottom: 10, elevation: 2 },
  avatarPlaceholder: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#4F46E5', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  avatarLetter: { color: '#FFF', fontWeight: 'bold', fontSize: 18 },
  memberName: { fontSize: 16, fontWeight: '500' },
  memberPoints: { fontSize: 14, color: '#6B7280' },
  logout: { color: 'red', marginTop: 20 },
  logoutButton: { marginTop: 20, alignSelf: 'center' },
  logoutText: { color: 'red', fontWeight: 'bold' }
});