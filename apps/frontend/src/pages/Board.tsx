import {
    useEffect,
    useRef,
    useState
} from "react";

import {
    useNavigate,
    useParams
} from "react-router-dom";


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

    const {
        organizationId,
        boardId
    } = useParams();

    const navigate = useNavigate();


    // =====================================================
    // BOARD
    // =====================================================

    const [board, setBoard] =
        useState<BoardData | null>(null);


    // =====================================================
    // SECTIONS
    // =====================================================

    const [sections, setSections] =
        useState<Section[]>([]);


    const [loading, setLoading] =
        useState(true);


    // Prevent duplicate section creation
    // because React development mode can run useEffect twice.
    const creatingDefaultSections =
        useRef(false);


    // =====================================================
    // CREATE ISSUE STATES
    // =====================================================

    const [showCreateIssue, setShowCreateIssue] =
        useState(false);


    const [selectedSectionId, setSelectedSectionId] =
        useState("");


    const [issueTitle, setIssueTitle] =
        useState("");


    const [issueDescription, setIssueDescription] =
        useState("");


    const [creatingIssue, setCreatingIssue] =
        useState(false);


    // =====================================================
    // DRAGGED ISSUE
    // =====================================================

    const [draggedIssue, setDraggedIssue] =
        useState<Issue | null>(null);


    // =====================================================
    // CREATE DEFAULT SECTIONS
    // =====================================================

    const createDefaultSections = async (
        token: string,
        existingSections: Section[]
    ): Promise<Section[]> => {

        if (
            !organizationId ||
            !boardId
        ) {
            return existingSections;
        }


        // Prevent duplicate API calls
        if (
            creatingDefaultSections.current
        ) {
            return existingSections;
        }


        creatingDefaultSections.current = true;


        try {

            const defaultSectionNames = [
                "Open",
                "Pending",
                "Done"
            ];


            // =================================================
            // KEEP ONLY ONE SECTION OF EACH TITLE
            // =================================================

            const uniqueSections =
                new Map<string, Section>();


            for (
                const section
                of existingSections
            ) {

                const key =
                    section.title
                        .trim()
                        .toLowerCase();


                if (
                    !uniqueSections.has(key)
                ) {

                    uniqueSections.set(
                        key,
                        section
                    );

                }

            }


            const sections =
                Array.from(
                    uniqueSections.values()
                );


            // =================================================
            // EXISTING SECTION NAMES
            // =================================================

            const existingTitles =
                new Set(
                    sections.map(
                        (section) =>
                            section.title
                                .trim()
                                .toLowerCase()
                    )
                );


            // =================================================
            // CREATE ONLY MISSING SECTIONS
            // =================================================

            for (
                const sectionName
                of defaultSectionNames
            ) {

                const normalizedName =
                    sectionName
                        .toLowerCase();


                // Already exists
                if (
                    existingTitles.has(
                        normalizedName
                    )
                ) {

                    continue;

                }


                try {

                    const response =
                        await fetch(
                            `http://localhost:8000/api/v1/org/${organizationId}/boards/${boardId}/sections`,
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json",

                                    Authorization:
                                        `Bearer ${token}`,
                                },

                                body: JSON.stringify({
                                    title:
                                        sectionName,
                                }),
                            }
                        );


                    const data =
                        await response.json();


                    if (!response.ok) {

                        console.log(
                            `Failed to create ${sectionName}:`,
                            data
                        );

                        continue;

                    }


                    /*
                     * Backend may return:
                     *
                     * {
                     *     section: {...}
                     * }
                     *
                     * OR
                     *
                     * {
                     *     data: {...}
                     * }
                     */

                    const createdSection =
                        data.section ||
                        data.data;


                    if (
                        createdSection
                    ) {

                        sections.push({

                            ...createdSection,

                            issues: [],

                        });


                        existingTitles.add(
                            normalizedName
                        );

                    }

                }

                catch (error) {

                    console.error(
                        `Failed to create ${sectionName}:`,
                        error
                    );

                }

            }


            return sections;

        }

        finally {

            creatingDefaultSections.current =
                false;

        }

    };


    // =====================================================
    // GET BOARD + SECTIONS + ISSUES
    // =====================================================

    useEffect(() => {

        const getBoardData =
            async () => {

                try {

                    const token =
                        localStorage.getItem(
                            "token"
                        );


                    if (
                        !organizationId ||
                        !boardId
                    ) {

                        return;

                    }


                    // =================================================
                    // GET BOARDS
                    // =================================================

                    const boardResponse =
                        await fetch(
                            `http://localhost:8000/api/v1/org/${organizationId}/boards`,
                            {
                                method: "GET",

                                headers: {
                                    Authorization:
                                        `Bearer ${token}`,
                                },
                            }
                        );


                    const boardData =
                        await boardResponse.json();


                    if (
                        !boardResponse.ok
                    ) {

                        console.log(
                            boardData
                        );

                        return;

                    }


                    const currentBoard =
                        boardData.boards?.find(
                            (b: BoardData) =>
                                b.id === boardId
                        );


                    if (
                        currentBoard
                    ) {

                        setBoard(
                            currentBoard
                        );

                    }


                    // =================================================
                    // GET SECTIONS
                    // =================================================

                    const sectionResponse =
                        await fetch(
                            `http://localhost:8000/api/v1/org/${organizationId}/boards/${boardId}/sections`,
                            {
                                method: "GET",

                                headers: {
                                    Authorization:
                                        `Bearer ${token}`,
                                },
                            }
                        );


                    const sectionData =
                        await sectionResponse.json();


                    if (
                        !sectionResponse.ok
                    ) {

                        console.log(
                            sectionData
                        );

                        return;

                    }


                    let sectionsFromBackend:
                        Section[] =
                        sectionData.sections ||
                        [];


                    // =================================================
                    // REMOVE DUPLICATE SECTIONS
                    // =================================================

                    const uniqueSections =
                        new Map<
                            string,
                            Section
                        >();


                    for (
                        const section
                        of sectionsFromBackend
                    ) {

                        const key =
                            section.title
                                .trim()
                                .toLowerCase();


                        if (
                            !uniqueSections.has(
                                key
                            )
                        ) {

                            uniqueSections.set(
                                key,
                                section
                            );

                        }

                    }


                    sectionsFromBackend =
                        Array.from(
                            uniqueSections.values()
                        );


                    // =================================================
                    // CREATE MISSING DEFAULT SECTIONS
                    // =================================================

                    if (token) {

                        sectionsFromBackend =
                            await createDefaultSections(
                                token,
                                sectionsFromBackend
                            );

                    }


                    // =================================================
                    // GET ISSUES FOR EVERY SECTION
                    // =================================================

                    const sectionsWithIssues =
                        await Promise.all(

                            sectionsFromBackend.map(
                                async (
                                    section: Section
                                ) => {

                                    try {

                                        const issueResponse =
                                            await fetch(
                                                `http://localhost:8000/api/v1/org/${organizationId}/boards/${boardId}/sections/${section.id}/issues`,
                                                {
                                                    method:
                                                        "GET",

                                                    headers: {
                                                        Authorization:
                                                            `Bearer ${token}`,
                                                    },
                                                }
                                            );


                                        const issueData =
                                            await issueResponse.json();


                                        return {

                                            ...section,

                                            issues:
                                                issueResponse.ok
                                                    ? (
                                                        issueData.issues ||
                                                        []
                                                    ).map(
                                                        (
                                                            issue: Issue
                                                        ) => ({

                                                            ...issue,

                                                            sectionId:
                                                                section.id,

                                                        })
                                                    )
                                                    : [],

                                        };

                                    }

                                    catch (
                                        error
                                    ) {

                                        console.error(
                                            "Failed to fetch issues:",
                                            error
                                        );


                                        return {

                                            ...section,

                                            issues: [],

                                        };

                                    }

                                }
                            )

                        );


                    setSections(
                        sectionsWithIssues
                    );

                }

                catch (
                    error
                ) {

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

    }, [
        organizationId,
        boardId
    ]);


    // =====================================================
    // CREATE ISSUE
    // =====================================================

    const handleCreateIssue =
        async () => {

            if (
                !issueTitle.trim()
            ) {

                alert(
                    "Issue title is required"
                );

                return;

            }


            if (
                !selectedSectionId
            ) {

                alert(
                    "Please select a section"
                );

                return;

            }


            try {

                setCreatingIssue(
                    true
                );


                const token =
                    localStorage.getItem(
                        "token"
                    );


                const response =
                    await fetch(
                        `http://localhost:8000/api/v1/org/${organizationId}/boards/${boardId}/sections/${selectedSectionId}/issues`,
                        {
                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json",

                                Authorization:
                                    `Bearer ${token}`,

                            },

                            body: JSON.stringify({

                                title:
                                    issueTitle,

                                description:
                                    issueDescription,

                            }),

                        }
                    );


                const data =
                    await response.json();


                if (
                    !response.ok
                ) {

                    console.log(
                        data
                    );

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


                setShowCreateIssue(
                    false
                );


                setIssueTitle("");

                setIssueDescription("");

                setSelectedSectionId("");


                // Reload board
                window.location.reload();

            }

            catch (
                error
            ) {

                console.error(
                    "Failed to create issue:",
                    error
                );

            }

            finally {

                setCreatingIssue(
                    false
                );

            }

        };


    // =====================================================
    // DRAG START
    // =====================================================

    const handleDragStart =
        (issue: Issue) => {

            setDraggedIssue(
                issue
            );

        };


    // =====================================================
    // DRAG OVER
    // =====================================================

    const handleDragOver =
        (
            event:
                React.DragEvent<HTMLDivElement>
        ) => {

            event.preventDefault();

        };


    // =====================================================
    // DROP ISSUE
    // =====================================================

    const handleDrop =
        async (
            targetSectionId: string
        ) => {

            if (
                !draggedIssue
            ) {

                return;

            }


            const oldSectionId =
                draggedIssue.sectionId;


            if (
                oldSectionId ===
                targetSectionId
            ) {

                setDraggedIssue(
                    null
                );

                return;

            }


            try {

                const token =
                    localStorage.getItem(
                        "token"
                    );


                // =================================================
                // UPDATE DATABASE
                // =================================================

                const response =
                    await fetch(
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


                if (
                    !response.ok
                ) {

                    console.log(
                        data
                    );

                    alert(
                        data.message ||
                        "Failed to move issue"
                    );

                    setDraggedIssue(
                        null
                    );

                    return;

                }


                // =================================================
                // UPDATE FRONTEND
                // =================================================

                setSections(
                    (
                        previousSections
                    ) => {

                        return previousSections.map(
                            (
                                section
                            ) => {

                                // Remove from old section

                                if (
                                    section.id ===
                                    oldSectionId
                                ) {

                                    return {

                                        ...section,

                                        issues:
                                            section
                                                .issues
                                                .filter(
                                                    (
                                                        issue
                                                    ) =>
                                                        issue.id !==
                                                        draggedIssue.id
                                                ),

                                    };

                                }


                                // Add to new section

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

            catch (
                error
            ) {

                console.error(
                    "Failed to move issue:",
                    error
                );

            }

            finally {

                setDraggedIssue(
                    null
                );

            }

        };


    // =====================================================
    // CLOSE CREATE ISSUE MODAL
    // =====================================================

    const closeCreateIssueModal =
        () => {

            setShowCreateIssue(
                false
            );

            setIssueTitle("");

            setIssueDescription("");

            setSelectedSectionId("");

        };


    // =====================================================
    // LOADING
    // =====================================================

    if (
        loading
    ) {

        return (

            <div
                className="
                    min-h-screen
                    bg-black
                    flex
                    items-center
                    justify-center
                "
            >

                <p
                    className="
                        text-white
                        text-xl
                    "
                >
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

            <div
                className="
                    absolute
                    inset-0
                    bg-black/60
                "
            >
            </div>


            <div
                className="
                    relative
                    z-10
                    min-h-screen
                "
            >

                {/* ================================================= */}
                {/* NAVBAR */}
                {/* ================================================= */}

                <div
                    className="
                        h-16
                        bg-white/10
                        backdrop-blur-xl
                        border-b
                        border-white/20
                        flex
                        items-center
                        justify-between
                        px-8
                    "
                >

                    <h1
                        className="
                            text-2xl
                            font-bold
                            text-white
                        "
                    >
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
                {/* BOARD CONTENT */}
                {/* ================================================= */}

                <div className="p-8">

                    {/* BOARD HEADER */}

                    <div
                        className="
                            flex
                            justify-between
                            items-center
                            mb-8
                        "
                    >

                        <div>

                            <h1
                                className="
                                    text-4xl
                                    font-bold
                                    text-white
                                "
                            >
                                {
                                    board?.title ||
                                    "Board"
                                }
                            </h1>


                            <p
                                className="
                                    text-white/60
                                    mt-2
                                "
                            >
                                Manage your issues and tasks
                            </p>

                        </div>


                        <button
                            onClick={() => {

                                setSelectedSectionId(
                                    ""
                                );

                                setShowCreateIssue(
                                    true
                                );

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

                        <div
                            className="
                                flex
                                gap-6
                                overflow-x-auto
                                pb-6
                            "
                        >

                            {sections.map(
                                (
                                    section
                                ) => (

                                    <div
                                        key={
                                            section.id
                                        }

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

                                        {/* SECTION HEADER */}

                                        <div
                                            className="
                                                flex
                                                justify-between
                                                items-center
                                                mb-5
                                            "
                                        >

                                            <h2
                                                className="
                                                    text-xl
                                                    font-bold
                                                    text-white
                                                "
                                            >
                                                {
                                                    section.title
                                                }
                                            </h2>


                                            <span
                                                className="
                                                    text-white/50
                                                    text-sm
                                                "
                                            >
                                                {
                                                    section
                                                        .issues
                                                        .length
                                                }
                                            </span>

                                        </div>


                                        {/* ISSUES */}

                                        <div
                                            className="
                                                flex
                                                flex-col
                                                gap-4
                                            "
                                        >

                                            {section.issues.map(
                                                (
                                                    issue
                                                ) => (

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

                                                        <h3
                                                            className="
                                                                text-lg
                                                                font-semibold
                                                                text-white
                                                            "
                                                        >
                                                            {
                                                                issue.title
                                                            }
                                                        </h3>


                                                        {issue.description && (

                                                            <p
                                                                className="
                                                                    text-white/60
                                                                    text-sm
                                                                    mt-2
                                                                "
                                                            >
                                                                {
                                                                    issue.description
                                                                }
                                                            </p>

                                                        )}

                                                    </div>

                                                )
                                            )}


                                            {section.issues.length === 0 && (

                                                <p
                                                    className="
                                                        text-white/40
                                                        text-sm
                                                        text-center
                                                        py-6
                                                    "
                                                >
                                                    No issues yet
                                                </p>

                                            )}

                                        </div>


                                        {/* ADD ISSUE */}

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

                        <div
                            className="
                                text-center
                                mt-20
                            "
                        >

                            <p
                                className="
                                    text-xl
                                    text-white/70
                                "
                            >
                                No sections found.
                            </p>

                        </div>

                    )}

                </div>

            </div>


            {/* ========================================================= */}
            {/* CREATE ISSUE MODAL */}
            {/* ========================================================= */}

            {showCreateIssue && (

                <div
                    className="
                        fixed
                        inset-0
                        z-50
                        bg-black/70
                        flex
                        items-center
                        justify-center
                        p-4
                    "
                >

                    <div
                        className="
                            w-full
                            max-w-md
                            bg-white/10
                            backdrop-blur-xl
                            border
                            border-white/20
                            rounded-xl
                            p-8
                        "
                    >

                        <h2
                            className="
                                text-2xl
                                font-bold
                                text-white
                                mb-6
                            "
                        >
                            Create Issue
                        </h2>


                        {/* ISSUE TITLE */}

                        <input
                            type="text"
                            placeholder="Issue title"
                            value={
                                issueTitle
                            }
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


                        {/* ISSUE DESCRIPTION */}

                        <textarea
                            placeholder="Issue description"
                            value={
                                issueDescription
                            }
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
                        {/* SELECT SECTION */}
                        {/* ================================================= */}

                        <div
                            className="
                                mb-6
                            "
                        >

                            <label
                                className="
                                    block
                                    text-white/70
                                    text-sm
                                    mb-3
                                "
                            >
                                Select Section
                            </label>


                            <div
                                className="
                                    flex
                                    flex-col
                                    gap-3
                                "
                            >

                                {sections.map(
                                    (
                                        section
                                    ) => (

                                        <label
                                            key={
                                                section.id
                                            }

                                            className="
                                                flex
                                                items-center
                                                gap-3
                                                px-4
                                                py-3
                                                rounded-lg
                                                bg-white/10
                                                border
                                                border-white/20
                                                cursor-pointer
                                                hover:bg-white/20
                                                transition
                                            "
                                        >

                                            <input
                                                type="radio"

                                                name="issueSection"

                                                value={
                                                    section.id
                                                }

                                                checked={
                                                    selectedSectionId ===
                                                    section.id
                                                }

                                                onChange={() =>
                                                    setSelectedSectionId(
                                                        section.id
                                                    )
                                                }

                                                className="
                                                    w-4
                                                    h-4
                                                    accent-amber-300
                                                    cursor-pointer
                                                "
                                            />


                                            <span
                                                className="
                                                    text-white
                                                    text-sm
                                                "
                                            >
                                                {
                                                    section.title
                                                }
                                            </span>

                                        </label>

                                    )
                                )}

                            </div>

                        </div>


                        {/* BUTTONS */}

                        <div
                            className="
                                flex
                                justify-end
                                gap-4
                            "
                        >

                            <button
                                onClick={
                                    closeCreateIssueModal
                                }
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

                                {
                                    creatingIssue
                                        ? "Creating..."
                                        : "Create"
                                }

                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>

    );

}


export default Board;