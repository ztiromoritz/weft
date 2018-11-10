## TODO
### Find a name
 * weft - Schussfaden
 * woof - Schussfaden (warp and woof Kette und Schuss), twine assoziation, bellen, 
        :( gibts schon bei npmjs
 * heddle - Litze, gibts noch nicht als npm,
 * zwirn
### GraphEditor 
 * Refactor
   * [ ] Create Command-Components usable in template and editor
   * [ ] First Example: Message
 * Minimal
    * [x] Id im Square
    * [x] Save
    * [x] Restore
    * [x] SaveOnMove
    * [x] Open editor on square click
    * [x] Editor: Id, Content, 
    * [X] SaveOnCloseEditor
    * [x] Add Square/Passage with Button
    * [x] Single Selection
    * [x] Multiselect
    * [x] Remove
    * [x] Add Square/Passage in PassageEditor 
    * [x] Dedicated Start Entry. ()Call it "Start" and it will work)
    * [x] Escape to leave dialog
    * [ ] Dedicated End Text
    * [ ] More clear save behaviour. At the moment it always safes on close.
    * [x] Dublicate detection on ID change
    * [ ] Editor Preview scrolling
    * [ ] Simple Fullscreens
    * [ ] Menues
    * [ ] Story: Title and author
    * [ ] Show weft version
    * [ ] Tests
    * [ ] Tags
    * [ ] Template link fixed.
 * Extra
    * [ ] Replace Color/Colour :/
    * [ ] Jump to passage from PassageEditor
    * [ ] Back Button/History Stack in PassageEditor Session
    * [ ] Passage Editor: Warnings when Message after Option
    * [ ] Name der Story: StoryTitle/StoryAuthor passage
    * [ ] CSS: Scroll in Chat Preview is broken
    * [ ] Configure others Avatar and Name
    * [ ] Selection and Drag+Drop of Groups
    * [ ] Infinite canvas 
    * [ ] Naming: Passage, Node, Square 
    * [ ] Grahical squares have form of mobile phone with chat preview.
    * [ ] Scriptability, custom macros
    * [ ] LMN: Message -> Passage, Question -> Decision

 
 ### Game generator
  * [x] Export/Build HTML
    * [x] Model to twee
    * [x] twee to lmn
  * [ ] Import from HTML (keep the model!!)
  * [ ] Twee import/export
  * [x] Inline svg
  * [x] Inline base64
  * [x] Inline scripts
  * [x] Inline css
 
 
### Template
 * [ ] Tipp sounds
 * [ ] Bilder
    * [ ] Selfies/Kamera einbinden/ 
    * [ ] Bild hochladen. echt. aus Foto Ordner
    * [ ] Bild hochladen aus "virtueller" Foto Ordner. Das Spiel gibt ein paar fotos vor
 * [ ] Karten integration
 * [x] keine Tipp Animation für "me". Bzw. Der Text wird im Eingabefeld "getippt" 
            -> https://github.com/ztiromoritz/bubble/
 * [X] Auswahl on QUESTION
 * [ ] Themes
 * [ ] Build in twemoji-awesome.css
 * [x] twee2lmn.js
 * [x] Start => Api und Buttons 
 * [ ] Pause => Api und Buttons 
 * [ ] Save state to localStorage.
 * [ ] LMN -> Aufzeichnung/Log und Replay.
 * [ ] Typing animation as svg
 * [ ] How to do emojies? -> fontawesome, twemojie
 * [ ] Icons: Start, Stop, Camera, Text, Send
 * [ ] Other avatar in header. base64
 * [ ] Integrate images from twee files 
 * [ ] Export game from template
 * [ ] Style Template
 * [ ] Bug: Settings undefined on init
 * [ ] Include svg  https://stackoverflow.com/questions/11978995/how-to-change-color-of-svg-image-using-css-jquery-svg-image-replacement
 * [ ] Auto Send settings.
 * [ ] Tags at passages
 * [ ] Javascript Passages
 * [ ] Non Chat messages/Narrator/Game Over-Screen
 * [ ] Extendability, userdefined Macros
   * [ ] `<<Me "Hello">>`
   * [ ] `<<Other "Hello">>`
   * [ ] `<<Message "Foo">>`
   * [ ] `<<Screen>> <</Screen>>`
   * [ ] `<<Timeout 200>>`
   * [ ] `<<Image "">>`
   * [ ] `<<MeTakeSelfie>>`  
   * [ ] `<<MeUploadFile>>` 
   * [ ] `<<PushNotification>>` may be fake
 * [ ] Long running timeout. Realtime feature. Does this work in browser
 * [ ] Mobile native compiler  
   
 * [ ] Chat template als es5 lib die an beiden Stellen verwendet werden kann.
 *     Why so complicated = (IDE in es6 with vue, template: vanilla js)
          * Because hackability of the template should be keept.
          * No further webpack and Api knowledge is needed, when you want to hack the template.
          * may be only css should be exchangeable
          * animations with css.
 * Create a Logo
 * Convert the   
 * [x] inline images in user icon 
 * [ ] --Grössenbeschränkung icons--
 * [ ] inline images in chat content
 * [ ] Project mit allen Sourcen und Assets
 * [x] IndexDB für die Dateien.
 * [ ] Import/Export Twee 
 * [ ] Import/Export des Projects
 * [ ] Auto graph outliner. 
 * [ ] Help/Cheatsheet in Passage Editor
 * [ ] CSS Editor for Style Passage.
 * [ ] RAW Editor for simple passage, to use it for twine stories with other templates

 
## Links
 * [https://leaverou.github.io/bubbly/](https://leaverou.github.io/bubbly/)
 * https://www.bypeople.com/css-chat/
 * "Font Awesome by Dave Gandy - [http://fontawesome.io](http://fontawesome.io)".