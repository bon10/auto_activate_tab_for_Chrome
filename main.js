var window_id
var obj;
var state_text;
var timer_min;

$(document).ready(function(){

  // window idを取る
  chrome.windows.getCurrent(function(win){
      obj = {
        "params":{
          "state_text": "",
          "timer_min": "",
        }
      };
  });
  chrome.storage.local.get([window_id], function(items) {
      console.log(items.obj.window_id);
      if(items.obj.window_id){
        // window idが異なる場合は以降の処理をせず終了
        if(obj.window_id != items.obj.window_id){
          console.log("違うウィンドウです");
          exit;
        }
      }
      if(items.obj.params){
        state_text = items.obj.params.state_text;
        timer_min = items.obj.params.timer_min;
        if(state_text){
          $("#state").text(state_text);
        }
        if(timer_min){
          $("#timer_min").val(timer_min);
        }
      }
  });


  $("#exec").on('click',function(){
      timer_min = $("#timer_min").val();
      if(timer_min == 0 ){
        $("#state").append("時間を設定してください");
        return;
      }
      obj.params.state_text = "実行中";
      obj.params.timer_min = timer_min;
      chrome.storage.local.set({window_id: obj},function(){exec();});
  });


  $("#stop").on('click', function(){
      obj.params.state_text = "停止中";
      chrome.storage.local.set({window_id: obj},function(){
          $("#state").text("停止中");
          stop();});
  });
});



/*
 * バックグラウンドによる自動タブ遷移を開始
 */
function exec() {
  chrome.runtime.sendMessage({
      "action": "start",
      "params": obj},
    function(response) {}
  );
}

function stop(){
  chrome.runtime.sendMessage({"action": "stop", "params": obj},
    function(response) {}
  );
}
