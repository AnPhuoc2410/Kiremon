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
            var subject = "Welcome to Kiremon - Verify your email";
            var htmlBody = BuildWelcomeTemplate(user, confirmationLink);
            await SendEmailAsync(user.Email!, subject, htmlBody);
        }

        public async Task SendPasswordResetAsync(ApplicationUser user, string resetLink, string token)
        {
            var subject = "Reset your Kiremon password";
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
                <html>
                  <body style="background:#0b1021;font-family:'Segoe UI',Arial,sans-serif;color:#f6f8ff;padding:32px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;margin:0 auto;background:#11162a;border-radius:12px;overflow:hidden;border:1px solid #1f2a48;">
                      <tr>
                        <td style="background:linear-gradient(135deg,#ffca00,#ff6b6b);padding:20px 28px;font-size:22px;font-weight:700;color:#0b1021;">
                          Welcome to Kiremon
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:28px;">
                          <p style="font-size:16px;margin:0 0 12px 0;">Hi {WebUtility.HtmlEncode(firstName)},</p>
                          <p style="font-size:15px;margin:0 0 16px 0;line-height:1.6;">
                            Thanks for signing up! Please confirm your email to activate your Trainer account and start your journey.
                          </p>
                          <p style="text-align:center;margin:24px 0;">
                            <a href="{confirmationLink}" style="display:inline-block;padding:14px 22px;background:#ff6b6b;color:#0b1021;text-decoration:none;font-weight:700;border-radius:10px;box-shadow:0 8px 20px rgba(255,107,107,0.35);">
                              Confirm email
                            </a>
                          </p>
                          <p style="font-size:13px;color:#cfd6ff;margin:0 0 6px 0;">If the button doesn't work, paste this link in your browser:</p>
                          <p style="font-size:12px;word-break:break-all;color:#9db4ff;">{confirmationLink}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="background:#0d1327;padding:18px 28px;font-size:12px;color:#9db4ff;">
                          This link expires soon. If you didn't create an account, ignore this email.
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
                <html>
                  <body style="background:#0b1021;font-family:'Segoe UI',Arial,sans-serif;color:#f6f8ff;padding:32px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;margin:0 auto;background:#11162a;border-radius:12px;overflow:hidden;border:1px solid #1f2a48;">
                      <tr>
                        <td style="background:linear-gradient(135deg,#6bc1ff,#9b6bff);padding:20px 28px;font-size:22px;font-weight:700;color:#0b1021;">
                          Reset your password
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:28px;">
                          <p style="font-size:16px;margin:0 0 12px 0;">Hi {WebUtility.HtmlEncode(firstName)},</p>
                          <p style="font-size:15px;margin:0 0 16px 0;line-height:1.6;">
                            We received a request to reset your password. Use the one-time token below or click the button to continue.
                          </p>
                          <p style="font-size:20px;font-weight:700;letter-spacing:1px;background:#0d1327;padding:12px 16px;border-radius:10px;border:1px solid #1f2a48;text-align:center;color:#ffca00;">
                            {WebUtility.HtmlEncode(token)}
                          </p>
                          <p style="text-align:center;margin:22px 0;">
                            <a href="{resetLink}" style="display:inline-block;padding:14px 22px;background:#6bc1ff;color:#0b1021;text-decoration:none;font-weight:700;border-radius:10px;box-shadow:0 8px 20px rgba(107,193,255,0.35);">
                              Reset password
                            </a>
                          </p>
                          <p style="font-size:13px;color:#cfd6ff;margin:0 0 6px 0;">If the button doesn't work, paste this link in your browser:</p>
                          <p style="font-size:12px;word-break:break-all;color:#9db4ff;">{resetLink}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="background:#0d1327;padding:18px 28px;font-size:12px;color:#9db4ff;">
                          If you didn't request this, ignore this email. The token will expire after it is used or when it times out.
                        </td>
                      </tr>
                    </table>
                  </body>
                </html>
                """;
        }
    }
}

