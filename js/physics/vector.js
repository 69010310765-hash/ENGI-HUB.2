import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const canvas = document.getElementById("vectorCanvas");

if (!canvas) {
    throw new Error("ไม่พบ #vectorCanvas");
}


// =====================================================
// SCENE
// =====================================================

const scene = new THREE.Scene();

scene.background =
    new THREE.Color(0x0b1120);


// =====================================================
// CAMERA
// =====================================================

const camera =
    new THREE.PerspectiveCamera(
        55,
        1,
        0.1,
        1000
    );

camera.position.set(
    10,
    8,
    10
);


// =====================================================
// RENDERER
// =====================================================

const renderer =
    new THREE.WebGLRenderer({
        canvas,
        antialias: true
    });

renderer.setPixelRatio(
    Math.min(
        window.devicePixelRatio || 1,
        2
    )
);


// =====================================================
// CONTROLS
// =====================================================

const controls =
    new OrbitControls(
        camera,
        renderer.domElement
    );

controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.minDistance = 4;
controls.maxDistance = 35;

controls.target.set(
    0,
    1,
    0
);


// =====================================================
// LIGHT
// =====================================================

scene.add(
    new THREE.AmbientLight(
        0xffffff,
        1.8
    )
);


// =====================================================
// COLORS
// =====================================================

const X_COLOR = 0xef4444;
const Y_COLOR = 0x22c55e;
const Z_COLOR = 0x3b82f6;

const A_COLOR = 0x38bdf8;
const B_COLOR = 0xf59e0b;
const RESULT_COLOR = 0xa78bfa;

const GUIDE_COLOR = 0x64748b;
const PROJECTION_COLOR = 0x22c55e;
const ANGLE_COLOR = 0xec4899;


// =====================================================
// GRID
// =====================================================

scene.add(
    new THREE.GridHelper(
        20,
        20,
        0x475569,
        0x334155
    )
);


// =====================================================
// AXES
// =====================================================

const axisLength = 7;


scene.add(
    new THREE.ArrowHelper(
        new THREE.Vector3(1, 0, 0),
        new THREE.Vector3(0, 0, 0),
        axisLength,
        X_COLOR,
        0.4,
        0.2
    )
);


scene.add(
    new THREE.ArrowHelper(
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(0, 0, 0),
        axisLength,
        Y_COLOR,
        0.4,
        0.2
    )
);


scene.add(
    new THREE.ArrowHelper(
        new THREE.Vector3(0, 0, 1),
        new THREE.Vector3(0, 0, 0),
        axisLength,
        Z_COLOR,
        0.4,
        0.2
    )
);


// =====================================================
// TEXT SPRITE
// =====================================================

function textSprite(
    text,
    color,
    fontSize = 52
) {

    const c =
        document.createElement("canvas");

    c.width = 512;
    c.height = 256;

    const ctx =
        c.getContext("2d");

    ctx.font =
        "bold " +
        fontSize +
        "px Arial";

    ctx.fillStyle =
        color;

    ctx.textAlign =
        "center";

    ctx.textBaseline =
        "middle";

    ctx.shadowColor =
        "rgba(0,0,0,0.9)";

    ctx.shadowBlur = 10;

    ctx.fillText(
        text,
        256,
        128
    );


    const texture =
        new THREE.CanvasTexture(c);

    const material =
        new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
            depthTest: false
        });

    const sprite =
        new THREE.Sprite(material);

    sprite.scale.set(
        1.6,
        0.8,
        1
    );

    return sprite;
}


// =====================================================
// AXIS LABELS
// =====================================================

const xLabel =
    textSprite(
        "X",
        "#ff4444"
    );

xLabel.position.set(
    7.4,
    0,
    0
);

scene.add(xLabel);


const yLabel =
    textSprite(
        "Y",
        "#22dd66"
    );

yLabel.position.set(
    0,
    7.4,
    0
);

scene.add(yLabel);


const zLabel =
    textSprite(
        "Z",
        "#4488ff"
    );

zLabel.position.set(
    0,
    0,
    7.4
);

