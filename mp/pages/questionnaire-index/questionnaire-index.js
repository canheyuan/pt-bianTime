const app = getApp()    //APP实例

Page({

    data: {
        imgUrl: app.globalData.imgUrl,
        sqPopShow:false,
    },

    onLoad: function (options) {
        
    },
    
    onShow(){
        app.getLoginCodeFn()
    },

    //判断是否有缓存，有缓存就不必再授权
    gotoDetailFn(){
        var userInfo = wx.getStorageSync('userInfo') ? wx.getStorageSync('userInfo'):null
        if (!userInfo){
            this.tipPopShowFn()
        }else{
            wx.navigateTo({
                url: '/pages/questionnaire-detail/questionnaire-detail',
            })
        }
    },

    //提示授权弹窗
    tipPopShowFn(){
       this.setData({ sqPopShow : !this.data.sqPopShow })
    },

    
    getUserInfoFn(e){
        app.getUserInfoFn(e.detail, (res) => {
            console.log('用户信息接口：', res.data)
            wx.setStorageSync('userInfo', res.data.data); //设置缓存用户信息
            wx.navigateTo({
                url: '/pages/questionnaire-detail/questionnaire-detail',
            })
        })
    },
    
    //下拉刷新
    onPullDownRefresh: function () {
        app.getLoginCodeFn()
        wx.stopPullDownRefresh(); //下拉刷新后页面上移
    },

    //用户点击右上角分享
    onShareAppMessage: function () {
        
    }
})