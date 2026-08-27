import React from 'react';

export default function App() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      backgroundColor: '#fff',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '32px', margin: '0 0 10px 0' }}>BusinessSetup</h1>
        <p style={{ fontSize: '16px', color: '#666', margin: 0 }}>App is Running! 🎉</p>
      </div>
    </div>
  );
}