document.addEventListener('DOMContentLoaded', function () {
  // ==========================================
  // 1. VERIFICA SE HÁ MENSAGEM PÓS-REDIRECIONAMENTO
  // ==========================================
  const successMsg = document.getElementById('successMessage');
  const errorMsg = document.getElementById('errorMessage');
  const statusEnvio = sessionStorage.getItem('form_status');

  if (statusEnvio === 'success' && successMsg) {
    successMsg.classList.remove('d-none');
    successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
    sessionStorage.removeItem('form_status'); // Limpa para não reaparecer no F5
  } else if (statusEnvio === 'error' && errorMsg) {
    errorMsg.classList.remove('d-none');
    errorMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
    sessionStorage.removeItem('form_status');
  }

  // ==========================================
  // 2. MÁSCARAS DE INPUT (CNPJ, CPF, TELEFONE)
  // ==========================================
  const cnpjInput = document.getElementById('cnpj');
  if (cnpjInput) {
    cnpjInput.addEventListener('input', function (e) {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length <= 14) {
        value = value.replace(/^(\d{2})(\d)/, '$1.$2');
        value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
        value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
        value = value.replace(/(\d{4})(\d)/, '$1-$2');
      }
      e.target.value = value;
    });
  }

  const cpfInput = document.getElementById('cpf');
  if (cpfInput) {
    cpfInput.addEventListener('input', function (e) {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length > 11) value = value.slice(0, 11);

      if (value.length > 9) {
        value = value.replace(/^(\d{3})(\d{3})(\d{3})(\d{2}).*/, '$1.$2.$3-$4');
      } else if (value.length > 6) {
        value = value.replace(/^(\d{3})(\d{3})(\d{3}).*/, '$1.$2.$3');
      } else if (value.length > 3) {
        value = value.replace(/^(\d{3})(\d{3}).*/, '$1.$2');
      }
      e.target.value = value;
    });
  }

  const telefoneInput = document.getElementById('telefone');
  if (telefoneInput) {
    telefoneInput.addEventListener('input', function (e) {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length > 11) value = value.substring(0, 11);

      if (value.length > 10) {
        value = value.replace(/^(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
      } else if (value.length > 6) {
        value = value.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
      } else if (value.length > 2) {
        value = value.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
      } else if (value.length > 0) {
        value = value.replace(/^(\d*)/, '($1');
      }
      e.target.value = value;
    });
  }

  // ==========================================
  // 3. VALIDAÇÃO E ENVIO DO FORMULÁRIO
  // ==========================================
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitButton');

  if (!form || !submitBtn) return;

  const btnDefault = submitBtn.querySelector('.button-default');
  const btnLoading = submitBtn.querySelector('.button-loading');
  const formFields = form.querySelectorAll('input[required], select[required], textarea[required]');
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validateField(field) {
    const value = field.value.trim();

    if (field.hasAttribute('required') && value === '') {
      field.classList.add('is-invalid');
      return false;
    }

    if (field.type === 'email' && value !== '' && !regexEmail.test(value)) {
      field.classList.add('is-invalid');
      return false;
    }

    if (field.id === 'telefone' && value.replace(/\D/g, '').length < 10) {
      field.classList.add('is-invalid');
      return false;
    }

    field.classList.remove('is-invalid');
    return true;
  }

  // Validação em tempo real / saída de foco
  formFields.forEach((field) => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => field.classList.remove('is-invalid'));
    field.addEventListener('change', () => field.classList.remove('is-invalid'));
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Oculta alertas anteriores antes de tentar novo envio
    if (successMsg) successMsg.classList.add('d-none');
    if (errorMsg) errorMsg.classList.add('d-none');

    // Valida todos os campos obrigatórios
    let formIsValid = true;
    formFields.forEach((field) => {
      if (!validateField(field)) {
        formIsValid = false;
      }
    });

    if (!formIsValid) {
      const firstInvalidField = form.querySelector('.is-invalid');
      if (firstInvalidField) firstInvalidField.focus();
      return;
    }

    // Exibe o spinner dentro do botão e bloqueia cliques duplos
    submitBtn.disabled = true;
    if (btnDefault) btnDefault.classList.add('d-none');
    if (btnLoading) btnLoading.classList.remove('d-none');

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
        sessionStorage.setItem('form_status', 'success');
      } else {
        sessionStorage.setItem('form_status', 'error');
      }
    } catch (error) {
      console.error('Erro no envio:', error);
      sessionStorage.setItem('form_status', 'error');
    }

    // Redireciona para a mesma página já posicionado na seção de contato
    window.location.href = window.location.pathname + '#contato';
    window.location.reload();
  });
});