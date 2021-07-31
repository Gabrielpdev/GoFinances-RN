import React, { useCallback, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from 'styled-components';
import { useFocusEffect } from '@react-navigation/native';

import { useAuth } from '../../hooks/auth';

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
  LogoutButton,
  LoadContainer
 } from './styles';

  export interface DataListProps extends TransactionCardProps{
    id: string;
  }
  interface HighLightProps {
    price: string;
    lastTransaction: string;
  }
  interface HighlighData {
    entries: HighLightProps;
    expensives: HighLightProps;
    total: HighLightProps;
  }


export function Dashboard(){
  const theme = useTheme();
  const { signOut, user } = useAuth();

  const [ isLoading, setIsLoading ] = useState(true); 

  const [transactions, setTransactions] = useState<DataListProps[]>([]);
  const [highlightData, setHighlightData] = useState<HighlighData>({} as HighlighData);
  
  function getLastTransactionDate(
      collection : DataListProps[], 
      type: 'positive' | 'negative'
    ){
      
    const collectionFiltered = collection.filter( (transaction) => transaction.transactionType === type );

    if(collectionFiltered.length === 0){
      return 0
    }

    const lastTransactions = new Date (
        Math.max.apply( Math, collectionFiltered
        .map(transaction => new Date(transaction.date).getTime())
      )
    )

    return `${lastTransactions.getDate()} de ${lastTransactions.toLocaleDateString(
      'pt-BR',
      {
        month: 'long'
      }
    )}`
  }

  async function loadTransactions(){
    const dataKey = `@goFinances:transactions_user:${user.id}`;

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
    
    const lastTransactionEntries = getLastTransactionDate(transactions, 'positive');
    const lastTransactionExpensives = getLastTransactionDate(transactions, 'negative');

    const totalInterval = lastTransactionExpensives === 0 ? "Não há transações" :`01 a ${lastTransactionExpensives}`;
    
    setTransactions(transactionFormatted);
    setHighlightData({
      expensives: {
        price: expensiveTotal.toLocaleString('pt-BR', { 
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransaction: lastTransactionExpensives === 0 
        ? 'Não há transações'
        : `Última saída dia ${lastTransactionExpensives}`
      },
      entries: {
        price: entriesTotal.toLocaleString('pt-BR', { 
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransaction: lastTransactionEntries === 0
        ? 'Não há transações'
        : `Última entrada dia ${lastTransactionEntries}`
      },
      total: {
        price: (entriesTotal - expensiveTotal).toLocaleString('pt-BR', { 
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransaction: totalInterval
      }
    })
    setIsLoading(false);
  }

  useFocusEffect(
    useCallback(() => {
      loadTransactions();
    },[])
  )

  return (
    <Container>
      { isLoading ? (
        <LoadContainer>
          <ActivityIndicator 
            color={theme.colors.primary} 
            size='large'
          />
        </LoadContainer>
      ) : (
        <>
          <Header>
          <UserWrapper>
            <UserInfo>
              <Photo source={{ uri: user.photo }}/>

              <User>
                <UserGreeting>Olá,</UserGreeting>
                <UserName>{user.name}</UserName>
              </User>
            </UserInfo>

            <LogoutButton onPress={signOut} >
              <Icon name="power" />
            </LogoutButton>
          </UserWrapper>
        </Header>
      
        <HightlightCards>
          <HighLightCard 
            type="up"
            amount={highlightData.entries.price}
            lastTransaction={highlightData.entries.lastTransaction}
            title="Entradas"
          />
          <HighLightCard 
            type="down"
            amount={highlightData.expensives.price}
            lastTransaction={highlightData.expensives.lastTransaction}
            title="Saídas"
          />
          <HighLightCard 
            type="total"
            amount={highlightData.total.price}
            lastTransaction={highlightData.total.lastTransaction}
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
        </>
      )}
    </Container>
  )
}
