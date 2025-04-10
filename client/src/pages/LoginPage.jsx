import { useEffect } from "react";
import { useNavigate } from "react-router";
import baseURL from "../helpers/http";

const LoginPage = () => {
  const navigate = useNavigate();
  const handleCredentialResponse = async (response) => {
    try {
      // console.log("Encoded JWT ID token: " + response.credential);
      const res = await baseURL.post("/login", {
        token: response.credential
      });
      // console.log(res.data);
      const { access_token, id } = res.data;

      localStorage.setItem("authorization", `Bearer ${access_token}`);
      localStorage.setItem("userId", id);

      navigate("/home");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("authorization")) navigate("/home");
  });

  useEffect(() => {
    google.accounts.id.initialize({
      client_id:
        "1063275846486-a7dfui231ob8995fiffq1nphn6fqhces.apps.googleusercontent.com",
      callback: handleCredentialResponse
    });
    google.accounts.id.renderButton(
      document.getElementById("googleLogin"),
      {
        theme:
          localStorage.getItem("theme") === "dark" ? "filled_black" : "outline",
        size: "large",
        shape: "pill"
      } // customization attributes
    );
    google.accounts.id.prompt(); // also display the One Tap dialog
  });

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md font-semibold">
          <h2 className="py-6 text-xl">
            Login now with Google to get started!
          </h2>
          <div
            id="googleLogin"
            className="flex justify-center items-center"
          ></div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
