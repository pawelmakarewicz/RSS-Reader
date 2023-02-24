import onChange from 'on-change';
import * as Yup from 'yup';

const urlValidationSchema = Yup.string().url('Ссылка должна быть валидным URL');

const render = (elements, state) => (path, value, prevValue) => {
  if (path === 'formUiState.state') {
    if (value === 'invalid') {
      elements.rssInput.classList.add('is-invalid');
      elements.rssFormFeedback.classList.add('text-danger');
    } else {
      elements.rssInput.classList.remove('is-invalid');
      elements.rssFormFeedback.classList.remove('text-danger');
      elements.rssFormFeedback.classList.add('text-success');
    }
  }
  if (path === 'formUiState.description') {
    elements.rssFormFeedback.textContent = `${value}`;
  }
};

export default function validateForm() {
  const initialStateForm = {
    rssLinks: [],
    formUiState: {
      state: null,
      description: null,
    },
    errors: {},
  };

  const elements = {
    rssForm: document.querySelector('form'),
    rssInput: document.querySelector('#url-input'),
    rssFormFeedback: document.querySelector('.feedback'),
  };

  const watchedState = onChange(initialStateForm, render(elements, initialStateForm));

  function changeUiState(newState, descriptionOfNewState) {
    watchedState.formUiState.state = newState;
    watchedState.formUiState.description = descriptionOfNewState;
  }

  function addErr(e) {
    watchedState.errors = e;
  }

  function addLink(link) {
    watchedState.rssLinks.push(link);
  }

  function checkUrl(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newRssLink = formData.get('url');
    if (watchedState.rssLinks.includes(newRssLink)) {
      changeUiState('invalid', 'RSS уже существует');
      return;
    }
    urlValidationSchema.validate(newRssLink)
      .then(() => {
        changeUiState('valid', 'RSS успешно загружен');
        addLink(newRssLink);
        addErr(null);
      })
      .catch((err) => {
        changeUiState('invalid', err.message);
        addErr(err);
      });
  }
  elements.rssForm.addEventListener('submit', checkUrl);
}
