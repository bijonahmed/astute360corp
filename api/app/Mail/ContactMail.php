<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ContactMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public readonly array $data
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'New Contact Message: ' . $this->data['subject'] ?? 'General Enquiry',
            replyTo: [
                new \Illuminate\Mail\Mailables\Address(
                    $this->data['email'],
                    $this->data['name']
                ),
            ],
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.contact',
            with: [
                'name'    => $this->data['name'],
                'email'   => $this->data['email'],
                'phone'   => $this->data['phone']   ?? 'Not provided',
                'subject' => $this->data['subject'] ?? 'General Enquiry',
                'userMessage' => $this->data['message'],
            ],
        );
    }
}
