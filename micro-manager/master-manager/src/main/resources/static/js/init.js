/*
 * MIT License
 *
 * Copyright (c) 2020 micro-manager
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

$(document).ready(function () {
  //$(".sidenav").sidenav();
  //$('select').formselect();
  M.AutoInit();
});

/******************* CONVERT TO JSON *********************/
function convertFormToJson(formId) {
  let form = $("#" + formId).serializeArray();
  let formObject = {};
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
      let loader = '<div class="progress"><div class="indeterminate"></div></div>';
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
  let form = $("#" + formId);

  $.ajax({
    url: form.attr("action"),
    type: form.attr("method"),
    data: convertFormToJson(formId),
    dataType: "json",
    contentType: 'application/json',
    cache: false,

    beforeSend: function () {
      let loader = '<div class="progress"><div class="indeterminate"></div></div>';
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
  let servicePlaceholder = $("#service-placeholder");

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
  let dropdown = $("#service");
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
  let dropdown = $("#containerId");
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
  let instancePlaceholder = $("#instance-placeholder");

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
  let containerPlaceholder = $("#container-placeholder");
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
  let optionSelected = $("#service").find(":selected");

  $('#externalPort').val(optionSelected.attr('data-defaultExternalPort'));
  $('#internalPort').val(optionSelected.attr('data-defaultInternalPort'));

  let defaultDb = optionSelected.attr('data-defaultDb');
  $('#database').val(defaultDb);
  /* if(defaultDb == 'NOT_APPLICABLE')
     $('#database').prop('disabled', true);
   
   else
     $('#database').prop('disabled', false);
   */
  M.updateTextFields();
}

function loadAwsInstancesSelect(data) {
  let dropdown = $("#instanceId");
  $(data).each(function (index, item) {
    dropdown.append('<option value="' + item.instanceId +
      '">' + item.instanceId + " (" + item.state.name + ")" + '</option>');
  });
  dropdown.formSelect();
}