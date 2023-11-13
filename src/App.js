import './App.css';
import { BrowserRouter } from 'react-router-dom';
import AppRoute from './Routes/AppRoutes';
import NavBar from './Navigation/NavBar';
import { ResourceProvider } from './Context/ResourceContext';

const basename = process.env.REACT_APP_BASENAME || "/";

function App() {
  return (
    <BrowserRouter basename={basename}>
      <ResourceProvider>
        <div className="App">
          <header className="App-header">
            <NavBar />
          </header>
          <main className='App-main'>
            <AppRoute />
          </main>
        </div>
      </ResourceProvider>
    </BrowserRouter>
  );
}

export default App;
