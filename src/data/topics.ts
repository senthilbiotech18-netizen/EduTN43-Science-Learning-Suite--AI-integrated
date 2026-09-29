import { Topic } from '../types';
import { ORGANELLES } from './questions';
import { TOPIC_SET_1 } from './topics/topicSet1';
import { TOPIC_SET_2 } from './topics/topicSet2';
import { TOPIC_SET_3 } from './topics/topicSet3';

const CORE_TOPICS: Topic[] = [
  {
    id: 'cell-organelles-structures',
    title: 'Cell Structure & Organelles',
    level: 'PYP to MYP 5',
    subject: 'Biology',
    description: 'Scaffolded from basic cell observation to organelle interactions, plant vs. animal cell structures, and diagnostic scenarios.',
    badgeColor: '#2F855A',
    icon: 'Microscope',
    organelles: ORGANELLES,
    questions: [
      {
        id: 1,
        strand: 'i',
        prompt: 'What is a cell, and why are cells called the "building blocks of life"?',
        target: 'A cell is the smallest basic unit of all living things. Just like bricks build a house, cells build up all plants, animals, and humans.',
        hint: 'Think of tiny bricks that build all living organisms.'
      },
      {
        id: 2,
        strand: 'i',
        prompt: 'What is the main job of the cell membrane that surrounds a cell?',
        target: 'Acts like a flexible protective skin that controls what enters (nutrients, water) and what leaves (wastes).',
        hint: 'Think of a school security gate controlling who enters and leaves.'
      },
      {
        id: 3,
        strand: 'i',
        prompt: 'Where is the "brain" or control center of the cell located, and what is it called?',
        target: 'The nucleus is the control center that directs cell activities and stores genetic instructions (DNA).',
        hint: 'Name the central part that holds instructions for the cell.'
      },
      {
        id: 4,
        strand: 'i',
        prompt: 'What is the squishy, jelly-like fluid called that fills up the inside of a cell?',
        target: 'Cytoplasm (cytosol) is the watery jelly where cell parts float and chemical reactions take place.',
        hint: 'Think of the jelly medium inside the cell membrane.'
      },
      {
        id: 5,
        strand: 'i',
        prompt: 'Why do plant leaves have a green color, and what special organelle lets plants make food using sunlight?',
        target: 'Chloroplasts contain green chlorophyll pigment that absorbs sunlight energy to make glucose food through photosynthesis.',
        hint: 'Name the green plant organelle that captures sunlight.'
      },
      {
        id: 6,
        strand: 'i',
        prompt: 'What extra outer layer gives plant cells a firm, boxy shape, and what tough carbohydrate is it made of?',
        target: 'The cell wall is a rigid outer boundary made of cellulose that supports and protects plant cells.',
        hint: 'Identify the tough carbohydrate wall outside a plant cell membrane.'
      },
      {
        id: 7,
        strand: 'i',
        prompt: 'How does a plant\'s large central vacuole help keep a plant stem standing tall without wilting?',
        target: 'It stores water and cell sap, pushing outward against the rigid cell wall (turgor pressure) to keep the plant firm.',
        hint: 'Think of a full water balloon inside a cardboard box pushing the sides outwards.'
      },
      {
        id: 8,
        strand: 'i',
        prompt: 'What organelle is known as the "powerhouse" of the cell, and what process releases energy inside it?',
        target: 'Mitochondria perform cellular respiration to break down glucose and oxygen, releasing usable energy (ATP) for the cell.',
        hint: 'Name the energy-releasing power station in cells.'
      },
      {
        id: 9,
        strand: 'i',
        prompt: 'What do tiny ribosomes do in the cell, and where can they be found floating or attached?',
        target: 'Ribosomes synthesize (make) proteins for the cell. They float freely in cytoplasm or attach to the Rough Endoplasmic Reticulum.',
        hint: 'Think of protein-making factories.'
      },
      {
        id: 10,
        strand: 'i',
        prompt: 'Describe how the Rough Endoplasmic Reticulum and Golgi apparatus work together like a factory packaging system.',
        target: 'Rough ER folds and transports new proteins to Golgi bodies, which modify, sort, package, and ship them in vesicles.',
        hint: 'Trace the path from protein folding in ER to packaging in Golgi.'
      },
      {
        id: 11,
        strand: 'i',
        prompt: 'What would happen inside an animal cell if its lysosomes accidentally ruptured and released their enzymes?',
        target: 'Lysosomal digestive enzymes would break down and digest the cell\'s own proteins and organelles (self-destruction / autolysis).',
        hint: 'Lysosomal enzymes digest cellular contents when leaked.'
      },
      {
        id: 12,
        strand: 'ii',
        prompt: 'Scenario: A houseplant goes unwatered for 4 days and wilts. Explain what happens inside plant cells at the vacuole level, and predict what happens when you water it.',
        target: 'Water loss empties the central vacuole, reducing turgor pressure against the cell wall and causing wilting. Watering refills vacuoles, restoring turgor pressure so the stem stands firm again.',
        hint: 'Connect water loss in vacuoles to lost turgor pressure and wilting.'
      }
    ]
  },
  {
    id: 'cell-metabolism-systems',
    title: 'Cell Metabolism & Organelle Systems',
    level: 'PYP to MYP 5',
    subject: 'Biology',
    description: 'Scaffolded from basic cell energy needs to biochemical pathways, membrane permeability, and diagnostic organelle failure scenarios.',
    badgeColor: '#A8425A',
    icon: 'Dna',
    organelles: ORGANELLES,
    questions: [
      {
        id: 1,
        strand: 'i',
        prompt: 'Why do all living cells need energy, and where do human cells get their energy from?',
        target: 'Cells need energy to grow, move, repair, and stay alive. Human cells get energy by breaking down food (glucose) that we eat.',
        hint: 'Think about eating food to get energy for your body.'
      },
      {
        id: 2,
        strand: 'i',
        prompt: 'What basic substances do plant cells take in from their environment to stay alive and grow?',
        target: 'Plants take in sunlight, water from soil, and carbon dioxide gas from air.',
        hint: 'Name the three basic inputs plants need to grow.'
      },
      {
        id: 3,
        strand: 'i',
        prompt: 'What is the difference between single-celled organisms (like bacteria) and multicellular organisms (like humans)?',
        target: 'Single-celled organisms consist of only one cell that does all jobs. Multicellular organisms have millions of specialized cells working together.',
        hint: 'One cell doing everything vs many specialized cells working as a team.'
      },
      {
        id: 4,
        strand: 'i',
        prompt: 'What does it mean that the cell membrane is "selectively permeable"?',
        target: 'It selectively controls which substances (like water and oxygen) can enter or exit while blocking harmful or unwanted molecules.',
        hint: 'Think of a security filter that lets helpful things through but blocks harmful things.'
      },
      {
        id: 5,
        strand: 'i',
        prompt: 'Explain why mitochondria are called "energy converters" rather than "energy creators".',
        target: 'Energy cannot be created from nothing (Law of Conservation of Energy); mitochondria convert stored chemical energy in glucose into usable ATP energy.',
        hint: 'Energy cannot be created from scratch—it is transformed from food.'
      },
      {
        id: 6,
        strand: 'i',
        prompt: 'How do muscle cells compare to skin cells in the number of mitochondria they contain, and why?',
        target: 'Muscle cells have many more mitochondria because muscle contraction requires a constant high supply of ATP energy.',
        hint: 'Relate high energy requirements for movement to having more mitochondria.'
      },
      {
        id: 7,
        strand: 'i',
        prompt: 'What are the structural and functional differences between Rough ER and Smooth ER?',
        target: 'Rough ER has ribosomes on its surface and folds/transports proteins. Smooth ER lacks ribosomes, synthesizes lipids, and detoxifies chemicals.',
        hint: 'Rough ER makes/folds proteins; Smooth ER makes lipids and breaks down toxins.'
      },
      {
        id: 8,
        strand: 'i',
        prompt: 'How does the nucleolus inside the nucleus support protein synthesis throughout the cell?',
        target: 'The nucleolus produces ribosomal RNA (rRNA) and assembles ribosome subunits, which are needed to build proteins.',
        hint: 'The nucleolus builds the ribosome factories that assemble proteins.'
      },
      {
        id: 9,
        strand: 'i',
        prompt: 'Trace the path of a protein hormone (like insulin) from genetic code to secretion out of the cell.',
        target: 'DNA code in nucleus → mRNA translated by ribosome on Rough ER → folded in ER → packaged in vesicle to Golgi → modified and shipped in secretory vesicle to membrane for export.',
        hint: 'Nucleus → Ribosome on Rough ER → Golgi → Vesicle → Cell Membrane.'
      },
      {
        id: 10,
        strand: 'i',
        prompt: 'Why do human liver cells contain extensive networks of Smooth Endoplasmic Reticulum when processing medications or alcohol?',
        target: 'Smooth ER contains specialized enzymes that chemically break down and neutralize toxic compounds and drugs into harmless excretable forms.',
        hint: 'Smooth ER neutralizes toxins and processes medications.'
      },
      {
        id: 11,
        strand: 'ii',
        prompt: 'Scenario: A genetic defect prevents Golgi vesicles from fusing with the cell membrane. How does this impact hormone delivery and cell health?',
        target: 'Proteins and hormones cannot be secreted outside the cell, causing built-up toxic waste in Golgi vesicles, signaling failure in the body, and eventual cell damage.',
        hint: 'Without vesicle fusion, hormones cannot leave the cell.'
      },
      {
        id: 12,
        strand: 'ii',
        prompt: 'Scenario: A toxin inhibits mitochondrial ATP production. Explain the immediate impact on active transport pumps in the cell membrane.',
        target: 'Without ATP, active transport pumps (like Na+/K+ pumps) lose energy and stop working, causing ionic imbalance, cell swelling, and cell breakdown.',
        hint: 'No ATP causes active transport pumps across the membrane to fail.'
      }
    ]
  },
  {
    id: 'photosynthesis-respiration',
    title: 'Photosynthesis & Cellular Respiration',
    level: 'PYP to MYP 5',
    subject: 'Biology',
    description: 'Scaffolded from basic plant requirements to chemical equations, limiting factors, anaerobic respiration, and greenhouse optimizations.',
    badgeColor: '#38A169',
    icon: 'Leaf',
    questions: [
      {
        id: 1,
        strand: 'i',
        prompt: 'Where do plants get their food, and how is this different from animals?',
        target: 'Plants make their own food (glucose) using sunlight, water, and carbon dioxide. Animals cannot make food and must eat plants or other animals.',
        hint: 'Plants make food using sunlight; animals must eat food.'
      },
      {
        id: 2,
        strand: 'i',
        prompt: 'What gas do plants take in from the air to make food, and what gas do they release that we breathe?',
        target: 'Plants take in carbon dioxide gas and release oxygen gas.',
        hint: 'Plants absorb CO2 and release oxygen.'
      },
      {
        id: 3,
        strand: 'i',
        prompt: 'What is the name of the green pigment in leaves that catches sunlight?',
        target: 'Chlorophyll is the green pigment in chloroplasts that absorbs light energy.',
        hint: 'Name the green pigment in plant leaves.'
      },
      {
        id: 4,
        strand: 'i',
        prompt: 'Write the simple word equation for photosynthesis.',
        target: 'Carbon dioxide + Water + Sunlight --> Glucose + Oxygen.',
        hint: 'Reactants: Carbon dioxide + Water; Products: Glucose + Oxygen.'
      },
      {
        id: 5,
        strand: 'i',
        prompt: 'What is cellular respiration, and why do both plants and animals need to perform it?',
        target: 'Cellular respiration breaks down glucose food with oxygen to release energy (ATP) needed for all living processes.',
        hint: 'Breaking down food with oxygen to release energy for living.'
      },
      {
        id: 6,
        strand: 'i',
        prompt: 'Write the word equation for aerobic cellular respiration.',
        target: 'Glucose + Oxygen --> Carbon dioxide + Water + Energy (ATP).',
        hint: 'Glucose + Oxygen yields Carbon dioxide + Water + Energy.'
      },
      {
        id: 7,
        strand: 'i',
        prompt: 'How do microscopic pores (stomata) on leaves open and close to control gas exchange and water loss?',
        target: 'Guard cells swell with water to open stomata for CO2 entry, and shrink to close stomata during drought to prevent drying out.',
        hint: 'Guard cells swell to open pores and shrink to close them.'
      },
      {
        id: 8,
        strand: 'i',
        prompt: 'What happens in human muscle cells during intense sprinting when oxygen runs low (anaerobic respiration)?',
        target: 'Glucose is broken down without oxygen into lactic acid, producing a small amount of ATP energy and causing muscle fatigue.',
        hint: 'Glucose breaks down into lactic acid without oxygen.'
      },
      {
        id: 9,
        strand: 'i',
        prompt: 'How do light intensity, temperature, and carbon dioxide levels act as limiting factors for photosynthesis?',
        target: 'If any one factor is in short supply, it limits the maximum rate of photosynthesis, even if other factors are abundant.',
        hint: 'The factor in shortest supply limits the total reaction rate.'
      },
      {
        id: 10,
        strand: 'i',
        prompt: 'Compare the energy (ATP) yield and end products of aerobic versus anaerobic respiration.',
        target: 'Aerobic uses oxygen to yield ~36 ATP, CO2, and water. Anaerobic yields only 2 ATP plus lactic acid (humans) or ethanol/CO2 (yeast).',
        hint: 'Aerobic yields high ATP (~36) + CO2/water; Anaerobic yields low ATP (2) + lactic acid or ethanol.'
      },
      {
        id: 11,
        strand: 'ii',
        prompt: 'Scenario: A plant is kept in a completely dark room for two weeks with water. Explain why its glucose and starch reserves vanish.',
        target: 'In darkness, photosynthesis stops (no light to make glucose), but respiration continues 24/7 to keep cells alive, consuming all stored starch reserves.',
        hint: 'No light stops photosynthesis, but respiration continues day and night.'
      },
      {
        id: 12,
        strand: 'ii',
        prompt: 'Scenario: A commercial greenhouse grower wants maximum tomato yield in winter. Explain how balancing grow lights, CO2 gas burners, and temperature yields top growth.',
        target: 'Increasing light and CO2 supplies key reactants, while warming temperature boosts photosynthetic enzyme activity to its optimum, maximizing glucose production and crop growth.',
        hint: 'Combine light energy, CO2 reactants, and optimum temperature for enzymes.'
      }
    ]
  },
  {
    id: 'atomic-structure',
    title: 'Atomic Structure & Periodic Table',
    level: 'PYP to MYP 5',
    subject: 'Chemistry',
    description: 'Scaffolded from subatomic particle identification to electron shell configurations, Periodic Table trends, and chemical bonding mechanisms.',
    badgeColor: '#DD6B20',
    icon: 'Atom',
    questions: [
      {
        id: 1,
        strand: 'i',
        prompt: 'What is an atom, and what are all objects in the universe made of?',
        target: 'An atom is a tiny building block of matter. Everything around us—air, water, rocks, and living things—is made of atoms.',
        hint: 'Atoms are tiny particles that build everything.'
      },
      {
        id: 2,
        strand: 'i',
        prompt: 'Name the three tiny parts (subatomic particles) found inside an atom.',
        target: 'Protons, Neutrons, and Electrons.',
        hint: 'Protons, neutrons, and electrons.'
      },
      {
        id: 3,
        strand: 'i',
        prompt: 'Which subatomic particles sit in the central nucleus, and which orbit on the outside?',
        target: 'Protons and neutrons are in the central nucleus; electrons orbit outside in electron shells.',
        hint: 'Protons and neutrons in nucleus; electrons on outside.'
      },
      {
        id: 4,
        strand: 'i',
        prompt: 'State the electric charges of protons, neutrons, and electrons.',
        target: 'Protons have a positive (+1) charge, neutrons have no charge (0), and electrons have a negative (-1) charge.',
        hint: 'Proton = positive, Neutron = neutral, Electron = negative.'
      },
      {
        id: 5,
        strand: 'i',
        prompt: 'Why does an uncharged atom have no overall electrical charge (neutral)?',
        target: 'Because the number of positive protons equals the number of negative electrons, balancing the charge to zero.',
        hint: 'Positive protons equal negative electrons.'
      },
      {
        id: 6,
        strand: 'i',
        prompt: 'What does the atomic number tell us about an element?',
        target: 'Atomic number is the number of protons in an atom\'s nucleus. It identifies the element on the Periodic Table.',
        hint: 'Atomic number = number of protons.'
      },
      {
        id: 7,
        strand: 'i',
        prompt: 'Explain the electron shell rule for the first 20 elements (maximum capacity of shells 1, 2, and 3).',
        target: 'Shell 1 holds up to 2 electrons, Shell 2 holds up to 8, and Shell 3 holds up to 8.',
        hint: '2 in 1st shell, 8 in 2nd shell, 8 in 3rd shell.'
      },
      {
        id: 8,
        strand: 'i',
        prompt: 'How do Group numbers and Period numbers on the Periodic Table relate to electron arrangements?',
        target: 'Group number equals the number of valence (outer shell) electrons. Period number equals the total number of occupied electron shells.',
        hint: 'Group = valence electrons; Period = number of shells.'
      },
      {
        id: 9,
        strand: 'i',
        prompt: 'What is an ion, and how does a sodium atom (2,8,1) become a positive sodium ion (Na+)?',
        target: 'An ion is a charged atom. Sodium loses its 1 outer electron to get a full stable shell, leaving 11 positive protons and 10 negative electrons (+1 charge).',
        hint: 'Losing 1 negative electron leaves a net +1 charge.'
      },
      {
        id: 10,
        strand: 'i',
        prompt: 'Explain how an ionic bond forms between Sodium (Na) and Chlorine (Cl).',
        target: 'Sodium transfers 1 valence electron to Chlorine. Na becomes Na+ and Cl becomes Cl-. Opposite electrostatic charges attract tightly to form NaCl.',
        hint: 'Electron transfer creates Na+ and Cl- which attract each other.'
      },
      {
        id: 11,
        strand: 'i',
        prompt: 'Why do two Hydrogen non-metal atoms form a shared covalent bond rather than an ionic bond?',
        target: 'Both non-metal hydrogen atoms need 1 electron to complete their shell. Neither donates an electron, so they share a pair of electrons.',
        hint: 'Both non-metals need electrons, so they share a pair.'
      },
      {
        id: 12,
        strand: 'ii',
        prompt: 'Scenario: Compare Chlorine (Group 17, 2,8,7) and Argon (Group 18, 2,8,8). Explain why chlorine reacts vigorously while argon is completely inert.',
        target: 'Chlorine needs 1 electron to reach a stable full outer shell, driving high reactivity. Argon already has a complete full octet, so it does not gain, lose, or share electrons.',
        hint: 'Chlorine actively seeks 1 electron; Argon already has a full outer shell.'
      }
    ]
  },
  {
    id: 'chemical-reactions',
    title: 'Chemical Reactions & Conservation of Mass',
    level: 'PYP to MYP 5',
    subject: 'Chemistry',
    description: 'Scaffolded from physical vs. chemical changes to reaction indicators, pH scale, collision theory, and reaction rate optimization.',
    badgeColor: '#C53030',
    icon: 'FlaskConical',
    questions: [
      {
        id: 1,
        strand: 'i',
        prompt: 'What is the difference between a physical change (like melting ice) and a chemical reaction (like burning wood)?',
        target: 'Physical changes do not create new substances and can usually be undone. Chemical reactions form new substances with different properties.',
        hint: 'Physical = no new substance; Chemical = new substance formed.'
      },
      {
        id: 2,
        strand: 'i',
        prompt: 'List three clues that tell you a chemical reaction is taking place.',
        target: 'Gas bubbles forming, color change, temperature change (getting hot or cold), or a new solid precipitate forming.',
        hint: 'Bubbles, color change, heat/temperature change.'
      },
      {
        id: 3,
        strand: 'i',
        prompt: 'What do we call starting substances in a reaction, and what do we call the new substances made?',
        target: 'Starting substances are reactants; new substances made are products.',
        hint: 'Reactants at start; products at end.'
      },
      {
        id: 4,
        strand: 'i',
        prompt: 'What is the Law of Conservation of Mass in a chemical reaction?',
        target: 'Mass is never created or destroyed in a chemical reaction. Total mass of reactants equals total mass of products.',
        hint: 'Total mass stays the same before and after reaction.'
      },
      {
        id: 5,
        strand: 'i',
        prompt: 'What is the difference between an exothermic reaction and an endothermic reaction?',
        target: 'Exothermic releases heat energy (temperature rises). Endothermic absorbs heat energy (temperature drops).',
        hint: 'Exo = releases heat/gets warmer; Endo = absorbs heat/gets cooler.'
      },
      {
        id: 6,
        strand: 'i',
        prompt: 'What does the pH scale measure, and what pH values represent acids, neutral substances, and bases?',
        target: 'pH measures acidity/alkalinity from 0 to 14. Acids: pH < 7. Neutral: pH = 7. Bases/Alkalis: pH > 7.',
        hint: 'Acids < 7, Neutral = 7, Bases > 7.'
      },
      {
        id: 7,
        strand: 'i',
        prompt: 'What two products are formed when an acid reacts with a base (neutralization)?',
        target: 'Salt and Water.',
        hint: 'Acid + Base forms Salt and Water.'
      },
      {
        id: 8,
        strand: 'i',
        prompt: 'According to collision theory, how does raising temperature speed up a chemical reaction?',
        target: 'Higher temperature gives particles more kinetic energy to move faster, causing more frequent and energetic successful collisions.',
        hint: 'Particles move faster, colliding more often with higher energy.'
      },
      {
        id: 9,
        strand: 'i',
        prompt: 'Why does a powdered reactant react much faster than a solid chunk of the same mass?',
        target: 'Powder has a much larger surface area exposed to other reactant particles, increasing the rate of collisions per second.',
        hint: 'Larger surface area means more collisions per second.'
      },
      {
        id: 10,
        strand: 'i',
        prompt: 'Balance the chemical equation: H2 + O2 --> H2O.',
        target: '2H2 + O2 --> 2H2O (4 Hydrogen atoms and 2 Oxygen atoms on both sides).',
        hint: '2 molecules of H2 + 1 O2 gives 2 H2O.'
      },
      {
        id: 11,
        strand: 'ii',
        prompt: 'Scenario: Alka-Seltzer dissolves in an open beaker on a scale, and the reading drops from 150g to 148g. Does this break the Law of Conservation of Mass? Explain.',
        target: 'No. Carbon dioxide gas was produced and escaped into the room air. In a closed sealed container, mass remains exactly 150g.',
        hint: 'Escaped gas carries mass into the air; law is not broken.'
      },
      {
        id: 12,
        strand: 'ii',
        prompt: 'Scenario: Antacid tablets contain magnesium hydroxide. Explain how taking an antacid neutralizes excess stomach acid to relieve heartburn.',
        target: 'Magnesium hydroxide (base) neutralizes excess hydrochloric acid (acid) in the stomach, producing harmless salt and water and raising stomach pH to safe levels.',
        hint: 'Base neutralizes stomach acid into salt and water, raising pH.'
      }
    ]
  },
  {
    id: 'forces-motion',
    title: 'Forces, Motion & Newton\'s Laws',
    level: 'PYP to MYP 5',
    subject: 'Physics',
    description: 'Scaffolded from pushes and pulls to speed calculations, balanced/unbalanced forces, Newton\'s 3 Laws, and collision safety analysis.',
    badgeColor: '#3182CE',
    icon: 'Zap',
    questions: [
      {
        id: 1,
        strand: 'i',
        prompt: 'What is a force, and what two simple actions describe forces?',
        target: 'A force is a push or a pull that can change how an object moves or changes shape.',
        hint: 'A push or a pull.'
      },
      {
        id: 2,
        strand: 'i',
        prompt: 'Give one example of a contact force (touching) and one non-contact force (acting from a distance).',
        target: 'Contact force: Friction or pushing a door. Non-contact force: Gravity or magnetic pull.',
        hint: 'Pushing touches; gravity/magnetism works from a distance.'
      },
      {
        id: 3,
        strand: 'i',
        prompt: 'What happens to a toy car if you apply balanced forces (equal pushes in opposite directions)?',
        target: 'The car does not change its motion—it stays at rest or keeps moving at the same steady speed.',
        hint: 'Equal pushes cancel out, so motion does not change.'
      },
      {
        id: 4,
        strand: 'i',
        prompt: 'Write the formula for Speed, and calculate the speed of a runner who runs 100 meters in 10 seconds.',
        target: 'Speed = Distance / Time. Speed = 100 m / 10 s = 10 m/s.',
        hint: 'Speed = Distance divided by Time.'
      },
      {
        id: 5,
        strand: 'i',
        prompt: 'What is the difference between speed and velocity?',
        target: 'Speed measures how fast something moves. Velocity is speed in a specific direction (e.g., 50 km/h North).',
        hint: 'Velocity includes speed plus direction.'
      },
      {
        id: 6,
        strand: 'i',
        prompt: 'State Newton\'s First Law of Motion (Law of Inertia).',
        target: 'An object stays at rest or moves at constant velocity in a straight line unless acted upon by an unbalanced external force.',
        hint: 'Objects resist changes in motion unless pushed by an unbalanced force.'
      },
      {
        id: 7,
        strand: 'i',
        prompt: 'State Newton\'s Second Law as an equation (F = m · a) and explain how mass affects acceleration.',
        target: 'Force = Mass × Acceleration. Heavier mass requires more force to accelerate at the same rate.',
        hint: 'F = m * a. More mass means slower acceleration for the same force.'
      },
      {
        id: 8,
        strand: 'i',
        prompt: 'State Newton\'s Third Law of Motion regarding force pairs.',
        target: 'For every action force, there is an equal and opposite reaction force.',
        hint: 'Equal and opposite reaction force.'
      },
      {
        id: 9,
        strand: 'i',
        prompt: 'What is friction, and why is it helpful for walking but harmful inside a car engine?',
        target: 'Friction opposes sliding motion. Helpful: gives shoe soles grip so we do not slip. Harmful: creates heat and wears out moving engine parts.',
        hint: 'Grip for walking vs heat and wear in engines.'
      },
      {
        id: 10,
        strand: 'i',
        prompt: 'Distinguish between Kinetic Energy (KE) and Gravitational Potential Energy (GPE).',
        target: 'Kinetic energy is energy of motion (depends on mass and velocity). GPE is stored energy due to height in a gravitational field.',
        hint: 'KE is energy of motion; GPE is stored energy from height.'
      },
      {
        id: 11,
        strand: 'ii',
        prompt: 'Scenario: A car moving at 60 km/h stops suddenly. Explain why unbelted passengers continue moving forward using Newton\'s First Law.',
        target: 'Due to inertia, the passenger\'s body continues moving forward at 60 km/h until an external force (seatbelt or dashboard) stops them.',
        hint: 'Inertia keeps the body moving forward at 60 km/h.'
      },
      {
        id: 12,
        strand: 'ii',
        prompt: 'Scenario: Explain how a rocket engine launching into space demonstrates Newton\'s Third Law.',
        target: 'Rocket engines push hot exhaust gas downward (action force). The exhaust gas exerts an equal and opposite upward force on the rocket (reaction force), pushing it into space.',
        hint: 'Action: gas pushed down. Reaction: rocket pushed up.'
      }
    ]
  },
  {
    id: 'ecosystems-matter',
    title: 'Ecosystems & Cycling of Matter',
    level: 'PYP to MYP 5',
    subject: 'Environmental Science',
    description: 'Scaffolded from living communities to food chains, carbon cycles, bioaccumulation, and trophic cascades.',
    badgeColor: '#2B6CB0',
    icon: 'Leaf',
    questions: [
      {
        id: 1,
        strand: 'i',
        prompt: 'What is an ecosystem, and name two living and two non-living things in a forest.',
        target: 'An ecosystem is a community of living things interacting with non-living surroundings. Living: trees, birds. Non-living: sunlight, soil.',
        hint: 'Living organisms interacting with non-living environment.'
      },
      {
        id: 2,
        strand: 'i',
        prompt: 'What do we call living things that make their own food (plants) versus living things that eat food (animals)?',
        target: 'Plants are producers (autotrophs); animals are consumers (heterotrophs).',
        hint: 'Producers make food; consumers eat food.'
      },
      {
        id: 3,
        strand: 'i',
        prompt: 'What is a herbivore, carnivore, and omnivore? Give an example of each.',
        target: 'Herbivore eats plants (e.g., rabbit). Carnivore eats animals (e.g., lion). Omnivore eats both plants and animals (e.g., human).',
        hint: 'Herbivore = plants, Carnivore = meat, Omnivore = both.'
      },
      {
        id: 4,
        strand: 'i',
        prompt: 'What does a food chain show, and what do arrows between organisms represent?',
        target: 'A food chain shows energy flow from one organism to another. Arrows point in the direction of energy transfer.',
        hint: 'Arrows show the direction energy flows.'
      },
      {
        id: 5,
        strand: 'i',
        prompt: 'What is the 10% Rule of energy transfer in a food chain?',
        target: 'Only about 10% of stored energy passes to the next trophic level; 90% is lost as heat, waste, and movement.',
        hint: 'Only 10% energy moves up; 90% is lost.'
      },
      {
        id: 6,
        strand: 'i',
        prompt: 'What essential job do decomposers (like bacteria and mushrooms) do in an ecosystem?',
        target: 'Decomposers break down dead plants and animals, recycling nutrients back into the soil for plants to reuse.',
        hint: 'Recycle nutrients from dead matter back into soil.'
      },
      {
        id: 7,
        strand: 'i',
        prompt: 'Describe how carbon moves between air and living organisms in the Carbon Cycle.',
        target: 'Photosynthesis absorbs CO2 from air into plants. Respiration, decomposition, and combustion release CO2 back into air.',
        hint: 'Photosynthesis takes CO2 out of air; respiration and burning put CO2 back.'
      },
      {
        id: 8,
        strand: 'i',
        prompt: 'What is bioaccumulation (biomagnification), and why are top predators most affected by toxic chemicals like DDT?',
        target: 'Toxins accumulate in fat tissue. As predators eat many prey, toxin concentration magnifies up the food chain to dangerous levels in top predators.',
        hint: 'Toxins magnify up the food chain to highest levels in top predators.'
      },
      {
        id: 9,
        strand: 'i',
        prompt: 'Why is high biodiversity essential for maintaining a healthy, stable ecosystem?',
        target: 'High species diversity ensures ecological balance; if one species drops, others fill similar roles to prevent food web collapse.',
        hint: 'Variety of species keeps food webs balanced if one species drops.'
      },
      {
        id: 10,
        strand: 'i',
        prompt: 'How do invasive non-native species disrupt local native food webs?',
        target: 'Invasive species often lack natural predators, multiplying rapidly and outcompeting native species for food and shelter.',
        hint: 'Lack of natural predators lets them outcompete native species.'
      },
      {
        id: 11,
        strand: 'ii',
        prompt: 'Scenario: Overfishing removes 80% of sharks (top predators) on a coral reef. Predict the impact on large fish, small herbivorous fish, and coral health.',
        target: 'Large fish populations rise without sharks, overconsuming small herbivorous fish. Fewer herbivorous fish allows algae to overgrow and smother the coral reef.',
        hint: 'Fewer sharks -> more big fish -> fewer algae-eating fish -> algae smothers coral.'
      },
      {
        id: 12,
        strand: 'ii',
        prompt: 'Scenario: Reintroducing wolves to Yellowstone National Park controlled the elk population. Describe how this restored riverbank trees and beaver dams.',
        target: 'Wolves kept elk moving away from riverbanks. Willows and trees regrew, stabilizing riverbanks and providing materials for beavers to build dams.',
        hint: 'Wolves reduced elk grazing near rivers -> trees regrew -> beavers returned.'
      }
    ]
  }
];

