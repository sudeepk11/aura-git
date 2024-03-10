import { Link } from "react-router-dom";
import { useState } from "react";
import api from "../../Utils/axios.config";
import colleges from "../../Dataset/collegesKar.json";

const collegesList = colleges.map((college, index) => (
  <option key={index} value={college.college}>
    {college.college.length < 30
      ? college.college
      : college.college.substring(0, 30) + "..."}
  </option>
));

const InstituteReg = () => {
  const [collegeName, setCollegeName] = useState("");
  const [collegeSecret, setCollegeSecret] = useState("");
  const [amount, setAmount] = useState("");
  const [transactionId, setTransactionId] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!collegeSecret | !collegeName | !amount | !transactionId) {
      setError("Please enter all fields");
      return;
    }

    if (collegeSecret.length < 6) {
      setError("College Secret should be atleast 6 characters long");
      return;
    }

    // Validate the secret:(^[a-z0-9-]{6,}$)
    if (!collegeSecret.match(/^[a-z0-9-]{6,}$/)) {
      setError(
        "College Secret should contain only lowercase letters, numbers and hyphens"
      );
      return;
    }

    if (amount < 0) {
      setError("Amount should be a positive number");
      return;
    }

    setLoading(true);
    handleFormSubmit();
    setCollegeName("");
    setCollegeSecret("");
    setAmount("");
    setTransactionId("");
  };
  async function handleFormSubmit() {
    await api
      .post(`/college-receipts`, {
        collegeName: collegeName,
        collegeSecret: collegeSecret,
        amount: amount,
        transactionId: transactionId,
      })
      .then((res) => {
        setMessage(
          "We have received your details. The council will soon approve your request."
        );
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        // 400-duplicateTransactionId
        // 400-duplicateCollegeSecret
        if (
          error.response.status === 400 &&
          error.response.data.error === "400-duplicateTransactionId"
        )
          setMessage("Transaction ID already exists. Please check again.");
        else if (
          error.response.status === 400 &&
          error.response.data.error === "400-duplicateCollegeSecret"
        )
          setMessage("Please use a different College Secret");
        else setError("Something went wrong. Please try again later.");
      });
  }

  return (
    <div className="grid form-container bg-signin bg-signinc w-screen">
      <div className="glass align-middle lg:col-start-2 rounded-lg grid justify-items-stretch p-5 lg:w-4/6 md:w-5/6 w-11/12 shadow-xl">
        <h1 className="font-bold text-xl text-center m-2">
          Institution Registration
        </h1>
        <p className="font-semibold text-md text-center m-2">
          Please submit your college transaction details
        </p>
        {error && <p className="msg-box text-red-500 text-center">{error}</p>}
        {message && (
          <p className="msg-box text-green-500 text-center">{message}</p>
        )}
        {loading && (
          <p className="msg-box text-green-500 text-center">
            Sending Verification link...
          </p>
        )}
        <div>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 my-1">
              <label className="py-3 col-span-1" htmlFor="college">
                College
              </label>
              <input
                className="bg-gray-100 rounded-lg p-2 col-span-1 outline-none"
                type="text"
                name="college"
                id="college"
                value={collegeName}
                onChange={(e) => setCollegeName(e.target.value)}
                required
                placeholder="Your College Name"
                list="colleges"
              />
              <datalist id="colleges">{collegesList}</datalist>
            </div>
            <div className="grid grid-cols-1 my-1">
              <label className="py-3 col-span-1" htmlFor="collegeSecret">
                College Secret
              </label>
              <input
                className="bg-gray-100 rounded-lg p-2 col-span-1 outline-none"
                type="password"
                name="collegeSecret"
                id="collegeSecret"
                value={collegeSecret}
                onChange={(e) => setCollegeSecret(e.target.value)}
                required
                placeholder="Your College Secret"
              />
            </div>
            <div className="grid grid-cols-1 my-1">
              <label className="py-3 col-span-1" htmlFor="amount">
                Amount
              </label>
              <input
                className="bg-gray-100 rounded-lg p-2 col-span-1 outline-none"
                type="number"
                name="amount"
                id="amount"
                value={amount}
                minLength={6}
                onChange={(e) => setAmount(e.target.value)}
                required
                placeholder="Amount"
              />
            </div>
            <div className="grid grid-cols-1 my-1">
              <label className="py-3 col-span-1" htmlFor="transactionId">
                Transaction ID
              </label>
              <input
                className="bg-gray-100 rounded-lg p-2 col-span-1 outline-none"
                type="text"
                name="transactionId"
                id="transactionId"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                required
                placeholder="Transaction ID"
              />
            </div>
            <div className="mt-8 mb-5">
              {/* <Link to="/user">Login</Link> */}
              <button
                className="btn btn-primary w-full"
                type="submit"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default InstituteReg;
