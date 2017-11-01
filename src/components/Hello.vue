<template>
  <div class="hello">
		<el-container class="container">
			
			<el-aside width="200px">
				<br>
				<br>
				<br>
				<el-input v-model="ticker"> 
				
				<template slot="append"><el-button type="text" @click="getTickerJSON()">Load</el-button></template>
				</el-input>
				
			</el-aside>
			
			<el-main>
				<el-row :gutter=20>
					<el-col :span=8> 
						<el-card>
							<p>Lastest Close</p>
							<span style="font-size:2em">{{latestClose}}</span>
						</el-card>
					</el-col>
					<el-col :span=8> 
						<el-card>
							<p>Percent Change</p>
							<span class="tile-text" :style="(percentChange - 1) < 0 ? 'color:red' : 'color:green'">{{((percentChange - 1)*100).toFixed(2)}}%</span>
						</el-card>
					</el-col>
					<el-col :span=8> 
						<el-card>
							<p>Analyst Rating</p>
							<span style="font-size:2em">{{avgRating}}</span>
						</el-card>
					</el-col>
				</el-row>
				
				<br>
				
				<el-row :gutter=20>
					<el-col :span=24>
						<el-card v-loading="loading">
							<highstock :options="options"></highstock>
						</el-card>
					</el-col>
				</el-row>
				
				<br>
				
				<el-row :gutter=20>
					<el-col :span=24>
						<el-card v-loading="loading">
							<highcharts :options="smaOptions"></highcharts>
						</el-card>
					</el-col>
				</el-row>
			</el-main>
			
		</el-container>
    
		
  </div>
</template>



<script>
import axios from 'axios';
import VueHighcharts from 'vue-highcharts';
import Highcharts from 'highcharts';
	
export default {
	components: {
		VueHighcharts
	},
	name: 'hello',
  data () {
    return {
      ticker: 'AAPL',
			apiKey: 'WyAYWfaPWbL7iU49Rfo6',
			alphaVantageKey: '3VSR22AHR48O8GY3',
			loading: false,
			highChartsData : [],
			smaData: [],
			avgRating: 0,
			options: {
				rangeSelector: {
            selected: 2
        },

        title: {
            text: ''
        },

        series: [{
            name: 'Closing Price',
            data: [],
            tooltip: {
                valueDecimals: 2
            }
        }]},
			
			smaOptions : {
				title: {
					text: ''
				},
				
				legend: {
					enabled: false
				},
				
				xAxis: {
					type: 'datetime'
				},
				
				series: [{
					type: 'area',
					data: []
				}]
			}
    }
  },
    
  methods: {
		getTickerJSON(){
			this.highChartsData = [];
			
			this.loading = true;

			var arUrl = 'https://www.quandl.com/api/v3/datasets/CBARH/' + this.ticker + '.json?api_key=' + this.apiKey
			
			var url = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol='+ this.ticker + '&apikey=' + this.alphaVantageKey
			
			var smaUrl = 'https://www.alphavantage.co/query?function=MACD&symbol='+ this.ticker + '&interval=daily&series_type=open&apikey=' + this.alphaVantageKey;
			
			axios.get(url).then(response => {
				// console.log(response.data['Time Series (Daily)']) // debug
				var arr = Object.values(response.data);
				// console.log(arr[1])
				var obj = response.data['Time Series (Daily)']
				for (var key in obj) {
				  // console.log(key);
					// console.log(obj[key]['5. adjusted close'])
					this.highChartsData.push([new Date(key).getTime(), parseFloat(obj[key]['5. adjusted close'])]);
				}
				
				console.log(this.highChartsData)
				
				// for some reason this comes in backwards ?
				// highcharts wants it sorted
			  this.options.series[0].data = this.highChartsData
				this.loading = false;
			})
			
			axios.get(arUrl).then(response => {
				this.avgRating = response.data.dataset.data[0][2]
			})
			
			axios.get(smaUrl).then(response => {
				this.smaData = [];
				console.log(response.data)
				var arr = Object.values(response.data);
				// console.log(arr[1])
				var obj = response.data['Technical Analysis: MACD']
				for (var key in obj) {
				  // console.log(key);
					// console.log(obj[key]['5. adjusted close'])
					this.smaData.push([new Date(key).getTime(), parseFloat(obj[key]['MACD_Hist'])]);
					
				}
				this.smaOptions.series[0].data = this.smaData
				// console.log(this.smaData)
				
			})
		}
		
	},
	
	computed: {
		latestClose(){
			if(this.highChartsData.length < 2){
				return 0;
			}
			var tmp = this.highChartsData
			return tmp[0][1]
		},
		percentChange(){
			if(this.highChartsData.length < 2){
				return 1;
			}
			var tmp = this.highChartsData
			return tmp[0][1]/tmp.slice(1)[0][1]
		}
	}
}

</script>



<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

h1, h2 {
  font-weight: normal;
}
.tile-text{
	font-size: 2em;
}
.container {
  max-width: 980px;
  margin: 20px auto;
  @media screen and (max-width: 1050px) { 
    width: 95%; 
  }
}
	
a {
  color: #35495E;
}
</style>
