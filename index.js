import {ls} from './utils.js';

import {basename} from 'path';
import {readFileSync, writeFileSync, rmSync, mkdirSync} from 'fs';

import {unified} from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkEmoji from 'remark-emoji';
import remarkToc from 'remark-toc';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import {remarkMermaid} from 'remark-mermaidjs';
import retextSpell from 'retext-spell';
import retextPassive from 'retext-passive';
import retextReadability from 'retext-readability';
import retextSimplify from 'retext-simplify';
import rehypeSlug from 'rehype-slug';

import {visit} from 'unist-util-visit';
import shiki from 'shiki';
import tokyonight from './tokyo-night-storm-color-theme.json' assert {type: 'json'};
import {runTwoSlash, renderCodeToHTML} from 'shiki-twoslash';

import dictionary from 'dictionary-en';
import {parse} from 'yaml';
import ejs from 'ejs';

const arrow = (depth = 0) => {
	const color = `\x1b[38;5;${depth + 9}m`;
	const reset = '\x1b[0m';
	return `${color}➜${reset}`;
}

console.log(arrow(), 'Building');

const highlighter = await shiki.getHighlighter({theme: tokyonight});

const files = await ls('blog-posts/');
console.log(' ' + arrow(1) + ' Found', files.length, 'posts');

const processed = [];

console.log(' ' + arrow(1) + ' Processing posts');
for (const file of files) {
	processed.push(await process(file));
}
console.log(' ' + arrow(1) + ' Processed', processed.length, 'posts');

const posts = [];

console.log(' ' + arrow(1) + ' Writing posts');
for (const post of processed) {
	posts.push(await write(post));
}
console.log(' ' + arrow(1) + ' Wrote', posts.length, 'posts');
writeMetaData(posts);
console.log('' + arrow() + ' Done');

async function process(file) {
	const fname = basename(file, '.md');
	const start = Date.now();
	console.log('  ' + arrow(2) + ' Processing', fname);
	const content = readFileSync(file, 'utf-8');

	let frontmatter = {};

	const log = message => () => () => console.log('   ' + arrow(3) + ' ' + message, fname);

	const rendered = await unified()
		.use(remarkParse)
		.use(log('Parsed'))
		.use(remarkFrontmatter)
		.use(log('Extracted frontmatter'))
		.use(remarkGfm)
		.use(log('Converted to Gfm'))
		.use(remarkEmoji)
		.use(log('Converted to Emoji'))
		.use(remarkMermaid, {theme: 'dark'})
		.use(log('Parsed Mermaid'))
		.use(retextSpell, dictionary)
		.use(log('Spell checked'))
		.use(retextPassive)
		.use(log('Passive checked'))
		.use(retextReadability)
		.use(log('Readability checked'))
		.use(retextSimplify)
		.use(log('Simplified'))
		.use(() => tree => {
			tree.children.forEach(node => {
				if (node.type === 'yaml') {
					frontmatter = parse(node.value);
				}
			});
		})
		.use(log('Extracted frontmatter ' + JSON.stringify(frontmatter)))
		.use(() => tree => {
			visit(tree, 'code', node => {
				const code = node.value;
				if (node.meta === 'twoslash') {
					const twoslash = runTwoSlash(code, 'ts', {})
					let highlight = {};
					if (twoslash.highlights) {
						twoslash.highlights.forEach(({line}) => {
							highlight[line + 1] = true;
						});
					}
					const html = renderCodeToHTML(twoslash.code, 'ts', {twoslash: true, highlight}, {}, highlighter, twoslash);

					node.value = html;
				} else {
					try {
						node.value = highlighter.codeToHtml(code, {lang: node.lang});
					} catch (e) {
						console.log(`Could not highlight ${node.lang} for ${node.value}`);
						node.value = code;
					}
				}

				node.value = node.value.replaceAll('border-bottom: solid 2px lightgrey', 'border-bottom: solid 2px #3d59a1');

				node.type = 'html';
				node.children = [];
			})
		})
		.use(log('Highlighted code'))
		.use(remarkToc, {tight: true, ordered: true})
		.use(log('Generated table of contents'))
		.use(remarkRehype, {allowDangerousHtml: true})
		.use(log('Converted to HTML'))
		.use(rehypeSlug)
		.use(log('Generated heading ids'))
		.use(rehypeAutolinkHeadings)
		.use(log('Autolinked headings'))
		.use(rehypeStringify, {allowDangerousHtml: true})
		.use(log('Stringified'))
		.process(content);

	log('Rendered')()();

	let slug = (frontmatter?.slug ?? basename(file, '.md'));

	if (frontmatter?.date) frontmatter.date = new Date(frontmatter.date).getTime();

	frontmatter.date ??= new Date().getTime();
	frontmatter.tags ??= [];

	console.log('  ' + arrow(2) + ' Rendered', file, 'in', Date.now() - start, 'ms');

	return {
		slug,
		content: String(rendered),
		frontmatter,
		tags: frontmatter.tags
	};
}

rmSync('out', {recursive: true, force: true})
mkdirSync('out')
async function write(data) {
	const {slug, content, frontmatter} = data;
	try {
		mkdirSync(`./public/${slug}`);
	} catch {}

	const out = await ejs.renderFile('source/post.ejs', {title: frontmatter?.title, content});

	writeFileSync(`./public/${slug}/index.html`, out);
	console.log('  ' + arrow(2) + ' Wrote', `./public/${slug}/index.html`);
	return frontmatter;
}

function writeMetaData(posts) {
	writeFileSync('meta.json', JSON.stringify({posts}, null, '\t'))
	console.log(' ' + arrow(1) + ' Wrote', 'meta.json');
}
