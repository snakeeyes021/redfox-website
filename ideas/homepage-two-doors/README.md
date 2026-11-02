# Idea: the homepage as two doors

A homepage layout we mocked up but didn't use (November 2026). We went with a Games card at the
end of the project list instead. This one is kept for later.

Under "Things we've made", the homepage shows two big cards side by side instead of the project
list:

- **Games**: the games as a fanned hand of tilted postcards (a screenshot, or a placeholder for a
  game that isn't out yet) that spread apart on hover. It links to `/games/`.
- **Software**: each project's watercolor plate, shrunk to a small icon with a one-line
  description. They wobble one after another on hover. The full list would move to its own page
  (`/projects/`). In this mock the card just links to the homepage's list.

Pieces that could be reused elsewhere: the postcard fan, the mini plates, the gentler
`#bleed-sm` filter for small watercolor blots, and the card that lifts on hover.

## Seeing it

This lives on the `ideas/homepage-two-doors` branch, which isn't merged, so it's never on the live
site. To look at it:

```sh
git switch ideas/homepage-two-doors
python3 -m http.server 8080
# then open http://localhost:8080/ideas/homepage-two-doors/
```

`index.html` is a copy of the homepage with the project list replaced. `doors.css` holds the
styles for this idea only.
