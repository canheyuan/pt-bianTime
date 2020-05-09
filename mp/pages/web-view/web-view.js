
Page({

  data: {
    gotoUrl:""
  },

  onLoad: function (options) {
    this.setData({ gotoUrl: options.url })
  }
  
})