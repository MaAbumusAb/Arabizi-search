import json
from pathlib import Path

data = json.loads(Path("data/arabizi_dataset.json").read_text(encoding="utf-8"))
assert len(data) >= 100
assert all({"id","arabic","romanized","arabizi","english","verification_status"} <= set(x) for x in data)
assert len({x["id"] for x in data}) == len(data)
print(f"Dataset sanity check passed: {len(data)} entries")
