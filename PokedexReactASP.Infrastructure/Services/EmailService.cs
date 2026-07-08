using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using MimeKit;
using PokedexReactASP.Application.Interfaces;
using PokedexReactASP.Application.Options;
using PokedexReactASP.Domain.Entities;
using System.Net;

namespace PokedexReactASP.Infrastructure.Services
{
    public class EmailService(IOptions<EmailSettings> options, ILogger<EmailService> logger) : IEmailService
    {
        private readonly EmailSettings _settings = options.Value;
        private readonly ILogger<EmailService> _logger = logger;

        public async Task SendWelcomeConfirmationAsync(ApplicationUser user, string confirmationLink)
        {
            var subject = "Welcome, Trainer! Your Kiremon Adventure Awaits!";
            var htmlBody = BuildWelcomeTemplate(user, confirmationLink);
            await SendEmailAsync(user.Email!, subject, htmlBody).ConfigureAwait(false);
        }

        public async Task SendExternalWelcomeConfirmationAsync(ApplicationUser user, string confirmationLink, string provider)
        {
            var subject = $"Welcome via {provider}! Your Kiremon Adventure Awaits!";
            var htmlBody = BuildExternalWelcomeTemplate(user, confirmationLink, provider);
            await SendEmailAsync(user.Email!, subject, htmlBody).ConfigureAwait(false);
        }

        public async Task SendPasswordResetAsync(ApplicationUser user, string resetLink, string token)
        {
            var subject = "Password Recovery - Kiremon Trainer Center";
            var htmlBody = BuildResetPasswordTemplate(user, resetLink, token);
            await SendEmailAsync(user.Email!, subject, htmlBody).ConfigureAwait(false);
        }

