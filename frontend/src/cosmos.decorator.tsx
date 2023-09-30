import { ChakraProvider } from '@chakra-ui/react';
import { theme } from './theme';
import { ReactNode } from 'react';

const decorator = ({ children }: { children: ReactNode }) => <ChakraProvider theme={theme}>{children}</ChakraProvider>;

export default decorator;
