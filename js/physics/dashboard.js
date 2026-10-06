/* =========================================================
   ENGI HUB
   Physics Personal Dashboard
   Smart Recommendation
========================================================= */

(function () {

    function initPhysicsDashboard() {

        /* =====================================================
           FIND MAIN ELEMENTS
        ===================================================== */

        const physicsMain =
            document.querySelector(".physics-main");

        const physicsSearch =
            document.getElementById("physicsSearch");

        const simulationCards =
            document.querySelectorAll(".simulation-card");


        if (!physicsMain) {
            console.log(
                "ENGI HUB: ไม่พบ .physics-main"
            );
            return;
        }


        if (!physicsSearch) {
            console.log(
                "ENGI HUB: ไม่พบ #physicsSearch"
            );
        }


        /* =====================================================
           PREVENT DUPLICATE
        ===================================================== */

        if (
            document.querySelector(
                ".physics-personal-section"
            )
        ) {
            return;
        }


        /* =====================================================
           STORAGE
        ===================================================== */

        function getHistory() {

            try {

                return JSON.parse(
                    localStorage.getItem(
                        "engiHistory"
                    )
                ) || [];

            } catch (error) {

                console.error(
                    "ENGI HUB History Error:",
                    error
                );

                return [];

            }

        }


        function getFavorites() {

            try {

                return JSON.parse(
                    localStorage.getItem(
                        "engiFavorites"
                    )
                ) || [];

            } catch (error) {

                return [];

            }

        }


        function saveFavorites(
            favorites
        ) {

            localStorage.setItem(
                "engiFavorites",
                JSON.stringify(favorites)
            );

        }


        /* =====================================================
           SIMULATION DATABASE
        ===================================================== */

        const simulations = {

            "Projectile Motion": {
                title: "Projectile Motion",
                thai: "การเคลื่อนที่แบบโพรเจกไทล์",
                icon: "🏹",
                url: "projectile.html"
            },

            "Free Fall Simulation": {
                title: "Free Fall",
                thai: "การตกอย่างเสรี",
                icon: "🪂",
                url: "freefall.html"
            },

            "Free Fall": {
                title: "Free Fall",
                thai: "การตกอย่างเสรี",
                icon: "🪂",
                url: "freefall.html"
            },

            "Motion Laboratory": {
                title: "Motion Laboratory",
                thai: "ห้องทดลองการเคลื่อนที่ 1 มิติ",
                icon: "🏃",
                url: "motion.html"
            },

            "Circular Motion Laboratory": {
                title: "Circular Motion Laboratory",
                thai: "ห้องทดลองการเคลื่อนที่แบบวงกลม",
                icon: "🔄",
                url: "circular-motion.html"
            },

            "2D Motion Laboratory": {
                title: "2D Motion Laboratory",
                thai: "ห้องทดลองการเคลื่อนที่ 2 มิติ",
                icon: "🎯",
                url: "motion-2d.html"
            },

            "Inclined Plane": {
                title: "Inclined Plane",
                thai: "การเคลื่อนที่บนพื้นเอียง",
                icon: "📐",
                url: "inclined-plane.html"
            },

            "Force Vector Laboratory": {
                title: "Force Vector Laboratory",
                thai: "ห้องทดลองเวกเตอร์แรง",
                icon: "🧲",
                url: "force-vector.html"
            },

            "3D Vector": {
                title: "3D Vector Laboratory",
                thai: "ห้องทดลองเวกเตอร์ 3 มิติ",
                icon: "🧭",
                url: "vector.html"
            },

            "3D Vector Laboratory": {
                title: "3D Vector Laboratory",
                thai: "ห้องทดลองเวกเตอร์ 3 มิติ",
                icon: "🧭",
                url: "vector.html"
            },

            "Energy & Work Laboratory": {
                title: "Energy & Work Laboratory",
                thai: "ห้องทดลองงานและพลังงาน",
                icon: "⚡",
                url: "energy.html"
            },

            "Simple Pendulum": {
                title: "Simple Pendulum",
                thai: "ลูกตุ้มอย่างง่าย",
                icon: "🪀",
                url: "pendulum.html"
            },

            "Spring-Mass": {
                title: "Spring-Mass",
                thai: "ระบบมวลติดสปริง",
                icon: "🌀",
                url: "spring.html"
            },

            "Wave Simulation": {
                title: "Wave Simulation",
                thai: "การจำลองคลื่น",
                icon: "🌊",
                url: "wave.html"
            }

        };


        /* =====================================================
           RECOMMENDATION MAP
        ===================================================== */

        const recommendationMap = {

            "Projectile Motion": [
                "2D Motion Laboratory",
                "Free Fall Simulation",
                "Motion Laboratory"
            ],

            "Free Fall Simulation": [
                "Projectile Motion",
                "Motion Laboratory",
                "2D Motion Laboratory"
            ],

            "Free Fall": [
                "Projectile Motion",
                "Motion Laboratory",
                "2D Motion Laboratory"
            ],

            "Motion Laboratory": [
                "2D Motion Laboratory",
                "Projectile Motion",
                "Circular Motion Laboratory"
            ],

            "Circular Motion Laboratory": [
                "Force Vector Laboratory",
                "3D Vector Laboratory",
                "Motion Laboratory"
            ],

            "2D Motion Laboratory": [
                "Projectile Motion",
                "Motion Laboratory",
                "Free Fall Simulation"
            ],

            "Inclined Plane": [
                "Force Vector Laboratory",
                "Energy & Work Laboratory",
                "Motion Laboratory"
            ],

            "Force Vector Laboratory": [
                "3D Vector Laboratory",
                "Inclined Plane",
                "Energy & Work Laboratory"
            ],

            "3D Vector": [
                "Force Vector Laboratory",
                "Circular Motion Laboratory",
                "Inclined Plane"
            ],

            "3D Vector Laboratory": [
                "Force Vector Laboratory",
                "Circular Motion Laboratory",
                "Inclined Plane"
            ],

            "Energy & Work Laboratory": [
                "Inclined Plane",
                "Motion Laboratory",
                "Force Vector Laboratory"
            ],

            "Simple Pendulum": [
                "Spring-Mass",
                "Wave Simulation"
            ],

            "Spring-Mass": [
                "Simple Pendulum",
                "Wave Simulation"
            ],

            "Wave Simulation": [
                "Simple Pendulum",
                "Spring-Mass"
            ]

        };


        /* =====================================================
           FIND SIMULATION
        ===================================================== */

        function findSimulation(
            title
        ) {

            if (!title) {
                return null;
            }


            if (
                simulations[title]
            ) {

                return simulations[title];

            }


            const keys =
                Object.keys(
                    simulations
                );


            for (
                let i = 0;
                i < keys.length;
                i++
            ) {

                const key = keys[i];


                if (
                    title
                        .toLowerCase()
                        .includes(
                            key.toLowerCase()
                        )
                ) {

                    return simulations[key];

                }

            }


            return null;

        }


        /* =====================================================
           CREATE DASHBOARD
        ===================================================== */

        const personalSection =
            document.createElement("section");


        personalSection.className =
            "physics-personal-section";


        personalSection.innerHTML = `

            <!-- CONTINUE LEARNING -->

            <div class="continue-learning-card">

                <div class="continue-icon">
                    🚀
                </div>

                <div class="continue-content">

                    <div class="continue-label">
                        CONTINUE LEARNING
                    </div>

                    <h2 id="continueTitle">
                        เริ่มการทดลองแรกของคุณ
                    </h2>

                    <p id="continueDescription">
                        เลือก Physics Simulation
                        เพื่อเริ่มต้นการเรียนรู้
                    </p>

                </div>

                <a
                    id="continueButton"
                    class="continue-button"
                    href="physics.html"
                >
                    เริ่มทดลอง →
                </a>

            </div>


            <!-- SMART RECOMMENDATION -->

            <div class="recommendation-card">

                <div class="recommendation-header">

                    <div>

                        <div class="section-label">
                            💡 SMART RECOMMENDATION
                        </div>

                        <h2>
                            Recommended for You
                        </h2>

                        <p>
                            Simulation ที่เหมาะกับ
                            การเรียนรู้ต่อจากสิ่งที่คุณทดลอง
                        </p>

                    </div>

                    <div
                        class="section-count"
                        id="recommendationCount"
                    >
                        0
                    </div>

                </div>


                <div
                    class="recommendation-list"
                    id="recommendationList"
                ></div>

            </div>


            <!-- RECENT + FAVORITE -->

            <div class="personal-grid">

                <div class="personal-card">

                    <div class="personal-header">

                        <div>

                            <div class="section-label">
                                🕘 RECENT EXPERIMENTS
                            </div>

                            <h2>
                                การทดลองล่าสุด
                            </h2>

                        </div>

                        <div
                            class="section-count"
                            id="recentCount"
                        >
                            0
                        </div>

                    </div>

                    <div
                        class="recent-list"
                        id="recentExperiments"
                    ></div>

                </div>


                <div class="personal-card">

                    <div class="personal-header">

                        <div>

                            <div class="section-label">
                                ⭐ FAVORITE LABS
                            </div>

                            <h2>
                                ห้องทดลองโปรด
                            </h2>

                        </div>

                        <div
                            class="section-count"
                            id="favoriteCount"
                        >
                            0
                        </div>

                    </div>

                    <div
                        class="favorite-list"
                        id="favoriteLabs"
                    ></div>

                </div>

            </div>

        `;


        /* =====================================================
           IMPORTANT:
           INSERT BEFORE SEARCH
        ===================================================== */

        if (
            physicsSearch
        ) {

            const searchContainer =
                physicsSearch.closest(
                    "section"
                ) ||
                physicsSearch.parentElement;


            if (
                searchContainer &&
                searchContainer !== physicsMain
            ) {

                searchContainer.before(
                    personalSection
                );

            } else {

                physicsMain.prepend(
                    personalSection
                );

            }

        } else {

            physicsMain.prepend(
                personalSection
            );

        }


        /* =====================================================
           ELEMENTS
        ===================================================== */

        const continueTitle =
            document.getElementById(
                "continueTitle"
            );

        const continueDescription =
            document.getElementById(
                "continueDescription"
            );

        const continueButton =
            document.getElementById(
                "continueButton"
            );

        const recommendationList =
            document.getElementById(
                "recommendationList"
            );

        const recommendationCount =
            document.getElementById(
                "recommendationCount"
            );

        const recentList =
            document.getElementById(
                "recentExperiments"
            );

        const recentCount =
            document.getElementById(
                "recentCount"
            );

        const favoriteList =
            document.getElementById(
                "favoriteLabs"
            );

        const favoriteCount =
            document.getElementById(
                "favoriteCount"
            );


        /* =====================================================
           PHYSICS HISTORY
        ===================================================== */

        function getPhysicsHistory() {

            const history =
                getHistory();


            return history.filter(
                function (item) {

                    return (
                        item.category ===
                        "Physics Simulation"
                    );

                }
            );

        }


        /* =====================================================
           CONTINUE
        ===================================================== */

        function renderContinue() {

            const history =
                getPhysicsHistory();


            if (
                history.length === 0
            ) {

                continueTitle.textContent =
                    "เริ่มการทดลองแรกของคุณ";

                continueDescription.textContent =
                    "เลือก Physics Simulation เพื่อเริ่มต้นการเรียนรู้";

                continueButton.href =
                    "physics.html";

                continueButton.textContent =
                    "เริ่มทดลอง →";

                return;

            }


            const latest =
                history[0];


            const simulation =
                findSimulation(
                    latest.title
                );


            if (!simulation) {

                continueTitle.textContent =
                    latest.title;

                continueDescription.textContent =
                    "กลับไปทดลอง Simulation ล่าสุดของคุณ";

                continueButton.href =
                    "physics.html";

                return;

            }


            continueTitle.textContent =
                "ต่อจาก " +
                simulation.title;


            continueDescription.textContent =
                simulation.thai;


            continueButton.href =
                simulation.url;


            continueButton.textContent =
                "ทดลองต่อ →";

        }


        /* =====================================================
           RECOMMENDATIONS
        ===================================================== */

        function renderRecommendations() {

            const history =
                getPhysicsHistory();


            let recommended;


            if (
                history.length === 0
            ) {

                recommended = [
                    "Motion Laboratory",
                    "Projectile Motion",
                    "3D Vector Laboratory"
                ];

            } else {

                const latest =
                    history[0];


                recommended =
                    recommendationMap[
                        latest.title
                    ];


                if (
                    !recommended
                ) {

                    const keys =
                        Object.keys(
                            recommendationMap
                        );


                    for (
                        let i = 0;
                        i < keys.length;
                        i++
                    ) {

                        if (
                            latest.title
                                .toLowerCase()
                                .includes(
                                    keys[i]
                                        .toLowerCase()
                                )
                        ) {

                            recommended =
                                recommendationMap[
                                    keys[i]
                                ];

                            break;

                        }

                    }

                }


                if (
                    !recommended
                ) {

                    recommended = [
                        "Motion Laboratory",
                        "3D Vector Laboratory",
                        "Energy & Work Laboratory"
                    ];

                }

            }


            recommendationList.innerHTML =
                "";


            let count = 0;


            recommended.forEach(
                function (title) {

                    const simulation =
                        findSimulation(
                            title
                        );


                    if (!simulation) {
                        return;
                    }


                    const item =
                        document.createElement(
                            "a"
                        );


                    item.className =
                        "recommendation-item";


                    item.href =
                        simulation.url;


                    item.innerHTML = `

                        <div class="recommendation-icon">
                            ${simulation.icon}
                        </div>

                        <div class="recommendation-content">

                            <h3>
                                ${simulation.title}
                            </h3>

                            <p>
                                ${simulation.thai}
                            </p>

                        </div>

                        <div class="recommendation-arrow">
                            →
                        </div>

                    `;


                    recommendationList.appendChild(
                        item
                    );


                    count++;

                }
            );


            recommendationCount.textContent =
                count;

        }


        /* =====================================================
           RECENT
        ===================================================== */

        function renderRecent() {

            const history =
                getPhysicsHistory();


            const unique = [];

            const titles =
                new Set();


            history.forEach(
                function (item) {

                    if (
                        !item.title
                    ) {
                        return;
                    }


                    if (
                        titles.has(
                            item.title
                        )
                    ) {
                        return;
                    }


                    titles.add(
                        item.title
                    );


                    unique.push(
                        item
                    );

                }
            );


            const recent =
                unique.slice(0, 5);


            recentList.innerHTML =
                "";


            recentCount.textContent =
                recent.length;


            if (
                recent.length === 0
            ) {

                recentList.innerHTML = `

                    <div class="personal-empty">
                        ยังไม่มีการทดลอง
                    </div>

                `;

                return;

            }


            recent.forEach(
                function (item) {

                    const simulation =
                        findSimulation(
                            item.title
                        );


                    const element =
                        document.createElement(
                            "a"
                        );


                    element.className =
                        "recent-item";


                    element.href =
                        simulation
                            ? simulation.url
                            : "physics.html";


                    element.innerHTML = `

                        <div class="recent-icon">
                            ${
                                simulation
                                    ? simulation.icon
                                    : (
                                        item.icon ||
                                        "🧪"
                                    )
                            }
                        </div>

                        <div class="recent-content">

                            <h3>
                                ${item.title}
                            </h3>

                            <p>
                                ${item.time || ""}
                            </p>

                        </div>

                        <div class="recent-arrow">
                            →
                        </div>

                    `;


                    recentList.appendChild(
                        element
                    );

                }
            );

        }


        /* =====================================================
           FAVORITES
        ===================================================== */

        function isFavorite(
            title
        ) {

            return getFavorites()
                .includes(title);

        }


        function toggleFavorite(
            title
        ) {

            let favorites =
                getFavorites();


            if (
                favorites.includes(
                    title
                )
            ) {

                favorites =
                    favorites.filter(
                        function (item) {

                            return (
                                item !==
                                title
                            );

                        }
                    );

            } else {

                favorites.push(
                    title
                );

            }


            saveFavorites(
                favorites
            );

        }


        function updateFavoriteButton(
            button,
            title
        ) {

            const active =
                isFavorite(
                    title
                );


            button.textContent =
                active
                    ? "★"
                    : "☆";


            button.classList.toggle(
                "active",
                active
            );

        }


        function setupFavoriteButtons() {

            simulationCards.forEach(
                function (card) {

                    if (
                        card.querySelector(
                            ".favorite-button"
                        )
                    ) {
                        return;
                    }


                    const titleElement =
                        card.querySelector(
                            "h3"
                        );


                    if (
                        !titleElement
                    ) {
                        return;
                    }


                    const title =
                        titleElement
                            .textContent
                            .trim();


                    card.style.position =
                        "relative";


                    const button =
                        document.createElement(
                            "button"
                        );


                    button.type =
                        "button";


                    button.className =
                        "favorite-button";


                    button.textContent =
                        isFavorite(title)
                            ? "★"
                            : "☆";


                    button.addEventListener(
                        "click",
                        function (event) {

                            event.preventDefault();

                            event.stopPropagation();


                            toggleFavorite(
                                title
                            );


                            updateFavoriteButton(
                                button,
                                title
                            );


                            renderFavorites();

                        }
                    );


                    card.appendChild(
                        button
                    );

                }
            );

        }


        /* =====================================================
           RENDER FAVORITES
        ===================================================== */

        function renderFavorites() {

            const favorites =
                getFavorites();


            favoriteList.innerHTML =
                "";


            favoriteCount.textContent =
                favorites.length;


            if (
                favorites.length === 0
            ) {

                favoriteList.innerHTML = `

                    <div class="personal-empty">
                        กด ☆ ที่ Simulation
                        เพื่อเพิ่มรายการโปรด
                    </div>

                `;

                return;

            }


            favorites.forEach(
                function (title) {

                    const simulation =
                        findSimulation(
                            title
                        );


                    if (!simulation) {
                        return;
                    }


                    const item =
                        document.createElement(
                            "a"
                        );


                    item.className =
                        "favorite-item";


                    item.href =
                        simulation.url;


                    item.innerHTML = `

                        <div class="favorite-icon">
                            ${simulation.icon}
                        </div>

                        <div class="favorite-content">

                            <h3>
                                ${simulation.title}
                            </h3>

                            <p>
                                ${simulation.thai}
                            </p>

                        </div>

                        <div class="favorite-arrow">
                            →
                        </div>

                    `;


                    favoriteList.appendChild(
                        item
                    );

                }
            );

        }


        /* =====================================================
           START
        ===================================================== */

        setupFavoriteButtons();

        renderContinue();

        renderRecommendations();

        renderRecent();

        renderFavorites();


        console.log(
            "ENGI HUB: Physics Personal Dashboard loaded successfully."
        );

    }


    /* =========================================================
       RUN AFTER PAGE LOAD
    ========================================================= */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initPhysicsDashboard
        );

    } else {

        initPhysicsDashboard();

    }

})();