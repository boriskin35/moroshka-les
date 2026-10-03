function initContactForms() {
  document.querySelectorAll('[data-contact-form]').forEach(form => {
    if (form.dataset.bound === 'true') return;
    form.dataset.bound = 'true';

    form.addEventListener('submit', async event => {
      event.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      const status = form.querySelector('[data-form-status]');
      const originalBtnText = submitBtn ? submitBtn.textContent : '';

      const nameInput = form.querySelector('[name="hs-firstname-contacts"]');
      const phoneInput = form.querySelector('[name="hs-phone-number"]');
      const messageInput = form.querySelector('[name="hs-about-contacts"]');

      const name = nameInput ? nameInput.value.trim() : '';
      const phone = phoneInput ? phoneInput.value.trim() : '';
      const message = messageInput ? messageInput.value.trim() : '';

      if (!phone) {
        if (status) {
          status.textContent = 'Пожалуйста, укажите номер телефона.';
          status.className =
            'mt-3 block text-sm font-semibold text-red-600 dark:text-red-400';
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
        const response = await fetch('/api/send-lead', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, phone, message }),
        });

        const result = await response.json().catch(() => ({}));

        if (response.ok && result.ok) {
          if (status) {
            status.textContent =
              'Спасибо! Заявка успешно принята, мы свяжемся с вами в течение дня.';
            status.className =
              'mt-3 block text-sm font-semibold text-accent';
          }
          form.reset();
        } else {
          throw new Error(result.error || 'Ошибка отправки');
        }
      } catch (err) {
        if (status) {
          status.textContent =
            'Не удалось отправить заявку. Пожалуйста, позвоните нам или напишите в Telegram.';
          status.className =
            'mt-3 block text-sm font-semibold text-red-600 dark:text-red-400';
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
