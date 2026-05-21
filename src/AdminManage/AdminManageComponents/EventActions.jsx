function EventActions() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <p className="text-xl font-bold text-[#2a120a] mb-4">Actions</p>
      <div className="flex flex-col gap-3">

        <button className="flex items-center justify-between px-5 py-3 rounded-full bg-[#c0623a] text-white text-xs font-semibold tracking-widest uppercase border-none cursor-pointer hover:bg-[#a84f2c] transition-colors">
          <span>Create Event</span>
          <i className="ti ti-arrow-right text-base" />
        </button>

        <button className="flex items-center justify-between px-5 py-3 rounded-full bg-[#d9cfc9] text-[#2a120a] text-xs font-semibold tracking-widest uppercase border-none cursor-pointer hover:bg-[#ccc3bc] transition-colors">
          <span>Edit Event</span>
          <i className="ti ti-arrow-right text-base" />
        </button>

        <button className="flex items-center justify-between px-5 py-3 rounded-full bg-[#d9cfc9] text-[#2a120a] text-xs font-semibold tracking-widest uppercase border-none cursor-pointer hover:bg-[#ccc3bc] transition-colors">
          <span>Delete Event</span>
          <i className="ti ti-arrow-right text-base" />
        </button>

      </div>
    </div>
  )
}

export default EventActions