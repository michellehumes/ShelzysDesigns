"""
Notification Module

Handles sending notifications via Slack and email for automation events.
"""

import os
import json
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Any, Dict, List, Optional
from datetime import datetime

import requests

from .logger import LoggerMixin


class NotificationManager(LoggerMixin):
    """
    Manages notifications for automation events.

    Supports Slack webhooks and email notifications.
    """

    def __init__(
        self,
        slack_webhook_url: Optional[str] = None,
        smtp_host: Optional[str] = None,
        smtp_port: Optional[int] = None,
        smtp_user: Optional[str] = None,
        smtp_password: Optional[str] = None,
        email_recipients: Optional[List[str]] = None,
    ):
        """
        Initialize the notification manager.

        Args:
            slack_webhook_url: Slack incoming webhook URL
            smtp_host: SMTP server host
            smtp_port: SMTP server port
            smtp_user: SMTP username
            smtp_password: SMTP password
            email_recipients: List of email recipients
        """
        self.slack_webhook_url = slack_webhook_url or os.getenv("SLACK_WEBHOOK_URL")
        self.smtp_host = smtp_host or os.getenv("SMTP_HOST")
        self.smtp_port = smtp_port or int(os.getenv("SMTP_PORT", "587"))
        self.smtp_user = smtp_user or os.getenv("SMTP_USER")
        self.smtp_password = smtp_password or os.getenv("SMTP_PASSWORD")

        recipients_env = os.getenv("NOTIFICATION_EMAILS", "")
        self.email_recipients = email_recipients or [
            r.strip() for r in recipients_env.split(",") if r.strip()
        ]

        self._enabled = bool(self.slack_webhook_url or self.email_recipients)

    @property
    def is_enabled(self) -> bool:
        """Check if any notification method is configured."""
        return self._enabled

    def send_slack(
        self,
        message: str,
        title: Optional[str] = None,
        color: str = "good",
        fields: Optional[List[Dict[str, str]]] = None,
    ) -> bool:
        """
        Send a Slack notification.

        Args:
            message: Main message text
            title: Optional title/header
            color: Attachment color (good=green, warning=yellow, danger=red)
            fields: Optional list of field dicts with title and value

        Returns:
            True if sent successfully
        """
        if not self.slack_webhook_url:
            self.logger.debug("Slack webhook not configured, skipping")
            return False

        try:
            attachment = {
                "color": color,
                "text": message,
                "footer": "Shelzy's Designs Automation",
                "ts": int(datetime.utcnow().timestamp()),
            }

            if title:
                attachment["title"] = title

            if fields:
                attachment["fields"] = [
                    {"title": f["title"], "value": f["value"], "short": True}
                    for f in fields
                ]

            payload = {"attachments": [attachment]}

            response = requests.post(
                self.slack_webhook_url,
                json=payload,
                timeout=10,
            )
            response.raise_for_status()

            self.logger.info("Slack notification sent successfully")
            return True

        except Exception as e:
            self.logger.error(f"Failed to send Slack notification: {e}")
            return False

    def send_email(
        self,
        subject: str,
        body: str,
        html_body: Optional[str] = None,
    ) -> bool:
        """
        Send an email notification.

        Args:
            subject: Email subject
            body: Plain text body
            html_body: Optional HTML body

        Returns:
            True if sent successfully
        """
        if not all([self.smtp_host, self.smtp_user, self.email_recipients]):
            self.logger.debug("Email not configured, skipping")
            return False

        try:
            msg = MIMEMultipart("alternative")
            msg["Subject"] = f"[Shelzy's Automation] {subject}"
            msg["From"] = self.smtp_user
            msg["To"] = ", ".join(self.email_recipients)

            msg.attach(MIMEText(body, "plain"))
            if html_body:
                msg.attach(MIMEText(html_body, "html"))

            with smtplib.SMTP(self.smtp_host, self.smtp_port) as server:
                server.starttls()
                server.login(self.smtp_user, self.smtp_password)
                server.send_message(msg)

            self.logger.info(f"Email sent to {len(self.email_recipients)} recipients")
            return True

        except Exception as e:
            self.logger.error(f"Failed to send email: {e}")
            return False

    def notify(
        self,
        event_type: str,
        summary: str,
        details: Optional[Dict[str, Any]] = None,
        severity: str = "info",
    ) -> bool:
        """
        Send notification via all configured channels.

        Args:
            event_type: Type of event (bid_optimization, review_requests, etc.)
            summary: Brief summary of the event
            details: Additional details as dict
            severity: info, warning, or error

        Returns:
            True if at least one notification was sent
        """
        color_map = {
            "info": "good",
            "warning": "warning",
            "error": "danger",
        }

        # Format details as fields for Slack
        fields = []
        if details:
            for key, value in details.items():
                fields.append({
                    "title": key.replace("_", " ").title(),
                    "value": str(value),
                })

        # Send Slack
        slack_sent = self.send_slack(
            message=summary,
            title=f"Amazon Automation: {event_type.replace('_', ' ').title()}",
            color=color_map.get(severity, "good"),
            fields=fields,
        )

        # Format email body
        email_body = f"{summary}\n\n"
        if details:
            email_body += "Details:\n"
            for key, value in details.items():
                email_body += f"  - {key.replace('_', ' ').title()}: {value}\n"
        email_body += f"\nGenerated: {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S UTC')}"

        # Send email
        email_sent = self.send_email(
            subject=f"{event_type.replace('_', ' ').title()} - {summary[:50]}",
            body=email_body,
        )

        return slack_sent or email_sent

    # Convenience methods for common events

    def notify_bid_optimization(self, results: Dict[str, Any]):
        """Send notification for bid optimization results."""
        if results.get("errors"):
            severity = "error"
            summary = f"Bid optimization completed with errors"
        elif results.get("bid_increases") or results.get("bid_decreases"):
            severity = "info"
            summary = f"Bid optimization completed successfully"
        else:
            return  # No changes, no notification

        self.notify(
            event_type="bid_optimization",
            summary=summary,
            details={
                "bid_increases": len(results.get("bid_increases", [])),
                "bid_decreases": len(results.get("bid_decreases", [])),
                "paused_keywords": len(results.get("paused_keywords", [])),
                "new_negatives": len(results.get("new_negatives", [])),
            },
            severity=severity,
        )

    def notify_review_requests(self, results: Dict[str, Any]):
        """Send notification for review request results."""
        if results.get("error"):
            severity = "error"
            summary = f"Review requests failed: {results['error']}"
        elif results.get("failed"):
            severity = "warning"
            summary = f"Review requests completed with some failures"
        else:
            summary = f"Review requests completed successfully"
            severity = "info"

        self.notify(
            event_type="review_requests",
            summary=summary,
            details={
                "eligible_orders": results.get("eligible_orders", 0),
                "requests_sent": results.get("requests_sent", 0),
                "successful": len(results.get("successful", [])),
                "failed": len(results.get("failed", [])),
            },
            severity=severity,
        )

    def notify_listing_sync(self, results: Dict[str, Any]):
        """Send notification for listing sync results."""
        if results.get("failed"):
            severity = "error"
            summary = f"Listing sync completed with failures"
        else:
            summary = f"Listing sync completed successfully"
            severity = "info"

        self.notify(
            event_type="listing_sync",
            summary=summary,
            details={
                "total": results.get("total", 0),
                "successful": len(results.get("successful", [])),
                "failed": len(results.get("failed", [])),
            },
            severity=severity,
        )

    def notify_campaign_deployment(self, results: Dict[str, Any]):
        """Send notification for campaign deployment results."""
        if results.get("failed"):
            severity = "error"
            summary = f"Campaign deployment completed with failures"
        else:
            summary = f"Campaign deployment completed successfully"
            severity = "info"

        self.notify(
            event_type="campaign_deployment",
            summary=summary,
            details={
                "total": results.get("total", 0),
                "successful": len(results.get("successful", [])),
                "failed": len(results.get("failed", [])),
            },
            severity=severity,
        )


# Global instance for easy access
_notification_manager: Optional[NotificationManager] = None


def get_notification_manager() -> NotificationManager:
    """Get or create the global notification manager."""
    global _notification_manager
    if _notification_manager is None:
        _notification_manager = NotificationManager()
    return _notification_manager


def notify(event_type: str, summary: str, **kwargs):
    """Convenience function for sending notifications."""
    return get_notification_manager().notify(event_type, summary, **kwargs)
