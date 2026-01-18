import fetch from 'node-fetch';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO = 'cooldadpresident/pepioli';
const EDITOR_PASSWORD = process.env.EDITOR_PASSWORD || 'changeme123';

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST' },
    };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  try {
    const body = JSON.parse(event.body);
    const { password, contentType, title, date, description, content } = body;

    // Verify password
    if (password !== EDITOR_PASSWORD) {
      return { statusCode: 401, body: JSON.stringify({ error: 'Invalid password' }) };
    }

    // Build file path and name
    let fileName, filePath;
    if (contentType === 'blog') {
      fileName = `${date}-${title.toLowerCase().replace(/\s+/g, '-')}.md`;
      filePath = `src/content/blog/${fileName}`;
    } else if (contentType === 'recipes') {
      fileName = `${title.toLowerCase().replace(/\s+/g, '-')}.md`;
      filePath = `src/content/recipes/${fileName}`;
    } else if (contentType === 'projects') {
      fileName = `${title.toLowerCase().replace(/\s+/g, '-')}.md`;
      filePath = `src/content/projects/${fileName}`;
    }

    // Build file content with frontmatter
    const fileContent = `---
title: "${title}"
pubDate: "${date}"
description: "${description}"
author: "Josefína Povejšilová"
---

${content}`;

    // Encode content in base64
    const encodedContent = Buffer.from(fileContent).toString('base64');

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
      }
    } catch (e) {
      // File doesn't exist, that's fine
    }

    // Commit to GitHub
    const commitPayload = {
      message: `Add/Update: ${title}`,
      content: encodedContent,
      branch: 'main',
    };
    if (sha) commitPayload.sha = sha;

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

    if (!commitResp.ok) {
      const error = await commitResp.json();
      return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Content published! Site updates in ~30 seconds.' }),
    };
  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
}
