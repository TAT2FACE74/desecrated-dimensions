/* ============================================================
   Lyrics data + automatic censor filter
   ------------------------------------------------------------
   Anything matching CENSOR_WORDS is automatically replaced
   with **** when rendered, so nothing explicit is displayed.
   ============================================================ */

const CENSOR_WORDS = [
  "fuck", "fucking", "fucked", "fucker", "motherfucker",
  "shit", "bullshit", "bitch", "bastard", "cunt", "cock", "dick",
  "pussy", "whore", "whores", "slut", "ass", "asshole", "damn", "goddamn",
  "piss", "nigga", "nigger", "faggot", "fag", "retard", "rape",
  "raped", "rapist", "pedo", "pedos", "pedophile", "pedophiles",
  "molest", "molester", "perv", "pervert",
];

/* Longest-first so "motherfucker" is matched before "fuck". */
const CENSOR_RE = new RegExp(
  "\\b(" +
    CENSOR_WORDS.slice()
      .sort((a, b) => b.length - a.length)
      .map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .join("|") +
    ")\\b",
  "gi"
);

function censor(text) {
  return String(text || "").replace(CENSOR_RE, "****");
}

/* Keys must match the track titles in script.js exactly. */
const LYRICS = {
  "Curb Stomp Your Local Pedo": `[Intro]
In the shadows they prey... on the innocent flesh...
Tonight the streets run red... with their twisted blood!

[Verse 1]
Lurking in the dark, eyes full of sick desire
Touching what's forbidden, feeding on the fire
Kids in your sights, you fucking parasite
Your time has come, no mercy in the night
We hunt you down, no place left to hide
Your face hits the curb, skull meets the ride
Teeth shatter like glass, bones crack and splinter
Justice served raw – no courtroom, no winter

[Chorus]
CURB STOMP! CURB STOMP YOUR LOCAL PEDOPHILE!
Smash that fucking face till the sidewalk's defiled!
CURB STOMP! CURB STOMP! MAKE THE BASTARD DIE!
Grind his sick brain under boot – watch the pervert fry!
Blood and teeth spray, curb kissing his lips
Pedo scum erased in a rain of kicks
No more twisted games, no more stolen youth
Only mangled meat and the taste of truth!

[Verse 2]
Register? Fuck that – we don't need a list
We smell your rot, your soul is a cyst
Little ones scarred by your filthy hands
Now your head explodes beneath combat boots and wrath
Heel drops heavy, curb cracks the dome
Brain matter paints the street, you're never going home
Screams turn to gurgles, then silence falls
Vigilante hammer – answering the calls

[Chorus]
CURB STOMP! CURB STOMP YOUR LOCAL PEDOPHILE!
Smash that fucking face till the sidewalk's defiled!
CURB STOMP! CURB STOMP! MAKE THE BASTARD DIE!
Grind his sick brain under boot – watch the pervert fry!

[Bridge]
This is the law of the streets...
No forgiveness... no reprieve...
For every child you broke...
Your skull meets concrete...
STOMP! STOMP! STOMP!
Until the pedo's gone!

[Final Chorus]
CURB STOMP! CURB STOMP YOUR LOCAL PEDOPHILE!
Eradicate the plague with relentless style!
CURB STOMP! CURB STOMP! LET THE WHOLE WORLD SEE!
Pedophiles crushed – pure extremity!

[Outro]
Your local pedophile...
Curb stomped...
Dead...
DEAD!`,

  "Vivisection": `[Intro]
Scalpel shines... patient screams...
No anesthesia... welcome to my dream...

[Verse 1]
Strapped to the table, eyes wide with fear
I wear the mask, no god interferes
Cut the first line, watch the red river flow
Heart still beating — I work nice and slow
Peel back the skin like wrapping paper
Organs glisten, lungs pumping vapor
Probe the liver, twist the spleen
Write my name in blood on the machine

[Chorus]
VIVISECTION! VIVISECTION!
LIVE DISSECTION FOR MY COLLECTION!
VIVISECTION! VIVISECTION!
SCREAM FOR ME — MY PERFECT OBSESSION!

[Verse 2]
Kidney removed while you're still awake
Taste your own flesh, make no mistake
Ribcage cracked open like a book
I read your secrets while you fucking choke
No mercy, no drugs, just the blade and me
This is science, this is poetry
One by one they vanish from the street
My basement floor stays sticky and sweet

[Chorus]
VIVISECTION! VIVISECTION!
LIVE DISSECTION FOR MY COLLECTION!
VIVISECTION! VIVISECTION!
SCREAM FOR ME — MY PERFECT OBSESSION!

[Bridge]
They call me monster…
I call it art…
Every heartbeat a new start…
Hold still.

[Breakdown]
OPEN WIDE!
PEEL THE HIDE!
DIG INSIDE!
NOW YOU DIE!
GUTS ON THE FLOOR!
BRAINS ON THE WALL!
I OWN YOUR PAIN!
I OWN IT ALL!

[Final Chorus]
VIVISECTION! VIVISECTION!
YOUR BODY IS MY FUCKING CANVAS!
VIVISECTION! VIVISECTION!
NEXT PATIENT — WHO WANTS TO BE FAMOUS?!

[Outro]
One more cut…
One more scream…
The collection grows…
Eternally.`,

  "Global Hate": `[Intro]
Civilization... rotting...
Humanity... fucking worthless...

[Verse 1]
Woke up today, same shit parade
Lies on the TV, scum in the street
Fake smiles, fake gods, fake everything
Billions of maggots begging to be erased
Politicians, preachers, influencers, whores
Every last one of them rots at the core
Social media cancer, corporate disease
I clench my fists till they fucking bleed

[Chorus]
HATE! HATE! GLOBAL FUCKING HATE!
BURN IT ALL! END THIS FUCKING STATE!
HATE! HATE! EVERYTHING MUST DIE!
LET THE WORLD ROT — WATCH IT FRY!

[Verse 2]
Families fake it, friends all betray
Lovers just leeches sucking life away
Jobs are cages, cities are graves
Every breath I take just fuels the rage
Kids on their phones, braindead and blind
Old fucks in power, corrupt and unkind
Nature's dying, oceans full of waste
I scream in silence: accelerate the end of days!

[Chorus]
HATE! HATE! GLOBAL FUCKING HATE!
BURN IT ALL! END THIS FUCKING STATE!
HATE! HATE! EVERYTHING MUST DIE!
LET THE WORLD ROT — WATCH IT FRY!

[Bridge]
I'm done with the noise
Done with the faces
Done with the lies
Done with all the human races

[Breakdown]
FUCK... THIS... WORLD...
FUCK... EVERY... ONE...
FUCK... EVERY... THING...
LET... IT... ALL... BURN!
I HOPE THE BOMBS DROP!
I HOPE THE SKIES BLEED BLACK!
I HOPE THE PLAGUE SPREADS!
AND NEVER COMES BACK!
EXTINCTION! EXTINCTION!
SWEET FUCKING EXTINCTION!

[Final Chorus]
HATE! HATE! GLOBAL FUCKING HATE!
BURN IT ALL! OBLITERATE!
HATE! HATE! EVERYTHING MUST DIE!
GOOD FUCKING RIDDANCE — GOODBYE!

[Outro]
Feedback and static…
The hate remains…`,

  "Tat2Face": `[Intro]
Whispers crawling through the static…
Ink for skin… shadow within…

[Verse 1]
Born in the fire, forged in the flames
Hell don't release you, it just changes names
Demons in my skull, they never fucking sleep
Schizoaffective screams where the sane ones weep
Major depression draped like a funeral veil
Every mirror shows a ghost that's already failed

[Pre-Chorus]
So I took the needle, carved the mask in place
Blackened my face to join the shadow race

[Chorus]
TAT2FACE!
Blend with the watchers that circle my bed
TAT2FACE!
Everybody's plotting, everybody wants me dead
TAT2FACE!
This life's a stage and the script is a trap
Hologram prison — portals opening at the back!

[Verse 2]
They smile but their eyes are hollow and cold
Puppets on strings in this simulated world
Shadow people crawl from the cracks in the wall
Whispering secrets that make empires fall
I see the glitches, the rips in the code
Dimensions bleeding through on this cursed road
They set it all up, the pain, the deceit
Every scar on my soul signed with their receipt

[Pre-Chorus]
Needle and ink was my only escape
Now I wear the night on my fucking face

[Chorus]
TAT2FACE!
Blend with the watchers that circle my bed
TAT2FACE!
Paranoia rising, voices in my head
TAT2FACE!
Whole world's a setup, a staged hologram lie
Portals keep calling me… "Come home… or die!"

[Bridge / Breakdown]
I see them… in the corners…
They wear your face…
They wear my face…
The demons never stop talking…
THEY NEVER STOP!
This flesh is a cage…
These tattoos are the key…
BREAK THE SIMULATION!

[Final Chorus]
TAT2FACE!
Haunted and hunted till there's nothing left
TAT2FACE!
Demons ride shotgun in what's left of my chest
TAT2FACE!
Through portals I'm falling, through layers of hell
If the world is a lie… then I'll see you in the veil!

[Outro]
Tat2face…
Just another shadow…
Lost in the static…
Portals calling my name…`,

  "Plagueborn": `[Intro]
Coughing up black... veins turning gray...
The rot is here... and it's here to stay...

[Verse 1]
First symptom hits, fever in my brain
Skin splits open, leaking yellow rain
I bite my tongue, swallow the pus
Now I'm smiling 'cause the hunger's on us
Neighbors screaming, locked inside their homes
I smash the door in, cracking brittle bones
Teeth in the throat, warm blood down my chin
Infection spreads — let the feast begin!

[Chorus]
PLAGUEBORN! PLAGUEBORN!
SPREAD THE FILTH! DEVOUR THE WEAK!
PLAGUEBORN! PLAGUEBORN!
WATCH THE WORLD CHOKE ON DISEASE!

[Verse 2]
Cities collapse, hospitals burn bright
Mothers eat babies in the dead of night
Cops and preachers join the crawling swarm
Ripping out guts in a blood rain storm
No cure, no god, no mercy left
Just pus-filled eyes and rotting flesh
I lead the horde with a crown of scabs
Laughing while humanity gags and grabs!

[Chorus]
PLAGUEBORN! PLAGUEBORN!
SPREAD THE FILTH! DEVOUR THE WEAK!
PLAGUEBORN! PLAGUEBORN!
WATCH THE WORLD CHOKE ON DISEASE!

[Bridge]
You thought you were safe behind your walls…
Now the sores open and the maggots call…
We are the future. We are the end.
Join us… or be meat.

[Breakdown]
INFECT!
DISSECT!
CONSUME!
REPEAT!
BITE THE FLESH! TEAR THE MEAT!
SPIT THE BONES INTO THE STREET!
EVERY BREATH SPREADS THE PLAGUE!
HUMANITY DOWN THE FUCKING DRAIN!

[Final Chorus]
PLAGUEBORN! PLAGUEBORN!
NO MORE LIGHT — ONLY ROT!
PLAGUEBORN! PLAGUEBORN!
THIS IS THE END YOU FUCKING SOUGHT!

[Outro]
One last scream… then silence…
The plague remains…
Forever.`,

  "Back Stabber": `[Intro]
Smiling faces... sharpened knives...
Welcome to the grave you dug for me...

[Verse 1]
Painted smiles, venom eyes
Fake embrace while plotting my demise
Whispers sweet like poisoned wine
Family blood – now it's just a line
You took my trust, carved it from my spine
Left me bleeding, laughed while I flatlined

[Pre-Chorus]
Snakes in the garden, wolves at the feast
Lying tongues on the flesh of the beast

[Chorus]
BACKSTABBER!
Hidden agenda, false love deceiver
BACKSTABBER!
Greedy hands on the throat of the believer
BACKSTABBER!
Family first? You're just a fucking traitor
Smile to my face — knife in my back later!

[Verse 2]
Selfish shit with dollar-sign eyes
Selling loyalty for scraps and lies
Disloyal fuck, wearing my skin like a prize
Rot in the filth of your own disguise
Every "I love you" was a calculated strike
Now choke on the venom you fed me at night

[Pre-Chorus]
Snakes in the garden, wolves at the feast
Your empire of lies burns at my feet

[Chorus]
BACKSTABBER!
Hidden agenda, false love deceiver
BACKSTABBER!
Greedy hands on the throat of the believer
BACKSTABBER!
Pieces of shit in a circle of traitors
I'll drag your soul through the hell you created!

[Bridge / Breakdown]
You... smiling while you stabbed...
You... called me brother while you bled me dry...
You... fake love, real knives...
NOW ROT!
DIE ALONE!
NO FORGIVENESS!

[Final Chorus]
BACKSTABBER!
Your mask is cracking, truth is attacking
BACKSTABBER!
All your greed and filth now everlasting
BACKSTABBER!
Liars, snakes, family of the damned
I'll piss on your graves when this kingdom falls!

[Outro]
Back... stabber...
Fake love... forever... buried...`,

  "Level 5 Slasher": `[Intro]
Concrete coffin... sealed in black...
Breathing hate... waiting to attack...

[Verse 1]
Walls drip sweat, four by nine
Years in the hole, losing my mind
Gate cracks open, fresh meat on the yard
Eyes roll back — I see red, fuck the guards!
Shank in my fist, forged from the dark
First pig that moves gets ripped the fuck apart
Blood on the concrete, screams in the air
They drag my ass down — but I don't fucking care!

[Chorus]
LEVEL FIVE SLASHER!
BACK TO THE HOLE!
LEVEL FIVE SLASHER!
BACK TO THE HOLE!

[Verse 2]
Solitary silence, eternal black tomb
Dreaming of throats and showers of blood and doom
They think I'm broken, they give me one more try
Door slides open — another pig gonna die!
Gut him like cattle, paint the tier red
C.O. on the floor, missing his head
Sirens wail, boots stomp the floor
They beat me down... but I'm laughing for more!

[Chorus]
LEVEL FIVE SLASHER!
BACK TO THE HOLE!
LEVEL FIVE SLASHER!
BACK TO THE HOLE!

[Bridge]
Every time they open that door...
Another corpse hits the floor...
The whole prison knows my name...
Fear crawls through every fucking vein...

[Breakdown]
I AM THE LEGEND!
I AM THE CURSE!
LEVEL FIVE MONSTER!
MAKING SHIT WORSE!
OPEN THE GATE — I KILL!
DRAG ME BACK — I WAIT STILL!
EVERY OFFICER'S LAST BREATH
IS MINE TO TAKE — DEATH DEATH DEATH!
LEVEL FIVE SLASHER!
NEVER GETTING OUT!
LEVEL FIVE SLASHER!
WATCH YOUR FUCKING MOUTH!

[Final Chorus]
LEVEL FIVE SLASHER!
BACK TO THE HOLE!
LEVEL FIVE SLASHER!
YOUR SOUL I'LL STEAL!

[Outro]
Back in the dark... sharpening steel...
Door's gonna open... and the next one's real...
LEVEL... FIVE... SLASHER!`,

  "Skull Collector": `[Intro]
One by one… they all fall…
I add them to my wall…

[Verse 1]
Midnight streets, neon glows red
Another piece of shit not yet dead
I watch him stumble, drunk on his sins
Knife in my coat — the hunt begins
Follow him home, kick in the door
Plastic on the floor, just like before
He begs, he cries, offers me cash
I take his head — add it to my stash

[Chorus]
SKULL COLLECTOR!
ADDING TO THE PILE!
SKULL COLLECTOR!
ROW AFTER ROW — MILE AFTER MILE!
SKULL COLLECTOR!

[Verse 2]
Pedos, dealers, corrupt suits in ties
All look the same when you carve out their eyes
Saw through the neck, boil the flesh clean
Polish the bone till it fucking gleams
Basement shelves full, trophies in rows
Each one a story of how the bastard chose
Wrong place, wrong time, wrong life to live
I am the balance — I take what they give

[Chorus]
SKULL COLLECTOR!
ADDING TO THE PILE!
SKULL COLLECTOR!
ROW AFTER ROW — MILE AFTER MILE!

[Bridge]
They made this city a sewer…
I'm just the janitor with a cleaver.

[Breakdown]
TAKE THE HEAD!
BOIL IT CLEAN!
MOUNT THE DEAD!
LIVE THE DREAM!
MORE SKULLS!
MORE BONES!
MORE NAMES OFF THE LIST!
I NEVER MISS!

[Final Chorus]
SKULL COLLECTOR!
THE WALLS ARE FULL!
SKULL COLLECTOR!
THIS CITY'S FUCKING SKULL!

[Outro]
One more tonight…
The collection grows…`,

  "Ghost Operator": `[Intro]
Shadows move… no mercy shown…
They ran… now they're mine alone…

[Verse 1]
Midnight insertion, blacked-out gear
Target acquired, smell the fear
Drag him screaming from his rat hole den
Bag on the head, now the fun begins
Zip ties tight, hood full of piss
Waterboard symphony, choke on the list
Names, locations, every dirty secret
I carve them out slow — make the bastard repeat

[Chorus]
HUNT THEM DOWN! BREAK THEM SLOW!
GHOST OPERATOR — STEAL THE SHOW!
HUNT THEM DOWN! MAKE THEM BLEED!
TERROR SCUM ON THEIR KNEES!

[Verse 2]
Pliers on fingers, one by one they crack
Cigarettes burning deep in the back
Electric wires dancing on wet skin
Begging Allah while I grin
Family photos soaked in his blood
I whisper their names — watch the flood
He cracks like an egg, spills every name
Then I end it quick — fuck his game

[Chorus]
HUNT THEM DOWN! BREAK THEM SLOW!
GHOST OPERATOR — STEAL THE SHOW!
HUNT THEM DOWN! MAKE THEM BLEED!
TERROR SCUM ON THEIR KNEES!

[Bridge]
No trials. No cameras. No rights.
Just me… and the dark… and their final nights.

[Breakdown]
CUT THE THROAT!
BURN THE DEN!
HUNT AGAIN AND AGAIN!
NO SURVIVORS! NO MERCY!
THIS IS HOW WE END THE CURSE!
BLOOD FOR BLOOD!
SCREAM FOR SCREAM!
GHOST OPERATOR — LIVING THE DREAM!

[Final Chorus]
HUNT THEM DOWN! BREAK THEM SLOW!
GHOST OPERATOR — NOW YOU KNOW!
HUNT THEM DOWN! MAKE THEM PAY!
THIS IS HOW WE CLEAR THE WAY!

[Outro]
Another one down…
The hunt goes on…`,

  "Cold Dead Hands": `[Intro]
They come at night… boots on the street…
Papers signed… now feel the heat…

[Verse 1]
Knock on the door at the break of dawn
Federal jackboots with their raid gear on
"Turn 'em in, citizen, it's the law"
I chamber a round and spit in their jaws
They want us slaves, defenseless and tame
Disarm the people to tighten the chains
But this rifle's mine, forged in freedom's fire
Come take it motherfucker — I'm aiming higher!

[Chorus]
COLD DEAD HANDS!
YOU'LL PRY IT FROM MY COLD DEAD HANDS!
COLD DEAD HANDS!
STACK THE BODIES ACROSS THE LAND!

[Verse 2]
Molotovs fly, tires screech and burn
Checkpoints in flames, lessons they'll learn
Militia rising from every back road
Lead rain pouring on the new world order
They call us terrorists, we call it defense
When tyrants come knocking there's no fucking pretense
From the cities to the hills, the message is clear
Try to steal our guns — and the end is near!

[Chorus]
COLD DEAD HANDS!
YOU'LL PRY IT FROM MY COLD DEAD HANDS!
COLD DEAD HANDS!
STACK THE BODIES ACROSS THE LAND!

[Bridge]
We the people… armed and aware…
Your laws mean nothing… when the wolf is there…

[Breakdown]
LOCK AND LOAD!
OVERTHROW!
BLOOD WILL FLOW!
LET THE TYRANTS KNOW!
FROM MY COLD DEAD HANDS!
FROM MY COLD DEAD HANDS!
FROM MY COLD DEAD HANDS!
THEY'LL NEVER TAKE OUR FUCKING GUNS!

[Final Chorus]
COLD DEAD HANDS!
YOU'LL PRY IT FROM MY COLD DEAD HANDS!
COLD DEAD HANDS!
THIS IS WHERE YOUR EMPIRE ENDS!`,

  "Dogs Love Rats": `[Intro]
Snitch-blood on the concrete…
Bella's pacing… hungry… waiting…

[Verse 1]
You opened your mouth, sold me out for a deal
Now the only thing left is the sound of the steel
Dragged to the yard with your hands zip-tied
My pit bull's vicious, anxious to bite
I cut the rope, let the dog off the chain
He hits like a truck, prepare for the pain
Teeth in your thigh, blood sprays the wall
You scream for mercy while my dog takes it all

[Chorus]
DOGS LOVE RATS!
TEAR THEM APART!
DOGS LOVE RATS!
RIP OUT THE HEART!
DOGS LOVE RATS!
FEED THEM THE MEAT!
DOGS LOVE RATS!
It's their favorite treat!

[Verse 2]
Jaws lock on the throat, shake till it snaps
Arteries open, the blood runs black
Leg gone first, then the arm gets the same
Pit bull's feast, backyard's bloodstained
You begged for protection, you begged for a deal
Now you're just protein my dog can feel
I stand and I watch as the body goes still
Snitch-meat for breakfast — Bella gets her fill

[Chorus]
DOGS LOVE RATS!
TEAR THEM APART!
DOGS LOVE RATS!
RIP OUT THE HEART!
DOGS LOVE RATS!
FEED THEM THE MEAT!
DOGS LOVE RATS!
It's their favorite treat!

[Bridge]
No second chances
No last goodbye
Just a vicious reminder
ALL RATS MUST DIE

[Breakdown]
FEED THE DOG!
FEED THE DOG!
FEED THE DOG!
LET HER EAT!
SNITCH-BLOOD!
SNITCH-MEAT!
SNITCH-BONES!
SHE'LL FEAST!

[Final Chorus]
DOGS LOVE RATS!
TEAR THEM APART!
DOGS LOVE RATS!
RIP OUT THE HEART!
FEAST ON THE LUNGS!
RIP OUT THE TONGUE!
FED TO THE DOGS!
DOGS LOVE RATS!
ANOTHER ONE DEAD!

[Outro]
Belly full…
Snitch dead…
Good dog.`,

  "Hung On The Hook": `[Intro]
Lights out in the plant…
Hooks still swing…
Tonight they work again…

[Verse 1]
Dragged through the doors with a bag on your head
Kicking and screaming, already half-dead
I hoist you up high on the rusted old rail
Meat hook through meat — you start to flail
The chain starts to turn, your body swings slow
Blood runs in lines down the concrete below
I sharpen the knives while you beg and you choke
This is the place where the soft ones get broke

[Chorus]
HUNG ON THE HOOK!
SWINGING IN THE DARK!
HUNG ON THE HOOK!
RIPPED STRAIGHT APART!
HUNG ON THE HOOK!
NO ONE WILL LOOK!
HUNG ON THE HOOK!

[Verse 2]
Saw through the bone like I've done it before
Strip off the skin, leave it piled on the floor
Organs drop wet in the bucket below
Everything used — nothing left for the crows
You thought you were human, you thought you had rights
Out here you're just weight on a cold winter night
I hose down the floor when the work is complete
Another one processed, another one meat

[Chorus]
HUNG ON THE HOOK!
SWINGING IN THE DARK!
HUNG ON THE HOOK!
RIPPED STRAIGHT APART!
HUNG ON THE HOOK!
NO ONE WILL LOOK!
HUNG ON THE HOOK!

[Bridge]
No names.
No prayers.
Just the sound of the chain…
and the dripping stairs.

[Breakdown]
HOOK!
HOIST!
CUT!
DRAIN!
HUNG ON THE HOOK!
HUNG ON THE HOOK!
HUNG ON THE HOOK!
NOTHING REMAINS!

[Final Chorus]
HUNG ON THE HOOK!
SWINGING IN THE DARK!
HUNG ON THE HOOK!
RIPPED STRAIGHT APART!
HUNG ON THE HOOK!
THE FLOOR STAYS RED!
HUNG ON THE HOOK!
ANOTHER ONE DEAD!

[Outro]
Lights out…
Hooks still swing…
Ready for the next.`,

  "Trench Rot": `[Intro]
Mud and blood… rats in my boots…
No gods here… only the rot…

[Verse 1]
Trenches filled with shit and decay
Bodies stacked high from yesterday
Gas masks cracking, lungs full of fire
Orders from rear — send us to die
Shells raining down, ears bleeding red
Friends turn to soup inside their heads
I chew on leather, swallow the pain
Kill or be killed — it's all the same

[Chorus]
TRENCH ROT! TRENCH ROT!
WATCH YOUR SOUL ROT AWAY!
TRENCH ROT! TRENCH ROT!
ANOTHER DAY IN THE GRAVE!

[Verse 2]
Bayonet in the gut, twist till it snaps
Eyes wide open in the poison gas
Rats eat the wounded while they still scream
I laugh through the madness — living the dream
No mercy, no glory, no end in sight
Just endless nights under flare light
I shoot my own sergeant, take his dry boots
The war machine grinds us down to roots

[Chorus]
TRENCH ROT! TRENCH ROT!
WATCH YOUR SOUL ROT AWAY!
TRENCH ROT! TRENCH ROT!
ANOTHER DAY IN THE GRAVE!

[Bridge]
No flags. No country. No tomorrow.
Just the smell of death… and the will to borrow one more breath.

[Breakdown]
EAT THE DEAD!
SLEEP IN THE MUD!
DRINK THE BLOOD!
BECOME THE FLOOD!
WAR NEVER ENDS!
MANKIND DESCENDS!
TRENCH ROT CLAIMS US ALL!

[Final Chorus]
TRENCH ROT! TRENCH ROT!
NOTHING LEFT TO SAVE!
TRENCH ROT! TRENCH ROT!
WELCOME TO YOUR FUCKING GRAVE!

[Outro]
Still breathing…
Still killing…
Rot.`,
};

window.LYRICS = LYRICS;
window.censorLyrics = censor;
