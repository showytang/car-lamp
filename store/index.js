import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
	state: {
		device: {
			name: "未来光科"
		},
		data: null,
		oldDevices: [],
		readData:["55","01"],
		ISON:true,
		models:null
	},
	getters: {
		
		getModels(state){return state.models},
		getISON(state){
			return state.ISON;
		},
		getOldDevices(state) {
			uni.getStorage({
				key: "oldDevices",
				success(result) {
					state.oldDevices = JSON.parse(result.data)
				},fail() {
					
				}
			})
			return state.oldDevices;
		},
		getDevice(state) {
			if (state.device.deviceId==null) {
				uni.getStorage({
					key: "device",
					success(result) {
						state.device = JSON.parse(result.data)
					}
				})
				return state.device;
			}
			return state.device
		},
		getData(state) {
			if (state.data==null) {
				var array = Array(20).fill('00')
				array[0] = '55';
				array[1] = '0D';
				array[2] = '00';
				array[19] = '17';
				state.data = array;
			}
			console.log(state.data.join("").length)
			return state.data;
		}
	},
	mutations: {
		setRead(state,data){
			state.readData = data;
		},
		setISON(state,data){
			state.ISON = data;
		},
		setModels(state,data){
			state.models = data
			uni.setStorage({
				key:"models",
				data:JSON.stringify(data)
			})
		},
		setData(state, data) {
			if (data==null) {
				var array = Array(20).fill('00')
				array[0] = '55';
				array[1] = '0D';
				array[2] = '46';
				array[19] = '17';
				state.data = array;
			}else{
				state.data = data;
			}
		},
		setDevice(state, device) {
			uni.setStorage({
				data:JSON.stringify(device),
				key:"device"
			})
			uni.getStorage({
				key:"oldDevices",
				success(result){
					var oldDevices = JSON.parse(result.data);
					var flag = oldDevices.some(item=>device.deviceId==item.deviceId)
					if(flag) return;
					oldDevices.push(device);
					uni.setStorage({
						data:JSON.stringify(oldDevices),
						key:"oldDevices",
						success() {
							state.oldDevices = oldDevices
						}
					})
				},fail() {
					var oldDevices = [];
					oldDevices.push(device);
					uni.setStorage({
						data:JSON.stringify(oldDevices),
						key:"oldDevices",
						success() {
							state.oldDevices = oldDevices
						}
					})
				}
			})
			state.device = device;
		}
	},
	actions: {

	}
})
export default store
