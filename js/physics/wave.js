/* ========================================
   WAVE SIMULATION
   ENGI HUB
======================================== */


/* ========================================
   DOM
======================================== */

const simulationCanvas =
    document.getElementById(
        "simulationCanvas"
    );

const graphCanvas =
    document.getElementById(
        "graphCanvas"
    );


const amplitudeInput =
    document.getElementById(
        "amplitude"
    );

const frequencyInput =
    document.getElementById(
        "frequency"
    );

const wavelengthInput =
    document.getElementById(
        "wavelength"
    );

const phaseInput =
    document.getElementById(
        "phase"
    );


const amplitudeValue =
    document.getElementById(
        "amplitudeValue"
    );

const frequencyValue =
    document.getElementById(
        "frequencyValue"
    );

const wavelengthValue =
    document.getElementById(
        "wavelengthValue"
    );

const phaseValue =
    document.getElementById(
        "phaseValue"
    );


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


const statusDot =
    document.getElementById(
        "statusDot"
    );

const statusText =
    document.getElementById(
        "statusText"
    );


const realtimeTime =
    document.getElementById(
        "realtimeTime"
    );

const realtimeDisplacement =
    document.getElementById(
        "realtimeDisplacement"
    );

const realtimeSpeed =
    document.getElementById(
        "realtimeSpeed"
    );

const realtimeAngular =
    document.getElementById(
        "realtimeAngular"
    );


const speedResult =
    document.getElementById(
        "speedResult"
    );

const periodResult =
    document.getElementById(
        "periodResult"
    );

const angularResult =
    document.getElementById(
        "angularResult"
    );

const waveNumberResult =
    document.getElementById(
        "waveNumberResult"
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


const graphButtons =
    document.querySelectorAll(
        ".graph-button"
    );


/* ========================================
   CANVAS
======================================== */

const simulationCtx =
    simulationCanvas.getContext(
        "2d"
    );

const graphCtx =
    graphCanvas.getContext(
        "2d"
    );


/* ========================================
   VARIABLES
======================================== */

let amplitude = 1;

let frequency = 1;

let wavelength = 4;

let phase = 0;


let time = 0;

let animationId = null;

let lastTimestamp = null;


let isRunning = false;

let isPaused = false;


let hasSimulated = false;

let historySaved = false;


let selectedGraph = "wave";

let graphData = [];


/* ========================================
   FORMAT
======================================== */

function formatNumber(
    value,
    digits
) {

    if (!Number.isFinite(value)) {
        return "0.00";
    }

    return value.toFixed(digits);
}


/* ========================================
   READ INPUTS
======================================== */

function readInputs() {

    amplitude =
        Number(
            amplitudeInput.value
        );

    frequency =
        Number(
            frequencyInput.value
        );

    wavelength =
        Number(
            wavelengthInput.value
        );

    phase =
        Number(
            phaseInput.value
        );


    if (
        !Number.isFinite(amplitude) ||
        amplitude <= 0
    ) {

        amplitude = 1;

        amplitudeInput.value = "1";
    }


    if (
        !Number.isFinite(frequency) ||
        frequency <= 0
    ) {

        frequency = 1;

        frequencyInput.value = "1";
    }


    if (
        !Number.isFinite(wavelength) ||
        wavelength <= 0
    ) {

        wavelength = 4;

        wavelengthInput.value = "4";
    }


    if (!Number.isFinite(phase)) {

        phase = 0;

        phaseInput.value = "0";
    }
}


/* ========================================
   UPDATE INPUT DISPLAY
======================================== */

function updateInputDisplay() {

    amplitudeValue.textContent =
        formatNumber(
            Number(
                amplitudeInput.value
            ),
            2
        ) +
        " m";


    frequencyValue.textContent =
        formatNumber(
            Number(
                frequencyInput.value
            ),
            2
        ) +
        " Hz";


    wavelengthValue.textContent =
        formatNumber(
            Number(
                wavelengthInput.value
            ),
            2
        ) +
        " m";


    phaseValue.textContent =
        formatNumber(
            Number(
                phaseInput.value
            ),
            0
        ) +
        "°";
}


/* ========================================
   CALCULATE RESULTS
======================================== */

function calculateResults() {

    readInputs();


    const waveSpeed =
        frequency *
        wavelength;


    const period =
        1 /
        frequency;


    const angularFrequency =
        2 *
        Math.PI *
        frequency;


    const waveNumber =
        2 *
        Math.PI /
        wavelength;


    speedResult.textContent =
        formatNumber(
            waveSpeed,
            3
        ) +
        " m/s";


    periodResult.textContent =
        formatNumber(
            period,
            3
        ) +
        " s";


    angularResult.textContent =
        formatNumber(
            angularFrequency,
            3
        ) +
        " rad/s";


    waveNumberResult.textContent =
        formatNumber(
            waveNumber,
            3
        ) +
        " rad/m";
}


/* ========================================
   STATUS
======================================== */

function setStatus(
    type,
    text
) {

    statusText.textContent =
        text;


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
   BUTTON STATE
======================================== */

function updateButtonState() {

    startButton.disabled =
        isRunning;


    pauseButton.disabled =
        !isRunning ||
        isPaused;


    resumeButton.disabled =
        !isRunning ||
        !isPaused;


    resetButton.disabled =
        false;
}


/* ========================================
   START
======================================== */

function startSimulation() {

    if (
        isRunning &&
        !isPaused
    ) {

        return;
    }


    readInputs();


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

    if (!isRunning) {
        return;
    }


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
        "Wave Simulation Paused"
    );
}


/* ========================================
   RESUME
======================================== */

function resumeSimulation() {

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
        "Wave Simulation Resumed"
    );
}


