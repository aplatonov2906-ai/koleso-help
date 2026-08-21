// Koleso.Help — маска телефона + отправка заявки

// ---- Маска телефона +7 (___) ___-__-__ ----
const phoneInput = document.getElementById('f-phone');

function formatPhone(digits) {
  // digits — только цифры без ведущей 7/8
  let out = '+7 (';
  if (digits.length > 0) out += digits.slice(0, 3);
  if (digits.length >= 4) out += ') ' + digits.slice(3, 6);
  if (digits.length >= 7) out += '-' + digits.slice(6, 8);
  if (digits.length >= 9) out += '-' + digits.slice(8, 10);
  return out;
}

if (phoneInput) {
  phoneInput.addEventListener('input', () => {
    let d = phoneInput.value.replace(/\D/g, '');
    if (d.startsWith('7') || d.startsWith('8')) d = d.slice(1);
    d = d.slice(0, 10);
    phoneInput.value = d ? formatPhone(d) : '';
  });
}

// ---- Отправка формы ----
// Пока бэкенда нет: показываем подтверждение. Когда появится эндпоинт
// (например, вебхук CRM), заменить URL ниже и раскомментировать fetch.
const form = document.getElementById('calcForm');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const digits = (phoneInput.value || '').replace(/\D/g, '');
    if (digits.length < 11) {
      phoneInput.focus();
      phoneInput.style.borderBottom = '1px solid #f0505a';
      setTimeout(() => (phoneInput.style.borderBottom = ''), 2000);
      return;
    }

    // согласие на обработку ПД — обязательное активное действие (152-ФЗ)
    const agree = document.getElementById('f-agree');
    const agreeLabel = form.querySelector('.calc__agree');
    if (!agree || !agree.checked) {
      if (agreeLabel) {
        agreeLabel.classList.add('calc__agree--error');
        setTimeout(() => agreeLabel.classList.remove('calc__agree--error'), 2500);
      }
      if (agree) agree.focus();
      return;
    }

    const data = {
      service: form.service.value.trim(),
      car: form.car.value.trim(),
      disk: form.disk.value.trim(),
      phone: phoneInput.value.trim(),
      page: location.href,
      // фиксация факта согласия (дата/время + версия документов)
      consent: {
        given: true,
        at: new Date().toISOString(),
        docs: 'privacy.html, soglasie.html (редакция от 21.08.2026)',
      },
    };

    // TODO: подключить реальный приём заявок:
    // await fetch('https://ENDPOINT/api/intake', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data),
    // });
    console.log('Заявка:', data);

    const btn = form.querySelector('.calc__submit');
    btn.textContent = 'Заявка отправлена!';
    btn.style.background = '#3cd343';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = 'Онлайн расчет';
      btn.style.background = '';
      btn.disabled = false;
      form.reset();
    }, 4000);
  });
}
