import {readdir} from 'fs/promises';
import {join} from 'path';

import {dirname} from 'path';
import {fileURLToPath} from 'url';

export const __dirname = dirname(fileURLToPath(import.meta.url));

export const ls = async folder => {
	const files = await readdir(join(__dirname, folder), {withFileTypes: true});
	return files
		.filter(file => !file.isDirectory())
		.map(file => join(__dirname, folder, file.name));
}