/* ========================================
   RESET
======================================== */

function resetSimulation() {

    saveToHistory();


    cancelAnimationFrame(
        animationId
    );


    animationId = null;


    readInputs();


    time = 0;


    graphData = [];


    isRunning = false;

    isPaused = false;


    realtimeTime.textContent =
        "0.00 s";


    realtimeDisplacement.textContent =
        "0.00 m";


    realtimeSpeed.textContent =
        formatNumber(
            frequency *
            wavelength,
            3
        ) +
        " m/s";


    realtimeAngular.textContent =
        formatNumber(
            2 *
            Math.PI *
            frequency,
            3
        ) +
        " rad/s";


    setStatus(
        "ready",
        "พร้อมเริ่มการจำลอง"
    );


    updateButtonState();


    drawSimulation();

    drawGraph();


    console.log(
        "Wave Simulation Reset"
    );
}


/* ========================================
   ANIMATION
======================================== */

function animationLoop(
    timestamp
) {

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
        ) /
        1000;


    lastTimestamp =
        timestamp;


    if (deltaTime > 0.05) {

        deltaTime = 0.05;
    }


    time +=
        deltaTime;


    updateRealtime();


    updateGraphData();


    drawSimulation();

    drawGraph();


    animationId =
        requestAnimationFrame(
            animationLoop
        );
}


/* ========================================
   REALTIME
======================================== */

function updateRealtime() {

    const angularFrequency =
        2 *
        Math.PI *
        frequency;


    const waveNumber =
        2 *
        Math.PI /
        wavelength;


    const x = 0;


    const phaseRadians =
        phase *
        Math.PI /
        180;


    const currentDisplacement =
        amplitude *
        Math.sin(
            waveNumber * x
            -
            angularFrequency * time
            +
            phaseRadians
        );


    const particleVelocity =
        -amplitude *
        angularFrequency *
        Math.cos(
            waveNumber * x
            -
            angularFrequency * time
            +
            phaseRadians
        );


    realtimeTime.textContent =
        formatNumber(
            time,
            2
        ) +
        " s";


    realtimeDisplacement.textContent =
        formatNumber(
            currentDisplacement,
            3
        ) +
        " m";


    realtimeSpeed.textContent =
        formatNumber(
            frequency *
            wavelength,
            3
        ) +
        " m/s";


    realtimeAngular.textContent =
        formatNumber(
            angularFrequency,
            3
        ) +
        " rad/s";
}


/* ========================================
   GRAPH DATA
======================================== */

