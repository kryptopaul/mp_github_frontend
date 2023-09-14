import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Container, Text } from '@mantine/core';
import { HeaderResponsive } from './HeaderResponsive';
import Verify from './Verify';
import { FooterSimple } from './FooterSimple';

function App() {
  return (
    <>
    <HeaderResponsive links={[{label: 'Home', link: '/'}]} />
    <Container>
      <Verify />
    </Container>
    <FooterSimple links={[{label: 'Home', link: '/'}]} />
    </>
  );
}

export default App;
