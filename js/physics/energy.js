// ========================================
// ENERGY & WORK LABORATORY
// ========================================


// ========================================
// CANVAS
// ========================================

const simulationCanvas =
    document.getElementById("simulationCanvas");

const ctx =
    simulationCanvas.getContext("2d");


const graphCanvas =
    document.getElementById("graphCanvas");

const graphCtx =
    graphCanvas.getContext("2d");


// ========================================
// INPUTS
// ========================================

const massInput =
    document.getElementById("mass");

const initialVelocityInput =
    document.getElementById("initialVelocity");

const forceInput =
    document.getElementById("force");

const angleInput =
    document.getElementById("angle");

const frictionInput =
    document.getElementById("friction");

const targetDistanceInput =
    document.getElementById("targetDistance");


// ========================================
// STATE
// ========================================

let mass = 2;

let initialVelocity = 0;

let appliedForce = 10;

let forceAngle = 0;

let frictionCoefficient = 0;

let targetDistance = 10;


let elapsedTime = 0;

let position = 0;

let velocity = 0;

let acceleration = 0;

let running = false;

let paused = false;

let animationFrame = null;

let lastTimestamp = null;


let selectedGraph = "kinetic";


let graphData = [];


// ========================================
// INPUT DISPLAY
// ========================================

const massValue =
    document.getElementById("massValue");

const initialVelocityValue =
    document.getElementById(
        "initialVelocityValue"
    );

const forceValue =
    document.getElementById("forceValue");

const angleValue =
    document.getElementById("angleValue");

const frictionValue =
    document.getElementById("frictionValue");

const distanceValue =
    document.getElementById("distanceValue");


// ========================================
// REALTIME DISPLAY
// ========================================

const realtimeTime =
    document.getElementById(
        "realtimeTime"
    );

const realtimeDistance =
    document.getElementById(
        "realtimeDistance"
    );

const realtimeVelocity =
    document.getElementById(
        "realtimeVelocity"
    );

const realtimeKE =
    document.getElementById(
        "realtimeKE"
    );


// ========================================
// STATUS
// ========================================

const statusDot =
    document.getElementById(
        "statusDot"
    );

const statusText =
    document.getElementById(
        "statusText"
    );


// ========================================
// RESULTS
// ========================================

const workResult =
    document.getElementById(
        "workResult"
    );

const frictionWorkResult =
    document.getElementById(
        "frictionWorkResult"
    );

const netWorkResult =
    document.getElementById(
        "netWorkResult"
    );

const kineticResult =
    document.getElementById(
        "kineticResult"
    );

const netForceResult =
    document.getElementById(
        "netForceResult"
    );

const finalVelocityResult =
    document.getElementById(
        "finalVelocityResult"
    );


// ========================================
// GRAPH
// ========================================

const graphButtons =
    document.querySelectorAll(
        ".graph-button"
    );

const graphInfo =
    document.getElementById(
        "graphInfo"
    );


// ========================================
// BUTTONS
// ========================================

const startButton =
    document.getElementById(
        "startButton"
    );

const pauseButton =
    document.getElementById(
        "pauseButton"
    );

const resumeButton =
    document.getElementById(
        "resumeButton"
    );

const resetButton =
    document.getElementById(
        "resetButton"
    );

const saveButton =
    document.getElementById(
        "saveButton"
    );


// ========================================
// UTILITY
// ========================================

function formatNumber(value) {

    if (!Number.isFinite(value)) {
        return "0.00";
    }

    return value.toFixed(2);
}


// ========================================
// READ INPUTS
// ========================================

function readInputs() {

    mass =
        Number(massInput.value);

    initialVelocity =
        Number(
            initialVelocityInput.value
        );

    appliedForce =
        Number(forceInput.value);

    forceAngle =
        Number(angleInput.value);

    frictionCoefficient =
        Number(
            frictionInput.value
        );

    targetDistance =
        Number(
            targetDistanceInput.value
        );


    if (!Number.isFinite(mass) || mass <= 0) {
        mass = 1;
    }


    if (
        !Number.isFinite(initialVelocity) ||
        initialVelocity < 0
    ) {
        initialVelocity = 0;
    }


    if (
        !Number.isFinite(appliedForce) ||
        appliedForce < 0
    ) {
        appliedForce = 0;
    }


    if (!Number.isFinite(forceAngle)) {
        forceAngle = 0;
    }


    if (
        !Number.isFinite(frictionCoefficient) ||
        frictionCoefficient < 0
    ) {
        frictionCoefficient = 0;
    }


    if (
        !Number.isFinite(targetDistance) ||
        targetDistance <= 0
    ) {
        targetDistance = 1;
    }

}


