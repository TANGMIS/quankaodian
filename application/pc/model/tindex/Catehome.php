<?php
namespace app\pc\model\tindex;

use basic\ModelBasic;
use think\Db;
Class Catehome extends ModelBasic
{
    public static function getAll($where = array()){
        $model = new self;
        if($where['parentid'] !== '')
        {
            $model = $model->where('parentid',$where['parentid']);
        } 
        $list=$model->order('displayorder asc')->field("id,cname,fix,parentid,status,catimg")->select();
        $list = count($list) ? $list->toArray() : [];
        foreach ($list as &$item) {
            $item['off_num'] = Catehome::where(['parentid' => $item['id']])->count();
        }
   
        return $list;
    }

    /*

    */
    public static function getinfos($id)
    {
        $data=Catehome::where('Id',$id)->find();
		return $data;
    }
    public static function getfix($id)
    {
        $data=self::where('Id',$id)->value('fix');
        return $data;
    }
}