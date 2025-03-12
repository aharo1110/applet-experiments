import { applets } from '@web-applets/sdk';

const context = applets.register();

context.setActionHandler('fetchWikiData', async (parameters) => {
  if (!parameters.name) {
    console.error('Search term is required!');
    return;
  }

  const response = await fetch(
    `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&titles=${encodeURIComponent(
      parameters.name
    )}&exintro=1&explaintext=1&origin=*`
  );
  const data = await response.json();

  const page = Object.values(data.query.pages)[0] as {
    title?: string;
    extract?: string;
  };

  if (!page || !page.title || !page.extract) {
    context.data = {
      title: 'No Results Found',
      extract: `We couldn't find any results for "${parameters.name}". Try searching for something else!`,
    };
    return;
  }

  context.data = {
    title: page.title,
    extract: page.extract,
  };
});

context.ondata = () => {
  if (!context.data) return;

  document.body.innerHTML = /*html*/ `
    <div class="wiki-main">
      <div>
        <h1>${context.data.title}</h1>
        <p>${context.data.extract}</p>
      </div>
    </div>
  `;
};
