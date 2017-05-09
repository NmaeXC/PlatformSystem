/**
 * Created by wx_h0001 on 2016/5/10.
 */


/**
 * Created by admin on 2016/4/2.
 */




(function () {
    /**分页参数*****/
    var DIV1_LENTH = 235;
    var DIV2_LENTH = 515;
    var DIV3_LENTH = 35;
    var DIV4_LENTH = 85;

    var ratio = document.getElementById('divHead').offsetHeight / DIV1_LENTH;
    var pt2px = function (pt) {
        return pt * ratio;
    };

    /*******页面参数**********/
    var number = getQueryString("x");
    var contact = getQueryString("c");


    if (number !== null)
    {
        //初始化页面
        initPage(number, contact);
    }
    else
    {
        console.log("No Detail Number");
    }

    function initPage(number, contact) {
        $.ajax({
            url: "../../php/quote_detail.php",
            type: "POST",
            dataType: "json",
            data : {'detailNumber' : number, 'contact': contact},
            success: function (data) {
                $("#id").text(number);
                var today = new Date();
                $("#print_date").text(today.getFullYear() + "-" + (today.getMonth()+1) + "-" + today.getDate());
                $("#currency").text(data.quote.currency);
                if (data.quote.currency == 'RMB'){
                    $("#currency").text("人民币(RMB)");
                    $(".currency").text("[¥]");
                }
                else{
                    $("#currency").text("美元(USD)");
                    $(".currency").text("[$]");
                }
                $("#customer_name").text(nullornot(data.quote.customer_name));
                $("#customer_id").text(nullornot(data.quote.customer_id));
                $("#contact_name").text(nullornot(data.quote.contact_name));
                $("#contact_tele").text(nullornot(data.quote.contact_tele));
                $("#contact_email").text(nullornot(data.quote.contact_email));
                $("#customer_addr").text(nullornot(data.quote.customer_addr));
                $("#start").text(nullornot(data.quote.validity_start));
                $("#end").text(nullornot(data.quote.validity_end));
                $(".nameUser").text(nullornot(data.userInfo.name));
                $(".teleUser").text(nullornot(data.userInfo.tele));
                $(".foxUser").text(nullornot(data.userInfo.fox));
                $(".emailUser").text(nullornot(data.userInfo.email));
                var sum = 0;
                var page_index = 0;
                for(var i in data.products)
                {
                    var trID = "tr" + i;
                    $("<tr>").attr('id', trID).appendTo("#tbody_products_" + page_index);
                    $("<td></td>").text((parseInt(i) + 1) + ".").appendTo("#" + trID);
                    $("<td></td>").text(data.products[i].product_id).appendTo("#" + trID);
                    $("<td></td>").text(data.products[i].name).appendTo("#" + trID);
                    $("<td></td>").text(data.products[i].price).appendTo("#" + trID);
                    //var taxRate = new Number(data.products[i].tax_rate);
                    var taxRate = function(val){
                        var rate = {
                            '0': function () {
                                return 0;
                            },
                            '1': function () {
                                return 0.06;
                            },
                            '2': function () {
                                return 0.17;
                            }
                        };
                        if (typeof(rate[val]) === "function"){
                            return rate[val]();
                        }
                        else
                        {
                            return NaN;
                            console.log("taxRate Input Error");
                        }
                    }(data.products[i].tax_rate);
                    //$("<td></td>").text(data.products[i].discount).appendTo("#" + trID);
                    $("<td></td>").text((taxRate * 100) + "%").appendTo("#" + trID);
                    var price = new Number(data.products[i].price) * (taxRate + 1);
                    //var price = new Number(data.products[i].orig_price) * (new Number(data.products[i].discount) / 100) * (taxRate + 1);
                    $("<td></td>").text(price.toFixed(2)).appendTo("#" + trID);
                    $("<td></td>").text(data.products[i].amount).appendTo("#" + trID);
                    var totalPrice = price * (new Number(data.products[i].amount));
                    $("<td></td>").text(totalPrice.toFixed(2)).appendTo("#" + trID);
                    sum += totalPrice;
                    if (page_index === 0 && $("#divList_" + page_index).get(0).offsetHeight > pt2px(DIV2_LENTH + DIV3_LENTH)){
                        $("#divProduct").css('height', (555 + DIV1_LENTH + DIV2_LENTH + DIV3_LENTH + DIV4_LENTH) + "pt");
                        $("#divList_" + page_index).css('height', (DIV2_LENTH + DIV3_LENTH) + "pt");
                        $("#divList_" + page_index).after("<div style='height: 115pt'><hr></div>" +
                            "<div id='divList_1'><hr>" +
                            "<table style='width: 100%'>" +
                            "<thead>" +
                            "<tr>" +
                            "<th style='width: 6%'>序号</th>" +
                            "<th style='width: 18%'>产品号</th>" +
                            "<th style='width: 32%'>产品详细说明</th>" +
                            "<th style='width: 10%'>原价[¥]</th>" +
                            "<th style='width: 8%'>税率</th>" +
                            "<th style='width: 10%'>税后单价[¥]</th>" +
                            "<th style='width: 6%'>数量</th>" +
                            "<th style='width: 10%'>总价[¥]</th>" +
                            "</tr>" +
                            "</thead>" +
                            "<tbody id='tbody_products_1'>" +
                            "</tbody>" +
                            "</table>" +
                            "</div>");

                        $("#" + trID).appendTo("#tbody_products_1");
                        page_index++;
                    }
                }
                if(!isNaN(sum))
                {
                    $("#sum").text(sum.toFixed(2));
                }
                else
                {
                    $("#sum").text("数据有误");
                }
                if (page_index === 0 && $("#divList_" + page_index).get(0).offsetHeight + $("#divSum").get(0).offsetHeight > pt2px(DIV2_LENTH + DIV3_LENTH)){
                    $("#divProduct").css('height', (555 + DIV1_LENTH + DIV2_LENTH + DIV3_LENTH + DIV4_LENTH) + "pt");
                    $("#divList_" + page_index).css('height', (DIV2_LENTH + DIV3_LENTH) + "pt");
                    $("#divList_" + page_index).after("<div style='height: 115pt'><hr></div>");
                }
            }
        });
    }

    function nullornot(str){
        if(str === ""){
            return "-";
        }
        else {
            return str;
        }
    }


    //点击打印按钮
    $("#btnPrint").click(function(){
        $("#btnPrint").css('display', 'none');
        $("#footer").show();
        window.print();
        $("#footer").hide();
        $("#btnPrint").css('display', 'inline-block');
    });

    //获取页面参数name
    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }



})();