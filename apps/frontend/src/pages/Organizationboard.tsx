import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

type Board = {
    id: string;
    title: string;
    description?: string;
};

type Organization = {
    id: string;
    name: string;
    description?: string;
};

function Organizationboard() {

    const { organizationId } = useParams();
    const navigate = useNavigate();

    const [boards, setBoards] = useState<Board[]>([]);

    const [organizationName, setOrganizationName] = useState("");

    const [showCreateBoard, setShowCreateBoard] = useState(false);

    const [boardName, setBoardName] = useState("");
    const [boardDescription, setBoardDescription] = useState("");

    const [loading, setLoading] = useState(false);


    // --------------------------------
    // GET BOARDS
    // --------------------------------

    const getBoards = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await fetch(
                `http://localhost:8000/api/v1/org/${organizationId}/boards`,
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

            setBoards(data.boards);

        } catch (error) {

            console.error(
                "Failed to fetch boards:",
                error
            );

        }
    };


    // --------------------------------
    // GET ORGANIZATION NAME
    // --------------------------------

    const getOrganization = async () => {

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

            const organization = data.organizations.find(
                (org: Organization) =>
                    org.id === organizationId
            );

            if (organization) {
                setOrganizationName(organization.name);
            }

        } catch (error) {

            console.error(
                "Failed to fetch organization:",
                error
            );

        }
    };


    // --------------------------------
    // INITIAL FETCH
    // --------------------------------

    useEffect(() => {

        if (!organizationId) return;

        getBoards();
        getOrganization();

    }, [organizationId]);


    // --------------------------------
    // CREATE BOARD
    // --------------------------------

    const handleCreateBoard = async () => {

        if (!boardName.trim()) {
            alert("Board name is required");
            return;
        }

        try {

            setLoading(true);

            const token = localStorage.getItem("token");

            const response = await fetch(
                `http://localhost:8000/api/v1/org/${organizationId}/boards`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },

                    body: JSON.stringify({
                        title: boardName,
                        description: boardDescription,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {

                console.log(data);
                alert(data.message || "Failed to create board");

                return;
            }

            console.log("Board created:", data);

            // Close modal
            setShowCreateBoard(false);

            // Clear form
            setBoardName("");
            setBoardDescription("");

            // Refresh boards
            getBoards();

        } catch (error) {

            console.error(
                "Failed to create board:",
                error
            );

        } finally {

            setLoading(false);

        }
    };


    return (

        <div
            className="min-h-screen bg-cover bg-center bg-no-repeat relative"
            style={{
                backgroundImage: `url("/blue.jpg")`,
            }}
        >

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/60"></div>


            {/* Main Content */}
            <div className="relative z-10 min-h-screen">


                {/* Navbar */}
                <div className="h-16 bg-white/10 backdrop-blur-xl border-b border-white/20 flex items-center justify-between px-8">

                    <h1 className="text-2xl font-bold text-white">
                        TaskBoard
                    </h1>

                    <div className="flex items-center gap-6">

                        <button
                            onClick={() => navigate("/dashboard")}
                            className="text-white hover:text-amber-200 transition"
                        >
                            Dashboard
                        </button>

                        <button
                            onClick={() => navigate("/organizations")}
                            className="text-white hover:text-amber-200 transition"
                        >
                            ← Organizations
                        </button>

                    </div>

                </div>


                {/* Content */}
                <div className="pt-12 px-10">


                    {/* Header */}
                    <div className="flex justify-between items-center mb-10">

                        <div>

                            <h1 className="text-4xl font-bold text-white">
                                {organizationName
                                    ? `${organizationName} Boards`
                                    : "Organization Boards"}
                            </h1>

                            <p className="text-white/60 mt-2">
                                Select a board to manage its sections and issues.
                            </p>

                        </div>


                        {/* Create Board */}
                        <button
                            onClick={() => setShowCreateBoard(true)}
                            className="
                                px-5 py-3
                                bg-white/10
                                backdrop-blur-xl
                                border border-white/20
                                rounded-lg
                                text-white
                                hover:bg-white/20
                                transition
                            "
                        >
                            + Create Board
                        </button>

                    </div>


                    {/* Boards */}
                    {boards.length > 0 ? (

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                            {boards.map((board) => (

                                <div
                                    key={board.id}
                                    onClick={() =>
                                        navigate(
                                            `/organizations/${organizationId}/boards/${board.id}`
                                        )
                                    }
                                    className="
                                        cursor-pointer
                                        min-h-48
                                        p-6
                                        bg-white/10
                                        backdrop-blur-xl
                                        border border-white/20
                                        rounded-xl
                                        hover:bg-white/20
                                        hover:scale-[1.02]
                                        transition
                                    "
                                >

                                    <h2 className="text-2xl font-bold text-white">
                                        {board.title}
                                    </h2>

                                    <p className="text-white/60 mt-3">
                                        {board.description ||
                                            "No description available"}
                                    </p>

                                    <div className="mt-8 text-amber-200">
                                        Open Board →
                                    </div>

                                </div>

                            ))}

                        </div>

                    ) : (

                        /* Empty State */
                        <div className="flex flex-col items-center justify-center mt-24">

                            <h2 className="text-2xl font-semibold text-white">
                                No boards yet
                            </h2>

                            <p className="text-white/60 mt-2">
                                Create your first board for this organization.
                            </p>

                            <button
                                onClick={() => setShowCreateBoard(true)}
                                className="
                                    mt-6
                                    px-5 py-3
                                    bg-white/10
                                    backdrop-blur-xl
                                    border border-white/20
                                    rounded-lg
                                    text-white
                                    hover:bg-white/20
                                    transition
                                "
                            >
                                + Create Board
                            </button>

                        </div>

                    )}


                </div>


                {/* ================================= */}
                {/* CREATE BOARD MODAL */}
                {/* ================================= */}

                {showCreateBoard && (

                    <div
                        className="
                            fixed inset-0
                            bg-black/60
                            flex items-center justify-center
                            z-50
                        "
                    >

                        <div
                            className="
                                w-96
                                bg-white/10
                                backdrop-blur-xl
                                border border-white/20
                                rounded-xl
                                p-8
                            "
                        >

                            <h2 className="text-2xl font-bold text-white mb-6">
                                Create Board
                            </h2>


                            {/* Board Name */}
                            <input
                                type="text"
                                placeholder="Board name"
                                value={boardName}
                                onChange={(e) =>
                                    setBoardName(e.target.value)
                                }
                                className="
                                    w-full
                                    p-3
                                    rounded-lg
                                    mb-4
                                    bg-white/20
                                    text-white
                                    placeholder-white/60
                                    outline-none
                                    border border-white/10
                                "
                            />


                            {/* Description */}
                            <textarea
                                placeholder="Board description"
                                value={boardDescription}
                                onChange={(e) =>
                                    setBoardDescription(e.target.value)
                                }
                                className="
                                    w-full
                                    p-3
                                    rounded-lg
                                    mb-6
                                    bg-white/20
                                    text-white
                                    placeholder-white/60
                                    outline-none
                                    border border-white/10
                                    resize-none
                                    h-28
                                "
                            />


                            {/* Buttons */}
                            <div className="flex justify-end gap-4">

                                <button
                                    onClick={() => {

                                        setShowCreateBoard(false);
                                        setBoardName("");
                                        setBoardDescription("");

                                    }}
                                    className="
                                        px-4 py-2
                                        text-white
                                        hover:text-white/70
                                        transition
                                    "
                                >
                                    Cancel
                                </button>


                                <button
                                    onClick={handleCreateBoard}
                                    disabled={loading}
                                    className="
                                        px-5 py-2
                                        bg-white/20
                                        text-white
                                        rounded-lg
                                        hover:bg-white/30
                                        transition
                                        disabled:opacity-50
                                    "
                                >
                                    {loading ? "Creating..." : "Create"}
                                </button>

                            </div>

                        </div>

                    </div>

                )}

            </div>

        </div>
    );
}

export default Organizationboard;