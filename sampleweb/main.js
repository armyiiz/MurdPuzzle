
    
var backup = "";
var backup_y = 0;
var first_page;
    
function fillInDropDown() {
    
    //console.log(document.getElementById("suspect").value);
    
    //console.log(accusation_object);
    
    //console.log("motive_mode: " + motive_mode);
    
    if (accusation_object.killer != "") document.getElementById("suspect").value = accusation_object.killer;
    if (accusation_object.weapon != "") document.getElementById("weapon").value = accusation_object.weapon;
    if (accusation_object.room != "") document.getElementById("room").value = accusation_object.room;
    if (motive_mode) {
        if (accusation_object.motive != "") document.getElementById("motive").value = accusation_object.motive;
    }
    
    //console.log(document.getElementById("motive").value);
    
    //console.log(document.getElementById("suspect").value);
}
    
function writeSelectChange(selection, which) {
    
    
    
    var theoption = selection.options[selection.selectedIndex].value;
    //console.log(theoption);
    
    if (which == "suspect") accusation_object.killer = theoption;
    else if (which == "weapon") accusation_object.weapon = theoption;
    else if (which == "room") accusation_object.room = theoption;
    else if (which == "motive") accusation_object.motive = theoption;
    
    selection.options[0].selected = false;
    theoption.selected = true;
    
    //console.log(document.getElementById('accuse-form').innerHTML);
    
    //console.log(selection.options[selection.selectedIndex]
    
    
    //const optionToSelect = selection.options.find(item => item.text ===text);
    //console.log(selection.options[optionToSelect]);
    
}

  

function loadPage(name_thing) {
    
    day_string = dateToDay(today_date_string);
    console.log("day: " + day_string);
    
     if (name_thing == "story") {
        
        //document.getElementById("mainbox").innerHTML = first_page;
        resetEverything();
         
        //document.getElementById("title_head").classList.add("smallify");

        //document.getElementById("subtitle").classList.add("smallify");
        
    }  else if (name_thing =="daily") {
        
        
    daily = true;
        
        
    const today_date = new Date();
    const today_day = today_date.getDay();
    
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    
    //console.log("SEED: " + today_date.getMonth() + today_date.getDate() + today_date.getFullYear());
    
    Math.seedrandom(today_date.getMonth() + "" + today_date.getDate() + "" + today_date.getFullYear()); // TWEAKING THE SEED
        
        //document.getElementById("mainbox").innerHTML = first_page;
        
        //setupDaily()
        resetEverything();
         
        //document.getElementById("title_head").classList.add("smallify");

        //document.getElementById("subtitle").classList.add("smallify");
        
    } else if (name_thing == "reload") {
        
        loadPage("daily");
        checkAccusation(false, true);
        
    }     
    
}

    
function ifIndoor(index) {
    
    if (major_setting.rooms[index].indoors) return "indoor";
    else return "outdoor";
    
}

var past_dial = 0;

var decoder_knob = pureknob.createKnob(150, 150);
var decoder_node;
var decoder_setting = 0;

function shiftDecoderRing() {
    
    if (detective_code_mode) {
        
        decoder_text = encodeDC(decoder_text);
        
        decoder_text = caesarify(decoder_text, 1);
                
        decoder_text = encodeDC(decoder_text);
        
        var flipped_current_letter = encodeDC(document.getElementById("current-letter").innerHTML);

        document.getElementById("current-letter").innerHTML = encodeDC(caesarify(flipped_current_letter, 1));
        
    } else {
        
        decoder_text = caesarify(decoder_text, 1);
        document.getElementById("current-letter").innerHTML = caesarify(document.getElementById("current-letter").innerHTML, 1)
        
        
    }
    
    past_dial++;

    document.getElementById("plaintext-field").value = decoder_text;
            
    decoder_setting = past_dial;

    document.getElementById("decoder-image").style.transform = 'rotate(' + (-90 + Math.floor(past_dial*13.8) % 360) + 'deg)';
    
    
}

function makeDecoderRing() {
    
    if (coded_message) {
        decoder_text = coded_message;
        document.getElementById("plaintext-field").innerHTML = decoder_text;
    }
    
    coded_message = "";
    
    console.log("MAKING FULL DECODER RING");
    
    var decoder_knob = pureknob.createKnob(150, 150);

    //console.log(screen.width);

    decoder_knob.setProperty('angleStart', -1 * Math.PI);
    decoder_knob.setProperty('angleEnd', 1 * Math.PI);
    decoder_knob.setProperty('valMin', 0);
    decoder_knob.setProperty('valMax', 25);
    decoder_knob.setProperty('trackWidth', 1);
    decoder_knob.setProperty('colorFG', '#80011e');
    decoder_knob.setProperty('colorBG', '#2e2e2e');
    decoder_knob.setProperty('colorLabe', '#000000');
    decoder_knob.id = "knob-element";
    
    decoder_knob.setValue(0);
    
    console.log(decoder_knob);
    
    
    document.getElementById("decoder-image").style.transform = 'rotate(' + (-90) + 'deg)';
    
    const listener = function(knob, value) {
        
        console.log("listening");
        
        decoder_text = document.getElementById("plaintext-field").value;
        
        if (value != past_dial) {
            
            console.log(value-past_dial);
            
            if (detective_code_mode) {
                
                decoder_text = encodeDC(decoder_text);
                
                decoder_text = caesarify(decoder_text, value - past_dial);
                
                decoder_text = encodeDC(decoder_text);
                
                var flipped_current_letter = encodeDC(document.getElementById("current-letter").innerHTML);

                document.getElementById("current-letter").innerHTML = encodeDC(caesarify(flipped_current_letter, value - past_dial));
                
                
            } else {
                
                decoder_text = caesarify(decoder_text, value - past_dial);

                document.getElementById("current-letter").innerHTML = caesarify(document.getElementById("current-letter").innerHTML, value - past_dial);
                
            }

            past_dial = value;

            document.getElementById("plaintext-field").value = decoder_text;
            
            decoder_setting = value;

        }
        
        document.getElementById("decoder-image").style.transform = 'rotate(' + (-90 + Math.floor(value*13.8) % 360) + 'deg)';

    };

    decoder_knob.addListener(listener);
    
    console.log(decoder_knob);
    
    detective_code_mode = false;
            
    decoder_node = decoder_knob.node();
    var elem = document.getElementById('caesar-dial');
    elem.appendChild(decoder_node);
    
}

function encodeDC(message) {

        var return_code = "";
        message = message.toLowerCase();

        var alphabet = "abcdefghijklmnopqrstuvwxyz";
        var reverse_alphabet = "zyxwvutsrqponmlkjihgfedcba";

        for (var a = 0; a < message.length; a++) {

            if (alphabet.indexOf(message[a]) != -1) return_code += reverse_alphabet.charAt(alphabet.indexOf(message[a]));
            else return_code += message[a];

        }

        return return_code.toUpperCase();

    }

var detective_code_mode = false;

function makeDetectiveCode() {
    
    detective_code_mode = !detective_code_mode;
    
    
    if (detective_code_mode) {
        document.getElementById("dc-button").innerHTML = "TURN OFF DETECTIVE CODE";
        document.getElementById("current-letter").style.color = "#A30B37";
        document.getElementById("plaintext-field").style.color = "#A30B37";
        
    }
    else {
        document.getElementById("dc-button").innerHTML = "PRESS FOR DETECTIVE CODE";
        document.getElementById("current-letter").style.color = "black";
        document.getElementById("plaintext-field").style.color = "black";
    }
    
    
    console.log("DC!");
    
    
    document.getElementById("plaintext-field").value = encodeDC(document.getElementById("plaintext-field").value);
   // saveDecoderText();
    
    document.getElementById("current-letter").innerHTML = encodeDC(document.getElementById("current-letter").innerHTML);
    
    console.log(decoder_knob);
    decoder_knob.setValue(0);
    console.log(decoder_knob.getValue());
    decoder_setting = 0;
    //document.getElementById("decoder-image").style.transform = 'rotate(' + (-90) + 'deg)';
    
    
    
}

function makeCaesarDial() {
    
    console.log("MAKING DIAL");
    
    var knob = pureknob.createKnob(150, 150);
    
    

    //console.log(screen.width);

    knob.setProperty('angleStart', -1 * Math.PI);
    knob.setProperty('angleEnd', 1 * Math.PI);
    knob.setProperty('valMin', 0);
    knob.setProperty('valMax', 25);
    knob.setProperty('colorFG', '#80011e');
    knob.setProperty('colorBG', '#2e2e2e');
    knob.setProperty('colorLabe', '#000000');
    knob.setValue(0);
    
    const listener = function(knob, value) {
        
        if (value != past_dial) {

            past_dial = value;

            document.getElementById("coded-message").innerHTML = caesarify(caesar_line, value);

        }

    };

    knob.addListener(listener);
            
    var node = knob.node();
    var elem = document.getElementById('caesar-dial');
    elem.appendChild(node);
    
}

var notebook_toggle = false;

function notebookSwitch() {
    
    if (!(notebook_toggle)) newPage("notebook");
    else newPage("return");
    
}

var mainpage = true;
var current_element = false;

var decoder_text = "WRITE YOUR SECRET MESSAGE HERE.";

function saveDecoderText() {
    
    
    decoder_text = caesarify(document.getElementById("plaintext-field").value.toUpperCase(), 26-decoder_setting);
    
    console.log("Saving Text: " + decoder_text);
    
    
    document.getElementById("plaintext-field").value = caesarify(decoder_text, decoder_setting);
        
}

function tutorialGridFormat() {

    
    document.getElementById("delete-icon").style.display = "none";
    document.getElementById("restore-icon").style.display = "none";
    document.getElementById("save-icon").style.display = "none";
    document.getElementById("switch-icon").style.display = "none";
    
}

var coded_message = "";

function displayBadgeInfo(badge_id) {
    
    document.getElementById("badge-info").innerHTML = "<strong>" + badge_object[badge_id].name + "</strong><br><br>" + badge_object[badge_id].description;
    
    document.getElementById("badge-info").style.display = "block";
    
    
    function clearBadges() {
        var messages = document.querySelectorAll(".badge-image");

        messages.forEach(message => {
           message.style.filter = '';
        });
    }
    
    clearBadges();
    
    document.getElementById("badge-" + badge_id).style.filter = 'drop-shadow(0 0 0.75rem #000000)';
    
}

var badge_object = {

    wrench : {
        name: "The Mechanic Badge",
        url: "wrench.svg",
        description: "For submitting a bug or a fix to Murdle.com! In the words of Chancellor Tuscany, \"Those who improve the world, improve themselves.\" Of course, she was just about to ask for donations..."
    },

    seven: {

        name: "A Full Week",
        url: "calendar.svg",
        description: "If you've solved seven cases in a row, you'll win the weekly badge. Being a detective is a full time job. That's why the Detective Clubs around the world are fighting to unionize the mystery-solving profession."

    },

    knight: {

        name: "The Red Knight",
        url: "knight.svg",
        description: "For performing an important task for the Detective Club. These tasks may range from simple favors to undercover missions. Their only true "

    },
    
    cryptic: {

        name: "The Cryptic Completionist",
        url: "cryptic.svg",
        description: "You have decoded enogh cryptics on the MORIARTY Decoder. Is it having a weird effect on your psyche? Are you being driven to commit murderous acts at the whim of a computer? Or is it just a puzzle game..."

    },

    book: {

        name: "The Book Badge",
        url: "book.svg",
        description: "This commemorates your purchase of a Murdle book."

    },

    social: {

        name: "The Socialist Signifier",
        url: "socialist.svg",
        description: "You are a social member of the Detective Club. You have visited the online forums or social media platforms that we use to get out our message."

    }, 
    
    creative: {

        name: "The Creative Commendation",
        url: "painting.svg",
        description: "You have created something that was added to Murdle: a suspect painting, a new weapon, or even a new suspect. Truly, you are a great contributor to the Detective Club."

    },
    
    thousand: {

        name: "The Thousandaire Club",
        url: "thousand.svg",
        description: "You've managed to make a thousand dollars in mystery bucks, all by solving mysteries. (Or, at least, probably partially by solving mysteries. There might be other ways to make mystery bucks.)"

    }


};

function displayBadges() {

    badge_array = JSON.parse(localStorage.getItem('badge_array')) || [];

    var badge_string = "<p>";

    for (var a = 0; a < badge_array.length; a++) {

       badge_string += "<a href='javascript:void(0)' onclick='displayBadgeInfo(\"" + badge_array[a] + "\")' ><img class='badge-image' id='badge-" + badge_array[a] + "' src='images/extras/badges/" + badge_object[badge_array[a]].url + "'/></a>";

    }

    badge_string += "</p><p id='badge-info' style='display: none'></p>";
    
    
    document.getElementById("badge-display").innerHTML = badge_string;



}
    
