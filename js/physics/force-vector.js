import * as THREE from "three";

import {
    OrbitControls
} from "three/addons/controls/OrbitControls.js";


// ======================================================
// CANVAS
// ======================================================

const canvas =
    document.getElementById(
        "forceCanvas"
    );


// ======================================================
// SCENE
// ======================================================

const scene =
    new THREE.Scene();


scene.background =
    new THREE.Color(
        0x0b1120
    );


// ======================================================
// CAMERA
// ======================================================

const camera =
    new THREE.PerspectiveCamera(
        55,
        1,
        0.1,
        1000
    );


camera.position.set(
    11,
    8,
    11
);


// ======================================================
// RENDERER
// ======================================================

const renderer =
    new THREE.WebGLRenderer({

        canvas: canvas,

        antialias: true

    });


renderer.setPixelRatio(
    Math.min(
        window.devicePixelRatio,
        2
    )
);


// ======================================================
// CONTROLS
// ======================================================

const controls =
    new OrbitControls(
        camera,
        renderer.domElement
    );


controls.enableDamping =
    true;


controls.dampingFactor =
    0.08;


controls.minDistance =
    4;


controls.maxDistance =
    30;


// ======================================================
// LIGHT
// ======================================================

const ambientLight =
    new THREE.AmbientLight(
        0xffffff,
        1.3
    );


scene.add(
    ambientLight
);


// ======================================================
// GRID
// ======================================================

const grid =
    new THREE.GridHelper(
        20,
        20,
        0x475569,
        0x1e293b
    );


scene.add(
    grid
);


// ======================================================
// AXES
// ======================================================

const axes =
    new THREE.AxesHelper(
        7
    );


scene.add(
    axes
);


// ======================================================
// FORCE VALUES
// ======================================================

let f1x = 4;

let f1y = 2;

let f1z = 1;


let f2x = -2;

let f2y = 3;

let f2z = 2;


let f3x = 1;

let f3y = -1;

let f3z = 3;


// ======================================================
// VECTOR OBJECTS
// ======================================================

const force1 =
    new THREE.Vector3();


const force2 =
    new THREE.Vector3();


const force3 =
    new THREE.Vector3();


const resultant =
    new THREE.Vector3();


// ======================================================
// ARROWS
// ======================================================

let arrow1 = null;

let arrow2 = null;

let arrow3 = null;

let resultantArrow = null;


// ======================================================
// COLORS
// ======================================================

const FORCE1_COLOR =
    0xef4444;


const FORCE2_COLOR =
    0xf97316;


const FORCE3_COLOR =
    0xa855f7;


const RESULT_COLOR =
    0x22c55e;


// ======================================================
// CREATE ARROW
// ======================================================

function createArrow(
    vector,
    color
) {

    const length =
        vector.length();


    if (
        length <
        0.0001
    ) {

        return null;

    }


    const direction =
        vector
            .clone()
            .normalize();


    const headLength =
        Math.min(
            0.45,
            Math.max(
                0.20,
                length * 0.18
            )
        );


    const headWidth =
        Math.min(
            0.22,
            Math.max(
                0.10,
                length * 0.09
            )
        );


    return new THREE.ArrowHelper(

        direction,

        new THREE.Vector3(
            0,
            0,
            0
        ),

        length,

        color,

        headLength,

        headWidth

    );

}


// ======================================================
// TEXT SPRITE
// ======================================================

function createTextSprite(
    text,
    color
) {

    const textCanvas =
        document.createElement(
            "canvas"
        );


    textCanvas.width =
        256;


    textCanvas.height =
        128;


    const ctx =
        textCanvas.getContext(
            "2d"
        );


    ctx.clearRect(
        0,
        0,
        256,
        128
    );


    ctx.font =
        "bold 52px Arial";


    ctx.fillStyle =
        color;


    ctx.textAlign =
        "center";


    ctx.textBaseline =
        "middle";


    ctx.fillText(
        text,
        128,
        64
    );


    const texture =
        new THREE.CanvasTexture(
            textCanvas
        );


    const material =
        new THREE.SpriteMaterial({

            map: texture,

            transparent: true

        });


    const sprite =
        new THREE.Sprite(
            material
        );


    sprite.scale.set(
        1.4,
        0.7,
        1
    );


    return sprite;

}


// ======================================================
// AXIS LABELS
// ======================================================

function createAxisLabels() {

    const xLabel =
        createTextSprite(
            "X",
            "#ef4444"
        );


    xLabel.position.set(
        7.5,
        0,
        0
    );


    scene.add(
        xLabel
    );


    const yLabel =
        createTextSprite(
            "Y",
            "#22c55e"
        );


    yLabel.position.set(
        0,
        7.5,
        0
    );


    scene.add(
        yLabel
    );


    const zLabel =
        createTextSprite(
            "Z",
            "#3b82f6"
        );


    zLabel.position.set(
        0,
        0,
        7.5
    );


    scene.add(
        zLabel
    );

}


// ======================================================
// UPDATE VECTOR VALUES
// ======================================================

