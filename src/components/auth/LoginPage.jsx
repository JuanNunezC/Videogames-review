import { signInWithPopup } from "firebase/auth";
import { useState } from "react";
import { auth, googleProvider } from "../../firebase";
import { useNavigate } from "react-router";
import Button from "../../ui/Button";
import GoogleButton from "../../ui/GoogleButton";

function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setError("");
      setLoading(true);
      const response = await signInWithPopup(auth, googleProvider);
      const token = await response.user.getIdToken();

      // Call backend to create session cookie
      await ensureCsrf();
      await createSession(token);

      navigate("/");
    } catch (error) {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <h1 className="text-white text-xl font-semibold mb-4 text-center">
      {error && <p className="mb-4 text-red-400">{error}</p>}
      <GoogleButton loading={loading} onClick={handleLogin} />
    </h1>
  );
}

export default LoginPage;
