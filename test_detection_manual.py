
import json
from pathlib import Path

from detection import detect_repeated_failed_logins


data_file = Path(__file__).resolve().parent / "data" / "sample_events.json"

with data_file.open("r", encoding="utf-8") as file:
    events = json.load(file)

alerts = detect_repeated_failed_logins(events)

print("Alerts detected:", len(alerts))

for alert in alerts:
    print(alert)
