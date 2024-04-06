#!/usr/bin/env zx

const path = process.argv[3];

const data = JSON.parse(require('fs').readFileSync(path, 'utf8'));

data.forEach(post => {
	require('fs').writeFileSync(
		`${post.published ? 'published' : 'drafts'}/${post.slug}.md`, 
		`---
social_image: ${post.social_image}
main_image: ${post.main_image}
tags: ${post.cached_tag_list}
published_at: ${post.published_at}
---

# ${post.title}

${post.body_markdown}`)

	console.log(`Wrote post \`${post.title}\``);
});

console.log('Done!');
