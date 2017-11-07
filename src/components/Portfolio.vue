<template>
  <div class="hello">
		<el-container class="container">
			<el-aside width="200px" style="margin-top:30px; position:fixed">
				<el-input v-model="tickerToAdd" placeholder="Ticker"></el-input>
				<el-input-number style="width: 100%" v-model="sharesToAdd" placeholder="# Shares"></el-input-number>
				<br>
				<el-button style="width: 100%" @click="addToPortfolio"> Add </el-button>
				<br>

			</el-aside>
			<el-main style="margin: 10px 0px 0px 200px">
				<el-row :gutter=20>
					<el-col :span=24>
						<el-card>
							 <el-table :data="portfolio" style="width: 100%">
								<el-table-column prop="ticker" label="Ticker" width="180">
								</el-table-column>
								<el-table-column prop="shares" label="# Shares" width="180">
								</el-table-column>
								<el-table-column prop="equityValue" label="Value (USD)" width="180">
								</el-table-column>
							</el-table>
						</el-card>
					</el-col>
				</el-row>
				
				<br>
				
				<el-row>
					<el-col>
						<el-card>
							<highstock :options="options"></highstock>
						</el-card>
					</el-col>
				</el-row>
			</el-main>
			
		</el-container>
    
		
  </div>
</template>



<script>
import axios from 'axios';
import Vue from 'vue'
import firebase from 'firebase';
import VueHighcharts from 'vue-highcharts';
import Highcharts from 'highcharts';

var database = firebase.database();
	
export default {
	components: {
		VueHighcharts
	},
	props: ['uid'],
	name: 'hello',
  data () {
    return {
			portfolio: [{ticker: '', shares: 0, equityValue: 0 }],
			test: [],
			isLoading: true,
			apiKey: 'WyAYWfaPWbL7iU49Rfo6',
			alphaVantageKey: '3VSR22AHR48O8GY3',
			tickerToAdd: '',
			sharesToAdd: 0,
			options: {
				rangeSelector: {
            selected: 2
        },

        title: {
            text: ''
        },

        series: []
			},
    }
  },
	created: function () {
		firebase.auth().onAuthStateChanged((user) => {
			if(user){
				var that = this;
				
				database.ref('users/' + this.uid).once('value').then(function(snapshot) {
					var portfolio = []
					snapshot.forEach(function(userSnapshot) {
							var username = userSnapshot.val()
							/*var tmp = [[0]];
							var url = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol='+ username.ticker + '&outputsize=full&apikey=3VSR22AHR48O8GY3';
							axios.get(url).then(response => {
								tmp = [];
								var obj = response.data['Time Series (Daily)']
								for (var key in obj) {
									// console.log(key);
									// console.log(obj[key]['5. adjusted close'])
									tmp.push([ parseFloat(obj[key]['5. adjusted close']) ]);
								}*/
								//var eq = that.getCurrentPrice(username.ticker)
								portfolio.push({
									shares: username.shares,
									ticker: username.ticker
									// equityValue: eq
								})
							})
					
					that.portfolio = portfolio;
					// console.log(that.portfolio.length)
					
					that.portfolio.forEach((e) => {
						// console.log(e.ticker)
						var ind = that.portfolio.indexOf(e);
						that.getCurrentPrice(e.ticker)
						console.log(that.portfolio[ind])
						that.portfolio[ind].equityValue = 0
					})
					
				})
				
				
				
			}
			
		})
		
		
		// this.getPortfolio()
		if (this.portfolio.length > 1){
			console.log("Word")
			this.portfolio.forEach( (e) => {
				console.log(e[0])
				this.getCurrentPrice(e.ticker)
			})
		}
		
		
	},
  methods: {
		addToPortfolio(){
			database.ref('users/' + this.uid).push({
				ticker: this.tickerToAdd,
				shares: this.sharesToAdd
			})
			
			this.getPortfolio()
		},
		
		getPortfolio(){
				var i = 0;
				var portfolio = []
				// var isLoading  = true;
				database.ref('users/' + this.uid).once('value').then(function(snapshot) {
					
								snapshot.forEach(function(userSnapshot) {
										var username = userSnapshot.val()
										/*var tmp = [[0]];
										var url = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol='+ username.ticker + '&outputsize=full&apikey=3VSR22AHR48O8GY3';
										axios.get(url).then(response => {
											tmp = [];
											var obj = response.data['Time Series (Daily)']
											for (var key in obj) {
												// console.log(key);
												// console.log(obj[key]['5. adjusted close'])
												tmp.push([ parseFloat(obj[key]['5. adjusted close']) ]);
											}*/

											portfolio.push({
												shares: username.shares,
												ticker: username.ticker
											})
										})
								
								/*portfolio.forEach((e) => {
									var ind = portfolio.indexOf(e.ticker);
									console.log(ind)
									this.$set(portfolio, 'equityValue', 10)
								})*/

				})
				
				this.portfolio = portfolio;
			
		},
		
		getTickerJSON(ticker){
			var url = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol='+ this.ticker + '&outputsize=full&apikey=' + this.alphaVantageKey
			axios.get(url).then(response => {
			  console.log(response.data['Time Series (Daily)']) // debug
				var arr = Object.values(response.data);
				console.log(arr)
			})
		},
		
		getCurrentPrice(t){
			var tmp = []
			console.log(t)
			var that = this;
			var url = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol='+ t + '&outputsize=10&apikey=3VSR22AHR48O8GY3';
			axios.get(url).then(response => {
				this.isLoading = true;
				var obj = response.data['Time Series (Daily)']
				for (var key in obj) {
					// console.log(key);
					// console.log(obj[key]['5. adjusted close'])
					tmp.push([new Date(key).getTime(), parseFloat(obj[key]['5. adjusted close']) ]);
				}
				this.options.series.push({
					name: t,
					data: tmp.reverse(),
					tooltip: {
							valueDecimals: 2
					}
				})
				
				console.log(tmp.slice(-1)[0][1])
				this.test.push({
					price: tmp.slice(-1)[0][1],
					ticker: t
				})
				
			})
			
			return 

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
