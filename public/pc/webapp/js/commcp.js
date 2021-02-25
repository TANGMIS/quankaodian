//后面就跟你平时使用jQuery一样
//左侧菜单交互

$(window).resize(function(){
	var _mainHeight = $(".layui-main").height() - $(".define-top").height() - $(".bottom-phone").height();
	var _intmainHeight = parseInt(_mainHeight);
	$(".define-content").height(_intmainHeight);
	var _leftheight = $(".content-left").height();
	$(".content-right").height(_leftheight);
})
var _mainHeight = $(".layui-main").height() - $(".define-top").height() - $(".bottom-phone").height();
var _intmainHeight = parseInt(_mainHeight);
$(".define-content").height(_intmainHeight);
var _leftheight = $(".content-left").height();
console.log(_leftheight)
$(".content-right").height(_leftheight);
$(".layui-nav-item").each(function(){
	var _datathis = $(this);
	_datathis.click(function(){
		var _dataid = _datathis.attr("data-id");
		$("." + _dataid).show().siblings().hide();
	})
})

//设置做题页面字体大小begin
$(document).on("click",".setting-parent",function(){
	$(".fontSize-body").fadeIn("fast");
})
$(document).on("click","body",function(e){
	if (!$(e.target).closest(".fontSize-body,.setting-parent").length) {
        $(".fontSize-body").fadeOut("fast");
   }
})

$(document).on('click','.fontSize-body p span',function(){
    setFontSize($(this));
    $(this).addClass("defaultColor").siblings().removeClass("defaultColor");
    $(".fontSize-body").fadeOut("fast");
})
function setFontSize(_this){
    var _fontSize = _this.css('font-size');
    _myFontSize = _fontSize;
    $('.form-label').css('font-size',_myFontSize);
    $('.layui-form-radio div').css('font-size',_myFontSize);
    $('.layui-form-checkbox span').css('font-size',_myFontSize); 
    $('.layui-input-block p').css('font-size',_myFontSize); 
    $('.dats p').css('font-size',_myFontSize); 
    
    _fontSize = _fontSize.replace(/px/,''); 
    var _imgt = $('.imgt');
    $.each(_imgt,function(){
        //console.log($(this).attr('src'));
        var _src = $(this).attr('src');
        var _arr = _src.split('/');
        var _imgo = _arr[6];  
        var _srcn = _src.replace(_imgo,_fontSize +'.png'); 
        $(this).attr('src',_srcn);
    });
    $.post(_setFontSize,{'fontSize':_fontSize},function(resp){

    });
}
//设置做题页面字体大小end

//模拟考场和试题搜索公用弹窗begin
$(".pbutton2").click(function(){
    $(".mn-chuangkou").hide();
})
$(".pbutton1").click(function(){
    $(".mn-chuangkou").hide();
    $('.jihuo-icon').trigger('click');
})
//模拟考场和试题搜索公用弹窗end

$(".fade-icon-shousuo").click(function(){
	$(".content-left").hide();
	$(".fade-icon-shousuo").hide();
	$(".fade-icon-zhankai").show();
	$(".content-right").css("padding-left","15px");
})
$(".fade-icon-zhankai").click(function(){
	$(".content-left").fadeIn();
	$(".fade-icon-shousuo").show();
	$(".fade-icon-zhankai").hide();
	$(".content-right").css("padding-left","175px");
})


var _bgcolor = $(".content-left .layui-nav-tree .layui-this>a").css("background-color");
$(".pifu ul li").click(function(){
	_bgcolor = $(this).css("background-color");
    var _this = $(this);
    var bgcolor = _this.css("background-color");
        //bgcolor = colorHex(bgcolor);//转换为十六进制方法
    $('#bgcolor').val(bgcolor);
    setPcBg(bgcolor);//保存背景设置
    setBgColor();
})

