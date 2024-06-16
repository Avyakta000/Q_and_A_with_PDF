import React from 'react'

import {Route, Routes} from 'react-router-dom'
import Navbar from './Components/Navbar/Navbar'
import Footer from './Components/Footer/Footer'
import Home from './Components/Home/Home'


const App = () => {
  return (
    <div className='app'>
      <Navbar/>
      <Routes>
          <Route path='/' element={<Home/>}/>
      </Routes>
      <Footer/>
    </div>
  )
}

export default App