//TODO :
// 根本的にonMessageのイベントにおいて、渡された値で判断するのではなく、
// 渡されたwindowのidで現在の状態をchrome.storage.localから取得し、
// 遷移させるかどうかを判断させなければならない
// (今のだと別ウィンドウで自動遷移を実行すると、処理内容が全部上書きされてしまう)

// デフォルトは 5分に1回のタブ切り替え
var delay_seconds =  60 * 5;

// タブ
var tabs;
var tab_num;
var current_num = 0;
var timer;
var obj;

// フロントからのリクエストでバックグラウンドでの自動タブ遷移を開始
// この時点でタブには自動遷移したい各Webサイトが開かれていること
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    switch(request.action) {
      case 'start':
        obj = request.params;
        console.log(obj);
        // 現在選択されているウィンドウを開いて、違うwindow idであれば、
        // なにもしない
        chrome.windows.getCurrent(function(win){
          console.log("current window_id:" + win.id);
          if(win.id != obj.id){
            return;
          }
        });
        // 時間の設定があれば上書き
        if(obj.timer_min){
          delay_seconds = obj.timer_min * 60;
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
  chrome.tabs.query({
      currentWindow: true
    }, function(get_tabs){
      tabs = get_tabs;
      tab_num = tabs.length;
      console.log("タブ：" + tabs);
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
  chrome.windows.getCurrent(function(win){
    console.log("current window_id:" + win.id);
    if(win.id == obj.id){
      getTabs(function(){});
    }
  });
});


// タブが削除されたときの処理
chrome.tabs.onRemoved.addListener(function(tab) {
  console.log("remove tab");
  chrome.windows.getCurrent(function(win){
    console.log("current window_id:" + win.id);
    if(win.id == obj.id){
      getTabs(function(){});
    }
  });
});

chrome.tabs.onDetached.addListener(function(tab) {
  console.log("detached tab");
  chrome.windows.getCurrent(function(win){
    console.log("current window_id:" + win.id);
    if(win.id == obj.id){
      getTabs(function(){});
    }
  });
});

chrome.tabs.onAttached.addListener(function(tab) {
  console.log("attached tab");
  chrome.windows.getCurrent(function(win){
    console.log("current window_id:" + win.id);
    if(win.id == obj.id){
      getTabs(function(){});
    }
  });
});

