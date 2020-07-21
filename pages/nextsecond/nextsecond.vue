<template>
	<view>
		<cl-card label="基础设置">
			<uni-icons @tap="reset" color="#0099ff" style="position: absolute;top: 10rpx;right: 20rpx;" type="gear" size="20"></uni-icons>
			<cl-list label="开启/关闭">
				<cl-switch v-model="openOrClose"></cl-switch>
			</cl-list>
			<cl-list label="灯光数">
				<cl-input type="number" round="true" style="width: 120rpx" v-model='size'></cl-input>
			</cl-list>
		</cl-card>
		<cl-card label="灯光控制">
			<div style="display: flex;margin:20rpx 20rpx">
				<span style="flex-grow: 1;font-size:28rpx">强弱</span>
				<cl-slider @touchend="handlerEndVal1"  max="255" v-model="val1" style="flex-grow: 11;"></cl-slider>
			</div>
			<div style="display: flex;margin:20rpx 20rpx">
				<span style="flex-grow: 1;font-size:28rpx">频率</span>
				<cl-slider @touchend="handlerEndVal2" max="255" v-model="val2" style="flex-grow: 11;"></cl-slider>
			</div>
			<div style="display: flex;margin:20rpx 20rpx">
				<div style="margin:30rpx 20rpx 0rpx 0rpx;font-size:28rpx">模式</div>
				<div style="margin:10rpx 0rpx 0rpx 0rpx;width:60rpx;height:60rpx;border:1px solid #ffffff;border-radius: 50%;">
					<image style="width: 60rpx;height: 60rpx;" :src="'../../static/'+currentUseLine.model"></image>
				</div>
				<div v-if="currentUseLine.colors" span="2" :key="index" v-for="(color,index) in currentUseLine.colors">
					<div class="badeg current_color_active" :style="'background-color:'+defaultColors[color]"></div>
				</div>
				<div v-if="currentUseLine.model2" style="margin:10rpx 0rpx 0rpx 0rpx;width:60rpx;height:60rpx;border:1px solid #ffffff;float: right;">
					<image style="width: 60rpx;height: 60rpx;" :src="'../../static/'+currentUseLine.model2"></image>
				</div>
			</div>
		</cl-card>
		<cl-card label="灯光设置">
			<cl-list justify="start" @tap="changeModel(-1)">
				<div style="margin:20rpx 20rpx 0rpx 0rpx;width: 20rpx;">1</div>
				<div style="margin:20rpx 0rpx 0rpx 0rpx;width:50rpx;height:50rpx;border:1px solid #ffffff;border-radius: 50%;">
					<image style="width: 50rpx;height: 50rpx;" src="../../static/auto.png"></image>
				</div>
			</cl-list>
			<cl-list justify="start" @tap="changeModel(a)" v-for="(item,a) in lineData" :key="a">
				<div style="margin:20rpx 20rpx 0rpx 0rpx;width: 20rpx;">{{a+2}}</div>
				<div style="margin:20rpx 0rpx 0rpx 0rpx;width:50rpx;height:50rpx;border:1px solid #ffffff;border-radius: 50%;">
					<image style="width: 50rpx;height: 50rpx;" :src="'../../static/'+item.model"></image>
				</div>
				<cl-col span="2" :key="itemIndex" v-for="(color,itemIndex) in item.colors">
					<div class="badeg current_color_active" :style="'background-color:'+defaultColors[color]"></div>
				</cl-col>
				<div v-if="item.model2" style="margin:20rpx 0rpx 0rpx 0rpx;width:60rpx;height:60rpx;border:1px solid #ffffff;float: right;">
					<image style="width: 60rpx;height: 60rpx;" :src="'../../static/'+item.model2"></image>
				</div>
				<text @tap.native.stop="openModal(a)" slot="append" style="color:#0099FF" class="cl-icon-arrow-right"></text>
			</cl-list>
		</cl-card>
		<cl-dialog :visible.sync="visible">
			<cl-card label="模式选择" padding="10rpx">
				<cl-row gutter="10">
					<cl-col span="4">
						<div @tap="handlerActive(0)" :class="{active:currentListData.model=='jump.png',notActive:currentListData.model!='jump.png'}">
							<image style="width: 80rpx;height: 80rpx;" src="../../static/jump.png"></image>
						</div>
					</cl-col>
					<cl-col span="4">
						<div @tap="handlerActive(1)" :class="{active:currentListData.model=='flicker.png',notActive:currentListData.model!='flicker.png'}">
							<image style="width: 80rpx;height: 80rpx;" src="../../static/flicker.png"></image>
						</div>
					</cl-col>
					<cl-col span="4">
						<div @tap="handlerActive(2)" :class="{active:currentListData.model=='fade.png',notActive:currentListData.model!='fade.png'}">
							<image style="width: 80rpx;height: 80rpx;" src="../../static/fade.png"></image>
						</div>
					</cl-col>
					<cl-col span="4">
						<div @tap="handlerActive(3)" :class="{active:currentListData.model=='smooth.png',notActive:currentListData.model!='smooth.png'}">
							<image style="width: 80rpx;height: 80rpx;" src="../../static/smooth.png"></image>
						</div>
					</cl-col>
					<cl-col span="4">
						<div @tap="handlerActive(4)" :class="{active:currentListData.model=='flash.png',notActive:currentListData.model!='flash.png'}">
							<image style="width: 80rpx;height: 80rpx;" src="../../static/flash.png"></image>
						</div>
					</cl-col>
					<cl-col span="4">
						<div @tap="handlerActive(5)" :class="{active:currentListData.model=='flowspur.png',notActive:currentListData.model!='flowspur.png'}">
							<image style="width: 80rpx;height: 80rpx;" src="../../static/flowspur.png"></image>
						</div>
					</cl-col>
					<cl-col span="4">
						<div @tap="handlerActive(6)" :class="{active:currentListData.model=='flowdot.png',notActive:currentListData.model!='flowdot.png'}">
							<image style="width: 80rpx;height: 80rpx;" src="../../static/flowdot.png"></image>
						</div>
					</cl-col>
					<cl-col span="4">
						<div @tap="handlerActive(7)" :class="{active:currentListData.model=='flowgap.png',notActive:currentListData.model!='flowgap.png'}">
							<image style="width: 80rpx;height: 80rpx;" src="../../static/flowgap.png"></image>
						</div>
					</cl-col>
					<cl-col span="4">
						<div @tap="handlerActive(8)" :class="{active:currentListData.model=='flowfade.png',notActive:currentListData.model!='flowfade.png'}">
							<image style="width: 80rpx;height: 80rpx;" src="../../static/flowfade.png"></image>
						</div>
					</cl-col>
					<cl-col span="4">
						<div @tap="handlerActive(9)" :class="{active:currentListData.model=='combet.png',notActive:currentListData.model!='combet.png'}">
							<image style="width: 80rpx;height: 80rpx;" src="../../static/combet.png"></image>
						</div>
					</cl-col>
					<cl-col span="4">
						<div @tap="handlerActive(10)" :class="{active:currentListData.model=='combetdot.png',notActive:currentListData.model!='combetdot.png'}">
							<image style="width: 80rpx;height: 80rpx;" src="../../static/combetdot.png"></image>
						</div>
					</cl-col>
					<cl-col span="4">
						<div @tap="handlerActive(11)" :class="{active:currentListData.model=='combetwhite.png',notActive:currentListData.model!='combetwhite.png'}">
							<image style="width: 80rpx;height: 80rpx;" src="../../static/combetwhite.png"></image>
						</div>
					</cl-col>
				</cl-row>
			</cl-card>
			<cl-card label="颜色选择" padding="0">
				<div style="display: flex;">
					<div style="background-color: #A9A9A9;padding:20rpx;border-radius: 15rpx;display: flex;">
						<div style="margin: 0rpx 8rpx;" :key="index" v-for="(item,index) in defaultColors">
							<div @tap="clearColor(index,item)" class="badeg1" :style="'box-shadow: 0 0 2px '+item+';transform: scale(1.05, 1.05)'">
								<div v-if="currentListData.colors.some(c=>c==index)" class="badeg1" :style="'background-color:'+item">
								</div>
							</div>
						</div>
					</div>
					<div >
						<icon @tap="clearColorAll" type="trash-filled" style="color: #0099FF;margin-top: 10rpx;" size="25"></icon>
					</div>
				</div>
			</cl-card>
			<cl-card v-if="currentListData.index>4" label="方向选择" padding="0">
				<cl-row gutter="10">
					<cl-col span="4">
						<div @tap="handlerActiveModel2(0)" :class="{active1:currentListData.model2=='forward.png',notActive1:currentListData.model2!='forward.png'}">
							<image style="width: 70rpx;height: 70rpx;" src="../../static/forward.png"></image>
						</div>
					</cl-col>
					<cl-col span="4">
						<div @tap="handlerActiveModel2(1)" :class="{active1:currentListData.model2=='back.png',notActive1:currentListData.model2!='back.png'}">
							<image style="width: 70rpx;height: 70rpx;" src="../../static/back.png"></image>
						</div>
					</cl-col>
					<cl-col span="4">
						<div @tap="handlerActiveModel2(2)" :class="{active1:currentListData.model2=='ce.png',notActive1:currentListData.model2!='ce.png'}">
							<image style="width: 70rpx;height: 70rpx;" src="../../static/ce.png"></image>
						</div>
					</cl-col>
					<cl-col span="4">
						<div @tap="handlerActiveModel2(3)" :class="{active1:currentListData.model2=='ec.png',notActive1:currentListData.model2!='ec.png'}">
							<image style="width: 70rpx;height: 70rpx;" src="../../static/ec.png"></image>
						</div>
					</cl-col>
				</cl-row>
			</cl-card>
			<cl-card v-if="currentListData.index>4" label="颜色宽度" padding="0">
				<div style="display: flex;margin:20rpx 20rpx">
					<image style="width: 80rpx;height: 80rpx;" src="../../static/colorwidth_s.png"></image>
					<cl-slider max="255" v-model="currentListData.value" style="flex-grow: 20;margin-top:20rpx;margin-left: 30rpx;margin-right: 30rpx;"></cl-slider>
					<image style="width: 80rpx;height: 80rpx;" src="../../static/colorwidth_b.png"></image>
				</div>
			</cl-card>
			<template slot="footer">
				<cl-button size="small" type="danger" round @tap="close('cs')">
					<text>取消</text>
				</cl-button>
				<cl-button @tap="saveChange" type="primary" size="small" round>
					<text>确定</text>
				</cl-button>
			</template>
		</cl-dialog>
	</view>
