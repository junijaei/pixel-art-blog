'use client';

import DecryptedText from '@/components/DecryptedText';

export function HeroTitle() {
  return (
    <h1 className="font-mulmaru mb-6 text-4xl leading-tight font-bold text-balance md:text-6xl">
      <DecryptedText
        text="Bit By Bit,"
        animateOn="view"
        sequential
        revealDirection="start"
        speed={110}
        className="text-foreground"
        encryptedClassName="text-muted-foreground/50"
      />
      <br />
      <span className="text-muted-foreground text-3xl md:text-6xl">
        <DecryptedText
          text="One bit at a time."
          animateOn="view"
          sequential
          revealDirection="start"
          speed={80}
          className="text-muted-foreground"
          encryptedClassName="text-muted-foreground/30"
        />
      </span>
    </h1>
  );
}
