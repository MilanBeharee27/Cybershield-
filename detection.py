
from datetime import datetime, timedelta


def detect_repeated_failed_logins(events, threshold=3, window_minutes=5):
    """
    Flag source IPs with repeated failed logins within a time window.
    """

    failed_logins = {}

    # Step 1: Collect failed logins by source IP.
    for event in events:
        if event.get("event_type") != "login_failed":
            continue

        source_ip = event.get("source_ip")
        timestamp = datetime.fromisoformat(event["timestamp"])

        if not source_ip:
            continue

        failed_logins.setdefault(source_ip, []).append(timestamp)

    alerts = []
    window = timedelta(minutes=window_minutes)

    # Step 2: Check each IP for repeated failures.
    for source_ip, timestamps in failed_logins.items():
        timestamps.sort()

        for start_index, start_time in enumerate(timestamps):
            count = 0

            for timestamp in timestamps[start_index:]:
                if timestamp - start_time <= window:
                    count += 1
                else:
                    break

            # Step 3: Generate an alert when the threshold is reached.
            if count >= threshold:
                alerts.append({
                    "alert_type": "repeated_failed_logins",
                    "source_ip": source_ip,
                    "attempts": count,
                    "window_minutes": window_minutes,
                    "severity": "high",
                    "message": (
                        f"{count} failed logins from {source_ip} "
                        f"within {window_minutes} minutes"
                    )
                })

                # One alert per IP for this rule.
                break

    return alerts
