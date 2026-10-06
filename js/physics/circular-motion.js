// ========================================
// CIRCULAR MOTION LABORATORY
// ========================================


// ========================================
// CANVAS
// ========================================

const simulationCanvas =
    document.getElementById("simulationCanvas");

const simulationContext =
    simulationCanvas.getContext("2d");

const graphCanvas =
    document.getElementById("graphCanvas");

const graphContext =
    graphCanvas.getContext("2d");


// ========================================
// INPUTS
// ========================================

const radiusInput =
    document.getElementById("radius");

const velocityInput =
    document.getElementById("velocity");

const massInput =
    document.getElementById("mass");

const simulationTimeInput =
    document.getElementById("simulationTime");


// ========================================
// VALUE DISPLAYS
// ========================================

const radiusValue =
    document.getElementById("radiusValue");

const velocityValue =
    document.getElementById("velocityValue");

const massValue =
    document.getElementById("massValue");

const simulationTimeValue =
    document.getElementById("simulationTimeValue");


// ========================================
// BUTTONS
// ========================================

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


// ========================================
// STATUS
// ========================================

const statusDot =
    document.getElementById("statusDot");

const statusText =
    document.getElementById("statusText");


// ========================================
// REALTIME
// ========================================

const realtimeTime =
    document.getElementById("realtimeTime");

const realtimePosition =
    document.getElementById("realtimePosition");

const realtimeVelocity =
    document.getElementById("realtimeVelocity");

const realtimeAngular =
    document.getElementById("realtimeAngular");

const realtimeAcceleration =
    document.getElementById("realtimeAcceleration");


// ========================================
// RESULTS
// ========================================

const angularVelocityResult =
    document.getElementById(
        "angularVelocityResult"
    );

const periodResult =
    document.getElementById(
        "periodResult"
    );

const frequencyResult =
    document.getElementById(
        "frequencyResult"
    );

const centripetalAccelerationResult =
    document.getElementById(
        "centripetalAccelerationResult"
    );

const centripetalForceResult =
    document.getElementById(
        "centripetalForceResult"
    );

const circumferenceResult =
    document.getElementById(
        "circumferenceResult"
    );


// ========================================
// GRAPH
// ========================================

const graphButtons =
    document.querySelectorAll(".graph-button");

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

let radius = Number(radiusInput.value);

let velocity = Number(velocityInput.value);

let mass = Number(massInput.value);

let simulationDuration =
    Number(simulationTimeInput.value);


let elapsedTime = 0;

let angle = 0;

let running = false;

let paused = false;

let animationFrame = null;

let lastTimestamp = null;

let selectedGraph = "position";


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
// UPDATE INPUT VALUES
// ========================================

function updateInputDisplays() {

    radius =
        Number(radiusInput.value);

    velocity =
        Number(velocityInput.value);

    mass =
        Number(massInput.value);

    simulationDuration =
        Number(simulationTimeInput.value);


    radiusValue.textContent =
        formatNumber(radius) + " m";

    velocityValue.textContent =
        formatNumber(velocity) + " m/s";

    massValue.textContent =
        formatNumber(mass) + " kg";

    simulationTimeValue.textContent =
        simulationDuration + " s";


    calculateResults();

    drawSimulation();

    drawGraph();

}


// ========================================
// CALCULATE PHYSICS
// ========================================

function calculatePhysics() {

    let angularVelocity = 0;

    let period = 0;

    let frequency = 0;

    let centripetalAcceleration = 0;

    let centripetalForce = 0;

    let circumference = 0;


    if (radius > 0) {

        angularVelocity =
            velocity / radius;

        centripetalAcceleration =
            (velocity * velocity) / radius;

        centripetalForce =
            mass *
            centripetalAcceleration;

        circumference =
            2 *
            Math.PI *
            radius;

        if (velocity > 0) {

            period =
                circumference / velocity;

            frequency =
                1 / period;

        }

    }


    return {

        angularVelocity,
        period,
        frequency,
        centripetalAcceleration,
        centripetalForce,
        circumference

    };

}


// ========================================
// UPDATE RESULTS
// ========================================

