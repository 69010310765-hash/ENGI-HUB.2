/* ========================================
   SPRING-MASS SIMULATION
   ENGI HUB
======================================== */


/* ========================================
   DOM
======================================== */

const simulationCanvas =
    document.getElementById("simulationCanvas");

const graphCanvas =
    document.getElementById("graphCanvas");


const massInput =
    document.getElementById("mass");

const springInput =
    document.getElementById("spring");

const displacementInput =
    document.getElementById("displacement");

const velocityInput =
    document.getElementById("velocity");


const massValue =
    document.getElementById("massValue");

const springValue =
    document.getElementById("springValue");

const displacementValue =
    document.getElementById("displacementValue");

const velocityValue =
    document.getElementById("velocityValue");


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

const realtimeDisplacement =
    document.getElementById("realtimeDisplacement");

const realtimeVelocity =
    document.getElementById("realtimeVelocity");

const realtimeAcceleration =
    document.getElementById("realtimeAcceleration");


const periodResult =
    document.getElementById("periodResult");

const frequencyResult =
    document.getElementById("frequencyResult");

const angularResult =
    document.getElementById("angularResult");

const maxVelocityResult =
    document.getElementById("maxVelocityResult");

const maxAccelerationResult =
    document.getElementById("maxAccelerationResult");

const energyResult =
    document.getElementById("energyResult");


const graphCurrentTitle =
    document.getElementById("graphCurrentTitle");

const graphCurrentValue =
    document.getElementById("graphCurrentValue");

const graphEmpty =
    document.getElementById("graphEmpty");


const graphButtons =
    document.querySelectorAll(".graph-button");


/* ========================================
   CANVAS
======================================== */

const simulationCtx =
    simulationCanvas.getContext("2d");

const graphCtx =
    graphCanvas.getContext("2d");


/* ========================================
   VARIABLES
======================================== */

let mass = 1;

let springConstant = 20;

let initialDisplacement = 0.5;

let initialVelocity = 0;


let displacement = 0.5;

let velocity = 0;

let acceleration = 0;


let time = 0;

let animationId = null;

let lastTimestamp = null;


let isRunning = false;

let isPaused = false;


/* ========================================
   HISTORY
======================================== */

let hasSimulated = false;

let historySaved = false;


/* ========================================
   GRAPH
======================================== */

let selectedGraph = "displacement";

let graphData = [];


/* ========================================
   FORMAT
======================================== */

function formatNumber(value, digits) {

    if (!Number.isFinite(value)) {
        return "0.00";
    }

    return value.toFixed(digits);
}


/* ========================================
   READ INPUT
======================================== */

function readInputs() {

    mass = Number(massInput.value);

    springConstant =
        Number(springInput.value);

    initialDisplacement =
        Number(displacementInput.value);

    initialVelocity =
        Number(velocityInput.value);


    if (!Number.isFinite(mass) || mass <= 0) {

        mass = 1;

        massInput.value = "1";
    }


    if (
        !Number.isFinite(springConstant) ||
        springConstant <= 0
    ) {

        springConstant = 20;

        springInput.value = "20";
    }


    if (!Number.isFinite(initialDisplacement)) {

        initialDisplacement = 0.5;

        displacementInput.value = "0.5";
    }


    if (!Number.isFinite(initialVelocity)) {

        initialVelocity = 0;

        velocityInput.value = "0";
    }
}


/* ========================================
   INPUT DISPLAY
======================================== */

function updateInputDisplay() {

    massValue.textContent =
        formatNumber(
            Number(massInput.value),
            2
        ) + " kg";


    springValue.textContent =
        formatNumber(
            Number(springInput.value),
            2
        ) + " N/m";


    displacementValue.textContent =
        formatNumber(
            Number(displacementInput.value),
            2
        ) + " m";


    velocityValue.textContent =
        formatNumber(
            Number(velocityInput.value),
            2
        ) + " m/s";
}


/* ========================================
   CALCULATE RESULTS
======================================== */

function calculateResults() {

    readInputs();


    const omega =
        Math.sqrt(
            springConstant / mass
        );


    const period =
        2 *
        Math.PI *
        Math.sqrt(
            mass / springConstant
        );


    const frequency =
        1 / period;


    const amplitude =
        Math.sqrt(
            initialDisplacement *
            initialDisplacement
            +
            Math.pow(
                initialVelocity / omega,
                2
            )
        );


    const maxVelocity =
        omega * amplitude;


    const maxAcceleration =
        omega *
        omega *
        amplitude;


    const energy =
        0.5 *
        springConstant *
        initialDisplacement *
        initialDisplacement
        +
        0.5 *
        mass *
        initialVelocity *
        initialVelocity;


    periodResult.textContent =
        formatNumber(period, 3) +
        " s";


    frequencyResult.textContent =
        formatNumber(frequency, 3) +
        " Hz";


    angularResult.textContent =
        formatNumber(omega, 3) +
        " rad/s";


    maxVelocityResult.textContent =
        formatNumber(maxVelocity, 3) +
        " m/s";


    maxAccelerationResult.textContent =
        formatNumber(maxAcceleration, 3) +
        " m/s²";


    energyResult.textContent =
        formatNumber(energy, 3) +
        " J";
}


