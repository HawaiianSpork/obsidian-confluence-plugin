import type { Converter } from 'showdown';
import { removeYaml } from '../obsidian-parse';

export const obsidian = () => {
	const removeYamlExt = {
		type: 'lang',
		filter: (text: string, converter: Converter): string => {
			return removeYaml(text);
		} 
	};

	const links = {
		type: 'lang',
		regex: /\[\[([\w ]+)\]\]/g,
		// TODO look at subpage
		replace: '<ac:link><ri:page ri:content-title=\"$1\" /></ac:link>'
	}

	return [removeYamlExt, links];
  }

