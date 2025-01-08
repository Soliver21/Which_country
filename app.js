let data = "";
let currentCountryName = "";
let timer = 120;  // Timer változó globálisan deklarálva
let time;  // time változó, ami a setInterval referencia lesz
let score = 0;  // Score változó deklarálva

async function sendRequest() {
    try {
        const response = await fetch("https://restcountries.com/v3.1/region/europe", {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        data = await response.json();
    } catch (error) {
        console.log(error.message);
    }
}

const createFlagCards = (data) => {
    const cards = data.map(flag => {
        return `<div class="flag-card" data-name="${flag.name.common}">
            <img src="${flag.flags.png}" alt="${flag.name.common} flag">
        </div>`;
    });
    return cards.join('');
};

const renderCards = (htmlDetail) => {
    const flagContainer = document.querySelector(".container");
    flagContainer.innerHTML = "";
    flagContainer.innerHTML = htmlDetail;
};

const getRandomNumber = () => {
    return Math.floor(Math.random() * data.length);
};

const getRandomCountryName = (data) => {
    return data[getRandomNumber()].name.common;
};

document.querySelector("#start").addEventListener("click", () => {
    currentCountryName = getRandomCountryName(data);
    document.querySelector("input").value = currentCountryName;
});

const validateGuess = (clickedName) => {
    const matchedCountry = data.find(country => country.name.common === clickedName);
    if (matchedCountry && clickedName === currentCountryName) {
        alert("Helyes válasz!");
        score++;  // Helyes válasz esetén növeli a pontszámot
        document.querySelector(".goodGuesses").value = score; // Frissíti a pontszámot
        currentCountryName = getRandomCountryName(data);  // Új országot generál
    } else {
        alert("Helytelen, próbáld újra!");
    }
};

const startTimer = () => {
    time = setInterval(() => {
        timer--;  // Csökkenti az időt
        document.getElementById("timer").textContent = timer;  // Frissíti az időt a képernyőn
        if (timer <= 0) {
            clearInterval(time);  // Leállítja a visszaszámlálót
            alert("Az idő lejárt!");
        }
    }, 1000);
};

document.addEventListener("DOMContentLoaded", async () => {
    await sendRequest();
    const cardsHTML = createFlagCards(data);
    renderCards(cardsHTML);
    document.querySelector(".container").addEventListener("click", (event) => {
        if (timer === 120) {  // Ha még nem indult el a timer
            startTimer();  // Indítja a timer-t
        }

        const flagCard = event.target.closest(".flag-card");
        if (flagCard) {
            const clickedName = flagCard.dataset.name;
            validateGuess(clickedName);
        }
    });
});
