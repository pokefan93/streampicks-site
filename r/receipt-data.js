"use strict";

// TODO: Replace this fixture map with real receipt payloads once shared receipts
// are backed by app or backend data. The renderer is already structured for
// clean /r/{receiptId} URLs and can swap to real fetch logic later.
window.STREAMPICKS_RECEIPT_FEATURED_ID = "called-it-heatseeker";

window.STREAMPICKS_RECEIPT_FIXTURES = {
  "called-it-heatseeker": {
    id: "called-it-heatseeker",
    variant: "called_it",
    tone: "heat",
    state: "Resolved outcome",
    kicker: "Called It Receipt",
    badge: "Called It",
    title: "Called NovaNate before the spike.",
    subtitle:
      "HeatSeeker locked the pick before the room caught on and turned creator heat into a +5 climb at reveal.",
    chips: ["Early call", "Daily reveal", "Receipt ready"],
    impactValue: "+5",
    impactLabel: "spots at reveal",
    actorName: "HeatSeeker",
    actorMeta: "@heatseeker | Clip Cartel | Daily Reveal League",
    facts: [
      { label: "Creator", value: "@NovaNate" },
      { label: "Result", value: "#12 to #7 overnight" },
      { label: "Why it hit", value: "Caught creator heat before lock" }
    ],
    storyTitle: "The creator pop landed right after lock.",
    storyBody:
      "HeatSeeker grabbed NovaNate before the room moved, held the pick through the countdown, and watched the reveal turn it into an instant jump.",
    stakesTitle: "This is the whole StreamPicks loop in one screenshot.",
    stakesBody:
      "The proof is not just that the creator moved. The proof is that the call moved rank, changed the rivalry, and created something worth posting.",
    plusKicker: "Play harder with StreamPicks+",
    plusTitle: "Serious players press the edge with sharper reads.",
    plusCopy:
      "StreamPicks+ is for players who want stronger creator signal, cleaner prep, and premium flex when the reveal hits.",
    plusCtaLabel: "Get Plus Updates",
    metaTitle: "Called It: HeatSeeker caught NovaNate early | StreamPicks Receipt",
    metaDescription:
      "HeatSeeker called NovaNate before the spike and turned it into a +5 reveal jump. View the Receipt on StreamPicks.",
    socialAlt: "StreamPicks Receipt showing a +5 reveal jump after an early creator call."
  },
  "captains-call-nightshift": {
    id: "captains-call-nightshift",
    variant: "captains_call",
    tone: "captain",
    state: "Resolved outcome",
    kicker: "Captain's Call Receipt",
    badge: "Captain's Call",
    title: "The captain call swung the whole clash.",
    subtitle:
      "NightShift Captain backed LunaLoop late, held the room together, and flipped the league clash when the reveal landed.",
    chips: ["Captain move", "Clash win", "Team pressure"],
    impactValue: "W",
    impactLabel: "captain decision",
    actorName: "NightShift Captain",
    actorMeta: "@nightshiftcap | After Hours | Clash Room 04",
    facts: [
      { label: "Creator", value: "@LunaLoop" },
      { label: "Result", value: "Won the clash by 18 heat" },
      { label: "Why it hit", value: "Captain override landed" }
    ],
    storyTitle: "The room needed one call that everyone would have to live with.",
    storyBody:
      "The captain pushed the squad into LunaLoop while the room was split. When the reveal came through, the call carried the clash.",
    stakesTitle: "Captain receipts are leadership receipts.",
    stakesBody:
      "This kind of proof is not just about being right. It shows who made the call, who took the risk, and who owned the result.",
    plusKicker: "Play harder with StreamPicks+",
    plusTitle: "StreamPicks+ adds sharper tools for pressure moments.",
    plusCopy:
      "Stronger reads, cleaner board control, and premium team identity all matter more when one captain call can swing the room.",
    plusCtaLabel: "Get Plus Updates",
    metaTitle: "Captain's Call: NightShift Captain swung the clash | StreamPicks Receipt",
    metaDescription:
      "NightShift Captain backed LunaLoop and won the clash by 18 heat. View the Receipt on StreamPicks.",
    socialAlt: "StreamPicks Captain's Call Receipt showing a clash win."
  },
  "rank-up-sharpnote": {
    id: "rank-up-sharpnote",
    variant: "rank_up",
    tone: "climb",
    state: "Identity flex",
    kicker: "Rank Up Receipt",
    badge: "Rank Up",
    title: "SharpNote broke into the top 10.",
    subtitle:
      "A clean run of reveal wins turned steady calls into a bigger identity flex: new rank, new pressure, more receipts.",
    chips: ["Rank climb", "Identity flex", "Top 10"],
    impactValue: "#7",
    impactLabel: "new overall rank",
    actorName: "SharpNote",
    actorMeta: "@sharpnote | Watchlist Mafia | Global Ladder",
    facts: [
      { label: "Previous rank", value: "#11" },
      { label: "New rank", value: "#7" },
      { label: "Why it hit", value: "Four strong reveals in a row" }
    ],
    storyTitle: "The climb finally turned into a visible status change.",
    storyBody:
      "SharpNote stacked enough strong reveals to break into the top 10 and turn a quiet streak into a public identity moment.",
    stakesTitle: "Rank Up receipts are social proof.",
    stakesBody:
      "They tell the whole room who is climbing, who is real, and who is becoming harder to ignore every day.",
    plusKicker: "Play harder with StreamPicks+",
    plusTitle: "Serious players use StreamPicks+ to climb cleaner.",
    plusCopy:
      "More control over the board and stronger signal on creator heat help turn good streaks into bigger rank jumps.",
    plusCtaLabel: "Get Plus Updates",
    metaTitle: "Rank Up: SharpNote climbed into the top 10 | StreamPicks Receipt",
    metaDescription:
      "SharpNote jumped from #11 to #7 and turned a steady streak into a Rank Up Receipt on StreamPicks.",
    socialAlt: "StreamPicks Rank Up Receipt showing a move into the top 10."
  },
  "upset-receipt-roguewave": {
    id: "upset-receipt-roguewave",
    variant: "upset_receipt",
    tone: "upset",
    state: "Resolved outcome",
    kicker: "Upset Receipt",
    badge: "Upset Receipt",
    title: "The underdog receipt nobody wanted to see.",
    subtitle:
      "RogueWave backed the less popular board, ate the trash talk, and walked away with the upset when the reveal broke weird.",
    chips: ["Underdog hit", "Reveal swing", "Trash talk receipts"],
    impactValue: "2.4x",
    impactLabel: "underdog swing",
    actorName: "RogueWave",
    actorMeta: "@roguewave | Daily Doubles | Rivalry League",
    facts: [
      { label: "Creator", value: "@ClipChemist" },
      { label: "Result", value: "Upset by 14 reveal points" },
      { label: "Why it hit", value: "Bet against the room" }
    ],
    storyTitle: "The call looked wrong until the board actually flipped.",
    storyBody:
      "Most of the league leaned the other way. RogueWave stayed on the read, waited through the countdown, and got the screenshot everyone else had to sit with.",
    stakesTitle: "Upset receipts create the loudest social moments.",
    stakesBody:
      "When the room thinks you are wrong and the reveal proves otherwise, the receipt becomes proof, flex, and revenge all at once.",
    plusKicker: "Play harder with StreamPicks+",
    plusTitle: "Want sharper upset calls? StreamPicks+ goes deeper.",
    plusCopy:
      "Bigger edge, better prep, and premium identity matter even more when you are trying to beat the room on conviction.",
    plusCtaLabel: "Get Plus Updates",
    metaTitle: "Upset Receipt: RogueWave beat the room | StreamPicks Receipt",
    metaDescription:
      "RogueWave backed the underdog board and turned it into an Upset Receipt on StreamPicks.",
    socialAlt: "StreamPicks Upset Receipt showing an underdog win."
  },
  "clash-win-streak-clipcartel": {
    id: "clash-win-streak-clipcartel",
    variant: "clash_win_streak",
    tone: "streak",
    state: "Identity flex",
    kicker: "Clash Win Streak Receipt",
    badge: "Clash Win Streak",
    title: "Clip Cartel pushed the streak to four.",
    subtitle:
      "Another reveal win means the streak is not random anymore. It is identity, pressure, and a bigger target on the squad's back.",
    chips: ["Four straight", "Team identity", "Pressure rising"],
    impactValue: "4x",
    impactLabel: "clash win streak",
    actorName: "Clip Cartel",
    actorMeta: "Squad receipt | Clash Ladder | Shared from the app",
    facts: [
      { label: "Latest win", value: "Beat After Hours by 11 heat" },
      { label: "Streak", value: "4 straight clash wins" },
      { label: "Why it hit", value: "Team read stayed hot" }
    ],
    storyTitle: "The streak survived another reveal.",
    storyBody:
      "Clip Cartel stayed disciplined, closed out another clash, and turned one more shared screenshot into a bigger squad identity flex.",
    stakesTitle: "Streak receipts raise the pressure every day.",
    stakesBody:
      "The longer the streak gets, the more every reveal matters and the more the room wants to be the one who ends it.",
    plusKicker: "Play harder with StreamPicks+",
    plusTitle: "Better teams want deeper control and louder flex.",
    plusCopy:
      "StreamPicks+ makes it easier to stay organized, read the board, and carry premium squad identity while the streak is alive.",
    plusCtaLabel: "Get Plus Updates",
    metaTitle: "Clash Win Streak: Clip Cartel made it four straight | StreamPicks Receipt",
    metaDescription:
      "Clip Cartel extended the clash streak to four straight wins. View the StreamPicks Receipt.",
    socialAlt: "StreamPicks Clash Win Streak Receipt showing four straight wins."
  },
  "scout-board-hit-vantage": {
    id: "scout-board-hit-vantage",
    variant: "scout_board_hit",
    tone: "scout",
    state: "Prediction receipt",
    kicker: "Scout Board Hit",
    badge: "Scout Board Hit",
    title: "Vantage found the creator heat before the room even noticed.",
    subtitle:
      "The scout board call turned a quiet read into a public receipt once the creator started moving the next day.",
    chips: ["Scout board", "Early signal", "Prediction proof"],
    impactValue: "92",
    impactLabel: "heat score call",
    actorName: "Vantage",
    actorMeta: "@vantage | Scout Room | Breakout Watch",
    facts: [
      { label: "Creator", value: "@KaiPulse" },
      { label: "Result", value: "Heat score surged the next day" },
      { label: "Why it hit", value: "Board caught the movement early" }
    ],
    storyTitle: "This receipt is about seeing the move before it was obvious.",
    storyBody:
      "Vantage flagged KaiPulse while the board was still quiet. The next reveal made the call look obvious, but the receipt shows when it was actually made.",
    stakesTitle: "Scout Board receipts reward early eyes.",
    stakesBody:
      "They are proof that finding creator heat early matters just as much as winning after everyone finally sees it.",
    plusKicker: "Play harder with StreamPicks+",
    plusTitle: "StreamPicks+ helps serious scouts read the board sooner.",
    plusCopy:
      "Sharper momentum context and better board control make the earliest calls feel more deliberate and less lucky.",
    plusCtaLabel: "Get Plus Updates",
    metaTitle: "Scout Board Hit: Vantage caught KaiPulse early | StreamPicks Receipt",
    metaDescription:
      "Vantage flagged KaiPulse before the board moved and turned it into a Scout Board Hit Receipt on StreamPicks.",
    socialAlt: "StreamPicks Scout Board Hit Receipt showing an early creator heat call."
  },
  "team-heat-meter-afterhours": {
    id: "team-heat-meter-afterhours",
    variant: "team_heat_meter",
    tone: "team",
    state: "Identity flex",
    kicker: "Team Heat Meter",
    badge: "Team Heat Meter",
    title: "After Hours is running hot heading into tonight's reveal.",
    subtitle:
      "This receipt is a team identity object: the room is hot, the board is alive, and the reveal has real pressure behind it.",
    chips: ["Team heat", "Squad identity", "Reveal pressure"],
    impactValue: "93",
    impactLabel: "team heat meter",
    actorName: "After Hours",
    actorMeta: "Squad receipt | Heat ladder | Shared from StreamPicks",
    facts: [
      { label: "Current signal", value: "93 team heat" },
      { label: "Room status", value: "Two hot creators before reveal" },
      { label: "Why it hit", value: "Momentum across the whole squad" }
    ],
    storyTitle: "The room is hot and everyone knows it.",
    storyBody:
      "A Team Heat Meter receipt makes the squad's momentum public before the reveal even lands. It is identity, confidence, and pressure in one shared object.",
    stakesTitle: "Not every receipt is about a single pick.",
    stakesBody:
      "Some receipts are about the whole room feeling alive, the squad heating up, and the next reveal carrying more drama because of it.",
    plusKicker: "Play harder with StreamPicks+",
    plusTitle: "Premium squads want more control and more identity.",
    plusCopy:
      "StreamPicks+ is built for players and squads who want stronger signal, deeper prep, and a sharper way to show who they are.",
    plusCtaLabel: "Get Plus Updates",
    metaTitle: "Team Heat Meter: After Hours is heating up | StreamPicks Receipt",
    metaDescription:
      "After Hours is running hot before the reveal. View the Team Heat Meter Receipt on StreamPicks.",
    socialAlt: "StreamPicks Team Heat Meter Receipt showing a squad running hot before reveal."
  },
  "intel-receipt-neonnote": {
    id: "intel-receipt-neonnote",
    variant: "intel_receipt",
    tone: "premium",
    state: "Premium proof",
    kicker: "Intel Receipt",
    badge: "Intel Receipt",
    title: "The premium read landed before the room knew why.",
    subtitle:
      "NeonNote used a sharper creator read, locked the board early, and turned the next reveal into a premium proof screenshot.",
    chips: ["StreamPicks+", "Sharper read", "Premium proof"],
    impactValue: "+8",
    impactLabel: "premium edge",
    actorName: "NeonNote",
    actorMeta: "@neonnote | Intel Room | StreamPicks+",
    facts: [
      { label: "Creator", value: "@NovaNate" },
      { label: "Result", value: "#18 to #10 after reveal" },
      { label: "Why it hit", value: "Sharper premium signal" }
    ],
    storyTitle: "The read was cleaner before the creator movement looked obvious.",
    storyBody:
      "This is the premium proof version of a Receipt. The point is not just that the call worked. The point is that better signal and deeper prep made the call possible early enough to matter.",
    stakesTitle: "Intel receipts sell the edge.",
    stakesBody:
      "They show why StreamPicks+ should feel more powerful, more strategic, and more elite than the free baseline while still living inside the same game loop.",
    plusKicker: "Powered by StreamPicks+",
    plusTitle: "This Receipt is premium proof: sharper reads, deeper control, louder flex.",
    plusCopy:
      "StreamPicks+ is for players who want stronger creator signal, better control over the board, and premium identity every time the reveal lands.",
    plusCtaLabel: "Get StreamPicks+",
    metaTitle: "Intel Receipt: NeonNote pressed the premium edge | StreamPicks Receipt",
    metaDescription:
      "NeonNote turned a sharper premium read into an +8 reveal jump. View the Intel Receipt on StreamPicks.",
    socialAlt: "StreamPicks Intel Receipt showing a premium proof variant and an +8 reveal jump."
  }
};
