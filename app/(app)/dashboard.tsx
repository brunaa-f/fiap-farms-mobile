import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Modal, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { useUserStore } from '../../store/userStore';
import { useProductionStore } from '../../store/productionStore';
import { useSalesStore } from '../../store/salesStore'; 
import { auth } from '../../services/firebase';
import { createLot } from '../../services/productionService';
import { recordSale } from '../../services/salesService';
import { ProductionForm } from '../../components/ProductionForm';
import { SalesForm } from '../../components/SalesForm';
import { ProductionDashboard } from '../../components/ProductionDashboard';
import { SalesDashboard } from '../../components/SalesDashboard'; 

export default function DashboardPage() {
  const { user } = useUserStore();
  const { lots, isLoading: isProductionLoading, listenToLots, unsubscribe: unsubscribeProduction } = useProductionStore();
  const { sales, isLoading: isSalesLoading, listenToSales, unsubscribe: unsubscribeSales } = useSalesStore();

  const [isProductionModalOpen, setProductionModalOpen] = useState(false);
  const [isSalesModalOpen, setSalesModalOpen] = useState(false);

  useEffect(() => {
    if (user?.uid) {
      listenToLots(user.uid);
      listenToSales(user.uid); 
    }
    
    return () => {
      unsubscribeProduction();
      unsubscribeSales();
    };
  }, [user]);

  const handleLogout = () => {
    auth.signOut();
  };

  const handleSaveProduction = async (formData: { productName: string; costPerUnit: number; status: string }) => {
    if (!user) { Alert.alert("Erro", "Usuário não autenticado."); return; }
    const result = await createLot(formData, user.uid);
    if (result.success) { Alert.alert("Sucesso!", "Lote de produção salvo."); setProductionModalOpen(false); } 
    else { Alert.alert("Erro", `Não foi possível salvar: ${result.error}`); }
  };

  const handleSaveSale = async (formData: { productName: string; quantitySold: number; pricePerUnit: number; }) => {
    if (!user) { Alert.alert("Erro", "Usuário não autenticado."); return; }
    const result = await recordSale(formData, user.uid);
    if (result.success) { Alert.alert("Sucesso!", "Venda registrada."); setSalesModalOpen(false); } 
    else { Alert.alert("Erro", `Não foi possível registrar venda: ${result.error}`); }
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.welcomeText}>Bem-vindo, {user?.email}!</Text>

        <View style={styles.actionsContainer}>
          <View style={styles.buttonWrapper}><Button title="+ Adicionar Produção" onPress={() => setProductionModalOpen(true)} /></View>
          <View style={styles.buttonWrapper}><Button title="+ Registrar Venda" onPress={() => setSalesModalOpen(true)} color="#28a745" /></View>
        </View>

        <View style={styles.dashboardSection}>
          <Text style={styles.sectionTitle}>Status da Produção</Text>
          {isProductionLoading ? (
            <ActivityIndicator size="large" color="#007bff" />
          ) : (
            <ProductionDashboard lots={lots} />
          )}
        </View>

        <View style={styles.dashboardSection}>
          <Text style={styles.sectionTitle}>Lucro por Produto</Text>
          {isSalesLoading ? (
            <ActivityIndicator size="large" color="#28a745" />
          ) : (
            <SalesDashboard sales={sales} />
          )}
        </View>

        <View style={styles.logoutButtonContainer}>
          <Button title="Sair" onPress={handleLogout} color="#6c757d" />
        </View>

        <Modal visible={isProductionModalOpen} transparent={true} animationType="slide" onRequestClose={() => setProductionModalOpen(false)}>
          <View style={styles.modalOverlay}><ProductionForm onSave={handleSaveProduction} onClose={() => setProductionModalOpen(false)} /></View>
        </Modal>
        <Modal visible={isSalesModalOpen} transparent={true} animationType="slide" onRequestClose={() => setSalesModalOpen(false)}>
          <View style={styles.modalOverlay}><SalesForm onSave={handleSaveSale} onClose={() => setSalesModalOpen(false)} /></View>
        </Modal>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: { flex: 1, backgroundColor: '#f5f5f5' },
  container: { alignItems: 'center', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 8 },
  welcomeText: { fontSize: 16, marginBottom: 20, color: '#666' },
  actionsContainer: { width: '100%' },
  buttonWrapper: { marginVertical: 8, width: '100%' },
  dashboardSection: { marginTop: 30, width: '100%', backgroundColor: '#fff', borderRadius: 12, padding: 15, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, },
  sectionTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  logoutButtonContainer: { marginTop: 40, width: '80%', marginBottom: 40 },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
});
