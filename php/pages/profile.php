<?php
/**
 * Created by IntelliJ IDEA.
 * User: wx_h0001
 * Date: 2017/4/14
 * Time: 17:51
 */

include "init.php";

$mess =array(
    'title' => '资料设置',
    'css_link' => '',
    'css' => '.form-group > div{padding-top: 7px;}',
    'hh1' => '资料设置',
    'hh2' => '',
    'particular' => "../../pages/profile.html",
    'en_title' => 'profile',
    'js' => "<script src=\"/platformsystem/js/cropbox.js\"></script>\n<script src=\"/platformsystem/js/profile.js\"></script>\n"
);

echo merge_page($mess);