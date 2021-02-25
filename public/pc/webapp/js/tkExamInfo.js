layui.use(['jquery', 'layer' ,'element','form'], function(){ 
    var $ = layui.$ //重点处
    ,layer = layui.layer
    ,element = layui.element
    ,form = layui.form;

    //tips
    $('#txjs').mouseover(function(){
        $(".txjs-tip").fadeIn();
    }).mouseout(function(){
        $(".txjs-tip").fadeOut();
    });

    var _zts = $('.sttk');
    for (var i = 1; i <= _zts.length; i++) {
        var _ttt = 'layer-photos-demo'+i;
        imgTcDiv(_ttt);
    } 
    function imgTcDiv(id){
       //调用示例
        layer.photos({
          photos: '#'+id
          ,anim: 5 //0-6的选择，指定弹出图片动画类型，默认随机（请注意，3.0之前的版本用shift参数）
        });  
    }

    $('.form-label').css('font-size',_myFontSize);
	$('.layui-form-radio div').css('font-size',_myFontSize);
	$('.layui-form-checkbox span').css('font-size',_myFontSize); 
	//设置滚动条高度
	$(window).resize(function(){
		var _leftCd = $(".content-right").height() - $(".top-menu").outerHeight() - $(".top-menu").outerHeight();
	    $(".kstk").height(parseInt(_leftCd));
	    
	    var _searchLeftCd = $(".content-right").height() - $(".top-menu").outerHeight();
	    $(".st").height(parseInt(_searchLeftCd));

	})
	var _leftCd = $(".content-right").height() - $(".top-menu").outerHeight() - $(".top-menu").outerHeight();
    $(".kstk").height(parseInt(_leftCd));
    
    var _searchLeftCd = $(".content-right").height() - $(".top-menu").outerHeight();
    $(".st").height(parseInt(_searchLeftCd));

    function toId(_id){
        var my = $("#layer-photos-demo"+_id).position().top;
        my = parseInt(my);
        //console.log(my);
        $(".kstk").animate({scrollTop:my + "px"}, 100);
    }
    toId(_qxh); 
});