// ============================================================
// INCLINED PLANE SIMULATION
// ENGI HUB
// Realistic motion with friction
// ============================================================


// ============================================================
// ELEMENTS
// ============================================================

const massInput =
    document.getElementById("mass");

const angleInput =
    document.getElementById("angle");

const frictionInput =
    document.getElementById("friction");


const massValue =
    document.getElementById("massValue");

const angleValue =
    document.getElementById("angleValue");

const frictionValue =
    document.getElementById("frictionValue");


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


const simulationCanvas =
    document.getElementById("simulationCanvas");

const simulationContext =
    simulationCanvas.getContext("2d");


const realtimeTime =
    document.getElementById("realtimeTime");

const realtimePosition =
    document.getElementById("realtimePosition");

const realtimeVelocity =
    document.getElementById("realtimeVelocity");

const realtimeAcceleration =
    document.getElementById("realtimeAcceleration");


const forceParallelResult =
    document.getElementById("forceParallelResult");

const normalForceResult =
    document.getElementById("normalForceResult");

const frictionForceResult =
    document.getElementById("frictionForceResult");

const accelerationResult =
    document.getElementById("accelerationResult");

const finalVelocityResult =
    document.getElementById("finalVelocityResult");

const timeResult =
    document.getElementById("timeResult");


const graphCanvas =
    document.getElementById("graphCanvas");

const graphContext =
    graphCanvas.getContext("2d");


const graphCurrentTitle =
    document.getElementById("graphCurrentTitle");

const graphCurrentValue =
    document.getElementById("graphCurrentValue");

const graphEmpty =
    document.getElementById("graphEmpty");


// ============================================================
// PHYSICS
// ============================================================

const gravity = 9.81;

let mass = 5;
let angleDeg = 30;
let frictionCoefficient = 0.1;

let angleRad = 0;

let parallelForce = 0;
let normalForce = 0;
let frictionForce = 0;

let netForce = 0;
let acceleration = 0;

let position = 0;
let velocity = 0;
let simulationTime = 0;

let simulationRunning = false;
let simulationPaused = false;

let historySaved = false;

let animationFrame = null;
let lastTimestamp = null;


// ============================================================
// MOTION
// ============================================================

let initialVelocity = 0;


// ============================================================
// GRAPH
// ============================================================

let currentGraph = "position";

let graphData = {
    time: [],
    position: [],
    velocity: [],
    acceleration: []
};


// ============================================================
// UPDATE INPUT DISPLAY
// ============================================================

function updateInputValues() {

    mass =
        Number(massInput.value);

    angleDeg =
        Number(angleInput.value);

    frictionCoefficient =
        Number(frictionInput.value);


    massValue.textContent =
        mass.toFixed(2) + " kg";


    angleValue.textContent =
        angleDeg.toFixed(2) + "°";


    frictionValue.textContent =
        frictionCoefficient.toFixed(2);


    calculatePhysics();

    updateResults();

    updateRealtimeDisplay();

    drawSimulation();
}


// ============================================================
// CALCULATE PHYSICS
// ============================================================

function calculatePhysics() {

    angleRad =
        angleDeg *
        Math.PI /
        180;


    // --------------------------------------------------------
    // Component of gravity along plane
    //
    // F_parallel = mg sin(theta)
    // --------------------------------------------------------

    parallelForce =
        mass *
        gravity *
        Math.sin(angleRad);


    // --------------------------------------------------------
    // Normal force
    //
    // N = mg cos(theta)
    // --------------------------------------------------------

    normalForce =
        mass *
        gravity *
        Math.cos(angleRad);


    // --------------------------------------------------------
    // Kinetic friction
    //
    // F_friction = μN
    // --------------------------------------------------------

    frictionForce =
        frictionCoefficient *
        normalForce;


    // --------------------------------------------------------
    // Net force
    // --------------------------------------------------------

    netForce =
        parallelForce -
        frictionForce;


    // --------------------------------------------------------
    // Acceleration
    //
    // a = F_net / m
    // --------------------------------------------------------

    acceleration =
        netForce /
        mass;


    // --------------------------------------------------------
    // If friction is greater than gravity component,
    // object stays at rest.
    // --------------------------------------------------------

    if (acceleration < 0) {

        acceleration = 0;

        netForce = 0;
    }
}


