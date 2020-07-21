<template>
	<view v-show="isShow">
		<view class="shade" @tap="hide"></view>
		<view class="pop" style="border-radius: 30rpx 30rpx 0rpx 0rpx;opacity: 0.9;">
			<view class="flex_col" style="margin-bottom: 20upx;">
				<view class="preview" :style="{'backgroundColor':getPickerColor}"></view>
				<view class="value">
					<text v-if="getPickerColor">颜色值：{{getPickerColor}}</text>
				</view>
				<view class="ok" @tap="setColor">关闭</view>
			</view>
			<view class="list flex_col" v-for="(item,index) in colorArr" :key="index">
				<view v-for="(v,i) in item" :key="i" 
					:style="{'backgroundColor':v}" 
					:data-color="v" 
					:data-index="index" 
					:data-i="i" 
					:class="{'active':(index==pickerArr[0] && i==pickerArr[1])}"
					@tap="picker"></view>
			</view>
			<view :style="{'height':(bottom+'px')}"></view>
		</view>
	</view>
</template>

<script>
	export default {
		name:'picker-color',
		props:{
			defaultColor:{
				type:String,
				default:'#000000'
			},
			isShow: {
				type: Boolean,
				default: false, 
			},
			bottom:{
				type: Number,
				default: 0, 
			}
		},
		data() {
			return {
				colorArr:[
					['#000000','#111111','#222222','#333333','#444444','#666666','#999999','#CCCCCC','#EEEEEE','#FFFFFF'],
					['#ff0000','#ff0033','#ff3399','#ff33cc','#cc00ff','#9900ff','#cc00cc','#cc0099','#cc3399','#cc0066'],
					['#cc3300','#cc6600','#ff9933','#ff9966','#ff9999','#ff99cc','#ff99ff','#cc66ff','#9966ff','#cc33ff'],
					['#663300','#996600','#996633','#cc9900','#a58800','#cccc00','#ffff66','#ffff99','#ffffcc','#ffcccc'],
					['#336600','#669900','#009900','#009933','#00cc00','#66ff66','#339933','#339966','#009999','#33cccc'],
					['#003366','#336699','#3366cc','#0099ff','#000099','#0000cc','#660066','#993366','#993333','#800000']
				],
				pickerColor:"",
				pickerArr:[-1,-1]
			};
		},
		computed:{
			getPickerColor(){
				if(this.pickerColor){
					return this.pickerColor;
				}
				return this.defaultColor;
			}
		},
		methods: {
			picker(e) {
				let data=e.currentTarget.dataset;
				this.pickerColor=data.color;
				//修改颜色块
				//this.$emit("callback",this.pickerColor);
				this.pickerArr=[data.index,data.i];
			},
			hide(){
				// this.$emit("callback",'');
				this.$emit("update:isShow",false);
			},
			setColor(){
				//this.$emit("callback",this.pickerColor);
				this.$emit("update:isShow",false);
			}
		},
		watch:{
		}
	}
</script>

<style scoped>
.shade{
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	background-color: rgba(0,0,0,0.5);
	z-index: 99;
}
.pop{
	position: fixed;
	right: 0;
	bottom: 0;
	left: 0;
	background-color: #fff;
	z-index: 100;
	padding: 20upx 20upx 10upx 20upx;
	font-size: 32upx;
}
.flex_col{
	display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
    align-content: center;
}
.list{
    justify-content: space-between;
}
.list>view{
	width: 60upx;
	height: 60upx;
	margin-bottom: 10upx;
	box-sizing: border-box;
	border-radius: 3px;
	box-shadow: 0 0  2px #ccc;
}
.list .active{
	box-shadow: 0 0  2px #09f;
	transform:scale(1.05,1.05);
}
.preview{
	width: 180upx;
	height: 60upx;
}
.value{
	margin: 0 40upx;
	flex-grow: 1;
}
.ok{
	width: 160upx;
	height: 60upx;
	line-height: 60upx;
	text-align: center;
	background-color: #ff9933;
	color: #fff;
	border-radius: 4px;
	letter-spacing: 3px;
	font-size: 32upx;
}
.ok:active{
	background-color: rgb(255, 107, 34);
}
</style>