function newPage(name_thing, closingnotebook, extra_info, origin) {
    
    Math.seedrandom(today_date_string);
    
    //console.log(solution_object);
    
    console.log(current_element);
    
    var containerEl = document.getElementById("mainbox");
    
    var titleEl = document.getElementById("title_head_full");
    
            
    
    if (name_thing == "return") {
        
        //if (!(current_element)) {
        
            containerEl.innerHTML = backup;

            //document.getElementById("title_head").classList.add("smallify");

            //document.getElementById("subtitle").classList.add("smallify");
            document.getElementById("title_head_full").style.display = "block";
            document.getElementById("club").style.display = "block";
            mainpage = true;
            console.log("backup_y: " + backup_y);
            window.scrollTo(0, backup_y);
            fillInDropDown();
            
        
        //} else {
        
        //    research(current_element[0], current_element[1]);    
            
        //}
        
        document.getElementById("mainpage-notebook").innerHTML = generateGrid(true);
        
        whichBook();
        
        if (tutorial_mode) tutorialGridFormat();
        
    } else {
        console.log("mainpage: " + mainpage);
        if (mainpage) {
        backup_y = window.scrollY;
            backup = containerEl.innerHTML;  
            backup_title = titleEl.innerHTML;
            mainpage = false;
        }
    }
    
    
    if (name_thing != "notebook") {
        current_element = false;
        notebook_toggle = false;
    } else {
        notebook_toggle = true;
        
    }
    
    //console.log(name_thing);
    
    
    function returnHeader(emoji_choice) {
        
        return `<p class='page-header'><span id='char-emoji' class='emoji'>${emoji_choice}</span></p>`;
        
    }

    //else if (name_thing != "get-hint") backup = containerEl.innerHTML;

    
    if (name_thing == "hint") {
        
        containerEl.innerHTML = "<p class='page-header'><span id='char-emoji' class='emoji'>🔮</span></p><p class='nice-paragraph'><strong>If Deductive Logico wanted a hint,</strong> he was going to have to do something he did not want to do: ask the esoteric Inspector Irratino.</p><p>Logico had his doubts about Irratino's methods, but he couldn't argue with the results. His hints were always true, though they were often useless or redundant!</p><p>Do you still want to do this? Every puzzle can be solved without a hint. And if you ask for one, you will always remember that it was not due wholly to your powers of deduction, but also to Irratino's ties to the collective unconscious.</p><p>Nevertheless, the choice is yours...</p>" + '<p style="text-align: center"><input TYPE="button" class="opening-button" NAME="button" value="ASK FOR A HINT" onClick="newPage(\'get-hint\')"></p>';
        
        document.body.className = "hint";
        
        document.getElementById("club").style.display = "none";
        document.getElementById("chess-base").style.display = "none";
        document.getElementById("subheading").style.display = "none";
        
    }
    else {
        
        
        document.getElementById("club").style.display = "block";
        document.getElementById("chess-base").style.display = "block";
        document.getElementById("subheading").style.display = "block";
        
    }
    
    if (name_thing == "tutorial") {
        
        containerEl.innerHTML = "<p class='page-header'><span id='char-emoji' class='emoji'>❓</span></p><p class='nice-paragraph'><strong>All of the puzzles may be solved through logical deduction.</strong> No puzzles require the use of a hint, and all of them can be solved through careful use of the notebook.</p><p>In order to solve a Murdle, you must first identify who has which weapon where, with the assistance of the notebook grid. Once you have identified who has which weapon where, you should use the red clue to determine which of them is the murderer.</p><p>Only when you are sure of your answer should you make a final accusation.</p><p>When clues mention relationships between characters -- such as crushes, histories, etc. -- all Logico can draw from this is that these are two separate people.</p><p>For example, a clue that says <strong>Dr. Crimson has a crush on the person with the gardening shears</strong> only means that Dr. Crimson does not have the gardening shears.</p>";
        
    }
    
    if (name_thing == "obsidian-clue-room") {
        
        
        
        function generateTitleOther() {
            
            console.log("generate title");
            
            Math.seedrandom(obsidian_suspect);
            
            return [["The Perplexing Puzzle of ", "The Mysterious Murder of", "The Terrifying Tale of"].random() + " " + ["the Innocent Man", "the Beautiful Bride", "the Dancing Seagulls", "the Winding Road", "the Lonely Vicar"].random(), ["Hark! The Herald Angels Sing", "Eenie, Meenie, Minie, Moe", "The Seven Murders of the Ancient World", "Old House, Fresh Body"].random()].random();
            
        }
        
        var spooky_intro = ["You find inspiration in the strangest places.",`That reminds me of another memory:`,`At the time, I was struggling with my latest whodunit, <span style='font-style: normal'>${generateTitleOther()}</span>.`, "Lighting flashed! Thunder rolled! And I, unfortunately, was still bored.", "It was a quiet evening.", "If I recall correctly, it was about fifteen years ago to the day.", "As a detective writer, I am often asked about the night in question:", "I recall the events surrounding the death of my husband rather clearly.", "It was not that my husband planned to die that day. But sometimes, life doesn't turn out how you planned.", "I think about that night all the time, and when I do, it is like I am transported back in time.", "Yes, it is true that I have written more than six-hundred books about murder. But I wasn't thinking about my enormously successful books at the time. I was distracted.", "There are seemingly insignificant moments that you think about often in your life."];
        
        
        
        var spooky_room = [`But the incident ${roomWithPreposition(room_temp)} shouldn't be the only thing that people remember.`, `I was walking about listlessly ${roomWithPreposition(room_temp)}.`,`I heard footsteps ${roomWithPreposition(room_temp)}.`, `My husband was pacing ${roomWithPreposition(room_temp)}.`, `But what was I doing  ${roomWithPreposition(room_temp)}?`, `How do I explain how, shortly after the crime took place, I was seen ${roomWithPreposition(room_temp)}?`];
        
        var spooky_closer = ["I was wearing one of my better hats, and thought I looked quite dashing.","It felt like an ordinary, normal day, but of course, it wasn't.","There was a certain feeling in the air that day. A feeling... of murder!", "But by the dawn of the next day, one person would be dead, and another would be their murderer.", "I did not intend for what happened to happen, but then again, I didn't prevent it, either.", "(Despite what happened later, I want to note that my hair was immaculate.)", `(Interestingly, this would later provide the inspiration for my bestselling whodunit,  <span style='font-style: normal'>${generateTitleOther()}</span>, but that's a story for another time.)</em>`];
        
        function generateExcerpt() {
            
            console.log("generate excerpt" + today_date_string + room_temp + " 0 ");
        
            
            Math.seedrandom(room_temp+1);
            
            
            var to_return_array = [``];
            
            Math.seedrandom(room_temp + 2);
            
            var to_return = [spooky_intro.random() + " " + spooky_room.random() + " " + spooky_closer.random()].random();
            
            console.log(to_return);
            
            return to_return;
            
        }
        
        function generateTitle() {
            
            console.log("generate title");
            
            Math.seedrandom(obsidian_suspect);
            
            return ["How I Murdered My Husband: An Idunnit"].random();
            
        }
        
        
        
        var obsidian = {
            
          pagenum: Math.floor(7 + Math.random()*100 + Math.random()*50),
            
        };

        Math.seedrandom(obsidian_suspect);
        
        containerEl.innerHTML = `<p class='page-header'><span id='char-emoji' class='emoji'>📚</span></p><p class='nice-paragraph'><strong>The following excerpt is from page ${obsidian.pagenum} of <em>${generateTitle()}</em>, by Dame Obsidian:</strong></p><p class='nice-paragraph book-excerpt'><em>${generateExcerpt()}</em></p><p class='nice-paragraph'>${["Inspector Irratino had underlined this passage and written \"Coincidence?\" beside it. But was it?", "Dame Obsidian swore that this book was entirely fictional, even if it was written in the form of a memoir."].random()}</p>`;
        
    }
    
    if (name_thing == "obsidian-clue") {
        
        function funnyName(name) {
            
                Math.seedrandom(name + "11");
                
                const vowels = 'AEIOUaeiou';

                // Split the input name into words
                const words = name.split(' ');

                // Grab the last word from the words array
                const lastWord = words.pop();

            
                if (flipACoin()) {
                    
                    // Find the position of the first vowel in the last word
            
                let vowelIndex = -1;
                for(let i = 0; i < lastWord.length; i++) {
                    if(vowels.includes(lastWord[i])) {
                        vowelIndex = i;
                        break;
                    }
                }

                // If a vowel was found, modify the word and push it back to the words array
                if(vowelIndex !== -1) {
                    const modifiedWord = 'Schm' + lastWord.slice(vowelIndex);
                    words.push(modifiedWord);
                } else {
                    // If no vowel was found, simply push the original word back
                    words.push(lastWord);
                }
                    
                } else {

                    let firstLetter = lastWord[0];
                    let restOfWord = lastWord.slice(1);
                    let capitalizedRest = restOfWord.charAt(0).toUpperCase() + restOfWord.slice(1);

                    words.push(`${firstLetter}. ${capitalizedRest}`);
                    
                }
            
                

                // Join the words array back to a string and return
                return words.join(' ');
                

            
        }
        
        var obsidian_suspect = suspect_temp;
        
        var slanke_lines = ["The only way to prevent myself, Slanke Mannen, from solving this case is to kill me, and unfortunately for the killer, I am unkillable.", "You are hiding something. But what? I will forget it out... or else! Or else what? Or else the killer will get away!", "Being a detective is not so easy, is it? And yet, I am the best at it. That is no coinicidence.", "I have a great ambition in the field of detecting: I plan to never let a killer get away.", "Have you ever imagined that you might ", "The killer forget about one thing: me, Slanke Mannen, the great detective!", "No one can best Slanke Mannen in the domain of murder, for it is there that I excel!", "I, Slanke Mannen, shall solve this case! Or else, this case is unsolevable."];
        
        var slanke_closers = ["He then began to perform that act of which he was obviously so fond: the exposing of everybody's secrets, which he had so delightful ascertained. Why the murderer always sat through these speeches, nobody knew. Perhaps it was simply the desire to hear Slanke speak, for he was very good at it.", "Slanke Mannen paced the library, gesticulated feverishly and rambling in that way that was so delightful.", "Mannen was the greatest detective the world had ever known, and the slimmest.", "Meanwhile, his golden eyes were atwinkle."];
        
        var biography_closers = ["Many people have asked me why, if I knew my husband was buried beneath the garden shed, I didn't say something to anyone. And the answer is simple: I just kept forgetting to do it. You know how it is when you don't make a to-do list.", "If I was the murdered, I think, what I would have done, is poisoned his tea. It would have been simple, really: he always made the same tea at the same time. I would have just put the poison in it, and he would have made it himself. Then, when he died, I would go hide the body. It would never be found, and I would get away with it."];
        
        var spooky_intro = ["Lightning cracked! Shadows flashed across the ancient books.", "The raging storm battered the doors of the library.", "A shriek was heard from the fall corners of the library. Or was that a cat?", "A cold wind blew through the halls of the library."];

    
        


        
        
        function generateExcerpt() {
            
            console.log("generate excerpt" + today_date_string + obsidian_suspect + " 0 ");
            
            Math.seedrandom(obsidian_suspect);
            
            var funny_suspect = funnyName(obsidian_suspect);
            
            //var to_return_array = [`“Ah-ha!” declared the genius Norwegian detective, Slanke Mannen. “I have uncovered the clue that obviously links ${funny_suspect} to the crime!”`, `${funny_suspect} raised a knife above ${suspect_details[obsidian_suspect].possessive_pronoun} head! But just when ${suspect_details[obsidian_suspect].subject_pronoun} was about to strike, the great Norwegian inspector Slanke Mannen walked in the room, ruining  ${suspect_details[obsidian_suspect].object_pronoun} opportunity for deadly, dastardly deeds! “Ah-ha!” he declared. “${slanke_lines.random()}”`];
            
            Math.seedrandom(obsidian_suspect + 4);
            
            var to_return = spooky_intro.random() + " " + to_return_array.random() + " " + slanke_closers.random();
            
            console.log(to_return);
            
            return to_return;
            
        }
        
        function generateTitle() {
            
            console.log("generate title");
            
            Math.seedrandom(obsidian_suspect);
            
            return [["The Perplexing Puzzle of ", "The Mysterious Murder of", "The Terrifying Tale of"].random() + " " + ["the Innocent Man", "the Beautiful Bride", "the Dancing Seagulls", "the Winding Road", "the Lonely Vicar"].random(), ["Hark! The Herald Angels Sing", "Eenie, Meenie, Minie, Moe", "The Seven Murders of the Ancient World", "Old House, Fresh Body"].random(), "How I Murdered My Husband (And Got Away With It): A Novel"].random();
            
        }
        
        
        
        var obsidian = {
            
          pagenum: Math.floor(7 + Math.random()*100 + Math.random()*50),
            
        };

        Math.seedrandom(obsidian_suspect);
        
        containerEl.innerHTML = `<p class='page-header'><span id='char-emoji' class='emoji'>📚</span></p><p class='nice-paragraph'><strong>The following excerpt is from page ${obsidian.pagenum} of <em>${generateTitle()}</em>, one of Dame Obsidian's many novels:</strong></p><p class='nice-paragraph'><em>${generateExcerpt()}</em></p><p class='nice-paragraph'>Like usual, Dame Obsidian seemed to base her cases on people she knew in real life, only thinly veiling their identities.</p>`;
        
    }
    
    if (name_thing == "astrology") {
        
        function emojiChoice(emoji_choice) {
            
            return `<p class='page-header'><span id='char-emoji' class='emoji'>${emoji_choice}</span></p>`;
            
        }
        
        containerEl.innerHTML = emojiChoice("🔮") + `

            <p class='nice-paragraph'><strong>Inspector Irratino had prepared an occult primer on astrology for Deductive Logico.</strong> Logico didn't believe in astrology, but he did believe in lists.</p>
            <div style='display: flex; text-align: center;'>
                <div style='flex: 50%; margin-right: 0.5em;'>
                    <strong>ARIES</strong><br>
                    March 21-<br>April 19<br><br>
                    <strong>TAURUS</strong><br>
                    April 20-<br>May 20<br><br>
                    <strong>GEMINI</strong><br>
                    May 21-<br>June 20<br><br>
                    <strong>CANCER</strong><br>
                    June 21-<br>July 22<br><br>
                    <strong>LEO</strong><br>
                    July 23-<br>August 22<br><br>
                    <strong>VIRGO</strong><br>
                    August 23-<br>September 22<br><br>
                </div>
                <div style='flex: 50%'; margin-left: 0.5em;'>
                    <strong>LIBRA</strong><br>
                    September 23-<br>October 22<br><br>
                    <strong>SCORPIO</strong><br>
                    October 23-<br>November 21<br><br>
                    <strong>SAGITTARIUS</strong><br>
                    November 22-<br>December 21<br><br>
                    <strong>CAPRICORN</strong><br>
                    December 22-<br>January 19<br><br>
                    <strong>AQUARIUS</strong><br>
                    Jan 20-<br>February 18<br><br>
                    <strong>PISCES</strong><br>
                    February 19-<br>March 20</div>
            </div>`;
        
    }
    
    if (name_thing == "fingerprint") {
        
        console.log("fingerprint_id: " + fingerprint_id);
        
        containerEl.innerHTML = "This is the fingerprint that Logico discovered:</strong></p>" + "<p style='text-align: center'><img class='fingerprint-image' alt='Pattern " + fingerprintID(fingerprint_id) + "' src='prints/" + suspect_details[fingerprint_id].characteristics.print + "'/></p><p>He then compared it to the recorded fingerprints of each of the suspects:</p><div id='fingerprint-tray'></div>";
        
        dealFingerprintCards();
        
    }
    
    if (name_thing == "caesar") {
        
        
        containerEl.innerHTML = "<p><strong>Deductive Logico recognized this code immediately:</strong> it was a Caesar cipher, where each letter was shifted a certain number of spaces. Fortunately, Logico had a Caesar Cipher Decoder ring, which he used to decode the message:</p><p id='coded-message' style='font-weight: bold; text-align: center'>" + caesar_line + "</p><div id='caesar-dial'></div>";
        
        window.setTimeout(makeCaesarDial,0);
        
    }
    
    if (name_thing == "friends") {
        
        
        containerEl.innerHTML = "<p class='page-header'><img id='top-image' src='images/extras/fedora.png'/><br>FRIENDS</p><p><strong>If you like Murdle, please check out some of our friends:</strong></p><ul style='line-height: 1.7'><li><strong><a href='https://us.macmillan.com/publishers/st-martins-press/' target='_blank'>St. Martin's Press</a>:</strong> the official publisher of Murdle!</li><li><strong><a href='https://www.pressmantoy.com/' target='_blank'>Pressman Games</a>:</strong> the maker of the upcoming board game</li><li><strong><a href='https://tarashimalayancuisine.com/' target='_blank'>Tara's Himalayan Cuisine</a>:</strong> the host of <a href='https://murderattaras.com' target='_blank' style='color: black'>Murder at Tara's</a>!</li><li><strong><a href='https://www.secretmovieclub.com/' target='_blank'>The Secret Movie Club</a>:</strong> our movie-mystery screening partner!</li><li><strong><a href='https://www.foulplayco.com/' target='_blank'>Foulplay Games</a>: </strong> women-owned murder-mystery-party company.</li><li><strong><a href='https://www.huntakiller.com/' target='_blank'>Hunt-a-Killer</a>:</strong> mystery boxes, delivered to you.</li></ul></p><p>Please support our friends, particularly by not murdering them, or (if one of them is murdered) by solving said murder.";
        
    } // <p>Say hello to G. T. Karber on <a href='https://instagram.com/gregkarber' target='_blank'>Instagram</a>, <a href='https://tiktok.com/@gtkarber' target='_blank'>Tiktok</a>, <a href='https://twitter.com/gregkarber' target='_blank'>Twitter</a>, or <a href='https://bsky.app/profile/gtkarber.bsky.social' target='_blank'>Bluesky</a> or chat with your fellow detectives on <a href='https://reddit.com/r/murdle' target='_blank'>Reddit</a> or <a href='https://discord.gg/kmyFvXJ44s' target='_blank'>Discord</a>. </p>
    
    if (name_thing == "false-decoder") {
        
        
        
        containerEl.innerHTML = "<p class='page-header'><img id='top-image' src='images/extras/fedora.png'/><br>DECODER RING</p><p><strong>No matter how much you try, the Detective Club Decoder Ring can't crack this code. It seems like the letters are all scrambled. Maybe rearrange them?<br><br><br>";

        
        //
    
    }
    
    if (name_thing == "statement-help") {
        
        containerEl.innerHTML = "<p class='page-header'><span class='emoji random-color'>🗣️</span><br>HOW TO FIND WHO'S LYING</p><p>On some days, you not only need to interpret clues, you also need to talk to the suspects and discover which of them is lying.</p><p>In order to do this, you need to use a combination of logical deduction and process of elimination.</p><p>First, assume one of the suspects is lying, while the others are telling the truth. Then, try to put that information into the Deduction Grid: if the supposed killer says they were in a place, write down that they weren't in that place. If they say that someone didn't have a weapon, write down that they did have it. </p><p>If you cannot fill the grid without running into a contradiction -- for example, a weapon being both at and not at a certain location -- then you know that your assumption was wrong, and the suspect you assumed was guilty was actually innocent.</p><p>However, if you can fill in the entire Deduction Grid without any contradictions, then you know your assumption was correct, and you have found your killer.</p><p>Some days, it will be easier to spot the liar than others. But as you get better at solving them, you will learn tricks and techniques that will make it easier. Like Logico says, \"Deduction is an art you can easily learn, but never master!\"</p><p>If you have trouble, you can always ask your fellow detectives in the <a href='javascript:void(0)' onclick='newPage(\"club\")'>Detective Club</a>!</p>";
        
    }
    
    if (name_thing == "decoder") {
        
        
        
        containerEl.innerHTML = "<p class='page-header'><img id='top-image' alt='A very cool fedora.' src='images/extras/fedora.png'/><br>DECODER RING</p><p><strong>You can use the Detective Club Decoder Ring to write a secret message.</strong> Simply type your message in below, and then turn the dial, select Detective Code, or use both.</p><textarea  id='plaintext-field'>WRITE YOUR SECRET MESSAGE HERE.</textarea><div id='current-letter' onclick=''>A</div><div id='dial-container'><div id='caesar-dial'></div><img id='decoder-image' src='images/extras/decoder.png'/><img alt='An illustration to rotate the wheel.' id='decoder-spin' src='images/extras/rotate.svg'></div></p><button class='detective-button' onclick='makeDetectiveCode()' id='dc-button'>PRESS FOR DETECTIVE CODE</button>";

        //whichBook();
        
        window.setTimeout(makeDecoderRing,0);
        
        //
    
    }
    
    if (name_thing == "live") {
        
        
        
        containerEl.innerHTML = "<p class='page-header'><img id='top-image' src='images/extras/theater.svg'/></p><p><strong>We don't have any events currently scheduled!</strong> But soon, there will be more announced!</p>";
        // If you live in the Los Angeles area, please attend one of our live productions below:</p><p><strong>• June 4, <a href='https:/murderattaras.com' target='_blank'>Murder at Tara's</a>:</strong> murder-mystery dinner theater! Two suspects, one body, one delicious Himalayan meal.<br><br><strong>• June 16, <a href='https://www.shopthelastbookstore.com/' target='_blank'>Murdle Release Party</a>:</strong> no tickets needed! Just show up to the Last Bookstore at 7 PM to solve a murder mystery!<br><br><strong>• June 22, <a href='https://www.secretmovieclub.com/calendar/clue-murder-mystery' target='_blank'>Murdle & a Movie</a>:</strong> Come to the Secret Movie Club in DTLA to solve an interactive Murdle Mystery and then watch <em>Clue</em> in 35mm!</p><p>More are coming soon, including virtual events and game nights throughout the UK. Join the Detective Club to receive updates!</p>
    
    } else if (name_thing == "library") { 
        
        
    
    } else if (name_thing == "club") {
        
        containerEl.innerHTML = "<p class='page-header'><img id='top-image' src='images/extras/fedora.svg'/><br>DETECTIVE CLUBHOUSE</p><p>Join us on the <a href='https://reddit.com/r/murdle' target='_blank'>subreddit</a>, <a href='https://discord.gg/kmyFvXJ44s' target='_blank'>Discord</a>, or <a href='https://www.facebook.com/groups/1501188563657432' target='_blank'>Facebook group</a>. Follow G. T. Karber on <a href='https://instagram.com/gregkarber' target='_blank'>Instagram</a> and <a href='https://tiktok.com/@gtkarber' target='_blank'>Tiktok</a><p>You currently have received the following Detective Club badges:</p><p id='badge-display'></p><p>You can earn more badges by helping out with Murdle, or on the subreddit or Discord. You can claim them by using the form below.</p><p><input type='text' id='password' placeholder='ENTER PASSWORD' /><button id='submit'>CLAIM</button></p><p>By collecting Detective Club badges, you can demonstrate your commitment to mystery solving.</p>";
        
        
setTimeout(function() {
    
    displayBadges();
    
    // List of passwords and corresponding badge strings

    var passwords = {
        "WRENCH": "wrench",
        "AKNIGHT": "knight",
        "BOOKER": "book",
        "DCODR": "cryptic",
        "PAINTR": "painting",
        "SOCIAL": "social",
        "ROSE": "rose"
        // Add more if necessary
    };

    // Retrieve badge array from local storage or create a new one
    badge_array = JSON.parse(localStorage.getItem('badge_array')) || [];
    
    document.getElementById('password').addEventListener('input', function() {
        this.value = this.value.toUpperCase();
    });

    
    
    document.getElementById('submit').addEventListener('click', function () {
        
        console.log("HELLO");
        
        var input = document.getElementById('password').value.toUpperCase();
        var badge = passwords[input];
        if ((badge) && (badge_array.indexOf(badge) == -1))  {
            badge_array.push(badge);
            localStorage.setItem('badge_array', JSON.stringify(badge_array));
            displayBadges();
        } else if (badge_array.indexOf(badge) != -1) {
            
            document.getElementById('password').value = "YOU ALREADY HAVE IT"
            
        } else {
            document.getElementById('password').value = "ERROR: DECLINED";
        }
    });
}, 0);
        
    }
    
    
    
    if (name_thing == "mansion") containerEl.innerHTML = "<p class='page-header'><img id='top-image' src='images/extras/mansion.svg'/></p><p class='nice-paragraph'><strong>Welcome to the Murdle Mansion</strong>, statistically speaking, the deadliest place online. Explore the rooms of this mansion to discover more about Murdle!</p><p class='nice-paragraph indent-paragraph'><a href='javascript:void(0)' onclick='newPage(\"suspect-gallery\")'>The Suspect Gallery</a>: <strong>see the suspects!</strong><br><a href='javascript:void(0)' onclick='newPage(\"attic\")'>The Attic</a>: <strong>view your streak.</strong><br><a href='https://murdle.com/console/' target='_blank'>The Computer Room</a>: <strong>login to the creepy computer terminal!</strong><br><strong><a href='https://murdle.com/authors/' target='_blank'>The Library</a>: play crossovers with other authors!</strong><br><strong><a href='https://murdle.com/crypt/' target='_blank'>Escape the Crypt</a>: a short, serialized mystery cryptogram!</strong><br><br><strong>The Greenhouse:</strong> Closed Due to Deaths.<br><strong>The Alchemy Lab:</strong> Closed Due to Explosions.<br><strong>The Hedge Maze:</strong> Closed Due to Disappearances.</p><p>Each of the closed rooms will be opening over the summer, as soon as the safety of our guests may be assured.</p>"; // <span id='char-emoji' class='emoji'>🏠</span><br>MURDLE MANSION
    
    if (name_thing == "suspect-gallery") {
        
        
        
        containerEl.innerHTML = "<p class='page-header'><span class='emoji random-color'>🎨</span></p><p class='nice-paragraph'><strong>In the heart of the Murdle Mansion</strong> is the Suspect Gallery, where framed paintings of the suspects hang on the walls. Most of the original art was stolen by the evil AI MORIARTY, so we are looking to hang new art by detectives.</p><p style='text-align: center'><select id='suspect-list' name='suspect' onchange='printSuspectBio(this)'><option value='' disabled='' selected=''>SELECT A SUSPECT</option></select></p><div id='suspect-bio'></div><div><strong>We are looking to hang new portraits to hang in the gallery!</strong> <a href='https://forms.gle/gTGMUH9AfLxPzp3v8' target='_blank'>Please submit your art to the gallery today!</a></div>"; // <span id='char-emoji' class='emoji'>🛋️</span><br>SITTING ROOM
        
        var all_suspects = document.getElementById('suspect-list');
        all_suspects.selectedIndex = 0;

        var suspect_name_list = Object.keys(suspect_details);
        
        suspect_name_list.sort();

        console.log(suspect_name_list);

        for (var a = 0; a < suspect_name_list.length; a++) {

            var opt = document.createElement('option');
            opt.value = suspect_name_list[a];
            opt.innerHTML = suspect_name_list[a];
            all_suspects.appendChild(opt);

        }
        
        if (mansion_nav.suspect != false) {
            justPrintingBio(mansion_nav.suspect);
            mansion_nav.suspect = false;
        }
        
    }
    
    if (name_thing == "attic") {
        
        containerEl.innerHTML = "<p class='page-header'><img id='top-image' src='images/extras/attic.svg'/></p><p class='nice-paragraph'><strong>Up in the attic,</strong> you have assembled a murdle wall displaying all the murdles you have solved, and the possible connections between them.</p><p>" + attic_data.streak() + "</p>";
    
    }

    
    if (name_thing == "get-hint") {
        
        Math.seedrandom(today_date_string + social_share.hint);
        
        
        
        social_share.hint++;
        console.log("getting hint!");
        containerEl.innerHTML = "<p class='page-header'><span id='char-emoji' class='emoji random-color'>🔮</span></p><p class='nice-paragraph'><strong>Inspector Irratino consulted " + proceduralcontent.irrational_art() + "</strong> and then pronounced his declaration:</p><p style='font-style: italic; margin-left: 2em;'>" + parseHintRule(newRuleType.simple()) + "</p><p>Logico listened to this, nodded, and then returned to the scene of the crime.";
    }
    
    if (name_thing == "errata") containerEl.innerHTML = "<p class='page-header'><span id='char-emoji' class='emoji'>📚</span><br>Errata from the Books</p><p class='nice-paragraph'><strong>Are you having trouble with the puzzles in the books?</strong> The first thing you should do is ask a friend! However, a couple of first editions have misprintings, likely caused by some nefarious murderer intent on thwarting the Detective Club's operations, and the following facts will help rectify those issues.</p><p class='nice-paragraph'><strong>#100, VOLUME 3 (\"EVEN MORE KILLER PUZZLES\")</strong></p><p class='nice-paragraph'>\"Look out down below!\" Deductive Logico screamed to the people in the newly renamed town, warning them about the disaster that was about to (quite literally) befall them.</p><p class='nice-paragraph'><strong>#61, VOLUME 1</strong><br><br>When Deductive Logico returned to the Island of Bad Dreams, on which he had seen such horrors, his eyes played tricks on him, and he saw duplicate clues instead of the true facts before him.<br><br>Fortunately, he could still hear the voice of Inspector Irratino, speaking from the great beyond, when he said, <strong>Whoever wanted to rob a grave was a Gemini.</strong><br><br>Perhaps, with this clue, he could solve the case.</p>"
    
    if (name_thing == "credits") containerEl.innerHTML = "<p class='page-header'><span id='char-emoji' class='emoji'>👏</span><br>CREDITS & FRIENDS</p><p class='credits-paragraph'><p class='credits-paragraph'><strong>PUZZLE & MYSTERY CONSULTANT</strong><br>Dan Donohue</p><p class='credits-paragraph'><p class='credits-paragraph'><strong>Astrology Consultant</strong><br>Bailey Norton</p><strong>LITERARY AGENT</strong><br>Melissa Edwards, Stonesong</p><strong>BOOK EDITOR</strong><br>Courtney Littler</p><strong>CREATIVE DIRECTOR</strong><br>Dani Messerschmidt</p><p class='credits-paragraph'><strong>CORPORATE ALLIES</strong><li><strong><a href='https://us.macmillan.com/publishers/st-martins-press/' target='_blank'>St. Martin's Press</a>:</strong> the official publisher of Murdle!</li><li><strong><a href='https://profilebooks.com/' target='_blank'>Profile Books</a>:</strong> our esteemed UK publisher</li><li><strong><a href='https://www.stonesong.com/' target='_blank'>Stonesong</a>:</strong> Murdle's literary agency</li><li><strong><a href='https://tarashimalayancuisine.com/' target='_blank'>Tara's Himalayan Cuisine</a>:</strong> the host of <a href='https://murderattaras.com' target='_blank' style='color: black'>Murder at Tara's</a>!</li><li><strong><a href='https://www.secretmovieclub.com/' target='_blank'>The Secret Movie Club</a>:</strong> our movie-mystery screening partner!</li><li><strong><a href='https://www.foulplayco.com/' target='_blank'>Foulplay Games</a>: </strong> women-owned murder-mystery-party company.</li><li><strong><a href='https://www.huntakiller.com/' target='_blank'>Hunt-a-Killer</a>:</strong> mystery boxes, delivered to you.</li></p><p class='credits-paragraph'><strong>ORIGINAL PLAYTESTERS</strong><br>Eva Darocha, Sherri Karber, Shannon Sanders, Julie Pearson, Chai Hecht, Lindsey Carlson, Levin Menekse, Eric Barnard, Eric Siegel & Dani Messerschmidt</p><p class='credits-paragraph'><strong>BOOK PLAYTESTERS</strong><br>Full list coming soon!</p><p class='credits-paragraph'><STRONG>INSPIRATION</STRONG><br>Agatha Christie, John Dickson Carr, Ellery Queen, Anthony E. Platt, Raymond Smullyan, & H. A. Ripley</p><p class='credits-paragraph'><STRONG>SPECIAL THANKS</strong><br>The Detective Club</p>";
    
    if (name_thing == "about") containerEl.innerHTML = `<p class='page-header'><span id='char-emoji' class='emoji random-color'>🕵️</span><br><strong>ABOUT</strong></p>
<p class='nice-paragraph'><strong>MURDLE is a murder-mystery puzzle game and <a href='https://murdle.com/book/' target='_blank'>worldwide bestselling book series</a> by G. T. Karber with the help of <a href='javascript:void(0)' onclick='newPage(\"credits\")'>many people</a>.</strong></p><p>In 2023, it was the Waterstones Gift of the Year, a Barnes & Noble Book of the Year, and the UK Christmas #1 book.</p><p>You can follow G. T. Karber on <a href='https://instagram.com/gregkarber' target='_blank'>Instagram</a>, <a href='https://tiktok.com/@gtkarber' target='_blank'>Tiktok</a>, <a href='https://twitter.com/gregkarber' target='_blank'>Twitter</a>, or <a href='https://bsky.app/profile/gtkarber.bsky.social' target='_blank'>Bluesky</a>. Chat with your fellow detectives on <a href='https://reddit.com/r/murdle' target='_blank'>Reddit</a> or <a href='https://discord.gg/kmyFvXJ44s' target='_blank'>Discord</a>.</p>

<p>The daily murdles are generated by MORIARTY, a proprietary algorithm capable of planning a 1,000,000 murders a minute. The hardest puzzle is on Saturday, but the biggest is on Sunday.</p><p>Murdle helps hone your mind and improve your logical thinking, and it's mostly family friendly (except for all the murders).</p>

<p><strong>The best way to support Murdle is to form a branch of the Detective Club with your friends or loved ones.</strong> Then, as a group, work through the puzzles in the books before moving on to solving mysteries in your neighborhood, school, or office.</p><p>The second best way is to join our mailing list below!</p>`;
    
    if (name_thing == "notebook") {
        
        document.getElementById("notebook-icon").classList.add("notebook-icon-invisible");
        document.getElementsByClassName("icon-emoji")[0].innerHTML = "🚫";
        document.getElementById("notebook-icon").classList.add("black-icon");
        
        containerEl.innerHTML = "<div id='notepage-notebook'>" + generateGrid() + "</div><p style='text-align: center'><textarea name='notepad' class='notepad-field' id='notepad' rows='5' placeholder='You might find it helpful to write notes or use the grid above to solve the case, although  pen and paper is perhaps preferable.' onInput='saveNotes(this.value)'></textarea></p>"; //"<p class='page-header'><span id='char-emoji' class='emoji random-color'>🔎</span><br><strong>NOTEBOOK</strong></p>"  +  <p style='text-align: center'><strong><a href='javascript:void(0)' onclick='noteBookReset()'>Reset Notebook</a></strong>
        //console.log(previous_notes);
        document.getElementById('notepad').textContent = previous_notes;
        
        if (tutorial_mode) tutorialGridFormat();
        
        whichBook();
        
        //lightSwitch();
        //console.log(document.getElementById('notepad').value)
        
    }
    
    if (name_thing == "mysteries") containerEl.innerHTML = "<p class='nice-paragraph'>GTK Mysteries is a brand of interactive murder mysteries written by <a href='https://gtkarber.com'>G. T. Karber</a>.</p>";
    
    if (name_thing == "notebook") {
        containerEl.innerHTML += '<p style="text-align: center"><input TYPE="button" NAME="button" class="opening-button" value="CLOSE NOTEBOOK" onClick="newPage(\'return\', true)"></p>'; 
        
        document.getElementById("title_head_full").style.display = "none";
        document.getElementById("club").style.display = "none";
        document.getElementById("chess-base").style.display = "none";
        document.getElementById("subheading").style.display = "none";
    }
    else if (name_thing != "return") {
        containerEl.innerHTML += '<p style="text-align: center"><input TYPE="button" NAME="button" class="opening-button" value="BACK TO MAIN" onClick="newPage(\'return\')"></p>'; 
        document.getElementById("title_head_full").style.display = "none";
        document.getElementById("club").style.display = "none";
        
    };
    
    if (name_thing != "return") {
        document.getElementById("mainbox").classList.add("keep-center");
        document.getElementById("subheading").classList.add("keep-center");
        document.getElementById("chess-base").classList.add("keep-center");
        document.getElementById("club").classList.add("keep-center");
        document.getElementById("mainbox").classList.remove("card-skeu");
        document.getElementById("club").style.display = "block";
        if (name_thing != "notebook") {
            document.getElementById("chess-base").style.display = "block";
            document.getElementById("subheading").style.display = "block";
        }
        window.scrollTo(0, 0);
        
       
    } else  {
        
        document.getElementById("mainbox").classList.remove("keep-center");
        document.getElementById("subheading").classList.remove("keep-center");
        document.getElementById("chess-base").classList.remove("keep-center");
        document.getElementById("club").classList.remove("keep-center");
        
    }
    
    //fillInDropDown();
    
    
    if (name_thing != "notebook") {
        document.getElementById("notebook-icon").classList.remove("notebook-icon-invisible");
        document.getElementById("notebook-icon").classList.remove("black-icon");
        document.getElementsByClassName("icon-emoji")[0].innerHTML = "📔";
        
        document.getElementById("club").style.display = "block";
        //document.getElementById("chess-base").style.display = "block";
        //document.getElementById("subheading").style.display = "block";
        
        //containerEl.classList.remove("notebook-skeu");
        document.body.className = "normal";
        
    } else if (name_thing != "return") {
        
        //containerEl.classList.add("notebook-skeu");
        document.body.className = "notebook";
        document.getElementById("club").style.display = "none";
        //document.getElementById("chess-base").style.display = "none";
        //document.getElementById("subheading").style.display = "none";
        
    }
    
    if ((name_thing == "get-hint") || (name_thing == "hint")) {
        
        document.body.className = "hint";
        console.log("trying");
    }
    
}

var grid_backup = false;
console.log("clearing the grid_backup");

function clickBox(location) {
    var filling = location.innerHTML;

    //classList is technically a set, so it is unordered...which means we can't reliably just grab index[1] & index[2], so:

    function getBoxInfo(element){
        let currentClassList = [...element.classList]
        let currentGroupID
        let currentBoxLetter
        let currentBoxNumber

        currentClassList.forEach(className => {
            if(className.includes("group")) {currentGroupID = className}
            if(className.includes("boxID-")) {[currentBoxLetter, currentBoxNumber] = className.split("-")[1].split("_")}
        });

        return [currentGroupID, currentBoxLetter, currentBoxNumber]
    }

    //the "group" is each 4x4, 5x5, 6x6 etc., grid within the notebook
    //so first we grab the group of the clicked box to confine our auto Xs to
    //the correct matrix
    const [clickedGroup, clickedLetter, clickedNumber] = getBoxInfo(location)
    const boxesQuery = [...document.querySelectorAll(`.${clickedGroup}`)]

    function getCrossSection(boxesQuery, currentBox){
        let crossSectionArray = []
        let [clickedGroup, clickedLetter, clickedNumber] = getBoxInfo(currentBox)
        boxesQuery.forEach(element => {
            let [x, currentLetter, currentNumber] = getBoxInfo(element)
            if (`${currentLetter}${currentNumber}` != `${clickedLetter}${clickedNumber}` &&
                ( currentLetter == clickedLetter || currentNumber == clickedNumber)){
                    crossSectionArray.push(element)}
            })
        return crossSectionArray
    }


    function filterCrossSection(crossSectionArray){
        let filteredList = [...crossSectionArray]
        for (let crossSectionBox of crossSectionArray){
            let innerCrossSection = getCrossSection(boxesQuery, crossSectionBox)
            for (let innerBox of innerCrossSection){
                if ( innerBox != location && innerBox.innerHTML.includes("✅")){
                    //because this condition is checking for "✅",
                    //this function call needs to happen *after* the innerHTML is changed
                    //to the green checkmark, as seen below
                    let index = filteredList.indexOf(crossSectionBox)
                    if (index > -1) {
                        filteredList.splice(index, 1)
                    }
                }
            }
        }
        return filteredList
    }

    function lockedSquare (currentBox){
        let crossSection = getCrossSection(boxesQuery, currentBox)
        for (let box of crossSection) {
            if (box.innerHTML.includes("✅")){
                return true
            }
        }
        return false
    }


    if (filling.indexOf("❓") != -1 && !lockedSquare(location)) {
        // lockedSquare checks to see if a green check mark exists in the boxes cross section
        location.innerHTML = "<span class='xando'>&nbsp;</span>";
//::::::::::::::::::::::: DELETE THIS TWO CONDITIONALS if you don't like the ?/X behavior::::::::::::::::::::::::::::
    } else if (filling.indexOf("❓") != -1 && lockedSquare(location)){
        location.innerHTML = "<span class='xando'>✖️</span>";
    //} else if (filling.indexOf("❌") != -1 && lockedSquare(location)) {
    //    location.innerHTML = "<span class='xando'>❓</span>";
//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    } else if (filling.indexOf("❌") != -1 && !lockedSquare(location)) {
        location.innerHTML = "<span class='xando'>✅</span>";
        //crossSection grabs the boxes in the same row and column as selected
        //do have to call this function *after* the selected box's innerHTML
        //has already been changed
        let crossSection = getCrossSection(boxesQuery, location)
        //filteredSection is all of the above boxes that do not exist in another
        //checkmark's cross section
        let filteredSection = filterCrossSection(crossSection, location)
        filteredSection.forEach(element => {
            //setting this filtersection to grey Xs, only if they are blank
            //i.e., manually placed red Xs or ?s will not get written over
            if (element.innerHTML.indexOf("&nbsp;") > -1){
                element.innerHTML = "<span class='xando'>✖️</span>";
            }
        })

    } else if (filling.indexOf("✅") != -1) {
        location.innerHTML = "<span class='xando'>❓</span>";
        let crossSection = getCrossSection(boxesQuery, location)
        let filteredSection = filterCrossSection(crossSection, location)
        filteredSection.forEach(element => {
            if(element.innerHTML.indexOf("✖️") > -1){
                element.innerHTML = "<span class='xando'>&nbsp;</span>"
            }
        });

    } else if (filling.indexOf("&nbsp;") != -1){
        location.innerHTML = "<span class='xando'>❌</span>";
    }

    grid_backup = document.getElementById("grid_backup").innerHTML;
    if (tutorial_mode != true) localStorage.setItem("savedGrid", grid_backup);

}

/*
function clickBox(location) {
    //console.log(location.innerHTML);
    
    
    
    var filling = location.innerHTML;
    if (filling.indexOf("❓") != -1) location.innerHTML = "<span class='xando'>&nbsp;</span>";
    else if (filling.indexOf("❌") != -1) location.innerHTML = "<span class='xando'>✅</span>";
    else if (filling.indexOf("✅") != -1) location.innerHTML = "<span class='xando'>❓</span>";
    else location.innerHTML = "<span class='xando'>❌</span>";
    
    grid_backup = document.getElementById("grid_backup").innerHTML;
    if (tutorial_mode != true) localStorage.setItem("savedGrid", grid_backup);
     
}*/

function noteBookReset() {
    
    grid_backup = false;
    console.log("clearing the grid_backup");
    newPage("return");
    newPage("notebook");
    
}

var grid_states = {
    blank: "",
    saved: ""
};

function saveTheGrid() {

     if (document.getElementById("mainpage-notebook") == null)  grid_states.saved = document.getElementById("notepage-notebook").innerHTML
    else grid_states.saved = document.getElementById("mainpage-notebook").innerHTML;
    
}

function restoreSave() {
    
    if (document.getElementById("mainpage-notebook") == null) document.getElementById("notepage-notebook").innerHTML = grid_states.saved;
    else document.getElementById("mainpage-notebook").innerHTML = grid_states.saved;
    
}

function clearGrid() {
    
    if (document.getElementById("mainpage-notebook") == null) document.getElementById("notepage-notebook").innerHTML = grid_states.blank;
    document.getElementById("mainpage-notebook").innerHTML = grid_states.blank;
    
}