</template>

<script>
	import icon from '@/components/uni-icons/uni-icons.vue'
	import ble from '@/static/js/ble.js'
	export default {
		components: {
			icon
		},
		onShow() {
			uni.setNavigationBarTitle({
				title: this.$store.getters.getDevice.name
			});
			var data = this.$store.getters.getData;
			if(this.openOrClose){
				data[2] = ble.bin_to_hex("10000001");
				this.$store.commit("setData",data)
			}else{
				data[2] = ble.bin_to_hex("10000000");
				this.$store.commit("setData",data)
			}
			var that = this;
			//当前选中的灯光效果
			uni.getStorage({
				key:"currentUseLineIndex",
				success(result){
					if(result.data == -1){
						that.currentUseLine = {model:"auto.png"};
					}else{
						that.currentUseLine = that.lineData[result.data]
					}
				}
			})
		},
		data() {
			return {
				currentUseLine:{
					model:"auto.png",
					index:-1,
					model2:"",
					value:0
				},
				models2:["forward","back","ce","ec"],
				models:["jump","flicker","fade","smooth","flash","flowspur","flowdot","flowgap","flowfade","combet","combetdot","combetwhite"],
				defaultColors: ["#FF0000", "#336600", "#0000CC","#FFFF66", "#FF99FF", "#0099ff", "#FFFFFF"],
				currentLineIndex: null,
				size: 70,
				lineData: [],
				openOrClose: this.$store.getters.getISON,
				val1: 255,
				val2: 255,
				visible: false,
				pop_visible: false,
				currentListData: {
					colors:[],
					index:-1,
					model2:""
				},
			}
		},
		methods: {
			handlerActiveModel2(index){
				this.currentListData.index2 = index;
				this.currentListData.model2 = this.models2[index]+".png";
				this.$set(this.currentListData,"model2",this.models2[index]+".png")
			},
			changeModel(index){
				var currentUseLineIndex = index;
				if(index==-1){
					currentUseLineIndex = -1;
					this.currentUseLine = {model:"auto.png"};
					ble.write({data:"00",index:13},{data:"01",index:4})
				}else{
					this.currentUseLine = this.lineData[index]
					var model = (this.currentUseLine.index+2).toString(16);
					if(model.length==1) 
						model = "0"+model;
					var colorData = "";
					var that = this;
					this.defaultColors.forEach((item,index)=>{
						var v = that.currentUseLine.colors.some(color=>color==index)?"1":"0";
						colorData = v+colorData;
					})
					colorData = "0"+colorData;
					colorData = ble.bin_to_hex(colorData);
					var sendData = [{data:model,index:4},{data:colorData,index:10}];
					if(this.currentUseLine.index>4){
						if(this.currentUseLine.value){
							var value = this.currentUseLine.value.toString(16);
							if(value.length==1){
								value = "0"+value;
							}
							sendData.push({data:value,index:12});
						}
						if(this.currentUseLine.index2){
							var model2 = "0"+(this.currentUseLine.index2+1);
							sendData.push({data:model2,index:11});
						}
					}
					var dataIndex = (index+1).toString(16);
					if(dataIndex.length==1)
						dataIndex = "0"+dataIndex;
					sendData.push({data:dataIndex,index:13});
					ble.write(...sendData)
				}
				uni.setStorage({
					key:"currentUseLineIndex",
					data:currentUseLineIndex
				})
			},
			handlerActive(index) {
				this.currentListData.index = index;
				this.currentListData.model = this.models[index]+".png";
				if(index>4){
					this.currentListData.model2 = this.models2[0]+".png";
					this.currentListData.index2 = 0;
					this.currentListData.value = 0;
				}
			},
			clearColor(index, item) {
				var removeIndex = -1;
				var flag = this.currentListData.colors.some(c=>c==index);
				if(flag){
					this.currentListData.colors.forEach((d,i)=>{
						if(index==d) removeIndex = i;
					})
					
					this.currentListData.colors.splice(removeIndex,1);
				}else{
					this.currentListData.colors.push(index);
					this.currentListData.colors.sort()
				}
			},
			clearColorAll() {
				this.currentListData.colors = [];
			},
			openModal(index) {
				this.currentLineIndex = index;
				var model = this.lineData[index].model;
				var currentMIndex = this.lineData[index].index;
				this.currentListData = {
					model:this.lineData[index].model,
					index:currentMIndex,
					index2:-1,
					colors:this.lineData[index].colors.map(item=>item),
					model2:this.lineData[index].model2,
					value:this.lineData[index].value
				}
				this.visible = true;
			},
			close() {
				this.visible = false;
			},
			saveChange() {
				this.lineData[this.currentLineIndex] = this.currentListData;
				this.visible = false;
				this.$store.commit("setModels",this.lineData)
			},
			handlerEndVal1(){
				var value = this.val1.toString(16);
				console.log(value);
				ble.write({data:value,index:9});
			},
			handlerEndVal2(){
				var value = this.val2.toString(16)
				ble.write({data:value,index:5})
			},
			reset(){
				uni.showModal({
					title:"警告",
					content:"确定恢复出厂设置吗？",
					success(res) {
						if(res.confirm){
							uni.clearStorage();
							uni.reLaunch({
								url:"../index/index"
							})
						}
					}
				})
			}
		},
		watch: {
			openOrClose(value){
				if(value){
					this.$store.commit("setISON",true)
					var open = ble.bin_to_hex("10000001");
					ble.write({data:open,index:2})
				}else{
					this.$store.commit("setISON",false)
					var close = ble.bin_to_hex("10000000");
					ble.write({data:close,index:2})
				}
			},
			size(value){
				ble.write({data:this.val1.toString(16),index:3})
			}
			
		},
		computed:{
				getRandom(){
					return Math.random()
				}
		},
		created() {
			if(this.$store.getters.getModels){
				this.lineData = this.$store.getters.getModels
			}else{
				for (var i = 3; i >= 0; i--) {
					for(var j=0;j<12;j++){
						var colors = [];
						i==3 && colors.push(0,1,2,3,4,5,6);
						i==2 && colors.push(3,4,6);
						i==1 && colors.push(1,3,4,6);
						// i==4 && colors.push(1,2,5,6);
						// i==3 && colors.push(1,3,4);
						// i==2 && colors.push(1,3);
						// i==1 && colors.push(2,3,4,6);
						i==0 && colors.push(2,5)
						var data = {
							model: this.models[j]+".png",
							colors: colors,
							model2:"",
							index:j,
							value:0
						}
						this.lineData.push(data);
					}
				}
			}
			this.$store.commit("setModels",this.lineData)
		}
	}
</script>

<style scoped>
	.badeg {
		width: 50rpx;
		height: 50rpx;
		border-radius: 10rpx;
		margin: 20rpx 5rpx 0rpx 15rpx
	}

	.badeg1 {
		width: 50rpx;
		height: 50rpx;
		border-radius: 10rpx;
	}

	.current_color_active {
		box-shadow: 0 0 2px #09f;
		transform: scale(1.05, 1.05);
	}

	.active {
		width: 80rpx;
		height: 80rpx;
		border: 1px solid #0099FF;
		border-radius: 50%;
	}
	.active1 {
		width: 70rpx;
		height: 70rpx;
		border: 1px solid #0099FF;
		border-radius: 50%;
	}

	.notActive {
		width: 80rpx;
		height: 80rpx;
		border: 1px solid #FFFFFF;
		border-radius: 50%;
	}
	.notActive1 {
		width: 70rpx;
		height: 70rpx;
		border: 1px solid #FFFFFF;
		border-radius: 50%;
	}
</style>