export const TOPICS: Topic[] = [
  ...CORE_TOPICS,
  ...TOPIC_SET_1,
  ...TOPIC_SET_2,
  ...TOPIC_SET_3,
];

/**
 * Intelligent topic matching helper that matches exact IDs, titles,
 * curriculum numbers (e.g. "8", "Topic 8"), keywords (e.g. "xylem", "phloem", "transport in plants"),
 * and fuzzy query variations.
 */
export function findMatchingTopic(query: string): Topic | undefined {
  if (!query || !query.trim()) return undefined;
  const q = query.trim().toLowerCase();

  // 1. Direct ID match
  const exactId = TOPICS.find((t) => t.id.toLowerCase() === q);
  if (exactId) return exactId;

  // 2. Direct Title match
  const exactTitle = TOPICS.find((t) => t.title.toLowerCase() === q);
  if (exactTitle) return exactTitle;

  // 3. Keyword-based matching for prominent curriculum topics
  const cleanQ = q.replace(/^\d+\.\s*/, '').replace(/[:\-_,]/g, ' ').replace(/\s+/g, ' ').trim();

  // Transport in Plants / Xylem / Phloem
  if (
    cleanQ.includes('xylem') ||
    cleanQ.includes('phloem') ||
    cleanQ.includes('pholem') || // handle common student typo
    (cleanQ.includes('transport') && cleanQ.includes('plant'))
  ) {
    const plantTopic = TOPICS.find((t) => t.id === '8-transport-in-plants');
    if (plantTopic) return plantTopic;
  }

  // Cell Structure / Organelles
  if (
    (cleanQ.includes('cell') && (cleanQ.includes('organelle') || cleanQ.includes('structure') || cleanQ.includes('membrane') || cleanQ.includes('mitochondria'))) ||
    cleanQ === 'cell' ||
    cleanQ === 'cells'
  ) {
    const cellTopic = TOPICS.find((t) => t.id === 'cell-organelles-structures');
    if (cellTopic) return cellTopic;
  }

  // Plant Nutrition / Photosynthesis
  if (cleanQ.includes('photo') || cleanQ.includes('chloroplast') || cleanQ.includes('light reaction')) {
    const photoTopic = TOPICS.find((t) => t.id === '6-plant-nutrition-photosynthesis' || t.id === 'photosynthesis-respiration');
    if (photoTopic) return photoTopic;
  }

  // Enzymes
  if (cleanQ.includes('enzyme') || cleanQ.includes('catalyst') || cleanQ.includes('active site')) {
    const enzymeTopic = TOPICS.find((t) => t.id === '5-enzymes-catalysis');
    if (enzymeTopic) return enzymeTopic;
  }

  // Diffusion / Osmosis
  if (cleanQ.includes('osmosis') || cleanQ.includes('diffusion') || cleanQ.includes('active transport')) {
    const diffTopic = TOPICS.find((t) => t.id === '3-movement-in-out-cells');
    if (diffTopic) return diffTopic;
  }

  // Genetics / Inheritance
  if (cleanQ.includes('genetic') || cleanQ.includes('dna') || cleanQ.includes('inheritance') || cleanQ.includes('allele')) {
    const genTopic = TOPICS.find((t) => t.id === '17-genetics-inheritance');
    if (genTopic) return genTopic;
  }

  // 4. Check if title contains query or query contains title
  const containsMatch = TOPICS.find((t) => {
    const tClean = t.title.toLowerCase().replace(/^\d+\.\s*/, '').replace(/[:\-_,]/g, ' ').replace(/\s+/g, ' ').trim();
    return tClean.includes(cleanQ) || cleanQ.includes(tClean);
  });
  if (containsMatch) return containsMatch;

  // 5. Check description
  const descMatch = TOPICS.find((t) => t.description.toLowerCase().includes(cleanQ));
  if (descMatch) return descMatch;

  return undefined;
}
