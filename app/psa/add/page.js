'use client';
import React from 'react';
import WelcomeMessage from '../../components/welcome/Wellcome';


const AddEquipments = ({ welcomeMessage }) => {
  return (
   <div style={{ padding: '2rem' }}>
      <WelcomeMessage message={welcomeMessage} />
      <p>Please fill in the equipment details below.</p>
    </div>
  );
};

export default AddEquipments;