// ============================================================
// GET PLANE GEOMETRY
// ============================================================

function getPlaneGeometry() {

    const width =
        simulationCanvas.width;

    const height =
        simulationCanvas.height;


    const bottomX = 80;

    const bottomY =
        height - 70;


    const currentAngle =
        angleDeg *
        Math.PI /
        180;


    const maxHorizontal =
        Math.max(
            150,
            width - 170
        );


    const maxVertical =
        Math.max(
            120,
            height - 140
        );


    const cosAngle =
        Math.cos(currentAngle);

    const sinAngle =
        Math.sin(currentAngle);


    let planeLength = 360;


    if (cosAngle > 0.001) {

        const lengthByWidth =
            maxHorizontal /
            cosAngle;

        planeLength =
            Math.min(
                planeLength,
                lengthByWidth
            );
    }


    if (sinAngle > 0.001) {

        const lengthByHeight =
            maxVertical /
            sinAngle;

        planeLength =
            Math.min(
                planeLength,
                lengthByHeight
            );
    }


    planeLength =
        Math.max(
            120,
            planeLength
        );


    const topX =
        bottomX +
        planeLength *
        cosAngle;


    const topY =
        bottomY -
        planeLength *
        sinAngle;


    return {
        bottomX,
        bottomY,
        topX,
        topY,
        planeLength
    };
}


// ============================================================
// MAXIMUM TRAVEL DISTANCE
// ============================================================

function getMaximumSimulationDistance() {

    const geometry =
        getPlaneGeometry();


    return geometry.planeLength *
        0.78;
}


// ============================================================
// DRAW BACKGROUND
// ============================================================

function drawBackground() {

    const width =
        simulationCanvas.width;

    const height =
        simulationCanvas.height;


    const gradient =
        simulationContext.createLinearGradient(
            0,
            0,
            0,
            height
        );


    gradient.addColorStop(
        0,
        "#f8fbff"
    );


    gradient.addColorStop(
        1,
        "#eef2f7"
    );


    simulationContext.fillStyle =
        gradient;


    simulationContext.fillRect(
        0,
        0,
        width,
        height
    );


    // --------------------------------------------------------
    // Subtle grid
    // --------------------------------------------------------

    simulationContext.strokeStyle =
        "rgba(148,163,184,0.10)";

    simulationContext.lineWidth = 1;


    const gridSize = 30;


    for (
        let x = 0;
        x < width;
        x += gridSize
    ) {

        simulationContext.beginPath();

        simulationContext.moveTo(
            x,
            0
        );

        simulationContext.lineTo(
            x,
            height
        );

        simulationContext.stroke();
    }


    for (
        let y = 0;
        y < height;
        y += gridSize
    ) {

        simulationContext.beginPath();

        simulationContext.moveTo(
            0,
            y
        );

        simulationContext.lineTo(
            width,
            y
        );

        simulationContext.stroke();
    }
}


// ============================================================
// DRAW GROUND
// ============================================================

function drawGround(geometry) {

    const width =
        simulationCanvas.width;


    simulationContext.beginPath();

    simulationContext.moveTo(
        25,
        geometry.bottomY
    );

    simulationContext.lineTo(
        width - 25,
        geometry.bottomY
    );


    simulationContext.strokeStyle =
        "#94a3b8";

    simulationContext.lineWidth = 4;

    simulationContext.stroke();
}


// ============================================================
// DRAW TRIANGULAR SUPPORT
// ============================================================

