"""
This file defines actions, i.e. functions the URLs are mapped into
The @action(path) decorator exposed the function at URL:

    http://127.0.0.1:8000/{app_name}/{path}

If app_name == '_default' then simply

    http://127.0.0.1:8000/{path}

If path == 'index' it can be omitted:

    http://127.0.0.1:8000/

The path follows the bottlepy syntax.

@action.uses('generic.html')  indicates that the action uses the generic.html template
@action.uses(session)         indicates that the action uses the session
@action.uses(db)              indicates that the action uses the db
@action.uses(T)               indicates that the action uses the i18n & pluralization
@action.uses(auth.user)       indicates that the action requires a logged in user
@action.uses(auth)            indicates that the action requires the auth object

session, db, T, auth, and tempates are examples of Fixtures.
Warning: Fixtures MUST be declared with @action.uses({fixtures}) else your app will result in undefined behavior
"""

from py4web import action, request, abort, redirect, URL
from yatl.helpers import A
from . common import db, session, T, cache, auth, signed_url
from . models import get_user_email, get_user_title


@action('index')
@action.uses('index.html', signed_url, auth.user)
def index():
    return dict(
        get_tickets_url = URL('get_tickets', signer=signed_url),
        user_email = get_user_email(),
        username = get_user_title(),
        user=auth.get_user()
    )

@action('get_tickets')
@action.uses(signed_url.verify(), auth.user)
def get_tickets():
    tickets = [] # Just to keep code from breaking.
    return dict(tickets=tickets)
