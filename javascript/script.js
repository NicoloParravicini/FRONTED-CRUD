let data = [];
let nextId = 10006;
let id;
let firstPage = 0;
let totalPages;
let currentPage = 0;

$(document).ready(function () {

  getData();

  //aggiunge un nuovo dipendente
  $("#create-employee-form").submit(function (e) {
    e.preventDefault();
    let firstName = $("#nome").val();
    let lastName = $("#cognome").val();
    let gender = $('input[name=sesso]:checked', '#create-employee-form').val();
    let birthDate = $("#data-nascita").val();
    let hireDate = $("#data-assunzione").val();

    data.push({
      id: nextId,
      birthDate: birthDate,
      firstName: firstName,
      lastName: lastName,
      gender: gender,
      hireDate: hireDate
    });
    nextId++;

    //ripropone la lista con i nuovi valori
    displayEmployeeList();

    //nasconde il modal
    $("#create-employee").hide();
    //senza di questo il backdrop del modal non viene rimosso
    $('.modal-backdrop').remove();
  });

  $("body").on("click", ".delete-employee", function () {
    id = $(this).parent("td").data("id");
    $.ajax({
      method: "DELETE",
      url: `http://localhost:8080/employees/${id}`
    })
      .done(function (msg) {
        getData();
      });
  });


  $("body").on("click", ".edit-employee", function () {
    id = $(this).parent("td").data("id");
    for (let i = 0; i < data.length; i++) {
      if (data[i].id == id) {
        var myModal = new bootstrap.Modal(document.getElementById("edit-employee"), {});
        myModal.show();
        $('#nome-edit').val(data[i].firstName);
        $('#cognome-edit').val(data[i].lastName);

        if (data[i].gender === "M") {
          $('#edit-sesso-m').prop("checked", true);
        } else {
          $('#edit-sesso-f').prop("checked", true);
        }

        $('#data-nascita-edit').val(data[i].birthDate);
        $('#data-assunzione-edit').val(data[i].hireDate);
        break;
      }
    }
  });

  //modifica le informazioni di dipendente
  $("#edit-employee-form").submit(function (e) {
    e.preventDefault();
    let firstName = $("#nome-edit").val();
    let lastName = $("#cognome-edit").val();
    let gender = $('input[name=sesso-edit]:checked', '#edit-employee-form').val();
    let birthDate = $("#data-nascita-edit").val();
    let hireDate = $("#data-assunzione-edit").val();

    for (let i = 0; i < data.length; i++) {
      if (data[i].id == id) {
        data[i].firstName = firstName;
        data[i].lastName = lastName;
        data[i].gender = gender;
        data[i].birthDate = birthDate;
        data[i].hireDate = hireDate;
      }
    }

    //ripropone la lista con i nuovi valori
    displayEmployeeList();

    //nasconde il modal
    $("#edit-employee").hide();
    //senza di questo il backdrop del modal non viene rimosso
    $('.modal-backdrop').remove();
  });

  $("body").on("click", ".page-item", function () {
    currentPage = $(this).data('page')
    getData();
  });
});

function getData() {
  $.ajax({
    method: "GET",
    url: `http://localhost:8080/employees?page=${currentPage}&size=${5}`
  })
    .done(function (msg) {
      data = msg['_embedded']['employees'];
      nextPage = msg['_links']['next']['href'];
      totalPages = msg['page']['totalPages'];
      displayEmployeeList();
      displayPagination();
    });
}



function displayEmployeeList() {
  let rows = '';
  $.each(data, function (index, value) {
    rows += '<tr>';
    rows += '<td>' + value.id + '</td>';
    rows += '<td>' + value.firstName + '</td>';
    rows += '<td>' + value.lastName + '</td>';
    rows += '<td>' + value.gender + '</td>';
    rows += '<td>' + value.birthDate + '</td>';
    rows += '<td>' + value.hireDate + '</td>';
    rows += '<td data-id="' + value.id + '">';
    rows += '<button class="btn btn-success edit-employee me-2"><i class="fa-solid fa-pen"></i></button>';
    rows += '<button class="btn btn-danger delete-employee"><i class="fa-solid fa-trash-can"></i></button>';
    rows += '</td>';
    rows += '</td>';
  });
  $("tbody").html(rows);
}

function displayPagination() {
  let code = '';
  let dataPage = currentPage;

  code += '<nav aria-label="Page navigation example">';
  code += '<ul class="pagination justify-content-center">';

  if (currentPage === 0) {
    code += '<li class="disabled" data-page="' + (currentPage - 1) + '"> ' +
      '<a class="page-link" href="#" aria-label="Previous">' +
      '<span aria-hidden="true">&laquo;</span></a></li>';
  } else {
    code += '<li class="page-item" data-page="' + (currentPage - 1) + '"> ' +
      '<a class="page-link" href="#" aria-label="Previous">' +
      '<span aria-hidden="true">&laquo;</span></a></li>';
  }

  if (currentPage != 0 && currentPage != 1) {
    code += '<li class="page-item" data-page="' + firstPage + '"><a class="page-link" href="#">' + (firstPage + 1) + '</a></li>'
    if (currentPage != 2)
      code += '<li class="disabled"><a class="page-link" >...</a></li>'
  }

  for (let i = getStartPage(); i < currentPage + 2; i++) {
    dataPage = i;
    if (i === currentPage) { //Per far sì che l'elemento venga segnato come active
      code += '<li class="page-item active" data-page="' + dataPage + '"><a class="page-link" href="#">' + (dataPage + 1) + '</a></li>'
    } else {
      code += '<li class="page-item" data-page="' + dataPage + '"><a class="page-link" href="#">' + (dataPage + 1) + '</a></li>'
    }
    if (currentPage == totalPages - 2) {
      break;
    }
  }

  if (currentPage != totalPages - 2) {
    code += '<li class="disabled"><a class="page-link" >...</a></li>'
    code += '<li class="page-item" data-page="' + (totalPages - 2) + '"><a class="page-link" href="#">' + (totalPages + 1) + '</a></li>'
  }

  if (currentPage === totalPages) {
    code += '<li class="disabled" data-page="' + (currentPage + 1) + '"> ' +
      '<a class="page-link" href="#" aria-label="Next">' +
      '<span aria-hidden="true">&raquo</span></a></li>';
  } else {
    code += '<li class="page-item" data-page="' + (currentPage + 1) + '"> ' +
      '<a class="page-link" href="#" aria-label="Next">' +
      '<span aria-hidden="true">&raquo</span></a></li>';
  }
  $("pagination").html(code);
}

function getStartPage() {

  if (currentPage === 0) {
    return currentPage;
  } else {
    return currentPage - 1;
  }
}