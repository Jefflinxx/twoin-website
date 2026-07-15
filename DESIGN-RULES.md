# TWOIN V2 Design Direction

## Direction

V2 is a white, minimal, editorial digital-studio site. The reference is used for
its restraint, strong typography, generous pacing, and work-first hierarchy. It
must not copy another studio's identity, copywriting, assets, or exact layout.

The page should feel calm and exact. Real project images provide the visual color;
typography provides hierarchy; spacing and thin rules provide rhythm. Every
section must answer one question and point to one useful next step.

## Reverse rules

- Do not use cream, beige, or tinted backgrounds as the dominant page canvas.
- Do not use more than one interface accent color.
- Do not put every section or paragraph inside a card.
- Do not use decorative shadows, gradients, bokeh, floating shapes, or fake depth.
- Do not add icons when numbering, typography, or a divider already explains structure.
- Do not make every heading equally loud; each viewport needs one dominant message.
- Do not place the full service catalogue in the hero.
- Do not crop project images so tightly that the actual interface is unreadable.
- Do not use project images as vague decoration; each image needs a project label.
- Do not animate every element or use motion without information value.
- Do not hide essential content until an animation completes.
- Do not pin long sections on mobile or trap the user's main page scroll.
- Do not ignore `prefers-reduced-motion`.
- Do not make navigation dependent on hover.
- Do not copy Gusta's brand, text, imagery, or section composition one-to-one.

## Motion phases

Phase 1 uses a short opacity and vertical reveal plus restrained image hover scale.
Phase 2 may use GSAP for a hero sequence, selected-work stagger, process progress,
and subtle media parallax after the static hierarchy has been approved.

All Phase 2 animation must remain interruptible, use transforms and opacity, and
be disabled or simplified for reduced-motion and narrow screens.
