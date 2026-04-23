
Array.prototype.random = function() {
    
    //console.log(this);
    
    return randomElement(this);
    
};

function randomElement(array) {
    
    var randomindex = Math.floor(Math.random()*array.length);
    var element = array[randomindex];

    return element;
    
}

const suspect_details = {
    
  "Lady Violet" : {
      color: "#A54CFF",
      emoji: "👸",
      letter: "V",
      type: "purple",
      biography: "The daughter of Lord Violet, and the heiress of the Violet Isles, the largest extrajudicial territory in the world.",
      possessive_pronoun: "her",
      object_pronoun: "her",
      subject_pronoun: "she",
      intro_phrase: function() {
        var intros = ["", "", "", "", "Don't believe the commoners:", "As a lady, I'll say this:", "You can trust a lady:", "Tisk, tisk, did you not see?"]
        return intros[Math.floor(Math.random() * intros.length)];
    },
      confession: function() {
          var outros = ["I can't believe a bloody commoner could best me like this!", "Bloody commoners! I hate you!"];
          return outros[randomIndex(outros)];
      },
      characteristics: {
          birthday: "08/28",
          hand: "right",
          print: "1.png",
          gender: "f",
          height: 60,
          hair: "blond",
          feature: "the heiress of the largest extrajudicial territory in the world",
          clergy: false,
          noble: true,
          business: false,
          army: false,
          eyes: "blue",
          sign: "virgo",
          element: "earth"
      },
      divinarray: ["have aristocratic tendencies", "have a sense of pride"],
    clues: [""]
  },
  "Signor Emerald" : {
      color: "#33CA7F",
      emoji: "🤵",
      type: "green",
      letter: "E",
      biography: "An Italian jeweler of great renown, Signor Emerald has traveled the world in search of rare gemstones, which are always falling out of his pockets.",
      possessive_pronoun: "his",
      object_pronoun: "him",
      subject_pronoun: "he",
      intro_phrase: function() {
        var intros = ["Ehi!", "If you want the truth,", "This is how it happened:", "", ""];
        return intros[Math.floor(Math.random() * intros.length)];
    },
      confession: function() {
          var outros = ["Vai al diavolo!", "I cannot believe you would do this to me!", "Cavolo! How could it come to this?!"];
          return outros[randomIndex(outros)];
      },
      characteristics: {
          birthday: "12/02",
          hand: "left",
          print: "2.png",
          feature: "a loose gemstone",
          gender: "m",
          height: 68,
          hair: "black",
          clergy: false,
          army: false,
          noble: false,
          business: true,
          eyes: "brown",
          sign: "sagittarius",
          element: "fire"
      },
      divinarray: ["have ambition", "have a lawless energy about you"],
    clues: ["a lone emerald"]
  },
  "Président Amaranth" : {
      color: "#B6244F",
      type: "red",
      emoji: "👨‍🦰",
      letter: "A",
      biography: "The literal French President, Amaranth loves spending time with his constituents, especially a certain 1% of them.",
      possessive_pronoun: "his",
      object_pronoun: "him",
      subject_pronoun: "he",
      intro_phrase: function() {
        var intros = ["", "As ze Président,", "In France, we would say,", "Not to be rude, but ", ""];
        return intros[Math.floor(Math.random() * intros.length)];
    },
      confession: function() {
          var outros = ["Ah, no American can arrest ze President!", "I am not going to be charged by this kangaroo court! I shall travel back to France!", "Your stupid American logic! I curse it!"];
          return outros[randomIndex(outros)];
      },
      characteristics: {
          birthday: "06/06",
          hand: "right",
          print: "3.png",
          gender: "m",
          height: 70,
          hair: "red",
          clergy: false,
          feature: "the literal French President",
          army: false,
          business: false,
          noble: false,
          feature: "",
          eyes: "grey",
          sign: "gemini",
          element: "air"
      },
      divinarray: ["are a good leader", "know how to use power"],
      clues: ["the French text of a speech"]
  },
  "Comrade Champagne" : {
      color: "#F4C97A", // "#ffcd85", //"#fad6a5",
      emoji: "🧔",
      type: "yellow",
      biography: "A communist and a rich one. Comrade Champagne likes nothing more than to travel the world, sharing the message of the Reds while sipping on the finest sparkling wines.",
      possessive_pronoun: "his",
      object_pronoun: "him",
      subject_pronoun: "he",
      intro_phrase: function() {
        var intros = ["As a man of the people, I say that", "Take it from me, a working man:", "Comrade,", "", ""];
        return intros[Math.floor(Math.random() * intros.length)];
    },
      confession: function() {
          var outros = ["I may go to jail, but the revolution will live on.", "Curse your capitalist interference!", "You bourgeoisie reactionaries! You'll never stop the revolution!", "Logico, you will be first against the wall when the revolution comes!"];
          return outros[randomIndex(outros)];
      },
      characteristics: {
          birthday: "01/04",
          hand: "left",
          print: "4.png",
          gender: "m",
          height: 71,
          hair: "blond",
          clergy: false,
          army: false,
          business: false,
          feature: "a rich communist",
          noble: false,
          feature: "",
          eyes: "hazel",
          sign: "capricorn",
          element: "earth"
      },
      divinarray: ["have a sense of fairness", "are an idealist"],
      clues: ["a drop of sparkling wine"]
  },
  "Sister Lapis" : {
      color: "#125E8A", //"#fad6a5",
      emoji: "👵",
      type: "blue",
      biography: "Incredibly pious, she travels the world, doing God's work, but on His dime, too. One of her habits is cashmere and the other is spending.",
      possessive_pronoun: "her",
      object_pronoun: "her",
      subject_pronoun: "she",
      intro_phrase: function() {
        var intros = ["My dear,", "In His name,", "My child,", "", ""];
        return intros[Math.floor(Math.random() * intros.length)];
    },
      confession: function() {
          var outros = ["Hail Mary!", "I despise you all!", "May God strike you down for what you've done to me!"];
          return outros[randomIndex(outros)];
      },
      characteristics: {
          birthday: "06/25",
          hand: "right",
          print: "5.png",
          gender: "f",
          height: 62,
          hair: "brown",
          clergy: true,
          army: false,
          business: false,
          noble: false,
          feature: "a cashmere habit",
          eyes: "brown",
          sign: "cancer",
          element: "water"
      },
      divinarray: ["have a sense of devotion", "have a quietness inside"],
      clues: ["a crumpled-up habit"]
  },
  "Sir Rulean" : {
      color: "#1dacd6", // "#00b4d8", #fad6a5",
      emoji: "👱‍♂️",
      type: "blue",
      biography: "A sophisticated gentleman who just happens to have been knighted, if you believe the Official Knighting Documents he is always waving around.",
      possessive_pronoun: "his",
      object_pronoun: "him",
      subject_pronoun: "he",
      subject_pronoun: "he",
      intro_phrase: function() {
        var intros = ["My good man, ", "Now listen here:", "If you ask me,", "", ""];
        return intros[Math.floor(Math.random() * intros.length)];
    },
      confession: function() {
          var outros = ["Damn you all for what you've done to me!", "I can't believe this would happen to me. I never hurt a fly my whole life."];
          return outros[randomIndex(outros)];
      },
      characteristics: {
          birthday: "08/03",
          hand: "right",
          print: "6.png",
          gender: "m",
          height: 68,
          clergy: false,
          noble: true,
          business: false,
          feature: "an Official Knighting Document",
          army: false,
          eyes: "blue",
          hair: "red",
          sign: "leo",
          element: "fire"
      },
      divinarray: ["have a sense of honor", "care deeply about how you are perceived"],
      clues: ["a set of “Official Knighting Documents”",]
  },
  "Chancellor Tuscany" : {
      color: "#CDA2AB",
      type: "pink",
      emoji: "👩‍🎓",
      biography: "Chancellor Tuscany is the head of Deduction College, revered for her intelligence, social charm, and the fear she strikes in the hearts of her enemies.",
      possessive_pronoun: "her",
      object_pronoun: "her",
      subject_pronoun: "she",
      intro_phrase: function() {
        var intros = ["As the holder of " + (Math.floor(Math.random() * 4) + 5) + " PhDs, let me just say:", "As an academic,"];
        return intros[Math.floor(Math.random() * intros.length)];
    },
      confession: function() {
          var outros = ["If you were in my class, I'd flunk you!", "I'd rate this day an F-.", "Deductive Logico, you would make a fine teacher. I'd offer you a job if I wasn't going to jail.", "Your logical deducations are A+, Deductive Logico."];
          return outros[randomIndex(outros)];
      },
      characteristics: {
          birthday: "10/16",
          hand: "left",
          print: "7.png",
          gender: "f",
          height: 65,
          hair: "grey",
          clergy: false,
          business: false,
          army: false,
          feature: "the head of Deduction College",
          noble: false,
          feature: "",
          eyes: "green",
          sign: "libra",
          element: "air"
      },
      divinarray: ["are intelligent", "are focused"],
      clues: ["ink from an expensive pen"]
  },
  "Father Mango" : {
      color: "#F08A4B",
      type: "orange",
      emoji: "👨‍🦲",
      biography: "Father Mango has taken a vow of poverty, but he drives a BMW. He's taken a vow of obedience, but he has a staff of 25. He's taken a vow of chastity, too, which is why he's on vacation.",
      possessive_pronoun: "his",
      object_pronoun: "him",
      subject_pronoun: "he",
      intro_phrase: function() {
        var intros = ["As a man of the cloth,", "In the name of God,", "", "", ""];
        return intros[Math.floor(Math.random() * intros.length)];
    },
      confession: function() {
          var outros = ["Curse you! You'll burn for this!", "How could you betray a man of God like this!", "Curse you all, in the name of God!", "Can I be honest about something, Logico? God is really mad at you about this."];
          return outros[randomIndex(outros)];
      },
      characteristics: {
          birthday: "04/20",
          hand: "left",
          print: "8.png",
          gender: "m",
          height: 70,
          hair: "no",
          clergy: true,
          business: false,
          army: false,
          noble: false,
          feature: "the driver of a BMW",
          eyes: "brown",
          sign: "taurus",
          element: "earth"
      },
      divinarray: ["care about goodness"],
    clues: ["a key to a BMW"]
  },
  "Admiral Navy" : {
      color: "#000080",
      type: "blue",
      emoji: "👨‍✈️",
      biography: "The firstborn son of an Admiral Navy who himself was the son of an Admiral Navy. He always smells faintly of the sea.",
      possessive_pronoun: "his",
      object_pronoun: "him",
      subject_pronoun: "he",
      intro_phrase: function() {
        var intros = ["", "", "", "", "My honor as a seaman:", "As a Navy man, I'll say it straight:", "Harrumph! ", "My God, man:"]
        return intros[Math.floor(Math.random() * intros.length)];
    },
      confession: function() {
          var outros = ["No civilian can judge me! Only the ocean.", "The only law I live by is the law of the sea!"];
          return outros[randomIndex(outros)];
      },
      characteristics: {
          birthday: "06/23",
          hand: "right",
          print: "9.png",
          gender: "m",
          height: 69,
          hair: "brown",
          clergy: false,
          business: false,
          army: true,
          noble: false,
          feature: "someone who smelled faintly of the sea",
          eyes: "blue",
          sign: "cancer",
          element: "water"
      },
      divinarray: ["can be boastful"],
      clues: ["the smell of cigar smoke", "the smell of saltwater", "cigar ash"]
  },
    "Dr. Crimson" : {
      color: "#ba181b", // ""#990001",
      type: "red",
      emoji: "👩‍⚕️",
      biography: ["She's the world's smartest doctor, according to her, and she's right. But just because you're smart doesn't mean you're not a murderer."].random(),
      possessive_pronoun: "her",
      object_pronoun: "her",
      subject_pronoun: "she",
      intro_phrase: function() {
        var intros = ["", "", "", "", "Only a doctor would have noticed this:", "As a doctor,", "If you want my medical opinion,", "It's quite obvious, isn't it?"];
        return intros[Math.floor(Math.random() * intros.length)];
    },
      confession: function() {
          var outros = ["Fools! You can't jail a doctor!", "You may have beaten me today but I'll find a way out of jail soon enough,", "I can't believe I was beaten by a poor fool like yourself!"];
          return outros[randomIndex(outros)];
      },
      characteristics: {
          birthday: "02/01",
          hand: "left",
          print: "10.png",
          gender: "f",
          height: 69,
          hair: "red",
          clergy: false,
          business: false,
          army: false,
          noble: false,
          feature: "supposedly the world’s smartest doctor",
          eyes: "green",
          sign: "aquarius",
          element: "air"
      },
      divinarray: ["are very intelligent"],
    clues: ["the smell of cigarette smoke"]
  },
    "Miss Saffron" : {
      color: "#f4c430",
      type: "yellow",
      emoji: "👱‍♀️",
      biography: "Gorgeous and stunning, but maybe not all there in the brains department. Or maybe that's what she wants you to think. Or maybe she wants you to think that's what she wants you to think. Only her pet poodle knows.",
      possessive_pronoun: "her",
      object_pronoun: "her",
      subject_pronoun: "she",
      intro_phrase: function() {
        var intros = ["", "", "", "Is this important? ", "I'm not sure if this means anything, but ", "This is so scary! ", "What do I know? Well,"];
        return intros[Math.floor(Math.random() * intros.length)];
    },
      confession: function() {
          var outros = ["Aw, rats! I was sure I'd get away with it,", "Welp, I guess I'm going to jail then,", "Aw, shucks. I thought I'd get away with it,"];
          return outros[randomIndex(outros)];
      },
      characteristics: {
          birthday: "10/13",
          hand: "left",
          print: "11.png",
          gender: "f",
          height: 62,
          hair: "blond",
          clergy: false,
          business: false,
          army: false,
          noble: false,
          feature: "a pet poodle",
          eyes: "hazel",
          sign: "libra",
          element: "air"
      },
      divinarray: ["are very sweet"],
    clues: ["a hair from a poodle"]
  },
    "Judge Pine" : {
      color: "#097a74",
      type: "green",
      emoji: "👩‍⚖️",
      biography: "Master of the courtroom and possessed of a firm belief in justice, as decided by her and her alone.",
      possessive_pronoun: "her",
      object_pronoun: "her",
      subject_pronoun: "she",
      intro_phrase: function() {
        var intros = ["", "", "", "", "The facts are clear:", "Judicially,", "A judge would never lie:", "Heh,", "All I know is"];
        return intros[Math.floor(Math.random() * intros.length)];
    },
      confession: function() {
          var outros = ["This is not justice! Only I decide what is justice!", "No court will convict a judge, even if I'm guilty!", "I'll use my connections to get out of this one."];
          return outros[randomIndex(outros)];
      },
      characteristics: {
          birthday: "04/24",
          hand: "right",
          print: "12.png",
          gender: "f",
          height: 66,
          hair: "black",
          clergy: false,
          business: false,
          army: false,
          noble: false,
          feature: "someone with a firm belief in their own brand of justice",
          eyes: "brown",
          sign: "taurus",
          element: "earth"
      },
      divinarray: ["stand resolute"],
    clues: []
  },
    "The Amazing Aureolin" : {
      color: "#F2DB00", // "#FDEE00", // "#f5b0cb",
      type: "yellow",
      emoji: "🦹‍♂️",
      biography: "The Amazing Aureolin is a touring magician who has perfected the whole sawing-the-husband-in-two routine. Then, she made the body disappear. For her next trick, she's going to need a volunteer.",
      possessive_pronoun: "her",
      object_pronoun: "her",
      subject_pronoun: "she",
      intro_phrase: function() {
        var intros = ["", "", "", "", "A magician lives by a code:", "Magician's honor:"];
        return intros[Math.floor(Math.random() * intros.length)];
    },
      confession: function() {
          var outros = ["You have broken the Magician's Code and exposed my secrets!", "No cell can hold me!"];
          return outros[randomIndex(outros)];
      },
      characteristics: {
          birthday: "04/18",
          hand: "left",
          print: "13.png",
          gender: "l",
          height: 66,
          hair: "blond",
          clergy: false,
          business: false,
          army: false,
          noble: false,
          feature: "a touring magician",
          eyes: "green",
          sign: "aries",
          element: "fire"
      },
      divinarray: ["have the ability to be a showman"],
    clues: []
  },
    "Earl Grey" : {
      color: "#8f8f8f", // "#f5b0cb",
      emoji: "👨‍🦳", // "🫖", //👨‍🦳",
      type: "grey",
      biography: "He comes from a long line of Earl Greys. Yes, those Earl Greys. No, he doesn't sign autographs. But he always does have some bags with him.",
      possessive_pronoun: "his",
      object_pronoun: "him",
      subject_pronoun: "he",
      intro_phrase: function() {
        var intros = ["", "", "", "", "Take my word as the honorable Earl of Grey,", "If you must,", "I begrudge these proceedings. But if you must,"];
        return intros[Math.floor(Math.random() * intros.length)];
    },
      confession: function() {
          var outros = ["I curse you with the heat of a thousand kettles", "You can't stop my tea empire! I'll have you boiled in a bag!"];
          return outros[randomIndex(outros)];
      },
      characteristics: {
          birthday: "01/15",
          hand: "right",
          print: "14.png",
          gender: "m",
          height: 69,
          hair: "white",
          clergy: false,
          business: false,
          army: false,
          noble: true,
          feature: "a man with a tea bag in his pocket",
          eyes: "brown",
          sign: "capricorn",
          element: "earth"
      },
      divinarray: ["have a strong sense of self-respect"],
    clues: []
  },
    "Grandmaster Rose" : {
      color: "#ff66cc", // "#f5b0cb",
      emoji: "🧓",
      type: "pink",
      biography: "A chess grandmaster who is always plotting his next move. Like how to bump off his next opponent!",
      possessive_pronoun: "his",
      object_pronoun: "him",
      subject_pronoun: "he",
      intro_phrase: function() {
        var intros = ["", "", "", "Don't neglect your theory:", "It is a simple matter of calculation:", "You must study the moves of the pieces. For example, did you know that"];
        return intros[Math.floor(Math.random() * intros.length)];
    },
      confession: function() {
          var outros = ["You think you've mated me? We're only in the middlegame!", "You think this is over? We're still in the openings!"];
          return outros[randomIndex(outros)];
      },
      characteristics: {
          birthday: "11/17",
          hand: "left",
          print: "15.png",
          gender: "m",
          height: 67,
          hair: "brown",
          clergy: false,
          government: true,
          army: false,
          noble: false,
          feature: "a chess grandmaster",
          eyes: "brown",
          sign: "scorpio",
          element: "water"
      },
      divinarray: ["are able to outwit others"],
    clues: []
  },
    "General Coffee" : {
      color: "#322214",
      emoji: "👴",
      type: "brown",
      biography: "An espresso connoisseur, he always drinks his morning brew before sending his men across the battlefield to die. Was it for honor? Was it for glory? Was it for riches? Or was it for the love of the bean?",
      possessive_pronoun: "his",
      object_pronoun: "him",
      subject_pronoun: "he",
      intro_phrase: function() {
        var intros = ["", "", "", "Argh...", "Hmm...", "Ugh...", "Like a fine roast,"];
        return intros[Math.floor(Math.random() * intros.length)];
    },
      confession: function() {
          var outros = ["As a soldier, I'll do my duty, but when I get out, Deductive Logico, I'm coming for you...", "A good soldier admits when he's defeated,", "I hope that they have good coffee where I'm going..."];
          return outros[randomIndex(outros)];
      },
      characteristics: {
          birthday: "11/24",
          hand: "right",
          print: "16.png",
          gender: "m",
          height: 72,
          hair: "no",
          clergy: false,
          army: true,
          noble: false,
          business: false,
          feature: "an espresso connoisseur",
          eyes: "brown",
          sign: "sagittarius",
          element: "fire"
      },
      divinarray: ["know what you love"],
    clues: ["the smell of coffee", "a coffee stain"]
  },
    "Lord Lavender" : {
      color: "#967bb6",
      type: "purple",
      emoji: "👨‍🦱",
      biography:   `A politically-conservative MP in the House of Lords, as well as the musical theater composer behind such hits as <em>${["Dogs", "Jonah and the Unbelievable Sparkling Fish"].random()}</em> and <em>${["Mr. Moses Megastar", "The Spectre of the Improv", "Moonlight Local"].random()}</em>.`,
      possessive_pronoun: "his",
      object_pronoun: "him",
      subject_pronoun: "he",
      intro_phrase: function() {
        var intros = ["", "", "", "", ""];
        return intros[Math.floor(Math.random() * intros.length)];
    },
      confession: function() {
          var outros = ["You can't jail a Lord! It's against the law!", "I'm an aristocrat! You can't jail me! No! Get your hands off me!"];
          return outros[randomIndex(outros)];
      },
      characteristics: {
          birthday: "09/18",
          hand: "right",
          print: "17.png",
          gender: "m",
          height: 69,
          hair: "grey",
          clergy: false,
          business: false,
          army: false,
          noble: true,
          feature: "a musical theater composer",
          eyes: "green",
          sign: "virgo",
          element: "earth"
      },
      divinarray: ["can be a little pompous"],
    clues: []
  },
    "Baron Maroon" : {
      color: "#AF3B6E",
      type: "red",
      emoji: "🤴",
      biography: "An incredibly haughty man who holds a grudge. Nobody wants to offend the baron. At least, nobody who's still alive...",
      possessive_pronoun: "his",
      object_pronoun: "him",
      subject_pronoun: "he",
      intro_phrase: function() {
        var intros = ["", "", "", "", "As a baron,","Bah! Here's the truth:", "Listen to me:"];
        return intros[Math.floor(Math.random() * intros.length)];
    },
      confession: function() {
          var outros = ["You cannot do this to a baron! I will have my revenge!", "Ah! You have made a fatal mistake, dear Logico. You have offended a baron. Few have done that and lived for long."];
          return outros[randomIndex(outros)];
      },
      characteristics: {
          birthday: "11/19",
          hand: "right",
          print: "18.png",
          gender: "m",
          height: 74,
          hair: "red",
          clergy: false,
          business: false,
          army: false,
          noble: true,
          feature: "an incredibly haughty man",
          eyes: "hazel",
          sign: "scorpio",
          element: "water"
      },
      divinarray: ["are holding a grudge"],
    clues: []
  },
    "The Duchess of Vermillion" : {
      color: "#E34234",
      type: "red",
      emoji: "👩‍🦳",
      biography: "The Duchess is an tall old woman with tall old secrets. If she is the murderer, then it certainly wouldn't be the first time.",
      possessive_pronoun: "her",
      object_pronoun: "her",
      subject_pronoun: "she",
      intro_phrase: function() {
        var intros = ["", "", "", "", "Speaking as a duchess,","Do you want to know what I think?", "If you ask me,"];
        return intros[Math.floor(Math.random() * intros.length)];
    },
      confession: function() {
          var outros = ["You think you'll get away with this, don't you?", "I have gotten out of worse situations than this one."];
          return outros[randomIndex(outros)];
      },
      characteristics: {
          birthday: "03/04",
          hand: "left",
          print: "19.png",
          gender: "f",
          height: 69,
          hair: "white",
          clergy: false,
          business: false,
          army: false,
          noble: true,
          feature: "a tall old woman with tall old secrets",
          eyes: "grey",
          sign: "pisces",
          element: "water"
      },
      divinarray: ["have a long memory"],
    clues: []
  },
    "Viscount Eminence" : {
      color: "#6C3082",
      type: "purple",
      emoji: "🧛‍♂️",
      biography: "The oldest man you have ever seen. It's said that he outlived all of his sons and he was born before his father.",
      possessive_pronoun: "his",
      object_pronoun: "him",
      subject_pronoun: "he",
      intro_phrase: function() {
        var intros = ["", "", "", "", "I, the Viscount, believe that", "Hmm...", "Yes, Well,"];
        return intros[Math.floor(Math.random() * intros.length)];
    },
      confession: function() {
          var outros = ["You think you'll get away with this, don't you?"];
          return outros[randomIndex(outros)];
      },
      characteristics: {
          birthday: "03/12",
          hand: "left",
          print: "20.png",
          gender: "m",
          height: 62,
          hair: "brown",
          clergy: false,
          business: false,
          army: false,
          noble: true,
          feature: "the oldest man you have ever seen",
          eyes: "grey",
          sign: "pisces",
          element: "water"
      },
      divinarray: ["are holding onto things"],
    clues: []
  },
    "Coach Raspberry" : {
      color: "#e30b5d",
      type: "red",
      emoji: "🤠",
      biography: "One of the best coaches this side of the Mississippi, regardless of which side you happen to be on. Some people say he has a gambling problem, but he just says he loves danger.",
      possessive_pronoun: "his",
      object_pronoun: "him",
      subject_pronoun: "he",
      intro_phrase: function() {
        var intros = ["", "", "", "", "Well, by golly,", "Now if I had to say,", "Well, I ain't 100%, but I'd say that"];
        return intros[Math.floor(Math.random() * intros.length)];
    },
      confession: function() {
          var outros = ["Well, dang, ya got me!", "Next time I shoulda been more prepared,"];
          return outros[randomIndex(outros)];
      },
      characteristics: {
          birthday: "05/12",
          hand: "left",
          print: "21.png",
          gender: "f",
          height: 72,
          hair: "blond",
          clergy: false,
          business: false,
          army: false,
          noble: true,
          feature: "a brilliant coach with a gambling problem",
          eyes: "blue",
          sign: "aries",
          element: "fire"
      },
      divinarray: ["are open to taking risks"],
    clues: []
  },
    "Secretary Celadon" : {
      color: "#ace1af",
      type: "green",
      emoji: "👩‍🦱",
      biography: "The Secretary of Defense, and someone who is personally responsible for a number of war crimes, some of which are now named after her.",
      possessive_pronoun: "her",
      object_pronoun: "her",
      subject_pronoun: "she",
      intro_phrase: function() {
        var intros = ["", "", "", "", "Don't mistake me:", "Listen to my words:", ""];
        return intros[Math.floor(Math.random() * intros.length)];
    },
      confession: function() {
          var outros = ["I should have learned my lesson from Iraq..."];
          return outros[randomIndex(outros)];
      },
      characteristics: {
          birthday: "08/06",
          hand: "left",
          print: "22.png",
          gender: "f",
          height: 66,
          hair: "brown",
          clergy: false,
          business: false,
          army: false,
          government: true,
          noble: false,
          feature: "the Secretary of Defense",
          eyes: "green",
          sign: "leo",
          element: "fire"
      },
      divinarray: ["know when you are right"],
    clues: []
  },
    "Captain Slate" : {
      color: "#708090",
      type: "grey",
      emoji: "👩‍🚀",
      biography: "A real-life astronaut. The first woman to travel around the dark side of the moon and also the first to be suspected of murdering her co-pilot.",
      possessive_pronoun: "her",
      object_pronoun: "her",
      subject_pronoun: "she",
      intro_phrase: function() {
        var intros = ["", "", "", "", "It's as clear as the moon:", "What do you want me to say? "];
        return intros[Math.floor(Math.random() * intros.length)];
    },
      confession: function() {
          var outros = ["I should have stayed in space...", "It's a lot harder to get away with it on Earth..."];
          return outros[randomIndex(outros)];
      },
      characteristics: {
          birthday: "02/07",
          hand: "left",
          print: "23.png",
          gender: "f",
          height: 65,
          hair: "brown",
          clergy: false,
          business: false,
          government: false,
          army: false,
          noble: false,
          feature: "a real-life astronaut",
          eyes: "brown",
          sign: "aquarius",
          element: "air"
      },
      divinarray: ["can be a little spacey"],
    clues: []
  },
    "Mayor Honey" : {
      color: "#F6AE2D", // #fff44f
      type: "yellow",
      emoji: "👨‍💼",
      biography: "He knows where the bodies are buried, and he makes sure they always vote for him.",
      possessive_pronoun: "his",
      object_pronoun: "him",
      subject_pronoun: "he",
      intro_phrase: function() {
        var intros = ["", "", "As a small-town mayor,", "As the mayor, I think"];
        return intros[Math.floor(Math.random() * intros.length)];
    },
      confession: function() {
          var outros = ["The people will hear about this! They'll hear!"];
          return outros[randomIndex(outros)];
      },
      characteristics: {
          birthday: "10/30",
          hand: "left",
          print: "24.png",
          gender: "m",
          height: 72,
          hair: "brown",
          clergy: false,
          business: false,
          government: true,
          army: false,
          noble: false,
          feature: "the man who knows where the bodies are buried",
          eyes: "hazel",
          sign: "scorpio",
          element: "water"
      },
      divinarray: ["might rile people up sometimes"],
    clues: []
  },
    "Bishop Azure" : {
      color: "#007fff",
      type: "blue",
      emoji: "♝", // 🧙 🧙‍♀️
      biography: "A bishop in the Church, Azure has been known to pray for both her friends and her enemies. Of course, she asks for different things...",
      possessive_pronoun: "her",
      object_pronoun: "her",
      subject_pronoun: "she",
      intro_phrase: function() {
        var intros = ["", "", "By the Word of God,", "In the Name of God,"];
        return intros[Math.floor(Math.random() * intros.length)];
    },
      confession: function() {
          var outros = ["You'll be damned for this, Logico!"];
          return outros[randomIndex(outros)];
      },
      characteristics: {
          birthday: "06/02",
          hand: "right",
          print: "25.png",
          gender: "f",
          height: 64,
          hair: "brown",
          clergy: true,
          business: false,
          government: false,
          army: false,
          noble: false,
          feature: "someone who prays for their enemies",
          eyes: "brown",
          sign: "gemini",
          element: "air"
      },
      divinarray: ["have a strong sense of right and wrong"],
    clues: []
  },
    "Deacon Verdigris" : {
      color: "#48a9a6",
      type: "green",
      emoji: "👩‍💼",
      biography: "A deacon in the Church. She handles the parishoner's donations and, sometimes, their secrets.",
      possessive_pronoun: "her",
      object_pronoun: "her",
      subject_pronoun: "she",
      intro_phrase: function() {
        var intros = ["", "", "As a Godly woman,", "As a woman of God,"];
        return intros[Math.floor(Math.random() * intros.length)];
    },
      confession: function() {
          var outros = ["God will hear about this!"];
          return outros[randomIndex(outros)];
      },
      characteristics: {
          birthday: "08/07",
          hand: "left",
          print: "26.png",
          gender: "f",
          height: 63,
          hair: "grey",
          clergy: false,
          business: false,
          government: false,
          army: false,
          noble: false,
          feature: "a Church deacon",
          eyes: "blue",
          sign: "leo",
          element: "fire"
      },
      divinarray: ["can keep a secret"],
    clues: []
  },
    "Vice President Mauve" : {
      color: "#e0b0ff",
      type: "pink",
      emoji: "👩‍💻",
      biography: `Vice President of TekCo Futures. If she asks you to step into her metaverse, ${["be wary", "scream", "refuse", "run away"].random()}.`,
      possessive_pronoun: "her",
      object_pronoun: "her",
      subject_pronoun: "she",
      intro_phrase: function() {
        var intros = ["", "", "As a VP,"];
        return intros[Math.floor(Math.random() * intros.length)];
    },
      confession: function() {
          var outros = ["You'll be hearing from my lawyers, my employees, and my investors!", "Wait until the CEO hears about this. You're going to be in big trouble then."];
          return outros[randomIndex(outros)];
      },
      characteristics: {
          birthday: "05/11",
          hand: "right",
          print: "27.png",
          gender: "f",
          height: 68,
          hair: "black",
          clergy: false,
          business: true,
          government: false,
          army: false,
          noble: false,
          feature: "a huge proponent of the metaverse",
          eyes: "brown",
          sign: "taurus",
          element: "earth"
      },
      divinarray: ["are on the cutting edge"],
    clues: []
  },
    "Dean Glaucous" : {
      color: "#6082b6",
      type: "blue",
      emoji: "👨‍🎓",
      biography: "The dean of some such-and-such department at Deduction College. What does he do? Well, he handles the money, for one...",
      possessive_pronoun: "his",
      object_pronoun: "him",
      subject_pronoun: "he",
      intro_phrase: function() {
        var intros = ["", "", "", ""];
        return intros[Math.floor(Math.random() * intros.length)];
    },
      confession: function() {
          var outros = ["You'll never get away with this!"];
          return outros[randomIndex(outros)];
      },
      characteristics: {
          birthday: "09/19",
          hand: "right",
          print: "28.png",
          gender: "m",
          height: 66,
          hair: "brown",
          clergy: false,
          business: false,
          government: false,
          education: true,
          army: false,
          noble: false,
          feature: "the person who handles the money at Deduction College",
          eyes: "brown",
          sign: "virgo",
          element: "earth"
      },
      divinarray: ["like to be in charge"],
    clues: []
  },
    "Officer Copper" : {
      color: "#B87333",
      type: "brown",
      emoji: "👮‍♀️",
      biography: "The best part of being a policewoman criminal is that you can fail to investigate your own crimes and cut out the middleman.",
      possessive_pronoun: "their",
      object_pronoun: "them",
      subject_pronoun: "they",
      intro_phrase: function() {
        var intros = ["", "", "Some advice from a cop:", "Here is a fact:"];
        return intros[Math.floor(Math.random() * intros.length)];
    },
      confession: function() {
          var outros = ["I'm a member of the police! I'm immune to the law!", "I'm a police officer! I am above the law!"];
          return outros[randomIndex(outros)];
      },
      characteristics: {
          birthday: "04/17",
          hand: "right",
          print: "29.png",
          gender: "f",
          height: 65,
          hair: "blond",
          clergy: false,
          business: false,
          government: true,
          education: false,
          army: false,
          noble: false,
          feature: "a criminal officer",
          eyes: "blue",
          sign: "aries",
          element: "fire"
      },
      divinarray: ["want things to go your way"],
    clues: []
  },
    "Mx. Tangerine" : {
      color: "#f28500",
      type: "orange",
      emoji: "🧑",
      biography: "Proving that non-binary people can be murderers, too, Mx. Tangerine is an artist, poet, and potential suspect.",
      possessive_pronoun: "their",
      object_pronoun: "them",
      subject_pronoun: "they",
      intro_phrase: function() {
        var intros = ["", "", "If I had to say something,", "Well, if you ask me,"];
        return intros[Math.floor(Math.random() * intros.length)];
    },
      confession: function() {
          var outros = ["This is outrageous! Intolerable! Insidious!"];
          return outros[randomIndex(outros)];
      },
      characteristics: {
          birthday: "02/27",
          hand: "left",
          print: "30.png",
          gender: "x",
          height: 65,
          hair: "blond",
          clergy: false,
          business: false,
          government: false,
          education: false,
          army: false,
          noble: false,
          feature: "an artist and a poet",
          eyes: "hazel",
          sign: "pisces",
          element: "water"
      },
      divinarray: ["like to have it both ways"],
    clues: []
  },
    "Principal Applegreen" : {
      color: "#66b447", // "#daa520",
      type: "green",
      emoji: "👨‍🏫",
      biography: "A strict principal about everything except getting away with murder. His hands are always covered in chalk.",
      possessive_pronoun: "his",
      object_pronoun: "him",
      subject_pronoun: "he",
      intro_phrase: function() {
        var intros = ["", "", "", "Like I tell my students,"];
        return intros[Math.floor(Math.random() * intros.length)];
    },
      confession: function() {
          var outros = ["I'd grade this whole investigation an F+!"];
          return outros[randomIndex(outros)];
      },
      characteristics: {
          birthday: "10/09",
          hand: "right",
          print: "31.png",
          gender: "m",
          height: 71,
          hair: "no",
          clergy: false,
          business: false,
          government: false,
          education: true,
          army: false,
          noble: false,
          feature: "a chalk mark",
          eyes: "blue",
          sign: "libra",
          element: "air"
      },
      divinarray: ["are good at teaching others"],
    clues: []
  },
    "Chef Aubergine" : {
      color: "#693b58", // "#daa520",
      type: "purple",
      emoji: "👩‍🍳",
      biography: "It is said that she once killed her husband, cooked him, and then served him at her restaurant. It's not true, but even the fact that it's said about her tells you something. Faintly smells of onions (and, surprisingly, in a good way).",
      possessive_pronoun: "her",
      object_pronoun: "her",
      subject_pronoun: "she",
      intro_phrase: function() {
        var intros = ["", "", "", "I am a humble chef, all I know is this:"];
        return intros[Math.floor(Math.random() * intros.length)];
    },
      confession: function() {
          var outros = ["I should have cooked you, Deductive Logico!"];
          return outros[randomIndex(outros)];
      },
      characteristics: {
          birthday: "10/15",
          hand: "right",
          print: "32.png",
          gender: "f",
          height: 62,
          hair: "blond",
          clergy: false,
          business: true,
          government: false,
          education: false,
          army: false,
          noble: false,
          feature: "the faint smell of onions",
          eyes: "blue",
          sign: "libra",
          element: "air"
      },
      divinarray: ["are creative but practical"],
    clues: []
  },
    "Babyface Blue" : {
      color: "#016FB9", // "#daa520",
      type: "blue",
      emoji: "👶",
      biography: "This is absolutely one fully grown man, and not 2 kids in a trench-coat. They can do adult things like see R rated movies, buy beer, and stay out way past bedtime. <em>(Submitted by Kaela.)</em>",
      possessive_pronoun: "their",
      object_pronoun: "them",
      subject_pronoun: "they",
      intro_phrase: function() {
        var intros = ["", "", "If you ask us -- I mean me -- ", "We, I mean I, know this:"];
        return intros[Math.floor(Math.random() * intros.length)];
    },
      confession: function() {
          var outros = ["We'll get you, Logico!", "Wait until our mom hears about this!"];
          return outros[randomIndex(outros)];
      },
      characteristics: {
          birthday: "05/31",
          hand: "right",
          print: "33.png",
          gender: "m",
          height: 92,
          hair: "blond",
          clergy: false,
          business: false,
          government: false,
          education: false,
          army: false,
          noble: false,
          feature: "the belt from a trench coat",
          eyes: "blue",
          sign: "gemini",
          element: "air"
      },
      divinarray: ["can develop creative solutions to difficult problems"],
    clues: []
  },
    
"Dame Obsidian": {
    "color":"#000000",
    "emoji":"👩🏻",
    "type":"black",
    "biography": `A mystery writer whose books (such as the best-selling <em>${["Murder on the Occidental Local", "A Very Proper Murder", "The Perplexing Problem of the Parrot", "Knock Knock... Who’s There? Murder!", "How I Murdered My Husband: an iDunnit"].random()}</em>) have sold more copies than the Bible and Shakespeare combined.`,
    "possessive_pronoun":"her",
    "object_pronoun":"her",
    "subject_pronoun":"she",
    "intro_phrase":function() {
        return ['A thought:', 'It was like something from one of my books:'].random();
    },
    "confession":function() {
        return ['Fine! You solved it! You figured out whodunit! Are you happy? Now, can I get back to writing?', "This will make a great plot for a future book.", "I had to do it, because I wanted to do it, and I have to do what I want."].random();
    },
    "characteristics":{
        birthday: "08/16",
        "hand":"left",
        "print":"34.png",
        "gender":"F",
        "height":"64",
        "hair":"black",
        "clergy":false,
        "army":false,
        "business":false,
        "noble":false,
        "feature": "a best-selling mystery novel",
        "eyes":"green",
        "sign":"leo",
        "element":"water"},
    "divinarray":["being a new addition"],
    "clues":["a thousand-dollar autograph"]},
    
    "Uncle Midnight":
    {
    "color":"#000000",
     "emoji":"🕺","type":"black",
        "biography":"When his dad died, he bought a desert mansion with a pool and retired. He was 17.",
        "possessive_pronoun":"his",
        "object_pronoun":"him",
        "subject_pronoun":"he",
        "intro_phrase":function() {
            return 'Hey now,';
        },
        "confession":function() {
            return '"Look, kids, I just got carried away...';
        },
        "characteristics": {
            birthday: "12/09",
            "hand":"left",
            "print":"35.png",
            "gender":"m",
            "height":"68",
            "hair":"brown",
            "clergy":true,
            "army":false,
            "business":false,
            "noble":false,
            "feature":"the owner of a desert mansion",
            "eyes":"blue",
            "sign":"sagittarius",
            "element":"water"
        },
        "divinarray":["being a new addition"],
        "clues":[""]},
    
    "Brother Brownstone":{"color":"#834333","emoji":"👨‍🦲","type":"brown","biography":"A monk who has dedicated his life to the church, specifically to making money for it.","possessive_pronoun":"his","object_pronoun":"him","subject_pronoun":"he","intro_phrase":function() {return 'In the name of God,';},"confession":function() {return "I confess! And therefore, I am forgiven.";},"characteristics":{"birthday" : "12/24", "hand":"left","print":"36.png","gender":"m","height":"64","hair":"brown","clergy":true,"army":false,"business":false,"noble":false,"feature":"a dedicated monk","eyes":"brown","sign":"Capricorn","element":"water"},"divinarray":["being a new addition"],"clues":[""]},
    
    
    
    "Silverton the Legend":
        {"color":"#c0c0c0",
         "emoji":"👑",// 👨‍🦱", //👑",
         "type":"black",
         "biography":"An acclaimed actor of the Golden Age, now in his golden years.",
         "possessive_pronoun":"his",
         "object_pronoun":"him",
         "subject_pronoun":"he",
         "intro_phrase":function() {
             return ['Let me tell you how it is:', 'This is how it happened:'].random();},
         "confession":function() {
             return 'Do you even know who I am? Who I was?';},
         "characteristics":{
             "hand":"right",
             "birthday": "07/29",
             "print":"37.png",
             "gender":"m",
             "height":"76",
             "hair":"silver",
             "clergy":true,
             "army":false,
             "business":false,
             "noble":false,
             "feature":"an acclaimed actor of the Golden Age",
             "eyes":"blue",
             "sign":"leo",
             "element":"water"},
         "divinarray":["leaving a legacy", "not being forgotten"],
         "clues":[""]},
    
    "Major Red":{"color":"#ff003f","emoji":"🪖","type":"red","biography":"The revolutionary leader who freed Drakonia from the grasp of the aristocracy before taking it into his.","possessive_pronoun":"his","object_pronoun":"him","subject_pronoun":"he","intro_phrase":function() {return 'By the revolution,';},"confession":function() {return 'I am not guilty: society is!';},"characteristics":{"hand":"left","print":"40.png", "birthday": "03/28", "gender":"M","height":"74","hair":"brown","clergy":false,"army":true,"business":false,"noble":false,"feature":"the leader of the Drakonian Revolution","eyes":"brown","sign":"aries","element":"fire"},"divinarray":["making a break with the past"],"clues":[""]},
    
    "Mrs. Ruby":{"color":"#E0115F","emoji":"🤵🏻‍♀️","type":"red","biography":"An international jewel thief, playgirl, and all-around charmer. She knows how to party... and kill! (But has she settled down?)","possessive_pronoun":"her","object_pronoun":"her","subject_pronoun":"she","intro_phrase":function() {return 'Well well well,';},"confession":function() {return 'I don\'t mind going to jail. It\'s a challenge to escape.';},"characteristics":{"hand":"right", "birthday": "09/28", "print":"38.png","gender":"F","height":"66","hair":"red","clergy":false,"army":false,"business":false,"noble":false,"feature":"","eyes":"green","sign":"libra","element":"water"},"divinarray":["taking something you desire"],"clues":[""]},
    
    "Agent Fuchsia":{"color":"#FF00FF","emoji":"🕵","type":"red","biography":"She's technically a triple-0 agent, which means she has a license to kill and a license to commit tax fraud.","possessive_pronoun":"her","object_pronoun":"her","subject_pronoun":"she","intro_phrase":function() {return 'Officially,';},"confession":function() {return 'Don\'t worry. I have a license to kill!';},"characteristics": {"hand":"left", "birthday": "09/10","print":"39.png","gender":"F","height":"68","hair":"brown","clergy":false,"army":false,"business":false,"noble":false,"feature":"","eyes":"brown","sign":"virgo","element":"water"},"divinarray":["learning a new skill"],"clues":[""]},
    
    
    
};