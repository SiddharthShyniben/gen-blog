import {ls} from './utils.js';
import {basename} from 'path';
import {readFileSync, writeFileSync, rmSync, mkdirSync} from 'fs';
import {unified} from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import {parse} from 'yaml';
import ejs from 'ejs';
import {runTwoSlash, renderCodeToHTML} from 'shiki-twoslash';
import remarkEmoji from 'remark-emoji';
import {visit} from 'unist-util-visit';
import nightOwl from './night-owl.js';
import shiki from 'shiki';
import remarkToc from 'remark-toc';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import {remarkMermaid} from 'remark-mermaidjs';
import retextSpell from 'retext-spell';
import retextPassive from 'retext-passive';
import retextReadability from 'retext-readability';
import retextSimplify from 'retext-simplify';
import dictionary from 'dictionary-en';
import rehypeSlug from 'rehype-slug';

const files = await ls('blog-posts/');
// const highlighter = await createShikiHighlighter({theme: nightOwl});
const highlighter = await shiki.getHighlighter({theme: nightOwl});

Promise
	.all(files.map(process))
	.then(files => writeMetaData(files.map(write)));

async function process(file) {
	const content = readFileSync(file, 'utf-8');

	let frontmatter = {};

	const rendered = await unified()
		.use(remarkParse)
		.use(remarkFrontmatter)
		.use(remarkGfm)
		.use(remarkEmoji)
		.use(remarkMermaid, {theme: 'dark'})
		.use(retextSpell, dictionary)
		.use(retextPassive)
		.use(retextReadability)
		.use(retextSimplify)
		.use(() => tree => {
			tree.children.forEach(node => {
				if (node.type === 'yaml') {
					frontmatter = parse(node.value);
				}
			});
		})
		.use(() => tree => {
			visit(tree, 'code', node => {
				const code = node.value;
				if (node.meta === 'twoslash') {
					const twoslash = runTwoSlash(code, 'ts', {})
					const html = renderCodeToHTML(twoslash.code, 'ts', {twoslash: true}, {}, highlighter, twoslash);

					node.value = html;
				} else {
					try {
						node.value = highlighter.codeToHtml(code, {lang: node.lang});
					} catch (e) {
						console.log(`Could not highlight ${node.lang} for ${node.value}`);
						node.value = code;
					}
				}

				node.type = 'html';
				node.children = [];
			})
		})
		.use(remarkToc, {tight: true, ordered: true})
		.use(remarkRehype, {allowDangerousHtml: true})
		.use(rehypeSlug)
		.use(rehypeAutolinkHeadings)
		.use(rehypeStringify, {allowDangerousHtml: true})
		.process(content);

	let slug = (frontmatter?.slug ?? basename(file, '.md'));

	if (frontmatter?.date) frontmatter.date = new Date(frontmatter.date).getTime();

	frontmatter.date ??= new Date().getTime();
	frontmatter.tags ??= [];

	return {
		slug,
		content: String(rendered),
		frontmatter
	};
}

rmSync('out', {recursive: true, force: true})
mkdirSync('out')
function write(data) {
	const {slug, content, frontmatter} = data;
	try {
		mkdirSync(`./public/${slug}`);
	} catch {}

	writeFileSync(`./public/${slug}/index.html`, ejs.render(`
		<!DOCTYPE html>
		<html lang="en">
		<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>${frontmatter?.title}</title>

		<link rel='stylesheet' href='../normalize.css'>
		<link rel='stylesheet' href='../base.css'>
		<link rel='stylesheet' href='../shiki.css'>
		</head>
		<body>
		<header> ${/*TODO include?*/''}
		<h1>Sid's Blog</h1>
		</header>
		<hr class='top-divider'>
		${content}

		<hr class='top-divider'>
		<footer>
		<p>&copy; <%= new Date().getFullYear() %> <a
		href='https://siddu.tech'>Sid</a>. All blog post writing is licensed
		<a href='https://creativecommons.org/licenses/by-sa/4.0/'>CC
		BY-SA 4.0</a>. All source code is released to the public domain</p>
		</footer>
		</body>
		</html>
		`));
	return frontmatter;
}

function writeMetaData(posts) {
	writeFileSync('meta.json', JSON.stringify({posts}, null, '\t'))
}
