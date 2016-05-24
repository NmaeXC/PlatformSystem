/**
 * Created by wx_h0001 on 2016/4/29.
 */

$(document).ready(function () {
    freshMyPage();

    //地址选择栏初始化
    $.ajax({
        url: "../../php/addr_select.php",
        type: "POST",
        dataType: "json",
        success: function(data){
            for(var ele in data){
                $("#area").append("<option value='" + data[ele].id + "'>" + data[ele].value + "</option>");
            }
        }
    });


});

//选定地域
$("#area").change(function () {
    $("#province").empty();
    $("#province").append("<option value='' disabled selected >省（直辖市、自治区）</option>");
    var area = $(this).val();
    $.ajax({
        url: "../../php/addr_select.php",
        type: "POST",
        data: {'area': area},
        dataType: "json",
        success: function(data){
            for(var ele in data){
                $("#province").append("<option value='" + data[ele].id + "'>" + data[ele].value + "</option>");
            }
        }
    });
});

//选定省级地域
$("#province").change(function () {
    $("#city").empty();
    $("#city").append("<option value='' disabled selected >城市</option>");
    var province = $(this).val();
    $.ajax({
        url: "../../php/addr_select.php",
        type: "POST",
        data: {'province': province},
        dataType: "json",
        success: function(data){
            for(var ele in data){
                $("#city").append("<option value='" + data[ele].id + "'>" + data[ele].value + "</option>");
            }
        }
    });
});

$("#btnSubmit").click(function () {
    $.ajax({
        url: "../../php/customer_new.php",
        type : "POST",
        data : $("#formCustomer").serialize(),
        cache : false,
        success: function(data){
            if (data == 0)
            {
                alertMsg("新建客户成功", "success");
            }
            else
            {
                alertMsg("新建客户失败", "warning");
            }
        }
    });
});

$("#btnClose").click(function() {
    history.back();
});