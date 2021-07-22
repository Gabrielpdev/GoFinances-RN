import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VictoryPie } from 'victory-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { addMonths, subMonths, format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { useFocusEffect } from '@react-navigation/native';

import { HistoryCard } from '../../components/HistoryCard';
import { TransactionCardProps } from '../../components/TransactionCard';

import { categories } from '../../utils/categories';

import { 
  Container, 
  Header, 
  Title, 
  Content, 
  ChartContainer,
  MonthSelect,
  MonthSelectButton,
  MonthSelectIcon,
  Month,
  LoadContainer,
 } from './styles';

interface CategoryData {
  key: string;
  color: string;
  name: string;
  total: number;
  totalFormatted: string;
  percent: string;
}

export function Resume() {
  const theme = useTheme();

  const [ isLoading, setIsLoading ] = useState(false);
  const [ selectedDate, setSelectedDate ] = useState(new Date());
  const [ totalByCategories, setTotalByCategories ] = useState<CategoryData[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    },[selectedDate])
  )

  async function loadData(){
    setIsLoading(true);
    const dataKey = "@goFinances:transactions";

    const response = await AsyncStorage.getItem(dataKey);
    const responseFormatted = response ? JSON.parse(response) : [];

    const expensives = responseFormatted.filter((expensive: TransactionCardProps) => 
      expensive.transactionType === 'negative' && 
      new Date(expensive.date).getMonth() === selectedDate.getMonth() && 
      new Date(expensive.date).getFullYear() === selectedDate.getFullYear()
    );

    const expensiveTotal = expensives.reduce((acumulator: number, expensive: TransactionCardProps ) => {
      return acumulator + Number(expensive.price)
    }, 0)

    const totalByCategory: CategoryData[] = [];

    categories.forEach(category => {
      let categorySum = 0;

      expensives.forEach( (expensive: TransactionCardProps) => {
        if(expensive.category === category.key){
          categorySum += Number(expensive.price);
        }
      })

      if(categorySum > 0 ) {
        const totalFormatted = categorySum.toLocaleString(
          'pt-BR',
          {
            style: 'currency',
            currency: 'BRL'
          }
        )

        const percent = `${(categorySum / expensiveTotal * 100).toFixed(0)}%`

        totalByCategory.push({
          key: category.key,
          color: category.color,
          name: category.name,
          total: categorySum, 
          totalFormatted,
          percent
        })
      }
    })

    setTotalByCategories(totalByCategory)
    setIsLoading(false)
  }

  function handleDateChange(action: 'next' | 'prev'){
    if(action === 'next'){
      setSelectedDate(addMonths(selectedDate, 1))
    }else {
      setSelectedDate(subMonths(selectedDate, 1))
    }
  }

  const formattedDate = useMemo(() => {
    return format(selectedDate, 'MMMM, yyyy', { locale: ptBR })
  }, [selectedDate])

  return (
    <Container>
      <Header>
          <Title>Resumo por categoria</Title>
      </Header>
     
      { isLoading ? (
        <LoadContainer>
          <ActivityIndicator
            color={theme.colors.primary} 
            size='large'
          />
        </LoadContainer>
      ) : (
        <Content 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ 
            paddingHorizontal: 24,
            paddingBottom: useBottomTabBarHeight()
          }}
        >

          <MonthSelect>
            <MonthSelectButton onPress={() => handleDateChange('prev')}>
              <MonthSelectIcon name="chevron-left" />
            </MonthSelectButton>

            <Month>{formattedDate}</Month>

            <MonthSelectButton onPress={() => handleDateChange('next')}>
              <MonthSelectIcon name="chevron-right" />
            </MonthSelectButton>
          </MonthSelect>

          <ChartContainer>
            <VictoryPie 
              data={totalByCategories}
              colorScale={totalByCategories.map(category => category.color)}
              style={{
                labels: {
                  fontSize: RFValue(18),
                  fontWeight: 'bold',
                  fill: theme.colors.shape
                }
              }}
              labelRadius={60}
              x="percent"
              y="total"
            />
          </ChartContainer>

          {totalByCategories.map(category => (
            <HistoryCard 
            key={category.key}
            color={category.color}
            title={category.name}
            amount={category.totalFormatted}
            />
          ))}
  
        </Content>
      )}
    </Container>
  );
};
