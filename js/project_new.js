/**
 * Created by wx_h0001 on 2016/10/13.
 */

(function (){

    var planManhour = 0;
    var distributeManhour = 0;
    //开发者数组
    var aryDeveloper = new Array();
    //项目负责人
    var chargeUid = null;
    //项目起止时间
    var projectDate = [];
    ////里程碑数组
    //var milestoneList = [];

    //页面初始化
    $(document).ready(function () {
        freshMyPage();

        $('#projectDate').daterangepicker({timePicker: true, format: 'YYYY-MM-DD'}, null, function () {
            projectDate = $("#projectDate").val().split(" - ");
            $("#milestone_deadline").text(projectDate[1]);
            milestoneIndexFresh();
            $("#milestone").removeClass('hidden');
        });

        //初始化员工列表
        $.ajax({
            url: "/" + projectName + "/php/admin.php",
            type: "POST",
            cache: false,
            dataType : 'json',
            data: {'action': 'showMemberList', 'para': ''},
            success: function (data){
                var ulID = "#ulMemberList";
                var i = 0;
                while(i < data.sum)
                {
                    $("<li><a role='button' data-toggle='tab'><i class='fa fa-male'></i>&nbsp;" + data[i].name + "</a></li>").click({uid: data[i].uid, name: data[i].name}, function (e) {
                            if (AddDeveloper(e.data.uid, e.data.name)){
                                $(this).remove();
                            }
                        })
                        .appendTo(ulID);
                    i += 1;
                }
            }
        });

    });

    $("#projectName").change(function () {
        $.ajax({
            url: "../../php/uniqueCheck.php",
            type: "POST",
            cache: false,
            data: {'type': 'project_name', value: $(this).val()},
            success: function (data){
                if (data > 0){
                    $("#project_name_warning").text("该项目名称已被使用，为避免重复请重新命名");
                }else{
                    $("#project_name_warning").text("");
                }
            }
        });
    });

    //添加里程碑
    $("#addMilestone").click(function () {
        //var index = milestoneList.push({date: "", disc: ""}) - 1;
        $("<tr></tr>").append(
            $("<td style='border: none' class='index'></td>"),
            $("<td style='border: none'></td>").append("<input type='date' class='milestone_date'/>"),
            $("<td style='border: none'></td>").append("<input type='text' class='milestone_disc'/>"),
            $("<td style='border: none'></td>").append($("<a role='button' class='badge bg-red'><i class='fa fa-times'></i></a>").click(function () {
                $(this).parent().parent().remove();
                milestoneIndexFresh();
            })))
        .appendTo("#tbodyMilestone");
        milestoneIndexFresh();
    });

    $("#projectCharge").bigAutocomplete({
        url: "../../php/autocomplete.php?type=staff",
        callback: function(data){
            chargeUid = data.id;
        }
    });


    $("#projectManhour").change(function () {
        if ($(this).val() >= distributeManhour){
            planManhour = parseFloat($(this).val());
        }else{
            alertMsg('项目工时与分配的工时有冲突，无法修改,请尝试重新分配工时', "danger");
            $(this).val(planManhour);
        }
    });

    //添加开发者
    function AddDeveloper(uid, name){
        var left = planManhour - distributeManhour;
        if (left >= 0){
            var manhours = prompt("请输入为(" + name + "-" + uid + ")分配的工时[待分配：" + left +  "工时]：", left);
            if (manhours === null){
                return false;
            }else if (manhours <= left){
                distributeManhour += parseFloat(manhours);
                aryDeveloper.push({uid : uid, manhours: manhours});
                $("<a role='button'><span class='badge bg-green'>" + name + "-" + uid + "(" + manhours + "工时)&nbsp;<i class='fa fa-times'></i></span></a>").data('value', manhours).click(function () {
                	distributeManhour = distributeManhour - parseInt($(this).data('value'));
                    $(this).remove();
                    RemoveDeveloper(uid, name);
                }).appendTo("#developer");
                return true;
            }else{
                alertMsg('超出可分配的工时范围', 'danger');
                return false;
            }
        }else{
            alertMsg('工时的额分配计算出现错误，请尝试点击‘取消’键重新创建项目', 'warning');
            return false;
        }
    }

    //移除开发者
    function RemoveDeveloper(uid, name){
        aryDeveloper.splice($.inArray(uid, aryDeveloper), 1);
        $("<li><a role='button' data-toggle='tab')><i class='fa fa-male'></i>&nbsp;" + name + "</a></li>").click({uid: uid, name: name}, function (e) {
                AddDeveloper(e.data.uid, e.data.name);
                $(this).remove();
            }).appendTo("#ulMemberList");
    }

    $("#btnSave").click(function () {
        if ($("#projectName").val() === ""){
            alertMsg("请填写项目名称", "danger");
        }else if($("#projectCharge").val() === "" || chargeUid === null){
            alertMsg("请填写项目项目负责人", "danger");
        }else if ($("#projectDate").val() === ""){
            alertMsg("请填写开始时间", "danger");
        }else if ($("#projectManhour").val() === ""){
            alertMsg("请填写预计工时", "danger");
        }else if (aryDeveloper.length <= 0){
            alertMsg("请添加至少一位开发人员", "danger");
        }else {

            $(this).attr("disabled", "disabled");

            //整理里程碑数据
            var milestoneList = [];
            $("#tbodyMilestone").find(".milestone_date").each(function (index, element) {
                milestoneList[index] = {date: null, disc: null};
                milestoneList[index].date = $(element).val();
            });
            $("#tbodyMilestone").find(".milestone_disc").each(function (index, element) {
                milestoneList[index].disc = $(element).val();
            });
            $.ajax({
                url: "../../php/project_new.php",
                data: $("#formProject").serialize() + "&developer=" + JSON.stringify(aryDeveloper) + "&projectCharge=" + chargeUid + "&projectDate=" + JSON.stringify(projectDate) + "&milestone=" + JSON.stringify(milestoneList),
                type : "POST",
                cache : false,
                success: function (data) {
                    if (data == 0)
                    {
                        alertMsg("项目创建成功！", "success");
                        window.location.href = "project_view.html";
                    }
                    else
                    {
                        alertMsg("项目创建失败", "danger");
                    }
                }
            });
        }
    });

    $("#btnCancel").click(function () {
        window.location.reload();
    });

    function milestoneIndexFresh(){
        $(".index").each(function(index, element){
            $(element).text((parseInt(index) + 1) + ".");
        });
    }


})();


