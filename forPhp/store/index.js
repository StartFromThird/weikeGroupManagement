const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state, payload) {
      if (payload) {
        state.count += payload
      } else{
        state.count++
      }
    }
  },
  actions:{
    increment(context,payload){
        //setTimeout:模拟服务器调用且延迟2秒。
        setTimeout(() => {
            context.commit('increment',payload);//调用mutations中的increment()方法 
        }, 2000);
    }
  }
})