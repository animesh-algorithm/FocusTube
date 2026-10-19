const preview = document.querySelector('#browser');
const viewButtons = document.querySelectorAll('[data-mode]');
viewButtons.forEach(button => {
  button.addEventListener('click', () => {
    const focused = button.dataset.mode === 'focused';
    preview.classList.toggle('focused', focused);
    viewButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  });
});
