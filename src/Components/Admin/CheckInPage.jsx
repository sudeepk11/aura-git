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
    console.log(user);
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

      if (data?.data?.checked_in === true) {
        setError("Aura ID already checked in");
        return;
      }

      if (data?.data?.user?.email_verified === false) {
        setError("Email not verified")
        return;
      }

      setFetchedUser({ ...data.data.user });
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
      setMessage("User Checked In!");
    } catch (e) {
      console.error(e);
      errorToast("Failed to check in student");
    }
  };

  return (
    <main className="h-screen  md:bg-contain bg-no-repeat bg-cover md:bg-left bg-right bg-scroll overflow-y-auto px-4 py-5">
      <div className=" bg-opacity-20 border border-gray-200 rounded p-4 mx-auto max-w-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mt-12">User Check In</h2>


        {error && <p className="msg-box text-red-500 text-center">{error}</p>}
        {message && <p className="msg-box text-green-500 text-center">{message}</p>}

        {fetchedUser === null ? (
          <form className="mt-8 flex flex-col items-center space-y-4" onSubmit={fetchStudentDetails}>
            <div className="w-full">
              <label htmlFor="aura_id" className="block">Aura ID</label>
              <input
                className="bg-gray-100 rounded-lg p-2 w-full outline-none"
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
              className="btn-secondary w-full text-white rounded py-2 px-6"
              type="submit"
            >
              Fetch Details
            </button>
          </form>
        ) : (
          <div className="mt-8 space-y-4">
            <div className="flex flex-col">
              <label htmlFor="_id" className="py-1">ID</label>
              <p>{fetchedUser?._id}</p>
            </div>
            <div className="flex flex-col">
              <label htmlFor="name" className="py-1">Name</label>
              <p>{fetchedUser?.name}</p>
            </div>
            <div className="flex flex-col">
              <label htmlFor="email" className="py-1">Email</label>
              <p>{fetchedUser?.email}</p>
            </div>
            <div className="flex flex-col">
              <label htmlFor="phone" className="py-1">Phone Number</label>
              <p>{fetchedUser?.phone}</p>
            </div>
            <div className="flex flex-col">
              <label htmlFor="usn" className="py-1">USN</label>
              <p>{fetchedUser?.usn}</p>
            </div>
            <div className="flex flex-col">
              <label htmlFor="college" className="py-1">College</label>
              <p>{fetchedUser?.college}</p>
            </div>
            <div className="flex flex-col">
              <label htmlFor="aura_id" className="py-1">Aura ID</label>
              <p>{fetchedUser?.aura_id}</p>
            </div>

            {fetchedUser?.receipts && (
              <div>
                <h3 className="font-bold">Receipts:</h3>
                {fetchedUser.receipts.map((receipt) => (
                  <div key={receipt._id} className="border border-gray-300 rounded p-2 mt-2">
                    <p><strong>Transaction ID:</strong> {receipt.transaction_id}</p>
                    <p><strong>Team Name:</strong> {receipt.team.team_name}</p>
                    <p><strong>Club:</strong> {receipt.event.club}</p>
                    <p><strong>Event Title:</strong> {receipt.event.title}</p>
                  </div>
                ))}
              </div>
            )}

            {fetchedUser?._profile_information && (
              <div className="mt-4">
                <h3 className="font-bold">Profile Information:</h3>
                <p><strong>Last Password Reset:</strong> {fetchedUser._profile_information.last_password_reset}</p>
                <p><strong>Account Creation Timestamp:</strong> {fetchedUser._profile_information.account_creation_timestamp}</p>
              </div>
            )}

            <button
              className="btn-primary w-full text-white rounded py-2 px-6 mt-4"
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
