using System.Net;
using System.Net.Mail;
using System.Text;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using PokedexReactASP.Application.Interfaces;
using PokedexReactASP.Application.Options;
using PokedexReactASP.Domain.Entities;

namespace PokedexReactASP.Infrastructure.Services
{
    public class EmailService : IEmailService
    {
        private readonly EmailSettings _settings;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IOptions<EmailSettings> options, ILogger<EmailService> logger)
        {
            _settings = options.Value;
            _logger = logger;
        }

        public async Task SendWelcomeConfirmationAsync(ApplicationUser user, string confirmationLink)
        {
            var subject = "🎮 Welcome, Trainer! Your Kiremon Adventure Awaits!";
            var htmlBody = BuildWelcomeTemplate(user, confirmationLink);
            await SendEmailAsync(user.Email!, subject, htmlBody);
        }

        public async Task SendPasswordResetAsync(ApplicationUser user, string resetLink, string token)
        {
            var subject = "⚡ Password Recovery - Kiremon Trainer Center";
            var htmlBody = BuildResetPasswordTemplate(user, resetLink, token);
            await SendEmailAsync(user.Email!, subject, htmlBody);
        }

        private async Task SendEmailAsync(string toEmail, string subject, string htmlBody)
        {
            using var client = new SmtpClient(_settings.SmtpServer, _settings.SmtpPort)
            {
                EnableSsl = true,
                Credentials = new NetworkCredential(_settings.Username, _settings.Password)
            };

            using var message = new MailMessage
            {
                From = new MailAddress(_settings.FromEmail, _settings.FromName),
                Subject = subject,
                Body = htmlBody,
                IsBodyHtml = true,
                BodyEncoding = Encoding.UTF8,
                SubjectEncoding = Encoding.UTF8
            };

            message.To.Add(toEmail);

            try
            {
                await client.SendMailAsync(message);
            }
            catch (SmtpException ex)
            {
                _logger.LogError(ex, "Failed to send email to {Recipient}", toEmail);
                throw;
            }
        }

