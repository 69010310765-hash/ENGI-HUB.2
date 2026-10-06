// ========================================
// FREE FALL SIMULATION
// ENGI HUB
// ========================================


// ========================================
// GET ELEMENTS
// ========================================

const simulationCanvas =
    document.getElementById("simulationCanvas");

const graphCanvas =
    document.getElementById("graphCanvas");

const heightInput =
    document.getElementById("height");

const massInput =
    document.getElementById("mass");

const gravityInput =
    document.getElementById("gravity");

const heightValue =
    document.getElementById("heightValue");

const massValue =
    document.getElementById("massValue");

const gravityValue =
    document.getElementById("gravityValue");

const startButton =
    document.getElementById("startButton");

const pauseButton =
    document.getElementById("pauseButton");

const resumeButton =
    document.getElementById("resumeButton");

const resetButton =
    document.getElementById("resetButton");

const statusDot =
    document.getElementById("statusDot");

const statusText =
    document.getElementById("statusText");

const realtimeTime =
    document.getElementById("realtimeTime");

const realtimeHeight =
    document.getElementById("realtimeHeight");

const realtimeVelocity =
    document.getElementById("realtimeVelocity");

const realtimeAcceleration =
    document.getElementById("realtimeAcceleration");

const fallTimeResult =
    document.getElementById("fallTimeResult");

const impactVelocityResult =
    document.getElementById("impactVelocityResult");

const graphCurrentTitle =
    document.getElementById("graphCurrentTitle");

const graphCurrentValue =
    document.getElementById("graphCurrentValue");

const graphEmpty =
    document.getElementById("graphEmpty");

const graphButtons =
    document.querySelectorAll(".graph-button");


// ========================================
// CHECK ELEMENTS
// ========================================

if (!simulationCanvas) {
    console.error("ไม่พบ simulationCanvas");
}

if (!graphCanvas) {
    console.error("ไม่พบ graphCanvas");
}


// ========================================
// CANVAS
// ========================================

const simulationContext =
    simulationCanvas.getContext("2d");

const graphContext =
    graphCanvas.getContext("2d");


// ========================================
// VARIABLES
// ========================================

let initialHeight = 20;

let mass = 1;

let gravity = 9.81;

let simulationTime = 0;

let currentHeight = 20;

let currentVelocity = 0;

let currentAcceleration = 9.81;

let isRunning = false;

let isPaused = false;

let animationFrame = null;

let lastTimestamp = null;

let historySaved = false;

let graphData = [];

let selectedGraph = "height";


// ========================================
// READ INPUTS
// ========================================

function readInputs() {

    initialHeight =
        Number(heightInput.value);

    mass =
        Number(massInput.value);

    gravity =
        Number(gravityInput.value);

}


// ========================================
// UPDATE INPUT DISPLAY
// ========================================

function updateInputDisplay() {

    readInputs();

    heightValue.textContent =
        initialHeight.toFixed(2) + " m";

    massValue.textContent =
        mass.toFixed(2) + " kg";

    gravityValue.textContent =
        gravity.toFixed(2) + " m/s²";

}


// ========================================
// UPDATE REALTIME
// ========================================

function updateRealtime() {

    realtimeTime.textContent =
        simulationTime.toFixed(2) + " s";

    realtimeHeight.textContent =
        currentHeight.toFixed(2) + " m";

    realtimeVelocity.textContent =
        currentVelocity.toFixed(2) + " m/s";

    realtimeAcceleration.textContent =
        currentAcceleration.toFixed(2) + " m/s²";

}


// ========================================
// UPDATE RESULTS
// ========================================

function updateResults() {

    if (gravity <= 0) {
        return;
    }

    const fallTime =
        Math.sqrt(
            (2 * initialHeight) / gravity
        );

    const impactVelocity =
        Math.sqrt(
            2 *
            gravity *
            initialHeight
        );

    fallTimeResult.textContent =
        fallTime.toFixed(2) + " s";

    impactVelocityResult.textContent =
        impactVelocity.toFixed(2) + " m/s";

}


// ========================================
// STATUS
// ========================================

function setStatus(
    text,
    type
) {

    statusText.textContent = text;

    statusDot.className =
        "status-dot";

    if (type) {

        statusDot.classList.add(type);

    }

}


// ========================================
// BUTTON STATE
// ========================================

function updateButtons() {

    if (isRunning) {

        startButton.disabled = true;

        pauseButton.disabled = false;

        resumeButton.disabled = true;

    }

    else if (isPaused) {

        startButton.disabled = true;

        pauseButton.disabled = true;

        resumeButton.disabled = false;

    }

    else {

        startButton.disabled = false;

        pauseButton.disabled = true;

        resumeButton.disabled = true;

    }

}


