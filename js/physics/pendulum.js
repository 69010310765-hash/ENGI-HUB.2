/* ========================================
   SIMPLE PENDULUM SIMULATION
   ENGI HUB
======================================== */


/* ========================================
   CANVAS
======================================== */

const canvas =
    document.getElementById("simulationCanvas");

const ctx =
    canvas.getContext("2d");


const graphCanvas =
    document.getElementById("graphCanvas");

const graphCtx =
    graphCanvas.getContext("2d");


/* ========================================
   CONTROLS
======================================== */

const lengthInput =
    document.getElementById("length");

const massInput =
    document.getElementById("mass");

const angleInput =
    document.getElementById("initialAngle");

const gravityInput =
    document.getElementById("gravity");


/* ========================================
   DISPLAY VALUES
======================================== */

const lengthValue =
    document.getElementById("lengthValue");

const massValue =
    document.getElementById("massValue");

const angleValue =
    document.getElementById("angleValue");

const gravityValue =
    document.getElementById("gravityValue");


/* ========================================
   BUTTONS
======================================== */

const startButton =
    document.getElementById("startButton");

const pauseButton =
    document.getElementById("pauseButton");

const resumeButton =
    document.getElementById("resumeButton");

const resetButton =
    document.getElementById("resetButton");


/* ========================================
   STATUS
======================================== */

const statusDot =
    document.getElementById("statusDot");

const statusText =
    document.getElementById("statusText");


/* ========================================
   REALTIME
======================================== */

const realtimeTime =
    document.getElementById("realtimeTime");

const realtimeAngle =
    document.getElementById("realtimeAngle");

const realtimeOmega =
    document.getElementById("realtimeOmega");

const realtimeVelocity =
    document.getElementById("realtimeVelocity");


/* ========================================
   RESULTS
======================================== */

const periodResult =
    document.getElementById("periodResult");

const frequencyResult =
    document.getElementById("frequencyResult");


/* ========================================
   GRAPH
======================================== */

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

const graphEmpty =
    document.getElementById(
        "graphEmpty"
    );


/* ========================================
   VARIABLES
======================================== */

let length =
    Number(lengthInput.value);

let mass =
    Number(massInput.value);

let initialAngleDeg =
    Number(angleInput.value);

let gravity =
    Number(gravityInput.value);


let initialAngle =
    initialAngleDeg *
    Math.PI /
    180;


let simulationTime = 0;

let running = false;

let paused = false;

let animationFrame = null;

let lastTimestamp = null;


/* ========================================
   HISTORY
======================================== */

let historySaved = false;


/* ========================================
   GRAPH
======================================== */

let selectedGraph =
    "angle";

let graphData =
    [];


const graphSettings = {

    angle: {

        title: "มุม θ",

        unit: "°"

    },

    omega: {

        title: "ความเร็วเชิงมุม ω",

        unit: "rad/s"

    },

    velocity: {

        title: "ความเร็ว v",

        unit: "m/s"

    }

};


/* ========================================
   PHYSICS
======================================== */

function calculateTheta(time) {

    const omega0 =
        Math.sqrt(
            gravity / length
        );


    return (
        initialAngle *
        Math.cos(
            omega0 * time
        )
    );

}


/* ========================================
   ANGULAR VELOCITY
======================================== */

function calculateOmega(time) {

    const omega0 =
        Math.sqrt(
            gravity / length
        );


    return (
        -initialAngle *
        omega0 *
        Math.sin(
            omega0 * time
        )
    );

}


/* ========================================
   LINEAR VELOCITY
======================================== */

function calculateVelocity(time) {

    return (
        length *
        calculateOmega(time)
    );

}


/* ========================================
   PERIOD
======================================== */

function calculatePeriod() {

    return (
        2 *
        Math.PI *
        Math.sqrt(
            length /
            gravity
        )
    );

}


/* ========================================
   FREQUENCY
======================================== */

function calculateFrequency() {

    return (
        1 /
        calculatePeriod()
    );

}


/* ========================================
   DISPLAY
======================================== */

