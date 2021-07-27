import React from 'react';
import { RFValue } from 'react-native-responsive-fontsize';

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
import { SignInSocialButton } from '../../components/SignInSocialButton';

interface SignInProps {
}

export function SignIn() {
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
          <SignInSocialButton title="Entrar com Google" svg={GoogleSvg} />
          <SignInSocialButton title="Entrar com Apple" svg={AppleSvg} />
        </FooterWrapper>
      </Footer>
    </Container>
  );
};