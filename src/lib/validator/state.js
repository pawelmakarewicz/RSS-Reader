import onChange from 'on-change';

const initialStateForm = {
  rssLinks: [],
  formUiState: {
    state: null,
    description: null,
  },
  errors: {},
};

export default function initState(onStateChange) {
  const watchedState = onChange(initialStateForm, onStateChange);
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
  return {
    watchedState, addErr, addLink, changeUiState,
  };
}
