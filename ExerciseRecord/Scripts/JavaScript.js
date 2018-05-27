
$(document).ready(function () {
    //Initially load pagenumber=1
    getPageData(1);
});

function clearForm() {
    $(".text-danger").text("");
}
//Show The Popup Modal For Add New Exercise

function addNewExercise(Id) {
    $("#form")[0].reset();
    $("#id").val(0);
    $("#ModalTitle").html("Add New Exercise");
    $("#MyModal").modal();
}

//Show The Popup Modal For Edit Student Record

function editExerciseRecord(Id) {
    var url = "/Home/GetExerciseById?Id=" + Id;
    $("#ModalTitle").html("Update Exercise Record");
    $("#MyModal").modal();
    $.ajax({
        type: "GET",
        url: url,
        success: function (data) {
            var obj = JSON.parse(data);
            var date = new Date(obj.ExerciseDate);
            var dt = date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear();
            //console.log(dt);
            $("#exerId").val(obj.Id);
            $("#exerciseName").val(obj.ExerciseName);
            $("#exerciseDate").val(dt);
            console.log($("#exerciseDate").val());
            $("#duration").val(obj.DurationInMinutes);
        }
    })
}

function saveRecord() {
    var id = $("#exerId").val();
    var name = $("#exerciseName").val();
    var date = $("#exerciseDate").val();
    var duration = $("#duration").val();
    console.log(id);
    var data = $("#SubmitForm").serialize();
    if ($("#form").valid()) {
        $.ajax({
            type: "POST",
            url: "/Home/SaveExercise",
            data: data,
            success: function (result) {
                console.log(result);
                //alert("Success!..");
                if (result == true) {
                    //alert("true");
                    window.location.href = "/Home/Index";
                    $("#MyModal").modal("hide");
                } else {
                    //alert("false");
                    $("#error").text("Can not add the same exercise on the same day");
                }
            }
        })
    }


}

// search data by exercise name
$("#Search").keyup(function () {
    var SearchValue = $("#Search").val();
    var SetData = $(".DataSearching");
    SetData.html("");
    if (!this.value) {
        //alert('The box is empty');
        getPageData(1);
    } else {
        $.ajax({
            type: "post",
            url: "/Home/GetSearchingData?SearchValue=" + SearchValue,
            contentType: "html",
            success: function (result) {
                var date;
                var dt;
                if (result.length == 0) {
                    SetData.append('<tr style="color:red; text-align:center"><td colspan="3">No Match Data</td></tr>')
                }
                else {
                    $.each(result, function (index, value) {
                        date = new Date(parseInt(value.ExerciseDate.replace("/Date(", "").replace(")/", ""), 10));
                        dt = date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear();
                        var Data = "<tr>" +
                            "<td>" + value.ExerciseName + "</td>" +
                            "<td>" + dt + "</td>" +
                            "<td>" + value.DurationInMinutes + "</td>" +
                            "<td>" + "<a href='#' class='btn btn-warning' onclick='editExerciseRecord(" + value.Id + ")' ><span class='glyphicon glyphicon-pencil'></span></a>" + "</td>" +
                            "<td>" + "<a href='#' class='btn btn-danger' onclick='deleteExerciseRecord(" + value.Id + ")'><span class='glyphicon glyphicon-remove'></span></a>" + "</td>" +
                            "</tr>";
                        SetData.append(Data);
                    });
                }
            }
        });
    }
})

//Show The Popup Modal For DeleteComfirmation
function deleteExerciseRecord(id) {
    $("#exerId").val(id);
    $("#DeleteConfirmation").modal();
}
function confirmDelete() {
    var id = $("#exerId").val();
    $.ajax({
        type: "POST",
        url: "/Home/DeleteExerciseRecord?Id=" + id,
        success: function (result) {
            $("#DeleteConfirmation").modal("hide");
            window.location.href = "/Home/Index";
        }
    })
}


