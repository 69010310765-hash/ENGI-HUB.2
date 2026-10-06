document.addEventListener("DOMContentLoaded", function () {

```
/* ========================================
   จำนวนเครื่องมือทั้งหมด
======================================== */

const totalTools =
    document.getElementById("totalTools");

if (totalTools) {

    totalTools.textContent = "6";

}


/* ========================================
   อ่านข้อมูล History
======================================== */

let history = [];

try {

    history =
        JSON.parse(
            localStorage.getItem("engiHistory")
        ) || [];

}

catch (error) {

    console.error(
        "ไม่สามารถอ่านประวัติการคำนวณได้",
        error
    );

    history = [];

}


/* ========================================
   จำนวนครั้งที่คำนวณ
======================================== */

const totalCalculations =
    document.getElementById(
        "totalCalculations"
    );

if (totalCalculations) {

    totalCalculations.textContent =
        history.length;

}


/* ========================================
   เครื่องมือที่ใช้ล่าสุด
======================================== */

const lastUsedTool =
    document.getElementById(
        "lastUsedTool"
    );

if (lastUsedTool) {

    if (history.length > 0) {

        lastUsedTool.textContent =
            history[0].title;

    }

    else {

        lastUsedTool.textContent =
            "-";

    }

}
```

});
