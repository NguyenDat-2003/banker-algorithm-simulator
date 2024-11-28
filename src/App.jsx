import { BrowserRouter, Routes, Route } from 'react-router-dom'

import './App.css'
import BankersAlgorithmSimulator from './components/BankerSimulator'
import Theory from './components/Theory'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Theory />} />
          <Route path='/simulator' element={<BankersAlgorithmSimulator />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
