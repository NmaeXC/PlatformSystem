function showWorkerTable(data)
{
	 if(data == "")
	        {
	          alert("不存在该员工！");
	        }
	        else
	        {

	          data = eval('(' + data + ')');
	          // alert(data.number+data.sex);
	          var x = 0;
	          // for(var x = 0; x < 1; x++)
	          // {
	            $("#rsmsg").clone(true).attr("id", "rsmsg" + x).appendTo("#start").show();
	            $("#rsmsg" + x).find("h3").text(data.name);
	            $("#rsmsg" + x).find("#name").attr("id", "name" + x).text(data.name);
	            $("#rsmsg" + x).find("#number").attr("id", "number" + x).text(data.number);
	            $("#rsmsg" + x).find("#sex").attr("id", "sex" + x).text(data.sex);
	            $("#rsmsg" + x).find("#department").attr("id", "department" + x).text(data.department);
	            $("#rsmsg" + x).find("#position").attr("id", "position" + x).text(data.position);
	            $("#rsmsg" + x).find("#tele").attr("id", "tele" + x).text(data.tele);
	            $("#rsmsg" + x).find("#email").attr("id", "email" + x).text(data.email);
	            $("#rsmsg" + x).find("#date").attr("id", "date" + x).text(data.date);
	          // }
	        }
}

  $.ajax({
  	url: "php/workerSearch.php?SearchText="+$("#SearchText").val(),
  	type: "GET",
  	cache: false,
  	dataType: 'json',
  	success: showWorkerTable
  })