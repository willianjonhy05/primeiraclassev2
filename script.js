/* =========================================
   PRIMEIRA CLASSE
   Desenvolvimento de Sistemas
   script.js
========================================= */


/* =========================================
   1. SELETORES GLOBAIS
========================================= */

const navbar = document.getElementById("mainNavbar");

const navbarMenu = document.getElementById("navbarMenu");

const navLinks = document.querySelectorAll(".navbar-custom .nav-link");

const contactForm = document.getElementById("contactForm");

const submitButton = document.getElementById("submitButton");

const successMessage = document.getElementById("successMessage");

const phoneInput = document.getElementById("telefone");

const sections = document.querySelectorAll("main section[id]");


/* =========================================
   2. NAVBAR DINÂMICA
========================================= */

function updateNavbar() {

    if (!navbar) return;

    if (window.scrollY > 50) {

        navbar.classList.add("scrolled");

    } else {

        navbar.classList.remove("scrolled");

    }

}

window.addEventListener("scroll", updateNavbar);

updateNavbar();


/* =========================================
   3. SCROLL SUAVE
========================================= */

function smoothScrollTo(target) {

    const element = document.querySelector(target);

    if (!element) return;

    const navbarHeight = navbar
        ? navbar.offsetHeight
        : 0;

    const elementPosition = element.getBoundingClientRect().top;

    const offsetPosition =
        elementPosition +
        window.scrollY -
        navbarHeight;

    window.scrollTo({

        top: offsetPosition,

        behavior: "smooth"

    });

}


/* =========================================
   4. NAVEGAÇÃO DOS LINKS
========================================= */

navLinks.forEach(link => {

    link.addEventListener("click", function (event) {

        const target = this.getAttribute("href");

        if (!target || !target.startsWith("#")) return;

        event.preventDefault();

        smoothScrollTo(target);

        // Fecha o menu mobile após o clique
        if (navbarMenu && navbarMenu.classList.contains("show")) {

            const bootstrapCollapse =
                bootstrap.Collapse.getOrCreateInstance(navbarMenu);

            bootstrapCollapse.hide();

        }

    });

});


/* =========================================
   5. LINKS INTERNOS ADICIONAIS
========================================= */

document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener("click", function (event) {

        const target = this.getAttribute("href");

        if (target === "#" || !target) return;

        // Os links da navbar já são tratados acima
        if (this.classList.contains("nav-link")) return;

        const targetElement = document.querySelector(target);

        if (!targetElement) return;

        event.preventDefault();

        smoothScrollTo(target);

    });

});


/* =========================================
   6. LINK ATIVO NA NAVBAR
========================================= */

function updateActiveNavLink() {

    let currentSection = "";

    const scrollPosition =
        window.scrollY + window.innerHeight * 0.35;

    sections.forEach(section => {

        const sectionTop = section.offsetTop;

        const sectionHeight = section.offsetHeight;

        if (
            scrollPosition >= sectionTop &&
            scrollPosition < sectionTop + sectionHeight
        ) {

            currentSection = section.getAttribute("id");

        }

    });

    navLinks.forEach(link => {

        link.classList.remove("active");

        const href = link.getAttribute("href");

        if (href === `#${currentSection}`) {

            link.classList.add("active");

        }

    });

}

window.addEventListener("scroll", updateActiveNavLink);

window.addEventListener("load", updateActiveNavLink);


/* =========================================
   7. ANIMAÇÕES DE ENTRADA
========================================= */

const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(

    (entries, observer) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("active");

                observer.unobserve(entry.target);

            }

        });

    },

    {

        threshold: 0.15,

        rootMargin: "0px 0px -40px 0px"

    }

);


revealElements.forEach(element => {

    revealObserver.observe(element);

});


/* =========================================
   8. MÁSCARA DE TELEFONE
========================================= */

