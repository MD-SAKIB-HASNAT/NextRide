import React from 'react';
import Banner from '../ui/Banner';
import UsedBike from '../ui/UsedBike';
import BrandMarquee from '../ui/BrandMarquee';
import UsedCar from '../ui/UsedCar';
import SuggestedRentVehicle from '../ui/SuggestedRentVehicle';

export default function Home() {
  return (
    <>
      <Banner /> 
      <SuggestedRentVehicle />
      <UsedBike />
      <UsedCar />
      <BrandMarquee />
      
    </>
  );
}
