// import { useState } from "react";
// import { FaTimes, FaUpload } from "react-icons/fa";
// import { supabase } from "../../services/supabase-client";

// const UploadPhotoModal = ({ onClose, onSuccess }) => {
//     const [file, setFile] = useState(null);
//     const [preview, setPreview] = useState(null);
//     const [form, setForm] = useState({
//         title: "",
//         alt_text: "",
//     });
//     const [loading, setLoading] = useState(false);

//     const handleFileChange = (e) => {
//         const selected = e.target.files[0];
//         if (!selected) return;
//         setFile(selected);
//         setPreview(URL.createObjectURL(selected));
//     };

//     const handleChange = (e) => {
//         setForm({ ...form, [e.target.name]: e.target.value });
//     };

//     const handleUpload = async () => {
//         if (!file) return alert("Please select a photo.");
//         setLoading(true);

//         // step 1: upload to storage
//         const fileName = `${Date.now()}-${file.name}`;
//         const { error: uploadError } = await supabase.storage
//             .from("gallery")
//             .upload(fileName, file);

//         if (uploadError) {
//             console.error(uploadError);
//             setLoading(false);
//             return alert("Upload failed.");
//         }

//         // step 2: get public URL
//         const { data: { publicUrl } } = supabase.storage
//             .from("gallery")
//             .getPublicUrl(fileName);

//         // step 3: save to gallery table
//         const { error: dbError } = await supabase
//             .schema("me_dataspace")
//             .from("gallery")
//             .insert({
//                 title: form.title || null,
//                 alt_text: form.alt_text || null,
//                 storageURL: publicUrl,
//             });

//         setLoading(false);

//         if (dbError) {
//             console.error(dbError);
//             return alert("Saved to storage but failed to save to database.");
//         }

//         onSuccess?.(); // refresh gallery if needed
//         onClose();
//     };

//     return (
//         // backdrop
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//             <div className="bg-white rounded-2xl w-full max-w-md p-6 relative">

//                 {/* close button */}
//                 <button
//                     onClick={onClose}
//                     className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
//                 >
//                     <FaTimes />
//                 </button>

//                 <h2 className="font-semibold text-gray-800 text-lg mb-4">Upload Photo</h2>

//                 {/* file drop area */}
//                 <label className="border-2 border-dashed border-gray-200 rounded-xl w-full h-40 flex flex-col items-center justify-center cursor-pointer hover:border-[#C1622A] transition mb-4">
//                     {preview ? (
//                         <img src={preview} alt="preview" className="h-full w-full object-cover rounded-xl" />
//                     ) : (
//                         <>
//                             <FaUpload className="text-[#C1622A] text-2xl mb-2" />
//                             <p className="text-sm text-gray-400">Click to select a photo</p>
//                         </>
//                     )}
//                     <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
//                 </label>

//                 {/* fields */}
//                 <label className="text-xs text-gray-500">Title</label>
//                 <input
//                     name="title"
//                     value={form.title}
//                     onChange={handleChange}
//                     placeholder="e.g. Starlet Hackathon 2024"
//                     className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 mb-3 outline-none focus:border-[#C1622A]"
//                 />

//                 <label className="text-xs text-gray-500">Alt Text</label>
//                 <input
//                     name="alt_text"
//                     value={form.alt_text}
//                     onChange={handleChange}
//                     placeholder="e.g. Group photo at hackathon"
//                     className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-1 mb-3 outline-none focus:border-[#C1622A]"
//                 />

//                 <button
//                     onClick={handleUpload}
//                     disabled={loading}
//                     className="w-full bg-[#C1622A] text-white py-2 rounded-lg text-sm hover:bg-[#a8521f] transition"
//                 >
//                     {loading ? "Uploading..." : "Upload Photo"}
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default UploadPhotoModal;








import { useState } from "react";
import { FaTimes, FaUpload, FaTrash } from "react-icons/fa";
import { supabase } from "../../services/supabase-client";

