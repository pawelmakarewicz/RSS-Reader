export default function postsWatcher(elements, state) {
  function onClickChangeUiState(e) {
    const element = e.target;
    const id = element.getAttribute('data-id');
    if (id) {
      state.changeUiStateOfPost(Number(id));
      const link = [...element.parentNode.childNodes].filter((node) => node.tagName === 'A')[0];
      console.log(link);
      link.className = '';
      link.classList.add('fw-normal', 'link-secondary');
      if (element.tagName === 'BUTTON') {
        console.log('aaaa');
      }
    }
  }
  elements.rssPostsContainer.addEventListener('click', onClickChangeUiState);
}
