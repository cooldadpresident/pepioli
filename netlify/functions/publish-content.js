const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO = 'cooldadpresident/pepioli';

export async function handler(event) {
  console.log('=== FUNCTION CALLED ===');
  console.log('Event body:', event.body);
  console.log('GITHUB_TOKEN exists:', !!GITHUB_TOKEN);
  
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST' },
    };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const body = JSON.parse(event.body);
    console.log('Parsed body:', body);
    
    const { contentType, title, date, description, content } = body;

    // Validate required fields
    if (!contentType || !title || !date || !description || !content) {
      console.log('Missing fields:', { contentType, title, date, description, content: content?.substring(0, 20) });
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing required fields' }) };
    }

    // Build file path and name
    let fileName, filePath;
    const dateStr = date.replace(/-/g, '-'); // Ensure date format YYYY-MM-DD
    
    if (contentType === 'blog') {
      fileName = `${dateStr}-${title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}.md`;
      filePath = `src/content/blog/${fileName}`;
    } else if (contentType === 'recipes') {
      fileName = `${title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}.md`;
      filePath = `src/content/recipes/${fileName}`;
    } else if (contentType === 'projects') {
      fileName = `${title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}.md`;
      filePath = `src/content/projects/${fileName}`;
    } else {
      return { statusCode: 400, body: JSON.stringify({ error: 'Invalid content type' }) };
    }

    console.log('File path:', filePath);

    // Build file content with frontmatter
    const fileContent = `---
title: "${title.replace(/"/g, '\\"')}"
pubDate: "${dateStr}"
description: "${description.replace(/"/g, '\\"')}"
author: "Josefína Povejšilová"
---

${content}`;

    // Encode content in base64
    const encodedContent = Buffer.from(fileContent).toString('base64');
    console.log('Content encoded, length:', encodedContent.length);

    // Get current file to check if it exists
    let sha = null;
    try {
      const getResp = await fetch(
        `https://api.github.com/repos/${REPO}/contents/${filePath}`,
        { headers: { Authorization: `token ${GITHUB_TOKEN}` } }
      );
      if (getResp.ok) {
        const existing = await getResp.json();
        sha = existing.sha;
        console.log('File exists, sha:', sha);
      }
    } catch (e) {
      console.log('File check error (ok if new file):', e.message);
    }

    // Commit to GitHub
    const commitPayload = {
      message: `Add/Update: ${title}`,
      content: encodedContent,
      branch: 'main',
    };
    if (sha) commitPayload.sha = sha;

    console.log('Committing to GitHub...');
    const commitResp = await fetch(
      `https://api.github.com/repos/${REPO}/contents/${filePath}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commitPayload),
      }
    );

    console.log('GitHub response status:', commitResp.status);
    const respText = await commitResp.text();
    console.log('GitHub response:', respText.substring(0, 200));

    if (!commitResp.ok) {
      let error;
      try {
        error = JSON.parse(respText);
      } catch {
        error = { message: respText };
      }
      console.log('GitHub error:', error);
      return { statusCode: 500, body: JSON.stringify({ error: error.message || 'GitHub API error' }) };
    }

    console.log('✅ Success!');
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Content published! Site updates in ~30 seconds.' }),
    };
  } catch (error) {
    console.error('❌ Caught error:', error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message || 'Unknown error' }) };
  }
}
