// Import our custom CSS
import './styles.scss';
import 'bootstrap';
import i18n from 'i18next';
import axios from 'axios';
import form from './modules/form/formEvents.js';
import resources from './modules/locales/index.js';
import initState from './modules/form/state.js';
import render from './modules/form/formRender.js';
import parseRSS from './modules/lib/parser.js';
import useProxy from './modules/lib/useProxy.js';
import setUpdateParameters from './modules/lib/makeUpdates.js';
import postsWatcher from './modules/form/postsEvents.js';

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
      buttonToAddRss: document.querySelector('button[type="submit"]'),
      rssPostsContainer: document.querySelector('div.posts'),
      rssFeedsContainer: document.querySelector('div.feeds'),
      modalWindow: document.querySelector('#modal'),
    };
    const state = initState(render(elements, i18nextInstance));
    form(state, elements, i18nextInstance, axios.get, parseRSS, useProxy, setUpdateParameters);
    postsWatcher(elements, state);
  });
