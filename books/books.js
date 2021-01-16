// ==UserScript==
// @name         xjtu-4-100
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  100本书评价
// @author       ring
// @match        http://nsa.xjtu.edu.cn/sgyb/sdpjgl
// @grant        none
// ==/UserScript==

const to_array = (arr) => [].slice.call(arr);

function parse_data(content) {
  const items = content.split('\n\n')
  return items.map((item) => {
    const info = item.split('\n')
    return {
      title: info[0],
      comment: info.slice(1).join('\n')
    }
  })
}

function fill_item(item, data) {
  const title = item.getElementsByClassName('sdtitle')[0].innerHTML
  const commentBtn = item.getElementsByClassName('el-icon-chat-line-round')[0]
  const commentInfo = data.filter(it => title.includes(it.title));
  if (commentInfo.length == 1) {
    commentBtn.click();
    setTimeout(() => {
      const commentContentEle = document.getElementsByClassName('el-textarea el-input--medium el-input--suffix')
      commentContentEle[0].children[0].value = commentInfo[0].comment
      // 点击确认的，先注释掉
      setTimeout(() => document.getElementsByClassName('el-button el-button--primary el-button--medium')[3].click(), 500)
    }, 2000)
  }
}

(function() {
  'use strict';

  const popWindow = document.createElement('div');
  const textarea = document.createElement('textarea');
  const button = document.createElement('button');
  const tips = document.createElement('div')
  const progress = document.createElement('div')

  textarea.setAttribute('style', 'display: block;')
  button.innerHTML = '开始填写评价';
  tips.innerHTML = `
注意事项：
1. 数据：书名一行，紧接着书评，为完整的一项数据，使用一行空白来区分数据块
2. 操作：将数据填写完毕后点击按钮，一页填写完毕后，切换下一页，再次点击（如果数据没有，再次填写即可）
`
  progress.style.backgroundColor = 'red'

  popWindow.appendChild(textarea);
  popWindow.appendChild(button);
  popWindow.appendChild(tips);
  popWindow.appendChild(progress)

  popWindow.style.position = 'fixed'
  popWindow.style.top = '100px'
  popWindow.style.left = '100px'
  popWindow.style.backgroundColor = 'white';
  popWindow.style.width = '200px'

  document.body.appendChild(popWindow);

  button.onclick = () => {
    const data = parse_data(textarea.value);
    console.log(data);
    // document.getElementsByClassName('page-tabs')[0].children[1].click()
    // setTimeout(() => to_array(document.getElementsByClassName('sdwrap')).map(item => fill_item(item, data)), 1000)
    to_array(document.getElementsByClassName('sdwrap')).map((item, index, arr) =>
      setTimeout(() => {
        fill_item(item, data)
        progress.innerHTML = index + 1 + ' / ' + arr.length;
      }, 5000 * index)
    )
  }
})();
