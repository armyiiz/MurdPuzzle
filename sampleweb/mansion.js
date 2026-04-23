var mansion_nav = { suspect: false};

function printSuspectBio(suspect_garbage) {
    
  //<span id='char-emoji' class='emoji random-color' style='font-size: 250%'>"
    
    var suspect_here = suspect_garbage.options[suspect_garbage.selectedIndex].value;
    
    justPrintingBio(suspect_here);
    
    
    //document.getElementById("char-emoji").style.textShadow =  "0 0 0 " + suspect_details[suspect_here].color;
    
}

function justPrintingBio(suspect_here) { 
    
    console.log(suspect_here);
    
    var painting_url = suspect_here.toLowerCase().replace(/\s/g, '').replace('.', '') + ".png";
    var painting_author = "MORIARTY";
    
    var user_submitted = {
      
        "General Coffee": {
            painter: "Paulissen",
            url: "coffee-paulissen.jpg"
        },
        
        "Chancellor Tuscany": {
            painter: "Memi",
            url: "tuscany-memi.png"
        },
        
        "Mx. Tangerine": {
            painter: "Candy",
            url: "tangerine-candy.png"
        },
        
        "Chef Aubergine": {
            painter: "Maria Ku (grrrenadine)",
            url: "aubergine-ku.png"
        },
        
        "Babyface Blue": {
            painter: "Maria Ku (grrrenadine)",
            url: "blue-ku.png"
        },
        
        "Secretary Celadon": {
            painter: "Maria Ku (grrrenadine)",
            url: "celedon-ku.png"
        },
        
        "Comrade Champagne": {
            painter: "Maria Ku (grrrenadine)",
            url: "champagne-ku.png"
        },
        
        "Signor Emerald": {
            painter: "Maria Ku (grrrenadine)",
            url: "emerald-ku.png"
        },
        
        "Grandmaster Rose": {
            painter: "Maria Ku (grrrenadine)",
            url: "rose-ku.png"
        },
        
        "Sister Lapis": {
            painter: "Maria Ku (grrrenadine)",
            url: "aubergine-ku.png"
        },
        
        "Miss Saffron": {
            painter: "Joe",
            url: "saffron-ku.png"
        },
        
        "Captain Slate": {
            painter: "Maria Ku (grrrenadine)",
            url: "slate-ku.png"
        },
        
        "Lady Violet": {
            painter: "Maria Ku (grrrenadine)",
            url: "violet-ku.png"
        },
        
        "Cosmonaut Bluski": {
            painter: "@helen.does.drawings",
            url: "matthews-bluski.png"
            
        },
        
        "Uncle Midnight": {
            painter: "Kitty Belcher",
            url: "uncle-midnight-belcher.jpeg"
            
        },
        
        "Officer Copper": {
            painter: "Tilly",
            url: "copper-tilly.png"
            
        },
        
        "Agent Fuchsia": {
            painter: "MIA",
            url: "fuchsia-mia.png"
            
        },
        
        "Miss Ruby": {
            painter: "MIA",
            url: "ruby-mia.jpeg"
            
        },
        
        "Principal Applegreen": {
            painter: "Rook Rainsdowne",
            url: "applegreen-rainsdowne.png"
            
        },
        
        "Earl Grey": {
            painter: "Rook Rainsdowne",
            url: "grey-rainsdowne.png"
            
        }
        
    };
    
    
    if (suspect_here in user_submitted) {
        painting_url = "fandom/" + user_submitted[suspect_here].url;
        painting_author = user_submitted[suspect_here].painter;   
    }
    
    console.log(suspect_details[suspect_here]);
    console.log(painting_url);
    
    document.getElementById("suspect-bio").innerHTML = "<p><p style='text-align: center'><img alt='A painting of the suspect.' class='gallery-paintings' src='mansion/gallery/" + painting_url + "'/></p><p style='text-align: center; margin-top: -1em;'><em>Art by " + painting_author + ".</em></p><p>" + suspect_details[suspect_here].biography + "</p><div style='text-align: left;'><p><strong>" + inchesToFeet(suspect_details[suspect_here].characteristics.height) + " • " + suspect_details[suspect_here].characteristics.hand.toUpperCase() + "-HANDED • " + suspect_details[suspect_here].characteristics.eyes.toUpperCase() + "&nbsp;EYES • " + suspect_details[suspect_here].characteristics.hair.toUpperCase() + `&nbsp;HAIR • ${suspect_details[suspect_here].characteristics.sign.toUpperCase()}</strong></p></div></div>`;
    
    function setSelectedValue(selectObj, valueToSet) {
        for (var i = 0; i < selectObj.options.length; i++) {
            console.log(selectObj.options[i]);
            console.log(valueToSet);
            if (selectObj.options[i].text== valueToSet) {
                selectObj.options[i].selected = true;
                return;
            }
        }
    }
    
    var suspect_object = document.getElementById("suspect-list");
    
    console.log(suspect_object);
    
    
    setSelectedValue(suspet_object, suspect_here);
    
}

function getSuspectByEmoji(object, value) {
    console.log(value);
  return Object.keys(object).find(key => object[key].emoji === value);
}

var attic_data = {

    streak : function() {
    
    console.log(streak_data.streak);
        
            var streak_string = "";
        
            console.log(streak_data.streak);

                for (var a = 0; a < streak_data.streak.length; a++) {
                    
                    streak_string += "<span class='emoji' style='text-shadow: 0 0 0 " + suspect_details[getSuspectByEmoji(suspect_details, streak_data.streak[a])].color + ", 0 0 0 " + suspect_details[getSuspectByEmoji(suspect_details, streak_data.streak[a])].color + "'>" + streak_data.streak[a] + "</span>";

                }
        
        
    
    console.log(streak_data.streak);
        
                if ((streak_data.streak.length == 0) || (streak_data.streak[0] == "")) streak_string = "It was easy, because right now, you've solved no murdles.";
                else if (streak_data.streak.length == 1) streak_string += "<p>Really, one isn't that many to really call it a conspiracy theory...</p>";
        
            return streak_string;
        
    }
    
}