/* ========================================
   STATUS
======================================== */

function setStatus(type, text) {

    statusText.textContent = text;


    statusDot.classList.remove(
        "running",
        "paused",
        "ready"
    );


    if (type === "running") {

        statusDot.classList.add(
            "running"
        );
    }


    if (type === "paused") {

        statusDot.classList.add(
            "paused"
        );
    }


    if (type === "ready") {

        statusDot.classList.add(
            "ready"
        );
    }
}


/* ========================================
   UPDATE BUTTON STATE
======================================== */

function updateButtonState() {

    /*
       Start:
       เปิดเมื่อไม่ได้กำลังจำลอง
    */

    startButton.disabled =
        isRunning;


    /*
       Pause:
       เปิดเฉพาะตอนกำลังเล่น
    */

    pauseButton.disabled =
        !isRunning ||
        isPaused;


    /*
       Resume:
       เปิดเฉพาะตอน Pause
    */

    resumeButton.disabled =
        !isRunning ||
        !isPaused;


    /*
       Reset:
       เปิดตลอด
    */

    resetButton.disabled = false;
}


/* ========================================
   START
======================================== */

function startSimulation() {

    /*
       ถ้ากำลังเล่นอยู่
       ไม่ต้อง Start ซ้ำ
    */

    if (isRunning && !isPaused) {
        return;
    }


    readInputs();


    /*
       ถ้าเป็นการเริ่มใหม่
    */

    displacement =
        initialDisplacement;

    velocity =
        initialVelocity;


    acceleration =
        -(
            springConstant / mass
        ) *
        displacement;


    time = 0;

    graphData = [];


    isRunning = true;

    isPaused = false;


    hasSimulated = true;

    historySaved = false;


    lastTimestamp = null;


    setStatus(
        "running",
        "กำลังจำลอง"
    );


    updateButtonState();


    cancelAnimationFrame(
        animationId
    );


    animationId =
        requestAnimationFrame(
            animationLoop
        );
}


/* ========================================
   PAUSE
======================================== */

function pauseSimulation() {

    /*
       ต้องกำลัง Run เท่านั้น
    */

    if (!isRunning) {
        return;
    }


    /*
       ถ้า Pause ไปแล้ว
       ไม่ต้องทำซ้ำ
    */

    if (isPaused) {
        return;
    }


    isPaused = true;


    cancelAnimationFrame(
        animationId
    );


    animationId = null;

    lastTimestamp = null;


    setStatus(
        "paused",
        "หยุดชั่วคราว"
    );


    updateButtonState();


    console.log(
        "Spring-Mass Simulation Paused"
    );
}


/* ========================================
   RESUME
======================================== */

function resumeSimulation() {

    /*
       ต้องกำลัง Run และอยู่ในสถานะ Pause
    */

    if (!isRunning) {
        return;
    }


    if (!isPaused) {
        return;
    }


    isPaused = false;


    lastTimestamp = null;


    setStatus(
        "running",
        "กำลังจำลอง"
    );


    updateButtonState();


    cancelAnimationFrame(
        animationId
    );


    animationId =
        requestAnimationFrame(
            animationLoop
        );


    console.log(
        "Spring-Mass Simulation Resumed"
    );
}


/* ========================================
   RESET
======================================== */

function resetSimulation() {

    /*
       บันทึก History ก่อน Reset
    */

    saveToHistory();


    cancelAnimationFrame(
        animationId
    );


    animationId = null;


    readInputs();


    displacement =
        initialDisplacement;

    velocity =
        initialVelocity;


    acceleration =
        -(
            springConstant / mass
        ) *
        displacement;


    time = 0;


    lastTimestamp = null;


    isRunning = false;

    isPaused = false;


    graphData = [];


    realtimeTime.textContent =
        "0.00 s";


    realtimeDisplacement.textContent =
        formatNumber(
            displacement,
            3
        ) + " m";


    realtimeVelocity.textContent =
        formatNumber(
            velocity,
            3
        ) + " m/s";


    realtimeAcceleration.textContent =
        formatNumber(
            acceleration,
            3
        ) + " m/s²";


    setStatus(
        "ready",
        "พร้อมเริ่มการจำลอง"
    );


    updateButtonState();


    drawSimulation();

    drawGraph();


    console.log(
        "Spring-Mass Simulation Reset"
    );
}


