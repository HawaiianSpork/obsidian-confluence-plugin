import { request } from 'https';

export interface UpdateRequest {
	url: string;
	text: string;
}

export const update = (opts: UpdateRequest): Promise<void> => {
	const postData = JSON.stringify({
		body: opts.text
	});

	const url = new URL(opts.url);

	const options = {
		hostname: url.hostname,
		path: url.pathname,
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Content-Length': Buffer.byteLength(postData)
		  }
		};


	return new Promise<void>((resolve, reject) => {
		const req = request(options, (res) => {
			console.log(`STATUS: ${res.statusCode}`);
			console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
			res.setEncoding('utf8');
			res.on('data', (chunk) => {
			  console.log(`BODY: ${chunk}`);
			});
			res.on('end', () => {
				resolve();
			});
		});
		
		req.on('error', (e) => {
			reject(`problem with request: ${e.message}`);
		 });
	});
};
