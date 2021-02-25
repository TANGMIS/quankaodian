<?php
namespace app\pc\model\tindex;

use basic\ModelBasic;
use think\Db;
Class Openvip extends ModelBasic
{
    /*

    */
    public static function add($data){
        Db::name("user_open_class")->insert($data);
    }
    public static function isopen($userid,$cateid){
        $res=Db::name("user_open_class")->where("userid",$userid)->where("cateid",$cateid)->where("status",0)->find();
        return $res;
    }
    public static function updatestatus($orderid,$cateid,$status){
        Db::name("user_open_class")->where("orderid",$orderid)->where("cateid",$cateid)->update(array("status"=>$status));
    }

}