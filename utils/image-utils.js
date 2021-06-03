let utils = {

	cache: function(url, callback) {
		if (url) {

			let cacheSrc = uni.getStorageSync('CACHE_IMAGE_' + url);

			if (cacheSrc) {
				callback(cacheSrc);
			} else {
				uni.downloadFile({
					url: url, //仅为示例，并非真实的资源
					success: (res) => {
						console.log(res);
						if (res.statusCode === 200) {
							uni.saveFile({
								tempFilePath: res.tempFilePath,
								success(r) {
									console.log(r);

									uni.setStorageSync('CACHE_IMAGE_' + e, r.savedFilePath);
									callback(r.savedFilePath);

								}
							})
						}
					}
				});
			}

		}
	}

}


export default utils;
