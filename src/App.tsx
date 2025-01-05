
import Footer from './components/Footer/Footer'
import Header from './components/Navbar/Navbar'
import { BrowserRouter as Router ,Route,Routes} from "react-router-dom";
import HomePage from './pages/HomePage/HomePage';
function App() {

  return (
    <Router>
      <div className='header-section'>
      <Header />

      </div>
      <div className='main-content'>
      <Routes>
        <Route path="/" element={<HomePage/>} />

      </Routes>
      </div>
     
      <Footer/>
    </Router>
  )
}

export default App
