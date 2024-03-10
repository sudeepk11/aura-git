import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../Utils/axios.config";
import { useUser } from "../../Contexts/userContext";

const InstitutionReceiptsApproval = () => {
  const { user } = useUser();

  const [transactionId, setTransactionId] = useState("");
  const [receiptDetails, setReceiptDetails] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!transactionId) {
      setError("Please enter the Transaction ID");
      return;
    }
    getReceiptDetails();
    if (error !== "") return;
    setLoading(true);
    setError("");
    setTransactionId("");
  };

  const getReceiptDetails = async () => {
    await api
      .get(`/college-receipts/${transactionId}`)
      .then((res) => {
        let data = res.data.data;
        setReceiptDetails(data.collegeReceipt);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
        // "400-invalidCollegeReceiptId"
        if (
          error.response.status === 400 &&
          error.response.data.error === "400-invalidCollegeReceiptId"
        )
          setError("Invalid Transaction ID");
        else setError("Something went wrong. Please try again later.");
      });
  };

  const approveReceipt = async (id) => {
    await api
      .post(`/college-receipts/${id}/approve`)
      .then((res) => {
        setMessage("Receipt Approved Successfully");
        setReceiptDetails((prev) => ({ ...prev, isApproved: true }));
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        setError("Something went wrong. Please try again later.");
      });
  };

  useEffect(() => {
    if (user?.role !== "admin") {
      return navigate("/");
    }
  }, [user]);

  return (
    <div className="grid form-container bg-signin bg-signinc w-screen">
      <div className="glass align-middle lg:col-start-2 rounded-lg grid justify-items-stretch p-5 lg:w-4/6 md:w-5/6 w-11/12 shadow-xl">
        <h1 className="font-bold text-xl text-center m-2">
          Approve Institute Receipt
        </h1>
        {error && <p className="msg-box text-red-500 text-center">{error}</p>}
        {message && (
          <p className="msg-box text-green-500 text-center">{message}</p>
        )}
        {loading && (
          <p className="msg-box text-green-500 text-center">
            Verifying transaction details...
          </p>
        )}
        <form className="grid justify-items-stretch gap-5">
          <div className="flex flex-col">
            <label htmlFor="email">Transaction ID</label>
            <input
              className="bg-gray-100 rounded-lg p-2 col-span-1 outline-none"
              type="email"
              id="email"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              placeholder="Enter the Institution's Transaction ID"
              required
            />
          </div>
          <div className="mt-8 mb-5">
            {/* <Link to="/user">Login</Link> */}
            <button className="btn btn-primary w-full" onClick={handleSubmit}>
              Get Reciept Details
            </button>
          </div>
        </form>
        {/* Display these details */}
        {receiptDetails && (
          <div className="grid gap-5 bg-white rounded-lg p-3">
            <div>
              <p>Transaction ID: {receiptDetails.transactionId}</p>
              <p>College Name: {receiptDetails.collegeName}</p>
              <p>Amount: {receiptDetails.amount}</p>
              <p>Balance Left: {receiptDetails.balanceLeft}</p>
              <p>
                Status:{" "}
                {receiptDetails.isApproved ? "Approved ✅" : "Not Approved ❌"}
              </p>
            </div>
          </div>
        )}
        {receiptDetails && !receiptDetails.isApproved && (
          <div className="mt-8 mb-5">
            <button
              className="btn btn-primary !bg-green-500 w-full"
              onClick={() => approveReceipt(receiptDetails._id)}
            >
              Approve Reciept
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default InstitutionReceiptsApproval;
