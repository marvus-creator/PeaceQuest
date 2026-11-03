export const FEELINGS = [
  'happy', 'proud', 'excited', 'calm', 'hopeful', 'grateful',
  'sad', 'lonely', 'disappointed', 'hurt',
  'angry', 'frustrated', 'jealous',
  'scared', 'worried', 'nervous',
  'embarrassed', 'ashamed', 'guilty', 'confused', 'surprised', 'relieved',
]

export const EMPATHY_JOURNEYS = [
  {
    id: 'empathy-goal',
    mode: 'empathy',
    kind: 'empathy',
    title: 'The Missed Save',
    blurb: 'The team lost the final. Zara and Kofi see it very differently.',
    skills: ['empathy', 'emotions', 'friendship'],
    minutes: 6,
    steps: [
      { type: 'scene', scene: 'field', who: 'narrator', title: 'What happened', text: [
        'It was the inter-school football final. One minute left, score 1–1.',
        'The other team took a shot. Zara, the goalkeeper, dived… and the ball slipped through her gloves. Your school lost 2–1.',
        'Afterwards, Kofi kicked his water bottle and shouted, “We had it! Why didn’t you catch it?” Zara walked off without saying anything.',
      ] },
      { type: 'perspective', who: 'kofi', emotion: 'frustrated', title: 'Kofi’s side', text: [
        'I trained every day for this final. Every single day, even when it rained.',
        'My big brother came to watch. He never comes to my games. I really wanted him to see us win.',
        'When the ball went in, I felt like all that work was for nothing. I didn’t mean to shout at Zara. It just came out.',
      ] },
      { type: 'feel', who: 'kofi', prompt: 'How might Kofi be feeling? Pick all that fit.', likely: ['disappointed', 'frustrated', 'angry', 'embarrassed', 'guilty', 'sad'], insight: 'Kofi’s anger was covering disappointment. He badly wanted his brother to see him win. Afterwards he probably felt guilty for shouting.' },
      { type: 'perspective', who: 'zara', emotion: 'sad', title: 'Zara’s side', text: [
        'I saw the ball coming. I was sure I had it. Then it just… slipped.',
        'Everyone went quiet. Then Kofi shouted. I couldn’t look at anyone.',
        'I keep replaying it in my head. I don’t think I want to be goalkeeper anymore.',
      ] },
      { type: 'feel', who: 'zara', prompt: 'How might Zara be feeling? Pick all that fit.', likely: ['ashamed', 'sad', 'embarrassed', 'hurt', 'disappointed', 'lonely'], insight: 'Zara feels like she let everyone down, and being shouted at made it hurt even more. She might be thinking about quitting.' },
      { type: 'choice', prompt: 'You’re on the team. What could you do now?', options: [
        { t: 'Find Zara and say: “That save was really hard. We lost as a team, not because of you.”', q: 'helpful', why: 'Reminding Zara that the whole team shares the result helps her shame shrink.' },
        { t: 'Talk to Kofi: “I know you’re upset. Maybe you could tell Zara you didn’t mean it?”', q: 'helpful', why: 'Helping Kofi see Zara’s side, without blaming him, can lead to a real apology.' },
        { t: 'Agree with Kofi: “Yeah, she should have caught it.”', q: 'unhelpful', why: 'Blaming one person for a team result makes them feel alone and leaves out everything else that happened in the match.' },
        { t: 'Leave them both alone. It’s their problem.', q: 'mixed', why: 'Giving people space can help, but both of them might need a friend right now.' },
      ] },
      { type: 'insight', text: 'Two people can feel very different things about the same moment. Kofi’s anger and Zara’s shame both came from caring about the game. When we look underneath someone’s reaction, we often find a feeling we recognise.' },
    ],
    reflect: 'Have you ever reacted angrily when you were really disappointed? What was underneath?',
  },
  {
    id: 'empathy-model',
    mode: 'empathy',
    kind: 'empathy',
    title: 'The Broken Model',
    blurb: 'Sam’s science model is broken. Ira knows how, and she’s scared to tell.',
    skills: ['empathy', 'decisions', 'communication'],
    minutes: 6,
    requires: 'empathy-goal',
    steps: [
      { type: 'scene', scene: 'classroom', who: 'narrator', title: 'What happened', text: [
        'Sam spent two weeks building a model of the solar system for the science fair. It had tiny painted planets on wires.',
        'On Friday morning, Sam found it on the floor. Saturn was snapped off and Jupiter was cracked.',
        'Sam started crying. Ira, who sits next to Sam, went very quiet.',
      ] },
      { type: 'perspective', who: 'sam', emotion: 'sad', title: 'Sam’s side', text: [
        'I worked on it every evening. My grandad helped me paint the rings on Saturn.',
        'The science fair is on Monday. I don’t have time to fix it all.',
        'Someone must have done this. Why wouldn’t they just tell me?',
      ] },
      { type: 'feel', who: 'sam', prompt: 'How might Sam be feeling?', likely: ['sad', 'hurt', 'angry', 'worried', 'disappointed', 'confused'], insight: 'Sam is grieving something he worked really hard on, worried about Monday, and confused about why nobody has said anything.' },
      { type: 'perspective', who: 'ira', emotion: 'scared', title: 'Ira’s side', text: [
        'Yesterday after school I was getting my bag, and my coat sleeve caught on Saturn. The model fell.',
        'I panicked. I put it back on the desk and ran home. I didn’t sleep all night.',
        'Now Sam is crying and everyone wants to know who did it. If I tell, everyone will think I did it on purpose.',
      ] },
      { type: 'feel', who: 'ira', prompt: 'How might Ira be feeling?', likely: ['guilty', 'scared', 'ashamed', 'worried', 'nervous', 'sad'], insight: 'Ira feels terrible. The longer she waits, the scarier telling feels. She’s worried people will think it was on purpose.' },
      { type: 'choice', prompt: 'If you were Ira, what would you do?', options: [
        { t: 'Tell Sam privately what happened, say sorry, and offer to help fix it this weekend.', q: 'helpful', why: 'Telling the truth is scary, but it helps Sam stop wondering and shows Ira takes responsibility.' },
        { t: 'Tell Ms. Uwase first, and ask her to help you tell Sam.', q: 'helpful', why: 'Getting an adult’s support makes a hard conversation feel safer. There’s more than one good path.' },
        { t: 'Stay quiet. It was an accident, so it doesn’t count.', q: 'unhelpful', why: 'Accidents aren’t anyone’s fault, but hiding one leaves Sam hurt and confused, and the guilt usually grows.' },
      ] },
      { type: 'scene', scene: 'classroom', who: 'narrator', title: 'What could happen next', text: [
        'When Ira finally tells Sam, he’s quiet for a moment. Then he says, “I thought someone hated me. An accident is… better. Will you help me fix Saturn?”',
        'They spend Saturday at Sam’s house with his grandad, gluing rings back on. The model is ready for Monday.',
      ] },
      { type: 'insight', text: 'Sometimes the person who did something wrong is hurting too. Understanding Ira’s fear doesn’t make Sam’s sadness less real. Empathy means holding both.' },
    ],
    reflect: 'Why do you think it’s hard to admit an accident? What helps make it easier?',
  },
  {
    id: 'empathy-newcountry',
    mode: 'empathy',
    kind: 'empathy',
    title: 'Words That Don’t Fit',
    blurb: 'Mei is learning a new language. Leo thinks she’s being unfriendly.',
    skills: ['empathy', 'friendship', 'emotions'],
    minutes: 6,
    requires: 'empathy-model',
    steps: [
      { type: 'scene', scene: 'classroom', who: 'narrator', title: 'What happened', text: [
        'Mei moved here from another country two months ago. She is still learning the language.',
        'In group work, Leo asked Mei a question three times. She only nodded or shrugged.',
        'Leo whispered to the group: “She never talks to us. I think she thinks she’s better than us.”',
      ] },
      { type: 'perspective', who: 'leo', emotion: 'frustrated', title: 'Leo’s side', text: [
        'I really tried to include her! I asked her what she thought about our poster.',
        'She just shrugged. It felt like she didn’t care about our group.',
        'When people don’t answer me, I feel like I did something wrong.',
      ] },
      { type: 'feel', who: 'leo', prompt: 'How might Leo be feeling?', likely: ['frustrated', 'confused', 'hurt', 'embarrassed'], insight: 'Leo was trying to be kind, so being ignored felt like rejection. He filled the silence with a guess.' },
      { type: 'perspective', who: 'mei', emotion: 'nervous', title: 'Mei’s side', text: [
        'Leo talks really fast. I understood “poster” but not the rest.',
        'At my old school I was the one who always answered questions. Here I feel like I can’t say anything right.',
        'I heard Leo whisper something. I didn’t understand the words, but I understood the look.',
      ] },
      { type: 'feel', who: 'mei', prompt: 'How might Mei be feeling?', likely: ['lonely', 'embarrassed', 'frustrated', 'nervous', 'sad', 'hurt'], insight: 'Mei feels frustrated with herself, nervous to speak, and hurt that people might think she’s unfriendly. She misses feeling clever.' },
      { type: 'choice', prompt: 'You’re in the group. What would help most?', options: [
        { t: 'Gently tell Leo: “I think she might not understand yet. She’s still learning the language.”', q: 'helpful', why: 'Sharing a different explanation can change how Leo sees the situation.' },
        { t: 'Point at the poster and ask Mei slowly: “Do you want to draw or write?”', q: 'helpful', why: 'Speaking slowly and using gestures helps Mei join in. There’s more than one good answer.' },
        { t: 'Laugh along with Leo’s whisper.', q: 'unhelpful', why: 'Laughing along makes Mei feel even more alone, and spreads an unfair idea about her.' },
        { t: 'Do Mei’s part of the poster for her.', q: 'mixed', why: 'It’s meant to help, but it might make Mei feel like nobody thinks she can do it.' },
      ] },
      { type: 'scene', scene: 'classroom', who: 'narrator', title: 'What could happen next', text: [
        'Mei picks the pencils and draws an amazing border for the poster. Leo’s eyes go wide. “Whoa. You’re really good!”',
        'Mei smiles and says carefully, “Thank you. Talk… slow, please?” Leo nods. “Sorry. I can do that.”',
      ] },
      { type: 'insight', text: 'When someone doesn’t react the way we expect, our brains guess a reason, and the guess is often wrong. Asking, slowing down and imagining their side helps us find the real reason.' },
    ],
    reflect: 'Think of a time someone misunderstood you. What did you wish they knew?',
  },
]
