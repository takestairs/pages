// 用来生成 labels 数组的工具
export default {
    /**
     * 获取带年份、月份的 Labels，包括当前月
     * @param {number} count lable总数（结果数组长度）
     * @param {string} yearPostfix 年份后的后缀
     * @param {string} monthPostfix 月份后的后缀
     * @returns {string[]}
     */
    getYearMonthLabels(count, yearPostfix, monthPostfix, yearPrefix, monthPrefix){
        // 1. 获取月份数组
        let months = this.getMonthsIncludeNow(count)
        this.addFix(months,monthPrefix,monthPostfix)
        // 2. 获取年份数组
        let years = this.getYearsIncludeNow(count)
        this.addFix(years,yearPrefix,yearPostfix)
        // 拼接月份和年份
        return this.appendArray(years,months)
    },

    /**
     * 获取包括现在开始的、指定个数的月份，返回数组
     * @param {number} count 
     * @returns {NumberArray}
     */
    getMonthsIncludeNow(count){
        let tempNum = this._getNowMonthNum()
        let res = []
        for(let i = 1;i<=count;i++){
            res.push(tempNum)
            tempNum = this._getNextMonthNum(tempNum)
        }
        return res
    },
    /**
     * 获取包括现在开始的、指定个数的年份，返回数组
     * @param {number} count 
     * @returns {number[]}
     */
    getYearsIncludeNow(count){
        let year = this._getNowYearNum()
        let month = this._getNowMonthNum()
        let res = []
        for(let i = 1;i<=count;i++){
            res.push(year)            
            month++
            if(month>12){
                month = 1
                year++
            }
        }
        return res
    },
    /**
     * 获取带有默认值、指定值、元素个数的数组
     * @param {number} count 元素数
     * @param {*} defaultValue 默认值
     * @param {number[]} specialIndexs 特定下标的数组
     * @param {*} specialValues 特定下标对应的特定值
     * @returns {any[]}
     */
    getArray(count, defaultValue, specialIndexs, specialValues){
        let res = []
        for(let i=1;i<=count;i++){
            res.push(defaultValue)
        }
        for(let i in specialIndexs){
            res[specialIndexs[i]] = specialValues[i]
        }
        return res
    },

    /**
     * 直接给数组中的元素添加前后缀，无返回值
     * @param {any[]} array 数组
     * @param {string} prefix 后缀
     * @param {string} postfix 前缀
     * @param {number} startIndex 起始下标，负数或未给出时取0
     * @param {number} endIndex 结束下标。未给出或超过数组上限会取数组上限
     */
    addFix(array, prefix, postfix, startIndex, endIndex){
        // 前后缀皆空，无逻辑需要处理
        if(!prefix && !postfix){
            return
        }
        prefix = prefix || ""
        postfix = postfix || ""
        if(startIndex == undefined || startIndex < 0){
            startIndex = 0
        }
        if(endIndex == undefined || endIndex > array.length){
            endIndex = array.length-1
        }
        for(let i = startIndex; i<=endIndex; i++){
            array[i] = prefix+String(array[i])+postfix            
        }
    },
    /**
     * 拼接数组中的元素
     * @param {T[]} fommerArray 在前的数组
     * @param {T[]} latterArray 在后的数组
     * @return {T[]}
     */
    appendArray(fommerArray, latterArray){
        let res = []
        for(let i = 0; i<fommerArray.length; i++){
            res.push(fommerArray[i]+latterArray[i])
        }
        return res
    },


    /**
     * 获取现在的月份
     * @returns {number}
     */
    _getNowMonthNum(){
        return new Date().getMonth()+1
    },
    /**
     * 获取下一月的月份
     * @param {number} nowNum 
     * @returns {number}
     */
    _getNextMonthNum(nowNum){
        return nowNum%12 +1
    },
    /**
     * 获取现在的年份
     * @returns {number}
     */
    _getNowYearNum(){
        return new Date().getFullYear()
    }
}