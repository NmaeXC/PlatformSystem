/**
 * Created by wx_h0001 on 2015/12/26.
 */

//页面初始化
$(document).ready(function () {
    freshMyPage();
    //初始化该页部分信息
    $("#detailName").text($("#name").text());
    $("#detailUid").text($("#uid").text());
    $("#detailDepartment").text($("#department").text());
    $("#detailTitle").text($("#title").text());

    //查看请假历史纪录
    $("#tbodyLeaveHisotry").empty();
    $.ajax({
        url : "../../php/leaveHistory.php",
        type : "POST",
        cache : false,
        dataType : 'json',
        success : function(data){
            //将请假条历史纪录显示到表格中
            if(data.sum > 0)
            {
                for(var x = 0; x < data.sum; x++)
                {
                    var trID = "trLeaveHistory" + x;
                    $("<tr>").attr('id', trID).appendTo("#tbodyLeaveHisotry");
                    $("<td></td>").text(data[x]["number"]).appendTo("#" + trID);
                    $("<td></td>").text(data[x]["startTime"]).appendTo("#" + trID);
                    $("<td></td>").text(data[x]["endTime"]).appendTo("#" + trID);
                    $("<td></td>").text(data[x]["reason"]).appendTo("#" + trID);
//                        var param = "select_leave_img('" + data[x]["attachment"] + "')";
//                        $("<td></td>").html("<a role='button' onclick=" + param + ">IMG").appendTo("#" + trID);
                    var state;
                    switch (data[x]['state']){
                        case "未处理" :
                            state = "<span class='label label-primary'>未处理</span>";
                            break;
                        case "同意" :
                            state = "<span class='label label-success'>同意</span>";
                            break;
                        case "驳回" :
                            state = "<span class='label label-warning'>驳回</span>";
                            break;
                        default:
                            state = "<span class='label label-danger'>Error</span>";
                            break;
                    }
                    $("<td></td>").html(state).appendTo("#" + trID);
                    $("<td></td>").html("<a role='button' onclick=leaveDetail(" + data[x]['number'] + ")><span class='badge bg-light-blue'>More..</span>").appendTo("#" + trID)
                }
            }
            else
            {
                $("<tr><td colspan='6'>你还没有请假条纪录哦~</td></tr>").appendTo("#tbodyLeaveHisotry");
            }
        }
    })
})

function leaveDetail(number){
    $.ajax({
        url : "../../php/leaveHistory.php",
        type : "POST",
        cache : false,
        data : {'number' : number},
        //async : false,
        dataType : 'json',
        success : function (data) {
            $("#detailId").text(data.number);
            $("#detailDate").text(data.submitDate);
            $("#detailReason").text(data.reason);
            $("#detailRemark").text(data.remark);
            var startDate =new Date(data.startTime.split("-"));
            var endDate = new Date(data.endTime.split("-"));
            $("#detailTime").html(data.startTime + "&nbsp;&nbsp;&nbsp;&nbsp;——&nbsp;&nbsp;&nbsp;&nbsp;" + data.endTime + "&nbsp;&nbsp;（共" + Math.floor(data.leavetime / 8) +  " 天 " + (data.leavetime % 8).toFixed(1) + " 小时)");
            if (data.attachment == "NONE")
            {
                $("#detailAttachment").html("未上传")
            }
            else
            {
                var acPath = "../../data/leavenote/" + data.attachment;
                $("#detailAttachment").html("<img style='max-width: 90%; height: auto;' src='" + acPath + "'>");
            }
            $("#detailAccepter").text(data.acceptedName);
            $("#detailState").text(data.state);
            $("#modalLeaveDetail").modal("show");

        }
    })
}
//
//function select_leave_img(name)
//{
//    $("#leave_img").attr('src', '../data/' + name);
//    $("#modalLeaveIMG").modal("show");
//}

