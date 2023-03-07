import axios from 'axios';

export default function makeUpdate(state) {
  return function makeGetUpdate(rssLinks) {
    const promises = rssLinks.map((rssLink) => axios.get(rssLink))
      .then((answer) => answer.data)
      .catch((e) => {
        state.addErr(e);
      });
    return Promise.all(promises);
  };
}
