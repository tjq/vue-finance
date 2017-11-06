<template>
  <div id="app">
			<header>
				<el-container class="container" style="margin-top:0px">
					<span style="font-weight:800;">tyler-apps</span>
					<el-dropdown style="margin-left:80%" v-show="email==''">
						<span class="el-dropdown-link" style="color: white">
							Login<i class="el-icon-arrow-down el-icon--right"></i>
						</span>
						<el-dropdown-menu slot="dropdown">
							<div id="firebaseui-auth-container"></div>
						</el-dropdown-menu>
					</el-dropdown>
					<el-dropdown style="margin-left:65%" v-show="email!=''">
						<span class="el-dropdown-link" style="color: white">
							{{email}}<i class="el-icon-arrow-down el-icon--right"></i>
						</span>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item>
								<el-button @click="firebaseLogout">Logout</el-button>
							</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</el-container>
			</header>
			<main>

				<router-view></router-view>
			</main>
		
  </div>
</template>

<script>

import firebase from 'firebase';
import firebaseui from 'firebaseui';
	
var uiConfig = {
      signInSuccessUrl: '/',
      signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID]
     };
	
var config = {
    apiKey: "AIzaSyAqWSktSjJLbWQJcgDIi7fQ74cIK8HnanY",
    authDomain: "stocks-9a3a7.firebaseapp.com",
    databaseURL: "https://stocks-9a3a7.firebaseio.com",
    projectId: "stocks-9a3a7",
    storageBucket: "",
    messagingSenderId: "1089302503318"
  };
 
firebase.initializeApp(config);
var ui = new firebaseui.auth.AuthUI(firebase.auth());
ui.start('#firebaseui-auth-container', uiConfig);
	
export default {
  name: 'app',
	
	data: function(){
		return {
			uid: '',
			email: ''
	
			}
	},
	
	created: function(){
		firebase.auth().onAuthStateChanged((user) => {
              if(user) {
                this.uid = user.uid;
                this.email = user.email;
              }
     })
	},
	
	methods: {
		firebaseLogout(){
			firebase.auth().signOut().then(function() {
				
				console.log('Signed Out');
			}, function(error) {
				console.error('Sign Out Error', error);
			});
			
			this.email = '';
			this.uid = '';
		}
	}
	
	
}
</script>


<style>
body {
  margin: 0;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

main {
  text-align: center;
  margin-top: 40px;
}

header {
  margin: 0;
  height: 56px;
  padding: 0 16px 0 24px;
  background-color: #35495E;
  color: #ffffff;
}

header span {
  display: block;
  position: relative;
  font-size: 20px;
  line-height: 1;
  letter-spacing: .02em;
  font-weight: 400;
  box-sizing: border-box;
  padding-top: 16px;
}
</style>
