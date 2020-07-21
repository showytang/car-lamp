<template>
	<view class="content">
		
		<cl-card label="蓝牙设置">
			<cl-button @tap="searchBle" type="primary">
				<text>连接</text>
				<text class="cl-icon-arrow-right"></text>
			</cl-button>
		</cl-card>
		<!-- 		<cl-card label="颜色选择">
			<cl-row gutter="20">
				<cl-col span="2" :key="item" v-for="item in defaultColorList">
					<div class="badeg" :style="'background-color:'+item"></div>
				</cl-col>
			</cl-row>
		</cl-card> -->
		<cl-card label="线路选择">
			<picker-color :defaultColor="defaultColor" :isShow.sync="showPickerColor" :bottom="bottomPickerColor" @callback='getPickerColor' />
			<div class="line-select" :key="index" v-for="item,index in lineData">
				<cl-row>
					<cl-col span="22">
						<cl-row gutter="20">
							<template v-if="index==0">
								<cl-col span="6" @tap="editNameHandler" style="font-size:28rpx">{{editName}}：</cl-col>
							</template>
							<template v-else>
								<cl-col span="6" style="font-size:28rpx">线路{{index+1}}：</cl-col>
							</template>
							<cl-col span="2" :key="color" v-for="color,cindex in item.colors">
								<div class="badeg current_color_active" @tap="showPickerColorPop(index,cindex)" :style="'background-color:'+color"></div>
							</cl-col>
						</cl-row>
						<cl-row gutter="20">
							<cl-col style="font-size:28rpx" @tap="nextPage" span="6">灯光{{index+1}}：</cl-col>
							<cl-col span="14">
								<cl-slider v-model="item.value"></cl-slider>
							</cl-col>
						</cl-row>
					</cl-col>
					<cl-col v-if="index==0" span="2" style="text-align:right;">
						<icon @tap="nextPage" style="font-weight: 900;margin-top:-15rpx;" type="compose" size="25" color="#0099ff"></icon>
					</cl-col>
				</cl-row>
			</div>
		</cl-card>
		<cl-dialog :visible.sync="editNameVisible">
			<cl-card label="线路名称">
				<cl-input v-model="editName"></cl-input>
			</cl-card>
		</cl-dialog>
	</view>
</template>

<script>
	import icon from '@/components/uni-icons/uni-icons.vue'
	import uniFab from '@/components/uni-fab/uni-fab.vue';
	import pickerColor from "@/components/helang-pickerColor/helang-pickerColor.vue"
	import ble from "@/static/js/ble.js"
	export default {
		data() {
			return {
				editNameVisible: false,
				editName: "线路1",
				defaultColor: null,
				currentLineIndex: null,
				currentLineColorIndex: null,
				buttonColor: "#0099FF",
				showPickerColor: false,
				bottomPickerColor: 0,
				defaultColors: ["#FF0000", "#336600", "#0000CC","#FFFF66", "#FF99FF", "#0099ff", "#FFFFFF"],
				lineData: [{
						colors: ["#FF0000", "#336600", "#0000CC","#FFFF66", "#FF99FF", "#0099ff", "#FFFFFF"],
						value: 80
					}, {
						colors: ["#FF0000", "#336600", "#0000CC","#FFFF66", "#FF99FF", "#0099ff", "#FFFFFF"],
						value: 70
					}, {
						colors: ["#FF0000", "#336600", "#0000CC","#FFFF66", "#FF99FF", "#0099ff", "#FFFFFF"],
						value: 60
					},
					{
						colors: ["#FF0000", "#336600", "#0000CC","#FFFF66", "#FF99FF", "#0099ff", "#FFFFFF"],
						value: 60
					}, {
						colors: ["#FF0000", "#336600", "#0000CC","#FFFF66", "#FF99FF", "#0099ff", "#FFFFFF"],
						value: 60
					}
				]
			}
		},
		onShow() {
			uni.setNavigationBarTitle({
				title: this.$store.getters.getDevice.name
			});
		},
		onLoad() {
			var that = this;
			uni.getStorage({
				key: "editName",
				success(result) {
					that.editName = result.data;
				}
			})
			ble.adapter();
		},
		methods: {
			editNameHandler() {
				this.editNameVisible = true;
			},
			searchBle() {
				uni.navigateTo({
					url: '../ble/ble',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
			/* 显示获取颜色选择弹窗 */
			showPickerColorPop(index, cindex) {
				this.currentLineIndex = index;
				this.currentLineColorIndex = cindex;
				this.showPickerColor = true;
				this.defaultColor = this.lineData[index].colors[cindex];
			},
			/* 获取颜色选择回调 */
			getPickerColor(color) {
				/* 隐藏弹窗 */
				//this.showPickerColor = false;
				/* 判断颜色值是否有效 */
				if (color) {
					this.lineData[this.currentLineIndex].colors[this.currentLineColorIndex] = color;
					this.buttonColor = color;
					console.log('选择的颜色值是：' + color);
				}
			},
			confirm(e) {
				console.log('颜色选择器返回值：' + e)
			},
			nextPage() {
				uni.navigateTo({
					url: '../nextsecond/nextsecond',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			}
		},
		computed: {
			
		},

		watch: {
			editName(value) {
				uni.setStorage({
					key: "editName",
					data: value
				})
			}
		},
		components: {
			"picker-color": pickerColor,
			uniFab,
			icon
		}
	}
</script>

<style scoped>
	.badeg {
		width: 50rpx;
		height: 50rpx;
		border-radius: 10rpx;
	}

	.line-select cl-row:nth-child(even) .badeg image {
		background-color: darkgrey;
		width: 50rpx;
		height: 50rpx;
		border-radius: 10rpx;
	}

	.current_color_active {
		box-shadow: 0 0 2px #09f;
		transform: scale(1.05, 1.05);
	}
</style>
