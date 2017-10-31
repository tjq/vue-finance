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
							<span style="font-size:2em">{{((percentChange - 1)*100).toFixed(2)}}%</span>
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
			loading: false,
			highChartsData : [[]],
			avgRating: 0,
			options: {
				rangeSelector: {
            selected: 1
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
        }]}
    }
  },
    
  methods: {
		getTickerJSON(){
			this.loading = true;
			var url = 'https://www.quandl.com/api/v3/datasets/WIKI/' + this.ticker + '/data.json?api_key=' + this.apiKey
			var arUrl = 'https://www.quandl.com/api/v3/datasets/CBARH/' + this.ticker + '.json?api_key=' + this.apiKey
			
			
			axios.get(url).then(response => {
				this.highChartsData = response.data.dataset_data.data.map(function(d){
					return [new Date(d[0]).getTime(), d[4]];
				});
				
				// for some reason this comes in backwards ?
				// highcharts wants it sorted
				this.options.series[0].data = this.highChartsData.reverse();
				// this.options.series.data = this.highChartsData;
				console.log(this.highChartsData)
				console.log(this.options.series[0].data)
				this.loading = false;
			})
			
			axios.get(arUrl).then(response => {
				this.avgRating = response.data.dataset.data[0][2]
			})
		}
		
	},
	
	computed: {
		latestClose(){
			if(this.highChartsData.length < 2){
				return 0;
			}
			var tmp = this.highChartsData
			return tmp.slice(-1)[0][1]
		},
		percentChange(){
			if(this.highChartsData.length < 2){
				return 1;
			}
			var tmp = this.highChartsData
			return tmp.slice(-1)[0][1]/tmp.slice(-2)[0][1]
		}
	}
}

</script>



<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

h1, h2 {
  font-weight: normal;
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