function setBgColor(){
    _bgcolor = $('#bgcolor').val();
    var _num = 1;
    $(".pifu ul li").each(function(){
        var colort = $(this).css("background-color"); 
        //var ncolor = colorHex(colort);//转换为十六进制方法
        var _class = $(this).attr("class"); 
        //console.log(colort);
        if(colort==_bgcolor){
            var _classNum = _class.substr(-1);
            _num = parseInt(_classNum); 
        }
    });
    //console.log(_bgcolor);
    //console.log(_num);
    $(".define-top").css("background-color",_bgcolor);
    $(".layui-nav-tree .layui-nav-bar").css("background-color",_bgcolor);
    $(".content-left .layui-nav-tree .layui-this>a").css("background-color",_bgcolor);
    $(".layui-nav-tree .layui-nav-item a").hover(function(){
        $(".layui-nav-tree .layui-nav-bar").css("background-color",_bgcolor);
    });
    $(".tip-content").css("background-color",_bgcolor);
    $(".layui-btn").css('background-color',_bgcolor);
    $('.myzdy-bg1').css('background-color',_bgcolor);
    $('.exam-chuangkou').css('background-color',_bgcolor);
    $('.layui-colla-title').css('background-color',_bgcolor); 
    $('.myzdy-bg1').css('background-color',_bgcolor); 
    var _shousuo = $(".content-left .fade-icon-shousuo");
    var _zhankai = $(".content-right .fade-icon-zhankai");
    var _bgposition1,_bgposition2;
    switch(_num)
    {
        case 1:
            _bgposition1 = "-306px -342px";
            _bgposition2 = "-316px -342px";
            break;
        case 2:
            _bgposition1 = "-256px -432px";
            _bgposition2 = "-266px -342px";
            break;
        case 3:
            _bgposition1 = "-246px -342px";
            _bgposition2 = "-256px -342px";
            break;
        case 4:
            _bgposition1 = "-286px -342px";
            _bgposition2 = "-296px -342px";
            break;
        case 5:
            _bgposition1 = "-366px -342px";
            _bgposition2 = "-246px -432px";
            break;
        case 6:
            _bgposition1 = "-346px -342px";
            _bgposition2 = "-356px -342px";
            break;
        case 7:
            _bgposition1 = "-326px -342px";
            _bgposition2 = "-336px -342px";
            break;
        case 8:
            _bgposition1 = "-266px -342px";
            _bgposition2 = "-276px -342px";
            break;
    }
    _shousuo.css("background-position",_bgposition1);
    _zhankai.css("background-position",_bgposition2);
}
$(".content-left ul li").click(function(){
	$(this).children("a").css("background-color",_bgcolor);
	$(this).siblings().children("a").css("background-color","#ecf5f6");
	var dataid = $(this).attr("data-id");
	if(dataid = "cuoti"){
		$(".liebiao").show();
	    $(".liebiao-detail").hide();
	    $(".liebiao-timu").hide();
	}
})

//十六进制颜色值的正则表达式
var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
/*RGB颜色转换为16进制*/
function colorHex(obj){
    var that = obj;
    if(/^(rgb|RGB)/.test(that)){
        var aColor = that.replace(/(?:\(|\)|rgb|RGB)*/g,"").split(",");
        var strHex = "#";
        for(var i=0; i<aColor.length; i++){
            var hex = Number(aColor[i]).toString(16);
            if(hex === "0"){
                hex += hex; 
            }
            strHex += hex;
        }
        if(strHex.length !== 7){
            strHex = that;  
        }
        return strHex;
    }else if(reg.test(that)){
        var aNum = that.replace(/#/,"").split("");
        if(aNum.length === 6){
            return that;    
        }else if(aNum.length === 3){
            var numHex = "#";
            for(var i=0; i<aNum.length; i+=1){
                numHex += (aNum[i]+aNum[i]);
            }
            return numHex;
        }
    }else{
        return that;    
    }
} 

//购买/激活窗口
$(".jihuo-icon").click(function(){
    if(_jh==1)
    {
        layer.msg('已经激活过了~不用再激活了',{time:1000});
        return;
    }
    $(".goumai-chuangkou").fadeIn();
})
$(document).on('click','.close',function(){
    $(".goumai-chuangkou").fadeOut();
    $(".pay-chuangkou").fadeOut();
})

$(document).on('click','.left-goumai',function(){
   // $(".step1").fadeOut();
   var _url = _selectPro;
   $.post(_url,'',function(resp){
       console.log(resp)
       if(resp.code==200){
           var html='';
           $.each(resp.data,function(i,item){
                html=html+'<div class="kemutitle-pro">';
                html=html+'<p class="kemu-biaozhi-pro">'+item.title+'会员</p>';
                html=html+'<div class="kumu-buy-pro">';
                html=html+'<span class="danjia-pro">￥'+item.original_price+'</span>';
                html=html+'<span class="liji-goumai-pro"  data-p="'+item.original_price+'" data-id="'+item.id+'">立即购买</span>';
                html=html+'</div>';
                html=html+'<hr>';
                html=html+'</div>';
           })

           $('.selectpay').html(html);
       }
   },'json');
    //$(".goumai-chuangkou").fadeOut();
    //$(".pay-chuangkou").fadeIn();
});

$(document).on('click','.liji-goumai-pro',function(){ 
    var _this=this;
    $.post(_userlogin,'',function(resp){
        console.log(resp)
        if(resp.code==200){
            console.log($(_this).attr('data-id'))
            $("#itemid").val($(_this).attr('data-id'));
            $("#price").val($(_this).attr('data-p'));
            $(".goumai-chuangkou").fadeOut();
            $(".pay-chuangkou").fadeIn();
        }
    },'json');

    //window.location.href=_zhifubao;
}); 

$(document).on('click','.toPay',function(){
   var payType=$(this).attr('data-type');
   if(payType=="zhifubao"){
       alert("支付宝还没有配置");
       return;
   }
   var special_id=$("#itemid").val();

    window.location.href=_create_order+"?payType="+payType+"&special_id="+special_id;
   // window.location.href=_create_order;

});


