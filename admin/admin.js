// GitHub Configuration
const GITHUB_OWNER = 'cooldadpresident';
const GITHUB_REPO = 'pepioli';
const GITHUB_BRANCH = 'main';

let githubToken = null;
let currentEditingFile = null;

// ---------- Auth ----------
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const token = document.getElementById('githubToken').value;
  try {
    const response = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}`, {
      headers: { 'Authorization': `token ${token}`, 'Accept': 'application/vnd.github.v3+json' }
    });
    if (response.ok) {
      githubToken = token;
      localStorage.setItem('githubToken', token);
      showAdminScreen();
      loadAllContent();
    } else {
      showAlert('Neplatný GitHub token', 'error');
    }
  } catch (error) {
    showAlert('Chyba při ověřování tokenu', 'error');
  }
});

function showAdminScreen() {
  document.querySelector('.login-screen').classList.remove('active');
  document.querySelector('.admin-screen').classList.add('active');
}

function logout() {
  githubToken = null;
  localStorage.removeItem('githubToken');
  document.querySelector('.login-screen').classList.add('active');
  document.querySelector('.admin-screen').classList.remove('active');
}

window.addEventListener('load', () => {
  const savedToken = localStorage.getItem('githubToken');
  if (savedToken) {
    githubToken = savedToken;
    showAdminScreen();
    loadAllContent();
  }
});

// ---------- Tabs / editor ----------
function switchTab(tabName, ev) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  if (ev && ev.target) ev.target.classList.add('active');
  document.getElementById(tabName).classList.add('active');
}

function showEditor(type) {
  document.getElementById(`${type}Editor`).classList.remove('hidden');
  currentEditingFile = null;
}

function hideEditor(type) {
  document.getElementById(`${type}Editor`).classList.add('hidden');
  document.getElementById(`${type}Form`).reset();
  const prev = document.getElementById(`${type}ImagePreview`);
  if (prev) prev.classList.remove('show');
  currentEditingFile = null;
}

function showAlert(message, type = 'success') {
  const c = document.getElementById('alertContainer');
  const alert = document.createElement('div');
  alert.className = `alert alert-${type}`;
  alert.textContent = message;
  c.appendChild(alert);
  window.scrollTo({ top: 0, behavior: 'smooth' });
  setTimeout(() => alert.remove(), 5000);
}

// ---------- GitHub API ----------
async function githubAPI(endpoint, method = 'GET', body = null) {
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/${endpoint}`;
  const options = {
    method,
    headers: {
      'Authorization': `token ${githubToken}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    }
  };
  if (body) options.body = JSON.stringify(body);
  const response = await fetch(url, options);
  if (!response.ok) {
    let detail = response.statusText;
    try { const j = await response.json(); if (j.message) detail = j.message; } catch (_) {}
    throw new Error(detail);
  }
  return response.json();
}

// ---------- Load content ----------
async function loadContent(type) {
  try {
    const files = await githubAPI(`contents/_${type}?ref=${GITHUB_BRANCH}`);
    const listElement = document.getElementById(`${type}List`);
    listElement.innerHTML = '';

    const mdFiles = files.filter(f => f.name.endsWith('.md')).sort((a, b) => b.name.localeCompare(a.name));

    for (const file of mdFiles) {
      const content = await githubAPI(`contents/${file.path}?ref=${GITHUB_BRANCH}`);
      const markdown = decodeB64(content.content);
      const fm = parseFrontmatter(markdown);

      const item = document.createElement('div');
      item.className = 'post-item';
      const safeTitle = (fm.title || file.name).replace(/'/g, "\\'");
      item.innerHTML = `
        <div class="post-info">
          <h3>${escapeHtml(fm.title || file.name)}</h3>
          <div class="post-meta">
            ${fm.date ? `📅 ${escapeHtml(fm.date)}` : ''}
            ${fm.description ? ` • ${escapeHtml(fm.description.substring(0, 90))}${fm.description.length > 90 ? '…' : ''}` : ''}
          </div>
        </div>
        <div class="post-actions">
          <button class="btn-secondary" onclick="editPost('${type}', '${file.path}')">✏️ Upravit</button>
          <button class="btn-danger" onclick="deletePost('${type}', '${file.path}', '${safeTitle}')">🗑️ Smazat</button>
        </div>`;
      listElement.appendChild(item);
    }
    if (!mdFiles.length) listElement.innerHTML = '<div class="post-item"><div class="post-info"><h3>Zatím žádný obsah</h3></div></div>';
  } catch (error) {
    console.error(error);
    showAlert(`Chyba při načítání: ${error.message}`, 'error');
  }
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const fm = {};
  match[1].split('\n').forEach(line => {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length) {
      fm[key.trim()] = valueParts.join(':').trim().replace(/^["']|["']$/g, '');
    }
  });
  return fm;
}

function loadAllContent() {
  loadContent('blog');
  loadContent('recipes');
  loadContent('projects');
}

// ---------- Edit ----------
async function editPost(type, path) {
  try {
    const content = await githubAPI(`contents/${path}?ref=${GITHUB_BRANCH}`);
    const markdown = decodeB64(content.content);
    const fm = parseFrontmatter(markdown);
    const body = markdown.replace(/^---\n[\s\S]*?\n---\n?/, '');

    currentEditingFile = { path, sha: content.sha };

    document.getElementById(`${type}Title`).value = fm.title || '';
    if (type === 'blog') {
      document.getElementById('blogDate').value = fm.date || '';
      document.getElementById('blogAuthor').value = fm.author || '';
    }
    document.getElementById(`${type}Description`).value = fm.description || '';
    const imgField = document.getElementById(`${type}Image`);
    if (imgField) { imgField.value = fm.image || ''; setCoverPreview(type, fm.image || ''); }
    document.getElementById(`${type}Content`).value = body.trim();

    showEditor(type);
    document.getElementById(`${type}Editor`).scrollIntoView({ behavior: 'smooth' });
  } catch (error) {
    showAlert(`Chyba při načítání: ${error.message}`, 'error');
  }
}

// ---------- Delete ----------
async function deletePost(type, path, title) {
  if (!confirm(`Opravdu chcete smazat "${title}"?`)) return;
  try {
    const content = await githubAPI(`contents/${path}?ref=${GITHUB_BRANCH}`);
    await githubAPI(`contents/${path}`, 'DELETE', { message: `Delete ${title}`, sha: content.sha, branch: GITHUB_BRANCH });
    showAlert('Příspěvek byl smazán');
    loadContent(type);
  } catch (error) {
    showAlert(`Chyba při mazání: ${error.message}`, 'error');
  }
}

// ---------- Save ----------
function yamlStr(v) {
  return '"' + String(v).replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"';
}

async function savePost(type, data) {
  try {
    const slug = data.title.toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '') // strip diacritics
      .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    let filename, fmLines = [];
    fmLines.push(`title: ${yamlStr(data.title)}`);
    if (type === 'blog') {
      filename = `${data.date}-${slug}.md`;
      fmLines.push(`date: ${data.date}`);
      if (data.author) fmLines.push(`author: ${yamlStr(data.author)}`);
    } else {
      filename = `${slug}.md`;
    }
    if (data.description) fmLines.push(`description: ${yamlStr(data.description)}`);
    if (data.image) fmLines.push(`image: ${yamlStr(data.image)}`);
    fmLines.push('layout: post');

    const fullContent = `---\n${fmLines.join('\n')}\n---\n\n${data.content}\n`;
    const encodedContent = encodeB64(fullContent);
    const path = currentEditingFile?.path || `_${type}/${filename}`;

    const body = {
      message: currentEditingFile ? `Update ${data.title}` : `Add ${data.title}`,
      content: encodedContent,
      branch: GITHUB_BRANCH
    };
    if (currentEditingFile) body.sha = currentEditingFile.sha;

    await githubAPI(`contents/${path}`, 'PUT', body);
    showAlert(currentEditingFile ? 'Příspěvek byl aktualizován ✅' : 'Příspěvek byl vytvořen ✅');
    hideEditor(type);
    loadContent(type);
  } catch (error) {
    showAlert(`Chyba při ukládání: ${error.message}`, 'error');
  }
}

// ---------- Image upload ----------
function fileToB64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function sanitizeName(name) {
  const dot = name.lastIndexOf('.');
  const base = (dot > -1 ? name.slice(0, dot) : name)
    .toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'obrazek';
  const ext = (dot > -1 ? name.slice(dot + 1) : 'png').toLowerCase().replace(/[^a-z0-9]/g, '');
  const stamp = Date.now().toString(36);
  return `${stamp}-${base}.${ext}`;
}

async function uploadImageToRepo(file) {
  if (file.size > 8 * 1024 * 1024) throw new Error('Obrázek je příliš velký (max 8 MB)');
  const b64 = await fileToB64(file);
  const filename = sanitizeName(file.name);
  const path = `assets/images/${filename}`;
  await githubAPI(`contents/${path}`, 'PUT', {
    message: `Upload image ${filename}`,
    content: b64,
    branch: GITHUB_BRANCH
  });
  return `/${path}`; // site-root path; templates apply baseurl via relative_url
}

async function uploadCover(type, input) {
  const file = input.files[0];
  if (!file) return;
  const uploading = document.getElementById(`${type}Uploading`);
  try {
    if (uploading) uploading.classList.remove('hidden');
    const rel = await uploadImageToRepo(file);
    document.getElementById(`${type}Image`).value = rel;
    setCoverPreview(type, rel);
    showAlert('Titulní obrázek nahrán 🖼️');
  } catch (e) {
    showAlert(`Chyba při nahrávání: ${e.message}`, 'error');
  } finally {
    if (uploading) uploading.classList.add('hidden');
    input.value = '';
  }
}

async function uploadInline(type, input) {
  const file = input.files[0];
  if (!file) return;
  const uploading = document.getElementById(`${type}Uploading`);
  try {
    if (uploading) uploading.classList.remove('hidden');
    const rel = await uploadImageToRepo(file);
    // Liquid relative_url keeps the image correct under the site's baseurl
    const md = `\n\n![${file.name.replace(/\.[^.]+$/, '')}]({{ "${rel}" | relative_url }})\n\n`;
    insertAtCursor(document.getElementById(`${type}Content`), md);
    showAlert('Obrázek vložen do obsahu 🖼️');
  } catch (e) {
    showAlert(`Chyba při nahrávání: ${e.message}`, 'error');
  } finally {
    if (uploading) uploading.classList.add('hidden');
    input.value = '';
  }
}

function setCoverPreview(type, url) {
  const box = document.getElementById(`${type}ImagePreview`);
  if (!box) return;
  if (url) {
    // preview: strip leading slash so it resolves relative to the site when previewing local paths
    const src = url.includes('://') ? url : `..${url}`;
    box.querySelector('img').src = src;
    box.classList.add('show');
  } else {
    box.classList.remove('show');
  }
}

// live-preview when typing/pasting a cover URL
['blog', 'recipes', 'projects'].forEach(type => {
  const f = document.getElementById(`${type}Image`);
  if (f) f.addEventListener('input', () => setCoverPreview(type, f.value.trim()));
});

// ---------- Emoji picker ----------
const EMOJIS = ['🌸','🌷','🌺','🌻','🌼','🍀','🌿','🍃','🌱','🌹','💐','🍰','🍪','🍩','🍫','🍓','🍒','🧁','☕','🍵','📚','📝','✏️','📖','🎓','🎨','🖌️','🎉','✨','💗','💖','❤️','😊','😍','🥰','👍','🙌','🔥','⭐','🌟','💡','🚀','🏆','📅','📍','🔗','☀️','🌈'];

function toggleEmoji(type) {
  const toolbar = document.querySelector(`#${type}Editor .editor-toolbar`);
  let pop = toolbar.querySelector('.emoji-popover');
  if (pop) { pop.remove(); return; }
  pop = document.createElement('div');
  pop.className = 'emoji-popover';
  EMOJIS.forEach(e => {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = e;
    b.onclick = () => { insertAtCursor(document.getElementById(`${type}Content`), e); };
    pop.appendChild(b);
  });
  toolbar.appendChild(pop);
  const close = (ev) => {
    if (!pop.contains(ev.target) && !ev.target.closest('.tool-btn')) { pop.remove(); document.removeEventListener('click', close); }
  };
  setTimeout(() => document.addEventListener('click', close), 0);
}

function insertAtCursor(textarea, text) {
  const start = textarea.selectionStart ?? textarea.value.length;
  const end = textarea.selectionEnd ?? textarea.value.length;
  textarea.value = textarea.value.slice(0, start) + text + textarea.value.slice(end);
  const pos = start + text.length;
  textarea.focus();
  textarea.setSelectionRange(pos, pos);
}

// ---------- base64 (UTF-8 safe) ----------
function encodeB64(str) { return btoa(unescape(encodeURIComponent(str))); }
function decodeB64(b64) { return decodeURIComponent(escape(atob(b64.replace(/\n/g, '')))); }

// ---------- Form wiring ----------
document.getElementById('blogForm').addEventListener('submit', (e) => {
  e.preventDefault();
  savePost('blog', {
    title: document.getElementById('blogTitle').value.trim(),
    date: document.getElementById('blogDate').value,
    author: document.getElementById('blogAuthor').value.trim(),
    description: document.getElementById('blogDescription').value.trim(),
    image: document.getElementById('blogImage').value.trim(),
    content: document.getElementById('blogContent').value
  });
});

document.getElementById('recipesForm').addEventListener('submit', (e) => {
  e.preventDefault();
  savePost('recipes', {
    title: document.getElementById('recipesTitle').value.trim(),
    description: document.getElementById('recipesDescription').value.trim(),
    image: document.getElementById('recipesImage').value.trim(),
    content: document.getElementById('recipesContent').value
  });
});

document.getElementById('projectsForm').addEventListener('submit', (e) => {
  e.preventDefault();
  savePost('projects', {
    title: document.getElementById('projectsTitle').value.trim(),
    description: document.getElementById('projectsDescription').value.trim(),
    image: document.getElementById('projectsImage').value.trim(),
    content: document.getElementById('projectsContent').value
  });
});
