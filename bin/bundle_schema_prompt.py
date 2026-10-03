#!/usr/bin/env python3

import json
import sys
from pathlib import Path


def bundle(root_path: Path) -> dict:
    directory = root_path.parent
    definitions: dict[str, dict] = {}

    def load(file_name: str) -> dict:
        return json.loads((directory / file_name).read_text())

    def rewrite(node):
        if isinstance(node, list):
            return [rewrite(item) for item in node]
        if not isinstance(node, dict):
            return node
        ref = node.get("$ref")
        if isinstance(ref, str) and not ref.startswith("#"):
            schema = load(ref)
            name = schema.get("title") or Path(ref).name.split(".")[0]
            if name not in definitions:
                definitions[name] = {}
                definitions[name] = rewrite(strip(schema))
            node = {**node, "$ref": f"#/$defs/{name}"}
        return {key: rewrite(value) if key != "$ref" else value for key, value in node.items()}

    def strip(schema: dict) -> dict:
        return {
            key: value
            for key, value in schema.items()
            if key not in ("$schema", "$id", "examples", "goJSONSchema")
        }

    root = load(root_path.name)
    local_defs = root.pop("$defs", {})
    result = rewrite({key: value for key, value in root.items() if key not in ("$id", "examples", "goJSONSchema")})
    result["$defs"] = {**{name: rewrite(value) for name, value in local_defs.items()}, **definitions}
    return result


if __name__ == "__main__":
    print(json.dumps(bundle(Path(sys.argv[1])), indent=2, ensure_ascii=False))
