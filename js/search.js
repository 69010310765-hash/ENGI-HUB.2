document.addEventListener(
    "DOMContentLoaded",
    function () {

        /* ========================================
           Search Input
        ======================================== */

        const searchInput =
            document.getElementById(
                "toolSearch"
            );


        /* ========================================
           Tool Cards
        ======================================== */

        const toolCards =
            document.querySelectorAll(
                ".tool-card"
            );


        /* ========================================
           No Result Message
        ======================================== */

        const noResult =
            document.getElementById(
                "noResult"
            );


        /* ========================================
           Safety Check
        ======================================== */

        if (!searchInput) {
            return;
        }


        /* ========================================
           Search
        ======================================== */

        searchInput.addEventListener(
            "input",
            function () {

                const searchText =
                    searchInput.value
                        .trim()
                        .toLowerCase();


                let found = false;


                /* ========================================
                   Check Every Tool Card
                ======================================== */

                toolCards.forEach(
                    function (card) {

                        const cardText =
                            card.textContent
                                .toLowerCase();


                        const keywords =
                            card.getAttribute(
                                "data-keywords"
                            ) || "";


                        const searchData =
                            cardText +
                            " " +
                            keywords.toLowerCase();


                        /* ========================================
                           Show / Hide
                        ======================================== */

                        if (
                            searchText === "" ||
                            searchData.includes(
                                searchText
                            )
                        ) {

                            card.style.display =
                                "";

                            found = true;

                        }

                        else {

                            card.style.display =
                                "none";

                        }

                    }
                );


                /* ========================================
                   No Result
                ======================================== */

                if (noResult) {

                    if (
                        searchText !== "" &&
                        found === false
                    ) {

                        noResult.style.display =
                            "block";

                    }

                    else {

                        noResult.style.display =
                            "none";

                    }

                }

            }
        );

    }
);