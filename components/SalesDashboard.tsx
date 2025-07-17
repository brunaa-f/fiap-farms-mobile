import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import type { SaleRecord } from '../services/salesService';

interface SalesDashboardProps {
  sales: SaleRecord[];
}

export const SalesDashboard: React.FC<SalesDashboardProps> = ({ sales }) => {
  const chartData = useMemo(() => {
    if (sales.length === 0) {
      return {
        labels: [],
        datasets: [{ data: [] }],
      };
    }
    const profitByProduct: { [key: string]: number } = {};
    sales.forEach(sale => {
      if (!profitByProduct[sale.productName]) {
        profitByProduct[sale.productName] = 0;
      }
      profitByProduct[sale.productName] += Number(sale.profit) || 0;
    });

    const labels = Object.keys(profitByProduct);
    const data = Object.values(profitByProduct);

    return {
      labels: labels.map(label => label.substring(0, 10)), 
      datasets: [
        {
          data: data,
        },
      ],
    };
  }, [sales]);

  if (sales.length === 0) {
    return <Text style={styles.emptyText}>Nenhuma venda registrada ainda.</Text>;
  }

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(40, 167, 69, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    barPercentage: 0.7,
  };

  return (
    <View style={styles.container}>
      <BarChart
        data={chartData}
        width={Dimensions.get('window').width - 60} 
        height={250}
        yAxisLabel="R$"
        yAxisSuffix="" 
        chartConfig={chartConfig}
        verticalLabelRotation={20} 
        fromZero={true}
        showValuesOnTopOfBars={true}
        style={styles.chartStyle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  emptyText: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
    fontStyle: 'italic',
    padding: 20,
  },
  chartStyle: {
    marginVertical: 8,
    borderRadius: 16,
  },
});