function drawSupport(geometry) {

    simulationContext.beginPath();


    simulationContext.moveTo(
        geometry.bottomX,
        geometry.bottomY
    );


    simulationContext.lineTo(
        geometry.topX,
        geometry.topY
    );


    simulationContext.lineTo(
        geometry.topX,
        geometry.bottomY
    );


    simulationContext.closePath();


    simulationContext.fillStyle =
        "#dbe3ec";

    simulationContext.fill();


    simulationContext.strokeStyle =
        "#64748b";

    simulationContext.lineWidth = 2;

    simulationContext.stroke();
}


// ============================================================
// DRAW INCLINED SURFACE
// ============================================================

function drawInclinedSurface(geometry) {

    // --------------------------------------------------------
    // Main surface
    // --------------------------------------------------------

    simulationContext.beginPath();


    simulationContext.moveTo(
        geometry.topX,
        geometry.topY
    );


    simulationContext.lineTo(
        geometry.bottomX,
        geometry.bottomY
    );


    simulationContext.strokeStyle =
        "#334155";

    simulationContext.lineWidth = 9;

    simulationContext.lineCap =
        "round";

    simulationContext.stroke();


    // --------------------------------------------------------
    // Surface highlight
    // --------------------------------------------------------

    simulationContext.beginPath();


    simulationContext.moveTo(
        geometry.topX,
        geometry.topY - 2
    );


    simulationContext.lineTo(
        geometry.bottomX,
        geometry.bottomY - 2
    );


    simulationContext.strokeStyle =
        "#64748b";

    simulationContext.lineWidth = 2;

    simulationContext.stroke();
}


// ============================================================
// GET OBJECT POSITION
// ============================================================

function getObjectPosition() {

    const geometry =
        getPlaneGeometry();


    const maximumDistance =
        getMaximumSimulationDistance();


    let normalized =
        position /
        maximumDistance;


    normalized =
        Math.max(
            0,
            Math.min(
                1,
                normalized
            )
        );


    const x =
        geometry.topX +
        (
            geometry.bottomX -
            geometry.topX
        ) *
        normalized;


    const y =
        geometry.topY +
        (
            geometry.bottomY -
            geometry.topY
        ) *
        normalized;


    return {
        x,
        y
    };
}


// ============================================================
// DRAW OBJECT
// ============================================================

function drawObject() {

    const object =
        getObjectPosition();


    const boxWidth = 44;

    const boxHeight = 44;


    // --------------------------------------------------------
    // Shadow
    // --------------------------------------------------------

    simulationContext.beginPath();


    simulationContext.ellipse(
        object.x,
        object.y + 4,
        27,
        7,
        0,
        0,
        Math.PI * 2
    );


    simulationContext.fillStyle =
        "rgba(15,23,42,0.16)";


    simulationContext.fill();


    // --------------------------------------------------------
    // Object
    //
    // IMPORTANT:
    // Object remains upright.
    // --------------------------------------------------------

    simulationContext.fillStyle =
        "#2563eb";


    simulationContext.fillRect(
        object.x -
        boxWidth / 2,

        object.y -
        boxHeight -
        5,

        boxWidth,

        boxHeight
    );


    simulationContext.strokeStyle =
        "#1e3a8a";

    simulationContext.lineWidth = 3;


    simulationContext.strokeRect(
        object.x -
        boxWidth / 2,

        object.y -
        boxHeight -
        5,

        boxWidth,

        boxHeight
    );


    // --------------------------------------------------------
    // Object highlight
    // --------------------------------------------------------

    simulationContext.fillStyle =
        "rgba(255,255,255,0.20)";


    simulationContext.fillRect(
        object.x -
        boxWidth / 2 +
        5,

        object.y -
        boxHeight,

        8,

        boxHeight - 10
    );
}


// ============================================================
// DRAW FORCE ARROW
// ============================================================

