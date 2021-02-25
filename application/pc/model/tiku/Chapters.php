<?php
namespace app\pc\model\tiku;

use basic\ModelBasic;
use think\Db;
use think\Config;
Class Chapters extends ModelBasic
{
    public static function getList($where = array()){
        $chapter=0;
        $data=Db::name("special_chapters")->where("special_id",$where["special_id"])->order('displayorder asc')->paginate((int)$where['limit'])
        ->each(function($item, $key) use(&$chapter){
            $item["children"]=Db::name("special_source")->alias("se")->join("special_task tk","se.source_id=tk.id")
            ->field("tk.title,tk.id,tk.is_pay,tk.link,tk.sort,tk.play_count,se.pay_status")
            ->where("chapters_id",$item["id"])->select();
            $item["count"]=count($item["children"]);
            $chapter=$chapter+$item["count"];
            return $item;
        });

        $count=count($data);
        return compact('data','count','chapter');
       
    }
}