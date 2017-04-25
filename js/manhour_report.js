/**
 * Created by wx_h0001 on 2016/10/20.
 */

(function () {

    var chartData = [];         //可编辑的工时数据表
    chartData[0] = {};          //初始化第个标签页数据
    var projectList = [];

    //页面初始化
    $(document).ready(function () {
        freshMyPage();

        $.ajax({
            url: "/" + projectName + "/php/manhour_record.php",
            type: "POST",
            dataType : 'json',
            success: function (data) {
                projectList = data.project;
                if (data.manhour.length <= 0 ||dayDiff(data.manhour[0].week) >= 7){
                    //若本周尚未有记录，则新建本周的工时表
                    newEditableChart();
                }

                //显示近四周的工时记录，草稿状态的内容将以可编辑的形式呈现
                for(var i = 0, week = null, tabIndex = null, dispatch = null, l = data.manhour.length; i < l; ++i){
                    if(data.manhour[i].week == week){
                        dispatch(data.manhour[i], tabIndex);
                    }else{
                        week = data.manhour[i].week;
                        if (dayDiff(week) < 7){
                            tabIndex = 0;
                        }else{
                            tabIndex = newManhourTab(week, data.project);
                        }
                        if(data.manhour[i].isDraft == 1){
                            dispatch = fillEditableChart;
                        }else{
                            dispatch = fillReadOnlyChart;
                        }
                        dispatch(data.manhour[i], tabIndex, true);
                    }
                }

                $("#week_0").click(function () {
                    onManhourTabChanged();
                });

                //初始化提交和保存草稿按钮的状态
                onManhourTabChanged();
            }
        });

    });


    function newEditableChart(){
        if (projectList.length <= 0){
            alertMsg("没有任何项目记录，请与技术人员联系", "warning");
            return;
        }
        //for(var i in project){
        //    chartData[0][project[i].id] = {week: week, d1: 0, d2: 0, d3: 0, d4: 0, d5: 0, d6: 0, d7: 0, note: ""};
        //    $("<tr></tr>").append(
        //        $("<td></td>").text(project[i].name),
        //        $("<td></td>").text(project[i].id),
        //        $("<td></td>").append($("<input type='number' value='0'/>").change(project[i].id, function (e) {
        //            chartData[0][e.data]['d1'] = $(this).val();
        //        })),
        //        $("<td></td>").append($("<input type='number' value='0'/>").change(project[i].id, function (e) {
        //            chartData[0][e.data]['d2'] = $(this).val();
        //        })),
        //        $("<td></td>").append($("<input type='number' value='0'/>").change(project[i].id, function (e) {
        //            chartData[0][e.data]['d3'] = $(this).val();
        //        })),
        //        $("<td></td>").append($("<input type='number' value='0'/>").change(project[i].id, function (e) {
        //            chartData[0][e.data]['d4'] = $(this).val();
        //        })),
        //        $("<td></td>").append($("<input type='number' value='0'/>").change(project[i].id, function (e) {
        //            chartData[0][e.data]['d5'] = $(this).val();
        //        })),
        //        $("<td></td>").append($("<input type='number' value='0'/>").change(project[i].id, function (e) {
        //            chartData[0][e.data]['d6'] = $(this).val();
        //        })),
        //        $("<td></td>").append($("<input type='number' value='0'/>").change(project[i].id, function (e) {
        //            chartData[0][e.data]['d7'] = $(this).val();
        //        })),
        //        $("<td></td>").append($("<input placeholder='请填写备注信息'/>").change(project[i].id, function (e) {
        //            chartData[0][e.data]['note'] = $(this).val();
        //        }))
        //    ).appendTo(tbody);
        //}

        $("#delete_0").removeClass("hidden");
        //显示项目选择框
        $("<div style='margin-bottom: 20px; width: 20%'>" +
            "<select class='form-control' id='selectProject_0'>" +
            "<option value='' style='color: #b6b6b6' disabled selected>在此处添加项目...</option>" +
            "</select>" +
            "</div>").change(function () {
                if($("#report").hasClass("hidden")){
                    $("#btnReport").unbind().click(0, report);
                    $("#btnDraft").unbind().click(0, saveDraft);
                    $("#report").removeClass("hidden");
                }
                var project_id = $(this).find("option:selected").val();
                var project_name = $(this).find("option:selected").text();
                if(chartData[0][project_id] === undefined){
                    chartData[0][project_id] = {week: thisWeekDate(), d1: 0, d2: 0, d3: 0, d4: 0, d5: 0, d6: 0, d7: 0, note: ""};
                    $("<tr></tr>").append(
                        $("<td></td>").append($("<a type='button' class='badge bg-red'><i class='fa fa-trash-o'></i></a>").click(project_id,function (e) {
                            delete chartData[0][e.data];
                            $(this).parent().parent().remove();
                        })),
                        $("<td></td>").text(project_name),
                        $("<td></td>").text(project_id),
                        $("<td></td>").append($("<input type='number' value='0'/>").change(project_id, function (e) {
                            chartData[0][e.data]['d1'] = $(this).val();
                        })),
                        $("<td></td>").append($("<input type='number' value='0'/>").change(project_id, function (e) {
                            chartData[0][e.data]['d2'] = $(this).val();
                        })),
                        $("<td></td>").append($("<input type='number' value='0'/>").change(project_id, function (e) {
                            chartData[0][e.data]['d3'] = $(this).val();
                        })),
                        $("<td></td>").append($("<input type='number' value='0'/>").change(project_id, function (e) {
                            chartData[0][e.data]['d4'] = $(this).val();
                        })),
                        $("<td></td>").append($("<input type='number' value='0'/>").change(project_id, function (e) {
                            chartData[0][e.data]['d5'] = $(this).val();
                        })),
                        $("<td></td>").append($("<input type='number' value='0'/>").change(project_id, function (e) {
                            chartData[0][e.data]['d6'] = $(this).val();
                        })),
                        $("<td></td>").append($("<input type='number' value='0'/>").change(project_id, function (e) {
                            chartData[0][e.data]['d7'] = $(this).val();
                        })),
                        $("<td></td>").append($("<textarea rows='1' placeholder='请填写备注信息'></textarea>").change(project_id, function (e) {
                            chartData[0][e.data]['note'] = $(this).val();
                        }))
                    ).prependTo("#tbodyTab_0");
                }
        }).prependTo("#tab_0");
        for (var i in projectList){
            $("<option value='" + projectList[i].id + "'>" + projectList[i].name + "</option>").appendTo("#selectProject_0");
        }
    }

    //填充可编辑的工时表
    function fillEditableChart(manhour, tabIndex, isFirst){
        var isFirst = isFirst || false;
        if (isFirst){
            $("#delete_" + tabIndex).removeClass("hidden");
            //显示项目选择框
            $("<div style='margin-bottom: 20px; width: 20%'>" +
                "<select class='form-control' id='selectProject_" + tabIndex + "'>" +
                "<option value='' style='color: #b6b6b6' disabled selected>在此处添加项目...</option>" +
                "</select>" +
                "</div>").change(tabIndex, function (e) {
                var project_id = $(this).find("option:selected").val();
                var project_name = $(this).find("option:selected").text();
                var tabIndex = e.data;
                if(chartData[tabIndex][project_id] === undefined){
                    chartData[tabIndex][project_id] = {week: manhour.week, d1: 0, d2: 0, d3: 0, d4: 0, d5: 0, d6: 0, d7: 0, note: ""};
                    $("<tr></tr>").append(
                        $("<td></td>").append($("<a type='button' class='badge bg-red'><i class='fa fa-trash-o'></i></a>").click({project_id: project_id, index: tabIndex},function (e) {
                            delete chartData[e.data.index][e.data.project_id];
                            $(this).parent().parent().remove();
                        })),
                        $("<td></td>").text(project_name),
                        $("<td></td>").text(project_id),
                        $("<td></td>").append($("<input type='number' value='0'/>").change({project_id: project_id, index: tabIndex}, function (e) {
                            chartData[e.data.index][e.data.project_id]['d1'] = $(this).val();
                        })),
                        $("<td></td>").append($("<input type='number' value='0'/>").change({project_id: project_id, index: tabIndex}, function (e) {
                            chartData[e.data.index][e.data.project_id]['d2'] = $(this).val();
                        })),
                        $("<td></td>").append($("<input type='number' value='0'/>").change({project_id: project_id, index: tabIndex}, function (e) {
                            chartData[e.data.index][e.data.project_id]['d3'] = $(this).val();
                        })),
                        $("<td></td>").append($("<input type='number' value='0'/>").change({project_id: project_id, index: tabIndex}, function (e) {
                            chartData[e.data.index][e.data.project_id]['d4'] = $(this).val();
                        })),
                        $("<td></td>").append($("<input type='number' value='0'/>").change({project_id: project_id, index: tabIndex}, function (e) {
                            chartData[e.data.index][e.data.project_id]['d5'] = $(this).val();
                        })),
                        $("<td></td>").append($("<input type='number' value='0'/>").change({project_id: project_id, index: tabIndex}, function (e) {
                            chartData[e.data.index][e.data.project_id]['d6'] = $(this).val();
                        })),
                        $("<td></td>").append($("<input type='number' value='0'/>").change({project_id: project_id, index: tabIndex}, function (e) {
                            chartData[e.data.index][e.data.project_id]['d7'] = $(this).val();
                        })),
                        $("<td></td>").append($("<input placeholder='请填写备注信息'/>").change({project_id: project_id, index: tabIndex}, function (e) {
                            chartData[e.data.index][e.data.project_id]['note'] = $(this).val();
                        }))
                    ).prependTo("#tbodyTab_" + tabIndex);
                }
            }).prependTo("#tab_" + tabIndex);
            for (var i in projectList){
                $("<option value='" + projectList[i].id + "'>" + projectList[i].name + "</option>").appendTo("#selectProject_" + tabIndex);
            }
        }

        chartData[tabIndex][manhour.project_id] = {week: manhour.week, d1: manhour.d1, d2: manhour.d2, d3: manhour.d3, d4: manhour.d4, d5: manhour.d5, d6: manhour.d6, d7: manhour.d7, note: manhour.note};
        $("<tr></tr>").append(
            $("<td></td>").append("<a type='button' class='badge'><i class='fa fa-trash-o'></i></a>"),
            $("<td></td>").text(manhour.project_name),
            $("<td></td>").text(manhour.project_id),
            $("<td></td>").append($("<input type='number' value='" + manhour.d1 + "' />").change({project_id: manhour.project_id, index: tabIndex}, function (e) {
                chartData[e.data.index][e.data.project_id]['d1'] = $(this).val();
            })),
            $("<td></td>").append($("<input type='number' value='" + manhour.d2 + "' />").change({project_id: manhour.project_id, index: tabIndex}, function (e) {
                chartData[e.data.index][e.data.project_id]['d2'] = $(this).val();
            })),
            $("<td></td>").append($("<input type='number' value='" + manhour.d3 + "' />").change({project_id: manhour.project_id, index: tabIndex}, function (e) {
                chartData[e.data.index][e.data.project_id]['d3'] = $(this).val();
            })),
            $("<td></td>").append($("<input type='number' value='" + manhour.d4 + "' />").change({project_id: manhour.project_id, index: tabIndex}, function (e) {
                chartData[e.data.index][e.data.project_id]['d4'] = $(this).val();
            })),
            $("<td></td>").append($("<input type='number' value='" + manhour.d5 + "' />").change({project_id: manhour.project_id, index: tabIndex}, function (e) {
                chartData[e.data.index][e.data.project_id]['d5'] = $(this).val();
            })),
            $("<td></td>").append($("<input type='number' value='" + manhour.d6 + "' />").change({project_id: manhour.project_id, index: tabIndex}, function (e) {
                chartData[e.data.index][e.data.project_id]['d6'] = $(this).val();
            })),
            $("<td></td>").append($("<input type='number' value='" + manhour.d7 + "' />").change({project_id: manhour.project_id, index: tabIndex}, function (e) {
                chartData[e.data.index][e.data.project_id]['d7'] = $(this).val();
            })),
            $("<td></td>").append($("<input value='" + manhour.note + "' />").change({project_id: manhour.project_id, index: tabIndex}, function (e) {
                chartData[e.data.index][e.data.project_id]['note'] = $(this).val();
            }))
        ).appendTo("#tbodyTab_" + tabIndex);
    }


    function fillReadOnlyChart(manhour, tabIndex, isFirst){
        chartData[tabIndex] = {};
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
        ).appendTo("#tbodyTab_" + tabIndex);
    }

    //新建一个工时标签页
    function newManhourTab(week, project){
        var n = chartData.length;
        $("#manhourPanel").append("<div class='tab-pane' id='tab_" + n + "'>" +
            "<table class='table table-bordered'>" +
                "<thead>" +
                "<tr>" +
                    "<th class='notehh hidden' style='width: 4%' id='delete_" + n + "'><small>撤销</small></th>" +
                    "<th class='notehh' style='width: 12%'><small>项目名称</small></th> " +
                    "<th class='notehh' style='width: 8%'><small>项目编号</small></th> " +
                    "<th class='notehh' style='width: 6%'><small>周一</small></th> " +
                    "<th class='notehh' style='width: 6%'><small>周二</small></th> " +
                    "<th class='notehh' style='width: 6%'><small>周三</small></th> " +
                    "<th class='notehh' style='width: 6%'><small>周四</small></th> " +
                    "<th class='notehh' style='width: 6%'><small>周五</small></th> " +
                    "<th class='notehh' style='width: 6%'><small>周六</small></th> " +
                    "<th class='notehh' style='width: 6%'><small>周日</small></th> " +
                    "<th class='notehh' style='width: 38%'><small>备注</small></th> " +
                "</tr>" +
                "</thead>" +
                "<tbody id='tbodyTab_" + n + "'></tbody>" +
                "</table> " +
            "</div>");
        //$("#manhourList").append("<li><a href='#tab_" + n + "' data-toggle='tab'>" + week + "</a></li>");
        $("<li></li>").append($("<a href='#tab_" + n + "' data-toggle='tab'>" + week + "</a>").click(n, function (e) {
            onManhourTabChanged(e.data);
        })).appendTo("#manhourList");

        chartData[n] = {};
        return n;
    }


    //计算目标日期距今的天数之差
    function dayDiff(date){
        var DAY = 1000 * 60 * 60 * 24;
        var today = new Date();
        var d = Date.parse(date.replace(/-/g, '/'));
        return Math.round(Math.abs(today - d) / DAY);
    }

    //切换标签页时对应改变“提交”和“保存草稿”的数据目标
    function onManhourTabChanged(n){
        var n = n || 0;
        if (!$.isEmptyObject(chartData[n])){
            $("#btnReport").unbind().click(n, report);
            $("#btnDraft").unbind().click(n, saveDraft);
            $("#report").removeClass("hidden");
        }else{
            $("#btnReport").unbind();
            $("#btnDraft").unbind();
            $("#report").addClass("hidden");
        }

    }

    //提交工时表
    function report(e){
        var data = chartData[e.data];
        if($.isEmptyObject(data)){
            alertMsg("该标签页无可提交信息！", "danger");
            return;
        }
        var sum = [0, 0, 0, 0, 0, 0, 0];
        var enough = 0;
        for (var i in data){
            sum[0] += parseFloat(data[i].d1);
            sum[1] += parseFloat(data[i].d2);
            sum[2] += parseFloat(data[i].d3);
            sum[3] += parseFloat(data[i].d4);
            sum[4] += parseFloat(data[i].d5);
            sum[5] += parseFloat(data[i].d6);
            sum[6] += parseFloat(data[i].d7);
        }
        var sumofall = (sum[0] + sum[1] + sum[2] + sum[3] + sum[4] + sum[5] + sum[6]);
        for (var i in sum){
            if (i < 5 && sum[i] < 8){
                enough = parseInt(i) + 1;
            }
        }
        if (enough === 0){
            if (confirm("总计" + sumofall + "个工时，" + (sum < 40 ? "不足40工时，": "") + "提交后无法修改，是否确认？")){
                $.ajax({
                    url: "/" + projectName + "/php/manhour_report.php",
                    type: "POST",
                    dataType : 'json',
                    data: {data: JSON.stringify(data), action: 'report'},
                    success: function (data){
                        if (data == 0){
                            alertMsg("工时信息提交成功！", "success");
                            window.location.reload();
                        }else if(data == 1){
                            alertMsg("数据记录未变化，请确认是否提交了有效数据。", "danger");
                        }else{
                            alertMsg("数据异常！请联系技术人员！", "warning");
                            console.log("return value error!");
                        }
                    }
                });
            }
        }else{
            var m;
            switch (enough){
                case 1:
                    m = "周一";
                    break;
                case 2:
                    m = "周二";
                    break;
                case 3:
                    m = "周三";
                    break;
                case 4:
                    m = "周四";
                    break;
                case 5:
                    m = "周五";
                    break;
                default:
                    m = "Error";
                    break;
            }
            alertMsg(m + "的工时总量不足8小时，请更改后提交", "danger");
        }



    }

    //保存草稿
    function saveDraft(e){
        var data = chartData[e.data];
        if($.isEmptyObject(data)){
            alertMsg("该标签页无可保存信息！", "danger");
            return;
        }

        $.ajax({
            url: "/" + projectName + "/php/manhour_report.php",
            type: "POST",
            dataType : 'json',
            data: {data: JSON.stringify(data), action: 'draft'},
            success: function (data){
                if (data == 0){
                    alertMsg("保存草稿成功！", "success");
                    window.location.reload();
                }else if(data == 1){
                    alertMsg("数据记录未变化，请确认是否提交了有效数据。", "danger");
                }else{
                    alertMsg("数据异常！请联系技术人员！", "warning");
                    console.log("return value error!");
                }
            }
        });
    }

    function thisWeekDate(){
        //计算本周周一的日期
        var DAY = 1000 * 60 * 60 * 24;
        var today = new Date();
        var weekDate = new Date(today - ((today.getDay() + 6) % 7) * DAY);
        var week = weekDate.getFullYear() + "-" + (weekDate.getMonth() + 1) + "-" + weekDate.getDate();
        return week;
    }
})();