scene.add(zLabel);


const originLabel =
    textSprite(
        "O",
        "#ffffff",
        42
    );

originLabel.scale.set(
    1.1,
    0.55,
    1
);

originLabel.position.set(
    -0.45,
    0.35,
    0
);

scene.add(originLabel);


// =====================================================
// ORIGIN
// =====================================================

const origin =
    new THREE.Mesh(
        new THREE.SphereGeometry(
            0.11,
            16,
            16
        ),
        new THREE.MeshBasicMaterial({
            color: 0xffffff
        })
    );

scene.add(origin);


// =====================================================
// VECTOR VALUES
// =====================================================

let vectorAX = 4;
let vectorAY = 3;
let vectorAZ = 2;

let vectorBX = 2;
let vectorBY = 1;
let vectorBZ = 3;


// =====================================================
// OBJECT GROUPS
// =====================================================

let vectorObjects = [];
let componentObjects = [];
let guideObjects = [];
let projectionObjects = [];
let angleObjects = [];


// =====================================================
// HELPERS
// =====================================================

function clearArray(array) {

    array.forEach(object => {

        scene.remove(object);

        if (object.geometry) {
            object.geometry.dispose();
        }

        if (object.material) {

            if (Array.isArray(object.material)) {

                object.material.forEach(
                    m => m.dispose()
                );

            } else {

                object.material.dispose();

            }
        }

    });

    array.length = 0;
}


function line(
    start,
    end,
    color,
    opacity = 1
) {

    const geometry =
        new THREE.BufferGeometry()
            .setFromPoints([
                start,
                end
            ]);

    const material =
        new THREE.LineBasicMaterial({
            color,
            transparent: opacity < 1,
            opacity
        });

    const object =
        new THREE.Line(
            geometry,
            material
        );

    scene.add(object);

    return object;
}


function arrow(
    vector,
    color,
    start = new THREE.Vector3()
) {

    if (
        vector.length() <
        0.000001
    ) {
        return null;
    }

    const direction =
        vector.clone().normalize();

    const object =
        new THREE.ArrowHelper(
            direction,
            start,
            vector.length(),
            color,
            Math.min(
                0.5,
                vector.length() * 0.18
            ),
            Math.min(
                0.25,
                vector.length() * 0.1
            )
        );

    scene.add(object);

    return object;
}


// =====================================================
// VECTOR COMPONENTS
// =====================================================

function createComponents(
    vector
) {

    const O =
        new THREE.Vector3(
            0,
            0,
            0
        );

    const X =
        new THREE.Vector3(
            vector.x,
            0,
            0
        );

    const XY =
        new THREE.Vector3(
            vector.x,
            vector.y,
            0
        );


    componentObjects.push(
        line(
            O,
            X,
            X_COLOR,
            0.9
        )
    );


    componentObjects.push(
        line(
            X,
            XY,
            Y_COLOR,
            0.9
        )
    );


    componentObjects.push(
        line(
            XY,
            vector,
            Z_COLOR,
            0.9
        )
    );


    guideObjects.push(
        line(
            vector,
            XY,
            GUIDE_COLOR,
            0.35
        )
    );

}


// =====================================================
// CALCULATIONS
// =====================================================

function getA() {

    return new THREE.Vector3(
        vectorAX,
        vectorAY,
        vectorAZ
    );

}


function getB() {

    return new THREE.Vector3(
        vectorBX,
        vectorBY,
        vectorBZ
    );

}


function projection() {

    const A = getA();
    const B = getB();

    const denominator =
        B.lengthSq();

    if (
        denominator <
        0.000001
    ) {

        return {
            vector:
                new THREE.Vector3(),
            scalar: 0
        };

    }

    const scalar =
        A.dot(B) /
        denominator;

    return {

        vector:
            B.clone()
                .multiplyScalar(
                    scalar
                ),

        scalar

    };

}


// =====================================================
// UPDATE VECTOR VISUALS
// =====================================================