function formatPhone(value) {

    // Remove caracteres não numéricos
    let digits = value.replace(/\D/g, "");

    // Limita a 11 dígitos
    digits = digits.substring(0, 11);

    if (digits.length === 0) {

        return "";

    }

    if (digits.length <= 2) {

        return `(${digits}`;

    }

    if (digits.length <= 6) {

        return digits.replace(
            /^(\d{2})(\d{1,4})$/,
            "($1) $2"
        );

    }

    if (digits.length <= 10) {

        return digits.replace(
            /^(\d{2})(\d{4})(\d{1,4})$/,
            "($1) $2-$3"
        );

    }

    return digits.replace(
        /^(\d{2})(\d{5})(\d{1,4})$/,
        "($1) $2-$3"
    );

}


if (phoneInput) {

    phoneInput.addEventListener("input", function () {

        const cursorPosition = this.selectionStart;

        const oldValue = this.value;

        const formattedValue = formatPhone(oldValue);

        this.value = formattedValue;

        // Reposiciona o cursor ao final
        this.setSelectionRange(
            formattedValue.length,
            formattedValue.length
        );

    });

}


/* =========================================
   9. VALIDAÇÃO DE TELEFONE
========================================= */

function isValidPhone(phone) {

    const digits = phone.replace(/\D/g, "");

    // DDD + número: 10 ou 11 dígitos
    return digits.length === 10 || digits.length === 11;

}


/* =========================================
   10. VALIDAÇÃO DE E-MAIL
========================================= */

function isValidEmail(email) {

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    return emailPattern.test(email);

}


/* =========================================
   11. VALIDAÇÃO DE NOME
========================================= */

function isValidName(name) {

    const normalizedName = name.trim();

    return normalizedName.length >= 3;

}


/* =========================================
   12. VALIDAÇÃO DE MENSAGEM
========================================= */

function isValidMessage(message) {

    const normalizedMessage = message.trim();

    return normalizedMessage.length >= 10;

}


/* =========================================
   13. VALIDAÇÃO VISUAL DOS CAMPOS
========================================= */

function validateField(field) {

    if (!field) return false;

    let valid = field.checkValidity();

    switch (field.id) {

        case "nome":

            valid = isValidName(field.value);

            break;

        case "email":

            valid = isValidEmail(field.value);

            break;

        case "telefone":

            valid = isValidPhone(field.value);

            break;

        case "mensagem":

            valid = isValidMessage(field.value);

            break;

        case "projeto":

            valid = field.value !== "";

            break;

    }

    field.classList.remove("is-valid", "is-invalid");

    if (valid) {

        field.classList.add("is-valid");

    } else {

        field.classList.add("is-invalid");

    }

    return valid;

}


/* =========================================
   14. VALIDAÇÃO EM TEMPO REAL
========================================= */

const formFields = contactForm
    ? contactForm.querySelectorAll(
        "input[required], select[required], textarea[required]"
    )
    : [];


formFields.forEach(field => {

    field.addEventListener("blur", function () {

        validateField(this);

    });

    field.addEventListener("input", function () {

        // Evita mostrar erro enquanto o campo estiver vazio
        if (this.value.trim() === "") {
            this.classList.remove("is-valid", "is-invalid");
            return;
        }

        // Evita mostrar erro enquanto o campo está vazio
        if (this.classList.contains("is-invalid")) {

            validateField(this);

        }

        // Limpa o alerta de sucesso ao editar novamente
        if (successMessage) {

            successMessage.classList.add("d-none");

        }

    });

    field.addEventListener("change", function () {

        validateField(this);

    });

});


/* =========================================
   15. ESTADO DO BOTÃO DE ENVIO
========================================= */