function generateGrid(mainpage) {

    var grid_weapons = [];
    var grid_rooms = [];
    var grid_motives = [];
    var grid_names = [];

    if (mainpage == true) mainpage = false; // invert it for the grid
    else mainpage = true;

    console.log("mainpage: " + mainpage);

    for (var a = 0; a < names.length; a++) {

        suspect_details[solution_object.suspects[a].name].name = solution_object.suspects[a].name;

        grid_names.push(suspect_details[names[a]]);
        grid_rooms.push(rooms[a]);
        grid_weapons.push(weapons[a]);
        if (motive_mode) grid_motives.push(motives[a]);

    }

    console.log("these are the grid names::::", grid_names);

    //grid_weapons = shuffle(grid_weapons);
    //grid_rooms = shuffle(grid_rooms);
    //grid_names = shuffle(grid_names);
    //if (motive_mode) grid_motives = shuffle(grid_motives);

    //console.log(grid_backup);
    //console.log(grid_names);

    function labelGrid(label, number, vertical) {

        if (number == (Math.floor(size/2))) {
            if (!(vertical)) return `<div class='notebook-label'>${label}</div>`;
            else return `<div class='notebook-label-vertical'>${label}</div>`;
        }
        else return "";

    }


    //var shuffled_solution_object = solution_object.sort( () => Math.random() - 0.5);
    
    console.log("grid_backup: " + grid_backup);

    if ((grid_backup != false) && (grid_backup != "false")) {

        return "<div id='grid_backup'>" + grid_backup + "</div>";
        
    }
    else {

        var tablestart = '<div id="grid_backup"><div class="divTable blueTable"><div class="divTableHeading"><div class="divTableRow noborder"><div class="divTableHead noborder"><span class="xando">&nbsp;</span></div>';

        for (var a = 0; a < size; a++) {

            //console.log(grid_names[a]);

            tablestart += '<div class="divTableHead noborder bottombordered"><span href="javascript:void(0)" onclick="research(\'name\', \'' + grid_names[a].name + '\', ' + mainpage + ')" title="' + grid_names[a].name + '" class="grid_emoji" style="text-shadow: 0 0 0 ' + grid_names[a].color + ', 0 0 0 ' + grid_names[a].color + '">' + grid_names[a].emoji + '</span>' + labelGrid("SUSPECTS", a) + '</div>';

            //'<div class="divTableHead noborder bottombordered"><span class="grid_emoji" style="text-shadow: 0 0 0 ' + suspect_details[solution_object.suspects[a].name].color + '">' + suspect_details[solution_object.suspects[a].name].emoji + '</span></div>';

        }

        //shuffled_solution_object = solution_object.sort( () => Math.random() - 0.5);

        if (motive_mode) {

            for (var a = 0; a < size; a++) {

                const index_room_here = major_setting.rooms.map(e => e.name).indexOf(grid_rooms[a]);
                //console.log(index_room_here);

                tablestart += '<div class="divTableHead noborder"><span class="grid_emoji black_emoji" onclick="research(\'motive\', \'' + grid_motives[a]+ '\', ' + mainpage + ')" title="' + grid_motives[a] + '">' + motives_rich[grid_motives[a]].emoji + `</span>${labelGrid("MOTIVES", a)}</div>`;
            }

        }

        for (var a = 0; a < size; a++) {

            const index_room_here = major_setting.rooms.map(e => e.name).indexOf(grid_rooms[a]);
            //console.log(index_room_here);

            tablestart += '<div class="divTableHead noborder"><span onclick="research(\'room\', \'' + major_setting.rooms[index_room_here].name + '\', ' + mainpage + ')" title="' + major_setting.rooms[index_room_here].name + '" class="grid_emoji black_emoji">' + major_setting.rooms[index_room_here].emoji +  `</span>${labelGrid("LOCATIONS", a)}</div>`;
        }

        tablestart += '</div></div><div class="divTableBody">';

        //shuffled_solution_object = solution_object.sort( () => Math.random() - 0.5);

//:::::::::::::::::::::::::::::::::::::::::::::::::::::: BEGINNING INTERNAL OF GRID LOOPS::::::::::::::::::::::::::::::::::::::::::::::::

        var startingGroupID = 1 // only set this once before all 2 (or 3, with motive) loops
        var groupID = 1
        var charCodeInt = 65 // starting at "A" -- **will have to reset outside each loop, need to remember if ever adding another matrix

        for (var b = 0; b < size; b++ ) {

            //console.log(grid_weapons[b]);

            const index_weapon_here = major_setting.weapons.map(e => e.name).indexOf(grid_weapons[b]);

            //console.log(index_weapon_here);

            tablestart += `<div class="divTableRow noborder"><div class="divTableCell rightbordered noborder ">${labelGrid("WEAPONS", b, true)}<span href="javascript:void(0)" title="` + grid_weapons[b] + '" onclick="research(\'weapon\', \'' + grid_weapons[b] + '\', ' + mainpage + ')" class="grid_emoji black_emoji">' + major_setting.weapons[index_weapon_here].emoji +  `</span></div>`;

            if (motive_mode) var width = 3*size;
            else var width = 2*size;

            var index = 0

            for (var a = 0; a < width; a++) {
                function boxID() {
                    if (a == 0){ groupID = startingGroupID};
                    if ( a != 0 && a % size == 0) {index = 0; groupID ++};
                    var currentBoxNumber = index + 1; index ++;
                    var currentBoxLetter = String.fromCharCode(charCodeInt);
                    if (a == width-1) {charCodeInt += 1 }; //on final inner loop, set charCodeInt ahead for next row
                    return `group${groupID} boxID-${currentBoxLetter}_${currentBoxNumber} `;
                }

                function topB() {

                    if (b == 0) return "topbordered ";
                    else return "";

                }

                function bottomB() {

                    if (b == size - 1) return "bottombordered ";
                    else return "";

                }

                function rightB() {

                    if ((a == size - 1) || (a == (size * 2) - 1)|| (a == (size * 3) - 1)) return "rightbordered ";
                    else return "";


                }

                 function leftB() {

                    if (a == 0) return "leftbordered ";
                    else return "";


                }


                tablestart += `<div onclick="clickBox(this)" class="divTableCell ${boxID()} ${bottomB()}${rightB()}${topB()}${leftB()} bordered"><span class="xando">&nbsp;</span></div>`;


            }
            groupID = startingGroupID
            tablestart += "</div>";

        }
        startingGroupID += (width/size)

        var charCodeInt = 65 // have to reset this to "A" outside each outer loop
        for (var b = 0; b < size; b++ ) {

            const index_room_here = major_setting.rooms.map(e => e.name).indexOf(grid_rooms[b]);
            tablestart += '<div class="divTableRow noborder"><div title="' + major_setting.rooms[index_room_here].name + '" class="divTableCell noborder">' + labelGrid("LOCATIONS", b, true) + '<span onclick="research(\'room\', \'' + major_setting.rooms[index_room_here].name + '\', ' + mainpage + ')" class="grid_emoji black_emoji">' + major_setting.rooms[index_room_here].emoji + '</span></div>';

            if (motive_mode) var width = 2*size;
            else var width = size;

            var index = 0
            for (var a = 0; a < width; a++) {

                function boxID(){
                    
                    if (a == 0){groupID = startingGroupID}
                    if ( a != 0 && a % size == 0) {index = 0; groupID ++}
                    var currentBoxNumber = index + 1; index ++
                    var currentBoxLetter = String.fromCharCode(charCodeInt)
                    if (a == width-1) charCodeInt += 1 //on final loop, set charCodeInt ahead for next row
                    
                    console.log(`group${groupID} boxID-${currentBoxLetter}_${currentBoxNumber} `);
                    return `group${groupID} boxID-${currentBoxLetter}_${currentBoxNumber} `
                }
                

                function topB() {

                    if (b == 0) return "topbordered ";
                    else return "";

                }

                function bottomB() {

                    if (b == size - 1) return "bottombordered ";
                    else return "";

                }

                function rightB() {

                    if ((a == size - 1) || (a == size*2 - 1)) return "rightbordered ";
                    else return "";


                }

                 function leftB() {

                    if (a == 0) return "leftbordered ";
                    else return "";


                }

                tablestart += `<div onclick="clickBox(this)" class="divTableCell ${boxID()} ${bottomB()}${rightB()}${topB()}${leftB()} bordered"><span class="xando">&nbsp;</span></div>`;;

            }
            groupID = startingGroupID

            for (var a = 0; a < size; a++) {

                if ((!(motive_mode)) && (a == size-1) && (b == size - 1)) {
                    tablestart += '<div class="divTableCell noborder"><div id="floating-book"><a id="switch-icon" href="javascript:void(0)" onclick="lightSwitch()" class="black_emoji">💡</a><a href="javascript:void(0)" id="save-icon" onclick="saveTheGrid()" class="">💾</a><a href="javascript:void(0)" id="restore-icon" onclick="restoreSave()" class="">♻️</a><a href="javascript:void(0)" id="delete-icon" onclick="clearGrid()" class="">🗑️</a><a href="https://murdle.com/store/" target="_blank" ><img src="store/cover.jpeg"></a></div></div>';

                }
                else tablestart += '<div class="divTableCell noborder"><span class="xando">&nbsp;</span></div>'; // <div class="divTableCell noborder">

                //tablestart += '<div class="divTableCell noborder">&nbsp;</div>';



            }
            tablestart += "</div>";

        }
        startingGroupID += (width/size)

        if (motive_mode) {

                    console.log("looping motive mode");

            var charCodeInt = 65 // reset again
            for (var b = 0; b < size; b++ ) {
                
                console.log("looping b");

                const index_room_here = major_setting.rooms.map(e => e.name).indexOf(grid_rooms[b]);
                tablestart += '<div class="divTableRow noborder"><div class="divTableCell noborder">' + labelGrid("MOTIVES", b, true) + '<span class="grid_emoji black_emoji"  onclick="research(\'motive\', \'' + grid_motives[b]+ '\', ' + mainpage + ')" title="' + grid_motives[b] + '">' + motives_rich[grid_motives[b]].emoji + '</span></div>';
            //console.log(motives[b]);
                var index = 0
                for (var a = 0; a < size; a++) {
                    
                    console.log("looping a " + a);

                    function boxID(){
                        
                        
                    console.log("a: " + a); 
                        
                        if (a == 0){groupID = startingGroupID}
                        if ( a != 0 &&  a % size == 0) {index = 0; groupID ++}
                        var currentBoxNumber = index + 1; index ++
                        //var currentgroupID = groupID
                        var currentBoxLetter = String.fromCharCode(charCodeInt)
                        if (a == width/2-1) charCodeInt += 1 //on final outer loop, set carCodeInt "size" amount letters ahead
                        
                        
                        
                        console.log("width: " + width + "charCode:" + charCodeInt);
                        
                        return `group${groupID} boxID-${currentBoxLetter}_${currentBoxNumber} `;
                    }

                    function topB() {

                        if (b == 0) return "topbordered ";
                        else return "";

                    }

                    function bottomB() {

                        if (b == size - 1) return "bottombordered ";
                        else return "";

                    }

                    function rightB() {

                        if ((a == size - 1) || (a == size*2 - 1)) return "rightbordered ";
                        else return "";


                    }

                     function leftB() {

                        if (a == 0) return "leftbordered ";
                        else return "";


                    }
                    
                    var whattoadd = `<div onclick="clickBox(this)" class="divTableCell ${boxID()} ${bottomB()}${rightB()}${topB()}${leftB()} bordered"><span class="xando">&nbsp;</span></div>`;
                    
                    console.log("repeating");
                    console.log(whattoadd);
                    
                    

                    tablestart += whattoadd;

                }
                groupID = startingGroupID
                for (var a = 0; a < size*2; a++) {

                    if ((a == size*2-1) && (b == size-1)) tablestart += '<div class="divTableCell noborder"><div id="floating-book"><a id="switch-icon" href="javascript:void(0)" onclick="lightSwitch()" class="black_emoji">💡</a><a href="javascript:void(0)" id="save-icon" onclick="saveTheGrid()" class="">💾</a><a href="javascript:void(0)" id="restore-icon" onclick="restoreSave()" class="">♻️</a><a href="javascript:void(0)" id="delete-icon" onclick="clearGrid()" class="">🗑️</a><a href="https://murdle.com/book/" target="_blank" ><img src="store/cover.jpeg"></a></div></div>';
                    else tablestart += '<div class="divTableCell noborder">&nbsp;</div>';
                    //tablestart += '<div class="divTableCell noborder">&nbsp;</div>';

                }
                tablestart += "</div>";



            }
            groupID += width/size

        }
//: :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::END OF INTERNAL GRID LOOPS :::::::::::::::::::::::::::::::::::::::::::::::::
        tablestart += "</div></div></div></div>";


        if (grid_states.blank == "") grid_states.blank = tablestart;
        if (grid_states.saved == "") grid_states.saved = tablestart;

        console.log("The table html:::::", tablestart)
        return tablestart;

    }

    lightswitch();


}
/*
function generateGrid(mainpage) {
    
    var grid_weapons = [];
    var grid_rooms = [];
    var grid_motives = [];
    var grid_names = [];
    
    if (mainpage == true) mainpage = false; // invert it for the grid
    else mainpage = true;
    
    console.log("mainpage: " + mainpage);
    

    
    for (var a = 0; a < names.length; a++) {
        
       //
        
        suspect_details[solution_object.suspects[a].name].name = solution_object.suspects[a].name; 
        //
                                        
        grid_names.push(suspect_details[names[a]]);
        grid_rooms.push(rooms[a]);
        grid_weapons.push(weapons[a]);
        if (motive_mode) grid_motives.push(motives[a]);
        
    }
    
    console.log(grid_names);
    
    //grid_weapons = shuffle(grid_weapons);
    //grid_rooms = shuffle(grid_rooms);
    //grid_names = shuffle(grid_names);
    //if (motive_mode) grid_motives = shuffle(grid_motives);
    
    console.log(grid_backup);
    //console.log(grid_names);
    
    function labelGrid(label, number, vertical) {
        
        if (number == (Math.floor(size/2))) {
            if (!(vertical)) return `<div class='notebook-label'>${label}</div>`;
            else return `<div class='notebook-label-vertical'>${label}</div>`;
        }
        else return "";
        
    }
    
    
    //var shuffled_solution_object = solution_object.sort( () => Math.random() - 0.5);
    
    if ((grid_backup != false) && (grid_backup != "false")) {
        
        return "<div id='grid_backup'>" + grid_backup + "</div>";
    }
    else {

        var tablestart = '<div id="grid_backup"><div class="divTable blueTable"><div class="divTableHeading"><div class="divTableRow noborder"><div class="divTableHead noborder"><span class="xando">&nbsp;</span></div>';

        for (var a = 0; a < size; a++) {
            
            //console.log(grid_names[a]);

            tablestart += '<div class="divTableHead noborder bottombordered"><span href="javascript:void(0)" onclick="research(\'name\', \'' + grid_names[a].name + '\', ' + mainpage + ')" title="' + grid_names[a].name + '" class="grid_emoji" style="text-shadow: 0 0 0 ' + grid_names[a].color + ', 0 0 0 ' + grid_names[a].color + '">' + grid_names[a].emoji + '</span>' + labelGrid("SUSPECTS", a) + '</div>';
            
            //'<div class="divTableHead noborder bottombordered"><span class="grid_emoji" style="text-shadow: 0 0 0 ' + suspect_details[solution_object.suspects[a].name].color + '">' + suspect_details[solution_object.suspects[a].name].emoji + '</span></div>';

        }
        
        //shuffled_solution_object = solution_object.sort( () => Math.random() - 0.5);
        
        if (motive_mode) {
            
            for (var a = 0; a < size; a++) {

                const index_room_here = major_setting.rooms.map(e => e.name).indexOf(grid_rooms[a]);
                //console.log(index_room_here);

                tablestart += '<div class="divTableHead noborder"><span class="grid_emoji black_emoji" onclick="research(\'motive\', \'' + grid_motives[a]+ '\', ' + mainpage + ')" title="' + grid_motives[a] + '">' + motives_rich[grid_motives[a]].emoji + `</span>${labelGrid("MOTIVES", a)}</div>`;
            }
            
        }

        for (var a = 0; a < size; a++) {

            const index_room_here = major_setting.rooms.map(e => e.name).indexOf(grid_rooms[a]);
            //console.log(index_room_here);
            
            tablestart += '<div class="divTableHead noborder"><span onclick="research(\'room\', \'' + major_setting.rooms[index_room_here].name + '\', ' + mainpage + ')" title="' + major_setting.rooms[index_room_here].name + '" class="grid_emoji black_emoji">' + major_setting.rooms[index_room_here].emoji +  `</span>${labelGrid("LOCATIONS", a)}</div>`;
        }

        tablestart += '</div></div><div class="divTableBody">';
        
        //shuffled_solution_object = solution_object.sort( () => Math.random() - 0.5);

        for (var b = 0; b < size; b++ ) {
        
            //console.log(grid_weapons[b]);

            const index_weapon_here = major_setting.weapons.map(e => e.name).indexOf(grid_weapons[b]);
            
            //console.log(index_weapon_here);
            
            tablestart += `<div class="divTableRow noborder"><div class="divTableCell rightbordered noborder ">${labelGrid("WEAPONS", b, true)}<span href="javascript:void(0)" title="` + grid_weapons[b] + '" onclick="research(\'weapon\', \'' + grid_weapons[b] + '\', ' + mainpage + ')" class="grid_emoji black_emoji">' + major_setting.weapons[index_weapon_here].emoji +  `</span></div>`; 

            if (motive_mode) var width = 3*size;
            else var width = 2*size;
            
            for (var a = 0; a < width; a++) {
                
                function topB() {
                    
                    if (b == 0) return "topbordered ";
                    else return "";
                    
                }
                
                function bottomB() {
                    
                    if (b == size - 1) return "bottombordered ";
                    else return "";
                    
                }
                
                function rightB() {
                    
                    if ((a == size - 1) || (a == (size * 2) - 1)|| (a == (size * 3) - 1)) return "rightbordered ";
                    else return "";
                    
                    
                }
                
                 function leftB() {
                    
                    if (a == 0) return "leftbordered ";
                    else return "";
                    
                    
                }

                
                tablestart += '<div onclick="clickBox(this)" class="divTableCell ' + bottomB() + rightB() + topB() + leftB()+ 'bordered"><span class="xando">&nbsp;</span></div>';
                

            }

            tablestart += "</div>";


        }

        for (var b = 0; b < size; b++ ) {

            const index_room_here = major_setting.rooms.map(e => e.name).indexOf(grid_rooms[b]);
            tablestart += '<div class="divTableRow noborder"><div title="' + major_setting.rooms[index_room_here].name + '" class="divTableCell noborder">' + labelGrid("LOCATIONS", b, true) + '<span onclick="research(\'room\', \'' + major_setting.rooms[index_room_here].name + '\', ' + mainpage + ')" class="grid_emoji black_emoji">' + major_setting.rooms[index_room_here].emoji + '</span></div>';

            if (motive_mode) var width = 2*size;
            else var width = size;
            
            for (var a = 0; a < width; a++) {
                
                function topB() {
                    
                    if (b == 0) return "topbordered ";
                    else return "";
                    
                }
                
                function bottomB() {
                    
                    if (b == size - 1) return "bottombordered ";
                    else return "";
                    
                }
                
                function rightB() {
                    
                    if ((a == size - 1) || (a == size*2 - 1)) return "rightbordered ";
                    else return "";
                    
                    
                }
                
                 function leftB() {
                    
                    if (a == 0) return "leftbordered ";
                    else return "";
                    
                    
                }

                tablestart += '<div onclick="clickBox(this)" class="divTableCell ' + bottomB() + rightB() + topB() + leftB() + 'bordered"><span class="xando">&nbsp;</span></div>';

            }

            for (var a = 0; a < size; a++) {
                
                if ((!(motive_mode)) && (a == size-1) && (b == size - 1)) {
                    tablestart += '<div class="divTableCell noborder"><div id="floating-book"><a id="switch-icon" href="javascript:void(0)" onclick="lightSwitch()" class="black_emoji">💡</a><a href="javascript:void(0)" id="save-icon" onclick="saveTheGrid()" class="black_emoji">💾</a><a href="javascript:void(0)" id="restore-icon" onclick="restoreSave()" class="black_emoji">♻️</a><a href="javascript:void(0)" id="delete-icon" onclick="clearGrid()" class="black_emoji">🗑️</a><a href="https://murdle.com/book/" target="_blank" ><img src="book/cover.jpeg"></a></div></div>';
                    
                }
                else tablestart += '<div class="divTableCell noborder"><span class="xando">&nbsp;</span></div>'; // <div class="divTableCell noborder">
                
                //tablestart += '<div class="divTableCell noborder">&nbsp;</div>';
                
                

            }
            tablestart += "</div>";

        }
        
        if (motive_mode) {
            
        
            for (var b = 0; b < size; b++ ) {

                const index_room_here = major_setting.rooms.map(e => e.name).indexOf(grid_rooms[b]);
                tablestart += '<div class="divTableRow noborder"><div class="divTableCell noborder">' + labelGrid("MOTIVES", b, true) + '<span class="grid_emoji black_emoji"  onclick="research(\'motive\', \'' + grid_motives[b]+ '\', ' + mainpage + ')" title="' + grid_motives[b] + '">' + motives_rich[grid_motives[b]].emoji + '</span></div>';
            //console.log(motives[b]);

                for (var a = 0; a < size; a++) {

                    function topB() {

                        if (b == 0) return "topbordered ";
                        else return "";

                    }

                    function bottomB() {

                        if (b == size - 1) return "bottombordered ";
                        else return "";

                    }

                    function rightB() {

                        if ((a == size - 1) || (a == size*2 - 1)) return "rightbordered ";
                        else return "";


                    }

                     function leftB() {

                        if (a == 0) return "leftbordered ";
                        else return "";


                    }

                    tablestart += '<div onclick="clickBox(this)" class="divTableCell ' + bottomB() + rightB() + topB() + leftB() + 'bordered"><span class="xando">&nbsp;</span></div>';

                }
            
            for (var a = 0; a < size*2; a++) {

                if ((a == size*2-1) && (b == size-1)) tablestart += '<div class="divTableCell noborder"><div id="floating-book"><a id="switch-icon" href="javascript:void(0)" onclick="lightSwitch()" class="black_emoji">💡</a><a href="javascript:void(0)" id="save-icon" onclick="saveTheGrid()" class="black_emoji">💾</a><a href="javascript:void(0)" id="restore-icon" onclick="restoreSave()" class="black_emoji">♻️</a><a href="javascript:void(0)" id="delete-icon" onclick="clearGrid()" class="black_emoji">🗑️</a><a href="https://murdle.com/book/" target="_blank" ><img src="book/cover.jpeg"></a></div></div>';
                else tablestart += '<div class="divTableCell noborder">&nbsp;</div>';
                //tablestart += '<div class="divTableCell noborder">&nbsp;</div>';

            }
            tablestart += "</div>";
                
                

            }
            
        }
        
        tablestart += "</div></div></div></div>";
        

        if (grid_states.blank == "") grid_states.blank = tablestart;
        if (grid_states.saved == "") grid_states.saved = tablestart;
        
        
        return tablestart;
        
    }
    
    lightswitch();
    
    
}

*/

function updateGrid() {
    
   // console.log("Grid Updated!");
    
    grid_backup = document.getElementById("grid_backup").innerHTML;
    if (tutorial_mode != true) localStorage.setItem("savedGrid", grid_backup);
    
}

function lightSwitch() {
    
    var array_of_emoji = document.getElementsByClassName('black_emoji');
    ;
    
    for (var a = 0; a < array_of_emoji.length; a++) {
        array_of_emoji[a].classList.toggle("reveal_emoji");
    }
    
    updateGrid();
    
    
}
       
function saveNotes(notes) {

    
    previous_notes = notes;
    //console.log(previous_notes);
    

}

var begun = false;
    
document.body.addEventListener('click', beginIt, true); 
    
function beginIt() {
    //console.log('hello');
    begun = true;
    
}
    

    
function chessRandom() {
    
    
    
    var white_pieces = ["♘", "♗", "♘", "♗", "♖", "♕", "♔"];
    var black_pieces = ["♞", "♝", "♞", "♝", "♜", "♛", "♚"];
    
    var color_array = [];
    //color_array = colors.slice(0);
    
    color_array = ["#A30B37", "#A30B37", "#A30B37", "#A30B37", "#A30B37"];
    
    //console.log(color_array);
    
    //console.log(color_array.splice(Math.floor(Math.random()*color_array.length)));
    
    var random_line = [];
    
    while (white_pieces.length > 0) {
        
        random_line.push("<span style='color: " + color_array.splice(Math.floor(Math.random()*color_array.length), 1) + "'>" + white_pieces.splice(Math.floor(Math.random()*white_pieces.length), 1)[0] + "</span>");
        

        if (color_array.length == 0) {       
            //console.log(color_array);
        
            color_array = ["#A30B37", "#A30B37", "#A30B37", "#A30B37", "#A30B37"]; //colors.slice(0);
            //console.log(color_array);
        } else color_array.length;
        
        
        random_line.push("<span>" + black_pieces.splice(Math.floor(Math.random()*black_pieces.length), 1)[0] + "</span>");
        
        if (color_array.length == 0) color_array = ["#A30B37", "#A30B37", "#A30B37", "#A30B37", "#A30B37"]; // colors.slice(0);
    }
    document.getElementById("chess-base").style.display = "block";
    document.getElementById("chess-base").innerHTML = random_line.join("");
    
}

//       {
//            name: "",
//            victims : [],
//            weapons : [
//                {
//                    name: "",
//                    method: "",
//                    clue: ""
//                }
//            ],
//            rooms : [
//                {
//                    name: "",
//                    indoors: ""
//                }
//            ],
//            motives: []
//        },
    
var motive_list = ["to inherit a fortune", "to escape blackmail", "to hide an affair", "to silence a witness", "to rob the victim", "to see what it felt like to kill", "to break into the Industry", "to eliminate a spy", "to fight for the revolution", "to rage with jealousy", "to win an argument"];

var motives_rich = {
    "to inherit a fortune" : {
        emoji: "💰",
        description: "One of the oldest reasons to murder, right after God liking your brother's sacrifice more."
    },
    "to escape blackmail" : {
        emoji: "📭",
        description: "Blackmail can be very profitable, but all profits come with risks."
    },
    "to hide an affair" : {
        emoji: "👫🏾",
        description: "You never know who might be having an affair these days."
    },
    "to silence a witness" : {
        emoji: "🔕",
        description: "What did they see? Were they worth being killed over it?"
    },
    "to rob the victim" : {
        emoji: "🔫",
        description: "Maybe they a had a really expensive diamond on them? Or a cool hat.",
    },
    "to see what it felt like to kill" :{
        emoji: "💀",
        description: "Uh-oh. This is definitely one of the creepiest motives."
    },
    "to rage with jealousy" :{
        emoji: "❤️",
        description: "Logico has seen all sorts. He has seen someone be killed over a bagel."
    },
    "to fight for the revolution" :{
        emoji: "✊",
        description: "Power to the people! But first, power to this one particular warlord."
    },
    "to eliminate a spy" :{
        emoji: "🛰️",
        description: "Anybody could be a spy. And anybody might want to kill a spy. So anybody might want to kill anybody.",
    },
    "for the Church" :{
        emoji: "🙏",
        description: "Don't worry: the victim will be considered (in many ways) a martyr."
    },
    "to break into the Industry" :{
        emoji: "🏭",
        description: "People will do anything to break into the Industry. Even kill? Especially kill."
    },
    "to win an argument" :{
        emoji: "🗣",
        description: "Sometimes there is only one surefire way to win an argument."
    }
}
    
var motive_mode = false;
  
function countVowels(str) { 

    // find the count of vowels
    const count = str.match(/[aeiou]/gi).length;

    // return number of vowels
    return count;
}
    
// Where el is the DOM element you'd like to test for visibility
function isHidden(el) {
    return (el.offsetParent === null)
}
    

    

    
function replaceOpeningArticle(phrase) {
    
    //console.log("indexOf:" + phrase.indexOf('a'));
    
    if ((phrase.indexOf("a") == 0) && (phrase.indexOf("an") != 0)) phrase = phrase.replace("a", "the");
    else if (phrase.indexOf("an" == 0)) phrase = phrase.replace("an", "the");
    
    return phrase;
}

var today_day_number;
var today_day_word;
    
function dailyPuzzleSetup() {
    
    today_date = new Date();
    today_day_number = today_date.getDay();
    today_day_word = day_array[today_day_number];
    
    var options = { year: 'numeric', month: 'short', day: 'numeric' };
    
    //console.log(today_date);
    
    //console.log("SEED: " + today_date.getMonth() + today_date.getDate() + today_date.getFullYear());
    
    Math.seedrandom(today_date.getMonth() + "" + today_date.getDate() + "" + today_date.getFullYear() + 22); // REMOVE THE RANDOMIZER!
    
    daily_specs = puzzles_by_day[day_array[today_day_number]];
    
    if (tutorial_mode) var subtitle_string = "MINI-MURDLE FOR " + today_date.toLocaleDateString("en-US", options).toUpperCase();
    else var subtitle_string = "MURDLE FOR " + today_date.toLocaleDateString("en-US", options).toUpperCase();
    
    var theme_explanation = "<div id='theme-block'><p style='font-weight: bold' id='title-gen'></p><p style='font-weight: bold'>" + subtitle_string  + "</p><p style='font-style: italic'>"; // Saturday, September 17, 2016 + " • " + daily_specs.opening.toUpperCase() + 
    
    //console.log(day_array[today_day]);
    
    if (tutorial_mode) size = 3;
    else size = daily_specs.size;
    
    names = getTodaysSuspects(day_array[today_day_number]);
    
    if (tutorial_mode) hard_mode = false;
    hard_mode = daily_specs.hard;
    
    opening_theme_phrase = theme_explanation + "</p></div>"; // puzzles_by_day[day_array[today_day]].opening
    
}

    
function createAllNames() {
    
    for (const [key, value] of Object.entries(suspect_details)) {
      all_names.push(key);
    }
    
}
    
function createColors() {
    
    for (const [key, value] of Object.entries(suspect_details)) {
      colors.push(value.color.toLowerCase());
    }
    
}
    
