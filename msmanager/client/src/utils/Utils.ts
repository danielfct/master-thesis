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
