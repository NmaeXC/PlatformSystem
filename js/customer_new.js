/**
 * Created by wx_h0001 on 2016/4/29.
 */

$(document).ready(function () {
    freshMyPage();
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
                setTimeout(" history.back()", 1000);
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