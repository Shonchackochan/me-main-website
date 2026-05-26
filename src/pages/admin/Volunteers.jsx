import { useEffect, useState } from "react";
import { supabase } from "../../services/supabase-client";
import { FaEdit, FaTrash, FaSpinner, FaTimes } from "react-icons/fa";

const Volunteers = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingVolunteer, setEditingVolunteer] = useState(null);
  const [editFormData, setEditFormData] = useState({
    firstName: "",
    lastName: "",
    emailID: "",
  });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState(null);

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const fetchVolunteers = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .schema('me_dataspace')
        .from("users")
        .select("*")
        .eq("role", "VOLUNTEER");

      if (error) throw error;

      setVolunteers(data || []);
    } catch (err) {
      console.error("Error fetching volunteers:", err);
      setError(err.message || "Failed to fetch volunteers");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this volunteer?"
    );

    if (!confirmDelete) return;

    try {
      const { error } = await supabase
        .schema('me_dataspace')
        .from("users")
        .delete()
        .eq("userID", id);

      if (error) throw error;

      setVolunteers(volunteers.filter(v => v.userID !== id));
    } catch (err) {
      console.error("Error deleting volunteer:", err);
      alert("Failed to delete volunteer: " + err.message);
    }
  };

  const handleEdit = (volunteer) => {
    setEditingVolunteer(volunteer);
    setEditFormData({
      firstName: volunteer.firstName || "",
      lastName: volunteer.lastName || "",
      emailID: volunteer.emailID || "",
    });
    setEditError(null);
    setShowEditModal(true);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveEdit = async () => {
    if (!editingVolunteer || !editFormData.firstName.trim() || !editFormData.lastName.trim() || !editFormData.emailID.trim()) {
      setEditError("Please fill in all required fields");
      return;
    }

    setEditLoading(true);
    setEditError(null);

    try {
      const { error } = await supabase
        .schema('me_dataspace')
        .from("users")
        .update({
          firstName: editFormData.firstName.trim(),
          lastName: editFormData.lastName.trim(),
          emailID: editFormData.emailID.trim(),
        })
        .eq("userID", editingVolunteer.userID);

      if (error) throw error;

      // Update local state
      setVolunteers(volunteers.map(v =>
        v.userID === editingVolunteer.userID
          ? {
            ...v,
            firstName: editFormData.firstName.trim(),
            lastName: editFormData.lastName.trim(),
            emailID: editFormData.emailID.trim(),
          }
          : v
      ));

      setShowEditModal(false);
      setEditingVolunteer(null);
      alert("Volunteer details updated successfully!");
    } catch (err) {
      console.error("Error updating volunteer:", err);
      setEditError(err.message || "Failed to update volunteer details");
    } finally {
      setEditLoading(false);
    }
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingVolunteer(null);
    setEditFormData({
      firstName: "",
      lastName: "",
      emailID: "",
    });
    setEditError(null);
  };

  return (
    <div className="p-6 bg-[#F7F2EC] min-h-screen">
      {/* Top Section */}
      <div className="flex justify-between items-center mb-5">
        <p className="text-sm text-gray-500">
          Showing {volunteers.length} volunteers
        </p>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <p className="font-medium">Error loading volunteers</p>
          <p className="text-sm">{error}</p>
          <button
            onClick={fetchVolunteers}
            className="mt-2 px-4 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <FaSpinner className="animate-spin text-[#A64200] text-3xl" />
        </div>
      )}

      {/* Empty State */}
      {!loading && volunteers.length === 0 && (
        <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
          <p className="text-gray-500 text-lg">No volunteers found</p>
          <p className="text-gray-400 text-sm mt-1">Volunteers will appear here once they register</p>
        </div>
      )}

      {/* Table */}
      {!loading && volunteers.length > 0 && (
        <div className="bg-white rounded-xl overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="grid grid-cols-4 bg-[#EFE7DD] text-[#6B4B2A] text-sm font-semibold p-4">
            <p>Member</p>
            <p>Email</p>
            <p>Events Volunteered</p>
            <p className="text-center">Actions</p>
          </div>

          {/* Rows */}
          <div className="overflow-auto max-h-[80vh]">
          {volunteers.map((volunteer) => (
            <div
              key={volunteer.userID}
              className="grid grid-cols-4 items-center p-4 border-t border-gray-100"
            >
              {/* Member */}
              <div className="flex items-center gap-3">
                <img
                  src={
                    volunteer.photo ||
                    "https://via.placeholder.com/40"
                  }
                  alt="profile"
                  className="w-10 h-10 rounded-full object-cover"
                />

                <p className="font-medium text-gray-700">
                  {volunteer.firstName} {volunteer.lastName}
                </p>
              </div>

              {/* Email */}
              <p className="text-gray-600 text-sm">
                {volunteer.emailID}
              </p>

              {/* Events */}
              <div className="flex flex-wrap gap-2">
                {volunteer.events?.length > 0 ? (
                  volunteer.events.map((event, index) => (
                    <span
                      key={index}
                      className="bg-orange-100 text-[#B86B2B] px-2 py-1 rounded-full text-xs"
                    >
                      {event}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400 text-sm">
                    None yet
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => handleEdit(volunteer)}
                  className="border p-2 rounded-lg hover:bg-blue-100 transition text-blue-600"
                >
                  <FaEdit size={14} />
                </button>

                <button
                  onClick={() => handleDelete(volunteer.userID)}
                  className="border p-2 rounded-lg hover:bg-red-100 transition text-red-600"
                >
                  <FaTrash size={14} />
                </button>
              </div>
            </div>
          ))}
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingVolunteer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-screen overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Edit Volunteer</h2>
              <button
                onClick={closeEditModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {editError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {editError}
                </div>
              )}

              {/* Form Fields */}
              <div className="space-y-4">
                {/* First Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={editFormData.firstName}
                    onChange={handleEditInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A64200]"
                    placeholder="Enter first name"
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={editFormData.lastName}
                    onChange={handleEditInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A64200]"
                    placeholder="Enter last name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email ID *
                  </label>
                  <input
                    type="email"
                    name="emailID"
                    value={editFormData.emailID}
                    onChange={handleEditInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A64200]"
                    placeholder="Enter email address"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={closeEditModal}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition font-medium"
                disabled={editLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="flex-1 px-4 py-2 bg-[#A64200] text-white rounded-lg hover:bg-[#8B3600] transition font-medium flex items-center justify-center gap-2"
                disabled={editLoading}
              >
                {editLoading ? (
                  <>
                    <FaSpinner className="animate-spin" size={14} />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Volunteers;