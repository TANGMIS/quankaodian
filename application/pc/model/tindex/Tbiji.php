<?php
namespace app\pc\model\tindex;

use basic\ModelBasic;
use think\Db;
use think\Config;
Class Tbiji extends ModelBasic
{
    public static function gettotal($userid)
    {
        $c=Db::name("tbiji")->where("userid",$userid)->count();
        return $c;
    }
    public static function updatedata($data)
    {
       $ret= self::where("userid",$data["userid"])->
        where("zid",$data["zid"])->where("cateid",$data["cateid"])->where("tqueid",$data["tqueid"])->count();
        if($ret>0)
        {
            self::where("userid",$data["userid"])->
            where("zid",$data["zid"])->where("cateid",$data["cateid"])->where("tqueid",$data["tqueid"])->update($data);
        }
        else
        {
            self::insert($data);
        }
    }

}