import './App.css';
import Map from './components/Map';
import {BrowserRouter, Link, Route} from 'react-router-dom';
import Scraper from './components/Scraper';
import Header from './components/Header';
import Signs from './components/Signs';
import Roads from './components/Roads';
import Button from 'react-bootstrap/Button';

function App() {
  return (
    <BrowserRouter>
        <div className='container'>
            <Header/>
            <Route path='/' exact>
                <Button href="/scraper" className="button">Scraper</Button>
                <Button href="/signs" className="button">Signs</Button>
                <Button href="/roads" className="button">Roads</Button>
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