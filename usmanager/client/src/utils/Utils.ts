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

export function timedFetch(url: string, options: any, timeout = 10000) {
    return new Promise((resolve, reject) => {
        fetch(url, options).then(resolve).catch(reject);
        if (timeout) {
            const e = new Error("A conexão excedeu o limite de tempo.");
            setTimeout(reject, timeout, e);
        }
    });
}

export function fetchUrl(url: string, method: string, reqbody: any,
                         successMessage: string, callback: (s: boolean, c: boolean) => void) {
    console.log(url);
    console.log(reqbody);
    fetch(url, {
        method,
        body: JSON.stringify(reqbody),
        headers: new Headers({
            'Authorization': 'Basic '+btoa('admin:password'),
            'Content-type': 'application/json;charset=UTF-8'
        }),
    })
        .then(response => {
            if (response.ok) {
                // this.props.changeModalStatus(false);
                callback(false, false);
                alert(successMessage);
            } else {
                throw new Error(response.statusText);
            }
        }).catch((e: string) => console.log(e));
}
