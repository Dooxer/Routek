import './App.css';
import {BrowserRouter, Route} from 'react-router-dom';
import Map from './components/Map';
import Scraper from './components/Scraper';
import Header from './components/Header';
import Signs from './components/Signs';
import Roads from './components/Roads';

function App() {
  return (
    <BrowserRouter>
        <div className='container'>
            <Header/>
            <Route path='/' exact>
                <Map />
            </Route>
            <Route path='/scraper' exact>
                <Scraper />
            </Route>
            <Route path='/signs' exact>
                <Signs />
            </Route>
            <Route path='/roads' exact>
                <Roads />
            </Route>
        </div>
    </BrowserRouter>
  );
}

export default App;