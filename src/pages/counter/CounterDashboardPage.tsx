import { motion } from 'framer-motion';
import CurrentServingCard from '@/features/counter/components/CurrentServingCard';
import QuickStatsGrid from '@/features/counter/components/QuickStatsGrid';
import QueueListSection from '@/features/counter/components/QueueListSection';

// Container Variants for staggering animation
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function CounterDashboardPage() {
  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <motion.div variants={item} className="lg:col-span-7">
          <CurrentServingCard />
        </motion.div>
        <motion.div variants={item} className="lg:col-span-5 relative">
          <QuickStatsGrid />
        </motion.div>
      </div>
      <motion.div variants={item}>
        <QueueListSection />
      </motion.div>
    </motion.div>
  );
}