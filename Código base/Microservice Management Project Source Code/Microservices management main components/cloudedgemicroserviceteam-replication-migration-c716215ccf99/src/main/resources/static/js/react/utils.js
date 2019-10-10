var $ = require('jquery');
const React = require('react');
const Component = React.Component;

class Utils {
    constructor() {
        this.ajaxGet = this.ajaxGet.bind(this);
        this.formSubmit = this.formSubmit.bind(this);
        this.convertFormToJson = this.convertFormToJson.bind(this);
    }
    ajaxGet(url, successFunction) {
        $.ajax({
            url: url,
            type: 'GET',
            cache: false,
            beforeSend: function () {
                var loader = '<div class="progress"><div class="indeterminate"></div></div>';
                $("#loader-placeholder").html(loader);
            },
            success: function (data) {
                successFunction(data);
                setTimeout(function(){
                  $("#loader-placeholder").html("");
                }, 200);
            },
            error: function (xhr, status, err) {
              setTimeout(function(){
                $("#loader-placeholder").html("");
              }, 200);
              M.toast({html: "<div>Error: " + xhr.statusText + "; Code: " + xhr.status + "</div>"});
            }
        });
    }

    convertFormToJson(formId) {
        var form = $("#" + formId).serializeArray();
        var formObject = {};
        $.each(form,
          function (i, v) {
            var valueTest = v.value.replace(",", ".");
            var number = Number(valueTest);
            if(isNaN(number) || v.value == '') {
              formObject[v.name] = v.value;
            } else {
              formObject[v.name] = number;
            }
          }
        );
        return JSON.stringify(formObject);
      }

    formSubmit(formUrl, formMethod, formData, successFunction) {      
        $.ajax({
          url: formUrl,
          type: formMethod,
          data: formData,
          dataType: "json",
          contentType: 'application/json',
          cache: false,
      
          beforeSend: function () {
            var loader = '<div class="progress"><div class="indeterminate"></div></div>';
            $("#loader-placeholder").html(loader);       
          },
          success: function (data) {
            setTimeout(function(){
              $("#loader-placeholder").html("");
            }, 200);
            successFunction(data);
          },
          error: function (xhr, status, err) {
            setTimeout(function(){
              $("#loader-placeholder").html("");
            }, 200);
            M.toast({html: "<div>Error: " + xhr.statusText + "; Code: " + xhr.status + "</div>"});
          }
        });
        return false;
      }

}

export default (new Utils);