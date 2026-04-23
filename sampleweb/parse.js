var one_quotation = false;

function parseRule(rule, speaker) {
    
    //console.log(rule);
    
    var sentence = "";
    
    var this_one_cryptic = false;
    
     var person = false;
     var weapon = false;
     var room = false;
     var motive = false;
    
    if (rule.type == "simple") {
        
     var person = false;
     var weapon = false;
     var room = false;
     var motive = false;

        if (rule.entity_one[0] == "name") person = rule.entity_one[1];
        if (rule.entity_one[0] == "weapon") weapon = rule.entity_one[1];
        if (rule.entity_one[0] == "room") room = rule.entity_one[1];
        if (rule.entity_one[0] == "motive") motive = rule.entity_one[1];

        if (rule.entity_two[0] == "name") person = rule.entity_two[1];
        if (rule.entity_two[0] == "weapon") weapon = rule.entity_two[1];
        if (rule.entity_two[0] == "room") room = rule.entity_two[1];
        if (rule.entity_two[0] == "motive") motive = rule.entity_two[1];

        //console.log(person);
        //console.log(weapon);
        //console.log(room);


        if (speaker != undefined) {


            if (person == speaker) person = "I";
            
            if (person != speaker) {
                if ((person) && (weapon)) sentence = person + " brought " + weapon + ".";
            } else {
                if ((person) && (weapon)) sentence = person + " with " + weapon + "."; 
            }
            if (person == speaker) {
                if ((person) && (room)) sentence = person + " was " + inOrNot(room) + room + ".";
            } else {
                if ((person) && (room)) sentence = person + " was " + inOrNot(room) + room + ".";
            }
            if ((room) && (weapon)) sentence = weapon + " was " + inOrNot(room) + room + ".";


            if ((person) && (weapon)) sentence = person + " brought " + weapon + ".";
            if ((room) && (weapon)) sentence = weapon + " was " + inOrNot(room) + room + ".";
            
            // MOTIVE MODE PARSING
            if ((motive) && (person)) sentence = person + " wanted " + motive + ".";
            if ((motive) && (weapon)) sentence = "whoever had " + aToThe(weapon) + " wanted " + motive + "."; 
            if ((motive) && (room)) sentence = "whoever wanted " + motive + " was " + inOrNot(room) + room + "."; 

            var intro_phrase = suspect_details[speaker].intro_phrase();

            if (intro_phrase.charAt(intro_phrase.length-1) == " ") {
                console.log("last char? " + intro_phrase.charAt(intro_phrase.length-1));
                sentence = intro_phrase + capitalizeFirstLetter(sentence);
            } else {
                sentence = intro_phrase + " " + sentence;
            }

            sentence = sentence.trim();
            sentence = capitalizeFirstLetter(sentence);

        } else {

            if ((person) && (weapon)) {
                
                if ((hard_mode) && (cryptics < 2) && (fingerprint_counter == 0) && (this_one_cryptic == false)) {
                    this_one_cryptic = true;
                    cryptics++; 
                    fingerprint_id = person;
                    fingerprint_counter++;
                    console.log(fingerprint_id);
                    sentence = "<object><a href='javascript:void(0)' onclick='newPage(\"fingerprint\")'>This fingerprint</a></object> was found on " + weapon + ".";
                    
                } else  sentence = processPersonFeature(person) + " " + evidence_phrases.suspectWeapon() + " " + weapon + ".";
                
            }
            if ((person) && (room)) {
                
                if ((cryptics < 2) && (fingerprint_counter == 0) && (this_one_cryptic == false) && (one_quotation == false)) {
                    
                    
                    this_one_cryptic = true;
                    cryptics++; 
                    
                    if (hard_mode) {
                        
                    fingerprint_id = person;
                    fingerprint_counter++;
                    console.log(fingerprint_id);
                    sentence = "<object><a href='javascript:void(0)' onclick='newPage(\"fingerprint\")'>This fingerprint</a></object> was found " + inOrNot(room) + " " + room + ".";
                        
                    } else {
                        
                      suspect_temp = person;
                      room_temp = room;
                      one_quotation = true;
                        
                      sentence = "<object>" + suspect_temp + " was in a place coincidentally referenced in Dame Obsidian's famous <a href='javascript:void(0)' onclick='newPage(\"obsidian-clue-room\")'>“unauthorized autobiography</a>.”</object>";  
                        
                    }
                    
                    
                    
                } else sentence = [processPersonFeature(person) + " " + evidence_phrases.suspectRoom() + " " + processFeature(room) + ".", processPersonFeature(person) + " " + evidence_phrases.suspectFeatureRoom() + " " + inOrNot(room) + " " + room + "."].random();
            }
            if ((room) && (weapon)) sentence = capitalizeFirstLetter(processClue(weapon)) + " " + evidence_phrases.weaponRoom() + " " + processFeature(room) + ".";

            if ((motive) && (person)) sentence = person + " wanted " + motive + ".";
            if ((motive) && (weapon)) sentence = "The person with " + weapon + " wanted " + motive + ".";
            if ((motive) && (room)) sentence = "The person who wanted " + motive + " was " + inOrNot(room) + room + "."; 

        }


    } else if (rule.type == "not") {
        
         var person = false;
         var weapon = false;
         var room = false;
        var motive = false;

        if (rule.entity_one[0] == "name") person = rule.entity_one[1];
        if (rule.entity_one[0] == "weapon") weapon = rule.entity_one[1];
        if (rule.entity_one[0] == "room") room = rule.entity_one[1];
        if (rule.entity_one[0] == "motive") motive = rule.entity_one[1];


        if (rule.entity_two[0] == "name") person = rule.entity_two[1];
        if (rule.entity_two[0] == "weapon") weapon = rule.entity_two[1];
        if (rule.entity_two[0] == "room") room = rule.entity_two[1];
            if (rule.entity_two[0] == "motive") motive = rule.entity_two[1];

        if (person == speaker) person = "I";

        if (speaker != undefined) {

            if ((person) && (weapon)) sentence = person + " did not bring " + weapon + ".";
            if ((person) && (room)) sentence = person + " was not " + inOrNot(room) + room + ".";
            if ((room) && (weapon)) sentence = capitalizeFirstLetter(weapon) + " was not " + inOrNot(room) + room + "."; 

            if ((motive) && (person)) sentence = person + " did not want " + motive + ".";
            if ((motive) && (weapon)) sentence = "The person with " + weapon + " did not want " + motive + "."; 
            if ((motive) && (room)) sentence = "The person who wanted " + motive + " was not " + inOrNot(room) + room + "."; 

        } else {

            if ((person) && (weapon)) sentence = randomElement([processPersonFeature(person) + " did not bring " + weapon + ".", processPersonFeature(person) + " hated the person who brought " + weapon + ".", processPersonFeature(person) + " thought they were in love with the person who brought " + weapon + ".",  processPersonFeature(person) + " was in whatever-the-opposite-of-love-is with the person who brought " + weapon + ".", processPersonFeature(person) + " was suspicious of the person who brought " + weapon + ".", processPersonFeature(person) + " had a crush on the person who brought " + weapon + ".",  processPersonFeature(person) + " kept accusing the person who had " + weapon + ".",  processPersonFeature(person) + " was trying to throw suspicion on the person who carried " + weapon + ".",  processPersonFeature(person) + " was clearly flirting with the person who had " + weapon + ".", processPersonFeature(person) + " was childhood friends with the person who brought " + weapon + ".", processPersonFeature(person) + " and the person who brought " + weapon + " had a history together."]);
            if ((person) && (room)) sentence = [processPersonFeature(person) + " was not " + processFeature(room), processPersonFeature(person) + " never set foot " + inOrNot(room) + room, processPersonFeature(person) + " had not been " + inOrNot(room) + room, processPersonFeature(person) + " had never been " + inOrNot(room) + room].random() + ".";
            
            if ((room) && (weapon)) sentence = [`It was not permitted to carry ${weapon} ${inOrNot(room) + aToThe(room)}`, capitalizeFirstLetter(weapon) + " was not " + inOrNot(room) + room, capitalizeFirstLetter(weapon) + " was not found " + inOrNot(room) + room, capitalizeFirstLetter(weapon) + " was certainly not " + processFeature(room)].random()  + ".";
            
            if ((motive) && (person)) sentence = person + " did not want " + motive +".";
            if ((motive) && (weapon)) sentence = "The person with " + weapon + " did not want " + motive + "."; 
            if ((motive) && (room)) sentence = "The person who wanted " + motive + " was not " + inOrNot(room) + room + "."; 

        }
         
    } else if (rule.type == "either") {
        
    //console.log("either rule:");
        //console.log(rule);
        
     var person = false;
     var weapon = false;
     var room = false;
        var motive = false;
        
     var persontwo = false;
     var weapontwo = false;
     var roomtwo = false;
        var motivetwo = false;
    
    if (rule.entity_one[0] == "name") person = rule.entity_one[1];
    if (rule.entity_one[0] == "weapon") weapon = rule.entity_one[1];
    if (rule.entity_one[0] == "room") room = rule.entity_one[1];
    if (rule.entity_one[0] == "motive") motive = rule.entity_one[1];

        
       
    if (rule.entity_two[0] == "name") person = rule.entity_two[1];
    if (rule.entity_two[0] == "weapon") weapon = rule.entity_two[1];
    if (rule.entity_two[0] == "room") room = rule.entity_two[1];
    if (rule.entity_two[0] == "motive") motive = rule.entity_one[1];

        
    if (rule.entity_three[0] == "name") persontwo = rule.entity_three[1];
    if (rule.entity_three[0] == "weapon") weapontwo = rule.entity_three[1];
    if (rule.entity_three[0] == "room") roomtwo = rule.entity_three[1];
    if (rule.entity_three[0] == "motive") motivetwo = rule.entity_three[1];

       
    if (rule.entity_four[0] == "name") persontwo = rule.entity_four[1];
    if (rule.entity_four[0] == "weapon") weapontwo = rule.entity_four[1];
    if (rule.entity_four[0] == "room") roomtwo = rule.entity_four[1];
    if (rule.entity_four[0] == "motive") motivetwo = rule.entity_four[1];

        
    if (person == speaker) person = "I";
    if (persontwo == speaker) persontwo = "I";
        
    if ((person) && (weapon)) var sentenceone = person + " brought " + weapon;
    if ((person) && (room)) var sentenceone = person + " was " + processFeature(room); 
    if ((room) && (weapon)) var sentenceone = weapon + " was " + inOrNot(room) + room;
        
    if ((motive) && (person)) sentence = person + " wanted " + motive;
    if ((motive) && (weapon)) sentence = "the person with " + weapon + " wanted " + motive; 
    if ((motive) && (room)) sentence = "the person who wanted " + motive + " was " + inOrNot(room) + room; 

    if ((persontwo) && (weapontwo)) var sentencetwo = persontwo + " brought " + weapontwo;
    if ((persontwo) && (roomtwo)) var sentencetwo = persontwo + " was " + inOrNot(roomtwo) + roomtwo;
    if ((roomtwo) && (weapontwo)) var sentencetwo = weapontwo + " was " + inOrNot(roomtwo) + roomtwo;
        
    if ((motivetwo) && (persontwo)) var sentencetwo = persontwo + " wanted " + motivetwo;
    if ((motivetwo) && (weapontwo)) var sentencetwo = "the person with " + weapontwo + " wanted " + motivetwo; 
    if ((motivetwo) && (roomtwo)) var sentencetwo = "the person who wanted " + motivetwo + " was " + inOrNot(roomtwo) + roomtwo; 
        
   
        
    if (Math.floor(Math.random() * 2) == 0) sentence = "Either " + sentenceone + " or " + sentencetwo + ". (But not both!)";
    else sentence = "Either " + sentencetwo + " or " + sentenceone + ". (But not both!)";
        
    } else if (rule.type == "killer") {

        
        if (rule.entity_one[0] == "weapon") {weapon = rule.entity_one[1]; good_details.push(aToThe(weapon)); good_details.push(aToThe(processClue(weapon)));}
        if (rule.entity_one[0] == "room") {
            
            room = rule.entity_one[1];
            good_details.push("the body " + capitalizeFirstLetter(removeThe(processFeature(room))));
            good_details.push("the corpse " + capitalizeFirstLetter(removeThe(processFeature(room))));
            good_details.push("the murder " + capitalizeFirstLetter(removeThe(processFeature(room))));
            good_details.push("the murder that was " + capitalizeFirstLetter(removeThe(processFeature(room))));
        }
        
        if (rule.entity_one[0] == "motive") motive = rule.entity_one[1];
        
        
        //console.log(sentence);
        
        if (room) sentence = [aToThe(victim) + "'s body was found " + processFeature(room), "The murder took place " + processFeature(room),  "The body was found " + inOrNot(room) + room, "Logico determined the murder took place " + inOrNot(room) + room + " based on the clues he found there, specifically the corpse"].random();
        
        //console.log(sentence);
        
        if (weapon) sentence = [capitalizeFirstLetter(processClue(weapon)) + " was found beside " + aToThe(victim), capitalizeFirstLetter(weapon) + " was used to commit the murder", weapon + " was clearly used to commit the crime"].random();
        if (motive) sentence = ["The motive of the murder was " + motive, "The killer wanted " + motive].random();
        
        console.log(sentence);
        
        sentence = "<span class='killer-clue'>" + capitalizeFirstLetter(sentence) + ".</span>";
        
        
    } else if (rule.type == "did_not_kill") {
        
        if (rule.entity_one[0] == "room") room = rule.entity_one[1];
        if (rule.entity_one[0] == "weapon") weapon = rule.entity_one[1];
        if (rule.entity_one[0] == "name") person = rule.entity_one[1];
        if (rule.entity_one[0] == "motive") motive = rule.entity_one[1];
        
        if (rule.entity_two[0] == "room") roomtwo = rule.entity_two[1];
        if (rule.entity_two[0] == "weapon") weapontwo = rule.entity_two[1];
        if (rule.entity_two[0] == "name") persontwo = rule.entity_two[1];
        if (rule.entity_two[0] == "motive") motivetwo = rule.entity_two[1];
        
        if ((person) && (persontwo)) sentence = "Both" + person + " and " + persontwo + " both have rock solid alibis: they did not do it.";
        else if ((weapon) && (weapontwo)) sentence = "Neither" + weapon + " nor " + weapontwo + " could have possibly been used to commit the crime.";
        else if ((room) && (roomtwo)) sentence = "The murder wasn't committed in either " + room + " or " + roomtwo + ".";
        else if ((motive) && (motivetwo)) sentence = "The murder was not committed " + motive + " nor " + motivetwo + ".";
        else if (person) sentence = person + " has a definite alibi and is innocent.";
        else if (weapon) sentence = weapon + " was not used to commit the crime.";
        else if (room) sentence = room + " was not where the killing happened.";
        else if (motive) sentence = "The murder was not committed " + motive + ".";
        
    } else if (rule.type == "indoors") {
        
        if (rule.entity_one[0] == "weapon") weapon = rule.entity_one[1];
        if (rule.entity_one[0] == "name") person = rule.entity_one[1];
        if (rule.entity_one[0] == "motive") motive = rule.entity_one[1];
        
        if (person) sentence = person + randomElement([" was found ", " was seen "]) + parseIndoorOutdoor(rule.relationship) + ".";
        if (weapon) {
            sentence = capitalizeFirstLetter(processClue(weapon)) + randomElement([" was found ", " was seen "]) + parseIndoorOutdoor(rule.relationship) + ".";
            good_details.push("the " +  parseIndoorOutdoorSingular(rule.relationship) + " " + dropAorThe(weapon));
        }
        if (motive) sentence = ["The suspect who wanted ", "The suspect who shamelessly bragged about wanting ", "Someone who clearly wanted ", "A suspect who obviously desired ", "A suspect clearly planning "].random() + motive + randomElement([" was found ", " was seen "]) + parseIndoorOutdoor(rule.relationship) + ".";
        
    } else if (rule.type == "handed") {
        
        if (rule.entity_one[0] == "weapon") weapon = rule.entity_one[1];
        if (rule.entity_one[0] == "room") room = rule.entity_one[1];
        if (rule.entity_one[0] == "motive") motive = rule.entity_one[1];
        
        if (room) {
            sentence = "Whoever was " + inOrNot(room) + room + " was " + rule.relationship + "-handed.";
        }
        if (weapon) {
            sentence = [`${aToThe(weapon)} was ${rule.relationship}-handed only.`, "Whoever had " + weapon + " was " + rule.relationship + "-handed."].random();
            good_details.push("the " + capitalizeFirstLetter(rule.relationship) + "-Handed " + capitalizeFirstLetter(removeA(weapon)));}
        
        if (motive) sentence = "Whoever wanted " + motive + " was " + rule.relationship + "-handed.";
 
        
    } else if (rule.type == "eyes") {
        
        if (rule.entity_one[0] == "weapon") weapon = rule.entity_one[1];
        if (rule.entity_one[0] == "room") room = rule.entity_one[1];
        if (rule.entity_one[0] == "motive") motive = rule.entity_one[1];
        
        if (room) {
            sentence = [["Whoever was ", "The suspect who was "].random() + inOrNot(room) + room + " had " + rule.relationship + " eyes.", `${rule.relationship} eyes were seen ${inOrNot(room) + room}`].random();
        }
        if (weapon) {
            sentence = [["Whoever had ", "The suspect who was carrying ", "The suspect with "].random() + weapon + [" was known to have ", " also had "].random() + rule.relationship + " eyes.", `${capitalizeFirstLetter(rule.relationship)} eyes stared at ${weapon}.`,`${capitalizeFirstLetter(weapon)} was reflected in ${rule.relationship} eyes.`].random();
            //good_details.push(["the " + capitalizeFirstLetter(rule.relationship) + "-Eyed " + capitalizeFirstLetter(removeA(weapon)) + "-Holder", "the " + capitalizeFirstLetter(rule.relationship) + "-Eyes"].random());
        }
        
        if (motive) sentence = "Whoever wanted " + motive + " had " + rule.relationship + " eyes.";
 
        
    } else if (rule.type == "hair") {
        
        if (rule.entity_one[0] == "weapon") weapon = rule.entity_one[1];
        if (rule.entity_one[0] == "room") room = rule.entity_one[1];
        if (rule.entity_one[0] == "motive") motive = rule.entity_one[1];
        
        if (room) {
            
            if (rule.relationship == "no") {
                
                sentence = "A bald suspect was " + inOrNot(room) + room + ".";
                
            } else sentence = ["The suspect " + inOrNot(room) + room + " had " + rule.relationship + " hair.", `A ${rule.relationship} hair was found ${inOrNot(room) + room}.`].random(); 
            
            
        }
        if (weapon) {
            
            if (rule.relationship == "no")  sentence = "The suspect with " + aToThe(weapon) + " was bald.";
            else sentence = ["The suspect with " + aToThe(weapon) + " also had " + rule.relationship + " hair.", `A ${rule.relationship} hair was found wrapped around ${aToThe(weapon)}.`].random();
            //good_details.push("the " + capitalizeFirstLetter(rule.relationship) + "-Haired " + capitalizeFirstLetter(removeA(weapon)) + "-Holder");
        }
        
        if (motive) sentence = "Whoever wanted " + motive + " had " + rule.relationship + " hair.";
 
        
    } else if (rule.type == "sign") {
        
        function aOrAn(sign) {
            
            if ((sign == "aries") || (sign == "aquarius")) return "an";
            else return "a";
            
        }
        
        if (rule.entity_one[0] == "weapon") weapon = rule.entity_one[1];
        if (rule.entity_one[0] == "room") room = rule.entity_one[1];
        if (rule.entity_one[0] == "motive") motive = rule.entity_one[1];
        
        if (room) {
            
            if ((hard_mode) && (cryptics < 2)) {
                cryptics++;
                sentence = `The suspect ${roomWithPreposition(room)} was born on <a href='javascript:void(0)' onclick='newPage("astrology")'>${convertDate(lookUpSuspect(whosInRoom(room), "characteristics").birthday)}</a>.`; //, capitalizeFirstLetter(aOrAn(rule.relationship)) + " " + capitalizeFirstLetter(rule.relationship) + " was " + inOrNot(room) + room + "."].random();
                this_one_cryptic = true;
                cryptics++;
            }
            else sentence = capitalizeFirstLetter(aOrAn(rule.relationship)) + " " + capitalizeFirstLetter(rule.relationship) + " was " + inOrNot(room) + room + "." + [` What ${aOrAn(rule.relationship) + " " + capitalizeFirstLetter(rule.relationship)}.`, ` Typical ${capitalizeFirstLetter(rule.relationship)}.`, ` Classic ${capitalizeFirstLetter(rule.relationship)}.`, "", "", "", ""].random();
            good_details.push(aOrAn(rule.relationship) + " " + capitalizeFirstLetter(rule.relationship) + " " + inOrNot(room) + room);
        }
        if (weapon) {
            
            if ((hard_mode) && (cryptics < 2)) {
                
                cryptics++;
                
                var temp_cult = nameSecretSociety();
                
                
                sentence = `${capitalizeFirstLetter(weapon)} was brought by a member of ${temp_cult}, and only ${capitalizeFirstLetter(rule.relationship)}s are allowed to join ${temp_cult}.`;
                
            } else sentence = capitalizeFirstLetter(aOrAn(rule.relationship)) + " " + capitalizeFirstLetter(rule.relationship) + " had " + aToThe(weapon) + "." + [` Typical ${capitalizeFirstLetter(rule.relationship)}.`, ` Classic ${capitalizeFirstLetter(rule.relationship)}.`, "", "", "", ""].random();
            good_details.push(aOrAn(rule.relationship) + " " + capitalizeFirstLetter(rule.relationship) + " with the " + capitalizeFirstLetter(dropAorThe(weapon)));}
        
        if (motive) sentence = "Whoever wanted " + motive + " was " + aOrAn(rule.relationship) + " " + capitalizeFirstLetter(rule.relationship) + "." + [` What ${aOrAn(rule.relationship) + " " + capitalizeFirstLetter(rule.relationship)}.`, ` Classic ${capitalizeFirstLetter(rule.relationship)}.`, "", "", "", ""].random();
 
        
    }else if (rule.type == "material") {
        
        if (rule.entity_one[0] == "name") person = rule.entity_one[1];
        if (rule.entity_one[0] == "room") room = rule.entity_one[1];
        if (rule.entity_one[0] == "motive") motive = rule.entity_one[1];
        
        if (room) {
            sentence = ["Traces of a weapon made of " + rule.relationship + " were found " + inOrNot(room) + room, "Forensics determined a weapon made at least partially out of " + rule.relationship + " was present " + inOrNot(room) + room, addAOrAn(rule.relationship) + "-detector gave a positive reading " + roomWithPreposition(room)].random() + ".";
        }
        if (person) {
            sentence = [processPersonFeature(person) + " had a weapon made of " + rule.relationship, "Analysts discovered traces of a weapon made of " + rule.relationship + " on the clothing of " + person, addAOrAn(rule.relationship) + "-detector gave a positive reading on " + person].random() + "."
        }
        
        if (motive) sentence = ["The suspect who wanted " + motive + " had a weapon made at least partially of " + rule.relationship, "A weapon made (at least) in part of " + rule.relationship + " was brought by the person who wanted " + motive].random() + ".";
 
        
    } else if (rule.type == "weight") {
        
        if (rule.entity_one[0] == "name") person = rule.entity_one[1];
        if (rule.entity_one[0] == "room") room = rule.entity_one[1];
        if (rule.entity_one[0] == "motive") motive = rule.entity_one[1];
        
        if (room) {
            sentence = ["Whoever was " + inOrNot(room) + room + " had a " + rule.relationship + "-weight weapon.", `A ${rule.relationship}-weight weapon was found ${inOrNot(room) + room}.`].random();
        }
        if (person) {
            if (rule.relationship == "heavy") sentence = processPersonFeature(person) + " was lugging around a " + rule.relationship + "-weight weapon.";
            else {
                
                sentence = processPersonFeature(person) + " had a " + rule.relationship + "-weight weapon.";
                
            }
        }
        
        if (motive) sentence = "Whoever wanted " + motive + [" had a ", " was carrying a ", " was trying to hide a ", " was clearly holding a "].random() + rule.relationship + "-weight weapon.";
 
        
    } else if (rule.type == "oneofeach") {
        
        sentence = "The " + size + " suspects were ";
        
        for (var a = 0; a < rule.entity_one.length; a++) {
            
            var person = false;
            var weapon = false;
            var room = false;
            var motive = false;
            
            if (rule.entity_one[a][0] == "name") person = rule.entity_one[a][1];
            if (rule.entity_one[a][0] == "weapon") weapon = rule.entity_one[a][1];
            if (rule.entity_one[a][0] == "room") room = rule.entity_one[a][1];
            if (rule.entity_one[a][0] == "motive") motive = rule.entity_one[a][1];

            if (room) {
                sentence +=  "the suspect " + inOrNot(room) + room;
            }
            if (weapon) {
                sentence +=  "whoever had " + weapon;
            }
            if (person) {
                sentence += person;
            }

            if (motive) sentence += "the suspect who wanted " + motive;
            
            if (a < rule.entity_one.length - 2) sentence += ", ";
            else if (a == rule.entity_one.length - 2) sentence += " & ";
            else sentence += ".";
        }
            
    } else if (rule.type == "gimme") {

        if (motive_mode) sentence = rule.entity_one.name + " was seen " + inOrNot(rule.entity_one.room) + rule.entity_one.room + " with " + rule.entity_one.weapon + " and they wanted " + rule.entity_one.motive + ".";
        else sentence = rule.entity_one.name + " was seen " + inOrNot(rule.entity_one.room) + rule.entity_one.room + " with " + rule.entity_one.weapon + ".";

    }
    
    if ((rule.type == "simple") && (this_one_cryptic == false) && ( (cryptics < 1) || ( (cryptics == 1) && (fingerprint_counter == 1) ) ) && (!(speaker))) {
        cryptics++;
        console.log(sentence);
        this_one_cryptic = true;
        
        var code_part = "";
        var decode_link = "";
        
        if (tutorial_mode) {
            code_part = encodeWordReverse(sentence).toUpperCase();//"<span class='upside-down-text'>" + en + "</span>";
            decode_link = ``;
        }
        else if (hard_mode) {
            console.log("NOT TUTORIAL MODE?");
            console.log(tutorial_mode);
            code_part = cryptify(sentence, 1).toUpperCase();
            
            code_part = code_part.replace(/'/g, "’");
            
            decode_link = `</a> (<a href='javascript:void(0)' onclick='coded_message = "${code_part}"; newPage(\"false-decoder\")'>Decode</a>.)`;
            
        }
        else {
            
            if (flipACoin()) {
                
                code_part = encodeWordReverse(sentence).toUpperCase();//"<span class='upside-down-text'>" + en + "</span>";
                
                code_part = code_part.replace(/'/g, "’");
                
                decode_link = `</a> (<a href='javascript:void(0)' onclick='coded_message = "${code_part}"; newPage(\"false-decoder\")'>Decode</a>.)`;
                
            } else {
                
                
                if (flipACoin()) code_part = caesarify(sentence, Math.floor(Math.random()*26), true).toUpperCase();
                
                else {
                    code_part = sentence.toUpperCase();
                    code_part = encodeDC(code_part);
                }
                
                code_part = code_part.replace(/'/g, "’");
                
                decode_link = `</a> (<a href='javascript:void(0)' onclick='coded_message = "${code_part}"; newPage(\"decoder\")'>Decode</a>.)`;
                
            }
            
            
        }
        
        console.log(hard_mode);
        console.log(decode_link);
        
        if ((tutorial_mode) && (hint_display)) var additional = `</a> <span class='tutorial-display'>(<a href='javascript:void(0)' onclick='giveHelp(this, "cryptic-simple",  "${person}", "${weapon}", "${room}")'>?</a>)</span>`;
        else var additional = "";
        
        return ["An anonymous source that Logico trusted passed him a message that read:", "One of Logico's contacts in <em>" + nameSecretSociety() + "</em> gave him this tip:", "A messenger from <em>" + nameSecretSociety() + "</em> gave Logico a note that read:", "A messenger from <em>" + nameSecretSociety() + "</em> gave Logico a note that read:"].random() + " <strong>" + code_part  + "</strong>" + decode_link + additional;
    }
    
    /*
    
    if ((rule.type == "simple") && (hard_mode) && (cryptics < 1)) {
        cryptics++;
        console.log(sentence);
        return [ "An anonymous source that Logico trusted passed him a message that read:", "One of Logico's contacts in a secret society gave him this tip:", "Inspector Irratino received a message using what he claimed was \"spirit writing,\" though Logico knew he had learned it some other way:"].random() + " <strong>" + cryptify(sentence, 1).toUpperCase() + "<strong>";
    }
    
    */
    
    if (tutorial_mode) sentence += `</a> <span class='instructions'>(<a href='javascript:void(0)' onclick='giveHelp(this, "${rule.type}",  "${person}", "${weapon}", "${room}")'>?</a>)</span>`;
    
    
    return capitalizeFirstLetter(sentence); 
    
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

function giveHelp(origin, type, person, weapon, room) {
    
    if (origin.innerHTML == "?") {
    
        if (person == "false") person = false;
        if (weapon == "false") weapon = false;
        if (room == "false") room = false;

        var element_set = [];

        if (person) element_set.push(person);
        if (weapon) element_set.push(weapon);
        if (room) element_set.push(room);

        var pair = element_set.join(" and ");

        if (type == "simple") {

            if ((person) && (weapon)) var sentence_pair = person + " had " + aToThe(weapon);
            else if ((weapon) && (room)) var sentence_pair = weapon + " was " + inOrNot(room) + room;
            else if ((person) && (room)) var sentence_pair = person + " was " + inOrNot(room) + room;

            return_message = `This clue shows that ${sentence_pair}. Put a checkmark where ${pair} intersect on the grid, and place Xs in the other possible combinations.`;

        } else if (type == "cryptic-simple") {

            if ((person) && (weapon)) var sentence_pair = person + " had " + aToThe(weapon);
            else if ((weapon) && (room)) var sentence_pair = weapon + " was " + inOrNot(room) + room;
            else if ((person) && (room)) var sentence_pair = person + " was " + inOrNot(room) + room;

            return_message = `Each of the words in this clue are written in reverse. Once you decode it, you'll see that ${sentence_pair}. Put a checkmark where ${pair} intersect on the grid, and place Xs in the other possible pairings.`;

        }else if (type == "not") {

            if ((person) && (weapon)) var sentence_pair = person + " did not have " + aToThe(weapon);
            else if ((weapon) && (room)) var sentence_pair = weapon + " was not " + inOrNot(room) + room;
            else if ((person) && (room)) var sentence_pair = person + " was not " + inOrNot(room) + room;

            return_message = `This clue shows that ${sentence_pair}. Put an X where ${pair} intersect on the grid.`;

        } else if (type == "killer") {



            if (weapon) var sentence_pair = "This clue means that the killer used " + aToThe(weapon) + ". When you have filled out the grid, use this to determine whodunit.";
            else if (room) var sentence_pair = "This clue means that the killer was " + inOrNot(room) + room + ". When you have filled out the grid, use this to determine whodunit.";

            return_message = sentence_pair;

        }

        origin.innerHTML = return_message;
        origin.style.textDecoration = "none";
        origin.style.fontStyle = "italic";
        
    } else {
        
          origin.innerHTML = "?";
        origin.style.textDecoration = "underline";
        origin.style.fontStyle = "regular";      
        
    }
    
}

function simpleReverse(message) {
            
            var return_code = "";
            
            for (var a = 0; a < message.length; a++) {
                
                return_code += message[message.length-1-a];
                
            }
            
            return return_code;
            
        }

   function encodeWordReverse(message) {

        console.log(message);

        var new_message = "";

        message = message.replaceAll(".","").replaceAll(",","");

        var message_array = message.split(" ");

        for (var a = 0; a < message_array.length; a++) {

            new_message += simpleReverse(message_array[a]);
            if (a != (message_array.length - 1)) new_message += " ";
            else new_message += ".";

        }


        return capitalizeFirstLetter(new_message);

    }

function parseHintRule(rule) {
    
    console.log(rule);
    
    var person = false;
     var weapon = false;
     var room = false;
     var motive = false;
    
    if (rule.entity_one[0] == "name") person = rule.entity_one[1];
    if (rule.entity_one[0] == "weapon") weapon = rule.entity_one[1];
    if (rule.entity_one[0] == "room") room = rule.entity_one[1];
    if (rule.entity_one[0] == "motive") motive = rule.entity_one[1];
    
    if (rule.entity_two[0] == "name") person = rule.entity_two[1];
    if (rule.entity_two[0] == "weapon") weapon = rule.entity_two[1];
    if (rule.entity_two[0] == "room") room = rule.entity_two[1];
    if (rule.entity_two[0] == "motive") motive = rule.entity_two[1];
    
    if ((person) && (weapon)) sentence = "I see " + processPersonFeature(person) + ", and it seems like they have " + weapon + " in their hands...";
    
    if ((room) && (weapon)) sentence = "The forces of the occult are telling that there was " + weapon + " somewhere " + inOrNot(room) + " " + room + "...";
    
    if ((person) && (room)) sentence = "What is this? I am seeing, it seems, that " + person + " was standing " + inOrNot(room) + " " + room + "...";

    if ((motive) && (person)) sentence = "It seems, if you ask me, that " + person + " clearly was driven by a desire " + motive + ".";
    
    if ((motive) && (weapon)) sentence = "After consulting the forces of the esoteric, I am getting strong association between " + weapon + " and someone who wanted " + motive + ".";
    
    if ((motive) && (room)) sentence = "After seeking out the help of the esoteric correspondences that govern our lives, I am sensing a strong feeling of someone who desired " + motive + " lingering " + inOrNot(room) + room + "."; 
    
    
    
    return sentence;
    
}

function roomWithPreposition(room_name) {
    
    return inOrNot(room_name) + room_name;
    
}

function inOrNot(word) {
    
    
    console.log("inOrNot: " + word);
    
    const index = major_setting.rooms.map(e => e.name).indexOf(word);
    return major_setting.rooms[index].preposition + " ";
    
    //if (ifOn(word) != "in") return "";
    //else if (ifOn(word) == "atop") return " atop ";
    //else return " in ";
    
}

function lookUpSuspect(suspect, quality) {
    
    return suspect_details[suspect][quality];
    
}

function lookUpWeapon(weapon, quality) {
    
    console.log(weapon + " weapon | quality " + quality)
    
    const index = major_setting.weapons.map(e => e.name).indexOf(weapon);
    
    console.log(major_setting.weapons[index]);
    
    return major_setting.weapons[index][quality];
    
}

function lookUpLocation(location, quality) {
    
    const index = major_setting.rooms.map(e => e.name).indexOf(location);
    
    console.log(major_setting.rooms[index]);
    
    return major_setting.rooms[index][quality];
    
}

function lookUpMotive(motive, quality) {
    
    return motives_rich[motive][quality];
    
}

function aToThe(name) {
    
    if (name.indexOf("a ") == 0) return "the " + name.substring(2);
    else if (name.indexOf("an ") == 0) return "the " + name.substring(3);
    return name;
    
}

function fourthLetterVowel(word){
   var vowels = ("aeiouAEIOU"); 
   return vowels.indexOf(word[4]) !== -1;
}


function theToA(name) {
  
    if (name.indexOf("the ") == 0) {
        
        if (fourthLetterVowel(name)) return "an " + name.substring(4);
        else return "a " + name.substring(4)
        
    } else return name;
    
}
    
function dropAorThe(name) {

    if (name.indexOf("the ") == 0) return name.substring(4);
    else if (name.indexOf("a ") == 0) return name.substring(2);
    else if (name.indexOf("an ") == 0) return name.substring(3);
    else return name;
    
}
    
function parseIndoorOutdoorSingular(value) {
    
    if (value) return "indoor";
    else return "outdoor";
    
}
    
function parseIndoorOutdoor(value) {
    
    if (value) return "indoors";
    else return "outdoors";
    
}


    
    
var evidence_phrases = {
  
        "weaponRoom" : function() {
            
            var phrases = ["was found", "was discovered"];
            return phrases[Math.floor(Math.random() * phrases.length)];
            
        },
        "suspectWeapon" : function() {
            
            var phrases = ["brought", "was seen with", "had"];
            return phrases[Math.floor(Math.random() * phrases.length)];
            
        },
        "suspectRoom" : function() {
            
            var phrases = ["was seen hanging around", "was seen"];
            return phrases[Math.floor(Math.random() * phrases.length)];
            
        },
        "suspectFeatureRoom" : function() {
            
            var phrases = ["was seen hanging around", "was seen"];
            return phrases[Math.floor(Math.random() * phrases.length)];
            
        }
    
};
        
function processClue(weapon) {
    
    const index = major_setting.weapons.map(e => e.name).indexOf(weapon);
    
    if ((major_setting.weapons[index].clue != false) && (research_mode)) {
        good_details.push(aToThe(major_setting.weapons[index].clue));
        return major_setting.weapons[index].clue;
    }
    else return weapon;
    
}
    
        
function processFeature(room) {
    
    const index = major_setting.rooms.map(e => e.name).indexOf(room);
    
    if ((major_setting.rooms[index].feature != false) && (research_mode)) return major_setting.rooms[index].feature;
    else return inOrNot(room) + room;
    
}

function processPersonFeatureWritten(person) {
    
    if (suspect_details[person].characteristics.feature) return suspect_details[person].characteristics.feature;
    else return person;
    
}
   
function processPersonFeature(person) {
    
    var replacement = "";
    
    //console.log(research_mode);
    
    if ((research_mode) && (tutorial_mode == false)) {
        return [person, person, checkHeights(person), person].random();
    }
    else return person;
    
    //if ((major_setting.suspects[index].feature != false) && (research_mode)) return major_setting.rooms[index].feature;
    //else return inOrNot(room) + room;
    
}

function checkHeights(person) {
    
    var height_array = [], sorted_height_array = [];
    var matching_person = "";
    var matching_number = 0;
    
    var person_height = suspect_details[person].characteristics.height;
    
    for (var a = 0; a < names.length; a++) {
        
        height_array.push({name: names[a], height: suspect_details[names[a]].characteristics.height});
        
    }
    
   var sorted_height_array = height_array.sort((a, b) => a.height - b.height);
    
    var placement = "";
    
   if (person == sorted_height_array[0].name) placement = "shortest";
    if (person == sorted_height_array[1].name) placement = "second shortest";
    if (person == sorted_height_array[sorted_height_array.length-2].name) placement = "second tallest";
    else if (person == sorted_height_array[sorted_height_array.length-1].name) placement = "tallest";
    
    for (var a = 0; a < sorted_height_array.length; a++) {
        
        if ((person_height == sorted_height_array[a].height) && (person != sorted_height_array[a].name)) {
            matching_person = sorted_height_array[a].name;
            matching_number++;
        }   
        
    }
    
    if ((matching_number == 0) && (placement != "")) return "The " + placement + " suspect";
    else if (matching_number == 1) return "The other suspect with the same height as " + matching_person;
    else return person;
    
 
    
}

function turnAverageToResults(percent) {
    
    if ((Math.random()*100) < percent) return true;
    else return false;
    
}

function nameSecretSociety() {

    var adjective_first = ["Divine", "Venerable", "Enigmatic", "Magical", "Mystical", "Esoteric", "Arcane", "Esteemed", "Grand", "Revered", "August", "Venerated", "Pure", "Righteous", "Blazing", "Glittering", "Radiant", "Golden", "Sublime", "Blessed", "Devout", "Immaculate", "Fraternal", "Holy", "Sacred", "Ancient", "Mysterious", "Final", "Illuminated"].random();
    
    var noun_first = ["Order", "Brotherhood", "Family", "Society", "Community", "Circle", "Band", "Fellowship", "Lodge", "Sisterhood", "Association", "Confraternity", "Sorority", "Fraternity", "Guild", "Sect", "League", "Denomination", "Cult", "Church", "Movement", "Faith", "Body", "Band"].random();
    
    var adjective_second = ["Sacred", "Cherished", "Hallowed", "Consecrated", "Numinous", "Free", "Bare", "Rolling", "Unbarred",  "Open", "Closed", "Smiling", "All-Knowing", "Ancient", "Terrible", "Mysterious", "Victorious", "Hidden", "Red", "Blue", "White", "Black", "Green", "Crimson", "Yellow", "Triumphant", "Unvanquished", "Cryptic", "Inscrutable", "Mystic", "Dark", "Light"].random();
    
    var noun_second = ["Rose", "Key", "Tree", "Eye", "Eyes", "Hand", "Face", "Cross", "Sword", "Dagger", "Fire", "Water", "Earth", "Air", "Ledger", "Faith", "Spirit", "God", "Goddess", "Saint", "Warrior", "Cup", "Pentacle", "Wand", "Temple", "Revolution", "Revolt", "Shift", "Upset", "Plot", "Mutiny", "Coup", "Riot", "Gem", "Emerald", "Knife", "Bow", "Arrow", "Quiver", "Marot", "Staff", "Chalice", "Goblet", "Ruins", "Ruins", "Ruins", "Cauldron", "Candle", "Book", "Rage", "Darkness", "Blood", "Peace", "Flower", "Lock", "Thorn", "Petal", "Stem", "Leaf", "Bouquet", "Vase"].random();
    
    if (turnAverageToResults(40)) adjective_first = "";
    if (turnAverageToResults(35)) adjective_second = "";
    
    return `The ${adjective_first} ${noun_first} of the ${adjective_second} ${noun_second}`.replaceAll("  ", " ");;

}

function secretSocietyParse() {
    
    
    
}

function cryptify(input, amount) {
    
        input = input.replace(".", "").replace("-", " ").replace(",", "");
    
        function scramble(a){a=a.split("");for(var b=a.length-1;0<b;b--){var c=Math.floor(Math.random()*(b+1));d=a[b];a[b]=a[c];a[c]=d}return a.join("")}

        var textArea = input;
        var lines = textArea.split(' ');
        for(var i = 0;i < lines.length;i++){
            lines[i] = scramble(lines[i]).toUpperCase();
        }
        console.log(lines)
        return lines.join(' ') + ".";
    
    
}

var caesar_line = "";

function caesarify(input, amount, original) {
    
    var alphabet = "abcdefghijklmnopqrstuvwxyz".toUpperCase();
    var newalpha = "";
    
    if (amount < 0) amount += 26;

    function shift(n){
        for (let i = 0; i < alphabet.length; i++){
            let offset = (i + n) % alphabet.length;
            newalpha += alphabet[offset];
        }
    }

    function encode(message){
        let result = "";
        message = message.toUpperCase();
        for (let i = 0; i < message.length; i++){
            if (alphabet.indexOf(message[i]) != -1) {
                //console.log(alphabet.indexOf(message[i]));
             let index = alphabet.indexOf(message[i]);
             result += newalpha[index];
                
            } else result += message[i];
        }
        return result;
    }
    
    shift(amount);
    
    console.log(alphabet + " " + input + " " + newalpha);
    
    var new_result = encode(input);
    
    if (original) caesar_line = new_result;
    
    return new_result;
    
}

function research(type, thename, notebook_last) {
    
    console.log(Math.seedrandom(today_date_string + thename));
    
    var next_card = "";
    
    notebook_toggle = false;
        //document.getElementById("notebook-icon").style.display = "block";
        document.getElementById("notebook-icon").classList.remove("black-icon");
        document.getElementsByClassName("icon-emoji")[0].innerHTML = "📔";
    
    var containerEl = document.getElementById("mainbox");
    
    var titleEl = document.getElementById("title_head_full");
    
    if (type == "return") {
        
        if (current_element[0])
            
        
        
        containerEl.innerHTML = backup;
        if (!(first_day)) document.getElementById("card-explainer").style.display = "none";
        document.getElementById("title_head_full").style.display = "block";
        document.getElementById("club").style.display = "block";

        //var old_height = document.getElementById("title_head_full").offsetHeight;
        
        //document.getElementById("title_head").classList.add("smallify");

        //document.getElementById("subtitle").classList.add("smallify");

        //var new_height = document.getElementById("title_head_full").offsetHeight;
        
        //console.log("old " + old_height + " new: " + new_height);
        mainpage = true;
        window.scrollTo(0, backup_y); //  - (old_height - new_height));
        fillInDropDown();
        
        document.getElementById("club").style.display = "block";
        document.getElementById("chess-base").style.display = "block";
        document.getElementById("subheading").style.display = "block";
        
        containerEl.classList.remove("card-skeu");
         
    }
    else {
        
        current_element = [type, thename];
        
            if (mainpage) {
        backup_y = window.scrollY;
            backup = containerEl.innerHTML;  
            backup_title = titleEl.innerHTML;
            mainpage = false;
        }
        
        containerEl.classList.add("card-skeu");
        
        document.getElementById("club").style.display = "none";
        document.getElementById("chess-base").style.display = "none";
        document.getElementById("subheading").style.display = "none";
        
    }
    
    if (type == "name") {
        
        console.log(thename);
        
        next_card = names[(names.indexOf(thename)+1)%names.length];
        
        containerEl.innerHTML = "<div><p class='evidence-header'><span id='char-emoji' class='emoji'>" + suspect_details[thename].emoji + "</span><br><span>" + colorPrint(thename).toUpperCase() + "</span></p><p class='card-text'>" + suspect_details[thename].biography + "<div style='text-align: center;'><p><strong>" + inchesToFeet(suspect_details[thename].characteristics.height) + " • " + suspect_details[thename].characteristics.hand.toUpperCase() + "-HANDED • " + suspect_details[thename].characteristics.eyes.toUpperCase() + "&nbsp;EYES • " + suspect_details[thename].characteristics.hair.toUpperCase() + `&nbsp;HAIR • ${suspect_details[thename].characteristics.sign.toUpperCase()}</strong></p></div></div>`;
        document.getElementById("char-emoji").style.textShadow =  "0 0 0 " + suspect_details[thename].color;
    }
    
    else if (type == "weapon") {
        
        console.log(thename);
        
        const index = major_setting.weapons.map(e => e.name).indexOf(thename);
        
        next_card = weapons[(weapons.indexOf(thename)+1)%weapons.length];
        
        console.log(index);
        
        function generateMaterials(theweapon) {
        
            if (major_setting.weapons[index].materials != undefined) { 
            
                var materials = major_setting.weapons[index].materials.join(', ').replace(/, ([^,]*)$/, ' &amp; $1');
            
                return "</p><p style='text-align: center'><strong>" + major_setting.weapons[index].weight.toUpperCase() + "-WEIGHT • MADE OF " + materials.toUpperCase() + "</strong><p>";
                
            }
            else return "";
            
        }
        
        if (major_setting.weapons[index].description != undefined) {
            
            if (major_setting.weapons[index].fulldescription == true) {
                
               var description = major_setting.weapons[index].description; 
                
            } else {

                console.log(major_setting.weapons[index].description);
                var description = major_setting.weapons[index].description + [" Logico has seen people ", " Logico had solved cases where someone was ", " Logico had heard of people being ", " Logico would swear on his eyebrows that someone could be ", " Logico could imagine someone getting "].random() + major_setting.weapons[index].method.join(', ').replace(/, ([^,]*)$/, ' &amp; $1') + " with something like this.";

                if (major_setting.weapons[index].clue) description += randomElement([" It can be identified by ", " For evidence of this, look for "]) + major_setting.weapons[index].clue + " left behind.";

            }
            
            
            
        }
        else {
            var description = proceduralcontent.little_phrases.weapon_word() + [" Logico has seen people ", " Logico had solved cases where someone was ", " Logico had heard of people being ", " Logico would swear on his eyebrows that someone could be ", " Logico could imagine someone getting "].random() + major_setting.weapons[index].method.join(', ').replace(/, ([^,]*)$/, ' &amp; $1') + " with something like this.";
            
            if (major_setting.weapons[index].clue) description += randomElement([" It can be identified by ", " For evidence of this, look for "]) + major_setting.weapons[index].clue + " left behind.";
        }
            
            
        var information = "<div><p class='evidence-header'><span class='emoji'>" + major_setting.weapons[index].emoji + "</span><br>" + thename.toUpperCase() +"</p><p class='card-text'>" + description;
        
        var info_box = generateMaterials(thename);
        information += info_box;
        information += "</div>"
        containerEl.innerHTML = information;
    }
    else if (type == "room") {
        
        //console.log(thename);
        const index = major_setting.rooms.map(e => e.name).indexOf(thename);
        
        next_card = rooms[(rooms.indexOf(thename)+1)%rooms.length];
        
        //console.log(index);
        
        var description = '';
        if (major_setting.rooms[index].description != "") {
            
            description = major_setting.rooms[index].description + " ";
            
        } else description = "Deductive Logico had already looked " + major_setting.rooms[index].feature + " for any clues and added them to the collection of evidence.";
        
        if (major_setting.rooms[index].name.indexOf("on ") == 0) var no_on_name = major_setting.rooms[index].name.replace("on ", "").toUpperCase()
        else var no_on_name = major_setting.rooms[index].name.toUpperCase();
        
        containerEl.innerHTML = "<div><p class='evidence-header'><span class='emoji'>" + major_setting.rooms[index].emoji + "</span><br>"  + no_on_name + "</p><p class='card-text'>" + description + "</p><p style='text-align: center'><strong>" + ifIndoor(index).toUpperCase() + "S</strong></p></div>";
        
    }       
    else if (type == "motive") {
        
        //console.log(thename);
        
        next_card = motives[(motives.indexOf(thename)+1)%motives.length];
        
        containerEl.innerHTML = "<div><p class='evidence-header'><span class='emoji'>" + motives_rich[thename].emoji + "</span><br>"  + thename.toUpperCase() + "</p><p class='card-text'>" + 
        motives_rich[thename].description + "</p><p style='text-align: center'></p></div>";
        
    }
    
    if (notebook_last === undefined) notebook_last = false;
    
    if (type != "return") {
        console.log("nb_last: " + notebook_last);
        if (notebook_last) containerEl.innerHTML += '<div style="position: relative; width: 100%; height: 7em;"><p style="position: absolute; left: 0px; width: 70%; text-align: center"><input TYPE="button" NAME="button" class="opening-button" value="SET CARD DOWN" onClick="newPage(\'notebook\')"></p><p style="position: absolute; left: 72%; width: 25%; text-align: center"><input TYPE="button" NAME="button" class="opening-button" value="⮕" onClick="research(\'' + type + '\',\'' + next_card + '\', \'' + notebook_last + '\')"></p></div>';
        else containerEl.innerHTML += '<div style="position: relative; width: 100%; height: 7em;"><p style="position: absolute; left: 0px; width: 70%; text-align: center"><input TYPE="button" NAME="button" class="opening-button" value="SET CARD DOWN" onClick="research(\'return\')"></p><p style="position: absolute; left: 72%; width: 25%; text-align: center"><input TYPE="button" NAME="button" class="opening-button" value="⮕" onClick="research(\'' + type + '\',\'' + next_card + '\','  + notebook_last + ')"></p></div>'; //<p style="text-align: center"><input TYPE="button" NAME="button" style="color: black; background-color: #fff5e2;" class="opening-button" value="OPEN NOTEBOOK" onClick="newPage(\'notebook\')"></p>'; 
        document.getElementById("title_head_full").style.display = "none";
        document.getElementById("club").style.display = "none";
        document.getElementById("notebook-icon").classList.remove("notebook-icon-invisible");
        window.scrollTo(0, 0);
    } else current_element = false;
    
    //document.getElementById("notebook-icon").style.display = "block";
    
         //randomButtonColors();
    
    //window.scrollTo(0, 0);
    
    //document.getElementById("mainbox").scrollIntoView();
    
    
}

function addAOrAn(word) {
    
    if ("aeiouAEIOU".indexOf(word.charAt(0)) == -1) return "a " + word;
    else return "an " + word;
    
}

function convertDate(dateString) {
  const monthDict = {
    "01": "January",
    "02": "February",
    "03": "March",
    "04": "April",
    "05": "May",
    "06": "June",
    "07": "July",
    "08": "August",
    "09": "September",
    "10": "October",
    "11": "November",
    "12": "December"
  };
  const parts = dateString.split("/");
  const month = monthDict[parts[0]];
  const day = parts[1];
  return month + " " + day;
}