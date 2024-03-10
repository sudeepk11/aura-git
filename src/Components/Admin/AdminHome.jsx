import { Link } from "react-router-dom";
import { useUser } from "../../Contexts/userContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminHomePage = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role !== "admin") {
      return navigate("/");
    }
  }, [user]);

  return (
    <div className="grid form-container bg-signin bg-signinc w-screen">
      <div className="glass align-middle lg:col-start-2 rounded-lg grid  gap-2 justify-items-stretch p-5 lg:w-4/6 md:w-5/6 w-11/12 shadow-xl">
        <Link to="/admin/check-in-participant" className="btn btn-primary">
          <h1 className="font-bold text-xl text-center m-2">
            Check in a Participant
          </h1>
        </Link>
        <Link
          to="/admin/institution-reciepts-approval"
          className="btn btn-primary"
        >
          <h1 className="font-bold text-xl text-center m-2">
            Approve Institute Receipt
          </h1>
        </Link>
      </div>
    </div>
  );
};
export default AdminHomePage;
