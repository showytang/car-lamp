<template>
	<view>
		<cl-card label="蓝牙设置">
			<cl-button @tap="startBluetoothDevicesDiscovery" :loading="newDeviceLoad" :disabled="searchLoad" type="primary" icon="cl-icon-search">
				<text>刷新</text>
			</cl-button>
			<cl-button @tap="stopBluetoothDevicesDiscovery" type="primary" icon="cl-icon-info-fill">
				<text>停止</text>
			</cl-button>
		</cl-card>
		<cl-card label="我的设备">
			<cl-list @tap="createBLEConnection(item)" justify="start" :label="item.name" v-for="item,index in getOldDevices"
			 :key="index">
				<text @tap="openPop(item)" slot="append" style="color:#0099FF" class="cl-icon-arrow-right"></text>
			</cl-list>
		</cl-card>
		<cl-card label="其它设备">
			<cl-list @tap="createBLEConnection(item)" justify="start" :label="item.name" v-for="item,index in list" :key="index">
				<text @tap="openPop(item)" slot="append" style="color:#0099FF" class="cl-icon-arrow-right"></text>
			</cl-list>
		</cl-card>

		<cl-popup :visible.sync="pop_visible" direction="bottom">
			<cl-card label="蓝牙信息">
				<cl-list label="设备编号">
					<text>{{bleInfo.deviceId}}</text>
				</cl-list>
				<cl-list label="信号强度">
					<text>{{bleInfo.RSSI}}</text>
				</cl-list>
			</cl-card>
		</cl-popup>
	</view>
</template>

<script>
	import ble from '@/static/js/ble.js'
	export default {
		data() {
			return {
				pop_visible: false,
				newDeviceLoad: false,
				searchLoad: false,
				adapterState: {
					discovering: false, //是否正在扫描
					available: false //是否设备正常
				},
				list: [],
				bleInfo: {}
			}
		},
		computed: {
			getOldDevices() {
				return this.$store.getters.getOldDevices;
			}
		},
		methods: {
			openPop(item) {
				this.pop_visible = true;
				this.bleInfo = item;
			},
			startBluetoothDevicesDiscovery() {
				this.list = [];
				this.searchLoad = true;
				this.newDeviceLoad = true;
				var that = this;
				uni.startBluetoothDevicesDiscovery({
					success: e => {
						this.onBluetoothDeviceFound();
					},
					fail: e => {}
				});
				setTimeout(function() {
					that.stopBluetoothDevicesDiscovery();
				}, 1000 * 30)
			},
			onBluetoothDeviceFound() {
				uni.onBluetoothDeviceFound(devices => {
					this.getBluetoothDevices();
				});
			},
			getBluetoothDevices() {
				uni.getBluetoothDevices({
					success: res => {
						var oldDevices = this.$store.getters.getOldDevices;
						this.list = res.devices.filter(item => item.name != "未知设备" && !(oldDevices.some(old => old.name == item.name)));
					},
					fail: e => {}
				});
			},
			stopBluetoothDevicesDiscovery() {
				var that = this;
				ble.stop(function(){
					that.newDeviceLoad = false;
					that.searchLoad = false;
				})
			},
			/**
			 * 连接低功耗蓝牙
			 */
			createBLEConnection(item) {
				var that = this;
				uni.showToast({
					title: '连接蓝牙...',
					icon: 'loading',
					duration: 99999
				});
				ble.connection(item,function(){
					uni.hideToast();
					uni.showToast({
						title: '连接成功',
						icon: 'success',
						duration: 2000
					});
					that.stopBluetoothDevicesDiscovery();
					ble.read();
				})
			}
			
		},
		onShow() {
			uni.setNavigationBarTitle({
				title: this.$store.getters.getDevice.name
			});
		},
		onLoad() {
			var that = this;
			if (!this.$store.getters.getDevice.deviceId) {
				that.startBluetoothDevicesDiscovery();
			}

		}
	}
</script>

<style>
</style>
