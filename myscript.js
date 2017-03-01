

/*
 * 記事タイトル取得
 */
var title="";
var url="";

get_title();

function get_title(){
  // サイト内の任意の属性名を持つ部分の文字列をタイトルとする
  title = $('.blogEntryTitle').eq(0).text();
  // 同じく、サイト内の任意の属性名を持つ部分の文字列をURLとする
  url =$('#article_url').text();
  title =title.replace(/(^\s+)|(\s+$)/g, "");  // 前後の空白スペースを除去(http://blog.enjoitech.jp/article/180)
  //var title=$('h2.title').eq(0).text();  // 最初の記事タイトルのみ取得

  var postData = title + 'URL:'+url;
  // 取得したタイトル・URLをバックグラウンドへ送信
  chrome.extension.sendRequest({post_title: postData}, function(response) {});
}

/*
 * タブ切り替え時の対処
 */
chrome.extension.onRequest.addListener(
  function(request, sender, sendResponse) {
    get_title();
  }
);

