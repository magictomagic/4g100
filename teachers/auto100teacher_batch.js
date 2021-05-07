// http://nsa.xjtu.edu.cn/sgyb/jspj
// 同步信息后，请手动评价辅导员
var teacherJudged = "tJudged",
    currentNumber = "curTNum",
    totalTNum = 1674,
    titlesPerPage = 10,
    willTNum = 108; // 默认填108将


const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}


function randomNum(minNum, maxNum) {
    switch (arguments.length) {
        case 1:
            return parseInt(Math.random() * minNum + 1, 10);
            break;
        case 2:
            return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
            break;
        default:
            return 0;
            break;
    }
}

const calc = (num) => {
    return [parseInt(num / titlesPerPage) + 1, num % titlesPerPage];
}

(function() {
    'use strict';
    const popWindow = document.createElement('div');
    const button = document.createElement('button');
    const tips = document.createElement('div')
    const progress = document.createElement('div')
    button.innerHTML = '随机认识';
    tips.innerHTML = `
  注意事项：
  1. 选择[最大条数]/页
  2. 等待页面加载完
  3. 点击【随机认识】按钮
  4. 【提交】
  `
    progress.style.backgroundColor = 'red'
    popWindow.appendChild(button);
    popWindow.appendChild(tips);
    popWindow.appendChild(progress)
    popWindow.style.position = 'fixed'
    popWindow.style.top = '100px'
    popWindow.style.left = '10px'
    popWindow.style.backgroundColor = 'transparent';
    popWindow.style.width = '200px'
    document.body.appendChild(popWindow);

    button.onclick = () => {
        document.querySelectorAll('form')
                .forEach(ele => {
                    ele.querySelector('div.el-select--medium div.el-input > input').click()
                })
        document.querySelectorAll('div.el-select-dropdown.el-popper')
                .forEach(ele => {
                    ele.querySelector('ul.el-select-dropdown__list').children[randomNum(0, 4)].click()
                    
                })
        document.querySelectorAll('form')
                .forEach(ele => {
                    ele.querySelector('div.td.operation button span').click()
                })
    }


})();