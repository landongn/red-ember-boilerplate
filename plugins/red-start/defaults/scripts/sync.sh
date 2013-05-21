#!/bin/sh
BASEDIR=$(dirname $0)
"$BASEDIR/../env/bin/python" "$BASEDIR/../project/manage.py" syncdb
