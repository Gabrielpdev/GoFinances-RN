import React, { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
 
import { HighLightCard } from '../../components/HightlightCard';
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard';

import { 
  Container,
  Header,
  UserWrapper,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName,
  Icon,
  HightlightCards,
  Title,
  TransactionList,
  Transactions,
  LogoutButton
 } from './styles';
import { useFocusEffect } from '@react-navigation/native';

  export interface DataListProps extends TransactionCardProps{
    id: string;
  }
  interface HighLightProps {
    total: string;
  }
  interface HighlighData {
    entries: HighLightProps;
    expensives: HighLightProps;
    total: string;
  }


export function Dashboard(){
  const [transactions, setTransactions] = useState<DataListProps[]>([]);
  const [highlightData, setHighlightData] = useState<HighlighData>({} as HighlighData);
  
  async function loadTransactions(){
    const dataKey = "@goFinances:transactions";

    let entriesTotal = 0;
    let expensiveTotal = 0;

    const response = await AsyncStorage.getItem(dataKey);
    const transactions = response ? JSON.parse(response) : [];

    const transactionFormatted: DataListProps[] = transactions.map((item: DataListProps) => {

      if(item.transactionType === 'positive'){
        entriesTotal += Number(item.price);
      }else {
        expensiveTotal += Number(item.price);
      }

      const price = Number(item.price).toLocaleString('pt-BR', { 
        style: 'currency',
        currency: 'BRL'
      });

      const test = new Date(item.date)
      const date = Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
      }).format(test);

      
      return {
        ...item,
        price,
        date
      }

    });

    setTransactions(transactionFormatted);

    setHighlightData({
      expensives: {
        total: expensiveTotal.toLocaleString('pt-BR', { 
          style: 'currency',
          currency: 'BRL'
        })
      },
      entries: {
        total: entriesTotal.toLocaleString('pt-BR', { 
          style: 'currency',
          currency: 'BRL'
        })
      },
      total: (entriesTotal - expensiveTotal).toLocaleString('pt-BR', { 
        style: 'currency',
        currency: 'BRL'
      })
    })
  }

  useFocusEffect(
    useCallback(() => {
      loadTransactions();
    },[])
  )

  return (
    <Container>
      <Header>
        <UserWrapper>
          <UserInfo>
            <Photo source={{ uri: 'https://avatars.githubusercontent.com/u/61878136?v=4'}}/>

            <User>
              <UserGreeting>Olá,</UserGreeting>
              <UserName>Gabriel</UserName>
            </User>
          </UserInfo>

          <LogoutButton onPress={() => {}} >
            <Icon name="power" />
          </LogoutButton>
        </UserWrapper>
      </Header>
    
      <HightlightCards>
        <HighLightCard 
          type="up"
          amount={highlightData.entries.total}
          lastTransaction="Última entrada dia 13 de abril"
          title="Entradas"
        />
        <HighLightCard 
          type="down"
          amount={highlightData.expensives.total}
          lastTransaction="Última saída dia 03 de abril"
          title="Saídas"
        />
        <HighLightCard 
          type="total"
          amount={highlightData.total}
          lastTransaction="01 à 16 de abril" 
          title="Total"
        />
      </HightlightCards>
    
      <Transactions>
        <Title>Listagem</Title>

        <TransactionList 
          data={ transactions }
          keyExtractor={ item => item.id}
          renderItem= { ({item}) => <TransactionCard data={item}/>}
        />
      </Transactions>
    </Container>
  )
}