function updateDisplays() {

    lengthValue.textContent =
        length.toFixed(2) +
        " m";


    massValue.textContent =
        mass.toFixed(2) +
        " kg";


    angleValue.textContent =
        initialAngleDeg.toFixed(0) +
        "°";


    gravityValue.textContent =
        gravity.toFixed(2) +
        " m/s²";

}


/* ========================================
   RESULTS
======================================== */

function updateResults() {

    periodResult.textContent =
        calculatePeriod().toFixed(2) +
        " s";


    frequencyResult.textContent =
        calculateFrequency().toFixed(2) +
        " Hz";

}


/* ========================================
   SAVE HISTORY
======================================== */

function saveToHistory() {

    if (historySaved) {

        return;

    }


    historySaved = true;


    let history = [];


    try {

        history =
            JSON.parse(
                localStorage.getItem(
                    "engiHistory"
                )
            ) || [];

    }

    catch (error) {

        history = [];

    }


    const period =
        calculatePeriod();

    const frequency =
        calculateFrequency();


    const historyItem = {

        icon: "🪀",

        title: "Simple Pendulum",

        calculation:
            `L = ${length.toFixed(2)} m | ` +
            `m = ${mass.toFixed(2)} kg | ` +
            `θ₀ = ${initialAngleDeg.toFixed(2)}° | ` +
            `g = ${gravity.toFixed(2)} m/s² | ` +
            `T = ${period.toFixed(2)} s | ` +
            `f = ${frequency.toFixed(2)} Hz`,

        time:
            new Date().toLocaleString(
                "th-TH"
            ),

        /* Detailed data */

        tool:
            "Simple Pendulum",

        category:
            "Physics Simulation",

        date:
            new Date().toISOString(),

        timestamp:
            Date.now(),

        length:
            Number(
                length.toFixed(2)
            ),

        mass:
            Number(
                mass.toFixed(2)
            ),

        initialAngle:
            Number(
                initialAngleDeg.toFixed(2)
            ),

        gravity:
            Number(
                gravity.toFixed(2)
            ),

        period:
            Number(
                period.toFixed(2)
            ),

        frequency:
            Number(
                frequency.toFixed(2)
            )

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
            JSON.stringify(
                history
            )
        );

        console.log(
            "Simple Pendulum saved to history"
        );

    }

    catch (error) {

        console.error(
            "Cannot save Simple Pendulum history:",
            error
        );

    }

}


/* ========================================
   REALTIME
======================================== */

function updateRealtime() {

    const theta =
        calculateTheta(
            simulationTime
        );


    const omega =
        calculateOmega(
            simulationTime
        );


    const velocity =
        calculateVelocity(
            simulationTime
        );


    realtimeTime.textContent =
        simulationTime.toFixed(2) +
        " s";


    realtimeAngle.textContent =
        (
            theta *
            180 /
            Math.PI
        ).toFixed(2) +
        "°";


    realtimeOmega.textContent =
        omega.toFixed(2) +
        " rad/s";


    realtimeVelocity.textContent =
        Math.abs(
            velocity
        ).toFixed(2) +
        " m/s";


    updateGraphCurrent(
        theta,
        omega,
        velocity
    );

}


/* ========================================
   UPDATE PHYSICS
======================================== */

function updatePhysics() {

    length =
        Number(
            lengthInput.value
        );

    mass =
        Number(
            massInput.value
        );

    initialAngleDeg =
        Number(
            angleInput.value
        );

    gravity =
        Number(
            gravityInput.value
        );


    initialAngle =
        initialAngleDeg *
        Math.PI /
        180;


    updateDisplays();

    updateResults();

    updateRealtime();

    drawPendulum();

    drawGraph();

}


/* ========================================
   CANVAS RESIZE
======================================== */

function resizeCanvas() {

    const rect =
        canvas.getBoundingClientRect();

    const dpr =
        window.devicePixelRatio ||
        1;


    canvas.width =
        rect.width * dpr;

    canvas.height =
        rect.height * dpr;


    ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
    );


    drawPendulum();

}


/* ========================================
   GRAPH RESIZE
======================================== */

