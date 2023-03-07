import * as Yup from 'yup';

function useProxy(url) {
  return `https://allorigins.hexlet.app/get?disableCache=true&url=${url}`;
}

export default function setUpFormEvents(state, elements, i18nextInstance, makeRequest, parseRSS) {
  function onSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newRssLink = formData.get('url');
    if (state.watchedState.rssLinks.includes(newRssLink)) {
      state.changeUiState('invalid', i18nextInstance.t('signUpForm.validationResult.alreadyExist'));
      return;
    }
    const urlValidationSchema = Yup.string().url(i18nextInstance.t('signUpForm.validationResult.wrongURL'));
    urlValidationSchema.validate(newRssLink)
      .then(() => makeRequest(useProxy(newRssLink)))
      .then((response) => {
        console.log(response.data.contents);
        const xmlDoc = parseRSS(response.data.contents, 'text/xml');
      })
      .then(() => {
        state.changeUiState('valid', i18nextInstance.t('signUpForm.validationResult.urlIsOk'));
        state.addLink(newRssLink);
      })
      .catch((err) => {
        let message;
        if (err.message === 'Network Error') {
          message = i18nextInstance.t('signUpForm.validationResult.connectionFailed');
        } else if (err.message === 'Parsing Error') {
          message = i18nextInstance.t('signUpForm.validationResult.doesNotContainRSS');
        } else {
          message = err.message;
        }
        state.changeUiState('invalid', message);
        state.addErr(err);
      });
  }
  elements.rssForm.addEventListener('submit', onSubmit);
}
