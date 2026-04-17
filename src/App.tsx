import AppRouter from '@/routes/AppRouter'
import { GlobalToastContainer } from '@/components/common/ToastMessage'

export default function App() {
  return (
    <>
      <AppRouter />
      <GlobalToastContainer />
    </>
  )
}
