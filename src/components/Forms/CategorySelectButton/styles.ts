import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';

import { Feather, MaterialIcons } from '@expo/vector-icons';
import { RectButton } from 'react-native-gesture-handler';

export const Container = styled(RectButton).attrs({
  activeOpacity: 0.7
})`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;

  width: 100%;
  
  padding: 18px 16px;

  background-color: ${({theme}) => theme.colors.shape};
  border-radius: 5px;

  margin-top: 8px;
`;

export const Category = styled.Text`
  font-family: ${({theme}) => theme.fonts.regular};
  font-size: ${RFValue(14)}px;

  margin-right: auto;

  color: ${({theme}) => theme.colors.text};
`

export const Icon = styled(Feather)`
  margin-right: 10px;
  
  font-size: ${RFValue(20)}px;
  color: ${({theme}) => theme.colors.text};
`;

export const CategoryIcon = styled(MaterialIcons)`
  margin-right: 10px;
  
  font-size: ${RFValue(20)}px;
  color: ${({theme}) => theme.colors.text};
`;
