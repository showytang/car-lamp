<script>
	export default {
		onLaunch: function() {
			this.init();
		},
		onShow: function() {

		},
		onHide: function() {},
		methods: {
			init() {
				uni.getStorage({
					key: "version",
					fail() {
						uni.clearStorage();
						uni.setStorage({
							key: "version",
							data: "1.0"
						})
					}
				})
				var that = this;
				uni.getStorage({
					key: "sendMsg",
					success(result) {
						var data = result.data.split(",");
						console.log("获取到历史发送协议：" + data)
						that.$store.commit("setData", data)
					}
				})
				uni.getStorage({
					key: "models",
					success(result) {
						var data = JSON.parse(result.data)
						that.$store.commit("setModels", data)
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "./cool/ui/static/css/index.scss";
</style>
