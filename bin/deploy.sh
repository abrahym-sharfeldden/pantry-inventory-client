set -xe

if [ $TRAVIS_BRANCH == 'master' ] ; then
  ssh-add ~/.ssh/id_rsa

  # deploy
  rsync -avz -e "ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null" --progress build/* travis@$HOST_IP:$HOST_STATIC_PATH
else
  echo "Not deploying, since the branch isn't master."
fi