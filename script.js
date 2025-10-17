// === Contact Form ===
document.getElementById("contactForm").addEventListener("submit", function (e) {
  e.preventDefault();
  alert("Thanks for your message! We'll get back to you soon.");
});

// === Show Main Sections ===
function showSection(sectionId) {
  const sections = document.querySelectorAll("section");
  sections.forEach(section => {
    section.style.opacity = 0;
    section.style.transition = "opacity 0.5s ease-in-out";
    setTimeout(() => {
      section.style.display = section.id === sectionId ? "block" : "none";
      if (section.id === sectionId) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        setTimeout(() => {
          section.style.opacity = 1;
        }, 50);
      }
    }, 300);
  });

  if (sectionId === "dashboard") {
    populateDashboard();
    showDashboardSection('personal'); // default to Personal Info when opening dashboard
  }
}

// === Show Dashboard Sub-Sections ===
function showDashboardSection(section) {
  const sections = document.querySelectorAll(".dashboard-section");
  sections.forEach(sec => sec.style.display = "none");
  document.getElementById(`dashboard-${section}`).style.display = "block";

  if (section === "saved") {
    populateSavedEbooks();
  }
}

// === Fill Dashboard User Info ===
function populateDashboard() {
  const userKey = localStorage.getItem("currentUser");
  const user = JSON.parse(localStorage.getItem(userKey));
  if (!user) return;

  document.getElementById("profileName").innerText = `Welcome, ${user.firstName}!`;
  document.getElementById("firstName").innerText = user.firstName || "N/A";
  document.getElementById("lastName").innerText = user.lastName || "N/A";
  document.getElementById("dob").innerText = user.dob || "N/A";
  document.getElementById("age").innerText = user.age || "N/A";
}

// === Fill Saved Ebooks ===
function populateSavedEbooks() {
  const userKey = localStorage.getItem("currentUser");
  const user = JSON.parse(localStorage.getItem(userKey));
  const savedGrid = document.getElementById("savedEbooksGrid");
  savedGrid.innerHTML = "";

  const saved = user.savedEbooks || [];

  if (saved.length === 0) {
    savedGrid.innerHTML = "<p>No ebooks saved yet.</p>";
    return;
  }

  saved.forEach(book => {
    const card = document.createElement("div");
    card.classList.add("ebook-card");

    const img = document.createElement("img");
    img.src = book.cover;
    img.alt = book.title;
    img.onclick = () => window.open(book.pdf, "_blank");

    if (user.favorites && user.favorites.includes(book.title)) {
      const heart = document.createElement("span");
      heart.classList.add("heart-icon");
      heart.textContent = "❤️";
      card.appendChild(heart);
    }

    card.appendChild(img);
    savedGrid.appendChild(card);
  });
}

// === Save Favorite + Saved Ebook ===
function saveFavorite(title, cover, pdf) {
  const currentUser = localStorage.getItem("currentUser");
  const user = JSON.parse(localStorage.getItem(currentUser));

  if (!user.savedEbooks) user.savedEbooks = [];
  if (!user.savedEbooks.find(b => b.title === title)) {
    user.savedEbooks.push({ title, cover, pdf });
  }

  if (!user.favorites.includes(title)) {
    user.favorites.push(title);
    alert("Added to favorites!");
  } else {
    alert("Already in favorites.");
  }

  localStorage.setItem(currentUser, JSON.stringify(user));
}

// === User Dropdown ===
function handleUserClick() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const userMenu = document.getElementById("userMenu");
  if (isLoggedIn) {
    const expanded = userMenu.classList.toggle("active");
    document.getElementById("userDisplay").setAttribute("aria-expanded", expanded);
  } else {
    window.location.href = "login.html";
  }
}

// === Modal Login ===
function modalLogin() {
  const username = document.getElementById("loginUser").value;
  const password = document.getElementById("loginPass").value;
  const user = JSON.parse(localStorage.getItem(username));
  if (user && user.password === password) {
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("currentUser", username);
    document.getElementById("loginModal").style.display = "none";
    location.reload();
  } else {
    alert("Invalid credentials.");
  }
}

// === Log Out ===
function logout() {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("currentUser");
  window.location.href = "index.html";
}

// === Back to Top ===
document.addEventListener("DOMContentLoaded", () => {
  const backToTopBtn = document.getElementById("backToTop");

  window.addEventListener("scroll", () => {
    if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
      backToTopBtn.style.display = "block";
    } else {
      backToTopBtn.style.display = "none";
    }
  });

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
});

// === Auth + Section on Load ===
document.addEventListener('DOMContentLoaded', () => {
  AOS.init({
  once: true,
  duration: 800,
  easing: 'ease-in-out',
  });


  const sectionToShow = localStorage.getItem("sectionToShow");
  if (sectionToShow) {
    showSection(sectionToShow);
    localStorage.removeItem("sectionToShow");
  }

  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const currentUser = localStorage.getItem("currentUser");

  const loginToggle = document.getElementById("userDisplay");
  if (isLoggedIn && currentUser) {
    loginToggle.innerText = currentUser;
  } else {
    const loginModal = document.getElementById("loginModal");
    if (loginModal) loginModal.style.display = "block";
  }
});

// === Close User Dropdown If Click Outside ===
document.addEventListener('click', function (e) {
  const dropdown = document.getElementById("userMenu");
  const userIcon = document.getElementById("userDisplay");
  if (dropdown && !dropdown.contains(e.target) && !userIcon.contains(e.target)) {
    dropdown.classList.remove("active");
  }
});

// Show modal on load if not logged in
document.addEventListener('DOMContentLoaded', function () {
  if (!localStorage.getItem("isLoggedIn")) {
    openModal();
  }
});

function openModal() {
  document.getElementById('loginModal').style.display = 'block';
  document.getElementById('modalBackdrop').style.display = 'block';
}

function closeModal() {
  document.getElementById('loginModal').style.display = 'none';
  document.getElementById('modalBackdrop').style.display = 'none';
}
