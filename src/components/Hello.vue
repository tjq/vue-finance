<template>
  <div class="hello">
		<el-container>
			<el-aside width="200px">
				<h1> vue-finance </h1>
				<el-input v-model="ticker"> </el-input>
				<el-button :type="text" @click="getTickerJSON()">Load</el-button>
			</el-aside>
			
			<el-main>
				<h2>{{ticker}}</h2>
			</el-main>
			
		</el-container>
    
		
  </div>
</template>



<script>
export default {
  name: 'hello',
  data () {
    return {
      ticker: ''
    }
  },
    
  methods: {
		getTickerJSON(){
			this.ticker = ""; // just a test
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
