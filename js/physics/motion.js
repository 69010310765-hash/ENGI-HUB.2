// ========================================
// MOTION LABORATORY
// 1D KINEMATICS SIMULATION
// ========================================


// ========================================
// ELEMENTS
// ========================================

const canvas =
    document.getElementById("simulationCanvas");

const ctx =
    canvas.getContext("2d");


const graphCanvas =
    document.getElementById("graphCanvas");

const graphCtx =
    graphCanvas.getContext("2d");


const motionType =
    document.getElementById("motionType");

const initialPositionInput =
    document.getElementById("initialPosition");

const initialVelocityInput =
    document.getElementById("initialVelocity");

const accelerationInput =
    document.getElementById("acceleration");

const simulationTimeInput =
    document.getElementById("simulationTime");


const initialPositionValue =
    document.getElementById(
        "initialPositionValue"
    );

const initialVelocityValue =
    document.getElementById(
        "initialVelocityValue"
    );

const accelerationValue =
    document.getElementById(
        "accelerationValue"
    );

const simulationTimeValue =
    document.getElementById(
        "simulationTimeValue"
    );


const startButton =
    document.getElementById("startButton");

const pauseButton =
    document.getElementById("pauseButton");

const resumeButton =
    document.getElementById("resumeButton");

const resetButton =
    document.getElementById("resetButton");

const saveButton =
    document.getElementById("saveButton");


const statusDot =
    document.getElementById("statusDot");

const statusText =
    document.getElementById("statusText");


const realtimeTime =
    document.getElementById("realtimeTime");

const realtimePosition =
    document.getElementById(
        "realtimePosition"
    );

const realtimeVelocity =
    document.getElementById(
        "realtimeVelocity"
    );

const realtimeAcceleration =
    document.getElementById(
        "realtimeAcceleration"
    );


const finalPositionResult =
    document.getElementById(
        "finalPositionResult"
    );

const finalVelocityResult =
    document.getElementById(
        "finalVelocityResult"
    );

const finalAccelerationResult =
    document.getElementById(
        "finalAccelerationResult"
    );


const graphButtons =
    document.querySelectorAll(
        ".graph-button"
    );


// ========================================
// STATE
// ========================================

let initialPosition = 0;

let initialVelocity = 5;

let acceleration = 0;

let simulationDuration = 10;


let simulationTime = 0;

let position = 0;

let velocity = 5;


let running = false;

let paused = false;

let finished = false;


let animationFrame = null;

let lastTimestamp = null;


let graphMode = "position";


let dataPoints = [];


// ========================================
// FORMAT
// ========================================

function formatNumber(value) {

    return Number(value).toFixed(2);

}


// ========================================
// INPUT VALUES
// ========================================

function updateInputDisplays() {

    initialPosition =
        Number(
            initialPositionInput.value
        );

    initialVelocity =
        Number(
            initialVelocityInput.value
        );

    acceleration =
        Number(
            accelerationInput.value
        );

    simulationDuration =
        Number(
            simulationTimeInput.value
        );


    initialPositionValue.textContent =
        formatNumber(initialPosition) +
        " m";


    initialVelocityValue.textContent =
        formatNumber(initialVelocity) +
        " m/s";


    accelerationValue.textContent =
        formatNumber(acceleration) +
        " m/s²";


    simulationTimeValue.textContent =
        simulationDuration +
        " s";

}


// ========================================
// PHYSICS
// ========================================

function calculateState(time) {

    let currentPosition;

    let currentVelocity;


    if (
        motionType.value ===
        "uniform"
    ) {

        currentVelocity =
            initialVelocity;

        currentPosition =
            initialPosition +
            initialVelocity *
            time;

    } else {

        currentVelocity =
            initialVelocity +
            acceleration *
            time;

        currentPosition =
            initialPosition +
            initialVelocity *
            time +
            0.5 *
            acceleration *
            time *
            time;

    }


    return {

        position:
            currentPosition,

        velocity:
            currentVelocity,

        acceleration:
            motionType.value ===
            "uniform"
                ? 0
                : acceleration

    };

}


// ========================================
// STATUS
// ========================================

function setStatus(
    text,
    state
) {

    statusText.textContent =
        text;

    statusDot.className =
        "status-dot " +
        state;

}


// ========================================
// UPDATE REALTIME
// ========================================