function updateVectors() {

    clearArray(
        vectorObjects
    );


    const A = getA();
    const B = getB();


    const operation =
        document.getElementById(
            "operationSelect"
        )?.value || "add";


    const AArrow =
        arrow(
            A,
            A_COLOR
        );


    const BArrow =
        arrow(
            B,
            B_COLOR
        );


    if (AArrow) {
        vectorObjects.push(
            AArrow
        );
    }


    if (BArrow) {
        vectorObjects.push(
            BArrow
        );
    }


    let result;


    if (
        operation ===
        "subtract"
    ) {

        result =
            A.clone()
                .sub(B);

    } else {

        result =
            A.clone()
                .add(B);

    }


    const resultArrow =
        arrow(
            result,
            RESULT_COLOR
        );


    if (resultArrow) {
        vectorObjects.push(
            resultArrow
        );
    }

}


// =====================================================
// UPDATE COMPONENT VISUALS
// =====================================================

function updateComponents() {

    clearArray(
        componentObjects
    );

    clearArray(
        guideObjects
    );


    createComponents(
        getA()
    );

    createComponents(
        getB()
    );

}


// =====================================================
// PROJECTION VISUAL
// =====================================================

function updateProjection() {

    clearArray(
        projectionObjects
    );


    const result =
        projection();


    if (
        result.vector.length() <
        0.000001
    ) {
        return;
    }


    const projectionArrow =
        arrow(
            result.vector,
            PROJECTION_COLOR
        );


    if (projectionArrow) {

        projectionObjects.push(
            projectionArrow
        );

    }


    projectionObjects.push(
        line(
            getA(),
            result.vector,
            PROJECTION_COLOR,
            0.65
        )
    );

}


// =====================================================
// ANGLE VISUAL
// =====================================================

function updateAngle() {

    clearArray(
        angleObjects
    );


    const A = getA();
    const B = getB();


    const a =
        A.clone().normalize();

    const b =
        B.clone().normalize();


    if (
        A.length() < 0.000001 ||
        B.length() < 0.000001
    ) {
        return;
    }


    const cosine =
        THREE.MathUtils.clamp(
            a.dot(b),
            -1,
            1
        );


    const angle =
        Math.acos(
            cosine
        );


    if (
        angle < 0.001 ||
        Math.abs(
            angle - Math.PI
        ) < 0.001
    ) {
        return;
    }


    const axis =
        a.clone()
            .cross(b)
            .normalize();


    const radius =
        Math.min(
            1.4,
            A.length() * 0.3,
            B.length() * 0.3
        );


    const points = [];

    const segments = 40;


    for (
        let i = 0;
        i <= segments;
        i++
    ) {

        const t =
            angle *
            i /
            segments;


        const q =
            new THREE.Quaternion();


        q.setFromAxisAngle(
            axis,
            t
        );


        points.push(
            a.clone()
                .applyQuaternion(q)
                .multiplyScalar(radius)
        );

    }


    const geometry =
        new THREE.BufferGeometry()
            .setFromPoints(points);


    const material =
        new THREE.LineBasicMaterial({
            color:
                ANGLE_COLOR,
            transparent:
                true,
            opacity:
                0.95
        });


    const arc =
        new THREE.Line(
            geometry,
            material
        );


    scene.add(arc);

    angleObjects.push(arc);

}


// =====================================================
// FORMAT
// =====================================================

function fmt(value) {

    if (
        !Number.isFinite(value)
    ) {
        return "0.00";
    }

    return value.toFixed(2);

}


function fmtVector(v) {

    return (
        "(" +
        fmt(v.x) +
        ", " +
        fmt(v.y) +
        ", " +
        fmt(v.z) +
        ")"
    );

}


// =====================================================
// UPDATE UI
// =====================================================

