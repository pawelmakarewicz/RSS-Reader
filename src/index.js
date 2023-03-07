// Import our custom CSS
import './styles.scss';
import 'bootstrap';
import i18n from 'i18next';
import axios from 'axios';
import form from './modules/form/formEvents.js';
import resources from './modules/locales/index.js';
import initState from './modules/form/state.js';
import render from './modules/form/formRender.js';
import parseRSS from './modules/form/parser.js';

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
    form(state, elements, i18nextInstance, axios.get, parseRSS);
  });
