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

const files = await ls('blog-posts/');

Promise
	.all(files.map(process))
	.then(files => 
		writeMetaData(files
			.map(write))
	);

async function process(file) {
	const content = readFileSync(file, 'utf-8');

	let frontmatter = null;

	const rendered = await unified()
		.use(remarkParse)
		.use(remarkFrontmatter)
		.use(() => tree => {
			tree.children.forEach(node => {
				if (node.type === 'yaml') {
					frontmatter = parse(node.value);
				}
			});
		})
		.use(remarkGfm)
		.use(remarkRehype)
		.use(rehypeStringify)
		.process(content);

	let slug = (frontmatter?.slug ?? basename(file, '.md')) + '.html';
	if (frontmatter.date) frontmatter.date = new Date(frontmatter.date).getTime();

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
	writeFileSync(`./out/${slug}`, content);
	return frontmatter;
}

function writeMetaData(posts) {
	writeFileSync('meta.json', JSON.stringify({posts}, null, '\t'))
}
