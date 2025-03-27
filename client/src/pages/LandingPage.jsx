import { useEffect } from "react";
import { Link, useNavigate } from "react-router";

const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("authorization")) navigate("/home");
  });

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Welcome to Otakollect!</h1>
          <p className="py-6">
            Discover and manage your favorite animes and mangas in one place.
          </p>
          <Link className="btn btn-primary5" to="login">
            Login Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
