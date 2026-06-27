import React from 'react'
import ProductPreview from './Home/Section2'
import Section1 from './Home/Section1'
import HarmonySteps from './Home/Section3'
import Steps from './Home/Section4'
import FeatureCards from './Home/Section5'
import LandingCard from './Home/Section6'


const HomePage = () => {
  return (
    <>
        <Section1 />
        <ProductPreview />
        <HarmonySteps />
        <Steps />
        <FeatureCards />
        <LandingCard />
    </>
  )
}

export default HomePage