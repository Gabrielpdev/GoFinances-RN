import React from 'react';
import { RectButtonProps } from 'react-native-gesture-handler';
import { TextInputProps } from 'react-native';

import { 
  Container,
  Category,
  Icon,
  CategoryIcon,
} from './styles';

interface Props extends RectButtonProps {
  title: string;
  icon: string;
}

export function CategorySelectButton({ title, icon, ...rest }: Props){
  return (
    <Container { ...rest }>
      {icon ? <Icon name={icon} /> : <CategoryIcon name="category" />}
      
      <Category>{title}</Category>
      <Icon name="chevron-down" />
    </Container>
  );
}