function resizeGraphCanvas() {

    const rect =
        graphCanvas.getBoundingClientRect();

    const dpr =
        window.devicePixelRatio ||
        1;


    graphCanvas.width =
        rect.width * dpr;

    graphCanvas.height =
        rect.height * dpr;


    graphCtx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
    );


    drawGraph();

}


/* ========================================
   DRAW PENDULUM
======================================== */

function drawPendulum() {

    const width =
        canvas.clientWidth;

    const height =
        canvas.clientHeight;


    ctx.clearRect(
        0,
        0,
        width,
        height
    );


    /* SKY */

    const sky =
        ctx.createLinearGradient(
            0,
            0,
            0,
            height
        );


    sky.addColorStop(
        0,
        "#dff6ff"
    );

    sky.addColorStop(
        0.55,
        "#edf8ff"
    );

    sky.addColorStop(
        1,
        "#f8fafc"
    );


    ctx.fillStyle =
        sky;

    ctx.fillRect(
        0,
        0,
        width,
        height
    );


    /* SOFT LIGHT */

    const light =
        ctx.createRadialGradient(
            width * 0.5,
            height * 0.2,
            10,
            width * 0.5,
            height * 0.2,
            width * 0.7
        );


    light.addColorStop(
        0,
        "rgba(255,255,255,0.8)"
    );

    light.addColorStop(
        1,
        "rgba(255,255,255,0)"
    );


    ctx.fillStyle =
        light;

    ctx.fillRect(
        0,
        0,
        width,
        height
    );


    /* FLOOR */

    const floorY =
        height - 42;


    ctx.fillStyle =
        "#e2e8f0";

    ctx.fillRect(
        0,
        floorY,
        width,
        height - floorY
    );


    ctx.strokeStyle =
        "#cbd5e1";

    ctx.lineWidth =
        1;


    for (
        let x = 0;
        x < width;
        x += 35
    ) {

        ctx.beginPath();

        ctx.moveTo(
            x,
            floorY
        );

        ctx.lineTo(
            x - 45,
            height
        );

        ctx.stroke();

    }


    /* PIVOT */

    const pivotX =
        width / 2;

    const pivotY =
        70;


    /* PLATFORM SHADOW */

    ctx.fillStyle =
        "rgba(15,23,42,0.12)";

    ctx.fillRect(
        pivotX - 112,
        pivotY - 8,
        224,
        18
    );


    /* PLATFORM */

    const platformGradient =
        ctx.createLinearGradient(
            0,
            pivotY - 20,
            0,
            pivotY + 5
        );


    platformGradient.addColorStop(
        0,
        "#475569"
    );

    platformGradient.addColorStop(
        0.5,
        "#1e293b"
    );

    platformGradient.addColorStop(
        1,
        "#0f172a"
    );


    ctx.fillStyle =
        platformGradient;

    ctx.fillRect(
        pivotX - 110,
        pivotY - 20,
        220,
        20
    );


    /* SUPPORT */

    ctx.strokeStyle =
        "#64748b";

    ctx.lineWidth =
        7;

    ctx.lineCap =
        "round";


    ctx.beginPath();

    ctx.moveTo(
        pivotX - 85,
        pivotY
    );

    ctx.lineTo(
        pivotX - 42,
        pivotY + 43
    );

    ctx.moveTo(
        pivotX + 85,
        pivotY
    );

    ctx.lineTo(
        pivotX + 42,
        pivotY + 43
    );

    ctx.stroke();


    /* SUPPORT HIGHLIGHT */

    ctx.strokeStyle =
        "rgba(255,255,255,0.45)";

    ctx.lineWidth =
        2;


    ctx.beginPath();

    ctx.moveTo(
        pivotX - 83,
        pivotY + 1
    );

    ctx.lineTo(
        pivotX - 42,
        pivotY + 40
    );

    ctx.moveTo(
        pivotX + 83,
        pivotY + 1
    );

    ctx.lineTo(
        pivotX + 42,
        pivotY + 40
    );

    ctx.stroke();


    /* VISUAL LENGTH */

    const maxVisualLength =
        Math.min(
            width * 0.36,
            height * 0.67
        );


    const visualLength =
        maxVisualLength *
        (
            length / 5
        );


    const pendulumLength =
        Math.max(
            100,
            visualLength
        );


    /* CURRENT ANGLE */

    const theta =
        calculateTheta(
            simulationTime
        );


    const bobX =
        pivotX +
        pendulumLength *
        Math.sin(theta);


    const bobY =
        pivotY +
        pendulumLength *
        Math.cos(theta);


    /* ANGLE GUIDE */

    ctx.save();

    ctx.setLineDash([
        7,
        7
    ]);

    ctx.strokeStyle =
        "rgba(37,99,235,0.28)";

    ctx.lineWidth =
        2;


    ctx.beginPath();

    ctx.moveTo(
        pivotX,
        pivotY
    );

    ctx.lineTo(
        pivotX,
        pivotY + 78
    );

    ctx.stroke();

    ctx.restore();


    /* ANGLE ARC */

    if (
        Math.abs(theta) > 0.01
    ) {

        ctx.strokeStyle =
            "rgba(37,99,235,0.55)";

        ctx.lineWidth =
            3;


        ctx.beginPath();

        const startAngle =
            Math.PI / 2;


        const endAngle =
            Math.PI / 2 -
            theta;


        ctx.arc(
            pivotX,
            pivotY,
            62,
            Math.min(
                startAngle,
                endAngle
            ),
            Math.max(
                startAngle,
                endAngle
            )
        );

        ctx.stroke();

    }


    /* ANGLE LABEL */

    ctx.fillStyle =
        "#1d4ed8";

    ctx.font =
        "bold 16px Arial";


    ctx.fillText(
        "θ",
        pivotX + 45,
        pivotY + 55
    );


    /* STRING SHADOW */

    ctx.strokeStyle =
        "rgba(15,23,42,0.12)";

    ctx.lineWidth =
        6;


    ctx.beginPath();

    ctx.moveTo(
        pivotX + 2,
        pivotY + 2
    );

    ctx.lineTo(
        bobX + 2,
        bobY + 2
    );

    ctx.stroke();


    /* STRING */

    const stringGradient =
        ctx.createLinearGradient(
            pivotX,
            pivotY,
            bobX,
            bobY
        );


    stringGradient.addColorStop(
        0,
        "#0f172a"
    );

    stringGradient.addColorStop(
        0.5,
        "#64748b"
    );

    stringGradient.addColorStop(
        1,
        "#334155"
    );


    ctx.strokeStyle =
        stringGradient;

    ctx.lineWidth =
        3;


    ctx.beginPath();

    ctx.moveTo(
        pivotX,
        pivotY
    );

    ctx.lineTo(
        bobX,
        bobY
    );

    ctx.stroke();


    /* LENGTH LABEL */

    const midX =
        (
            pivotX +
            bobX
        ) / 2;

    const midY =
        (
            pivotY +
            bobY
        ) / 2;


    ctx.fillStyle =
        "#334155";

    ctx.font =
        "bold 15px Arial";


    ctx.fillText(
        "L = " +
        length.toFixed(2) +
        " m",
        midX + 12,
        midY
    );


    /* PIVOT GLOW */

    const pivotGlow =
        ctx.createRadialGradient(
            pivotX,
            pivotY,
            1,
            pivotX,
            pivotY,
            18
        );


    pivotGlow.addColorStop(
        0,
        "rgba(59,130,246,0.4)"
    );

    pivotGlow.addColorStop(
        1,
        "rgba(59,130,246,0)"
    );


    ctx.fillStyle =
        pivotGlow;

    ctx.beginPath();

    ctx.arc(
        pivotX,
        pivotY,
        18,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* PIVOT */

    const pivotGradient =
        ctx.createRadialGradient(
            pivotX - 3,
            pivotY - 4,
            2,
            pivotX,
            pivotY,
            10
        );


    pivotGradient.addColorStop(
        0,
        "#f8fafc"
    );

    pivotGradient.addColorStop(
        0.35,
        "#94a3b8"
    );

    pivotGradient.addColorStop(
        1,
        "#0f172a"
    );


    ctx.fillStyle =
        pivotGradient;


    ctx.beginPath();

    ctx.arc(
        pivotX,
        pivotY,
        9,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* BOB SHADOW */

    ctx.fillStyle =
        "rgba(15,23,42,0.18)";


    ctx.beginPath();

    ctx.ellipse(
        bobX + 8,
        bobY + 12,
        23,
        9,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* BOB GLOW */

    const bobGlow =
        ctx.createRadialGradient(
            bobX,
            bobY,
            4,
            bobX,
            bobY,
            45
        );


    bobGlow.addColorStop(
        0,
        "rgba(37,99,235,0.35)"
    );

    bobGlow.addColorStop(
        1,
        "rgba(37,99,235,0)"
    );


    ctx.fillStyle =
        bobGlow;


    ctx.beginPath();

    ctx.arc(
        bobX,
        bobY,
        45,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* BOB */

    const bobRadius =
        Math.max(
            15,
            Math.min(
                31,
                15 +
                mass * 1.5
            )
        );


    const bobGradient =
        ctx.createRadialGradient(
            bobX - bobRadius * 0.35,
            bobY - bobRadius * 0.4,
            2,
            bobX,
            bobY,
            bobRadius
        );


    bobGradient.addColorStop(
        0,
        "#93c5fd"
    );

    bobGradient.addColorStop(
        0.3,
        "#3b82f6"
    );

    bobGradient.addColorStop(
        0.75,
        "#2563eb"
    );

    bobGradient.addColorStop(
        1,
        "#1e3a8a"
    );


    ctx.fillStyle =
        bobGradient;


    ctx.beginPath();

    ctx.arc(
        bobX,
        bobY,
        bobRadius,
        0,
        Math.PI * 2
    );

    ctx.fill();


    ctx.strokeStyle =
        "#172554";

    ctx.lineWidth =
        3;

    ctx.stroke();


    /* BOB HIGHLIGHT */

    ctx.fillStyle =
        "rgba(255,255,255,0.45)";


    ctx.beginPath();

    ctx.arc(
        bobX -
        bobRadius * 0.3,
        bobY -
        bobRadius * 0.35,
        bobRadius * 0.23,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* VELOCITY VECTOR */

    const omega =
        calculateOmega(
            simulationTime
        );


    const direction =
        omega >= 0
            ? 1
            : -1;


    const vectorLength =
        Math.min(
            70,
            Math.abs(omega) * 18
        );


    if (
        vectorLength > 2
    ) {

        const tangentX =
            Math.cos(theta) *
            direction;

        const tangentY =
            -Math.sin(theta) *
            direction;


        const arrowX =
            bobX +
            tangentX *
            vectorLength;

        const arrowY =
            bobY +
            tangentY *
            vectorLength;


        ctx.save();


        ctx.strokeStyle =
            "#16a34a";

        ctx.fillStyle =
            "#16a34a";

        ctx.lineWidth =
            3;

        ctx.lineCap =
            "round";


        ctx.beginPath();

        ctx.moveTo(
            bobX,
            bobY
        );

        ctx.lineTo(
            arrowX,
            arrowY
        );

        ctx.stroke();


        const arrowAngle =
            Math.atan2(
                arrowY - bobY,
                arrowX - bobX
            );


        ctx.beginPath();

        ctx.moveTo(
            arrowX,
            arrowY
        );

        ctx.lineTo(
            arrowX -
            10 *
            Math.cos(
                arrowAngle - 0.5
            ),
            arrowY -
            10 *
            Math.sin(
                arrowAngle - 0.5
            )
        );

        ctx.lineTo(
            arrowX -
            10 *
            Math.cos(
                arrowAngle + 0.5
            ),
            arrowY -
            10 *
            Math.sin(
                arrowAngle + 0.5
            )
        );

        ctx.closePath();

        ctx.fill();


        ctx.font =
            "bold 13px Arial";

        ctx.fillText(
            "v",
            arrowX + 8,
            arrowY
        );


        ctx.restore();

    }


    /* GROUND LINE */

    ctx.strokeStyle =
        "#94a3b8";

    ctx.lineWidth =
        2;


    ctx.beginPath();

    ctx.moveTo(
        30,
        floorY
    );

    ctx.lineTo(
        width - 30,
        floorY
    );

    ctx.stroke();


    /* INFO LABEL */

    ctx.fillStyle =
        "#64748b";

    ctx.font =
        "13px Arial";


    ctx.fillText(
        "Simple Pendulum",
        20,
        28
    );

}


/* ========================================
   GRAPH DATA
======================================== */

function collectGraphData() {

    graphData.push({

        time:
            simulationTime,

        angle:
            calculateTheta(
                simulationTime
            ) *
            180 /
            Math.PI,

        omega:
            calculateOmega(
                simulationTime
            ),

        velocity:
            calculateVelocity(
                simulationTime
            )

    });


    if (
        graphData.length >
        1500
    ) {

        graphData.shift();

    }

}


/* ========================================
   CURRENT GRAPH VALUE
======================================== */

function updateGraphCurrent(
    theta,
    omega,
    velocity
) {

    const settings =
        graphSettings[
            selectedGraph
        ];


    graphCurrentTitle.textContent =
        settings.title;


    let value =
        0;


    if (
        selectedGraph ===
        "angle"
    ) {

        value =
            theta *
            180 /
            Math.PI;

    }


    if (
        selectedGraph ===
        "omega"
    ) {

        value =
            omega;

    }


    if (
        selectedGraph ===
        "velocity"
    ) {

        value =
            Math.abs(
                velocity
            );

    }


    graphCurrentValue.textContent =
        value.toFixed(2) +
        " " +
        settings.unit;

}


/* ========================================
   DRAW GRAPH
======================================== */

function drawGraph() {

    const width =
        graphCanvas.clientWidth;

    const height =
        graphCanvas.clientHeight;


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
        graphData.length <
        2
    ) {

        return;

    }


    const settings =
        graphSettings[
            selectedGraph
        ];


    const padding = {

        left: 65,

        right: 25,

        top: 30,

        bottom: 48

    };


    const chartWidth =
        width -
        padding.left -
        padding.right;


    const chartHeight =
        height -
        padding.top -
        padding.bottom;


    const values =
        graphData.map(
            point =>
                point[
                    selectedGraph
                ]
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
        minValue ===
        maxValue
    ) {

        minValue -= 1;

        maxValue += 1;

    }


    const valueRange =
        maxValue -
        minValue;


    minValue -=
        valueRange * 0.1;

    maxValue +=
        valueRange * 0.1;


    const maxTime =
        graphData[
            graphData.length - 1
        ].time;


    /* GRID */

    graphCtx.strokeStyle =
        "#e2e8f0";

    graphCtx.lineWidth =
        1;


    for (
        let i = 0;
        i <= 5;
        i++
    ) {

        const y =
            padding.top +
            chartHeight *
            i /
            5;


        graphCtx.beginPath();

        graphCtx.moveTo(
            padding.left,
            y
        );

        graphCtx.lineTo(
            width -
            padding.right,
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
            padding.left +
            chartWidth *
            i /
            5;


        graphCtx.beginPath();

        graphCtx.moveTo(
            x,
            padding.top
        );

        graphCtx.lineTo(
            x,
            height -
            padding.bottom
        );

        graphCtx.stroke();

    }


    /* AXES */

    graphCtx.strokeStyle =
        "#64748b";

    graphCtx.lineWidth =
        2;


    graphCtx.beginPath();

    graphCtx.moveTo(
        padding.left,
        padding.top
    );

    graphCtx.lineTo(
        padding.left,
        height -
        padding.bottom
    );

    graphCtx.lineTo(
        width -
        padding.right,
        height -
        padding.bottom
    );

    graphCtx.stroke();


    /* ZERO LINE */

    if (
        minValue < 0 &&
        maxValue > 0
    ) {

        const zeroY =
            padding.top +
            (
                1 -
                (
                    (
                        0 -
                        minValue
                    ) /
                    (
                        maxValue -
                        minValue
                    )
                )
            ) *
            chartHeight;


        graphCtx.save();

        graphCtx.setLineDash([
            5,
            5
        ]);

        graphCtx.strokeStyle =
            "#94a3b8";

        graphCtx.lineWidth =
            1;


        graphCtx.beginPath();

        graphCtx.moveTo(
            padding.left,
            zeroY
        );

        graphCtx.lineTo(
            width -
            padding.right,
            zeroY
        );

        graphCtx.stroke();

        graphCtx.restore();

    }


    /* GRAPH LINE */

    graphCtx.strokeStyle =
        "#2563eb";

    graphCtx.lineWidth =
        3;

    graphCtx.lineJoin =
        "round";

    graphCtx.lineCap =
        "round";


    graphCtx.beginPath();


    graphData.forEach(
        (
            point,
            index
        ) => {

            const x =
                padding.left +
                (
                    point.time /
                    Math.max(
                        maxTime,
                        0.01
                    )
                ) *
                chartWidth;


            const y =
                padding.top +
                (
                    1 -
                    (
                        (
                            point[
                                selectedGraph
                            ] -
                            minValue
                        ) /
                        (
                            maxValue -
                            minValue
                        )
                    )
                ) *
                chartHeight;


            if (
                index === 0
            ) {

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


    /* CURRENT POINT */

    const last =
        graphData[
            graphData.length - 1
        ];


    const pointX =
        padding.left +
        (
            last.time /
            Math.max(
                maxTime,
                0.01
            )
        ) *
        chartWidth;


    const pointY =
        padding.top +
        (
            1 -
            (
                (
                    last[
                        selectedGraph
                    ] -
                    minValue
                ) /
                (
                    maxValue -
                    minValue
                )
            )
        ) *
        chartHeight;


    /* GLOW */

    const pointGlow =
        graphCtx.createRadialGradient(
            pointX,
            pointY,
            1,
            pointX,
            pointY,
            16
        );


    pointGlow.addColorStop(
        0,
        "rgba(37,99,235,0.35)"
    );

    pointGlow.addColorStop(
        1,
        "rgba(37,99,235,0)"
    );


    graphCtx.fillStyle =
        pointGlow;


    graphCtx.beginPath();

    graphCtx.arc(
        pointX,
        pointY,
        16,
        0,
        Math.PI * 2
    );

    graphCtx.fill();


    graphCtx.fillStyle =
        "#1d4ed8";


    graphCtx.beginPath();

    graphCtx.arc(
        pointX,
        pointY,
        5,
        0,
        Math.PI * 2
    );

    graphCtx.fill();


    /* LABELS */

    graphCtx.fillStyle =
        "#64748b";

    graphCtx.font =
        "12px Arial";


    graphCtx.fillText(
        "t (s)",
        width - 50,
        height - 15
    );


    graphCtx.fillText(
        settings.title,
        10,
        18
    );


    graphCtx.fillText(
        maxTime.toFixed(1),
        width - 55,
        height - 28
    );

}


/* ========================================
   START
======================================== */

function startSimulation() {

    simulationTime =
        0;

    graphData =
        [];


    historySaved =
        false;


    running =
        true;

    paused =
        false;

    lastTimestamp =
        null;


    graphEmpty.textContent =
        "กำลังจำลองการแกว่ง...";


    statusDot.className =
        "status-dot running";

    statusText.textContent =
        "Running";


    startButton.disabled =
        true;

    pauseButton.disabled =
        false;

    resumeButton.disabled =
        true;


    collectGraphData();

    updateRealtime();

    drawPendulum();

    drawGraph();


    animationFrame =
        requestAnimationFrame(
            animate
        );

}


/* ========================================
   PAUSE
======================================== */

function pauseSimulation() {

    if (
        !running
    ) {

        return;

    }


    running =
        false;

    paused =
        true;


    cancelAnimationFrame(
        animationFrame
    );


    statusDot.className =
        "status-dot paused";

    statusText.textContent =
        "Paused";


    pauseButton.disabled =
        true;

    resumeButton.disabled =
        false;

}


/* ========================================
   RESUME
======================================== */

function resumeSimulation() {

    if (
        !paused
    ) {

        return;

    }


    running =
        true;

    paused =
        false;

    lastTimestamp =
        null;


    statusDot.className =
        "status-dot running";

    statusText.textContent =
        "Running";


    pauseButton.disabled =
        false;

    resumeButton.disabled =
        true;


    animationFrame =
        requestAnimationFrame(
            animate
        );

}




/* ========================================
   RESET
======================================== */

function resetSimulation() {

    /*
       ถ้ามีการจำลองเกิดขึ้นแล้ว
       และยังไม่ได้บันทึก History
       ให้บันทึกก่อน Reset
    */

    if (
        simulationTime > 0 &&
        !historySaved
    ) {

        saveToHistory();

    }


    running =
        false;

    paused =
        false;

    simulationTime =
        0;

    graphData =
        [];

    lastTimestamp =
        null;


    cancelAnimationFrame(
        animationFrame
    );


    statusDot.className =
        "status-dot";

    statusText.textContent =
        "Ready";


    startButton.disabled =
        false;

    pauseButton.disabled =
        true;

    resumeButton.disabled =
        true;


    graphEmpty.textContent =
        "กด Start เพื่อเริ่มเก็บข้อมูลสำหรับกราฟ";


    updateRealtime();

    drawPendulum();

    drawGraph();

}

/* ========================================
   ANIMATION
======================================== */

function animate(timestamp) {

    /*
       ถ้าไม่ได้อยู่ในสถานะ Running
       ให้หยุด animation
    */

    if (
        !running
    ) {

        return;

    }


    /*
       กำหนด timestamp ครั้งแรก
    */

    if (
        lastTimestamp ===
        null
    ) {

        lastTimestamp =
            timestamp;

    }


    /*
       คำนวณเวลาที่ผ่านไป
    */

    let deltaTime =
        (
            timestamp -
            lastTimestamp
        ) /
        1000;


    lastTimestamp =
        timestamp;


    /*
       ป้องกันการกระโดดของเวลา
       หาก Browser ช้าหรือ Tab ถูกพัก
    */

    deltaTime =
        Math.min(
            deltaTime,
            0.05
        );


    /*
       เพิ่มเวลาการจำลอง
    */

    simulationTime +=
        deltaTime;


    /*
       เก็บข้อมูลกราฟ
    */

    collectGraphData();


    /*
       อัปเดตค่าต่าง ๆ
    */

    updateRealtime();


    /*
       วาดลูกตุ้มใหม่
    */

    drawPendulum();


    /*
       วาดกราฟใหม่
    */

    drawGraph();


    /*
       สำคัญ:
       ไม่มีการกำหนดเวลาสิ้นสุดแล้ว

       Simulation จะทำงานต่อไปเรื่อย ๆ
       จนกว่าผู้ใช้จะกด Pause หรือ Reset
    */

    animationFrame =
        requestAnimationFrame(
            animate
        );

}



/* ========================================
   GRAPH BUTTONS
======================================== */

graphButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            function () {

                graphButtons.forEach(
                    btn =>
                        btn.classList.remove(
                            "active"
                        )
                );


                this.classList.add(
                    "active"
                );


                selectedGraph =
                    this.dataset.graph;


                updateRealtime();

                drawGraph();

            }
        );

    }
);


/* ========================================
   INPUT EVENTS
======================================== */

lengthInput.addEventListener(
    "input",
    updatePhysics
);


massInput.addEventListener(
    "input",
    updatePhysics
);


angleInput.addEventListener(
    "input",
    updatePhysics
);


gravityInput.addEventListener(
    "input",
    updatePhysics
);


/* ========================================
   BUTTON EVENTS
======================================== */

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


/* ========================================
   WINDOW RESIZE
======================================== */

window.addEventListener(
    "resize",
    function () {

        resizeCanvas();

        resizeGraphCanvas();

    }
);


/* ========================================
   INITIALIZE
======================================== */

updateDisplays();

updateResults();

updateRealtime();

resizeCanvas();

resizeGraphCanvas();