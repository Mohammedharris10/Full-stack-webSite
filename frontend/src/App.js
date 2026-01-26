import './App.css';
import Home from './components/Home';
import Footer from './components/layouts/Footer';
import Header from './components/layouts/header';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from "react-helmet-async";
import {ToastContainer} from 'react-toastify'
import ProductDetails from './components/product/productDetails';
import ProductSearch from './components/product/productSearch';


function App() {
  return (
    <Router>
      <div className="App">
        <HelmetProvider>
          <Header />
          <ToastContainer theme='dark'/>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search/:keyword" element={<ProductSearch/>} />
            <Route path="/product/:id" element={<ProductDetails/>} />
          </Routes>
          <Footer />
        </HelmetProvider>
      </div>
    </Router>
  );
}

export default App;
