import React from 'react'
import Navabar from '../components/header/Navabar'
import Footer from '../components/footer/Footer'
import HomeBody from '../components/home/HomeBody'

const Home = () => {
  return (
    <div>
        <Navabar/>
        <HomeBody/>
        <Footer/>
    </div>
  )
}

export default Home