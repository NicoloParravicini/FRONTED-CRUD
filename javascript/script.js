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

  function getData() {
    $.ajax({
        method: "GET",
        url: `${defaultPath}/employees?page=${parseInt(localStorage.getItem("currentPage"))}&size=${5}`,
        dataType: "json",
        contentType: "application/json",
        
    })
        .done(function (msg) {
            data = msg['_embedded']['employees'];
            totalPages = msg['page']['totalPages'];

            if (parseInt(localStorage.getItem("currentPage")) > (totalPages - 1)) {
                nextPage = msg['_links']['next']['href'];
            }
            displayEmployeeList(); //mostro la lista degli impiegati
            displayPagination(); //mostro la paginazione
        });
}
//chiamata GET (per ricevere dal server l'impiegato richiesto)
function getEmployeeData(id) {
    $.ajax({
        method: "GET",
        url: `${defaultPath}/employees?id=${id}`,
        dataType: "json",
        contentType: "application/json"
    })
        .done(function (msg) {
            employeeData.id = msg.id;
            employeeData.firstName = msg.firstName;
            employeeData.lastName = msg.lastName;
            employeeData.gender = msg.gender;
            employeeData.birthDate = msg.birthDate;
            employeeData.hireDate = msg.hireDate;
            setFormEmployeeData();
        });
}
//chiamata POST (per creare un nuovo impiegato)
function createEmployee() {
    $.ajax({
        method: "POST",
        url: `${defaultPath}`,
        data: JSON.stringify(employeeData)
    })
        .done(function () {
            location.reload();
        });
}
//Chiamata DELETE (per eliminare un impiegato)
function deleteEmployee(id) {
    $.ajax({
        method: "DELETE",
        url: `${defaultPath}?id=${id}`
    })
        .done(function () {
            getData();
            displayEmployeeList();
        });
}
//Chiamata PUT (per modificare le informazioni di un dipendente)
function editEmployeePUT() {
    $.ajax({
        method: "PUT",
        url: `${defaultPath}/employees/${id}`,
        data: JSON.stringify(employeeData)
    })
        .done( function(){
            location.reload();
        });
}
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