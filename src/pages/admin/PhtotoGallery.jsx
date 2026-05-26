import { useEffect, useState } from "react";
import { FaUpload, FaTrash, FaImage, FaCalendarAlt, FaCloudUploadAlt } from "react-icons/fa";
import { supabase } from "../../services/supabase-client";
import UploadPhotoModal from "../../components/adminDashboard/UploadPhotoModal";

const PhotoGallery = () => {
    const [photos, setPhotos] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [uploadedThisMonth, setUploadedThisMonth] = useState(0);
    const [albumCount, setAlbumCount] = useState(0);
    const [showUpload, setShowUpload] = useState(false);

    const fetchPhotos = async () => {
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();

        // all photos
        const { data, count } = await supabase
            .schema("me_dataspace")
            .from("gallery")
            .select("*", { count: "exact" })
            .order("created_at", { ascending: false });

        // uploaded this month
        const { count: monthCount } = await supabase
            .schema("me_dataspace")
            .from("gallery")
            .select("*", { count: "exact", head: true })
            .gte("created_at", startOfMonth);

        // distinct events (albums)
        const { data: events } = await supabase
            .schema("me_dataspace")
            .from("gallery")
            .select("eventID")
            .not("eventID", "is", null);

        const uniqueEvents = new Set(events?.map(e => e.eventID)).size;

        setPhotos(data || []);
        setTotalCount(count || 0);
        setUploadedThisMonth(monthCount || 0);
        setAlbumCount(uniqueEvents);
    };

    useEffect(() => {
        fetchPhotos();
    }, []);

    const handleDelete = async (itemID, storageURL) => {
        if (!confirm("Delete this photo?")) return;

        // extract filename from URL
        const fileName = storageURL.split("/").pop();

        // delete from storage
        await supabase.storage.from("gallery").remove([fileName]);

        // delete from table
        await supabase
            .schema("me_dataspace")
            .from("gallery")
            .delete()
            .eq("itemID", itemID);

        fetchPhotos();
    };

    return (
        <div className="p-6 bg-[#F5F0E8] min-h-screen">

            {/* Stat Cards */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white rounded-xl p-5 flex items-center gap-4">
                    <FaImage className="text-[#C1622A] text-2xl opacity-60" />
                    <div>
                        <p className="text-3xl font-bold text-gray-800">{totalCount}</p>
                        <p className="text-xs text-gray-400">Total Photos</p>
                    </div>
                </div>
                {/* <div className="bg-white rounded-xl p-5 flex items-center gap-4">
                    <FaCalendarAlt className="text-[#C1622A] text-2xl opacity-60" />
                    <div>
                        <p className="text-3xl font-bold text-gray-800">{albumCount}</p>
                        <p className="text-xs text-gray-400">Albums / Events</p>
                    </div>
                </div> */}
                <div className="bg-white rounded-xl p-5 flex items-center gap-4">
                    <FaCloudUploadAlt className="text-[#C1622A] text-2xl opacity-60" />
                    <div>
                        <p className="text-3xl font-bold text-gray-800">{uploadedThisMonth}</p>
                        <p className="text-xs text-gray-400">Uploaded This Month</p>
                    </div>
                </div>
            </div>

            {/* Photo Grid */}
            <div className="bg-white rounded-xl p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-gray-700">All Photos</h3>
                    <button
                        onClick={() => setShowUpload(true)}
                        className="bg-[#C1622A] text-white text-xs px-3 py-2 rounded-lg flex items-center gap-2"
                    >
                        <FaUpload size={10} /> Upload Photo
                    </button>
                </div>

                {photos.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-12">No photos yet. Upload your first one!</p>
                ) : (
                    <div className="grid grid-cols-6 gap-4 overflow-auto max-h-[60vh]">
                        {photos.map((photo) => (
                            <div key={photo.itemID} className="relative group rounded-lg overflow-hidden aspect-square">
                                <img
                                    src={photo.storageURL}
                                    alt={photo.alt_text || photo.title}
                                    className="w-full h-full object-cover"
                                />
                                {/* hover overlay */}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-2">
                                    <p className="text-white text-xs font-medium px-2 text-center">{photo.title}</p>
                                    <button
                                        onClick={() => handleDelete(photo.itemID, photo.storageURL)}
                                        className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                                    >
                                        <FaTrash size={12} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {showUpload && (
                <UploadPhotoModal
                    onClose={() => setShowUpload(false)}
                    onSuccess={fetchPhotos}
                />
            )}
        </div>
    );
};

export default PhotoGallery;