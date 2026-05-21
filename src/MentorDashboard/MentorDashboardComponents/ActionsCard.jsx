const actions = [
  'Manage Testimonials',
  'Manage Photo Gallery',
  'Manage Mentors',
]

function ActionsCard() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <p className="text-xl font-bold text-[#2a120a] mb-4">Other Actions</p>
      <div className="flex flex-col gap-3">
        {actions.map(label => (
          <button
            key={label}
            className="flex items-center justify-between px-5 py-3 rounded-full bg-[#c0623a] text-white text-xs font-semibold tracking-widest uppercase border-none cursor-pointer hover:bg-[#a84f2c] transition-colors"
          >
            <span>{label}</span>
            <i className="ti ti-arrow-right text-base" />
          </button>
        ))}
      </div>
    </div>
  )
}

export default ActionsCard