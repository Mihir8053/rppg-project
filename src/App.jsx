import { ChakraProvider } from '@chakra-ui/react'
import { AppHeader, MainRecorder } from '@UI'
import theme from './theme'

const App=() => {
  return (
    <ChakraProvider theme={theme}>
      <AppHeader />
      <MainRecorder />
    </ChakraProvider>
  )
}


export default App
