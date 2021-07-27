import React from 'react';
import { RectButtonProps } from 'react-native-gesture-handler'
import { SvgProps } from 'react-native-svg';
import { RFValue } from 'react-native-responsive-fontsize';

import { Container, ImageContainer, Text } from './styles';

interface SignInSocialButtonProps extends RectButtonProps {
  title: string;
  svg: React.FC<SvgProps>
}

export function SignInSocialButton({ title, svg: Svg, ...rest }: SignInSocialButtonProps) {
  return (
    <Container {...rest}>
      <ImageContainer>
        <Svg 
          width={RFValue(20)}
          height={RFValue(20)}
          />
      </ImageContainer>

      <Text>{title}</Text>
    </Container>
  );
};
