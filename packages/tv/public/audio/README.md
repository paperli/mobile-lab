# TV Audio Files

Place your sound effect files in this folder.

## Required Files

The TV app expects the following audio files:

1. **`navigation.mp3`** - Plays when moving focus between games (left/right navigation)
2. **`selection.mp3`** - Plays when pressing OK/Enter to select a game
3. **`bounce.mp3`** - Plays when trying to navigate beyond boundaries

## Supported Formats

- `.mp3` (recommended - best browser support)
- `.ogg` (alternative)
- `.wav` (larger file size, but higher quality)

## Recommendations

- **File Size**: Keep files under 100KB for fast loading
- **Duration**: 0.05s - 0.3s for UI sounds (short and snappy)
- **Sample Rate**: 44.1kHz or 48kHz
- **Bit Rate**: 128kbps - 192kbps for MP3

## Where to Find Sound Effects

Free sound effect resources:
- [freesound.org](https://freesound.org/) - Community sounds (CC licensed)
- [Zapsplat](https://www.zapsplat.com/) - Free UI sounds
- [Pixabay Sounds](https://pixabay.com/sound-effects/) - Royalty-free sounds
- [Kenney.nl](https://kenney.nl/assets/interface-sounds) - Game UI sound packs

## Testing Your Sounds

After adding your audio files:
1. Refresh the TV app (http://localhost:5173)
2. Use arrow keys to navigate (plays `navigation.mp3`)
3. Press Enter to select (plays `selection.mp3`)
4. Try navigating beyond boundaries (plays `bounce.mp3`)

## Customizing File Paths

To use different file names or formats, edit:
`packages/tv/src/utils/sounds.ts` (lines 8-12)

```typescript
private readonly soundPaths = {
  navigation: '/audio/your-custom-name.mp3',
  selection: '/audio/your-custom-name.mp3',
  bounce: '/audio/your-custom-name.mp3',
};
```