function getPageData(pageNum, pageSize) {
    //After every trigger remove previous data and paging
    $("#SetExerciseList").empty();
    $("#paged").empty();
    $.getJSON("/Home/GetPaggedData", { pageNumber: pageNum, pageSize: pageSize }, function (response) {
        var rowData = "";
        var dt;
        for (var i = 0; i < response.Data.length; i++) {
            dt = changeDateFormat(response.Data[i].ExerciseDate);
            rowData = rowData + "<tr class='row_" + response.Data[i].Id + "'>" +
                "<td>" + response.Data[i].ExerciseName + "</td>" +
                "<td>" + dt + "</td>" +
                "<td class='date'>" + response.Data[i].DurationInMinutes + "</td>" +
                "<td>" + "<a href='#' class='btn btn-warning' onclick='EditExerciseRecord(" + response.Data[i].Id + ")' ><span class='glyphicon glyphicon-pencil'></span></a>" + "</td>" +
                "<td>" + "<a href='#' class='btn btn-danger' onclick='DeleteExerciseRecord(" + response.Data[i].Id + ")'><span class='glyphicon glyphicon-remove'></span></a>" + "</td>" +
                "</tr>";
        }
        $("#SetExerciseList").append(rowData);
        paggingTemplate(response.TotalPages, response.CurrentPage);
    });
}

function paggingTemplate(totalPage, currentPage) {
    var template = "";
    var TotalPages = totalPage;
    var CurrentPage = currentPage;
    var PageNumberArray = Array();


    var countIncr = 1;
    for (var i = currentPage; i <= totalPage; i++) {
        PageNumberArray[0] = currentPage;
        if (totalPage != currentPage && PageNumberArray[countIncr - 1] != totalPage) {
            PageNumberArray[countIncr] = i + 1;
        }
        countIncr++;
    };
    PageNumberArray = PageNumberArray.slice(0, 5);
    var FirstPage = 1;
    var LastPage = totalPage;
    if (totalPage != currentPage) {
        var ForwardOne = currentPage + 1;
    }
    var BackwardOne = 1;
    if (currentPage > 1) {
        BackwardOne = currentPage - 1;
    }

    template = "<p>" + CurrentPage + " of " + TotalPages + " pages</p>"
    template = template + '<ul class="pager">' +
        '<li class="previous"><a href="#" onclick="GetPageData(' + FirstPage + ')"><i class="fa fa-fast-backward"></i>&nbsp;First</a></li>' +
        '<li><a href="#" onclick="GetPageData(' + BackwardOne + ')"><i class="glyphicon glyphicon-backward"></i></a>';

    var numberingLoop = "";
    for (var i = 0; i < PageNumberArray.length; i++) {
        numberingLoop = numberingLoop + '<a class="page-number active" onclick="GetPageData(' + PageNumberArray[i] + ')" href="#">' + PageNumberArray[i] + ' &nbsp;</a>'
    }
    template = template + numberingLoop + '<a href="#" onclick="GetPageData(' + ForwardOne + ')" ><i class="glyphicon glyphicon-forward"></i></a></li>' +
        '<li class="next"><a href="#" onclick="GetPageData(' + LastPage + ')">Last&nbsp;<i class="fa fa-fast-forward"></i></a></li></ul>';
    $("#paged").append(template);
}

// change the date format when reading datetime data from database
function changeDateFormat(jsondate) {
    jsondate = jsondate.replace("/Date(", "").replace(")/", "");
    if (jsondate.indexOf("+") > 0) {
        jsondate = jsondate.substring(0, jsondate.indexOf("+"));
    }
    else if (jsondate.indexOf("-") > 0) {
        jsondate = jsondate.substring(0, jsondate.indexOf("-"));
    }

    var date = new Date(parseInt(jsondate, 10));
    var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    var currentDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();

    return currentDate + "/" + month + "/" + date.getFullYear();
}
