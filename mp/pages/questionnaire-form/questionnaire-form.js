const app = getApp()    //APP实例
var commonFn = require('../../utils/common.js');

Page({

    data: {
        imgUrl: app.globalData.imgUrl,
        formPop:false,
        formData:{
            gender:{
                rowClass:'trhee',
                name:'性别',
                tip:'请选择性别',
                answer:'',
                options:[
                    {name:'男',code:'1'},
                    { name: '女', code: '2' },
                    { name: '第三性', code: '4' },
                ]
            },
            age: {
                rowClass: 'trhee',
                name: '年龄',
                tip: '请选择年龄段',
                answer: '',
                options: [
                    { name: '10-20', code: '1' },
                    { name: '21-30', code: '2' },
                    { name: '31-40', code: '3' },
                    { name: '41-50', code: '4' },
                    { name: '51-60', code: '5' },
                    { name: '≥61', code: '6' },
                ]
            },
            liveSituation: {
                rowClass: 'two',
                name: '居住情况',
                tip: '请选择居住情况',
                answer: '',
                options: [
                    { name: '同居', code: '1' },
                    { name: '独处', code: '2' },
                ]
            },
            // liveCity: {
            //     rowClass: 'two',
            //     name: '居住城市',
            //     tip: '请选择居住城市',
            //     answer: '',
            //     options: [
            //         { name: '一线', code: '1' },
            //         { name: '二线', code: '2' },
            //         { name: '三线', code: '3' },
            //         { name: '县城', code: '4' },
            //     ]
            // },
            jobSituation: {
                rowClass: 'two',
                name: '职业现状',
                tip: '请选择职业现状',
                answer: '',
                options: [
                    { name: '单位公职', code: '1' },
                    { name: '公司职员', code: '2' },
                    { name: '给自己打工', code: '3' },
                    { name: '无业', code: '4' },
                ]
            },
            income: {
                rowClass: 'two',
                name: '月收入',
                tip: '请选择月收入',
                answer: '',
                options: [
                    { name: '5k以下', code: '1' },
                    { name: '5-8k', code: '2' },
                    { name: '8-16k', code: '3' },
                    { name: '16k以上', code: '4' },
                ]
            }
        },
        contactsPhone:'',
        resultData :null,
        gotoUrl:null
    },

    onLoad: function (options) {
        var resultData = wx.getStorageSync('questionnaireResult'); //获取缓存信息
        this.setData({ resultData: resultData })
        console.log(resultData)
        this.getDetailFn();
    },

    //获取公众号链接
    getDetailFn(){
        app.requestFn({
            url: `/api/config/mpLink`,
            success: (res) => {
                console.log('成功链接',res.data)
                this.setData({ gotoUrl: res.data.data })
                //wx.showToast({ title: '提交成功', icon: 'success', duration: 3000 });
                // setTimeout(()=>{
                //     wx.navigateTo({ url: '/pages/web-view/web-view?url=http://www.baidu.com' })
                // },2000)

            }
        })
        
    },

    //预览图片
    previewImgFn(e){
        var img = e.currentTarget.dataset.img
        app.previewImgFn(img, [img])
    },

    //选择单选按钮
    changeRadioFn(e) {
        var changeObj = e.currentTarget.dataset.obj
        var answerCode = e.currentTarget.dataset.code
        this.setData({ [changeObj]: answerCode })
    },

    //输入手机号
    changePhoneFn(e){
        var phone = e.detail.value
        //console.log(phone)
        this.setData({ contactsPhone : phone })
    },

    //提交表单
    submitFn(e){
        var _this = this
        var formData = this.data.formData
        var phone = this.data.contactsPhone
        var formResult = {}
        for (var key in formData) {
            formResult[key] = formData[key].answer
        }
        // if (!commonFn.phoneregFn(phone) && phone){
        //     wx.showToast({ title: '请输入正确格式的手机号', icon: 'none', duration: 3000 });
        //     return;
        // }
        formResult['id'] = this.data.resultData.id;
        formResult['phone'] = phone;
        console.log('formResult', formResult)
        
        app.requestFn({
            url: `/api/userExam/submitBaseInfo`,
            method: 'POST',
            data: formResult,
            success: (res) => {
                console.log('成功')
                //this.setData({ formPop : true })
                if (_this.data.resultData.psqi>=8){
                    wx.showToast({ title: '提交成功', icon: 'success', duration: 3000 });
                    setTimeout(() => {
                        wx.navigateTo({ url: '/pages/web-view/web-view?url=' + _this.data.gotoUrl })
                    }, 2000)
                }else{
                    this.setData({ formPop: true })
                }
            }
        })

    }
  
})