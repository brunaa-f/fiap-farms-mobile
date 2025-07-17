import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Modal, Alert } from 'react-native';

// Importando as peças que vamos usar
import { useUserStore } from '../../store/userStore';
import { auth } from '../../services/firebase';
import { createLot } from '../../services/productionService';
import { recordSale } from '../../services/salesService';
import { ProductionForm } from '../../components/ProductionForm';
import { SalesForm } from '../../components/SalesForm';

export default function DashboardPage() {
  const { user } = useUserStore();
  const [isProductionModalOpen, setProductionModalOpen] = useState(false);
  const [isSalesModalOpen, setSalesModalOpen] = useState(false);

  const handleLogout = () => {
    auth.signOut();
  };

  const handleSaveProduction = async (formData: { productName: string; costPerUnit: number; status: string }) => {
    if (!user) {
      Alert.alert("Erro", "Usuário não autenticado.");
      return;
    }
    const result = await createLot(formData, user.uid);
    if (result.success) {
      Alert.alert("Sucesso!", "Lote de produção salvo.");
      setProductionModalOpen(false);
    } else {
      Alert.alert("Erro", `Não foi possível salvar: ${result.error}`);
    }
  };

  const handleSaveSale = async (formData: { productName: string; quantitySold: number; pricePerUnit: number; }) => {
    if (!user) {
      Alert.alert("Erro", "Usuário não autenticado.");
      return;
    }
    const result = await recordSale(formData, user.uid);
    if (result.success) {
      Alert.alert("Sucesso!", "Venda registrada.");
      setSalesModalOpen(false);
    } else {
      Alert.alert("Erro", `Não foi possível registrar venda: ${result.error}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <Text style={styles.welcomeText}>Bem-vindo, {user?.email}!</Text>

      <View style={styles.actionsContainer}>
        {/* Botão para abrir o modal de produção */}
        <View style={styles.buttonWrapper}>
          <Button 
            title="+ Adicionar Produção" 
            onPress={() => setProductionModalOpen(true)} 
          />
        </View>
        {/* Botão para abrir o modal de vendas */}
        <View style={styles.buttonWrapper}>
          <Button 
            title="+ Registrar Venda" 
            onPress={() => setSalesModalOpen(true)}
            color="#28a745" // Verde para vendas
          />
        </View>
      </View>

      <View style={styles.logoutButtonContainer}>
        <Button title="Sair" onPress={handleLogout} color="#6c757d" />
      </View>

      {/* Modal de Produção */}
      <Modal
        visible={isProductionModalOpen}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setProductionModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <ProductionForm
            onSave={handleSaveProduction}
            onClose={() => setProductionModalOpen(false)}
          />
        </View>
      </Modal>

      {/* Modal de Vendas */}
      <Modal
        visible={isSalesModalOpen}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setSalesModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <SalesForm
            onSave={handleSaveSale}
            onClose={() => setSalesModalOpen(false)}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
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
  actionsContainer: {
    width: '100%',
  },
  buttonWrapper: {
    marginVertical: 8,
    width: '100%',
  },
  logoutButtonContainer: {
    position: 'absolute',
    bottom: 40,
    width: '80%',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});
