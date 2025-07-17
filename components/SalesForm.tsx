import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Platform, TouchableOpacity } from 'react-native';

// Define a "forma" dos dados que o formulário vai enviar
interface SaleFormData {
  productName: string;
  quantitySold: number;
  pricePerUnit: number;
}

// Define as props que o componente espera receber
interface SalesFormProps {
  onSave: (data: SaleFormData) => void;
  onClose: () => void;
}

export const SalesForm: React.FC<SalesFormProps> = ({ onSave, onClose }) => {
  const [productName, setProductName] = useState('');
  const [quantitySold, setQuantitySold] = useState('');
  const [pricePerUnit, setPricePerUnit] = useState('');

  const handleSave = () => {
    // Validação simples para garantir que os campos não estão vazios
    if (!productName || !quantitySold || !pricePerUnit) {
      alert('Por favor, preencha todos os campos.');
      return;
    }
    // Chama a função onSave que foi passada pelo Dashboard
    onSave({
      productName,
      quantitySold: parseFloat(quantitySold),
      pricePerUnit: parseFloat(pricePerUnit),
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrar Nova Venda</Text>
      
      <Text style={styles.label}>Nome do Produto Vendido</Text>
      <TextInput
        style={styles.input}
        placeholder="ex: Tomate Cereja"
        value={productName}
        onChangeText={setProductName}
      />

      <Text style={styles.label}>Quantidade Vendida</Text>
      <TextInput
        style={styles.input}
        placeholder="ex: 20"
        value={quantitySold}
        onChangeText={setQuantitySold}
        keyboardType="numeric"
      />
      
      <Text style={styles.label}>Preço por Unidade</Text>
      <TextInput
        style={styles.input}
        placeholder="ex: 5.00"
        value={pricePerUnit}
        onChangeText={setPricePerUnit}
        keyboardType="numeric"
      />

      <View style={styles.buttonWrapper}>
        <Button title="Salvar Venda" onPress={handleSave} color="#28a745" />
      </View>
      <View style={styles.buttonWrapper}>
        <Button title="Cancelar" onPress={onClose} color="#888" />
      </View>
    </View>
  );
};

// Estilos seguindo o mesmo padrão do ProductionForm
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
  buttonWrapper: {
    marginTop: 10,
  },
});
