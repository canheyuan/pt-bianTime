const app = getApp()    //APP实例

Page({

    data: {
        imgUrl: app.globalData.imgUrl,
        resultData: null,

        resultDes:{
            ans1: ['优', '良', '中', '差'],
            ans2: ['快', '一般', '较长', '很长'],
            ans3: ['充分', '可以', '稍差', '较差'],
            //ans4: ['＞7h', '6~7h（不含6h）', '5~6h（含6h）', '＜5h'],
            ans5: ['没有', '可能有', '有点', '有'],
            ans6: ['没有', '有', '经常', '必须'],
            ans7: ['没有', '可能有', '有点', '有'],
        }
    },

    onLoad: function (options) {
        var resultData = wx.getStorageSync('questionnaireResult'); //获取缓存信息
        resultData.desScore = parseInt(100*resultData.psqi / 21)
        //console.log('resultData', resultData);
        this.setData({ resultData: resultData })
    }
})