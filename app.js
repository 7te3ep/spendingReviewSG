const today = new Date();

const day = String(today.getDate()).padStart(2, "0"); // Ensures 2 digits for day
const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-based
const year = today.getFullYear();

const formattedDate = `${day}/${month}/${year}`;

const periodeEl = document.getElementById("periode");
const qtyEl = document.getElementById("qty");
const dateEl = document.getElementById("date");
const moneyEl = document.getElementById("money");
const ctx = document.getElementById("myChart");

document
    .getElementById("csvInput")
    .addEventListener("change", function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const content = e.target.result;
                updateData(content.split("\n").map((el) => el.split(";")));
            };
            reader.readAsText(file);
        }
    });

function updateData(dataMat) {
    periodeEl.innerHTML = `Du ${dataMat[0][1]} au ${dataMat[0][2]}`;
    qty.innerHTML = `${dataMat[0][3]} operations`;
    dateEl.innerHTML = `${formattedDate}`;
    moneyEl.innerHTML = `Solde ${dataMat[0][5]}`;

    const data = dataMat.slice(3, dataMat[0][3] + 3);
    const table = document.getElementById("table");
    data.forEach((op) => {
        const name = op[2]
            .split(" ")
            .slice(3, -4)
            .filter((el) => el != "");

        table.innerHTML += `<tr><th>${op[0].slice(0, 5)}</th><th>${name.join(
            "-"
        )}</th><th class="${op[op.length - 2][0] == "-" ? "neg" : "pos"}">${
            Math.round(parseFloat(op[op.length - 2].replace(",", ".")) * 10) /
            10
        }</th></tr>`;
    });

    let weekData = [[], [], [], [], [], [], []];
    let todayDate = formattedDate.split("/");
    const today = new Date(todayDate[2], todayDate[1] - 1, todayDate[0]);

    data.forEach((op) => {
        const opStr = op[0].split("/");
        const opDate = new Date(opStr[2], opStr[1] - 1, opStr[0]);
        let timeDif = Math.round(
            (today.getTime() - opDate.getTime()) / 86400000
        );
        if (timeDif <= 7) {
            weekData[timeDif].push(op);
        }
    });
    const weekSpending = weekData.map((day) =>
        day
            .filter((op) => parseFloat(op[op.length - 2].replace(",", ".")) <= 0)
            .reduce(
                (acc, curr) =>
                    acc + parseFloat(curr[curr.length - 2].replace(",", ".")),
                0
            )
    ).map(el=>Math.abs(el))
    console.log(weekSpending);
    new Chart(ctx, {
        type: "bar",
        data: {
            labels: [0,1,2,3,4,5,6],
            datasets: [
                {
                    label: "Spending",
                    data: weekSpending,
                    borderWidth: 1,
                    borderColor: "#31a713",
                    backgroundColor: "#38eb0b80",
                },
            ],
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        },
    });
}
