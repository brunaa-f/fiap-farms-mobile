import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { ProductionLot } from '../services/productionService';
import { Svg, Circle, Polyline, Path } from 'react-native-svg';

interface ProductionDashboardProps {
  lots: ProductionLot[];
}

const ClockIcon = () => (
  <Svg height="20" width="20" viewBox="0 0 24 24" stroke="#495057" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 8 }}>
    <Circle cx="12" cy="12" r="10" />
    <Polyline points="12 6 12 12 16 14" />
  </Svg>
);

const GearIcon = () => (
  <Svg height="20" width="20" viewBox="0 0 24 24" stroke="#495057" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 8 }}>
    <Path d="M12 20v-4 M12 4v4 M20 12h-4 M4 12h4 M17.66 6.34l-2.83 2.83 M6.34 17.66l2.83-2.83 M17.66 17.66l-2.83-2.83 M6.34 6.34l2.83 2.83" />
    <Circle cx="12" cy="12" r="3" />
  </Svg>
);

const CheckIcon = () => (
  <Svg height="20" width="20" viewBox="0 0 24 24" stroke="#495057" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 8 }}>
    <Polyline points="20 6 9 17 4 12" />
  </Svg>
);


const KanbanColumn: React.FC<{ title: string; items: ProductionLot[]; icon: React.ReactNode; color: string }> = ({ title, items, icon, color }) => (
  <View style={styles.column}>
    <View style={styles.columnTitleContainer}>
      {icon}
      <Text style={styles.columnTitle}>{title}</Text>
      <View style={styles.itemCount}>
        <Text style={styles.itemCountText}>{items.length}</Text>
      </View>
    </View>
    {items.length === 0 ? (
      <Text style={styles.emptyText}>- Vazio -</Text>
    ) : (
      items.map(item => (
        <View key={item.id} style={[styles.card, { borderLeftColor: color }]}>
          <Text style={styles.cardText}>{item.productName}</Text>
        </View>
      ))
    )}
  </View>
);

export const ProductionDashboard: React.FC<ProductionDashboardProps> = ({ lots }) => {
  const filteredLots = useMemo(() => {
    const aguardando = lots.filter(lot => lot.status === 'Aguardando');
    const emProducao = lots.filter(lot => lot.status === 'Em Produção');
    const colhido = lots.filter(lot => lot.status === 'Colhido');
    return { aguardando, emProducao, colhido };
  }, [lots]);

  return (
    <View style={styles.container}>
      <KanbanColumn title="Aguardando" items={filteredLots.aguardando} icon={<ClockIcon />} color="#ffc107" />
      <KanbanColumn title="Em Produção" items={filteredLots.emProducao} icon={<GearIcon />} color="#007bff" />
      <KanbanColumn title="Colhido" items={filteredLots.colhido} icon={<CheckIcon />} color="#28a745" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  column: {
    width: '32%',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 10,
    elevation: 2, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  columnTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 10,
    marginBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#e9ecef',
  },
  columnTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#343a40',
  },
  itemCount: {
    marginLeft: 'auto',
    backgroundColor: '#e9ecef',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  itemCountText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#495057',
  },
  card: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 4,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  cardText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#495057',
  },
  emptyText: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 20,
  },
});
