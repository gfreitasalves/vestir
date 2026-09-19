#!/usr/bin/env python3
"""One-off generator for placeholder 'funko/chibi' style SVG art (T007).
Run once during initial implementation; the produced .svg files under
src/assets/ are the actual committed content, this script is not part
of the app build.
"""
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AVATAR_DIR = os.path.join(ROOT, "src", "assets", "avatar")
CLOTHING_DIR = os.path.join(ROOT, "src", "assets", "clothing")
os.makedirs(AVATAR_DIR, exist_ok=True)
os.makedirs(CLOTHING_DIR, exist_ok=True)

VIEWBOX = "0 0 200 320"


def svg(body: str, viewbox: str = VIEWBOX) -> str:
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{viewbox}" '
        f'role="img">\n{body}\n</svg>\n'
    )


def write(path: str, content: str) -> None:
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)


# ---------------------------------------------------------------------------
# Base body per skin tone: funko/chibi proportions (big round head, small
# rounded body), plus a neutral base undergarment so the avatar is never
# shown "unclothed" beyond a plain, non-explicit base layer.
# ---------------------------------------------------------------------------
SKIN_TONES = [
    ("skin-01", "Tom de pele claro", "#F6D2B5"),
    ("skin-02", "Tom de pele médio", "#C68642"),
    ("skin-03", "Tom de pele escuro", "#7A4B28"),
]

for item_id, label, color in SKIN_TONES:
    body = f"""
  <!-- {label} -->
  <ellipse cx="100" cy="300" rx="40" ry="8" fill="#000" opacity="0.08" />
  <rect x="72" y="205" width="22" height="90" rx="10" fill="{color}" />
  <rect x="106" y="205" width="22" height="90" rx="10" fill="{color}" />
  <rect x="65" y="120" width="70" height="95" rx="28" fill="{color}" />
  <circle cx="100" cy="70" r="55" fill="{color}" />
  <rect x="68" y="130" width="64" height="45" rx="14" fill="#eceff1" />
  <rect x="76" y="205" width="48" height="32" rx="10" fill="#dfe3e6" />
  <circle cx="80" cy="65" r="6" fill="#3a2c22" />
  <circle cx="120" cy="65" r="6" fill="#3a2c22" />
  <path d="M85 92 Q100 102 115 92" stroke="#3a2c22" stroke-width="3" fill="none" stroke-linecap="round" />
""".strip("\n")
    write(os.path.join(AVATAR_DIR, f"{item_id}.svg"), svg(body))

# ---------------------------------------------------------------------------
# Hair styles: drawn over the head area only (transparent elsewhere).
# ---------------------------------------------------------------------------
HAIR_STYLES = [
    (
        "hair-bob-black",
        "Cabelo bob preto",
        """
  <path d="M40 70 Q40 10 100 10 Q160 10 160 70 L160 110 Q145 95 140 70
           Q130 100 100 100 Q70 100 60 70 Q55 95 40 110 Z" fill="#1b1b1b" />
""".strip("\n"),
    ),
    (
        "hair-curly-brown",
        "Cabelo cacheado castanho",
        """
  <circle cx="55" cy="45" r="18" fill="#5b3a1e" />
  <circle cx="80" cy="25" r="20" fill="#5b3a1e" />
  <circle cx="110" cy="22" r="20" fill="#5b3a1e" />
  <circle cx="140" cy="30" r="19" fill="#5b3a1e" />
  <circle cx="155" cy="55" r="18" fill="#5b3a1e" />
  <circle cx="100" cy="35" r="30" fill="#5b3a1e" />
""".strip("\n"),
    ),
    (
        "hair-long-red",
        "Cabelo longo ruivo",
        """
  <path d="M42 68 Q40 10 100 8 Q160 10 158 68 L165 150 Q150 160 148 130
           L142 70 Q130 98 100 98 Q70 98 58 70 L52 130 Q50 160 35 150 Z"
        fill="#B33A22" />
""".strip("\n"),
    ),
]

for item_id, label, shape in HAIR_STYLES:
    write(os.path.join(AVATAR_DIR, f"{item_id}.svg"), svg(f"  <!-- {label} -->\n{shape}"))

