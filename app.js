let applicants = {};
let loaded = false;

// Load CSV
fetch("./Applicants.csv")
	.then((response) => response.text())
	.then((csv) => {
		const rows = csv.trim().split(/\r?\n/);

		// Remove header
		rows.shift();

		rows.forEach((row) => {
			const columns = row.split(",");

			const applicationNo = columns[0]?.trim();
			const name = columns[1]?.trim();
			const mobile = columns[2]?.trim();
			const district = columns[3]?.trim();
			const block = columns[4]?.trim();
			const gp = columns[5]?.trim();

			const record = {
				applicationNo,
				name,
				mobile,
				district,
				block,
				gp,
			};

			if (applicationNo) {
				applicants[applicationNo.toLowerCase()] = record;
			}

			if (mobile) {
				applicants[mobile] = record;
			}
		});

		loaded = true;

		console.log("Loaded:", Object.keys(applicants).length, "search keys");
	})
	.catch((error) => {
		console.error(error);
		document.getElementById("result").innerHTML =
			'<p class="error">Unable to load Applicants.csv</p>';
	});

function searchApplicant() {
	if (!loaded) {
		document.getElementById("result").innerHTML = "<p>Please wait, data is loading...</p>";
		return;
	}

	const value = document.getElementById("search").value.trim();

	if (!value) {
		document.getElementById("result").innerHTML = "<p>Please enter Application No. or Mobile.</p>";
		return;
	}

	const key = value.toLowerCase();

	const applicant = applicants[key];

	if (!applicant) {
		document.getElementById("result").innerHTML = '<p class="error">No applicant found.</p>';
		return;
	}

	document.getElementById("result").innerHTML = `
    <div class="card">
      <strong>Application No:</strong>
      ${applicant.applicationNo}<br>

      <strong>Applicant Name:</strong>
      ${applicant.name}<br>

      <strong>Mobile:</strong>
      ${applicant.mobile}
    </div>
  `;
}
