# How to Set Your Tactical Logo as Favicon

## Option 1: Replace favicon.ico directly
1. Convert your tactical logo image to ICO format using an online converter like [favicon.io](https://favicon.io/) or [realfavicongenerator.net](https://realfavicongenerator.net/)
2. Replace the existing `favicon.ico` file in the `public` folder with your converted image
3. Update the HTML to use the favicon.ico file:
   ```html
   <link rel="icon" href="/favicon.ico" type="image/x-icon">
   ```

## Option 2: Use PNG format directly
1. Save your tactical logo image as `tactical-logo.png` in the `public` folder
2. Make sure the HTML references this file:
   ```html
   <link rel="icon" href="/tactical-logo.png" type="image/png">
   ```

## Clearing Browser Cache
If you've updated the favicon but still see the old one:
1. Hard refresh your browser (Ctrl+F5 or Cmd+Shift+R)
2. Or clear your browser cache completely from the browser settings
3. Try opening the site in an incognito/private window

## Testing Your Favicon
1. Run the development server with `npm run dev`
2. Open the website in your browser
3. Check if your tactical logo appears in the browser tab
