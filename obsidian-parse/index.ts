import { createSecureContext } from "tls";

export const removeYaml = (text: string) => {
	const result = text.split('\n').reduce((previous, current) => {
		if (current === '---') {
			previous.inYaml = !previous.inYaml;
		} else if (!previous.inYaml) {
			previous.nonYamlLines.push(current);
		}
		return previous;
	}, {inYaml: false, nonYamlLines: []});
	return result.nonYamlLines.join('\n');
};

export const extractYaml = (text: string): string => {
	const result = text.split('\n').reduce((previous, current) => {
		if (current === '---') {
			previous.inYaml = !previous.inYaml;
		} else if (previous.inYaml) {
			previous.yamlLines.push(current);
		}
		return previous;
	}, {inYaml: false, yamlLines: []});
	return result.yamlLines.join('\n');
};

// // Should replace with actual YAML parser
// export const yamlToObject = (yaml: string) => {
// 	const results = yaml.split(/[\n\r]/).reduce((previous, current) => {
// 		if (current.indexOf(':') !== -1) {
// 			const [left, right] = current.split(':');
// 			previous.newObject[left] = right.trim();
// 		}
// 		return previous;
// 	}, {newObject: {}});
// 	return results.newObject;
// }
