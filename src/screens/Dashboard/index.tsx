import React from 'react';
 
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
 } from './styles';

 export interface dataListProps extends TransactionCardProps{
   id: string;
 }


export function Dashboard(){
  const data : Array<dataListProps> = [
    {
      id: '1',
      type: 'positive',
      title:"Desenvolvimento de site",
      amount:"R$ 12.000,00",
      category:{
        name: "Vendas",
        icon: "dollar-sign"
      },
      date:"13/04/2020",
    },
    {
      id: '2',
      type: 'negative',
      title:"Hamburgeria Pizzy",
      amount:"R$ 59,00",
      category:{
        name: "Alimentação",
        icon: "coffee"
      },
      date:"13/04/2020",
    },
    {
      id: '3',
      type: 'negative',
      title:"Aluguel do apartamentos",
      amount:"R$ 1.200,00",
      category:{
        name: "Casa",
        icon: "shopping-bag"
      },
      date:"13/04/2020",
    }
  ]

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

          <Icon name="power" />
        </UserWrapper>
      </Header>
    
      <HightlightCards>
        <HighLightCard 
          type="up"
          amount='R$ 17.400,00'
          lastTransaction="Última entrada dia 13 de abril"
          title="Entradas"
        />
        <HighLightCard 
          type="down"
          amount='R$ 1.259,00'
          lastTransaction="Última saída dia 03 de abril"
          title="Saídas"
        />
        <HighLightCard 
          type="total"
          amount='R$ 16.141,00'
          lastTransaction="01 à 16 de abril" 
          title="Total"
        />
      </HightlightCards>
    
      <Transactions>
        <Title>Listagem</Title>

        <TransactionList 
          data={ data }
          keyExtractor={ item => item.id}
          renderItem= { ({item}) => <TransactionCard data={item}/>}
        />
      </Transactions>
    </Container>
  )
}