function createSampleSets() {
    
    elements_in_evidence = [];
    
    //console.log(casenum);
    
    //console.log(pattern_orders);
    
    if (!(daily)) {
        
        size = pattern_orders[casenum].size;
        motive_mode = pattern_orders[casenum].motive;

        //console.log(size);

        if ((pattern_orders.length - 1) != casenum) {
            major_setting = randomSetting(settings_object_rich);
            while (past_settings.indexOf(major_setting.name) != -1) major_setting = randomSetting(settings_object_rich);
        } else {

            major_setting = jail_setting;

        }
        
    } else { 
        
        dailyPuzzleSetup();
        
        
        
        if (today_date_string == "03/15/23") major_setting = ides_setting;
        if (today_date_string == "03/17/23") major_setting = irish_setting;
        if (today_date_string == "04/20/23") major_setting = greenhouse_setting;
        else if (today_date_string == "12/25/24") major_setting = christmas_setting;
        else if (today_date_string == "08/29/22") major_setting = cover_setting;
        else if (today_date_string == "12/25/23") major_setting = christmas_setting;
        else if (today_date_string == "03/28/22") major_setting = hedge_setting;
        else if (today_date_string == "06/05/23") major_setting = missing_murdle_week.monday;
        else if (today_date_string == "06/06/23") major_setting = missing_murdle_week.tuesday;
        else if (today_date_string == "06/07/23") major_setting = missing_murdle_week.wednesday;
        else if ((today_date_string == "06/08/23") && (tutorial_mode == false)) major_setting = missing_murdle_week.thursday;
        else if ((today_date_string == "08/16/23") && (tutorial_mode == false)) major_setting = murdle_museum_settings.wednesday;
        else if (today_date_string == "11/13/25") major_setting = detective_day_setting;
        //else if (today_date_string == "06/09/23") major_setting = missing_murdle_week.friday;     
        else if (tutorial_mode) major_setting = deduction_college_setting;
        else if (today_day_word != "Sunday") major_setting = weekly_object[today_day_word].major_location;
        else major_setting = jail_setting;
        
        if (tutorial_mode) major_setting = deduction_college_setting;
        
        if (tutorial_mode) motive_mode = false;
        else motive_mode = daily_specs.motive;
        //console.log("daily_specs.motive: " + daily_specs.motive + " motive_mode setting: " + motive_mode);
        
       
    }
    
    major_setting.weapons.push(classic_weapons.random());
    
    //document.body.style.backgroundColor = major_setting.background;
    
    //console.log("major_setting");
    //console.log(major_setting);
    
    victim = major_setting.victims[Math.floor(Math.random()*major_setting.victims.length)];
    'use strict';
    good_details.push(randomElement(["the murdered " +  dropAorThe(victim), "the dead " +  dropAorThe(victim), "the body of the " +  dropAorThe(victim), "the no-longer-living " +  dropAorThe(victim), "the unfortunate demise of the "  +  dropAorThe(victim)]));
    
    //console.log(victim);
    
   // weapons = settings_object[major_setting].weapons.slice(0, size);
   // rooms = settings_object[major_setting].rooms.slice(0, size);
    
        // shuffle the all_names array (somehow?)
    shuffledweapons = shuffle(major_setting.weapons);

    // Get sub-array of first n elements after shuffled
    weapons = shuffledweapons.slice(0, size);
    
    for (var a = 0; a < weapons.length; a++) {
        
        weapons[a] = weapons[a].name;
        
        
        const index = major_setting.weapons.map(e => e.name).indexOf(weapons[a]);
        social_share.weapons += major_setting.weapons[index].emoji;
        
    }
    
        // shuffle the all_names array (somehow?)
    shuffledrooms = shuffle(major_setting.rooms);

    // Get sub-array of first n elements after shuffled
    rooms = shuffledrooms.slice(0, size);
    
    for (var a = 0; a < rooms.length; a++) {
        
        rooms[a] = rooms[a].name;
        
        const index = major_setting.rooms.map(e => e.name).indexOf(rooms[a]);
        social_share.locations += major_setting.rooms[index].emoji;
        
    }
    
    shuffle(all_names);

    // shuffle the all_names array (somehow?)
    //shuffled = shuffle(all_names);

    // Get sub-array of first n elements after shuffled
    //names = getTodaySuspects(); // shuffled.slice(0, size);
    
    for (var a = 0; a < names.length; a++) {
        
        social_share.suspects += suspect_details[names[a]].emoji;
        
    }
    
    
    if (motive_mode) {
        
        shuffled = shuffle(motive_list);
        motives = motive_list.slice(0, size);
    
    }
    
    
    
    
    //for (var a = 0; a < names.length; a++) {
        
    //    names[a] = names[a].name;
        
    //}
    
    //console.log(weapons);
    //console.log(rooms);
    //console.log(names);
    //console.log(motives);
    
}
    
var phrase_bank;

function resetEverything(reset, daily) {
    
    social_share = {
        title: "",
        suspects: "",
        weapons: "",
        locations: "",
        time: 0,
        hint: 0,
        streak: []
    };
    
    clockstop = false;
    timetaken = 0;
    
    var total_possibilities = [];
    
    createAllNames();
    
    createWeeklySuspects();
    
    console.log("motive_mode: " + motive_mode);
    
    
    
    if (!(reset)) casenum++;
    
    
    
    if (casenum == 2) {
        
        document.getElementById("title_head").classList.add("smallify");
        document.getElementById("subtitle").classList.add("smallify");
    
    }
    
    //tickingRainbow();
    
    var formattednames = [];
    var linkedweapons = [];
    var linkedrooms = [];
    var linkedmotives = [];
        
    suspect_array = [];
    solution_object = {};
    evidence_array = [];
    
    
    createSampleSets();
    
    if (motive_mode) accusation_object = {"killer" : "", "weapon" : "", "room" : "", "motive" : ""}; 
    else accusation_object = {"killer" : "", "weapon" : "", "room" : ""}; 
    
    
    
    generatePuzzle();

    // generating the whole page
    
    for (var a = 0; a < names.length; a++ ) {

        formattednames.push(colorPrint(names[a], undefined, true));

    }
    
    for (var a = 0; a < weapons.length; a++) {
        
        linkedweapons.push(linkPrint(weapons[a], "weapon"));
        
        
        
    }
    
    for (var a = 0; a < rooms.length; a++) {
        
        linkedrooms.push(linkPrint(rooms[a], "room"));

        
    }
    
    if (motive_mode) {
        
        for (var a = 0; a < names.length; a++) {
        
            //linkedmotives.push(linkPrint(motives[a], "motive"));
            linkedmotives.push(motives[a]);
        
        }
        
        
    } 
    
    //<p>" + proceduralcontent.little_phrases.evidenceOpener() + size + " suspects, weapons, & places, which Logico organized onto cards:", // + " <a href='javascript:void(0)'  class='item-link'  onclick='activeOne(\"suspect\", names)' id='suspect-link'>SUSPECTS</a>, <a  class='item-link' href='javascript:void(0)' onclick='activeOne(\"weapon\", weapons)' id='weapon-link'>WEAPONS</a> & <a  class='item-link' href='javascript:void(0)' onclick='activeOne(\"location\", rooms)' id='location-link'>LOCATIONS</a>, which Logico organized onto cards:", //"<p>" + proceduralcontent.openingLine() + "</p><p>" + proceduralcontent.little_phrases.evidenceOpener() + size + " suspects<strong> (" + formattednames.reduce((text, value, i, array) => text + (i < array.length - 1 ? ', ' : ' &amp; ') + value) + ")</strong>,  " + size + " weapons<strong> (" + linkedweapons.reduce((text, value, i, array) => text + (i < array.length - 1 ? ', ' : ' &amp; ') + value) + ")</strong>, and " + size + " locations<strong> (" + linkedrooms.reduce((text, value, i, array) => text + (i < array.length - 1 ? ', ' : ' &amp; ') + value) + ")</strong>.</p>",

    
    phrase_bank = {  /// RESET EVERYTHING!
        "opening_lines" : "<p>" + proceduralcontent.openingLine() + "</p>", 
        "introducing-evidence" : "<p>" +  proceduralcontent.little_phrases.ruleExplainer() +  " " + proceduralcontent.evidenceLine() + "</p>",
        "introducing_statements" : proceduralcontent.introducingStatements(),
        "before_accusation" : proceduralcontent.getAccusation(), // "Then, Deductive Logico did what he always did: deduct. Once he had ordered all the evidence, he was able to figure out whodunnit, with what, and where:",
        "not_guilty" : function() {
            if (!(daily)) {
                return proceduralcontent.notGuiltyLine() + '<div id="share-buttons"><p style="text-align: center"><input TYPE="button" NAME="button" value="SHARE HOW YOU DID" onClick="shareNow(true)"></p></div>';              
            } else {
                casenum = 0
                return proceduralcontent.notGuiltyLine() + '<p style="text-align: center"><input TYPE="button" NAME="button" value="START OVER" onClick="resetEverything(true)"></p>';
            }

        },
        "guilty" : function() {
            if (!(daily)) {
                return proceduralcontent.guiltyLine() + '<div id="share-buttons"><p style="text-align: center"><input TYPE="button" NAME="button" value="SHARE HOW YOU DID" onClick="shareNow()"></p></div>'; //'<p style="text-align: center"><input TYPE="button" NAME="button" value="SOLVE THE NEXT MYSTERY" onClick="resetEverything()"></p>';
            } else {
                return proceduralcontent.guiltyLine() + '<p style="text-align: center"><input TYPE="button" NAME="button" value="SOLVE THE NEXT MYSTERY" onClick="shareNow()"></p>';
            }
        },
        "incomplete_accusation" : "* You must select a suspect, weapon, and location!"
    };
    
    if (motive_mode)  phrase_bank.opening_lines = "<p>" + proceduralcontent.openingLine() + "</p>"; //<p>" + proceduralcontent.little_phrases.evidenceOpener() + size + " suspects, weapons, places, & motives, which Logico organized onto cards:"; // " <a href='javascript:void(0)' class='item-link' onclick='activeOne(\"suspect\", names)' id='suspect-link'>suspects</a>, <a href='javascript:void(0)' onclick='activeOne(\"weapon\", weapons)'  class='item-link' id='weapon-link'>weapons</a>, <a href='javascript:void(0)'  class='item-link' onclick='activeOne(\"location\", rooms)' id='location-link'>locations</a> & <a href='javascript:void(0)' onclick='activeOne(\"motive\", motives)' id='motive-link'>MOTIVES</a>, which Logico organized onto cards:"; // phrase_bank.opening_lines = proceduralcontent.openingLine() + "<br><br>" + proceduralcontent.little_phrases.evidenceOpener() + size + " suspects<strong> (" + formattednames.reduce((text, value, i, array) => text + (i < array.length - 1 ? ', ' : ' &amp; ') + value) + ")</strong>,  " + size + " weapons<strong> (" + linkedweapons.reduce((text, value, i, array) => text + (i < array.length - 1 ? ', ' : ' &amp; ') + value) + ")</strong>, " + size + " locations<strong> (" + linkedrooms.reduce((text, value, i, array) => text + (i < array.length - 1 ? ', ' : ' &amp; ') + value) + ")</strong>, and " + size + " motives <strong>(" + linkedmotives.reduce((text, value, i, array) => text + (i < array.length - 1 ? ', ' : ' &amp; ') + value) + ")</strong>.</p>";

 
    dealFlippableCards("back", names);
    //dealCards("weapons", weapons);
    //dealCards("locations", rooms);
    

    
    addOptionsToLists();
    
    document.getElementById('accuse-form').style.display = "block";
    
    
    
    setUpPage();
    
    
    window.scrollTo(0, 0);
    //document.getElementById("mainbox").scrollIntoView();
    
}

var current_type_flipped = "backs";

function activeOne(which, what) { // which is the type, what is the array
    console.log(which);
    console.log(current_type_flipped);
    
    if (which != current_type_flipped) flipCards(which, what);
    current_type_flipped = which;
    document.getElementById('suspect-link').style.color = "black";
    document.getElementById('weapon-link').style.color = "black";
    document.getElementById('location-link').style.color = "black";
    if (motive_mode) document.getElementById('motive-link').style.color = "black";
    document.getElementById(which + '-link').style.color = "#A30B37";
    
    if ((first_day) || (tutorial_mode)) {document.getElementById('card-explainer').innerHTML = "Pick Up Cards to Learn More".toUpperCase();}
    
}
    
function linkPrint(name, type) {
    
    //console.log(name + " " + type);
    
    if (type == "room") var printname = trimLocation(name);
    else var printname = name;
    
    if (research_mode) return '<a href="javascript:void(0)" onclick="research(\'' + type + '\',\'' + name + '\')" style="color: black">' + printname + '</a>';
    else return printname;
}
    
function colorPrint(name, following, link) {
    
    if (following == undefined) following = "";
    if ((link) && (research_mode)) return "<a href='javascript:void(0)' onclick='research(\"name\",\"" + name + "\")' style='color: " + suspect_details[name].color + "'>" + name + following + "</a>";
    else return "<span style='color: " + suspect_details[name].color + "'>" + name + following + "</span>";
    
}
    
function setUpPage() {
    
    document.getElementById("accuse-form").style.display = "block";
    
    var tutorial_pitch = "";
    
    document.getElementById("setup").innerHTML = phrase_bank.opening_lines;
    
    document.getElementById("evidence-intro").innerHTML = phrase_bank["introducing-evidence"];
    if ((casenum >= SWITCH_TO_STATEMENTS) || ((daily) && (daily_specs.statements) && (!(tutorial_mode)))) document.getElementById("statement-intro").innerHTML = phrase_bank.introducing_statements;
    document.getElementById("accusation-intro").innerHTML = phrase_bank.before_accusation;
    document.getElementById("answer-field").innerHTML = "";
    
    social_share.title = proceduralcontent.titleGenerator();
    
    if (tutorial_mode) {
        
        document.getElementById("title-gen").innerHTML = "<span style='color: black; text-decoration: underline;'>DAILY MINI-MURDLE</span><br>" + social_share.title;
        
    }
    else document.getElementById("title-gen").innerHTML = social_share.title;
    startTheClock();
    
}

function startTheClock() {
    window.setTimeout(tickTock, 1000);
}

function tickTock() {
    
    if (clockstop == false) {
        
        timetaken++;
        window.setTimeout(tickTock, 1000);
        
    }
    
}
    
function guiltyPlea() {

    
    
}
    
function notGuiltyStatement() {
    
    
    
}
    
function clearPage() {
    
    document.getElementById("setup").innerHTML = "";
    document.getElementById("statement-intro").innerHTML = "";
    document.getElementById("accusation-intro").innerHTML = "";
    
}
    
function tickingRainbow() {
    
    for (var a = 0; a < colorarray.length; a++) {
        
        colorarray[a].style.color = colors[a % colors.length];
        
    }
    
    rainbowTick(0); 
    
}
    
function convertTime() {
    
    var minutes = Math.floor(social_share.time / 60);
    var seconds = social_share.time % 60;
    
    if (seconds < 10) seconds = "0" + seconds;
    
    minutes = numberToEmoji(minutes);
    seconds = numberToEmoji(seconds);
    
    return minutes + ":" + seconds;
    
}
    
function numberToEmoji(number) {
    
    //console.log(number);

    number = number.toString();
    
    //console.log(number);
    
    return number.replace(/0/g, "0️⃣").replace(/1/g, "1️⃣").replace(/2/g, "2️⃣").replace(/3/g, "3️⃣").replace(/4/g, "4️⃣").replace(/5/g, "5️⃣").replace(/6/g, "6️⃣").replace(/7/g, "7️⃣").replace(/8/g, "8️⃣").replace(/9/g, "9️⃣");
    
}

var answers = {
    personRight: function() {
        if (thekiller.name == accusation_object.killer) return "✅";
        else return "❌";
    },
    weaponRight: function() {
        
        if (thekiller.weapon == accusation_object.weapon) return "✅";
        else return "❌";
    },
    locationRight: function() {
        
        if (thekiller.room == accusation_object.room) return "✅";
        else return "❌";
    },
    motiveRight: function() {
        
        if (thekiller.motive == accusation_object.motive) return "✅";
        else return "❌";
    },
    numberOfHints: function() {
        var string = "";
        
        if (social_share.hint != false)  string ="\n";
        //console.log(string);
        //console.log(social_share.hint);
        for (var a = 0; a < social_share.hint; a++) {
            
            string += "🔮";
            
        }
        
        if (social_share.hint != false)  string += "\n";
        
       // if (social_share.hint > 0) string += "";
        
        return string;
    },
    streak: function() {
        if ((thekiller.name == accusation_object.killer) && (thekiller.weapon == accusation_object.weapon) && (thekiller.room == accusation_object.room) && ((motive_mode == false) || (thekiller.motive == accusation_object.motive))) {
            
            console.log(streak_data.streak);
            
            
            var streak_string = "";

            for (var a = 0; a < streak_data.streak.length - 1; a++) {

                streak_string += streak_data.streak[a];

            }

            streak_string += "👤";
            
            return streak_string;
            
            
        } else return "❌";
    }
    
}

function socialShareFormat() {
           // console.log("thekiller: "); console.log(thekiller);
    
    var options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    
    //return social_share.title + "\n\n" + "👤🔪🏠\n" + answers.personRight() + answers.weaponRight() + answers.locationRight() + "\n" + convertTime() + "\n" + answers.numberOfHints() + "🕵️" + answers.streak();
    
    return social_share.title + "\nMURDLE FOR " + today_date.toLocaleDateString("en-US", options) + "\n\n" + "👤" + answers.personRight() + "      ⏱" + convertTime() + "\n🔪" + answers.weaponRight() + "\n🏚️" + answers.locationRight() + "\n" + answers.numberOfHints() + "\n" + "⚖️" + answers.streak();
    
}

function newSocialShareFormat() {
  
    var options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    
    //return social_share.title + "\n\n" + "👤🔪🏡\n" + answers.personRight() + answers.weaponRight() + answers.locationRight() + "\n" + convertTime() + "\n" + answers.numberOfHints() + "🕵️" + answers.streak();
    
    // "\n𝙼𝚄𝚁𝙳𝙻𝙴 𝙵𝙾𝚁 " + today_date.toLocaleDateString("en-US", options).replace("/", "/").replace("1","𝟷").replace("2","𝟸").replace("3","𝟹").replace("4","𝟺").replace("5","𝟻").replace("6","𝟼").replace("7","𝟽").replace("8","𝟾").replace("9","𝟿").replace("0","𝟶")
    
    if (!(tutorial_mode)) {
        
        if (motive_mode) {
            
            var string_to_return = social_share.title + "\nMurdle for " + today_date.toLocaleDateString("en-US", options) + "\n\n" + "👤🔪🏡❓     🕰️" + "\n" + answers.personRight() + answers.weaponRight() + answers.locationRight() + answers.motiveRight() + "     " + convertTime() +  "\n" + answers.numberOfHints() + "\n" + "⚖️\n" + answers.streak() + "\n\n";
            
        } else {
            
            var string_to_return = social_share.title + "\nMurdle for " + today_date.toLocaleDateString("en-US", options) + "\n\n" + "👤🔪🏡     🕰️" + "\n" + answers.personRight() + answers.weaponRight() + answers.locationRight() + "     " + convertTime() + "\n" + answers.numberOfHints() + "\n" + "⚖️\n" + answers.streak() + "\n\n";
        }
        
        
    } else {
        
        var string_to_return = social_share.title + "\nMini-Murdle for " + today_date.toLocaleDateString("en-US", options) + "\n\n" + "👤🔪🏡     🕰️" + "\n" + answers.personRight() + answers.weaponRight() + answers.locationRight() + "     " + convertTime() + "\n" + answers.numberOfHints() + "\n\n";
        
    }
    
    
    return string_to_return + "";
    
    
}
    
function shareNow() {
    
    var text_to_share = newSocialShareFormat();
    
    window.mobileAndTabletCheck = function() {
      let check = false;
      (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
      return check;
    };
    
    console.log(text_to_share);

    if ((navigator.share) && (window.mobileAndTabletCheck())) {

        navigator.share({
            title: 'MURDLE by G. T. Karber',
            text: text_to_share,
            url: "https://murdle.com"
          });

    } else {
        
        navigator.clipboard.writeText(text_to_share + "https://murdle.com");
        
        var share_buttons = document.getElementById("share-buttons");
        
        share_buttons.innerHTML = '<p style="text-align: center"><input TYPE="button" NAME="button" style="background: #A30B37" value="COPIED TO CLIPBOARD"></p><p style="text-align: center"><input TYPE="button" NAME="button" value="SHARE ON FACEBOOK" onClick="shareOnFB()"></p><p style="text-align: center"><input TYPE="button" NAME="button" value="SHARE ON TWITTER" onClick="shareOnTwitter()"></p>';
        
    }

}
    
function shareOnFB(text) {
    
    window.open("https://www.facebook.com/sharer/sharer.php?u=https://murdle.com");
}
    
function shareOnTwitter(text) {
    
    var text = newSocialShareFormat();
    
    window.open("https://twitter.com/intent/tweet?text=" + encodeURI(text) + "https%3A//murdle.com");
    
}
    
function rainbowTick(num) {
    
    var one_shot = JSON.parse(JSON.stringify(colors));
    
    for (var a = 0; a < colorarray.length; a++) {
        colorarray[a].style.color = one_shot.splice(Math.floor(Math.random()*one_shot.length), 1)[0];
        //num++
    }
    
    //num++;
    setTimeout(rainbowTick, 1000, num);
    
}

    
function multiRainbow() {
    
    var theword = "MANY-SPLENDORED" // "MANYSPLENDORED";
    
    for (var a = 0; a < colorarray.length; a++) {
        
        colorarray[a].style.color = colors[a % colors.length];
        
    }
    
    rainbowify(0);
    
}
    
function rainbowify(num) {
    
    //console.log(num);
    //console.log(rgb2hex(colorarray[num % colorarray.length].style.color));
    //console.log(colors.indexOf(rgb2hex(colorarray[num % colorarray.length].style.color)));
    
    //console.log(colors[(colors.indexOf(rgb2hex(colorarray[num % colorarray.length].style.color)) + 1) % colors.length]);
    //console.log((colors.indexOf(colorarray[num % colorarray.length].style.color));
    //colorarray[num % colorarray.length].style.color = colors[(colors.indexOf(rgb2hex(colorarray[num % colorarray.length].style.color)) + 1) % colors.length];
    colorarray[num % colorarray.length].style.color = colors[num % colors.length];
        //colors[Math.floor(Math.random() * colors.length)]; // num % colors.length
    num++;
    if ((num < Math.floor(Math.random()*30) + 100)) setTimeout(rainbowify, 12, num); // 223
    
}
    
const rgb2hex = (rgb) => `#${rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/).slice(1).map(n => parseInt(n, 10).toString(16).padStart(2, '0')).join('')}`

    
function removeOptions(selectElement) {
   var i, L = selectElement.options.length - 1;
   for(i = L; i >= 1; i--) {
      selectElement.remove(i);
   }
}
    
function addOptionsToLists() {
    
    var suspects = document.getElementById('suspect');
    removeOptions(suspects);
    suspects.selectedIndex = 0;
    
    for (var a = 0; a < names.length; a++) {
        
        var opt = document.createElement('option');
        opt.value = names[a];
        opt.innerHTML = names[a];
        suspects.appendChild(opt);
        
    }
    
    var armaments = document.getElementById('weapon');
    removeOptions(armaments);
    armaments.selectedIndex = 0;
    
    for (var a = 0; a < weapons.length; a++) {
        
        var opt = document.createElement('option');
        opt.value = weapons[a];
        opt.innerHTML = weapons[a];
        armaments.appendChild(opt);
        
    }
    
    var locations = document.getElementById('room');
    removeOptions(locations);
    locations.selectedIndex = 0;
    
    for (var a = 0; a < rooms.length; a++) {
        
        var opt = document.createElement('option');
        opt.value = rooms[a];
        opt.innerHTML = trimLocation(rooms[a]);
        locations.appendChild(opt);
        
    }
    
    if (motive_mode) {
    
    var motive_selections = document.getElementById('motive');
    removeOptions(motive_selections);
    motive_selections.selectedIndex = 0;
    
    for (var a = 0; a < motives.length; a++) {
        
        var opt = document.createElement('option');
        opt.value = motives[a];
        opt.innerHTML = trimLocation(motives[a]);
        motive_selections.appendChild(opt);
        
        
    }
        
        document.getElementById("hidden-motive").style.display = "block";
        
    } else document.getElementById("hidden-motive").style.display = "none";
    
    
}
    
function trimLocation(theroom) {
    
    if (theroom.toLowerCase().indexOf("on") == 0) { 
        return theroom.slice(3);
    }
    else return theroom;
    
}

function timePassed() {
    
    const dateOne = today_date; // 20th April 2021
    const dateTwo = new Date(); // 10th March 2021
    const difference = dateTwo.getTime() - dateOne.getTime();
    return Math.floor(difference / 1000); // 3542400
    
}

var have_they_been_flipped = false;

function flipAccusationCards(time) {
    
    if (time === undefined) time = 450;
    
    if (have_they_been_flipped == false) {
        
        have_they_been_flipped = true;
        
        var array_of_cards_both = document.getElementsByClassName('flip-card-inner-accuse');

        console.log(array_of_cards_both.length);

        var cardAccuseFlipLoop = function(a) {

            array_of_cards_both[a].classList.toggle("flip-it");

            a++;

            if (a < array_of_cards_both.length) {
                setTimeout(cardAccuseFlipLoop, time, a);            
            } else {
                 setTimeout(revealFinalParagraph, time, a);  

            }


        }

        cardAccuseFlipLoop(0);
        
        
    }
    
}

function revealFinalParagraph() {
    
    var answer_field = document.getElementById("answer-field");
    
    document.getElementById("accuse-button").style.display = "none";
    
    if (guilty_as_charged) {
        
     answer_field.innerHTML += proceduralcontent.guiltyLine();
        
    } else {
        
       answer_field.innerHTML += proceduralcontent.notGuiltyLine(); 
        
    }
    
    answer_field.innerHTML += '<div id="murdle-book-message"><a href="https://murdle.com/store/"><div id="ad-insert"><img src="store/cover.jpeg"><div id="ad-header">Check out the many Murdle books and puzzles!</div><div style="width:70%" id="ad-text-two">DEDUCTIVE LOGICO AND INSPECTOR IRRATINO STAR IN MANY BOOKS OF MURDLE MYSTERIES!</div></div></div></a><div id="share-buttons"><p style="text-align: center"><input TYPE="button" NAME="button" value="SHARE HOW YOU DID" onClick="shareNow(true)"></p></div>'; // <a target="_blank" href="https://murdle.com/book/">PRE-ORDER MURDLE: VOL 1</a>  •&nbsp;
    

    
}

var guilty_as_charged = false;
    
function checkAccusation(form, reset) {
    
    Math.seedrandom(today_date_string);
    
    clockstop = true;
    if (reset) social_share.time = streak_data.last_guess.time;
    else {
        social_share.time = timetaken;
        console.log(timePassed());
        console.log(timetaken);
    }
    
    
    
    var answer_field = document.getElementById("answer-field");
    answer_field.innerHTML = "";
    
    if (motive_mode) accusation_object = {"killer" : "", "weapon" : "", "room" : "", "motive" : ""};
    accusation_object = {"killer" : "", "weapon" : "", "room" : ""};
    
    if (reset) {
        
        accusation_object.killer = streak_data.last_guess.killer;
        accusation_object.weapon = streak_data.last_guess.weapon;
        accusation_object.room = streak_data.last_guess.room;
        if (motive_mode) accusation_object.motive = streak_data.last_guess.motive;

    } else {
        
        streak_data.last_guess.killer = document.getElementById('accuse-form').elements['suspect'].value;
        streak_data.last_guess.weapon = document.getElementById('accuse-form').elements['weapon'].value;
        streak_data.last_guess.room = document.getElementById('accuse-form').elements['room'].value;
        if (motive_mode) streak_data.last_guess.motive = document.getElementById('accuse-form').elements['motive'].value;
        
        accusation_object.killer = streak_data.last_guess.killer;
        accusation_object.weapon = streak_data.last_guess.weapon;
        accusation_object.room = streak_data.last_guess.room;
        if (motive_mode) accusation_object.motive = streak_data.last_guess.motive;
        
    }
    
    
    var error = false;
    
    for (const key in accusation_object) {

        if (accusation_object[key] == "") error = true;
        
    }
    
    if (error == true) answer_field.innerHTML = phrase_bank.incomplete_accusation;
    else {
        
            console.log(accusation_object);
    
            document.getElementById('accuse-form').style.display = "none";
    
            var killer_object = returnSuspectByName(solution_object.killer, solution_object.suspects);
    
            //console.log(killer_object);
        
            var accuse_line = '<p><strong>"It was ' + accusation_object.killer + ' with ' + accusation_object.weapon + " " + inOrNot(accusation_object.room) + " " + accusation_object.room + proceduralcontent.little_phrases.motive_addition() + '!</strong> Deductive Logico declared.</p>';
        
            guilty_as_charged = false;
        
            answer_field.innerHTML = "<p style='text-align: center; font-weight: bold; font-size: 180%;'>RESOLUTION</p>" + accuse_line + "<div style='color: black' id='filebox-accusation'></div>" + '<p style="text-align: center"><input TYPE="button" NAME="button" class="opening-button" id="accuse-button" onclick="flipAccusationCards()" value="WAS HE RIGHT?" onClick=""></p>';
    
            dealAccusationCards(accusation_object);
        
            var accusation_card_array = document.getElementsByClassName("flip-card-back-accuse");
        
            
            for (var a = 0; a < accusation_card_array.length; a++) {
                
                if (a == 0) var category = "SUSPECT";
                if (a == 1) var category = "WEAPON";
                if (a == 2) var category = "LOCATION";
                if (a == 3) var category = "MOTIVE";
                
                console.log(category);
                
                var correct_image = "<div class='innest'><div class='file-emoji emoji' style=\"font-size: 450%; text-shadow: 0 0 0 #2a8b70, 0 0 0 #2a8b70 \"'>✔️</div><div class='file-name'>" + category + "</div></div>";
                var incorrect_image = "<div class='innest'><div class='file-emoji emoji' style=\"font-size: 450%; text-shadow: 0 0 0 #A30B37, 0 0 0 #A30B37 \"'>⚔️</div><div class='file-name'>" + category + "</div></div>";
                
                console.log(correct_image);
        
                
                if (a == 0) {
                    
                    if (accusation_object.killer == killer_object.name) accusation_card_array[a].innerHTML = correct_image;
                    else accusation_card_array[a].innerHTML = incorrect_image;
                    console.log("name");
                    
                } else if (a == 1) {
                    
                    if (accusation_object.weapon == killer_object.weapon) accusation_card_array[a].innerHTML = correct_image;
                    else accusation_card_array[a].innerHTML = incorrect_image;
                    console.log("weapon");
                    
                } else if (a == 2) {
                    
                    if (accusation_object.room == killer_object.room) accusation_card_array[a].innerHTML = correct_image;
                    else accusation_card_array[a].innerHTML = incorrect_image;
                    console.log("room");
                    
                } else if (a == 3) {
                    
                    if (accusation_object.motive == killer_object.motive) accusation_card_array[a].innerHTML = correct_image;
                    else accusation_card_array[a].innerHTML = incorrect_image;
                    console.log("motive");
                    
                }
                
                
                console.log(accusation_card_array[a].innerHTML);
                
                
            }
            
        
            if (((accusation_object.killer == killer_object.name) && (accusation_object.weapon == killer_object.weapon) && (accusation_object.room == killer_object.room)) && ((motive_mode == false) || (accusation_object.motive == killer_object.motive))) { 
                
               // var = killer_object.name
                
                past_settings.push(major_setting.name);
                
                all_names.splice(all_names.indexOf(killer_object.name));
                
                // ADD LAST CORRECT DATE TO THE STREAK OBJECT
                
                // IF THIS IS THE FIRST TIME, ADD THE LAST TO THE STREAK
                // AND STORE BACK THE RESULTS
                
                
                if (!(reset) && (!(tutorial_mode))) {
                    
                    if ((streak_data.last_date_solved == yesterday_date_string) || (streak_data.last_date_solved == today_date_string)) streak_data.streak.push(suspect_details[killer_object.name].emoji);
                    else streak_data.streak = [suspect_details[killer_object.name].emoji];
                    
                    streak_data.last_date_solved = today_date_string;
                    
                    var day_to_number = {
                     
                        "Monday" : Math.floor(5 + Math.random() * 5),
                        "Tuesday" : Math.floor(7 + Math.random() * 8),
                        "Wednesday" : Math.floor(9 + Math.random() * 11),
                        "Thursday" : Math.floor(8 + Math.random() * 15),
                        "Friday" : Math.floor(11 + Math.random() * 16),
                        "Saturday" : Math.floor(15 + Math.random() * 20),
                        "Sunday" : Math.floor(12 + Math.random() * 20),
                        
                    }
                    
                    mystery_bonus = day_to_number[today_day_word];
                    
                    mystery_bucks += mystery_bonus;
                    
                }
                    
                //answer_field.innerHTML = "<p style='text-align: center; font-weight: bold; font-size: 180%;'>RESOLUTION</p><div id='filebox-accusation'></div><p class='card-subtitle'></p>"; // + phrase_bank.guilty();
                if (!(tutorial_mode)) syncBackStreak();
                guilty_as_charged = true;
            
            } else {
                
                //answer_field.innerHTML = "<p style='text-align: center; font-weight: bold; font-size: 180%;'>RESOLUTION</p><div id='filebox-accusation'></div>"; // + phrase_bank.not_guilty();
                casenum;
                
                // CLEAR THE STREAK VALUE
                // BUT KEEP THE LAST GUESS
                // SYNC THE STREAK VALUE WITH LOCAL AGAIN
                
                if (!(tutorial_mode)) {
                    
                
                    streak_data.streak = [""];
                    syncBackStreak();
                    
                    
                }
                
            }
        
            if (reset) {
                
                flipAccusationCards(0);
            }
        
            
    }
    
    //window.scrollTo(0,document.body.scrollHeight);

    
}

function syncMoney() {
    
    localStorage.setItem("mystery_bucks", JSON.stringify(mystery_bucks));
    
}

function syncBackStreak() {
    
    // syncing data back
    
    streak_data.last_guess.time = social_share.time
    
    if (!(tutorial_mode)) localStorage.setItem("streakData", JSON.stringify(streak_data));
    
}
 
    
// more variables (very disorganized)
    


function Suspect(name, weapon, room, motive, statement) {
  this.name = name,
  this.weapon = weapon,
  this.room = room,
  this.statement = statement
  this.motive = motive;
}
    
function Rule(type, entity_one, entity_two, relationship, entity_three, entity_four) {
//console.log("Rule being created");
  this.type = type,
  this.entity_one = entity_one,
  this.entity_two = entity_two,
  this.entity_three = entity_three,
  this.entity_four = entity_four,
  this.relationship = relationship
}
    
function randomIndex(array) {
    
   // console.log(array);
   // console.log(Math.floor(Math.random() * array.length));
    return Math.floor(Math.random() * array.length);
    
}

function whoHasWeapon(weapon_name) {
    
    for (var a = 0; a < solution_object.suspects.length; a++) {
        
        if (solution_object.suspects[a].weapon == weapon_name) return solution_object.suspects[a].name;
        
    }
    
    return false;
    
}

function whosInRoom(room_name) {
    
    for (var a = 0; a < solution_object.suspects.length; a++) {
        
        if (solution_object.suspects[a].room == room_name) return solution_object.suspects[a].name;
        
    }
    
    return false;
    
}
     
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// creating empty things

var weekly_object;
    
function createWeeklySuspects() {
    
    function getMonday(d) {
      d = new Date(d);
      var day = d.getDay(),
          diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
      return new Date(d.setDate(diff));
    }

    var monday_date = getMonday(new Date()); // Mon Nov 08 2010
    
    var monday_options = { year: '2-digit', month: '2-digit', day: '2-digit' };
    
    week_seed = monday_date.toLocaleDateString('en-us', monday_options);
    
    console.log(week_seed);
    
    Math.seedrandom(week_seed + "1");
    
    
    weekly_object = {
        "Monday" : {
            suspects: [],
            major_location: "",
            killer: ""
        },
        "Tuesday" : {
            suspects: [],
            major_location: "",
            killer: ""
        },
        "Wednesday" : {
            suspects: [],
            major_location: "",
            killer: ""
        },
        "Thursday" : {
            suspects: [],
            major_location: "",
            killer: ""
        },
        "Friday" : {
            suspects: [],
            major_location: "",
            killer: ""
        },
        "Saturday" : {
            suspects: [],
            major_location: "",
            killer: ""
        },
        "Sunday" : {
            suspects: [],
            major_location: "",
            killer: ""
        }
    }
    
    
    
    var week_array = Object.keys(weekly_object);
    
    var new_all_names = all_names.slice(0);
    
    for (var a = 0; a < week_array.length - 1; a++) {
        
        for (var b = 0; b < puzzles_by_day[week_array[a]].size; b++) {
            
            weekly_object[week_array[a]].suspects = weekly_object[week_array[a]].suspects.concat(new_all_names.splice(Math.floor(Math.random() * new_all_names.length), 1));
            
        }
        
        weekly_object[week_array[a]].major_location = settings_object_rich.splice(Math.floor(Math.random() * settings_object_rich.length), 1)[0];
        
        weekly_object[week_array[a]].killer = randomElement(weekly_object[week_array[a]].suspects);
        weekly_object.Sunday.suspects.push( weekly_object[week_array[a]].killer);
    }
    
     weekly_object.Sunday.killer = weekly_object.Sunday.suspects.random();
    
    console.log("WEEKLY OBJECT");
    console.log(weekly_object);
    
}

function getTodaysSuspects(day_name) {
    
    //console.log(day_name);
    //console.log(weekly_object[day_name]);
    
    if (tutorial_mode) {
        
        console.log("TUTORIAL");
        
        console.log("TUTORIAL");
        
        console.log("TUTORIAL");
        
        console.log("TUTORIAL");
        
        var suspects_to_return = [];
        
        var newest_all_names = all_names.slice(0);
        
        console.log(all_names);
        
        newest_all_names = shuffle(newest_all_names);
        
        console.log(newest_all_names);
        
        console.log(size);
        
        for (var b = 0; b < size; b++) {
            
            suspects_to_return = suspects_to_return.concat(newest_all_names.splice(Math.floor(Math.random() * newest_all_names.length), 1));
        
        console.log(suspects_to_return);
            
        }
        
        return suspects_to_return;
        
    }
    
    return weekly_object[day_name].suspects;
    
}

function getTodaysKiller(day_name) {
    
    //console.log(day_name);
        //console.log(weekly_object);
    if (tutorial_mode) return randomElement(names);
    return weekly_object[day_name].killer;
    
}
    
function generateSolution() { // generate the true solution to the puzzle

    //console.log("generateSolution()");
    
    //console.log(names);
    //console.log(weapons);
    //console.log(rooms);
    
    var working_names = names.slice(0);
    var working_weapons = weapons.slice(0);
    var working_rooms = rooms.slice(0);
    if (motive_mode) var working_motives = motives.slice(0);
    
    console.log(working_names);
    
    suspect_array = [];
    solution_object = {};    
    
    //console.log(size);
    
    for (var a = 0; a < size; a++) {

        var randomName = working_names.splice(Math.floor(Math.random()*working_names.length), 1)[0];
        var randomWeapon = working_weapons.splice(Math.floor(Math.random()*working_weapons.length), 1)[0];
        var randomRoom = working_rooms.splice(Math.floor(Math.random()*working_rooms.length), 1)[0];
        if (motive_mode) var randomMotive = working_motives.splice(Math.floor(Math.random()*working_motives.length), 1)[0];

       // console.log(randomMotive);
        
        if (motive_mode) suspect_array.push(new Suspect(randomName, randomWeapon, randomRoom, randomMotive));
        else suspect_array.push(new Suspect(randomName, randomWeapon, randomRoom));
        
    }
    //console.log(suspect_array);

    solution_object = {"suspects" : suspect_array,
                           "killer" : getTodaysKiller(today_day_word)};
    
    //console.log("SOLUTION OBJECT");
    //console.log(solution_object);
    
}
    
function returnSuspectByName(name, array) {
    
    for (var a = 0; a < array.length; a++) {
        
        if (array[a].name == name) return array[a];
        
    }
    
}
    
function generateEvidenceRules() { // the evidence generator!
        
    evidence_array = []; 
    banlist = [];
    ultrabanlist = [];
    
    //console.log("generateEvidenceRules");
    
    if (daily == true) {
        research_mode = daily_specs.research;
            
        if (tutorial_mode) evidence_array = patternGenerator(tutorial_rules);
        else evidence_array = patternGenerator(daily_specs.rules);
        
        //console.log(evidence_array);
        
    } else {
 
        research_mode = pattern_orders[casenum].research;
            
        evidence_array = patternGenerator(pattern_orders[casenum].rules);
        
        
    }
    //console.log(banlist);

       //evidence_array = shuffle(evidence_array);
            
    //console.log(evidence_array);
}

function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}
    
