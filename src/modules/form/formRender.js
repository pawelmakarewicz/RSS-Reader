import _ from 'lodash';

function addTitle(titleName) {
  return `<div class="card-body"><h2 class="card-title h4">${titleName}</h2></div>`;
}

function createElementWithStyle(tagName, styles) {
  const newElement = document.createElement(`${tagName}`);
  newElement.classList.add(...styles);
  return newElement;
}

function setAttributeLink(link, id) {
  return [
    {
      attributeName: 'href',
      attributeValue: `${link}`,
    },
    {
      attributeName: 'data-id',
      attributeValue: `${id}`,
    },
    {
      attributeName: 'target',
      attributeValue: '_blank',
    },
    {
      attributeName: 'rel',
      attributeValue: 'noopener noreferrer',
    },
  ];
}

function setAttributeButtonPreview(id) {
  return [
    {
      attributeName: 'data-id',
      attributeValue: `${id}`,
    },
    {
      attributeName: 'type',
      attributeValue: 'button',
    },
    {
      attributeName: 'data-bs-toggle',
      attributeValue: 'modal',
    },
    {
      attributeName: 'data-bs-target',
      attributeValue: '#modal',
    },
  ];
}

const styles = {
  classesOfWrapper: ['card', 'border-0'],
  classesOfList: ['list-group', 'border-0', 'rounded-0'],
  classesOfListItem: ['list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0'],
  classesOfLink: ['fw-bold'],
  classesOfFeedItem: ['list-group-item', 'border-0', 'border-end-0'],
  feedTitle: ['h6', 'm-0'],
  feedDescription: ['m-0', 'small', 'text-black-50'],
  buttonOfPreview: ['btn', 'btn-outline-primary', 'btn-sm'],
};

export default function render(elements, i18nextInstance) {
  return function onChangeRender(path, value) {
    if (path === 'formUiState.state') {
      if (value === 'invalid') {
        elements.rssInput.classList.add('is-invalid');
        elements.rssFormFeedback.classList.add('text-danger');
        elements.buttonToAddRss.disabled = false;
      } else if (value === 'loading') {
        elements.buttonToAddRss.disabled = true;
      } else {
        elements.rssInput.classList.remove('is-invalid');
        elements.rssFormFeedback.classList.remove('text-danger');
        elements.rssFormFeedback.classList.add('text-success');
        elements.buttonToAddRss.disabled = false;
        elements.rssForm.reset();
      }
    }
    if (path === 'formUiState.description') {
      elements.rssFormFeedback.textContent = `${value}`;
    }
    if (path === 'rssPosts') {
      const listOfPosts = createElementWithStyle('ul', styles.classesOfList);
      this.rssPosts.forEach((post) => {
        const {
          id, title, link,
        } = post;
        const listElement = createElementWithStyle('li', styles.classesOfListItem);
        const reference = createElementWithStyle('a', styles.classesOfLink);
        setAttributeLink(link, id)
          .forEach(({ attributeName, attributeValue }) => {
            reference.setAttribute(attributeName, attributeValue);
          });
        reference.textContent = `${title}`;
        listElement.append(reference);
        const previewButton = createElementWithStyle('button', styles.buttonOfPreview);
        setAttributeButtonPreview(id)
          .forEach(({ attributeName, attributeValue }) => {
            previewButton.setAttribute(attributeName, attributeValue);
          });
        previewButton.textContent = i18nextInstance.t('signUpForm.previewButton');
        listElement.append(previewButton);
        listOfPosts.prepend(listElement);
      });
      elements.rssPostsContainer.innerHTML = '';
      const divWrapper = createElementWithStyle('div', styles.classesOfWrapper);
      divWrapper.innerHTML = addTitle('Посты');
      elements.rssPostsContainer.append(divWrapper);
      divWrapper.append(listOfPosts);
    }
    if (path === 'rssFeeds') {
      const listOfFeeds = createElementWithStyle('ul', styles.classesOfList);
      this.rssFeeds.forEach((feed) => {
        const { titleFeed, descriptionFeed } = feed;
        const listElementFeed = createElementWithStyle('li', styles.classesOfFeedItem);
        const feedTitle = createElementWithStyle('h3', styles.feedTitle);
        feedTitle.textContent = titleFeed;
        const feedDescription = createElementWithStyle('p', styles.feedDescription);
        feedDescription.textContent = descriptionFeed;
        listElementFeed.append(feedTitle);
        listElementFeed.append(feedDescription);
        listOfFeeds.append(listElementFeed);
      });
      elements.rssFeedsContainer.innerHTML = '';
      const divWrapperFeed = createElementWithStyle('div', styles.classesOfWrapper);
      divWrapperFeed.innerHTML = addTitle('Фиды');
      divWrapperFeed.append(listOfFeeds);
      elements.rssFeedsContainer.append(divWrapperFeed);
    }
  };
}
