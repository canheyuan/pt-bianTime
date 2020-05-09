const app = getApp()    //APP实例

var formData2 = { "answers": { "1": "2", "2": "14", "3": "18", "4": "30", "6": "34", "7": "40", "8": "44", "10": "46", "11": "50", "12": "54", "14": "60", "15": "62", "16": "68", "18": "70", "19": "74", "20": "78", "21": "82", "22": "86" }, "userId": 123 }

Page({

    data: {
        imgUrl: app.globalData.imgUrl,
        faqData: null,  //题目信息
        userInfo:null,  //用户信息
        progress: {     //进度条信息
            total:0,    //总数
            num:0,      //已做题目数
            width:0     //进度条宽度
        },


        pickerTime:{
            sleepStart: ['21', '22', '23', '00', '01', '02'],
            sleepEnd: ['05', '06', '07', '08', '09', '10'],
            sleepTime: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15'],
            sleepMin1: ['00', '10', '20', '30', '40', '50'],
            sleepMin2: ['00', '10', '20', '30']
        },
        affectFactor:''
    },

    onLoad: function (options) {
        // this.getQuestionDataFn()
        // return
        //加载题目列表
        var faqData = wx.getStorageSync('faqData') ? wx.getStorageSync('faqData'):null
        var userInfo = wx.getStorageSync('userInfo'); //获取缓存用户信息
        this.setData({userInfo : userInfo })
        if (faqData){
            this.setData({ 
                faqData: faqData,
                ['progress.total']: faqData.length
            })
        }else{
            this.getQuestionDataFn()
        }
    },

    //文本框失去焦点时
    affectFactorFn(e){
        this.setData({
            affectFactor : e.detail.value
        })
    },

    //获取题目信息
    getQuestionDataFn(){
        var pickerTime = this.data.pickerTime
        app.requestFn({
            url:`/api/question/list`,
            success:(res)=>{
                //console.log('获取题目信息:',res.data)
                var faqData = res.data.data
                faqData.forEach((item, i)=>{
                    switch(i){
                        case 0:
                            item.isChangeTime = true
                            item.picker = [pickerTime.sleepStart, pickerTime.sleepMin1]
                            break;
                        case 2:
                            item.isChangeTime = true
                            item.picker = [pickerTime.sleepEnd, pickerTime.sleepMin1]
                            break;
                        case 3:
                            item.isChangeTime = true
                            item.picker = [pickerTime.sleepTime, pickerTime.sleepMin1]
                            break;
                    }
                })
                wx.setStorageSync('faqData', faqData)
                this.setData({
                    faqData: faqData,
                    ['progress.total']: faqData.length
                })
            }
        })
    },

    //改变第一列时执行的函数
    column1ChangeFn(e) {
        if (e.detail.column>0){return;} //第一列才执行下面函数
        var colVal = e.detail.value
        var index = e.currentTarget.dataset.index
        var faqData = this.data.faqData
        var pickerTime = this.data.pickerTime
        if(index==0 || index==2){
            console.log(colVal,faqData[index].picker[0].length - 1)
            if (colVal == faqData[index].picker[0].length-1){   //判断选中最后一个
                faqData[index].picker[1] = pickerTime.sleepMin2
            }else{
                faqData[index].picker[1] = pickerTime.sleepMin1
            }
        }
        this.setData({  faqData: faqData })
    },

    //改变选择时间
    changeTimeFn(e) {
        var arrIndex = e.detail.value
        var index = e.currentTarget.dataset.index
        var faqData = this.data.faqData
        var pickerTime = faqData[index].picker
        var isAdd = false

        faqData[index].changeVal = `${pickerTime[0][arrIndex[0]]}:${pickerTime[1][arrIndex[1]]}`
        faqData[index].optionList.forEach(item => {
            if (faqData[index].changeVal == item.content) {
                faqData[index].answerId = item.id
                if (!faqData[index].isAnswer){
                    faqData[index].isAnswer = true
                    isAdd = true
                }
            }
        })

        if (isAdd) {
            var progressData = this.data.progress
            progressData.num = progressData.num + 1
            progressData.width = parseInt(100 * (progressData.num) / progressData.total)
            this.setData({ progress: progressData })
        }
        this.setData({ faqData: faqData })
        if (faqData[0].isAnswer && faqData[2].isAnswer && faqData[3].isAnswer){
            this.verifyTimeFn()
        }
        
    },

    //计算选择时间是否不符合要求，弹出提示
    verifyTimeFn(){
        var faqData = this.data.faqData
        faqData.forEach((item,i)=>{
            if(i==0 || i==2 || i==3){
                var hour = parseInt(item.changeVal.substring(0, 2))
                var min = parseInt(item.changeVal.substring(3, 5), 10)
                if (i == 0) { hour = hour > 20 ? hour - 24 : hour}
                item.minTime = hour * 60 + min
                console.log('hour',hour)
            }
        })
        var returnB = true
        if (faqData[2].minTime - faqData[0].minTime < faqData[3].minTime){
            faqData[0].tipClass = 'tip_red'
            faqData[2].tipClass = 'tip_red'
            faqData[3].tipClass = 'tip_red'
            wx.showToast({ title: '睡眠时间与入睡起床的时间不符合，请重新选择', icon: 'none', duration: 3000 })
            wx.pageScrollTo({
                scrollTop: 0
            })
            returnB = false
        }else{
            faqData[0].tipClass = ''
            faqData[2].tipClass = ''
            faqData[3].tipClass = ''
        }
        this.setData({ faqData: faqData })
        return returnB;
    },


    //选择单选按钮
    changeRadioFn(e){
        var changeObj = e.currentTarget.dataset.obj
        var answerId = e.currentTarget.dataset.id
        var firstIndex = e.currentTarget.dataset.first_index
        var firstItem = this.data.faqData[firstIndex]
        var isAdd = false
        if (firstIndex == 7 && answerId=='69'){ //如果点击的事第八题第一个选项，就把描述清空
            this.setData({
                affectFactor: ''
            })
         }
        if (!firstItem.subList) {    //当没有子选项
            if (!firstItem.answerId) {
                isAdd = true
            }
        }
        this.setData({ [changeObj]: answerId })
        
        if (firstItem.subList && !firstItem.isAnswer) {    //还没回答
            var answerNum = 0
            firstItem.subList.forEach((item) => {
                if (item.answerId) {
                    answerNum = answerNum + 1
                }
            })
            if (answerNum == firstItem.subList.length) {
                firstItem.isAnswer = true
                isAdd = true
            }
        }

        if (isAdd) {
            var progressData = this.data.progress
            progressData.num = progressData.num + 1
            progressData.width = parseInt(100 * (progressData.num) / progressData.total)
            this.setData({
                ['faqData[' + firstIndex + ']']: firstItem,
                progress: progressData
            })
        }
    },

    //计算做题数量,判断做题数是否加1
    calculateFn(firstItem, firstIndex, changeObj, answerId){
        
        var firstItem = firstItem
        
    },

    //提交按钮
    submitFn(){
        var progressData = this.data.progress

        // app.requestFn({
        //     url: `/api/userExam/submitAnswer`,
        //     method: 'POST',
        //     data: formData2,
        //     success: (res) => {
        //         wx.setStorageSync('questionnaireResult', res.data.data); //设置缓存信息
        //         wx.navigateTo({ url: '/pages/questionnaire-result/questionnaire-result' })
        //     }
        // })
        // return;

        if (progressData.num == progressData.total){    //判断是否全部题目做完

            if(!this.verifyTimeFn()){ return; }

            console.log('提示错误，还继续执行')
            //收集提交题目信息
            var faqData = this.data.faqData
            var formData = {
                "answers": {},
                "affectFactor": this.data.affectFactor,
                "userId": this.data.userInfo.id
            }
            faqData.forEach(item=>{
                if (!item.subList){
                    formData.answers[item.id] = item.answerId.toString()
                }else{
                    item.subList.forEach(item2=>{
                        formData.answers[item2.id] = item2.answerId.toString()
                    })
                }
            })
            console.log('formData',formData)
            app.requestFn({
                url: `/api/userExam/submitAnswer`,
                method: 'POST',
                data: formData,
                success: (res) => {
                    wx.setStorageSync('questionnaireResult', res.data.data); //设置缓存信息
                    wx.navigateTo({ url: '/pages/questionnaire-result/questionnaire-result' })
                }
            })

        }else{
            wx.showToast({ title: '请做完所有题目,评估更准', icon: 'none', duration: 2000 })
        }
    }

})