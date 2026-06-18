## Problem Statement

The user wants a fun, engaging way to practice Chinese pinyin typing. Existing typing tools are too dry — they need a game that makes typing practice addictive through chase mechanics and duels.

## Solution

A single-page web game: **追逐打字 (Chase-Type)**. A pixel-art western-themed typing game where the player chases outlaw NPCs through a desert canyon. Typing speed controls running speed. Catch the outlaw to trigger a duel — both sides type the same word, whoever finishes first lands a hit. Defeat all 5 wanted outlaws to win.

## User Stories

1. As a player, I want to see a western canyon scene with my character and an NPC running, so that I feel immersed in the chase.
2. As a player, I want typing to control my running speed, so that my typing skill directly translates to gameplay.
3. As a player, I want to stop moving when I stop typing, so that I feel the urgency to keep typing.
4. As a player, I want to see obstacles (barrels, rocks) thrown by the NPC, so that the chase feels dangerous.
5. As a player, I want typing the current word to let me both run and dodge obstacles, so that the mechanic is clean and intuitive.
6. As a player, I want to see a distance meter at the top of the screen, so that I know how close I am to catching the NPC.
7. As a player, I want mistakes to slow me down in the chase, so that accuracy matters.
8. As a player, I want failing an obstacle (typing too slow/wrong) to damage my chase HP, so that there are consequences.
9. As a player, I want the NPC to escape off the left edge if I am too slow, so that I feel the stakes.
10. As a player, I want a transition animation when I catch up (distance reaches zero), so that the shift to duel feels dramatic.
11. As a player, I want to enter a duel phase where both me and the NPC compete on the same word, so that the competition is direct and fair.
12. As a player, I want to see two progress bars racing side by side during the duel, so that I can see who is winning in real time.
13. As a player, I want the NPC`s progress bar to fill at its preset WPM, so that I feel the pressure to type faster.
14. As a player, I want to deal damage when my progress bar fills first, so that my typing skill is rewarded.
15. As a player, I want to take damage if the NPC`s bar fills first, so that the duel has real stakes.
16. As a player, I want separate HP bars for chase and duel phases, so that each phase has independent tension.
17. As a player, I want full HP recovery after defeating an NPC, so that each outlaw is a fresh challenge.
18. As a player, I want to see a wanted poster after defeating an NPC, showing the next outlaw`s name, crime, speed, WPM, and HP, so that I feel a sense of progression.
19. As a player, I want 5 unique outlaws with increasing difficulty (faster run speed, higher WPM, more HP), so that the game stays challenging.
20. As a player, I want to retry from the current NPC when I lose, so that I don`t have to replay earlier outlaws.
21. As a player, I want a bottom input bar where I type pinyin, so that the typing interface is familiar and simple.
22. As a player, I want typing without tone marks (e.g., "ni hao"), so that the barrier to entry is low.
23. As a player, I want pixel-art visuals and a western desert canyon background, so that the game has a cohesive aesthetic.

## Implementation Decisions

- **Architecture**: Single-page web app. HTML/CSS for UI (input bar, HP bars, distance meter, wanted poster). Canvas for game scene (characters, background, obstacles, duel progress bars).
- **Game state machine**: Chase → Duel → WantedPoster → Chase (next NPC). Transitions triggered by distance=0 (chase→duel), NPC HP=0 (duel→wanted poster), button click (wanted poster→next chase).
- **Chase mechanic**: Player speed is proportional to typing continuity. Correct words maintain/accelerate; mistakes decelerate. No typing = stop.
- **Obstacle mechanic**: NPC periodically throws obstacles. The current typing word doubles as the dodge word — typing it correctly both advances the player and dodges the obstacle. Fail = chase HP damage.
- **Duel mechanic**: Same word for both sides. Two progress bars, one per combatant. NPC bar auto-fills at its WPM. Player bar fills as they type. First to fill deals damage. Repeat until one HP reaches zero.
- **NPC data**: 5 NPCs defined in a data array with { name, crime, runSpeed, wpm, chaseHP, duelHP }. Each subsequent NPC increases all three difficulty stats.
- **Word bank**: Chinese pinyin words (no tone marks). Stored as a flat array, randomly sampled for each prompt.
- **Canvas rendering**: Game loop at 60fps. Separate draw calls for background (parallax desert canyon), characters (pixel sprites), and effects.
- **No persistence**: No high scores, no save/load. Stateless between sessions.
- **No audio**: Visual-only MVP.

## Testing Decisions

- **Test seam**: The game state machine is the highest-value test seam. Given an input word and current game state, verify the correct state transition, HP change, and distance change.
- **Chase phase tests**: Verify speed increases on correct input, decreases on mistake, position updates correctly, obstacle damage applied on failure.
- **Duel phase tests**: Verify progress bar fills correctly for player input and NPC auto-tick, damage applied to correct combatant.
- **NPC config tests**: Verify data integrity — all 5 NPCs have valid, increasing stats.
- **What makes a good test**: Only test observable game state (HP, distance, phase, progress), never implementation details like internal timestamps or render coordinates.

## Out of Scope

- Sound effects or music
- High scores, leaderboards, or save/load
- Multiplayer or online features
- Mobile/touch support (desktop keyboard only)
- Customizable word banks or difficulty settings beyond the 5 built-in NPCs
- Character customization or skins
- Tutorial or onboarding (the game is self-explanatory: type to run)

## Further Notes

- All 5 NPC outlaws should have distinct western-themed names and crimes to give them personality.
- The wanted poster transition is a key "feel good" moment — invest in its visual design.
- Pixel art assets can be simple (16x16 or 32x32 sprites) — the gameplay loop, not the art, is the core value.
