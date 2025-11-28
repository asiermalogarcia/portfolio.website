// --- Selectors ---
const form = document.querySelector("#contactForm");
const results = document.querySelector("#results");
const popup = document.querySelector("#successPopup");

// Update slider outputs
["r1", "r2", "r3"].forEach(id => {
    const input = document.getElementById(id);
    const output = document.getElementById(id + "Out");
    input.addEventListener("input", () => {
        output.textContent = input.value;
    });
});

// Color for averages
function colorForAverage(avg) {
    if (avg <= 4) return "red";
    if (avg <= 7) return "orange";
    return "green";
}

// Submit handler
form.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = {
        name: name.value,
        surname: surname.value,
        email: email.value,
        phone: phone.value,
        address: address.value,
        r1: Number(r1.value),
        r2: Number(r2.value),
        r3: Number(r3.value)
    };

    console.log(data);

    // Average
    const avg = ((data.r1 + data.r2 + data.r3) / 3).toFixed(1);

    // Display results
    results.innerHTML = `
        <p>Name: ${data.name}</p>
        <p>Surname: ${data.surname}</p>
        <p>Email: ${data.email}</p>
        <p>Phone number: ${data.phone}</p>
        <p>Address: ${data.address}</p>
        <p>${data.name} ${data.surname}: <span style="color:${colorForAverage(avg)}">${avg}</span></p>
    `;

    // Success popup
    popup.classList.add("visible");
    setTimeout(() => popup.classList.remove("visible"), 3000);
});
