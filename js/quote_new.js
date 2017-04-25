/**
 * Created by admin on 2016/4/17.
 */

//页面初始化
$(document).ready(function () {
    freshMyPage();

    //初始化产品选择列表
    //(function (){
    //    $.ajax({
    //        url: "../../php/get_product.php",
    //        type: "POST",
    //        dataType: "json",
    //        success: function(data){
    //            autoproduct('.productID', data[0]);
    //            data.forEach(function (ele) {
    //                this.append("<option value='" + ele + "'>" + ele + "</option>");
    //            }, $(".productID"));
    //
    //        }
    //    });
    //})();


});

$('#validity').daterangepicker();
$("#customerName").bigAutocomplete({
    url: "../../php/autocomplete.php?type=customer",
    callback: function(data){
        var customerId = data.id;
        $("#customerID").text(customerId);
        $.ajax({
            url: "../../php/auto_contact.php",
            type: "POST",
            data: {'customerId': customerId},
            dataType: "json",
            success: function(data){
                data.forEach(function(ele){
                    this.append("<option value='" + ele.id + "'>" + ele.name + "</option>");
                }, $("#customerContact"));
            }
        })
    }
});

var currency = "RMB";
var customer = '';
var validity = '';
var product = [];

var oldCustomer = {};
var oldValidity = '';
var oldCurrency = '';
var oldProduct = '';
var number = '';

//选择货币类型
$("#currencyRMB").click(function () {
    $(".rmb-usd").text("¥");
    currency = "RMB";
});

$("#currencyUSD").click(function () {
    $(".rmb-usd").text("$");
    currency = "USD";
});

//自动填充产品信息
//function autoproduct(ele, key){
//    var key = key || $(ele).val();
//    var disc = $(ele).parent().parent().find(".productDisc");
//    var orig_price = $(ele).parent().parent().find(".productOriginalPrice");
//    $.ajax({
//        url: "../../php/get_product.php",
//        type: "POST",
//        data: {'key': key},
//        dataType: "json",
//        success: function(data){
//            disc.val(data.disc);
//            orig_price.val(new Number(data.price).toFixed(2));
//        }
//    });
//}


//格式化单价形式
function formatOriginalPrice(element) {
    var a  = new Number($(element).val());
    if (!isNaN(a)){
        $(element).val((Math.round(a * 100) / 100).toFixed(2));
    }

}


