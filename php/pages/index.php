<?php
/**
 * Created by IntelliJ IDEA.
 * User: wx_h0001
 * Date: 2017/4/14
 * Time: 16:01
 */

include "init.php";

$mess =array(
    'title' => '主页',
    'css' => '',
    'css_link' => '',
    'hh1' => '主页面',
    'hh2' => '',
    'particular' => "../../pages/index.html",
    'en_title' => '',
    'js' => "<script src=\"/platformsystem/js/index.js\"></script>\n"
);

echo merge_page($mess);