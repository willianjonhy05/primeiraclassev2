document.addEventListener('DOMContentLoaded', function () {
  // ==========================================
  // 1. MÁSCARAS DE INPUT (CNPJ, CPF, TELEFONE)
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
  // 2. VALIDAÇÃO DE CAMPOS
  // ==========================================
  const emailInput = document.getElementById('email');
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

  if (emailInput) {
    emailInput.addEventListener('blur', () => validateField(emailInput));
    emailInput.addEventListener('input', () => emailInput.classList.remove('is-invalid'));
  }

  // ==========================================
  // 3. ENVIO DO FORMULÁRIO COM LOADING E RELOAD
  // ==========================================
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitButton');

  if (!form || !submitBtn) return;

  const btnText = submitBtn.querySelector('.button-text');
  const btnLoading = submitBtn.querySelector('.button-loading');
  const btnIcon = submitBtn.querySelector('.button-icon');
  const successMsg = document.getElementById('successMessage');
  const errorMsg = document.getElementById('errorMessage');
  const formFields = form.querySelectorAll('input[required], select[required], textarea[required]');

  // Remove o vermelho assim que o usuário digitar ou alterar um campo
  formFields.forEach((field) => {
    field.addEventListener('input', () => field.classList.remove('is-invalid'));
    field.addEventListener('change', () => field.classList.remove('is-invalid'));
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (successMsg) successMsg.classList.add('d-none');
    if (errorMsg) errorMsg.classList.add('d-none');

    // Valida todos os campos obrigatórios antes de enviar
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

    // Ativa o estado de carregamento no botão
    submitBtn.disabled = true;
    if (btnText) btnText.classList.add('d-none');
    if (btnIcon) btnIcon.classList.add('d-none');
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
        if (successMsg) {
          successMsg.classList.remove('d-none');
          successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        form.reset();

        // Aguarda 1,5 segundo para o usuário ler a confirmação e recarrega a página
        setTimeout(() => {
          window.location.reload();
        }, 1500);

      } else {
        throw new Error('Falha na resposta do servidor');
      }
    } catch (error) {
      console.error('Erro no envio:', error);
      if (errorMsg) errorMsg.classList.remove('d-none');

      // Restaura o botão apenas se der erro (se der certo, a página vai recarregar)
      submitBtn.disabled = false;
      if (btnText) btnText.classList.remove('d-none');
      if (btnIcon) btnIcon.classList.remove('d-none');
      if (btnLoading) btnLoading.classList.add('d-none');
    }
  });
});