#!/bin/sh

docker_without_sudo() {
  sudo groupadd docker
  sudo usermod -aG docker $USER
  RED='\033[0;31m'
  NC='\033[0m' # No Color
  echo "Docker without sudo configured. ${RED}Log out and log back in${NC} so that your group membership is re-evaluated."
}

if ! grep -q docker /etc/group
then
  docker_without_sudo
else
  echo "Docker without sudo is already configured."
fi