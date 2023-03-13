import _ from 'lodash';

function isNewPost(currentPosts, postToCheck) {
  const result = _.find(currentPosts, postToCheck);
  console.log(result);
  if (typeof result === 'undefined') {
    return true;
  }
  return false;
}

export default function setUpdateParameters(state, makeRequest, parseRSS, useProxy) {
  function makeUpdate() {
    setTimeout(() => {
      const links = state.getRssLinks();
      const promises = links.map((link) => makeRequest(useProxy(link))
        .catch((e) => { state.addErr(e); }));
      const promise = Promise.all(promises);
      promise.then((responses) => {
        responses.forEach((response) => {
          const result = parseRSS(response.data.contents, 'text/xml');
          const { rssPosts } = result;
          const currentRssPosts = state.getRssPosts();
          rssPosts.forEach((post) => {
            if (isNewPost(currentRssPosts, post)) {
              state.addRssPost(post);
              // console.log(state.getRssPosts());
            }
          });
        });
        return makeUpdate();
      });
    }, 5000);
  }
  return makeUpdate();
}
