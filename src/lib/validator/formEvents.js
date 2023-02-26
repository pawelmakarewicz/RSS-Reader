import * as Yup from 'yup';

export default function setUpFormEvents(state, elements, i18nextInstance) {
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
      .then(() => {
        state.changeUiState('valid', i18nextInstance.t('signUpForm.validationResult.urlIsOk'));
        state.addLink(newRssLink);
        state.addErr(null);
      })
      .catch((err) => {
        state.changeUiState('invalid', err.message);
        state.addErr(err);
      });
  }

  elements.rssForm.addEventListener('submit', onSubmit);
}
