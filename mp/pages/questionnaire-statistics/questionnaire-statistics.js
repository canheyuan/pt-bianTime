const app = getApp()    //APP实例
const Charts = require('../../utils/wxcharts.js');
//charts API:https://blog.csdn.net/Che_rish/article/details/78932945
Page({

    data: {
        imgUrl: app.globalData.imgUrl,
        chartsWidth:375,
        chartsHeight:180,
        detailData:null
    },

    onLoad: function (options) {
        var w = wx.getSystemInfoSync().windowWidth;
        this.setData({
            chartsWidth :w-10
        })

        this.getchartsDataFn(()=>{
            this.chartsReachFn();
        });
    },

    //刷新所有统计图
    chartsReachFn(){
        this.sexCharts()
        this.ageCharts()
        this.liveSituationCharts()
        this.jobSituationCharts()
        this.incomeCharts()
    },

    //获取统计数据
    getchartsDataFn(cbOk){
        app.requestFn({
            url: `/api/statistics/data`,
            success: (res) => {
                console.log('统计数据',res.data)
                this.setData({ detailData : res.data.data })
                cbOk && cbOk(res.data)
            }
        })
    },

    // 性别统计图
    sexCharts() {
        var chartsData = this.data.detailData.gender
        var categoriesList = []
        var dataList = []
        for (var key in chartsData){
            switch(key){
                case '1':
                    categoriesList.push('男')
                    break;
                case '2':
                    categoriesList.push('女')
                    break;
                case '3':
                    categoriesList.push('第三性')
                    break;
            }
            dataList.push(chartsData[key])
        }
        new Charts({
            canvasId: 'sexCharts',
            type: 'column',
            categories: categoriesList,
            series: [{
                pointColor: '#ffffff',
                name: '性别 PSQI 指标统计图',
                data: dataList
            },],
            yAxis: {
                title: 'PSQI(分)',
                fontColor:'#ffffff',
                titleFontColor:'#ffffff',
                min:0,
                max:21,
                format: function (val) {
                    return val;
                }
            },
            xAxis:{
                title: '',
                fontColor: '#ffffff',
            },
            extra:{
                legendTextColor:'#ffffff',
                column:{
                    width:15
                },
                radar:{
                    labelColor:'#ff0000'
                }
            },
            width: this.data.chartsWidth,
            height: this.data.chartsHeight
        });
    },

    //年龄
    ageCharts(){
        var chartsData = this.data.detailData.age
        var categoriesList = []
        var dataList = []
        for (var key in chartsData) {
            switch (key) {
                case '1':
                    categoriesList.push('10-20')
                    break;
                case '2':
                    categoriesList.push('21-30')
                    break;
                case '3':
                    categoriesList.push('31-40')
                    break;
                case '4':
                    categoriesList.push('41-50')
                    break;
                case '5':
                    categoriesList.push('51-60')
                    break;
                case '6':
                    categoriesList.push('≥61')
                    break;
            }
            dataList.push(chartsData[key])
        }
        new Charts({
            canvasId: 'ageCharts',
            type: 'column',
            categories: categoriesList,
            series: [{
                color:'#85cd85',
                pointColor: '#ffffff',
                name: '年龄段 PSQI 指标统计图',
                data: dataList
            },],
            yAxis: {
                title: 'PSQI(分)',
                fontColor: '#ffffff',
                titleFontColor: '#ffffff',
                min: 0,
                max: 21,
                format: function (val) {
                    return val;
                }
            },
            xAxis: {
                title: '',
                fontColor: '#ffffff',
            },
            extra: {
                legendTextColor: '#ffffff',
                column: {
                    width: 15
                },
                radar: {
                    labelColor: '#85cd85'
                }
            },
            width: this.data.chartsWidth,
            height: this.data.chartsHeight
        });
    },

    //居中情况
    liveSituationCharts() {
        var chartsData = this.data.detailData.liveSituation
        var categoriesList = []
        var dataList = []
        for (var key in chartsData) {
            switch (key) {
                case '1':
                    categoriesList.push('同居')
                    break;
                case '2':
                    categoriesList.push('独处')
                    dataList.push(key)
                    break;
            }
            dataList.push(chartsData[key])
        }
        new Charts({
            canvasId: 'liveSituationCharts',
            type: 'column',
            categories: categoriesList,
            series: [{
                color: '#f2b579',
                pointColor: '#ffffff',
                name: '居住情况 PSQI 指标统计图',
                data: dataList
            },],
            yAxis: {
                title: 'PSQI(分)',
                fontColor: '#ffffff',
                titleFontColor: '#ffffff',
                min: 0,
                max: 21,
                format: function (val) {
                    return val;
                }
            },
            xAxis: {
                title: '',
                fontColor: '#ffffff',
            },
            extra: {
                legendTextColor: '#ffffff',
                column: {
                    width: 15
                },
                radar: {
                    labelColor: '#f2b579'
                }
            },
            width: this.data.chartsWidth,
            height: this.data.chartsHeight
        });
    },

    //职业现状
    jobSituationCharts() {
        var chartsData = this.data.detailData.jobSituation
        var categoriesList = []
        var dataList = []
        for (var key in chartsData) {
            switch (key) {
                case '1':
                    categoriesList.push('单位公职')
                    break;
                case '2':
                    categoriesList.push('公司职员')
                    break;
                case '3':
                    categoriesList.push('给自己打工')
                    break;
                case '4':
                    categoriesList.push('无业')
                    break;
            }
            dataList.push(chartsData[key])
        }
        new Charts({
            canvasId: 'jobSituationCharts',
            type: 'column',
            categories: categoriesList,
            series: [{
                color: '#67b7e5',
                pointColor: '#ffffff',
                name: '职业现状 PSQI 指标统计图',
                data: dataList
            },],
            yAxis: {
                title: 'PSQI(分)',
                fontColor: '#ffffff',
                titleFontColor: '#ffffff',
                min: 0,
                max: 21,
                format: function (val) {
                    return val;
                }
            },
            xAxis: {
                title: '',
                fontColor: '#ffffff',
            },
            extra: {
                legendTextColor: '#ffffff',
                column: {
                    width: 15
                },
                radar: {
                    labelColor: '#f2b579'
                }
            },
            width: this.data.chartsWidth,
            height: this.data.chartsHeight
        });
    },

    //收入情况
    incomeCharts() {
        var chartsData = this.data.detailData.income
        var categoriesList = []
        var dataList = []
        for (var key in chartsData) {
            switch (key) {
                case '1':
                    categoriesList.push('5k以下')
                    break;
                case '2':
                    categoriesList.push('5-8k')
                    break;
                case '3':
                    categoriesList.push('8-16k')
                    break;
                case '4':
                    categoriesList.push('16k以上')
                    break;
            }
            dataList.push(chartsData[key])
        }
        new Charts({
            canvasId: 'incomeCharts',
            type: 'column',
            categories: categoriesList,
            series: [{
                color: '#f7907c',
                pointColor: '#ffffff',
                name: '收入情况 PSQI 指标统计图',
                data: dataList
            },],
            yAxis: {
                title: 'PSQI(分)',
                fontColor: '#ffffff',
                titleFontColor: '#ffffff',
                min: 0,
                max: 21,
                format: function (val) {
                    return val;
                }
            },
            xAxis: {
                title: '',
                fontColor: '#ffffff',
            },
            extra: {
                legendTextColor: '#ffffff',
                column: {
                    width: 15
                },
                radar: {
                    labelColor: '#f7907c'
                }
            },
            width: this.data.chartsWidth,
            height: this.data.chartsHeight
        });
    }
})