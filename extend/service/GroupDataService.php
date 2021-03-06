<?php



namespace service;


use app\admin\model\system\SystemGroupData;


class GroupDataService
{
    public static function getGroupData($config_name,$limit = 0)
    {
        return SystemGroupData::getGroupData($config_name,$limit);
    }

    public static function getData($config_name,$limit = 0)
    {
        return SystemGroupData::getAllValue($config_name,$limit);
    }
}