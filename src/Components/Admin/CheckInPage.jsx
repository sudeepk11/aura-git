import React, { useEffect, useState } from "react";
import { errorToast } from "../../Utils/Toasts/Toasts";
import api from "../../Utils/axios.config";
import { useUser } from "../../Contexts/userContext";
import { useNavigate } from "react-router-dom";

function CheckInPage() {
  const { user } = useUser();

  const [auraId, setAuraId] = useState("");
  const [fetchedUser, setFetchedUser] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role !== "admin") {
      return navigate("/");
    }
  }, [user]);

  const fetchStudentDetails = async (e) => {
    e.preventDefault();

    if (auraId.trim().length === 0 || !auraId.startsWith("AURA")) {
      setError("Enter a valid AURA ID");
    }

    try {
      const { data } = await api.get(`users/aura-id/${auraId}`);
      if (data?.success === false) throw new Error("Failed to fetch");

      if (data?.profile?.checked_in === true) {
        setError("Aura ID already checked in");
        return;
      }

      setFetchedUser({ ...data.data.user, checkedIn: data.profile.checked_in });
      setMessage("Details fetched successfully");
    } catch (e) {
      console.error(e);
      setError("Failed to check in student");
    } finally {
      setTimeout(() => {
        setMessage("");
        setError("");
      }, 1000);
    }
  };

  const checkInStudent = async () => {
    try {
      const { data } = await api.post(`users/aura-id/${auraId}/check-in`);
      if (!data?.success) setError("Failed to check in user");

      navigate("/");
    } catch (e) {
      console.error(e);
      errorToast("Failed to check in student");
    }
  };

  return (
    <main className="h-screen bg-schedulec bg-schedule md:bg-contain bg-no-repeat bg-cover md:bg-left bg-right bg-scroll overflow-scroll [&::-webkit-scrollbar]:hidden md:px-10 px-1 py-5">
      <div className="bg-slate-600 bg-clip-padding backdrop-filter backdrop-blur-lg border overflow-hidden bg-opacity-20 p-4 m-4 h-4/5 shadow-md lg:shadow-none rounded lg:w-2/3 lg:absolute right-0">
        <h2 className="text-2xl font-bold text-center mt-12">User Check In</h2>

        {error && <p className="msg-box text-red-500 text-center">{error}</p>}

        {message && (
          <p className="msg-box text-green-500 text-center">{message}</p>
        )}

        {fetchedUser === null ? (
          <form
            className="mt-16 flex flex-col items-center w-full lg:mx-12 "
            onSubmit={fetchStudentDetails}
          >
            <div className="flex flex-col lg:w-1/3">
              <label className="py-3" htmlFor="aura_id">
                Aura ID
              </label>
              <input
                className="bg-gray-100 rounded-lg p-2 outline-none"
                type="text"
                name="aura_id"
                id="aura_id"
                value={auraId}
                onChange={(e) => setAuraId(e.target.value)}
                required
                placeholder="Please enter your AURA ID here"
              />
            </div>

            <button
              className="my-8 btn-secondary text-white rounded py-2 px-6"
              type="submit"
            >
              Fetch Details
            </button>
          </form>
        ) : (
          <div className="mt-4 flex flex-col items-center w-full lg:mx-12">
            <div className="flex flex-col lg:w-1/3 w-3/4">
              <label className="py-3" htmlFor="name">
                Name
              </label>
              <input
                className="bg-gray-100 disabled:bg-gray-300 rounded-lg p-2 outline-none"
                type="text"
                name="name"
                id="name"
                value={fetchedUser?.name}
                disabled
              />
            </div>
            <div className="flex flex-col w-3/4 lg:w-1/3">
              <label className="py-3" htmlFor="aura_id">
                College
              </label>
              <input
                className="bg-gray-100 disabled:bg-gray-300 rounded-lg p-2 outline-none"
                type="text"
                name="name"
                id="name"
                value={fetchedUser?.college}
                disabled
              />
            </div>
            <div className="flex flex-col w-3/4 lg:w-1/3">
              <label className="py-3" htmlFor="phone">
                Phone Number
              </label>
              <input
                className="bg-gray-100 disabled:bg-gray-300 rounded-lg p-2 outline-none"
                type="text"
                name="phone"
                id="phone"
                value={fetchedUser?.phone}
                disabled
              />
            </div>
            <div className="flex flex-col w-3/4 lg:w-1/3">
              <label className="py-3" htmlFor="aura-id">
                AURA ID
              </label>
              <input
                className="bg-gray-100 disabled:bg-gray-300 rounded-lg p-2 outline-none"
                type="text"
                name="aura-id"
                id="aura-id"
                value={fetchedUser?.aura_id}
                disabled
              />
            </div>

            <button
              className="my-8 btn-secondary text-white rounded py-2 px-6"
              type="submit"
              onClick={checkInStudent}
            >
              Check In
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

export default CheckInPage;