// ========================================
// SAVE TO HISTORY
// ========================================

function saveToHistory() {

    if (historySaved) {

        return;

    }


    if (gravity <= 0 || initialHeight <= 0) {

        return;

    }


    const fallTime =
        Math.sqrt(
            (2 * initialHeight) / gravity
        );


    const impactVelocity =
        Math.sqrt(
            2 *
            gravity *
            initialHeight
        );


    const historyItem = {

        icon: "🪂",

        title:
            "Free Fall Simulation",

        calculation:
            "h₀ = " +
            initialHeight.toFixed(2) +
            " m | " +

            "m = " +
            mass.toFixed(2) +
            " kg | " +

            "g = " +
            gravity.toFixed(2) +
            " m/s² | " +

            "t = " +
            fallTime.toFixed(2) +
            " s | " +

            "v = " +
            impactVelocity.toFixed(2) +
            " m/s",

        time:
            new Date().toLocaleString("th-TH"),

        tool:
            "Free Fall",

        category:
            "Physics Simulation",

        date:
            new Date().toISOString(),

        timestamp:
            Date.now(),

        input: {

            height:
                Number(
                    initialHeight.toFixed(2)
                ),

            mass:
                Number(
                    mass.toFixed(2)
                ),

            gravity:
                Number(
                    gravity.toFixed(2)
                )

        },

        result: {

            fallTime:
                Number(
                    fallTime.toFixed(2)
                ),

            impactVelocity:
                Number(
                    impactVelocity.toFixed(2)
                )

        }

    };


    let history = [];


    try {

        const savedHistory =
            localStorage.getItem(
                "engiHistory"
            );


        if (savedHistory) {

            history =
                JSON.parse(
                    savedHistory
                );

        }


        if (!Array.isArray(history)) {

            history = [];

        }

    }

    catch (error) {

        console.error(
            "History read error:",
            error
        );

        history = [];

    }


    history.unshift(
        historyItem
    );


    if (history.length > 100) {

        history =
            history.slice(
                0,
                100
            );

    }


    try {

        localStorage.setItem(
            "engiHistory",
            JSON.stringify(history)
        );


        historySaved = true;


        console.log(
            "================================"
        );

        console.log(
            "Free Fall History Saved"
        );

        console.log(
            historyItem
        );

        console.log(
            "Total History:",
            history.length
        );

        console.log(
            "================================"
        );

    }

    catch (error) {

        console.error(
            "Cannot save Free Fall History:",
            error
        );

    }

}


// ========================================
// START
// ========================================

function startSimulation() {

    if (isRunning) {

        return;

    }


    readInputs();


    if (
        initialHeight <= 0 ||
        gravity <= 0
    ) {

        return;

    }


    simulationTime = 0;

    currentHeight =
        initialHeight;

    currentVelocity = 0;

    currentAcceleration =
        gravity;


    graphData = [];

    historySaved = false;

    isRunning = true;

    isPaused = false;

    lastTimestamp = null;


    graphEmpty.style.display =
        "block";


    setStatus(
        "Running",
        "running"
    );


    updateButtons();

    updateRealtime();

    updateResults();

    drawSimulation();

    drawGraph();


    cancelAnimationFrame(
        animationFrame
    );


    animationFrame =
        requestAnimationFrame(
            animate
        );

}


// ========================================
// ANIMATION
// ========================================

function animate(timestamp) {

    if (!isRunning) {

        return;

    }


    if (lastTimestamp === null) {

        lastTimestamp =
            timestamp;

    }


    const deltaTime =
        Math.min(
            (timestamp - lastTimestamp) / 1000,
            0.05
        );


    lastTimestamp =
        timestamp;


    simulationTime +=
        deltaTime;


    currentVelocity =
        gravity *
        simulationTime;


    currentHeight =
        initialHeight -
        (
            0.5 *
            gravity *
            simulationTime *
            simulationTime
        );


    currentAcceleration =
        gravity;


    // ====================================
    // GROUND COLLISION
    // ====================================

    if (currentHeight <= 0) {

        currentHeight = 0;


        currentVelocity =
            Math.sqrt(
                2 *
                gravity *
                initialHeight
            );


        simulationTime =
            Math.sqrt(
                (2 * initialHeight) /
                gravity
            );


        currentAcceleration =
            gravity;


        addGraphData();

        updateRealtime();

        drawSimulation();

        drawGraph();


        isRunning = false;

        isPaused = false;


        setStatus(
            "Finished",
            "finished"
        );


        updateButtons();


        saveToHistory();


        return;

    }


    // ====================================
    // GRAPH
    // ====================================

    addGraphData();


    // ====================================
    // UPDATE
    // ====================================

    updateRealtime();

    drawSimulation();

    drawGraph();


    animationFrame =
        requestAnimationFrame(
            animate
        );

}


