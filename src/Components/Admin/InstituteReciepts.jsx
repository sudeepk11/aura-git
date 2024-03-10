import { Link } from "react-router-dom";
import { useState } from "react";
import api from "../../Utils/axios.config";

const InstitutionReceiptsApproval = () => {
  const [transactionId, setTransactionId] = useState("");
  const [receiptDetails, setReceiptDetails] = useState({});
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
    if (error === "") return;
    setLoading(true);
    setError("");
    setTransactionId("");
  };

  const getReceiptDetails = async () => {
    await api
      .get(`/college-receipts/${transactionId}`)
      .then((res) => {
        setReceiptDetails(res.data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
        if (error.response.status === 404)
          setError("No such transaction found");
        else setError("Something went wrong. Please try again later.");
      });
  };
  //   async function handleReset() {
  //     await api
  //       .post(`/tickets/verification/password?email=${email}`, {
  //         new_password: password,
  //       })
  //       .then((res) => {
  //         setMessage("Verification link sent to your mail.");
  //         setLoading(false);
  //       })
  //       .catch((error) => {
  //         setLoading(false);
  //         if (
  //           error.response.status === 400 &&
  //           error.response.data.error === "400-emailAlreadySent"
  //         )
  //           setMessage("Email already sent. Please check your mail.");
  //         else setError("Something went wrong. Please try again later.");
  //       });
  //   }

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
            Sending Verification link...
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
      </div>
    </div>
  );
};
export default InstitutionReceiptsApproval;
