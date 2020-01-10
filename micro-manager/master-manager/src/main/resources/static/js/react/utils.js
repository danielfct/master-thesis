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

import $ from "jquery";
import React from "react";

class Utils {

    ajaxGet = (url, successFunction) => {
        $.ajax({
            url: url,
            type: 'GET',
            cache: false,
            beforeSend: function () {
                let loader = '<div class="progress"><div class="indeterminate"></div></div>';
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
    };

    convertFormToJson = (formId) => {
        let form = $("#" + formId).serializeArray();
        let formObject = {};
        $.each(form,
            function (i, v) {
                let valueTest = v.value.replace(",", ".");
                let number = Number(valueTest);
                if (isNaN(number) || v.value === '') {
                    formObject[v.name] = v.value;
                } else {
                    formObject[v.name] = number;
                }
            }
        );
        return JSON.stringify(formObject);
    };

    formSubmit = (formUrl, formMethod, formData, successFunction) => {
        $.ajax({
            url: formUrl,
            type: formMethod,
            data: formData,
            dataType: "json",
            contentType: 'application/json',
            cache: false,
            beforeSend: function () {
                let loader = '<div class="progress"><div class="indeterminate"></div></div>';
                $("#loader-placeholder").html(loader);
            },
            success: function (data) {
                setTimeout(function() {
                    $("#loader-placeholder").html("");
                }, 200);
                successFunction(data);
            },
            error: function (xhr, status, err) {
                setTimeout(function() {
                    $("#loader-placeholder").html("");
                }, 200);
                M.toast({html: "<div>Error: " + xhr.statusText + "; Code: " + xhr.status + "</div>"});
            }
        });
        return false;
    };

}

export default (new Utils);