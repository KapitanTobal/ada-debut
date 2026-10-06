const eventDate = new Date("December 19, 2026 18:00:00").getTime();

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
  ["18 Roses", "A classic birthday tradition."],
  ["18 Candles", "Make a wish for the future."],
  ["18 Letters", "Words from the people who love her."],
  ["18 Memories", "Favorite moments through the years."],
  ["18 Gifts", "Thoughtful surprises to open."],
  ["18 Toasts", "Cheers to this new chapter."],
  ["18 Wishes", "Dreams for her next adventure."],
  ["18 Photos", "Strike a pose and make memories."],
  ["18 Songs", "A playlist made for dancing."],
  ["18 Laughs", "Good times with favorite people."],
  ["18 Surprises", "A little sparkle around every corner."],
  ["18 Cheers", "Celebrate everything she is."],
  ["18 Notes", "Sweet messages for the birthday girl."],
  ["18 Smiles", "Because tonight is all about joy."],
  ["18 Hugs", "Love from family and friends."],
  ["18 Sparkles", "A little glamour for her big day."],
  ["18 Dreams", "Everything beautiful ahead."],
  ["One New Chapter", "The best is yet to come."]
];

document.querySelector("#specialsGrid").innerHTML =
  specialNames
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

document.querySelector("#rsvpForm").addEventListener("submit", function (event) {
  event.preventDefault();

  document.querySelector("#confirmation").style.display = "block";

  this.reset();
});