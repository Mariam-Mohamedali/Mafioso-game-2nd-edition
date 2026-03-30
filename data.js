const CASES = [
  {
    id: 'diamond',
    number: 1,
    title: 'The Stolen Diamond',
    subtitle: 'A Night of Glitter & Greed',
    setting: 'The Grand Metropolitan Hotel, New York',
    description: 'The most famous diamond in the city went missing at a big party. One of the guests stole it. They knew the alarm codes. They knew the right time to strike. Can you find out who did it?',
    icon: '💎',
    accentColor: '#2563EB',
    suspects: [
      { id: 'marcus',    name: 'Marcus Crane',      role: 'Head of Security',   icon: '🕵️', alibi: '"I was watching the cameras in the control room all night."',          color: '#1E3A5F', initials: 'MC' },
      { id: 'isabelle',  name: 'Isabelle Fontaine',  role: "Host's Assistant",   icon: '🥂', alibi: '"I was setting up the drinks. Everyone in the east wing saw me."',     color: '#7B2D8B', initials: 'IF' },
      { id: 'lord_bale', name: 'Lord Edmund Bale',   role: 'Business Rival',     icon: '🎩', alibi: '"I was in the smoking room the whole time. Ask my friends."',           color: '#8B1A1A', initials: 'EB' },
      { id: 'serena',    name: 'Serena Voss',        role: 'Party Photographer', icon: '📸', alibi: '"I was taking photos in the main hall. Check my camera if you want."', color: '#0E6655', initials: 'SV' }
    ],
    clues: [
      {
        number: 1, icon: '📹',
        title: 'Camera Goes Dark',
        text: 'A camera in the east hallway was turned off at 9:47 PM. Someone inside the security control room did it on purpose — and left all other cameras running so no one would notice.'
      },
      {
        number: 2, icon: '🔑',
        title: 'The Master Key',
        text: 'A special key card was used to enter the vault area at 9:52 PM. Only 3 people at the party had this key card.'
      },
      {
        number: 3, icon: '🔐',
        title: 'The Secret Code',
        text: 'Someone typed the vault code from memory — no paper, no phone. Only the head of security knows this code by heart. No one else at the party could know it.'
      }
    ],
    culprit: 'marcus',
    culpritReveal: "Marcus Crane turned off the camera himself, used his own key card to enter the vault, and typed the code from memory. He planned this for months. He built the whole security system — so he knew every weak point.",
    innocentReveal: "Lord Edmund Bale was in the smoking room all night. His rivalry with the host made everyone look at him — which is exactly what the real thief wanted."
  },
  {
    id: 'poison',
    number: 2,
    title: 'The Poisoned Wine',
    subtitle: 'Death at the Dinner Table',
    setting: 'Blackwood Manor, English Countryside',
    description: "Lord Harrington fell to the floor at his own dinner party. His wine was poisoned. The poison takes 30 minutes to work — so someone added it before dinner even started. Who wanted him dead?",
    icon: '🍷',
    accentColor: '#7C3AED',
    suspects: [
      { id: 'natalie', name: 'Dr. Natalie Cross',   role: "Lord's Doctor",       icon: '🩺', alibi: '"I sat far from the wine. I never went near it all evening."',     color: '#1A5276', initials: 'NC' },
      { id: 'felix',   name: 'Felix Harrington',    role: "The Victim's Nephew", icon: '🎭', alibi: '"I was in the garden before dinner. A few people saw me there."',  color: '#784212', initials: 'FH' },
      { id: 'antoine', name: 'Chef Antoine Moreau', role: 'House Chef',          icon: '👨‍🍳', alibi: '"I only made the food. Someone else handled all the drinks."',     color: '#145A32', initials: 'AM' },
      { id: 'clara',   name: 'Clara Vane',          role: "Lord's Fiancée",     icon: '💐', alibi: '"I was with the guests in the sitting room. I loved him."',        color: '#922B6F', initials: 'CV' }
    ],
    clues: [
      {
        number: 1, icon: '🌿',
        title: 'The Poison Plant',
        text: 'The poison came from a plant called monkshood. This plant only grows in one place on the property — the private garden. You need special permission to go in there.'
      },
      {
        number: 2, icon: '🧤',
        title: 'The Garden Gloves',
        text: 'A pair of dirty garden gloves were found near the wine storage. Lab tests confirmed — the soil on the gloves matched the exact spot where the poison plant grows.'
      },
      {
        number: 3, icon: '📜',
        title: 'The New Will',
        text: "Three days before the dinner, Lord Harrington changed his will. One person's share got doubled. Another person got almost nothing. The lawyer still has the papers."
      }
    ],
    culprit: 'felix',
    culpritReveal: "Felix Harrington picked the poison plant from the garden, used gloves to leave no marks, and mixed the poison into his uncle's personal wine glass before dinner. The reason? The new will threatened to cut his money almost to zero.",
    innocentReveal: "Clara Vane truly loved Lord Harrington. The new will actually gave her more money — so she had no reason to hurt him at all."
  },
  {
    id: 'briefcase',
    number: 3,
    title: 'The Vanishing Briefcase',
    subtitle: 'Two Million Reasons to Lie',
    setting: 'Horizon Business Center, Chicago',
    description: "During a big business deal, a briefcase with $2 million in secret papers disappeared. Someone in that building was working for the enemy. They planned it carefully — but they left clues behind.",
    icon: '💼',
    accentColor: '#059669',
    suspects: [
      { id: 'raymond', name: 'Raymond Cole',  role: 'Lead Negotiator', icon: '🤝', alibi: '"I never left the meeting room. Everyone there will confirm it."',         color: '#1B2631', initials: 'RC' },
      { id: 'priya',   name: 'Priya Shah',    role: 'Junior Staff',    icon: '📋', alibi: '"I was in the print room making copies the whole afternoon."',             color: '#6C3483', initials: 'PS' },
      { id: 'victor',  name: 'Victor Nast',   role: 'Security Guard',  icon: '🔐', alibi: '"I was at the front door the whole time. I did not move once."',           color: '#922B21', initials: 'VN' },
      { id: 'diana',   name: 'Diana Wells',   role: "CEO's Assistant", icon: '💻', alibi: '"I was managing the food delivery in the east room all day."',             color: '#784212', initials: 'DW' }
    ],
    clues: [
      {
        number: 1, icon: '🚪',
        title: 'The Back Door',
        text: 'Cameras show someone carried the briefcase out through the back exit at 3:15 PM. To open that door, you need a special security code — not every employee has it.'
      },
      {
        number: 2, icon: '📱',
        title: 'The Burner Phone',
        text: 'A hidden phone was found in the building trash. Its last call was at 3:10 PM — to a number linked to the company trying to steal the deal.'
      },
      {
        number: 3, icon: '🔒',
        title: 'The Changed Code',
        text: "That same morning, someone changed the back door's security code. The building's system shows only one person had permission to do this — someone hired from outside just for this job."
      }
    ],
    culprit: 'victor',
    culpritReveal: "Victor Nast was secretly hired by the rival company. He changed the exit door code that morning using his contractor access. He made the call at 3:10 PM, then walked out with the briefcase at 3:15 PM — all while pretending to guard the front door.",
    innocentReveal: "Raymond Cole never once left the meeting room — confirmed by every person there. His tough attitude made him look guilty, but he was exactly where he said he was."
  }
];
