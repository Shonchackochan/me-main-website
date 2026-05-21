import eventImg from '../../assets/img.jpeg'

function EventsCard() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm flex flex-col">
      <p className="text-xl font-bold text-[#2a120a] mb-4">Upcoming Events</p>

      <div className="border border-[#f0ede8] rounded-xl overflow-hidden mb-4">
        <img
          src={eventImg}
          alt="World Mental Health Day"
          className="w-full h-44 object-cover block"
        />
        <div className="p-3">
          <p className="text-sm font-semibold text-[#2a120a] mb-1">
            October 10th, 2020 (World Mental Health Day)
          </p>
          <p className="text-[11px] font-semibold text-[#c0623a] tracking-widest uppercase m-0">
            A Movement Was Born
          </p>
        </div>
      </div>

      <button className="flex items-center justify-center gap-2 w-full px-5 py-3 rounded-full bg-[#c0623a] text-white text-xs font-semibold tracking-widest uppercase border-none cursor-pointer hover:bg-[#a84f2c] transition-colors mt-auto">
        View More Events <i className="ti ti-arrow-right text-base" />
      </button>
    </div>
  )
}

export default EventsCard