/**
 * Created by wx_h0001 on 2016/10/23.
 */

(function () {
    var planData = [];
    var manhourData = [];
    var staff_uid = null;
    var createPlan = {};
    $(document).ready(function () {
        freshMyPage();

        //验证登录者的权限
        //$.ajax({
        //    url: "../../php/manhour_planning.php",
        //    type: "POST",
        //    data: {action: 'init'},
        //    dataType: "json",
        //    success: function (data) {
        //        if(data.tag == 'reject')
        //        {
        //            //不具有查看权限
        //            alertMsg("本内容仅部门经理可查看，您不具有该权限。", "warning");
        //        }else if (data.tag == 'permit'){
        //            //没有消息就是好消息
        //        }else{
        //            //输出错误信息
        //            alertMsg("Error: " + data.tag, 'danger');
        //        }
        //    }
        //});

        //员工查找
        $("#inputSearchStaff").bigAutocomplete({
            url: "../../php/autocomplete.php?type=staff",
            callback: function(data){
                if (data){
                    staff_uid = data.id;
                    $.ajax({
                        url: "../../php/manhour_planning.php",
                        type: "POST",
                        data: {staff_uid: staff_uid, action: 'staff'},
                        dataType: "json",
                        success: function(data){
                            if (data.tag == 'permit'){
                                $("#detail_content").removeClass('hidden');
                                emptyStaff();
                                //呈现员工基本信息
                                if (data.staff){
                                    $("#staff_name").text(data.staff.name);
                                    $("#staff_uid").text(data.staff.uid);
                                    $("#staff_sex").text(data.staff.sex);
                                    $("#staff_date").text(data.staff.date);
                                    $("#staff_department").text(data.staff.department);
                                    $("#staff_team").text(data.staff.team);
                                    $("#staff_title").text(data.staff.title);
                                    $("#staff_tele").text(data.staff.tele);
                                    $("#staff_top").text(data.staff.top);
                                    $("#staff_email").text(data.staff.email);
                                }else {
                                    alertMsg('Error: 获取员工信息错误', 'danger')
                                }

                                //呈现近120天内制定的计划
                                if (data.plan.length > 0){
                                    for(var i = 0, week = null, tabIndex = -1, l = data.plan.length; i < l; ++i){
                                        if(data.plan[i].week == week){
                                            fillPlantable(data.plan[i], tabIndex);
                                        }else{
                                            week = data.plan[i].week;
                                            ++tabIndex;
                                            newPlanTab(week, data.plan[i].timelong, tabIndex);
                                            fillPlantable(data.plan[i], tabIndex);
                                        }
                                    }
                                    //设置第一个标签默认显示
                                    if ($("#planList").find('li').length > 0){
                                        $('#planList a:first').tab('show');
                                        onPlanTabChanged(0);
                                    }
                                }else{
                                    $("#planPanel").append("<div class='tab-pane active' id='tab_plan_0'><p>暂无规划</p></div>");
                                    $("#planList").append("<li class='active'><a href='#tab_plan_0' data-toggle='tab'>无数据</a></li>");
                                }
                                showPlanningCreateTab();

                            }else if(data.tag == 'reject'){
                                //不具有查看权限
                                alertMsg("本内容仅部门经理可查看，您不具有该权限。", "warning");
                            }else{
                                //输出错误信息
                                alertMsg("Error: " + data.tag, 'danger');
                            }
                        }
                    })
                }
            }
        });

    });

    //新增一个人力规划标签页
    function newPlanTab(week, timelong, tabIndex){
        $("#planPanel").append("<div class='tab-pane' id='tab_plan_" + tabIndex + "'>" +
            "<table class='table table-bordered'>" +
            "<thead>" +
            "<tr>" +
            "<th class='notehh' style='width: 20%'><small>项目编号</small></th>" +
            "<th class='notehh' style='width: 20%'><small>项目名称</small></th>" +
            "<th class='notehh' style='width: 15%'><small>分配工时</small></th>" +
            "<th class='notehh' style='width: 30%'><small></small></th>" +
            "<th class='notehh' style='width: 15%'><small>完成工时</small></th>" +
            "</tr>" +
            "</thead>" +
            "<tbody id='tbody_plan_" + tabIndex + "'></tbody>" +
            "</table>" +
            "</div>");

        var DAY = 1000 * 60 * 60 * 24;
        var end = new Date((new Date(week)).valueOf() + DAY * (timelong * 7 - 1));
        var label = week + "至" + end.getFullYear() + "-" + (end.getMonth() + 1) + "-" + end.getDate();
        $("<li></li>").append($("<a href='#tab_plan_" + tabIndex + "' data-toggle='tab'>" + label + "</a>").click(tabIndex, function (e) {
            onPlanTabChanged(e.data);
        })).appendTo("#planList");
        planData[tabIndex] = {};
    }

    //创建人力规划表
    function showPlanningCreateTab(){
        $("<li class='pull-right'></li>").append($("<a role='button'><i class='fa fa-plus-square' style='margin-right: 10px'></i>创建规划</a>").click(function () {
            createPlan = {week: '', timelong: '', plan: {}};

            $.ajax({
                url: "../../php/manhour_planning.php",
                type: "POST",
                data: {action: 'project'},
                dataType: "json",
                success: function (data) {
                    //显示项目选择列表
                    if (data.tag == 'permit'){
                        if (typeof data.project !== undefined){
                            for (var i in data.project){
                                $("<option value='" + data.project[i].id + "'>" + data.project[i].name + "</option>").appendTo("#create_plan_project_select");
                            }
                        }

                        $("#create_plan_starttime").change(function () {
                            var timelong = 4;   //默认4周时长
                            var week = weekToDate($(this).val());
                            var endweek = new Date(week.getTime() + (timelong * 7 - 1) * 24 * 60 * 60 *1000);
                            createPlan.week = week.getFullYear() + '-' + (week.getMonth() + 1) + '-' + week.getDate();
                            createPlan.timelong = timelong;
                            $("#create_plan_time").text(createPlan.week + ' 至 ' + endweek.getFullYear() + '-' + (endweek.getMonth() + 1) + '-' + endweek.getDate());
                            $("#create_plan_left_manhour").text(timelong * 5 * 8 + " / " + timelong * 5 * 8);
                            $("#saturation").text('0%')
                        });

                        $("#create_plan_project_select").change(function () {
                            var project_id = $(this).find("option:selected").val();
                            var project_name = $(this).find("option:selected").text();
                            if (typeof createPlan.plan[project_id] === "undefined"){
                                createPlan.plan[project_id] = 0;
                                $("<tr></tr>").append(
                                    $("<td></td>").append($("<a type='button' class='badge bg-red'><i class='fa fa-trash-o'></i></a>").click(project_id,function (e) {
                                        var n = parseInt(createPlan.plan[e.data]);
                                        var m = ($("#create_plan_left_manhour").text()).split(" / ");
                                        var left = parseInt(m[0]);
                                        var amount = parseInt(m[1]);
                                        $("#create_plan_left_manhour").text((left + n) + " / " + amount);
                                        $("#saturation").text(Math.round((amount - left - n) / amount * 100) + "%");
                                        delete createPlan.plan[e.data];
                                        $(this).parent().parent().remove();
                                    })),
                                    $("<td></td>").text(project_name),
                                    $("<td></td>").text(project_id),
                                    $("<td></td>").append($("<input type='number' value='0'/>").change(project_id, function (e) {
                                        var old = parseInt($(this).data('value'));
                                        var n = parseInt($(this).val());
                                        if (!isNaN(n)){
                                            var m = ($("#create_plan_left_manhour").text()).split(" / ");
                                            var left = parseInt(m[0]);
                                            var amount = parseInt(m[1]);
                                            createPlan.plan[e.data] = n;
                                            $("#create_plan_left_manhour").text((left - n + old) + " / " + amount);
                                            $("#saturation").text(Math.round((amount - left + n - old) / amount * 100) + "%");
                                            $(this).data('value', n);
                                        }else{
                                            $(this).val(old);
                                            this.focus();
                                        }

                                    }).data('value', 0))
                                ).appendTo("#tbodyCreatePlan");
                            }
                        });

                        $("#btn_create_plan_save").click(function () {
                            if (!$.isEmptyObject(createPlan.plan)){
                                $.ajax({
                                    url: "../../php/manhour_planning.php",
                                    type: "POST",
                                    data: {action: 'create', plans: JSON.stringify(createPlan), staff_uid: staff_uid},
                                    dataType: "json",
                                    success: function (data) {
                                        if (data.tag === 'permit'){
                                            if (data.error.length > 0){
                                                alertMsg("项目[" + data.error + "]\n规划出错！", "warning");
                                            }else{
                                                alertMsg("规划创建成功！本页面将会刷新", "success");
                                                window.location.reload();
                                            }

                                        }
                                        else if(data.tag === 'reject'){
                                            //不具有查看权限
                                            alertMsg("本内容仅部门主管可创建，您不具有该权限。", "danger");
                                        }else{
                                            //输出错误信息
                                            alertMsg("Error: " + data.tag, 'warning');
                                        }
                                    }
                                });
                            }else {
                                alertMsg('请至少添加一项规划', 'danger');
                            }
                        });

                        $("#modalCreatePlanning").modal('show');
                    }
                    else if(data.tag == 'reject'){
                        //不具有查看权限
                        alertMsg("本内容仅部门经理可创建，您不具有该权限。", "danger");
                    }else{
                        //输出错误信息
                        alertMsg("Error: " + data.tag, 'warning');
                    }
                }
            });
        })).appendTo("#planList");
    }

    //呈现规划表的信息
    function fillPlantable(plan, tabIndex){
        planData[tabIndex][plan.project_id] = {name: plan.project_name, week: plan.week, plan: plan.plan, practice: plan.practice};
        var progress = Math.round(plan.practice / plan.plan * 100);
        $("<tr></tr>").append(
            $("<td></td>").text(plan.project_id),
            $("<td></td>").text(plan.project_name),
            $("<td></td>").text(plan.plan),
            $("<td></td>").html("<div class='progress xs progress-striped active'><div class='progress-bar progress-bar-success' style='width: " + progress + "%'></div></div>"),
            $("<td></td>").text(plan.practice)
        ).appendTo("#tbody_plan_" + tabIndex);
    }

    //规划标签切换
    function onPlanTabChanged(index){
        //绘制饼图
        var piePlan = [];
        var piePractice = [];
        for(var i in planData[index]){
            pieColor = '#00' + (0x9933 + 0x66 * i).toString(16);
            piePlan.push({label: planData[index][i].name, data: planData[index][i].plan, color: pieColor});
            piePractice.push({label: planData[index][i].name, data: planData[index][i].practice, color: pieColor});
        }
        $.plot("#piePlan", piePlan, {
            series: {
                pie: {
                    show: true,
                    radius: 1,
                    innerRadius: 0,
                    label: {
                        show: true,
                        radius: 1 / 2,
                        formatter: labelFormatter,
                        threshold: 0.1
                    }
                }
            },
            legend: {
                show: false
            }
        });
        $.plot("#piePractice", piePractice, {
            series: {
                pie: {
                    show: true,
                    radius: 1,
                    innerRadius: 0,
                    label: {
                        show: true,
                        radius: 1 / 2,
                        formatter: labelFormatter,
                        threshold: 0.1
                    }
                }
            },
            legend: {
                show: false
            }
        });

        //显示工时表信息
        var w = (function () {
            for (var i in planData[index]){
                return planData[index][i].week;
            }
        })();
        $.ajax({
            url: "../../php/manhour_planning.php",
            type: "POST",
            data: {staff_uid: staff_uid, plan_week: w , action: 'manhour'},
            dataType: "json",
            success: function (data) {
                if (data.tag == 'permit'){
                    emptyManhour();
                    if (data.manhour.length > 0){
                        for(var i = 0, week = null, tabIndex = -1, l = data.manhour.length; i < l; ++i){
                            if(data.manhour[i].week == week){
                                fillManhourtable(data.manhour[i], tabIndex);
                            }else{
                                week = data.manhour[i].week;
                                ++tabIndex;
                                newManhourTab(week, tabIndex);
                                fillManhourtable(data.manhour[i], tabIndex);
                            }
                        }
                        //设置第一个标签默认显示
                        if ($("#manhourList").find('li').length > 0){
                            $('#manhourList a:first').tab('show');
                            onManhourTabChanged(0);
                        }
                    }else{
                        $("#manhourPanel").append("<div class='tab-pane active' id='tab_manhour_0'><p>暂无工时表</p></div>");
                        $("#manhourList").append("<li class='active'><a href='#tab_manhour_0' data-toggle='tab'>无数据</a></li>");
                    }

                }else if(data.tag == 'reject'){
                    //不具有查看权限
                    alertMsg("本内容仅部门经理可查看，您不具有该权限。", "warning");
                }else{
                    //输出错误信息
                    alertMsg("Error: " + data.tag, 'danger');
                }
            }
        });
    }

    //清空当前页面信息
    function emptyStaff(){
        emptyManhour();
        $("#staff_name").text("-");
        $("#staff_uid").text("-");
        $("#staff_sex").text("-");
        $("#staff_date").text("-");
        $("#staff_department").text("-");
        $("#staff_team").text("-");
        $("#staff_title").text("-");
        $("#staff_tele").text("-");
        $("#staff_top").text("-");
        $("#staff_email").text("-");
        $("#planList").empty();
        $("#planPanel").empty();
        $("#piePlan").empty();
        $("#piePractice").empty();
        //staff_uid = null;
        planData = [];
    }

    function fillManhourtable(manhour, tabIndex){
        manhourData[tabIndex][manhour.project_id] = {name: manhour.project_name, d: (parseFloat(manhour.d1) + parseFloat(manhour.d2) + parseFloat(manhour.d3) + parseFloat(manhour.d4) + parseFloat(manhour.d5) + parseFloat(manhour.d6) + parseFloat(manhour.d7))};
        $("<tr></tr>").append(
            $("<td></td>").text(manhour.project_name),
            $("<td></td>").text(manhour.project_id),
            $("<td></td>").text(manhour.d1),
            $("<td></td>").text(manhour.d2),
            $("<td></td>").text(manhour.d3),
            $("<td></td>").text(manhour.d4),
            $("<td></td>").text(manhour.d5),
            $("<td></td>").text(manhour.d6),
            $("<td></td>").text(manhour.d7),
            $("<td></td>").text(manhour.note)
        ).appendTo("#tbody_manhour_" + tabIndex);
    }

    function onManhourTabChanged(index){
        var pieManhour = [];
        for(var i in manhourData[index]){
            pieColor = '#00' + (0x9933 + 0x66 * i).toString(16);
            pieManhour.push({label: manhourData[index][i].name, data: manhourData[index][i].d, color: pieColor});
        }
        $.plot("#pieManhour", pieManhour, {
            series: {
                pie: {
                    show: true,
                    radius: 1,
                    innerRadius: 0,
                    label: {
                        show: true,
                        radius: 1 / 2,
                        formatter: labelFormatter,
                        threshold: 0.1
                    }
                }
            },
            legend: {
                show: false
            }
        });
    }

    function newManhourTab(week, tabIndex){
        $("#manhourPanel").append("<div class='tab-pane' id='tab_manhour_" + tabIndex + "'>" +
            "<table class='table table-bordered'>" +
            "<thead>" +
            "<tr>" +
            "<th class='notehh' style='width: 12%'><small>项目名称</small></th>" +
            "<th class='notehh' style='width: 8%'><small>项目编号</small></th>" +
            "<th class='notehh' style='width: 6%'><small>周一</small></th>" +
            "<th class='notehh' style='width: 6%'><small>周二</small></th>" +
            "<th class='notehh' style='width: 6%'><small>周三</small></th>" +
            "<th class='notehh' style='width: 6%'><small>周四</small></th>" +
            "<th class='notehh' style='width: 6%'><small>周五</small></th>" +
            "<th class='notehh' style='width: 6%'><small>周六</small></th>" +
            "<th class='notehh' style='width: 6%'><small>周日</small></th>" +
            "<th class='notehh' style='width: 38%'><small>备注</small></th>" +
            "</tr>" +
            "</thead>" +
            "<tbody id='tbody_manhour_" + tabIndex + "'></tbody>" +
            "</table>" +
            "</div>");
        $("<li></li>").append($("<a href='#tab_manhour_" + tabIndex + "' data-toggle='tab'>" + week + "</a>").click(tabIndex, function (e) {
            onManhourTabChanged(e.data);
        })).appendTo("#manhourList");
        manhourData[tabIndex] = {};
    }

    function emptyManhour(){
        $("#pieManhour").empty();
        $("#manhourList").empty();
        $("#manhourPanel").empty();
        manhourData = [];
    }

    function weekToDate(value){
        var s = value.split("-W");
        var year = parseInt(s[0]);
        var week = parseInt(s[1]);
        var firstDay = new Date(year,0,1);
        return new Date(firstDay.getTime() + (((week - 1) * 7) + (8 - firstDay.getDay()) % 7) * 24 * 60 * 60 * 1000);
    }

    /*
     * Custom Label formatter
     * ----------------------
     */
    function labelFormatter(label, series) {
        return "<div style='font-size:13px; text-align:center; padding:2px; color: #fff; font-weight: 500;'>"
            + label
            + "<br/>"
            + Math.round(series.percent) + "%</div>";
    }

})();