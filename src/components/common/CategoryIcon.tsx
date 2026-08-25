/**
 * Renders a category's actual uploaded image if it has one, falling back to
 * a generic icon only when no image was ever uploaded for that category.
 *
 * Previously, category tiles used a hardcoded emoji lookup keyed by slug
 * (e.g. `{ laptops: '💻', smartphones: '📱', ... }`). Any category that
 * wasn't in that fixed list — including every category an admin adds —
 * fell through to a generic box icon no matter what image was uploaded for
 * it, because the lookup never looked at `category.image` at all.
 */
export default function CategoryIcon({
  category,
  size = 32,
}: {
  category: { name: string; image?: { url?: string } }
  size?: number
}) {
  if (category.image?.url) {
    return (
      <img
        src={category.image.url}
        alt={category.name}
        style={{
          width: size, height: size, objectFit: 'cover',
          borderRadius: 'var(--radius-sm)', flexShrink: 0,
        }}
      />
    )
  }
  return <span style={{ fontSize: size * 0.85, lineHeight: 1 }}>📦</span>
}
