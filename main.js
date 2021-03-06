var window_id = "";
var obj= {};
var state_text;
var timer_min;

$(document).ready(function(){

  // window idを取る
  chrome.windows.getCurrent(function(win){
    window_id = win.id;
    obj[window_id] ={
      "id": window_id,
      "state_text": "",
      "timer_min": ""
    };
    console.log(window_id);
    chrome.storage.local.get(window_id.toString(10), function(items) {
      console.log("データ取る" );
      console.log(items[window_id]);
      if(items[window_id]){
        state_text = items[window_id].state_text;
        timer_min = items[window_id].timer_min;
        if(state_text){
          $("#state").text(state_text);
        }
        if(timer_min){
          $("#timer_min").val(timer_min);
        }
      }
    });
  });


  $("#exec").on('click',function(){
      timer_min = $("#timer_min").val();
      if(timer_min == 0 ){
        $("#state").append("時間を設定してください");
        return;
      }
      obj[window_id].state_text = "実行中";
      obj[window_id].timer_min = timer_min;
      chrome.storage.local.set(obj,function(){
        $("#state").text("実行中");
        exec();
      });
  });


  $("#stop").on('click', function(){
      console.log("stop");
      obj[window_id].state_text = "停止中";
      chrome.storage.local.set(obj,function(){
          $("#state").text("停止中");
          stop();
        }
      );
  });
});



/*
 * バックグラウンドによる自動タブ遷移を開始
 */
function exec() {
  chrome.runtime.sendMessage({
      "action": "start",
      "params": {
        id: window_id,
        timer_min: obj[window_id].timer_min
      }
    },
    function(response) {}
  );
}

function stop(){
  chrome.runtime.sendMessage({"action": "stop", "params": obj},
    function(response) {}
  );
}
