function saveTorqueHistory(calculationText) {

    const history =
        JSON.parse(
            localStorage.getItem("engiHistory")
        ) || [];


    const historyItem = {

        icon: "🔧",

        title: "Torque Calculator",

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



function calculateTorque() {

    // รับค่าจาก Dropdown
    const type =
        document.getElementById("calculateType").value;


    // รับค่าจาก Input
    const torque =
        parseFloat(
            document.getElementById("torque").value
        );

    const distance =
        parseFloat(
            document.getElementById("distance").value
        );

    const force =
        parseFloat(
            document.getElementById("force").value
        );


    // ช่องแสดงผล
    const answer =
        document.getElementById("answer");

    const steps =
        document.getElementById("steps");



    // =========================
    // หา Torque
    // τ = r × F
    // =========================

    if (type === "torque") {

        if (isNaN(distance) || isNaN(force)) {

            answer.innerHTML =
                "กรุณากรอก Distance และ Force";

            steps.innerHTML = "";

            return;
        }


        const result =
            distance * force;


        answer.innerHTML =
            "Torque = " + result + " N·m";


        steps.innerHTML =
            "τ = r × F<br>" +
            "τ = " + distance + " × " + force + "<br>" +
            "τ = " + result + " N·m";


        // บันทึก History
        saveTorqueHistory(
            `r = ${distance} m | F = ${force} N | τ = ${result} N·m`
        );
    }



    // =========================
    // หา Distance
    // r = τ / F
    // =========================

    else if (type === "distance") {

        if (isNaN(torque) || isNaN(force)) {

            answer.innerHTML =
                "กรุณากรอก Torque และ Force";

            steps.innerHTML = "";

            return;
        }


        if (force === 0) {

            answer.innerHTML =
                "Force ต้องไม่เป็น 0";

            steps.innerHTML = "";

            return;
        }


        const result =
            torque / force;


        answer.innerHTML =
            "Distance = " + result + " m";


        steps.innerHTML =
            "r = τ / F<br>" +
            "r = " + torque + " / " + force + "<br>" +
            "r = " + result + " m";


        // บันทึก History
        saveTorqueHistory(
            `τ = ${torque} N·m | F = ${force} N | r = ${result} m`
        );
    }



    // =========================
    // หา Force
    // F = τ / r
    // =========================

    else if (type === "force") {

        if (isNaN(torque) || isNaN(distance)) {

            answer.innerHTML =
                "กรุณากรอก Torque และ Distance";

            steps.innerHTML = "";

            return;
        }


        if (distance === 0) {

            answer.innerHTML =
                "Distance ต้องไม่เป็น 0";

            steps.innerHTML = "";

            return;
        }


        const result =
            torque / distance;


        answer.innerHTML =
            "Force = " + result + " N";


        steps.innerHTML =
            "F = τ / r<br>" +
            "F = " + torque + " / " + distance + "<br>" +
            "F = " + result + " N";


        // บันทึก History
        saveTorqueHistory(
            `τ = ${torque} N·m | r = ${distance} m | F = ${result} N`
        );
    }

}



function updateTorqueInputs() {

    const type =
        document.getElementById("calculateType").value;


    const torqueGroup =
        document.getElementById("torqueGroup");

    const distanceGroup =
        document.getElementById("distanceGroup");

    const forceGroup =
        document.getElementById("forceGroup");



    // หา Torque
    if (type === "torque") {

        torqueGroup.style.display = "none";

        distanceGroup.style.display = "block";

        forceGroup.style.display = "block";

    }


    // หา Distance
    else if (type === "distance") {

        torqueGroup.style.display = "block";

        distanceGroup.style.display = "none";

        forceGroup.style.display = "block";

    }


    // หา Force
    else if (type === "force") {

        torqueGroup.style.display = "block";

        distanceGroup.style.display = "block";

        forceGroup.style.display = "none";
    }
}



// เมื่อเปลี่ยนประเภทการคำนวณ
document
    .getElementById("calculateType")
    .addEventListener(
        "change",
        updateTorqueInputs
    );



// เรียกใช้งานครั้งแรก
updateTorqueInputs();