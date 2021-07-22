import React from 'react';
import {  } from 'react-native';

import { Container, Title, Amount } from './styles';

interface HistoryCardProps {
  title: string;
  color: string;
  amount: string;
}

export function HistoryCard({
  title,
  amount,
  color
}: HistoryCardProps) {
  return (
    <Container color={color} >
      <Title>{title}</Title>
      <Amount>{amount}</Amount>
    </Container>
  );
};