function updateRealtime() {

    realtimeTime.textContent =
        formatNumber(simulationTime) +
        " s";


    realtimePosition.textContent =
        formatNumber(position) +
        " m";


    realtimeVelocity.textContent =
        formatNumber(velocity) +
        " m/s";


    const currentAcceleration =
        motionType.value ===
        "uniform"
            ? 0
            : acceleration;


    realtimeAcceleration.textContent =
        formatNumber(
            currentAcceleration
        ) +
        " m/s²";

}


// ========================================
// UPDATE RESULTS
// ========================================

function updateResults() {

    const state =
        calculateState(
            simulationTime
        );


    finalPositionResult.textContent =
        formatNumber(
            state.position
        ) +
        " m";


    finalVelocityResult.textContent =
        formatNumber(
            state.velocity
        ) +
        " m/s";


    finalAccelerationResult.textContent =
        formatNumber(
            state.acceleration
        ) +
        " m/s²";

}


// ========================================
// GRAPH DATA
// ========================================

function addDataPoint() {

    const state =
        calculateState(
            simulationTime
        );


    dataPoints.push({

        time:
            simulationTime,

        position:
            state.position,

        velocity:
            state.velocity,

        acceleration:
            state.acceleration

    });


    if (dataPoints.length > 1000) {

        dataPoints.shift();

    }

}


// ========================================
// DRAW SIMULATION
// ========================================

function drawSimulation() {

    const width =
        canvas.width;

    const height =
        canvas.height;


    ctx.clearRect(
        0,
        0,
        width,
        height
    );


    // SKY

    const skyGradient =
        ctx.createLinearGradient(
            0,
            0,
            0,
            height
        );


    skyGradient.addColorStop(
        0,
        "#dbeafe"
    );

    skyGradient.addColorStop(
        1,
        "#f8fafc"
    );


    ctx.fillStyle =
        skyGradient;

    ctx.fillRect(
        0,
        0,
        width,
        height
    );


    // GROUND

    const groundY =
        height * 0.72;


    ctx.fillStyle =
        "#94a3b8";

    ctx.fillRect(
        50,
        groundY,
        width - 100,
        5
    );


    // ROAD MARKINGS

    ctx.strokeStyle =
        "#cbd5e1";

    ctx.lineWidth = 2;

    ctx.setLineDash([
        12,
        10
    ]);


    ctx.beginPath();

    ctx.moveTo(
        50,
        groundY + 35
    );

    ctx.lineTo(
        width - 50,
        groundY + 35
    );

    ctx.stroke();

    ctx.setLineDash([]);


    // POSITION RANGE

    const maxPosition =
        Math.max(
            20,
            Math.abs(initialPosition) + 20,
            Math.abs(
                calculateState(
                    simulationDuration
                ).position
            ) + 5
        );


    const minPosition =
        Math.min(
            0,
            calculateState(
                simulationDuration
            ).position - 5
        );


    const range =
        Math.max(
            1,
            maxPosition -
            minPosition
        );


    let objectX =
        70 +
        (
            position -
            minPosition
        ) /
        range *
        (
            width -
            140
        );


    objectX =
        Math.max(
            55,
            Math.min(
                width - 55,
                objectX
            )
        );


    // DISTANCE MARKERS

    ctx.fillStyle =
        "#64748b";

    ctx.font =
        "13px Arial";

    ctx.textAlign =
        "center";


    for (
        let i = 0;
        i <= 5;
        i++
    ) {

        const ratio =
            i / 5;

        const x =
            70 +
            ratio *
            (
                width -
                140
            );


        const value =
            minPosition +
            ratio *
            range;


        ctx.beginPath();

        ctx.moveTo(
            x,
            groundY - 6
        );

        ctx.lineTo(
            x,
            groundY + 6
        );

        ctx.strokeStyle =
            "#94a3b8";

        ctx.stroke();


        ctx.fillText(
            formatNumber(value) +
            " m",
            x,
            groundY + 55
        );

    }


    // OBJECT SHADOW

    ctx.beginPath();

    ctx.ellipse(
        objectX,
        groundY - 4,
        25,
        6,
        0,
        0,
        Math.PI * 2
    );

    ctx.fillStyle =
        "rgba(15,23,42,0.18)";

    ctx.fill();


    // OBJECT

    ctx.beginPath();

    ctx.arc(
        objectX,
        groundY - 35,
        25,
        0,
        Math.PI * 2
    );


    ctx.fillStyle =
        "#2563eb";

    ctx.fill();


    ctx.strokeStyle =
        "#1e3a8a";

    ctx.lineWidth = 3;

    ctx.stroke();


    // MOTION ARROW

    if (
        Math.abs(velocity) >
        0.01
    ) {

        const direction =
            velocity >= 0
                ? 1
                : -1;


        const arrowLength =
            Math.min(
                90,
                30 +
                Math.abs(
                    velocity
                ) * 4
            );


        const startX =
            objectX;


        const endX =
            objectX +
            direction *
            arrowLength;


        ctx.strokeStyle =
            "#ef4444";

        ctx.fillStyle =
            "#ef4444";

        ctx.lineWidth = 4;


        ctx.beginPath();

        ctx.moveTo(
            startX,
            groundY - 35
        );

        ctx.lineTo(
            endX,
            groundY - 35
        );

        ctx.stroke();


        ctx.beginPath();

        ctx.moveTo(
            endX,
            groundY - 35
        );

        ctx.lineTo(
            endX -
            direction * 12,
            groundY - 44
        );

        ctx.lineTo(
            endX -
            direction * 12,
            groundY - 26
        );

        ctx.closePath();

        ctx.fill();

    }


    // OBJECT LABEL

    ctx.fillStyle =
        "#0f172a";

    ctx.font =
        "bold 15px Arial";

    ctx.textAlign =
        "center";


    ctx.fillText(
        "Object",
        objectX,
        groundY - 72
    );


    // TITLE

    ctx.fillStyle =
        "#334155";

    ctx.font =
        "bold 17px Arial";

    ctx.textAlign =
        "left";


    ctx.fillText(
        motionType.value ===
        "uniform"
            ? "Uniform Motion"
            : "Uniformly Accelerated Motion",
        30,
        35
    );

}


