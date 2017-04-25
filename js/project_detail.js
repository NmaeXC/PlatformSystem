/**
 * Created by wx_h0001 on 2016/10/16.
 */

(function () {
    freshMyPage();

    var PROJECT_ID = getQueryString("x");
    var isStatic = false;        //是否为默认的项目
    var isCharge = false;        //是否具有负责人权限

    if (PROJECT_ID !== null)
    {
        //初始化页面
        initPage();
    }
    else
    {
        alertMsg("项目编号错误！无法显示！","danger")
    }

    function initPage(){
        $.ajax({
            url: "../../php/project_detail.php",
            type: "POST",
            dataType: "json",
            data : {project_id: PROJECT_ID},
            success: function(data){
                if (data.tag != null) {

                    if (data.tag === 'charge') {
                        //项目负责人特殊化处理
                        isCharge = true;
                        $(".charge_option").removeClass("hidden");
                    }

                    //显示里程碑信息
                    var milestone_data = [];
                    var today = new Date();
                    var start_time = new Date(data.info.start_time);
                    var end_time = new Date(data.info.end_time);
                    milestone_data.push({
                        id: 0,
                        name: "Now",
                        disc: "当前日期为：" + today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate(),
                        on: today,
                        now: true
                    }, {
                        id: 1,
                        name: "Start",
                        disc: "开始日期为：" + start_time.getFullYear() + "-" + (start_time.getMonth() + 1) + "-" + start_time.getDate(),
                        on: start_time,
                        now: true
                    }, {
                        id: 2,
                        name: "End",
                        disc: "截止日期为：" + end_time.getFullYear() + "-" + (end_time.getMonth() + 1) + "-" + end_time.getDate(),
                        on: end_time,
                        now: true
                    });
                    for (var i in data.milestone) {
                        milestone_data.push({
                            id: parseInt(i) + 3,
                            name: "里程碑-" + (parseInt(i) + 1),
                            disc: data.milestone[i].disc,
                            on: new Date(data.milestone[i].date)
                        });
                    }
                    var numYears = parseInt(end_time.getFullYear()) - parseInt(start_time.getFullYear()) + 1;

                    var tl = $('#timeline').jqtimeline({
                        gap: 100 / numYears,
                        events: milestone_data,
                        numYears: numYears,
                        startYear: start_time.getFullYear(),
                        click: function (e, event) {
                            alertMsg(event.disc, "info");
                        }

                    });


                    //预计工时不为正则不予显示进度相关信息
                    if (data.info.man_hours > 0) {
                        var pieData = [];
                        var progress = Math.floor(data.info.done / data.info.man_hours * 100);
                        var bar = 'primary';
                        if (progress >= 80 && progress < 100) {
                            bar = 'warning';
                        } else if (progress >= 100) {
                            bar = 'danger';
                        }
                        $("#rate").html(progress + "<sup style='font-size: 20px'>%</sup>");
                        $("#done").html(data.info.done + "/" + data.info.man_hours + "<sub style='font-size: 20px'>h</sub>");
                        $("#process").css("width", progress + "%").addClass("progress-bar-" + bar);
                        $("#project_manhours").text(data.info.man_hours);
                        for (var i in data.developer) {
                            progress = Math.floor(data.developer[i].done / data.developer[i].man_hours * 100);
                            bar = 'primary';
                            if (progress >= 80 && progress < 100) {
                                bar = 'warning';
                            } else if (progress >= 100) {
                                bar = 'danger';
                            }
                            $("<tr></tr>").append(isCharge ? $("<td>" +
                                    "<a type='button' class='badge bg-light-blue'><i class='fa fa-pencil'></i></a>" +
                                    "</td>")
                                .find("a").click(data.developer[i], function (e) {
                                        //管理发开人员
                                    }).end() : null)
                                .append(isCharge ? $("<td>" +
                                    "<a type='button' class='badge bg-red'><i class='fa fa-trash-o'></i></a>" +
                                    "</td>")
                                    .find("a").click(data.developer[i].id, function (e) {
                                        //删除开发人员
                                    }).end() : null)
                                .append(
                                    $("<td></td>").text((parseInt(i) + 1) + "."),
                                    $("<td></td>").text(data.developer[i].name),
                                    $("<td></td>").text(data.developer[i].uid),
                                    $("<td></td>").text(data.developer[i].man_hours),
                                    $("<td title='" + progress + "%'></td>").html("<div class='progress xs progress-striped active'><div class='progress-bar progress-bar-" + bar + "' style='width: " + progress + "%'></div></div>"),
                                    $("<td></td>").text(data.developer[i].done),
                                    $("<td></td>").html("<a role='button'><span class='badge bg-light-blue'>查看</span>").click(data.developer[i].uid, function (e) {
                                        //查看工时表
                                        showManHour(e.data);
                                    })
                                ).append(isCharge ? $("<td></td>").html("<label><input type='checkbox'></label>") : null)
                                .appendTo("#tbody_developer");
                            pieColor = '#00' + (0x9933 + 0x66 * i).toString(16);
                            pieData.push({
                                label: data.developer[i].name,
                                data: data.developer[i].man_hours,
                                color: pieColor
                            });
                        }
                    } else {
                        isStatic = true;
                        $(".unstatic_option").addClass("hidden");
                        $(".static_option").removeClass("hidden");
                        $("done").text(data.info.done);
                        for (var i in data.developer) {
                            $("<tr></tr>").append(
                                $("<td class='hidden'>" +
                                    "<a type='button' class='badge bg-light-blue'><i class='fa fa-pencil'></i></a>" +
                                    "</td>")
                                    .find("a").click(data.developer[i], function (e) {
                                    //管理发开人员
                                }),
                                $("<td class='hidden'>" +
                                    "<a type='button' class='badge bg-red'><i class='fa fa-trash-o'></i></a>" +
                                    "</td>")
                                    .find("a").click(data.developer[i].id, function (e) {
                                    //删除开发人员
                                }),

                                $("<td></td>").text((parseInt(i) + 1) + "."),
                                $("<td></td>").text(data.developer[i].name),
                                $("<td></td>").text(data.developer[i].uid),
                                $("<td></td>").text(data.developer[i].done),
                                $("<td></td>").html("<a role='button'><span class='badge bg-light-blue'>查看</span>").click(data.developer[i].uid, function (e) {
                                    //查看工时表
                                    showManHour(e.data);
                                })
                            ).append(isCharge ? $("<td></td>").html("<label><input type='checkbox'></label>") : null)
                                .appendTo("#tbody_developer");
                        }

                    }

                    $("#project_name").text(data.info.name);
                    $("#project_id").text(data.info.id);
                    $("#project_charge").text(data.info.charge);
                    $("#project_manhours").text(isStatic ? "-" : data.info.man_hours);
                    $("#project_time").text(data.info.start_time + " 至 " + data.info.end_time);
                    $("#project_state").text(data.info.state);
                    $("#project_disc").text(data.info.disc);

                    //显示项目分配饼图

                    if (pieData == []) {
                        pieData = [{label: "全部", data: 100, color: "#3c8dbc"}];
                    }
                    $.plot("#pieChart", pieData, {
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


                } else {
                    //不具有查看权限
                    alertMsg("您不具有查看此项目详情的权限，建议向项目负责人申请。", "warning");
                }
            }
        });
    }

    //获取页面参数name
    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }


    //显示工时表
    function showManHour(developer){
        clearManhour();
        if (developer != null){
            $.ajax({
                url: "../../php/project_detail_manhour.php",
                type: "POST",
                dataType: "json",
                data : {developer: developer, project_id: PROJECT_ID, week: null},
                success: function (data) {
                    if(data.tag == null){
                        alertMsg("您不具有查看该员工工时详情的权限。", "warning");
                    }else{
                        if (data.manhour.length > 0)
                        {
                            for (var i in data.manhour){
                                newManhourTab(data.manhour[i].week, i);
                                fillManhourChart("#tbodyTab_" + i, data.manhour[i]);
                            }
                            $('#manhourList a:first').tab('show');
                            $("#manhour_chart").removeClass("hidden");
                            window.location.hash = '#manhour_chart';
                        }else {
                            alertMsg("没有工时记录", "info");
                        }

                    }
                }
            });


        }else {
            alertMsg("开发人员信息有误，请重新加载页面或与技术人员联系", "danger");
        }
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
            "<tbody id='tbodyTab_" + tabIndex + "'></tbody>" +
            "</table>" +
            "</div>");
        $("<li></li>").append($("<a href='#tab_manhour_" + tabIndex + "' data-toggle='tab'>" + week + "</a>")).appendTo("#manhourList");
    }

    //填充工时表
    function fillManhourChart(tbody, data){
        $("<tr></tr>").append(
            $("<td></td>").text(data.project_name),
            $("<td></td>").text(data.project_id),
            $("<td></td>").text(data.d1),
            $("<td></td>").text(data.d2),
            $("<td></td>").text(data.d3),
            $("<td></td>").text(data.d4),
            $("<td></td>").text(data.d5),
            $("<td></td>").text(data.d6),
            $("<td></td>").text(data.d7),
            $("<td></td>").text(data.note)
        ).appendTo(tbody);
    }

    //清空工时表
    function clearManhour(){
        $("#manhourPanel").empty();
        $("#manhourList").empty();
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