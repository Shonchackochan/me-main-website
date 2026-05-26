import { useState, useEffect } from 'react';
import { supabase } from '../../services/supabase-client';

const UpcomingEventsSection = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const { data, error } = await supabase
                    .schema('me_dataspace')
                    .from('events')
                    .select('*')
                    .gt('fromDateTime', new Date().toISOString())  // Only future events
                    .order('fromDateTime', { ascending: true });

                if (error) {
                    console.log('Error fetching events:', error);
                    setLoading(false);
                    return;
                }

                setEvents(data || []);
            } catch (err) {
                console.error('Exception:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    if (loading) return <div>Loading events...</div>;

    return (
        <div className="bg-white rounded-2xl p-6 flex flex-col h-80">
            <h2 className="text-2xl font-bold mb-4 text-[#8A7060]">Upcoming Events</h2>

            {events.length === 0 ? (
                <p className="text-gray-600">No upcoming events</p>
            ) : (
                <div className="space-y-4 overflow-y-auto flex-1">
                    {events.map((event) => (
                        <div key={event.eventID} className="border rounded-lg p-4 hover:shadow-md transition">
                            <div className="flex gap-4 ">
                                {event.bannerURL && (
                                    <img
                                        src={event.bannerURL}
                                        alt={event.title}
                                        className="w-24 h-24 object-cover rounded"
                                    />
                                )}
                                <div className="flex-1 flex justify-between">
                                    <div>
                                        <h3 className="text-lg font-bold text-[#A64200]">{event.title}</h3>
                                        <p className="text-gray-600 text-sm">{event.description}</p>
                                        <p className="text-sm text-gray-500 mt-2">
                                            {new Date(event.fromDateTime).toLocaleDateString()} at {new Date(event.fromDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                    <button className="mt-3 px-4 py-2 bg-[#A64200] text-white rounded-xl">
                                        Volunteer
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UpcomingEventsSection;