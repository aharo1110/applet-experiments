import { applets } from '@web-applets/sdk';

const context = applets.register();

context.setActionHandler('fetchWordDefinition', async (parameters) => {
  if (!parameters.word) {
    console.error('Word is required!');
    return;
  }

  // Make the API request
  const response = await fetch(
    `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(parameters.word)}`
  );

  // Check if the response is successful
  if (!response.ok) {
    context.data = {
      word: 'No Results Found',
      definition: `No definitions found for "${parameters.word}".`,
    };
    return;
  }

  // Parse the JSON response
  const data = await response.json();
  console.log(data); // Log the full data to see its structure

  // If no data or invalid structure, return a default message
  if (!Array.isArray(data) || !data.length) {
    context.data = {
      word: parameters.word,
      definition: 'No valid data returned.',
    };
    return;
  }

  // Extract relevant information from the API response
  const entry = data[0]; // Take the first entry from the data array
  const meaning = entry.meanings?.[0]?.definitions?.[0]?.definition || 'Definition not found.';
  const partOfSpeech = entry.meanings?.[0]?.partOfSpeech || 'N/A';
  const synonyms = entry.meanings?.[0]?.synonyms?.join(', ') || 'No synonyms available';
  const pronunciation = entry.phonetics?.[0]?.text || 'Not available';

  // Set the data to be displayed
  context.data = {
    word: entry.word,
    definition: meaning,
    partOfSpeech,
    synonyms,
    pronunciation,
  };
});

context.ondata = () => {
  if (!context.data) return;

  const container = document.getElementById('dictionaryResult');
  if (!container) return;

  // Update the content inside the 'dictionaryResult' div
  container.innerHTML = `
    <h1>${context.data.word}</h1>
    <p><em>${context.data.partOfSpeech}</em></p>
    <p><strong>Definition:</strong> ${context.data.definition}</p>
    <p><strong>Synonyms:</strong> ${context.data.synonyms}</p>
    <p><strong>Pronunciation:</strong> ${context.data.pronunciation}</p>
  `;
};