function drawForceArrow() {

    if (!simulationRunning) {
        return;
    }


    if (acceleration <= 0) {
        return;
    }


    const geometry =
        getPlaneGeometry();


    const object =
        getObjectPosition();


    const dx =
        geometry.bottomX -
        geometry.topX;


    const dy =
        geometry.bottomY -
        geometry.topY;


    const length =
        Math.sqrt(
            dx * dx +
            dy * dy
        );


    const unitX =
        dx / length;


    const unitY =
        dy / length;


    const startX =
        object.x + 30;


    const startY =
        object.y - 24;


    const arrowLength = 55;


    const endX =
        startX +
        unitX *
        arrowLength;


    const endY =
        startY +
        unitY *
        arrowLength;


    // --------------------------------------------------------
    // Arrow line
    // --------------------------------------------------------

    simulationContext.beginPath();


    simulationContext.moveTo(
        startX,
        startY
    );


    simulationContext.lineTo(
        endX,
        endY
    );


    simulationContext.strokeStyle =
        "#dc2626";

    simulationContext.lineWidth = 4;

    simulationContext.stroke();


    // --------------------------------------------------------
    // Arrow head
    // --------------------------------------------------------

    const direction =
        Math.atan2(
            unitY,
            unitX
        );


    const headLength = 11;

    const headAngle =
        Math.PI / 6;


    simulationContext.beginPath();


    simulationContext.moveTo(
        endX,
        endY
    );


    simulationContext.lineTo(
        endX -
        headLength *
        Math.cos(
            direction -
            headAngle
        ),

        endY -
        headLength *
        Math.sin(
            direction -
            headAngle
        )
    );


    simulationContext.moveTo(
        endX,
        endY
    );


    simulationContext.lineTo(
        endX -
        headLength *
        Math.cos(
            direction +
            headAngle
        ),

        endY -
        headLength *
        Math.sin(
            direction +
            headAngle
        )
    );


    simulationContext.strokeStyle =
        "#dc2626";

    simulationContext.lineWidth = 3;

    simulationContext.stroke();
}


// ============================================================
// DRAW ANGLE
// ============================================================

function drawAngleIndicator() {

    const geometry =
        getPlaneGeometry();


    const radius = 42;


    const startAngle = 0;

    const endAngle =
        -angleRad;


    simulationContext.beginPath();


    simulationContext.arc(
        geometry.bottomX,
        geometry.bottomY,
        radius,
        startAngle,
        endAngle,
        true
    );


    simulationContext.strokeStyle =
        "#2563eb";

    simulationContext.lineWidth = 2;

    simulationContext.stroke();


    simulationContext.fillStyle =
        "#2563eb";

    simulationContext.font =
        "bold 14px Arial";


    simulationContext.fillText(
        "θ = " +
        angleDeg.toFixed(1) +
        "°",

        geometry.bottomX + 15,

        geometry.bottomY - 15
    );
}


// ============================================================
// DRAW LABELS
// ============================================================

function drawLabels() {

    const geometry =
        getPlaneGeometry();


    simulationContext.fillStyle =
        "#0f172a";

    simulationContext.font =
        "bold 16px Arial";


    simulationContext.fillText(
        "Inclined Plane",
        25,
        30
    );


    simulationContext.font =
        "13px Arial";


    simulationContext.fillStyle =
        "#64748b";


    simulationContext.fillText(
        "Gravity: 9.81 m/s²",
        25,
        50
    );


    // --------------------------------------------------------
    // Top label
    // --------------------------------------------------------

    simulationContext.fillStyle =
        "#475569";


    simulationContext.font =
        "12px Arial";


    simulationContext.fillText(
        "Start",
        geometry.topX - 15,
        geometry.topY - 18
    );


    // --------------------------------------------------------
    // Bottom label
    // --------------------------------------------------------

    simulationContext.fillText(
        "End",
        geometry.bottomX - 15,
        geometry.bottomY + 28
    );
}


// ============================================================
// DRAW SIMULATION
// ============================================================

function drawSimulation() {

    const width =
        simulationCanvas.width;

    const height =
        simulationCanvas.height;


    simulationContext.clearRect(
        0,
        0,
        width,
        height
    );


    drawBackground();


    const geometry =
        getPlaneGeometry();


    drawGround(
        geometry
    );


    drawSupport(
        geometry
    );


    drawInclinedSurface(
        geometry
    );


    drawAngleIndicator();


    drawObject();


    drawForceArrow();


    drawLabels();
}


