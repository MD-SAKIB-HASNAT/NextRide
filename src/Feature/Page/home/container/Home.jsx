import React from 'react';
import Banner from '../ui/Banner';
import UsedBike from '../ui/UsedBike';
import Feedback from '../ui/Feedback';
import UsedCar from '../ui/UsedCar';
import SuggestedVehicle from '../ui/SuggestedVehicle';
import AIChatAssistant from '@/Components/AIChatAssistant';

export default function Home() {
  return (
    <>
      <Banner /> 
      <SuggestedVehicle />
      <UsedBike />
      <UsedCar />
      <Feedback />
      <AIChatAssistant />
    </>
  );
}