function calculateResults() {

    const physics =
        calculatePhysics();


    angularVelocityResult.textContent =
        formatNumber(
            physics.angularVelocity
        ) +
        " rad/s";


    periodResult.textContent =
        formatNumber(
            physics.period
        ) +
        " s";


    frequencyResult.textContent =
        formatNumber(
            physics.frequency
        ) +
        " Hz";


    centripetalAccelerationResult.textContent =
        formatNumber(
            physics.centripetalAcceleration
        ) +
        " m/s²";


    centripetalForceResult.textContent =
        formatNumber(
            physics.centripetalForce
        ) +
        " N";


    circumferenceResult.textContent =
        formatNumber(
            physics.circumference
        ) +
        " m";

}


// ========================================
// UPDATE REALTIME
// ========================================

function updateRealtime() {

    const physics =
        calculatePhysics();


    realtimeTime.textContent =
        formatNumber(elapsedTime) +
        " s";


    realtimePosition.textContent =
        formatNumber(
            (angle * 180) / Math.PI
        ) +
        "°";


    realtimeVelocity.textContent =
        formatNumber(velocity) +
        " m/s";


    realtimeAngular.textContent =
        formatNumber(
            physics.angularVelocity
        ) +
        " rad/s";


    realtimeAcceleration.textContent =
        formatNumber(
            physics.centripetalAcceleration
        ) +
        " m/s²";


    updateGraphCurrentValue();

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

    const backgroundGradient =
        simulationContext.createLinearGradient(
            0,
            0,
            0,
            height
        );

    backgroundGradient.addColorStop(
        0,
        "#0f172a"
    );

    backgroundGradient.addColorStop(
        1,
        "#020617"
    );


    simulationContext.fillStyle =
        backgroundGradient;

    simulationContext.fillRect(
        0,
        0,
        width,
        height
    );


    // ------------------------------------
    // CENTER
    // ------------------------------------

    const centerX =
        width * 0.5;

    const centerY =
        height * 0.52;


    // ------------------------------------
    // SCALE
    // ------------------------------------

    const maxRadius =
        Math.min(
            width * 0.36,
            height * 0.36
        );


    const radiusPixels =
        (
            radius / 10
        ) *
        maxRadius;


    // ------------------------------------
    // GRID CIRCLE
    // ------------------------------------

    simulationContext.beginPath();

    simulationContext.arc(
        centerX,
        centerY,
        radiusPixels,
        0,
        Math.PI * 2
    );

    simulationContext.strokeStyle =
        "#334155";

    simulationContext.lineWidth = 2;

    simulationContext.setLineDash([
        8,
        8
    ]);

    simulationContext.stroke();

    simulationContext.setLineDash([]);


    // ------------------------------------
    // CROSS AXIS
    // ------------------------------------

    simulationContext.strokeStyle =
        "#1e293b";

    simulationContext.lineWidth = 1;


    simulationContext.beginPath();

    simulationContext.moveTo(
        centerX - maxRadius,
        centerY
    );

    simulationContext.lineTo(
        centerX + maxRadius,
        centerY
    );

    simulationContext.stroke();


    simulationContext.beginPath();

    simulationContext.moveTo(
        centerX,
        centerY - maxRadius
    );

    simulationContext.lineTo(
        centerX,
        centerY + maxRadius
    );

    simulationContext.stroke();


    // ------------------------------------
    // CENTER POINT
    // ------------------------------------

    simulationContext.beginPath();

    simulationContext.arc(
        centerX,
        centerY,
        8,
        0,
        Math.PI * 2
    );

    simulationContext.fillStyle =
        "#f8fafc";

    simulationContext.fill();


    // ------------------------------------
    // OBJECT POSITION
    // ------------------------------------

    const objectX =
        centerX +
        radiusPixels *
        Math.cos(angle);

    const objectY =
        centerY +
        radiusPixels *
        Math.sin(angle);


    // ------------------------------------
    // RADIUS LINE
    // ------------------------------------

    simulationContext.beginPath();

    simulationContext.moveTo(
        centerX,
        centerY
    );

    simulationContext.lineTo(
        objectX,
        objectY
    );

    simulationContext.strokeStyle =
        "#38bdf8";

    simulationContext.lineWidth = 3;

    simulationContext.stroke();


    // ------------------------------------
    // TANGENT VELOCITY ARROW
    // ------------------------------------

    const tangentX =
        -Math.sin(angle);

    const tangentY =
        Math.cos(angle);


    const arrowLength =
        Math.min(
            80,
            30 +
            velocity * 3
        );


    const velocityEndX =
        objectX +
        tangentX *
        arrowLength;

    const velocityEndY =
        objectY +
        tangentY *
        arrowLength;


    simulationContext.beginPath();

    simulationContext.moveTo(
        objectX,
        objectY
    );

    simulationContext.lineTo(
        velocityEndX,
        velocityEndY
    );

    simulationContext.strokeStyle =
        "#f59e0b";

    simulationContext.lineWidth = 4;

    simulationContext.stroke();


    drawArrowHead(
        objectX,
        objectY,
        velocityEndX,
        velocityEndY,
        "#f59e0b"
    );


    // ------------------------------------
    // CENTRIPETAL ACCELERATION ARROW
    // ------------------------------------

    const accelerationLength =
        Math.min(
            80,
            30 +
            calculatePhysics()
                .centripetalAcceleration *
                3
        );


    const accelerationEndX =
        objectX -
        Math.cos(angle) *
        accelerationLength;

    const accelerationEndY =
        objectY -
        Math.sin(angle) *
        accelerationLength;


    simulationContext.beginPath();

    simulationContext.moveTo(
        objectX,
        objectY
    );

    simulationContext.lineTo(
        accelerationEndX,
        accelerationEndY
    );

    simulationContext.strokeStyle =
        "#ef4444";

    simulationContext.lineWidth = 4;

    simulationContext.stroke();


    drawArrowHead(
        objectX,
        objectY,
        accelerationEndX,
        accelerationEndY,
        "#ef4444"
    );


    // ------------------------------------
    // OBJECT
    // ------------------------------------

    simulationContext.beginPath();

    simulationContext.arc(
        objectX,
        objectY,
        16,
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
    // LABELS
    // ------------------------------------

    simulationContext.font =
        "bold 16px Arial";

    simulationContext.fillStyle =
        "#f8fafc";

    simulationContext.fillText(
        "Center",
        centerX + 12,
        centerY - 12
    );


    simulationContext.fillStyle =
        "#38bdf8";

    simulationContext.fillText(
        "r = " +
        formatNumber(radius) +
        " m",
        centerX +
        radiusPixels * 0.45,
        centerY - 10
    );


    simulationContext.fillStyle =
        "#f59e0b";

    simulationContext.fillText(
        "v",
        velocityEndX + 8,
        velocityEndY
    );


    simulationContext.fillStyle =
        "#ef4444";

    simulationContext.fillText(
        "aᶜ",
        accelerationEndX + 8,
        accelerationEndY
    );


    // ------------------------------------
    // ANGLE
    // ------------------------------------

    simulationContext.beginPath();

    simulationContext.arc(
        centerX,
        centerY,
        Math.min(
            55,
            radiusPixels * 0.5
        ),
        0,
        angle,
        false
    );

    simulationContext.strokeStyle =
        "#a78bfa";

    simulationContext.lineWidth = 3;

    simulationContext.stroke();


    simulationContext.fillStyle =
        "#c4b5fd";

    simulationContext.fillText(
        "θ",
        centerX + 35,
        centerY - 18
    );


    // ------------------------------------
    // TITLE
    // ------------------------------------

    simulationContext.font =
        "bold 20px Arial";

    simulationContext.fillStyle =
        "#f8fafc";

    simulationContext.fillText(
        "Circular Motion",
        25,
        35
    );


    simulationContext.font =
        "14px Arial";

    simulationContext.fillStyle =
        "#94a3b8";

    simulationContext.fillText(
        "v = " +
        formatNumber(velocity) +
        " m/s   |   r = " +
        formatNumber(radius) +
        " m",
        25,
        58
    );


    // ------------------------------------
    // LEGEND
    // ------------------------------------

    drawLegend(
        25,
        height - 70,
        "#38bdf8",
        "Radius"
    );

    drawLegend(
        130,
        height - 70,
        "#f59e0b",
        "Velocity"
    );

    drawLegend(
        245,
        height - 70,
        "#ef4444",
        "Centripetal acceleration"
    );

}


// ========================================
// DRAW ARROW HEAD
// ========================================

function drawArrowHead(
    startX,
    startY,
    endX,
    endY,
    color
) {

    const angleArrow =
        Math.atan2(
            endY - startY,
            endX - startX
        );


    const size = 10;


    simulationContext.beginPath();

    simulationContext.moveTo(
        endX,
        endY
    );

    simulationContext.lineTo(
        endX -
        size *
        Math.cos(
            angleArrow -
            Math.PI / 6
        ),
        endY -
        size *
        Math.sin(
            angleArrow -
            Math.PI / 6
        )
    );

    simulationContext.lineTo(
        endX -
        size *
        Math.cos(
            angleArrow +
            Math.PI / 6
        ),
        endY -
        size *
        Math.sin(
            angleArrow +
            Math.PI / 6
        )
    );

    simulationContext.closePath();

    simulationContext.fillStyle =
        color;

    simulationContext.fill();

}


// ========================================
// LEGEND
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
// GRAPH CURRENT VALUE
// ========================================

function updateGraphCurrentValue() {

    const physics =
        calculatePhysics();


    if (selectedGraph === "position") {

        graphCurrentTitle.textContent =
            "Position";

        graphCurrentValue.textContent =
            formatNumber(
                (angle * 180) / Math.PI
            ) +
            "°";

    }
    else if (selectedGraph === "velocity") {

        graphCurrentTitle.textContent =
            "Velocity";

        graphCurrentValue.textContent =
            formatNumber(velocity) +
            " m/s";

    }
    else {

        graphCurrentTitle.textContent =
            "Centripetal Acceleration";

        graphCurrentValue.textContent =
            formatNumber(
                physics.centripetalAcceleration
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


    // ------------------------------------
    // BACKGROUND
    // ------------------------------------

    graphContext.fillStyle =
        document.body.classList.contains(
            "dark-mode"
        )
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
    // GET VALUES
    // ------------------------------------

    let values =
        graphData.map(
            function(item) {

                if (
                    selectedGraph ===
                    "position"
                ) {

                    return item.angle;

                }

                if (
                    selectedGraph ===
                    "velocity"
                ) {

                    return item.velocity;

                }

                return item.acceleration;

            }
        );


    const times =
        graphData.map(
            function(item) {
                return item.time;
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
        document.body.classList.contains(
            "dark-mode"
        )
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
            (
                plotHeight *
                i /
                5
            );


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
            (
                plotWidth *
                i /
                5
            );


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
    // GRAPH LINE
    // ------------------------------------

    graphContext.beginPath();


    for (
        let i = 0;
        i < graphData.length;
        i++
    ) {

        const item =
            graphData[i];


        const x =
            paddingLeft +
            (
                item.time /
                Math.max(
                    simulationDuration,
                    0.001
                )
            ) *
            plotWidth;


        let value;


        if (
            selectedGraph ===
            "position"
        ) {

            value = item.angle;

        }
        else if (
            selectedGraph ===
            "velocity"
        ) {

            value = item.velocity;

        }
        else {

            value = item.acceleration;

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


        if (i === 0) {

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


    graphContext.strokeStyle =
        "#2563eb";

    graphContext.lineWidth = 3;

    graphContext.stroke();


    // ------------------------------------
    // AXIS LABELS
    // ------------------------------------

    graphContext.fillStyle =
        document.body.classList.contains(
            "dark-mode"
        )
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
        formatNumber(
            simulationDuration
        ) +
        " s",
        width - 65,
        height - 15
    );


    graphContext.save();

    graphContext.translate(
        18,
        height / 2
    );

    graphContext.rotate(
        -Math.PI / 2
    );


    let axisText =
        "Value";


    if (
        selectedGraph ===
        "position"
    ) {

        axisText =
            "Angle (°)";

    }
    else if (
        selectedGraph ===
        "velocity"
    ) {

        axisText =
            "Velocity (m/s)";

    }
    else {

        axisText =
            "Acceleration (m/s²)";

    }


    graphContext.fillText(
        axisText,
        0,
        0
    );

    graphContext.restore();

}


// ========================================
// START
// ========================================

function startSimulation() {

    elapsedTime = 0;

    angle = 0;

    graphData = [];

    paused = false;

    running = true;

    lastTimestamp = null;


    setStatus(
        "กำลังจำลองการเคลื่อนที่",
        "running"
    );


    updateRealtime();

    drawSimulation();

    drawGraph();


    if (animationFrame !== null) {

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


    if (animationFrame !== null) {

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

    elapsedTime = 0;

    angle = 0;

    graphData = [];

    lastTimestamp = null;


    if (animationFrame !== null) {

        cancelAnimationFrame(
            animationFrame
        );

        animationFrame = null;

    }


    setStatus(
        "พร้อมเริ่มการทดลอง",
        "idle"
    );


    updateRealtime();

    calculateResults();

    drawSimulation();

    drawGraph();

}


// ========================================
// ANIMATION
// ========================================

function animate(timestamp) {

    if (!running || paused) {
        return;
    }


    if (lastTimestamp === null) {

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


    // จำกัดเวลาแต่ละเฟรม
    deltaTime =
        Math.min(
            deltaTime,
            0.05
        );


    elapsedTime +=
        deltaTime;


    // ------------------------------------
    // PHYSICS
    // ------------------------------------

    const physics =
        calculatePhysics();


    angle =
        physics.angularVelocity *
        elapsedTime;


    // ------------------------------------
    // GRAPH DATA
    // ------------------------------------

    graphData.push({

        time: elapsedTime,

        angle:
            (
                angle *
                180 /
                Math.PI
            ),

        velocity: velocity,

        acceleration:
            physics.centripetalAcceleration

    });


    // จำกัดจำนวนข้อมูล
    if (graphData.length > 1200) {

        graphData.shift();

    }


    updateRealtime();

    drawSimulation();

    drawGraph();


    // ------------------------------------
    // END
    // ------------------------------------

    if (
        elapsedTime >=
        simulationDuration
    ) {

        elapsedTime =
            simulationDuration;


        angle =
            physics.angularVelocity *
            elapsedTime;


        updateRealtime();

        drawSimulation();

        drawGraph();


        running = false;

        paused = false;


        setStatus(
            "การทดลองเสร็จสิ้น",
            "complete"
        );


        animationFrame = null;

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

    const physics =
        calculatePhysics();


    const history =
        JSON.parse(
            localStorage.getItem(
                "engiHistory"
            )
        ) || [];


    const historyItem = {

        icon: "🔄",

        title:
            "Circular Motion Laboratory",

        calculation:
            "r = " +
            formatNumber(radius) +
            " m | " +

            "v = " +
            formatNumber(velocity) +
            " m/s | " +

            "m = " +
            formatNumber(mass) +
            " kg | " +

            "ω = " +
            formatNumber(
                physics.angularVelocity
            ) +
            " rad/s | " +

            "aᶜ = " +
            formatNumber(
                physics.centripetalAcceleration
            ) +
            " m/s² | " +

            "Fᶜ = " +
            formatNumber(
                physics.centripetalForce
            ) +
            " N",

        time:
            new Date().toLocaleString(
                "th-TH"
            ),

        tool:
            "Circular Motion Laboratory",

        category:
            "Physics Simulation",

        date:
            new Date().toISOString(),

        timestamp:
            Date.now(),

        input: {

            radius:
                Number(
                    radius.toFixed(2)
                ),

            velocity:
                Number(
                    velocity.toFixed(2)
                ),

            mass:
                Number(
                    mass.toFixed(2)
                ),

            simulationDuration:
                Number(
                    simulationDuration
                )

        },

        result: {

            angularVelocity:
                Number(
                    physics.angularVelocity.toFixed(2)
                ),

            period:
                Number(
                    physics.period.toFixed(2)
                ),

            frequency:
                Number(
                    physics.frequency.toFixed(2)
                ),

            centripetalAcceleration:
                Number(
                    physics.centripetalAcceleration.toFixed(2)
                ),

            centripetalForce:
                Number(
                    physics.centripetalForce.toFixed(2)
                ),

            circumference:
                Number(
                    physics.circumference.toFixed(2)
                )

        }

    };


    history.unshift(
        historyItem
    );


    if (history.length > 100) {

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

radiusInput.addEventListener(
    "input",
    updateInputDisplays
);

velocityInput.addEventListener(
    "input",
    updateInputDisplays
);

massInput.addEventListener(
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

updateInputDisplays();

calculateResults();

updateRealtime();

drawSimulation();

drawGraph();

setStatus(
    "พร้อมเริ่มการทดลอง",
    "idle"
);