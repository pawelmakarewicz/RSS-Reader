import onChange from 'on-change';

const initialStateForm = {
  rssLinks: [],
  formUiState: {
    state: null,
    description: null,
  },
  rssPosts: [],
  rssFeeds: [],
  errors: [],
};

function giveIdNumber(list) {
  if (list.length === 0) {
    return 1;
  }
  const ids = list.map((object) => object.id);
  const max = Math.max(...ids);
  const newId = max + 1;
  return newId;
}

export default function initState(onStateChange) {
  const watchedState = onChange(initialStateForm, onStateChange);
  function changeUiState(newState, descriptionOfNewState = '') {
    watchedState.formUiState.state = newState;
    watchedState.formUiState.description = descriptionOfNewState;
  }

  function addErr(e) {
    watchedState.errors = e;
  }
  function addLink(link) {
    watchedState.rssLinks.push(link);
  }

  function addRssPost(post) {
    watchedState.rssPosts.push({ id: giveIdNumber(watchedState.rssPosts), ...post });
  }

  function addRssFeed(feed) {
    watchedState.rssFeeds.push({ id: giveIdNumber(watchedState.rssFeeds), ...feed });
  }

  return {
    watchedState, addErr, addLink, changeUiState, addRssPost, addRssFeed,
  };
}
