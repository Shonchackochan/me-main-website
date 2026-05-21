import Navbar from './MentorDashboardComponents/Navbar'
import Footer from './MentorDashboardComponents/Footer'
import EventsCard from './MentorDashboardComponents/EventsCard'
import ActionsCard from './MentorDashboardComponents/ActionsCard'

function Dashboard() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f0ede8]">
      <Navbar />

      <main className="flex-1 px-8 py-7 box-border">
        <h1 className="font-serif text-3xl text-[#2a120a] font-bold mb-6">
          Welcome back, Mentor!
        </h1>

        <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <EventsCard />
          <ActionsCard />
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Dashboard