function updateVectors() {

    force1.set(
        f1x,
        f1y,
        f1z
    );


    force2.set(
        f2x,
        f2y,
        f2z
    );


    force3.set(
        f3x,
        f3y,
        f3z
    );


    resultant
        .copy(force1)
        .add(force2)
        .add(force3);

}


// ======================================================
// REMOVE ARROW
// ======================================================

function removeArrow(
    arrow
) {

    if (
        arrow
    ) {

        scene.remove(
            arrow
        );

    }

}


// ======================================================
// UPDATE ARROWS
// ======================================================

function updateArrows() {

    removeArrow(
        arrow1
    );


    removeArrow(
        arrow2
    );


    removeArrow(
        arrow3
    );


    removeArrow(
        resultantArrow
    );


    updateVectors();


    arrow1 =
        createArrow(
            force1,
            FORCE1_COLOR
        );


    arrow2 =
        createArrow(
            force2,
            FORCE2_COLOR
        );


    arrow3 =
        createArrow(
            force3,
            FORCE3_COLOR
        );


    resultantArrow =
        createArrow(
            resultant,
            RESULT_COLOR
        );


    if (
        arrow1
    ) {

        scene.add(
            arrow1
        );

    }


    if (
        arrow2
    ) {

        scene.add(
            arrow2
        );

    }


    if (
        arrow3
    ) {

        scene.add(
            arrow3
        );

    }


    if (
        resultantArrow
    ) {

        scene.add(
            resultantArrow
        );

    }

}


// ======================================================
// FORMAT
// ======================================================

function formatNumber(
    value
) {

    if (
        !Number.isFinite(
            value
        )
    ) {

        return "0";

    }


    if (
        Math.abs(value) <
        0.0005
    ) {

        return "0";

    }


    return value.toFixed(
        2
    );

}


function formatVector(
    vector
) {

    return "(" +

        formatNumber(
            vector.x
        ) +

        ", " +

        formatNumber(
            vector.y
        ) +

        ", " +

        formatNumber(
            vector.z
        ) +

        ")";

}


// ======================================================
// UNIT VECTOR
// ======================================================

function getUnitVector(
    vector
) {

    const magnitude =
        vector.length();


    if (
        magnitude <
        0.000001
    ) {

        return "(0, 0, 0)";

    }


    return formatVector(

        vector
            .clone()
            .divideScalar(
                magnitude
            )

    );

}


// ======================================================
// UPDATE RESULTS
// ======================================================

function updateResults() {

    const magnitude =
        resultant.length();


    document.getElementById(
        "resultFx"
    ).textContent =
        formatNumber(
            resultant.x
        ) +
        " N";


    document.getElementById(
        "resultFy"
    ).textContent =
        formatNumber(
            resultant.y
        ) +
        " N";


    document.getElementById(
        "resultFz"
    ).textContent =
        formatNumber(
            resultant.z
        ) +
        " N";


    document.getElementById(
        "resultMagnitude"
    ).textContent =
        formatNumber(
            magnitude
        ) +
        " N";


    document.getElementById(
        "resultUnit"
    ).textContent =
        getUnitVector(
            resultant
        );


    document.getElementById(
        "resultVector"
    ).textContent =
        "ΣF = " +
        formatVector(
            resultant
        ) +
        " N";


    updateEquilibrium(
        magnitude
    );

}


// ======================================================
// EQUILIBRIUM
// ======================================================

function updateEquilibrium(
    magnitude
) {

    const element =
        document.getElementById(
            "equilibriumText"
        );


    const tolerance =
        0.05;


    if (
        magnitude <=
        tolerance
    ) {

        element.textContent =
            "✅ ระบบอยู่ในสภาวะสมดุล";


        element.style.color =
            "#16a34a";

    } else {

        element.textContent =
            "⚠️ ระบบยังไม่สมดุล";


        element.style.color =
            "#dc2626";

    }

}


// ======================================================
// UPDATE STATUS
// ======================================================

function updateStatus(
    text
) {

    document.getElementById(
        "statusText"
    ).textContent =
        text;

}


// ======================================================
// UPDATE EVERYTHING
// ======================================================

function updateAll() {

    updateVectors();

    updateArrows();

    updateResults();


    updateStatus(
        "Forces updated in real-time"
    );

}


// ======================================================
// SLIDER
// ======================================================

function setupSlider(
    inputId,
    valueId,
    setter
) {

    const input =
        document.getElementById(
            inputId
        );


    const output =
        document.getElementById(
            valueId
        );


    input.addEventListener(
        "input",
        function () {

            const value =
                Number(
                    this.value
                );


            if (
                !Number.isFinite(
                    value
                )
            ) {

                return;

            }


            setter(
                value
            );


            output.textContent =
                value.toFixed(
                    1
                ) +
                " N";


            updateAll();

        }
    );

}


// ======================================================
// F1
// ======================================================

setupSlider(
    "f1x",
    "f1xValue",
    value => {

        f1x = value;

    }
);


setupSlider(
    "f1y",
    "f1yValue",
    value => {

        f1y = value;

    }
);


