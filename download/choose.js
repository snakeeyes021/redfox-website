// "Which cards?" and similar: a button that shows or hides the list it
// controls (tap, click, Enter or Space; not hover).
document.querySelectorAll('button[aria-controls][aria-expanded]').forEach((button) => {
  const target = document.getElementById(button.getAttribute('aria-controls'));
  if (!target) return;
  button.addEventListener('click', () => {
    const open = button.getAttribute('aria-expanded') !== 'true';
    button.setAttribute('aria-expanded', String(open));
    target.hidden = !open;
  });
});
