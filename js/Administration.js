/**
 * Created by wx_h0001 on 2016/4/12.
 */



$(document).ready(function () {
    freshMyPage();

    showMemberList();

});

function showMemberList(){
    $.ajax({
        url: "/" + projectName + "/php/admin.php",
        type: "POST",
        cache: false,
        dataType : 'json',
        data: {'action': 'showMemberList', 'para': ''},
        success: function (data){
            var ulID = "#ulMemberList";
            var i = 0;
            $("<li class='active'><a role='button' data-toggle='tab' onclick=showMemberInfo('" + data[i].uid + "')><i class='fa fa-male'></i>&nbsp;" + data[i].name + "</a></li>").appendTo(ulID);
            showMemberInfo(data[i].uid);
            i += 1;
            while(i < data.sum)
            {
                $("<li><a role='button' data-toggle='tab' onclick=showMemberInfo('" + data[i].uid + "')><i class='fa fa-male'></i>&nbsp;" + data[i].name + "</a></li>").appendTo(ulID);
                i += 1;
            }
        }
    });
}

function showMemberInfo(uid){
    if ($("#userInfo_" + uid).length <= 0)
    {
        $.ajax({
            url: "/" + projectName + "/php/admin.php",
            type: "POST",
            cache: false,
            dataType: 'json',
            data: {'action': 'showMemberInfo', 'para': uid},
            success: function (data) {
                var newUserInfo = $("#userInfo_0").clone()
                    .attr('id', 'userInfo_' + uid);

                newUserInfo.find("li > a").each(function(){
                    var old = $(this).attr('href');
                    $(this).attr('href', "#userInfo_" + uid + " " + old);
                });
                newUserInfo.find(".nameInfo").text(data.name);
                newUserInfo.find(".titleInfo").text(data.title);
                newUserInfo.find(".uidInfo").text(data.uid);
                newUserInfo.find(".teleInfo").text(data.tele);
                newUserInfo.find(".sexInfo").text(data.sex);
                newUserInfo.find(".emailInfo").text(data.email);
                newUserInfo.find(".departmentInfo").text(data.department);
                newUserInfo.find(".dateInfo").text(data.date);
                newUserInfo.find(".teamInfo").text(data.team);
                newUserInfo.find(".topInfo").text(data.top);
                newUserInfo.insertAfter("#userInfo_0");
                newUserInfo.find(".nameAlter").val(data.name);
                newUserInfo.find(".titleAlter").val(data.title);
                newUserInfo.find(".uidAlter").val(data.uid);
                newUserInfo.find(".teleAlter").val(data.tele);
                newUserInfo.find(".sexAlter").val(data.sex);
                newUserInfo.find(".emailAlter").val(data.email);
                newUserInfo.find(".departmentAlter").val(data.department);
                newUserInfo.find(".dateAlter").val(data.date);
                newUserInfo.find(".teamAlter").val(data.team);
                newUserInfo.find(".topAlter").val(data.top);
                $(".userInfo.active").removeClass("active");
                $("#userInfo_" + uid).addClass("active");

                //datetimepicker部件的设置
                $('.form_date').datetimepicker({
                    weekStart: 1,
                    todayBtn: 1,
                    autoclose: 1,
                    todayHighlight: 1,
                    startView: 2,
                    minView: 2,
                    forceParse: 0
                });
            }
        });
    }
    else
    {
        $(".userInfo.active").removeClass("active");
        $("#userInfo_" + uid).addClass("active");
    }
}

function saveUserInfo(form){
    var uid = $(form).find(".uidAlter").val();
    $.ajax({
        url : "/" + projectName + "/php/admin_alter_user_info.php",
        type : "POST",
        cache : false,
        data : $(form).serialize(),
        success : function(data){
            //判断是否成功
            if(data >= 0)
            {
               alertMsg("修改成功", "success")
            }
            else
            {
                alertMsg("修改失败", "warning");
            }
        }
    });

    //$.ajax({
    //    url: "/" + projectName + "/php/admin_alter_user_info.php",
    //    type: "POST",
    //    cache: false,
    //    data: $(form).serialize(),
    //    success: function(data){
    //        if (data == 0)
    //        {
    //            alert("修改成功");
    //            //$("#userInfo_" + uid).remove();
    //            //showMemberInfo(uid);
    //        }
    //    }
    //});
}