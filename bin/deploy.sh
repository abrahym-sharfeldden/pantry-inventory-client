set -xe

if [ $TRAVIS_BRANCH == 'master' ] ; then
  eval "$(ssh-agent -s)"
  ssh-add ~/.ssh/id_rsa

  rsync -avz -e "ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null" --progress build/* travis@$HOST_IP:$HOST_STATIC_PATH
else
  echo "Not deploying, since the branch isn't master."
fi