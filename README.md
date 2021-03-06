# A Google Docs extension for formatting comic scripts


## What is this extension?

This extension applies styling to a Google Document following the rules below.
It is intended for formatting a script, in a similar way to how movie scripts
are laid out. Google Docs does not have user-defined paragraph styles, so this
extension uses special characters in the text to work out what indentation etc
to apply to each paragraph. Think of it similar to Markdown for scripts in a
Google doc.

See https://www.nfi.edu/screenplay-format/ for guidance on how to format a
Hollywood script. This extension adapts the format used in these intructions.

You might like to check out [Fountainize](https://workspace.google.com/marketplace/app/fountainize/82574770793)
if youwant a more traditional formatter for movie scripts.
(I have no affiliation with Fountainize.)


## Set up

You have to do some set up to create a first document. After that you can copy
this document for new scripts.

* Create a new blank Google Doc
* Type in 7 paragraphs with a couple of words per paragraph so you can see the styling. Leave the first paragraph as "Normal" and change the following paragraphs to "Heading 1" to "Heading 6".
* For the first Normal paragraph, change the font to 12 point "Courier New". This is a script writing standard - you can use any font you like if you don't care about following standards. It is a throwback to the old manual typewriter days.
* Select "Normal" from the style drop down, then open "Normal Text" and select "Update 'Normal text' to match" from the sub-menu. This will change all the text in the document to use Courier font.
* Heading 1 I personally change to a different color, but leave as a big font. I use it for headings such as "Script", "Overview", "Appendix", or other sections as I deem appropriate.
* Heading 2 to 6 I update the styles to remove all before/after spacing, set the point size to 12, change the color to purple, adjust the indent, then update the style to match the headings.
* Open "Tools" / "Script Editor" from the menu.
* Change the default project title at the top to something you will remember (e.g. "Comic Script Formatter"). This will be used as the name in the "Add-ons" menu.
* Copy the contents of the JavaScript file in this repo ([Code.js](Code.js)) into the script window.
* Save the script.
* Type in a sample document (example below) and then select "Add-ons" / "Comic Script Formatter" / "Update formatting". This will reformat the script contents.


## Formatting rules

This extension relies on markup inside the script (so it is visible to the reader)
to work out how to format different content. Google Docs currently only supports 
heading 1 to 6 and normal paragraphs, so most formatting involves adjusting the 
indenntation of Normal paragraphs.

Paragraph styles:

- `# heading` to `##### heading` (1 to 5 hashes followed by a space at the start of a paragraph). Converted to a level 2 to level 6 heading allow outlining mixed into the script. Level 1 headings are left to the author to insert manually, as required.
- `EXT. Corner shop - DAY` ("EXT." at the start of a paragraph). Converted to bold like a heading with no indent. It represents a new external (outside) location and time of day. Normally would be followed by actions and dialog until a new location is started. Each location for the script is like a new section. I don't use a heading style as a logical part of an episode structure might jump between a few locations.
- `INT. Kitchen - EVENING` is also converted to a bold with no indent. It represents a new internal (inside) location and time of day.
- `-CHARACTER-` - Indented 2.5" inserted before dialog (and optional parentheticals).
- `(parenthetical)` - Indented 2". Optionally used after the character name and before dialog to provide guiadence to the speaker on emtions or similar. 
- `ALL CAPS TEXT` (text with no lower case letters). Indented 1". I use all caps text for speech bubble text, so I use all caps text (punctuation is allowed) to spot dialog.
- `[label] Mixed case text` (paragraphs starting with some text in brackets ("[" and "]") followed by text and punctuation with at least one lower case letter). 0.5" indent with the brackets and enclosed text bolded. I use this to insert frame labels/identifiers for reference purposes.
- `All other text` (text that does not match any other rule above and contains at least one lower case letter). 0.5" indent. For actions, camera directions, etc.
- `>CENTER<` (paragraphs starting with ">" and ending with "<"). Centers the text (e.g. "> THE END <").
- `INSTRUCTION:` (paragraphs ending with ":"). Right justify the instructions (e.g. "FADE TO:"). Could be used to indicate page break points or similar
- blank lines may be dropped or inserted by the formatter as it feels best.

Everything before the first "EXT.", "INT.", or "# " heading is never touched in a document as it is assumed
to be the title page or similar introductory text. So you MUST have a paragraph starting with
"INT.", "EXT.", or "# " for this extension to do anything.

This differs from the standard rules for formatting a little to make it easier to implement the formatter.
For example, I use "-" around character names to spot them more reliably.


## How I use it

- You have to type in extra chracters (e.g. "-" around character names), but while writing the script I don't worry about the indentation or bold etc. Every so often, I re-run the formatter ("Add-ons" / "Comic Script Formatter" / "Update formatting") and it will do the formatting for me.
- Level 1 headings are left for the script writer (e.g. for "Notes", "Script", and other top level sections).
- When writing a script, I start with an outline of only headings ("#" to "#####" - h2 to h5). I flesh out the overall structure.
- Next pass I write out the dialog (character names and what they say). I iterate on that until I am happy.
- I then do another pass to add in "[1-10-100]" style numbers, one per comic frame. I add extra notes as actions. This is where I decide what dialog goes on the same frame.
- I use a table of contents extension to provide an episode outline. As I insert additional detail between the headings, I can see the table of contents in the side bar, allowing me to at a glance remember the overall structure of the document.
- I use [N-NN-NNN] for episode number, location number, and shot numbers (e.g. "[1-10-100]"). I increment the location and shot numbers by 10 to make it easier to insert new frames later between existing numbers (e.g., "[1-15-200]"). Padding the numbers (starting from "X-10-100") has an advantage that the strings will sort easily, e.g. when used as file names in a directory for each frame.
- All dialog I do in upper case. Sorry, this extension won't work if you use lower case text in dialog. You can look at the code and implement your own rules like spotting paragraphs starting and ending with quotes or similar.
- For the comic font I use, the word "I" has horizontal bars at the top and bottom, but otherwise it should not. (That is, the letter captial I is formatted differently based on usage). So I use "|" (vertical bar) for the word "I" which is what the comic font I use does.
- For the comic font I use, "{" and "}" are shown as crows feet, allowing simple inline "{GROAN}" for emotions.


## Example

The following shows gives a feeling of what i would type in and format myself. I would style the first line with "Title" style, the second line with "Sub-title", and the third line with "Heading 1" manually in Google docs. The rest I just type in (Normal paragraph style).

```
                MY TITLE DOCUMENT
                    Episode 1
Script
Thank you for reading this script. Please send any feedback to me! Let's get into it!

# Introduce Sam

EXT. OUTSIDE HOME - MIDAY

[1-10-010] Establishing shot, pan from wide shot to focus on Sam's face
Sam is running down the street.

[1-10-020] Mid shot, frontal, tracking Sam as he runs
Add a bloom effect to Sam's hair as a nice introductory effect.

-Sam-
(panting)
| AM SO LATE! | AM IN BIG TROUBLE THIS TIME FOR SURE!

# Introduce Mrs B
[1-10-030] Side shot showing Sam running past Mrs B
-MrsB-
OH, SAM! GREAT TIMING! CAN YOU GIVE ME A HAND PLEASE?

[1-10-040] Sam brushes her off

-Sam-
FORGET IT, | AM LATE FOR SCHOOL!
Shocked expression on Mrs B's face.

EXT. OUTSIDE FRONT OF SCHOOL - EARLY MORNING

[1-20-010] Sam is running up to front of school

-Teacher-
LATE AGAIN SAM? DETENTION FOR YOU!
-Sam-
{GROAN!}
```

Result:

<img width="973" alt="Screen Shot 2022-03-23 at 2 03 59 PM" src="https://user-images.githubusercontent.com/5702163/159795584-8afa0ee7-81c0-4534-aa98-b4a4139dd193.png">
