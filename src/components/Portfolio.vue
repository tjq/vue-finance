<template>
  <div class="hello">
		<el-container class="container">
			
			<el-main>
				<el-row>
					<el-col :span=24>
						<el-input v-model="tickerToAdd"></el-input>
						<el-input v-model="sharesToAdd"></el-input>
						<el-button type="text" @click="addToPortfolio"> Add </el-button>
					</el-col>
				</el-row>
				<el-row :gutter=20>
					<el-col :span=24>
						<el-card>
							 <el-table :data="portfolio" style="width: 100%">
								<el-table-column prop="ticker" label="Ticker" width="180">
								</el-table-column>
								<el-table-column prop="shares" label="# Shares" width="180">
								</el-table-column>
							</el-table>
						</el-card>
					</el-col>
				</el-row>
				
				<br>
			</el-main>
			
		</el-container>
    
		
  </div>
</template>



<script>
import axios from 'axios';
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
      portfolio: [],
			apiKey: 'WyAYWfaPWbL7iU49Rfo6',
			alphaVantageKey: '3VSR22AHR48O8GY3',
			tickerToAdd: '',
			sharesToAdd: 0
    }
  },
	mounted () {
		this.getPortfolio()
	},
    
  methods: {
		addToPortfolio(){
			database.ref('users/' + this.uid).push({
				ticker: this.tickerToAdd,
				shares: this.sharesToAdd
			})
		},
		
		getPortfolio(){
			var portfolio = [];
			database.ref('users/' + this.uid).once('value').then(function(snapshot) {
							snapshot.forEach(function(userSnapshot) {
									var username = userSnapshot.val()
									portfolio.push({
											shares: username.shares,
											ticker: username.ticker
									})
					})
							console.log(portfolio)
			})
			
			this.portfolio = portfolio;
			
			
		},
		getTickerJSON(){
			
			var initID = 'aa5fe804783ea51b5386be52d35ccabf'
			var initPW = '478a2b3747ed5a9742a05c11679dbe4a'
			this.highChartsData = [];
			
			this.priceLoading = true;
			this.macdLoading = true;

			
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