function updateGraphData() {

    const angularFrequency =
        2 *
        Math.PI *
        frequency;


    const waveNumber =
        2 *
        Math.PI /
        wavelength;


    const phaseRadians =
        phase *
        Math.PI /
        180;


    const x = 0;


    const wave =
        amplitude *
        Math.sin(
            waveNumber * x
            -
            angularFrequency * time
            +
            phaseRadians
        );


    const particleVelocity =
        -amplitude *
        angularFrequency *
        Math.cos(
            waveNumber * x
            -
            angularFrequency * time
            +
            phaseRadians
        );


    graphData.push({

        time:
            time,

        wave:
            wave,

        velocity:
            particleVelocity
    });


    if (
        graphData.length >
        1000
    ) {

        graphData.shift();
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


    const amplitudePixels =
        Math.min(
            120,
            amplitude * 90
        );


    const waveLengthPixels =
        Math.max(
            80,
            wavelength * 100
        );


    const angularFrequency =
        2 *
        Math.PI *
        frequency;


    const waveNumber =
        2 *
        Math.PI /
        wavelength;


    const phaseRadians =
        phase *
        Math.PI /
        180;


    /* ========================================
       GRID
    ======================================== */

    simulationCtx.strokeStyle =
        "#e2e8f0";

    simulationCtx.lineWidth = 1;


    simulationCtx.beginPath();

    simulationCtx.moveTo(
        0,
        centerY
    );

    simulationCtx.lineTo(
        width,
        centerY
    );

    simulationCtx.stroke();


    /* ========================================
       WAVE
    ======================================== */

    simulationCtx.strokeStyle =
        "#2563eb";

    simulationCtx.lineWidth = 4;


    simulationCtx.beginPath();


    for (
        let pixelX = 0;
        pixelX <= width;
        pixelX += 2
    ) {

        const x =
            (
                pixelX -
                width / 2
            ) /
            100;


        const y =
            amplitudePixels *
            Math.sin(
                waveNumber * x
                -
                angularFrequency * time
                +
                phaseRadians
            );


        const canvasY =
            centerY -
            y;


        if (pixelX === 0) {

            simulationCtx.moveTo(
                pixelX,
                canvasY
            );

        } else {

            simulationCtx.lineTo(
                pixelX,
                canvasY
            );
        }
    }


    simulationCtx.stroke();


    /* ========================================
       EQUILIBRIUM LABEL
    ======================================== */

    simulationCtx.fillStyle =
        "#64748b";

    simulationCtx.font =
        "14px Arial";

    simulationCtx.textAlign =
        "left";


    simulationCtx.fillText(
        "Equilibrium",
        15,
        centerY - 10
    );


    /* ========================================
       WAVELENGTH MARKER
    ======================================== */

    const markerY =
        centerY + 150;


    simulationCtx.strokeStyle =
        "#94a3b8";

    simulationCtx.lineWidth = 2;


    simulationCtx.beginPath();

    simulationCtx.moveTo(
        width / 2,
        markerY
    );

    simulationCtx.lineTo(
        width / 2 +
        waveLengthPixels,
        markerY
    );

    simulationCtx.stroke();


    simulationCtx.beginPath();

    simulationCtx.moveTo(
        width / 2,
        markerY - 8
    );

    simulationCtx.lineTo(
        width / 2,
        markerY + 8
    );

    simulationCtx.moveTo(
        width / 2 +
        waveLengthPixels,
        markerY - 8
    );

    simulationCtx.lineTo(
        width / 2 +
        waveLengthPixels,
        markerY + 8
    );

    simulationCtx.stroke();


    simulationCtx.fillStyle =
        "#475569";

    simulationCtx.textAlign =
        "center";


    simulationCtx.fillText(
        "λ = " +
        formatNumber(
            wavelength,
            2
        ) +
        " m",
        width / 2 +
        waveLengthPixels / 2,
        markerY + 25
    );


    /* ========================================
       AMPLITUDE MARKER
    ======================================== */

    const markerX =
        55;


    simulationCtx.strokeStyle =
        "#94a3b8";


    simulationCtx.beginPath();

    simulationCtx.moveTo(
        markerX,
        centerY
    );

    simulationCtx.lineTo(
        markerX,
        centerY -
        amplitudePixels
    );

    simulationCtx.stroke();


    simulationCtx.fillStyle =
        "#475569";

    simulationCtx.textAlign =
        "left";


    simulationCtx.fillText(
        "A = " +
        formatNumber(
            amplitude,
            2
        ) +
        " m",
        markerX + 8,
        centerY -
        amplitudePixels / 2
    );
}


/* ========================================
   DRAW GRAPH
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


    if (
        graphData.length < 2
    ) {

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
        "Wave";


    let unit =
        "m";


    if (
        selectedGraph ===
        "velocity"
    ) {

        label =
            "Particle Velocity";

        unit =
            "m/s";
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
        minValue ===
        maxValue
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


    /* ZERO */

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


    const waveSpeed =
        frequency *
        wavelength;


    const period =
        1 /
        frequency;


    const angularFrequency =
        2 *
        Math.PI *
        frequency;


    const waveNumber =
        2 *
        Math.PI /
        wavelength;


    const historyItem = {

        icon:
            "🌊",

        title:
            "Wave Simulation",

        calculation:

            "A = " +
            amplitude.toFixed(2) +
            " m | " +

            "f = " +
            frequency.toFixed(2) +
            " Hz | " +

            "λ = " +
            wavelength.toFixed(2) +
            " m | " +

            "v = " +
            waveSpeed.toFixed(2) +
            " m/s",

        time:
            new Date().toLocaleString(
                "th-TH"
            ),

        tool:
            "Wave Simulation",

        category:
            "Physics Simulation",

        date:
            new Date().toISOString(),

        timestamp:
            Date.now(),


        input: {

            amplitude:
                Number(
                    amplitude.toFixed(2)
                ),

            frequency:
                Number(
                    frequency.toFixed(2)
                ),

            wavelength:
                Number(
                    wavelength.toFixed(2)
                ),

            phase:
                Number(
                    phase.toFixed(0)
                )
        },


        result: {

            waveSpeed:
                Number(
                    waveSpeed.toFixed(3)
                ),

            period:
                Number(
                    period.toFixed(3)
                ),

            angularFrequency:
                Number(
                    angularFrequency.toFixed(3)
                ),

            waveNumber:
                Number(
                    waveNumber.toFixed(3)
                )
        }
    };


    history.unshift(
        historyItem
    );


    if (
        history.length > 100
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
            "Wave Simulation History Saved",
            historyItem
        );

    } catch (error) {

        console.error(
            "ไม่สามารถบันทึก Wave History ได้",
            error
        );
    }
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
                    "wave";


                drawGraph();
            }
        );
    }
);


