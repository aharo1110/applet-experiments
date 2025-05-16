import { applets } from '@web-applets/sdk';

const context = applets.register();

context.setActionHandler('fetchWordDefinition', async (parameters) => {
  if (!parameters.word) {
    console.error('Word is required!');
    return;
  }

  const response = await fetch(
    `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(parameters.word)}`
  );

  if (!response.ok) {
    context.data = {
      word: 'No Results Found',
      definition: `No definitions found for "${parameters.word}".`,
    };
    return;
  }

  const data = await response.json();

  if (!Array.isArray(data) || !data.length) {
    context.data = {
      word: parameters.word,
      definition: 'No valid data returned.',
    };
    return;
  }

  const entry = data[0];
  const meaning = entry.meanings?.[0]?.definitions?.[0]?.definition || 'Definition not found.';
  const partOfSpeech = entry.meanings?.[0]?.partOfSpeech || 'N/A';
  const synonyms = entry.meanings?.[0]?.synonyms?.join(', ') || 'No synonyms available';
  const pronunciation = entry.phonetics?.[0]?.text || 'Not available';
  const audio = entry.phonetics?.[0]?.audio || '';

  context.data = {
    word: entry.word,
    definition: meaning,
    partOfSpeech,
    synonyms,
    pronunciation,
    audio,
  };
});

context.ondata = () => {
  if (!context.data) return;

  const container = document.getElementById('dictionaryResult');
  if (!container) return;

  container.innerHTML = `
    <h1>${context.data.word}</h1>
    <p><em>${context.data.partOfSpeech}</em></p>
    <p><strong>Definition:</strong> ${context.data.definition}</p>
    <p><strong>Synonyms:</strong> ${context.data.synonyms}</p>
    <p><strong>Pronunciation:</strong> ${context.data.pronunciation}</p>
    ${context.data.audio ? `<button onclick="new Audio('${context.data.audio}').play();">🔊 Play Pronunciation</button>` : '<p>No audio available</p>'}
  `;
};