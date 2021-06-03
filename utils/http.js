let http = {
	get(url, data, header) {


		if (!header) {
			header = {}
		}

		//#ifndef H5
		let cookie = uni.getStorageSync('cookie');
		header['Cookie'] = cookie;
		//#endif

		if (!header['Content-Type']) {
			header['Content-Type'] = 'application/x-www-form-urlencoded';
		}

		let promise = new Promise(function(resolve, reject) {
			uni.request({
				url: url,
				data: data,
				header: header
			}).then(
				(res) => {
					resolve(res[1])
				}
			).catch(
				(response) => {
					reject(response)
				}
			)
		})
		return promise;


	},
	post(url, data, header) {

		// uni.hideLoading();
		// uni.showLoading({
		// 	mask: true,
		// 	title: '正在加载...'
		// });

		if (!header) {
			header = {}
		}
		//#ifndef H5
		let cookie = uni.getStorageSync('cookie');

		header['Cookie'] = cookie;
		//#endif

		if (!header['Content-Type']) {
			header['Content-Type'] = 'application/x-www-form-urlencoded';
		}

		let promise = new Promise(function(resolve, reject) {
			uni.request({
				url: url,
				data: data,
				method: 'POST',
				header: header
			}).then(

				(res) => {

					console.log(url);
					// console.log(res[1]);

					if (res[1].data.status === 401) {

						let pages = getCurrentPages();
						let current = pages[pages.length - 1];
						if (current.route != 'pages/login/login') {
							uni.reLaunch({
								url: "/pages/login/login"
							});
						}

					}

					if (res[1].header['Set-Cookie']) {
						uni.setStorageSync('cookie', res[1].header['Set-Cookie']);
					}

					resolve(res[1])
					// uni.hideLoading()({});
				}
			).catch(
				(response) => {

					reject(response)
					// uni.hideLoading()({});
				}
			)
		})
		return promise;
	},
	postJson(url, data) {

		let promise = new Promise(function(resolve, reject) {
			uni.request({
				url: url,
				data: data,
				method: 'POST',
				header: {
					'content-type': 'application/json'
				}
			}).then(
				(res) => {
					resolve(res[1])

				}
			).catch(
				(response) => {
					reject(response)
				}
			)
		})
		return promise;
	}
}


export default http;
