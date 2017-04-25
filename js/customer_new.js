/**
 * Created by wx_h0001 on 2016/4/29.
 */

(function () {
    //为了方便实现直辖市的判断，新增该变量以记录地址编码
    var addr_code = '';


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
        $("#city").append("<option value='' disabled selected>城市</option>");
        var province = $(this).val();
        $.ajax({
            url: "../../php/addr_select.php",
            type: "POST",
            data: {'province': province},
            dataType: "json",
            success: function(data){
                if (data.length > 1){
                    for(var ele in data){
                        $("#city").append("<option value='" + data[ele].id + "'>" + data[ele].value + "</option>");
                    }
                }else if (data.length == 1){
                    addr_code = data[0].id;
                    //var city = $('#province option:selected');
                    //$("#city").html("<option value='" + city.val() + "' selected>" + city.text() + "</option>");
                }

            }
        });
    });

    //选定城市
    $("#city").change(function () {
        addr_code = $(this).find("option:selected").val();
        //addr_code = $(this).val();
    });

    $("#btnSubmit").click(function () {
        $(this).attr("disabled", "disabled");
        $.ajax({
            url: "../../php/customer_new.php",
            type : "POST",
            data : $("#formCustomer").serialize() + "&addr_code=" + addr_code,
            cache : false,
            success: function(data){
                if (data == 0)
                {
                    alertMsg("新建客户成功", "success");
                    setTimeout(function () {
                        window.location.reload();
                    }, 1500);
                }
                else
                {
                    alertMsg("新建客户失败", "warning");
                    $("#btnSubmit").removeAttr('disabled');
                }
            }
        });
    });

    $("#btnClose").click(function() {
        history.back();
    });

})();

