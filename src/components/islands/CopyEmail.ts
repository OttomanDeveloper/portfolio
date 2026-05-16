// src/components/islands/CopyEmail.ts
export function mountCopyEmail(btn: HTMLButtonElement, email: string) {
  const original = btn.dataset.originalLabel ?? btn.textContent ?? email;
  btn.dataset.originalLabel = original;
  btn.addEventListener('click', async (e) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(email);
      btn.textContent = '✓ copied';
      btn.setAttribute('aria-label', 'email copied to clipboard');
      setTimeout(() => {
        btn.textContent = original;
        btn.setAttribute('aria-label', `copy ${email} to clipboard`);
      }, 2000);
    } catch (err) {
      window.location.href = `mailto:${email}`;
    }
  });
}
