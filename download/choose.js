// "Help me choose": nothing happens until the visitor pastes a code from
// identify_gpu.sh / identify_gpu.ps1. Then the rules are fetched from the
// redfox-os repo (the same file RedFox Hub uses) and one image is suggested.

// main first; unstable until the rules reach main.
const RULES_URLS = [
  'https://raw.githubusercontent.com/snakeeyes021/redfox-os/main/files/system/usr/share/redfox/gpu-rules.json',
  'https://raw.githubusercontent.com/snakeeyes021/redfox-os/unstable/files/system/usr/share/redfox/gpu-rules.json',
];

const images = document.getElementById('images');
const verdict = document.getElementById('verdict');
const verdictText = document.getElementById('verdict-text');
const hybridNote = document.getElementById('verdict-hybrid');
const choose = document.getElementById('choose');
const form = document.getElementById('paste');
const input = document.getElementById('code');
const error = document.getElementById('code-error');

let rules = null;
async function loadRules() {
  if (rules) return rules;
  for (const url of RULES_URLS) {
    try {
      const response = await fetch(url, { cache: 'no-cache' });
      if (response.ok) {
        rules = await response.json();
        return rules;
      }
    } catch {
      // try the next one
    }
  }
  throw new Error('rules');
}

const names = {
  'redfox-os': 'RedFoxOS (Intel & AMD)',
  'redfox-os-nvidia': 'RedFoxOS NVIDIA',
  'redfox-os-nvidia-legacy': 'RedFoxOS NVIDIA Legacy',
};

function showAll() {
  images.classList.remove('picked');
  images.querySelectorAll('.image').forEach((card) => {
    card.classList.remove('suggested');
    card.querySelector('.badge').hidden = true;
  });
  verdict.hidden = true;
}

function showError(text) {
  error.textContent = text;
  error.hidden = false;
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  error.hidden = true;
  const devices = RedFoxGpu.parseCode(input.value);
  if (devices === null) {
    showError('That doesn’t look like a code. It starts with RFX1, like “RFX1 8086:46a6 10de:1c03”.');
    return;
  }
  let result;
  try {
    result = RedFoxGpu.recommend(await loadRules(), devices);
  } catch {
    showError('Couldn’t load the rules from GitHub. Check the connection and try again.');
    return;
  }

  showAll();
  if (result.image) {
    images.classList.add('picked');
    const card = images.querySelector(`[data-image="${result.image}"]`);
    card.classList.add('suggested');
    card.querySelector('.badge').hidden = false;
    images.prepend(card);
    verdictText.textContent = `${names[result.image]} suits this computer: it has ${result.why}.`;
  } else {
    verdictText.textContent = `We can’t tell which one suits this computer: it has ${result.why}. ` +
      'Pick the one for the graphics you want to use.';
  }
  hybridNote.hidden = !result.hybrid;
  verdict.hidden = false;
  choose.open = false;
  images.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// Back to all three, equal, in their usual order.
document.getElementById('different').addEventListener('click', () => {
  showAll();
  ['redfox-os', 'redfox-os-nvidia', 'redfox-os-nvidia-legacy'].forEach((id) =>
    images.append(images.querySelector(`[data-image="${id}"]`)));
  input.value = '';
  choose.open = true;
  input.focus();
});