// ========================================
// ADD GRAPH DATA
// ========================================

function addGraphData() {

    graphData.push({

        time:
            simulationTime,

        height:
            currentHeight,

        velocity:
            currentVelocity,

        acceleration:
            currentAcceleration

    });


    if (graphData.length > 500) {

        graphData.shift();

    }


    if (graphData.length > 1) {

        graphEmpty.style.display =
            "none";

    }

    else {

        graphEmpty.style.display =
            "block";

    }

}


// ========================================
// PAUSE
// ========================================

function pauseSimulation() {

    if (!isRunning) {

        return;

    }


    isRunning = false;

    isPaused = true;


    cancelAnimationFrame(
        animationFrame
    );


    setStatus(
        "Paused",
        "paused"
    );


    updateButtons();

}


// ========================================
// RESUME
// ========================================

function resumeSimulation() {

    if (!isPaused) {

        return;

    }


    isRunning = true;

    isPaused = false;

    lastTimestamp = null;


    setStatus(
        "Running",
        "running"
    );


    updateButtons();


    animationFrame =
        requestAnimationFrame(
            animate
        );

}


// ========================================
// RESET
// ========================================

function resetSimulation() {

    cancelAnimationFrame(
        animationFrame
    );


    readInputs();


    simulationTime = 0;

    currentHeight =
        initialHeight;

    currentVelocity = 0;

    currentAcceleration =
        gravity;


    graphData = [];

    isRunning = false;

    isPaused = false;

    historySaved = false;

    lastTimestamp = null;


    setStatus(
        "Ready"
    );


    updateButtons();

    updateInputDisplay();

    updateRealtime();

    updateResults();

    drawSimulation();

    drawGraph();


    graphEmpty.style.display =
        "block";

}


// ========================================
// DRAW SIMULATION
// ========================================

function drawSimulation() {

    const rect =
        simulationCanvas.getBoundingClientRect();


    const width =
        rect.width;

    const height =
        rect.height;


    if (
        width <= 0 ||
        height <= 0
    ) {

        return;

    }


    const dpr =
        window.devicePixelRatio || 1;


    simulationCanvas.width =
        width * dpr;

    simulationCanvas.height =
        height * dpr;


    simulationContext.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
    );


    simulationContext.clearRect(
        0,
        0,
        width,
        height
    );


    const gradient =
        simulationContext.createLinearGradient(
            0,
            0,
            0,
            height
        );


    gradient.addColorStop(
        0,
        "#dbeafe"
    );

    gradient.addColorStop(
        1,
        "#eff6ff"
    );


    simulationContext.fillStyle =
        gradient;


    simulationContext.fillRect(
        0,
        0,
        width,
        height
    );


    const groundHeight = 45;


    simulationContext.fillStyle =
        "#334155";


    simulationContext.fillRect(
        0,
        height - groundHeight,
        width,
        groundHeight
    );


    simulationContext.fillStyle =
        "#64748b";


    simulationContext.fillRect(
        0,
        height - groundHeight,
        width,
        5
    );


    const topMargin = 40;

    const bottomMargin =
        groundHeight + 15;


    const availableHeight =
        height -
        topMargin -
        bottomMargin;


    const maxHeight =
        Math.max(
            initialHeight,
            1
        );


    let objectY =
        topMargin +
        (
            1 -
            (
                currentHeight /
                maxHeight
            )
        ) *
        availableHeight;


    objectY =
        Math.max(
            topMargin,
            Math.min(
                objectY,
                height - bottomMargin
            )
        );


    const objectX =
        width / 2;


    // Vertical guide line

    simulationContext.strokeStyle =
        "#94a3b8";

    simulationContext.lineWidth = 1;

    simulationContext.setLineDash([
        6,
        6
    ]);


    simulationContext.beginPath();

    simulationContext.moveTo(
        objectX,
        topMargin
    );

    simulationContext.lineTo(
        objectX,
        height - bottomMargin
    );

    simulationContext.stroke();

    simulationContext.setLineDash([]);


    // Height label

    simulationContext.fillStyle =
        "#334155";

    simulationContext.font =
        "bold 14px Arial";

    simulationContext.textAlign =
        "left";


    simulationContext.fillText(
        initialHeight.toFixed(1) + " m",
        15,
        topMargin + 5
    );


    // Current height

    simulationContext.fillStyle =
        "#2563eb";

    simulationContext.font =
        "bold 15px Arial";


    simulationContext.fillText(
        "h = " +
        currentHeight.toFixed(2) +
        " m",
        15,
        Math.max(
            25,
            objectY - 15
        )
    );


    // Object

    const radius = 18;


    simulationContext.beginPath();

    simulationContext.arc(
        objectX,
        objectY,
        radius,
        0,
        Math.PI * 2
    );


    const objectGradient =
        simulationContext.createRadialGradient(
            objectX - 6,
            objectY - 6,
            3,
            objectX,
            objectY,
            radius
        );


    objectGradient.addColorStop(
        0,
        "#60a5fa"
    );

    objectGradient.addColorStop(
        1,
        "#1d4ed8"
    );


    simulationContext.fillStyle =
        objectGradient;


    simulationContext.fill();


    simulationContext.strokeStyle =
        "#1e3a8a";

    simulationContext.lineWidth = 2;

    simulationContext.stroke();


    // Mass label

    simulationContext.fillStyle =
        "#0f172a";

    simulationContext.font =
        "bold 13px Arial";

    simulationContext.textAlign =
        "center";


    simulationContext.fillText(
        mass.toFixed(1) + " kg",
        objectX,
        objectY + 38
    );


    // Ground text

    simulationContext.fillStyle =
        "white";

    simulationContext.font =
        "bold 14px Arial";


    simulationContext.fillText(
        "GROUND",
        objectX,
        height - 17
    );


    simulationContext.textAlign =
        "left";

}


