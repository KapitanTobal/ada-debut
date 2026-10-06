const eventDate = new Date("2026-11-17T16:30:00+08:00").getTime();

function updateCountdown() {
  const distance = eventDate - Date.now();

  if (distance <= 0) {
    document.querySelector(".countdown").innerHTML =
      "<p>The celebration is here! 💗</p>";
    return;
  }

  document.querySelector("#days").textContent =
    String(Math.floor(distance / 86400000)).padStart(2, "0");

  document.querySelector("#hours").textContent =
    String(Math.floor(distance / 3600000) % 24).padStart(2, "0");

  document.querySelector("#minutes").textContent =
    String(Math.floor(distance / 60000) % 60).padStart(2, "0");

  document.querySelector("#seconds").textContent =
    String(Math.floor(distance / 1000) % 60).padStart(2, "0");
}

const specialNames = [
  [
    "18 Roses",
    "A special dance celebrating the important people in Adreana's life."
  ],
  [
    "18 Envelopes",
    "Special envelopes filled with love, blessings, and thoughtful gifts."
  ],
  [
    "18 Treasures",
    "Meaningful gifts from family and friends."
  ],
  [
    "18 Candles",
    "Birthday wishes, messages, and advice for Adreana."
  ]
];

document.querySelector("#specialsGrid").innerHTML = specialNames
  .map(
    (special, index) => `
      <div class="special-card">
        <div class="special-number">
          ${String(index + 1).padStart(2, "0")}
        </div>
        <h3>${special[0]}</h3>
        <p>${special[1]}</p>
      </div>
    `
  )
  .join("");

updateCountdown();
setInterval(updateCountdown, 1000);

const googleSheetURL =
  "https://script.google.com/macros/s/AKfycbyPnVRU8nsWiOvpbQzaJqP3focHdxCZn1fHdLwkUwhtK48yuz0rGi8mXoj80m-bwZKa/exec";

const rsvpForm = document.querySelector("#rsvpForm");
const confirmation = document.querySelector("#confirmation");

rsvpForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const formData = new URLSearchParams();

  formData.append(
    "name",
    document.querySelector("#name").value.trim()
  );

  formData.append(
    "attendance",
    document.querySelector("#attendance").value
  );

  formData.append(
    "message",
    document.querySelector("#message").value.trim()
  );

  try {
    await fetch(googleSheetURL, {
      method: "POST",
      mode: "no-cors",
      body: formData
    });

    confirmation.textContent =
      "Thank you! Your RSVP has been saved. 💗";

    confirmation.style.display = "block";
    rsvpForm.reset();

  } catch (error) {
    confirmation.textContent =
      "Something went wrong. Please try again.";

    confirmation.style.display = "block";
    console.error(error);
  }
});