function getDataOfRssPost(item) {
  const elementTitle = item.querySelector('title');
  const elementLink = item.querySelector('link');
  const elementDescription = item.querySelector('description');
  const title = elementTitle.textContent;
  const link = elementLink.textContent;
  const description = elementDescription.textContent;
  return { title, link, description };
}

export default function parseRSS(content) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(content, 'text/xml');

  if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
    throw new Error('Parsing Error');
  } else {
    const titleFeedElement = xmlDoc.querySelector('title');
    const descriptionFeedElement = xmlDoc.querySelector('description');
    const titleFeed = titleFeedElement.textContent;
    const descriptionFeed = descriptionFeedElement.textContent;
    const items = xmlDoc.querySelectorAll('item');
    const rssPosts = [...items].map(getDataOfRssPost);
    const feed = { titleFeed, descriptionFeed };
    return { feed, rssPosts };
  }
}