// ============================================================
// REALTIME DISPLAY
// ============================================================

function updateRealtimeDisplay() {

    if (realtimeTime) {

        realtimeTime.textContent =
            simulationTime.toFixed(2) +
            " s";
    }


    if (realtimePosition) {

        realtimePosition.textContent =
            position.toFixed(2) +
            " m";
    }


    if (realtimeVelocity) {

        realtimeVelocity.textContent =
            velocity.toFixed(2) +
            " m/s";
    }


    if (realtimeAcceleration) {

        realtimeAcceleration.textContent =
            acceleration.toFixed(2) +
            " m/s²";
    }
}


// ============================================================
// RESULTS
// ============================================================

function updateResults() {

    if (forceParallelResult) {

        forceParallelResult.textContent =
            parallelForce.toFixed(2) +
            " N";
    }


    if (normalForceResult) {

        normalForceResult.textContent =
            normalForce.toFixed(2) +
            " N";
    }


    if (frictionForceResult) {

        frictionForceResult.textContent =
            frictionForce.toFixed(2) +
            " N";
    }


    if (accelerationResult) {

        accelerationResult.textContent =
            acceleration.toFixed(2) +
            " m/s²";
    }


    const distance =
        getMaximumSimulationDistance();


    let finalVelocity = 0;

    let finalTime = 0;


    if (acceleration > 0) {

        finalVelocity =
            Math.sqrt(
                2 *
                acceleration *
                distance
            );


        finalTime =
            Math.sqrt(
                2 *
                distance /
                acceleration
            );
    }


    if (finalVelocityResult) {

        finalVelocityResult.textContent =
            finalVelocity.toFixed(2) +
            " m/s";
    }


    if (timeResult) {

        timeResult.textContent =
            finalTime.toFixed(2) +
            " s";
    }
}


// ============================================================
// STATUS
// ============================================================

function updateStatus(
    message,
    running
) {

    if (statusText) {

        statusText.textContent =
            message;
    }


    if (statusDot) {

        statusDot.style.background =
            running
                ? "#22c55e"
                : "#94a3b8";
    }
}


// ============================================================
// START
// ============================================================

function startSimulation() {

    calculatePhysics();


    position = 0;

    velocity = 0;

    simulationTime = 0;

    historySaved = false;


    graphData = {
        time: [],
        position: [],
        velocity: [],
        acceleration: []
    };


    // --------------------------------------------------------
    // Check if object can slide
    // --------------------------------------------------------

    if (acceleration <= 0) {

        simulationRunning = false;

        simulationPaused = false;


        updateStatus(
            "วัตถุไม่ไถล — แรงเสียดทานมากเกินไป",
            false
        );


        updateRealtimeDisplay();

        drawSimulation();

        updateGraph();

        return;
    }


    simulationRunning = true;

    simulationPaused = false;

    lastTimestamp = null;


    updateStatus(
        "กำลังจำลอง",
        true
    );


    updateRealtimeDisplay();

    drawSimulation();

    updateGraph();


    startAnimation();
}


// ============================================================
// PAUSE
// ============================================================

function pauseSimulation() {

    if (!simulationRunning) {
        return;
    }


    simulationPaused = true;


    updateStatus(
        "หยุดชั่วคราว",
        false
    );
}


// ============================================================
// RESUME
// ============================================================

function resumeSimulation() {

    if (!simulationRunning) {
        return;
    }


    if (!simulationPaused) {
        return;
    }


    simulationPaused = false;

    lastTimestamp = null;


    updateStatus(
        "กำลังจำลอง",
        true
    );


    startAnimation();
}


// ============================================================
// RESET
// ============================================================

