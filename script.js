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
   16. ENVIO DO FORMULÁRIO
========================================= */

if (contactForm) {

    contactForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        // Remove alerta anterior
        successMessage.classList.add("d-none");

        // Valida todos os campos
        let formIsValid = true;

        formFields.forEach(field => {

            const valid = validateField(field);

            if (!valid) {

                formIsValid = false;

            }

        });


        // Se houver erro, direciona para o primeiro campo inválido
        if (!formIsValid) {

            const firstInvalidField =
                contactForm.querySelector(".is-invalid");

            if (firstInvalidField) {

                firstInvalidField.focus();

            }

            return;

        }


        // Exibe carregamento
        setLoadingState(true);


        /*
         * SIMULAÇÃO DE ENVIO
         *
         * Este trecho apenas simula o processamento do formulário.
         *
         * Para um envio real, substitua por uma requisição
         * fetch() para o backend ou serviço de formulários.
         */

        try {

            await new Promise(resolve => {

                setTimeout(resolve, 1500);

            });


            // Exibe mensagem de sucesso
            successMessage.classList.remove("d-none");

            successMessage.scrollIntoView({

                behavior: "smooth",

                block: "nearest"

            });


            // Limpa o formulário
            contactForm.reset();


            // Remove os estados de validação
            formFields.forEach(field => {

                field.classList.remove(
                    "is-valid",
                    "is-invalid"
                );

            });


        } catch (error) {

            console.error(
                "Erro ao processar formulário:",
                error
            );

            alert(
                "Ocorreu um erro ao processar sua solicitação. " +
                "Tente novamente."
            );

        } finally {

            // Remove carregamento
            setLoadingState(false);

        }

    });

}


/* =========================================
   17. INICIALIZAÇÃO
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    updateNavbar();

    updateActiveNavLink();

});