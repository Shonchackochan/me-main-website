import Navbar from './Admin Manage Components/Navbar'
import Footer from './Admin Manage Components/Footer'
import UpcomingEvents from './Admin Manage Components/UpcomingEvents'
import EventActions from './Admin Manage Components/EventActions'

function ManageEvents() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f0ede8]">
      <Navbar />

      <main className="flex-1 px-8 py-7 box-border">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-serif text-3xl text-[#2a120a] font-bold m-0">
            Manage Events
          </h1>
          <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#c0623a] text-white text-xs font-semibold tracking-widest uppercase border-none cursor-pointer hover:bg-[#a84f2c] transition-colors">
            <i className="ti ti-arrow-left text-sm" /> Back
          </button>
        </div>

        <div className="grid gap-4" style={{ gridTemplateColumns: '1.4fr 1fr' }}>
          <UpcomingEvents />
          <EventActions />
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default ManageEvents