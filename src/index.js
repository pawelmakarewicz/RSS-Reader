// Import our custom CSS
import './styles.scss';
import 'bootstrap';
import i18n from 'i18next';
import form from './lib/validator/formEvents.js';
import resources from './lib/locales/index.js';
import initState from './lib/validator/state.js';
import render from './lib/validator/formRender.js';

const i18nextInstance = i18n.createInstance();
i18nextInstance.init({
  lng: 'ru',
  debug: true,
  resources: {
    ru: resources.ru,
  },
})
  .then(() => {
    const elements = {
      rssForm: document.querySelector('form'),
      rssInput: document.querySelector('#url-input'),
      rssFormFeedback: document.querySelector('.feedback'),
    };
    const state = initState(render(elements));
    form(state, elements, i18nextInstance);
  });
