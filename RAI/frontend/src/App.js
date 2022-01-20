import './App.css';
import { BrowserRouter, Route } from 'react-router-dom';
import Scraper from './components/Scraper';
import Header from './components/Header';
import Signs from './components/Signs';
import Roads from './components/Roads';
import Button from 'react-bootstrap/Button';
import AnalyzeRoads from './components/AnalyzeRoads';

function App() {
    return (
        <BrowserRouter>
            <div className='container'>
                <Header />
                <Route path='/' exact>
                    <Button href="/scraper" className="button">Scraper</Button>
                    <Button href="/signs" className="button">Signs</Button>
                    <Button href="/roads" className="button">Roads</Button>
                    <Button href="/analyze" className="button">Roads score</Button>
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
                <Route path='/analyze' exact>
                    <AnalyzeRoads />
                </Route>
            </div>
        </BrowserRouter>
    );
}

export default App;