function updateUI() {

    const A = getA();
    const B = getB();


    const magnitudeA =
        A.length();

    const magnitudeB =
        B.length();


    const unitA =
        magnitudeA > 0
            ? A.clone()
                .normalize()
            : new THREE.Vector3();


    const unitB =
        magnitudeB > 0
            ? B.clone()
                .normalize()
            : new THREE.Vector3();


    const projectionResult =
        projection();


    let angle = 0;


    if (
        magnitudeA > 0 &&
        magnitudeB > 0
    ) {

        angle =
            Math.acos(
                THREE.MathUtils.clamp(
                    A.dot(B) /
                    (
                        magnitudeA *
                        magnitudeB
                    ),
                    -1,
                    1
                )
            ) *
            180 /
            Math.PI;

    }


    const values = {

        vectorAResult:
            fmtVector(A),

        magnitudeAResult:
            fmt(magnitudeA),

        unitAResult:
            fmtVector(unitA),

        vectorBResult:
            fmtVector(B),

        magnitudeBResult:
            fmt(magnitudeB),

        unitBResult:
            fmtVector(unitB),

        angle3DResult:
            fmt(angle) + "°",

        projectionVectorResult:
            fmtVector(
                projectionResult.vector
            ),

        projectionScalarResult:
            fmt(
                projectionResult.scalar
            ),

        componentAX:
            vectorAX.toFixed(1),

        componentAY:
            vectorAY.toFixed(1),

        componentAZ:
            vectorAZ.toFixed(1),

        componentBX:
            vectorBX.toFixed(1),

        componentBY:
            vectorBY.toFixed(1),

        componentBZ:
            vectorBZ.toFixed(1)

    };


    Object.keys(values)
        .forEach(id => {

            const element =
                document.getElementById(
                    id
                );

            if (element) {

                element.textContent =
                    values[id];

            }

        });


    // Slider value labels

    const sliderValues = {

        vectorAXValue:
            vectorAX.toFixed(1),

        vectorAYValue:
            vectorAY.toFixed(1),

        vectorAZValue:
            vectorAZ.toFixed(1),

        vectorBXValue:
            vectorBX.toFixed(1),

        vectorBYValue:
            vectorBY.toFixed(1),

        vectorBZValue:
            vectorBZ.toFixed(1)

    };


    Object.keys(sliderValues)
        .forEach(id => {

            const element =
                document.getElementById(
                    id
                );

            if (element) {

                element.textContent =
                    sliderValues[id];

            }

        });


    // Operation

    const operation =
        document.getElementById(
            "operationSelect"
        )?.value || "add";


    let result;
    let description;


    if (
        operation ===
        "add"
    ) {

        result =
            A.clone()
                .add(B);

        description =
            "A + B — ผลบวกของเวกเตอร์";

    }

    else if (
        operation ===
        "subtract"
    ) {

        result =
            A.clone()
                .sub(B);

        description =
            "A − B — ผลต่างของเวกเตอร์";

    }

    else if (
        operation ===
        "dot"
    ) {

        result =
            new THREE.Vector3(
                A.dot(B),
                0,
                0
            );

        description =
            "A · B — Dot Product ได้ค่า Scalar";

    }

    else {

        result =
            A.clone()
                .cross(B);

        description =
            "A × B — Cross Product ได้ Vector ตั้งฉาก";

    }


    const operationDescription =
        document.getElementById(
            "operationDescription"
        );


    const operationValue =
        document.getElementById(
            "operationValue"
        );


    if (
        operationDescription
    ) {

        operationDescription.textContent =
            description;

    }


    if (
        operationValue
    ) {

        if (
            operation ===
            "dot"
        ) {

            operationValue.textContent =
                fmt(
                    A.dot(B)
                );

        } else {

            operationValue.textContent =
                fmtVector(
                    result
                );

        }

    }

}


// =====================================================
// SLIDERS
// =====================================================

function slider(
    id,
    setter
) {

    const element =
        document.getElementById(
            id
        );


    if (!element) {
        return;
    }


    element.addEventListener(
        "input",
        () => {

            setter(
                Number(
                    element.value
                )
            );


            updateAll();

        }
    );

}


slider(
    "vectorAX",
    value => vectorAX = value
);


slider(
    "vectorAY",
    value => vectorAY = value
);


slider(
    "vectorAZ",
    value => vectorAZ = value
);