function resetSimulation() {

    simulationRunning = false;

    simulationPaused = false;


    position = 0;

    velocity = 0;

    simulationTime = 0;


    historySaved = false;


    lastTimestamp = null;


    if (animationFrame) {

        cancelAnimationFrame(
            animationFrame
        );

        animationFrame = null;
    }


    graphData = {
        time: [],
        position: [],
        velocity: [],
        acceleration: []
    };


    updateStatus(
        "พร้อมเริ่มการจำลอง",
        false
    );


    updateRealtimeDisplay();

    updateResults();

    updateGraph();

    drawSimulation();
}


// ============================================================
// ANIMATION
// ============================================================

function startAnimation() {

    if (animationFrame) {

        cancelAnimationFrame(
            animationFrame
        );
    }


    animationFrame =
        requestAnimationFrame(
            animate
        );
}


// ============================================================
// ANIMATE
// ============================================================

function animate(timestamp) {

    if (!simulationRunning) {

        animationFrame = null;

        return;
    }


    animationFrame =
        requestAnimationFrame(
            animate
        );


    if (simulationPaused) {

        lastTimestamp = null;

        return;
    }


    if (lastTimestamp === null) {

        lastTimestamp =
            timestamp;

        return;
    }


    let deltaTime =
        (
            timestamp -
            lastTimestamp
        ) / 1000;


    lastTimestamp =
        timestamp;


    // --------------------------------------------------------
    // Prevent huge time jump
    // --------------------------------------------------------

    if (deltaTime > 0.05) {

        deltaTime = 0.05;
    }


    // ========================================================
    // REAL PHYSICS
    // ========================================================

    // v = v + at

    velocity +=
        acceleration *
        deltaTime;


    // s = s + vt
    //
    // Use average velocity for better numerical accuracy.

    position +=
        velocity *
        deltaTime;


    simulationTime +=
        deltaTime;


    // --------------------------------------------------------
    // Maximum distance
    // --------------------------------------------------------

    const maximumDistance =
        getMaximumSimulationDistance();


    // --------------------------------------------------------
    // Prevent overshooting
    // --------------------------------------------------------

    if (
        position >=
        maximumDistance
    ) {

        position =
            maximumDistance;


        // Exact final velocity
        velocity =
            Math.sqrt(
                2 *
                acceleration *
                maximumDistance
            );


        // Exact time
        simulationTime =
            Math.sqrt(
                2 *
                maximumDistance /
                acceleration
            );


        updateRealtimeDisplay();

        drawSimulation();

        updateGraph();


        if (!historySaved) {

            saveToHistory();
        }


        simulationRunning = false;

        simulationPaused = false;


        updateStatus(
            "จำลองเสร็จสิ้น",
            false
        );


        return;
    }


    // ========================================================
    // GRAPH DATA
    // ========================================================

    graphData.time.push(
        simulationTime
    );


    graphData.position.push(
        position
    );


    graphData.velocity.push(
        velocity
    );


    graphData.acceleration.push(
        acceleration
    );


    // --------------------------------------------------------
    // Keep graph lightweight
    // --------------------------------------------------------

    if (
        graphData.time.length >
        600
    ) {

        graphData.time.shift();

        graphData.position.shift();

        graphData.velocity.shift();

        graphData.acceleration.shift();
    }


    updateRealtimeDisplay();

    updateGraph();

    drawSimulation();
}


// ============================================================
// SAVE HISTORY
// ============================================================