function patternGenerator(pattern) { // This creates the rules that fit the pattern.
    
    var finished = false;
    
    while (finished == false)  {
    
        var provisional_evidence = [];
        banlist = [];
        ultrabanlist = [];
        stop_banning = false;

        for (var a = 0; a < pattern.length; a++) {
            
            if (motive_mode) var max_banlist_size = size * 4;
            var max_banlist_size = size * 3;
            
            //console.log(max_banlist_size)
            
            //console.log(banlist.length);
            console.log(banlist);

            if (!(stop_banning)) {// (banlist.length < max_banlist_size) {
                //console.log("adding unbanned rule");
                provisional_evidence.push(unbannedRule(pattern[a]));
                if (provisional_evidence[provisional_evidence.length-1] == "abort") a = pattern.length;
            }
            else {
                
                console.log("Generating banned rule:");
                
                
                var unique_rule_found = false; // required to complete
                var equal_rule_found = false;
                
                while (unique_rule_found == false) {
                
                    
                    var new_rule_check = JSON.parse(JSON.stringify(newRuleType[pattern[a]]()));
                    
                    while (checkRuleForUltraBanned(new_rule_check)) {
                        
                        //console.log("It was ultra banned!");
                        new_rule_check = JSON.parse(JSON.stringify(newRuleType[pattern[a]]()));
                        
                    }
                    
                    //console.log("NOT ULTRABANNED: ");

                    //console.log('new_rule_check');
                    //console.log(new_rule_check);
                    
                    //console.log("ULTRABANLIST");
                    
                    //console.log(ultrabanlist);

                    for (var b = 0; b < provisional_evidence.length; b++) {

                        //console.log("looping through");

                        if (_.isEqual(provisional_evidence[b], new_rule_check)) {

                            //console.log("rule comparison: supposedly equal:");
                            //console.log(provisional_evidence[b]);
                            //console.log(new_rule_check);
                            equal_rule_found = true;

                        } else {

                            //console.log("rule comparison: supposedly unequal:");
                            //console.log(provisional_evidence[b]);
                            //console.log(new_rule_check);

                        }

                    }   

                    if (equal_rule_found == false) unique_rule_found = true;
                    else equal_rule_found = false;

                }
                
                provisional_evidence.push(new_rule_check); // provisional_evidence.push(newRuleType[pattern[a]]());
                //console.log("Banned Rule Generated: ");
                //console.log(provisional_evidence[provisional_evidence.length-1]);
            }
            //provisional_evidence.push(unbannedRule(pattern[a]));

        }
        //console.log(provisional_evidence);
        //console.log(banlist);
        if (provisional_evidence.indexOf("abort") == -1) finished = true;
    
    }
    
    return provisional_evidence;
    
}

var stop_banning = false;

function unbannedRule(kind) { // generates an unbanned rule, and adds parts to banlist
    
    //console.log("unbannedRule");
    
    //console.log(banlist);
    
    //console.log(kind);
    var new_rule = newRuleType[kind]();
    //console.log(new_rule);
    var counter = 0;
    var mercy = false;
    while ((checkRuleForBanned(new_rule)) && (mercy == false) && (stop_banning == false)) {
        
        new_rule = newRuleType[kind]();
        counter++;
        if (counter == 250) {
            console.log("Aborting the need to find unbanned rules at this rule:" + new_rule.type);
            stop_banning = true;
            //return "abort";
        }
    }
    
    if (stop_banning == true) {

        while ((checkRuleForUltraBanned(new_rule))) {

            new_rule = newRuleType[kind]();

        }

    }
    
    //console.log("motive_mode: " + motive_mode);
    if (!(stop_banning)) addRulesPartsToBan(new_rule);
    //console.log(banlist);
    return new_rule;
    
    
}
    
var newRuleType = {
    
    "simple" : function() {
        
        var random_suspect = solution_object.suspects[randomIndex(solution_object.suspects)];

        
        var entity_array = [["name", random_suspect.name], ["weapon", random_suspect.weapon], ["room", random_suspect.room]];
        if (motive_mode) entity_array.push(["motive", random_suspect.motive]);

        var first_one = entity_array.splice(randomIndex(entity_array), 1)[0];

        var second_one = entity_array.splice(randomIndex(entity_array), 1)[0];

        return new Rule("simple", first_one, second_one, true);
        
    },
    "not" : function() {
        
        var random_suspect = solution_object.suspects[randomIndex(solution_object.suspects)];
    
        var entity_array = [["name", random_suspect.name], ["weapon", random_suspect.weapon], ["room", random_suspect.room]];
        if (motive_mode) entity_array.push(["motive", random_suspect.motive]);
        
       // console.log(entity_array);

        var not_rule = new Rule("not", entity_array.splice(randomIndex(entity_array), 1)[0], replaceWithAnotherEntity(entity_array.splice(randomIndex(entity_array), 1)[0]), true);

        //console.log("new not_rule:")
        //console.log(not_rule);

        return not_rule;
        
    },
    "either": function() {
        
        var true_rule = generateSimpleRule();
        var false_rule = generateSimpleFalseRule();

        return new Rule("either", true_rule.entity_one, true_rule.entity_two, true, false_rule.entity_one, false_rule.entity_two);
        
    },
    "killer" : function() {
        
        const index = solution_object.suspects.map(e => e.name).indexOf(solution_object.killer);

        var entity_array = [["weapon", solution_object.suspects[index].weapon], ["room",  solution_object.suspects[index].room]];
        if (motive_mode) entity_array.push(["motive", solution_object.suspects[index].motive]);

        var killer_klue = entity_array.splice(randomIndex(entity_array), 1)[0];

        return new Rule("killer", killer_klue);
        
    },
    "not_kill" : function() {
        
        const index = solution_object.suspects.map(e => e.name).indexOf(solution_object.killer);
        
        var not_killer_set = solution_object.slice(0);
        
        not_killer_set.splice(index, 1);
        
        var entity_types = ["name", "weapon", "room"];
        if (motive_mode) entity_types.push("motive");
        
        var array_of_non_entities = [];
        
        for (var a = 0; a < not_killer_set.length; a++) {
            
            var one_entity_type = entity_types[a % entity_types.length];
            
            array_of_non_entities.push([one_entity_type, not_killer_set[a][one_entity_type]]);
            
        }

        return new Rule("not_kill", array_of_non_entities);
    },
    "indoors" : function() {
        
        var random_suspect = solution_object.suspects[randomIndex(solution_object.suspects)];
    
        var entity_array = [["name", random_suspect.name], ["weapon", random_suspect.weapon]];
        if (motive_mode) entity_array.push(["motive", random_suspect.motive]);

        var item_declared = entity_array.splice(randomIndex(entity_array), 1)[0];

        const index_room = major_setting.rooms.map(e => e.name).indexOf(random_suspect.room);

        return new Rule("indoors", item_declared, false, major_setting.rooms[index_room].indoors);
        
    },
    "handed" : function() {
        
        var random_suspect = solution_object.suspects[randomIndex(solution_object.suspects)];
    
        var entity_array = [["room",  random_suspect.room], ["weapon", random_suspect.weapon]];
        if (motive_mode) entity_array.push(["motive", random_suspect.motive]);

        var item_declared = entity_array.splice(randomIndex(entity_array), 1)[0];

        return new Rule("handed", item_declared, false, suspect_details[random_suspect.name].characteristics.hand);
        
    },
    "eyes" : function() {
        
        var random_suspect = solution_object.suspects[randomIndex(solution_object.suspects)];
    
        var entity_array = [["room",  random_suspect.room], ["weapon", random_suspect.weapon]];
        if (motive_mode) entity_array.push(["motive", random_suspect.motive]);

        var item_declared = entity_array.splice(randomIndex(entity_array), 1)[0];

        return new Rule("eyes", item_declared, false, suspect_details[random_suspect.name].characteristics.eyes);
        
    },
    "hair" : function() {
        
        var random_suspect = solution_object.suspects[randomIndex(solution_object.suspects)];
    
        var entity_array = [["room",  random_suspect.room], ["weapon", random_suspect.weapon]];
        if (motive_mode) entity_array.push(["motive", random_suspect.motive]);

        var item_declared = entity_array.splice(randomIndex(entity_array), 1)[0];

        return new Rule("hair", item_declared, false, suspect_details[random_suspect.name].characteristics.hair);
        
    },
    "sign" : function() {
        
        var random_suspect = solution_object.suspects[randomIndex(solution_object.suspects)];
    
        var entity_array = [["room",  random_suspect.room], ["weapon", random_suspect.weapon]];
        if (motive_mode) entity_array.push(["motive", random_suspect.motive]);

        var item_declared = entity_array.splice(randomIndex(entity_array), 1)[0];

        return new Rule("sign", item_declared, false, suspect_details[random_suspect.name].characteristics.sign);
        
    },
    "oneofeach" : function() {
        
        var element_list = [];
        
        for (var a = 0; a < solution_object.suspects.length; a++) {
            
            var random_suspect = solution_object.suspects[a];
            
            var entity_array = [["name", random_suspect.name], ["room",  random_suspect.room], ["weapon", random_suspect.weapon]];
            if (motive_mode) entity_array.push(["motive", random_suspect.motive]);

            var item_declared = entity_array.splice(randomIndex(entity_array), 1)[0];
            
            //console.log(item_declared);
            
            element_list.push(item_declared);
            
        }
        
        //console.log(element_list);

        return new Rule("oneofeach", element_list, false);
        
    },
    "material" : function() {
        
        var random_suspect = solution_object.suspects[randomIndex(solution_object.suspects)];
    
        var entity_array = [["name", random_suspect.name], ["room", random_suspect.room]];
        if (motive_mode) entity_array.push(["motive", random_suspect.motive]);

        var item_declared = entity_array.splice(randomIndex(entity_array), 1)[0];

        const index_weapon = major_setting.weapons.map(e => e.name).indexOf(random_suspect.weapon);

        return new Rule("material", item_declared, false, major_setting.weapons[index_weapon].materials.random());
        
    },
    "weight" : function() {
        
        var random_suspect = solution_object.suspects[randomIndex(solution_object.suspects)];
    
        var entity_array = [["name", random_suspect.name], ["room", random_suspect.room]];
        if (motive_mode) entity_array.push(["motive", random_suspect.motive]);

        var item_declared = entity_array.splice(randomIndex(entity_array), 1)[0];

        const index_weapon = major_setting.weapons.map(e => e.name).indexOf(random_suspect.weapon);

        return new Rule("weight", item_declared, false, major_setting.weapons[index_weapon].weight);
        
    },
    "gimme" : function() {
        
        var random_suspect = solution_object.suspects.random();
        
        //console.log(random_suspect);

        return new Rule("gimme", random_suspect);
        
        
    },
    "characteristic" : function() {
        
        return newRuleType[randomElement(["hair", "indoors", "eyes", "handed", "material", "weight", "sign"])]();
        
    },
    
}
    
function generateStatements() { // this is the part that generates the three statements
    
    // i want to make it so that it adds these to the banlist
    
    var index = -1;
    
    var statement_list = [];
    
    for (var a = 0; a < size; a++) {
        
        if (solution_object.killer == solution_object.suspects[a].name) {
            
            index = a;
            
        }
        else {
            
            if (banlist.length < ((size*4) - 1)) {
                
                if (Math.floor(Math.random()*2) == 0) solution_object.suspects[a].statement = unbannedRule("simple"); // generateSimpleRule();
                else solution_object.suspects[a].statement = unbannedRule("not"); // generateNotRule();
                
            
            } else {
                
                if (Math.floor(Math.random()*2) == 0) solution_object.suspects[a].statement = generateSimpleRule(); // unbannedRule("simple"); // generateSimpleRule();
                else solution_object.suspects[a].statement = generateNotRule(); // unbannedRule("not"); // generateNotRule();
                   
            }
            
            statement_list.push(solution_object.suspects[a].statement);
        }
        
        //console.log(colorPrint(solution_object.suspects[a].name) + ": " + parseRule(solution_object.suspects[a].statement));
        
    }
        
        var good_lie = false;
        var testlie;

        var simple_or_not = Math.floor(Math.random()*2);

        testing_break = 0;

        while (good_lie == false) {

            testing_break++;
            if (testing_break > 100) {

                //console.log("MERCY RULE! LIES");
                good_lie = true;
            }

           // console.log("rolling lie");

            if (simple_or_not) testlie = generateSimpleFalseRule();
            else testlie= generateFalseNotRule();

            if (checkLie(testlie, evidence_array.concat(statement_list), total_possibilities) == true) good_lie = true;
            
        }

        solution_object.suspects[index].statement = testlie;
    
    
}
    
function generateLie() {
    
    var spinner = Math.floor(Math.random() * 2);
    
    if (spinner == 0) {
        return generateFalseNotRule();
    } else {
        return generateSimpleFalseRule();
    }
    
}
  
function randomCat() { // randomly select a category between names, weapons, rooms and return key
    
    var picker = Math.floor(Math.random() * 3);
    if (picker == 0) return "name";
    else if (picker == 1) return "weapon";
    else if (picker == 2) return "room";
    
}
    
function randomEntity() { // randomly select any entity (name, weapon, room)
    
    var category = randomCat();
    
    return [category, solution_object.suspects[randomIndex(solution_object.suspects)][category]];
    
    
}
    

function generateEitherRule() {
    
    
    var true_rule = generateSimpleRule();
    var false_rule = generateSimpleFalseRule();
    
    return new Rule("either", true_rule.entity_one, true_rule.entity_two, true, false_rule.entity_one, false_rule.entity_two);
    
}

    
function generateSimpleRule() {
    
   //console.log("generateSimpleRule");
    
    //console.log(solution_object);
    
    var random_suspect = solution_object.suspects[randomIndex(solution_object.suspects)];
    
    //console.log(random_suspect);
    
    var entity_array = [["name", random_suspect.name], ["weapon", random_suspect.weapon], ["room", random_suspect.room]];
    
    var first_one = entity_array.splice(randomIndex(entity_array), 1)[0];
    
    //console.log(first_one);
                                        
    var second_one = entity_array.splice(randomIndex(entity_array), 1)[0];
    
    //console.log(second_one);
    
    return new Rule("simple", first_one, second_one, true);
    
}
    
function generateKillerRule() {
    
    //console.log("generateKillerRule");
        
    //const index = major_setting.weapons.map(e => e.name).indexOf(weapon);
    
    const index = solution_object.suspects.map(e => e.name).indexOf(solution_object.killer);
    
    var entity_array = [["weapon", solution_object.suspects[index].weapon], ["room",  solution_object.suspects[index].room]]; 
    
    if (motive_mode) {
        
            var entity_array = [["weapon", solution_object.suspects[index].weapon], ["room",  solution_object.suspects[index].room], ["motive",  solution_object.suspects[index].motive]]; 
        
        
    } else {
        
            var entity_array = [["weapon", solution_object.suspects[index].weapon], ["room",  solution_object.suspects[index].room]]; 
        
    }
    

                        
    var killer_klue = entity_array.splice(randomIndex(entity_array), 1)[0];
    
    return new Rule("killer", killer_klue);
    
}
    
function generateIndoorRule() {
    
    //console.log("generateIndoorRule");
        
    //const index = major_setting.weapons.map(e => e.name).indexOf(weapon);
    
    var random_suspect = solution_object.suspects[randomIndex(solution_object.suspects)];
    
    var entity_array = [["name", random_suspect.name], ["weapon", random_suspect.weapon]];
                        
    var item_declared = entity_array.splice(randomIndex(entity_array), 1)[0];
    
    const index_room = major_setting.rooms.map(e => e.name).indexOf(random_suspect.room);
    
    return new Rule("indoors", item_declared, false, major_setting.rooms[index_room].indoors);
    
}
    
function generateNotRule() {
    
    var random_suspect = solution_object.suspects[randomIndex(solution_object.suspects)];
    
    var entity_array = [["name", random_suspect.name], ["weapon", random_suspect.weapon], ["room", random_suspect.room]];
    
    var not_rule = new Rule("not", entity_array.splice(randomIndex(entity_array), 1)[0], replaceWithAnotherEntity(entity_array.splice(randomIndex(entity_array), 1)[0]), true);
    
    //console.log("new not_rule:")
    //console.log(not_rule);
    
    return not_rule;
    
    
}
    
function ifOn(word) {
    
    console.log(word);
    console.log(major_setting);
    
    if (word.indexOf("on") == 0) return "on";
    else if (word.indexOf("atop") == 0) return "atop";
    else {
        const index = major_setting.rooms.map(e => e.name).indexOf(word);
        return major_setting.rooms[index].preposition;
    }
    
}
    
function checkInOrOn() {
    
    //console.log(document.getElementById("room").value);
    
    document.getElementById("inoron").innerHTML = ifOn(document.getElementById("room").value);
    
}
    
function generateFalseNotRule() {
    
    var random_suspect = solution_object.suspects[randomIndex(solution_object.suspects)];
    
    var entity_array = [["name", random_suspect.name], ["weapon", random_suspect.weapon], ["room", random_suspect.room]];
    
    var false_not_rule = new Rule("simple", entity_array.splice(randomIndex(entity_array), 1)[0], replaceWithAnotherEntity(entity_array.splice(randomIndex(entity_array), 1)[0]), true);
    
    return false_not_rule;
    
}
    
function generateSimpleFalseRule() {
    
    var random_suspect = solution_object.suspects[randomIndex(solution_object.suspects)];
    
    var entity_array = [["name", random_suspect.name], ["weapon", random_suspect.weapon], ["room", random_suspect.room]];
    
    var false_rule = new Rule("simple", entity_array.splice(randomIndex(entity_array), 1)[0], replaceWithAnotherEntity(entity_array.splice(randomIndex(entity_array), 1)[0]), true);
    
    return false_rule;
    
} 
    
function generateNotFalseRule() {
    
    //console.log("generateSimpleRule");
    
    var random_suspect = solution_object.suspects[randomIndex(solution_object.suspects)];
    
    //console.log(random_suspect);
    
    var entity_array = [["name", random_suspect.name], ["weapon", random_suspect.weapon], ["room", random_suspect.room]];
    
    var first_one = entity_array.splice(randomIndex(entity_array), 1)[0];
    
    //console.log(first_one);
                                        
    var second_one = entity_array.splice(randomIndex(entity_array), 1)[0];
    
    //console.log(second_one);
    
    return new Rule("not", first_one, second_one, true);
    
}
    
function replaceWithAnotherEntity([category, entity]) { // part of generating a simple false rule
    
    //console.log("replaceWithAnotherEntity");
    
    //console.log(category);
    ///console.log(entity);
    
    if (category == "name") var other_options = names.slice(0);
    else if (category == "weapon") var other_options = weapons.slice(0);
    else if (category == "room") var other_options = rooms.slice(0);
    else if (category == "motive") var other_options = motives.slice(0);
    
    //console.log(other_options);
    
    //console.log("other_options.indexOf(entity)");
    //console.log(other_options.indexOf(entity));
    
    other_options.splice(other_options.indexOf(entity), 1);
    
    //console.log(other_options);
    //console.log(randomIndex(other_options));
    
    
    return [category, other_options[randomIndex(other_options)]];
    
} 
    
