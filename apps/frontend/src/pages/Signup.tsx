import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup()
{

    let [show,setShow]=useState(false)
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    // 👇 YAHAN handleSignup likho
   const handleSignup = async () => {
    try {
        const response = await fetch(
            "http://localhost:8000/api/v1/auth/signup",
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
            console.log("Signup successful:", data);

            navigate("/signin");
        } else {
            console.log("Signup failed:", data.message);
        }

    } catch (error) {
        console.error("Signup failed:", error);
    }
};
    return(
        <>
        <div className="min-h-screen bg-[#F4F2EE] flex justify-center items-center">
            <div className="w-1/2 min-h-screen flex justify-center items-center bg-[#0077B5]">
            Welcome to the linkedin made by Vishnukumar Das
            </div>
              <div className="w-1/2 flex flex-col justify-center items-center">
              <h1 className="text-5xl">Signup here</h1>
              <div className="w-80 h-96 bg-white rounded-2xl flex flex-col items-center p-8 m-5  font-semibold">
            Firstname:<input type="text" className="bg-gray-300 rounded-sm m-2"></input>
               Lastname:<input type="text" 
                value={username}
    onChange={(e) => setUsername(e.target.value)}
               
               className="bg-gray-300 rounded-sm m-2"></input>
                  Username:<input type="text" className="bg-gray-300 rounded-sm m-2"></input>
                     Email:<input type="text" className="bg-gray-300 rounded-sm m-2"></input>
                     Password:
<div></div>
  <input
    type={show ? "text" : "password"}
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="bg-gray-300 rounded-sm"
  />
  <button
    type="button"
    className="ml-2 text-blue-600 text-sm" onClick={()=>setShow(!show)}
  >
    {show ? "Hide":"show"}
  </button>
  <button  type="button"
    onClick={handleSignup} className="bg-amber-400 rounded-2xl ">
    signup
  </button>

              </div >
              already a member?<a href="www.google.com">click here</a>
              </div>  
        </div>
        </>
    )
}

export default Signup;