function setLoadingState(isLoading) {

    if (!submitButton) return;

    const buttonText =
        submitButton.querySelector(".button-text");

    const buttonLoading =
        submitButton.querySelector(".button-loading");

    const buttonIcon =
        submitButton.querySelector(".button-icon");

    submitButton.disabled = isLoading;

    if (isLoading) {

        if (buttonText) {

            buttonText.classList.add("d-none");

        }

        if (buttonLoading) {

            buttonLoading.classList.remove("d-none");

        }

        if (buttonIcon) {

            buttonIcon.classList.add("d-none");

        }

    } else {

        if (buttonText) {

            buttonText.classList.remove("d-none");

        }

        if (buttonLoading) {

            buttonLoading.classList.add("d-none");

        }

        if (buttonIcon) {

            buttonIcon.classList.remove("d-none");

        }

    }

}


/* =========================================
   16. INICIALIZAÇÕES DA PÁGINA
========================================= */

document.addEventListener("DOMContentLoaded", function () {
    updateNavbar();
    updateActiveNavLink();
});

document.addEventListener('DOMContentLoaded', () => {
    const tiltWindow = document.getElementById('tilt-window');
    if (!tiltWindow) return;

    let rect = null;
    const maxTilt = 12;

    tiltWindow.addEventListener('mouseenter', () => {
        rect = tiltWindow.getBoundingClientRect();
        tiltWindow.style.transition = 'transform 0.1s ease-out';
    });

    tiltWindow.addEventListener('mousemove', (e) => {
        if (!rect) rect = tiltWindow.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const xPercent = (x / rect.width) - 0.5;
        const yPercent = (y / rect.height) - 0.5;
        const rotateX = -(yPercent * maxTilt * 2);
        const rotateY = (xPercent * maxTilt * 2);

        requestAnimationFrame(() => {
            tiltWindow.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
        });
    });

    tiltWindow.addEventListener('mouseleave', () => {
        rect = null;
        tiltWindow.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
        tiltWindow.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
});

/* =========================================
   17. ENVIO DO FORMULÁRIO
========================================= */

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitButton');
    if (!form || !submitBtn) return;

    const btnText = submitBtn.querySelector('.button-text');
    const btnLoading = submitBtn.querySelector('.button-loading');
    const btnIcon = submitBtn.querySelector('.button-icon');
    const successMsg = document.getElementById('successMessage');
    const errorMsg = document.getElementById('errorMessage');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Oculta alertas anteriores
        if (successMsg) successMsg.classList.add('d-none');
        if (errorMsg) errorMsg.classList.add('d-none');

        // Usa a mesma validação visual e regras aplicadas em tempo real.
        let formIsValid = true;
        formFields.forEach((field) => {
            if (!validateField(field)) formIsValid = false;
        });

        if (!formIsValid) {
            e.stopPropagation();
            const firstInvalidField = form.querySelector('.is-invalid');
            if (firstInvalidField) firstInvalidField.focus();
            return;
        }

        // Estado de carregamento no botão
        submitBtn.disabled = true;
        if (btnText) btnText.classList.add('d-none');
        if (btnLoading) btnLoading.classList.remove('d-none');
        if (btnIcon) btnIcon.classList.add('d-none');

        try {
            const formData = new FormData(form);
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                if (successMsg) {
                    successMsg.classList.remove('d-none');
                    successMsg.scrollIntoView({ behavior: "smooth", block: "nearest" });
                }

                // Remove a classe do Bootstrap PRIMEIRO para o navegador não pintar os campos vazios de vermelho
                form.classList.remove('was-validated');

                // Reseta o formulário
                form.reset();

                // Remove classes visuais de erro/sucesso de cada campo interno
                form.querySelectorAll('.is-valid, .is-invalid').forEach(field => {
                    field.classList.remove('is-valid', 'is-invalid');
                });

            } else {
                if (errorMsg) errorMsg.classList.remove('d-none');
            }
        } catch (error) {
            console.error("Erro no envio:", error);
            if (errorMsg) errorMsg.classList.remove('d-none');
        } finally {
            // Restaura o botão
            submitBtn.disabled = false;
            if (btnText) btnText.classList.remove('d-none');
            if (btnLoading) btnLoading.classList.add('d-none');
            if (btnIcon) btnIcon.classList.remove('d-none');
        }
    });
});
