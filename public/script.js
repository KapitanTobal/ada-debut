const GOOGLE_SHEET_URL =
  "https://script.google.com/macros/s/AKfycbyPnVRU8nsWiOvpbQzaJqP3focHdxCZn1fHdLwkUwhtK48yuz0rGi8mXoj80m-bwZKa/exec";

const EVENT_DATE = new Date(
  "2026-11-17T16:30:00+08:00"
).getTime();

let currentInvitation = null;


/* -------------------------
   BASIC HELPERS
------------------------- */

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function redirectTo404() {
  window.location.replace("/404.html");
}


/* -------------------------
   UNLOCK WEBSITE
------------------------- */

function unlockWebsite() {
  const gate = document.querySelector("#accessGate");
  const website = document.querySelector("#mainWebsite");

  document.body.classList.remove("locked");

  if (website) {
    website.hidden = false;
    website.style.display = "block";
  }

  if (gate) {
    gate.remove();
  }
}


/* -------------------------
   COUNTDOWN
------------------------- */

function updateCountdown() {
  const countdown = document.querySelector(".countdown");

  if (!countdown) return;

  const distance = EVENT_DATE - Date.now();

  if (distance <= 0) {
    countdown.innerHTML =
      "<p>The celebration is here! ♡</p>";
    return;
  }

  const days = document.querySelector("#days");
  const hours = document.querySelector("#hours");
  const minutes = document.querySelector("#minutes");
  const seconds = document.querySelector("#seconds");

  if (days) {
    days.textContent = String(
      Math.floor(distance / 86400000)
    ).padStart(2, "0");
  }

  if (hours) {
    hours.textContent = String(
      Math.floor(distance / 3600000) % 24
    ).padStart(2, "0");
  }

  if (minutes) {
    minutes.textContent = String(
      Math.floor(distance / 60000) % 60
    ).padStart(2, "0");
  }

  if (seconds) {
    seconds.textContent = String(
      Math.floor(distance / 1000) % 60
    ).padStart(2, "0");
  }
}


/* -------------------------
   18 SPECIALS
------------------------- */

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

function renderSpecials() {
  const grid = document.querySelector("#specialsGrid");

  if (!grid) return;

  grid.innerHTML = specialNames
    .map(
      (special, index) => `
        <article class="special-card">
          <div class="special-number">
            ${String(index + 1).padStart(2, "0")}
          </div>

          <h3>${special[0]}</h3>
          <p>${special[1]}</p>
        </article>
      `
    )
    .join("");
}


/* -------------------------
   GUEST INFORMATION
------------------------- */

function renderGuestInformation() {
  if (!currentInvitation) return;

  const guests = currentInvitation.guests || [];
  const firstGuest = guests[0] || {};

  const welcomeName =
    document.querySelector("#welcomeName");

  const personalGuestName =
    document.querySelector("#personalGuestName");

  const invitationGroup =
    document.querySelector("#invitationGroup");

  const guestSpecialRole =
    document.querySelector("#guestSpecialRole");

  if (welcomeName) {
    welcomeName.textContent =
      firstGuest.name || currentInvitation.primaryContact || "Guest";
  }

  if (personalGuestName) {
    personalGuestName.textContent =
      firstGuest.name || currentInvitation.primaryContact || "Guest";
  }

  if (invitationGroup) {
    invitationGroup.textContent =
      currentInvitation.invitationGroup || "Private invitation";
  }

  if (guestSpecialRole) {
    const roles = guests
      .map((guest) => guest.specialRole)
      .filter((role) => role && role !== "None");

    guestSpecialRole.textContent =
      roles.length > 0 ? roles.join(", ") : "Guest";
  }

  renderGuestList();
  renderRsvpGuests();
}

function renderGuestList() {
  const container =
    document.querySelector("#guestList");

  if (!container || !currentInvitation) return;

  const guests = currentInvitation.guests || [];

  container.innerHTML = `
    <div class="guest-list-heading">
      <p class="eyebrow">Included in this invitation</p>
    </div>

    ${guests
      .map(
        (guest) => `
          <div class="authorized-guest">
            <strong>${escapeHtml(guest.name)}</strong>

            <span>
              ${escapeHtml(guest.relationship || "Guest")}
            </span>

            ${
              guest.specialRole &&
              guest.specialRole !== "None"
                ? `<small>${escapeHtml(guest.specialRole)}</small>`
                : ""
            }
          </div>
        `
      )
      .join("")}
  `;
}


