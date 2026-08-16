import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

type Issue = {
    id: string;
    title: string;
    description?: string;
    sectionId: string;
};

type Section = {
    id: string;
    title: string;
    boardId: string;
    issues: Issue[];
};

type BoardData = {
    id: string;
    title: string;
};


function Board() {

    const { organizationId, boardId } = useParams();

    const navigate = useNavigate();

    const [board, setBoard] = useState<BoardData | null>(null);

    const [sections, setSections] = useState<Section[]>([]);

    const [loading, setLoading] = useState(true);


    // Create Issue states
    const [showCreateIssue, setShowCreateIssue] = useState(false);

    const [selectedSectionId, setSelectedSectionId] = useState("");

    const [issueTitle, setIssueTitle] = useState("");

    const [issueDescription, setIssueDescription] = useState("");

    const [creatingIssue, setCreatingIssue] = useState(false);


    // Dragged issue
    const [draggedIssue, setDraggedIssue] = useState<Issue | null>(null);


    // =====================================================
    // GET BOARD + SECTIONS + ISSUES
    // =====================================================

    useEffect(() => {

        const getBoardData = async () => {

            try {

                const token = localStorage.getItem("token");

                if (!organizationId || !boardId) {
                    return;
                }


                // =================================================
                // GET BOARDS
                // =================================================

                const boardResponse = await fetch(
                    `http://localhost:8000/api/v1/org/${organizationId}/boards`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const boardData = await boardResponse.json();

                if (!boardResponse.ok) {

                    console.log(boardData);

                    return;
                }


                const currentBoard = boardData.boards.find(
                    (b: BoardData) => b.id === boardId
                );


                if (currentBoard) {

                    setBoard(currentBoard);

                }


                // =================================================
                // GET SECTIONS
                // =================================================

                const sectionResponse = await fetch(
                    `http://localhost:8000/api/v1/org/${organizationId}/boards/${boardId}/sections`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );


                const sectionData = await sectionResponse.json();


                if (!sectionResponse.ok) {

                    console.log(sectionData);

                    return;
                }


                const sectionsFromBackend =
                    sectionData.sections || [];


                // =================================================
                // GET ISSUES FOR EACH SECTION
                // =================================================

                const sectionsWithIssues = await Promise.all(

                    sectionsFromBackend.map(
                        async (section: Section) => {

                            const issueResponse = await fetch(
                                `http://localhost:8000/api/v1/org/${organizationId}/boards/${boardId}/sections/${section.id}/issues`,
                                {
                                    method: "GET",

                                    headers: {
                                        Authorization: `Bearer ${token}`,
                                    },
                                }
                            );


                            const issueData =
                                await issueResponse.json();


                            return {

                                ...section,

                                issues: issueResponse.ok
                                    ? (issueData.issues || []).map(
                                        (issue: Issue) => ({
                                            ...issue,
                                            sectionId: section.id,
                                        })
                                    )
                                    : [],

                            };

                        }
                    )

                );


                setSections(sectionsWithIssues);

            }

            catch (error) {

                console.error(
                    "Failed to fetch board:",
                    error
                );

            }

            finally {

                setLoading(false);

            }

        };


        getBoardData();

    }, [organizationId, boardId]);


    // =====================================================
    // CREATE ISSUE
    // =====================================================

    const handleCreateIssue = async () => {

        if (!issueTitle.trim()) {

            alert("Issue title is required");

            return;
        }


        if (!selectedSectionId) {

            alert("Please select a section");

            return;
        }


        try {

            setCreatingIssue(true);


            const token = localStorage.getItem("token");


            const response = await fetch(
                `http://localhost:8000/api/v1/org/${organizationId}/boards/${boardId}/sections/${selectedSectionId}/issues`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",

                        Authorization: `Bearer ${token}`,
                    },

                    body: JSON.stringify({
                        title: issueTitle,
                        description: issueDescription,
                    }),
                }
            );


            const data = await response.json();


            if (!response.ok) {

                console.log(data);

                alert(
                    data.message ||
                    "Failed to create issue"
                );

                return;
            }


            console.log(
                "Issue created:",
                data
            );


            // Close modal
            setShowCreateIssue(false);


            // Clear form
            setIssueTitle("");

            setIssueDescription("");

            setSelectedSectionId("");


            // Reload board
            window.location.reload();

        }

        catch (error) {

            console.error(
                "Failed to create issue:",
                error
            );

        }

        finally {

            setCreatingIssue(false);

        }

    };


    // =====================================================
    // DRAG START
    // =====================================================

    const handleDragStart = (issue: Issue) => {

        setDraggedIssue(issue);

    };


    // =====================================================
    // DRAG OVER
    // =====================================================

    const handleDragOver = (
        event: React.DragEvent<HTMLDivElement>
    ) => {

        event.preventDefault();

    };


    // =====================================================
    // DROP ISSUE
    // =====================================================

    const handleDrop = async (
        targetSectionId: string
    ) => {

        if (!draggedIssue) {

            return;
        }


        const oldSectionId =
            draggedIssue.sectionId;


        // Same section
        if (
            oldSectionId ===
            targetSectionId
        ) {

            setDraggedIssue(null);

            return;
        }


        try {

            const token =
                localStorage.getItem("token");


            // =================================================
            // UPDATE DATABASE
            // =================================================

            const response = await fetch(

                `http://localhost:8000/api/v1/org/${organizationId}/boards/${boardId}/sections/${oldSectionId}/${draggedIssue.id}/issues`,

                {
                    method: "PUT",

                    headers: {

                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${token}`,

                    },

                    body: JSON.stringify({

                        sectionId:
                            targetSectionId,

                    }),

                }

            );


            const data =
                await response.json();


            if (!response.ok) {

                console.log(data);

                alert(
                    data.message ||
                    "Failed to move issue"
                );

                setDraggedIssue(null);

                return;
            }


            // =================================================
            // UPDATE FRONTEND STATE
            // =================================================

            setSections(
                (previousSections) => {

                    return previousSections.map(
                        (section) => {


                            // Remove issue
                            // from old section

                            if (
                                section.id ===
                                oldSectionId
                            ) {

                                return {

                                    ...section,

                                    issues:
                                        section.issues.filter(
                                            (issue) =>
                                                issue.id !==
                                                draggedIssue.id
                                        ),

                                };

                            }


                            // Add issue
                            // to new section

                            if (
                                section.id ===
                                targetSectionId
                            ) {

                                return {

                                    ...section,

                                    issues: [
                                        ...section.issues,

                                        {
                                            ...draggedIssue,

                                            sectionId:
                                                targetSectionId,

                                        },

                                    ],

                                };

                            }


                            return section;

                        }
                    );

                }
            );


        }

        catch (error) {

            console.error(
                "Failed to move issue:",
                error
            );

        }

        finally {

            setDraggedIssue(null);

        }

    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="
                min-h-screen
                bg-black
                flex
                items-center
                justify-center
            ">

                <p className="
                    text-white
                    text-xl
                ">
                    Loading board...
                </p>

            </div>

        );

    }


    // =====================================================
    // UI
    // =====================================================

    return (

        <div
            className="
                min-h-screen
                bg-black
                bg-cover
                bg-center
                bg-no-repeat
                relative
            "
            style={{
                backgroundImage:
                    `url("/blue.jpg")`,
            }}
        >

            {/* Overlay */}

            <div className="
                absolute
                inset-0
                bg-black/60
            ">
            </div>


            <div className="
                relative
                z-10
                min-h-screen
            ">


                {/* ================================================= */}
                {/* NAVBAR */}
                {/* ================================================= */}

                <div className="
                    h-16
                    bg-white/10
                    backdrop-blur-xl
                    border-b
                    border-white/20
                    flex
                    items-center
                    justify-between
                    px-8
                ">

                    <h1 className="
                        text-2xl
                        font-bold
                        text-white
                    ">
                        TaskBoard
                    </h1>


                    <button
                        onClick={() =>
                            navigate(
                                `/organizations/${organizationId}/boards`
                            )
                        }
                        className="
                            text-white
                            hover:text-amber-200
                            transition
                        "
                    >
                        ← Boards
                    </button>

                </div>


                {/* ================================================= */}
                {/* BOARD */}
                {/* ================================================= */}

                <div className="p-8">


                    {/* Board Header */}

                    <div className="
                        flex
                        justify-between
                        items-center
                        mb-8
                    ">

                        <div>

                            <h1 className="
                                text-4xl
                                font-bold
                                text-white
                            ">
                                {board?.title || "Board"}
                            </h1>


                            <p className="
                                text-white/60
                                mt-2
                            ">
                                Manage your issues and tasks
                            </p>

                        </div>


                        {/* Global Add Issue */}

                        <button
                            onClick={() => {

                                // Don't select any section
                                // automatically

                                setSelectedSectionId("");

                                setShowCreateIssue(true);

                            }}
                            className="
                                px-5
                                py-3
                                bg-white/10
                                backdrop-blur-xl
                                border
                                border-white/20
                                rounded-lg
                                text-white
                                font-semibold
                                hover:bg-white/20
                                transition
                            "
                        >
                            + Add Issue
                        </button>

                    </div>


                    {/* ================================================= */}
                    {/* SECTIONS */}
                    {/* ================================================= */}

                    {sections.length > 0 ? (

                        <div className="
                            flex
                            gap-6
                            overflow-x-auto
                            pb-6
                        ">

                            {sections.map(
                                (section) => (

                                    <div
                                        key={section.id}

                                        onDragOver={
                                            handleDragOver
                                        }

                                        onDrop={() =>
                                            handleDrop(
                                                section.id
                                            )
                                        }

                                        className="
                                            min-w-80
                                            w-80
                                            min-h-96
                                            bg-white/10
                                            backdrop-blur-xl
                                            border
                                            border-white/20
                                            rounded-xl
                                            p-4
                                        "
                                    >


                                        {/* Section Header */}

                                        <div className="
                                            flex
                                            justify-between
                                            items-center
                                            mb-5
                                        ">

                                            <h2 className="
                                                text-xl
                                                font-bold
                                                text-white
                                            ">
                                                {section.title}
                                            </h2>


                                            <span className="
                                                text-white/50
                                                text-sm
                                            ">
                                                {
                                                    section
                                                        .issues
                                                        .length
                                                }
                                            </span>

                                        </div>


                                        {/* ================================================= */}
                                        {/* ISSUES */}
                                        {/* ================================================= */}

                                        <div className="
                                            flex
                                            flex-col
                                            gap-4
                                        ">

                                            {section.issues.map(
                                                (issue) => (

                                                    <div
                                                        key={
                                                            issue.id
                                                        }

                                                        draggable

                                                        onDragStart={() =>
                                                            handleDragStart(
                                                                issue
                                                            )
                                                        }

                                                        className="
                                                            bg-white/10
                                                            backdrop-blur-xl
                                                            border
                                                            border-white/20
                                                            rounded-lg
                                                            p-4
                                                            cursor-grab
                                                            active:cursor-grabbing
                                                            hover:bg-white/20
                                                            transition
                                                        "
                                                    >

                                                        <h3 className="
                                                            text-lg
                                                            font-semibold
                                                            text-white
                                                        ">
                                                            {
                                                                issue.title
                                                            }
                                                        </h3>


                                                        {issue.description && (

                                                            <p className="
                                                                text-white/60
                                                                text-sm
                                                                mt-2
                                                            ">
                                                                {
                                                                    issue.description
                                                                }
                                                            </p>

                                                        )}

                                                    </div>

                                                )
                                            )}


                                            {/* Empty Section */}

                                            {section.issues.length === 0 && (

                                                <p className="
                                                    text-white/40
                                                    text-sm
                                                    text-center
                                                    py-6
                                                ">
                                                    No issues yet
                                                </p>

                                            )}

                                        </div>


                                        {/* ================================================= */}
                                        {/* ADD ISSUE TO THIS SECTION */}
                                        {/* ================================================= */}

                                        <button
                                            onClick={() => {

                                                setSelectedSectionId(
                                                    section.id
                                                );

                                                setShowCreateIssue(
                                                    true
                                                );

                                            }}
                                            className="
                                                w-full
                                                mt-5
                                                py-2
                                                text-white/70
                                                hover:text-white
                                                hover:bg-white/10
                                                rounded-lg
                                                transition
                                            "
                                        >
                                            + Add Issue
                                        </button>

                                    </div>

                                )
                            )}

                        </div>

                    ) : (

                        <div className="
                            text-center
                            mt-20
                        ">

                            <p className="
                                text-xl
                                text-white/70
                            ">
                                No sections found.
                            </p>

                            <p className="
                                text-white/40
                                mt-2
                            ">
                                Create sections for this board first.
                            </p>

                        </div>

                    )}

                </div>

            </div>


            {/* ========================================================= */}
            {/* CREATE ISSUE MODAL */}
            {/* ========================================================= */}

            {showCreateIssue && (

                <div className="
                    fixed
                    inset-0
                    z-50
                    bg-black/70
                    flex
                    items-center
                    justify-center
                    p-4
                ">

                    <div className="
                        w-full
                        max-w-md
                        bg-white/10
                        backdrop-blur-xl
                        border
                        border-white/20
                        rounded-xl
                        p-8
                    ">


                        <h2 className="
                            text-2xl
                            font-bold
                            text-white
                            mb-6
                        ">
                            Create Issue
                        </h2>


                        {/* ================================================= */}
                        {/* ISSUE TITLE */}
                        {/* ================================================= */}

                        <input
                            type="text"
                            placeholder="Issue title"
                            value={issueTitle}
                            onChange={(e) =>
                                setIssueTitle(
                                    e.target.value
                                )
                            }
                            className="
                                w-full
                                p-3
                                rounded-lg
                                mb-4
                                bg-white/20
                                text-white
                                placeholder-white/50
                                outline-none
                                border
                                border-white/10
                            "
                        />


                        {/* ================================================= */}
                        {/* DESCRIPTION */}
                        {/* ================================================= */}

                        <textarea
                            placeholder="Issue description"
                            value={issueDescription}
                            onChange={(e) =>
                                setIssueDescription(
                                    e.target.value
                                )
                            }
                            className="
                                w-full
                                h-28
                                p-3
                                rounded-lg
                                mb-6
                                bg-white/20
                                text-white
                                placeholder-white/50
                                outline-none
                                border
                                border-white/10
                                resize-none
                            "
                        />


                        {/* ================================================= */}
                        {/* SECTION SELECTION */}
                        {/* ================================================= */}

                        <div className="mb-6">

                            <label className="
                                block
                                text-white/70
                                text-sm
                                mb-3
                            ">
                                Select Section
                            </label>


                            <div className="
                                flex
                                flex-col
                                gap-2
                            ">

                                {sections.map(
                                    (section) => (

                                        <button
                                            key={section.id}
                                            type="button"

                                            onClick={() => {

                                                setSelectedSectionId(
                                                    section.id
                                                );

                                            }}

                                            className={`
                                                w-full
                                                px-4
                                                py-3
                                                rounded-lg
                                                border
                                                text-left
                                                transition

                                                ${
                                                    selectedSectionId ===
                                                    section.id

                                                        ? "bg-white/30 border-white/50 text-white"

                                                        : "bg-white/10 border-white/20 text-white/70 hover:bg-white/20"
                                                }
                                            `}
                                        >

                                            <span>
                                                {
                                                    section.title
                                                }
                                            </span>


                                            {selectedSectionId ===
                                                section.id && (

                                                <span className="
                                                    float-right
                                                ">
                                                    ✓
                                                </span>

                                            )}

                                        </button>

                                    )
                                )}

                            </div>

                        </div>


                        {/* ================================================= */}
                        {/* BUTTONS */}
                        {/* ================================================= */}

                        <div className="
                            flex
                            justify-end
                            gap-4
                        ">

                            <button
                                onClick={() => {

                                    setShowCreateIssue(
                                        false
                                    );

                                    setIssueTitle("");

                                    setIssueDescription("");

                                    setSelectedSectionId("");

                                }}
                                className="
                                    px-4
                                    py-2
                                    text-white
                                    hover:text-white/70
                                "
                            >
                                Cancel
                            </button>


                            <button
                                onClick={
                                    handleCreateIssue
                                }
                                disabled={
                                    creatingIssue
                                }
                                className="
                                    px-5
                                    py-2
                                    bg-white/20
                                    text-white
                                    rounded-lg
                                    hover:bg-white/30
                                    transition
                                    disabled:opacity-50
                                "
                            >

                                {creatingIssue
                                    ? "Creating..."
                                    : "Create"}

                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>

    );
}

export default Board;