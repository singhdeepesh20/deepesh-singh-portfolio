import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { Resend } from 'resend';
import { supabase } from '@/lib/supabase';

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
}

async function isAdmin() {
  const store = await cookies();
  const token = store.get('admin_token')?.value;
  if (!token) return false;
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

export async function POST(request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM || !supabase) {
    return NextResponse.json({ error: 'Email service is not configured' }, { status: 503 });
  }

  try {
    const formData = await request.formData();
    const to = formData.get('to');
    const subject = formData.get('subject');
    const message = formData.get('message');
    const file = formData.get('file');

    if (!to || !subject || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let attachments = [];
    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      attachments.push({
        filename: file.name,
        content: buffer,
      });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM,
      to: to,
      subject: subject,
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #08090b; color: #ffffff; padding: 40px; border-radius: 16px; border: 1px solid #222;">
          <h2 style="margin: 0 0 24px; color: #00e5cc; font-size: 20px;">Message from Deepesh Singh</h2>
          <div style="font-size: 15px; line-height: 1.7; color: #d4d4d4; white-space: pre-wrap;">${escapeHtml(message)}</div>
        </div>
      `,
      attachments: attachments.length > 0 ? attachments : undefined,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Save the sent email to the inquiries database so the admin can see the history
    await supabase.from('inquiries').insert([{
      name: 'Sent by Deepesh Singh',
      email: to,
      message: `SUBJECT: ${subject}\n\n${message}`,
      read: true // automatically mark sent emails as read
    }]);

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error('Send email error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
