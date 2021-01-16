// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://nsa.xjtu.edu.cn/sgyb/jspj
// @grant        none
// ==/UserScript==
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


const setCookie = (cname, cvalue) => {
    document.cookie = cname + "=" + cvalue;
}

const setTCookie = (tJudged, curTNum) => {
    setCookie(teacherJudged, tJudged);
    setCookie(currentNumber, curTNum);
}


const getCookie = (cname) => {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}

const getTCookie = () => {
    return [getCookie(teacherJudged), getCookie(currentNumber)];
}


const startFromTCookie = () => {
    let [vt, vn] = getTCookie();
    if (vt != "" && vn != "") {
        return [parseInt(vt), parseInt(vn)];
    } else {
        setTCookie(0, parseInt(randomNum(0, parseInt(totalTNum / willTNum))));
        return startFromTCookie();
    }
}


const calc = (num) => {
    return [parseInt(num / titlesPerPage) + 1, num % titlesPerPage];
}



// 2021-01-14 -- 2021-01-16 windows 10 chrome 无法解决输入页码后让它跳转到对应页码。绕过这个方法，还是用老办法，一个个点呗。只能寄希望于后人可以解决这个问题了。
// 不嫌弃鄙人的话加个QQ：1172765646 或去 github 找 magictomagic 留个言，告诉我是如何解决的。
// const gotoPage = (page) => {
//     let ele = document.getElementsByTagName('input')[12];
//     let evt = new Event('input');
//     ele.value = page;
//     ele.dispatchEvent(evt);
// }


(async() => {
    'use strict';

    setTimeout(() => {
        console.log('超时了，大概率不是你电脑卡就是网卡，自己调一下参数吧');
        window.location.reload();
    }, 70000);

    await sleep(2500);
    document.getElementsByTagName("button")[4].click();

    await sleep(4500);
    document.getElementsByTagName("button")[10].click();

    await sleep(1000);
    let [valueTJ, valueCN] = startFromTCookie(); // teacherJudged, currentNumber
    totalTNum = totalTNum - valueTJ;
    valueCN = parseInt(randomNum(valueCN, valueCN + parseInt(totalTNum / willTNum)))
    let [page, column] = calc(valueCN),
        curPage = 1,
        pages = document.getElementsByClassName("el-pager")[1].children;
    console.log("已评价：" + valueTJ + "人 | " + "当前评价第：" + valueCN + "位 || " + "page: " + page + " | column: " + column);
    if (willTNum < valueTJ) {
        alert('您已评价完了，请关闭脚本后刷新页面')
    }

    if (page >= 1 && page <= 6) {
        pages[page - 1].click();
    } else if (page > 6 && page <= parseInt(totalTNum / titlesPerPage / 2) + 1) {
        pages[5].click();
        curPage = 6;
        await sleep(600);
        while (Math.abs(page - curPage) > 2) {
            pages[6].click();
            curPage = curPage + 2;
            await sleep(600);
        }
        [].slice.call(pages).forEach((ele) => ele.innerText == page ? ele.click() : 0);
    } else {
        pages[7].click();
        curPage = Math.ceil(totalTNum / titlesPerPage);
        await sleep(600);
        if (page >= curPage - 5) {;
        } else {
            pages[2].click();
            curPage = curPage - 5;
            while (Math.abs(page - curPage) > 2) {
                pages[2].click();
                curPage = curPage - 2;
                await sleep(600);
            }
        }
        [].slice.call(pages).forEach((ele) => ele.innerText == page ? ele.click() : 0);
    }
    await sleep(600);
    let columns = document.getElementsByTagName("tbody")[1].children;
    columns[column].click();

    await sleep(800); // 不知道为什么这一句报错，不过问题不大
    try {
        document.getElementsByClassName("el-input el-input--medium el-input--suffix")[1].click();
    } catch (e) {} finally {}


    await sleep(800);
    try {
        document.getElementsByClassName("el-scrollbar__view el-select-dropdown__list")[4].children[parseInt(randomNum(0, 3))].click(); // children[0, 4]
    } catch (e) {} finally {}


    await sleep(800);

    document.getElementsByClassName("el-button el-button--primary el-button--medium")[3].click();

    valueTJ++;
    setTCookie(valueTJ, valueTJ * parseInt(totalTNum / willTNum));
    await sleep(2000);
    window.location.reload();

})();