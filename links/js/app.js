/* =========================================================
   Primeira Classe — interações da página
   ========================================================= */

(function () {
  "use strict";

  var root = document.documentElement;
  var themeToggle = document.getElementById("theme-toggle");
  var themeColor = document.querySelector('meta[name="theme-color"]');
  var shareBtn = document.getElementById("share-btn");
  var toastEl = document.getElementById("toast");
  var toastTimer = null;

  /* ---------- Aviso (toast) ---------- */
  function showToast(mensagem) {
    if (!toastEl) return;
    toastEl.textContent = mensagem;
    toastEl.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toastEl.classList.remove("is-visible");
    }, 2800);
  }

  /* ---------- Tema claro / escuro ---------- */
  function applyTheme(tema) {
    var escuro = tema !== "light";
    root.dataset.theme = escuro ? "dark" : "light";

    if (themeToggle) {
      themeToggle.setAttribute(
        "aria-label",
        escuro ? "Ativar tema claro" : "Ativar tema escuro"
      );
      themeToggle.setAttribute(
        "title",
        escuro ? "Ativar tema claro" : "Ativar tema escuro"
      );
    }

    if (themeColor) {
      themeColor.setAttribute("content", escuro ? "#06111f" : "#eef2f7");
    }

    try {
      localStorage.setItem("pc-theme", escuro ? "dark" : "light");
    } catch (erro) {
      /* navegador sem localStorage: segue funcionando */
    }
  }

  if (themeToggle) {
    applyTheme(root.dataset.theme);
    themeToggle.addEventListener("click", function () {
      applyTheme(root.dataset.theme === "dark" ? "light" : "dark");
    });
  }

  /* ---------- Copiar texto (com alternativa para navegadores antigos) ---------- */
  function copyText(texto) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(texto).then(
        function () {
          return true;
        },
        function () {
          return legacyCopy(texto);
        }
      );
    }
    return Promise.resolve(legacyCopy(texto));
  }

  function legacyCopy(texto) {
    var area = document.createElement("textarea");
    area.value = texto;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.top = "-9999px";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();

    var copiou = false;
    try {
      copiou = document.execCommand("copy");
    } catch (erro) {
      copiou = false;
    }

    document.body.removeChild(area);
    return copiou;
  }

  /* ---------- Compartilhar ---------- */
  if (shareBtn) {
    shareBtn.addEventListener("click", function () {
      var dados = {
        title: document.title,
        text: "Sistemas, sites e aplicativos sob medida — Primeira Classe.",
        url: window.location.href
      };

      if (navigator.share) {
        navigator.share(dados).catch(function (erro) {
          if (erro && erro.name === "AbortError") return;
          copyText(dados.url).then(function (ok) {
            showToast(
              ok
                ? "Link copiado para a área de transferência!"
                : "Copie o link: " + dados.url
            );
          });
        });
        return;
      }

      copyText(dados.url).then(function (ok) {
        showToast(
          ok
            ? "Link copiado para a área de transferência!"
            : "Copie o link: " + dados.url
        );
      });
    });
  }

  /* ---------- Barra superior com sombra ao rolar ---------- */
  var topbar = document.querySelector(".topbar");
  if (topbar) {
    var atualizarTopbar = function () {
      topbar.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    window.addEventListener("scroll", atualizarTopbar, { passive: true });
    atualizarTopbar();
  }

  /* ---------- Animação de entrada dos elementos ---------- */
  var revelar = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && revelar.length) {
    var observer = new IntersectionObserver(
      function (entradas) {
        entradas.forEach(function (entrada) {
          if (!entrada.isIntersecting) return;
          entrada.target.classList.add("is-visible");
          observer.unobserve(entrada.target);
        });
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.08 }
    );

    revelar.forEach(function (elemento, indice) {
      elemento.style.animationDelay = Math.min(indice, 5) * 60 + "ms";
      observer.observe(elemento);
    });
  } else {
    revelar.forEach(function (elemento) {
      elemento.classList.add("is-visible");
    });
  }

  /* ---------- Ano automático no rodapé ---------- */
  var ano = document.getElementById("year");
  if (ano) {
    ano.textContent = new Date().getFullYear();
  }
})();
