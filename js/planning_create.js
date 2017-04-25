/**
 * Created by wx_h0001 on 2016/11/4.
 */
(function () {
    var planCreateData = {week: '', timelong: 0, plans:{}};
    var arrStaff = [];
    //页面初始化
    $(document).ready(function () {
        freshMyPage();

        //验证登录者的权限并初始化页面元素
        $.ajax({
            url: "../../php/manhour_planning.php",
            type: "POST",
            data: {action: 'create_plans_init'},
            dataType: "json",
            success: function (data) {
                if(data.tag == 'reject')
                {
                    //不具有查看权限
                    alertMsg("本内容仅部门经理可查看，您不具有该权限。", "warning");
                }else if (data.tag == 'permit'){
                    $("#starttime").change(function () {
                        var timelong = 4;   //默认4周时长
                        var week = weekToDate($(this).val());
                        var endweek = new Date(week.getTime() + (timelong * 7 - 1) * 24 * 60 * 60 *1000);
                        planCreateData.week = week.getFullYear() + '-' + (week.getMonth() + 1) + '-' + week.getDate();
                        planCreateData.timelong = timelong;
                        $("#time").text(planCreateData.week + ' 至 ' + endweek.getFullYear() + '-' + (endweek.getMonth() + 1) + '-' + endweek.getDate());
                        if (isNaN(($("#left_0").text()).split(" / ")[0])){
                            for (var i in arrStaff){
                                $("#left_" + i).text(timelong * 5 * 8 + " / " + timelong * 5 * 8);
                                $("#saturation_" + i).text('0%');
                            }
                        }
                    });

                    //显示项目选择框选项
                    if (typeof data.project !== undefined){
                        for (var i in data.project){
                            $("<option value='" + data.project[i].id + "'>" + data.project[i].name + "</option>").appendTo("#project_select");
                        }

                        $("#project_select").change(function () {
                            var project_id = $(this).find("option:selected").val();
                            var project_name = $(this).find("option:selected").text();
                            if (typeof planCreateData.plans[project_id] === "undefined"){
                                planCreateData.plans[project_id] = {};
                                var trProj = $("<tr></tr>").append(
                                    $("<th></th>").append($("<a role='button'><span class='glyphicon glyphicon-trash'></span></a>").click(project_id,function (e) {
                                        for (var i in arrStaff){
                                            if (typeof planCreateData.plans[e.data][arrStaff[i]] !== 'undefined'){
                                                var n = parseInt(planCreateData.plans[e.data][arrStaff[i]]);
                                                var m = ($("#left_" + i).text()).split(" / ");
                                                var left = parseInt(m[0]);
                                                var amount = parseInt(m[1]);
                                                $("#left_" + i).text((left + n) + " / " + amount);
                                                $("#saturation_" + i).text(Math.round((amount - left - n) / amount * 100) + "%");
                                            }

                                        }
                                        delete planCreateData.plans[e.data];
                                        $(this).parent().parent().remove();
                                    })),
                                    $("<th></th>").text(project_name),
                                    $("<th></th>").text(project_id)
                                );
                                for (var i in arrStaff){
                                    trProj.append($("<td></td>").append($("<input type='number' value='0'/>").change({project_id: project_id, i: i}, function (e) {
                                        var old = parseInt($(this).data('value'));
                                        var n = parseInt($(this).val());
                                        if (!isNaN(n)){
                                            var m = ($("#left_" + e.data.i).text()).split(" / ");
                                            var left = parseInt(m[0]);
                                            var amount = parseInt(m[1]);
                                            planCreateData.plans[e.data.project_id][arrStaff[e.data.i]] = n;
                                            $("#left_" + e.data.i).text((left - n + old) + " / " + amount);
                                            $("#saturation_" + e.data.i).text(Math.round((amount - left + n - old) / amount * 100) + "%");
                                            $(this).data('value', n);
                                        }else{
                                            $(this).val(old);
                                            this.focus();
                                        }

                                    }).data('value', 0)));
                                }
                                trProj.appendTo("#tbodyCreatePlan");
                            }
                        });

                    }else{
                        alertMsg("No Project List Element", "danger");
                    }

                    //显示表头员工栏
                    if (typeof data.staffs !== undefined){
                        var tr1 = $("<tr></tr>").append("<th colspan='3' rowspan='2'></th>");
                        var tr2 = $("<tr></tr>");
                        for (var i in data.staffs){
                            arrStaff.push(data.staffs[i].uid);
                            tr1.append("<th>" + data.staffs[i].name + "</th>");
                            tr2.append("<th>" + data.staffs[i].uid + "</th>");
                        }
                        $("#theadCreatePlan").append(tr1, tr2);
                    }else {
                        alertMsg("No Staff Infomation", "danger");
                    }

                    //显示待分配工时和人力饱和度栏
                    var trLeft = $("<tr><th colspan='3'>待分配工时</th></tr>");
                    var trSaturation = $("<tr><th colspan='3'>人力饱和度</th></tr>");
                    for (var i in arrStaff){
                        trLeft.append("<td id='left_" + i + "'>-</td>");
                        trSaturation.append("<td id='saturation_" + i + "'>-</td>");
                    }
                    $("#tfootCreatePlan").append(trLeft, trSaturation);

                }else{
                    //输出错误信息
                    alertMsg("Error: " + data.tag, 'danger');
                }
            }
        });

        //点击“创建”按钮
        $("#btnSave").click(function () {
            if (planCreateData.week != ""){
                for (var i in planCreateData.plans){
                    for (var j in planCreateData.plans[i]){
                        if (planCreateData.plans[i][j] == 0){
                            delete planCreateData.plans[i][j];
                        }
                    }
                    if ($.isEmptyObject(planCreateData.plans[i])){
                        delete planCreateData.plans[i];
                    }
                }

                if (!$.isEmptyObject(planCreateData.plans)){

                    $(this).attr("disabled", "disabled");

                    $.ajax({
                        url: "../../php/manhour_planning.php",
                        type: "POST",
                        data: {action: 'create_plans', planData: JSON.stringify(planCreateData)},
                        dataType: "json",
                        success: function (data) {
                            if (data.tag = 'permit'){
                                if (data.error.length > 0){
                                    alertMsg("项目[" + data.error + "]\n规划出错！", "warning");
                                }else{
                                    alertMsg("规划创建成功！将跳转至人力规划页面", "success");
                                    window.location.href = "manhour_planning.html";
                                }

                            }
                            else if(data.tag == 'reject'){
                                //不具有查看权限
                                alertMsg("本内容仅部门主管可创建，您不具有该权限。", "danger");
                            }else{
                                //输出错误信息
                                alertMsg("Error: " + data.tag, 'warning');
                            }
                        }
                    });
                }else{
                    alertMsg("请填写有效的工时规划数据再提交", "danger");
                }

            }else{
                alertMsg("请填写有效的开始日期","danger");
            }
        });

    });

    function weekToDate(value){
        var s = value.split("-W");
        var year = parseInt(s[0]);
        var week = parseInt(s[1]);
        var firstDay = new Date(year,0,1);
        return new Date(firstDay.getTime() + (((week - 1) * 7) + (8 - firstDay.getDay()) % 7) * 24 * 60 * 60 * 1000);
    }

})();