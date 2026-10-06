// ========================================
// 2D MOTION LABORATORY
// ========================================


// ========================================
// CANVAS
// ========================================

const simulationCanvas =
    document.getElementById(
        "simulationCanvas"
    );

const simulationContext =
    simulationCanvas.getContext("2d");


const graphCanvas =
    document.getElementById(
        "graphCanvas"
    );

const graphContext =
    graphCanvas.getContext("2d");


// ========================================
// INPUTS
// ========================================

const initialXInput =
    document.getElementById(
        "initialX"
    );

const initialYInput =
    document.getElementById(
        "initialY"
    );

const initialVxInput =
    document.getElementById(
        "initialVx"
    );

const initialVyInput =
    document.getElementById(
        "initialVy"
    );

const accelerationXInput =
    document.getElementById(
        "accelerationX"
    );

const accelerationYInput =
    document.getElementById(
        "accelerationY"
    );

const simulationTimeInput =
    document.getElementById(
        "simulationTime"
    );


// ========================================
// VALUE ELEMENTS
// ========================================

const initialXValue =
    document.getElementById(
        "initialXValue"
    );

const initialYValue =
    document.getElementById(
        "initialYValue"
    );

const initialVxValue =
    document.getElementById(
        "initialVxValue"
    );

const initialVyValue =
    document.getElementById(
        "initialVyValue"
    );

const accelerationXValue =
    document.getElementById(
        "accelerationXValue"
    );

const accelerationYValue =
    document.getElementById(
        "accelerationYValue"
    );

const simulationTimeValue =
    document.getElementById(
        "simulationTimeValue"
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
// REALTIME
// ========================================

const realtimeTime =
    document.getElementById(
        "realtimeTime"
    );

const realtimeX =
    document.getElementById(
        "realtimeX"
    );

const realtimeY =
    document.getElementById(
        "realtimeY"
    );

const realtimeVelocity =
    document.getElementById(
        "realtimeVelocity"
    );

const realtimeAcceleration =
    document.getElementById(
        "realtimeAcceleration"
    );


// ========================================
// RESULTS
// ========================================

const distanceResult =
    document.getElementById(
        "distanceResult"
    );

const finalVelocityResult =
    document.getElementById(
        "finalVelocityResult"
    );

const finalVxResult =
    document.getElementById(
        "finalVxResult"
    );

const finalVyResult =
    document.getElementById(
        "finalVyResult"
    );

const resultAcceleration =
    document.getElementById(
        "resultAcceleration"
    );

const velocityAngleResult =
    document.getElementById(
        "velocityAngleResult"
    );


// ========================================
// GRAPH
// ========================================

const graphButtons =
    document.querySelectorAll(
        ".graph-button"
    );

const graphCurrentTitle =
    document.getElementById(
        "graphCurrentTitle"
    );

const graphCurrentValue =
    document.getElementById(
        "graphCurrentValue"
    );


// ========================================
// STATE
// ========================================

let initialX =
    Number(initialXInput.value);

let initialY =
    Number(initialYInput.value);

let initialVx =
    Number(initialVxInput.value);

let initialVy =
    Number(initialVyInput.value);

let accelerationX =
    Number(accelerationXInput.value);

let accelerationY =
    Number(accelerationYInput.value);

let simulationDuration =
    Number(simulationTimeInput.value);


let elapsedTime = 0;

let running = false;

let paused = false;

let animationFrame = null;

let lastTimestamp = null;

let selectedGraph = "x";


// ========================================
// CURRENT STATE
// ========================================

let currentX = initialX;

let currentY = initialY;

let currentVx = initialVx;

let currentVy = initialVy;


// ========================================
// GRAPH DATA
// ========================================

let graphData = [];


// ========================================
// FORMAT NUMBER
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

    initialX =
        Number(initialXInput.value);

    initialY =
        Number(initialYInput.value);

    initialVx =
        Number(initialVxInput.value);

    initialVy =
        Number(initialVyInput.value);

    accelerationX =
        Number(
            accelerationXInput.value
        );

    accelerationY =
        Number(
            accelerationYInput.value
        );

    simulationDuration =
        Number(
            simulationTimeInput.value
        );

}