// ========================================
// DRAW GRAPH
// ========================================

function drawGraph() {

    const rect =
        graphCanvas.getBoundingClientRect();


    const width =
        rect.width;

    const height =
        rect.height;


    if (
        width <= 0 ||
        height <= 0
    ) {

        return;

    }


    const dpr =
        window.devicePixelRatio || 1;


    graphCanvas.width =
        width * dpr;

    graphCanvas.height =
        height * dpr;


    graphContext.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
    );


    graphContext.clearRect(
        0,
        0,
        width,
        height
    );


    graphContext.fillStyle =
        "#ffffff";


    graphContext.fillRect(
        0,
        0,
        width,
        height
    );


    if (graphData.length < 2) {

        drawEmptyGraph(
            width,
            height
        );

        updateGraphCurrentValue();

        return;

    }


    const values =
        graphData.map(
            function(item) {

                return item[selectedGraph];

            }
        );


    let maxValue =
        Math.max.apply(
            null,
            values
        );


    let minValue =
        Math.min.apply(
            null,
            values
        );


    if (selectedGraph === "height") {

        minValue =
            Math.min(
                0,
                minValue
            );

    }


    if (
        selectedGraph === "velocity" ||
        selectedGraph === "acceleration"
    ) {

        minValue = 0;

    }


    if (maxValue === minValue) {

        maxValue += 1;

    }


    const left = 55;

    const right = 20;

    const top = 25;

    const bottom = 40;


    const graphWidth =
        width -
        left -
        right;


    const graphHeight =
        height -
        top -
        bottom;


    // Grid

    graphContext.strokeStyle =
        "#e2e8f0";

    graphContext.lineWidth = 1;


    for (
        let i = 0;
        i <= 5;
        i++
    ) {

        const y =
            top +
            (i / 5) *
            graphHeight;


        graphContext.beginPath();

        graphContext.moveTo(
            left,
            y
        );

        graphContext.lineTo(
            width - right,
            y
        );

        graphContext.stroke();


        const value =
            maxValue -
            (i / 5) *
            (maxValue - minValue);


        graphContext.fillStyle =
            "#64748b";

        graphContext.font =
            "11px Arial";

        graphContext.textAlign =
            "right";


        graphContext.fillText(
            value.toFixed(1),
            left - 8,
            y + 4
        );

    }


    // Axis

    graphContext.strokeStyle =
        "#64748b";

    graphContext.lineWidth = 1.5;


    graphContext.beginPath();

    graphContext.moveTo(
        left,
        top
    );

    graphContext.lineTo(
        left,
        height - bottom
    );

    graphContext.lineTo(
        width - right,
        height - bottom
    );

    graphContext.stroke();


    // Graph line

    graphContext.strokeStyle =
        "#2563eb";

    graphContext.lineWidth = 3;


    graphContext.beginPath();


    graphData.forEach(
        function(item, index) {

            const x =
                left +
                (
                    index /
                    (graphData.length - 1)
                ) *
                graphWidth;


            const normalized =
                (
                    item[selectedGraph] -
                    minValue
                ) /
                (
                    maxValue -
                    minValue
                );


            const y =
                top +
                (
                    1 -
                    normalized
                ) *
                graphHeight;


            if (index === 0) {

                graphContext.moveTo(
                    x,
                    y
                );

            }

            else {

                graphContext.lineTo(
                    x,
                    y
                );

            }

        }
    );


    graphContext.stroke();


    updateGraphCurrentValue();

}


