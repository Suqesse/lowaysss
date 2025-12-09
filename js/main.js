document.addEventListener("DOMContentLoaded", () => {
  const yearSpan = document.getElementById("year");
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  fetch("content.json")
    .then((r) => r.json())
    .then((data) => {
      applyHero(data.hero);
      applyWorks(data.works_block, data.works);
      applyServices(data.services_block, data.services);
      applyAbout(data.about);
      applyContacts(data.contacts);
      initReveal();
      initForm();
    })
    .catch((err) => {
      console.error("Ошибка загрузки content.json", err);
    });

  function applyHero(hero) {
    if (!hero) return;
    document.getElementById("hero-overtitle").textContent = hero.overtitle || "";
    document.getElementById("hero-title").innerHTML = (hero.title || "").replace(/\n/g, "<br>");
    document.getElementById("hero-text").textContent = hero.text || "";
    document.getElementById("hero-btn-primary").textContent = hero.btn_primary || "";
    document.getElementById("hero-btn-secondary").textContent = hero.btn_secondary || "";

    const metaWrap = document.getElementById("hero-meta");
    metaWrap.innerHTML = "";
    (hero.meta || []).forEach((m) => {
      const span = document.createElement("span");
      span.textContent = m;
      metaWrap.appendChild(span);
    });

    const statsWrap = document.getElementById("hero-stats");
    statsWrap.innerHTML = "";
    (hero.stats || []).forEach((s) => {
      const stat = document.createElement("div");
      stat.className = "stat";
      stat.innerHTML = `<span class="stat__value">${s.value}</span><span class="stat__label">${s.label}</span>`;
      statsWrap.appendChild(stat);
    });
  }

  function applyWorks(block, works) {
    if (block?.subtitle) {
      document.getElementById("works-subtitle").textContent = block.subtitle;
    }

    const tabsWrap = document.getElementById("works-tabs");
    tabsWrap.innerHTML = "";
    const cardsWrap = document.getElementById("works-grid");
    cardsWrap.innerHTML = "";

    const categories = block?.categories || [];
    categories.forEach((cat, idx) => {
      const btn = document.createElement("button");
      btn.className = "tabs__btn" + (idx === 0 ? " tabs__btn--active" : "");
      btn.dataset.category = cat.id;
      btn.textContent = cat.label;
      tabsWrap.appendChild(btn);
    });

    works.forEach((w) => {
      const card = document.createElement("article");
      card.className = "work-card card-elevated";
      card.dataset.category = w.category;

      const imgWrap = document.createElement("div");
      imgWrap.className = "work-card__image";
      if (w.variant === "square") imgWrap.classList.add("work-card__image--square");
      if (w.variant === "strip") imgWrap.classList.add("work-card__image--strip");

      const img = document.createElement("img");
      img.src = w.image;
      img.alt = w.title || "";
      img.loading = "lazy";
      imgWrap.appendChild(img);

      const body = document.createElement("div");
      body.className = "work-card__body";
      body.innerHTML = `<h3 class="work-card__title">${w.title}</h3><p class="work-card__tags">${w.tags || ""}</p>`;

      card.appendChild(imgWrap);
      card.appendChild(body);
      cardsWrap.appendChild(card);
    });

    // фильтр
    tabsWrap.addEventListener("click", (e) => {
      const btn = e.target.closest(".tabs__btn");
      if (!btn) return;
      const cat = btn.dataset.category;
      tabsWrap.querySelectorAll(".tabs__btn").forEach((b) => b.classList.remove("tabs__btn--active"));
      btn.classList.add("tabs__btn--active");

      cardsWrap.querySelectorAll(".work-card").forEach((card) => {
        const show = cat === "all" || card.dataset.category === cat;
        card.style.display = show ? "" : "none";
      });
    });
  }

  function applyServices(block, services) {
    document.getElementById("services-title").textContent = block.title || "";
    document.getElementById("services-subtitle").textContent = block.subtitle || "";
    const wrap = document.getElementById("services-grid");
    wrap.innerHTML = "";
    services.forEach((s) => {
      const art = document.createElement("article");
      art.className = "service card-elevated";
      const ul = (s.bullets || []).map((b) => `<li>${b}</li>`).join("");
      art.innerHTML = `
        <h3 class="service__title">${s.title}</h3>
        <p class="service__text">${s.text}</p>
        <ul class="service__list">${ul}</ul>
      `;
      wrap.appendChild(art);
    });
  }

  function applyAbout(about) {
    document.getElementById("about-title").textContent = about.title || "";
    document.getElementById("about-subtitle").textContent = about.subtitle || "";
    document.getElementById("about-p1").textContent = about.p1 || "";
    document.getElementById("about-p2").textContent = about.p2 || "";
    document.getElementById("about-p3").textContent = about.p3 || "";
    document.getElementById("about-side-title").textContent = about.side_title || "";
    const list = document.getElementById("about-side-list");
    list.innerHTML = "";
    (about.side_list || []).forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      list.appendChild(li);
    });
    document.getElementById("about-side-note").textContent = about.side_note || "";
  }

  function applyContacts(c) {
    document.getElementById("contact-title").textContent = c.title || "";
    document.getElementById("contact-subtitle").textContent = c.subtitle || "";
    document.getElementById("contact-nick").textContent = c.nick || "";
    document.getElementById("contact-telegram").textContent = c.telegram || "";
    document.getElementById("contact-email").textContent = c.email || "";
    document.getElementById("contact-hint").textContent = c.hint || "";
  }

  function initReveal() {
    const revealElements = document.querySelectorAll(".section, .hero__inner, .work-card, .service, .about__side, .contact__form-wrap");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal--visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealElements.forEach((el) => {
      el.classList.add("reveal");
      observer.observe(el);
    });
  }

  function initForm() {
    const form = document.getElementById("contact-form");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Это демо-форма. Здесь потом можно будет подключить отправку в Telegram или на почту.");
      form.reset();
    });
  }

  // мобильное меню
  const navToggle = document.querySelector(".nav__toggle");
  const navList = document.querySelector(".nav__list");
  if (navToggle && navList) {
    navToggle.addEventListener("click", () => {
      navList.classList.toggle("nav__list--open");
    });
    navList.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navList.classList.remove("nav__list--open");
      });
    });
  }
});