// ========================================
// UPDATE INPUT DISPLAYS
// ========================================

function updateInputDisplays() {

    readInputs();


    initialXValue.textContent =
        formatNumber(initialX) +
        " m";


    initialYValue.textContent =
        formatNumber(initialY) +
        " m";


    initialVxValue.textContent =
        formatNumber(initialVx) +
        " m/s";


    initialVyValue.textContent =
        formatNumber(initialVy) +
        " m/s";


    accelerationXValue.textContent =
        formatNumber(accelerationX) +
        " m/s²";


    accelerationYValue.textContent =
        formatNumber(accelerationY) +
        " m/s²";


    simulationTimeValue.textContent =
        simulationDuration +
        " s";


    if (!running) {

        resetCurrentState();

    }

}


// ========================================
// RESET CURRENT STATE
// ========================================

function resetCurrentState() {

    elapsedTime = 0;

    currentX = initialX;

    currentY = initialY;

    currentVx = initialVx;

    currentVy = initialVy;


    graphData = [];


    updateRealtime();

    updateResults();

    drawSimulation();

    drawGraph();

}


// ========================================
// CALCULATE STATE
// ========================================

function calculateState(time) {

    const safeTime =
        Math.max(
            0,
            time
        );


    const x =
        initialX +
        initialVx * safeTime +
        0.5 *
        accelerationX *
        safeTime *
        safeTime;


    const y =
        initialY +
        initialVy * safeTime +
        0.5 *
        accelerationY *
        safeTime *
        safeTime;


    const vx =
        initialVx +
        accelerationX *
        safeTime;


    const vy =
        initialVy +
        accelerationY *
        safeTime;


    const speed =
        Math.sqrt(
            vx * vx +
            vy * vy
        );


    const acceleration =
        Math.sqrt(
            accelerationX *
            accelerationX +
            accelerationY *
            accelerationY
        );


    let angle = 0;


    if (
        Math.abs(vx) > 0.000001 ||
        Math.abs(vy) > 0.000001
    ) {

        angle =
            Math.atan2(
                vy,
                vx
            ) *
            180 /
            Math.PI;

    }


    return {

        x,
        y,
        vx,
        vy,
        speed,
        acceleration,
        angle

    };

}


// ========================================
// UPDATE REALTIME
// ========================================

function updateRealtime() {

    const state =
        calculateState(
            elapsedTime
        );


    currentX = state.x;

    currentY = state.y;

    currentVx = state.vx;

    currentVy = state.vy;


    realtimeTime.textContent =
        formatNumber(
            elapsedTime
        ) +
        " s";


    realtimeX.textContent =
        formatNumber(
            state.x
        ) +
        " m";


    realtimeY.textContent =
        formatNumber(
            state.y
        ) +
        " m";


    realtimeVelocity.textContent =
        formatNumber(
            state.speed
        ) +
        " m/s";


    realtimeAcceleration.textContent =
        formatNumber(
            state.acceleration
        ) +
        " m/s²";


    updateGraphCurrentValue();

}


// ========================================
// UPDATE RESULTS
// ========================================

function updateResults() {

    const state =
        calculateState(
            elapsedTime
        );


    const dx =
        state.x -
        initialX;

    const dy =
        state.y -
        initialY;


    const distance =
        Math.sqrt(
            dx * dx +
            dy * dy
        );


    distanceResult.textContent =
        formatNumber(
            distance
        ) +
        " m";


    finalVelocityResult.textContent =
        formatNumber(
            state.speed
        ) +
        " m/s";


    finalVxResult.textContent =
        formatNumber(
            state.vx
        ) +
        " m/s";


    finalVyResult.textContent =
        formatNumber(
            state.vy
        ) +
        " m/s";


    resultAcceleration.textContent =
        formatNumber(
            state.acceleration
        ) +
        " m/s²";


    velocityAngleResult.textContent =
        formatNumber(
            state.angle
        ) +
        "°";

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


    if (state === "running") {

        statusDot.style.background =
            "#22c55e";

    }
    else if (state === "paused") {

        statusDot.style.background =
            "#f59e0b";

    }
    else if (state === "complete") {

        statusDot.style.background =
            "#3b82f6";

    }
    else {

        statusDot.style.background =
            "#64748b";

    }

}


