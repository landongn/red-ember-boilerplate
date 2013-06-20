from __init__ import *

import sys
import os.path
from socket import gethostname

# Suppress white noise
LOGGING['loggers']['']['level'] = 'WARNING'

# Sentry settings
SENTRY_API_KEY = ''
SENTRY_URL = ''
SENTRY_ID = ''

# Pass settings to template layer
VIEW_SETTINGS += ('SENTRY_API_KEY', 'SENTRY_URL', 'SENTRY_ID')

# If <hostname>.py exists, use it in addition to frontend.py
_path = os.path.join(PROJECT_ROOT, 'settings', 'hosts')
_hostname = gethostname().split('.')[0]

if os.path.isfile(os.path.join(_path, '%s.py' % _hostname)):
    sys.modules['host'] = __import__(_hostname)
    from host import *
    del sys.modules['host']