        private string BuildWelcomeTemplate(ApplicationUser user, string confirmationLink)
        {
            var firstName = string.IsNullOrWhiteSpace(user.FirstName) ? user.UserName : user.FirstName;
            return $"""
                <!DOCTYPE html>
                <html>
                  <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  </head>
                  <body style="margin:0;padding:0;background:#f5f5f5;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:20px 0;">
                      <tr>
                        <td align="center">
                          <!-- Main Container -->
                          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.1);border:4px solid #ffcb05;">
                            
                            <!-- Header with Pokeball SVG -->
                            <tr>
                              <td style="background:#dc0a2d;padding:0;position:relative;">
                                <table width="100%" cellpadding="0" cellspacing="0">
                                  <tr>
                                    <td style="padding:24px 32px;text-align:center;">
                                      <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="display:block;margin:0 auto 16px;">
                                        <!-- Outer circle -->
                                        <circle cx="50" cy="50" r="48" fill="#ffffff" stroke="#2c2c2c" stroke-width="4"/>
                                        <!-- Top red half -->
                                        <path d="M 2 50 A 48 48 0 0 1 98 50 L 98 2 A 48 48 0 0 0 2 2 Z" fill="#dc0a2d"/>
                                        <!-- Bottom white half -->
                                        <path d="M 2 50 A 48 48 0 0 0 98 50 L 98 98 A 48 48 0 0 1 2 98 Z" fill="#ffffff"/>
                                        <!-- Black middle band -->
                                        <rect x="2" y="46" width="96" height="8" fill="#2c2c2c"/>
                                        <!-- Center button outer -->
                                        <circle cx="50" cy="50" r="16" fill="#ffffff" stroke="#2c2c2c" stroke-width="3"/>
                                        <!-- Center button inner -->
                                        <circle cx="50" cy="50" r="8" fill="#2c2c2c"/>
                                      </svg>
                                      <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:900;text-transform:uppercase;letter-spacing:1px;text-shadow:2px 2px 4px rgba(0,0,0,0.3);">
                                        Welcome, Trainer!
                                      </h1>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>

                            <!-- Yellow Divider -->
                            <tr>
                              <td style="background:#ffcb05;height:8px;"></td>
                            </tr>

                            <!-- Content Area -->
                            <tr>
                              <td style="padding:32px;">
                                <table width="100%" cellpadding="0" cellspacing="0">
                                  <tr>
                                    <td>
                                      <div style="background:#f8f8f8;border-left:4px solid #3b4cca;padding:20px;border-radius:8px;margin-bottom:24px;">
                                        <p style="margin:0 0 8px 0;font-size:18px;font-weight:700;color:#2c2c2c;">
                                          👋 Hi, {WebUtility.HtmlEncode(firstName)}!
                                        </p>
                                        <p style="margin:0;font-size:15px;color:#555555;line-height:1.7;">
                                          Your journey to become a Kiremon Master is about to begin! We're excited to have you join our world of adventure and discovery.
                                        </p>
                                      </div>

                                      <p style="margin:0 0 20px 0;font-size:15px;color:#555555;line-height:1.7;">
                                        🎯 <strong>Your next step:</strong> Verify your Trainer ID to unlock your account and start catching Kiremons!
                                      </p>

                                      <!-- Action Button -->
                                      <table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
                                        <tr>
                                          <td align="center">
                                            <a href="{confirmationLink}" style="display:inline-block;background:#dc0a2d;color:#ffffff;text-decoration:none;padding:16px 40px;border-radius:50px;font-weight:900;font-size:16px;text-transform:uppercase;letter-spacing:1px;box-shadow:0 6px 16px rgba(220,10,45,0.4);border:3px solid #2c2c2c;">
                                              ⚡ Confirm My Trainer ID
                                            </a>
                                          </td>
                                        </tr>
                                      </table>

                                      <!-- Stats Box -->
                                      <div style="background:#3b4cca;color:#ffffff;padding:16px;border-radius:8px;margin:24px 0;text-align:center;">
                                        <p style="margin:0;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">
                                          🏆 Ready to Start Your Adventure? 🏆
                                        </p>
                                      </div>

                                      <div style="border:2px dashed #cccccc;padding:16px;border-radius:8px;background:#fafafa;">
                                        <p style="margin:0 0 8px 0;font-size:13px;color:#777777;font-weight:600;">
                                          🔗 Button not working? Copy this link:
                                        </p>
                                        <p style="margin:0;font-size:12px;color:#3b4cca;word-break:break-all;font-family:monospace;">
                                          {confirmationLink}
                                        </p>
                                      </div>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>

                            <!-- Footer -->
                            <tr>
                              <td style="background:#2c2c2c;padding:20px 32px;">
                                <table width="100%" cellpadding="0" cellspacing="0">
                                  <tr>
                                    <td style="text-align:center;">
                                      <p style="margin:0 0 8px 0;font-size:13px;color:#ffcb05;font-weight:700;">
                                        ⏱️ Quick Reminder!
                                      </p>
                                      <p style="margin:0;font-size:12px;color:#aaaaaa;line-height:1.6;">
                                        This verification link will expire soon. If you didn't create a Kiremon account, you can safely ignore this email.
                                      </p>
                                      <p style="margin:12px 0 0 0;font-size:11px;color:#777777;">
                                        © 2024 Kiremon • Trainer Center • Gotta catch 'em all!
                                      </p>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </body>
                </html>
                """;
        }

