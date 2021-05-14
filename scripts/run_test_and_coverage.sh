coverage run --source='.' manage.py test
if [ $# -ne 2 ]; then
    if [ "$1" != "-html" ]; then
      coverage html
    fi
fi
coverage report