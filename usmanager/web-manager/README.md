# Web manager

[![js-eslint-style](https://img.shields.io/badge/code%20style-TSLint-blue.svg?style=flat-square)](https://palantir.github.io/tslint/)

Este módulo é consistido por cliente reactjs.  
Interage com o [Master Manager](/usmanager/master-manager) através de REST API para permitir um 
ajuste manual do sistema, bem como a visualização do progresso e comportamento do sistema como um todo.  
 
<!---
This module brings a reactjs client to the project. Allowing the manual tweaking of the system, as well as visually 
seeing the progress and behaviour of the system as a whole.
-->
 
 ### Instalar
 
 `npm install`
 
 ### Iniciar
 
 `npm start`
 
 ### Ambiente
 
 > Ubuntu 18.04.4 LTS  
 
 > Chromium 80.0.3987.87 snap 64 bits

### Ferramentas usadas

[<img src="https://i.imgur.com/LGowRP4.png" alt="" width="48" height="40">React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en) - Adds React debugging tools to the Chrome Developer Tools

### Guias úteis

[<img src="https://i.imgur.com/GBqHVDe.png" alt="" width="48" height="15"> npm](https://docs.npmjs.com/) - npm is the world’s largest software registry

[<img src="https://i.imgur.com/LGowRP4.png" alt="" width="48" height="40"> Reactjs](https://reactjs.org/docs/getting-started.html) - React is a JavaScript library for building user interfaces

[<img src="https://i.imgur.com/lwAbTpS.png" alt="" width="48" height="48"> Typescript](https://www.typescriptlang.org/docs/home.html) - TypeScript is a typed superset of JavaScript that compiles to plain JavaScript

#### Resolução de erros

Se após a execução de `npm start`, por acaso aparecer o erro:

> ENOSPC: System limit for number of file watchers reached

Executar os comandos seguintes deve resolvê-lo:

> `echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf`
>
> `sudo sysctl -p`

### Licença

Web manager está licenciado com o [MIT license](https://github.com/usmanager/usmanager/LICENSE). Ver a licença no cabeçalho do respetivo ficheiro para confirmar.
