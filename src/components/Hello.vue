<template>
  <div class="hello">
		<el-container>
			<el-aside width="200px">
				<h1> Enter a ticker </h1>
				<el-input v-model="ticker"> </el-input>
				<el-button type="text" @click="getTickerJSON()">Load</el-button>
			</el-aside>
			
			<el-main v-loading="loading">
				<highstock :options="options"></highstock>
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
			highChartsData : [],
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
		}
		
	}
}

</script>



<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
@import url("//unpkg.com/element-ui@1.0.0-rc.3/lib/theme-default/index.css");

h1, h2 {
  font-weight: normal;
}

a {
  color: #35495E;
}
</style>