/* -------------------------
   RSVP GUEST LIST
------------------------- */

function renderRsvpGuests() {
  const container =
    document.querySelector("#rsvpGuestList");

  if (!container || !currentInvitation) return;

  const guests = currentInvitation.guests || [];

  container.innerHTML = `
    <p class="rsvp-list-title">
      Please select an answer for each invited guest.
    </p>

    ${guests
      .map(
        (guest, index) => `
          <div class="rsvp-guest-row">
            <div class="rsvp-guest-info">
              <strong>${escapeHtml(guest.name)}</strong>
              <small>
                ${escapeHtml(guest.relationship || "Guest")}
              </small>
            </div>

            <div class="attendance-options">
              <label class="attendance-option">
                <input
                  type="radio"
                  name="attendance-${index}"
                  class="guest-attendance"
                  data-guest-index="${index}"
                  value="Yes"
                />
                <span>Attending</span>
              </label>

              <label class="attendance-option">
                <input
                  type="radio"
                  name="attendance-${index}"
                  class="guest-attendance"
                  data-guest-index="${index}"
                  value="No"
                />
                <span>Not attending</span>
              </label>
            </div>
          </div>
        `
      )
      .join("")}
  `;
}

/* -------------------------
   GALLERY
------------------------- */

function setupGallery() {
  const image =
    document.querySelector("#galleryImage");

  const previous =
    document.querySelector("#previousPhoto");

  const next =
    document.querySelector("#nextPhoto");

  const counter =
    document.querySelector("#galleryCounter");

  const thumbnails =
    document.querySelector("#galleryThumbnails");

  if (
    !image ||
    !previous ||
    !next ||
    !thumbnails
  ) {
    return;
  }

  const photos = [
    "images/1.jpeg",
    "images/2.jpeg",
    "images/3.jpeg",
    "images/4.jpeg",
    "images/5.jpeg",
    "images/6.jpeg",
    "images/7.jpeg",
    "images/8.jpeg"
  ];

  let currentPhoto = 0;

  thumbnails.innerHTML = photos
    .map(
      (photo, index) => `
        <button
          class="gallery-thumbnail ${
            index === 0 ? "active" : ""
          }"
          type="button"
          data-photo-index="${index}"
          aria-label="View photo ${index + 1}"
        >
          <img
            src="${photo}"
            alt="Adreana pre-debut photo ${index + 1}"
          />
        </button>
      `
    )
    .join("");

  function showPhoto(index) {
    currentPhoto =
      (index + photos.length) % photos.length;

    image.style.opacity = "0";

    setTimeout(() => {
      image.src = photos[currentPhoto];
      image.alt =
        `Adreana pre-debut photo ${currentPhoto + 1}`;

      if (counter) {
        counter.textContent =
          `${currentPhoto + 1} / ${photos.length}`;
      }

      image.style.opacity = "1";
    }, 150);

    document
      .querySelectorAll(".gallery-thumbnail")
      .forEach((thumbnail, thumbnailIndex) => {
        thumbnail.classList.toggle(
          "active",
          thumbnailIndex === currentPhoto
        );
      });
  }

  previous.addEventListener("click", () => {
    showPhoto(currentPhoto - 1);
  });

  next.addEventListener("click", () => {
    showPhoto(currentPhoto + 1);
  });

  document
    .querySelectorAll(".gallery-thumbnail")
    .forEach((thumbnail) => {
      thumbnail.addEventListener("click", () => {
        showPhoto(
          Number(thumbnail.dataset.photoIndex)
        );
      });
    });

  showPhoto(0);
}


/* -------------------------
   RSVP SUBMISSION
------------------------- */

