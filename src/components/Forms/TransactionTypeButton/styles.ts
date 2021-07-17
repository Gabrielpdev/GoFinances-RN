import styled, { css } from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

import { Feather } from '@expo/vector-icons';
import { RectButton } from 'react-native-gesture-handler';

interface ContainerProps {
  isActive: boolean;
  type: 'positive' | 'negative';
}

interface TransactionProps {
  type: 'positive' | 'negative';
}

export const Container = styled.View<ContainerProps>`
  width: 48%;

  background-color: ${({theme}) => theme.colors.background};
  border-radius: 5px;

  border-width: ${({isActive}) => isActive ? '0' : '1.5px'};
  border-style: solid;
  border-color: ${({theme}) => theme.colors.text};

  ${({ isActive, type}) => isActive && type === 'negative' && 
    css`
      background-color: ${({theme}) => theme.colors.attention_light};
      border-color: ${({theme}) => theme.colors.attention_light};
    `
  };

  ${({ isActive, type}) =>  isActive && type === 'positive' && 
    css`
      background-color: ${({theme}) => theme.colors.success_light};
      border-color: ${({theme}) => theme.colors.success_light};
    `
  }
`;

export const Button = styled(RectButton)`
  padding: 16px 35px;

  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const Title = styled.Text`
  font-family: ${({theme}) => theme.fonts.regular};
  font-size: ${RFValue(14)}px;

  color: ${({theme}) => theme.colors.text_dark};
`;

export const Icon = styled(Feather)<TransactionProps>`
  font-size: ${RFValue(20)}px;
  margin-right: 12px;

  color: ${({theme, type}) => type === 'positive' ? theme.colors.success : theme.colors.attention};
`;