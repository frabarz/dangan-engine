class FetchResponse
{
	constructor(src, request)
	{
		this.url = src;

		this.status = request.status;
		this.statusText = request.statusText;

		this.response = request.responseText || request.response;
	}

	text()
	{
		return Promise.resolve(this.response);
	}

	json()
	{
		return Promise.resolve(JSON.parse(this.response));
	}
}

export default {
	fetch: window.fetch.bind(window) || function(src, options) {
		options = options || {};

		return new Promise(function(resolve, reject) {
			let req = new XMLHttpRequest();
			req.open(options.method || 'GET', src, true);
			req.onload = function() {
				if (this.status > 199 && this.status < 299)
					resolve(new FetchResponse(this));
				else
					reject(new FetchResponse(this));
			}
			req.send();
		});
	},

	texture: function(src) {
		return new Promise(function(resolve) {
			let texture = new THREE.Texture(new Image);

			texture.image.onload = function () {
				texture.image.onload = null;
				resolve(texture);
			};

			texture.image.src = src;
		});
	},

	plaintext: function(src) {
		return this.fetch(src).then(function(response) {
			return response.text();
		});
	},

	json: function(src) {
		return this.fetch(src).then(function(response) {
			return response.json();
		});
	}

}