//自动计算
function autoCalculate(element) {
    var a = $(element).parent().parent();
    var originalPrice = new Number(a.find(".productOriginalPrice").val());
    var discount = new Number(a.find(".productDiscount").val());
    var taxRate = function(val){
        var rate = {
            '0': function () {
                return 1;
            },
            '1': function () {
                return 1.06;
            },
            '2': function () {
                return 1.17;
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
    }(a.find(".productTaxRate").val());
    var amount = new Number(a.find(".productAmount").val());
    var price = originalPrice * (discount / 100) * taxRate;
    a.find(".productPrice").text(price.toFixed(2));
    a.find(".productTotalPrice").text((price * amount).toFixed(2));
    var sum = new Number(0);
    $(".productTotalPrice").each(function () {
        sum += new Number($(this).text());
    });
    if(!isNaN(sum))
    {
        $("#sumOfTotalPrice").text(sum.toFixed(2));
    }
    else
    {
        $("#sumOfTotalPrice").text("等待修改...");
    }
}

//添加备注
function addPS(ele){
    $(ele).next().modal('show');
}


//添加一行产品
var productItemColumn = 1;  //产品列表的行数
$("#btnAddProductItem").click(function () {
    var item = $("#trProductItem").clone();
    item.removeAttr('id').find(".No").text((productItemColumn + 1) + ".").end()
        .find(".productID").val("").end()
        .find(".productName").val("").end()
        .find(".productOriginalPrice").val("").end()
        .find(".productDiscount").val(100).end()
        .find(".productPrice").text("0.00").end()
        .find(".productAmount").val(0).end()
        .find(".productTotalPrice").text("0.00").end()
        .find(".productPS").val("").end()
        .find(".removeItem").click(item, function (e) {
            if(productItemColumn > 1){

                $.each(e.data.nextAll(), function () {
                    var o = $(this).find(".No").text();
                    $(this).find(".No").text((o - 1) + '.');
                });
                e.data.remove();
                productItemColumn -= 1;
            }
        }).end()
        .appendTo("#tbodyProductItem");

    productItemColumn += 1;
});

//保存
$("#btnSave").click(function () {
    //验证填写是否符合规范
    if($("#customerID").text() === ""){
        alertMsg("请填写目标客户", "warning");
    }
    else if($("#validity").val() === ""){
        alertMsg("请填写有效期区间", "warning");
    }
    else{

        $(this).attr("disabled", "disabled");

        customer = {
            id: $("#customerID").text(),
            contact: $("#customerContact").val()
        };

        validity = $("#validity").val().split(" - ");
        product = [];

        $.each($(".trProductItem"), function () {
            if ($(this).find(".productID").val() != null)
            {
                product.push({
                    product_id: $(this).find(".productID").val(),
                    name: $(this).find(".productName").val(),
                    price: $(this).find(".productOriginalPrice").val(),
                    discount: $(this).find(".productDiscount").val(),
                    tax_rate: $(this).find(".productTaxRate").val(),
                    amount: $(this).find(".productAmount").val(),
                    ps: $(this).find(".productPS").val()
                });
            }
        });

        $.ajax({
            url: "../../php/quote_save.php",
            dataType: "json",
            data: {customer: JSON.stringify(customer),
                validity: validity,
                currency: currency,
                product: JSON.stringify(product)
            },
            type : "POST",
            cache : false,
            success: function (data) {
                if (data.tag == '0')
                {
                    alert("报价单保存成功！");
                    number = data.quote_id;
                    switchMode();
                    //window.location.href = "quote_detail.html?x=" + data.quote_id + "&c=" + data.contact_id;
                }
                else
                {
                    alertMsg("报价单保存失败", "danger");
                }
            }
        });
    }
});

function switchMode(){
    oldCustomer.id =  customer.id;
    oldCustomer.contact = customer.contact;
    oldValidity = validity.concat();
    oldCurrency = currency;
    oldProduct = product.concat();

    $("#btnSave").unbind('click').click(function () {
        if($("#customerID").text() === ""){
            alertMsg("请填写目标客户", "warning");
        }
        else if($("#validity").val() === ""){
            alertMsg("请填写有效期区间", "warning");
        }else{
            $(this).attr("disabled", "disabled");

            customer = {
                id: $("#customerID").text(),
                contact: $("#customerContact").val()
            };

            validity = $("#validity").val().split(" - ");
            product = [];

            $.each($(".trProductItem"), function () {
                if ($(this).find(".productID").val() != null)
                {
                    product.push({
                        product_id: $(this).find(".productID").val(),
                        name: $(this).find(".productName").val(),
                        price: $(this).find(".productOriginalPrice").val(),
                        discount: $(this).find(".productDiscount").val(),
                        tax_rate: $(this).find(".productTaxRate").val(),
                        amount: $(this).find(".productAmount").val(),
                        ps: $(this).find(".productPS").val()
                    });
                }
            });

            var chged = false;
            var faild = false;
            if (customer.id != oldCustomer.id || customer.contact != oldCustomer.contact){
                chged = true;
                $.ajax({
                    url: "../../php/quote_edit_customer.php",
                    type: "POST",
                    data: {'newCustomerId': customer.id, 'newContactId': customer.contact, 'quote': number},
                    success: function(data){
                        if (data !== "0"){
                            faild = true;
                        }
                    }
                });
            }

            if(validity[0] != oldValidity[0] || validity[1] != oldValidity[1] || currency != oldCurrency){
                chged = true;
                $.ajax({
                    url: "../../php/quote_edit_quote.php",
                    type: "POST",
                    data: {'validity': validity, 'c': currency, 'quote': number},
                    success: function(data){
                        if (data !== "0"){
                            faild = true;
                        }
                    }
                });
            }

            var editList = {};
            var addList = {};
            var deleteList = [];

            for (var i = 0; i < (oldProduct.length > product.length? oldProduct.length: product.length); i++){
                if (i >= oldProduct.length){
                    //新增项
                    addList[i] = product[i];

                }else if (i >= product.length){
                    //删除项
                    deleteList.push(i);

                }else{
                    //修改项
                    if (JSON.stringify(product[i]) != JSON.stringify(oldProduct[i])){
                        editList[i] = product[i];
                    }
                }
            }
            if(!$.isEmptyObject(editList)){
                chged = true;
                $.ajax({
                    url: "../../php/quote_edit_product.php",
                    type: "POST",
                    dataType: 'json',
                    data: {editList: JSON.stringify(editList), quote_id: number, action: 'edit'},
                    success: function(data){
                        if (data.tag !== "ok"){
                            faild = true;
                        }
                    }
                });
            }
            if (!$.isEmptyObject(addList)){
                chged = true;
                $.ajax({
                    url: "../../php/quote_edit_product.php",
                    type: "POST",
                    dataType: "json",
                    data : {quote_id : number, action: 'add_list', addList: JSON.stringify(addList)},
                    success: function (data) {
                        if (data.tag !== 'ok'){
                            faild = true;
                        }

                    }
                });
            }

            if (deleteList.length > 0){
                chged = true;
                $.ajax({
                    url: "../../php/quote_edit_product.php",
                    type: "POST",
                    dataType: "json",
                    data : {quote_id : number, action: 'delete_list', deleteList: JSON.stringify(deleteList)},
                    success: function (data) {
                        if (data.tag !== 'ok'){
                            faild = true;
                        }

                    }
                });
            }

            if (!chged){
                alertMsg("内容未修改", "danger");
                $(this).removeAttr("disabled");
            }else if (faild){
                alertMsg("保存失败", "warning");
            }else{
                oldCustomer.id =  customer.id;
                oldCustomer.contact = customer.contact;
                oldValidity = validity.concat();
                oldCurrency = currency;
                oldProduct = product.concat();
                alertMsg("已保存，修改成功", "success");
                $(this).removeAttr("disabled");
            }

        }

    }).removeAttr('disabled');

}


