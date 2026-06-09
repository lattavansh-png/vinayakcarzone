import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import AppRoutes from './routes/AppRoutes'
import ScrollToTop from './components/ScrollToTop/ScrollToTop'
import './styles/global.css'

function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <ScrollToTop />
      <main>
        <AppRoutes />
      </main>
      <Footer />
    </div>
  )
}

export default App
