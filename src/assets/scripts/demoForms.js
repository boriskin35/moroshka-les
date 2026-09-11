function initDemoForms() {
  document.querySelectorAll('[data-demo-form]').forEach(form => {
    if (form.dataset.demoBound === 'true') return;
    form.dataset.demoBound = 'true';

    form.addEventListener('submit', event => {
      event.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const status =
        form.querySelector('[data-demo-status]') ??
        form.parentElement?.querySelector('[data-demo-status]');
      const message =
        form.dataset.demoMessage ||
        status?.dataset.successMessage ||
        'Demo only — this form is not connected to a backend.';

      if (status) {
        status.textContent = message;
        status.classList.remove('hidden');
      }

      form.reset();
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDemoForms);
} else {
  initDemoForms();
}
