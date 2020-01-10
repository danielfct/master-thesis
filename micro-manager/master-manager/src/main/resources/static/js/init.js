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

function convertFormToJson(formId) {
    let form = $("#" + formId).serializeArray();
    let formObject = {};
    $.each(form, (i, v) => formObject[v.name] = v.value);
    return JSON.stringify(formObject);
}

function ajaxGet(getUrl, successFunction) {
    $.ajax({
        url: getUrl,
        type: 'GET',
        cache: false,
        beforeSend: function () {
            displayLoadingBar();
        },
        success: function (data) {
            hideLoadingBar();
            successFunction(data);
        },
        error: function (xhr, status, err) {
            displayError(status, err);
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
            displayLoadingBar();
        },
        success: function (data) {
            hideLoadingBar();
            successFunction(data);
        },
        error: function (xhr, status, err) {
            displayError(status, err);
        }
    });
    return false;
}

function onSuccessSubmitCommand(data) {
    $("#command-result").html(
        `<h5>Command</h5>
        <div>${data.command}</div>
        <h5>Result</h5>
        ${$(data.result).map((index, item) => `<div>${item}</div>`)}
        <h5>Result status</h5>
        <div>${data.resultStatus}</div>`
    );
    $('#modal1').modal('open');
}

function onSuccessSubmitLaunchService(data) {
    $("#result").html(
        $(data).map((index, item) =>
            `<h5>${item.key}</h5>
            <div>${item.value}</div>`
        )
    );
    $('#modal1').modal('open');
}

function onSuccessGetServices(data) {
    $("#service-placeholder").html(
        $(data).map((index, item) =>
            `<div class='row'>
                <div class='col s12'>
                    <div class='card'>
                        <div class='card-content'>
                            <h5>Service name</h5>
                            <div>${item.serviceName}</div>
                            <h5>Docker Repository</h5>
                            <div>${item.dockerRepository}</div>
                            <h5>Default external/internal ports</h5>
                            <div>${item.defaultExternalPort}:${item.defaultInternalPort}</div>
                            <h5>Default DB</h5>
                            <div>${item.defaultDb}</div>
                            <h5>Launch command</h5>
                            <div>${item.launchCommand}</div>
                            <h5>Expected Memory Consumption</h5>
                            <div>${item.expectedMemoryConsumption} GB</div>
                            <h5>Output label</h5>
                            <div>${item.outputLabel}</div>
                            <h5>Service Type</h5>
                            <div>${item.serviceType}</div>
                        </div>
                    </div>
                </div>
          </div>`
        )
    )
}

function loadServicesSelect(data) {
    $("#service").html(
        $(data).map((index, item) =>
            `<option 
                externalPort="${item.defaultExternalPort}" 
                internalPort="${item.defaultInternalPort}"
                defaultDb="${item.defaultDb}"
                value="${item.serviceName}">
                    ${item.serviceName}
            </option>`
        )
    ).formSelect();
}

function loadContainersSelect(data) {
    $("#containerId").html(
        $(data).map((index, item) =>
            `<option value="${item.id}">
                ${item.names.length ? item.names[0] : `${item.id} ${item.image}`} 
            </option>`
        )
    ).formSelect();
}

function onSuccessSubmitStopService(data) {
    $("#result").html(
        $(data).map((index, item) =>
            `<h5>${item.key}</h5>
            <div>${item.value}</div>`
        )
    );
    $('#modal1').modal('open');
}

function onSuccessGetInstances(data) {
    $("#instance-placeholder").html(
        $(data).map((index, item) =>
            `<div class='row'>
                <div class='col s12'>
                    <div class='card'>
                        <div class='card-content'>
                            <h5>Service name</h5>
                            <div>${item.appName}</div>
                            <h5>Service Id</h5>
                            <div>${item.id}</div>
                            <h5>Address</h5>
                            <div>${item.hostname}:${item.port}</div>
                        </div>
                    </div>
                </div>
            </div>`
        )
    );
}

function onSuccessGetContainers(data) {
    $("#container-placeholder").html(
        $(data).map((index, item) =>
            `<div class='row'>
                <div class='col s12'>
                    <div class='card'>
                        <div class='card-content'>
                            <h5>Id</h5>
                            <div>${item.id}</div>
                            <h5>Created</h5>
                            <div>${item.created}</div>
                            <h5>Names</h5>
                            <div>${item.names}</div>
                            <h5>Image</h5>
                            <div>${item.image}</div>
                            <h5>Command</h5>
                            <div>${item.command}</div>
                            <h5>State</h5>
                            <div>${item.state}</div>
                            <h5>Status</h5>
                            <div>${item.status}</div>
                            <h5>Hostname</h5>
                            <div>${item.hostname}</div>
                            <h5>Ports</h5>
                            <div>${item.ports}</div>
                        </div>
                    </div>
                </div>
            </div>"`
        )
    );
}

function onChangeServicesSelect() {
    let optionSelected = $("#service").find(":selected");
    $('#externalPort').val(optionSelected.attr('externalPort'));
    $('#internalPort').val(optionSelected.attr('internalPort'));
    let defaultDb = optionSelected.attr('defaultDb');
    $('#database').val(defaultDb);
    /* if(defaultDb == 'NOT_APPLICABLE')
       $('#database').prop('disabled', true);
     else
       $('#database').prop('disabled', false);
     */
    M.updateTextFields();
}

function loadAwsInstancesSelect(data) {
    $("#instanceId").html(
        $(data).map((index, item) =>
            `<option value="${item.instanceId}">${item.instanceId} (${item.state.name})</option>`
        )
    ).formSelect();
}

function displayLoadingBar() {
    $("#loader-placeholder").html(
        '<div class="progress"><div class="indeterminate"></div></div>'
    );
    $("body").scrollTop(0);
}

function hideLoadingBar() {
    $("#loader-placeholder").html("");
}

function displayError(status, err) {
    $("#loader-placeholder").html("<div>Status: " + status + "; Error: " + err + "</div>");
}