function checkRule(a_rule, a_suspect_array) {

    //console.log(a_rule);
    
    if (a_rule.type == "simple") {
        
        for (var a = 0; a < size; a++) {
            
            if (a_suspect_array[a][a_rule.entity_one[0]] == a_rule.entity_one[1]) {
                
                if (a_suspect_array[a][a_rule.entity_two[0]] == a_rule.entity_two[1]) {
                    //console.log("true statement!");
                    return true;
                }
                else return false;
                
            }
            
        }
        
        
        
    } else if (a_rule.type == "not") {
        
        for (var a = 0; a < size; a++) {
            
            if (a_suspect_array[a][a_rule.entity_one[0]] == a_rule.entity_one[1]) {
                
                if (a_suspect_array[a][a_rule.entity_two[0]] != a_rule.entity_two[1]) {
                    //console.log("true not statement!");
                    //console.log(a_suspect_array[a][a_rule.entity_two[0]])
                    //console.log(a_rule.entity_two[1]);
                    return true;
                }
                else {
                    //console.log("these two are the same:")
                    //console.log(a_suspect_array[a][a_rule.entity_two[0]]);
                    //console.log(a_rule.entity_two[1]);
                    return false;
                }
                
            }
            
        }
        
    } else if (a_rule.type == "either") {
        
          var true_rule = new Rule("simple", a_rule.entity_one, a_rule.entity_two);
          var not_rule = new Rule("not", a_rule.entity_three, a_rule.entity_four);
        
            if ((checkRule(true_rule, a_suspect_array)) && (checkRule(not_rule, a_suspect_array))) return true;
            else if ((!(checkRule(true_rule, a_suspect_array))) && (!(checkRule(not_rule, a_suspect_array)))) return true;
             else return false;
        
    } else if (a_rule.type == "killer") {
        
        var pings = 0;
        
        const index = solution_object.suspects.map(e => e.name).indexOf(solution_object.killer);
        
        if (a_rule.entity_one[0] == "weapon") {
            if (solution_object.suspects[index].weapon == a_rule.entity_one[1]) return true; 
        }
        else if (a_rule.entity_one[0] == "room") {
            if (solution_object.suspects[index].room == a_rule.entity_one[1]) return true;
        }
            
        return false;       
        
    } else if (a_rule.type == "not_kill") {
        
        return true;      
        
    } else if (a_rule.type == "indoors") {
    
        //console.log(a_suspect_array);
        
        var room_index = a_suspect_array.map(e => e[a_rule.entity_one[0]]).indexOf(a_rule.entity_one[1]);
        var room_name = a_suspect_array[room_index].room;

        
        var room_index_in_major = major_setting.rooms.map(e => e.name).indexOf(room_name);

        //console.log(a_rule);
        
        if (a_rule.relationship == major_setting.rooms[room_index_in_major].indoors) {
            //console.log("RETURNING TRUE!");
            return true;
        } 
        else {
            //console.log("RETURNING FALSE!");
            return false;
        }
        
    } else if (a_rule.type == "material") {
    
        //console.log(a_suspect_array);
        
        var weapon_index = a_suspect_array.map(e => e[a_rule.entity_one[0]]).indexOf(a_rule.entity_one[1]);
        var weapon_name = a_suspect_array[weapon_index].weapon;

        
        var weapon_index_in_major = major_setting.weapons.map(e => e.name).indexOf(weapon_name);

        //console.log(major_setting.weapons[weapon_index_in_major]);
        
        if (major_setting.weapons[weapon_index_in_major].materials.indexOf(a_rule.relationship) != -1) {
            //console.log("RETURNING TRUE!");
            return true;
        } 
        else {
            //console.log("RETURNING FALSE!");
            return false;
        }
        
    } else if (a_rule.type == "weight") {
    
        //console.log(a_rule);
        //console.log(a_rule.entity_one);
        
        var weapon_index = a_suspect_array.map(e => e[a_rule.entity_one[0]]).indexOf(a_rule.entity_one[1]);
        var weapon_name = a_suspect_array[weapon_index].weapon;

        
        var weapon_index_in_major = major_setting.weapons.map(e => e.name).indexOf(weapon_name);
        //console.log("weapon_index_in_major" + weapon_index_in_major);
        //console.log("major_setting.weapons[weapon..." + major_setting.weapons[weapon_index_in_major]);
        //console.log(a_rule);
        
        if (a_rule.relationship == major_setting.weapons[weapon_index_in_major].weight) {
            //console.log("RETURNING TRUE!");
            return true;
        } 
        else {
            //console.log("RETURNING FALSE!");
            return false;
        }
        
    } else if (a_rule.type == "handed") {
    
        //console.log(a_suspect_array);
        
        var suspect_index = a_suspect_array.map(e => e[a_rule.entity_one[0]]).indexOf(a_rule.entity_one[1]);
        
        //console.log(suspect_index);
        
        var suspect_name = a_suspect_array[suspect_index].name;

        
        //var suspect_index_in_major = major_setting.rooms.map(e => e.name).indexOf(room_name);

        
        if (a_rule.relationship == suspect_details[suspect_name].characteristics.hand) {
            //console.log("RETURNING TRUE!");
            return true;
        } 
        else {
            //console.log("RETURNING FALSE!");
            return false;
        }
        
    } else if (a_rule.type == "eyes") {
    
        //console.log(a_suspect_array);
        
        var suspect_index = a_suspect_array.map(e => e[a_rule.entity_one[0]]).indexOf(a_rule.entity_one[1]);
        
        //console.log(suspect_index);
        
        var suspect_name = a_suspect_array[suspect_index].name;

        
        //var suspect_index_in_major = major_setting.rooms.map(e => e.name).indexOf(room_name);

        
        if (a_rule.relationship == suspect_details[suspect_name].characteristics.eyes) {
            //console.log("RETURNING TRUE!");
            return true;
        } 
        else {
            //console.log("RETURNING FALSE!");
            return false;
        }
        
    } else if (a_rule.type == "hair") {
    
        //console.log(a_suspect_array);
        
        var suspect_index = a_suspect_array.map(e => e[a_rule.entity_one[0]]).indexOf(a_rule.entity_one[1]);
        
        //console.log(suspect_index);
        
        //console.log(a_rule);
        
        var suspect_name = a_suspect_array[suspect_index].name;

        
        //var suspect_index_in_major = major_setting.rooms.map(e => e.name).indexOf(room_name);

        
        if (a_rule.relationship == suspect_details[suspect_name].characteristics.hair) {
            //console.log("RETURNING TRUE!");
            return true;
        } 
        else {
            //console.log("RETURNING FALSE!");
            return false;
        }
        
    } else if (a_rule.type == "sign") {
    
        //console.log(a_suspect_array);
        
        var suspect_index = a_suspect_array.map(e => e[a_rule.entity_one[0]]).indexOf(a_rule.entity_one[1]);
        
        //console.log(suspect_index);
        
        var suspect_name = a_suspect_array[suspect_index].name;

        
        //var suspect_index_in_major = major_setting.rooms.map(e => e.name).indexOf(room_name);

        
        if (a_rule.relationship == suspect_details[suspect_name].characteristics.sign) {
            //console.log("RETURNING TRUE!");
            return true;
        } 
        else {
            //console.log("RETURNING FALSE!");
            return false;''
        }
        
    } else if (a_rule.type == "gimme") {
    
        //console.log(a_suspect_array);
        //console.log(a_rule);
        
          
            var suspect_index = a_suspect_array.map(e => e["name"]).indexOf(a_rule.entity_one.name);

            //console.log(suspect_index);

            if ((a_suspect_array[suspect_index].name == a_rule.entity_one.name) && (a_suspect_array[suspect_index].room == a_rule.entity_one.room) && (a_suspect_array[suspect_index].weapon == a_rule.entity_one.weapon)) {

                if (motive_mode) {
                    if (a_suspect_array[suspect_index].motive == a_rule.entity_one.motive) return true;
                    else return false;
                } else {
                    return true;
                }


            } else return false;
            
    

        
        //var suspect_index_in_major = major_setting.rooms.map(e => e.name).indexOf(room_name);

        /*
        if (a_rule.relationship == suspect_details[suspect_name].characteristics.sign) {
            //console.log("RETURNING TRUE!");
            return true;
        } 
        else {
            //console.log("RETURNING FALSE!");
            return false;
        } */ // I think I needed to remove this as it was extraneous???
        
    } else if (a_rule.type == "oneofeach") {
    
        //console.log(a_suspect_array);
        //console.log(a_rule);
        
        var total_counters = 0;
        
        for (var a = 0; a < a_rule.entity_one.length; a++) {
            
            var specific_entity_counters = 0;
            
            for (var b = 0; b < a_suspect_array.length; b++) {
                
                //console.log(a_suspect_array[b][a_rule.entity_one[a][0]]);
                //console.log(a_rule.entity_one[a][1]);
            
                if (a_suspect_array[b][a_rule.entity_one[a][0]] == a_rule.entity_one[a][1]) {
                    specific_entity_counters++
                    total_counters++;
                }
                                                               
            }
            
            if (specific_entity_counters != 1) return false;
            
        }
        
        return true;
        
    }
    
}

function removeItemOnce(arr, value) {
  var index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}
    
function generateAllPossibilities(names, weapons, rooms, motives) {

    
    /* for (var a = 0; a < evidence_array.length; a++) {
        
        if (evidence_array[a].type == "gimme") {
            
            console.log(names);
            
            console.log(weapons);
            
            console.log(rooms);
            
            names = removeItemOnce(names, evidence_array[a].entity_one.name);
            
            weapons = removeItemOnce(weapons, evidence_array[a].entity_one.weapon);
            
            rooms = removeItemOnce(rooms, evidence_array[a].entity_one.room);
            
            console.log(names);
            
            console.log(weapons);
            
            console.log(rooms);
            
            
        }
        
    } */ // Realized this would upset a lot of the 'more than'/'second tallest' code.
    
    
    // create an array for suspects with just names
    
    var blank_array_just_names = [];
    
    for (var a = 0; a < names.length; a++) {
        blank_array_just_names.push(new Suspect(names[a]));
    }
    
    // generate all the possible weapon orders
    //console.log(blank_array_just_names);
    
    var weapon_options = permutationsOfArray(weapons);
    
    // create a new array for suspects featuring only names and weapons
    
    var names_and_weapons_only = [];
    
    var one_weapon_set = [];
    
    for (var a = 0; a < weapon_options.length; a++) { // for every weapon permutation
        
        var one_weapon_set = angular.copy(blank_array_just_names.slice(0));
        
        //console.log(one_weapon_set);
        
        
        for (var b = 0; b < one_weapon_set.length; b++) { // iterate through weapon order
            
            one_weapon_set[b].weapon = weapon_options[a][b]; //assign one weapon each
            
        }
        
        names_and_weapons_only.push(one_weapon_set);
        
    }
    
    // it looks like this: []
    
    //console.log(names_and_weapons_only);

    var array_of_all_possibilities = [];
    
    var room_options = permutationsOfArray(rooms);
    
    // create a new array for suspects featuring only names and weapons
    
    var one_room_solution;
    
  
    
    for (var c = 0; c < names_and_weapons_only.length; c++) {
        
            var one_room_solution_template = [];
            one_room_solution_template = angular.copy(names_and_weapons_only[c].slice(0));
        
            for (var a = 0; a < room_options.length; a++) { // for every room permutation
                
                one_room_solution = angular.copy(one_room_solution_template.slice(0));

                for (var b = 0; b < one_room_solution.length; b++) { // iterate through room order

                    one_room_solution[b].room = room_options[a][b]; //assign one room each

                }

                array_of_all_possibilities.push(one_room_solution);
                

            }

    }
    
    //console.log(array_of_all_possibilities);
    
    if (motive_mode) {
        
        var array_of_all_possibilities_with_motives = [];
        
        var motive_options = permutationsOfArray(motives);  
        
        //console.log(motive_options);
        
        for (var d = 0; d < array_of_all_possibilities.length; d++) { // for every 
            
            var one_motive_solution_template = [];
            one_motive_solution_template = angular.copy(array_of_all_possibilities[d].slice(0));
            
            for (var a = 0; a < motive_options.length; a++) {
                
                one_motive_solution = angular.copy(one_motive_solution_template.slice(0));
                
                for (var b = 0; b < one_motive_solution.length; b++) {
                    
                    one_motive_solution[b].motive = motive_options[a][b];
                    //console.log(motive_options[a][b]);
                    
                }
                
                array_of_all_possibilities_with_motives.push(one_motive_solution);
                
                
                
            }
            
            
            
        }
        
    }
    
    //console.log(array_of_all_possibilities_with_motives);

    if (motive_mode) return array_of_all_possibilities_with_motives;
    return array_of_all_possibilities;
    
    
}
    
function checkForAlternateLiars(possibles, ruleset) {
     
    var working_solutions = [];
    
    for (var b = 0; b < possibles.length; b++) { // for every option
        
        var suspect_count = solution_object.suspects.length;
        var check_all = 0;
        var check_false
        var good_count = 0;
        var bad_count = 0;
        
         for (var a = 0; a < suspect_count; a++) {

            if (solution_object.suspects[a].name == solution_object.killer) {

                if ((checkRule(solution_object.suspects[a].statement, possibles[b])) == false) bad_count++; // if the killer is false, then good

            } else {
                
                if ((checkRule(solution_object.suspects[a].statement, possibles[b])) == true) good_count++;      // if the non-killer is true, then good      
                
            }
             
             check_all = bad_count + good_count; // if there is an alternate liar then one of the good counts should 
              //
            if ((good_count == (suspect_count - 2)) && (bad_count == 0) && (a == (suspect_count - 1))) { // this only works for 3 suspects bc of clever trick! 
                // if ((good_count == 1) && (bad_count == 0) && (a == (suspect_count - 1))) { original ^
                 
                var evidence_true = 0;
                for (var d = 0; d < ruleset.length; d++) {
                    
                    if (checkRule(ruleset[d], possibles[b])) evidence_true++; 
                    
                }
                
                if (evidence_true == ruleset.length) working_solutions.push(possibles[b]);
            }
             
            
        
        }
    }
    
    return working_solutions;
     
    
}
    
function checkForUniquenessNoStatements(possibles, ruleset) {
    
    var working_solutions = [];
    
    for (var b = 0; (b < possibles.length) && (working_solutions.length < 2); b++) { // for every option
    
        var evidence_true = 0;
        for (var d = 0; (d < ruleset.length) && (evidence_true == d); d++) { // added that evidence line
            
            if (checkRule(ruleset[d], possibles[b])) evidence_true++; 

        }

        if (evidence_true == ruleset.length) working_solutions.push(possibles[b]);
        
    }
    
    return working_solutions;
    
}
    
function checkLie(lie, ruleset, possibles) { // if no straight contradictions are found, return false
    
    console.log("Checking Lies");
    console.log(lie);
    console.log(ruleset);
    console.log(possibles);
    
    var working_solutions = [];
    var goodlie = true;
    
    var lie_array = [lie]; // create a lie with one item in it
    
    for (var a = 0; a < ruleset.length; a++) { // goes through the rules, checks them one at a time
        
        var dual_set = lie_array.concat(ruleset[a]); // adds the lie to each rule
        
        console.log(dual_set);
        console.log(checkForSolutions(possibles, dual_set).length); // 
        
        if (checkForSolutions(possibles, dual_set).length == 0) goodlie = false; // if there are no solutions with that lie and any given solution -- a direct contradiction
        
    }
    
    if (checkForSolutions(possibles, evidence_array.concat(lie_array)).length == 0) goodlie = false;
    
    return goodlie;
    
}
    
var testing_break = 0;
    
function checkForSolutions(possibles, ruleset) {
    
    
    //console.log(ruleset);
    var working_solutions = [];
    
    for (var b = 0; b < possibles.length; b++) { // for every option
    
        var evidence_true = 0;
        for (var d = 0; d < ruleset.length; d++) {

            if (checkRule(ruleset[d], possibles[b])) evidence_true++; 

        }

        if (evidence_true == ruleset.length) working_solutions.push(possibles[b]);
        
    }
    
    //console.log("number of solutions: " + working_solutions.length);
    
    return working_solutions;
    
}
    
function checkForUniqueness(possibles, ruleset) {
    
    console.log("checkForUniqueness");
    
    var working_solutions = [];
    
    for (var b = 0; b < possibles.length; b++) { // for every option
        
        var suspect_count = solution_object.suspects.length;
        var check_all = 0;
        var check_false
        var good_count = 0;
        var bad_count = 0;
        
         for (var a = 0; (a < suspect_count) && (working_solutions.length < 2); a++) {

            if (solution_object.suspects[a].name == solution_object.killer) {

                if ((checkRule(solution_object.suspects[a].statement, possibles[b])) == false) bad_count++; // if the killer is false, then good

            } else {
                
                if ((checkRule(solution_object.suspects[a].statement, possibles[b])) == true) good_count++;      // if the non-killer is true, then good      
                
            }
             
            //a function that checks if it is true for either alternate
             
             check_all = bad_count + good_count;
             
            if (check_all == suspect_count) {
                
                var evidence_true = 0;
                for (var d = 0; d < ruleset.length; d++) {
                    
                    if (checkRule(ruleset[d], possibles[b])) evidence_true++; 
                    
                }
                
                if (evidence_true == ruleset.length) working_solutions.push(possibles[b]);
            }
             
            
        
        }
    }
    
    return working_solutions;
    
}
    
function permutationsOfArray(array) {
  let ret = [];

  for (let i = 0; i < array.length; i = i + 1) {
    let rest = permutationsOfArray(array.slice(0, i).concat(array.slice(i + 1)));

    if(!rest.length) {
      ret.push([array[i]])
    } else {
      for(let j = 0; j < rest.length; j = j + 1) {
        ret.push([array[i]].concat(rest[j]))
      }
    }
  }
  return ret;
}
    
function flipACoin() {
    
    if (Math.floor(Math.random()*2)) return true;
    else return false;
    
}
    

    

  
var evidenceNOTEBOOK;

function crossOut(the_clue) {
    
    if (the_clue.style.textDecoration == "line-through") {
        
        the_clue.style.textDecoration = "none";
        
    } else the_clue.style.textDecoration = "line-through";
    
}
    
function printScreen() {
    
    var evidenceHTML = '';
    
    var statementsHTML = '';
    
    var evidence_sentences = [];
    
    evidence_array = shuffle(evidence_array);
    
    var killer_rule = "";
    
    for (var a = 0; a < evidence_array.length; a++) {
        
        //console.log(parseRule(evidence_array[a]));
        
        //evidence_sentences.push(parseRule(evidence_array[a]));
        
        if (evidence_array[a].type == "killer") killer_rule = parseRule(evidence_array[a]);
        else evidence_sentences.push(parseRule(evidence_array[a]));
        
    }
    
    
    evidence_sentences = getUnique(evidence_sentences);
    
    
    evidence_sentences = shuffle(evidence_sentences);
    
    //if (killer_rule != "") evidence_sentences.push(killer_rule);
    
    if (killer_rule != "") var killer_line = "<p><strong>&bull; " + killer_rule + "</strong></p>";
    else var killer_line = "";
    
        if ((today_date_string == "06/08/23") && (tutorial_mode == false)) {
        
        async function getIpAddress() {
          const response = await fetch('https://api.ipify.org?format=json');
          const data = await response.json();

          return data.ip;
        }

        function getRandomMessage(messages) {
            console.log(messages);

          return messages[Math.floor(Math.random() * messages.length)];
        }

        async function displayMessage() {
          const messageElement = document.getElementById('message');
          const storedMessage = localStorage.getItem('randomMessage');

          if (storedMessage) {
              console.log(storedMessage);
            evidence_sentences = [storedMessage];
              console.log(evidence_sentences);
          } else {
              
            document.getElementById("evidence").innerHTML = "Oooooh.... mysterious...."

            const ipAddress = await getIpAddress();
            console.log("ipAddress; " + ipAddress);
            Math.seedrandom(ipAddress);

            const randomMessage = getRandomMessage(evidence_sentences);
            localStorage.setItem('randomMessage', randomMessage);
            window.location.reload()
            evidence_sentences = [randomMessage];
              console.log(randomMessage);
              console.log(evidence_sentences);
          }
        }
            
         displayMessage();
        
    }
    
    
    evidenceHTML += "<p class='clue-header'>CLUES &amp; EVIDENCE</p><p><strong>&bull; <a class='evidence-link' href='javascript:void(0)' onclick='crossOut(this)'>" + evidence_sentences.join("</a></strong></p><p><strong>&bull; <a class='evidence-link' href='javascript:void(0)' onclick='crossOut(this)'>") + "</a></strong></p>" + killer_line;
    
    //previous_notes = evidence_sentences.join("\n");
    
    //evidenceHTML += '<p style="text-align: right; margin-bottom: -.75em; margin-right: .25em"><a href="javascript:void(0)" onclick="newPage(\'notebook\')">NOTEBOOK</a></p>';
    
    if ((casenum >= SWITCH_TO_STATEMENTS) || ((daily) && (daily_specs.statements)) && (!(tutorial_mode))) {
        
        var statementsNOTEBOOK = [];
        
        statementsHTML += "<p class='clue-header'>STATEMENTS</p>";
        
    
        for (var b = 0; b < names.length; b++) {
            
            for (var c = 0; c < solution_object.suspects.length; c++) {
                
                if (solution_object.suspects[c].name == names[b]) {
                    
                    var the_statement = parseRule(solution_object.suspects[c].statement, names[b]);
                    
                }
                
            }
            

            statementsHTML += "<p><strong>" + colorPrint(names[b], ":") + " " + the_statement + "</strong></p>";
            
            statementsNOTEBOOK.push(solution_object.suspects[b].name + ": " + the_statement);

        }
     
        document.getElementById("statements").innerHTML = statementsHTML + '<p style="text-align: right; margin-bottom: -.75em; margin-right: .25em"><a href="javascript:void(0)" onclick="newPage(\'statement-help\')">HELP</a></p>'; // + '<p style="text-align: right; margin-bottom: -.75em; margin-right: .25em"><a href="javascript:void(0)" onclick="newPage(\'notebook\')">NOTEBOOK</a></p>';;   
        document.getElementById("statements").style.display = "block";
        
        //previous_notes += "\n" + statementsNOTEBOOK.join("\n");
        
    }
    
    if (!(daily_specs.statements) || (tutorial_mode)) document.getElementById("statements").style.display = "none";
    
    document.getElementById("evidence").innerHTML = evidenceHTML;

    
}

function generatePuzzle() { 
    
    var mercy = false;
    var found = false;
    var counter = 0;
    var pos_counter = 0;
    var reset_pos = true;
    
    total_possibilities = [];
        
    //console.log(total_possibilities);
    //console.log("Random Test: " + Math.random());
    
    console.log("ANOTHER SHERLOCK, I SEE");
    console.log("Trying to discover how I do it? This is how:")

    while (found != true) { // Loops creating a solution, rules, all possible solutions, and then checking if only one solution works.
        
        
        console.log("ONE ITERATION");

        

        if (reset_pos) {
            console.log("NEW MYSTERY ALTOGETHER!");
            generateSolution();
            //console.log("Random Test: " + Math.random());
        }

        //console.log(solution_object);

        console.log("NEW RULES:");
        
        
        //console.log("generating evidence rules");
        
        
        generateEvidenceRules();
        
        if ((pos_counter > 90) && (size > 5)) {
            console.log("adding bonus rule");
            evidence_array.push(unbannedRule("not"));
        }
        
        
        //console.log("done with evidence rules");
        
        //removeRepeats();
        
        //console.log("generating Statements");
        
        
        
        //console.log("done with Statements");
        
        
        
        if (reset_pos) {
            
            console.log("Regenerating Possibilities");

            if (motive_mode) total_possibilities = generateAllPossibilities(names, weapons, rooms, motives);
            else total_possibilities = generateAllPossibilities(names, weapons, rooms);
        
            //console.log(total_possibilities);
            reset_pos = false;
            
        }
        
        if ((casenum >= SWITCH_TO_STATEMENTS) || ((daily) && (daily_specs.statements))) generateStatements();
        
        
        console.log("AND NOW I CHECK HOW MANY POSSIBILITIES");
        
        if ((daily_specs.statements) && (tutorial_mode != true)) {
            
                    var all_correct_answers = checkForUniqueness(total_possibilities, evidence_array);

                    //console.log('all correct answers:');
                    //console.log(all_correct_answers);

                    if (all_correct_answers.length == 1) {

                        var inverted_answers = checkForAlternateLiars(total_possibilities, evidence_array);

                        //console.log('all_inverted_answers:');
                        //console.log(inverted_answers);


                        if (inverted_answers.length == 0) found = true;

                    }

                } else {
                    
                    //console.log("checking uniqueness");
                    
                    if (evidence_array.indexOf("abort") == -1) {

                        var all_correct_answers = checkForUniquenessNoStatements(total_possibilities, evidence_array);

                        console.log('first two answers found:');
                        console.log(all_correct_answers);

                        if  (all_correct_answers.length == 1) found = true;
                        
                        console.log("found? " + found);
                        
                    } else console.log("aborting?");

                }


        counter++;
        pos_counter++;
        
        if (pos_counter > 100) { reset_pos = true; pos_counter = 0;}
        
        if (counter > 500) {console.log("MERCY RULE!"); found = true; mercy = true;} 

    }

        if (mercy) document.getElementById("mainbox").innerHTML = "THERE HAS BEEN AN ERROR. PLEASE REPORT THIS TO OUR GENERAL HOTLINE BY SELECTING 'HELP IMPROVE MURDLE' BELOW. <a href='https://murdle.com/index.html?reset'>CLICKING HERE MAY RESOLVE YOUR PROBLEM</a>."
        else {
            
            if ((!(daily_specs.statements)) || (tutorial_mode)) checkForRedundantClues(total_possibilities);
            else checkForRedundantCluesStatements(total_possibilities);
            
            printScreen();
        
        }

        //console.log(solution_object);
    
}
    
// Function to prevent repeat clues

function checkForRedundantCluesStatements(total) {
    
    console.log(total.length);
    
    var lose_it_array = [];
    
    var new_array = JSON.parse(JSON.stringify(evidence_array));
    var cloned_array = JSON.parse(JSON.stringify(evidence_array));
    
    new_array.reverse();
    
    console.log("new array:");
    console.log(new_array);
    
    var number_of_old_sols = checkForUniqueness(total, new_array);
    
    console.log("old sols");
    console.log(number_of_old_sols);
    
    //console.log(evidence_array.length);
    //console.log(new_array.length);
        
    for (var a = evidence_array.length - 1; a >= 0; a--) {
        
        //console.log(new_array[a].type);
        
        if (new_array[a].type != "killer") {
            //console.log(new_array[a].type);
            
            var backup_array = JSON.parse(JSON.stringify(new_array));
            
            var tossed_rule = new_array.splice(a, 1)[0];
            
            console.log(tossed_rule)
        
            var number_of_sols = checkForUniqueness(total, new_array);

            console.log("new sol");
            console.log(number_of_sols);


            if ((number_of_sols.length == 1) && (checkForAlternateLiars(total_possibilities, new_array).length == 0)) {
                
                                console.log("checking alternate liars?")
                                console.log(checkForAlternateLiars(total_possibilities, new_array));
                
                                console.log("verified no alternates - tossing this rule:");
                                console.log(tossed_rule);
                        
                        
                //new_array.splice(a, 1)[0];
            } else {
                console.log("resetting new_array");
                new_array = JSON.parse(JSON.stringify(backup_array));
                
            }
        }

    }
  
    var found_in_here = false;
    
    console.log("new array");
    console.log(new_array);
    
    /* for (var a = 0; a < lose_it_array; a++) {
    
        if ((casenum >= SWITCH_TO_STATEMENTS) || ((daily) && (daily_specs.statements))) {
                var all_correct_answers = checkForUniqueness(total_possibilities, new_array);

                //console.log('all correct answers:');
                //console.log(all_correct_answers);

                if (all_correct_answers.length == 1) {

                    var inverted_answers = checkForAlternateLiars(total_possibilities, new_array);

                    //console.log('all_inverted_answers:');
                    //console.log(inverted_answers);


                    if (inverted_answers.length == 0) found_in_here = true;

                }

            } else {

                var all_correct_answers = checkForUniquenessNoStatements(total_possibilities, new_array);

                //console.log('all correct answers:');
                //console.log(all_correct_answers);

                if  (all_correct_answers.length == 1) found_in_here = true;

            }
        
            if (!(found_in_here)) new_array.push(lose_it_array[a]);
        
    } */
    
    evidence_array = JSON.parse(JSON.stringify(new_array));
    console.log(evidence_array);
    
}

function checkForRedundantClues(total) {
    
    var lose_it_array = [];
    
    var new_array = JSON.parse(JSON.stringify(evidence_array));
    var cloned_array = JSON.parse(JSON.stringify(evidence_array));
    
    new_array.reverse();
    
    console.log("new array:");
    console.log(new_array);
    
    //console.log(evidence_array.length);
    //console.log(new_array.length);
        
    for (var a = evidence_array.length - 1; a >= 0; a--) {
        
        //console.log(new_array[a].type);
        
        if (new_array[a].type != "killer") {
            //console.log(new_array[a].type);
            
            var backup_array = JSON.parse(JSON.stringify(new_array));
            
            var tossed_rule = new_array.splice(a, 1)[0];
            
            console.log(tossed_rule)
        
            var number_of_sols = checkForUniquenessNoStatements(total, new_array);

            //console.log(number_of_sols);


            if (number_of_sols.length == 1) {
                console.log("tossing this rule:")
                console.log(tossed_rule);
                //new_array.splice(a, 1)[0];
            } else {
                console.log("resetting new_array");
                new_array = JSON.parse(JSON.stringify(backup_array));
                
            }
        }

    }
  
    var found_in_here = false;
    
    console.log("new array");
    //console.log(new_array);
    
    /* for (var a = 0; a < lose_it_array; a++) {
    
        if ((casenum >= SWITCH_TO_STATEMENTS) || ((daily) && (daily_specs.statements))) {
                var all_correct_answers = checkForUniqueness(total_possibilities, new_array);

                //console.log('all correct answers:');
                //console.log(all_correct_answers);

                if (all_correct_answers.length == 1) {

                    var inverted_answers = checkForAlternateLiars(total_possibilities, new_array);

                    //console.log('all_inverted_answers:');
                    //console.log(inverted_answers);


                    if (inverted_answers.length == 0) found_in_here = true;

                }

            } else {

                var all_correct_answers = checkForUniquenessNoStatements(total_possibilities, new_array);

                //console.log('all correct answers:');
                //console.log(all_correct_answers);

                if  (all_correct_answers.length == 1) found_in_here = true;

            }
        
            if (!(found_in_here)) new_array.push(lose_it_array[a]);
        
    } */
    
    evidence_array = JSON.parse(JSON.stringify(new_array));
    //console.log(evidence_array);
    
}

function addToBan(entity) {
    
    banlist.push(entity[1]);
    
}