/* ========================================
   ANIMATION
======================================== */

function animationLoop(timestamp) {

    if (!isRunning) {
        return;
    }


    if (isPaused) {
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


    if (deltaTime > 0.05) {

        deltaTime = 0.05;
    }


    updatePhysics(
        deltaTime
    );


    drawSimulation();

    drawGraph();


    animationId =
        requestAnimationFrame(
            animationLoop
        );
}


/* ========================================
   PHYSICS
======================================== */

function updatePhysics(deltaTime) {

    const springAcceleration =
        -(
            springConstant / mass
        ) *
        displacement;


    velocity +=
        springAcceleration *
        deltaTime;


    displacement +=
        velocity *
        deltaTime;


    acceleration =
        -(
            springConstant / mass
        ) *
        displacement;


    time +=
        deltaTime;


    graphData.push({

        time:
            time,

        displacement:
            displacement,

        velocity:
            velocity,

        acceleration:
            acceleration
    });


    if (graphData.length > 1000) {

        graphData.shift();
    }


    realtimeTime.textContent =
        formatNumber(
            time,
            2
        ) + " s";


    realtimeDisplacement.textContent =
        formatNumber(
            displacement,
            3
        ) + " m";


    realtimeVelocity.textContent =
        formatNumber(
            velocity,
            3
        ) + " m/s";


    realtimeAcceleration.textContent =
        formatNumber(
            acceleration,
            3
        ) + " m/s²";
}


/* ========================================
   SAVE HISTORY
======================================== */

function saveToHistory() {

    if (!hasSimulated) {
        return;
    }


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

        history = [];
    }


    const omega =
        Math.sqrt(
            springConstant / mass
        );


    const period =
        2 *
        Math.PI *
        Math.sqrt(
            mass / springConstant
        );


    const frequency =
        1 / period;


    const amplitude =
        Math.sqrt(
            initialDisplacement *
            initialDisplacement
            +
            Math.pow(
                initialVelocity / omega,
                2
            )
        );


    const maxVelocity =
        omega * amplitude;


    const maxAcceleration =
        omega *
        omega *
        amplitude;


    const energy =
        0.5 *
        springConstant *
        initialDisplacement *
        initialDisplacement
        +
        0.5 *
        mass *
        initialVelocity *
        initialVelocity;


    const historyItem = {

        icon:
            "🌀",

        title:
            "Spring-Mass Simulation",

        calculation:

            "m = " +
            mass.toFixed(2) +
            " kg | " +

            "k = " +
            springConstant.toFixed(2) +
            " N/m | " +

            "x₀ = " +
            initialDisplacement.toFixed(2) +
            " m | " +

            "v₀ = " +
            initialVelocity.toFixed(2) +
            " m/s | " +

            "T = " +
            period.toFixed(2) +
            " s | " +

            "f = " +
            frequency.toFixed(2) +
            " Hz",

        time:
            new Date().toLocaleString(
                "th-TH"
            ),

        tool:
            "Spring-Mass Simulation",

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

            springConstant:
                Number(
                    springConstant.toFixed(2)
                ),

            displacement:
                Number(
                    initialDisplacement.toFixed(2)
                ),

            velocity:
                Number(
                    initialVelocity.toFixed(2)
                )
        },

        result: {

            period:
                Number(
                    period.toFixed(3)
                ),

            frequency:
                Number(
                    frequency.toFixed(3)
                ),

            angularFrequency:
                Number(
                    omega.toFixed(3)
                ),

            amplitude:
                Number(
                    amplitude.toFixed(3)
                ),

            maxVelocity:
                Number(
                    maxVelocity.toFixed(3)
                ),

            maxAcceleration:
                Number(
                    maxAcceleration.toFixed(3)
                ),

            energy:
                Number(
                    energy.toFixed(3)
                )
        }
    };


    history.unshift(
        historyItem
    );


    if (history.length > 100) {

        history =
            history.slice(0, 100);
    }


    try {

        localStorage.setItem(
            "engiHistory",
            JSON.stringify(
                history
            )
        );


        console.log(
            "Spring-Mass History Saved",
            historyItem
        );

    } catch (error) {

        console.error(
            "ไม่สามารถบันทึก History ได้",
            error
        );
    }
}


/* ========================================
   DRAW SIMULATION
======================================== */

