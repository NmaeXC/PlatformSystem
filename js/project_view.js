/**
 * Created by wx_h0001 on 2016/10/13.
 */

(function () {

    //页面初始化
    $(document).ready(function () {
        freshMyPage();

        //初始项目列表
        $.ajax({
            url: "/" + projectName + "/php/project_view.php",
            type: "POST",
            cache: false,
            dataType : 'json',
            success: function (data){
                //将项目显示到表格中
                if(data.sum > 0)
                {
                    for(var x = 0; x < data.sum; x++)
                    {
                        var trID = "trProject" + x;
                        $("<tr>").attr('id', trID).appendTo("#tbodyProject");
                        $("<td></td>").text(data[x]["id"]).appendTo("#" + trID);
                        $("<td></td>").text(data[x]["name"]).appendTo("#" + trID);
                        $("<td></td>").text(data[x]["charge"]).appendTo("#" + trID);
                        $("<td></td>").text(data[x]["start_time"]).appendTo("#" + trID);
                        var progress = Math.floor(data[x]["done"] / data[x]["man_hours"] * 100);
                        //预计工时不为正则不予显示进度
                        if(data[x]["man_hours"] > 0){
                            var bar = 'primary';
                            var badge = 'light-blue';
                            if (progress >= 80 && progress < 100){
                                bar = 'warning';
                                badge = 'orange';
                            }else if (progress >= 100){
                                bar = 'danger';
                                badge = 'red';
                            }
                            $("<td></td>").html("<div class='progress xs progress-striped active'><div class='progress-bar progress-bar-" + bar + "' style='width: " + progress + "%'></div></div>").appendTo("#" + trID);
                            $("<td></td>").html("<span class='badge bg-" + badge + "'>" + progress + "</span>").appendTo("#" + trID);
                        }else {
                            $("<td></td>").appendTo("#" + trID);
                            $("<td></td>").appendTo("#" + trID);
                        }

                        var state;
                        switch (data[x]['state']){
                            case "开发中" :
                                state = "<span class='label label-primary'>开发中</span>";
                                break;
                            case "已完成" :
                                state = "<span class='label label-success'>已完成</span>";
                                break;
                            case "废弃" :
                                state = "<span class='label label-warning'>废弃</span>";
                                break;
                            case "其它" :
                                state = "<span class='label label-default'>其它</span>";
                                break;
                            default:
                                state = "<span class='label label-danger'>Error</span>";
                                break;
                        }
                        $("<td></td>").html(state).appendTo("#" + trID);
                        $("<td></td>").html("<a role='button'><span class='badge bg-light-blue'>More..</span>").click(data[x]["id"], function (e) {
                                window.open("project_detail.html?x=" + e.data);
                            })
                            .appendTo("#" + trID)

                    }
                }
                else
                {
                    $("<tr><td colspan='6'>暂无可查看的项目~</td></tr>").appendTo("#tbodyExpenseHisotry");
                }

                //dataTable部件的设置
                $("#tableProject").dataTable({
                    "bPaginate": true,
                    "bLengthChange": true,
                    "bFilter": true,
                    "bSort": false,
                    "bInfo": true,
                    "bAutoWidth": false
                });
            }
        });

    });

})();