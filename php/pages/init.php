<?php
/**
 * Created by IntelliJ IDEA.
 * User: wx_h0001
 * Date: 2017/4/14
 * Time: 16:20
 */



/**
 * $path: 页面的内容路径
 */
function merge_page($mess)
{
    $file_path = "../../pages/head.html";
    if(file_exists($file_path)){
        $common = file_get_contents($file_path);
    }
    else
    {
        exit("common file error");
    }
    if(file_exists($mess['particular'])){
        $particular = file_get_contents($mess['particular']);
    }
    else
    {
        exit("particuler file error");
    }
    $common = str_replace("{{TITLE}}", $mess['title'], $common);
    $common = str_replace("{{EXTRA_CSS_LINK}}", $mess['css_link'], $common);
    $common = str_replace("{{EXTRA_CSS}}", $mess['css'], $common);
    $common = str_replace("{{HH1}}", $mess['hh1'], $common);
    $common = str_replace("{{HH2}}", $mess['hh2'], $common);
    $common = str_replace("{{PARTICULER}}", $particular, $common);
    $common = str_replace("{{EN_TITLE}}", $mess['en_title'], $common);
    $common = str_replace("{{EXTRA_JS}}", $mess['js'], $common);

    return $common;
}