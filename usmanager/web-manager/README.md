#Web manager

[![js-eslint-style](https://img.shields.io/badge/code%20style-ESLint-brightgreen.svg?style=flat-square)](https://eslint.org)


##Fixes
Error: ENOSPC: System limit for number of file watchers reached

`
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p`

