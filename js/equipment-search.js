document.addEventListener("DOMContentLoaded", function () {

    // ========================================
    // Elements
    // ========================================

    const equipmentSearch =
        document.getElementById("equipmentSearch");

    const equipmentResults =
        document.getElementById("equipmentResults");

    const equipmentCategories =
        document.querySelectorAll(".equipment-category");


    // ========================================
    // Database
    // ========================================

    let equipmentDatabase = [];

    let currentCategory = "all";

    let searchTimer = null;


    // ========================================
    // Thai → English Aliases
    // ========================================

    const equipmentAliases = {

        "มัลติมิเตอร์": [
            "multimeter",
            "digital multimeter"
        ],

        "มิเตอร์": [
            "multimeter"
        ],

        "วัดไฟ": [
            "multimeter",
            "voltmeter",
            "ammeter"
        ],

        "วัดแรงดัน": [
            "voltmeter",
            "multimeter"
        ],

        "วัดกระแส": [
            "ammeter",
            "clamp meter"
        ],

        "แคลมป์มิเตอร์": [
            "clamp meter"
        ],

        "ออสซิลโลสโคป": [
            "oscilloscope"
        ],

        "สโคป": [
            "oscilloscope"
        ],

        "หัวแร้ง": [
            "soldering iron"
        ],

        "เครื่องบัดกรี": [
            "soldering iron",
            "soldering station"
        ],

        "เวอร์เนียร์": [
            "vernier caliper"
        ],

        "คาลิปเปอร์": [
            "caliper",
            "vernier caliper"
        ],

        "ไมโครมิเตอร์": [
            "micrometer"
        ],

        "วัดความหนา": [
            "micrometer",
            "vernier caliper"
        ],

        "กล้องสำรวจ": [
            "total station",
            "theodolite",
            "automatic level"
        ],

        "กล้องวัดระดับ": [
            "automatic level"
        ],

        "วัดระดับ": [
            "automatic level",
            "laser level"
        ],

        "เครื่องวัดอุณหภูมิ": [
            "thermometer"
        ],

        "วัดอุณหภูมิ": [
            "thermometer"
        ],

        "เครื่องวัดความดัน": [
            "pressure gauge"
        ],

        "วัดความดัน": [
            "pressure gauge"
        ],

        "เครื่องวัดความเร็วรอบ": [
            "tachometer"
        ],

        "วัดรอบ": [
            "tachometer"
        ],

        "เครื่องวัดอัตราการไหล": [
            "flow meter"
        ],

        "วัดอัตราการไหล": [
            "flow meter"
        ],

        "เซ็นเซอร์": [
            "sensor"
        ],

        "เครื่องมือวัด": [
            "measuring instrument"
        ]

    };


    // ========================================
    // Spelling Corrections
    // ========================================

    const spellingCorrections = {

        "multimter": "multimeter",
        "multmeter": "multimeter",
        "multimetter": "multimeter",

        "oscilloscopee": "oscilloscope",
        "osciloscope": "oscilloscope",

        "calipper": "caliper",

        "micromter": "micrometer",
        "micrometre": "micrometer",

        "thermometor": "thermometer",

        "tachometor": "tachometer",

        "presssure": "pressure",
        "presure": "pressure",

        "flowmeter": "flow meter"

    };


    // ========================================
    // Load JSON Database
    // ========================================

    async function loadEquipmentDatabase() {

        try {

            const response =
                await fetch("data/equipment.json");


            if (!response.ok) {

                throw new Error(
                    "ไม่สามารถโหลด equipment.json ได้"
                );

            }


            const data =
                await response.json();


            if (!Array.isArray(data)) {

                throw new Error(
                    "รูปแบบ equipment.json ไม่ถูกต้อง"
                );

            }


            equipmentDatabase = data;


            console.log(
                "Equipment Database Loaded:",
                equipmentDatabase.length
            );


            showStartMessage();

        }

        catch (error) {

            console.error(
                "Equipment Database Error:",
                error
            );


            if (equipmentResults) {

                equipmentResults.innerHTML = `

                    <div class="equipment-empty">

                        ❌ ไม่สามารถโหลดฐานข้อมูลอุปกรณ์ได้

                        <br><br>

                        <small>
                            กรุณาตรวจสอบว่าไฟล์
                            data/equipment.json
                            อยู่ในตำแหน่งที่ถูกต้อง
                        </small>

                    </div>

                `;

            }

        }

    }


    // ========================================
    // Initial Message
    // ========================================

    function showStartMessage() {

        if (!equipmentResults) {
            return;
        }


        equipmentResults.innerHTML = `

            <div class="equipment-empty">

                🔎 พิมพ์ชื่ออุปกรณ์
                เพื่อเริ่มค้นหา

                <br><br>

                <small>
                    มีอุปกรณ์ในฐานข้อมูล
                    ${equipmentDatabase.length}
                    รายการ
                </small>

            </div>

        `;

    }


    // ========================================
    // Normalize Text
    // ========================================

    function normalizeText(text) {

        return String(text || "")
            .toLowerCase()
            .trim();

    }


    // ========================================
    // Get Search Words
    // ========================================

    function getSearchWords(query) {

        const normalized =
            normalizeText(query);


        const words = [
            normalized
        ];


        // Spelling correction

        if (
            spellingCorrections[normalized]
        ) {

            words.push(
                spellingCorrections[
                    normalized
                ]
            );

        }


        // Thai aliases

        if (
            equipmentAliases[normalized]
        ) {

            equipmentAliases[
                normalized
            ].forEach(
                function (alias) {

                    words.push(alias);

                }
            );

        }


        return words;

    }


    // ========================================
    // Get Equipment Search Data
    // ========================================

    function getEquipmentSearchData(
        equipment
    ) {

        const data = [

            equipment.name,

            equipment.thaiName,

            equipment.category,

            equipment.description,

            equipment.function,

            equipment.usage,

            equipment.principle,

            equipment.workingPrinciple,

            equipment.measurement,

            equipment.measurements,

            equipment.keywords

        ];


        return data
            .flat(Infinity)
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

    }


    // ========================================
    // Search Database
    // ========================================

    function searchEquipment(query) {

        const searchWords =
            getSearchWords(query);


        return equipmentDatabase.filter(
            function (equipment) {

                // Category filter

                if (
                    currentCategory !== "all" &&
                    equipment.category !==
                    currentCategory
                ) {

                    return false;

                }


                const searchableText =
                    getEquipmentSearchData(
                        equipment
                    );


                return searchWords.some(
                    function (word) {

                        return searchableText
                            .includes(
                                normalizeText(word)
                            );

                    }
                );

            }
        );

    }


    // ========================================
    // Get Array Data
    // ========================================

    function getArrayData(
        equipment,
        primaryKey,
        secondaryKey
    ) {

        if (
            Array.isArray(
                equipment[primaryKey]
            )
        ) {

            return equipment[primaryKey];

        }


        if (
            Array.isArray(
                equipment[secondaryKey]
            )
        ) {

            return equipment[secondaryKey];

        }


        return [];

    }


    // ========================================
    // Get Text Data
    // ========================================

    function getTextData(
        equipment,
        keys,
        fallback
    ) {

        for (
            let i = 0;
            i < keys.length;
            i++
        ) {

            const value =
                equipment[keys[i]];


            if (
                typeof value === "string" &&
                value.trim() !== ""
            ) {

                return value;

            }

        }


        return fallback;

    }


    // ========================================
    // Display Equipment
    // ========================================

    function displayEquipment(
        results
    ) {

        if (!equipmentResults) {
            return;
        }


        // ========================================
        // No Results
        // ========================================

        if (
            !results ||
            results.length === 0
        ) {

            equipmentResults.innerHTML = `

                <div class="equipment-empty">

                    😢 ไม่พบอุปกรณ์

                    <br><br>

                    <small>
                        ลองค้นหา เช่น
                        Multimeter,
                        มัลติมิเตอร์,
                        Oscilloscope,
                        เครื่องกลึง
                    </small>

                </div>

            `;

            return;

        }


        // ========================================
        // Equipment Cards
        // ========================================

        equipmentResults.innerHTML =
            results.map(
                function (equipment) {

                    // ========================================
                    // Basic Information
                    // ========================================

                    const name =
                        getTextData(
                            equipment,
                            ["name"],
                            "ไม่ระบุชื่ออุปกรณ์"
                        );


                    const thaiName =
                        getTextData(
                            equipment,
                            ["thaiName"],
                            "ไม่ระบุชื่อภาษาไทย"
                        );


                    const image =
                        getTextData(
                            equipment,
                            ["image"],
                            "images/equipment/placeholder.jpg"
                        );


                    const description =
                        getTextData(
                            equipment,
                            ["description"],
                            "ยังไม่มีรายละเอียดของอุปกรณ์"
                        );


                    const functionText =
                        getTextData(
                            equipment,
                            [
                                "function",
                                "usage"
                            ],
                            "ยังไม่มีข้อมูลการใช้งาน"
                        );


                    const workingPrinciple =
                        getTextData(
                            equipment,
                            [
                                "workingPrinciple",
                                "principle"
                            ],
                            "ยังไม่มีข้อมูลหลักการทำงาน"
                        );


                    // ========================================
                    // Measurement
                    // ========================================

                    const measurements =
                        getArrayData(
                            equipment,
                            "measurement",
                            "measurements"
                        );


                    let measurementHTML = "";


                    if (
                        measurements.length > 0
                    ) {

                        measurementHTML =
                            measurements
                                .map(
                                    function (item) {

                                        return `

                                            <li>
                                                ${escapeHTML(item)}
                                            </li>

                                        `;

                                    }
                                )
                                .join("");

                    }

                    else {

                        measurementHTML = `

                            <li>
                                ยังไม่มีข้อมูลค่าที่วัดได้
                            </li>

                        `;

                    }


                    // ========================================
                    // Card
                    // ========================================

                    return `

                        <div class="equipment-card">

                            <!-- Image -->

                            <img

                                class="equipment-image"

                                src="${escapeAttribute(
                                    image
                                )}"

                                alt="${escapeAttribute(
                                    name
                                )}"

                                loading="lazy"

                                onerror="
                                    this.onerror=null;
                                    this.src='images/equipment/placeholder.jpg';
                                "

                            >


                            <!-- Information -->

                            <div class="equipment-info">

                                <!-- Category -->

                                <span
                                    class="equipment-category-label"
                                >

                                    ${getCategoryName(
                                        equipment.category
                                    )}

                                </span>


                                <!-- English Name -->

                                <h3>

                                    ${escapeHTML(
                                        name
                                    )}

                                </h3>


                                <!-- Thai Name -->

                                <p
                                    class="equipment-thai-name"
                                >

                                    ${escapeHTML(
                                        thaiName
                                    )}

                                </p>


                                <!-- Description -->

                                <p
                                    class="equipment-description"
                                >

                                    ${escapeHTML(
                                        description
                                    )}

                                </p>


                                <!-- Details -->

                                <div
                                    class="equipment-details"
                                >

                                    <!-- Function -->

                                    <p>

                                        <strong>
                                            🔧 การใช้งาน:
                                        </strong>

                                        <br>

                                        ${escapeHTML(
                                            functionText
                                        )}

                                    </p>


                                    <!-- Working Principle -->

                                    <p>

                                        <strong>
                                            ⚙️ หลักการทำงาน:
                                        </strong>

                                        <br>

                                        ${escapeHTML(
                                            workingPrinciple
                                        )}

                                    </p>

                                </div>


                                <!-- Measurement -->

                                <div
                                    class="equipment-measurement"
                                >

                                    <strong>
                                        📏 ค่าที่วัดได้:
                                    </strong>


                                    <ul>

                                        ${measurementHTML}

                                    </ul>

                                </div>


                            </div>

                        </div>

                    `;

                }
            )
            .join("");

    }


    // ========================================
    // Category Name
    // ========================================

    function getCategoryName(
        category
    ) {

        const categories = {

            electrical:
                "⚡ Electrical",

            mechanical:
                "⚙ Mechanical",

            civil:
                "🏗 Civil",

            electronics:
                "💻 Electronics",

            instrumentation:
                "📐 Instrumentation"

        };


        return categories[
            category
        ] || "🛠 Engineering Equipment";

    }


    // ========================================
    // Perform Search
    // ========================================

    function performSearch() {

        if (!equipmentResults) {
            return;
        }


        const query =
            equipmentSearch
                ? equipmentSearch.value.trim()
                : "";


        // ========================================
        // No Search
        // ========================================

        if (!query) {

            /*
             * ถ้าไม่ได้ค้นหาและอยู่หมวด All
             * ให้ซ่อนรายการอุปกรณ์
             */

            if (
                currentCategory === "all"
            ) {

                showStartMessage();

                return;

            }


            /*
             * ถ้าเลือก Category
             * ให้แสดงอุปกรณ์ในหมวดนั้น
             */

            const results =
                equipmentDatabase.filter(
                    function (equipment) {

                        return (
                            equipment.category ===
                            currentCategory
                        );

                    }
                );


            displayEquipment(results);

            return;

        }


        // ========================================
        // Search
        // ========================================

        const results =
            searchEquipment(query);


        console.log(
            "Equipment Search:",
            query,
            "Category:",
            currentCategory,
            "Results:",
            results.length
        );


        displayEquipment(results);

    }


    // ========================================
    // Search Input
    // ========================================

    if (equipmentSearch) {

        equipmentSearch.addEventListener(
            "input",
            function () {

                clearTimeout(
                    searchTimer
                );


                searchTimer =
                    setTimeout(
                        function () {

                            performSearch();

                        },
                        200
                    );

            }
        );

    }


    // ========================================
    // Category Buttons
    // ========================================

    equipmentCategories.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    // Remove active

                    equipmentCategories.forEach(
                        function (btn) {

                            btn.classList.remove(
                                "active"
                            );

                        }
                    );


                    // Add active

                    this.classList.add(
                        "active"
                    );


                    // Current category

                    currentCategory =
                        this.dataset.category ||
                        "all";


                    // Search

                    performSearch();

                }
            );

        }
    );


    // ========================================
    // Security
    // ========================================

    function escapeHTML(text) {

        return String(text || "")

            .replace(
                /&/g,
                "&amp;"
            )

            .replace(
                /</g,
                "&lt;"
            )

            .replace(
                />/g,
                "&gt;"
            )

            .replace(
                /"/g,
                "&quot;"
            )

            .replace(
                /'/g,
                "&#039;"
            );

    }


    function escapeAttribute(text) {

        return escapeHTML(text);

    }


    // ========================================
    // Start
    // ========================================

    loadEquipmentDatabase();

});