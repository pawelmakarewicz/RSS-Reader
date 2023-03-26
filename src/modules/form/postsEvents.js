export default function postsWatcher(elements, state) {
  function onClickChangeUiState(e) {
    const element = e.target;
    const id = Number(element.getAttribute('data-id'));
    if (id) {
      state.changeUiStateOfPost(id);
      const link = [...element.parentNode.childNodes].find((node) => node.tagName === 'A');
      link.className = '';
      link.classList.add('fw-normal', 'link-secondary');
      if (element.tagName === 'BUTTON') {
        state.changeCurrentPost(id);
      }
    }
  }
  elements.rssPostsContainer.addEventListener('click', onClickChangeUiState);
}
