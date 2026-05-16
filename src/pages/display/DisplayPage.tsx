import KioskHeader from '@/features/kiosk/components/KioskHeader';
import CounterGrid from '@/features/display/components/CounterGrid';
import SkippedTicketList from '@/features/display/components/NextQueueList';

export default function DisplayPage() {
  return (
    <div className="bg-surface text-on-surface h-screen w-screen overflow-hidden flex flex-col font-body">
      {/* Header with KioskHeader */}
      <KioskHeader />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-row gap-8 p-8 pt-0 overflow-hidden relative">
        {/* Counters Grid - 70% */}
        <CounterGrid />

        {/* Skipped Ticket List - 30% */}
        <SkippedTicketList />
      </main>
    </div>
  );
}
