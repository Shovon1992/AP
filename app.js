let applicants = {};
let loaded = false;


// ================================
// LOAD Applicants.csv
// ================================

fetch("./Applicants.csv")
    .then(response => {

        if (!response.ok) {
            throw new Error("Applicants.csv not found");
        }

        return response.text();
    })

    .then(csv => {

        const rows = csv.trim().split(/\r?\n/);

        // Remove header
        rows.shift();

        rows.forEach(row => {

            const columns = row.split(",");

            const applicationNo = columns[0]?.trim() || "";
            const name = columns[1]?.trim() || "";
            const mobile = columns[2]?.trim() || "";
            const district = columns[3]?.trim() || "";
            const block = columns[4]?.trim() || "";
            const gp = columns[5]?.trim() || "";

            const record = {
                applicationNo,
                name,
                mobile,
                district,
                block,
                gp
            };


            // Application No index

            if (applicationNo) {

                applicants[
                    applicationNo.toLowerCase()
                ] = record;

            }


            // Mobile index

            if (mobile) {

                applicants[mobile] = record;

            }

        });

        loaded = true;

        console.log(
            "Loaded:",
            Object.keys(applicants).length,
            "search keys"
        );

    })

    .catch(error => {

        console.error(error);

        showMessage(
            "Unable to load Applicants.csv",
            "error"
        );

    });


// ================================
// APPLICATION NO CHANGE
// ================================

document
    .getElementById("applicationNo")
    .addEventListener("input", function () {

        const value = this.value.trim();

        if (value.length > 0) {

            searchApplicant(value);

        }

    });


// ================================
// MOBILE CHANGE
// ================================

document
    .getElementById("mobile")
    .addEventListener("input", function () {

        // Only numbers
        this.value = this.value.replace(/\D/g, "");

        const value = this.value.trim();

        if (value.length === 10) {

            searchApplicant(value);

        }

    });


// ================================
// SEARCH APPLICANT
// ================================

function searchApplicant(value) {

    if (!loaded) {

        showMessage(
            "Please wait, data is loading...",
            "loading"
        );

        return;
    }


    const key = value.toLowerCase();

    const applicant = applicants[key];


    if (!applicant) {

        clearApplicantFields();

        showMessage(
            "No applicant found.",
            "error"
        );

        return;
    }


    // ================================
    // AUTO FILL
    // ================================

    document.getElementById("applicationNo").value =
        applicant.applicationNo;

    document.getElementById("mobile").value =
        applicant.mobile;

    document.getElementById("name").value =
        applicant.name;

    document.getElementById("district").value =
        applicant.district;

    document.getElementById("block").value =
        applicant.block;

    document.getElementById("gp").value =
        applicant.gp;


    hideMessage();

}


// ================================
// CLEAR FIELDS
// ================================

function clearApplicantFields() {

    document.getElementById("name").value = "";
    document.getElementById("district").value = "";
    document.getElementById("block").value = "";
    document.getElementById("gp").value = "";

}


// ================================
// FORM SUBMIT
// ================================

document
    .getElementById("applicantForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();


        const button =
            document.getElementById("submitButton");


        const applicationNo =
            document
                .getElementById("applicationNo")
                .value
                .trim();

        const mobile =
            document
                .getElementById("mobile")
                .value
                .trim();

        const name =
            document
                .getElementById("name")
                .value
                .trim();

        const district =
            document
                .getElementById("district")
                .value
                .trim();

        const block =
            document
                .getElementById("block")
                .value
                .trim();

        const gp =
            document
                .getElementById("gp")
                .value
                .trim();

        const ac =
            document
                .getElementById("ac")
                .value
                .trim();

        const remarks =
            document
                .getElementById("remarks")
                .value
                .trim();


        // ================================
        // VALIDATION
        // ================================

        if (!applicationNo ||
            !mobile ||
            !name ||
            !ac) {

            showMessage(
                "Please complete all required fields.",
                "error"
            );

            return;
        }


        if (!/^\d{10}$/.test(mobile)) {

            showMessage(
                "Please enter a valid 10 digit mobile number.",
                "error"
            );

            return;
        }


        // ================================
        // DATA TO PHP
        // ================================

        const data = {

            applicationNo,
            mobile,
            name,
            district,
            block,
            gp,
            ac,
            remarks

        };


        button.disabled = true;

        button.innerText = "Submitting...";


        fetch("save.php", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(data)

        })

        .then(response => response.json())

        .then(result => {

            if (result.success) {

                showMessage(
                    "Application submitted successfully.",
                    "success"
                );


                document
                    .getElementById("applicantForm")
                    .reset();

            }

            else {

                showMessage(
                    result.message ||
                    "Unable to save application.",
                    "error"
                );

            }

        })

        .catch(error => {

            console.error(error);

            showMessage(
                "Server error. Please try again.",
                "error"
            );

        })

        .finally(() => {

            button.disabled = false;

            button.innerText = "Submit";

        });

    });


// ================================
// MESSAGE
// ================================

function showMessage(text, type) {

    const message =
        document.getElementById("message");

    message.innerText = text;

    message.className = type;

    message.style.display = "block";

}


function hideMessage() {

    document.getElementById("message").style.display =
        "none";

}
