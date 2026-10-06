const category =
    document.getElementById("category");

const fromUnit =
    document.getElementById("fromUnit");

const toUnit =
    document.getElementById("toUnit");

const inputValue =
    document.getElementById("inputValue");

const answer =
    document.getElementById("answer");

const swapButton =
    document.getElementById("swapButton");



// =========================
// บันทึก History
// =========================

function saveUnitHistory(calculationText) {

    const history =
        JSON.parse(
            localStorage.getItem("engiHistory")
        ) || [];


    const historyItem = {

        icon: "🔄",

        title: "Unit Converter",

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



// =========================
// รายการหน่วย
// =========================

const units = {

    length: [
        { value: "mm", text: "Millimeter (mm)" },
        { value: "cm", text: "Centimeter (cm)" },
        { value: "m", text: "Meter (m)" },
        { value: "km", text: "Kilometer (km)" }
    ],

    mass: [
        { value: "g", text: "Gram (g)" },
        { value: "kg", text: "Kilogram (kg)" },
        { value: "ton", text: "Ton (t)" }
    ],

    time: [
        { value: "s", text: "Second (s)" },
        { value: "min", text: "Minute (min)" },
        { value: "h", text: "Hour (h)" }
    ],

    temperature: [
        { value: "c", text: "Celsius (°C)" },
        { value: "f", text: "Fahrenheit (°F)" },
        { value: "k", text: "Kelvin (K)" }
    ],

    pressure: [
        { value: "pa", text: "Pascal (Pa)" },
        { value: "kpa", text: "Kilopascal (kPa)" },
        { value: "bar", text: "Bar (bar)" },
        { value: "psi", text: "Pound per Square Inch (psi)" }
    ]

};



// =========================
// สร้างรายการหน่วย
// =========================

function updateUnits() {

    const selectedCategory =
        category.value;

    const selectedUnits =
        units[selectedCategory];


    fromUnit.innerHTML = "";

    toUnit.innerHTML = "";


    selectedUnits.forEach(function(unit) {

        const fromOption =
            document.createElement("option");

        fromOption.value =
            unit.value;

        fromOption.textContent =
            unit.text;


        const toOption =
            document.createElement("option");

        toOption.value =
            unit.value;

        toOption.textContent =
            unit.text;


        fromUnit.appendChild(
            fromOption
        );

        toUnit.appendChild(
            toOption
        );

    });


    // เลือกหน่วยเริ่มต้น
    fromUnit.selectedIndex = 0;


    if (selectedUnits.length > 1) {

        toUnit.selectedIndex = 1;

    }

}



// =========================
// แปลงหน่วย Length
// =========================

function convertLength(value, from, to) {

    const factors = {

        mm: 0.001,
        cm: 0.01,
        m: 1,
        km: 1000

    };


    const meterValue =
        value * factors[from];


    return meterValue / factors[to];
}



// =========================
// แปลงหน่วย Mass
// =========================

function convertMass(value, from, to) {

    const factors = {

        g: 0.001,
        kg: 1,
        ton: 1000

    };


    const kilogramValue =
        value * factors[from];


    return kilogramValue / factors[to];
}



// =========================
// แปลงหน่วย Time
// =========================

function convertTime(value, from, to) {

    const factors = {

        s: 1,
        min: 60,
        h: 3600

    };


    const secondValue =
        value * factors[from];


    return secondValue / factors[to];
}



// =========================
// แปลงอุณหภูมิ
// =========================

function convertTemperature(value, from, to) {

    let celsius;


    // แปลงเป็น Celsius ก่อน
    if (from === "c") {

        celsius = value;

    }

    else if (from === "f") {

        celsius =
            (value - 32) * 5 / 9;

    }

    else if (from === "k") {

        celsius =
            value - 273.15;

    }


    // จาก Celsius ไปหน่วยปลายทาง
    if (to === "c") {

        return celsius;

    }

    else if (to === "f") {

        return (celsius * 9 / 5) + 32;

    }

    else if (to === "k") {

        return celsius + 273.15;

    }

}



// =========================
// แปลง Pressure
// =========================

function convertPressure(value, from, to) {

    const factors = {

        pa: 1,
        kpa: 1000,
        bar: 100000,
        psi: 6894.757

    };


    const pascalValue =
        value * factors[from];


    return pascalValue / factors[to];
}



// =========================
// ปุ่ม Convert
// =========================

function convertUnit() {

    const value =
        parseFloat(
            inputValue.value
        );


    const selectedCategory =
        category.value;


    const from =
        fromUnit.value;


    const to =
        toUnit.value;


    // ตรวจสอบข้อมูล
    if (isNaN(value)) {

        answer.innerHTML =
            "กรุณากรอกค่าที่ต้องการแปลง";

        return;

    }


    let result;


    // Length
    if (selectedCategory === "length") {

        result =
            convertLength(
                value,
                from,
                to
            );

    }


    // Mass
    else if (selectedCategory === "mass") {

        result =
            convertMass(
                value,
                from,
                to
            );

    }


    // Time
    else if (selectedCategory === "time") {

        result =
            convertTime(
                value,
                from,
                to
            );

    }


    // Temperature
    else if (selectedCategory === "temperature") {

        result =
            convertTemperature(
                value,
                from,
                to
            );

    }


    // Pressure
    else if (selectedCategory === "pressure") {

        result =
            convertPressure(
                value,
                from,
                to
            );

    }


    // แสดงผล
    answer.innerHTML =
        value + " " +
        from + " = " +
        result + " " +
        to;



    // =========================
    // บันทึก History
    // =========================

    saveUnitHistory(
        `${value} ${from} = ${result} ${to}`
    );

}



// =========================
// ปุ่มสลับหน่วย
// =========================

swapButton.addEventListener(
    "click",
    function() {

        const oldFrom =
            fromUnit.value;

        const oldTo =
            toUnit.value;


        fromUnit.value =
            oldTo;

        toUnit.value =
            oldFrom;


        convertUnit();

    }
);



// =========================
// เมื่อเปลี่ยน Category
// =========================

category.addEventListener(
    "change",
    updateUnits
);



// =========================
// เริ่มต้น
// =========================

updateUnits();