function drawSimulation() {

    const width =
        simulationCanvas.width;

    const height =
        simulationCanvas.height;


    simulationCtx.clearRect(
        0,
        0,
        width,
        height
    );


    const centerY =
        height / 2;


    const wallX = 80;

    const scale = 150;


    const massX =
        wallX +
        180 +
        displacement *
        scale;


    /* WALL */

    simulationCtx.strokeStyle =
        "#334155";

    simulationCtx.lineWidth = 5;


    simulationCtx.beginPath();

    simulationCtx.moveTo(
        wallX,
        centerY - 100
    );

    simulationCtx.lineTo(
        wallX,
        centerY + 100
    );

    simulationCtx.stroke();


    /* WALL LINES */

    simulationCtx.strokeStyle =
        "#64748b";

    simulationCtx.lineWidth = 2;


    for (
        let y = centerY - 100;
        y < centerY + 100;
        y += 12
    ) {

        simulationCtx.beginPath();

        simulationCtx.moveTo(
            wallX - 15,
            y
        );

        simulationCtx.lineTo(
            wallX,
            y + 12
        );

        simulationCtx.stroke();
    }


    /* SPRING */

    drawSpring(
        wallX,
        centerY,
        massX - 25
    );


    /* MASS */

    simulationCtx.fillStyle =
        "#2563eb";


    simulationCtx.beginPath();

    simulationCtx.arc(
        massX,
        centerY,
        25,
        0,
        Math.PI * 2
    );

    simulationCtx.fill();


    simulationCtx.fillStyle =
        "#ffffff";

    simulationCtx.font =
        "bold 14px Arial";

    simulationCtx.textAlign =
        "center";

    simulationCtx.textBaseline =
        "middle";


    simulationCtx.fillText(
        "m",
        massX,
        centerY
    );


    /* EQUILIBRIUM */

    simulationCtx.strokeStyle =
        "#94a3b8";

    simulationCtx.lineWidth = 1;

    simulationCtx.setLineDash(
        [6, 6]
    );


    simulationCtx.beginPath();

    simulationCtx.moveTo(
        wallX + 180,
        centerY - 80
    );

    simulationCtx.lineTo(
        wallX + 180,
        centerY + 80
    );

    simulationCtx.stroke();


    simulationCtx.setLineDash([]);


    /* LABEL */

    simulationCtx.fillStyle =
        "#475569";

    simulationCtx.font =
        "14px Arial";

    simulationCtx.textAlign =
        "left";


    simulationCtx.fillText(
        "ตำแหน่งสมดุล",
        wallX + 190,
        centerY - 90
    );


    simulationCtx.fillText(
        "x = " +
        formatNumber(
            displacement,
            2
        ) +
        " m",
        massX + 35,
        centerY
    );
}


/* ========================================
   DRAW SPRING
======================================== */

function drawSpring(
    startX,
    centerY,
    endX
) {

    const coils = 14;


    const length =
        endX - startX;


    if (length <= 20) {
        return;
    }


    const step =
        length / coils;


    simulationCtx.strokeStyle =
        "#64748b";

    simulationCtx.lineWidth = 3;


    simulationCtx.beginPath();


    simulationCtx.moveTo(
        startX,
        centerY
    );


    for (
        let i = 0;
        i < coils;
        i++
    ) {

        const x1 =
            startX +
            i * step +
            step * 0.25;


        const x2 =
            startX +
            i * step +
            step * 0.75;


        const direction =
            i % 2 === 0
                ? -1
                : 1;


        simulationCtx.lineTo(
            x1,
            centerY +
            direction * 18
        );


        simulationCtx.lineTo(
            x2,
            centerY -
            direction * 18
        );
    }


    simulationCtx.lineTo(
        endX,
        centerY
    );


    simulationCtx.stroke();
}


