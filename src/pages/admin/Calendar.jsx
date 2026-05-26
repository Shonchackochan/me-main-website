import { useEffect, useState } from "react";
import { supabase } from "../../services/supabase-client";
import { FaUpload, FaPaperPlane, FaTrash, FaClock, FaEnvelope, FaImage } from "react-icons/fa";

const Calendar = () => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [calendars, setCalendars] = useState([]);
    const [preview, setPreview] = useState(null);

    const [form, setForm] = useState({
        month: "",
        year: "",
    });

    const fetchCalendarData = async () => {
        const { data, error } = await supabase
            .schema("me_dataspace")
            .from("event_calendars")
            .select("*")
            .order("published_at", { ascending: false });

        if (!error) {
            setCalendars(data || []);
        }
    };

    useEffect(() => {
        fetchCalendarData();
    }, []);

    const handleFileChange = (e) => {
        const selected = e.target.files[0];

        if (!selected) return;

        setFile(selected);
        setPreview(URL.createObjectURL(selected));
    };

    const handleUpload = async () => {
        if (!file) return alert("Choose a calendar first");

        try {
            setUploading(true);

            const fileName = `${Date.now()}-${file.name}`;

            const { error: uploadError } = await supabase.storage
                .from("calendars")
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            const {
                data: { publicUrl },
            } = supabase.storage
                .from("calendars")
                .getPublicUrl(fileName);

            const { error: dbError } = await supabase
                .schema("me_dataspace")
                .from("event_calendars")
                .insert([
                    {
                        cal_url: publicUrl,
                        published_at: new Date().toISOString(),
                        cal_month: parseInt(form.month),
                        cal_year: parseInt(form.year),
                    },
                ]);

            if (dbError) throw dbError;

            setFile(null);
            setPreview(null);
            setForm({
                month: "",
                year: "",
            });

            fetchCalendarData();

            alert("Calendar uploaded!");
        }
        catch (err) {
            console.error(err);
            alert("Upload failed");
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = confirm(
            "Delete this calendar permanently?"
        );

        if (!confirmDelete) return;

        const { error } = await supabase
            .schema("me_dataspace")
            .from("event_calendars")
            .delete()
            .eq("id", id);

        if (!error) {
            fetchCalendarData();
        }
    };


    return (
        <div className="bg-[#F5F0E8] min-h-screen p-8">

            {/* Main Content */}
            <div className="grid grid-cols-2 gap-5">
                <div>
                    {/* Upload Section */}
                    <div className=" bg-white rounded-2xl p-6 shadow-sm">

                        <h2 className="text-xl font-semibold mb-5 text-[#5A2E0C]">
                            Upload Calendar
                        </h2>

                        <label className="border-2 border-dashed border-[#D8C7B5] rounded-2xl h-[280px] flex flex-col justify-center items-center cursor-pointer hover:border-[#C1622A] transition">

                            {preview ? (
                                <img
                                    src={preview}
                                    alt="preview"
                                    className="h-full w-full object-cover rounded-2xl"
                                />
                            ) : (
                                <>
                                    <FaUpload className="text-5xl text-[#C1622A] mb-4" />

                                    <p className="text-lg font-medium text-gray-700">
                                        Click to upload calendar
                                    </p>

                                    <p className="text-sm text-gray-400 mt-2">
                                        JPG  PNG  supported
                                    </p>
                                </>
                            )}

                            <input
                                type="file"
                                hidden
                                onChange={handleFileChange}
                            />
                        </label>

                        <div className="grid grid-cols-2 gap-4 mt-4">

                            <input
                                type="number"
                                name="month"
                                min="1"
                                max="12"
                                value={form.month}
                                onChange={(e) =>
                                    setForm({ ...form, month: e.target.value })
                                }
                                placeholder="Month"
                                className="border rounded-lg px-3 py-2"
                            />

                            <input
                                type="number"
                                name="year"
                                value={form.year}
                                onChange={(e) =>
                                    setForm({ ...form, year: e.target.value })
                                }
                                placeholder="Year"
                                className="border rounded-lg px-3 py-2"
                            />

                        </div>

                        {file && (
                            <div className="mt-5 flex justify-between items-center bg-[#FAF6F1] p-4 rounded-xl">

                                <div>
                                    <p className="font-medium text-gray-700">
                                        {file.name}
                                    </p>

                                    <p className="text-xs text-gray-400">
                                        {(file.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                </div>
                            </div>
                        )}
                        {/* Publish Button */}
                        <div className=" rounded-2xl p-6 shadow-sm flex items-center justify-center">
                            <button
                                onClick={handleUpload}
                                disabled={uploading}
                                className="bg-[#C1622A] hover:bg-[#a24f21] text-white px-6 py-3 rounded-xl flex items-center gap-2 transition"
                            >
                                <FaPaperPlane />

                                {uploading
                                    ? "Uploading..."
                                    : "Publish Calendar"}
                            </button>
                        </div>
                    </div>

                </div>



                {/* Recent Uploads */}
                <div className="bg-white rounded-2xl p-6 shadow-sm ">

                    <div className="flex justify-between items-center mb-6">

                        <h2 className="text-xl font-semibold text-[#5A2E0C]">
                            Recent Calendars
                        </h2>

                        <span className="text-sm text-gray-400">
                            {calendars.length} total
                        </span>
                    </div>

                    <div className="space-y-4 overflow-y-auto max-h-[60vh]">

                        {calendars.length === 0 ? (
                            <div className="text-center py-12">

                                <FaImage className="mx-auto text-5xl text-gray-300 mb-4" />

                                <p className="text-gray-500">
                                    No calendars uploaded yet
                                </p>
                            </div>
                        ) : (
                            calendars.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex justify-between items-center border border-gray-100 rounded-xl p-4"
                                >
                                    <div className="flex items-center gap-4">

                                        <img
                                            src={item.cal_url}
                                            alt="calendar"
                                            className="w-20 h-20 object-cover rounded-lg"
                                        />

                                        <div>
                                            <p className="font-semibold text-gray-800">
                                                {`Calendar - ${item.cal_month}/${item.cal_year}`}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">

                                        <a
                                            href={item.cal_url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="bg-[#C1622A] text-white px-4 py-2 rounded-lg"
                                        >
                                            View
                                        </a>

                                        <button
                                            onClick={() =>
                                                handleDelete(item.id)
                                            }
                                            className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-lg"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Calendar;