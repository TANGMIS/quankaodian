//后面就跟你平时使用jQuery一样

//头部动画
/* $(".mydonghua").mouseover(function(){
	$(this).attr("src","../../PublicPc/0/images/gift.gif")
})*/
//右上角图标
$(".caidan-1").click(function(){
	$(".pifu").fadeIn();
})
$(".pifu").mouseout(function(e){
	evt = window.event||e; 
    var obj=evt.toElement||evt.relatedTarget; 
    var pa=this; 
    if(pa.contains(obj)) return false;
	    $(".pifu").fadeOut();
})
 
//-------------------------------------------------

//Funly Add

$(document).on('click','.toUrl',function(){
    var _url = $(this).attr('data');
    window.location.href = _url;
});

//退出登录
$('.caidan-3').click(function(){
    var _url = _logOut;
    if(confirm('确定退出登录么？')){
        $.post(_url,'',function(resp){
            if(resp.status==0){
                window.location.href = _login;
            }
        },'json');
    }
});

