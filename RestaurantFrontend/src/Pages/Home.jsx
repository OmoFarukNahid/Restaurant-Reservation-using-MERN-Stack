import React from 'react'
import HeroSection from '../components/HeroSection';
import About from '../components/About';
import Menu from '../components/Menu';
import Team from '../components/Team';
import OurIdentity from '../components/OurIdentity';
import Services from '../components/Services';
import Reservation from '../components/Reservation';



const Home = () => {
  return (
    <>
 
    <HeroSection/>
    <About/>
    <Services/>
    <Menu/>
    <OurIdentity/>
    <Team/>
    <Reservation/>
    
    </>
  )
}

export default Home