# ---------------------------------------------------------------------------
# Clothing items per category, 3 color variants each.
# ---------------------------------------------------------------------------
CATEGORY_VARIANTS = {
    "dress": [
        ("dress-floral-01", "Vestido floral rosa", "#E88BA6"),
        ("dress-solid-blue-01", "Vestido azul liso", "#4E7FBF"),
        ("dress-sunny-01", "Vestido amarelo sol", "#F2C94C"),
    ],
    "top": [
        ("top-striped-01", "Blusa listrada azul", "#3D8BBF"),
        ("top-solid-red-01", "Blusa vermelha lisa", "#D1495B"),
        ("top-green-01", "Blusa verde", "#4FA97C"),
    ],
    "pants": [
        ("pants-denim-01", "Calça jeans", "#3B5A8A"),
        ("pants-black-01", "Calça preta", "#2B2B2B"),
        ("pants-beige-01", "Calça bege", "#C9B08A"),
    ],
    "shorts": [
        ("shorts-denim-01", "Short jeans", "#4C6FA5"),
        ("shorts-pink-01", "Short rosa", "#E37FA0"),
        ("shorts-khaki-01", "Short cáqui", "#A99361"),
    ],
    "shoes": [
        ("shoes-sneaker-01", "Tênis branco", "#F2F2F2"),
        ("shoes-sneaker-pink-01", "Tênis rosa", "#E8749A"),
        ("shoes-boots-01", "Bota marrom", "#6B4226"),
    ],
    "accessory": [
        ("accessory-hat-01", "Chapéu vermelho", "#C0392B"),
        ("accessory-glasses-01", "Óculos de sol", "#222222"),
        ("accessory-bow-01", "Laço rosa", "#E85D9C"),
    ],
}


def dress_shape(color: str) -> str:
    return f"""
  <path d="M70 120 Q100 108 130 120 L140 225 Q100 240 60 225 Z" fill="{color}" />
""".strip(
        "\n"
    )


def top_shape(color: str) -> str:
    return f"""
  <rect x="66" y="122" width="68" height="58" rx="16" fill="{color}" />
""".strip(
        "\n"
    )


def pants_shape(color: str) -> str:
    return f"""
  <rect x="72" y="205" width="22" height="90" rx="10" fill="{color}" />
  <rect x="106" y="205" width="22" height="90" rx="10" fill="{color}" />
""".strip(
        "\n"
    )


def shorts_shape(color: str) -> str:
    return f"""
  <rect x="72" y="205" width="22" height="45" rx="10" fill="{color}" />
  <rect x="106" y="205" width="22" height="45" rx="10" fill="{color}" />
""".strip(
        "\n"
    )


def shoes_shape(color: str) -> str:
    return f"""
  <ellipse cx="83" cy="298" rx="16" ry="10" fill="{color}" />
  <ellipse cx="117" cy="298" rx="16" ry="10" fill="{color}" />
""".strip(
        "\n"
    )


def accessory_shape(item_id: str, color: str) -> str:
    if "hat" in item_id:
        return f"""
  <ellipse cx="100" cy="28" rx="46" ry="10" fill="{color}" />
  <path d="M70 28 Q100 -10 130 28 Z" fill="{color}" />
""".strip(
            "\n"
        )
    if "glasses" in item_id:
        return f"""
  <circle cx="80" cy="65" r="12" fill="none" stroke="{color}" stroke-width="4" />
  <circle cx="120" cy="65" r="12" fill="none" stroke="{color}" stroke-width="4" />
  <line x1="92" y1="65" x2="108" y2="65" stroke="{color}" stroke-width="4" />
""".strip(
            "\n"
        )
    return f"""
  <path d="M90 118 L100 128 L110 118 L118 130 L100 140 L82 130 Z" fill="{color}" />
""".strip(
        "\n"
    )


SHAPE_BUILDERS = {
    "dress": dress_shape,
    "top": top_shape,
    "pants": pants_shape,
    "shorts": shorts_shape,
    "shoes": shoes_shape,
}

for category_id, variants in CATEGORY_VARIANTS.items():
    for item_id, label, color in variants:
        if category_id == "accessory":
            shape = accessory_shape(item_id, color)
        else:
            shape = SHAPE_BUILDERS[category_id](color)
        write(os.path.join(CLOTHING_DIR, f"{item_id}.svg"), svg(f"  <!-- {label} -->\n{shape}"))

print("Generated placeholder art in src/assets/avatar and src/assets/clothing")