// ========================================
// DRAW SIMULATION
// ========================================

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


    // ------------------------------------
    // BACKGROUND
    // ------------------------------------

    const background =
        simulationContext.createLinearGradient(
            0,
            0,
            0,
            height
        );

    background.addColorStop(
        0,
        "#0f172a"
    );

    background.addColorStop(
        1,
        "#020617"
    );


    simulationContext.fillStyle =
        background;

    simulationContext.fillRect(
        0,
        0,
        width,
        height
    );


    // ------------------------------------
    // FIND VIEW RANGE
    // ------------------------------------

    const positions = [
        initialX,
        initialY,
        currentX,
        currentY
    ];


    const maxCoordinate =
        Math.max(
            10,
            ...positions.map(
                function(value) {
                    return Math.abs(value);
                }
            )
        );


    const scale =
        Math.min(
            width,
            height
        ) *
        0.38 /
        maxCoordinate;


    const centerX =
        width * 0.5;

    const centerY =
        height * 0.55;


    // ------------------------------------
    // GRID
    // ------------------------------------

    const gridSize =
        1 * scale;


    simulationContext.strokeStyle =
        "#1e293b";

    simulationContext.lineWidth = 1;


    for (
        let x = centerX % gridSize;
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
        let y = centerY % gridSize;
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


    // ------------------------------------
    // AXES
    // ------------------------------------

    simulationContext.strokeStyle =
        "#64748b";

    simulationContext.lineWidth = 2;


    simulationContext.beginPath();

    simulationContext.moveTo(
        0,
        centerY
    );

    simulationContext.lineTo(
        width,
        centerY
    );

    simulationContext.stroke();


    simulationContext.beginPath();

    simulationContext.moveTo(
        centerX,
        0
    );

    simulationContext.lineTo(
        centerX,
        height
    );

    simulationContext.stroke();


    // ------------------------------------
    // CONVERT COORDINATES
    // ------------------------------------

    function toCanvasX(x) {

        return centerX +
            x * scale;

    }


    function toCanvasY(y) {

        return centerY -
            y * scale;

    }


    const startCanvasX =
        toCanvasX(initialX);

    const startCanvasY =
        toCanvasY(initialY);


    const objectCanvasX =
        toCanvasX(currentX);

    const objectCanvasY =
        toCanvasY(currentY);


    // ------------------------------------
    // PATH
    // ------------------------------------

    if (graphData.length > 1) {

        simulationContext.beginPath();


        graphData.forEach(
            function(point, index) {

                const px =
                    toCanvasX(point.x);

                const py =
                    toCanvasY(point.y);


                if (index === 0) {

                    simulationContext.moveTo(
                        px,
                        py
                    );

                }
                else {

                    simulationContext.lineTo(
                        px,
                        py
                    );

                }

            }
        );


        simulationContext.strokeStyle =
            "#38bdf8";

        simulationContext.lineWidth = 3;

        simulationContext.stroke();

    }


    // ------------------------------------
    // START POINT
    // ------------------------------------

    simulationContext.beginPath();

    simulationContext.arc(
        startCanvasX,
        startCanvasY,
        7,
        0,
        Math.PI * 2
    );

    simulationContext.fillStyle =
        "#94a3b8";

    simulationContext.fill();


    simulationContext.font =
        "13px Arial";

    simulationContext.fillStyle =
        "#cbd5e1";

    simulationContext.fillText(
        "Start",
        startCanvasX + 10,
        startCanvasY - 10
    );


    // ------------------------------------
    // VELOCITY VECTOR
    // ------------------------------------

    const velocityScale = 7;


    const velocityEndX =
        objectCanvasX +
        currentVx *
        velocityScale;

    const velocityEndY =
        objectCanvasY -
        currentVy *
        velocityScale;


    drawArrow(
        objectCanvasX,
        objectCanvasY,
        velocityEndX,
        velocityEndY,
        "#f59e0b"
    );


    // ------------------------------------
    // ACCELERATION VECTOR
    // ------------------------------------

    const accelerationScale = 12;


    const accelerationEndX =
        objectCanvasX +
        accelerationX *
        accelerationScale;

    const accelerationEndY =
        objectCanvasY -
        accelerationY *
        accelerationScale;


    if (
        Math.abs(accelerationX) > 0.01 ||
        Math.abs(accelerationY) > 0.01
    ) {

        drawArrow(
            objectCanvasX,
            objectCanvasY,
            accelerationEndX,
            accelerationEndY,
            "#ef4444"
        );

    }


    // ------------------------------------
    // OBJECT
    // ------------------------------------

    simulationContext.beginPath();

    simulationContext.arc(
        objectCanvasX,
        objectCanvasY,
        15,
        0,
        Math.PI * 2
    );

    simulationContext.fillStyle =
        "#22c55e";

    simulationContext.fill();

    simulationContext.strokeStyle =
        "#bbf7d0";

    simulationContext.lineWidth = 3;

    simulationContext.stroke();


    // ------------------------------------
    // LABEL
    // ------------------------------------

    simulationContext.font =
        "bold 16px Arial";

    simulationContext.fillStyle =
        "#f8fafc";

    simulationContext.fillText(
        "Object",
        objectCanvasX + 20,
        objectCanvasY - 15
    );


    // ------------------------------------
    // AXIS LABELS
    // ------------------------------------

    simulationContext.font =
        "bold 16px Arial";

    simulationContext.fillStyle =
        "#94a3b8";

    simulationContext.fillText(
        "X",
        width - 25,
        centerY - 10
    );

    simulationContext.fillText(
        "Y",
        centerX + 10,
        25
    );


    // ------------------------------------
    // TITLE
    // ------------------------------------

    simulationContext.font =
        "bold 20px Arial";

    simulationContext.fillStyle =
        "#f8fafc";

    simulationContext.fillText(
        "2D Motion",
        25,
        35
    );


    simulationContext.font =
        "13px Arial";

    simulationContext.fillStyle =
        "#94a3b8";

    simulationContext.fillText(
        "X-Y Coordinate System",
        25,
        57
    );


    // ------------------------------------
    // LEGEND
    // ------------------------------------

    drawLegend(
        25,
        height - 65,
        "#38bdf8",
        "Trajectory"
    );

    drawLegend(
        140,
        height - 65,
        "#f59e0b",
        "Velocity"
    );

    drawLegend(
        235,
        height - 65,
        "#ef4444",
        "Acceleration"
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
        color;

    simulationContext.lineWidth = 4;

    simulationContext.stroke();


    const angle =
        Math.atan2(
            endY - startY,
            endX - startX
        );


    const arrowSize = 10;


    simulationContext.beginPath();

    simulationContext.moveTo(
        endX,
        endY
    );

    simulationContext.lineTo(
        endX -
        arrowSize *
        Math.cos(
            angle - Math.PI / 6
        ),
        endY -
        arrowSize *
        Math.sin(
            angle - Math.PI / 6
        )
    );

    simulationContext.lineTo(
        endX -
        arrowSize *
        Math.cos(
            angle + Math.PI / 6
        ),
        endY -
        arrowSize *
        Math.sin(
            angle + Math.PI / 6
        )
    );

    simulationContext.closePath();

    simulationContext.fillStyle =
        color;

    simulationContext.fill();

}


// ========================================
// DRAW LEGEND
// ========================================

function drawLegend(
    x,
    y,
    color,
    text
) {

    simulationContext.fillStyle =
        color;

    simulationContext.fillRect(
        x,
        y - 11,
        14,
        14
    );


    simulationContext.fillStyle =
        "#cbd5e1";

    simulationContext.font =
        "13px Arial";

    simulationContext.fillText(
        text,
        x + 20,
        y
    );

}


// ========================================
// GRAPH VALUE
// ========================================

function updateGraphCurrentValue() {

    const state =
        calculateState(
            elapsedTime
        );


    if (selectedGraph === "x") {

        graphCurrentTitle.textContent =
            "Position X";

        graphCurrentValue.textContent =
            formatNumber(
                state.x
            ) +
            " m";

    }
    else if (
        selectedGraph === "y"
    ) {

        graphCurrentTitle.textContent =
            "Position Y";

        graphCurrentValue.textContent =
            formatNumber(
                state.y
            ) +
            " m";

    }
    else if (
        selectedGraph === "velocity"
    ) {

        graphCurrentTitle.textContent =
            "Velocity";

        graphCurrentValue.textContent =
            formatNumber(
                state.speed
            ) +
            " m/s";

    }
    else {

        graphCurrentTitle.textContent =
            "Acceleration";

        graphCurrentValue.textContent =
            formatNumber(
                state.acceleration
            ) +
            " m/s²";

    }

}


// ========================================
// DRAW GRAPH
// ========================================

function drawGraph() {

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


    const dark =
        document.body.classList.contains(
            "dark-mode"
        );


    graphContext.fillStyle =
        dark
            ? "#111827"
            : "#f8fafc";

    graphContext.fillRect(
        0,
        0,
        width,
        height
    );


    if (graphData.length < 2) {

        graphContext.fillStyle =
            "#64748b";

        graphContext.font =
            "16px Arial";

        graphContext.textAlign =
            "center";

        graphContext.fillText(
            "กด Start เพื่อเริ่มสร้างกราฟ",
            width / 2,
            height / 2
        );

        graphContext.textAlign =
            "left";

        return;

    }


    // ------------------------------------
    // VALUES
    // ------------------------------------

    const values =
        graphData.map(
            function(point) {

                if (
                    selectedGraph === "x"
                ) {

                    return point.x;

                }

                if (
                    selectedGraph === "y"
                ) {

                    return point.y;

                }

                if (
                    selectedGraph ===
                    "velocity"
                ) {

                    return point.speed;

                }

                return point.acceleration;

            }
        );


    let minValue =
        Math.min(...values);

    let maxValue =
        Math.max(...values);


    if (
        Math.abs(
            maxValue - minValue
        ) < 0.0001
    ) {

        minValue -= 1;

        maxValue += 1;

    }


    const paddingLeft = 65;

    const paddingRight = 25;

    const paddingTop = 25;

    const paddingBottom = 45;


    const plotWidth =
        width -
        paddingLeft -
        paddingRight;

    const plotHeight =
        height -
        paddingTop -
        paddingBottom;


    // ------------------------------------
    // GRID
    // ------------------------------------

    graphContext.strokeStyle =
        dark
            ? "#1e293b"
            : "#e2e8f0";

    graphContext.lineWidth = 1;


    for (
        let i = 0;
        i <= 5;
        i++
    ) {

        const y =
            paddingTop +
            plotHeight *
            i /
            5;


        graphContext.beginPath();

        graphContext.moveTo(
            paddingLeft,
            y
        );

        graphContext.lineTo(
            width - paddingRight,
            y
        );

        graphContext.stroke();

    }


    for (
        let i = 0;
        i <= 5;
        i++
    ) {

        const x =
            paddingLeft +
            plotWidth *
            i /
            5;


        graphContext.beginPath();

        graphContext.moveTo(
            x,
            paddingTop
        );

        graphContext.lineTo(
            x,
            height - paddingBottom
        );

        graphContext.stroke();

    }


    // ------------------------------------
    // LINE
    // ------------------------------------

    graphContext.beginPath();


    graphData.forEach(
        function(point, index) {

            const x =
                paddingLeft +
                (
                    point.time /
                    Math.max(
                        simulationDuration,
                        0.001
                    )
                ) *
                plotWidth;


            let value;


            if (
                selectedGraph === "x"
            ) {

                value = point.x;

            }
            else if (
                selectedGraph === "y"
            ) {

                value = point.y;

            }
            else if (
                selectedGraph ===
                "velocity"
            ) {

                value = point.speed;

            }
            else {

                value =
                    point.acceleration;

            }


            const y =
                height -
                paddingBottom -
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


    graphContext.strokeStyle =
        "#2563eb";

    graphContext.lineWidth = 3;

    graphContext.stroke();


    // ------------------------------------
    // AXIS
    // ------------------------------------

    graphContext.strokeStyle =
        "#64748b";

    graphContext.lineWidth = 2;


    graphContext.beginPath();

    graphContext.moveTo(
        paddingLeft,
        paddingTop
    );

    graphContext.lineTo(
        paddingLeft,
        height - paddingBottom
    );

    graphContext.lineTo(
        width - paddingRight,
        height - paddingBottom
    );

    graphContext.stroke();


    // ------------------------------------
    // LABEL
    // ------------------------------------

    graphContext.fillStyle =
        dark
            ? "#94a3b8"
            : "#64748b";

    graphContext.font =
        "12px Arial";


    graphContext.fillText(
        "0 s",
        paddingLeft,
        height - 15
    );


    graphContext.fillText(
        simulationDuration +
        " s",
        width - 65,
        height - 15
    );


    let yLabel =
        "Value";


    if (
        selectedGraph === "x"
    ) {

        yLabel =
            "X (m)";

    }
    else if (
        selectedGraph === "y"
    ) {

        yLabel =
            "Y (m)";

    }
    else if (
        selectedGraph ===
        "velocity"
    ) {

        yLabel =
            "Velocity (m/s)";

    }
    else {

        yLabel =
            "Acceleration (m/s²)";

    }


    graphContext.save();

    graphContext.translate(
        18,
        height / 2
    );

    graphContext.rotate(
        -Math.PI / 2
    );

    graphContext.fillText(
        yLabel,
        0,
        0
    );

    graphContext.restore();

}


// ========================================
// START
// ========================================

function startSimulation() {

    readInputs();


    elapsedTime = 0;

    running = true;

    paused = false;

    lastTimestamp = null;

    graphData = [];


    setStatus(
        "กำลังจำลองการเคลื่อนที่",
        "running"
    );


    updateRealtime();

    updateResults();

    drawSimulation();

    drawGraph();


    if (
        animationFrame !== null
    ) {

        cancelAnimationFrame(
            animationFrame
        );

    }


    animationFrame =
        requestAnimationFrame(
            animate
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
        "paused"
    );


    if (
        animationFrame !== null
    ) {

        cancelAnimationFrame(
            animationFrame
        );

        animationFrame = null;

    }

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
        "กำลังจำลองการเคลื่อนที่",
        "running"
    );


    animationFrame =
        requestAnimationFrame(
            animate
        );

}


// ========================================
// RESET
// ========================================

function resetSimulation() {

    running = false;

    paused = false;

    lastTimestamp = null;


    if (
        animationFrame !== null
    ) {

        cancelAnimationFrame(
            animationFrame
        );

        animationFrame = null;

    }


    resetCurrentState();


    setStatus(
        "พร้อมเริ่มการทดลอง",
        "idle"
    );

}


// ========================================
// ANIMATION
// ========================================

function animate(timestamp) {

    if (
        !running ||
        paused
    ) {

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


    if (
        !Number.isFinite(deltaTime) ||
        deltaTime < 0
    ) {

        deltaTime = 0;

    }


    deltaTime =
        Math.min(
            deltaTime,
            0.05
        );


    elapsedTime +=
        deltaTime;


    if (
        elapsedTime >
        simulationDuration
    ) {

        elapsedTime =
            simulationDuration;

    }


    const state =
        calculateState(
            elapsedTime
        );


    graphData.push({

        time:
            elapsedTime,

        x:
            state.x,

        y:
            state.y,

        speed:
            state.speed,

        acceleration:
            state.acceleration

    });


    if (
        graphData.length >
        1200
    ) {

        graphData.shift();

    }


    updateRealtime();

    updateResults();

    drawSimulation();

    drawGraph();


    if (
        elapsedTime >=
        simulationDuration
    ) {

        running = false;

        paused = false;

        animationFrame = null;


        setStatus(
            "การทดลองเสร็จสิ้น",
            "complete"
        );


        return;

    }


    animationFrame =
        requestAnimationFrame(
            animate
        );

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


    const historyItem = {

        icon: "🎯",

        title:
            "2D Motion Laboratory",

        calculation:
            "x₀ = " +
            formatNumber(initialX) +
            " m | " +

            "y₀ = " +
            formatNumber(initialY) +
            " m | " +

            "V₀ = (" +
            formatNumber(initialVx) +
            ", " +
            formatNumber(initialVy) +
            ") m/s | " +

            "a = (" +
            formatNumber(accelerationX) +
            ", " +
            formatNumber(accelerationY) +
            ") m/s² | " +

            "x = " +
            formatNumber(state.x) +
            " m | " +

            "y = " +
            formatNumber(state.y) +
            " m",

        time:
            new Date().toLocaleString(
                "th-TH"
            ),

        tool:
            "2D Motion Laboratory",

        category:
            "Physics Simulation",

        date:
            new Date().toISOString(),

        timestamp:
            Date.now(),

        input: {

            initialX:
                Number(
                    initialX.toFixed(2)
                ),

            initialY:
                Number(
                    initialY.toFixed(2)
                ),

            initialVx:
                Number(
                    initialVx.toFixed(2)
                ),

            initialVy:
                Number(
                    initialVy.toFixed(2)
                ),

            accelerationX:
                Number(
                    accelerationX.toFixed(2)
                ),

            accelerationY:
                Number(
                    accelerationY.toFixed(2)
                ),

            simulationDuration:
                Number(
                    simulationDuration
                )

        },

        result: {

            x:
                Number(
                    state.x.toFixed(2)
                ),

            y:
                Number(
                    state.y.toFixed(2)
                ),

            vx:
                Number(
                    state.vx.toFixed(2)
                ),

            vy:
                Number(
                    state.vy.toFixed(2)
                ),

            speed:
                Number(
                    state.speed.toFixed(2)
                ),

            acceleration:
                Number(
                    state.acceleration.toFixed(2)
                ),

            angle:
                Number(
                    state.angle.toFixed(2)
                )

        }

    };


    history.unshift(
        historyItem
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
        "บันทึกผลการทดลองลง History แล้ว",
        "complete"
    );

}


// ========================================
// INPUT EVENTS
// ========================================

initialXInput.addEventListener(
    "input",
    updateInputDisplays
);

initialYInput.addEventListener(
    "input",
    updateInputDisplays
);

initialVxInput.addEventListener(
    "input",
    updateInputDisplays
);

initialVyInput.addEventListener(
    "input",
    updateInputDisplays
);

accelerationXInput.addEventListener(
    "input",
    updateInputDisplays
);

accelerationYInput.addEventListener(
    "input",
    updateInputDisplays
);

simulationTimeInput.addEventListener(
    "input",
    updateInputDisplays
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


                updateGraphCurrentValue();

                drawGraph();

            }
        );

    }
);


// ========================================
// INITIALIZE
// ========================================

updateInputDisplays();

resetCurrentState();

setStatus(
    "พร้อมเริ่มการทดลอง",
    "idle"
);