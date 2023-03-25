export default function useProxy(url) {
  return `https://allorigins.hexlet.app/get?disableCache=true&url=${url}`;
}
