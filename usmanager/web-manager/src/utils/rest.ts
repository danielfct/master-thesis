/*
 * MIT License
 *
 * Copyright (c) 2020 usmanager
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

import M from 'materialize-css'

//TODO dispatch invalidate local data? on post put delete and patch

/*fetch (url, successFunction) {
  displayProgressBar();
  fetch(`http://${url}`, {
    method: 'GET'
  }).then(response => {
    if (response.ok) {
      return response.json();
    }
    // throw new Error(response.statusText);
    M.toast({ html: '<div>Error: ' + response.statusText + '; Code: ' + response.status + '</div>' });
  }).then(json => {
    successFunction(json);
    hideProgressBar(200);
  });
};

convertFormToJson (formId) {
  const form = $('#' + formId).serializeArray();
  const formObject = {};
  $.each(form, (i, v) => {
        const valueTest = v.value.replace(',', '.');
        const number = Number(valueTest);
        if (isNaN(number) || v.value === '') {
          formObject[v.name] = v.value;
        } else {
          formObject[v.name] = number;
        }
      }
  );
  return JSON.stringify(formObject);
};

formSubmit (formUrl, formMethod, formData, successFunction) {
  $.ajax({
    url: formUrl,
    type: formMethod,
    data: formData,
    dataType: 'json',
    contentType: 'application/json',
    cache: false,
    beforeSend: () =>
        displayProgressBar(),
    success: (data) => {
      hideProgressBar(200);
      successFunction(data);
    },
    error: (xhr, status, err) => {
      hideProgressBar(200);
      M.toast({ html: '<div>Error: ' + xhr.statusText + '; Code: ' + xhr.status + '</div>' });
    }
  });
  return false;
};
}*/

export function getData(url: string): any {
    /* console.log(`GET ${url}`);
     return (dispatch: any) => {
         fetch(url, {
             method: 'GET'
         }).then(response => {
             if (response.ok) {
                 return response.json();
             }
             throw new Error(`${response.status} ${response.statusText}`);
         }).then(json => {
             dispatch(fetchData(json));
         }).catch(e => {
             dispatch(fetchError(e))
         });
     }*/
}

export function postData(url: string, requestBody: any, callback: (data: any) => void): void {
    sendData(url, 'POST', requestBody, callback);
}

export function putData(url: string, requestBody: any, callback: (data: any) => void): void {
    sendData(url, 'PUT', requestBody, callback);
}

export function patchData(url: string, requestBody: any, callback: (data?: any) => void, action?: "post" | "put" | "delete", ): void {
    if (action) {
        requestBody = { [action]: requestBody };
    }
    sendData(url, 'PATCH', requestBody, callback);
}

const sendData = (url: string, method: string, body: any, callback: (data: any) => void) => {
    body = JSON.stringify(body);
    console.log(`${method} ${url} ${body}`);
    fetch(url, {
        method,
        body,
        mode: 'cors',
        headers: new Headers({
            'Content-type': 'application/json;charset=UTF-8',
            'Accept': 'application/json;charset=UTF-8',
            'Origin': 'http://localhost:3000'
        })
    }).then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error(`${response.status} ${response.statusText}`);
    }).then(json => {
        callback(json);
    }).catch(e => {
        M.toast({html: `<div>${e.message}</div>`});
    });
};

export function deleteData(url: string, callback: () => void): void {
    console.log(`DELETE ${url}`);
    fetch(url, {
        method: 'DELETE',
        mode: 'cors',
        headers: new Headers({
            'Content-type': 'application/json;charset=UTF-8',
            'Accept': 'application/json;charset=UTF-8',
            'Origin': 'http://localhost:3000',
            'Authorization': 'Basic ' + btoa('admin:admin'), //TODO
        })
    }).then(response => {
        if (response.ok) {
            callback();
        } else {
            response.json().then(({apierror}) => {
                M.toast({html: `${response.status} ${apierror.status} - ${apierror.message}`, displayLength: 6000});
            });
        }
    }).catch(_ => {
        M.toast({html: `<div>Connection refused</div>`});
    });
}
