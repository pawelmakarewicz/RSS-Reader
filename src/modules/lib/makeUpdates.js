import _ from 'lodash';

function isNew(currentPosts, postToCheck) {
  return _.find(currentPosts, postToCheck) === undefined;
}

function isRespondOk(response) {
  return response.status === 200;
}

function getResponses(newLinks, makeRequest, useProxy, state) {
  return Promise.all(newLinks.map((link) => makeRequest(useProxy(link))
    .catch((e) => { state.addErr(e); })));
}

function canIMakeUpdate(numberOfLinksWhenUpdatedStarted, currentNumberOfLinks) {
  return numberOfLinksWhenUpdatedStarted === currentNumberOfLinks;
}

export default function setUpdateParameters(state, makeRequest, parseRSS, useProxy) {
  const numberLinksWhenFunctionStartMakeUpdate = state.getRssLinks().length;
  let newPosts = [];
  function addContent(update) {
    const links = state.getRssLinks();
    getResponses(links, makeRequest, useProxy, state)
      .then((responses) => {
        responses.filter((response) => isRespondOk(response))
          .forEach((response) => {
            try {
              const result = parseRSS(response.data.contents, 'text/xml');
              const { rssPosts } = result;
              const currentRssPosts = state.getRssPosts();
              rssPosts.forEach((post) => {
                if (isNew(currentRssPosts, post)) {
                  newPosts.push(post);
                }
              });
            } catch (e) {
              state.addErr(e);
            }
          });
        if (newPosts.length > 0) {
          state.addRssPosts(newPosts);
          newPosts = [];
        }
        return update();
      });
  }

  function makeUpdate() {
    const currentNumberOfLinks = state.getRssLinks().length;
    if (!canIMakeUpdate(numberLinksWhenFunctionStartMakeUpdate, currentNumberOfLinks)) {
      return;
    }
    setTimeout(() => {
      addContent(makeUpdate);
    }, state.getIntervalOfUpdates());
  }
  return makeUpdate();
}
