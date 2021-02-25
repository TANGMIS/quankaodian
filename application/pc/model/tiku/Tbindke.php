<?php
namespace app\pc\model\tiku;

use basic\ModelBasic;
use think\Db;
use think\Config;
Class Tbindke extends ModelBasic
{
    public static function getList($where = array()){
        $model=Db::name("tbind_ke")->alias("tb");

        switch($where["sort"]){
            case 'score':
                $model->order('tb.sort asc');
                break;
            case 'rating'://好评
                //$model->order('faId asc');
                break;
            case 'latest'://最新
                $model->order('sp.add_time asc');
                break;
            case 'browse_count'://最热
                $model->order('sp.browse_count desc');
                break;
            case 'featured'://推荐
                $model->order('sp.type asc');
                break;
            case 'featured'://免费
                $model->order('sp.member_money desc');
                break;
        }
        if($where["type"]!=''){
            $model->where("sp.type",$where["type"]);
        };
        $list=$model->where("tb.cateid",$where["cateid"])->join("special sp","tb.keid=sp.id")->join('__SPECIAL_SUBJECT__ S', 'S.id=sp.subject_id')
        ->field("tb.id as bid,tb.cateid,sp.id ,sp.type,sp.title,sp.type,sp.image,sp.subject_id,tb.sort,tb.is_show,S.name as subject_name,sp.member_money,sp.browse_count")->
        page((int)$where['page'], (int)$where['limit'])->select();

        $count=Db::name("tbind_ke")->alias("tb")->where("tb.cateid",$where["cateid"])->join("special sp","tb.keid=sp.id")->count();

       return ['count' => $count, 'data' => $list];
       
    }
}