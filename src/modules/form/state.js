import onChange from 'on-change';

const initialStateForm = {
  rssLinks: [],
  formUiState: {
    state: null,
    description: null,
  },
  postsUiState: [],
  intervalOfUpdates: 5000,
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

  function addRssPosts(posts) {
    watchedState.rssPosts.push(...posts.map((post) => ({ id: giveIdNumber(watchedState.rssPosts), ...post })));
    watchedState.postsUiState.push(...watchedState.rssPosts.map((postWithId) => {
      const { id } = postWithId;
      return { postId: id, uiState: 'not visited' };
    }));
  }

  function addRssFeed(feed) {
    watchedState.rssFeeds.push(feed);
  }

  function getRssLinks() {
    return watchedState.rssLinks;
  }

  function getRssPosts() {
    return watchedState.rssPosts;
  }
  function getRssFeeds() {
    return watchedState.rssFeeds;
  }

  function getIntervalOfUpdates() {
    return watchedState.intervalOfUpdates;
  }

  function getErrors() {
    return watchedState.errors;
  }

  return {
    watchedState,
    addErr,
    addLink,
    changeUiState,
    addRssPosts,
    addRssFeed,
    getRssLinks,
    getRssPosts,
    getRssFeeds,
    getIntervalOfUpdates,
    getErrors,
  };
}
