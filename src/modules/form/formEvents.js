import * as Yup from 'yup';

export default function setUpFormEvents(
  state,
  elements,
  i18nextInstance,
  makeRequest,
  parseRSS,
  useProxy,
  makeUpdate,
) {
  function onSubmit(e) {
    e.preventDefault();
    state.changeUiState('loading');
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
        const xmlDoc = parseRSS(response.data.contents, 'text/xml');
        const { feed, rssPosts } = xmlDoc;
        state.addRssFeed(feed);
        rssPosts.forEach((post) => { state.addRssPost(post); });
        state.addLink(newRssLink);
        state.changeUiState('valid', i18nextInstance.t('signUpForm.validationResult.urlIsOk'));
        makeUpdate(state, makeRequest, parseRSS, useProxy);
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