slider(
    "vectorBX",
    value => vectorBX = value
);


slider(
    "vectorBY",
    value => vectorBY = value
);


slider(
    "vectorBZ",
    value => vectorBZ = value
);


// =====================================================
// OPERATION
// =====================================================

document
    .getElementById(
        "operationSelect"
    )
    ?.addEventListener(
        "change",
        updateAll
    );


// =====================================================
// RESET
// =====================================================

document
    .getElementById(
        "resetButton"
    )
    ?.addEventListener(
        "click",
        () => {

            vectorAX = 4;
            vectorAY = 3;
            vectorAZ = 2;

            vectorBX = 2;
            vectorBY = 1;
            vectorBZ = 3;


            const values = {

                vectorAX: 4,
                vectorAY: 3,
                vectorAZ: 2,

                vectorBX: 2,
                vectorBY: 1,
                vectorBZ: 3

            };


            Object.keys(values)
                .forEach(id => {

                    const element =
                        document.getElementById(
                            id
                        );

                    if (element) {

                        element.value =
                            values[id];

                    }

                });


            resetDemo();

            updateAll();

        }
    );


// =====================================================
// SAVE
// =====================================================

document
    .getElementById(
        "saveButton"
    )
    ?.addEventListener(
        "click",
        () => {

            const A = getA();
            const B = getB();

            const history =
                JSON.parse(
                    localStorage.getItem(
                        "engiHistory"
                    )
                ) || [];


            let angle = 0;


            if (
                A.length() > 0 &&
                B.length() > 0
            ) {

                angle =
                    Math.acos(
                        THREE.MathUtils.clamp(
                            A.dot(B) /
                            (
                                A.length() *
                                B.length()
                            ),
                            -1,
                            1
                        )
                    ) *
                    180 /
                    Math.PI;

            }


            history.unshift({

                icon: "🧭",

                title: "3D Vector",

                calculation:
                    "A = " +
                    fmtVector(A) +
                    " | B = " +
                    fmtVector(B) +
                    " | θ = " +
                    angle.toFixed(2) +
                    "°",

                time:
                    new Date()
                        .toLocaleString(
                            "th-TH"
                        ),

                tool:
                    "3D Vector",

                category:
                    "Physics Simulation",

                date:
                    new Date()
                        .toISOString(),

                timestamp:
                    Date.now(),

                input: {

                    vectorA: {
                        x: vectorAX,
                        y: vectorAY,
                        z: vectorAZ
                    },

                    vectorB: {
                        x: vectorBX,
                        y: vectorBY,
                        z: vectorBZ
                    }

                },

                result: {

                    magnitudeA:
                        Number(
                            A.length()
                                .toFixed(2)
                        ),

                    magnitudeB:
                        Number(
                            B.length()
                                .toFixed(2)
                        ),

                    angle:
                        Number(
                            angle.toFixed(2)
                        )

                }

            });


            if (
                history.length > 100
            ) {

                history.length = 100;

            }


            localStorage.setItem(
                "engiHistory",
                JSON.stringify(
                    history
                )
            );


            const button =
                document.getElementById(
                    "saveButton"
                );


            if (button) {

                const old =
                    button.textContent;

                button.textContent =
                    "✓ บันทึกแล้ว";

                setTimeout(
                    () => {

                        button.textContent =
                            old;

                    },
                    1500
                );

            }

        }
    );


// =====================================================
// VECTOR ADDITION DEMO
// =====================================================

let demoRunning = false;
let demoPaused = false;
let demoProgress = 0;

let demoObjects = [];

let demoFrame = null;


function clearDemo() {

    clearArray(
        demoObjects
    );

}


function resetDemo() {

    demoRunning = false;
    demoPaused = false;
    demoProgress = 0;

    if (demoFrame) {

        cancelAnimationFrame(
            demoFrame
        );

        demoFrame = null;

    }


    clearDemo();


    const step =
        document.getElementById(
            "demoStep"
        );


    if (step) {

        step.textContent =
            "พร้อมเริ่มการสาธิต";

    }


    updateAll();

}


