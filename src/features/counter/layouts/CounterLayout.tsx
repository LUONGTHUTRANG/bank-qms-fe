import CounterSidebar from '../components/CounterSidebar';
import CounterHeader from '../components/CounterHeader';
import SessionStartScreen from '../components/SessionStartScreen';
import { Outlet } from 'react-router';
import { useState } from 'react';

export default function CounterLayout() {
  const [isSessionStarted, setIsSessionStarted] = useState(false);
  const [selectedCounter, setSelectedCounter] = useState('01');

  return (
    <div className="bg-[#f9f9ff] text-[#191c20] antialiased overflow-x-hidden min-h-screen font-sans">
      <CounterSidebar />
      <main className="md:ml-64 h-screen flex flex-col">
        <CounterHeader />
        <div className="flex-1 p-6 md:p-8 pb-24 mx-auto space-y-6 w-full overflow-y-auto">
          {!isSessionStarted ? (
            <SessionStartScreen 
              selectedCounter={selectedCounter}
              setSelectedCounter={setSelectedCounter}
              onStartSession={() => setIsSessionStarted(true)}
            />
          ) : (
            <Outlet context={{ endSession: () => setIsSessionStarted(false), selectedCounter }} />
          )}
        </div>
      </main>
      
      {/* Floating Action Button for Emergency / Direct Call */}
      {isSessionStarted && (
        <button className="fixed bottom-8 right-8 w-14 h-14 bg-[#003063] text-white rounded-full shadow-2xl flex items-center justify-center group hover:scale-110 active:scale-95 transition-all duration-300 z-50 cursor-pointer">
          <span className="material-symbols-outlined text-2xl group-hover:rotate-12 transition-transform">add_call</span>
        </button>
      )}
    </div>
  );
}