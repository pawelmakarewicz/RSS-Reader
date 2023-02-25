import onChange from 'on-change';
import * as Yup from 'yup';
import i18n from 'i18next';
import resources from '../locales/index.js';
import render from './formRender.js';

export default function validateForm() {
  const i18nextInstance = i18n.createInstance();
  i18nextInstance.init({
    lng: 'ru',
    debug: true,
    resources: {
      ru: resources.ru,
    },
  })
    .then(() => {
      const initialStateForm = {
        rssLinks: [],
        formUiState: {
          state: null,
          description: null,
        },
        errors: {},
      };
      const urlValidationSchema = Yup.string().url(i18nextInstance.t('signUpForm.validationResult.wrongURL'));
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
          changeUiState('invalid', i18nextInstance.t('signUpForm.validationResult.alreadyExist'));
          return;
        }
        urlValidationSchema.validate(newRssLink)
          .then(() => {
            changeUiState('valid', i18nextInstance.t('signUpForm.validationResult.urlIsOk'));
            addLink(newRssLink);
            addErr(null);
          })
          .catch((err) => {
            changeUiState('invalid', err.message);
            addErr(err);
          });
      }

      elements.rssForm.addEventListener('submit', checkUrl);
    });
}
