const results = document.getElementById('recipe-results');
const summary = document.getElementById('selected-ingredients');
const buttons = [...document.querySelectorAll('button[data-value]')];
let request;
let version = 0;
function message(text) { results.replaceChildren(); results.textContent = text; }
async function showRecipes(button) {
  const current = ++version;
  if (request) request.abort();
  buttons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  summary.textContent = 'Recipes for ' + button.textContent.trim();
  if (location.protocol === 'file:') {
    message('Open this page through the YumYum server at http://localhost:3000/ICook.html to load recipes.');
    return;
  }
  request = new AbortController();
  const timeout = setTimeout(() => request.abort(), 15000);
  results.setAttribute('aria-busy', 'true');
  message('Finding something delicious…');
  try {
    const response = await fetch('/api/recipes?tags=' + encodeURIComponent(button.dataset.value), { signal: request.signal, cache: 'no-store' });
    if (!response.ok) throw new Error('Recipe request failed');
    const payload = await response.json();
    if (!Array.isArray(payload.recipes)) throw new Error('Invalid response');
    if (current !== version) return;
    results.replaceChildren();
    for (const recipe of payload.recipes) {
      let url; try { url = new URL(recipe.url); } catch { continue; }
      if (url.protocol !== 'https:' || !['www.bilibili.com','bilibili.com'].includes(url.hostname) || typeof recipe.title !== 'string') continue;
      const link = document.createElement('a');
      link.href = url.href;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = recipe.title + ' ↗';
      link.setAttribute('aria-label', recipe.title + ' (opens on Bilibili in a new tab)');
      results.appendChild(link);
    }
    if (!results.childElementCount) message('No recipes saved for this option yet. Try another ingredient.');
  } catch {
    if (current === version) message('Could not load recipes. Please check the server and database, then click again to retry.');
  } finally {
    clearTimeout(timeout);
    if (current === version) results.removeAttribute('aria-busy');
  }
}
buttons.forEach(button => button.addEventListener('click', () => showRecipes(button)));
summary.textContent = 'Choose an ingredient to see its recipes.';
if (location.protocol === 'file:') message('Recipe links need the YumYum server. After setup, open http://localhost:3000/ICook.html.');
