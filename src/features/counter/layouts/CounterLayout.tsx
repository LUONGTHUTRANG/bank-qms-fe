import CounterSidebar from '../components/CounterSidebar';
import CounterHeader, { type UserInfoDto } from '../components/CounterHeader';
import SessionStartScreen from '../components/SessionStartScreen';
import { Outlet } from 'react-router';
import { useState, useEffect } from 'react';
import { authService } from '@/services/authService';
import { toast } from '@/stores/useToastStore';

export default function CounterLayout() {
  const [isSessionStarted, setIsSessionStarted] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [selectedCounter, setSelectedCounter] = useState('01');
  const [userInfo, setUserInfo] = useState<UserInfoDto | null>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [profileRes, activeSessionRes]: any = await Promise.allSettled([
          authService.getProfile(),
          authService.getActiveCounterSession()
        ]);
        
        if (profileRes.status === 'fulfilled' && profileRes.value) {
          const res = profileRes.value;
          if (res.data) {
             setUserInfo(res.data);
          } else {
             setUserInfo(res as UserInfoDto);
          }
        }
        
        if (activeSessionRes.status === 'fulfilled' && activeSessionRes.value) {
           const sessionData = activeSessionRes.value.data || activeSessionRes.value;
           if (sessionData && sessionData.id) {
              setIsSessionStarted(true);
              if (sessionData.counterId) {
                setSelectedCounter(sessionData.counterId.toString());
              }
           }
        }
      } catch (err) {
        console.error('Lỗi khi lấy dữ liệu ban đầu', err);
      } finally {
        setIsCheckingSession(false);
      }
    };
    fetchInitialData();
  }, []);

  if (isCheckingSession) {
    return (
      <div className="min-h-screen bg-[#f9f9ff] flex flex-col items-center justify-center">
        <span className="material-symbols-outlined text-4xl text-[#003063] animate-spin mb-4">sync</span>
        <p className="text-slate-500 font-medium animate-pulse">Đang định tuyến hệ thống...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#f9f9ff] text-[#191c20] antialiased overflow-x-hidden min-h-screen font-sans">
      {/* <CounterSidebar /> */}
      <main className="h-screen flex flex-col">
        <CounterHeader user={userInfo} isSessionStarted={isSessionStarted} />
        <div className="flex-1 p-6 md:p-8 pb-24 mx-auto space-y-6 w-full overflow-y-auto">
          {!isSessionStarted ? (
            <SessionStartScreen 
              selectedCounter={selectedCounter}
              setSelectedCounter={setSelectedCounter}
              onStartSession={() => setIsSessionStarted(true)}
            />
          ) : (
            <Outlet context={{ 
              endSession: async () => {
                try {
                  await authService.endCounterSession();
                  toast.success('Phiên làm việc đã kết thúc thành công');
                  setIsSessionStarted(false);
                } catch (error) {
                  console.error('Error ending session:', error);
                  toast.error('Lỗi khi kết thúc phiên. Vui lòng thử lại.');
                }
              }, 
              selectedCounter 
            }} />
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