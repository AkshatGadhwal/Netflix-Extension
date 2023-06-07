function updateAppearance(appearance) {
  const body = document.querySelector('body');

  if (appearance === 'dark') {
    body.classList.remove('light');
    body.classList.add('dark');
  } else {
    body.classList.remove('dark');
    body.classList.add('light');
  }
}

document.getElementById('appearance').addEventListener('change', (event) => {
  const appearance = event.target.value;
  chrome.storage.sync.set({ appearance }, () => {
    console.log('Appearance updated:', appearance);
  });

  updateAppearance(appearance);
});

// Load saved settings
chrome.storage.sync.get(['appearance', 'info'], (settings) => {
  if (settings.appearance) {
    document.getElementById('appearance').value = settings.appearance;
    updateAppearance(settings.appearance);
  }

  if (settings.info) {
    document.getElementById('info').value = settings.info;
  }
});
