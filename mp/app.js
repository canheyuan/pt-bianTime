//app.js
App({
    globalData: {
        //apiUrl:'http://106.52.4.141',   //接口地址前缀
        apiUrl: 'https://yjtl.vip',   //接口地址前缀
        imgUrl: 'https://yjtl.vip/resource',     //图片地址前缀
        loginCode:null, //登录id
        userInfo: null
    },

    //统一的调用接口函数
    requestFn(option) {
        var _this = this;
        let opt = option ? option : null;
        let opt_default = {
            isLoading: true,  //是否加载loading
            isCloseLoading: true,  //是否关闭Loading
            loadTitle: '数据加载中',
            isLoginTip: false,    //是否弹出未登录提示
            isOtherTip: true,     //是否显示其他提示信息
            isSessionId: true,  //是否传sessionId
            url: '', //前缀不用写
            application: 'application/json', //另一种（application/x-www-form-urlencoded）
            method: 'GET',    //接口类型
            data: {},   //接口接受的参数
            dataType: 'json',   //数据返回类型
            success: null,  //成功回调函数
            successOther: null,  //成功回调，code不为0时调用
            fail: null,     //失败回调函数
            complete: null   //调用接口完回调函数
        };
        opt = opt ? Object.assign(opt_default, opt) : opt_default;
        if (opt.isLoading) { wx.showLoading({ title: opt.loadTitle, mask: true }); }
        wx.request({
            url: _this.globalData.apiUrl + opt.url,
            method: opt.method,
            header: {
                "Content-Type": opt.application,
                "Cache-Control": "max-age=3600",
            },
            data: opt.data,
            dataType: opt.dataType,
            success: (res) => {
                if (opt.isCloseLoading) { wx.hideLoading(); };      //判断当前接口加载完是否关闭loading,默认：否
                var apiData = res.data;
                if (apiData.code == 0) {

                    if (opt.success) { opt.success(res, opt.page) }; //成功回调函数

                }  else {
                    if (opt.isOtherTip) {
                        wx.showToast({ title: res.data.msg, icon: 'none', duration: 3000 });
                    }
                }
                opt.successOther && opt.successOther(res);

            },
            fail(res) {
                wx.hideLoading();
                wx.showToast({ title: '数据加载失败', icon: 'none', duration: 3000 });
                if (opt.failFn) { opt.failFn(res) }; //失败回调函数
            },
            complete(res) {
                if (opt.complete) { opt.complete(res) }; //失败回调函数
            }
        });
    },

    //获取loginCode
    getLoginCodeFn(cbOk){
        wx.login({
            success: res => {
                console.log(res)
                this.globalData.loginCode = res.code
                cbOk && cbOk(res.code)
             }
        })
    },

    //获取微信用户信息
    getUserInfoFn(userData, cbOk) {
        var _this = this
        this.requestFn({
            url: `/api/ma/getUserInfo`,
            application: 'application/json;charset-UTF-8',
            method: 'POST',
            data: {
                encryptedData: userData.encryptedData,
                ivStr: userData.iv,
                jsCode: _this.globalData.loginCode
            },
            success: (res) => {
                cbOk && cbOk(res)
            }
        })
    },
    // getUserInfoFn(userData,cbOk){
    //     var _this = this
    //     this.getLoginCodeFn((loginCode)=>{
    //         this.requestFn({
    //             url:`/api/ma/getUserInfo`,
    //             application:'application/json;charset-UTF-8',
    //             method:'POST',
    //             data:{
    //                 encryptedData: userData.encryptedData,
    //                 ivStr: userData.iv,
    //                 jsCode: _this.globalData.loginCode
    //             },
    //             success:(res)=>{

    //                 cbOk && cbOk(res)
    //             }
    //         })
    //     })
    // },

    onLaunch: function () {
        
    },
    
    //预览图片（当前图片地址，图片地址列表）
    previewImgFn(currentImg, imgList, cbOk) {
        wx.previewImage({
            current: currentImg,  // 当前显示图片的http链接
            urls: imgList,        // 需要预览的图片http链接列表
            success: (res) => {
                cbOk && cbOk(res);
            }
        })
    },
    
})