import { MainContextProvider } from './contexts/MainContext';
import Index from './Index';

export default function App() {

  return (
    <MainContextProvider>
      <Index /* Provide Index so that Index can import from context */ />
    </MainContextProvider>
  );
}