function setupRsvp() {
  const form =
    document.querySelector("#rsvpForm");

  const confirmation =
    document.querySelector("#confirmation");

  if (!form || !confirmation) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!currentInvitation) {
      confirmation.hidden = false;
      confirmation.textContent =
        "Your invitation could not be verified.";
      return;
    }

    const guests =
      currentInvitation.guests || [];

    const selectedAnswers =
      Array.from(
        document.querySelectorAll(
          ".guest-attendance:checked"
        )
      );

    if (selectedAnswers.length !== guests.length) {
      confirmation.hidden = false;
      confirmation.textContent =
        "Please select an answer for every guest.";
      return;
    }

    const guestResponses =
      selectedAnswers.map((input) => {
        const guestIndex =
          Number(input.dataset.guestIndex);

        return {
          name: guests[guestIndex].name,
          attendance: input.value
        };
      });

    const messageInput =
      document.querySelector("#message");

    const formData =
      new URLSearchParams();

    formData.append(
      "inviteCode",
      currentInvitation.inviteCode
    );

    formData.append(
      "guestResponses",
      JSON.stringify(guestResponses)
    );

    formData.append(
      "message",
      messageInput
        ? messageInput.value.trim()
        : ""
    );

    confirmation.hidden = false;
    confirmation.textContent =
      "Saving your RSVP...";

    try {
      await fetch(GOOGLE_SHEET_URL, {
        method: "POST",
        mode: "no-cors",
        body: formData
      });

      confirmation.textContent =
        "Thank you! Your RSVP has been saved. ♡";

      showGroupQr();

    } catch (error) {
      console.error(error);

      confirmation.textContent =
        "Something went wrong. Please try again.";
    }
  });
}

/* -------------------------
   QR CODE
------------------------- */

function showGroupQr() {
  const qrSection =
    document.querySelector("#qrSection");

  const qrCode =
    document.querySelector("#qrcode");

  const downloadQr =
    document.querySelector("#downloadQr");

  if (
    !qrSection ||
    !qrCode ||
    !downloadQr ||
    !currentInvitation
  ) {
    return;
  }

  if (typeof QRCode === "undefined") {
    console.error("QR Code library was not loaded.");
    return;
  }

  const checkInUrl =
    `${window.location.origin}/checkin.html?code=` +
    encodeURIComponent(
      currentInvitation.inviteCode
    );

  qrSection.hidden = false;
  qrCode.innerHTML = "";

  new QRCode(qrCode, {
    text: checkInUrl,
    width: 200,
    height: 200,
    colorDark: "#191719",
    colorLight: "#ffffff"
  });

  setTimeout(() => {
    const qrImage =
      qrCode.querySelector("img");

    if (qrImage) {
      downloadQr.href = qrImage.src;
    }
  }, 500);
}


/* -------------------------
   LOAD INVITATION
------------------------- */

function loadInvitation() {
  const params =
    new URLSearchParams(window.location.search);

  const inviteCode =
    params.get("invite");

  if (!inviteCode) {
    redirectTo404();
    return;
  }

  const callbackName =
    `adaInvitationCallback_${Date.now()}`;

  window[callbackName] = (data) => {
    if (
      !data ||
      !data.success ||
      !data.guests ||
      data.guests.length === 0
    ) {
      redirectTo404();
      return;
    }

    currentInvitation = data;

    unlockWebsite();
    renderGuestInformation();

    delete window[callbackName];
  };

  const request =
    document.createElement("script");

  request.src =
    `${GOOGLE_SHEET_URL}?code=` +
    encodeURIComponent(inviteCode) +
    `&callback=${callbackName}`;

  request.onerror = () => {
    redirectTo404();
    delete window[callbackName];
  };

  document.body.appendChild(request);
}


/* -------------------------
   MOBILE MENU
------------------------- */

function setupMobileMenu() {
  const menuToggle =
    document.querySelector("#menuToggle");

  const navLinks =
    document.querySelector("#navLinks");

  if (!menuToggle || !navLinks) return;

  menuToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
    });
  });
}


/* -------------------------
   START WEBSITE
------------------------- */

document.addEventListener("DOMContentLoaded", () => {
  renderSpecials();
  updateCountdown();
  setupGallery();
  setupRsvp();
  setupMobileMenu();
  loadInvitation();

  setInterval(updateCountdown, 1000);
});