// ========================================
// DRAW GRAPH
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
        "#f8fafc";

    graphCtx.fillRect(
        0,
        0,
        width,
        height
    );


    if (
        dataPoints.length < 2
    ) {

        graphCtx.fillStyle =
            "#94a3b8";

        graphCtx.font =
            "18px Arial";

        graphCtx.textAlign =
            "center";

        graphCtx.fillText(
            "กด Start เพื่อเริ่มเก็บข้อมูล",
            width / 2,
            height / 2
        );

        return;

    }


    let values =
        dataPoints.map(
            point =>
                point[graphMode]
        );


    let minValue =
        Math.min(
            ...values
        );


    let maxValue =
        Math.max(
            ...values
        );


    if (
        Math.abs(
            maxValue -
            minValue
        ) < 0.001
    ) {

        minValue -= 1;

        maxValue += 1;

    }


    const paddingLeft = 70;

    const paddingRight = 25;

    const paddingTop = 35;

    const paddingBottom = 50;


    const graphWidth =
        width -
        paddingLeft -
        paddingRight;

    const graphHeight =
        height -
        paddingTop -
        paddingBottom;


    // GRID

    graphCtx.strokeStyle =
        "#e2e8f0";

    graphCtx.lineWidth = 1;


    for (
        let i = 0;
        i <= 5;
        i++
    ) {

        const y =
            paddingTop +
            (
                i / 5
            ) *
            graphHeight;


        graphCtx.beginPath();

        graphCtx.moveTo(
            paddingLeft,
            y
        );

        graphCtx.lineTo(
            width -
            paddingRight,
            y
        );

        graphCtx.stroke();

    }


    for (
        let i = 0;
        i <= 5;
        i++
    ) {

        const x =
            paddingLeft +
            (
                i / 5
            ) *
            graphWidth;


        graphCtx.beginPath();

        graphCtx.moveTo(
            x,
            paddingTop
        );

        graphCtx.lineTo(
            x,
            height -
            paddingBottom
        );

        graphCtx.stroke();

    }


    // AXIS LABELS

    graphCtx.fillStyle =
        "#64748b";

    graphCtx.font =
        "12px Arial";

    graphCtx.textAlign =
        "center";


    graphCtx.fillText(
        "Time (s)",
        width / 2,
        height - 12
    );


    graphCtx.save();

    graphCtx.translate(
        18,
        height / 2
    );

    graphCtx.rotate(
        -Math.PI / 2
    );


    let yLabel =
        "Position (m)";


    if (
        graphMode ===
        "velocity"
    ) {

        yLabel =
            "Velocity (m/s)";

    }


    if (
        graphMode ===
        "acceleration"
    ) {

        yLabel =
            "Acceleration (m/s²)";

    }


    graphCtx.fillText(
        yLabel,
        0,
        0
    );


    graphCtx.restore();


    // DATA LINE

    graphCtx.beginPath();


    dataPoints.forEach(
        (point, index) => {

            const x =
                paddingLeft +
                (
                    point.time /
                    simulationDuration
                ) *
                graphWidth;


            const y =
                paddingTop +
                (
                    1 -
                    (
                        point[graphMode] -
                        minValue
                    ) /
                    (
                        maxValue -
                        minValue
                    )
                ) *
                graphHeight;


            if (index === 0) {

                graphCtx.moveTo(
                    x,
                    y
                );

            } else {

                graphCtx.lineTo(
                    x,
                    y
                );

            }

        }
    );


    graphCtx.strokeStyle =
        "#2563eb";

    graphCtx.lineWidth = 3;

    graphCtx.stroke();


    // START POINT

    const first =
        dataPoints[0];


    const firstX =
        paddingLeft;


    const firstY =
        paddingTop +
        (
            1 -
            (
                first[graphMode] -
                minValue
            ) /
            (
                maxValue -
                minValue
            )
        ) *
        graphHeight;


    graphCtx.beginPath();

    graphCtx.arc(
        firstX,
        firstY,
        5,
        0,
        Math.PI * 2
    );

    graphCtx.fillStyle =
        "#16a34a";

    graphCtx.fill();


    // END POINT

    const last =
        dataPoints[
            dataPoints.length - 1
        ];


    const lastX =
        paddingLeft +
        (
            last.time /
            simulationDuration
        ) *
        graphWidth;


    const lastY =
        paddingTop +
        (
            1 -
            (
                last[graphMode] -
                minValue
            ) /
            (
                maxValue -
                minValue
            )
        ) *
        graphHeight;


    graphCtx.beginPath();

    graphCtx.arc(
        lastX,
        lastY,
        5,
        0,
        Math.PI * 2
    );

    graphCtx.fillStyle =
        "#ef4444";

    graphCtx.fill();


    // MIN / MAX

    graphCtx.fillStyle =
        "#64748b";

    graphCtx.font =
        "12px Arial";

    graphCtx.textAlign =
        "right";


    graphCtx.fillText(
        formatNumber(maxValue),
        paddingLeft - 10,
        paddingTop + 5
    );


    graphCtx.fillText(
        formatNumber(minValue),
        paddingLeft - 10,
        height -
        paddingBottom
    );

}


