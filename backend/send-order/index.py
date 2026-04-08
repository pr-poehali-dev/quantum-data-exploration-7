import json
import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


def handler(event: dict, context) -> dict:
    """Отправляет заявку на печать на почту студии printphoto.2026@mail.ru"""

    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }

    body = json.loads(event.get('body') or '{}')
    name = body.get('name', '').strip()
    phone = body.get('phone', '').strip()
    email = body.get('email', '').strip()
    service = body.get('service', '').strip()
    message = body.get('message', '').strip()

    if not name or not phone:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Имя и телефон обязательны'})
        }

    smtp_password = os.environ.get('SMTP_PASSWORD', '')
    from_email = 'printphoto.2026@mail.ru'
    to_email = 'printphoto.2026@mail.ru'

    html = f"""
    <h2>Новая заявка с сайта</h2>
    <table style="border-collapse:collapse; width:100%; font-family:Arial,sans-serif;">
      <tr><td style="padding:8px; font-weight:bold; color:#555;">Имя:</td><td style="padding:8px;">{name}</td></tr>
      <tr style="background:#f9f9f9;"><td style="padding:8px; font-weight:bold; color:#555;">Телефон:</td><td style="padding:8px;">{phone}</td></tr>
      <tr><td style="padding:8px; font-weight:bold; color:#555;">Email:</td><td style="padding:8px;">{email or '—'}</td></tr>
      <tr style="background:#f9f9f9;"><td style="padding:8px; font-weight:bold; color:#555;">Услуга:</td><td style="padding:8px;">{service or '—'}</td></tr>
      <tr><td style="padding:8px; font-weight:bold; color:#555;">Сообщение:</td><td style="padding:8px;">{message or '—'}</td></tr>
    </table>
    """

    msg = MIMEMultipart('alternative')
    msg['Subject'] = f'Новая заявка от {name}'
    msg['From'] = from_email
    msg['To'] = to_email
    msg.attach(MIMEText(html, 'html', 'utf-8'))

    server = smtplib.SMTP_SSL('smtp.mail.ru', 465)
    server.login(from_email, smtp_password)
    server.sendmail(from_email, to_email, msg.as_string())
    server.quit()

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'success': True})
    }
