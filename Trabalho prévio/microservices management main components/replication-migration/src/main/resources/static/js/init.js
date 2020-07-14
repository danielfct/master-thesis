$(document).ready(function () {
  //$(".sidenav").sidenav();
  //$('select').formselect();
  M.AutoInit();
});

/******************* CONVERT TO JSON *********************/
function convertFormToJson(formId) {
  var form = $("#" + formId).serializeArray();
  var formObject = {};
  $.each(form,
    function (i, v) {
      formObject[v.name] = v.value;
    }
  );
  return JSON.stringify(formObject);
}

function ajaxGet(getUrl, successFunction) {
  $.ajax({
    url: getUrl,
    type: 'GET',
    cache: false,

    beforeSend: function () {
      var loader = '<div class="progress"><div class="indeterminate"></div></div>';
      $("#loader-placeholder").html(loader);
      $("body").scrollTop(0);
    },
    success: function (data) {
      $("#loader-placeholder").html("");
      successFunction(data);
    },
    error: function (xhr, status, err) {
      $("#loader-placeholder").html("<div>Status: " + status + "; Error: " + err + "</div>");
    }
  });
  return false;
}

function formSubmitCommand(e, formId, successFunction) {
  e.preventDefault();
  var form = $("#" + formId);

  $.ajax({
    url: form.attr("action"),
    type: form.attr("method"),
    data: convertFormToJson(formId),
    dataType: "json",
    contentType: 'application/json',
    cache: false,

    beforeSend: function () {
      var loader = '<div class="progress"><div class="indeterminate"></div></div>';
      $("#loader-placeholder").html(loader);
      $("body").scrollTop(0);
    },
    success: function (data) {
      $("#loader-placeholder").html("");
      successFunction(data);
    },
    error: function (xhr, status, err) {
      $("#loader-placeholder").html("<div>Status: " + status + "; Error: " + err + "</div>");
    }
  });
  return false;
}

function onSuccessSubmitCommand(data) {
  $("#command-result").html("<h5>Command</h5><div>" + data.command + "</div><br/><div><h5>Result</h5></div>");
  $(data.result).each(function (index, item) {
    $("#command-result").append("<div>" + item + "</div>");
  });
  $("#command-result").append("<h5>Result status</h5><div>" + data.resultStatus + "</div>");
  $('#modal1').modal('open');
}

function onSuccessSubmitLaunchService(data) {
  $("#result").html("");
  console.log(data);
  $(data).each(function (index, item) {
    $("#result").append(
      "<h5>" + item.key + "</h5><div>" + item.value + "</div>"
    );
  });  
  $('#modal1').modal('open');
}

// GET SERVICES CONFIGS
function onSuccessGetServices(data) {
  var servicePlaceholder = $("#service-placeholder");

  $(data).each(function (index, item) {
    servicePlaceholder.append(
      "<div class='row'><div class='col s12'><div class='card'><div class='card-content'>" +
      "<h5>Service name</h5><div>" + item.serviceName + "</div>" +
      "<h5>Docker Repository</h5><div>" + item.dockerRepo + "</div>" +
      "<h5>Default external/internal ports</h5><div>" + item.defaultExternalPort +
      " : " + item.defaultInternalPort + "</div>" +
      "<h5>Default DB</h5><div>" + item.defaultDb + "</div>" +
      "<h5>Launch command</h5><div>" + item.launchCommand + "</div>" +
      "<h5>Average RAM</h5><div>" + item.averageRam + " GB</div>" +
      "<h5>Output label</h5><div>" + item.outputLabel + "</div>" +
      "<h5>Service Type</h5><div>" + item.serviceType + "</div>" +
      "</div></div></div></div>"
    );
  });
}

function loadServicesSelect(data) {
  var dropdown = $("#service");
  $(data).each(function (index, item) {
    dropdown.append('<option' +
      ' data-defaultExternalPort="' + item.defaultExternalPort + '"' +
      ' data-defaultInternalPort="' + item.defaultInternalPort + '"' +
      ' data-defaultDb="' + item.defaultDb + '"' +
      ' value="' + item.serviceName + '">' +
      item.serviceName + '</option>');
  });
  dropdown.formSelect();
}

function loadContainersSelect(data) {
  var dropdown = $("#containerId");
  $(data).each(function (index, item) {
    var name = item.id + " " + item.image;
    if(item.names.length){
      name = item.names[0];
    }
    dropdown.append('<option value="' + item.id +
      '">' + name + '</option>');
  });
  dropdown.formSelect();
}

function onSuccessSubmitStopService(data) {
  $("#result").html("");
  console.log(data);
  $(data).each(function (index, item) {
    $("#result").append(
      "<h5>" + item.key + "</h5><div>" + item.value + "</div>"
    );
  });  
  $('#modal1').modal('open');
}

function onSuccessGetInstances(data) {
  var instancePlaceholder = $("#instance-placeholder");

  $(data).each(function (index, item) {
    instancePlaceholder.append(
      "<div class='row'><div class='col s12'><div class='card'><div class='card-content'>" +
      "<h5>Service name</h5><div>" + item.appName + "</div>" +
      "<h5>Service Id</h5><div>" + item.id + "</div>" +
      "<h5>Hostname : Port</h5><div>" + item.hostname + " : " + item.port + "</div>" +
      "</div></div></div></div>"
    );
  });
}

function onSuccessGetContainers(data) {
  var containerPlaceholder = $("#container-placeholder");
  $(data).each(function (index, item) {
    containerPlaceholder.append(
      "<div class='row'><div class='col s12'><div class='card'><div class='card-content'>" +
      "<h5>Id</h5><div>" + item.id + "</div>" +
      "<h5>Created</h5><div>" + item.created + "</div>" +
      "<h5>Names</h5><div>" + item.names + "</div>" +
      "<h5>Image</h5><div>" + item.image + "</div>" +
      "<h5>Command</h5><div>" + item.command + "</div>" +
      "<h5>State</h5><div>" + item.state + "</div>" +
      "<h5>Status</h5><div>" + item.status + "</div>" +
      "<h5>Hostname</h5><div>" + item.hostname + "</div>" +
      "<h5>Ports</h5><div>" + item.ports + "</div>" +
      "</div></div></div></div>"
    );
  });
}

function onChangeServicesSelect() {
  var optionSelected = $("#service").find(":selected");

  $('#externalPort').val(optionSelected.attr('data-defaultExternalPort'));
  $('#internalPort').val(optionSelected.attr('data-defaultInternalPort'));

  var defaultDb = optionSelected.attr('data-defaultDb');
  $('#database').val(defaultDb);
  /* if(defaultDb == 'NOT_APPLICABLE')
     $('#database').prop('disabled', true);
   
   else
     $('#database').prop('disabled', false);
   */
  M.updateTextFields();
}

function loadAwsInstancesSelect(data) {
  var dropdown = $("#instanceId");
  $(data).each(function (index, item) {
    dropdown.append('<option value="' + item.instanceId +
      '">' + item.instanceId + " (" + item.state.name + ")" + '</option>');
  });
  dropdown.formSelect();
}