// ========================================
// ANIMATION LOOP
// ========================================

function animate(
    timestamp
) {

    if (!running) {

        return;

    }


    if (
        paused
    ) {

        lastTimestamp =
            timestamp;

        animationFrame =
            requestAnimationFrame(
                animate
            );

        return;

    }


    if (
        lastTimestamp === null
    ) {

        lastTimestamp =
            timestamp;

    }


    let deltaTime =
        (
            timestamp -
            lastTimestamp
        ) / 1000;


    lastTimestamp =
        timestamp;


    // Prevent huge jumps

    deltaTime =
        Math.min(
            deltaTime,
            0.05
        );


    simulationTime +=
        deltaTime;


    if (
        simulationTime >=
        simulationDuration
    ) {

        simulationTime =
            simulationDuration;


        const finalState =
            calculateState(
                simulationTime
            );


        position =
            finalState.position;

        velocity =
            finalState.velocity;


        updateRealtime();

        updateResults();

        addDataPoint();

        drawSimulation();

        drawGraph();


        running =
            false;

        paused =
            false;

        finished =
            true;


        setStatus(
            "Finished",
            "finished"
        );


        return;

    }


    const state =
        calculateState(
            simulationTime
        );


    position =
        state.position;

    velocity =
        state.velocity;


    updateRealtime();

    updateResults();

    addDataPoint();

    drawSimulation();

    drawGraph();


    animationFrame =
        requestAnimationFrame(
            animate
        );

}


// ========================================
// START
// ========================================

function startSimulation() {

    cancelAnimationFrame(
        animationFrame
    );


    updateInputDisplays();


    simulationTime =
        0;


    position =
        initialPosition;


    velocity =
        initialVelocity;


    dataPoints =
        [];


    running =
        true;

    paused =
        false;

    finished =
        false;


    lastTimestamp =
        null;


    setStatus(
        "Running",
        "running"
    );


    addDataPoint();

    updateRealtime();

    updateResults();

    drawSimulation();

    drawGraph();


    animationFrame =
        requestAnimationFrame(
            animate
        );

}


// ========================================
// PAUSE
// ========================================

function pauseSimulation() {

    if (
        !running
    ) {

        return;

    }


    paused =
        true;


    setStatus(
        "Paused",
        "paused"
    );

}


// ========================================
// RESUME
// ========================================

