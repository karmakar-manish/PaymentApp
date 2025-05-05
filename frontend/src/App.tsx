import { BrowserRouter, Routes,Route, Navigate } from 'react-router-dom'
import Signin from "./pages/SignInPage"
import DashboardPage from './pages/DashboardPage'
import P2pTransferPage from './pages/P2pTransferPage'
import TransactionPage from './pages/TransactionPage'
import TransferPage from './pages/TransferPage'
import LayoutAfterSignin from './components/LayoutAfterSignin'

import './App.css'

function App() {
  

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Navigate to={"/signin"}/>}/>
        <Route path='/signin' element={<Signin/>}/>

        <Route element={<LayoutAfterSignin/>}>
          <Route path='/dashboard' element={<DashboardPage/>}/>
          <Route path='/p2ptransfer' element={<P2pTransferPage/>}/>
          <Route path='/transfer' element={<TransferPage/>}/>
          <Route path='/transactions' element={<TransactionPage/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
