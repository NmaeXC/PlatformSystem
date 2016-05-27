/**
 * Created by wx_h0001 on 2016/5/20.
 */

$(document).ready(function () {
    freshMyPage();
});

$("#btnSubmit").click(function () {
    $.ajax({
        url: "../../php/product_new.php",
        type : "POST",
        data : $("#formProduct").serialize(),
        cache : false,
        success: function(data){
            if (data == 0)
            {
                alertMsg("新建产品成功", "success");
            }
            else
            {
                alertMsg("新建产品失败", "warning");
            }
        }
    });
});

$("#btnClose").click(function() {
    history.back();
});