// GitHub Configuration
const GITHUB_OWNER = 'cooldadpresident';
const GITHUB_REPO = 'pepioli';
const GITHUB_BRANCH = 'main';

// Password (simple client-side auth - for real security, use proper backend)
const ADMIN_PASSWORD = 'pepioli2026'; // Change this!

let githubToken = null;
let currentEditingFile = null;

// Login handling
document.getElementById('loginForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const password = document.getElementById('loginPassword').value;
  const token = document.getElementById('githubToken').value;
  
  if (password === ADMIN_PASSWORD) {
    githubToken = token;
    localStorage.setItem('githubToken', token);
    showAdminScreen();
    loadAllContent();
  } else {
    showAlert('Nesprávné heslo', 'error');
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

// Check for saved token
window.addEventListener('load', () => {
  const savedToken = localStorage.getItem('githubToken');
  if (savedToken) {
    githubToken = savedToken;
    showAdminScreen();
    loadAllContent();
  }
});

// Tab switching
function switchTab(tabName) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  
  event.target.classList.add('active');
  document.getElementById(tabName).classList.add('active');
}

// Editor visibility
function showEditor(type) {
  document.getElementById(`${type}Editor`).classList.remove('hidden');
  currentEditingFile = null;
}

function hideEditor(type) {
  document.getElementById(`${type}Editor`).classList.add('hidden');
  document.getElementById(`${type}Form`).reset();
  currentEditingFile = null;
}

// Alert messages
function showAlert(message, type = 'success') {
  const alertContainer = document.getElementById('alertContainer');
  const alert = document.createElement('div');
  alert.className = `alert alert-${type}`;
  alert.textContent = message;
  alertContainer.appendChild(alert);
  
  setTimeout(() => alert.remove(), 5000);
}

// GitHub API calls
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
  
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.statusText}`);
  }
  
  return response.json();
}

// Load content from GitHub
async function loadContent(type) {
  try {
    const path = `_${type}`;
    const files = await githubAPI(`contents/${path}?ref=${GITHUB_BRANCH}`);
    
    const listElement = document.getElementById(`${type}List`);
    listElement.innerHTML = '';
    
    for (const file of files) {
      if (file.name.endsWith('.md')) {
        const content = await githubAPI(`contents/${file.path}?ref=${GITHUB_BRANCH}`);
        const markdown = atob(content.content);
        const frontmatter = parseFrontmatter(markdown);
        
        const item = document.createElement('div');
        item.className = 'post-item';
        item.innerHTML = `
          <div class="post-info">
            <h3>${frontmatter.title || file.name}</h3>
            <div class="post-meta">
              ${frontmatter.date ? `📅 ${frontmatter.date}` : ''}
              ${frontmatter.description ? ` • ${frontmatter.description.substring(0, 100)}...` : ''}
            </div>
          </div>
          <div class="post-actions">
            <button class="btn-primary" onclick="editPost('${type}', '${file.path}')">✏️ Upravit</button>
            <button class="btn-danger" onclick="deletePost('${type}', '${file.path}', '${frontmatter.title}')">🗑️ Smazat</button>
          </div>
        `;
        listElement.appendChild(item);
      }
    }
  } catch (error) {
    console.error('Error loading content:', error);
    showAlert(`Chyba při načítání: ${error.message}`, 'error');
  }
}

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  
  const frontmatter = {};
  match[1].split('\n').forEach(line => {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length) {
      frontmatter[key.trim()] = valueParts.join(':').trim().replace(/^["']|["']$/g, '');
    }
  });
  
  return frontmatter;
}

function loadAllContent() {
  loadContent('blog');
  loadContent('recipes');
  loadContent('projects');
}

// Edit post
async function editPost(type, path) {
  try {
    const content = await githubAPI(`contents/${path}?ref=${GITHUB_BRANCH}`);
    const markdown = atob(content.content);
    const frontmatter = parseFrontmatter(markdown);
    const body = markdown.replace(/^---\n[\s\S]*?\n---\n/, '');
    
    currentEditingFile = { path, sha: content.sha };
    
    document.getElementById(`${type}Title`).value = frontmatter.title || '';
    if (type === 'blog') {
      document.getElementById(`${type}Date`).value = frontmatter.date || '';
    }
    document.getElementById(`${type}Description`).value = frontmatter.description || '';
    document.getElementById(`${type}Content`).value = body.trim();
    
    showEditor(type);
  } catch (error) {
    showAlert(`Chyba při načítání: ${error.message}`, 'error');
  }
}

// Delete post
async function deletePost(type, path, title) {
  if (!confirm(`Opravdu chcete smazat "${title}"?`)) return;
  
  try {
    const content = await githubAPI(`contents/${path}?ref=${GITHUB_BRANCH}`);
    
    await githubAPI(`contents/${path}`, 'DELETE', {
      message: `Delete ${title}`,
      sha: content.sha,
      branch: GITHUB_BRANCH
    });
    
    showAlert('Příspěvek byl smazán');
    loadContent(type);
  } catch (error) {
    showAlert(`Chyba při mazání: ${error.message}`, 'error');
  }
}

// Save post
async function savePost(type, formData) {
  try {
    let filename;
    let frontmatter = {};
    
    if (type === 'blog') {
      const date = formData.get('date');
      const slug = formData.get('title').toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      filename = `${date}-${slug}.md`;
      frontmatter = {
        title: formData.get('title'),
        date: date,
        description: formData.get('description'),
        layout: 'post'
      };
    } else {
      const slug = formData.get('title').toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      filename = `${slug}.md`;
      frontmatter = {
        title: formData.get('title'),
        description: formData.get('description'),
        layout: 'post'
      };
    }
    
    const content = formData.get('content');
    
    // Build frontmatter
    let frontmatterString = '---\n';
    for (const [key, value] of Object.entries(frontmatter)) {
      if (value) {
        frontmatterString += `${key}: ${value}\n`;
      }
    }
    frontmatterString += '---\n\n';
    
    const fullContent = frontmatterString + content;
    const encodedContent = btoa(unescape(encodeURIComponent(fullContent)));
    
    const path = currentEditingFile?.path || `_${type}/${filename}`;
    
    const body = {
      message: currentEditingFile 
        ? `Update ${frontmatter.title}` 
        : `Add ${frontmatter.title}`,
      content: encodedContent,
      branch: GITHUB_BRANCH
    };
    
    if (currentEditingFile) {
      body.sha = currentEditingFile.sha;
    }
    
    await githubAPI(`contents/${path}`, 'PUT', body);
    
    showAlert(currentEditingFile ? 'Příspěvek byl aktualizován' : 'Příspěvek byl vytvořen');
    hideEditor(type);
    loadContent(type);
  } catch (error) {
    showAlert(`Chyba při ukládání: ${error.message}`, 'error');
  }
}

// Form submissions
document.getElementById('blogForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  formData.set('title', document.getElementById('blogTitle').value);
  formData.set('date', document.getElementById('blogDate').value);
  formData.set('description', document.getElementById('blogDescription').value);
  formData.set('content', document.getElementById('blogContent').value);
  savePost('blog', formData);
});

document.getElementById('recipesForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  formData.set('title', document.getElementById('recipesTitle').value);
  formData.set('description', document.getElementById('recipesDescription').value);
  formData.set('content', document.getElementById('recipesContent').value);
  savePost('recipes', formData);
});

document.getElementById('projectsForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  formData.set('title', document.getElementById('projectsTitle').value);
  formData.set('description', document.getElementById('projectsDescription').value);
  formData.set('content', document.getElementById('projectsContent').value);
  savePost('projects', formData);
});
