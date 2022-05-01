import {createLogUpdate} from 'log-update';

export default class ProgressBar {
	constructor(size = 100, progress = 0) {
		this.size = size;
		this.progress = progress;
		this.log = createLogUpdate(process.stdout);
	}

	start() {
		this.progress = 0;
		this.render();
	}

	update(progress) {
		this.progress = progress;
		this.render();
	}

	render() {
		const progressPercent = Math.round(this.progress / this.size * 100);
		const remainingPercent = 100 - progressPercent;
		this.log(`[${'='.repeat(progressPercent)}${' '.repeat(remainingPercent)}] ${progressPercent}%`);
	}

	end() {
		this.log.clear();
	}
}
