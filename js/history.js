// ============================================================
// ENGI HUB - Calculation History
// ============================================================

document.addEventListener("DOMContentLoaded", function () {

    const historyList = document.getElementById("historyList");
    const clearButton = document.querySelector(".clear-history-button");

    // ถ้าไม่พบ historyList ให้หยุด
    if (!historyList) {
        console.error("ไม่พบ #historyList");
        return;
    }


    // ========================================================
    // โหลด History
    // ========================================================

    function getHistory() {

        try {

            const savedHistory =
                localStorage.getItem("engiHistory");

            if (!savedHistory) {
                return [];
            }

            const history = JSON.parse(savedHistory);

            if (!Array.isArray(history)) {
                return [];
            }

            return history;

        } catch (error) {

            console.error(
                "ไม่สามารถอ่าน engiHistory ได้:",
                error
            );

            return [];
        }
    }


    // ========================================================
    // บันทึก History
    // ========================================================

    function saveHistory(history) {

        try {

            localStorage.setItem(
                "engiHistory",
                JSON.stringify(history)
            );

        } catch (error) {

            console.error(
                "ไม่สามารถบันทึก History ได้:",
                error
            );
        }
    }


    // ========================================================
    // แปลงตัวเลข
    // ========================================================

    function formatNumber(value) {

        if (value === undefined || value === null) {
            return "-";
        }

        if (value === "") {
            return "-";
        }

        const number = Number(value);

        if (Number.isNaN(number)) {
            return String(value);
        }

        return number.toLocaleString("th-TH", {
            maximumFractionDigits: 2
        });
    }


    // ========================================================
    // ป้องกัน HTML Injection
    // ========================================================

    function escapeHTML(value) {

        if (value === undefined || value === null) {
            return "";
        }

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    // ========================================================
    // แสดง History
    // ========================================================

    function renderHistory() {

        const history = getHistory();

        // ไม่มี History
        if (history.length === 0) {

            historyList.innerHTML = `
                <div class="empty-history">

                    <div class="empty-icon">🧮</div>

                    <h3>ยังไม่มีประวัติการคำนวณ</h3>

                    <p>
                        เมื่อคุณใช้เครื่องมือคำนวณ
                        ประวัติการคำนวณจะแสดงที่นี่
                    </p>

                    <a
                        href="index.html#tools"
                        class="history-button"
                    >
                        🛠 ไปที่ Engineering Tools →
                    </a>

                </div>
            `;

            return;
        }


        // มี History
        historyList.innerHTML = "";


        history.forEach(function (item, index) {

            const historyItem =
                document.createElement("div");

            historyItem.className =
                "history-item clickable-history";


            historyItem.innerHTML = `

                <div class="history-icon">
                    ${escapeHTML(item.icon || "🧮")}
                </div>

                <div class="history-content">

                    <h3>
                        ${escapeHTML(
                            item.title || "Unknown Tool"
                        )}
                    </h3>

                    <p>
                        ${escapeHTML(
                            item.calculation || "-"
                        )}
                    </p>

                    <span>
                        ${escapeHTML(
                            item.time || "-"
                        )}
                    </span>

                </div>

                <div class="history-arrow">
                    →
                </div>

            `;


            // กดรายการ History
            historyItem.addEventListener(
                "click",
                function () {

                    showDetails(item, index);

                }
            );


            historyList.appendChild(historyItem);

        });

    }


    // ========================================================
    // สร้างกล่องรายละเอียด
    // ========================================================

    function createDetailBox(label, value) {

        return `

            <div class="result-detail">

                <span class="result-label">
                    ${escapeHTML(label)}
                </span>

                <strong>
                    ${escapeHTML(value)}
                </strong>

            </div>

        `;
    }


    // ========================================================
    // สร้างรายละเอียดของ Projectile Motion
    // ========================================================

    function getProjectileDetails(item) {

        return `

            ${createDetailBox(
                "ความเร็วต้น",
                formatNumber(item.initialVelocity) + " m/s"
            )}

            ${createDetailBox(
                "มุมยิง",
                formatNumber(item.launchAngle) + "°"
            )}

            ${createDetailBox(
                "แรงโน้มถ่วง",
                formatNumber(item.gravity) + " m/s²"
            )}

            ${createDetailBox(
                "ระยะทาง",
                formatNumber(item.range) + " m"
            )}

            ${createDetailBox(
                "ความสูงสูงสุด",
                formatNumber(item.maxHeight) + " m"
            )}

            ${createDetailBox(
                "เวลาทั้งหมด",
                formatNumber(item.totalTime) + " s"
            )}

            ${createDetailBox(
                "เวลาที่จุดสูงสุด",
                formatNumber(item.apexTime) + " s"
            )}

            ${createDetailBox(
                "ตำแหน่ง X ที่จุดสูงสุด",
                formatNumber(item.apexX) + " m"
            )}

            ${createDetailBox(
                "ตำแหน่ง Y ที่จุดสูงสุด",
                formatNumber(item.apexY) + " m"
            )}

        `;
    }


    // ========================================================
    // สร้างรายละเอียดของ Simple Pendulum
    // ========================================================

    function getPendulumDetails(item) {

        return `

            ${createDetailBox(
                "ความยาวเชือก",
                formatNumber(item.length) + " m"
            )}

            ${createDetailBox(
                "มวล",
                formatNumber(item.mass) + " kg"
            )}

            ${createDetailBox(
                "มุมเริ่มต้น",
                formatNumber(item.initialAngle) + "°"
            )}

            ${createDetailBox(
                "แรงโน้มถ่วง",
                formatNumber(item.gravity) + " m/s²"
            )}

            ${createDetailBox(
                "คาบ",
                formatNumber(item.period) + " s"
            )}

            ${createDetailBox(
                "ความถี่",
                formatNumber(item.frequency) + " Hz"
            )}

        `;
    }


    // ========================================================
    // สร้างรายละเอียดของ Free Fall
    // ========================================================

    function getFreeFallDetails(item) {

        let height = item.height;
        let mass = item.mass;
        let gravity = item.gravity;

        let fallTime = item.fallTime;
        let impactVelocity = item.impactVelocity;


        // รองรับข้อมูลรูปแบบใหม่
        if (item.input) {

            height =
                item.input.height;

            mass =
                item.input.mass;

            gravity =
                item.input.gravity;
        }


        if (item.result) {

            fallTime =
                item.result.fallTime;

            impactVelocity =
                item.result.impactVelocity;
        }


        return `

            ${createDetailBox(
                "ความสูงเริ่มต้น",
                formatNumber(height) + " m"
            )}

            ${createDetailBox(
                "มวล",
                formatNumber(mass) + " kg"
            )}

            ${createDetailBox(
                "แรงโน้มถ่วง",
                formatNumber(gravity) + " m/s²"
            )}

            ${createDetailBox(
                "เวลาตก",
                formatNumber(fallTime) + " s"
            )}

            ${createDetailBox(
                "ความเร็วขณะกระทบพื้น",
                formatNumber(impactVelocity) + " m/s"
            )}

        `;
    }


    // ========================================================
    // สร้างรายละเอียดทั่วไป
    // ========================================================

    function getGeneralDetails(item) {

        return `

            ${createDetailBox(
                "เครื่องมือ",
                item.title || "-"
            )}

            ${createDetailBox(
                "การคำนวณ",
                item.calculation || "-"
            )}

            ${createDetailBox(
                "เวลา",
                item.time || "-"
            )}

        `;
    }


    // ========================================================
    // แสดง Modal รายละเอียด
    // ========================================================

    function showDetails(item, index) {

        // ลบ Modal เก่าถ้ามี
        const oldModal =
            document.getElementById("historyDetailModal");

        if (oldModal) {
            oldModal.remove();
        }


        let detailsHTML = "";


        const toolName =
            String(item.tool || item.title || "")
                .toLowerCase();


        // Projectile Motion
        if (
            toolName.includes("projectile") ||
            toolName.includes("โปรเจกไทล์")
        ) {

            detailsHTML =
                getProjectileDetails(item);

        }


        // Simple Pendulum
        else if (
            toolName.includes("pendulum") ||
            toolName.includes("ลูกตุ้ม")
        ) {

            detailsHTML =
                getPendulumDetails(item);

        }


        // Free Fall
        else if (
            toolName.includes("free fall") ||
            toolName.includes("freefall") ||
            toolName.includes("ตกอย่างอิสระ")
        ) {

            detailsHTML =
                getFreeFallDetails(item);

        }


        // เครื่องมือทั่วไป
        else {

            detailsHTML =
                getGeneralDetails(item);

        }


        // ====================================================
        // Modal
        // ====================================================

        const modal =
            document.createElement("div");

        modal.id =
            "historyDetailModal";

        modal.className =
            "history-detail-modal";


        modal.innerHTML = `

            <div class="history-detail-overlay">

                <div class="history-detail-card">

                    <button
                        type="button"
                        class="history-detail-close"
                        aria-label="ปิด"
                    >
                        ×
                    </button>


                    <div class="history-detail-header">

                        <div class="history-detail-icon">
                            ${escapeHTML(
                                item.icon || "🧮"
                            )}
                        </div>

                        <div>

                            <h2>
                                ${escapeHTML(
                                    item.title ||
                                    "Calculation Details"
                                )}
                            </h2>

                            <p>
                                ${escapeHTML(
                                    item.time || "-"
                                )}
                            </p>

                        </div>

                    </div>


                    <div class="history-detail-body">

                        <h3>
                            📊 Calculation Details
                        </h3>

                        <div class="history-result-grid">

                            ${detailsHTML}

                        </div>

                    </div>


                    <div class="history-detail-footer">

                        <button
                            type="button"
                            class="history-detail-back"
                        >
                            ← Back to History
                        </button>

                    </div>

                </div>

            </div>

        `;


        document.body.appendChild(modal);


        // ====================================================
        // ปุ่มปิด
        // ====================================================

        const closeButton =
            modal.querySelector(
                ".history-detail-close"
            );

        const backButton =
            modal.querySelector(
                ".history-detail-back"
            );


        function closeModal() {

            modal.remove();

            document.removeEventListener(
                "keydown",
                handleEscape
            );
        }


        function handleEscape(event) {

            if (event.key === "Escape") {
                closeModal();
            }

        }


        closeButton.addEventListener(
            "click",
            closeModal
        );


        backButton.addEventListener(
            "click",
            closeModal
        );


        // คลิกพื้นหลังเพื่อปิด
        const overlay =
            modal.querySelector(
                ".history-detail-overlay"
            );

        overlay.addEventListener(
            "click",
            function (event) {

                if (event.target === overlay) {
                    closeModal();
                }

            }
        );


        document.addEventListener(
            "keydown",
            handleEscape
        );

    }


    // ========================================================
    // Clear History
    // ========================================================

    if (clearButton) {

        clearButton.addEventListener(
            "click",
            function () {

                const history =
                    getHistory();


                if (history.length === 0) {

                    alert(
                        "ยังไม่มีประวัติการคำนวณ"
                    );

                    return;
                }


                const confirmed =
                    confirm(
                        "ต้องการลบประวัติการคำนวณทั้งหมดหรือไม่?"
                    );


                if (!confirmed) {
                    return;
                }


                localStorage.removeItem(
                    "engiHistory"
                );


                renderHistory();

            }
        );

    }


    // ========================================================
    // เริ่มต้น
    // ========================================================

    renderHistory();

});