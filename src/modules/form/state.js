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

function giveMaxId(list) {
  if (list.length === 0) {
    return 1;
  }
  const ids = list.map((object) => object.id);
  return Math.max(...ids);
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
    let currentMaxId = giveMaxId(watchedState.rssPosts);
    const newPosts = posts.map((post) => {
      const newPost = { id: currentMaxId, ...post };
      currentMaxId += 1;
      return newPost;
    });
    watchedState.rssPosts.push(...newPosts);
    watchedState.postsUiState.push(...newPosts.map((newPost) => {
      const { id } = newPost;
      return { postId: id, uiState: 'not Visited' };
    }));
  }

  function changeUiStateOfPost(id) {
    const index = watchedState.postsUiState.findIndex((element) => element.postId === id);
    watchedState.postsUiState[index].uiState = 'visited';
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
    changeUiStateOfPost,
    addRssPosts,
    addRssFeed,
    getRssLinks,
    getRssPosts,
    getRssFeeds,
    getIntervalOfUpdates,
    getErrors,
  };
}
