
            
function minutesUntilMidnight() {
  var now = new Date();
  var then = new Date(now);
  then.setHours(24, 0, 0, 0);
  return (then - now) / 6e4;
}

function isVerbPast(pronoun) {
    
    if ((pronoun == "he") || (pronoun == "she")) return "was";
    else return "were";
    
}

function switchHints() {
    
    console.log("hello");
    
    hint_display = !(hint_display);
    
    
        if (hint_display) {
            
            var question_display = "inline";
            
        } else {
            
            var question_display = "none";
            
        }
        
        var question_elements = document.getElementsByClassName("instructions");
    
    console.log(question_elements);
    
        for (var a = 0; a < question_elements.length; a++) {
            console.log("going");
            
            question_elements[a].style.display = question_display;
            
        }
        
        
}

var detective_day_procgen = {
    
    title: "The Dastardly Detective Day Disaster",
    intro: "It was supposed to be the perfect day, but the ceremony was ruined when there was a scream! Then, there were several screams! Deductive Logico knew he was going to have to solve this case, before he could get back to the biggest day of his life.",
    outro: "Happy Detective Day! By solving this mystery, you have participated in the first annual celebration of this holiday.",
    suspect_line: "Fine! I was jealous! So I tried to ruin the day! Argh!"
    
};

var missing_murdle_week_procgen = { 
    
    monday: {
        title: "The Mystery of the Missing Murdles: Part One",
        intro: "Deductive Logico was excited to visit the warehouse where all the copies of <a href='https://murdle.com/book' target='_blank'>Murdle: Volume 1</a> were being stored in advance of their release. But when he got there-- all he could find was an empty pallet! (Also, the security guard was dead.)",
        outro: "Tune in tomorrow for the next episode of Missing Murdle Week. Find the Missing Murdles in time for the release of the book next Tuesday!",
        suspect_line: "Sure! I killed the security guard. But I didn't have anything to do with stealing those books! I just wanted to read it! Now, I've committed murder for nothing! In many ways, you see, it is I who am the victim!"
        
    },
    tuesday: {
        title: "The Agency Called: You're Dead!",
        intro: "Deductive Logico went to his literary agency to see if they had any idea where the Murdles had gone. But when he arrived, he found, to his horror: the absolute best intern had been killed.",
        outro: "Return tomorrow to find what happens when bookstores discover they're out of <a href='https://murdle.com/book' target='_blank'>Murdle: Volume 1</a>!",
        suspect_line: "Okay, okay, I murdered the intern! But we don't have any idea what you're talking about! Go to a bookstore and see: I bet they're there!"
    },
    wednesday: {
        title: "The Murdle Book Shortage Massacre",
        intro: "When Logico arrived at the bookstore, he was shocked to find the proprietor had been murdered. Apparently, someone had arrived, expecting to buy a Murdle book, and when they weren't there...",
        outro: "Tomorrow, play a very special Murdle that requires you to work together with your fellow detectives...",
        suspect_line: "Fine! They didn't have a copy of Murdle, so things went south! But I don't see why that makes me responsible. If you ask me: this goes all the way to the very top!"
    },
    thursday: {
        title: "The Conspiracy of Murder! (A Very Special Murdle)",
        intro: "A lone informant tried to tell Logico who stole the Missing Murdles, but before he could meet with Logico, he was murdered!<br><br><strong>Logico tried to solve his murder, but it was beyond his powers as an individual.</strong> He only had a piece of the puzzle. Still, there must be other detectives out there, right? Maybe each of them got only a single clue, too. And maybe together, they could solve the case?<br><br>But be careful with who you trust! One wrong clue will be enough to send you astray!",
        outro: "Will Deductive Logico save the day, and recover the Murdle books before it's too late?",
        suspect_line: "Fine! You caught me! I was behind it all! I stole the missing murdles! But I've already gotten away with it, haven't I? I've delayed the launch. There's no way you'll get the Murdles back in time for next Tuesday! Bwahahaha!"
    },
    friday: {
        title: "The Mystery of the Missing Murdles: A Dramatic Resolution!",
        intro: "[HIDDEN FOR NOW!]",
        outro: "[HIDDEN FOR NOW!]",
        suspect_line: "[HIDDEN FOR NOW!]"
    }

    
};

var murdle_museum_procgen = {
    
    tuesday: {
        
        title: "The Mystery at the Murdle Museum",
        intro: "Deductive Logico explored <a href='https://forms.gle/7XoZgv6w9wkVbNSV7' target='_blank'>the Museum of Murdle Weaponry</a>. He wished he could say he was surprised when the head docent was murdered. But nothing could have surprised him less.",
        outro: "Tune in tomorrow for more detective-submitted weapons, and remember to <a href='https://forms.gle/7XoZgv6w9wkVbNSV7' target='_blank'>vote for your favorite</a>!",
        suspect_line: "There were just too many good weapons! It was too tempting!"
        
    },
    
    wednesday: {
        
        title: "More Murder at the Museum",
        intro: "Deductive Logico discussed leaving the museum with Inspector Irratino, but the two of them decided to stay for just a little bit longer. It was good that they did, because somebody else was murdered almost imediately.",
        outro: "Tune in tomorrow for more detective-submitted weapons, and remember to <a href='https://forms.gle/7XoZgv6w9wkVbNSV7' target='_blank'>vote for your favorite</a>!",
        suspect_line: "Fine! I did it. But in my defense, if I hadn't, somebody else would have!"
        
    },
    
    thursday: {
        
        title: "The Dramatic Conclusion of the Murdle Museum Murders!",
        intro: "Another poor person was murdered, but this time, the poor person was the rich owner of the museum. Deductive Logico decided, honestly, that if there hadn't been so many murders at the museum, then it wouldn't have been as authentic. He set to solving it.",
        outro: "You have until the end of tomorrow to <a href='https://forms.gle/7XoZgv6w9wkVbNSV7' target='_blank'>vote for your favorite new weapon</a>!",
        suspect_line: "If you build a museum to murder, and stock it with weapons, you have to expect this kind of thing to happen. I'm just the murderous messenger."
        
    },
    
}

