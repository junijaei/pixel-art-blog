#!/usr/bin/env python3
"""
한글 웹폰트에서 쓰지 않는 글리프를 걷어낸다.

원본은 shared/assets/fonts/source/ 에 두고, 결과를 shared/assets/fonts/ 에 쓴다.
next/font/local이 참조하는 것은 결과물 쪽이다. source/ 는 번들에 포함되지 않는다.

    pip install "fonttools[woff]"
    python scripts/subset-fonts.py

한자(4,620자)와 가나(170자)를 뺀다. 코드블록에 쓰인 적이 없고, 설령 나오더라도
고립된 한 글자라 폴백돼도 단어가 깨지지 않는다.

현대 한글 음절 11,172자는 전부 남긴다. 여기서 한 글자라도 빠지면 한 단어 안에서
음절마다 서체가 갈려 눈에 띄게 깨진다. "지금 쓰는 글자만" 남기는 서브셋을 하면 안 되는 이유다.

TrueType 힌팅은 브라우저가 자체 래스터라이저를 쓰므로 버린다.
"""

import os
import sys

try:
    from fontTools.subset import Options, Subsetter
    from fontTools.ttLib import TTFont
except ImportError:
    sys.exit('fontTools가 필요합니다:  pip install "fonttools[woff]"')

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC_DIR = os.path.join(ROOT, 'shared', 'assets', 'fonts', 'source')
OUT_DIR = os.path.join(ROOT, 'shared', 'assets', 'fonts')

LATIN = set(range(0x20, 0x7F)) | set(range(0xA0, 0x180))
SYMBOLS = (
    set(range(0x2010, 0x2030))   # 따옴표, 대시, 말줄임
    | set(range(0x2190, 0x21FF))  # 화살표
    | set(range(0x2500, 0x25A0))  # 박스 드로잉 — 디렉터리 트리에 쓰인다
    | set(range(0x3000, 0x3040))  # 전각 약물
    | {0x00B7}
)
HANGUL = set(range(0xAC00, 0xD7A4))          # 현대 한글 음절 11,172자
JAMO = set(range(0x1100, 0x1200)) | set(range(0x3130, 0x3190))

TARGETS = [
    # 코드블록 본문
    ('D2Coding.woff2', LATIN | SYMBOLS | HANGUL | JAMO),
    # font-pixel 체인의 한글 폴백 (레이블, 배지). 라틴은 Silkscreen이 맡는다.
    ('Galmuri9.woff2', LATIN | SYMBOLS | HANGUL | JAMO),
]


def subset(filename, codepoints):
    src = os.path.join(SRC_DIR, filename)
    if not os.path.exists(src):
        sys.exit(f'원본이 없습니다: {src}')

    options = Options()
    options.flavor = 'woff2'
    options.hinting = False
    options.desubroutinize = False
    options.layout_features = ['*']

    font = TTFont(src)
    before_glyphs = font['maxp'].numGlyphs

    subsetter = Subsetter(options=options)
    subsetter.populate(unicodes=codepoints)
    subsetter.subset(font)

    out = os.path.join(OUT_DIR, filename)
    font.save(out)
    after_glyphs = font['maxp'].numGlyphs

    cmap = set(font.getBestCmap().keys())
    font.close()

    missing = sorted(HANGUL - cmap)
    if missing:
        sys.exit(f'{filename}: 한글 음절 {len(missing)}자가 누락됐습니다. 중단합니다.')

    src_kb = os.path.getsize(src) / 1024
    out_kb = os.path.getsize(out) / 1024
    print(
        f'{filename}  {src_kb:,.0f} KB -> {out_kb:,.0f} KB  ({out_kb / src_kb * 100:.1f}%)  '
        f'글리프 {before_glyphs:,} -> {after_glyphs:,}  한글 {len(HANGUL & cmap):,}/11,172'
    )


if __name__ == '__main__':
    os.makedirs(OUT_DIR, exist_ok=True)
    for name, codepoints in TARGETS:
        subset(name, codepoints)
