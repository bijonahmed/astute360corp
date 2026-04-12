<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>New Contact Message</title>
  <style>
    body {
      margin: 0; padding: 0;
      background: #f0f4f8;
      font-family: 'Segoe UI', Arial, sans-serif;
      color: #333;
    }
    .wrapper {
      max-width: 620px;
      margin: 40px auto;
      background: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 24px rgba(0,0,0,0.08);
    }
    .header {
      background: linear-gradient(135deg, #0a1628 0%, #1a3a6e 100%);
      padding: 36px 40px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      color: #ffffff;
      font-size: 22px;
      font-weight: 700;
      letter-spacing: 0.5px;
    }
    .header p {
      margin: 8px 0 0;
      color: rgba(255,255,255,0.65);
      font-size: 13px;
    }
    .badge {
      display: inline-block;
      background: rgba(0,194,255,0.15);
      border: 1px solid rgba(0,194,255,0.35);
      color: #00c2ff;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 2px;
      text-transform: uppercase;
      padding: 5px 14px;
      border-radius: 30px;
      margin-bottom: 14px;
    }
    .body {
      padding: 36px 40px;
    }
    .intro {
      font-size: 15px;
      color: #555;
      margin: 0 0 28px;
      line-height: 1.6;
    }
    .field-row {
      display: flex;
      gap: 0;
      margin-bottom: 16px;
      border: 1px solid #e8eef8;
      border-radius: 10px;
      overflow: hidden;
    }
    .field-label {
      background: #f0f4fb;
      padding: 14px 18px;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #0a1628;
      min-width: 110px;
      display: flex;
      align-items: center;
    }
    .field-value {
      padding: 14px 18px;
      font-size: 14px;
      color: #333;
      flex: 1;
      display: flex;
      align-items: center;
      word-break: break-word;
    }
    .message-box {
      background: #f8faff;
      border: 1px solid #e8eef8;
      border-radius: 10px;
      padding: 20px;
      margin-top: 24px;
    }
    .message-box h3 {
      margin: 0 0 12px;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #0a1628;
    }
    .message-box p {
      margin: 0;
      font-size: 14px;
      color: #444;
      line-height: 1.75;
      white-space: pre-line;
    }
    .reply-btn {
      display: inline-block;
      margin-top: 28px;
      background: linear-gradient(135deg, #0a1628, #1a3a6e);
      color: #ffffff !important;
      text-decoration: none;
      padding: 13px 28px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 0.4px;
    }
    .footer {
      background: #f8faff;
      border-top: 1px solid #e8eef8;
      padding: 20px 40px;
      text-align: center;
    }
    .footer p {
      margin: 0;
      font-size: 12px;
      color: #aaa;
      line-height: 1.6;
    }
  </style>
</head>
<body>
  <div class="wrapper">

    <!-- Header -->
    <div class="header">
      <div class="badge">New Message</div>
      <h1>📬 Contact Form Submission</h1>
      <p>Someone has reached out through your website.</p>
    </div>

    <!-- Body -->
    <div class="body">
      <p class="intro">
        Hello, you have received a new contact message. Here are the details:
      </p>

      <!-- Name -->
      <div class="field-row">
        <div class="field-label">👤 Name</div>
        <div class="field-value">{{ $name }}</div>
      </div>

      <!-- Email -->
      <div class="field-row">
        <div class="field-label">✉️ Email</div>
        <div class="field-value">
          <a href="mailto:{{ $email }}" style="color:#0a6ebd; text-decoration:none;">
            {{ $email }}
          </a>
        </div>
      </div>

      <!-- Phone -->
      <div class="field-row">
        <div class="field-label">📞 Phone</div>
        <div class="field-value">{{ $phone }}</div>
      </div>

      <!-- Subject -->
      <div class="field-row">
        <div class="field-label">🏷️ Subject</div>
        <div class="field-value">{{ $subject }}</div>
      </div>

      <!-- Message -->
      <div class="message-box">
        <h3>💬 Message</h3>
        <p>{{ $userMessage }}</p>
      </div>

      <!-- Reply CTA -->
      <a href="mailto:{{ $email }}" class="reply-btn">
        Reply to {{ $name }} →
      </a>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p>
        This email was sent automatically from your website contact form.<br/>
        Please do not reply directly to this notification.
      </p>
    </div>

  </div>
</body>
</html>
