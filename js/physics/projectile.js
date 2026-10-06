document.addEventListener(
    "DOMContentLoaded",
    function () {

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


        const velocityInput =
            document.getElementById("initialVelocity");

        const angleInput =
            document.getElementById("launchAngle");

        const gravityInput =
            document.getElementById("gravity");


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

        const realtimeX =
            document.getElementById("realtimeX");

        const realtimeY =
            document.getElementById("realtimeY");

        const realtimeVx =
            document.getElementById("realtimeVx");

        const realtimeVy =
            document.getElementById("realtimeVy");

        const realtimeV =
            document.getElementById("realtimeV");


        const rangeResult =
            document.getElementById("rangeResult");

        const heightResult =
            document.getElementById("heightResult");

        const timeResult =
            document.getElementById("timeResult");


        const apexTime =
            document.getElementById("apexTime");

        const apexX =
            document.getElementById("apexX");

        const apexY =
            document.getElementById("apexY");


        const graphButtons =
            document.querySelectorAll(".graph-button");

        const graphCurrentTitle =
            document.getElementById("graphCurrentTitle");

        const graphCurrentValue =
            document.getElementById("graphCurrentValue");

        const graphEmpty =
            document.getElementById("graphEmpty");


        // ========================================
        // PHYSICS VARIABLES
        // ========================================

        let initialVelocity = 20;

        let launchAngle = 45;

        let gravity = 9.81;

        let vx0 = 0;

        let vy0 = 0;

        let totalTime = 0;

        let maxHeight = 0;

        let range = 0;

        let apexTimeValue = 0;

        let apexXValue = 0;

        let apexYValue = 0;


        // ========================================
        // SIMULATION STATE
        // ========================================

        let animationId = null;

        let simulationTime = 0;

        let lastTimestamp = null;

        let isRunning = false;

        let isPaused = false;

        let graphData = [];

        let selectedGraph = "x";


        // ========================================
        // HISTORY STATE
        // ========================================

        let historySaved = false;


        // ========================================
        // GRAPH SETTINGS
        // ========================================

        const graphSettings = {

            x: {
                title: "ตำแหน่ง X",
                unit: "m",
                color: "#2563eb"
            },

            y: {
                title: "ตำแหน่ง Y",
                unit: "m",
                color: "#16a34a"
            },

            vx: {
                title: "ความเร็ว Vx",
                unit: "m/s",
                color: "#dc2626"
            },

            vy: {
                title: "ความเร็ว Vy",
                unit: "m/s",
                color: "#9333ea"
            }

        };


        // ========================================
        // READ PARAMETERS
        // ========================================

        function readParameters() {

            initialVelocity =
                Number(velocityInput.value) || 20;

            launchAngle =
                Number(angleInput.value) || 45;

            gravity =
                Number(gravityInput.value) || 9.81;


            const angleRad =
                launchAngle * Math.PI / 180;


            vx0 =
                initialVelocity *
                Math.cos(angleRad);


            vy0 =
                initialVelocity *
                Math.sin(angleRad);


            totalTime =
                (2 * vy0) / gravity;


            maxHeight =
                (vy0 * vy0) /
                (2 * gravity);


            range =
                vx0 * totalTime;


            apexTimeValue =
                vy0 / gravity;


            apexXValue =
                vx0 * apexTimeValue;


            apexYValue =
                maxHeight;


            updateResults();

        }


        // ========================================
        // PHYSICS FUNCTIONS
        // ========================================

        function calculateX(t) {

            return vx0 * t;

        }


        function calculateY(t) {

            return (
                (vy0 * t) -
                (0.5 * gravity * t * t)
            );

        }


        function calculateVx() {

            return vx0;

        }


        function calculateVy(t) {

            return vy0 - gravity * t;

        }


        function calculateV(t) {

            const vx =
                calculateVx();

            const vy =
                calculateVy(t);


            return Math.sqrt(
                vx * vx +
                vy * vy
            );

        }


        // ========================================
        // RESULTS
        // ========================================

        function updateResults() {

            rangeResult.textContent =
                range.toFixed(2) + " m";


            heightResult.textContent =
                maxHeight.toFixed(2) + " m";


            timeResult.textContent =
                totalTime.toFixed(2) + " s";


            apexTime.textContent =
                apexTimeValue.toFixed(2) + " s";


            apexX.textContent =
                apexXValue.toFixed(2) + " m";


            apexY.textContent =
                apexYValue.toFixed(2) + " m";

        }


        // ========================================
        // SAVE TO HISTORY
        // ========================================

        function saveToHistory() {

            // ป้องกันการบันทึกซ้ำ
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


            // ========================================
            // HISTORY OBJECT
            // ========================================

           const historyItem = {

    icon: "🏹",

    title: "Projectile Motion",

    calculation:
        `v₀ = ${initialVelocity.toFixed(2)} m/s | ` +
        `θ = ${launchAngle.toFixed(2)}° | ` +
        `g = ${gravity.toFixed(2)} m/s² | ` +
        `R = ${range.toFixed(2)} m | ` +
        `Hmax = ${maxHeight.toFixed(2)} m`,

    time:
        new Date().toLocaleString(
            "th-TH"
        ),

    /* Detailed data */

    tool:
        "Projectile Motion",

    category:
        "Physics Simulation",

    date:
        new Date().toISOString(),

    timestamp:
        Date.now(),

    initialVelocity:
        Number(
            initialVelocity.toFixed(2)
        ),

    launchAngle:
        Number(
            launchAngle.toFixed(2)
        ),

    gravity:
        Number(
            gravity.toFixed(2)
        ),

    range:
        Number(
            range.toFixed(2)
        ),

    maxHeight:
        Number(
            maxHeight.toFixed(2)
        ),

    totalTime:
        Number(
            totalTime.toFixed(2)
        ),

    apexTime:
        Number(
            apexTimeValue.toFixed(2)
        ),

    apexX:
        Number(
            apexXValue.toFixed(2)
        ),

    apexY:
        Number(
            apexYValue.toFixed(2)
        )

};


            // เพิ่มรายการใหม่ไว้ด้านบน
            history.unshift(
                historyItem
            );


            // จำกัดจำนวน History
            // เพื่อไม่ให้ localStorage โตเกินไป
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


                console.log(
                    "Projectile Motion saved to History",
                    historyItem
                );

            } catch (error) {

                console.error(
                    "ไม่สามารถบันทึก History ได้",
                    error
                );

            }

        }


        // ========================================
        // REALTIME DATA
        // ========================================

        function updateRealtimeData() {

            const t =
                Math.min(
                    simulationTime,
                    totalTime
                );


            const x =
                calculateX(t);

            const y =
                Math.max(
                    0,
                    calculateY(t)
                );


            const vx =
                calculateVx();

            const vy =
                calculateVy(t);

            const v =
                calculateV(t);


            realtimeTime.textContent =
                t.toFixed(2) + " s";


            realtimeX.textContent =
                x.toFixed(2) + " m";


            realtimeY.textContent =
                y.toFixed(2) + " m";


            realtimeVx.textContent =
                vx.toFixed(2) + " m/s";


            realtimeVy.textContent =
                vy.toFixed(2) + " m/s";


            realtimeV.textContent =
                v.toFixed(2) + " m/s";

        }


        // ========================================
        // GRAPH DATA
        // ========================================

        function collectGraphData() {

            const t =
                Math.min(
                    simulationTime,
                    totalTime
                );


            graphData.push({

                time: t,

                x: calculateX(t),

                y: Math.max(
                    0,
                    calculateY(t)
                ),

                vx: calculateVx(),

                vy: calculateVy(t)

            });

        }


        function updateGraphCurrentValue() {

            if (
                graphData.length === 0
            ) {

                graphCurrentTitle.textContent =
                    graphSettings[selectedGraph].title;

                graphCurrentValue.textContent =
                    "--";

                return;

            }


            const latest =
                graphData[
                    graphData.length - 1
                ];


            const setting =
                graphSettings[selectedGraph];


            graphCurrentTitle.textContent =
                setting.title;


            graphCurrentValue.textContent =
                latest[selectedGraph].toFixed(2)
                + " "
                + setting.unit;

        }


        // ========================================
        // GRAPH RESIZE
        // ========================================

        function resizeGraphCanvas() {

            const rect =
                graphCanvas.getBoundingClientRect();


            const dpr =
                window.devicePixelRatio || 1;


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


        // ========================================
        // GRAPH DRAW
        // ========================================

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


            // Background
            const bg =
                graphCtx.createLinearGradient(
                    0,
                    0,
                    0,
                    height
                );


            bg.addColorStop(
                0,
                "#f8fbff"
            );

            bg.addColorStop(
                1,
                "#eef5ff"
            );


            graphCtx.fillStyle =
                bg;

            graphCtx.fillRect(
                0,
                0,
                width,
                height
            );


            if (
                graphData.length === 0
            ) {

                graphEmpty.style.display =
                    "flex";

                return;

            }


            graphEmpty.style.display =
                "none";


            const padding = 45;


            const data =
                graphData;


            const setting =
                graphSettings[selectedGraph];


            let maxValue =
                Math.max(
                    ...data.map(
                        item =>
                            Math.abs(
                                item[selectedGraph]
                            )
                    )
                );


            if (
                maxValue < 1
            ) {

                maxValue = 1;

            }


            maxValue *= 1.15;


            const maxTime =
                Math.max(
                    totalTime,
                    1
                );


            // Grid
            graphCtx.strokeStyle =
                "#dbeafe";

            graphCtx.lineWidth =
                1;


            for (
                let i = 0;
                i <= 5;
                i++
            ) {

                const y =
                    padding +
                    (
                        (height -
                        padding * 2) *
                        i / 5
                    );


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


            for (
                let i = 0;
                i <= 5;
                i++
            ) {

                const x =
                    padding +
                    (
                        (width -
                        padding * 2) *
                        i / 5
                    );


                graphCtx.beginPath();

                graphCtx.moveTo(
                    x,
                    padding
                );

                graphCtx.lineTo(
                    x,
                    height - padding
                );

                graphCtx.stroke();

            }


            // Axes
            graphCtx.strokeStyle =
                "#94a3b8";

            graphCtx.lineWidth =
                1.5;


            graphCtx.beginPath();

            graphCtx.moveTo(
                padding,
                height - padding
            );

            graphCtx.lineTo(
                width - padding,
                height - padding
            );

            graphCtx.stroke();


            graphCtx.beginPath();

            graphCtx.moveTo(
                padding,
                padding
            );

            graphCtx.lineTo(
                padding,
                height - padding
            );

            graphCtx.stroke();


            // Labels
            graphCtx.fillStyle =
                "#64748b";

            graphCtx.font =
                "12px Arial";


            graphCtx.textAlign =
                "center";


            for (
                let i = 0;
                i <= 5;
                i++
            ) {

                const value =
                    maxTime * i / 5;


                const x =
                    padding +
                    (
                        (width -
                        padding * 2) *
                        i / 5
                    );


                graphCtx.fillText(
                    value.toFixed(1),
                    x,
                    height - 20
                );

            }


            graphCtx.textAlign =
                "right";


            for (
                let i = 0;
                i <= 5;
                i++
            ) {

                const value =
                    maxValue -
                    (
                        maxValue * i / 5
                    );


                const y =
                    padding +
                    (
                        (height -
                        padding * 2) *
                        i / 5
                    );


                graphCtx.fillText(
                    value.toFixed(1),
                    padding - 8,
                    y + 4
                );

            }


            // Graph line
            graphCtx.beginPath();


            data.forEach(
                (item, index) => {

                    const x =
                        padding +
                        (
                            item.time /
                            maxTime
                        ) *
                        (
                            width -
                            padding * 2
                        );


                    const value =
                        item[selectedGraph];


                    const y =
                        height -
                        padding -
                        (
                            (
                                value /
                                maxValue
                            ) *
                            (
                                height -
                                padding * 2
                            )
                        );


                    if (
                        index === 0
                    ) {

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
                setting.color;

            graphCtx.lineWidth =
                3;

            graphCtx.lineJoin =
                "round";

            graphCtx.lineCap =
                "round";

            graphCtx.stroke();


            // Current point
            const latest =
                data[data.length - 1];


            const pointX =
                padding +
                (
                    latest.time /
                    maxTime
                ) *
                (
                    width -
                    padding * 2
                );


            const pointY =
                height -
                padding -
                (
                    (
                        latest[selectedGraph] /
                        maxValue
                    ) *
                    (
                        height -
                        padding * 2
                    )
                );


            graphCtx.beginPath();

            graphCtx.arc(
                pointX,
                pointY,
                6,
                0,
                Math.PI * 2
            );

            graphCtx.fillStyle =
                setting.color;

            graphCtx.fill();


            graphCtx.beginPath();

            graphCtx.arc(
                pointX,
                pointY,
                10,
                0,
                Math.PI * 2
            );

            graphCtx.strokeStyle =
                setting.color;

            graphCtx.globalAlpha =
                0.25;

            graphCtx.lineWidth =
                3;

            graphCtx.stroke();

            graphCtx.globalAlpha =
                1;


            graphCtx.fillStyle =
                "#0f172a";

            graphCtx.font =
                "bold 13px Arial";

            graphCtx.textAlign =
                "left";


            graphCtx.fillText(
                setting.title,
                padding,
                22
            );

        }


        // ========================================
        // GRAPH BUTTONS
        // ========================================

        graphButtons.forEach(
            button => {

                button.addEventListener(
                    "click",
                    function () {

                        selectedGraph =
                            this.dataset.graph;


                        graphButtons.forEach(
                            item =>
                                item.classList.remove(
                                    "active"
                                )
                        );


                        this.classList.add(
                            "active"
                        );


                        updateGraphCurrentValue();

                        drawGraph();

                    }
                );

            }
        );


        // ========================================
        // STATUS
        // ========================================

        function setStatus(
            message,
            type = ""
        ) {

            statusText.textContent =
                message;


            statusDot.className =
                "status-dot";


            if (type) {

                statusDot.classList.add(
                    type
                );

            }

        }


        // ========================================
        // BUTTON STATE
        // ========================================

        function updateButtons() {

            startButton.disabled =
                isRunning;


            pauseButton.disabled =
                !isRunning ||
                isPaused;


            resumeButton.disabled =
                !isRunning ||
                !isPaused;


            resetButton.disabled =
                !isRunning &&
                simulationTime === 0;

        }


        // ========================================
        // CANVAS RESIZE
        // ========================================

        function resizeCanvas() {

            const rect =
                canvas.getBoundingClientRect();


            const dpr =
                window.devicePixelRatio || 1;


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


            drawScene();

        }


        window.addEventListener(
            "resize",
            function () {

                resizeCanvas();

                resizeGraphCanvas();

            }
        );


        // ========================================
        // WORLD SCALE
        // ========================================

        function getScale() {

            const width =
                canvas.clientWidth;

            const height =
                canvas.clientHeight;


            const horizontalPadding =
                100;


            const bottomPadding =
                95;


            const topPadding =
                70;


            const usableWidth =
                Math.max(
                    width -
                    horizontalPadding * 2,
                    100
                );


            const usableHeight =
                Math.max(
                    height -
                    bottomPadding -
                    topPadding,
                    100
                );


            const scaleX =
                usableWidth /
                Math.max(
                    range,
                    10
                );


            const scaleY =
                usableHeight /
                Math.max(
                    maxHeight,
                    10
                );


            return Math.min(
                scaleX,
                scaleY
            );

        }


        function worldToCanvas(
            x,
            y
        ) {

            const width =
                canvas.clientWidth;

            const height =
                canvas.clientHeight;


            const scale =
                getScale();


            const groundY =
                height - 80;


            const leftX =
                80;


            return {

                x:
                    leftX +
                    x * scale,

                y:
                    groundY -
                    y * scale

            };

        }


        // ========================================
        // BACKGROUND
        // ========================================

        function drawBackground() {

            const width =
                canvas.clientWidth;

            const height =
                canvas.clientHeight;


            // Sky
            const sky =
                ctx.createLinearGradient(
                    0,
                    0,
                    0,
                    height
                );


            sky.addColorStop(
                0,
                "#dbeafe"
            );

            sky.addColorStop(
                0.45,
                "#eff6ff"
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


            // Soft light
            const glow =
                ctx.createRadialGradient(
                    width * 0.72,
                    height * 0.20,
                    10,
                    width * 0.72,
                    height * 0.20,
                    width * 0.42
                );


            glow.addColorStop(
                0,
                "rgba(255,255,255,0.75)"
            );

            glow.addColorStop(
                1,
                "rgba(255,255,255,0)"
            );


            ctx.fillStyle =
                glow;


            ctx.fillRect(
                0,
                0,
                width,
                height
            );

        }


        // ========================================
        // 3D FLOOR
        // ========================================

        function draw3DFloor() {

            const width =
                canvas.clientWidth;

            const height =
                canvas.clientHeight;


            const groundY =
                height - 80;


            // Floor
            const floor =
                ctx.createLinearGradient(
                    0,
                    groundY,
                    0,
                    height
                );


            floor.addColorStop(
                0,
                "#dbeafe"
            );

            floor.addColorStop(
                1,
                "#cbd5e1"
            );


            ctx.fillStyle =
                floor;


            ctx.fillRect(
                0,
                groundY,
                width,
                height - groundY
            );


            // Perspective lines
            ctx.save();


            ctx.strokeStyle =
                "rgba(100,116,139,0.25)";

            ctx.lineWidth =
                1;


            const centerX =
                width * 0.48;


            for (
                let i = -10;
                i <= 10;
                i++
            ) {

                const bottomX =
                    centerX +
                    i * 85;


                ctx.beginPath();

                ctx.moveTo(
                    centerX,
                    groundY
                );

                ctx.lineTo(
                    bottomX,
                    height
                );

                ctx.stroke();

            }


            // Horizontal perspective lines
            for (
                let i = 1;
                i <= 5;
                i++
            ) {

                const ratio =
                    i / 5;


                const y =
                    groundY +
                    (
                        Math.pow(
                            ratio,
                            1.8
                        ) *
                        (
                            height -
                            groundY
                        )
                    );


                ctx.beginPath();

                ctx.moveTo(
                    0,
                    y
                );

                ctx.lineTo(
                    width,
                    y
                );

                ctx.stroke();

            }


            ctx.restore();

        }


        // ========================================
        // GRID
        // ========================================

        function drawGrid() {

            const width =
                canvas.clientWidth;

            const height =
                canvas.clientHeight;


            const groundY =
                height - 80;


            const scale =
                getScale();


            ctx.save();


            ctx.strokeStyle =
                "rgba(37,99,235,0.13)";

            ctx.lineWidth =
                1;


            const gridStep =
                Math.max(
                    1,
                    Math.ceil(
                        10 / scale
                    )
                );


            for (
                let x = 0;
                x <= range;
                x += gridStep
            ) {

                const p =
                    worldToCanvas(
                        x,
                        0
                    );


                ctx.beginPath();

                ctx.moveTo(
                    p.x,
                    45
                );

                ctx.lineTo(
                    p.x,
                    groundY
                );

                ctx.stroke();

            }


            for (
                let y = 0;
                y <= maxHeight;
                y += gridStep
            ) {

                const p =
                    worldToCanvas(
                        0,
                        y
                    );


                ctx.beginPath();

                ctx.moveTo(
                    55,
                    p.y
                );

                ctx.lineTo(
                    width - 40,
                    p.y
                );

                ctx.stroke();

            }


            ctx.restore();

        }


        // ========================================
        // GROUND
        // ========================================

        function drawGround() {

            const width =
                canvas.clientWidth;

            const height =
                canvas.clientHeight;


            const groundY =
                height - 80;


            ctx.save();


            // Main ground line
            ctx.strokeStyle =
                "#334155";

            ctx.lineWidth =
                3;


            ctx.beginPath();

            ctx.moveTo(
                35,
                groundY
            );

            ctx.lineTo(
                width - 30,
                groundY
            );

            ctx.stroke();


            // Ground glow
            ctx.strokeStyle =
                "rgba(37,99,235,0.20)";

            ctx.lineWidth =
                10;


            ctx.beginPath();

            ctx.moveTo(
                35,
                groundY + 3
            );

            ctx.lineTo(
                width - 30,
                groundY + 3
            );

            ctx.stroke();


            ctx.restore();

        }


        // ========================================
        // AXES
        // ========================================

        function drawAxisLabels() {

            const width =
                canvas.clientWidth;

            const height =
                canvas.clientHeight;


            const groundY =
                height - 80;


            ctx.save();


            ctx.font =
                "bold 12px Arial";

            ctx.fillStyle =
                "#475569";


            ctx.fillText(
                "X (m)",
                width - 70,
                groundY - 12
            );


            ctx.save();

            ctx.translate(
                28,
                85
            );

            ctx.rotate(
                -Math.PI / 2
            );


            ctx.fillText(
                "Y (m)",
                0,
                0
            );


            ctx.restore();


            ctx.restore();

        }


        // ========================================
        // MEASUREMENT LINE
        // ========================================

        function drawMeasurementLine() {

            if (
                range <= 0
            ) return;


            const start =
                worldToCanvas(
                    0,
                    0
                );


            const end =
                worldToCanvas(
                    range,
                    0
                );


            ctx.save();


            ctx.strokeStyle =
                "#64748b";

            ctx.lineWidth =
                1.5;


            ctx.setLineDash([
                5,
                5
            ]);


            ctx.beginPath();

            ctx.moveTo(
                start.x,
                start.y + 25
            );

            ctx.lineTo(
                end.x,
                end.y + 25
            );

            ctx.stroke();


            ctx.setLineDash([]);


            // arrows
            drawArrowHead(
                start.x,
                start.y + 25,
                0
            );


            drawArrowHead(
                end.x,
                end.y + 25,
                Math.PI
            );


            ctx.fillStyle =
                "#475569";

            ctx.font =
                "bold 12px Arial";

            ctx.textAlign =
                "center";


            ctx.fillText(
                "Range  " +
                range.toFixed(2) +
                " m",
                (start.x + end.x) / 2,
                start.y + 42
            );


            ctx.restore();

        }


        // ========================================
        // TRAJECTORY
        // ========================================

        function drawTrajectory() {

            if (
                range <= 0
            ) return;


            const steps = 100;


            ctx.save();


            ctx.beginPath();


            for (
                let i = 0;
                i <= steps;
                i++
            ) {

                const t =
                    totalTime *
                    i /
                    steps;


                const x =
                    calculateX(t);


                const y =
                    Math.max(
                        0,
                        calculateY(t)
                    );


                const p =
                    worldToCanvas(
                        x,
                        y
                    );


                if (
                    i === 0
                ) {

                    ctx.moveTo(
                        p.x,
                        p.y
                    );

                } else {

                    ctx.lineTo(
                        p.x,
                        p.y
                    );

                }

            }


            // Glow
            ctx.strokeStyle =
                "rgba(37,99,235,0.16)";

            ctx.lineWidth =
                9;

            ctx.stroke();


            // Main trajectory
            ctx.strokeStyle =
                "#2563eb";

            ctx.lineWidth =
                3;

            ctx.setLineDash([
                8,
                7
            ]);

            ctx.stroke();


            ctx.restore();

        }


        // ========================================
        // LAUNCH PLATFORM
        // ========================================

        function drawLaunchPoint() {

            const p =
                worldToCanvas(
                    0,
                    0
                );


            ctx.save();


            // Platform shadow
            ctx.fillStyle =
                "rgba(15,23,42,0.20)";


            ctx.beginPath();

            ctx.ellipse(
                p.x + 18,
                p.y + 5,
                42,
                9,
                0,
                0,
                Math.PI * 2
            );

            ctx.fill();


            // Platform
            const platformGradient =
                ctx.createLinearGradient(
                    p.x - 30,
                    p.y - 30,
                    p.x + 30,
                    p.y
                );


            platformGradient.addColorStop(
                0,
                "#475569"
            );

            platformGradient.addColorStop(
                1,
                "#0f172a"
            );


            ctx.fillStyle =
                platformGradient;


            ctx.beginPath();

            ctx.roundRect(
                p.x - 30,
                p.y - 30,
                60,
                20,
                5
            );

            ctx.fill();


            // launcher
            ctx.save();


            ctx.translate(
                p.x,
                p.y - 28
            );


            ctx.rotate(
                -launchAngle *
                Math.PI /
                180
            );


            ctx.fillStyle =
                "#334155";


            ctx.fillRect(
                0,
                -7,
                45,
                14
            );


            ctx.fillStyle =
                "#64748b";


            ctx.fillRect(
                4,
                -4,
                35,
                8
            );


            ctx.restore();


            // Label
            ctx.fillStyle =
                "#0f172a";

            ctx.font =
                "bold 12px Arial";

            ctx.textAlign =
                "left";


            ctx.fillText(
                "LAUNCH",
                p.x - 30,
                p.y - 45
            );


            ctx.restore();

        }


        // ========================================
        // APEX
        // ========================================

        function drawApex() {

            const p =
                worldToCanvas(
                    apexXValue,
                    apexYValue
                );


            ctx.save();


            // Vertical guide
            ctx.strokeStyle =
                "rgba(220,38,38,0.30)";

            ctx.lineWidth =
                1.5;

            ctx.setLineDash([
                5,
                5
            ]);


            ctx.beginPath();

            ctx.moveTo(
                p.x,
                p.y
            );

            ctx.lineTo(
                p.x,
                canvas.clientHeight - 80
            );

            ctx.stroke();


            ctx.setLineDash([]);


            // Glow
            ctx.beginPath();

            ctx.arc(
                p.x,
                p.y,
                14,
                0,
                Math.PI * 2
            );

            ctx.fillStyle =
                "rgba(220,38,38,0.15)";

            ctx.fill();


            // Point
            ctx.beginPath();

            ctx.arc(
                p.x,
                p.y,
                6,
                0,
                Math.PI * 2
            );

            ctx.fillStyle =
                "#dc2626";

            ctx.fill();


            // Label background
            const label =
                "APEX  " +
                apexYValue.toFixed(2) +
                " m";


            ctx.font =
                "bold 12px Arial";


            const textWidth =
                ctx.measureText(
                    label
                ).width;


            ctx.fillStyle =
                "rgba(255,255,255,0.92)";


            ctx.roundRect(
                p.x - textWidth / 2 - 10,
                p.y - 34,
                textWidth + 20,
                22,
                8
            );


            ctx.fill();


            ctx.fillStyle =
                "#b91c1c";

            ctx.textAlign =
                "center";


            ctx.fillText(
                label,
                p.x,
                p.y - 19
            );


            ctx.restore();

        }


        // ========================================
        // PROJECTILE
        // ========================================

        function drawProjectile(
            x,
            y
        ) {

            const p =
                worldToCanvas(
                    x,
                    y
                );


            ctx.save();


            // Shadow
            const ground =
                worldToCanvas(
                    x,
                    0
                );


            ctx.fillStyle =
                "rgba(15,23,42,0.18)";


            ctx.beginPath();

            ctx.ellipse(
                ground.x,
                ground.y + 4,
                15,
                5,
                0,
                0,
                Math.PI * 2
            );

            ctx.fill();


            // Glow
            ctx.beginPath();

            ctx.arc(
                p.x,
                p.y,
                19,
                0,
                Math.PI * 2
            );


            const glow =
                ctx.createRadialGradient(
                    p.x,
                    p.y,
                    2,
                    p.x,
                    p.y,
                    20
                );


            glow.addColorStop(
                0,
                "rgba(59,130,246,0.45)"
            );

            glow.addColorStop(
                1,
                "rgba(59,130,246,0)"
            );


            ctx.fillStyle =
                glow;

            ctx.fill();


            // Body
            const body =
                ctx.createRadialGradient(
                    p.x - 4,
                    p.y - 5,
                    2,
                    p.x,
                    p.y,
                    11
                );


            body.addColorStop(
                0,
                "#bfdbfe"
            );

            body.addColorStop(
                0.35,
                "#3b82f6"
            );

            body.addColorStop(
                1,
                "#1d4ed8"
            );


            ctx.beginPath();

            ctx.arc(
                p.x,
                p.y,
                10,
                0,
                Math.PI * 2
            );

            ctx.fillStyle =
                body;

            ctx.fill();


            ctx.strokeStyle =
                "#1e3a8a";

            ctx.lineWidth =
                2;

            ctx.stroke();


            // Highlight
            ctx.beginPath();

            ctx.arc(
                p.x - 3,
                p.y - 4,
                2.5,
                0,
                Math.PI * 2
            );

            ctx.fillStyle =
                "rgba(255,255,255,0.85)";

            ctx.fill();


            // Rocket icon
            ctx.font =
                "15px Arial";

            ctx.textAlign =
                "center";

            ctx.textBaseline =
                "middle";


            ctx.fillText(
                "🚀",
                p.x,
                p.y
            );


            ctx.restore();

        }


        // ========================================
        // VELOCITY VECTOR
        // ========================================

        function drawVelocityVector(
            x,
            y,
            t
        ) {

            const p =
                worldToCanvas(
                    x,
                    y
                );


            const vx =
                calculateVx();


            const vy =
                calculateVy(t);


            const magnitude =
                Math.sqrt(
                    vx * vx +
                    vy * vy
                );


            if (
                magnitude < 0.01
            ) return;


            const vectorScale =
                Math.min(
                    3,
                    45 / magnitude
                );


            const endX =
                p.x +
                vx *
                vectorScale;


            const endY =
                p.y -
                vy *
                vectorScale;


            ctx.save();


            // Glow
            ctx.strokeStyle =
                "rgba(220,38,38,0.18)";

            ctx.lineWidth =
                8;


            ctx.beginPath();

            ctx.moveTo(
                p.x,
                p.y
            );

            ctx.lineTo(
                endX,
                endY
            );

            ctx.stroke();


            // Vector
            ctx.strokeStyle =
                "#dc2626";

            ctx.lineWidth =
                3;


            ctx.beginPath();

            ctx.moveTo(
                p.x,
                p.y
            );

            ctx.lineTo(
                endX,
                endY
            );

            ctx.stroke();


            // Arrow
            const angle =
                Math.atan2(
                    endY - p.y,
                    endX - p.x
                );


            ctx.fillStyle =
                "#dc2626";


            ctx.beginPath();

            ctx.moveTo(
                endX,
                endY
            );

            ctx.lineTo(
                endX -
                10 *
                Math.cos(
                    angle - 0.5
                ),
                endY -
                10 *
                Math.sin(
                    angle - 0.5
                )
            );

            ctx.lineTo(
                endX -
                10 *
                Math.cos(
                    angle + 0.5
                ),
                endY -
                10 *
                Math.sin(
                    angle + 0.5
                )
            );

            ctx.closePath();

            ctx.fill();


            ctx.fillStyle =
                "#991b1b";

            ctx.font =
                "bold 12px Arial";

            ctx.textAlign =
                "left";


            ctx.fillText(
                "v",
                endX + 8,
                endY
            );


            ctx.restore();

        }


        // ========================================
        // ARROW HEAD
        // ========================================

        function drawArrowHead(
            x,
            y,
            angle
        ) {

            const size = 6;


            ctx.save();


            ctx.fillStyle =
                "#64748b";


            ctx.beginPath();

            ctx.moveTo(
                x,
                y
            );

            ctx.lineTo(
                x -
                size *
                Math.cos(
                    angle - 0.5
                ),
                y -
                size *
                Math.sin(
                    angle - 0.5
                )
            );

            ctx.lineTo(
                x -
                size *
                Math.cos(
                    angle + 0.5
                ),
                y -
                size *
                Math.sin(
                    angle + 0.5
                )
            );

            ctx.closePath();

            ctx.fill();


            ctx.restore();

        }


        // ========================================
        // SCENE
        // ========================================

        function drawScene() {

            drawBackground();

            draw3DFloor();

            drawGrid();

            drawGround();

            drawAxisLabels();

            drawMeasurementLine();

            drawTrajectory();

            drawLaunchPoint();

            drawApex();


            const t =
                Math.min(
                    simulationTime,
                    totalTime
                );


            const x =
                calculateX(t);


            const y =
                Math.max(
                    0,
                    calculateY(t)
                );


            drawVelocityVector(
                x,
                y,
                t
            );


            drawProjectile(
                x,
                y
            );

        }


        // ========================================
        // ANIMATION
        // ========================================

        function animate(
            timestamp
        ) {

            if (
                !isRunning ||
                isPaused
            ) {

                return;

            }


            if (
                !lastTimestamp
            ) {

                lastTimestamp =
                    timestamp;

            }


            const delta =
                (
                    timestamp -
                    lastTimestamp
                ) / 1000;


            lastTimestamp =
                timestamp;


            simulationTime +=
                delta;


            if (
                simulationTime >=
                totalTime
            ) {

                simulationTime =
                    totalTime;


                updateRealtimeData();

                collectGraphData();

                drawScene();

                drawGraph();

                updateGraphCurrentValue();


                // ========================================
                // SAVE HISTORY
                // ========================================

                saveToHistory();


                isRunning =
                    false;

                isPaused =
                    false;


                setStatus(
                    "Simulation Finished",
                    "finished"
                );


                updateButtons();


                return;

            }


            updateRealtimeData();

            collectGraphData();

            updateGraphCurrentValue();


            drawScene();

            drawGraph();


            animationId =
                requestAnimationFrame(
                    animate
                );

        }


        // ========================================
        // START
        // ========================================

        startButton.addEventListener(
            "click",
            function () {

                readParameters();


                simulationTime =
                    0;

                lastTimestamp =
                    null;


                graphData =
                    [];


                historySaved =
                    false;


                isRunning =
                    true;

                isPaused =
                    false;


                setStatus(
                    "Simulation Running",
                    "running"
                );


                updateButtons();

                updateRealtimeData();

                drawScene();

                drawGraph();


                cancelAnimationFrame(
                    animationId
                );


                animationId =
                    requestAnimationFrame(
                        animate
                    );

            }
        );


        // ========================================
        // PAUSE
        // ========================================

        pauseButton.addEventListener(
            "click",
            function () {

                if (
                    !isRunning
                ) return;


                isPaused =
                    true;


                setStatus(
                    "Simulation Paused",
                    "paused"
                );


                updateButtons();


                cancelAnimationFrame(
                    animationId
                );

            }
        );


        // ========================================
        // RESUME
        // ========================================

        resumeButton.addEventListener(
            "click",
            function () {

                if (
                    !isPaused
                ) return;


                isPaused =
                    false;

                lastTimestamp =
                    null;


                setStatus(
                    "Simulation Running",
                    "running"
                );


                updateButtons();


                animationId =
                    requestAnimationFrame(
                        animate
                    );

            }
        );


        // ========================================
        // RESET
        // ========================================

        resetButton.addEventListener(
            "click",
            function () {

                cancelAnimationFrame(
                    animationId
                );


                isRunning =
                    false;

                isPaused =
                    false;


                simulationTime =
                    0;

                lastTimestamp =
                    null;


                graphData =
                    [];


                historySaved =
                    false;


                readParameters();

                updateRealtimeData();


                setStatus(
                    "Ready"
                );


                updateButtons();


                drawScene();

                drawGraph();

                updateGraphCurrentValue();

            }
        );


        // ========================================
        // INPUT EVENTS
        // ========================================

        [
            velocityInput,
            angleInput,
            gravityInput

        ].forEach(
            input => {

                input.addEventListener(
                    "input",
                    function () {

                        if (
                            !isRunning
                        ) {

                            readParameters();

                            updateRealtimeData();

                            drawScene();

                            drawGraph();

                        }

                    }
                );

            }
        );


        // ========================================
        // INITIALIZE
        // ========================================

        readParameters();

        updateRealtimeData();

        setStatus(
            "Ready"
        );

        updateButtons();

        resizeCanvas();

        resizeGraphCanvas();

        drawScene();

        drawGraph();

    }
);