function saveToHistory() {

    if (historySaved) {
        return;
    }


    historySaved = true;


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

    } catch (error) {

        console.warn(
            "ไม่สามารถอ่าน engiHistory ได้",
            error
        );

        history = [];
    }


    const distance =
        getMaximumSimulationDistance();


    const finalVelocity =
        Math.sqrt(
            2 *
            acceleration *
            distance
        );


    const finalTime =
        Math.sqrt(
            2 *
            distance /
            acceleration
        );


    const historyItem = {

        icon: "📐",

        title:
            "Inclined Plane Simulation",

        calculation:
            "m = " +
            mass.toFixed(2) +
            " kg | " +

            "θ = " +
            angleDeg.toFixed(2) +
            "° | " +

            "μ = " +
            frictionCoefficient.toFixed(2) +
            " | " +

            "a = " +
            acceleration.toFixed(2) +
            " m/s² | " +

            "v = " +
            finalVelocity.toFixed(2) +
            " m/s",

        time:
            new Date().toLocaleString(
                "th-TH"
            ),

        tool:
            "Inclined Plane",

        category:
            "Physics Simulation",

        date:
            new Date().toISOString(),

        timestamp:
            Date.now(),

        input: {

            mass:
                Number(
                    mass.toFixed(2)
                ),

            angle:
                Number(
                    angleDeg.toFixed(2)
                ),

            friction:
                Number(
                    frictionCoefficient.toFixed(2)
                )
        },

        result: {

            parallelForce:
                Number(
                    parallelForce.toFixed(2)
                ),

            normalForce:
                Number(
                    normalForce.toFixed(2)
                ),

            frictionForce:
                Number(
                    frictionForce.toFixed(2)
                ),

            acceleration:
                Number(
                    acceleration.toFixed(2)
                ),

            finalVelocity:
                Number(
                    finalVelocity.toFixed(2)
                ),

            time:
                Number(
                    finalTime.toFixed(2)
                )
        }
    };


    history.unshift(
        historyItem
    );


    if (
        history.length >
        100
    ) {

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


        console.log(
            "Inclined Plane History Saved",
            historyItem
        );

    } catch (error) {

        console.error(
            "ไม่สามารถบันทึก History ได้",
            error
        );
    }
}


// ============================================================
// GRAPH BUTTONS
// ============================================================

const graphButtons =
    document.querySelectorAll(
        ".graph-button"
    );


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


                currentGraph =
                    button.dataset.graph ||
                    "position";


                updateGraph();
            }
        );
    }
);


// ============================================================
// UPDATE GRAPH
// ============================================================

function updateGraph() {

    const width =
        graphCanvas.width;

    const height =
        graphCanvas.height;


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


    if (
        graphData.time.length <
        2
    ) {

        if (graphEmpty) {

            graphEmpty.style.display =
                "flex";
        }


        return;
    }


    if (graphEmpty) {

        graphEmpty.style.display =
            "none";
    }


    let values = [];


    if (
        currentGraph ===
        "position"
    ) {

        values =
            graphData.position;

    } else if (
        currentGraph ===
        "velocity"
    ) {

        values =
            graphData.velocity;

    } else {

        values =
            graphData.acceleration;
    }


    if (!values.length) {
        return;
    }


    const padding = 45;


    const plotWidth =
        width -
        padding * 2;


    const plotHeight =
        height -
        padding * 2;


    const minTime =
        graphData.time[0];


    const maxTime =
        graphData.time[
            graphData.time.length - 1
        ];


    let minValue =
        Math.min(...values);


    let maxValue =
        Math.max(...values);


    if (
        minValue ===
        maxValue
    ) {

        minValue -= 1;

        maxValue += 1;
    }


    // ========================================================
    // GRID
    // ========================================================

    graphContext.strokeStyle =
        "#e2e8f0";

    graphContext.lineWidth = 1;


    for (
        let i = 0;
        i <= 5;
        i++
    ) {

        const y =
            padding +
            plotHeight *
            i /
            5;


        graphContext.beginPath();


        graphContext.moveTo(
            padding,
            y
        );


        graphContext.lineTo(
            width -
            padding,
            y
        );


        graphContext.stroke();
    }


    // ========================================================
    // AXES
    // ========================================================

    graphContext.strokeStyle =
        "#64748b";

    graphContext.lineWidth = 2;


    graphContext.beginPath();


    graphContext.moveTo(
        padding,
        padding
    );


    graphContext.lineTo(
        padding,
        height -
        padding
    );


    graphContext.lineTo(
        width -
        padding,
        height -
        padding
    );


    graphContext.stroke();


    // ========================================================
    // GRAPH
    // ========================================================

    graphContext.beginPath();


    values.forEach(
        function(value, index) {

            let x =
                padding;


            if (
                maxTime >
                minTime
            ) {

                x =
                    padding +
                    (
                        (
                            graphData.time[index] -
                            minTime
                        ) /
                        (
                            maxTime -
                            minTime
                        )
                    ) *
                    plotWidth;
            }


            const y =
                height -
                padding -
                (
                    (
                        value -
                        minValue
                    ) /
                    (
                        maxValue -
                        minValue
                    )
                ) *
                plotHeight;


            if (
                index === 0
            ) {

                graphContext.moveTo(
                    x,
                    y
                );

            } else {

                graphContext.lineTo(
                    x,
                    y
                );
            }
        }
    );


    graphContext.strokeStyle =
        "#2563eb";

    graphContext.lineWidth = 3;

    graphContext.stroke();


    // ========================================================
    // GRAPH INFO
    // ========================================================

    let title =
        "Position";

    let unit =
        "m";


    if (
        currentGraph ===
        "velocity"
    ) {

        title =
            "Velocity";

        unit =
            "m/s";
    }


    if (
        currentGraph ===
        "acceleration"
    ) {

        title =
            "Acceleration";

        unit =
            "m/s²";
    }


    if (graphCurrentTitle) {

        graphCurrentTitle.textContent =
            title;
    }


    if (graphCurrentValue) {

        const latestValue =
            values[
                values.length - 1
            ];


        graphCurrentValue.textContent =
            latestValue.toFixed(2) +
            " " +
            unit;
    }


    // ========================================================
    // AXIS LABELS
    // ========================================================

    graphContext.fillStyle =
        "#64748b";

    graphContext.font =
        "12px Arial";


    graphContext.fillText(
        maxValue.toFixed(1),
        5,
        padding + 5
    );


    graphContext.fillText(
        minValue.toFixed(1),
        5,
        height -
        padding
    );


    graphContext.fillText(
        "Time (s)",
        width - 75,
        height - 10
    );
}


