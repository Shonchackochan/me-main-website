const ParticipatedEventsSection = () => {
    const dummyEvents = [
        { id: 1, title: "Community Meetup", date: "2026-04-15", description: "Monthly volunteer gathering" },
        { id: 2, title: "Tree Planting Drive", date: "2026-03-22", description: "Environmental awareness event" },
        { id: 3, title: "Mental Health Workshop", date: "2026-02-10", description: "Awareness and support session" },
    ];

    return (
        <div className="bg-white rounded-2xl p-6 flex flex-col">
            <h2 className="text-2xl font-bold mb-4 text-[#8A7060]">Participated Events</h2>

            <div className="space-y-3 ">
                {dummyEvents.map((event) => (
                    <div key={event.id} className="border rounded-lg p-4 hover:shadow-md transition">
                        <h3 className="text-md font-bold text-[#A64200]">{event.title}</h3>
                        <p className="text-gray-600 text-sm">{event.description}</p>
                        <p className="text-sm text-gray-400 mt-1">{new Date(event.date).toLocaleDateString()}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ParticipatedEventsSection;