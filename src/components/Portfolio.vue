<template>
  <div class="hello">
		<el-container class="container">
			
			<el-main>
				<el-row :gutter=20>
					<el-col :span=24> 
						<el-card>
							<el-table>
							
							</el-table>
						</el-card>
					</el-col>
				</el-row>
				
				<br>
				
				<el-row :gutter=20>
					<el-col :span=24>
						<el-card>
							<highstock v-loading="priceLoading" :options="options"></highstock>
							<highstock v-loading="macdLoading" :options="macdOptions"></highstock>
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
			priceLoading: true,
			macdLoading: true,
			highChartsData : [[0,1,0],[0,0,0]], // need this skeleton structure to 
																			// avoid NaN error in pre-render calculations
			percentChange: 0,
			macdData: [],
			rsiData: [],
			macdBuySignal: false,
			rsiBuySignal: false,
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
            selected: 2
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
            selected: 2
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
					type: 'line',
					data: []
				}]
			}
    }
  },
	mounted () {
		this.getTickerJSON()
	},
    
  methods: {
		getTickerJSON(){
			
			var initID = 'aa5fe804783ea51b5386be52d35ccabf'
			var initPW = '478a2b3747ed5a9742a05c11679dbe4a'
			this.highChartsData = [];
			
			this.priceLoading = true;
			this.macdLoading = true;

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
					this.highChartsData.push([new Date(key).getTime(), parseFloat(obj[key]['5. adjusted close']), parseFloat(obj[key]['6. volume'])]);
				}
				// for some reason this comes in backwards ?
				// highcharts wants it sorted
			  this.options.series[0].data = this.highChartsData.reverse()
				console.log(this.options.series[0].data)
				
				this.priceLoading = false;
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
				
				this.macdLoading = false;
				
			}, error => {console.log("What")}
														 
														 )
			
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
	.highcharts-range-selector-group{
		display: none;
	}
	
	a {
		color: #35495E;
	}
</style>
