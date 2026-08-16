import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
function Dashboard() {
    const username = localStorage.getItem("username");
    const [organization,setOrganizations]=useState<any[]>([]);
    const [showCreateOrg,setShowCreateOrg]=useState(false);
    const [orgName, setOrgName] = useState("");
const [orgDescription, setOrgDescription] = useState("");
const navigate = useNavigate();
    useEffect(()=>{
        const getOrganizations=async ()=>{
            try{
                const token =localStorage.getItem("token");
                const response=await fetch(
                    "http://localhost:8000/api/v1/org",
                    {
                        method:"GET",
                        headers:{
                            Authorization:`Bearer ${token}`,
                        },
                    }
                )
                const data=await response.json();
                if(!response.ok)
                {
                    console.log(data);
                    return;
                }
                setOrganizations(data.organizations)
            }
            catch(error)
            {
                console.error("Failed to get organization",error)

            }
        }
        getOrganizations();
    },[])

    const handleCreateOrganization = async () => {
    try {
        const token = localStorage.getItem("token");

        const response = await fetch(
            "http://localhost:8000/api/v1/org/",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: orgName,
                    description: orgDescription,
                }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.log(data);
            return;
        }

        console.log(data);

        // Close modal
        setShowCreateOrg(false);

        // Clear fields
        setOrgName("");
        setOrgDescription("");

        // Add newly created organization to UI
        setOrganizations((prev) => [
            ...prev,
            data.organization
        ]);

    } catch (error) {
        console.error("Failed to create organization:", error);
    }
};

    return (
       <div
  className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative"
  style={{
    backgroundImage: `url(${"blue.jpg"})`,
  }}
>
  {/* Top Bar */}
  <div className="absolute top-0 left-0 w-full h-16 bg-white/10 backdrop-blur-xl border-b border-white/20 flex items-center justify-between px-8">

    {/* Logo */}
    <h1 className="text-amber-50 text-2xl font-bold">
      TaskBoard
    </h1>

    {/* Right side */}
    <div className="flex items-center gap-6">
      <button className="text-amber-50 hover:text-white transition">
        Dashboard
      </button>

      <button className="text-amber-50 hover:text-white transition">
        Profile
      </button>

      <button className="text-amber-50 hover:text-white transition">
        Logout
      </button>
    </div>
  </div>

  {/* Cards + Create Organization */}
  <div className="flex flex-col items-center gap-8">

    {/* Cards */}
    <div className="flex items-center justify-center gap-10">

      <div onClick={() => navigate("/organizations")} 
      className="w-40 h-40 bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center rounded-lg  hover:bg-white/20
        transition">
        <h1 className="text-amber-50">
          Organizations
        </h1>
        <p className="text-white text-3xl font-bold">
        {organization.length}
    </p>
      </div>

      <div className="w-40 h-40 bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center rounded-lg  hover:bg-white/20
        transition">
        <h1 className="text-amber-50">
          Boards
        </h1>
      </div>

      <div className="w-40 h-40 bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center rounded-lg  hover:bg-white/20
        transition">
        <h1 className="text-amber-50">
          Issues
        </h1>
      </div>

    </div>

    {/* Create Organization Button */}
    <button
    onClick={()=>setShowCreateOrg(true)}
      className="
        px-6 py-3
        bg-white/10
        backdrop-blur-xl
        border border-white/20
        rounded-lg
        text-amber-50
        font-semibold
        hover:bg-white/20
        transition
      "
    >
      + Create Organization
    </button>

  </div>

  {showCreateOrg && (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">

        <div className="w-96 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-8">

            <h2 className="text-white text-2xl font-bold mb-6">
                Create Organization
            </h2>

            <input
                type="text"
                placeholder="Organization name"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="w-full p-3 rounded-lg mb-4 bg-white/20 text-white placeholder-white/60 outline-none"
            />

            <textarea
                placeholder="Description"
                value={orgDescription}
                onChange={(e) => setOrgDescription(e.target.value)}
                className="w-full p-3 rounded-lg mb-6 bg-white/20 text-white placeholder-white/60 outline-none"
            />

            <div className="flex justify-end gap-4">

                <button
                    onClick={() => setShowCreateOrg(false)}
                    className="px-4 py-2 text-white"
                >
                    Cancel
                </button>

                <button
                    onClick={handleCreateOrganization}
                    className="px-4 py-2 bg-white/20 text-white rounded-lg"
                >
                    Create
                </button>

            </div>

        </div>
    </div>
)}
</div>
    );
}

export default Dashboard;