import onChange from 'on-change';
import * as Yup from 'yup';
import render from './formRender.js';

const urlValidationSchema = Yup.string().url('Ссылка должна быть валидным URL');

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

  const watchedState = onChange(initialStateForm, render(elements));

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
