<template>
  <div class="hello">
		<el-container class="container">
			
			<el-aside width="200px" style="margin-top:30px; position:fixed">

				<el-input v-model="ticker"> 
				
				<template slot="append"><el-button type="text" @click="getTickerJSON()">Load</el-button></template>
				</el-input>
				<br>
				<br>
				<el-button style="font-size:0.5em; padding: 4px 4px;" @click="setTimeSeriesRange(0)">
					1M
				</el-button>
				<el-button style="font-size:0.5em; padding: 4px 4px;" @click="setTimeSeriesRange(1)">
					3M
				</el-button>
				<el-button style="font-size:0.5em; padding: 4px 4px;" @click="setTimeSeriesRange(2)">
					6M
				</el-button>
				<el-button style="font-size:0.5em; padding: 4px 4px;" @click="setTimeSeriesRange(3)">
					YTD
				</el-button>
				<el-button style="font-size:0.5em; padding: 4px 4px;" @click="setTimeSeriesRange(5)">
					ALL
				</el-button>
				<br>
				<br>
				<el-card :style="macdBuySignal ? 'background-color:#77dd77' : 'background-color:#ff6961'">
					<div class="signal-title">MACD Buy Signal</div>
					{{macdBuySignal}}
				</el-card>
				
				<br>
				
				<el-card :style="rsiBuySignal ? 'background-color:#77dd77' : 'background-color:#ff6961'">
					<div class="signal-title">RSI Buy Signal</div>
					{{rsiBuySignal}}
				</el-card>
				
			</el-aside>
			
			<el-main style="margin: 10px 0px 0px 200px">
				<el-row :gutter=20>
					<el-col :span=8> 
						<el-card>
							<p>Lastest Close</p>
							<span style="font-size:2em">{{highChartsData.slice(-1)[0][1]}}</span>
						</el-card>
					</el-col>
					<el-col :span=8> 
						<el-card>
							<p>Percent Change</p>
							<span class="tile-text" :style="(percentChange - 1) < 0 ? 'color:red' : 'color:green'">{{(100- (highChartsData.slice(-1)[0][1]/highChartsData.slice(-2)[0][1])*100).toFixed(2)}}%</span>
							<!-- ((percentChange - 1)*100).toFixed(2) -->
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
							<highstock :options="macdOptions"></highstock>
							<highstock :options="rsiOptions"></highstock>
						</el-card>
					</el-col>
				</el-row>
				
				<br>
				
				<el-row :gutter=20>
					<el-col :span=24>
						<el-card>
							
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
			highChartsData : [[1,1],[1,1]], // need this skeleton structure to 
																			// avoid NaN error in pre-render calculations
			percentChange: 0,
			macdData: [],
			rsiData: [],
			macdBuySignal: false,
			rsiBuySignal: false,
			avgRating: 0,
			options: {
				rangeSelector: {
            selected: 2,
						enabled: false
        },

        title: {
            text: ''
        },

        series: [{
            name: 'Closing Price',
            data: [].reverse(),
            tooltip: {
                valueDecimals: 2
            }
        }]},
			
			macdOptions : {
				chart:{
					height: 400
				},
				title: {
					text: ''
				},
				
				rangeSelector: {
            selected: 2,
						enabled: false
        },
				
				legend: {
					enabled: false
				},
				
				yAxis: {
					title: {
						text: ''
					},
					opposite: true
				},
				
				series: [{
					type: 'area',
					data: []
				}]
			},
			
			rsiOptions : {
				chart:{
					height: 400
				},
				title: {
					text: ''
				},
				
				rangeSelector: {
            selected: 2,
						enabled: false
        },
				
				legend: {
					enabled: false
				},
				
				yAxis: {
					title: {
						text: ''
					},
					opposite: true
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
			
			var url = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol='+ this.ticker + '&outputsize=full&apikey=' + this.alphaVantageKey
			
			var macdUrl = 'https://www.alphavantage.co/query?function=MACD&symbol='+ this.ticker + '&interval=daily&outputsize=180&series_type=open&apikey=' + this.alphaVantageKey;
			
			var rsiUrl = 'https://www.alphavantage.co/query?function=RSI&symbol=' + this.ticker + '&interval=daily&time_period=10&series_type=close&apikey=' +this.alphaVantageKey;
			
			axios.get(url).then(response => {
			  console.log(response.data['Time Series (Daily)']) // debug
				var arr = Object.values(response.data);
				// console.log(arr[1])
				var obj = response.data['Time Series (Daily)']
				for (var key in obj) {
				  // console.log(key);
					// console.log(obj[key]['5. adjusted close'])
					this.highChartsData.push([new Date(key).getTime(), parseFloat(obj[key]['5. adjusted close'])]);
				}
				// for some reason this comes in backwards ?
				// highcharts wants it sorted
			  this.options.series[0].data = this.highChartsData.reverse()
				console.log(this.options.series[0].data)
				
				this.loading = false;
			})
			
			axios.get(arUrl).then(response => {
				this.avgRating = response.data.dataset.data[0][2]
			})
			
			axios.get(macdUrl).then(response => {
				this.macdData = [];
				console.log(response.data)
				var arr = Object.values(response.data);
				// console.log(arr[1])
				var obj = response.data['Technical Analysis: MACD']
				for (var key in obj) {
				  // console.log(key);
					// console.log(obj[key]['5. adjusted close'])
					this.macdData.push([new Date(key).getTime(), parseFloat(obj[key]['MACD_Hist'])]);
					
				}
				this.macdOptions.series[0].data = this.macdData.reverse()
				// console.log(this.macdData)
				
				// TODO: abstract into a function called trend()
				// then can be used for multiple indicators
				if (this.macdData.slice(-1)[0][1] <= 0 && this.macdData.slice(-2)[0][1] < this.macdData.slice(-1)[0][1]){
					this.macdBuySignal = true;
				}
				
			})
			
			axios.get(rsiUrl).then(response => {
				this.rsiData = [];
				console.log(response.data)
				var arr = Object.values(response.data);
				// console.log(arr[1])
				var obj = response.data['Technical Analysis: RSI']
				for (var key in obj) {
				  // console.log(key);
					// console.log(obj[key]['5. adjusted close'])
					this.rsiData.push([new Date(key).getTime(), parseFloat(obj[key]['RSI'])]);
					
				}
				this.rsiOptions.series[0].data = this.rsiData.reverse()
				
				if (this.rsiData.slice(-1)[0][1] >= 30 && this.rsiData.slice(-1)[0][1] <= 70){
					this.rsiBuySignal = true;
				}
				// console.log(this.macdData)
				
			})
		},
		
		setTimeSeriesRange(n){
			this.options.rangeSelector.selected = n;
			this.macdOptions.rangeSelector.selected = n;
			this.rsiOptions.rangeSelector.selected = n;
		}
		
	},
	
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
	.signal-title{
		font-size: 0.75em;
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
