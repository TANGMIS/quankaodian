layui.use(['jquery', 'layer' ,'element','form'], function(){ 
    var $ = layui.$ //重点处
    ,layer = layui.layer
    ,element = layui.element
    ,form = layui.form;
    
    $('.layui-btn-radius').click(function(){
    	var _cateId = $(this).attr('data-cateId');
    	var _xh = $(this).attr('data');
    	window.location.href = _tkExam+'&cateId='+_cateId+'&xh='+_xh+'&from=tk';
    });
});