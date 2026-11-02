# Lords of Sola: the web build goes here

This folder is the game's home on the site: **https://redfoxlabs.tech/games/lords-of-sola/**.
The game's `WEB_PAGE` constant (in `game.jo`) already points here, so desktop builds' invite
links open this address.

It's empty on purpose. The game isn't published until it has been play-tested and we're happy to
make it public. Until then the Games page only shows a "coming soon" card.

## Publishing it

1. Build the web page in the game's repo. It's one self-contained HTML file:

   ```sh
   sloppy build game.jo --target wasm -o index.html
   ```

2. Copy that file here as `games/lords-of-sola/index.html`. Nothing else is needed: no build
   step, no other files. The page works from any static address, and its invite links use the
   page's own address.

3. Update the Lords of Sola card in `games/index.html`:
   - change the `kind` line from "Coming soon" to "Play in your browser",
   - replace the `note` paragraph with a play button, as the Sky Barons card has:

     ```html
     <div class="get">
       <a class="btn" href="lords-of-sola/">Play Lords of Sola</a>
     </div>
     ```

   - optionally swap the ☼ glyph plate for a screenshot or icon, as Sky Barons does.

4. Commit on a branch and open a pull request into `main`. The site publishes from `main`.

To update the game later, rebuild and replace `index.html`.
