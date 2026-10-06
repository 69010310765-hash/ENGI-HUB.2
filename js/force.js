function saveForceHistory(calculationText) {

    const history =
        JSON.parse(
            localStorage.getItem("engiHistory")
        ) || [];


    const historyItem = {

        icon: "💪",

        title: "Force Calculator",

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



function calculateForce() {

    // รับค่าจาก Dropdown
    const type =
        document.getElementById("calculateType").value;


    // รับค่าจาก Input
    const force =
        parseFloat(
            document.getElementById("force").value
        );

    const mass =
        parseFloat(
            document.getElementById("mass").value
        );

    const acceleration =
        parseFloat(
            document.getElementById("acceleration").value
        );


    // ช่องแสดงผล
    const answer =
        document.getElementById("answer");

    const steps =
        document.getElementById("steps");



    // =========================
    // หา Force
    // F = m × a
    // =========================

    if (type === "force") {

        if (isNaN(mass) || isNaN(acceleration)) {

            answer.innerHTML =
                "กรุณากรอก Mass และ Acceleration";

            steps.innerHTML = "";

            return;
        }


        const result =
            mass * acceleration;


        answer.innerHTML =
            "Force = " + result + " N";


        steps.innerHTML =
            "F = m × a<br>" +
            "F = " + mass + " × " + acceleration + "<br>" +
            "F = " + result + " N";


        // บันทึก History
        saveForceHistory(
            `m = ${mass} kg | a = ${acceleration} m/s² | F = ${result} N`
        );
    }



    // =========================
    // หา Mass
    // m = F / a
    // =========================

    else if (type === "mass") {

        if (isNaN(force) || isNaN(acceleration)) {

            answer.innerHTML =
                "กรุณากรอก Force และ Acceleration";

            steps.innerHTML = "";

            return;
        }


        if (acceleration === 0) {

            answer.innerHTML =
                "Acceleration ต้องไม่เป็น 0";

            steps.innerHTML = "";

            return;
        }


        const result =
            force / acceleration;


        answer.innerHTML =
            "Mass = " + result + " kg";


        steps.innerHTML =
            "m = F / a<br>" +
            "m = " + force + " / " + acceleration + "<br>" +
            "m = " + result + " kg";


        // บันทึก History
        saveForceHistory(
            `F = ${force} N | a = ${acceleration} m/s² | m = ${result} kg`
        );
    }



    // =========================
    // หา Acceleration
    // a = F / m
    // =========================

    else if (type === "acceleration") {

        if (isNaN(force) || isNaN(mass)) {

            answer.innerHTML =
                "กรุณากรอก Force และ Mass";

            steps.innerHTML = "";

            return;
        }


        if (mass === 0) {

            answer.innerHTML =
                "Mass ต้องไม่เป็น 0";

            steps.innerHTML = "";

            return;
        }


        const result =
            force / mass;


        answer.innerHTML =
            "Acceleration = " + result + " m/s²";


        steps.innerHTML =
            "a = F / m<br>" +
            "a = " + force + " / " + mass + "<br>" +
            "a = " + result + " m/s²";


        // บันทึก History
        saveForceHistory(
            `F = ${force} N | m = ${mass} kg | a = ${result} m/s²`
        );
    }

}



function updateForceInputs() {

    const type =
        document.getElementById("calculateType").value;


    const forceGroup =
        document.getElementById("forceGroup");

    const massGroup =
        document.getElementById("massGroup");

    const accelerationGroup =
        document.getElementById("accelerationGroup");



    // หา Force
    if (type === "force") {

        forceGroup.style.display = "none";

        massGroup.style.display = "block";

        accelerationGroup.style.display = "block";

    }


    // หา Mass
    else if (type === "mass") {

        forceGroup.style.display = "block";

        massGroup.style.display = "none";

        accelerationGroup.style.display = "block";

    }


    // หา Acceleration
    else if (type === "acceleration") {

        forceGroup.style.display = "block";

        massGroup.style.display = "block";

        accelerationGroup.style.display = "none";
    }
}



// เมื่อเปลี่ยนประเภทการคำนวณ
document
    .getElementById("calculateType")
    .addEventListener(
        "change",
        updateForceInputs
    );



// เรียกใช้งานครั้งแรก
updateForceInputs();