var proceduralcontent = {
    
        titleGenerator: function() {
            console.log(good_details);
            var chosen_detail = randomElement(good_details);
            var title = randomElement([`The ${removeThe(removeA(chosen_detail)).replace(/ /g, "-")} Murder`, "Deductive Logico Cracks the Case of " + aToThe(chosen_detail), "Deductive Logico Solves the Mystery of " + aToThe(chosen_detail), "Deductive Logico and the Case of " + aToThe(chosen_detail), ["Murder at ", "The Mysterious Murder at "].random() + aToThe(major_setting.name), ["The Confusing Case of ","The Complicated Case of ", "The Curious Case of ", "The Calculated Case of ", "The Challenging Case of ", "The Complex Case of ", "The Cryptic Case of "].random() + aToThe(chosen_detail), "The Case of " + aToThe(chosen_detail), "The Mystery of " + aToThe(chosen_detail), [["Someone Saw ", "The One With "].random() + theToA(chosen_detail) + "!", ["Don’t Forget ", "Remember ", "Consider "].random() + aToThe(chosen_detail) + "!", "But What About " + aToThe(chosen_detail) + "?", "The One with " + aToThe(chosen_detail)].random()]);  // "But What About The " + dropAorThe(chosen_detail) + "?",
            
            
        //    if (today_date_string == "06/05/22") title = "The Murder at the Murdle Book Cover Reveal";
            
            if (tutorial_mode == false) {
                
                console.log(tutorial_mode);
                console.log("TUTORIAL MODE");
            
            if (today_date_string == "06/05/23") title = missing_murdle_week_procgen.monday.title;
            if (today_date_string == "06/06/23") title = missing_murdle_week_procgen.tuesday.title;
            if (today_date_string == "06/07/23") title = missing_murdle_week_procgen.wednesday.title;
            if (today_date_string == "06/08/23") title = missing_murdle_week_procgen.thursday.title;
            if (today_date_string == "11/13/25") title = detective_day_procgen.title;
                
    
            //if (today_date_string == "06/09/23") title = missing_murdle_week_procgen.friday.title;
                
            }
            
            return title.toUpperCase();
            
        },
    
        finalFullAnswer: function() {
            
            var solution_object_box = "<div style='color: black; font-size: 120%; font-weight: bold; margin-bottom: 0.5em; text-decoration: underline; text-align: left;'>FULL SOLUTION</div><div id='full-solution-box'>"; //'<div class="divTable blueTable"><div class="divTableBody">';
            
            console.log("solution_object.suspects.length: " + solution_object.suspects.length);
            
            function redEmojiMain(a) {

                if (solution_object.suspects[a].name == solution_object.killer) return `style='text-shadow: 0 0 0 #A30B37'`;
                else return "";

            }
            
            /*
    
            for (var a = 0; a < solution_object.suspects.length; a++) {

                function openBold() {

                    if (solution_object.suspects[a].name == solution_object.killer) return "<strong>";
                    else return "";

                }

                function closeBold() {

                    if (solution_object.suspects[a].name == solution_object.killer) return "</strong>";
                    else return "";

                }
                
                function redEmoji() {

                    if (solution_object.suspects[a].name == solution_object.killer) return `style='text-shadow: 0 0 0 #A30B37'`;
                    else return "";

                }
                

                solution_object_box += openBold();
                
                console.log(solution_object.suspects[a]);

                if (motive_mode) solution_object_box += `<span class='emoji' style='text-shadow: 0 0 0 ${lookUpSuspect(solution_object.suspects[a].name, "color")}'>` + suspect_details[solution_object.suspects[a].name].emoji + `</span> <span class='emoji' ${redEmoji()}>` + lookUpWeapon(solution_object.suspects[a].weapon, "emoji") + `</span> <span class='emoji' ${redEmoji()}>` + lookUpLocation(solution_object.suspects[a].room, "emoji") + `</span> <span class='emoji' ${redEmoji()}>` + `</span> <span class='emoji' ${redEmoji()}>`+ lookUpMotive(solution_object.suspects[a].motive, "emoji") + "</span><br>";
                
                else solution_object_box += `<span class='emoji' style='text-shadow: 0 0 0 ${lookUpSuspect(solution_object.suspects[a].name, "color")}'>` + suspect_details[solution_object.suspects[a].name].emoji + `</span> <span class='emoji' ${redEmoji()}>` + lookUpWeapon(solution_object.suspects[a].weapon, "emoji") + `</span> <span class='emoji' ${redEmoji()}>` + lookUpLocation(solution_object.suspects[a].room, "emoji") + "</span><br>";

                solution_object_box += closeBold();

                /* if (motive_mode) solution_object_box += '<div class="divTableRow noborder"><div class="divTableCell bordered">' + openBold() + solution_object.suspects[a].name + '</div><div class="divTableCell bordered">' + solution_object.suspects[a].weapon + '</div><div class="divTableCell bordered">' + solution_object.suspects[a].room + '</div><div class="divTableCell bordered">' + solution_object.suspects[a].motive + closeBold() + '</div></div>';
                else solution_object_box += '<div class="divTableRow noborder"><div class="divTableCell bordered">' + openBold() + solution_object.suspects[a].name + '</div><div class="divTableCell bordered">' + solution_object.suspects[a].weapon + '</div><div class="divTableCell bordered">' + solution_object.suspects[a].room + closeBold() + '</div></div>'; 

            }
            
                solution_object_box += "</div><div class='full-solution-box'>"; */
            
             
                if (motive_mode) var power_of_puzzle = 4;
                else var power_of_puzzle = 3;
                
                for (var b = 0; b < size; b++) {
                    
                    solution_object_box += `<span class='emoji' style='text-shadow: 0 0 0 ${lookUpSuspect(solution_object.suspects[b].name, "color")}'>` + suspect_details[solution_object.suspects[b].name].emoji + `</span>`;
                    
                    
                }
            
                solution_object_box += "<br>";
                
                for (var b = 0; b < size; b++) {
                    
                    solution_object_box += `<span class='emoji' ${redEmojiMain(b)}>` + lookUpWeapon(solution_object.suspects[b].weapon, "emoji") + `</span>`;
                    
                }
            
                
                solution_object_box += "<br>";
            
                
                for (var b = 0; b < size; b++) {
                    
                    solution_object_box += `<span class='emoji' ${redEmojiMain(b)}>` + lookUpLocation(solution_object.suspects[b].room, "emoji") + `</span>`;
                    
                }
            
                solution_object_box += "<br>";
            
                if (motive_mode) {
                
                    for (var b = 0; b < size; b++) {

                        solution_object_box += `<span class='emoji' ${redEmojiMain(b)}>` + lookUpMotive(solution_object.suspects[b].motive, "emoji") + `</span>`;

                    }
                    
                }
                
                solution_object_box += "</div><p>Any further questions? Ask on the <a href='https://reddit.com/r/murdle' target='_blank'>subreddit</a>, <a href='https://discord.gg/kmyFvXJ44s' target='_blank'>Discord</a>, or <a href='https://www.facebook.com/groups/1501188563657432' target='_blank'>Facebook group</a>.</p>";
            
                console.log(solution_object_box);
                
                return solution_object_box;
            
        },
    
        howYouDid: function(guilty) {
          
            var hoursuntilmidnight = Math.floor(minutesUntilMidnight() / 60);
            var minutesremaining = Math.floor(minutesUntilMidnight() - (hoursuntilmidnight * 60));
            
            var minutesittook = Math.floor(social_share.time / 60);
            var secondsremainingthatittook = Math.floor(social_share.time - (minutesittook * 60));
            
            var streakLanguage = function() {
                
                if (streak_data.streak.length == 1) return ".</strong> How many days can you keep your streak going?"; 
                else return ",</strong> and you have solved the last " + streak_data.streak.length + " murdles in a row. How many days can you keep your streak going?";
                
            }
            
            var hoursRemainingLanguage = function() {
                
                if (hoursuntilmidnight == 0) return "";
                else return hoursuntilmidnight + " hours and "
                
            }
            
            var minutesRemainingLanguage = function() {
                
                if (minutesreamining == 1) return minutesremaining + " minutes.";
                else if (minutesremaining == 0) return "less than one minute! GET READY!";
                else return "one minute. Get ready!";
                
            } 
            
            if (tutorial_mode) {
                
                
                if (guilty) return "<strong>You solved today's mini-murdle in " + minutesittook + " minutes and " + secondsremainingthatittook + " seconds. Tomorrow's will be available in " + hoursRemainingLanguage() + minutesremaining + " minutes.";
                else return "<strong>You did not solve today's mini-murdle,</strong> but don't worry, there's a new one every day. Tomorrow's will be available in " + hoursRemainingLanguage() + minutesremaining + " minutes.";
                
            } else {
                
                if (guilty) return "<strong>You solved today's murdle in " + minutesittook + " minutes and " + secondsremainingthatittook + " seconds" + streakLanguage() + " Tomorrow's will be available in " + hoursRemainingLanguage() + minutesremaining + " minutes.</p>";//<p>You were paid 𝓜" + mystery_bonus + "for cracking today's case, bringing your total sum to 𝓜" + mystery_bucks + "</p>";
                else return "<strong>You did not solve today's murdle,</strong> but don't worry, there's a new murdle every day. Tomorrow's will be available in " + hoursRemainingLanguage() + minutesremaining + " minutes.</p>";
                
            }
            
            
            
        },
        
        little_phrases: {
        
            evidenceOpener: function() {
                
                return ["There were ", "In this particular case, there were ", "This time, there were ", "Today, there were "].random();
        
                //if (casenum == 2) return "Once again, there were ";
                //else if (casenum == 3) return "This time, there were ";
                //else if (casenum == 4) return "This time, there were ";
                //else return "There were ";
            },
            
            final_words: function() {
                
                
                
            },
            
            ruleExplainer: function() {
                
                    if (motive_mode) {
                        var contents =  "<a href='javascript:void(0)'  class='item-link'  onclick='activeOne(\"suspect\", names)' id='suspect-link'>SUSPECTS</a> •  <a  class='item-link' href='javascript:void(0)' onclick='activeOne(\"weapon\", weapons)' id='weapon-link'>WEAPONS</a> • <a  class='item-link' href='javascript:void(0)' onclick='activeOne(\"location\", rooms)' id='location-link'>LOCATIONS</a> • <a  class='item-link' href='javascript:void(0)' onclick='activeOne(\"motive\", motives)' id='motive-link'>MOTIVES</a>";
                    } else {
                        var contents =  "<a href='javascript:void(0)'  class='item-link'  onclick='activeOne(\"suspect\", names)' id='suspect-link'>SUSPECTS</a> •  <a  class='item-link' href='javascript:void(0)' onclick='activeOne(\"weapon\", weapons)' id='weapon-link'>WEAPONS</a> • <a  class='item-link' href='javascript:void(0)' onclick='activeOne(\"location\", rooms)' id='location-link'>LOCATIONS</a>";
                    }
                
                var line = "<p class='card-subtitle'>" + contents + "</p>";
                
                if ((first_day) || (tutorial_mode)) {
                
                    var card_explainer = "<p id='card-explainer' style='margin-top: -1em; text-align: center; color: #9e9e9e;'>INVESTIGATE CARDS TO LEARN MORE</p>";
                    

                    line += card_explainer;
                    
                } else {
                    
                    var card_explainer = "<p id='card-explainer' style=''></p>";
                    

                    line += card_explainer;
                    
                }
                
                if (tutorial_mode) return line + "<span class='explainer'>Each suspect brought one weapon to one location, but on that day, only one was a murderer.</span>";
                else if (motive_mode) return line+"<span class='explainer'>Each suspect brought one weapon to one location, and they each had a motive to kill, but only one was a murderer (today).</span>";
                else return line+"<span class='explainer'>Each suspect brought one weapon to one location, but only one was a murderer (today).</span>";
                
            },
        
            "weapon_word" : function() {

                var weapon_word = ["A fascinating weapon.", "An interesting weapon.", "A possible weapon.", "One of the weapons.", "One of the weapons a suspect brought.", "Deductive Logico examines the weapon.", "Why do people always bring weapons?"];
                
                return randomElement(weapon_word);

            },
            
            "logico_limes" : function() {
                
                var weapon_word = ["while stroking his magnificent eyebrows", "with one of his magnificent eyebrows raised", "while holding his notebook"];
                
                return randomElement(weapon_word);
                
            }, 
            
            motive_addition: function() {
                
                if (motive_mode) return ". Why? <strong>" + capitalizeFirstLetter(accusation_object.motive) + "</strong>";
                else return "";
                
            }
            
        },
        
        "getAccusation" : function() {
            
            if (!(daily)) {
                
                var accuse_array = ["", "That first case took him awhile to figure out. But he scribbled notes into his notebook until it all made sense. And when he was absolutely sure who did it, how they did it, and where they did it, he made his final accusation:", "Deductive Logico had to go back-and-forth between his clues and his evidence in order to solve this case, but still, the basic principles of the case were based on cold, hard logic, and he was able to discover the who, how, and where:", "Logico did not understand how this would help until he suddenly realized something: the innocent suspects would <strong><em>always</em></strong> tell the truth, while the guilty one would <strong><em>always</em></strong> lie. Once he realized that, well, he solved the case in no time at all.", "The cases were more complicated, but the basics were the same. It all boiled down to the who, how, and where:", "It wasn't the who, how, and where anymore, it was the who, how, where, and why, and Logico didn't like it. But after some time, he did figure it out, just like before:"];
                
                return accuse_array[casenum];
                
            } else if (tutorial_mode) {
                
                var pre_accuse = "<p><span class='instructions'>Once Logico had put all his clues into the grid, he began to apply his reason to draw further conclusions. For example, if one suspect has a weapon, and that weapon is in a location, then that suspect is in that location, too."
                
                var accuse_array = ["Once Logico checked his reasoning, and was confidant that there could be only one solution, he went to the Board of Directors and announced whodunnit."];
                
                return accuse_array.random() + "<p class='instructions'>Do not make your accusation until you are confident you know the answer. You only get one try!</p>";
                
            } else {
            
            var accuse_array = ["Deductive Logico finally grasped the solution, and he called out his accusation!", "Deductive Logico knew the answer so quickly, he would make Irratino proud:", "Drawing these grids in his notebook was Logico's favorite part of the job, and soon, he had the solution.", "Deductive Logico drew out another grid to help him crack the case, and pretty soon, he had it all figured out...", "Once again, Deductive Logico was able to apply his analytical faculities to the solving of another mystery:", "Deductive Logico thought long and hard before he realized he had cracked the case, and he was ready to announce who committed the crime and how:", "Deductive Logico had a harder time deciding what to have for dinner than he did solving this mystery:", "Then, Deductive Logico gathered all of the suspects into one room and made them listen to him explain his elaborate reasoning, before he finally got to the part where he announced whodunnit:"];
                
            if (today_date_string == "06/08/23") accuse_array = ["Today, Logico would have to go out and talk to other detectives before he was capable of solving this case. Whether he used social media, or called his friends, he knew they must have the other clues! Reach out to your friends who murdle, or try posting with #MissingMurdles on <a href='https://twitter.com/intent/tweet?text=%23MissingMurdles+https%3A%2F%2Fmurdle.com' target='_blank'>Twitter</a>, <a href='https://reddit.com/r/murdle/' target='_blank'>reddit</a>, <a href='https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fmurdle.com' target='_blank'>Facebook</a>, or on <a href='https://discord.gg/2ba2M3pT' target='_blank'>our private Discord</a>!"];

            return accuse_array[Math.floor(Math.random()*accuse_array.length)];
                
                
            }
            
        },
        "openingLine" : function() {
            
            
            
            var line = ["<strong>Deductive Logico just wanted to relax</strong> "  + major_setting.preposition + " "+ major_setting.name + ", but, of course, " + victim + " had to go and get murdeered", "<strong>Was it too much to ask</strong> for one vacation to pass without a murder? This time " + victim + " was killed "  + major_setting.preposition + " "+ major_setting.name, "<strong>Once again, Deductive Logico arrived late</strong> to the scene of the crime: " + major_setting.name + " where " + victim + " had been killed", "<strong>Deductive Logico's magnificent eyebrows</strong> were raised at the sight of the latest crime: " + victim + " had been killed " + major_setting.preposition + " " + major_setting.name + ".", "<strong>Deductive Logico could smell crime,</strong> and this " + dropAorThe(major_setting.name) + " smelled foul: " + victim + " had been killed", "<strong>Deductive Logico had hoped</strong> to enjoy a nice evening at " + aToThe(major_setting.name) + ", but unfortunately, " + victim + " had to go and get murdered", "<strong>A police detective called the famous</strong> Deductive Logico and asked him to solve a case he couldn't crack: " + major_setting.preposition + " " + major_setting.name + ", " + victim + " had been murdered!", "<strong>Deductive Logico was enjoying</strong> his vacation " + major_setting.preposition + " " + aToThe(major_setting.name) + " when — well, what do you think happened? — " + victim + " was killed.", "<strong>Deductive Logico knew</strong> there had been a murder " + major_setting.preposition + " " + aToThe(major_setting.name) + " when he saw the body of " + aToThe(victim)].random();
                
            if (major_setting.type == "occult") {
                
                var stock_line = victim + " had been killed " + major_setting.preposition + " " + major_setting.name + "."
                
                var line = [`<strong>This was the kind of mystery Inspector Irratino would like,</strong> thought Deductive Logico. It was nice and spooky: ${stock_line}`, `<strong>The horror! The horror!</strong> Logico was embroiled in another spooky mystery: ${stock_line}`, `<strong>The occult had never been Deductive Logico's area of expertise,</strong> but when ${victim + ' is killed ' + major_setting.preposition + " " + major_setting.name}, you have to do your best.`].random();
                
            }
            else if (today_day_word == "Monday") {
                var first_part = "";
                first_part = ["<strong>Inspector Irratino had told Logico</strong> that Mondays were an acquired taste, but Logico thought he was joking. Take this one, for example:", "Logico liked to start his week off with a nice, easy murder, and this week was no exception.", "<strong>Deductive Logico never had a good Monday</strong>, and today was a perfect example of why not:"].random() + " ";
                
                main_part = [capitalizeFirstLetter(victim) + " had been killed " + major_setting.preposition + " " + major_setting.name + "."].random();
                
                line = first_part + " " + main_part;
            }
            
            if (today_day_word == "Sunday") line = ["<strong>Deductive Logico was awoken by a mysterious phone call.</strong> Inspector Irratino spoke in a whisper, \"Deductive Logico, there's been a murder at <strong>a luxury high-end international rich people prison</strong>, and only you can solve it, because you put them away this week!\"<br><br>When Deductive Logico arrived at the luxury high-end international rich people prison, he discovered, with horror, that the victim of the murder was none other than Inspector Irratino himself. Deductive Logico regretted all of the bad things he ever said about him, and he promised himself that he would solve this case and avenge his rival, antagonist, and friend.", "<strong>Deductive Logico received a letter in the mail</strong> When Logico opened it, he recognized the handwriting of the esoteric Inspector Irratino: \"Deductive Logico, there will be a murder at <strong>a luxury high-end international rich people prison</strong>, and only you can solve it, because the suspects are the murderers you have caught all week!\"<br><br>When Deductive Logico arrived at the luxury high-end international rich people prison, he discovered, to his amazement, that the victim of the murder was none other than Inspector Irratino himself. Surely, this time he wasn't faking it. That would just be too much. Deductive Logico was determined to solve this case and avenge his old rival, antagonist, and friend.", "Logico went to make his weekly visit to a high-end prison, and when he got there, he discovered that Inspector Irratino had been killed! He would avenge his former rival."].random();
             
            
            if (today_date_string == "06/05/23") line = missing_murdle_week_procgen.monday.intro;
            if (today_date_string == "06/06/23") line = missing_murdle_week_procgen.tuesday.intro;
            if (today_date_string == "06/07/23") line = missing_murdle_week_procgen.wednesday.intro;
            if (today_date_string == "06/08/23") line = missing_murdle_week_procgen.thursday.intro;
            if (today_date_string == "11/13/25") line = detective_day_procgen.intro;
            //if (today_date_string == "06/09/23") line = missing_murdle_week_procgen.friday.intro;    
            
                
            if (tutorial_mode) {
                
                line = [`<strong>Back when Logico was in Deduction College,</strong> he once solved the murder of ${victim}.`, `<strong>One of Logico's first cases was back when he was in Deduction College,</strong> and he solved the murder of ${victim}.`, `<strong>"Elementary, my dear Irratino!"</strong>, Deductive Logico said, recalling one of his earliest cases. \"Or rather, should I say, collegiate?\" Way back when he was a sophomore, ${victim} had been murdered.`, "<strong>Logico never forgot his first few cases,</strong> but that was only because he never forgot any of his cases. However, this one was particularly memorable."].random();
                
                line = "<p class='instructions'>By solving this mini-murdle, you will learn the skills required to be a great detective. First, flip over the cards below, and then tap again to learn more about each one. (To disable these hints, <a href='javascript:void(0)' onclick='switchHints()'>click here</a>.</span>)</p>" + line;
                
            }
                
            if ((line.charAt(line.length - 1) != "!") && (line.charAt(line.length - 1) != ".") && (tutorial_mode != true)) line += ".";
                
            if (today_date_string == "08/29/22") line = "<strong>Deductive Logico had been excited</strong> to attend the " + major_setting.name + ", but of course, what happened? Somebody was murdered. This time, it was " + victim + " who died. Now, Logico was on the case.";
                
                console.log("FIRST TIME : " + first_day);
                
            if ((first_day) && (!(tutorial_mode))) {
                
                var preface_line = "<p><div id='mini-murdle'><img src='images/extras/graduation.svg' id='mini-sign'><strong>New to Murdle?</strong>&nbsp;<a href='https://murdle.com/?mode=tutorial'>Try the daily mini first!</a></div></p>";
                line = preface_line + line;
                
            }
            
            return opening_theme_phrase + line;
            
        },
        "evidenceLine" : function() {
            
            if (tutorial_mode) {
                
                // ["In Deduction College, you were taught to start with what you knew for sure:", "In Logico's favorite class, they told him to start with the facts, so Logico did:"].random()
                
                var line = ["<p class='instructions'>Go through the clues one at a time, placing the information provided onto the Deduction Grid. If you need help with a clue, tap the question mark beside it.</p>"];
                
                return line;
                
            } else {
                
                var line = ["Logico knew to start with the facts:", "Logico, as always, started with what he was certain about:", "Logico consulted his notebook and read everything he knew for sure:", "Logico knew that by careful study of the facts, he could uncover the truth:", "Logico massaged his magnificent eyebrows as he examined the evidence:", "Logico began with what he knew for sure:", "Unlike Inspector Irratino, who always began with what he didn't know, Deductive Logico began with what he knew for sure:", "As always, Deductive Logico began with the facts:", "While his rival, Inspector Irratino, always started with what he didn't know, Logico always began with what he knew for sure:", "Logico always began with what he knew for certain:", "Logico knew that proper deduction could only come from an analysis of evidence:"];
                
                if (today_date_string == "06/08/23") line = ["Today, Logico only had a single clue. But he knew that out there, there must be other detectives, who also had only one clue."];
                
            }

            return line.random();
            
        },
    
    "introducingStatements" : function() {
        
        var statements = ["But no matter how hard he tried to piece this evidence together, he could not figure it out. So he went and asked each of the suspects to make a statement", "Then, " + proceduralcontent.little_phrases.logico_limes() + ", he took the statements of the " + names.length + " suspects", "Once more, " + proceduralcontent.little_phrases.logico_limes() + ", Logico took the statements of the suspects, knowing the innocent would <strong><em>always</em></strong> tell the truth, while the guilty would <strong><em>always</em></strong> lie."];

        return statements[casenum] + ", knowing the innocent would <strong><em>always</em></strong> tell the truth, while the guilty would <strong><em>always</em></strong> lie. By deducing which of them must be lying, Logico would be able to identify whodunit.";    
            
    },
         
        "guiltyLine" : function() {
            
            const index = solution_object.suspects.map(e => e.name).indexOf(solution_object.killer);
            
            thekiller = {
                name: solution_object.suspects[index].name,
                weapon: solution_object.suspects[index].weapon,
                room: solution_object.suspects[index].room,
                motive: solution_object.suspects[index].motive   
            }
            
            console.log(thekiller);
            
            var accuse_line = '<p><strong>"It was ' + accusation_object.killer + ' with ' + accusation_object.weapon + " " + inOrNot(accusation_object.room) + " " + accusation_object.room + proceduralcontent.little_phrases.motive_addition() + '!</strong></p>';
            
            
            
            var line = [
                '<p>While ' + accusation_object.killer + " protested " + suspect_details[accusation_object.killer].possessive_pronoun + " innocence, " + suspect_details[accusation_object.killer].subject_pronoun + " " + 
                ['could not withstand the breathtakingly logical arguments our Deductive presented',
                 'lost confidence as Deductive Logico explained the case against ' + suspect_details[accusation_object.killer].object_pronoun].random() + 
                ", and " + suspect_details[accusation_object.killer].subject_pronoun + " " + 
                ['knew ' + suspect_details[accusation_object.killer].subject_pronoun + " " + isVerbPast(suspect_details[accusation_object.killer].subject_pronoun) + " caught", 
                 " confessed under the pressure",
                 "admitted " + suspect_details[accusation_object.killer].subject_pronoun + " " + isVerbPast(suspect_details[accusation_object.killer].subject_pronoun) + " caught"].random() + 
                ".</p><p>\"" + 
                suspect_details[accusation_object.killer].confession() + 
                "\" " + suspect_details[accusation_object.killer].subject_pronoun + 
                " " + 
                ["exclaimed", "said", "spat", "said", "muttered", "announced"].random() + 
                '.</p><p>Deductive Logico ' +
                ['watched ' + suspect_details[accusation_object.killer].object_pronoun + ' be led away'].random() +
                ', ' + 
                'knowing it was the last he would see of ' + suspect_details[accusation_object.killer].object_pronoun + '.</p>'];
            
            if (today_day_word == "Sunday") line = [
                '<p>While ' + accusation_object.killer + " protested " + suspect_details[accusation_object.killer].possessive_pronoun + " innocence, " + suspect_details[accusation_object.killer].subject_pronoun + " were nevertheless convicted again.</p><p>" + ["Deductive Logico watched as they were transferred to a more secure (and slightly nicer) wing of the prison.", "But even if he had solved the crime, he had not brought Irratino back to life."].random() + "</p><p>Logico was not sure if this work was actually making any progress in the world, and he keenly felt the loss of his now-dead rival. " + ["But then, when he emerged from the prison, he saw Inspector Irratino standing there, clapping slowly.", "But when he drove back home, Irratino was waiting for him on the steps outside, making sketches of the moon.", "But when he got back to his Deductive Office, there was Inspector Irratino, sitting in Deductive Logico's chair with his feet propped up on his desk."].random() + "</p><p>\"" + ["I thought you were dead!", "You fooled me again!", "I thought you'd been killed!", "How?!", "What?! What's going on?!"].random() + "\" Logico exclaimed.</p><p>\"" + ["I faked my death to prove the superiority of the occult over logic, and yet, here, you have defeated me. You have won this week, Logico. I admit my defeat.", "It was a hoax, Logico. I wanted to prove the validity of the esoteric, and yet, you have defeated me.", "It was a trick, Logico, and it proves the validity of the esoteric: you were able to solve the who, what, and where, yet you did not notice that I was not dead at all!"].random() + " " + ["Come now, let us go to the bar, and I shall buy you a drink.\"</p><p>And so they did. They drank and debated the merits of rationality and the occult, neither accepting the other's position, but nevertheless enjoying their company.</p>", "Come now, a new restaurant has opened, and I want to check it out!\"</p><p>And so they went to the restaurant, but the only mystery they solved there was the Case of the Mediocre Linguini</p>", "Come now, I have tickets to the theater! There is a new mystery playing.\"</p><p>And so they went to the theater, and halfway through the show, both of them leaned over to the other and whispered, at the same moment, \"I know who did it!\"</p><p>And both of them were right.</p>", "\"</p><p>Logico shook his head and said, \"I knew you'd pull something like this, but you're not getting out of our plans tonight: we're still going to that lecture on abstract mathematics. You promised after I attended that experimental one-act.\"</p><p>\"Fine,\" sighed Irratino, although later, he had to admit that the lecture had great vibes.</p>"].random()];
            
                function mmLine(day) {
                    
                    return '<p>While ' + accusation_object.killer + " protested " + suspect_details[accusation_object.killer].possessive_pronoun + " innocence, " + suspect_details[accusation_object.killer].subject_pronoun + " eventually surrendered.</p><p>\"" + missing_murdle_week_procgen[day].suspect_line + `"</p><p>${missing_murdle_week_procgen[day].outro}`;
                    
                }
            
                function detectiveDay() {
                    
                    return '<p>While ' + accusation_object.killer + " protested " + suspect_details[accusation_object.killer].possessive_pronoun + " innocence, " + suspect_details[accusation_object.killer].subject_pronoun + " eventually surrendered.</p><p>\"" + detective_day_procgen.suspect_line + `"</p><p>${detective_day_procgen.outro}`;
                    
                }
            
            if (today_date_string == "06/05/23") line = [mmLine("monday")];
            if (today_date_string == "06/06/23") line = [mmLine("tuesday")];
            if (today_date_string == "06/07/23") line = [mmLine("wednesday")];
            if (today_date_string == "06/08/23") line = [mmLine("thursday")];
            if (today_date_string == "11/13/25") line = [detectiveDay()];
            //if (today_date_string == "06/09/23") line = [mmLine("friday")];

            if (tutorial_mode) line = ['<p>While ' + accusation_object.killer + "at first protested " + suspect_details[accusation_object.killer].possessive_pronoun + " innocence, the entire faculty approved Logico's reasoning.</p><p>This was one of Logico's first cases, and it helped him develop the skills he uses to this day.</p>"];
            
            if (social_share.title.charAt(social_share.title.length-1) != "!") var final_punc = ".";
            else var final_punc = "";
            
            
            return line.random() + "<p>And that concludes <strong>" + social_share.title + '</strong>' + final_punc + "<p>" + proceduralcontent.howYouDid(true) + '</p><p><a href="javascript:void(0)" id="full-solution-link" onclick="document.getElementById(\'full-solution-link\').innerHTML = proceduralcontent.finalFullAnswer(); document.getElementById(\'full-solution-link\').style.color = \'black\'; document.getElementById(\'full-solution-link\').style.textDecoration = \'none\'; document.getElementById(\'full-solution-link\').onclick = \'\'">See the Full Solution</a><br><a target="_blank" href="https://murdle.com/marot/?suspect=' + accusation_object.killer + '&weapon=' + accusation_object.weapon + '&location=' + accusation_object.room + '">Check your Marot</a></p>';  
            
        },
        
        "notGuiltyLine" : function() {
            
            const index = solution_object.suspects.map(e => e.name).indexOf(solution_object.killer);
            
            thekiller = {
                name: solution_object.suspects[index].name,
                weapon: solution_object.suspects[index].weapon,
                room: solution_object.suspects[index].room,
                motive: solution_object.suspects[index].motive  
            }
            
            console.log(thekiller);
            
            victim = aToThe(victim);
            
            var accusation_line = '<p><strong>"It was ' + accusation_object.killer + ' with ' + accusation_object.weapon + " " + inOrNot(accusation_object.room) + " " + accusation_object.room + proceduralcontent.little_phrases.motive_addition() + '!" ' + ["Deductive Logico declared", "", "announced Deductive Logico"].random() + '.</strong></p>';
            
            if (accusation_object.killer != thekiller.name) {
                
                if (motive_mode) var motive_line = " " + thekiller.motive;
                else var motive_line = "";
 
                var line = ['<p>' + accusation_object.killer + '  protested ' + suspect_details[accusation_object.killer].possessive_pronoun + ' innocence and hired, as ' + suspect_details[accusation_object.killer].possessive_pronoun + ' expert witness, Inspector Irratino!</p><p>At the trial, the Inspector ' + ['told the jury about', 'testified about', 'discussed', "revealed"].random() + " " + proceduralcontent.irrational_art() + ' ' + ["that showed", "that demonstrated ", "that conclusively proved ", "that -- beyond all doubt -- proved "].random() + ' <strong>' + thekiller.name + '</strong> ' + ["committed the crime", "committed the murder", "killed " + aToThe(victim)].random() + ' with <strong>' + thekiller.weapon + "</strong> " + inOrNot(thekiller.room) + " <strong>" + thekiller.room + "</strong><strong>" + motive_line + '</strong>.</p><p>' + ["When the jury analyzed the case, they ", "When the judge thought it over, she "].random() + ["realized it was the only solution that made sense", "realized it was the only solution that worked", "discovered that Irratino was correct", "found that Irratino was right"].random() + ". " + ["Deductive Logico had let down, not only " + victim + ", but also the entire concept of logic itself.", "Deductive Logico was heartbroken and devastated at this failure.", "Logico promised himself that he would crack the case tomorrow.", "Deductive Logico hoped that one day soon he would actually solve a case.", "Deductive Logico could not understand how he the Great Deductive! -- could have been so wrong. Was it time to retire?", "Deductive Logico stroked his magnificent eyebrows and thought about what he could do better next time."].random()];
                
                if (today_day_word == "Sunday") line = ['<p>' + accusation_object.killer + ['  protested ', " insisted upon ", " maintained "].random() + suspect_details[accusation_object.killer].possessive_pronoun + " innocence. With the help of " + suspect_details[accusation_object.killer].possessive_pronoun + " legal team, " + suspect_details[accusation_object.killer].subject_pronoun + " proved <strong>" + thekiller.name + '</strong> ' + ["committed the crime", "committed the murder", "killed " + aToThe(victim)].random() + ' with <strong>' + thekiller.weapon + "</strong> " + inOrNot(thekiller.room) + " <strong>" + thekiller.room + "</strong><strong>" + motive_line + '</strong>.</p><p>Deductive Logico was baffled, and he stumbled out of the jail and into the night. There, in the flesh, was Inspector Irratino, who said, \"I have faked my murder to prove that your logic misleads you. I have demonstrated that the occult is the only truth path to knowledge!\"</p><p>\"Only you would say you had proved the occult true by lying!\" Logico replied.</p><p>\"Your insults would be more devastating had you not just failed to solve my murder.\"</p><p>\"You weren\'t murdered!\"</p><p>The two of them argued long into the night at the local bar, drinking and trading arguments for their respective positions.</p>'];
        
                
            } else {
                
                var fatal_flaw = "";
                
                if (accusation_object.weapon != thekiller.weapon) fatal_flaw = "Actually, <strong>" + thekiller.weapon + "</strong> had been used to commit the crime.";
                if ((accusation_object.weapon != thekiller.weapon) && (accusation_object.room != thekiller.room)) fatal_flaw = "Actually, <strong>" + thekiller.weapon + "</strong> had been used to commit the crime. And in addition, the crime had been committed, not " + accusation_object.room + ", but in <strong>" + inOrNot(thekiller.room) + thekiller.room +  "</strong>.";
                else if (accusation_object.room != thekiller.room) fatal_flaw = "The crime had been committed, not " + inOrNot(accusation_object.room) + accusation_object.room + ", but in " + inOrNot(thekiller.room) + thekiller.room + ".";
                
                if (motive_mode) {
                    if (accusation_object.motive != thekiller.motive) fatal_flaw = fatal_flaw + " The real motive for the case was a desire " + thekiller.motive + "!";
                    
                } 
                
                var line = ['<p>' + accusation_object.killer + ['  protested ', " insisted upon ", " maintained "].random() + suspect_details[accusation_object.killer].possessive_pronoun + ' innocence and hired, as ' + suspect_details[accusation_object.killer].possessive_pronoun + ' expert witness, Inspector Irratino!</p><p>At the trial, the Inspector ' + ['told the jury about', 'testified about', 'discussed'].random() + " " + proceduralcontent.irrational_art() + ', which made him realize a fatal flaw in Deductive Logico\'s reasoning: ' + fatal_flaw + '</p><p>' + ["When the jury analyzed the case, they ", "When the judge thought it over, she "].random() + ' found that Irratino was right. ' + ["Deductive Logico had let down, not only " + victim + ", but also the entire concept of logic itself.", "Deductive Logico was heartbroken and devastated at this failure.", "Deductive Logico knew that he would get them tomorrow, but the mysteries of the irrational won their victory today.", "Deductive Logico hoped that one day soon he would actually solve a case.", "Deductive Logico could not understand how he the Great Deductive! -- could have been so wrong. Was it time to retire?", "Deductive Logico stroked his magnificent eyebrows and thought about what he could do better next time."].random()];
                
                if (today_day_word == "Sunday") line = ['<p>' + accusation_object.killer + ['  protested ', " insisted upon ", " maintained "].random() + suspect_details[accusation_object.killer].possessive_pronoun + " innocence. With the help of " + suspect_details[accusation_object.killer].possessive_pronoun + " legal team, " + suspect_details[accusation_object.killer].subject_pronoun + " conclusively proved that " + suspect_details[accusation_object.killer].subject_pronoun + " could not have done it as Logico said. " + fatal_flaw + "</p><p>Thus, even though they were guilty, they got off on a technicality!</p><p>Deductive Logico was baffled, and he stumbled out of the jail and into the night. There, in the flesh, was Inspector Irratino, who said, \"See, I've faked my death to prove that logic misleads you. The occult is the only truth path to knowledge!\"</p><p>\"Only you would say you had proved the occult true by lying!\" Logico replied.</p><p>\"Your insults would be more devastating had you not just failed to solve my murder.\"</p><p>\"You weren't murdered!\"</p><p>The two of them argued long into the night at the local bar, drinking and trading arguments for their respective positions.</p>"];
                
            }
            

            //var line = ["<strong>NOT GUILTY!</strong> Logico was wrong, and when he accused an innocent person, his credibilility was shot, and his once magnificent eyebrows began to droop.", "<strong>NOT GUILTY!</strong> When the case goes to court, Deductive Logico's rival, Inspector Irratino, proved that Logico's theory was impossible in court. His reputation and his name were in tatters."];
            
            if (social_share.title.charAt(social_share.title.length-1) != "!") var final_punc = ".";
            else var final_punc = "";

            return line[Math.floor(Math.random()*line.length)] + "<p>And that concludes <strong>" + social_share.title + '</strong>' + final_punc + "<p style='color: black;'>" + proceduralcontent.howYouDid(false) + '</p><p><a href="javascript:void(0)" id="full-solution-link" onclick="document.getElementById(\'full-solution-link\').innerHTML = proceduralcontent.finalFullAnswer(); document.getElementById(\'full-solution-link\').style.color = \'black\'; document.getElementById(\'full-solution-link\').style.textDecoration = \'none\'; document.getElementById(\'full-solution-link\').onclick = \'\'">See the Full Solution</a><br><a target="_blank" href="https://murdle.com/marot/?suspect=' + accusation_object.killer + '&weapon=' + accusation_object.weapon + '&location=' + accusation_object.room + '">Check your Marot</a></p>';   
            
        },
        "irrational_art" : function() {
            
            var lines = ["a marot reading he had performed", "a dream he had dreamt", "a vision he had experienced", "a marot card he had drawn", "a riddle he had heard whispered on the winds", "a sign he had seen in the stars", "the daily horoscope for everyone involved"];
            return lines[Math.floor(Math.random()*lines.length)];
            
        }
        
        
    };