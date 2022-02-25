set -xe

if [ $TRAVIS_BRANCH == 'master' ] ; then
  # before_deploy
  mkdir -p ${TRAVIS_HOME}/.ssh
  ssh-keyscan -t ${TRAVIS_SSH_KEY_TYPES} -H ${HOST_IP} 2>&1 | tee -a ${TRAVIS_HOME}/.ssh/known_hosts
  ssh-add ~/.ssh/id_rsa

  # deploy
  rsync -avz -e "ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null" --progress build/* travis@$HOST_IP:$HOST_STATIC_PATH
else
  echo "Not deploying, since the branch isn't master."
fi