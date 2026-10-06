const calculateType =
    document.getElementById("calculateType");

const voltageGroup =
    document.getElementById("voltageGroup");

const currentGroup =
    document.getElementById("currentGroup");

const resistanceGroup =
    document.getElementById("resistanceGroup");

const voltage =
    document.getElementById("voltage");

const current =
    document.getElementById("current");

const resistance =
    document.getElementById("resistance");

const answer =
    document.getElementById("answer");

const steps =
    document.getElementById("steps");


/* ========================================
   Update Input Fields
======================================== */

function updateInputs() {

    const selected =
        calculateType.value;


    voltageGroup.style.display = "none";
    currentGroup.style.display = "none";
    resistanceGroup.style.display = "none";


    if (selected === "current") {

        voltageGroup.style.display = "block";

        resistanceGroup.style.display = "block";

    }


    else if (selected === "voltage") {

        currentGroup.style.display = "block";

        resistanceGroup.style.display = "block";

    }


    else if (selected === "resistance") {

        voltageGroup.style.display = "block";

        currentGroup.style.display = "block";

    }

}


/* ========================================
   Save History
======================================== */

function saveHistory(calculationText) {

    const history =
        JSON.parse(
            localStorage.getItem("engiHistory")
        ) || [];


    const historyItem = {

        icon: "⚡",

        title: "Ohm's Law",

        calculation: calculationText,

        time:
            new Date().toLocaleString("th-TH")

    };


    history.unshift(historyItem);


    localStorage.setItem(
        "engiHistory",
        JSON.stringify(history)
    );

}


/* ========================================
   Calculate Ohm's Law
======================================== */

function calculateOhm() {

    const selected =
        calculateType.value;


    let result;


    /* ---------- Current ---------- */

    if (selected === "current") {

        const v =
            parseFloat(voltage.value);

        const r =
            parseFloat(resistance.value);


        if (isNaN(v) || isNaN(r)) {

            answer.innerHTML =
                "กรุณากรอกข้อมูลให้ครบ";

            steps.innerHTML =
                "กรุณากรอก Voltage และ Resistance";

            return;

        }


        if (r === 0) {

            answer.innerHTML =
                "ไม่สามารถหารด้วย 0 ได้";

            steps.innerHTML =
                "";

            return;

        }


        result = v / r;


        answer.innerHTML =
            "I = " +
            result.toFixed(2) +
            " A";


        steps.innerHTML = `

            <h3>
                Calculation Steps
            </h3>

            <p>
                I = V / R
            </p>

            <p>
                I = ${v} / ${r}
            </p>

            <p>
                I = ${result.toFixed(2)} A
            </p>

        `;


        saveHistory(
            `V = ${v} V | R = ${r} Ω | I = ${result.toFixed(2)} A`
        );

    }


    /* ---------- Voltage ---------- */

    else if (selected === "voltage") {

        const i =
            parseFloat(current.value);

        const r =
            parseFloat(resistance.value);


        if (isNaN(i) || isNaN(r)) {

            answer.innerHTML =
                "กรุณากรอกข้อมูลให้ครบ";

            steps.innerHTML =
                "กรุณากรอก Current และ Resistance";

            return;

        }


        result = i * r;


        answer.innerHTML =
            "V = " +
            result.toFixed(2) +
            " V";


        steps.innerHTML = `

            <h3>
                Calculation Steps
            </h3>

            <p>
                V = I × R
            </p>

            <p>
                V = ${i} × ${r}
            </p>

            <p>
                V = ${result.toFixed(2)} V
            </p>

        `;


        saveHistory(
            `I = ${i} A | R = ${r} Ω | V = ${result.toFixed(2)} V`
        );

    }


    /* ---------- Resistance ---------- */

    else if (selected === "resistance") {

        const v =
            parseFloat(voltage.value);

        const i =
            parseFloat(current.value);


        if (isNaN(v) || isNaN(i)) {

            answer.innerHTML =
                "กรุณากรอกข้อมูลให้ครบ";

            steps.innerHTML =
                "กรุณากรอก Voltage และ Current";

            return;

        }


        if (i === 0) {

            answer.innerHTML =
                "ไม่สามารถหารด้วย 0 ได้";

            steps.innerHTML =
                "";

            return;

        }


        result = v / i;


        answer.innerHTML =
            "R = " +
            result.toFixed(2) +
            " Ω";


        steps.innerHTML = `

            <h3>
                Calculation Steps
            </h3>

            <p>
                R = V / I
            </p>

            <p>
                R = ${v} / ${i}
            </p>

            <p>
                R = ${result.toFixed(2)} Ω
            </p>

        `;


        saveHistory(
            `V = ${v} V | I = ${i} A | R = ${result.toFixed(2)} Ω`
        );

    }

}


/* ========================================
   Change Calculation Type
======================================== */

calculateType.addEventListener(
    "change",
    updateInputs
);


/* ========================================
   Start
======================================== */

updateInputs();