import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './index.css';

function App() {
  return (
    <div className="w-screen h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4 text-blue-600">勤怠管理アプリ</h1>
        <p className="text-gray-600 mb-6">顔認証とGPSで打刻できます</p>
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded w-full">
          打刻する
        </button>
      </div>
    </div>
  );
}

export default App;