// ========================================
// UPDATE INPUT LABELS
// ========================================

function updateInputDisplays() {

    massValue.textContent =
        formatNumber(mass) + " kg";


    initialVelocityValue.textContent =
        formatNumber(initialVelocity) +
        " m/s";


    forceValue.textContent =
        formatNumber(appliedForce) +
        " N";


    angleValue.textContent =
        formatNumber(forceAngle) +
        "°";


    frictionValue.textContent =
        formatNumber(
            frictionCoefficient
        );


    distanceValue.textContent =
        formatNumber(targetDistance) +
        " m";

}


// ========================================
// PHYSICS
// ========================================

function calculatePhysics() {

    const angleRad =
        forceAngle * Math.PI / 180;


    /*
        Horizontal component of applied force
    */

    const horizontalForce =
        appliedForce *
        Math.cos(angleRad);


    /*
        Vertical component of applied force
    */

    const verticalForce =
        appliedForce *
        Math.sin(angleRad);


    /*
        Normal force

        For a horizontal surface:
        N = mg - Fy

        Clamp to zero.
    */

    const gravity = 9.81;


    const normalForce =
        Math.max(
            0,
            mass * gravity -
            verticalForce
        );


    /*
        Friction
    */

    const frictionForce =
        frictionCoefficient *
        normalForce;


    /*
        Net force
    */

    const netForce =
        horizontalForce -
        frictionForce;


    /*
        Acceleration
    */

    acceleration =
        netForce / mass;


    /*
        Prevent negative acceleration
        when object has stopped.
    */

    if (
        acceleration < 0 &&
        velocity <= 0
    ) {

        acceleration = 0;

    }


    return {

        horizontalForce,
        verticalForce,
        normalForce,
        frictionForce,
        netForce,
        acceleration

    };

}


// ========================================
// CALCULATE STATE
// ========================================

function calculateState(time) {

    const physics =
        calculatePhysics();


    let currentVelocity =
        initialVelocity +
        physics.acceleration * time;


    if (currentVelocity < 0) {
        currentVelocity = 0;
    }


    let currentPosition =
        initialVelocity * time +
        0.5 *
        physics.acceleration *
        time *
        time;


    if (currentPosition < 0) {
        currentPosition = 0;
    }


    if (
        currentPosition >
        targetDistance
    ) {

        currentPosition =
            targetDistance;

    }


    const appliedWork =
        physics.horizontalForce *
        currentPosition;


    const frictionWork =
        -physics.frictionForce *
        currentPosition;


    const netWork =
        appliedWork +
        frictionWork;


    const kineticEnergy =
        0.5 *
        mass *
        currentVelocity *
        currentVelocity;


    /*
        Work-energy consistency

        If the object starts with
        initial velocity, total KE is
        initial KE + net work.
    */


    return {

        time,

        position:
            currentPosition,

        velocity:
            currentVelocity,

        appliedWork,

        frictionWork,

        netWork,

        kineticEnergy,

        initialKineticEnergy:
            0.5 *
            mass *
            initialVelocity *
            initialVelocity,

        ...physics

    };

}


// ========================================
// STATUS
// ========================================

function setStatus(
    text,
    color
) {

    statusText.textContent =
        text;

    statusDot.style.background =
        color;

}


// ========================================
// UPDATE REALTIME
// ========================================

function updateRealtime(state) {

    realtimeTime.textContent =
        formatNumber(state.time) +
        " s";


    realtimeDistance.textContent =
        formatNumber(state.position) +
        " m";


    realtimeVelocity.textContent =
        formatNumber(state.velocity) +
        " m/s";


    realtimeKE.textContent =
        formatNumber(
            state.kineticEnergy
        ) +
        " J";

}


// ========================================
// UPDATE RESULTS
// ========================================

