import { request } from 'https';

export interface CreateRequest {
	token: string
	title: string
	host: string
	spaceKey: string
	text: string
}

export const create = (opts: CreateRequest): Promise<string> => {
	const postData = JSON.stringify({
		title: opts.title,
		type: "page",
		body: {
			storage: {
				value: opts.text,
				representation: 'storage'
			}
		},
		space: {
			key: opts.spaceKey
		}
	});

	const url = new URL(opts.host + '/rest/api/content/');

	const options = {
		hostname: url.hostname,
		path: url.pathname,
		method: 'POST',
		headers: {
			'Authorization': `Bearer ${opts.token}`,
			'Content-Type': 'application/json',
			'Content-Length': Buffer.byteLength(postData)
		  }
		};


	return new Promise<string>((resolve, reject) => {
		let body = '';
		const req = request(options, (res) => {
			res.setEncoding('utf8');
			res.on('data', (chunk) => {
				body = body + chunk;
			});
			res.on('end', () => {
				resolve(body);
			});
		});
		
		req.on('error', (e) => {
			reject(`problem with request: ${e.message}`);
		 });

		req.write(postData);
  		req.end();
	});
};

export interface UpdateRequest {
	token: string;
	title: string;
	version: number;
	host: string;
	pageId: string;
	text: string;
}

export const update = (opts: UpdateRequest): Promise<string> => {
	const postData = JSON.stringify({
		version: {
			number: opts.version
		},
		title: opts.title,
		type: "page",
		body: {
			storage: {
				value: opts.text,
				representation: 'storage'
			}
		}
	});

	const url = new URL(opts.host + "/rest/api/content/" + opts.pageId);

	const options = {
		hostname: url.hostname,
		path: url.pathname,
		method: 'PUT',
		headers: {
			'Authorization': `Bearer ${opts.token}`,
			'Content-Type': 'application/json',
			'Content-Length': Buffer.byteLength(postData)
		  }
		};


	return new Promise<string>((resolve, reject) => {
		const req = request(options, (res) => {
			let body = '';
			res.setEncoding('utf8');
			res.on('data', (chunk) => {
				body = body + chunk;
			});
			res.on('end', () => {
				resolve(body);
			});
		});
		
		req.on('error', (e) => {
			reject(`problem with request: ${e.message}`);
		 });

		req.write(postData);
  		req.end();
	});
};
