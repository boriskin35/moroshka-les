const CONTACT_API_URL = '/api/contact.php';

function initContactForms() {
  document.querySelectorAll('[data-contact-form]').forEach(form => {
    if (form.dataset.bound === 'true') return;
    form.dataset.bound = 'true';

    const consentCheckbox = form.querySelector('[name="privacy-consent"]');
    const status = form.querySelector('[data-form-status]');

    // Убираем красную подсветку и текст ошибки сразу при установке галочки
    if (consentCheckbox) {
      consentCheckbox.addEventListener('change', () => {
        if (consentCheckbox.checked) {
          consentCheckbox.classList.remove(
            'ring-2',
            'ring-red-500',
            'border-red-500'
          );
          if (status && status.textContent.includes('согласие на обработку')) {
            status.textContent = '';
            status.className =
              'mt-3 hidden text-sm font-semibold transition-all duration-300';
          }
        }
      });
    }

    form.addEventListener('submit', async event => {
      event.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn ? submitBtn.textContent : '';

      const nameInput = form.querySelector('[name="hs-firstname-contacts"]');
      const phoneInput = form.querySelector('[name="hs-phone-number"]');
      const messageInput = form.querySelector('[name="hs-about-contacts"]');
      const hpInput = form.querySelector('[name="hp_field"]');

      const name = nameInput ? nameInput.value.trim() : '';
      const phone = phoneInput ? phoneInput.value.trim() : '';
      const message = messageInput ? messageInput.value.trim() : '';
      const hp_field = hpInput ? hpInput.value.trim() : '';

      if (!phone) {
        if (status) {
          status.textContent = 'Пожалуйста, укажите номер телефона.';
          status.className =
            'mt-3 block text-sm font-semibold text-red-600 dark:text-red-400';
        }
        if (phoneInput) phoneInput.focus();
        return;
      }

      // Проверка обязательного согласия на обработку ПДн (152-ФЗ)
      if (!consentCheckbox || !consentCheckbox.checked) {
        if (status) {
          status.textContent =
            'Необходимо подтвердить согласие на обработку персональных данных.';
          status.className =
            'mt-3 block text-sm font-semibold text-red-600 dark:text-red-400';
        }
        if (consentCheckbox) {
          consentCheckbox.focus();
          consentCheckbox.classList.add(
            'ring-2',
            'ring-red-500',
            'border-red-500'
          );
        }
        return;
      }

      // Блокируем кнопку на время отправки
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'ОТПРАВКА...';
      }
      if (status) {
        status.textContent = 'Отправляем заявку...';
        status.className =
          'mt-3 block text-sm text-neutral-600 dark:text-neutral-400';
      }

      try {
        const response = await fetch(CONTACT_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({ name, phone, message, hp_field }),
        });

        const result = await response.json().catch(() => ({}));

        if (response.ok && result.ok) {
          if (status) {
            status.textContent =
              'Спасибо! Заявка успешно принята, мы свяжемся с вами в течение дня.';
            status.className =
              'mt-3 block text-sm font-semibold text-emerald-600 dark:text-emerald-400';
          }
          form.reset();
        } else {
          throw new Error(result.error || 'Ошибка отправки');
        }
      } catch (err) {
        if (status) {
          status.textContent =
            err.message && err.message !== 'Ошибка отправки'
              ? err.message
              : 'Не удалось отправить заявку. Пожалуйста, позвоните нам или напишите в Telegram.';
          status.className = 'mt-3 block text-sm font-semibold text-accent';
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;
        }
      }
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initContactForms);
} else {
  initContactForms();
}
