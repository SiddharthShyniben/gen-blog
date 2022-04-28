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

const processed = await Promise.all(files.map(process));
const posts = await Promise.all(processed.map(write));
writeMetaData(posts);

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
	return frontmatter;
}

function writeMetaData(posts) {
	writeFileSync('meta.json', JSON.stringify({posts}, null, '\t'))
}
