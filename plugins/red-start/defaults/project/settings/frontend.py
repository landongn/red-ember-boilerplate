from base import *

import sys
import os.path
from socket import gethostname

# Any other configuration that should apply to all
# settings versions but relies on other settings (ei: debug)
# should go here.
LOGGING['loggers'] = {
    '': {
        'handlers': DEBUG and ['stream'] or ['mail_admins', 'file'],
        'level': 'WARNING',
        'propagate': True,
    }
}

# If <hostname>.py exists, use it in addition to frontend.py
_path = os.path.join(PROJECT_ROOT, 'settings', 'hosts')
_hostname = gethostname().split('.')[0]

if os.path.isfile(os.path.join(_path, '%s.py' % _hostname)):
    sys.modules['host'] = __import__(_hostname)
    from host import *
    del sys.modules['host']
