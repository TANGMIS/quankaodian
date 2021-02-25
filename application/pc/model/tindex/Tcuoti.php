<?php
namespace app\pc\model\tindex;

use basic\ModelBasic;
use think\Db;
use think\Config;
Class Tcuoti extends ModelBasic
{
    public static function gettotal($userid)
    {
        $c=Db::name("tcuoti")->where("userid",$userid)->count();
        return $c;
    }
    public static function insertall($data)
    {
        Db::name("tcuoti")->insertAll($data);
    }

}