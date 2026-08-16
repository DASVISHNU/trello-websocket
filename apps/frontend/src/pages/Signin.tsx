import { useState } from "react";
import { useNavigate } from "react-router-dom";
function Signin() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate=useNavigate();
    const handleSignin = async () => {
    try {
        const response = await fetch(
            "http://localhost:8000/api/v1/auth/signin",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username,
                    password
                })
            }
        );

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem("token", data.token);

            navigate("/dashboard");
        } else {
            console.log(data.message);
        }

    } catch (error) {
        console.error("Signin failed:", error);
    }
};

    return (
        <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${"blue.jpg"})`,
      }}
    >
      <div className="text-white text-2xl font-bold mb-4">
        Sign-in TO KANBAN
      </div>

      <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl w-full max-w-xl h-80 rounded-2xl flex flex-col items-center justify-center gap-3">
        <h1 className="text-amber-50">Username</h1>

        <input
          type="text"
          className="bg-white/20 border border-white/30 rounded-xl px-4 py-2 text-white outline-none"
       placeholder="Username"
       value={username}
       onChange={(e)=>setUsername(e.target.value)} />

        <h1 className="text-amber-50">Password</h1>

        <input
          type="password"
          className="bg-white/20 border border-white/30 rounded-xl px-4 py-2 text-white outline-none"
        placeholder="Password"
        value={password}
        onChange={(e)=>setPassword(e.target.value)}/>

        <button className="bg-amber-300 px-6 py-2 rounded-xl cursor-pointer"
        onClick={handleSignin}>
          Sign in
        </button>
      </div>
    </div>
    );
}

export default Signin;