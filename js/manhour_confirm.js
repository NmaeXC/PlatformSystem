/**
 * Created by wx_h0001 on 2016/11/20.
 */

(function () {

    freshMyPage();

    var staff_id = '';

    $("#key").bigAutocomplete({
        url: "../../php/autocomplete.php?type=staff",
        callback: function(data){
            if(typeof(data.id) != "undefined"){
                emptyStaffInfo();
                staff_id = data.id;
                $.ajax({
                    url: "../../php/manhour_confirm.php",
                    type: "POST",
                    data: {staff_id: staff_id, action: 'init'},
                    dataType: "json",
                    success: function(data){
                        if (data.state === 'permit'){
                            displayStaffInfo(data.staff);

                            //呈现近四周的工时记录
                            if (data.manhour.length > 0){
                                displayManhour(data.manhour);
                            }else {
                                $("#manhourPanel").text("近四周无任何记录,可尝试通过时间查询更早记录");
                            }

                            $("#result").removeClass('hidden');

                        }else{
                            alertMsg("(" + data.state + "): " + data.tag, 'error');
                        }

                    }
                });
            }

        }
    });

    $("#btnSearchByTime").click(function () {
        var start_week = $("#start_week").val();
        var end_week = $("#end_week").val();
        if (start_week == '' || end_week == ''){
            alertMsg("请填写起止周以供查询（包括起止周）", "danger");
        }else{
            start_week = weekToDate(start_week);
            end_week = weekToDate(end_week);

            $.ajax({
                url: "../../php/manhour_confirm.php",
                type: "POST",
                data: {staff_id: staff_id, action: 'search', start_week: start_week.getFullYear() + '-' + (start_week.getMonth() + 1) + '-' + start_week.getDate(), end_week: end_week.getFullYear() + '-' + (end_week.getMonth() + 1) + '-' + end_week.getDate()},
                dataType: "json",
                success: function(data){
                    emptytab();
                    if (data.state === 'permit'){
                        if (data.manhour.length > 0){
                            displayManhour(data.manhour);
                        }else {
                            $("#manhourPanel").text("暂无任何记录");
                        }
                    }else{
                        alertMsg("(" + data.state + "): " + data.tag, 'error');
                    }
                }
            });
        }


    });


    //呈现员工简要信息
    function displayStaffInfo(staff){
        if (typeof staff !== 'undefined'){
            $("#staffName").text(staff.name);
            $("#staffUid").text(staff.uid);
            $("#staffDepartment").text(staff.department);
            $("#staffTeam").text(staff.team);
            $("#staffTitle").text(staff.title);
            $("#staffTop").text(staff.top);
        }
    }

    //呈现工时记录
    function displayManhour(manhourList){
        emptytab();
        for(var i = 0, week = null, tabIndex = -1, l = manhourList.length; i < l; ++i){
            if (manhourList[i].week == week){
                fillManhourTab(manhourList[i], tabIndex);
            }else{
                week = manhourList[i].week;
                tabIndex = newManhourTab(week, tabIndex);
                fillManhourTab(manhourList[i], tabIndex);
            }
        }
        //激活第一个标签页
        $('#manhourList a:first').tab('show');
    }

    //填充目标标签页内的工时表
    function fillManhourTab(manhour, tabIndex){
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

    //新建工时表标签页
    function newManhourTab(week, tabIndex){
        var n = parseInt(tabIndex) + 1;
        $("#manhourPanel").append("<div class='tab-pane' id='tab_" + n + "'>" +
            "<table class='table table-bordered'>" +
            "<thead>" +
            "<tr>" +
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
        $("<li></li>").append($("<a href='#tab_" + n + "' data-toggle='tab'>" + week + "</a>").click(n, function (e) {
            onManhourTabChanged(e.data);
        })).appendTo("#manhourList");

        return n;
    }

    //切换工时表标签页
    function onManhourTabChanged(tabIndex){

    }

    //清空员工信息
    function emptyStaffInfo(){
        staff_id = '';
    }

    //清空工时标签页
    function emptytab(){
        $("#manhourList").empty();
        $("#manhourPanel").empty();
    }

    function weekToDate(value){
        var s = value.split("-W");
        var year = parseInt(s[0]);
        var week = parseInt(s[1]);
        var firstDay = new Date(year,0,1);
        return new Date(firstDay.getTime() + (((week - 1) * 7) + (8 - firstDay.getDay()) % 7) * 24 * 60 * 60 * 1000);
    }

})();