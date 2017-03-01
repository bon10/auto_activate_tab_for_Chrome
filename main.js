var window_id;
var state_text;
var timer_min;

$(document).ready(function(){

  chrome.storage.local.get(["window_id","state_text", "timer_min"], function(items) {
      window_id = items.window_id;
      state_text = items.state_text;
      timer_min = items.timer_min;
      if(state_text){
        $("#state").text(state_text);
      }
      if(timer_min){
        $("#timer_min").val(timer_min);
      }
  });
  $("#exec").on('click',function(){
      timer_min = $("#timer_min").val();
      if(timer_min == 0 ){
        $("#state").append("時間を設定してください");
        return;
      }
      chrome.storage.local.set({"state_text": "実行中", "timer_min": timer_min},function(){exec();});
  });
  $("#stop").on('click', function(){
      chrome.storage.local.set({"state_text": "停止中"},function(){
          $("#state").text("停止中");
          stop();});
  });
});



/*
 * バックグラウンドによる自動タブ遷移を開始
 */
function exec() {
  chrome.runtime.sendMessage({"action": "start", "time": timer_min * 60},
    function(response) {}
  );
}

function stop(){
  chrome.runtime.sendMessage({"action": "stop"},
    function(response) {}
  );
}
