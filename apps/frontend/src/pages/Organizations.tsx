import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type Organization = {
    id: string;
    name: string;
    description: string;
};

function Organizations() {

    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const navigate = useNavigate();

    useEffect(() => {

        const getOrganizations = async () => {

            try {

                const token = localStorage.getItem("token");

                const response = await fetch(
                    "http://localhost:8000/api/v1/org/",
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    console.log(data);
                    return;
                }

                setOrganizations(data.organizations);

            } catch (error) {

                console.error(
                    "Failed to fetch organizations:",
                    error
                );

            }
        };

        getOrganizations();

    }, []);

    return (
        <div
            className="min-h-screen bg-cover bg-center bg-no-repeat relative"
            style={{
                backgroundImage: `url(${"blue.jpg"})`,
            }}
        >

            {/* Navbar */}
            <div className="absolute top-0 left-0 w-full h-16 bg-white/10 backdrop-blur-xl border-b border-white/20 flex items-center justify-between px-8">

                <h1 className="text-amber-50 text-2xl font-bold">
                    TaskBoard
                </h1>

                <div className="flex items-center gap-6">

                    <button
                        onClick={() => navigate("/dashboard")}
                        className="text-amber-50 hover:text-white transition"
                    >
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


            {/* Main Content */}
            <div className="pt-28 px-10">

                <div className="flex items-center justify-between mb-10">

                    <h1 className="text-4xl font-bold text-white">
                        Organizations
                    </h1>

                    <button
                        className="px-5 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg text-white hover:bg-white/20 transition"
                    >
                        + Create Organization
                    </button>

                </div>


                {/* Organizations */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                    {organizations.map((organization) => (

                        <div
                            key={organization.id}
                            onClick={() =>
                                navigate(
                                    `/organizations/${organization.id}/boards`
                                )
                            }
                            className="cursor-pointer p-6 min-h-44 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl hover:bg-white/20 hover:scale-[1.02] transition"
                        >

                            <h2 className="text-2xl font-bold text-white mb-3">
                                {organization.name}
                            </h2>

                            <p className="text-white/70">
                                {organization.description}
                            </p>

                            <div className="mt-6 text-black">
                                Open Organization →
                            </div>

                        </div>

                    ))}

                </div>


                {/* Empty State */}
                {organizations.length === 0 && (
                    <div className="text-center mt-20 text-white/70">
                        <p className="text-xl">
                            You don't have any organizations yet.
                        </p>

                        <p className="mt-2">
                            Create your first organization.
                        </p>
                    </div>
                )}

            </div>

        </div>
    );
}

export default Organizations;