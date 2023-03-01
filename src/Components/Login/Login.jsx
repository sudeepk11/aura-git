import { Link } from "react-router-dom";
import { useState } from "react";
import { useUser } from "../../Contexts/userContext";
// import { useCookies } from "react-cookie";
// import axios from "axios";
import api from "../../Utils/axios.config";

const Login = () => {
  // eslint-disable-next-line no-unused-vars
  const { setUser } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  // const [cookies, setCookie] = useCookies(["user"]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter all fields");
      return;
    }
    setLoading(true);
    handleLogin();
  };

  const handleLogin = async (loginData) => {
    try {
      await api
        .post("/auth/user/login", {
          email,
          password,
        })
        .then((res) => {
          localStorage.setItem("uid", res.data.data.user);
          setUser({ id: res.data.user, email, password });
          setLoading(false);
          setError("");
          setEmail("");
          setPassword("");
        });
    } catch (error) {
      console.error(error);
      setLoading(false);
      setError("Invalid Credentials");
    }
  };

  return (
    <div className="grid form-container bg-signin bg-signinc w-screen user-none">
      <div className="form-box bg-slate-400 bg-clip-padding backdrop-filter backdrop-blur-lg border overflow-hidden bg-opacity-20 border-black-100 md:mr-64">
        <h1 className="font-bold text-xl text-center m-2">Login</h1>
        {error && <p className="text-red-500 text-center">{error}</p>}
        {loading && <p className="text-green-500 text-center">Verifying</p>}
        <div>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 my-1">
              <label className="py-3 col-span-1" htmlFor="email">
                Email
              </label>
              <input
                className="bg-gray-100 rounded-lg p-2 col-span-1 outline-none"
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Your Email"
              />
            </div>
            <div className="grid grid-cols-1 my-1">
              <label className="py-3 col-span-1" htmlFor="password">
                Password
              </label>
              <input
                className="bg-gray-100 rounded-lg p-2 col-span-1 outline-none"
                type="password"
                name="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength="8"
                required
                placeholder="Your Password"
              />
            </div>
            <div className="mt-8 mb-5">
              {/* <Link to="/user">Login</Link> */}
              <button className="btn btn-primary w-full" type="submit">
                Login
              </button>
            </div>
          </form>
          <div className="grid grid-cols-2">
            <Link className="col-span-1 justify-self-start" to="/signup">
              New? Signup here!
            </Link>
            <Link className="col-span-1 justify-self-end" to="/forgot-password">
              Forgot Password
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
