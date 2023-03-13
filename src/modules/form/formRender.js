export default function render(elements) {
  return (path, value) => {
    if (path === 'formUiState.state') {
      if (value === 'invalid') {
        elements.rssInput.classList.add('is-invalid');
        elements.rssFormFeedback.classList.add('text-danger');
        elements.buttonToAddRss.disabled = false;
      } else if (value === 'loading') {
        elements.buttonToAddRss.disabled = true;
      } else {
        elements.rssInput.classList.remove('is-invalid');
        elements.rssFormFeedback.classList.remove('text-danger');
        elements.rssFormFeedback.classList.add('text-success');
        elements.buttonToAddRss.disabled = false;
      }
    }
    if (path === 'formUiState.description') {
      elements.rssFormFeedback.textContent = `${value}`;
    }
  };
}