function resumeSimulation() {

    if (
        !running ||
        !paused
    ) {

        return;

    }


    paused =
        false;

    lastTimestamp =
        null;


    setStatus(
        "Running",
        "running"
    );

}


// ========================================
// RESET
// ========================================

function resetSimulation() {

    cancelAnimationFrame(
        animationFrame
    );


    updateInputDisplays();


    simulationTime =
        0;


    position =
        initialPosition;


    velocity =
        initialVelocity;


    running =
        false;

    paused =
        false;

    finished =
        false;


    lastTimestamp =
        null;


    dataPoints =
        [];


    setStatus(
        "Ready",
        "stopped"
    );


    updateRealtime();

    updateResults();

    drawSimulation();

    drawGraph();

}


// ========================================
// SAVE HISTORY
// ========================================

function saveHistory() {

    const history =
        JSON.parse(
            localStorage.getItem(
                "engiHistory"
            )
        ) || [];


    const state =
        calculateState(
            simulationTime
        );


    const motionName =
        motionType.value ===
        "uniform"
            ? "Uniform Motion"
            : "Uniformly Accelerated Motion";


    const record = {

        icon: "🏃",

        title:
            "Motion Laboratory",

        calculation:
            motionName +
            " | " +
            "x₀ = " +
            formatNumber(
                initialPosition
            ) +
            " m | " +
            "v₀ = " +
            formatNumber(
                initialVelocity
            ) +
            " m/s | " +
            "a = " +
            formatNumber(
                state.acceleration
            ) +
            " m/s² | " +
            "t = " +
            formatNumber(
                simulationTime
            ) +
            " s | " +
            "x = " +
            formatNumber(
                state.position
            ) +
            " m | " +
            "v = " +
            formatNumber(
                state.velocity
            ) +
            " m/s",

        time:
            new Date().toLocaleString(
                "th-TH"
            ),

        tool:
            "Motion Laboratory",

        category:
            "Physics Simulation",

        date:
            new Date().toISOString(),

        timestamp:
            Date.now(),

        input: {

            motionType:
                motionType.value,

            initialPosition:
                Number(
                    initialPosition
                ),

            initialVelocity:
                Number(
                    initialVelocity
                ),

            acceleration:
                Number(
                    state.acceleration
                ),

            simulationDuration:
                Number(
                    simulationTime
                )

        },

        result: {

            position:
                Number(
                    state.position.toFixed(2)
                ),

            velocity:
                Number(
                    state.velocity.toFixed(2)
                ),

            acceleration:
                Number(
                    state.acceleration.toFixed(2)
                )

        }

    };


    history.unshift(
        record
    );


    if (
        history.length > 100
    ) {

        history.length = 100;

    }


    localStorage.setItem(
        "engiHistory",
        JSON.stringify(history)
    );


    setStatus(
        "Saved to History",
        "finished"
    );

}


// ========================================
// INPUT EVENTS
// ========================================

initialPositionInput.addEventListener(
    "input",
    () => {

        if (!running) {

            updateInputDisplays();

            position =
                Number(
                    initialPositionInput.value
                );

            velocity =
                Number(
                    initialVelocityInput.value
                );

            updateRealtime();

            updateResults();

            drawSimulation();

        }

    }
);


initialVelocityInput.addEventListener(
    "input",
    () => {

        if (!running) {

            updateInputDisplays();

            position =
                Number(
                    initialPositionInput.value
                );

            velocity =
                Number(
                    initialVelocityInput.value
                );

            updateRealtime();

            updateResults();

            drawSimulation();

        }

    }
);


accelerationInput.addEventListener(
    "input",
    () => {

        if (!running) {

            updateInputDisplays();

            updateResults();

            drawSimulation();

        }

    }
);


simulationTimeInput.addEventListener(
    "input",
    () => {

        if (!running) {

            updateInputDisplays();

            updateResults();

            drawSimulation();

        }

    }
);


motionType.addEventListener(
    "change",
    () => {

        if (!running) {

            updateInputDisplays();

            updateResults();

            drawSimulation();

        }

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
// GRAPH BUTTONS
// ========================================

graphButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                graphButtons.forEach(
                    item => {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                button.classList.add(
                    "active"
                );


                graphMode =
                    button.dataset.graph;


                drawGraph();

            }
        );

    }
);


// ========================================
// INITIALIZE
// ========================================

updateInputDisplays();

position =
    initialPosition;

velocity =
    initialVelocity;

updateRealtime();

updateResults();

drawSimulation();

drawGraph();