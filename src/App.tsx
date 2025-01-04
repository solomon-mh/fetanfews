
import Footer from './components/Footer/Footer'
import Header from './components/Navbar/Navbar'
import { BrowserRouter as Router ,Route,Routes} from "react-router-dom";
import HomePage from './pages/HomePage/HomePage';
function App() {

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage/>} />

      </Routes>
      <Footer/>
    </Router>
  )
}

export default App
