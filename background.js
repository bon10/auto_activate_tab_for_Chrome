// デフォルトは 5分に1回のタブ切り替え
var delay_seconds =  60 * 5;

// タブ
var tabs;
var tab_num;
var current_num = 0;
var timer;
// フロントからのリクエストでバックグラウンドでの自動タブ遷移を開始
// この時点でタブには自動遷移したい各Webサイトが開かれていること
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    switch(request.action) {
      case 'start':
      console.log(request);
      // 時間の設定があれば上書き
        if(request.time){
          delay_seconds = request.time;
        }
        console.log("間隔：" + delay_seconds + "秒");
        // 処理実行
        getTabs(changeTabs);
        break;
      case 'stop':
        clearTimeout(timer);
        console.log("stop!!");
        break;
    }
});


var getTabs = function(done){
  console.log("=== start get tabs");
  // 現在のwindow_idを取得
  var id = chrome.windows.WINDOW_ID_CURRENT;
  chrome.tabs.query({
      currentWindow: true
    }, function(get_tabs){
      tabs = get_tabs;
      tab_num = tabs.length;
      console.log("タブの数：" + tab_num);
      done();
    }
  );
}

var changeTabs = function(){
  console.log("=== start change tabs");
  // タブ遷移
  chrome.tabs.update(tabs[current_num].id,
    {
      selected: true,
      url: tabs[current_num].url
    }
  );
  current_num++;
  if(current_num >= tab_num){
    current_num = 0;
  }
  timer = setTimeout(changeTabs, 1000 * delay_seconds);
  console.log("=== end change tabs");
}

// タブが追加されたときの処理
chrome.tabs.onCreated.addListener(function(tab) {
  console.log("create new tab");
  getTabs(function(){});
});


// タブが削除されたときの処理
chrome.tabs.onRemoved.addListener(function(tab) {
  console.log("create new tab");
  getTabs(function(){});
});
