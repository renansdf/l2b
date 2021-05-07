import React from 'react';
import {Container} from './styles';

interface ILoadingProps {
  isVisible: boolean;
}

const LoadingScreen: React.FC<ILoadingProps> = ({isVisible}) => {
  return (
    <Container visibility={isVisible}>
      <p>Carregando</p>
    </Container>
  )
}

export default LoadingScreen;