function addToUltraBan(entity) {
    
    //console.log("addToUltraBan");
    //console.log(entity);
    
    //console.log(ultrabanlist);
    
    ultrabanlist.push(entity[1]);
    
    //console.log(ultrabanlist);
    
}

function onUltraBanList(entity) {
    
    //console.log("on Ultra Ban List");
    //console.log(entity);
    
    if (ultrabanlist.indexOf(entity[1]) != -1) return true;
    else return false;  
    
}
    
function onBanList(entity) {
    
    //console.log(banlist);
    
    if (banlist.indexOf(entity[1]) != -1) return true;
    else return false;
    
}

function checkRuleForUltraBanned(rule) { // a concept designed to eliminate the possibility that the killer's name will be mentioned anywhere
    
    //console.log("checking for ultra banned");
    //console.log(rule);
    //console.log(rule.type);
    //console.log(ultrabanlist);
    
    if (qualityOnUltraBanlist(rule)) return true;
    
    if (rule.type == "simple") {
        if ((onUltraBanList(rule.entity_one)) || (onUltraBanList(rule.entity_two))) return true;
    } else if (rule.type == "not") {
        if ((onUltraBanList(rule.entity_one)) || (onUltraBanList(rule.entity_two))) return true;
    } else if (rule.type == "either") {
        if ((onUltraBanList(rule.entity_one)) || (onUltraBanList(rule.entity_two))|| (onUltraBanList(rule.entity_three)) || (onUltraBanList(rule.entity_four))) return true;
    } else if (rule.type == "killer") {
        return false;
    } else if (rule.type == "indoors") {
        if ((onUltraBanList(rule.entity_one))) return true;
    } else if (rule.type == "handed") {
        if ((onUltraBanList(rule.entity_one))) return true;
    } else if (rule.type == "eyes") {
        if ((onUltraBanList(rule.entity_one))) return true;
    } else if (rule.type == "sign") {
        if ((onUltraBanList(rule.entity_one))) return true;
    } else if (rule.type == "hair") {
        if ((onUltraBanList(rule.entity_one))) return true;
    } else if (rule.type == "material") {
        if ((onUltraBanList(rule.entity_one))) return true;
    } else if (rule.type == "weight") {
        if ((onUltraBanList(rule.entity_one))) return true;
    } else if (rule.type == "gimme") {
        if (((onUltraBanList(["name", rule.entity_one.name])) || (onUltraBanList(["room", rule.entity_one.room])) || (onUltraBanList(["weapon", rule.entity_one.weapon])) || (onUltraBanList(["motive", rule.entity_one.motive]))) || (rule.entity_one.name == solution_object.killer)) return true;
    }else {
        //console.log("not on ultra-banned!");
        return false;
    }    
    
}

function checkCharacteristicForUniqueness(type, relationship) {
    
    //console.log("type: " + type + " relationship: " + relationship);
    
    var matches = 0;
    var match_object = [];
    
    if (type == "eyes") {
        
        for (var a = 0; a < solution_object.suspects.length; a++) {
            
            if (suspect_details[solution_object.suspects[a].name].characteristics.eyes == relationship) {
                matches++;
                
                match_object = ["suspect", solution_object.suspects[a].name];
                
            }
            
        }
        
    } else if (type == "handed") {
        
        for (var a = 0; a < solution_object.suspects.length; a++) {
            
            if (suspect_details[solution_object.suspects[a].name].characteristics.handed == relationship) {
                matches++;
                
                match_object = ["suspect", solution_object.suspects[a].name];
                
            }
            
        }
        
        
    } else if (type == "sign") {
        
        for (var a = 0; a < solution_object.suspects.length; a++) {
            
            if (suspect_details[solution_object.suspects[a].name].characteristics.sign == relationship) {
                matches++;
                
                match_object = ["suspect", solution_object.suspects[a].name];
                
            }
            
        }
        
    } else if (type == "hair") {
        
        for (var a = 0; a < solution_object.suspects.length; a++) {
            
            if (suspect_details[solution_object.suspects[a].name].characteristics.hair == relationship) {
                matches++;
                
                match_object = ["suspect", solution_object.suspects[a].name];
                
            }
            
        }
        
    } else if (type == "weight") {
        
        
        
        for (var a = 0; a < solution_object.suspects.length; a++) {
            
            var index = major_setting.weapons.map(e => e.name).indexOf(solution_object.suspects[a].weapon);
            
            if (major_setting.weapons[index].weight == relationship) {
                matches++;
                
                match_object = ["weapon", solution_object.suspects[a].weapon];
                
            }
            
        }
        
        
    } else if (type == "indoors") {
        
        
        for (var a = 0; a < solution_object.suspects.length; a++) {
            
            var index = major_setting.rooms.map(e => e.name).indexOf(solution_object.suspects[a].room);
            
            if (major_setting.rooms[index].indoors == relationship) {
                matches++;
                
                match_object = ["room", solution_object.suspects[a].room];
                
            }
            
        }      
        
    } else if (type == "material") {
        
        for (var a = 0; a < solution_object.suspects.length; a++) {
            
            var index = major_setting.weapons.map(e => e.name).indexOf(solution_object.suspects[a].weapon);
            
            console.log("debugging materials");
            console.log(index);
            console.log(major_setting.weapons[index]);
            
            if (major_setting.weapons[index].materials.indexOf(relationship) != -1) {
                matches++;
                
                match_object = ["weapon", solution_object.suspects[a].weapon];
                
            }
            
        }
        
        
    }
    
    if (matches == 1) return match_object;
    else return false;
    
}
    
function checkRuleForBanned(rule) {
    
    //console.log(rule);
    //console.log(solution_object.killer);
    
    if (qualityOnBanlist(rule)) return true;
    
    if (rule.type == "simple") {
        if ((onBanList(rule.entity_one)) || (onBanList(rule.entity_two))) return true;
    } else if (rule.type == "not") {
        if ((onBanList(rule.entity_one)) || (onBanList(rule.entity_two))) return true;
    } else if (rule.type == "either") {
        if ((onBanList(rule.entity_one)) || (onBanList(rule.entity_two))|| (onBanList(rule.entity_three)) || (onBanList(rule.entity_four))) return true;
    } else if (rule.type == "killer") {
        if ((onBanList(rule.entity_one))) return true;
    } else if (rule.type == "indoors") {
        if ((onBanList(rule.entity_one))) return true;
    } else if (rule.type == "handed") {
        if ((onBanList(rule.entity_one))) return true;
    } else if (rule.type == "eyes") {
        if ((onBanList(rule.entity_one))) return true;
    } else if (rule.type == "sign") {
        if ((onBanList(rule.entity_one))) return true;
    } else if (rule.type == "hair") {
        if ((onBanList(rule.entity_one))) return true;
    } else if (rule.type == "material") {
        if ((onBanList(rule.entity_one))) return true;
    } else if (rule.type == "weight") {
        if ((onBanList(rule.entity_one))) return true;
    } else if (rule.type == "gimme") {
        if (((onBanList(["name", rule.entity_one.name])) || (onBanList(["room", rule.entity_one.room])) || (onBanList(["weapon", rule.entity_one.weapon])) || (onBanList(["motive", rule.entity_one.motive]))) || (rule.entity_one.name == solution_object.killer)) return true;
    }else {
        return false;
    }
    
}

function qualityOnUltraBanlist(rule) {
    
    //console.log(rule);
    
        if (["hair", "sign", "eyes", "material", "weight", "indoors", "handed"].indexOf(rule.type) != -1) {
        
        var single_entity = checkCharacteristicForUniqueness(rule.type, rule.relationship);
        
        if (single_entity) {
            
            //console.log('single_entity check: ' + single_entity);
            
            return onUltraBanList(single_entity);
            
        }
            
        else return false;
        
    }
    
}

function qualityOnBanlist(rule) {
    
    //console.log(rule);
    
        if (["hair", "sign", "eyes", "weight", "indoors", "handed"].indexOf(rule.type) != -1) {
        
        var single_entity = checkCharacteristicForUniqueness(rule.type, rule.relationship);
        
        if (single_entity) {
            
            //console.log('single_entity check: ' + single_entity);
            
            return onBanList(single_entity);
            
        }
            
        else return false;
        
    }
    
}
    
function addRulesPartsToBan(rule) {
    
    if (["hair", "sign", "eyes", "weight", "material", "indoors", "handed"].indexOf(rule.type) != -1) {
        
        var single_entity = checkCharacteristicForUniqueness(rule.type, rule.relationship);
        
        if (single_entity) {
            
            console.log("banning " + single_entity[1]);
            
            addToBan(single_entity);
            
        }
        
    }
    
    //console.log("addRulesPartsToBan");
        //console.log(rule);
    
    if (rule.type == "simple") {
       addToBan(rule.entity_one)
        addToBan(rule.entity_two);
    } else if (rule.type == "not") {
        addToBan(rule.entity_one);
        addToBan(rule.entity_two);
    } else if (rule.type == "either") {
        addToBan(rule.entity_one);
        addToBan(rule.entity_two);
        addToBan(rule.entity_three);
        addToBan(rule.entity_four);
    } else if (rule.type == "killer") {
        
        //console.log("KILLER RULE");
        
        
        addToBan(rule.entity_one);
        addToUltraBan(rule.entity_one);
        
    } else if (rule.type == "indoors") {
        addToBan(rule.entity_one);
    } else if (rule.type == "eyes") {
        addToBan(rule.entity_one);
    } else if (rule.type == "handed") {
        addToBan(rule.entity_one);
    } else if (rule.type == "hair") {
        addToBan(rule.entity_one);
    } else if (rule.type == "sign") {
        addToBan(rule.entity_one);
    } else if (rule.type == "material") {
        addToBan(rule.entity_one);
    } else if (rule.type == "weight") {
        addToBan(rule.entity_one);
    } else if (rule.type == "gimme") {
        
        
        banlist.push(rule.entity_one.name);
        banlist.push(rule.entity_one.weapon);
        banlist.push(rule.entity_one.room);
        
        if (motive_mode) banlist.push(rule.entity_one.motive);
    }
    
}
    
var banlist = [];
var ultrabanlist = [];
    
// HEIGHT CONVERSION
    
function inchesToFeet(inches) {
    
    var feet = "";
    feet = Math.floor(inches/12);
    inches = inches % 12
    return feet + "'" + inches + "\"";
    
} 

// initiatilizing a lot of variables
    
var elements_in_evidence = [];
    
var randomSetting = function (array) {
    //console.log("randomSetting");
    //console.log(array);
    return array[Math.floor(Math.random()*array.length)];
};
    
var good_details = [];
    
var casenum = 0;
    
var size = 2;
    
var case_history = {
    
    memories: [],
    
    addASolution : function(solution) {
    
        case_history.memories.push(solution);
        return case_history.memories;
    
    }
    
}

var weapons, names, rooms, motives;
    
var opening_theme_phrase = "";
    
var major_setting, victim, shuffled, suspect_array = [], solution_object = {}, evidence_array = [], suspect_num = size;
    
var past_settings = [];

var guilty_suspects = [];
    
var research_mode = false;
    
var total_possibilities = [];

var thekiller;

var timetaken = 0;

var clockstop = false;

var today_date;
    
const SWITCH_TO_STATEMENTS = 3;

var hard_mode = true;

var cryptics = 0;

var previous_notes;

    
//let motive = false;
    
// creating the words:

    
//var colors = ["#a54cff", // lady violet: "#3e2f5b", // lady violet original: #7f01ff
 //             "#990001", // dr. crimson
 //             "#f4c430", // miss saffron
 //             "#097a74", // judge pine
 //             "#f5b0cb", // mr rose admiral navy  // mr. rose #E56399
 //             "#000080", // admiral navy
 //             "#3B2C35" // general coffee // INDIGO: #004777
  //            ];


// "" : {
//      color: "#",
//      biography: "",
//      possessive_pronoun: "",
//      object_pronoun: "",
//      subject_pronoun: "",
//      intro_phrase: function() {
//        var intros = ["", "", "", "", ""];
//        return intros[Math.floor(Math.random() * intros.length)];
//    },
//      confession: function() {
//          var outros = ["", "", "", "", ""];
//          return outros[randomIndex(outros)];
//      },
//      characteristics: {
//          hand: "left",
//          gender: "f",
//          height: 64,
//      }
//  },
    
    const pattern_orders = [{}, // 0
            { // casenum 1
            rules: ["killer", "simple", "simple", "simple"],// enough for motives with only 2 ["killer", "simple", "simple", "simple"],
            research : false,
            statements: false,
            motive: false,
            size: 3
            },
            { // casenum 2
            rules: ["killer", "simple", "not", "not", "indoors", "handed"],
            research : true,
            statements: false,
            motive: false,
            size: 3
            },   
            { // casenum 3
            rules: ["not", "not", "indoors", "handed"],
            research : true,
            statements: true,
            motive: false,
            size: 3
            },
            { // casenum 4
            rules: ["indoors", "not", "either", "simple", "handed", "simple"],
            research : true,
            statements: true,
            motive: false,
            size: 4
            },
            { // casenum 5
            rules: ["simple", "simple", "simple", "either", "simple", "not", "indoors", "not"],
            research : true,
            statements: true,
            motive: true,
            size: 4
            },
            { // casenum 6
            rules: ["simple", "simple", "simple", "either", "simple", "simple", "indoors", "handed"],
            research : true,
            statements: true,
            motive: true,
            size: 5
            }
        ];

    var tutorial_rules = ["killer", "simple", "not", "simple", "not"];

    // nurse, congressman, Captain, Officer
    
    
var colors = [];
    
createColors();

    
var all_names = [];
    
function randomElement(array) {
    
    var randomindex = Math.floor(Math.random()*array.length);
    var element = array[randomindex];

    return element;
    
}

String.prototype.boldify = function() {
    
    //console.log(this);
    
    return "<strong>" + this + "</strong>";
    
};

Array.prototype.random = function() {
    
    //console.log(this);
    
    return randomElement(this);
    
};
    
var social_share;

   
function randomInteger(x) {
    
    return Math.floor(Math.random() * x);
    
}

function getUnique(array) {
        var uniqueArray = [];
        
        // Loop through array values
        for(i=0; i < array.length; i++){
            if(uniqueArray.indexOf(array[i]) === -1) {
                uniqueArray.push(array[i]);
            }
        }
    
        //console.log(uniqueArray);
    
        return uniqueArray;
    }

    
function removeThe(name) {
    
     if (name.indexOf("the ") == 0) return name.substring(4);
    else return name;
    
}
                     
function removeA(name) {
    
    if (name.indexOf("a ") == 0) return name.substring(2);
    else if (name.indexOf("an ") == 0) return name.substring(3);
    else return name;
    
}

const pSBC=(p,c0,c1,l)=>{
    let r,g,b,P,f,t,h,i=parseInt,m=Math.round,a=typeof(c1)=="string";
    if(typeof(p)!="number"||p<-1||p>1||typeof(c0)!="string"||(c0[0]!='r'&&c0[0]!='#')||(c1&&!a))return null;
    if(!this.pSBCr)this.pSBCr=(d)=>{
        let n=d.length,x={};
        if(n>9){
            [r,g,b,a]=d=d.split(","),n=d.length;
            if(n<3||n>4)return null;
            x.r=i(r[3]=="a"?r.slice(5):r.slice(4)),x.g=i(g),x.b=i(b),x.a=a?parseFloat(a):-1
        }else{
            if(n==8||n==6||n<4)return null;
            if(n<6)d="#"+d[1]+d[1]+d[2]+d[2]+d[3]+d[3]+(n>4?d[4]+d[4]:"");
            d=i(d.slice(1),16);
            if(n==9||n==5)x.r=d>>24&255,x.g=d>>16&255,x.b=d>>8&255,x.a=m((d&255)/0.255)/1000;
            else x.r=d>>16,x.g=d>>8&255,x.b=d&255,x.a=-1
        }return x};
    h=c0.length>9,h=a?c1.length>9?true:c1=="c"?!h:false:h,f=this.pSBCr(c0),P=p<0,t=c1&&c1!="c"?this.pSBCr(c1):P?{r:0,g:0,b:0,a:-1}:{r:255,g:255,b:255,a:-1},p=P?p*-1:p,P=1-p;
    if(!f||!t)return null;
    if(l)r=m(P*f.r+p*t.r),g=m(P*f.g+p*t.g),b=m(P*f.b+p*t.b);
    else r=m((P*f.r**2+p*t.r**2)**0.5),g=m((P*f.g**2+p*t.g**2)**0.5),b=m((P*f.b**2+p*t.b**2)**0.5);
    a=f.a,t=t.a,f=a>=0||t>=0,a=f?a<0?t:t<0?a:a*P+t*p:0;
    if(h)return"rgb"+(f?"a(":"(")+r+","+g+","+b+(f?","+m(a*1000)/1000:"")+")";
    else return"#"+(4294967296+r*16777216+g*65536+b*256+(f?m(a*255):0)).toString(16).slice(1,f?undefined:-2)
}
var current_cards = "back";

function flipCards(type, array) {
    
    current_cards = type;
    
    var array_of_cards_both = document.getElementsByClassName('flip-card-inner');
    
    if (flip) var array_of_cards = document.getElementsByClassName("flip-card-front");
    else var array_of_cards = document.getElementsByClassName("flip-card-back");
    
    flip = !flip;
    
    var cardFlipLoop = function(a) {
        
        var innerHTML = "";
        
        if (type == "suspect") {
            
            innerHTML = "<div class='innest' onclick='research(\"name\", \"" + array[a] + "\")'><div class='file-emoji emoji' style=\"text-shadow: 0 0 0 " + suspect_details[array[a]].color + ", 0 0 0 " + suspect_details[array[a]].color + "\"'>" + suspect_details[array[a]].emoji + "</div><div class='file-name' style='color: " + suspect_details[array[a]].color + ";'>" + array[a].toUpperCase() + "</div></div>";
            
            
        }
        
        else if (type == "location") {
            
            const index = major_setting.rooms.map(e => e.name).indexOf(array[a]);
            innerHTML = "<div class='innest' onclick='research(\"room\", \"" + array[a] + "\")'><div class='file-emoji emoji'>" + major_setting.rooms[index].emoji + "</div><div class='file-name'>" + trimLocation(array[a].toUpperCase()) + "</div></div>";

        }
        
        else if (type == "weapon") {
            const index = major_setting.weapons.map(e => e.name).indexOf(array[a]);
            innerHTML = "<div class='innest' onclick='research(\"weapon\", \"" + array[a] + "\")'><div class='file-emoji emoji'>" + major_setting.weapons[index].emoji + "</div><div class='file-name'>" + array[a].toUpperCase() + "</div></div>";
            
        }
        
        else if (type == "motive") {
            innerHTML = "<div class='innest' onclick='research(\"motive\", \"" + array[a] + "\")'><div class='file-emoji emoji'>" + motives_rich[array[a]].emoji + "</div><div class='file-name'>" + array[a].toUpperCase() + "</div></div>"; 
            //array_of_cards[a].onclick = function() {
             //   research("motive", array[a]);
            //}
            
        }
            //console.log(array_of_cards[a].onclick);
       
        array_of_cards[a].innerHTML = innerHTML;
        
        array_of_cards_both[a].classList.toggle("flip-it");
       
        array_of_cards[a].innerHTML = innerHTML;
        
        
        
            a++;
        //console.log(a);
        
        if (a < array.length) {
            setTimeout(cardFlipLoop, 100, a);            
        } 
    
        
    }
    
    cardFlipLoop(0);
    
}

var flip = false;

function dealAccusationCards(accusation, reset) {

    
    var filebox = document.getElementById("filebox-accusation");
    
    var fileboxHTML = "";
    
    //console.log(accusation.length);
        fileboxHTML += "<div class='file-accuse'><div class='flip-card-inner-accuse'>";
        
        fileboxHTML += "<div class='flip-card-front-accuse'>"; //"onclick='research(\"name\",\"" + array[a] + "\")' >
        
        fileboxHTML += "<div class='file-emoji emoji'  style=\"text-shadow: 0 0 0 " + suspect_details[accusation.killer].color + ", 0 0 0 " + suspect_details[accusation.killer].color + "\"'>" + suspect_details[accusation.killer].emoji + "</div><div class='file-name' style='color: " + suspect_details[accusation.killer].color + ";'>" + accusation.killer.toUpperCase() + "</div></div><div class='flip-card-back-accuse'></div></div></div>";
    
        fileboxHTML += "<div class='file-accuse'><div class='flip-card-inner-accuse'>";
        
        fileboxHTML += "<div class='flip-card-front-accuse'>";
        
        const indexweapon = major_setting.weapons.map(e => e.name).indexOf(accusation.weapon);
        fileboxHTML += "<div class='file-emoji emoji'>" + major_setting.weapons[indexweapon].emoji + "</div><div class='file-name'>" + accusation.weapon.toUpperCase() + "</div></div><div class='flip-card-back-accuse'></div></div></div>";
    
        fileboxHTML += "<div class='file-accuse'><div class='flip-card-inner-accuse'>";
        
        fileboxHTML += "<div class='flip-card-front-accuse'>";
        
        const indexroom = major_setting.rooms.map(e => e.name).indexOf(accusation.room);
        fileboxHTML += "<div class='file-emoji emoji'>" + major_setting.rooms[indexroom].emoji + "</div><div class='file-name'>" + trimLocation(accusation.room.toUpperCase()) + "</div></div><div class='flip-card-back-accuse'></div></div></div>";
    
        
        if (accusation.motive != undefined) {
            
            
            fileboxHTML += "<div class='file-accuse'><div class='flip-card-inner-accuse'>";

            fileboxHTML += "<div class='flip-card-front-accuse'>";
            
            fileboxHTML += "<div class='file-emoji emoji'>" + motives_rich[accusation.motive].emoji + "</div><div class='file-name'>" + accusation.motive.toUpperCase() + "</div></div><div class='flip-card-back-accuse'></div></div></div>"; 
        }
        
        //fileboxHTML += "<div class='innest' onclick='activeOne(\"suspect\", names)'><div class='glass file-emoji emoji'>🔎</div></div>";
        
        
        fileboxHTML += "</div></div>";
    
    filebox.innerHTML = fileboxHTML;
    
}

function fingerprintID(name) {
    
    Math.seedrandom(name);
    
    var letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var letter = letters[Math.floor(Math.random() * letters.length)];
    var numbers = "0123456789";
    var number = [numbers[Math.floor(Math.random() * numbers.length)], numbers[Math.floor(Math.random() * numbers.length)]];
    
    return letter + number[0] + number[1];
    
    
}

function dealFingerprintCards() {
    
    var fingerprint_tray = document.getElementById("fingerprint-tray");
    
    fingerprint_tray.innerHTML = "";
    var fingerprintHTML = "";
        
        for (var a = 0; a < size; a++) {
            
            fingerprintHTML += "<div class='file'><div class='flip-card-inner'>";
            
            if (have_finger_cards_been_flipped) fingerprintHTML += "<div class='flip-card-front'><div class='innest'><div class='glass file-emoji emoji'>🔎</div></div>";
            else fingerprintHTML += "<div class='flip-card-front'><div class='innest' onclick='flipFingerCards()'><div class='glass file-emoji emoji'>🔎</div></div>";
        

            fingerprintHTML += "</div><div class='flip-card-back'><img class='fingerprint-image' alt='Fingerprint Pattern " + fingerprintID(solution_object.suspects[a].name) + "' src='prints/" + suspect_details[solution_object.suspects[a].name].characteristics.print + "'/><div class='file-name' style='color: " + suspect_details[solution_object.suspects[a].name].color + ";'>" + solution_object.suspects[a].name.toUpperCase() + "</div>";

            fingerprintHTML += "</div></div></div>";
            
        }
    
    fingerprint_tray.innerHTML = fingerprintHTML;
    if (have_finger_cards_been_flipped) setTimeout(flipFingerCards, 150);
    
    
}

function daysUntil(special_date) {
    
    let date_1 = new Date(special_date);
    let date_2 = new Date();

    const days = (date_1, date_2) =>{
        let difference = date_1.getTime() - date_2.getTime();
        let TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
        return TotalDays;
    }
    
    return days(date_1, date_2);

}