function updateResults(state) {

    workResult.textContent =
        formatNumber(
            state.appliedWork
        ) +
        " J";


    frictionWorkResult.textContent =
        formatNumber(
            state.frictionWork
        ) +
        " J";


    netWorkResult.textContent =
        formatNumber(
            state.netWork
        ) +
        " J";


    kineticResult.textContent =
        formatNumber(
            state.kineticEnergy
        ) +
        " J";


    netForceResult.textContent =
        formatNumber(
            state.netForce
        ) +
        " N";


    finalVelocityResult.textContent =
        formatNumber(
            state.velocity
        ) +
        " m/s";

}


// ========================================
// DRAW SIMULATION
// ========================================

function drawSimulation(state) {

    const width =
        simulationCanvas.width;

    const height =
        simulationCanvas.height;


    ctx.clearRect(
        0,
        0,
        width,
        height
    );


    /*
        Background
    */

    ctx.fillStyle =
        "#0f172a";

    ctx.fillRect(
        0,
        0,
        width,
        height
    );


    /*
        Ground
    */

    const groundY =
        height * 0.70;


    ctx.strokeStyle =
        "#64748b";

    ctx.lineWidth = 4;

    ctx.beginPath();

    ctx.moveTo(
        50,
        groundY
    );

    ctx.lineTo(
        width - 50,
        groundY
    );

    ctx.stroke();


    /*
        Scale
    */

    const usableWidth =
        width - 120;


    const scale =
        usableWidth /
        Math.max(
            targetDistance,
            1
        );


    const objectX =
        60 +
        state.position *
        scale;


    const objectY =
        groundY - 42;


    /*
        Direction arrow
    */

    ctx.strokeStyle =
        "#94a3b8";

    ctx.lineWidth = 2;

    ctx.beginPath();

    ctx.moveTo(
        70,
        groundY + 35
    );

    ctx.lineTo(
        width - 70,
        groundY + 35
    );

    ctx.stroke();


    /*
        Object
    */

    ctx.fillStyle =
        "#f59e0b";

    ctx.fillRect(
        objectX - 25,
        objectY - 25,
        50,
        50
    );


    ctx.strokeStyle =
        "#fbbf24";

    ctx.lineWidth = 3;

    ctx.strokeRect(
        objectX - 25,
        objectY - 25,
        50,
        50
    );


    /*
        Force vector
    */

    const arrowLength =
        80;


    const angleRad =
        forceAngle *
        Math.PI / 180;


    const forceEndX =
        objectX +
        arrowLength *
        Math.cos(angleRad);


    const forceEndY =
        objectY -
        arrowLength *
        Math.sin(angleRad);


    drawArrow(
        objectX,
        objectY,
        forceEndX,
        forceEndY,
        "#ef4444"
    );


    /*
        Velocity vector
    */

    if (state.velocity > 0) {

        drawArrow(
            objectX,
            objectY + 30,
            objectX + 70,
            objectY + 30,
            "#22c55e"
        );

    }


    /*
        Labels
    */

    ctx.font =
        "bold 15px Arial";


    ctx.fillStyle =
        "#f8fafc";


    ctx.fillText(
        "F = " +
        formatNumber(appliedForce) +
        " N",
        forceEndX + 8,
        forceEndY
    );


    ctx.fillStyle =
        "#22c55e";


    ctx.fillText(
        "v = " +
        formatNumber(state.velocity) +
        " m/s",
        objectX - 20,
        objectY + 70
    );


    ctx.fillStyle =
        "#cbd5e1";


    ctx.fillText(
        "s = " +
        formatNumber(state.position) +
        " m",
        objectX - 25,
        groundY + 60
    );


    /*
        Start marker
    */

    ctx.fillStyle =
        "#94a3b8";


    ctx.beginPath();

    ctx.arc(
        60,
        groundY,
        5,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.font =
        "13px Arial";


    ctx.fillText(
        "Start",
        48,
        groundY + 22
    );


    /*
        End marker
    */

    const endX =
        60 +
        targetDistance *
        scale;


    ctx.fillStyle =
        "#60a5fa";


    ctx.beginPath();

    ctx.arc(
        endX,
        groundY,
        5,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.fillText(
        "Target",
        endX - 20,
        groundY + 22
    );


    /*
        Legend
    */

    ctx.fillStyle =
        "#ef4444";

    ctx.fillText(
        "Force",
        30,
        30
    );


    ctx.fillStyle =
        "#22c55e";

    ctx.fillText(
        "Velocity",
        90,
        30
    );

}


// ========================================
// DRAW ARROW
// ========================================

function drawArrow(
    startX,
    startY,
    endX,
    endY,
    color
) {

    const headLength = 10;

    const angle =
        Math.atan2(
            endY - startY,
            endX - startX
        );


    ctx.strokeStyle =
        color;

    ctx.fillStyle =
        color;

    ctx.lineWidth = 4;


    ctx.beginPath();

    ctx.moveTo(
        startX,
        startY
    );

    ctx.lineTo(
        endX,
        endY
    );

    ctx.stroke();


    ctx.beginPath();

    ctx.moveTo(
        endX,
        endY
    );

    ctx.lineTo(
        endX -
        headLength *
        Math.cos(
            angle - Math.PI / 6
        ),
        endY -
        headLength *
        Math.sin(
            angle - Math.PI / 6
        )
    );

    ctx.lineTo(
        endX -
        headLength *
        Math.cos(
            angle + Math.PI / 6
        ),
        endY -
        headLength *
        Math.sin(
            angle + Math.PI / 6
        )
    );

    ctx.closePath();

    ctx.fill();

}


// ========================================
// GRAPH
// ========================================

function drawGraph() {

    const width =
        graphCanvas.width;

    const height =
        graphCanvas.height;


    graphCtx.clearRect(
        0,
        0,
        width,
        height
    );


    graphCtx.fillStyle =
        "#0f172a";

    graphCtx.fillRect(
        0,
        0,
        width,
        height
    );


    /*
        Grid
    */

    graphCtx.strokeStyle =
        "#1e293b";

    graphCtx.lineWidth = 1;


    for (
        let x = 50;
        x < width - 30;
        x += 50
    ) {

        graphCtx.beginPath();

        graphCtx.moveTo(
            x,
            20
        );

        graphCtx.lineTo(
            x,
            height - 40
        );

        graphCtx.stroke();

    }


    for (
        let y = 30;
        y < height - 40;
        y += 40
    ) {

        graphCtx.beginPath();

        graphCtx.moveTo(
            50,
            y
        );

        graphCtx.lineTo(
            width - 30,
            y
        );

        graphCtx.stroke();

    }


    if (graphData.length < 2) {

        graphCtx.fillStyle =
            "#94a3b8";

        graphCtx.font =
            "15px Arial";

        graphCtx.textAlign =
            "center";

        graphCtx.fillText(
            "กด Start เพื่อสร้างกราฟ",
            width / 2,
            height / 2
        );

        graphCtx.textAlign =
            "left";

        return;

    }


    let maxValue = 1;


    graphData.forEach(
        function(point) {

            let value = 0;


            if (
                selectedGraph ===
                "kinetic"
            ) {

                value =
                    point.kineticEnergy;

            }
            else if (
                selectedGraph ===
                "work"
            ) {

                value =
                    point.netWork;

            }
            else {

                value =
                    point.velocity;

            }


            maxValue =
                Math.max(
                    maxValue,
                    Math.abs(value)
                );

        }
    );


    const graphLeft = 55;

    const graphRight =
        width - 35;

    const graphTop = 25;

    const graphBottom =
        height - 45;


    /*
        Draw axis
    */

    graphCtx.strokeStyle =
        "#64748b";

    graphCtx.lineWidth = 2;


    graphCtx.beginPath();

    graphCtx.moveTo(
        graphLeft,
        graphBottom
    );

    graphCtx.lineTo(
        graphRight,
        graphBottom
    );

    graphCtx.stroke();


    graphCtx.beginPath();

    graphCtx.moveTo(
        graphLeft,
        graphTop
    );

    graphCtx.lineTo(
        graphLeft,
        graphBottom
    );

    graphCtx.stroke();


    /*
        Draw graph
    */

    graphCtx.strokeStyle =
        "#38bdf8";

    graphCtx.lineWidth = 3;

    graphCtx.beginPath();


    graphData.forEach(
        function(point, index) {

            let value = 0;


            if (
                selectedGraph ===
                "kinetic"
            ) {

                value =
                    point.kineticEnergy;

            }
            else if (
                selectedGraph ===
                "work"
            ) {

                value =
                    point.netWork;

            }
            else {

                value =
                    point.velocity;

            }


            const x =
                graphLeft +
                (
                    point.time /
                    Math.max(
                        targetSimulationTime(),
                        0.1
                    )
                ) *
                (
                    graphRight -
                    graphLeft
                );


            const y =
                graphBottom -
                (
                    value /
                    maxValue
                ) *
                (
                    graphBottom -
                    graphTop
                );


            if (index === 0) {

                graphCtx.moveTo(
                    x,
                    y
                );

            }
            else {

                graphCtx.lineTo(
                    x,
                    y
                );

            }

        }
    );


    graphCtx.stroke();


    /*
        Labels
    */

    graphCtx.fillStyle =
        "#94a3b8";

    graphCtx.font =
        "12px Arial";


    graphCtx.fillText(
        "Time",
        width - 60,
        height - 15
    );


    let label = "";


    if (
        selectedGraph ===
        "kinetic"
    ) {

        label =
            "Energy (J)";

    }
    else if (
        selectedGraph ===
        "work"
    ) {

        label =
            "Work (J)";

    }
    else {

        label =
            "Velocity (m/s)";

    }


    graphCtx.fillText(
        label,
        10,
        18
    );

}


// ========================================
// GRAPH TIME
// ========================================

function targetSimulationTime() {

    /*
        Estimate time needed to reach target.
    */

    const physics =
        calculatePhysics();


    if (
        physics.acceleration > 0
    ) {

        const a =
            physics.acceleration;


        const v0 =
            initialVelocity;


        const s =
            targetDistance;


        const discriminant =
            v0 * v0 +
            2 * a * s;


        if (
            discriminant >= 0
        ) {

            return (
                -v0 +
                Math.sqrt(
                    discriminant
                )
            ) / a;

        }

    }


    if (
        initialVelocity > 0
    ) {

        return (
            targetDistance /
            initialVelocity
        );

    }


    return 10;

}


// ========================================
// RESET STATE
// ========================================

function resetSimulation() {

    readInputs();

    elapsedTime = 0;

    position = 0;

    velocity =
        initialVelocity;

    acceleration =
        calculatePhysics().acceleration;

    running = false;

    paused = false;

    lastTimestamp = null;

    graphData = [];


    if (animationFrame) {

        cancelAnimationFrame(
            animationFrame
        );

        animationFrame = null;

    }


    const state =
        calculateState(0);


    updateRealtime(state);

    updateResults(state);

    drawSimulation(state);

    drawGraph();


    setStatus(
        "พร้อมเริ่มการทดลอง",
        "#94a3b8"
    );

}


// ========================================
// START
// ========================================

function startSimulation() {

    readInputs();

    elapsedTime = 0;

    position = 0;

    velocity =
        initialVelocity;

    graphData = [];

    running = true;

    paused = false;

    lastTimestamp = null;


    setStatus(
        "กำลังทดลอง...",
        "#22c55e"
    );


    if (animationFrame) {

        cancelAnimationFrame(
            animationFrame
        );

    }


    animationFrame =
        requestAnimationFrame(
            animationLoop
        );

}


// ========================================
// PAUSE
// ========================================

function pauseSimulation() {

    if (!running) {
        return;
    }


    paused = true;

    setStatus(
        "หยุดชั่วคราว",
        "#f59e0b"
    );

}


// ========================================
// RESUME
// ========================================

function resumeSimulation() {

    if (!running) {
        return;
    }


    if (!paused) {
        return;
    }


    paused = false;

    lastTimestamp = null;


    setStatus(
        "กำลังทดลองต่อ...",
        "#22c55e"
    );


    animationFrame =
        requestAnimationFrame(
            animationLoop
        );

}


// ========================================
// ANIMATION LOOP
// ========================================

function animationLoop(timestamp) {

    if (!running) {
        return;
    }


    if (paused) {
        return;
    }


    if (lastTimestamp === null) {

        lastTimestamp =
            timestamp;

    }


    const deltaTime =
        Math.min(
            (
                timestamp -
                lastTimestamp
            ) / 1000,
            0.05
        );


    lastTimestamp =
        timestamp;


    elapsedTime +=
        deltaTime;


    const state =
        calculateState(
            elapsedTime
        );


    position =
        state.position;

    velocity =
        state.velocity;


    graphData.push({
        time: elapsedTime,
        kineticEnergy:
            state.kineticEnergy,
        netWork:
            state.netWork,
        velocity:
            state.velocity
    });


    if (
        graphData.length >
        600
    ) {

        graphData.shift();

    }


    updateRealtime(state);

    updateResults(state);

    drawSimulation(state);

    drawGraph();


    /*
        Stop when target distance reached
    */

    if (
        position >=
        targetDistance
    ) {

        finishSimulation(
            state
        );

        return;

    }


    /*
        Safety stop
    */

    if (
        elapsedTime >
        60
    ) {

        finishSimulation(
            state
        );

        return;

    }


    animationFrame =
        requestAnimationFrame(
            animationLoop
        );

}


// ========================================
// FINISH
// ========================================

function finishSimulation(state) {

    running = false;

    paused = false;

    position =
        targetDistance;


    /*
        Recalculate final state
        exactly at target distance.
    */

    const finalState =
        calculateState(
            targetSimulationTime()
        );


    updateRealtime(
        finalState
    );

    updateResults(
        finalState
    );

    drawSimulation(
        finalState
    );

    drawGraph();


    setStatus(
        "การทดลองเสร็จสิ้น",
        "#3b82f6"
    );


    animationFrame = null;

}


// ========================================
// SAVE HISTORY
// ========================================

function saveHistory() {

    const state =
        calculateState(
            elapsedTime
        );


    const history =
        JSON.parse(
            localStorage.getItem(
                "engiHistory"
            )
        ) || [];


    const record = {

        icon: "⚡",

        title:
            "Energy & Work Laboratory",

        calculation:

            "m = " +
            formatNumber(mass) +
            " kg | " +

            "F = " +
            formatNumber(appliedForce) +
            " N | " +

            "θ = " +
            formatNumber(forceAngle) +
            "° | " +

            "s = " +
            formatNumber(state.position) +
            " m | " +

            "W = " +
            formatNumber(
                state.appliedWork
            ) +
            " J | " +

            "KE = " +
            formatNumber(
                state.kineticEnergy
            ) +
            " J",

        time:
            new Date().toLocaleString(
                "th-TH"
            ),

        tool:
            "Energy & Work Laboratory",

        category:
            "Physics Simulation",

        date:
            new Date().toISOString(),

        timestamp:
            Date.now(),

        input: {

            mass,

            initialVelocity,

            appliedForce,

            forceAngle,

            frictionCoefficient,

            targetDistance

        },

        result: {

            work:
                Number(
                    state.appliedWork
                        .toFixed(2)
                ),

            frictionWork:
                Number(
                    state.frictionWork
                        .toFixed(2)
                ),

            netWork:
                Number(
                    state.netWork
                        .toFixed(2)
                ),

            kineticEnergy:
                Number(
                    state.kineticEnergy
                        .toFixed(2)
                ),

            finalVelocity:
                Number(
                    state.velocity
                        .toFixed(2)
                )

        }

    };


    history.unshift(record);


    if (history.length > 100) {

        history.length = 100;

    }


    localStorage.setItem(
        "engiHistory",
        JSON.stringify(history)
    );


    setStatus(
        "บันทึกผลการทดลองแล้ว",
        "#8b5cf6"
    );

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
                    function(btn) {

                        btn.classList.remove(
                            "active"
                        );

                    }
                );


                button.classList.add(
                    "active"
                );


                selectedGraph =
                    button.dataset.graph;


                if (
                    selectedGraph ===
                    "kinetic"
                ) {

                    graphInfo.textContent =
                        "Kinetic Energy vs Time";

                }
                else if (
                    selectedGraph ===
                    "work"
                ) {

                    graphInfo.textContent =
                        "Net Work vs Time";

                }
                else {

                    graphInfo.textContent =
                        "Velocity vs Time";

                }


                drawGraph();

            }
        );

    }
);


// ========================================
// INPUT EVENTS
// ========================================

const inputs = [

    massInput,

    initialVelocityInput,

    forceInput,

    angleInput,

    frictionInput,

    targetDistanceInput

];


inputs.forEach(
    function(input) {

        input.addEventListener(
            "input",
            function() {

                if (!running) {

                    readInputs();

                    updateInputDisplays();

                    resetSimulation();

                }

            }
        );

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


saveButton.addEventListener(
    "click",
    saveHistory
);


// ========================================
// INITIALIZE
// ========================================

readInputs();

updateInputDisplays();

resetSimulation();