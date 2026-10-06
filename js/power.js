function savePowerHistory(calculationText) {

    const history =
        JSON.parse(
            localStorage.getItem("engiHistory")
        ) || [];


    const historyItem = {

        icon: "🔌",

        title: "Electrical Power",

        calculation:
            calculationText,

        time:
            new Date().toLocaleString("th-TH")

    };


    history.unshift(historyItem);


    localStorage.setItem(
        "engiHistory",
        JSON.stringify(history)
    );

}


function calculatePower() {

    // รับค่าจาก Dropdown
    const type =
        document.getElementById("calculateType").value;


    // รับค่าจาก Input
    const power =
        parseFloat(
            document.getElementById("power").value
        );

    const voltage =
        parseFloat(
            document.getElementById("voltage").value
        );

    const current =
        parseFloat(
            document.getElementById("current").value
        );


    // ช่องแสดงผล
    const answer =
        document.getElementById("answer");

    const steps =
        document.getElementById("steps");


    // =========================
    // หา Power
    // P = V × I
    // =========================

    if (type === "power") {

        if (isNaN(voltage) || isNaN(current)) {

            answer.innerHTML =
                "กรุณากรอก Voltage และ Current";

            steps.innerHTML = "";

            return;
        }


        const result =
            voltage * current;


        answer.innerHTML =
            "Power = " +
            result +
            " W";


        steps.innerHTML =
            "P = V × I<br>" +
            "P = " + voltage +
            " × " + current + "<br>" +
            "P = " + result +
            " W";


        savePowerHistory(
            `V = ${voltage} V | I = ${current} A | P = ${result} W`
        );

    }


    // =========================
    // หา Voltage
    // V = P / I
    // =========================

    else if (type === "voltage") {

        if (isNaN(power) || isNaN(current)) {

            answer.innerHTML =
                "กรุณากรอก Power และ Current";

            steps.innerHTML = "";

            return;
        }


        if (current === 0) {

            answer.innerHTML =
                "Current ต้องไม่เป็น 0";

            steps.innerHTML = "";

            return;
        }


        const result =
            power / current;


        answer.innerHTML =
            "Voltage = " +
            result +
            " V";


        steps.innerHTML =
            "V = P / I<br>" +
            "V = " + power +
            " / " + current + "<br>" +
            "V = " + result +
            " V";


        savePowerHistory(
            `P = ${power} W | I = ${current} A | V = ${result} V`
        );

    }


    // =========================
    // หา Current
    // I = P / V
    // =========================

    else if (type === "current") {

        if (isNaN(power) || isNaN(voltage)) {

            answer.innerHTML =
                "กรุณากรอก Power และ Voltage";

            steps.innerHTML = "";

            return;
        }


        if (voltage === 0) {

            answer.innerHTML =
                "Voltage ต้องไม่เป็น 0";

            steps.innerHTML = "";

            return;
        }


        const result =
            power / voltage;


        answer.innerHTML =
            "Current = " +
            result +
            " A";


        steps.innerHTML =
            "I = P / V<br>" +
            "I = " + power +
            " / " + voltage + "<br>" +
            "I = " + result +
            " A";


        savePowerHistory(
            `P = ${power} W | V = ${voltage} V | I = ${result} A`
        );

    }

}


function updatePowerInputs() {

    const type =
        document.getElementById("calculateType").value;


    const powerGroup =
        document.getElementById("powerGroup");

    const voltageGroup =
        document.getElementById("voltageGroup");

    const currentGroup =
        document.getElementById("currentGroup");


    // หา Power
    if (type === "power") {

        powerGroup.style.display = "none";

        voltageGroup.style.display = "block";

        currentGroup.style.display = "block";

    }


    // หา Voltage
    else if (type === "voltage") {

        powerGroup.style.display = "block";

        voltageGroup.style.display = "none";

        currentGroup.style.display = "block";

    }


    // หา Current
    else if (type === "current") {

        powerGroup.style.display = "block";

        voltageGroup.style.display = "block";

        currentGroup.style.display = "none";

    }

}


// เมื่อเปลี่ยนประเภทการคำนวณ
document
    .getElementById("calculateType")
    .addEventListener(
        "change",
        updatePowerInputs
    );


// เรียกใช้งานครั้งแรก
updatePowerInputs();