setupSlider(
    "f1z",
    "f1zValue",
    value => {

        f1z = value;

    }
);


// ======================================================
// F2
// ======================================================

setupSlider(
    "f2x",
    "f2xValue",
    value => {

        f2x = value;

    }
);


setupSlider(
    "f2y",
    "f2yValue",
    value => {

        f2y = value;

    }
);


setupSlider(
    "f2z",
    "f2zValue",
    value => {

        f2z = value;

    }
);


// ======================================================
// F3
// ======================================================

setupSlider(
    "f3x",
    "f3xValue",
    value => {

        f3x = value;

    }
);


setupSlider(
    "f3y",
    "f3yValue",
    value => {

        f3y = value;

    }
);


setupSlider(
    "f3z",
    "f3zValue",
    value => {

        f3z = value;

    }
);


// ======================================================
// RESET
// ======================================================

document.getElementById(
    "resetButton"
).addEventListener(
    "click",
    function () {

        f1x = 4;

        f1y = 2;

        f1z = 1;


        f2x = -2;

        f2y = 3;

        f2z = 2;


        f3x = 1;

        f3y = -1;

        f3z = 3;


        const values = {

            f1x: 4,

            f1y: 2,

            f1z: 1,

            f2x: -2,

            f2y: 3,

            f2z: 2,

            f3x: 1,

            f3y: -1,

            f3z: 3

        };


        Object.keys(
            values
        ).forEach(
            id => {

                document.getElementById(
                    id
                ).value =
                    values[id];

            }
        );


        document.getElementById(
            "f1xValue"
        ).textContent =
            "4.0 N";


        document.getElementById(
            "f1yValue"
        ).textContent =
            "2.0 N";


        document.getElementById(
            "f1zValue"
        ).textContent =
            "1.0 N";


        document.getElementById(
            "f2xValue"
        ).textContent =
            "-2.0 N";


        document.getElementById(
            "f2yValue"
        ).textContent =
            "3.0 N";


        document.getElementById(
            "f2zValue"
        ).textContent =
            "2.0 N";


        document.getElementById(
            "f3xValue"
        ).textContent =
            "1.0 N";


        document.getElementById(
            "f3yValue"
        ).textContent =
            "-1.0 N";


        document.getElementById(
            "f3zValue"
        ).textContent =
            "3.0 N";


        updateAll();


        updateStatus(
            "Reset complete"
        );

    }
);


// ======================================================
// SAVE HISTORY
// ======================================================

document.getElementById(
    "saveButton"
).addEventListener(
    "click",
    function () {

        const history =
            JSON.parse(
                localStorage.getItem(
                    "engiHistory"
                )
            ) || [];


        const item = {

            icon: "🧲",

            title:
                "Force Vector Laboratory",

            calculation:

                "F₁ = " +
                formatVector(
                    force1
                ) +

                " N | F₂ = " +
                formatVector(
                    force2
                ) +

                " N | F₃ = " +
                formatVector(
                    force3
                ) +

                " N | ΣF = " +
                formatVector(
                    resultant
                ) +
                " N",

            time:
                new Date()
                    .toLocaleString(
                        "th-TH"
                    ),

            tool:
                "Force Vector Laboratory",

            category:
                "Physics Simulation",

            date:
                new Date()
                    .toISOString(),

            timestamp:
                Date.now(),

            input: {

                force1: {

                    x: f1x,

                    y: f1y,

                    z: f1z

                },

                force2: {

                    x: f2x,

                    y: f2y,

                    z: f2z

                },

                force3: {

                    x: f3x,

                    y: f3y,

                    z: f3z

                }

            },

            result: {

                x:
                    Number(
                        resultant.x
                            .toFixed(2)
                    ),

                y:
                    Number(
                        resultant.y
                            .toFixed(2)
                    ),

                z:
                    Number(
                        resultant.z
                            .toFixed(2)
                    ),

                magnitude:
                    Number(
                        resultant
                            .length()
                            .toFixed(2)
                    ),

                equilibrium:
                    resultant.length()
                    <= 0.05

            }

        };


        history.unshift(
            item
        );


        if (
            history.length >
            100
        ) {

            history.length =
                100;

        }


        localStorage.setItem(
            "engiHistory",
            JSON.stringify(
                history
            )
        );


        updateStatus(
            "Saved to Calculation History ✓"
        );

    }
);


// ======================================================
// AXIS LABELS
// ======================================================

createAxisLabels();


// ======================================================
// INITIAL
// ======================================================

updateAll();


// ======================================================
// RESIZE
// ======================================================

function resizeRenderer() {

    const width =
        canvas.clientWidth;


    const height =
        canvas.clientHeight;


    if (
        width <= 0 ||
        height <= 0
    ) {

        return;

    }


    camera.aspect =
        width / height;


    camera.updateProjectionMatrix();


    renderer.setSize(
        width,
        height,
        false
    );

}


window.addEventListener(
    "resize",
    resizeRenderer
);


resizeRenderer();


// ======================================================
// ANIMATION
// ======================================================

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