// Copy-to-clipboard for install commands.
const toast = document.getElementById('toast');
let toastTimer;

document.querySelectorAll('[data-copy]').forEach((button) => {
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(button.dataset.copy);
      toast.textContent = 'Copied';
    } catch {
      toast.textContent = 'Couldn’t copy. Select the text instead.';
    }
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 1600);
  });
});
