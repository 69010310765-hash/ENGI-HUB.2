function savePressureHistory(calculationText) {

    const history =
        JSON.parse(
            localStorage.getItem("engiHistory")
        ) || [];


    const historyItem = {

        icon: "💨",

        title: "Pressure Calculator",

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



function calculatePressure() {

    // รับค่าจาก Dropdown
    const type =
        document.getElementById("calculateType").value;


    // รับค่าจาก Input
    const pressure =
        parseFloat(
            document.getElementById("pressure").value
        );

    const force =
        parseFloat(
            document.getElementById("force").value
        );

    const area =
        parseFloat(
            document.getElementById("area").value
        );


    // ช่องแสดงผล
    const answer =
        document.getElementById("answer");

    const steps =
        document.getElementById("steps");



    // =========================
    // หา Pressure
    // P = F / A
    // =========================

    if (type === "pressure") {

        if (isNaN(force) || isNaN(area)) {

            answer.innerHTML =
                "กรุณากรอก Force และ Area";

            steps.innerHTML = "";

            return;
        }


        if (area === 0) {

            answer.innerHTML =
                "Area ต้องไม่เป็น 0";

            steps.innerHTML = "";

            return;
        }


        const result =
            force / area;


        answer.innerHTML =
            "Pressure = " + result + " Pa";


        steps.innerHTML =
            "P = F / A<br>" +
            "P = " + force + " / " + area + "<br>" +
            "P = " + result + " Pa";


        // บันทึก History
        savePressureHistory(
            `F = ${force} N | A = ${area} m² | P = ${result} Pa`
        );
    }



    // =========================
    // หา Force
    // F = P × A
    // =========================

    else if (type === "force") {

        if (isNaN(pressure) || isNaN(area)) {

            answer.innerHTML =
                "กรุณากรอก Pressure และ Area";

            steps.innerHTML = "";

            return;
        }


        const result =
            pressure * area;


        answer.innerHTML =
            "Force = " + result + " N";


        steps.innerHTML =
            "F = P × A<br>" +
            "F = " + pressure + " × " + area + "<br>" +
            "F = " + result + " N";


        // บันทึก History
        savePressureHistory(
            `P = ${pressure} Pa | A = ${area} m² | F = ${result} N`
        );
    }



    // =========================
    // หา Area
    // A = F / P
    // =========================

    else if (type === "area") {

        if (isNaN(pressure) || isNaN(force)) {

            answer.innerHTML =
                "กรุณากรอก Pressure และ Force";

            steps.innerHTML = "";

            return;
        }


        if (pressure === 0) {

            answer.innerHTML =
                "Pressure ต้องไม่เป็น 0";

            steps.innerHTML = "";

            return;
        }


        const result =
            force / pressure;


        answer.innerHTML =
            "Area = " + result + " m²";


        steps.innerHTML =
            "A = F / P<br>" +
            "A = " + force + " / " + pressure + "<br>" +
            "A = " + result + " m²";


        // บันทึก History
        savePressureHistory(
            `F = ${force} N | P = ${pressure} Pa | A = ${result} m²`
        );
    }

}



function updatePressureInputs() {

    const type =
        document.getElementById("calculateType").value;


    const pressureGroup =
        document.getElementById("pressureGroup");

    const forceGroup =
        document.getElementById("forceGroup");

    const areaGroup =
        document.getElementById("areaGroup");



    // =========================
    // หา Pressure
    // ต้องกรอก Force + Area
    // =========================

    if (type === "pressure") {

        pressureGroup.style.display = "none";

        forceGroup.style.display = "block";

        areaGroup.style.display = "block";

    }



    // =========================
    // หา Force
    // ต้องกรอก Pressure + Area
    // =========================

    else if (type === "force") {

        pressureGroup.style.display = "block";

        forceGroup.style.display = "none";

        areaGroup.style.display = "block";

    }



    // =========================
    // หา Area
    // ต้องกรอก Pressure + Force
    // =========================

    else if (type === "area") {

        pressureGroup.style.display = "block";

        forceGroup.style.display = "block";

        areaGroup.style.display = "none";

    }

}



// เมื่อเปลี่ยนประเภทการคำนวณ
document
    .getElementById("calculateType")
    .addEventListener(
        "change",
        updatePressureInputs
    );



// เรียกใช้งานครั้งแรก
updatePressureInputs();