        private string BuildResetPasswordTemplate(ApplicationUser user, string resetLink, string token)
        {
            var firstName = string.IsNullOrWhiteSpace(user.FirstName) ? user.UserName : user.FirstName;
            return $"""
                <!DOCTYPE html>
                <html>
                  <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  </head>
                  <body style="margin:0;padding:0;background:#f5f5f5;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:20px 0;">
                      <tr>
                        <td align="center">
                          <!-- Main Container -->
                          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.1);border:4px solid #3b4cca;">
                            
                            <!-- Header - Trainer Center with Icon -->
                            <tr>
                              <td style="background:#3b4cca;padding:0;">
                                <table width="100%" cellpadding="0" cellspacing="0">
                                  <tr>
                                    <td style="padding:24px 32px;text-align:center;">
                                      <svg width="80" height="80" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="display:block;margin:0 auto 12px;">
                                        <!-- Hospital Cross Background -->
                                        <rect x="10" y="10" width="80" height="80" rx="12" fill="#ffffff"/>
                                        <!-- Red Cross -->
                                        <rect x="42" y="25" width="16" height="50" fill="#dc0a2d" rx="2"/>
                                        <rect x="25" y="42" width="50" height="16" fill="#dc0a2d" rx="2"/>
                                        <!-- Border -->
                                        <rect x="10" y="10" width="80" height="80" rx="12" fill="none" stroke="#2c2c2c" stroke-width="4"/>
                                      </svg>
                                      <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:900;text-transform:uppercase;letter-spacing:1px;text-shadow:2px 2px 4px rgba(0,0,0,0.3);">
                                        Trainer Center
                                      </h1>
                                      <p style="margin:8px 0 0 0;color:#ffcb05;font-size:14px;font-weight:700;text-transform:uppercase;">
                                        Password Recovery System
                                      </p>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>

                            <!-- Yellow Divider -->
                            <tr>
                              <td style="background:#ffcb05;height:8px;"></td>
                            </tr>

                            <!-- Content Area -->
                            <tr>
                              <td style="padding:32px;">
                                <table width="100%" cellpadding="0" cellspacing="0">
                                  <tr>
                                    <td>
                                      <div style="background:#fff3cd;border-left:4px solid #ffc107;padding:16px;border-radius:8px;margin-bottom:24px;">
                                        <p style="margin:0;font-size:14px;color:#856404;font-weight:600;">
                                          ⚠️ Security Alert: Password Reset Request Detected
                                        </p>
                                      </div>

                                      <p style="margin:0 0 8px 0;font-size:18px;font-weight:700;color:#2c2c2c;">
                                        Hey {WebUtility.HtmlEncode(firstName)}! 👋
                                      </p>
                                      <p style="margin:0 0 20px 0;font-size:15px;color:#555555;line-height:1.7;">
                                        Someone (hopefully you!) requested to reset your Kiremon Trainer account password. Don't worry, we've got your back!
                                      </p>

                                      <!-- Token Display Box -->
                                      <div style="background:#2c2c2c;border:4px solid #ffcb05;border-radius:12px;padding:20px;margin:24px 0;text-align:center;">
                                        <p style="margin:0 0 12px 0;font-size:13px;color:#ffcb05;font-weight:700;text-transform:uppercase;letter-spacing:1px;">
                                          🔑 Your One-Time Recovery Code
                                        </p>
                                        <div style="background:#1a1a1a;padding:16px;border-radius:8px;border:2px dashed #ffcb05;">
                                          <p style="margin:0;font-size:24px;font-weight:900;color:#ffffff;letter-spacing:3px;font-family:monospace;">
                                            {WebUtility.HtmlEncode(token)}
                                          </p>
                                        </div>
                                        <p style="margin:12px 0 0 0;font-size:12px;color:#aaaaaa;">
                                          Use this code on the password reset page
                                        </p>
                                      </div>

                                      <p style="margin:0 0 8px 0;font-size:14px;color:#555555;text-align:center;">
                                        — OR —
                                      </p>

                                      <!-- Action Button -->
                                      <table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
                                        <tr>
                                          <td align="center">
                                            <a href="{resetLink}" style="display:inline-block;background:#3b4cca;color:#ffffff;text-decoration:none;padding:16px 40px;border-radius:50px;font-weight:900;font-size:16px;text-transform:uppercase;letter-spacing:1px;box-shadow:0 6px 16px rgba(59,76,202,0.4);border:3px solid #2c2c2c;">
                                              🔧 Reset My Password
                                            </a>
                                          </td>
                                        </tr>
                                      </table>

                                      <!-- Info Box -->
                                      <div style="background:#e7f3ff;border-left:4px solid #3b4cca;padding:16px;border-radius:8px;margin:24px 0;">
                                        <p style="margin:0 0 8px 0;font-size:14px;color:#004085;font-weight:700;">
                                          💡 Pro Trainer Tip:
                                        </p>
                                        <p style="margin:0;font-size:13px;color:#004085;line-height:1.6;">
                                          Choose a strong password to protect your Kiremon collection! Mix uppercase, lowercase, numbers, and symbols.
                                        </p>
                                      </div>

                                      <div style="border:2px dashed #cccccc;padding:16px;border-radius:8px;background:#fafafa;">
                                        <p style="margin:0 0 8px 0;font-size:13px;color:#777777;font-weight:600;">
                                          🔗 Link not working? Copy and paste this URL:
                                        </p>
                                        <p style="margin:0;font-size:12px;color:#3b4cca;word-break:break-all;font-family:monospace;">
                                          {resetLink}
                                        </p>
                                      </div>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>

                            <!-- Footer -->
                            <tr>
                              <td style="background:#2c2c2c;padding:20px 32px;">
                                <table width="100%" cellpadding="0" cellspacing="0">
                                  <tr>
                                    <td style="text-align:center;">
                                      <p style="margin:0 0 8px 0;font-size:13px;color:#dc0a2d;font-weight:700;">
                                        🛡️ Security Notice
                                      </p>
                                      <p style="margin:0;font-size:12px;color:#aaaaaa;line-height:1.6;">
                                        If you didn't request this password reset, please ignore this email or contact our support team. Your account is safe and no changes have been made.
                                      </p>
                                      <p style="margin:12px 0 4px 0;font-size:12px;color:#777777;">
                                        This code expires after use or timeout.
                                      </p>
                                      <p style="margin:0;font-size:11px;color:#777777;">
                                        © 2024 Kiremon • Trainer Center • Stay safe, Trainer!
                                      </p>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </body>
                </html>
                """;
        }
    }
}