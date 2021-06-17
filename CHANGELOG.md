# Changelog

## [Known Issues]
> Some issues related to the upgrade to Active Effects can be resolved/mitigated by **Saving your Condition Lab** after updating to a CUB version greater than 1.3.0. Please try this before reporting an issue!

1. Loading a world with an existing Condition Lab mapping from pre CUB v1.3.0 may cause any Conditions added to a token to default to the first mapped condition. WORKAROUND: After loading your world, go into the Condition Lab and click Save.
2. Enhanced Conditions chat output for linked Tokens and Actors is not aggregated, so you may see multiple messages when many conditions are added/removed from an Actor/Token.
3. Overlay Effects added to a token will trigger the matching non-Overlay Condition to output to chat. The reverse is also true.
4. **PF2e users**: Enhanced Conditions `Output to Chat` setting will cause duplicate chat messages due to similar function built into the system.
5. Chat log may not re-render when Hide Names settings are changed. This may cause the old name to still show in the log for players. Advise players to reload Foundry if you change these settings mid-session.
6. *️⃣The Default/Inferred Condition Lab Mappings for game systems may not correctly import all data. Importing the map from the CUB Condition Maps folder imports correctly.

## [1.6.0] - 2021-06-15
### Enhanced Conditions
- `Active Effects Config` can be opened from the **Condition Lab** again!
- Changes made in the `Active Effects Config` are shown without closing and reopening the form, and are saved to the attached Condition on Submit.
- `Active Effects` attached to Conditions can now be Exported and Imported in the Condition Lab
- **Condition Lab** `reference` entries for Conditions are now a text-input (Id) field linking to any entity in your Foundry instance (eg. Actor, Item, JournalEntry, Compendium JournalEntry etc). The field is in the format of `@EntityType[entityId]{DisplayName}` This field now accepts drag-drop similar to dropping an entity into a Journal Entry (or other enriched text entry). If the dropped Id resolves correctly, a link to the entity will show up next to the Id. You can also put good ol' plain text in this field if you want.
> Note: the reference entry's `DisplayName` or text will override the Condition Name.
- The drag handles in the **Condition Lab** have been removed in favour of simpler up/down arrows ("chevrons" if we're being pedantic). A future update may add drag handles or more advanced order-sorting to the Lab
- Added support for the `Ironclaw 2e` system. Thanks to @hertzila! 🎉
- Conditions are no longer output to chat if the `Output to Chat` setting is disabled in **CUBputer**. Additionally, When this setting is disabled the related checkboxes in the **Condition Lab** cannot be changed.
### Triggler
- When **Triggler** executes a macro it now passes the triggering token/actor to the macro for downstream usage.
- Fixed logic in **Triggler** related to checking the ownership of the triggering actor/token.
### Temporary Combatants
- **Temporary Combatants** now work with Foundry VTT v0.8.x
### Hide Names
- **Hide Names** Actor button no longer disappears (🐱‍👤 ninja-style) after saving the form.

### Translations
- Updated `한국어` (Korean) translation (thanks @drdwing! 🎉)
- Replaced `Castellano` (`es-ES`) translation with `Español` (`es`) (thanks @wallacemcgregor! 🎉)

## [1.5.0] - 2021-05-31
> Note: due to the large-scale changes introduced in [Foundry VTT v0.8.6](https://foundryvtt.com/releases/0.8.6) you may experience some 🐛bugs with this release. Please install the [Bug Reporter](https://foundryvtt.com/packages/bug-reporter) module to report issues, or file them on Github directly*
- Added compatibility for Foundry VTT v0.8.6
- **Award XP** now features a swish 🌟 new interface for selecting exactly which player and non-player characters are awarded/grant XP. Thanks to @wibble199 for this awesome addition! 🎉
- Improved the robustness 💪 of some of the logic throughout the module
- **CUBputer** gadget selector now extends to the title of the gadget, making it more intuitive for new users
- Slightly improved the alignment of condition rows in **Enhanced Conditions** chat output. Also a border appeared around them somehow...? Let's just go with it!
- 한국어 (Korean) translation updated! Thanks @drdwing! 🎉
- 中文 (Chinese) translation updated! Thanks @fuyuennju 🎉

## [1.4.0] - 2021-02-07
### Added
- Triggler now includes an **Advanced Trigger** type and associated fields that allow you to manually enter the path to the Actor/Token properties you want to listen for in your trigger. This provides compatibility for game systems not previously supported by Triggler, as well as allowing for listening for changes to properties that were not previously exposed in the dropdown menus.
*Note: This functionality will require some knowledge of the data model for your game system. Please check in the game system documentation or contact game system developers before contacting Death Save Development for assistance.*

### Changed
- Triggler form no longer closes when you click Save
- Triggler Cancel button replaced with a Reset button that resets the form back to its saved values
- Hide Names button on Actor sheets has been moved to the title bar (aka window header) 
- Updated Japanese translation (thanks @brothersharper !)

### Fixed
- Triggler is now compatible with all game systems via the **Advanced Trigger** functionality (see above)
- Triggler now provides access to all Token/Actor properties (see **Advanced Trigger** functionality above)
- Brazilian (pt-BR) translation now points to the correct folder
- Hide Names icon no longer shows on Actor sheet when gadget is disabled
- Combat Tracker no longer has an error related to non-existent tokens. (Thanks @awerries !)
- Dragging to highlight text in Condition Lab no longer also selects items on the canvas underneath (eg. tokens) (Thanks @Rawrly85 !)
- Beginning an Encounter with no Combatants no longer causes an error (Thanks @xdy !)
- Active Effect: Durations and flags are now saved as part of the Condition (Thanks @wmudge !)

## [1.3.8] - 2020-12-08
### Added
- Deutsch (German) translation thanks to Acd-Jake#9087 on discord!
- You can now reach the `About Combat Utility Belt` app from the Module Settings menu as well from the CUBputer

### Changed
- Some minor changes to the formatting and structure of the `About Combat Utility Belt` app

### Fixed
- Concentrator no longers duplicates output
- Concentrator respects the `Notify Double Concentration` setting when it is set to `None`
- Castellano (Spanish) translation now points to the correct file

## [1.3.7] - 2020-12-02
### Added
- 中文 (Chinese) translation (thanks @hmqgg !)
- There is now a (translation-enabled) tooltip on the Hide Names icon on the actor sheet

### Changed
- You can now configure exceptions for Hide Names even if that disposition type is not hidden by default. For example if you choose not to hide `Friendly` names by default, you can now selectively hide an Actor's name from the Hide Names config for that actor

### Fixed
- Hide Names now uses the token disposition from the token instead of the prototype token of the Actor. This resolves situations where you have a `Friendly` goblin, but by default goblins are `Hostile`
- Hide Names now processes names with multiple consecutive spaces correctly (eg. `Ancient  Black Dragon`)
- Hide Names mask icon was being pushed into the next row by vtta-dndbeyond
- Active Conditions are now output during combat when setting enabled
- Concentrator no longer adds two Concentrating conditions to actors that have multiple tokens on the scene
- Refined some logic in Concentrator, which should result in less errors

## [1.3.6] - 2020-11-15
### Changed
- `addCondition` duplicate behaviour has been adjusted to behave more intuitively: when adding a condition with no additional parameters, duplicate conditions will **not** be created. Duplicates can be allowed using the `allowDuplicates` parameter, which now defaults to `false` (previously was `true`). `replaceExisting` parameter usage remains the same.
- Updated 한국어 (Korean) translation (thanks @drdwing aka KLO#1490)

### Fixed
- Condition Lab was erasing all Active Effects from Conditions on Save due to a typographical error.
- Triggler was adding duplicate conditions due the previous changes to the `addCondition` API method. The changes in this release fix the issue.

## [1.3.5] - 2020-11-14
### Added
- The Condition Lab now shows a reminder to Save when the current Mapping differs from the saved one. This feature is not fully complete, so you may not receive a reminder on every edit, but actions like changing the Mapping Type or Adding a Row will trigger the reminder.

### Changed
- You can no longer open the Active Effect config for a Condition Lab row until you save the Condition Lab mapping. This prevents issues related to the Condition not existing in the mapping when you try to save the Active Effect

### Fixed
- You can now edit Active Effects on all rows in the Condition Lab
- Clicking the Active Effect button after moving a Condition in the Condition Lab now opens the Active Effect configuration for the correct Condition

## [1.3.4] - 2020-11-14
### Added
- Added a reminder to save the Condition Lab for worlds where Enhanced Conditions is enabled to possibly prevent issues

### Changed
- `addCondition` API method now includes additional options `keepDuplicates` (default: `true`) and `replaceExisting` (default: `false`) which allow you to specify how to deal with existing duplicate Condition Effects already active on the target actor when adding Condition Effects. For example if an Actor is already *Blinded* and you add the *Blinded* Condition again you can now specify to replace the existing Condition like so: `game.cub.addCondition("Blinded", {replaceExisting: true})`
- Roll Hostile Token HP now uses the Actor's name as the Chat Message speaker, which allows Hide Names to work on the message

### Fixed
- Fixed Condition Lab not opening in worlds where the game system was unknown to CUB
- Reroll Initiative no longer rerolls when combat is first started (ie. by clicking Begin Combat)
- Inspiration icon dimensions are now correctly set for use in Foundry
- Condition Lab - Condition Name placeholder text now says `Condition Name` instead of `Icon Path`

### Removed
- Misc Actor - Roll Initiative from Sheet has been removed in favour of the same functionality now built-into Foundry

## [1.3.3] - 2020-10-28
### Changed
- Updated 한국어 (Korean) translation (thanks @drdwing aka KLO)

### Fixed
- Duplicated Conditions being created on Actors/Tokens in some circumstances related to existing (ie. pre-CUB-v1.3.0) Condition Lab mappings. The workaround in Known Issue 2 may prevent this behaviour. 
- - *Note: it may be necessary to delete and recreate a token to fully resolve this issue, or alternately create and run a script macro: `game.cub.removeAllConditions()` with the affected token selected, then toggle off any remaining Status Effects in the Token HUD*
- Concentrator no longer ignores the `Enable Concentrator` setting
- Players no longer trigger Concentrator for every spell cast
- `hasCondition` API method should behave more reliably

## [1.3.2] - 2020-10-26
### Changed
- Updated Português (Brasil) translation (thanks @rinnocenti!)

### Fixed
- Token disposition is now correctly detected for unlinked Tokens
- Overlay Active Effects added to Tokens are correctly detected

## [1.3.1-hotfix] - 2020-10-24
### Fixed
- Enhanced Condition ids will no longer default to `undefined` prior to saving the Condition Lab. This should resolve known issue 1, however if not, please try the provided workaround.

## [1.3.1] - 2020-10-24
### Changed
- Some API methods have changed again. These are in a state of flux right now, so please monitor the API docs under the `EnhancedConditions` class.

### Fixed
- Enhanced Conditions correctly adds Conditions other than Blinded again
- Enhanced Conditions sets `overlay` type effects correctly again
- Concentrator correctly adds Concentrating condition again
- Concentrator prompts on damage again
- Triggler trigger fire reliably again

## [1.3.0] - 2020-10-21
### Added
- Condition Lab now supports **Active Effects**! A new `Active Effects Config` button appears next to each Condition's name in the Condition Lab. Clicking the button opens the Enhanced Effects Config app that allows you to configure the Active Effects for that Condition.
- New `About CUB` button added to the CUBputer header which provides more info about CUB as well as links to the wiki, DEATH SAVE Discord, and the DEATH SAVE Patreon
- `dnd5e-extended` Condition Map now includes an `Inspiration` Condition
- A number of new translation strings have been added (thank you translators, I am trying to get them all!)

### Changed
- [BREAKING CHANGE] Enhanced Conditions / Condition Lab now uses `Active Effects` to map conditions. All existing mapped conditions are upgraded to Active Effects.
- [BREAKING CHANGE] Enhanced Conditions API methods (eg. for macros) have changed. Full details are available in the [API docs](/api.md)
- Enhanced Condition chat messages no longer show the entire set of `Active Conditions` on an Actor/Token when a Condition is added or removed. Instead the message shows only the added/removed Condition/s. The exception to this is during combat if the `Output During Combat` setting is enabled, then the chat message will include all Active Conditions on a token.
- - `Removed Conditions` chat messages: the "Remove Condition" button is now an "Undo Remove" button that allows you to re-add the Condition back to the token if desired.
- Condition Maps `dnd5e` and `dnd5e-extended` now use the system-included `Rules (SRD)` compendium entries as references instead of the CUB-provided `Conditions (D&D5e)` compendium. The CUB compendium is still available for posterity but will be removed in a future release.
- Token Effect Icon sizes have changed. There are now 4 choices from Small to Extra Large. Effect icon size options are now designed to neatly divide the dimensions of the token, for example if `Small` is selected, you can fit 25 (5x5) icons on the token.
- CUBputer no longer defaults to show the faux terminal at the top of the  window. You can re-enable the terminal in the CUBputer options

### Fixed
- Token Status Effect Icons are functional and can be applied from the HUD again.
- Hide Names no longer throws an error during load due to a race condition related to the `canvas`

## [1.2.3] - 2020-10-11
### Added
- Hide Names support for ViNo (thanks @cswendrowski !)
- Hide Names support for Combat Carousel
- Auto Roll Hostile HP now includes a setting (in CUBputer under Misc Token) to hide the roll from players

### Changed
- Updated Korean translation (thanks @drdwing aka `KLO#1490`)
- Confirmed compatibility for Foundry VTT 0.7.3

### Fixed
- Fixed bad interaction with Multi-Level Tokens (thanks @grandseiken)

## [1.2.2] - 2020-09-13
### Added
- **CUBputer** now includes an option to remove the old-school CRT styling
- Dozens of new translation strings added

### Changed
- **Enhanced Conditions** macro methods (eg. `applyCondition`) now work without a token provided as long as you have a token `controlled` (ie. selected)

### Fixed
- Namespaced Handlebars helper methods to avoid conflicts with other modules/systems

## [1.2.1] - 2020-09-03
### Changed
- Updated Korean translation (thanks @drdwing aka `KLO#1490`)

### Fixed
- Hide Names no longer causes an error on load due to bad logic
- Hide Names no longer displays a `mask` icon on chat cards for non-GM/non-owner users
- Triggler now correctly replaces an Overlay Condition with another Overlay
- Temporary Combatants no longer causes an error when the game system does not have an `npc` Actor type (eg. Simple Worldbuilding System)

## [1.2] - 2020-08-26
### Added
- Hide Names changes:
- - added settings and default replacement name options for each token disposition: `friendly`, `neutral`, and `hostile`
- - added a form (accessible from the Actor sheet--look for the `mask` icon) for setting whether or not to hide an Actor's name and what the replacement should be
- - added an indicator on: chat messages, combat tracker, and Show Artwork popup, for GM and actor owner if a name has been replaced in chat for other users. Hovering over the icon shows the replacement name
- Triggler now allows triggers with no `Property` (for example if the criteria you want to use for the trigger is only at the `Attribute` level)

### Changed
- Hide NPC Names is now Hide Names
- Concentrator logic improved by using a flag on the chat message to detect if it has assessed the message for possible Concentration spells. This replaces a time-based check
- Enhanced Conditions macro/API method `getConditions` now returns an array of conditions instead of outputting to chat

### Fixed
- Triggler now works for game systems that don't mirror the `dnd5e` Actor model such as `archmage` (13th Age)
- You can now remove token status overlay icons (ie. right-clicked ones) via the Enhanced Conditions chat message, or other methods such as `removeCondition`
- Non-GM players can now set conditions (status icons) on tokens in game systems where this previously was not possible (note: this still only applies to tokens that player controls/has access to)

## [1.1.3] - 2020-06-27
### Added
- Portugese (Brazil) translation (thanks @rinnocenti!)

### Changed
- Confirmed compatibility with Foundry 0.6.4

### Fixed
- Improved drag and drop behaviour in Condition Lab (thanks moerill!)
- `Pathfinder` Blinded, Charmed and Sleep conditions had incorrect icons or references (thanks FurySpark!)
- Enhanced Conditions Output to Chat during Combat no longer ignores the first turn

## [1.1.2] - 2020-06-10
### Added
- New setting to output `Active Conditions` (if any) to chat on each Combatant's turn (disabled by default)
- New macro command `game.cub.getConditions(token/s)` returns the active conditions on the given token/s
- New variable `game.cub.conditions` returns the current Condition Map

### Changed
- Updated Korean translation (thanks KLO!)
- Improved the Hide NPC Names matching logic

### Fixed
- Hide NPC Names no longer breaks images with the same name as the NPC
- Hide NPC Names no longer breaks listeners on chat messages (eg. extra functionality from other modules)
- Players no longer receive an error regarding core Status Icons setting
- Remove Condition button in `Active Conditions` chat card no longer disappears on reload
- Pan/Select no longer fires for Temporary Combatants

## [1.1.1] - 2020-06-05
### Added
- Japanese translation added (thanks to BrotherSharp!)

### Changed
- For game systems with no CUB default Condition Map, a new map type of `System - Inferred` will be provided instead. This map type uses the system (or Foundry core) icons and extracts the icon file name as the Condition name
- Enhanced Conditions and the Condition Lab can be used with PF2e again! By default the Condition Lab will use the new `System - Inferred` map type.
- CUBputer no longer defaults to the Award XP gadget to reduce confusion around the gadget selector
- Namespaced all CSS rules to avoid unexpected CSS issues
- Confirmed compatibility with Foundry VTT 0.6.1

### Fixed
- Enhanced Conditions no longer causes issues with the Pathfinder 2nd Edition system! 
- CUB no longer breaks Token Mold Overlay
- Token Status Effects (aka Conditions) set as overlays are no longer removed from the Status Effect list in the Token HUD
- 13th Age Condition Map now loads as expected
- CUBputer external links work as expected

## [1.1.0] - 2020-05-23
### Added
- **CUBPuter** - a settings and information system for Combat Utility Belt! **NOTE:** most module settings have been moved into CUBPuter! **:NOTE**
- Korean translation (thanks to KLO!)
- 13th Age *System - Default* Condition Map (thanks asacolips!)
- 13th Age Condition compendium

### Changed
- Concentrator condition name is now configurable (in the CUBPuter > Concentrator gadget settings) and no longer hard coded to the word "Concentrating"

### Fixed
- Condition Lab now saves the scroll position when making changes to the list
- Enhanced Conditions Chat Output now respects the user's setting
- Triggler now correctly saves changes to a trigger in the text representation
- Mighty Summoner no longer prevents token creation if the token is not being summoned
- Mighty Summoner no longer causes issues with Temporary Combatants
- Temporary Combatants are correctly cleaned up when combat ends

## [1.0.3] - 2020-04-28
### Fixed
- Triggler no longer incorrectly fires due to bad logic
- Concentrator now correctly processes death-state for actors 

## [1.0.2] - 2020-04-26
### Fixed
- Concentration was not being automatically applied when selected

## [1.0.1] - 2020-04-26
### Changed
- Enabling Concentrator now prompts to enable Enhanced Conditions (if disabled) and creates a Concentrating condition if none exists

### Fixed
- Fixed issue with regular expression for finding compendia that prevented module loading in Firefox
- *System - Default* Condition Lab mappings were not loading 
- *System - Default* Condition Lab mappings were not correctly being set as read-only on first load


## [1.0.0] - 2020-04-25
### New
- Added **Triggler** a trigger management gadget focused on Actor and Token attribute updates. When combined with **Enhanced Conditions**/**Condition Lab** this replaces **Mark Injured/Dead**
- Added macros for adding and removing conditions: 
    - `game.cub.applyCondition(conditionName, token/s, {warn: true/false})`
    - `game.cub.removeCondition(conditionName, token/s, {warn: true/false})`
    - `game.cub.removeAllConditions(token/s)`
- Added the ability to link a Triggler trigger to a macro, executing that macro when the trigger criteria is met
- Added a Condition Lab map for the **Pathfinder 1** game system thanks to `furyspark`!
- Added drag and drop resorting to the **Condition Lab**
- Partial localization support

### Changed
- Massive changes to the **Condition Lab** -- **you will need to reconfigure your Condition Lab mapping**
- Module settings have been revamped. **You will need to reconfigure your settings!**
- Condition Lab now includes three mapping types:
    - *System - Default* - the default condition mapping for the current game system (if one exists)
    - *System - Custom* - an unlocked version of the default mapping
    - *Other/Imported* - an empty/custom map
- Condition Lab mappings can be exported and imported
- Condition lab mappings can now link to the following reference sources:
    - `JournalEntry`
    - `Item`
    - `Compendium.JournalEntry`
    - `Compendium.Item`
- Conditions listed in Enhanced Conditions chat output can now be removed
- Conditions in the Condition Lab have the following additional options:
    - Overlay - condition is an overlay when applied
    - Remove Others - condition will remove other conditions when applied
    - Mark Defeated - when condition is applied, combatants linked to the token will be marked defeated
- Module completely rebuilt to use es6 modules. This should allow for easier and better future updates
- Award XP is now a checkbox on the End Combat dialog and does not require a refresh to enable/disable

### Fixed
- **Concentrator** no longer tests concentration when HP = 0 and instead simply removes the status icon
- **Temporary Combatants** work again following the changes to hooks in Foundry VTT 0.5.2
- Enhanced Conditions chat output icons have a fixed height
- Reference entries are sorted alphabetically

## Removed
- **Mark Injured/Dead** has been removed in favour of a robust and customisable trigger system (**Triggler**) combined with the existing **Condition Lab**
- Removed Condition Lab mapping for **Pathfinder 2nd Edition** due to condition tracking being added to the game system

## [0.9.8] - 2020-03-16
### Added
- Enhanced Conditions now outputs the condition icon in the chat message

### Changed
- Enhanced Conditions and Concentrator messages are now sent by the token/actor in question--this allows Hide NPC Names to correctly hide the name
- Reworked the Enhanced Conditions chat message format--the message now displays as a list

### Fixed
- Enhanced Conditions no longer sends multiple chat messages for a single event
- Concentrator no longer sends multiple chat messages for a single event
- Single word names are now correctly hidden by Hide NPC names
- Spaces around names are now trimmed before being processed by Hide NPC Names
- Regex is escaped in single word names

## [0.9.7] - 2020-03-05
### Added
- Added a client setting to set the status effect icon size on tokens. Three options are available: Small (default) -- 5x5 icons, Medium -- 3x3 icons, and Large -- 2x2 icons. If the number of icons exceeds the boundaries of the token the additional icons will "bleed" into the canvas and may obscure other placeable objects or canvas elements. 

## [0.9.6] - 2020-03-01
### Added
- Hide NPC Names now includes a setting to suppress the chat card footer, which can contain sensitive information about the NPC
- Select Token now includes a setting to deselect all controlled tokens when the user does not have OWNER permission on the active combatant. This setting would generally be used in sessions where multiple players are using a single Foundry client

### Changed
- Hide NPC Names enhanced to cover a greater number of possible names including names with spaces and special characters
- Hide NPC Names now replaces names in the body of chat cards
- Pan/Select Token reworked to offer granular GM/Player control -- SOME SETTINGS HAVE BEEN RESET

## [0.9.5] - 2020-02-24
### Added
- Mark Injured/Dead now includes an Unconscious status that can be assigned to a certain type of Actor (eg. Player Characters) in settings

### Changed
- Enhanced Conditions Unconscious mapping now maps to the default Foundry unconscious icon
- PF2e default Condition mapping is now sorted alphabetically (thanks to @trey#9048)

## [0.9.4] - 2020-02-24
### Fixed
- Resolved Concentrator token detection bug
- Concentrator no longer fires on non-Concentration spells

## [0.9.3] - 2020-02-23
### Added
- Concentrator now supports spells cast from D&D Beyond using [Beyond20](https://beyond20.here-for-more.info/) by @kakaroto
- Concentrator now includes a setting to notify if a second Concentration spell is cast while the caster is already Concentrating on a spell. The options are: "None" (no notification), "GM Only" (whisper notification to GMs) and "All" (create general chat message)

## [0.9.2] - 2020-02-23
### Added
- Concentrator now includes a setting to automatically add the Concentrating status if you cast a Concentration spell

## [0.9.1] - 2020-02-23
### Fixed
- Concentrator now correctly calculates DC when damage > 10. Math is hard.

### Changed
- Incremented previous release from v0.8.2 to v0.9.0 due to magnitude

## [0.9.0] - 2020-02-23
### Added
- Concentration Checks -- allows a forced Concentration check when a token or actor takes damage. Thanks @jacobmcauley for this awesome feature! (D&D5e only at this time)

### Changed
- Moved attribution for contributors from the manifest to the README to avoid confusion

### Fixed
- Fixed a bug where panning/selecting tokens would select temporary combatants
- Improved logic around the Update Actor hook

## [0.8.1] - 2020-02-18
### Added
- Hide NPC Names now hides NPC names in the Character and Token Artwork popouts

### Fixed
- Fixed a bug where the Condition Lab button would fail to load due to long scene load times.

## [0.8.0] - 2020-02-15
### Added
- Add Temporary Combatants to the Combat Tracker to track things like Lair Actions or short-lived combatants
- Quick Edit Token Resource from Combat Tracker to quickly edit Combatant health during combat
- Roll Initiative from Character Sheet (limited system support)

### Changed
- Hide NPC Names now correctly hides names buried in chat message contents (Case-insensitive). NOTE: Hide NPC Names *may* break other modules that attach listeners to chat messages. If you are experiencing issues with behaviour related to chat messages try disabling Hide NPC Names.

## [0.7.9] - 2020-01-22
### Fixed
- Mark Injured/Dead not working for Actors with linked tokens
- Condition Lab button appearing before setting is enabled

## [0.7.8] - 2020-01-20
### Fixed
- Mark Injured/Dead not detecting the user correctly

## [0.7.7] - 2020-01-18
### Added
- Support for Foundry VTT 0.4.5

## Changed
- Reroll Initiative has been improved to be more efficient
- Updated the Experience Awarded chat message to display the total XP awarded

### Fixed
- Mark Dead in Tracker now correctly only fires for the GM
- Enhanced Conditions no longer outputs multiple chat messages for the same condition add/remove
- Enabling Reroll Initiative and Select Token caused only player-owned tokens to be selected on round change when initiative was being rerolled

## [0.7.2] - 2020-01-17
### Added
- Support for Foundry VTT 0.4.4 (thanks to tposney#1462 on discord)

### Changed
- Changed Condition output in chat to come from "Condition Lab" instead of the token

## Fixed
- Logic in Mighty Summoner functionality

## [pre-0.7.2] - Ancient History
- Stuff happened
- Here be dragons