function drawDemo(
    progress
) {

    clearDemo();


    const A = getA();
    const B = getB();

    const p =
        THREE.MathUtils.clamp(
            progress,
            0,
            1
        );


    // A

    const AArrow =
        arrow(
            A,
            A_COLOR
        );


    if (AArrow) {

        demoObjects.push(
            AArrow
        );

    }


    // Moving B from origin to A

    const BStart =
        A.clone()
            .multiplyScalar(p);


    const BDemo =
        arrow(
            B,
            B_COLOR,
            BStart
        );


    if (BDemo) {

        demoObjects.push(
            BDemo
        );

    }


    // Connection line

    if (p > 0) {

        demoObjects.push(
            line(
                BStart,
                A,
                B_COLOR,
                0.35
            )
        );

    }


    // Resultant

    const result =
        A.clone()
            .add(B);


    const resultArrow =
        arrow(
            result,
            RESULT_COLOR
        );


    if (resultArrow) {

        demoObjects.push(
            resultArrow
        );

    }

}


// =====================================================
// DEMO ANIMATION
// =====================================================

function animateDemo() {

    if (
        !demoRunning ||
        demoPaused
    ) {

        return;

    }


    demoProgress +=
        0.008;


    if (
        demoProgress >= 1
    ) {

        demoProgress = 1;

        demoRunning = false;


        const step =
            document.getElementById(
                "demoStep"
            );


        if (step) {

            step.textContent =
                "✓ เสร็จแล้ว: Vector B ถูกต่อจากปลาย Vector A และ Resultant คือ A + B";

        }

    } else {

        const step =
            document.getElementById(
                "demoStep"
            );


        if (step) {

            if (
                demoProgress < 0.33
            ) {

                step.textContent =
                    "ขั้นที่ 1: แสดง Vector A";

            }

            else if (
                demoProgress < 0.66
            ) {

                step.textContent =
                    "ขั้นที่ 2: เลื่อน Vector B ไปต่อที่ปลาย Vector A";

            }

            else {

                step.textContent =
                    "ขั้นที่ 3: Vector จากจุดเริ่มต้นถึงปลายสุดคือ A + B";

            }

        }

    }


    drawDemo(
        demoProgress
    );


    if (demoRunning) {

        demoFrame =
            requestAnimationFrame(
                animateDemo
            );

    }

}


// =====================================================
// DEMO BUTTONS
// =====================================================

document
    .getElementById(
        "demoStartButton"
    )
    ?.addEventListener(
        "click",
        () => {

            if (
                demoProgress >= 1
            ) {

                demoProgress = 0;

            }


            demoRunning = true;
            demoPaused = false;

            animateDemo();

        }
    );


document
    .getElementById(
        "demoPauseButton"
    )
    ?.addEventListener(
        "click",
        () => {

            demoPaused = true;

            const step =
                document.getElementById(
                    "demoStep"
                );


            if (step) {

                step.textContent =
                    "⏸ หยุดการสาธิตชั่วคราว";

            }

        }
    );


document
    .getElementById(
        "demoResetButton"
    )
    ?.addEventListener(
        "click",
        resetDemo
    );


// =====================================================
// UPDATE ALL
// =====================================================

function updateAll() {

    updateVectors();

    updateComponents();

    updateProjection();

    updateAngle();

    updateUI();

}


// =====================================================
// RESIZE
// =====================================================

function resize() {

    const width =
        Math.max(
            canvas.clientWidth,
            1
        );

    const height =
        Math.max(
            canvas.clientHeight,
            1
        );


    camera.aspect =
        width /
        height;


    camera.updateProjectionMatrix();


    renderer.setSize(
        width,
        height,
        false
    );

}


window.addEventListener(
    "resize",
    resize
);


// =====================================================
// START
// =====================================================

resize();

updateAll();


// =====================================================
// ANIMATION
// =====================================================

function animate() {

    requestAnimationFrame(
        animate
    );


    controls.update();


    renderer.render(
        scene,
        camera
    );

}


animate();