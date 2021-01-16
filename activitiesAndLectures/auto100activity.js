// ==UserScript==
// @name         auto100activity
// @version      0.0.2
// @namespace    http://tampermonkey.net/
// @description  正常操作，点击“在线办理”，然后躺着40分钟后，100个活动就帮你选好了。已知问题：测试活动也会给你选上去。
// @author       magictomagic
// @create       2021-01-12
// @lastmodified 2021-01-14
// @match        http://nsa.xjtu.edu.cn/apply/*
// @note         0.0.1 NaN
// @updateURL    https://raw.githubusercontent.com/magictomagic/magictomagic.github.io/master/files/tampermonkey/auto100activity.js
// @require      https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// ==/UserScript==
var vernier = 11,
    daPage = 0,
    daColumn = 0,
    count = 0;
const tips = [
    [
        "吸收新的思想与知识",
        "通过这次活动使得我们大有收获",
        "这次活动给我们带来了巨大的收获"
    ],
    [
        "有一种茅塞顿开的感觉",
        "收获的会运用到我们的日常生活学习里"
    ],
    [
        "感觉自己从中真的学到好多",
        "使我思想认识水平有了很大的提升",
        "确实有点辛苦，但收获更多",
        "为我在后续的学习方面起到了引路和指导的作用"
    ]
]

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}

function setCookie(cname, cvalue) {
    document.cookie = cname + "=" + cvalue;
}


function startFromCookie(cname) {
    let value = getCookie(cname);
    if (value != "") {
        return parseInt(value)
    } else {
        setCookie(cname, vernier);
        return parseInt(getCookie(cname));
    }
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


function jdktf() {
    return tips[0][randomNum(0, tips[0].length - 1)] + "，" + tips[1][randomNum(0, tips[1].length - 1)] + "，" + tips[2][randomNum(0, tips[2].length - 1)] + "。";
}


(async() => {
    'use strict';

    // setCookie("progress", vernier);
    let curNum = startFromCookie("progress");

    while (count < 200) {
        await sleep(3000);
        curNum = startFromCookie("progress");
        daColumn = curNum % 10;
        daPage = parseInt(curNum / 10) + 1;
        curNum++;
        setCookie("progress", curNum);
        let timeJudge = 21000 + parseInt(daPage / 2) * 900;
        console.log("timeJudge: " + timeJudge + " | cookie: " + getCookie("progress") + " | daPage: " + daPage + " | daColumn: " + daColumn);

        document.getElementsByTagName("Button")[2].click();
        await sleep(1000);

        const clickPage = (page) => {
            [].slice.call(document.getElementsByClassName("el-pager")[0].children).forEach(ele => { if (ele.innerText == page.toString()) ele.click(); });
        }

        const selectActivity = async(page, column) => { // [2, 97], [0,9]
            let curPage = 1;
            while (Math.abs(page - curPage) > 2) {
                curPage = curPage + 2;
                // clickPage(curPage);
                // console.log(curPage);
                await sleep(800);
                clickPage(curPage)
            }
            await sleep(800);
            clickPage(page);
            await sleep(800);
            document.getElementsByTagName("tbody")[0].children[column].click() //document.getElementsByTagName("tbody")[0].children[9]
                // console.log("column selected");
            await sleep(1000);

            document.getElementsByClassName("el-form-item is-required el-form-item--medium col-md-4 type-select")[0].children[1].children[0].children[0].click();
            await sleep(800);
            document.querySelectorAll(".el-scrollbar__view.el-select-dropdown__list")[3].children[randomNum(0, 9)].click() // 10 个
            await sleep(600);
            document.getElementsByClassName("el-form-item is-required el-form-item--medium col-md-4 type-select")[1].children[1].children[0].children[0].click();
            await sleep(800);
            document.getElementsByClassName("el-scrollbar__view el-select-dropdown__list")[3].children[randomNum(0, 7)].click() // 8 个
            await sleep(600);
            document.querySelectorAll("div[aria-label='checkbox-group']")[1].children[randomNum(0, 7)].click() // 8 个
            await sleep(800);
            document.getElementsByClassName("el-radio__label")[3].click()
            await sleep(3000);

            let ele = document.getElementsByTagName("textarea")[1]
                // let evt = document.createEvent('HTMLEvents')
            let evt = new Event('input')
                // evt.initEvent('input', true, true);
            ele.value = jdktf();
            ele.dispatchEvent(evt)


            await sleep(1000);
            document.getElementsByTagName("button")[4].click()
                // console.log("按钮已按")
            await sleep(3000);


            // window.history.back();
            // await sleep(800);
            window.location.reload();
        }

        //自动翻到 page 页，column 行
        selectActivity(daPage, daColumn);

        await sleep(timeJudge); // 20000 开始 自适应

        // console.log(parseInt(getCookie("progress")));
    }
})();