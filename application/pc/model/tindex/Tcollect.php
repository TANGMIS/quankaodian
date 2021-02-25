<?php
namespace app\pc\model\tindex;

use basic\ModelBasic;
use think\Db;
use think\Config;
Class Tcollect extends ModelBasic
{
    public static function gettotal($userid)
    {
        $c=Db::name("tcollect")->where("userid",$userid)->count();
        return $c;
    }

    public static function insertdata($data){
        $id=self::insertGetId($data);
        return $id;
    }
    public static function updatedata($data){
        $id=self::where("userid",$data["userid"])
        ->where("tqueid",$data["tqueid"])
        ->where("zid",$data["zid"])
        ->where("cateid",$data["cateid"])->delete();
        return $id;
    }
    public static function getisov($data)
    {
        $data=self::where("userid",$data["userid"])
        ->where("tqueid",$data["tqueid"])
        ->where("zid",$data["zid"])
        ->where("cateid",$data["cateid"])->count();
        return $data;
    }


}