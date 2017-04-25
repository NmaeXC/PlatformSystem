/**
 * Created by wx_h0001 on 2016/5/20.
 */

$(document).ready(function () {
    freshMyPage();
});

$("#btnSubmit").click(function () {
    $(this).attr("disabled", "disabled");
    $.ajax({
        url: "../../php/product_new.php",
        type : "POST",
        data : $("#formProduct").serialize(),
        cache : false,
        success: function(data){
            if (data == 0)
            {
                alertMsg("新建产品成功", "success");
                setTimeout(function () {
                    window.location.reload();
                }, 1500);
            }
            else
            {
                alertMsg("新建产品失败", "warning");
                setTimeout(function () {
                    window.location.reload();
                }, 1500);
            }
        }
    });
});

$("#btnClose").click(function() {
    history.back();
});