import {ls} from './utils.js';
import {basename} from 'path';
import {readFileSync, writeFileSync} from 'fs';
import {unified} from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import {parse} from 'yaml';

const files = await ls('blog-posts/');

Promise.all(files.map(process)).then(files => files.forEach(write));

async function process(file) {
	const content = readFileSync(file, 'utf-8');
	const slug = basename(file, '.md') + '.html';

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

	return {
		slug,
		content: JSON.stringify(frontmatter, null, '\t') + '\n\n\n\n\n\n' + String(rendered)
	};
}

function write(data) {
	const {slug, content} = data;
	writeFileSync(`./out/${slug}`, content);
}
