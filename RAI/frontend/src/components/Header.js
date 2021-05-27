import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

function Header(props){
    return(
        <header>
            <Navbar bg="dark" variant="dark">
                <Navbar.Brand href="/">Domov</Navbar.Brand>
                <Nav className="mr-auto">
                    <Nav.Link href="/scraper">Traffic events</Nav.Link>
                </Nav>             
            </Navbar>
            <div className="loader" id="loader"></div>
        </header>
    )
}

export default Header;