        private async Task SendEmailAsync(string toEmail, string subject, string htmlBody)
        {
            try
            {
                var message = new MimeMessage();
                message.From.Add(new MailboxAddress(_settings.FromName, _settings.FromEmail));
                message.To.Add(new MailboxAddress("", toEmail));
                message.Subject = subject;

                var bodyBuilder = new BodyBuilder
                {
                    HtmlBody = htmlBody
                };
                message.Body = bodyBuilder.ToMessageBody();

                using var client = new SmtpClient();

                await client.ConnectAsync(_settings.SmtpServer, _settings.SmtpPort, SecureSocketOptions.SslOnConnect).ConfigureAwait(false);
                await client.AuthenticateAsync(_settings.Username, _settings.Password).ConfigureAwait(false);
                await client.SendAsync(message).ConfigureAwait(false);
                await client.DisconnectAsync(true).ConfigureAwait(false);
            }
            catch (Exception ex)
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
                  <body style="margin:0;padding:0;background:#F7F6F3;font-family:Courier,monospace,sans-serif;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background:#F7F6F3;padding:40px 0;">
                      <tr>
                        <td align="center">
                          <table width="600" cellpadding="0" cellspacing="0" style="background:#FFFFFF;border:2px solid #dc0a2d;border-radius:4px;">
                            <!-- Header -->
                            <tr>
                              <td style="border-bottom:2px solid #dc0a2d;padding:24px;">
                                <h1 style="margin:0;color:#dc0a2d;font-size:24px;font-weight:700;letter-spacing:-0.5px;">
                                  [ KIREMON SYSTEM ]
                                </h1>
                              </td>
                            </tr>
                            <!-- Content Area -->
                            <tr>
                              <td style="padding:32px 24px;">
                                <p style="margin:0 0 16px 0;font-size:16px;font-weight:700;color:#111111;">
                                  Trainer initialization: {WebUtility.HtmlEncode(firstName)}
                                </p>
                                <p style="margin:0 0 32px 0;font-size:15px;color:#2F3437;line-height:1.6;">
                                  Welcome to Kiremon. Your account profile has been provisioned. To unlock system access, verification of your Trainer ID is required.
                                </p>
                                <!-- Action Button -->
                                <table cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                                  <tr>
                                    <td>
                                      <a href="{confirmationLink}" style="display:inline-block;background:#dc0a2d;color:#FFFFFF;text-decoration:none;padding:12px 24px;font-weight:700;font-size:15px;border:1px solid #dc0a2d;">
                                        CONFIRM TRAINER ID
                                      </a>
                                    </td>
                                  </tr>
                                </table>
                                <!-- Fallback Box -->
                                <div style="background:#F7F6F3;border:1px solid #EAEAEA;padding:16px;">
                                  <p style="margin:0 0 8px 0;font-size:13px;color:#787774;font-weight:700;text-transform:uppercase;">
                                    MANUAL OVERRIDE LINK:
                                  </p>
                                  <p style="margin:0;font-size:13px;color:#2F3437;word-break:break-all;">
                                    {confirmationLink}
                                  </p>
                                </div>
                              </td>
                            </tr>
                            <!-- Footer -->
                            <tr>
                              <td style="border-top:1px solid #EAEAEA;padding:20px 24px;">
                                <p style="margin:0 0 8px 0;font-size:12px;color:#787774;">
                                  Link expires shortly. If unrequested, purge this record.
                                </p>
                                <p style="margin:0;font-size:11px;color:#A0A0A0;text-transform:uppercase;">
                                  SYSTEM / KIREMON / {DateTime.UtcNow.Year}
                                </p>
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
                  <body style="margin:0;padding:0;background:#F7F6F3;font-family:Courier,monospace,sans-serif;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background:#F7F6F3;padding:40px 0;">
                      <tr>
                        <td align="center">
                          <table width="600" cellpadding="0" cellspacing="0" style="background:#FFFFFF;border:2px solid #dc0a2d;border-radius:4px;">
                            <!-- Header -->
                            <tr>
                              <td style="border-bottom:2px solid #dc0a2d;padding:24px;">
                                <h1 style="margin:0;color:#dc0a2d;font-size:24px;font-weight:700;letter-spacing:-0.5px;">
                                  [ KIREMON RECOVERY ]
                                </h1>
                              </td>
                            </tr>
                            <!-- Content Area -->
                            <tr>
                              <td style="padding:32px 24px;">
                                <p style="margin:0 0 16px 0;font-size:16px;font-weight:700;color:#111111;">
                                  Identify: {WebUtility.HtmlEncode(firstName)}
                                </p>
                                <p style="margin:0 0 24px 0;font-size:15px;color:#2F3437;line-height:1.6;">
                                  A security clearance override was requested for your Trainer account. If this was intentional, use the temporary token below.
                                </p>
                                <!-- Token Display Box -->
                                <div style="background:#dc0a2d;padding:16px;margin-bottom:24px;text-align:center;">
                                  <p style="margin:0;font-size:24px;font-weight:700;color:#FFFFFF;letter-spacing:4px;">
                                    {WebUtility.HtmlEncode(token)}
                                  </p>
                                </div>
                                <p style="margin:0 0 24px 0;font-size:13px;color:#787774;text-align:center;text-transform:uppercase;">
                                  -- OR --
                                </p>
                                <!-- Action Button -->
                                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                                  <tr>
                                    <td align="center">
                                      <a href="{resetLink}" style="display:inline-block;background:#dc0a2d;color:#FFFFFF;text-decoration:none;padding:12px 24px;font-weight:700;font-size:15px;border:1px solid #dc0a2d;">
                                        INITIATE PASSWORD RESET
                                      </a>
                                    </td>
                                  </tr>
                                </table>
                                <!-- Fallback Box -->
                                <div style="background:#F7F6F3;border:1px solid #EAEAEA;padding:16px;">
                                  <p style="margin:0 0 8px 0;font-size:13px;color:#787774;font-weight:700;text-transform:uppercase;">
                                    MANUAL OVERRIDE LINK:
                                  </p>
                                  <p style="margin:0;font-size:13px;color:#2F3437;word-break:break-all;">
                                    {resetLink}
                                  </p>
                                </div>
                              </td>
                            </tr>
                            <!-- Footer -->
                            <tr>
                              <td style="border-top:1px solid #EAEAEA;padding:20px 24px;">
                                <p style="margin:0 0 8px 0;font-size:12px;color:#787774;">
                                  If unrequested, ignore this message. No modifications have occurred. Token expires shortly.
                                </p>
                                <p style="margin:0;font-size:11px;color:#A0A0A0;text-transform:uppercase;">
                                  SYSTEM / KIREMON / {DateTime.UtcNow.Year}
                                </p>
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

        private string BuildExternalWelcomeTemplate(ApplicationUser user, string confirmationLink, string provider)
        {
            var firstName = string.IsNullOrWhiteSpace(user.FirstName) ? user.UserName : user.FirstName;
            return $"""
                <!DOCTYPE html>
                <html>
                  <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  </head>
                  <body style="margin:0;padding:0;background:#F7F6F3;font-family:Courier,monospace,sans-serif;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background:#F7F6F3;padding:40px 0;">
                      <tr>
                        <td align="center">
                          <table width="600" cellpadding="0" cellspacing="0" style="background:#FFFFFF;border:2px solid #dc0a2d;border-radius:4px;">
                            <!-- Header -->
                            <tr>
                              <td style="border-bottom:2px solid #dc0a2d;padding:24px;">
                                <h1 style="margin:0;color:#dc0a2d;font-size:24px;font-weight:700;letter-spacing:-0.5px;">
                                  [ KIREMON SYSTEM ]
                                </h1>
                              </td>
                            </tr>
                            <!-- Content Area -->
                            <tr>
                              <td style="padding:32px 24px;">
                                <p style="margin:0 0 16px 0;font-size:16px;font-weight:700;color:#111111;">
                                  Trainer initialization via {WebUtility.HtmlEncode(provider)}: {WebUtility.HtmlEncode(firstName)}
                                </p>
                                <p style="margin:0 0 32px 0;font-size:15px;color:#2F3437;line-height:1.6;">
                                  Welcome to Kiremon. Your account profile has been provisioned. To unlock system access, verification of your Trainer ID is required.
                                </p>
                                <!-- Action Button -->
                                <table cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                                  <tr>
                                    <td>
                                      <a href="{confirmationLink}" style="display:inline-block;background:#dc0a2d;color:#FFFFFF;text-decoration:none;padding:12px 24px;font-weight:700;font-size:15px;border:1px solid #dc0a2d;">
                                        CONFIRM TRAINER ID
                                      </a>
                                    </td>
                                  </tr>
                                </table>
                                <!-- Fallback Box -->
                                <div style="background:#F7F6F3;border:1px solid #EAEAEA;padding:16px;">
                                  <p style="margin:0 0 8px 0;font-size:13px;color:#787774;font-weight:700;text-transform:uppercase;">
                                    MANUAL OVERRIDE LINK:
                                  </p>
                                  <p style="margin:0;font-size:13px;color:#2F3437;word-break:break-all;">
                                    {confirmationLink}
                                  </p>
                                </div>
                              </td>
                            </tr>
                            <!-- Footer -->
                            <tr>
                              <td style="border-top:1px solid #EAEAEA;padding:20px 24px;">
                                <p style="margin:0 0 8px 0;font-size:12px;color:#787774;">
                                  Link expires shortly. If unrequested, purge this record.
                                </p>
                                <p style="margin:0;font-size:11px;color:#A0A0A0;text-transform:uppercase;">
                                  SYSTEM / KIREMON / {DateTime.UtcNow.Year}
                                </p>
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