const UploadPhotoModal = ({ onClose, onSuccess }) => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [eventID, setEventID] = useState("");

    const handleFileChange = (e) => {
        const selected = Array.from(e.target.files);
        const withPreview = selected.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
            title: "",
            alt_text: "",
        }));
        setFiles((prev) => [...prev, ...withPreview]);
    };

    const updateFile = (index, field, value) => {
        setFiles((prev) =>
            prev.map((f, i) => (i === index ? { ...f, [field]: value } : f))
        );
    };

    const removeFile = (index) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleUpload = async () => {
        if (files.length === 0) return alert("Please select at least one photo.");
        setLoading(true);

        for (const item of files) {
            // upload to storage
            const fileName = `${Date.now()}-${item.file.name}`;
            const { error: uploadError } = await supabase.storage
                .from("gallery")
                .upload(fileName, item.file);

            if (uploadError) {
                console.error("Upload error:", uploadError);
                continue; // skip this file, try next
            }

            // get public URL
            const { data: { publicUrl } } = supabase.storage
                .from("gallery")
                .getPublicUrl(fileName);

            // save to gallery table
            const { error: dbError } = await supabase
                .schema("me_dataspace")
                .from("gallery")
                .insert({
                    title: item.title || null,
                    alt_text: item.alt_text || null,
                    storageURL: publicUrl,
                    eventID: eventID ? parseInt(eventID) : null,
                });

            if (dbError) console.error("DB error:", dbError);
        }

        setLoading(false);
        onSuccess?.();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto">

                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <FaTimes />
                </button>

                <h2 className="font-semibold text-gray-800 text-lg mb-4">Upload Photos</h2>

                {/* Drop zone */}
                <label className="border-2 border-dashed border-gray-200 rounded-xl w-full h-32 flex flex-col items-center justify-center cursor-pointer hover:border-[#C1622A] transition mb-4">
                    <FaUpload className="text-[#C1622A] text-xl mb-2" />
                    <p className="text-sm text-gray-400">Click to select photos</p>
                    <p className="text-xs text-gray-300">You can select multiple</p>
                    <input
                        type="file"
                        accept="image/*"
                        multiple                    // 👈 allows multiple selection
                        className="hidden"
                        onChange={handleFileChange}
                    />
                </label>
                
                {/* Per-photo preview + fields */}
                {files.length > 0 && (
                    <div className="flex flex-col gap-4 mb-4">
                        {files.map((item, index) => (
                            <div key={index} className="flex gap-3 items-start border border-gray-100 rounded-xl p-3">

                                {/* preview */}
                                <div className="relative w-24 h-24 flex-shrink-0">
                                    <img
                                        src={item.preview}
                                        alt="preview"
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                    <button
                                        onClick={() => removeFile(index)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                                    >
                                        <FaTimes size={8} />
                                    </button>
                                </div>

                                {/* fields */}
                                <div className="flex-1 flex flex-col gap-2">
                                    <input
                                        value={item.title}
                                        onChange={(e) => updateFile(index, "title", e.target.value)}
                                        placeholder="Title (optional)"
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#C1622A]"
                                    />
                                    <input
                                        value={item.alt_text}
                                        onChange={(e) => updateFile(index, "alt_text", e.target.value)}
                                        placeholder="Alt text (optional)"
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#C1622A]"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* progress indicator */}
                {loading && (
                    <p className="text-xs text-gray-400 text-center mb-3">
                        Uploading {files.length} photo{files.length > 1 ? "s" : ""}...
                    </p>
                )}

                <button
                    onClick={handleUpload}
                    disabled={loading || files.length === 0}
                    className="w-full bg-[#C1622A] text-white py-2 rounded-lg text-sm hover:bg-[#a8521f] transition disabled:opacity-50"
                >
                    {loading ? "Uploading..." : `Upload ${files.length > 0 ? files.length : ""} Photo${files.length !== 1 ? "s" : ""}`}
                </button>

            </div>
        </div>
    );
};

export default UploadPhotoModal;