// ============================================================
// CANVAS RESIZE
// ============================================================

function resizeCanvas() {

    const rect =
        simulationCanvas.getBoundingClientRect();


    simulationCanvas.width =
        Math.max(
            300,
            Math.floor(rect.width)
        );


    simulationCanvas.height =
        Math.max(
            250,
            Math.floor(rect.height)
        );


    drawSimulation();
}


// ============================================================
// GRAPH RESIZE
// ============================================================

function resizeGraphCanvas() {

    const rect =
        graphCanvas.getBoundingClientRect();


    graphCanvas.width =
        Math.max(
            300,
            Math.floor(rect.width)
        );


    graphCanvas.height =
        Math.max(
            220,
            Math.floor(rect.height)
        );


    updateGraph();
}


// ============================================================
// INPUT EVENTS
// ============================================================

if (massInput) {

    massInput.addEventListener(
        "input",
        updateInputValues
    );
}


if (angleInput) {

    angleInput.addEventListener(
        "input",
        updateInputValues
    );
}


if (frictionInput) {

    frictionInput.addEventListener(
        "input",
        updateInputValues
    );
}


// ============================================================
// BUTTON EVENTS
// ============================================================

if (startButton) {

    startButton.addEventListener(
        "click",
        startSimulation
    );
}


if (pauseButton) {

    pauseButton.addEventListener(
        "click",
        pauseSimulation
    );
}


if (resumeButton) {

    resumeButton.addEventListener(
        "click",
        resumeSimulation
    );
}


if (resetButton) {

    resetButton.addEventListener(
        "click",
        resetSimulation
    );
}


// ============================================================
// WINDOW RESIZE
// ============================================================

window.addEventListener(
    "resize",
    function() {

        resizeCanvas();

        resizeGraphCanvas();
    }
);


// ============================================================
// INITIALIZE
// ============================================================

calculatePhysics();

resizeCanvas();

resizeGraphCanvas();

updateInputValues();

updateRealtimeDisplay();

updateResults();

updateStatus(
    "พร้อมเริ่มการจำลอง",
    false
);

drawSimulation();

updateGraph();