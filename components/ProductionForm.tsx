import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Platform, Modal, TouchableOpacity } from 'react-native';

interface ProductionFormProps {
  onSave: (data: { productName: string; costPerUnit: number; status: string }) => void;
  onClose: () => void;
}

// ✅ NOVO: Componente para os itens do nosso seletor customizado
const StatusOption: React.FC<{ label: string; onPress: () => void }> = ({ label, onPress }) => (
  <TouchableOpacity style={styles.optionButton} onPress={onPress}>
    <Text style={styles.optionText}>{label}</Text>
  </TouchableOpacity>
);

export const ProductionForm: React.FC<ProductionFormProps> = ({ onSave, onClose }) => {
  const [productName, setProductName] = useState('');
  const [costPerUnit, setCostPerUnit] = useState('');
  const [status, setStatus] = useState('Aguardando');
  
  // ✅ NOVO: Estado para controlar a visibilidade do nosso modal de seleção
  const [isStatusSelectorVisible, setStatusSelectorVisible] = useState(false);

  const handleSave = () => {
    if (!productName || !costPerUnit) {
      alert('Por favor, preencha todos os campos.');
      return;
    }
    onSave({
      productName,
      costPerUnit: parseFloat(costPerUnit),
      status,
    });
  };

  const selectStatus = (newStatus: string) => {
    setStatus(newStatus);
    setStatusSelectorVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Adicionar Novo Lote de Produção</Text>
      
      <Text style={styles.label}>Nome do Produto</Text>
      <TextInput
        style={styles.input}
        placeholder="ex: Tomate Cereja"
        value={productName}
        onChangeText={setProductName}
      />

      <Text style={styles.label}>Custo por Unidade</Text>
      <TextInput
        style={styles.input}
        placeholder="ex: 2.50"
        value={costPerUnit}
        onChangeText={setCostPerUnit}
        keyboardType="numeric"
      />
      
      <Text style={styles.label}>Status</Text>
      {/* ✅ MUDANÇA: Substituímos o Picker por um botão que abre o modal */}
      <TouchableOpacity style={styles.selectButton} onPress={() => setStatusSelectorVisible(true)}>
        <Text>{status}</Text>
      </TouchableOpacity>

      {/* ✅ NOVO: Modal para a seleção de status */}
      <Modal
        visible={isStatusSelectorVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setStatusSelectorVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecione um Status</Text>
            <StatusOption label="Aguardando" onPress={() => selectStatus('Aguardando')} />
            <StatusOption label="Em Produção" onPress={() => selectStatus('Em Produção')} />
            <StatusOption label="Colhido" onPress={() => selectStatus('Colhido')} />
            <View style={{marginTop: 10}}>
              <Button title="Cancelar" onPress={() => setStatusSelectorVisible(false)} color="#6c757d" />
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.buttonWrapper}>
        <Button title="Salvar Lote" onPress={handleSave} />
      </View>
      <View style={styles.buttonWrapper}>
        <Button title="Cancelar" onPress={onClose} color="#888" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '90%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    marginBottom: 15,
    borderRadius: 5,
    fontSize: 16,
  },
  // ✅ NOVO: Estilo para o nosso botão seletor
  selectButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 5,
    marginBottom: 15,
    alignItems: 'center',
  },
  buttonWrapper: {
    marginTop: 10,
  },
  // ✅ NOVO: Estilos para o modal de seleção
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  optionButton: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  optionText: {
    textAlign: 'center',
    fontSize: 16,
  },
});
