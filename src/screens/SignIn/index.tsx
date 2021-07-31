import React, { useState } from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import { ActivityIndicator, Alert, Platform } from 'react-native';
import { useTheme } from 'styled-components';

import { SignInSocialButton } from '../../components/SignInSocialButton';
import { useAuth } from '../../hooks/auth';

import LogoSvg from '../../assets/logo.svg'
import GoogleSvg from '../../assets/google.svg'
import AppleSvg from '../../assets/apple.svg'

import { 
  Container,
  Header,
  TitleWraper,
  Title,
  SignInTitle,
  Footer,
  FooterWrapper,
} from './styles';

interface SignInProps {
}

export function SignIn() {
  const theme = useTheme();
  const { signInWithGoogle , sigInWithApple } = useAuth();

  const [ isLoading, setIsLoading] = useState(false);

  async function handleSignInWithGoogle(){
    try{
      setIsLoading(true);
      return await signInWithGoogle();
    }catch(error){
      setIsLoading(false);
      console.log({error});
      Alert.alert('Não foi possivel conectar com a conta Google')
    }
  }

  async function handleSignInWithApple(){
    try{
      setIsLoading(true);
      return await sigInWithApple();
    }catch(error){
      setIsLoading(false);
      console.log({error});
      Alert.alert('Não foi possivel conectar com a conta Apple')
    }
  }

  return (
    <Container>
      <Header>
        <TitleWraper>
          <LogoSvg
            width={RFValue(120)}
            height={RFValue(68)}
          />
          
          <Title>
            Controle suas {`\n`}
            finanças de forma {`\n`}
            muito simples
          </Title>
        </TitleWraper>

        <SignInTitle>
          Faça seu login com {`\n`}
          uma das contas abaixo {`\n`}
        </SignInTitle>
      </Header>

      <Footer>
        <FooterWrapper>
          <SignInSocialButton title="Entrar com Google" svg={GoogleSvg} onPress={handleSignInWithGoogle} />
          { Platform.OS === 'ios' && <SignInSocialButton title="Entrar com Apple" svg={AppleSvg} onPress={handleSignInWithApple} /> }
        </FooterWrapper>
      </Footer>

      { isLoading && <ActivityIndicator color={theme.colors.shape} style={{marginTop: 18}} size="large" />}
    </Container>
  );
};