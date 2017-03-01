$(document).ready(function(){
  $("#exec").on('click',function(){ exec(); });
  $("#stop").on('click', function(){ stop();});
});

/*
 * バックグラウンドによる自動タブ遷移を開始
 */
function exec() {
  chrome.runtime.sendMessage({"action": "start"},
    function(response) {
        console.log("start レスポンス");
        console.log(response);
      }
  );
}

function stop(){
  chrome.runtime.sendMessage({"action": "stop"},
    function(response) {
        console.log("stop レスポンス");
        console.log(response);
      }
  );
}