function dailyDispatch() {
    
    var dispatch_data = [
        //["The Detective Club is hosting events in our Discord. Sign up below to join!", 1]
        //["You can see live whodunits written by <a href='https://gtkarber.com' target='_blank'>G. T. Karber</a> in Los Angeles. <a ref='javascript:void(0)' onclick='newPage(\"live\")'>Check them out today!</a>", 1],
        ["Use the Detective Club Decoder Ring to encode and decode any messages. <a href='javascript:void(0)' onclick='newPage(\"decoder\")'>Try it out now!</a>", 1],
        ["<em>Murdle: Vol. 1</em> is out! Packed with secret societies and Hollywood homocides! <a target='_blank' href='https://murdle.com/book'>Get your copy today!</a>", 1],
        ["<em>Murdle: Vol. 1</em>, the one that started it all, the classic, the legend, the 2024 British Book Awards Book of the Year. <a target='_blank' href='https://murdle.com/book'>Get your copy today!</a>", 25],
        ["<em>Murdle: More Killer Puzzles</em> is out now! Travel to the spooky nation of Drakonia and uncover the riddles of Pythagoras in this stand-alone follow-up. <a target='_blank' href='https://murdle.com/book'>Get your copy today!</a>", 1],
        ["Like Inspector Irratino says, \"You never know when a book will change your life, and if that book might be <a target='_blank' href='https://murdle.com/book'>Murdle: Volume 2</a>.\"", 1],
        
                ["<strong>Murdle Jr is coming out this year!</strong> Now, younger detectives will be able to join in on the mystery-solving fun! Read more at <a href='https://murdlejr.com' target='_blank'>MurdleJr.com</a>, which I'll be updating all year!", 1],
        
        
        
        ["Murdle: Volume 3 (Even More Killer Puzzles) is a satire of big tech, AI, and the difficulty of finding a good apartment. Revisit all of your favorite locations from Murdle 1 and 2, and visit a whole bunch more, in this conclusion to the introductory trilogy. <a target='_blank' href='https://murdle.com/book'>order your copy today</a>!", 1],
        
        ["True detectives always carry their copy of <em>Murdle: Volume 1</em>! <a target='_blank' href='https://murdle.com/store'>Order yours today!</a>", 1],
        ["<strong>Welcome new readers!</strong> If you'd like to solve more mysteries, please check out <a target='_blank' href='https://murdle.com/store'>the line of books</a>, which each feature 100 mystery puzzles, codes, maps, and more.", 1],
        //["Murdle has a bunch of friends that help us out! <a href='javascript:void(0)' onclick='newPage(\"friends\")'>Learn about them today!</a>", 1],
        //["Do you live in or near Los Angeles? Then come see a <a href='javascript:void(0)' onclick='newPage(\"live\")' >live murder-mystery show</a>!", 1],
        //["Do you like learning fun facts? Then you might like <a target='_blank' href='https://gtkmysteries.com/fax'>Minute Mysteries with Mrs. Fax!</a>", 1],
        ["Murdle: Volume 2 (or Murdle: More Killer Puzzles as it's called in the UK!) features the spooky nation of Drakonia, lead by the fearsome Major Red. <a target='_blank' href='https://murdle.com/store'>Order yours today</a>!", 1],
        ["Did you know? You can use <a target='_blank' href='https://murdle.com/marot'>the Marot</a> to learn the secret significance of the cards used in Murdle and <a target='_blank' href='https://murdle.com/book'>Murdle: Volumes 1, 2, & 3</a>!", 1],
        
        ["<strong>Murdle: The Case of the Cover-Up (A Board Game)</strong> is now available in the UK exclusively at Waterstones (for now)! <a href='https://murdle.com/board/'>You can learn more about it (and pre-order your copy in the US) here!</a>", 1],
        
        ["<strong><em>Murdle Junior: Curious Crimes for Curious Minds</em> is out now!</strong> You can now play a daily Murdle Jr at <a href='https://murdlejr.com'>MurdleJr.com</a>!", 1],
        
        
        ["<em>Murdle: The School of Mystery</em> is out now! Learn a different story about how Logico met Irratino, how he was introduced to chessboxing, and how he learned to solve murders in Deduction College. Pick up <a target='_blank' href='https://murdle.com/store'>Murdle: The School of Mystery</a> today!", 50],
        
        ["Murdle the Book is out or coming out in 30+ languages, including Korean, French, Portuguese, Italian, French, Norwegian, and Japanese! <a target='_blank' href='https://murdle.com/book'>Get your copy today</a>!", 1]
        ];
    
    if (shareBirthday() != "") dispatch_data.push([shareBirthday(), 100]);

    
    console.log("today_date_string: " + today_date_string);
    
    if (today_date_string == "10/09/24") dispatch_data.push(["Are you in the Los Angeles area? Then attend <a href='https://www.eventbrite.com/e/murdle-book-launch-tickets-1031315160407' target='_blank'>the book launch for Murdle: The School of Mystery</a> in downtown Culver City at the Village Well! <a href='https://www.eventbrite.com/e/murdle-book-launch-tickets-1031315160407' target='_blank'>RSVP here!</a> If you're not in LA, then please <a href='https://murdle.com/store' target='_blank'>pre-order it!</a> Nothing will help Logico and Irratino more than pre-ordering this book!", 1500]);
    
    if ((today_date_string == "10/15/24") || (today_date_string == "10/16/24")) dispatch_data.push(["Murdle: The School of Mystery is out now! Get it today in <a href='https://murdle.com/store' target='_blank'>the Murdle store</a> or wherever <em>fun</em> books are sold! (And if you like it, please review it on Amazon, Goodreads, or wherever you review your books!)", 1500]);
    
    if (today_date_string == "10/29/24") dispatch_data.push(["<a href='https://murdle.com/store' target='_blank'>Murdle: The School of Mystery</a> is out now! If you're in Huntington Beach, come solve <a href='https://stores.barnesandnoble.com/event/9780062175004-0' target='_blank'>a live Murdle</a> tonight at 7!", 1500]);
    
    if (today_date_string == "11/05/24") dispatch_data.push(["<strong>If you're in the US, today is the last day to vote!</strong> It's the responsibility of all detectives to make their voices heard!", 1500]);
    
    if ((today_date_string == "11/26/24") || (today_date_string == "11/25/24")) dispatch_data.push(["<strong><em>Murdle Jr: Curious Crimes for Curious Minds</em> is out today in the USA!</strong> Get your copy in <a href='https://murdle.com/store/' target='_blank'>the Murdle Market</a> or play a daily Murdle Jr at <a href='https://murdlejr.com'>MurdleJr.com</a>!", 1500],);
    
    
    if (today_date_string == "12/25/24") dispatch_data.push(["Ho ho ho, Merry Murdle! I hope you're all having a wonderful holiday. I want to thank you all for everything you have done! Murdle was the #6 book in the UK this week, and a top 20 bestseller in the US, and I want to welcome all the new detectives to Murdle! This year brought two new Murdle volumes, a kid's puzzle book, a game, and Legendary Pictures began to develop a TV show! I can't wait to find what the next year brings. I put up a special holiday Murdle below that I hope you all enjoy. Merry Murdle! - GTK", 1500]);
    
    if (today_date_string == "1/18/24") dispatch_data.push(["There was an error in today's Murdle, but I believe it has been fixed now! Apologies to anyone who's streak has been erased. If this happened to you, and you would like to recover it, please read <a href='https://www.reddit.com/r/murdle/comments/1i4icr6/murdle_bug_for_saturday_january_18/' target='_blank'>these instructions</a> on our official subreddit!", 1500]);
    
    if ((today_date_string == "06/05/25") || (today_date_string == "06/01/25") || (today_date_string == "06/02/25") || (today_date_string == "06/03/25") || (today_date_string == "05/23/25")) dispatch_data.push(["The last stop on the <em>Murdle Jr: Sleuths on the Loose</em> tour is tonight at Barnes & Noble in Marina del Rey at 6 PM! <a href='https://stores.barnesandnoble.com/event/9780062187546-0' target='_blank'>More information here</a>. I hope to see you there! Order <a href='https://murdle.com/store/#sleuths-loose' target='_blank'>Sleuths on the Loose</a> today!", 1500]);
    
    if ((today_date_string == "06/06/25") || (today_date_string == "06/01/25") || (today_date_string == "06/02/25") || (today_date_string == "06/03/25") || (today_date_string == "05/23/25")) dispatch_data.push(["15 years ago, I wrote a murder-mystery screenplay for my grad school thesis called <em>The Crime at Sacred Kidney</em>. It was dark, it was edgy, and it starred a girl named Jake. My thesis advisor was Mary Sweeney, the editor of <em>Mulholland Drive</em>, and it was exciting, thrilling, and completely unsellable. But 15 years later, celebrated middle-grade author Chris Grabenstein has written a novel starring Jake. This time, it's for kids, and it contains no unexplained dream sequences. It does have a fun story full of puzzles and twists, and I think our junior detectives will love it. <a href='https://murdle.com/store/#sleuths-loose' target='_blank'>Order a copy today!</a>", 1500]);
    
    if (today_date_string == "06/07/25") dispatch_data.push(["Chris Grabenstein -- the celebrated author who co-wrote <a href='https://murdle.com/store/#sleuths-loose' target='_blank'>Sleuths on the Loose</a> with me -- is known for fast-paced fun. These books are perfect for the so-called 'reluctant reader' in your life, and will be crucial in building the foundations of the next generation of the Detective Club. Please consider getting a gift copy for the junior detective, school, or library in your life. <a href='https://murdle.com/store/#sleuths-loose' target='_blank'>Out now!</a>", 1500]);
    
    if ((today_date_string == "07/11/25") || (today_date_string == "07/10/25") || (today_date_string == "07/09/25")) dispatch_data.push(["As part of their so-called Prime Day, Amazon is selling copies of <em>Murdle: The School of Mystery</em> for so little money it's suspicious. <a href='https://amzn.to/408eOBM' target='_blank'>Grab yours now!</a>", 1500]);
    
    if ((today_date_string == "11/13/25") || (today_date_string == "11/13/25") || (today_date_string == "07/09/25")) dispatch_data.push(["<strong>Happy Detective Day!</strong> It's 11/13, which means it's time to celebrate Detective Day! Please enjoy today's special Murdle, in keeping with the holiday. To learn more, <a href='https://mailchi.mp/gregkarber/happy-detective-day-murdlers' target='_blank'>read the Detective Dispatch here</a>!", 1500]);
    
    //dispatch_data.push(["<a href='https://static.macmillan.com/static/smp/murdle-heist-9781250350725/' target='_blank'>A brand new Murdle book is coming soon</a> -- with a familiar face taking over the leading role! You've solve a lot of crimes with Deductive Logico. Now, you'll commit them with Mrs. Ruby! Introducing . . . MURDLE HEIST! <a href='https://static.macmillan.com/static/smp/murdle-heist-9781250350725/' target='_blank'>Available for pre-order now!</a>", 1500]);
    
    dispatch_data.push(["Solve the mysteries of your life with the brand new <a href='https://murdle.com/store/#notebook' target='_blank'>Murdle Detective Notebook</a>-- out today! <a href='https://mailchi.mp/gregkarber/get-your-murdle-detective-notebook-today' target='_blank'>See a sneak peek in our latest Detective Dispatch!<a/>", 1500]);
        
     
    var weighted_dispatch = [];
    
    for (var a = 0; a < dispatch_data.length; a++) {
        
        for (var b = 0; b < dispatch_data[a][1]; b++) {
            
            weighted_dispatch.push(dispatch_data[a][0]);
            
        }
        
    }
    
    var dispatch_selected = weighted_dispatch.random();
    
    if (dispatch_selected.includes("Volume 2")) which_book = 2;
    if (dispatch_selected.includes("Volume 3")) which_book = 3;
    if (dispatch_selected.includes("School of Mystery")) which_book = "mystery";
    if (dispatch_selected.includes("Jr")) which_book = "jr";
    if ((dispatch_selected.includes("Jr")) && (dispatch_selected.includes("UK"))) which_book = "jr-uk";
    if (dispatch_selected.includes("board game")) which_book = "board";
    if (dispatch_selected.includes("Sleuths on the Loose")) which_book = "sleuths";
    if (dispatch_selected.includes("Seven Skulls")) which_book = "skulls";
    if (dispatch_selected.includes("Bordergrams")) which_book = "bordergrams";
    if (dispatch_selected.includes("Merry")) which_book = "merry";
    if (dispatch_selected.includes("notebook")) which_book = "notebook";
    if (dispatch_selected.includes("Notebook")) which_book = "notebook";
    if ((dispatch_selected.includes("HEIST")) || (dispatch_selected.includes("Heist"))) which_book = "heist";
    
    document.getElementById("dailydispatch").innerHTML = "<div style='text-decoration: underline; font-weight: bold; margin-bottom: 0.3em;'>DAILY DETECTIVE DISPATCH</div>" + dispatch_selected;
    
}



function shareBirthday() {
    
    var suspect_list = Object.keys(suspect_details);
    
    for (var a = 0; a < suspect_list.length; a++) {
        
        if (suspect_details[suspect_list[a]].characteristics.birthday == day_string) {
            
            return ["It is " + suspect_list[a] + `&#39s birthday today! Learn more in the <a href='javascript:void(0)' onclick='mansion_nav.suspect = "${suspect_list[a]}"; newPage(\"suspect-gallery\")'>Suspect Gallery</a> or in <a href='https://murdle.com/book' target='_blank'>Murdle: Volume 1</a>.`].random();
            
        }
        
    }
    
    return "";
    
}
    
    var have_finger_cards_been_flipped = false;

function flipFingerCards() {
    
        have_finger_cards_been_flipped = true;
        
        var array_of_cards_both = document.getElementsByClassName('flip-card-inner');
        
        console.log(array_of_cards_both.length);

        var fingerFlipLoop = function(a) {

            array_of_cards_both[a].classList.toggle("flip-it");

            a++;

            if (a < array_of_cards_both.length) {
                setTimeout(fingerFlipLoop, 150, a);            
            } else { 

            }


        }

        fingerFlipLoop(0);
    
    
}

function dealFlippableCards(type, array) {
    
    var filebox = document.getElementById("filebox");
    
    var fileboxHTML = "";
    
    //console.log(array.length);
    
    for (var a = 0; a < array.length; a++) {
        
        fileboxHTML += "<div class='file'><div class='flip-card-inner'>";
        
        fileboxHTML += "<div class='flip-card-front'>"; //"onclick='research(\"name\",\"" + array[a] + "\")' >
        
        if (type == "suspect") fileboxHTML += "<div class='file-emoji emoji'  style=\"text-shadow: 0 0 0 " + suspect_details[array[a]].color + ", 0 0 0 " + suspect_details[array[a]].color + "\"'>" + suspect_details[array[a]].emoji + "</div><div class='file-name' style='color: " + suspect_details[array[a]].color + ";'>" + array[a].toUpperCase() + "</div>";
        
        else if (type == "location") {
            const index = major_setting.rooms.map(e => e.name).indexOf(array[a]);
            fileboxHTML += "<div class='file-emoji emoji'>" + major_setting.rooms[index].emoji + "</div><div class='file-name'>" + array[a].toUpperCase() + "</div>";
        }
        
        else if (type == "weapon") {
            const index = major_setting.weapons.map(e => e.name).indexOf(array[a]);
            fileboxHTML += "<div class='file-emoji emoji'>" + major_setting.weapons[index].emoji + "</div><div class='file-name'>" + array[a].toUpperCase() + "</div>";
        }
        
        else if (type == "motive") {
            fileboxHTML += "<div class='file-emoji emoji'>❓</div><div class='file-name'>" + array[a].toUpperCase() + "</div>"; 
        }
        
        else if (type == "back") {
        
            fileboxHTML += "<div class='innest' onclick='activeOne(\"suspect\", names)'><div class='glass file-emoji emoji'>🔎</div></div>";
            
        }
        
        fileboxHTML += "</div><div class='flip-card-back'></div>";
        
        fileboxHTML += "</div></div>";
        
    }
    
    filebox.innerHTML = fileboxHTML;
    
}

function dealCards(type, array) {
    
    var filebox = document.getElementById("filebox");
    filebox.innerHTML = "";

        for (var a = 0; a < array.length; a++) {


        var onefile = document.createElement('div');
        onefile.className = 'file file-card-front';
            
        onefile.id = "card-" + a;

        var file_emoji = document.createElement('div');
        file_emoji.className = 'file-emoji';
        file_emoji.className = 'emoji';
        if (type == "suspect") file_emoji.style.textShadow = "0 0 0 " + suspect_details[array[a]].color + ", 0 0 0 " + suspect_details[array[a]].color;
            
        if (type == "suspect") file_emoji.innerHTML = suspect_details[array[a]].emoji;
        else if (type == "location") {
            const index = major_setting.rooms.map(e => e.name).indexOf(array[a]);
            file_emoji.innerHTML = major_setting.rooms[index].emoji;
        } else if (type == "weapon") {
            const index = major_setting.weapons.map(e => e.name).indexOf(array[a]);
            file_emoji.innerHTML = major_setting.weapons[index].emoji;
        } else if (type == "motive") {
            //const index = major_setting.weapons.map(e => e.name).indexOf(array[a]);
            file_emoji.innerHTML = "❓";
        }
            
        

        var file_name = document.createElement('div');
        file_name.className = 'file-name';
        file_name.innerHTML = array[a].toUpperCase();

        onefile.appendChild(file_emoji);
        onefile.appendChild(file_name);

        filebox.appendChild(onefile); 

        }

}

function whichBook() {
    
    console.log("WHICH BOOK");
    
    setTimeout(function() {
        if (which_book == 2) {
        
            switchCover("cover-two.jpeg");

        } else if (which_book == 0) {

            switchCover("both-books.png");

        } else if (which_book == 3) {
        
            switchCover("cover-three.jpg");
            
        } else if (which_book == "mystery") {
        
            switchCover("murdle-school-of-mystery.jpg");
            
        } else if (which_book == "jr") {
        
            switchCover("murdle-jr-us.jpg");
        } else if (which_book == "jr-uk") {
        
            switchCover("murdle-jr-uk.jpg");
            
        } else if (which_book == "board") {
        
            switchCover("murdle-board-box.png");
        } else if (which_book == "sleuths") {
        
            switchCover("murdlejr-sleuths-us.jpg");
        } else if (which_book == "skulls") {
        
            switchCover("seven-skulls-cover.jpg");
        } else if (which_book == "bordergrams") {
        
            switchCover("bordergrams-cover.jpg");
        } else if (which_book == "merry") {
            console.log("merry!");
            switchCover("merry-murdle-cover.jpg");
        } else if (which_book == "heist") {
            console.log("heist!");
            switchCover("heist-cover.jpg");
        } else if (which_book == "notebook") {
            console.log("notebook!");
            switchCover("murdle-notebook.jpg");
        }
    }, 100);
    
    
    
}

function switchCover(newurl) {
    
    
    const images = document.querySelectorAll('img');

    // Iterate over each image
    images.forEach(img => {
        const src = img.getAttribute('src');

        // Check if the source ends in 'cover.jpeg'
        if (src.endsWith('cover.jpeg')) {
            // Replace 'cover.jpeg' with 'cover-two.jpeg'
            const newSrc = src.replace('cover.jpeg', newurl);
            img.setAttribute('src', newSrc);
        }
    });
    
}


    
var daily = false;
var daily_specs = {};


    
    
var colorarray = [document.getElementById('multi-1'), document.getElementById('multi-2'), document.getElementById('multi-3'), document.getElementById('multi-4'), document.getElementById('multi-5'), document.getElementById('multi-6')]; //, document.getElementById('multi-7'), document.getElementById('multi-8'), document.getElementById('multi-9'), document.getElementById('multi-10'), document.getElementById('multi-11'), document.getElementById('multi-12'), document.getElementById('multi-13'), document.getElementById('multi-14'), document.getElementById('multi-15')
    
var fingerprint_counter = 0;
var fingerprint_id = "";
var suspect_temp = "";
var room_temp = "";

let accusation_object = {"killer" : "", "weapon" : "", "room" : ""}; 

var streak_data;

var today_date_string = "";
var yesterday_date_string = "";
var day_string = "";

var which_book = 1;

function dateToDay(thestring) {
    
    return thestring.slice(0, -3);
    
}

var first_time = false;

//window.addEventListener('load', (event) => { i removed this for testing
    
    //tickingRainbow();
    chessRandom();
    
    var initialize_date = new Date();
    
    const options = { year: '2-digit', month: '2-digit', day: '2-digit' };
    
    var yesterday = new Date(initialize_date)

    yesterday.setDate(yesterday.getDate() - 1);

    today_date_string = initialize_date.toLocaleDateString('en-us', options);
    
    yesterday_date_string = yesterday.toLocaleDateString('en-us', options);



    const day_array = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

   
        
    let puzzles_by_day = {
        "Sunday" : {
            size: 6,
            research : true,
            statements: false,
            motive: false,
            hard: true,
            opening: "Weekly Wrap-Up",
            rules: ["killer", "simple", "simple", "simple", "simple", "simple", "characteristic", "characteristic", "characteristic", "not", "not", "simple", "simple"] //  
                    
                    //"not", "either", "not", "characteristic", "characteristic", "characteristic", "simple", "simple", "characteristic", "characteristic", "killer", "not"] // "simple", "simple",  "characteristic", "characteristic", "characteristic", "simple", "simple", "simple", "simple", "characteristic", "characteristic", "characteristic", ] // "simple", "simple", "not", "not", "simple", "characteristic", "killer", "simple", "characteristic", "simple", "characteristic"] // rules: ["oneofeach", "simple", "characteristic", "characteristic", "killer"]
        },
        "Monday" : {
            size: 4,
            research : true,
            statements: false,
            motive: false,
            hard: false,
            opening: "THE WEEK'S EASIEST",
            rules: ["killer", "not", "not", "simple", "simple", "characteristic", "characteristic"]
        },
        "Tuesday" : {
            size: 3,
            research : true,
            statements: false,
            motive: true,
            hard: false,
            opening: "MOTIVES, TOO",
            rules: ["killer", "characteristic", "simple", "not", "either", "characteristic", "characteristic"]
        },
        "Wednesday" : {
            size: 3,
            research : true,
            hard: false,
            statements: true,
            motive: false,
            opening: "INTERVIEW DAY", //"Wednesdays are word-problem Wednesdays. On these days, the murder mystery will involve the words and letters of the characters involved.",
            rules: ["not", "characteristic"]
        },
        "Thursday" : {
            size: 4,
            research : true,
            statements: false,
            motive: false,
            hard: true,
            opening: "THE LAST EASY ONE",
            rules: ["killer", "either", "simple", "not", "not", "not", "characteristic", "characteristic", "characteristic"]
        },
        "Friday" : {
            size: 5, //5
            research : true,
            statements: false,
            motive: false,
            hard: true,
            opening: "WEEKEND",
            rules: ["killer", "not", "either", "not", "characteristic", "characteristic", "characteristic", "simple", "simple", "characteristic", "characteristic", "not"] // "characteristic", "either", "characteristic", "characteristic", "simple", "simple", "killer"] // ["simple", "simple", "either", "not", "not", "indoors", "handed", "indoors", "killer"]
        },
        "Saturday" : {
            size: 4,
            research : true,
            statements: true,
            motive: true,
            hard: true,
            opening: "The Week's Hardest",
            rules: ["simple", "simple", "simple", "simple", "not", "not", "characteristic", "characteristic", "characteristic"]
        },
    };
        
     if (today_date_string == "06/08/23") {
         
         puzzles_by_day["Thursday"] = {
            size: 3,
            research : true,
            statements: false,
            motive: false,
            hard: true,
            opening: "CONSPIRACY EASY ONE",
            rules: ["killer", "simple", "not", "simple", "not"]
        };
         
     }

    console.log(puzzles_by_day);


    
    //console.log(today_date_string);
    //console.log(yesterday_date_string);

    var badge_array = JSON.parse(localStorage.getItem('badge_array')) || [];

    var mystery_bonus = 0;
    var mystery_bucks = JSON.parse(localStorage.getItem('mystery_bucks')) || 0;

    streak_data = JSON.parse(localStorage.getItem('streakData'));

    console.log(streak_data);
    
    saved_grid = localStorage.getItem("savedGrid");
    
    saved_grid_date = localStorage.getItem("savedGridDate");

    console.log("saved_grid_date followed by today_date_string");
    console.log(saved_grid_date);
    console.log(today_date_string);
    
    if ((saved_grid != undefined) && (saved_grid_date == today_date_string)) {
        grid_backup = saved_grid;
        console.log("grid backup = saved grid");
    }
    else {
        grid_backup = false;
        
        console.log("THREE FUNCTIONS!");
        console.log(saved_grid);
        console.log(saved_grid_date);
        console.log(today_date_string);
        
    }

    //console.log(streak_data);
    
    console.log("checking saved grid?");
    console.log(saved_grid);
    console.log(grid_backup);
    
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    console.log(urlParams.get("streak"));

    var tutorial_mode = false;
    var event_mode = false;
    var errata_mode = false;

    var hint_display = true;

console.log("TUTORIAL??? " + urlParams.get("mode"));

    if (urlParams.get("mode") == "tutorial") tutorial_mode = true;
    if (urlParams.get("mode") == "events") event_mode = true;
    if (urlParams.get("mode") == "errata") errata_mode = true;

console.log(tutorial_mode);

var first_day = false;

    if (!(tutorial_mode)) { // check if it's NOT the tutorial
    
    if (streak_data == undefined) { // if this is the first day (in this browser), or the streak has been cleared.

        console.log("RESETTING STREAK DATA");

        streak_data = 
            {
            last_guess: {
                "killer" : "",
                "weapon" : "",
                "location" : "",
                "motive" : "",
                time: 0
            },
            "last_date_played" : today_date_string,
            "last_date_solved" : "",
            "streak" : [],
            update: "alchemydd"
        };
        
        if (urlParams.get("streak") != undefined) { // this is if we're uploading a streak to fix someone's broken streak
            
            var import_streak_string =  urlParams.get("streak");
            
            var streak_array = import_streak_string.split(",");
            
            streak_data.last_guess = {
                "killer" : "",
                "weapon" : "",
                "location" : "",
                "motive" : "",
                time: 0
            },
            
            streak_data.streak = streak_array;
            
            streak_data.last_date_solved = yesterday_date_string;
            localStorage.setItem("streakData", JSON.stringify(streak_data));
            
            window.location.href = "https://murdle.com";
            
            
            
        }
        
        first_day = true; // this notes that it's the first day
        
        //grid_backup = false;
        //console.log("clearing the grid_backup");

        loadPage("daily");

    } else if ((streak_data.last_date_played == today_date_string) && (streak_data.last_guess.killer != "") && (streak_data.update == "alchemydd")) { // if today is not the first but has been guessed
//console.log(streak_data);
        
        if (urlParams.get("streak") != undefined) { // repeated code that stores the streak for resetting purposes
            
            var import_streak_string =  urlParams.get("streak");
            
            var streak_array = import_streak_string.split(",");
            
            streak_data.last_guess = {
                "killer" : "",
                "weapon" : "",
                "location" : "",
                "motive" : "",
                time: 0
            },
            
            streak_data.streak = streak_array;
            
            streak_data.last_date_solved = yesterday_date_string;
            localStorage.setItem("streakData", JSON.stringify(streak_data));
            
            
            window.location.href = "https://murdle.com";
            console.log("Reset for URL");
            
        } else loadPage("reload");

    } else { // if this is not the first day played, but it has not been guessed yet
        
                    if (urlParams.get("streak") != undefined) { // repeated code that stores the streak for resetting purposes

                        var import_streak_string =  urlParams.get("streak");

                        var streak_array = import_streak_string.split(",");

                        streak_data.last_guess = {
                            "killer" : "",
                            "weapon" : "",
                            "location" : "",
                            "motive" : "",
                            time: 0
                        },

                        streak_data.streak = streak_array;

                        streak_data.last_date_solved = yesterday_date_string;
                        localStorage.setItem("streakData", JSON.stringify(streak_data));

                        window.location.href = "https://murdle.com";

                        console.log("Reset for URL");

                    }

        streak_data.last_guess = {
                "killer" : "",
                "weapon" : "",
                "location" : "",
                "motive" : "",
                time: 0
        }
        
        console.log("date check");
        console.log(streak_data.last_date_played);
        console.log(today_date_string);
        
        if ((today_date_string != saved_grid_date) || (streak_data.update != "alchemydd")) {
            
            console.log('clearing grid');
            grid_backup = false;
            localStorage.setItem("savedGrid", grid_backup);
            localStorage.setItem("savedGridDate", today_date_string);
            
        }
        
        streak_data.update = "alchemydd"; // WHERE YOU TRIGGER THE UPDATE
        
        if (tutorial_mode) {
            grid_backup = false;
            console.log("clearing the grid_backup");
        }
        
        if (streak_data.last_date_played != today_date_string) { // if the last day played is not today
            
            grid_backup = false;
            localStorage.setItem("savedGrid", grid_backup);
            localStorage.setItem("savedGridDate", today_date_string);
            
            
            console.log("last day played not today");
            
            saved_grid_date = today_date_string;
            streak_data.last_date_played = today_date_string;
            
            
            
            
        }
        
        
        
        localStorage.setItem("streakData", JSON.stringify(streak_data));
        loadPage("daily");
        
    }
        
} else { // if it is tutorial mode, but why?
    
        streak_data = 
            {
            last_guess: {
                "killer" : "",
                "weapon" : "",
                "location" : "",
                "motive" : "",
                time: 0
            },
            "last_date_played" : today_date_string,
            "last_date_solved" : "",
            "streak" : [],
        };
            
        streak_data.streak = [];
        
        grid_backup = false;
        console.log("clearing the grid_backup");

        loadPage("daily");
    
}
    
 // ending tutorial_mode opt-out
    
    console.log(streak_data.streak);
    
    document.getElementById("mainpage-notebook").innerHTML = generateGrid(true);

    whichBook();

    dailyDispatch();

    window.scrollTo(0, 0);

    function addStylesheetRules(rules) {
      const styleEl = document.createElement("style");

      // Append <style> element to <head>
      document.head.appendChild(styleEl);

      // Grab style element's sheet
      const styleSheet = styleEl.sheet;

      for (let i = 0; i < rules.length; i++) {
        let j = 1,
          rule = rules[i],
          selector = rule[0],
          propStr = "";
        // If the second argument of a rule is an array of arrays, correct our variables.
        if (Array.isArray(rule[1][0])) {
          rule = rule[1];
          j = 0;
        }

        for (let pl = rule.length; j < pl; j++) {
          const prop = rule[j];
          propStr += `${prop[0]}: ${prop[1]}${prop[2] ? " !important" : ""};\n`;
        }

        // Insert CSS Rule
        styleSheet.insertRule(
          `${selector}{${propStr}}`,
          styleSheet.cssRules.length
        );
      }
    }


    const addCSS = css => document.head.appendChild(document.createElement("style")).innerHTML=css;


    //if (size == 4) addCSS("@media screen and (max-width: 700px) { #filebox { max-width: 500px; } }");


    if ((size == 3) && (motive_mode)) addStylesheetRules([["div.blueTable", ["max-width", "430px"]], ["#floating-book", ["top", "22px"]]]);
    else if ((size == 3) && (!(motive_mode))) {
        if (tutorial_mode) addStylesheetRules([["#floating-book", ["top", "22px"]],["#floating-book img", ["right", "1em"]]]);
        else addStylesheetRules([["#floating-book", ["top", "22px"]],["#floating-book img", ["right", "2.75em"]]]);
    }

    if ((size == 4) && (!(motive_mode))) addStylesheetRules([["div.blueTable", ["width", "400px"]], ["#floating-book img", ["right", "2em"]], ["#floating-book img", ["height", "6em"]], [".notebook-label", ["transform", "translate(-45%, 0%)"]], [".notebook-label-vertical", ["transform", "rotate(270deg) translate(0%, -110%)"]]]);
    
    if ((size == 4) && (motive_mode)) addStylesheetRules([["div.blueTable", ["max-width", "430px"]], ["div.blueTable", ["font-size", "80%"]], [".notebook-label", ["transform", "translate(-45%, 0%)"]], [".notebook-label-vertical", ["transform", "rotate(270deg) translate(0%, -110%)"]]]);

    if ((size % 2) == 0) addStylesheetRules([["#filebox-accusation", ["max-width: 500px;"]], ["#floating-book", ["font-size: 130%;"]], ["#floating-book", ["font-size: -1em;"]], ["#floating-book", ["top: 1em;"]]]);

    //if ((size % 2) == 0) addCSS("@media screen and (min-width: 1000px) { #filebox {margin-left: auto;}}");

    //if ((size % 2) == 0) addCSS("@media screen and (max-width: 1000px) { #filebox, #filebox-accusation, #fingerprint-tray {}}");
    

    if (size == 5) addStylesheetRules([["div.blueTable", ["max-width", "420px"]],["#mainpage-notebook", ["top", "28%"]],["div.blueTable", ["height", "380px"]]]);

    if (size == 6) addCSS("div.blueTable { font-size: 80%; max-width: 450px; } #floating-book img { height: 10em;} .file {width: 130px; height: 218px}");

    if (size == 3) addCSS("@media screen and (max-width: 700px) { .divTable { font-size: 100% !important; } }");

    if ((size >= 5) || ((size >= 4) && (motive_mode))) {
        
         addCSS("#mainpage-notebook {top: auto; bottom: 15% }");
        addCSS("@media screen and (max-height: 600px) { #mainpage-notebook { font-size: 85%; top: auto; bottom: 5% }}");
        
    } 

    addCSS("@media screen and (max-width: 400px) { .divTable { width: 300px !important }}");

    console.log("TUTORIAL MODE: " + tutorial_mode);

    if (tutorial_mode) {
        
        document.getElementById("book-announcement").style.display = "none";
        lightSwitch();
        document.getElementById("how-to-play-word").innerHTML = "MAIN";
         document.getElementById("tutorial-link").href = "?mode=main";
       
                    
        document.getElementById("delete-icon").style.display = "none";
        document.getElementById("restore-icon").style.display = "none";
        document.getElementById("save-icon").style.display = "none";
        document.getElementById("switch-icon").style.display = "none";

        
    } else {
        
        var bookAnnouncement = document.getElementById("book-announcement");
        var miniMurdle = document.getElementById("mini-murdle");

        if (bookAnnouncement) {
            bookAnnouncement.style.display = "block";
        }

        if (miniMurdle) {
            miniMurdle.style.display = "inline-block";
        }
        
    }

    document.getElementById("notebook-icon").classList.remove("notebook-icon-invisible");

    if (event_mode) newPage("live");
    else if (errata_mode) newPage("errata");
    else console.log(event_mode);

    console.log("USING THE CONSOLE TO EXPLORE, INVESTIGATE, OR HAVE FUN WITH MURDLE IS GREAT");
    console.log("USING IT TO SOLVE THE MURDLE IS CHEATING");
    console.log("IT WOULD BE MUCH BETTER TO SOLVE IT YOURSELF");
    console.log("BUT THERE ARE NO MURDLE POLICE, ARE THERE?");
    console.log("SO YOU MAY DO AS YOU PLEASE");

    
    
// });. removed for testing
    
$('#club').load('../club/club.html');

    whichBook();


