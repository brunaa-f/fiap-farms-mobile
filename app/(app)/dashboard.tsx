// import { View, Text, Button, StyleSheet, Alert } from 'react-native';
// import { doSignOut } from '../../services/authService';
// //import { useRouter } from 'expo-router';

// export default function DashboardPage() {
//   //const router = useRouter();

//   const handleLogout = async () => {
//     try {
//       await doSignOut();
//       // O arquivo _layout.tsx irá detectar o logout e redirecionar automaticamente.
//     } catch (error) {
//       console.error('Erro ao fazer logout:', error);
//       Alert.alert('Erro', 'Não foi possível sair.');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Dashboard</Text>
//       <Text>Bem-vindo! Você está logado.</Text>
//       <View style={styles.buttonContainer}>
//         <Button title="Sair" onPress={handleLogout} color="#ff4444" />
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 16,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   buttonContainer: {
//     marginTop: 30,
//     width: '60%',
//   },
// });

import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Modal, Alert } from 'react-native';
import { useUserStore } from '../../store/userStore'; 
import { doSignOut } from '../../services/authService';
import { createLot } from '../../services/productionService';
import { ProductionForm } from '../../components/ProductionForm';

export default function DashboardPage() {
  const { user } = useUserStore();
  const [isModalOpen, setModalOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await doSignOut();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      Alert.alert('Erro', 'Não foi possível sair.');
    }
  };

  const handleSaveProduction = async (formData: { productName: string; costPerUnit: number; status: string }) => {
    if (!user) {
      Alert.alert("Erro", "Usuário não autenticado.");
      return;
    }
    
    const result = await createLot(formData, user.uid);

    if (result.success) {
      Alert.alert("Sucesso!", "Lote de produção salvo.");
      setModalOpen(false);
    } else {
      Alert.alert("Erro", `Não foi possível salvar: ${result.error}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <Text style={styles.welcomeText}>Bem-vindo, {user?.email}!</Text>

      <View style={styles.actionButtonContainer}>
        <Button 
          title="+ Adicionar Produção" 
          onPress={() => setModalOpen(true)} 
        />
      </View>

      <View style={styles.logoutButtonContainer}>
        <Button title="Sair" onPress={handleLogout} color="#ff4444" />
      </View>

      <Modal
        visible={isModalOpen}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <ProductionForm
            onSave={handleSaveProduction}
            onClose={() => setModalOpen(false)}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 16,
    marginBottom: 20,
    color: '#666',
  },
  actionButtonContainer: {
    width: '80%',
    marginVertical: 10,
  },
  logoutButtonContainer: {
    position: 'absolute',
    bottom: 40,
    width: '60%',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});
