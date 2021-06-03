<template>
	<view class="login-content">
		<image mode="scaleToFill" class="head-img" src="/static/img/bg_9.png"></image>
		<cover-view class="login-title-box">
			<cover-view class="login-title">
				手机快捷登录
			</cover-view>
			<cover-view class="login-subtitle">
				Mobile phone login
			</cover-view>
		</cover-view>
		<cover-view class="form-box">
			<form @submit="formSubmit" @reset="formReset">
				<cover-view class="uni-flex  uni-row form-item">
					<cover-view class="flex-item"><input class="uni-input form-item-input" placeholder-style="color:#999999" name="input"
						 placeholder="请输入手机号码" /></cover-view>
					<cover-view class="flex-item form-item-label">获取验证码</cover-view>
					
				</cover-view>
				<cover-view class="form-item-border"></cover-view>
					<cover-view class="uni-flex  uni-row form-item">
						<cover-view class="flex-item"><input class="uni-input form-item-input" placeholder-style="color:#999999" name="input"
							 placeholder="请输入验证码" /></cover-view>
					</cover-view>
		
				<cover-view class="form-item-border"></cover-view>
				<cover-image class="uni-flex  uni-row form-login-bg" src="/static/img/login_bg.png"></cover-image>
			</form>
		</cover-view>
		<view class="content-bg">
			<button class="login-button" type="warn">登录</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss">
.login-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		font-size: 28rpx;
		color: #282828;



		.building-select-box {
			height: 518rpx;
			width: 100%;
		}

		.color999 {
			color: #999999;
		}

		.color28 {
			color: #282828;
		}

		.colorDE1111 {
			color: #DE1111;
		}

		.content-bg {
			background-color: #EDF1F5;
			width: 100%;

			.login-button {
				margin: 580rpx 24rpx 310rpx 24rpx;
				background-color: #DE1111;
				font-size: 36rpx;
				border-radius: 6px;
				width: 702rpx;
				height: 98rpx;
			}
		}

		.head-img {
			width: 750rpx;
			height: 460rpx;
		}

		.form-box {
			display: flex;
			background-color: #FFFFFF;
			position: absolute;
			top: 320rpx;
			font-size: 32rpx;
			line-height: 40rpx;
			padding: 0 40rpx;
			color: #666666;

			.form-item {
				padding: 40rpx 0;
				display: flex;

				.form-item-label {
					width: 256rpx;
					text-align: right;
					color: #D51111;
				}

				.form-item-input {
					text-align: left;
					height: 40rpx;
				}


			}

			.form-login-bg {
				height: 346rpx;
				width: 622rpx;
			}

			.form-item-border {
				width: 100%;
				height: 2rpx;
				background-color: #EAEAEA;
			}

		}

		.login-title-box {
			position: absolute;
			top: 100rpx;
			left: 24rpx;
			text-align: left;
			color: #FFFFFF;

			.login-title {
				font-size: 46rpx;
				margin-bottom: 10rpx;
			}

			.login-subtitle {
				font-size: 36rpx;
				color: rgba(255, 255, 255, 0.5);
			}
		}
	}
</style>
