const L = (w, e, t) => ({ w, e, t })
const N = t => ({ w: 'narrator', t })

export const FRIENDSHIP_STORIES = [
  {
    id: 'friend-newkid',
    mode: 'friendship',
    title: 'The New Kid',
    blurb: 'Mei just moved here and is eating lunch all alone.',
    skills: ['friendship', 'empathy'],
    minutes: 5,
    cast: ['mei', 'keza'],
    start: 'n1',
    nodes: {
      n1: {
        scene: 'lunch',
        lines: [
          N('Mei joined your class on Monday. She moved from far away and speaks quietly.'),
          N('At lunch, she sits alone at the end of a long table, pushing her rice around.'),
          L('keza', 'neutral', 'Come sit with us! We saved you a seat.'),
        ],
        choices: [
          { id: 'invite', t: '“Wait, can we ask Mei to sit with us too?”', q: 'helpful', next: 'n_invite', why: 'Starting a new school is scary. A simple invitation can change someone’s whole week.' },
          { id: 'later', t: 'Sit with Keza. Maybe say hi to Mei another day.', q: 'mixed', next: 'n_later', why: 'It’s normal to stick with your friends. But “another day” can feel very far away to someone who is lonely.' },
          { id: 'go', t: 'Walk over to Mei on your own: “Hi! Is this seat free?”', q: 'helpful', next: 'n_go', why: 'Going over yourself takes courage. Asking if the seat is free lets Mei say yes in an easy way.' },
        ],
      },
      n_invite: {
        scene: 'lunch',
        lines: [
          L('keza', 'happy', 'Yes! Good idea.'),
          N('You walk over together. Mei looks up, surprised.'),
          L('mei', 'surprised', 'Me? Oh… okay.'),
          N('At the table, there’s a quiet moment. Nobody knows what to say.'),
        ],
        choices: [
          { id: 'ask', t: 'Ask her a question: “What was your old school like?”', q: 'helpful', next: 'end_bright', why: 'Asking about someone shows you’re interested in them. People love being asked about their lives.' },
          { id: 'talk', t: 'Talk about your favourite show with Keza, hoping Mei joins in.', q: 'mixed', next: 'n_talk', why: 'Mei is at the table, which is great, but she may not know the show and could still feel on the outside.' },
        ],
      },
      n_go: {
        scene: 'lunch',
        lines: [
          L('mei', 'shy', 'Yes… you can sit.'),
          N('Mei has a drawing of a cat on her lunch box.'),
        ],
        choices: [
          { id: 'compliment', t: '“Cool lunch box! Do you like drawing?”', q: 'helpful', next: 'end_bright', why: 'Noticing something about a person is a natural way to start a conversation.' },
          { id: 'quiet', t: 'Eat quietly next to her without talking.', q: 'mixed', next: 'end_quiet', why: 'Sitting with someone is kind. Some people like quiet company! A small question might help her open up though.' },
        ],
      },
      n_later: {
        scene: 'lunch',
        lines: [
          N('You laugh with Keza all lunch. Across the room, Mei finishes eating and leaves early.'),
          N('Later, you see her wiping her eyes in the corridor.'),
        ],
        choices: [
          { id: 'check', t: 'Go over: “Are you okay? Do you want to walk to class with me?”', q: 'helpful', next: 'end_second', why: 'It’s never too late to be kind. You noticed she was sad and did something about it.' },
          { id: 'pass', t: 'Walk past. It’s not your business.', q: 'unhelpful', next: 'end_lonely', why: 'Sometimes we feel unsure what to do. But small kindness from anyone can help someone feel less alone.' },
        ],
      },
      n_talk: {
        scene: 'lunch',
        lines: [N('Mei listens but doesn’t say anything. She looks a bit lost.')],
        choices: [
          { id: 'include', t: 'Turn to Mei: “What shows do people watch where you used to live?”', q: 'helpful', next: 'end_bright', why: 'Bringing someone into the conversation directly helps them feel included, not just present.' },
          { id: 'continue', t: 'Keep talking with Keza.', q: 'mixed', next: 'end_quiet', why: 'Mei is with you, but she’s still not really part of the group yet.' },
        ],
      },
      end_bright: {
        scene: 'lunch',
        lines: [
          L('mei', 'happy', 'I love drawing! At my old school we had an art club. Is there one here?'),
          N('There is! You and Keza promise to take her on Thursday. Mei smiles all afternoon.'),
        ],
        end: {
          tone: 'bright',
          title: 'A warm welcome',
          happened: 'You invited Mei and asked about her, which helped her feel welcome and interesting.',
          feel: 'Mei felt lonely and nervous before. Now she feels noticed, welcome and excited.',
          why: 'New people often wait for someone else to make the first move. Questions show interest and give them an easy way to talk.',
          try: ['Show Mei around the school.', 'Introduce her to other friends.'],
          reflect: 'How would you want to be welcomed if you were new somewhere?',
        },
      },
      end_quiet: {
        scene: 'lunch',
        lines: [N('Mei seems a little less alone, but she still doesn’t say much. Maybe tomorrow will be easier.')],
        end: {
          tone: 'mixed',
          title: 'A good start',
          happened: 'You sat with Mei, which was kind, but there wasn’t much chance to get to know her yet.',
          feel: 'Mei probably feels a bit better, but still shy and unsure if she belongs.',
          why: 'Being close to someone is the first step. Talking with them is the next.',
          try: ['Ask one question about her.', 'Find something you have in common.'],
          reflect: 'What is an easy question you could ask someone new?',
        },
      },
      end_second: {
        scene: 'hallway',
        lines: [
          L('mei', 'sad', 'I miss my old friends. Nobody here knows me.'),
          L('you', 'calm', 'That sounds hard. Want to sit with us tomorrow?'),
          N('Mei nods. The next day, there’s a seat saved for her.'),
        ],
        end: {
          tone: 'bright',
          title: 'Never too late',
          happened: 'You missed the first chance, but you noticed Mei was sad and reached out.',
          feel: 'Mei felt homesick and invisible. Your question made her feel seen.',
          why: 'Kindness doesn’t have to be perfect or on time. Noticing and acting matters most.',
          try: ['Next time, invite the new person the first chance you get.'],
          reflect: 'Have you ever felt like nobody knew you? What helped?',
        },
      },
      end_lonely: {
        scene: 'hallway',
        lines: [N('Mei spends the rest of the week alone at lunch. On Friday, she asks her mum if she can go back to her old school.')],
        end: {
          tone: 'stormy',
          title: 'Still on the outside',
          happened: 'Mei kept feeling invisible because nobody reached out to her.',
          feel: 'Mei feels lonely, homesick and like she doesn’t belong.',
          why: 'It’s easy to think someone else will help. But if everyone thinks that, nobody does.',
          try: ['Invite her to sit with you.', 'Say hi and ask her name.', 'Ask her to join a game at break.'],
          reflect: 'Rewind and try inviting Mei. How does her week change?',
        },
      },
    },
  },
  {
    id: 'friend-teams',
    mode: 'friendship',
    title: 'Picking Teams',
    blurb: 'You’re team captain. Tomás is always picked last.',
    skills: ['friendship', 'empathy', 'decisions'],
    minutes: 4,
    cast: ['tomas', 'leo'],
    start: 'n1',
    requires: 'friend-newkid',
    nodes: {
      n1: {
        scene: 'field',
        lines: [
          N('In PE, you and Leo are captains for basketball. You take turns picking.'),
          N('Soon only Tomás and two others are left. Tomás stares at his shoes. He’s always last.'),
          L('leo', 'neutral', 'Your pick. Choose someone good.'),
        ],
        choices: [
          { id: 'pick', t: 'Pick Tomás next and give him a high five.', q: 'helpful', next: 'n_pick', why: 'Choosing someone who is usually last, and being happy about it, can change how they see themselves.' },
          { id: 'best', t: 'Pick the best player left.', q: 'mixed', next: 'n_best', why: 'Wanting to win is normal. But think about how being last every time might feel.' },
          { id: 'change', t: '“Could we make teams by counting off instead of picking?”', q: 'helpful', next: 'end_fair', why: 'Changing the system so nobody is picked last protects everyone’s feelings, not just one person’s.' },
        ],
      },
      n_pick: {
        scene: 'field',
        lines: [
          L('tomas', 'surprised', 'Really? Me?'),
          N('During the game, Tomás misses two shots. Some teammates groan.'),
        ],
        choices: [
          { id: 'encourage', t: '“Nice try, Tomás! Next one’s yours.”', q: 'helpful', next: 'end_bright', why: 'Encouragement after a mistake is what makes people feel safe to keep trying.' },
          { id: 'pass', t: 'Stop passing to him so you can win.', q: 'unhelpful', next: 'end_mixed', why: 'Including someone in name only can hurt as much as not picking them.' },
        ],
      },
      n_best: {
        scene: 'field',
        lines: [N('Tomás is picked last again. During the game, he stands at the edge and barely moves.')],
        choices: [
          { id: 'pass', t: 'Pass to Tomás and cheer when he catches it.', q: 'helpful', next: 'end_bright', why: 'Even if he was picked last, you can still make him feel part of the team.' },
          { id: 'ignore', t: 'Focus on winning.', q: 'mixed', next: 'end_mixed', why: 'Winning feels good, but someone on your team is having a very lonely game.' },
        ],
      },
      end_bright: {
        scene: 'field',
        lines: [N('In the last minute, Tomás catches your pass and scores. The whole team cheers. He walks taller all day.')],
        end: {
          tone: 'bright',
          title: 'The shot that mattered',
          happened: 'You included Tomás and encouraged him, even when he made mistakes.',
          feel: 'Tomás usually feels embarrassed in PE. Today he felt wanted and proud.',
          why: 'Being picked last again and again can make someone believe they don’t belong. One person choosing differently can break that pattern.',
          try: ['Suggest counting off for teams next time, so nobody is ever last.'],
          reflect: 'How do you think it feels to always be picked last?',
        },
      },
      end_fair: {
        scene: 'field',
        lines: [
          L('leo', 'neutral', 'Huh. Okay, fine.'),
          N('Everyone counts off one–two. Teams are mixed and nobody stands waiting to be picked. The PE teacher decides to use it every week.'),
        ],
        end: {
          tone: 'bright',
          title: 'Nobody picked last',
          happened: 'You changed the way teams were made so no one had to feel left out.',
          feel: 'Tomás and the other last-picked kids felt relieved. They didn’t have to stand and wait.',
          why: 'Sometimes the kindest thing is to change a system that keeps hurting people.',
          try: ['Cheer for every teammate, no matter how they play.'],
          reflect: 'Can you think of another situation at school where a fairer system would help?',
        },
      },
      end_mixed: {
        scene: 'field',
        lines: [N('Your team wins, but Tomás leaves PE quietly. He tells his mum he hates basketball.')],
        end: {
          tone: 'mixed',
          title: 'Won the game, lost a player',
          happened: 'Your team won, but Tomás felt invisible the whole game.',
          feel: 'Tomás feels like he doesn’t belong and nobody wants him on their team.',
          why: 'Games are more fun when everyone gets to play. Feeling left out can make people give up on something they could have enjoyed.',
          try: ['Pass to everyone on your team.', 'Cheer after mistakes, not just goals.'],
          reflect: 'What makes a great teammate, other than being good at the sport?',
        },
      },
    },
  },
  {
    id: 'friend-disagree',
    mode: 'friendship',
    title: 'The Saturday Plan',
    blurb: 'You and Keza both want to do different things this weekend.',
    skills: ['friendship', 'communication', 'conflict'],
    minutes: 5,
    cast: ['keza'],
    start: 'n1',
    requires: 'friend-teams',
    nodes: {
      n1: {
        scene: 'playground',
        lines: [
          L('keza', 'happy', 'On Saturday let’s go to the swimming pool! It’s going to be so hot.'),
          N('You were hoping to go to the football match in town. Your cousin is playing.'),
          L('keza', 'frustrated', 'You ALWAYS pick what we do. It’s my turn.'),
        ],
        choices: [
          { id: 'listen', t: '“Do you really feel like I always pick? Tell me more.”', q: 'helpful', next: 'n_listen', why: 'Even if you don’t agree, asking to hear more shows Keza that her feelings matter to you.' },
          { id: 'argue', t: '“That’s not true! Last week we did what YOU wanted.”', q: 'mixed', next: 'n_argue', why: 'You might be right! But arguing about the past keeps you stuck instead of planning Saturday.' },
          { id: 'give', t: '“Fine, whatever, we’ll go swimming.”', q: 'mixed', next: 'n_give', why: 'Giving in avoids a fight, but if you say “whatever”, Keza might still feel you don’t want to be there.' },
        ],
      },
      n_listen: {
        scene: 'playground',
        lines: [
          L('keza', 'sad', 'Well… the last three times we did football, the park and your game. I just want us to do something I like for once.'),
          N('Hmm. She has a point.'),
        ],
        choices: [
          { id: 'both', t: '“You’re right. Swimming in the morning, and maybe the second half of the match after?”', q: 'helpful', next: 'end_bright', why: 'You admitted she had a point and found a way to do both. That’s a true compromise.' },
          { id: 'swim', t: '“You’re right. Let’s go swimming. I’ll ask my cousin to film the match.”', q: 'helpful', next: 'end_swim', why: 'Choosing her plan happily, and finding another way to support your cousin, is a generous solution.' },
        ],
      },
      n_argue: {
        scene: 'playground',
        lines: [
          L('keza', 'angry', 'No we didn’t! You never listen!'),
          N('You’re both getting louder.'),
        ],
        choices: [
          { id: 'pause', t: '“Wait. I don’t want to fight. Can we both say what we want and why?”', q: 'helpful', next: 'n_listen', why: 'Pressing pause on an argument and changing to listening is a powerful move.' },
          { id: 'storm', t: '“Then go swimming by yourself.”', q: 'unhelpful', next: 'end_stormy', why: 'Saying something hurtful when we’re upset is very common, but it makes the disagreement about the friendship, not the plan.' },
        ],
      },
      n_give: {
        scene: 'playground',
        lines: [
          L('keza', 'frustrated', 'You don’t even sound like you want to come.'),
        ],
        choices: [
          { id: 'honest', t: '“Sorry. I was hoping to see my cousin’s match. But I do want to hang out with you.”', q: 'helpful', next: 'n_listen', why: 'Being honest about your feelings, and kind about the friendship, opens the door to a real solution.' },
          { id: 'shrug', t: 'Shrug and walk away.', q: 'unhelpful', next: 'end_stormy', why: 'Walking away without explaining leaves Keza confused and hurt.' },
        ],
      },
      end_bright: {
        scene: 'playground',
        lines: [
          L('keza', 'happy', 'Swimming AND football? That’s the best Saturday ever!'),
          N('On Saturday, you race in the pool, then cheer for your cousin, who scores!'),
        ],
        end: {
          tone: 'bright',
          title: 'The best of both',
          happened: 'You listened, admitted Keza had a point, and found a plan that included both of your wishes.',
          feel: 'Keza felt heard and respected, not just tolerated.',
          why: 'Friends don’t always want the same thing. Listening and compromising keeps friendships fair.',
          try: ['Take turns choosing activities in the future.'],
          reflect: 'Is it hard for you to admit when a friend has a point? Why?',
        },
      },
      end_swim: {
        scene: 'playground',
        lines: [N('You have a brilliant day at the pool. Your cousin sends you a video of his goal, and you and Keza watch it together.')],
        end: {
          tone: 'bright',
          title: 'A generous friend',
          happened: 'You chose Keza’s plan and still found a way to support your cousin.',
          feel: 'Keza felt valued and happy. She’ll probably be happy to choose your plan next time.',
          why: 'Giving a friend their turn, happily, builds trust. Friendships are a two-way street.',
          try: ['Next time, tell Keza what you’d love to do, so it stays fair both ways.'],
          reflect: 'What’s the difference between giving in and compromising?',
        },
      },
      end_stormy: {
        scene: 'playground',
        lines: [N('Keza goes swimming with another friend. You go to the match, but you keep thinking about the argument. On Monday, things feel awkward.')],
        end: {
          tone: 'stormy',
          title: 'An awkward Monday',
          happened: 'A small disagreement about plans became a fight about the friendship.',
          feel: 'Keza feels unheard. You feel annoyed and a bit guilty.',
          why: 'Disagreements are normal in every friendship. It’s how we handle them that matters.',
          try: ['Ask: “Can we both say what we want and why?”', 'Look for a compromise.', 'On Monday, say: “I’m sorry about Saturday. Can we plan next weekend together?”'],
          reflect: 'Rewind and try listening first. What does Keza tell you?',
        },
      },
    },
  },
  {
    id: 'friend-boundaries',
    mode: 'friendship',
    title: 'I Don’t Want to Talk About It',
    blurb: 'Zara has been crying, but she says she doesn’t want to talk.',
    skills: ['friendship', 'empathy', 'communication'],
    minutes: 5,
    cast: ['zara', 'uwase'],
    start: 'n1',
    requires: 'friend-disagree',
    nodes: {
      n1: {
        scene: 'hallway',
        lines: [
          N('You find Zara by the lockers. Her eyes are red.'),
          L('you', 'worried', 'Zara, what’s wrong?'),
          L('zara', 'sad', 'Nothing. I don’t want to talk about it.'),
        ],
        choices: [
          { id: 'push', t: '“Come on, just tell me! I’m your best friend.”', q: 'unhelpful', next: 'n_push', why: 'You care, and that’s lovely. But pushing someone to talk when they’ve said no can make them feel cornered.' },
          { id: 'respect', t: '“Okay. I’m here if you change your mind. Want me to stay with you?”', q: 'helpful', next: 'n_respect', why: 'You respected her “no” while still showing you care. That’s what respecting a boundary looks like.' },
          { id: 'others', t: 'Ask other people if they know why Zara is crying.', q: 'unhelpful', next: 'n_others', why: 'Asking around might feel like helping, but it can start gossip about something private.' },
        ],
      },
      n_push: {
        scene: 'hallway',
        lines: [
          L('zara', 'frustrated', 'I SAID I don’t want to talk! Just leave me alone!'),
          N('Zara walks away quickly.'),
        ],
        choices: [
          { id: 'note', t: 'Later, give her a note: “Sorry I pushed. I care about you. No need to explain.”', q: 'helpful', next: 'end_repair', why: 'Apologising for pushing, and making it clear she doesn’t owe you an explanation, rebuilds trust.' },
          { id: 'upset', t: 'Feel hurt that she won’t tell you and ignore her.', q: 'mixed', next: 'end_mixed', why: 'It’s normal to feel hurt when a friend shuts you out. But her “no” is probably about her pain, not about you.' },
        ],
      },
      n_respect: {
        scene: 'bench',
        lines: [
          N('Zara nods. You sit next to her quietly. After a while, she leans against your shoulder.'),
          L('zara', 'sad', 'My parents are getting a divorce. Please don’t tell anyone.'),
        ],
        choices: [
          { id: 'keep', t: '“I won’t tell anyone. That sounds really hard. Is there anything I can do?”', q: 'helpful', next: 'end_bright', why: 'Keeping a friend’s private news private, and asking what they need, builds deep trust.' },
          { id: 'adult', t: '“I won’t tell our friends. Do you think talking to Ms. Uwase or the counsellor might help?”', q: 'helpful', next: 'end_counsellor', why: 'Gently suggesting a trusted adult is caring, especially for big family changes. It’s still her choice.' },
        ],
      },
      n_others: {
        scene: 'hallway',
        lines: [N('By lunchtime, three people are whispering about why Zara was crying. Zara hears someone mention it.')],
        choices: [
          { id: 'sorry', t: 'Go to Zara: “I’m sorry. I was worried and asked around. That wasn’t okay.”', q: 'helpful', next: 'end_repair', why: 'Admitting your mistake honestly is the first step to fixing trust.' },
          { id: 'deny', t: 'Pretend you didn’t say anything.', q: 'unhelpful', next: 'end_stormy', why: 'Hiding what you did might feel safer, but if she finds out, it will hurt the friendship more.' },
        ],
      },
      end_bright: {
        scene: 'bench',
        lines: [
          L('zara', 'calm', 'Just… sitting with me helps. Thanks for not pushing.'),
          N('You keep her secret. Over the next weeks, Zara talks to you when she’s ready.'),
        ],
        end: {
          tone: 'bright',
          title: 'A safe friend',
          happened: 'You respected Zara’s boundary, stayed with her, and kept her private news private.',
          feel: 'Zara felt safe and supported, without feeling pressured.',
          why: 'A boundary is a line someone draws to feel safe. Respecting it shows you care about their comfort more than your curiosity.',
          try: ['Check in with a small message later: “Thinking of you.”'],
          reflect: 'What are some boundaries you have? How do you let people know about them?',
          note: 'Keeping secrets is not okay if someone is being hurt or is in danger. Then you should always tell a trusted adult.',
        },
      },
      end_counsellor: {
        scene: 'classroom',
        lines: [N('Zara thinks about it. A few days later, she tells you she talked to the school counsellor and it helped a lot.')],
        end: {
          tone: 'bright',
          title: 'Support from all sides',
          happened: 'You listened, kept her news private from friends, and gently pointed her towards a trusted adult.',
          feel: 'Zara felt cared for and less alone with something so big.',
          why: 'Friends are important, but some problems are big enough that adults can help too. Suggesting it kindly is a gift.',
          try: ['Keep being a friend who listens without pushing.'],
          reflect: 'Which adults could you suggest to a friend who is having a hard time?',
          note: 'If a friend tells you they are being hurt or are unsafe, always tell a trusted adult, even if they asked you not to.',
        },
      },
      end_repair: {
        scene: 'hallway',
        lines: [
          L('zara', 'calm', 'Thanks for saying sorry. I’m just having a hard time at home. I’ll tell you when I’m ready.'),
          L('you', 'calm', 'That’s okay. I’ll wait.'),
        ],
        end: {
          tone: 'bright',
          title: 'Trust rebuilt',
          happened: 'You made a mistake by pushing or asking around, then repaired it with an honest apology.',
          feel: 'Zara felt hurt and exposed at first, then respected when you apologised.',
          why: 'Everyone gets boundaries wrong sometimes. What matters is noticing and fixing it.',
          try: ['Next time, try: “Okay. I’m here if you want me.”'],
          reflect: 'Why do you think Zara didn’t want to talk right away?',
        },
      },
      end_mixed: {
        scene: 'hallway',
        lines: [N('You and Zara don’t talk for a few days. You both feel lonely and miss each other.')],
        end: {
          tone: 'mixed',
          title: 'Distance',
          happened: 'Zara needed space, but the space became a gap in the friendship.',
          feel: 'Zara feels alone with her problem. You feel shut out and confused.',
          why: 'When a friend says no, it usually isn’t about you. They might be protecting themselves from big feelings.',
          try: ['“I’m sorry I pushed. I’m still here for you.”', 'Do something kind without needing an explanation.'],
          reflect: 'How can you show someone you care without asking them to explain?',
        },
      },
      end_stormy: {
        scene: 'hallway',
        lines: [N('Zara finds out who started the whispers. She stops trusting you with anything personal.')],
        end: {
          tone: 'stormy',
          title: 'Broken trust',
          happened: 'Something private became public, and Zara found out where it came from.',
          feel: 'Zara feels betrayed and embarrassed. You feel guilty.',
          why: 'You were worried, which shows you care. But asking around about someone’s private feelings can hurt them badly.',
          try: ['Respect a friend’s “no”.', 'Offer to sit with them instead.', 'If you make a mistake, admit it honestly.'],
          reflect: 'Rewind and try respecting Zara’s boundary. What does she eventually share?',
        },
      },
    },
  },
  {
    id: 'friend-hardday',
    mode: 'friendship',
    title: 'Kofi’s Rough Day',
    blurb: 'Kofi snaps at you for no reason. Something seems wrong.',
    skills: ['friendship', 'empathy', 'calm'],
    minutes: 5,
    cast: ['kofi'],
    start: 'n1',
    requires: 'friend-boundaries',
    nodes: {
      n1: {
        scene: 'classroom',
        lines: [
          L('you', 'happy', 'Kofi! Want to do the maths puzzle together?'),
          L('kofi', 'angry', 'Leave me ALONE. Your puzzles are stupid.'),
          N('Ouch. Kofi has never spoken to you like that. He’s slumped at his desk, staring at nothing.'),
        ],
        choices: [
          { id: 'snap', t: '“Wow. YOU’RE stupid.”', q: 'unhelpful', next: 'n_snap', why: 'When someone snaps at us, snapping back is a natural reflex. But it turns his bad day into a fight.' },
          { id: 'notice', t: '“Okay. You don’t seem like yourself today. Is something wrong?”', q: 'helpful', next: 'n_notice', why: 'You noticed his behaviour was unusual and got curious instead of hurt. That takes real empathy.' },
          { id: 'space', t: 'Give him space and work on the puzzle alone.', q: 'mixed', next: 'n_space', why: 'Giving space is sometimes exactly what someone needs. But Kofi may not know you still care.' },
        ],
      },
      n_snap: {
        scene: 'classroom',
        lines: [
          N('Kofi puts his head down on the desk. His shoulders shake. He’s crying.'),
        ],
        choices: [
          { id: 'sorry', t: '“Hey, I’m sorry. I didn’t mean that. Are you okay?”', q: 'helpful', next: 'n_notice', why: 'Seeing him cry, you changed direction fast and apologised. Quick repair matters.' },
          { id: 'leave', t: 'Feel awkward and walk away.', q: 'mixed', next: 'end_mixed', why: 'Feeling awkward around sadness is very normal. But a small check-in could have helped a lot.' },
        ],
      },
      n_notice: {
        scene: 'classroom',
        lines: [
          L('kofi', 'sad', 'My dog, Simba, is really sick. The vet said he might not get better. I didn’t sleep last night.'),
          L('kofi', 'embarrassed', 'Sorry I was mean to you.'),
        ],
        choices: [
          { id: 'listen', t: '“That’s so hard. Simba is the best dog. Do you want to tell me about him?”', q: 'helpful', next: 'end_bright', why: 'Inviting him to talk about Simba shows you care about what he cares about.' },
          { id: 'fix', t: '“Don’t worry, he’ll be fine! Let’s do the puzzle to cheer you up.”', q: 'mixed', next: 'end_fixit', why: 'Wanting to cheer someone up is kind! But “don’t worry” can make people feel their worry isn’t allowed.' },
        ],
      },
      n_space: {
        scene: 'classroom',
        lines: [N('At break, Kofi sits alone on the steps, not playing football like usual.')],
        choices: [
          { id: 'sit', t: 'Sit near him: “I’m not going to bug you. I just thought you might want company.”', q: 'helpful', next: 'n_notice', why: 'Quiet company, with no pressure, can be the most comforting thing.' },
          { id: 'play', t: 'Go and play football without him.', q: 'mixed', next: 'end_mixed', why: 'You gave him the space he asked for. He might be feeling very alone right now, though.' },
        ],
      },
      end_bright: {
        scene: 'bench',
        lines: [
          L('kofi', 'calm', 'He used to steal my socks every morning…'),
          N('Kofi laughs a little through his tears. At home time, you give him a drawing of Simba. He keeps it in his bag for weeks.'),
        ],
        end: {
          tone: 'bright',
          title: 'Being there',
          happened: 'Instead of taking his snapping personally, you got curious, listened and let him share.',
          feel: 'Kofi felt worried and exhausted. You helped him feel less alone with his sadness.',
          why: 'When someone acts out of character, there’s often a hidden reason. Listening is often more helpful than fixing.',
          try: ['Check in again tomorrow.', 'Tell a teacher if you think Kofi needs extra support.'],
          reflect: 'When you’re having a bad day, what do you want from friends?',
        },
      },
      end_fixit: {
        scene: 'classroom',
        lines: [N('Kofi tries the puzzle, but he isn’t really there. “You don’t know he’ll be fine,” he mumbles.')],
        end: {
          tone: 'mixed',
          title: 'Trying to fix it',
          happened: 'You found out what was wrong and wanted to cheer Kofi up, but he wasn’t ready to be cheered up yet.',
          feel: 'Kofi felt like his worry was brushed aside, even though you meant well.',
          why: 'Sometimes people don’t need their feelings fixed. They need them heard. “That sounds hard” can be better than “don’t worry”.',
          try: ['“That sounds really scary. I’m sorry.”', '“Do you want to talk about Simba?”'],
          reflect: 'Why might “don’t worry” not help someone who is worried?',
        },
      },
      end_mixed: {
        scene: 'classroom',
        lines: [N('Kofi goes home quiet. You find out the next day that his dog was very sick. You wish you had asked.')],
        end: {
          tone: 'mixed',
          title: 'A missed moment',
          happened: 'Kofi was struggling with something big, and he got through the day alone.',
          feel: 'Kofi felt sad, tired and alone. Snapping at you was a sign that he was overwhelmed.',
          why: 'People who are hurting sometimes push others away. Gently checking in, even after being snapped at, can help.',
          try: ['“You don’t seem like yourself. Is something wrong?”', 'Sit with them quietly.'],
          reflect: 'Rewind and try noticing that Kofi isn’t himself. What do you find out?',
        },
      },
    },
  },
]
