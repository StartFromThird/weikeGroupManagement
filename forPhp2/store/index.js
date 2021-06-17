const store = new Vuex.Store({
  state: {
    isSubjectExit: false,
    defaultSubject: {},
  },
  mutations: {
    setSubjectExit (state, exit) {
      if (exit) {
        state.defaultSubject = exit
        state.isSubjectExit = true
      } else{
        state.defaultSubject = {}
        state.isSubjectExit = false
      }
    }
  },
  actions:{

  }
})