/* ========================================
   GRAPH
======================================== */

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


    if (graphData.length < 2) {

        graphEmpty.style.display =
            "block";


        graphCurrentTitle.textContent =
            "ยังไม่มีข้อมูล";


        graphCurrentValue.textContent =
            "-";


        return;
    }


    graphEmpty.style.display =
        "none";


    let key =
        selectedGraph;


    let label =
        "Displacement";


    let unit =
        "m";


    if (
        selectedGraph === "velocity"
    ) {

        label =
            "Velocity";

        unit =
            "m/s";
    }


    if (
        selectedGraph === "acceleration"
    ) {

        label =
            "Acceleration";

        unit =
            "m/s²";
    }


    const values =
        graphData.map(
            function(item) {
                return item[key];
            }
        );


    let minValue =
        Math.min.apply(
            null,
            values
        );


    let maxValue =
        Math.max.apply(
            null,
            values
        );


    if (
        minValue === maxValue
    ) {

        minValue -= 1;

        maxValue += 1;
    }


    const padding = 45;


    const graphWidth =
        width -
        padding * 2;


    const graphHeight =
        height -
        padding * 2;


    /* GRID */

    graphCtx.strokeStyle =
        "#e2e8f0";

    graphCtx.lineWidth = 1;


    for (
        let i = 0;
        i <= 4;
        i++
    ) {

        const y =
            padding +
            (
                graphHeight / 4
            ) *
            i;


        graphCtx.beginPath();


        graphCtx.moveTo(
            padding,
            y
        );


        graphCtx.lineTo(
            width - padding,
            y
        );


        graphCtx.stroke();
    }


    /* ZERO LINE */

    if (
        minValue < 0 &&
        maxValue > 0
    ) {

        const zeroY =
            padding +
            (
                maxValue /
                (
                    maxValue -
                    minValue
                )
            ) *
            graphHeight;


        graphCtx.strokeStyle =
            "#94a3b8";


        graphCtx.beginPath();


        graphCtx.moveTo(
            padding,
            zeroY
        );


        graphCtx.lineTo(
            width - padding,
            zeroY
        );


        graphCtx.stroke();
    }


    /* CURVE */

    graphCtx.strokeStyle =
        "#2563eb";

    graphCtx.lineWidth = 3;


    graphCtx.beginPath();


    graphData.forEach(
        function(item, index) {

            const x =
                padding +
                (
                    index /
                    (
                        graphData.length - 1
                    )
                ) *
                graphWidth;


            const y =
                padding +
                (
                    (
                        maxValue -
                        item[key]
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


    graphCtx.stroke();


    const current =
        graphData[
            graphData.length - 1
        ][key];


    graphCurrentTitle.textContent =
        label;


    graphCurrentValue.textContent =
        formatNumber(
            current,
            3
        ) +
        " " +
        unit;
}


/* ========================================
   GRAPH BUTTONS
======================================== */

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
                    button.dataset.graph ||
                    "displacement";


                drawGraph();
            }
        );
    }
);


/* ========================================
   INPUT EVENTS
======================================== */

massInput.addEventListener(
    "input",
    function() {

        updateInputDisplay();

        calculateResults();


        if (!isRunning) {

            resetSimulation();
        }
    }
);


springInput.addEventListener(
    "input",
    function() {

        updateInputDisplay();

        calculateResults();


        if (!isRunning) {

            resetSimulation();
        }
    }
);


displacementInput.addEventListener(
    "input",
    function() {

        updateInputDisplay();

        calculateResults();


        if (!isRunning) {

            resetSimulation();
        }
    }
);


velocityInput.addEventListener(
    "input",
    function() {

        updateInputDisplay();

        calculateResults();


        if (!isRunning) {

            resetSimulation();
        }
    }
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
   RESIZE
======================================== */

function resizeCanvas() {

    const simulationRect =
        simulationCanvas.getBoundingClientRect();


    const graphRect =
        graphCanvas.getBoundingClientRect();


    simulationCanvas.width =
        Math.max(
            300,
            Math.floor(
                simulationRect.width
            )
        );


    simulationCanvas.height =
        Math.max(
            250,
            Math.floor(
                simulationRect.height
            )
        );


    graphCanvas.width =
        Math.max(
            300,
            Math.floor(
                graphRect.width
            )
        );


    graphCanvas.height =
        Math.max(
            250,
            Math.floor(
                graphRect.height
            )
        );


    drawSimulation();

    drawGraph();
}


/* ========================================
   INITIALIZE
======================================== */

function initialize() {

    updateInputDisplay();

    calculateResults();

    readInputs();


    displacement =
        initialDisplacement;

    velocity =
        initialVelocity;


    acceleration =
        -(
            springConstant / mass
        ) *
        displacement;


    setStatus(
        "ready",
        "พร้อมเริ่มการจำลอง"
    );


    realtimeTime.textContent =
        "0.00 s";


    realtimeDisplacement.textContent =
        formatNumber(
            displacement,
            3
        ) + " m";


    realtimeVelocity.textContent =
        formatNumber(
            velocity,
            3
        ) + " m/s";


    realtimeAcceleration.textContent =
        formatNumber(
            acceleration,
            3
        ) + " m/s²";


    resizeCanvas();


    updateButtonState();


    window.addEventListener(
        "resize",
        resizeCanvas
    );


    console.log(
        "Spring-Mass Simulation initialized successfully."
    );
}


initialize();