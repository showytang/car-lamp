import store from '@/store'
export default {
	device: store.getters.device,
	adapter() {
		var that = this;
		uni.openBluetoothAdapter({
			success: e => {
				that.stateChange();
			},
			fail: e => {
				console.log('初始化蓝牙失败，错误码：' + (e.errCode || e.errMsg));
				uni.showModal({
					title: "提示",
					content: "请先开启手机蓝牙",
					showCancel: false
				})
			}
		});
	},
	stateChange() {
		var that = this;
		uni.onBLEConnectionStateChange(res => {
			if (!res.connected) {
				if (store.getters.getDevice.deviceId) {
					console.log("正在重新连接......")
					that.connection(store.getters.getDevice, function() {
						read();
					});
				}
			}
		});
	},
	connection(device, callback) {
		var that = this;
		var deviceId = device.deviceId;
		uni.createBLEConnection({
			// 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
			deviceId,
			success: res => {
				store.commit("setData", null);
				if (deviceId == "77F8189B-E818-C754-EFC3-2B20B2523A8A") {
					device.serviceId = "0000FFE5-0000-1000-8000-00805F9A34FB";
				} else {
					device.serviceId = "0000FFE0-0000-1000-8000-00805F9B34FB";
				}
				store.commit("setDevice", device)
				uni.setNavigationBarTitle({
					title: device.name
				});
				that.device = device;
				that.service();
				callback();
			},
			fail: e => {}
		});
	},
	service() {
		var deviceId = this.device.deviceId;
		uni.getBLEDeviceServices({
			// 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
			deviceId,
			success: res => {
				this.characteristics();
			},
			fail: e => {}
		});
	},
	characteristics(serviceId) {
		var deviceId = this.device.deviceId;
		var serviceId = this.device.serviceId;
		uni.getBLEDeviceCharacteristics({
			deviceId,
			serviceId,
			success: res => {
				//that.read(deviceId);
			},
			fail: e => {}
		});
	},
	stop(callback) {
		uni.stopBluetoothDevicesDiscovery({
			success: e => {
				callback();
			},
			fail: e => {}
		});
	},
	writeBLECharacteristicValue(data) {
		var deviceId = this.device.deviceId;
		var serviceId = null;
		var characteristicId = null;
		if (deviceId == "77F8189B-E818-C754-EFC3-2B20B2523A8A") {
			serviceId = "0000FFE5-0000-1000-8000-00805F9A34FB";
			characteristicId = "0000FFE9-0000-1000-8000-00805F9A34FB";
		} else {
			serviceId = "0000FFE0-0000-1000-8000-00805F9B34FB";
			characteristicId = "0000FFE1-0000-1000-8000-00805F9B34FB";
		}
		var t = new Uint8Array(data.match(/[\da-f]{2}/gi).map(function(a) {
			return parseInt(a, 16);
		})).buffer;
		uni.writeBLECharacteristicValue({
			deviceId: deviceId,
			serviceId: serviceId,
			characteristicId: characteristicId,
			value: t,
			success: function(res) {
				console.log(res);
			},
			fail: function(res) {
				console.log(res);
			}
		})
	},
	write() {
		var that = this;
		var store_data = store.getters.getData;
		for (var i = 0; i < arguments.length; i++) {
			store_data[arguments[i].index] = arguments[i].data;
		}
		console.log("发送数据为：" + store_data.join(""))
		console.log(store_data.join("").length)
		if (that.device && that.device.deviceId) {
			store.commit("setData", store_data);
			that.writeBLECharacteristicValue(store_data.join(""))
		}

		uni.setStorage({
			key: "sendMsg",
			data: store_data.join(",")
		})
	},
	read() {
		this.notifyBLECharacteristicValueChange();
		this.readCallBack();
	},
	readCallBack() {
		var that = this;
		uni.onBLECharacteristicValueChange(function(characteristic) {
			let value = that.ab2hex2(characteristic.value);
			value = value.split(",");
			if(value[2]=="00"){
				store.commit("setISON",false);
			}else{
				store.commit("setISON",true);
			}
			store.commit("setRead",value)
		});
	},
	ab2hex2(buffer) {
	  var hexArr = Array.prototype.map.call(
	    new Uint8Array(buffer),
	    function (bit) {
	      return ('00' + bit.toString(16)).slice(-2)
	    }
		
	  )
	  return hexArr.join(',');
	},
	notifyBLECharacteristicValueChange() {
		var deviceId = this.device.deviceId;
		var serviceId = null;
		var characteristicId = null;
		var that = this;
		if (deviceId == "77F8189B-E818-C754-EFC3-2B20B2523A8A") {
			serviceId = "0000FFE5-0000-1000-8000-00805F9A34FB";
			characteristicId = "0000FFE4-0000-1000-8000-00805F9A34FB";
		} else {
			serviceId = "0000FFE0-0000-1000-8000-00805F9B34FB";
			characteristicId = "0000FFE1-0000-1000-8000-00805F9B34FB";
		}
		uni.notifyBLECharacteristicValueChange({
			state: true, // 启用 notify 功能
			// 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
			deviceId,
			// 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
			serviceId,
			// 这里的 characteristicId 需要在 getBLEDeviceCharacteristics 接口中获取
			characteristicId,
			success(res) {

			}
		});
	},
	bin_to_hex(str) {
		let hex_array = [{
				key: 0,
				val: "0000"
			}, {
				key: 1,
				val: "0001"
			}, {
				key: 2,
				val: "0010"
			}, {
				key: 3,
				val: "0011"
			}, {
				key: 4,
				val: "0100"
			}, {
				key: 5,
				val: "0101"
			}, {
				key: 6,
				val: "0110"
			}, {
				key: 7,
				val: "0111"
			},
			{
				key: 8,
				val: "1000"
			}, {
				key: 9,
				val: "1001"
			}, {
				key: 'a',
				val: "1010"
			}, {
				key: 'b',
				val: "1011"
			}, {
				key: 'c',
				val: "1100"
			}, {
				key: 'd',
				val: "1101"
			}, {
				key: 'e',
				val: "1110"
			}, {
				key: 'f',
				val: "1111"
			}
		]
		let value = ''
		let list = []
		if (str.length % 4 !== 0) {
			let a = "0000"
			let b = a.substring(0, 4 - str.length % 4)
			str = b.concat(str)
		}
		while (str.length > 4) {
			list.push(str.substring(0, 4))
			str = str.substring(4);
		}
		list.push(str)
		for (let i = 0; i < list.length; i++) {
			for (let j = 0; j < hex_array.length; j++) {
				if (list[i] == hex_array[j].val) {
					value = value.concat(hex_array[j].key)
					break
				}
			}
		}
		return value
	}
}
