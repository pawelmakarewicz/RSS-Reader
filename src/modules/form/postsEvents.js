export default function postsWatcher(elements, state) {
  function onClickChangeUiState(e) {
    const element = e.target;
    const id = element.getAttribute('data-id');
    if (id) {
      state.changeUiStateOfPost(Number(id));
    }
  }
  elements.rssPostsContainer.addEventListener('click', onClickChangeUiState);
}
