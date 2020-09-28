import Vue from 'vue'
import App from './App'
import store from './store'

Vue.config.productionTip = false

App.mpType = 'app'   

Vue.filter("addUrl",function(v){ 
	
	// return "http://10.40.49.101:8888/shopping/"+v;
	return "http://10.40.50.53:8081/static/"+v;
	
	// return "http://192.168.1.103:8081/static/"+v;
	
	// return "http://111.61.127.69:8084/approval/static/"+v;
})


Vue.prototype.$serverUrl = "http://192.168.1.103:8081/approval"; 
Vue.prototype.$addUrl = "http://192.168.1.103:8081/static/"; 
// Vue.prototype.$serverUrl = "http://192.168.43.21:8081/approval"; 

// Vue.prototype.$serverUrl = "http://111.61.127.69:8084/approval/approval"; 
// Vue.prototype.$addUrl = "http://111.61.127.69:8084/approval/static/"; 

// Vue.prototype.$serverUrl = "http://10.40.50.53:8081/approval"; 
// Vue.prototype.$addUrl = "http://10.40.50.53:8081/approval/static/"; 

Vue.prototype.$store = store;

const app = new Vue({
    ...App
})
app.$mount()
