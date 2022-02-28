let data = [];
let nextId = 10006;
let id;
let links;
var page = 0;
var api = "http://localhost:8080/employees?page= " + page + "&size=20";
var apiPrevious;

$(document).ready(function () {

  get();

  function get() {

    $.ajax({
      method: "GET",
      url: api
    })
      .done(function (msg) {
        data = msg['_embedded']['employees'];
        links = msg['_links']
        displayEmployeeList();
      });

  }

  //NEXT
  $('#next-button').on("click", function () {

    apiPrevious = api;
    api = links['next']['href'];
    page++;
    get();
  });

  //PREVIOUS
  $('#previous-button').on("click", function () {
    page--;
    api= "http://localhost:8080/employees?page=" + page + "&size=20";
    get();
  });



  //aggiunge un nuovo dipendente
  $("#create-employee-form").submit(function (e) {
    e.preventDefault();
    let firstName = $("#nome").val();
    let lastName = $("#cognome").val();
    let gender = $('input[name=sesso]:checked', '#create-employee-form').val();
    let birthDate = $("#data-nascita").val();
    let hireDate = $("#data-assunzione").val();

    data.push({ id: nextId, birthDate: birthDate, firstName: firstName, lastName: lastName, gender: gender, hireDate: hireDate });
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
    for (let i = 0; i < data.length; i++) {
      if (data[i].id == id) {
        data.splice(i, 1);
        break;
      }
    }
    displayEmployeeList();
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
        console.log(firstName);
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




});

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