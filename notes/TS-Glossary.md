
---

## InfoRow.tsx

### `import type { ReactNode } from 'react';`
### `import { COLOR_VARIANTS, Typography, TYPOGRAPHY_VARIANT } from '@tajawal/ct-web-design-system';`
### `import Styled from './InfoRow.styled';`

I know these are just importing some modules, but that's it. I have never seen theses before

``` tsx
export type Props = {
  icon: ReactNode;
  text: string;
  textColor?: COLOR_VARIANTS;
  stylingSettings?: {
    iconSize?: number;
    textSize?: TYPOGRAPHY_VARIANT;
    gap?: number;
  };
};
```

Just a typescript assignment for Props, not sure what this does but it has icon of type ReactNode which was imported, text is string, textcolor is optional but has type which is also imported, then stylingSettings another optional property, with innate properties also all optional and textSize has an imported type.


``` tsx
export default function InfoRow({ icon, text, textColor, stylingSettings }: Props): JSX.Element {
  const { iconSize = 16, textSize = TYPOGRAPHY_VARIANT.CAPTIONREG, gap = 8 } = stylingSettings || {};
  return (
    <Styled.Row style={{ gap }}>
      <Styled.IconWrapper style={{ width: iconSize, height: iconSize }}>{icon}</Styled.IconWrapper>
      <Typography color={textColor} component="p" variant={textSize}>
        {text}
      </Typography>
    </Styled.Row>
  );
}
```
so this is a React component which has params icon, text, textColor and stylingSettings basically the type of Props, dont know what the : JSX.Element does, never learned it and first time seeing it,
so idk what the const line does but it returns  something

---

## VehicleCard.tsx

I mean it has a lotta improrts and then followed with a typescript assignment of Props and then one giant vehicle card function, again dont understand much never learned useTranslation, dont know any of these lines but it returns the vehicle card from what i can tell unlike InfoRow idk what that even does

---

## MultiSelectFilter.tsx

again imports some stuff
has a Props ts assignment again which is pretty interesting so far every file we have noted has this Props assignment then the function following it, is this all React does, the function again does take some input and has that JSX element nonsense again but this one has a function inside it ,  upon clicking the toggle some function called onFilterChange() gets executed and then it returns stuff