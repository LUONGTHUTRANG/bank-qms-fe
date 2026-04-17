import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export function useCurrentTime() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { i18n } = useTranslation();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const timeString = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const dateString = currentTime.toLocaleDateString(
    i18n.language === 'en' ? 'en-US' : 'vi-VN', 
    {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    }
  );

  return { timeString, dateString };
}