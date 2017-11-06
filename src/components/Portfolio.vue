<template>
  <div class="hello">
		<el-container class="container">
			
			<el-main>
				<el-row :gutter=20>
					<el-col :span=24> 
						<el-card>
							{{uid}}
							<el-table>
							
							</el-table>
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
	props: ['uid'],
	name: 'hello',
  data () {
    return {
      
			apiKey: 'WyAYWfaPWbL7iU49Rfo6',
			alphaVantageKey: '3VSR22AHR48O8GY3',
    }
  },
	mounted () {
		// this.getTickerJSON()
	},
    
  methods: {
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
