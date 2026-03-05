<template>
	<view class="container">
		<up-navbar title="Icon Test" safeAreaInsetTop fixed placeholder></up-navbar>
		<view class="section">
			<text class="title">1. Single-Color (Font Icons)</text>
			<view class="row">
				<up-icon name="close-circle" size="30" color="#333"></up-icon>
				<text>close-circle (Local Font)</text>
			</view>
			<view class="row">
				<up-icon name="home" size="30" color="#2979ff"></up-icon>
				<text>home (Built-in Font)</text>
			</view>
		</view>
		
		<view class="section">
			<text class="title">2. Multi-Color (SVG Sprite / Image)</text>
			<view class="row">
				<up-icon name="success-color" size="30"></up-icon>
				<text>success-color (H5: Sprite, Native: Image)</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {}
	}
}
</script>

<style lang="scss" scoped>
.container {
	padding: 20px;
}
.section {
	margin-bottom: 30px;
}
.title {
	font-size: 18px;
	font-weight: bold;
	margin-bottom: 10px;
	display: block;
}
.row {
	display: flex;
	align-items: center;
	gap: 10px;
	margin-bottom: 10px;
}
</style>