// ========================================
// UPDATE GRAPH VALUE
// ========================================

function updateGraphCurrentValue() {

    let currentValue = 0;

    let unit = "";


    if (selectedGraph === "height") {

        currentValue =
            currentHeight;

        unit = "m";

    }

    else if (selectedGraph === "velocity") {

        currentValue =
            currentVelocity;

        unit = "m/s";

    }

    else {

        currentValue =
            currentAcceleration;

        unit = "m/s²";

    }


    graphCurrentValue.textContent =
        currentValue.toFixed(2) +
        " " +
        unit;

}


// ========================================
// EMPTY GRAPH
// ========================================

function drawEmptyGraph(
    width,
    height
) {

    graphContext.strokeStyle =
        "#e2e8f0";

    graphContext.lineWidth = 1;


    for (
        let i = 1;
        i < 5;
        i++
    ) {

        const y =
            (height / 5) * i;


        graphContext.beginPath();

        graphContext.moveTo(
            0,
            y
        );

        graphContext.lineTo(
            width,
            y
        );

        graphContext.stroke();

    }


    for (
        let i = 1;
        i < 6;
        i++
    ) {

        const x =
            (width / 6) * i;


        graphContext.beginPath();

        graphContext.moveTo(
            x,
            0
        );

        graphContext.lineTo(
            x,
            height
        );

        graphContext.stroke();

    }

}


// ========================================
// GRAPH BUTTONS
// ========================================

graphButtons.forEach(
    function(button) {

        button.addEventListener(
            "click",
            function() {

                graphButtons.forEach(
                    function(item) {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                button.classList.add(
                    "active"
                );


                selectedGraph =
                    button.dataset.graph;


                if (selectedGraph === "height") {

                    graphCurrentTitle.textContent =
                        "ความสูง";

                }

                else if (
                    selectedGraph === "velocity"
                ) {

                    graphCurrentTitle.textContent =
                        "ความเร็ว";

                }

                else {

                    graphCurrentTitle.textContent =
                        "ความเร่ง";

                }


                drawGraph();

            }
        );

    }
);


// ========================================
// HEIGHT INPUT
// ========================================

heightInput.addEventListener(
    "input",
    function() {

        if (
            isRunning ||
            isPaused
        ) {

            return;

        }


        updateInputDisplay();


        currentHeight =
            initialHeight;

        currentVelocity = 0;

        currentAcceleration =
            gravity;


        updateRealtime();

        updateResults();

        drawSimulation();

        drawGraph();

    }
);


// ========================================
// MASS INPUT
// ========================================

massInput.addEventListener(
    "input",
    function() {

        if (
            isRunning ||
            isPaused
        ) {

            return;

        }


        updateInputDisplay();

        drawSimulation();

    }
);


// ========================================
// GRAVITY INPUT
// ========================================

gravityInput.addEventListener(
    "input",
    function() {

        if (
            isRunning ||
            isPaused
        ) {

            return;

        }


        updateInputDisplay();


        currentAcceleration =
            gravity;


        updateRealtime();

        updateResults();

        drawSimulation();

        drawGraph();

    }
);


// ========================================
// BUTTON EVENTS
// ========================================

startButton.addEventListener(
    "click",
    startSimulation
);

pauseButton.addEventListener(
    "click",
    pauseSimulation
);

resumeButton.addEventListener(
    "click",
    resumeSimulation
);

resetButton.addEventListener(
    "click",
    resetSimulation
);


// ========================================
// WINDOW RESIZE
// ========================================

window.addEventListener(
    "resize",
    function() {

        drawSimulation();

        drawGraph();

    }
);


// ========================================
// INITIALIZE
// ========================================

function initialize() {

    readInputs();

    updateInputDisplay();


    simulationTime = 0;

    currentHeight =
        initialHeight;

    currentVelocity = 0;

    currentAcceleration =
        gravity;


    graphData = [];

    isRunning = false;

    isPaused = false;

    historySaved = false;

    lastTimestamp = null;


    setStatus(
        "Ready"
    );


    updateButtons();

    updateRealtime();

    updateResults();

    drawSimulation();

    drawGraph();

}


initialize();


console.log(
    "Free Fall Simulation initialized successfully."
);