/* ========================================
   INPUT EVENTS
======================================== */

amplitudeInput.addEventListener(
    "input",
    function() {

        updateInputDisplay();

        calculateResults();


        if (!isRunning) {

            resetSimulation();
        }
    }
);


frequencyInput.addEventListener(
    "input",
    function() {

        updateInputDisplay();

        calculateResults();


        if (!isRunning) {

            resetSimulation();
        }
    }
);


wavelengthInput.addEventListener(
    "input",
    function() {

        updateInputDisplay();

        calculateResults();


        if (!isRunning) {

            resetSimulation();
        }
    }
);


phaseInput.addEventListener(
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
            300,
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


    time = 0;

    graphData = [];


    realtimeTime.textContent =
        "0.00 s";


    realtimeDisplacement.textContent =
        "0.00 m";


    realtimeSpeed.textContent =
        formatNumber(
            frequency *
            wavelength,
            3
        ) +
        " m/s";


    realtimeAngular.textContent =
        formatNumber(
            2 *
            Math.PI *
            frequency,
            3
        ) +
        " rad/s";


    setStatus(
        "ready",
        "พร้อมเริ่มการจำลอง"
    );


    updateButtonState();


    resizeCanvas();


    window.addEventListener(
        "resize",
        resizeCanvas
    );


    console.log(
        "Wave Simulation initialized successfully."
    );
}


initialize();