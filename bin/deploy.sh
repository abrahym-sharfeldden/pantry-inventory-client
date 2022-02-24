set -xe

if [ $TRAVIS_BRANCH == 'master' ] ; then
  eval "$(ssh-agent -s)"
  ssh-add ~/.ssh/id_rsa

  # rsync -a build/* travis@161.35.11.166:/var/www/pantry.abrahym.dev/html

  cp -r build/* /var/www/pantry.abrahym.dev/html
else
  echo "Not deploying, since the branch isn't master."
fi