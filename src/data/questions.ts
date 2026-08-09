import { Question, OrganelleInfo } from '../types';

export const QUESTIONS: Question[] = [
  {
    id: 1,
    strand: 'i',
    prompt: 'What is the primary function of the cell membrane, and what does it mean that it is "selectively permeable"?',
    target: 'Forms a flexible boundary around the cell; "selectively permeable" means it controls and regulates which specific substances (e.g. oxygen, glucose, ions) can enter or exit while blocking harmful materials or preventing cell contents from leaking out.',
    hint: 'Think about boundaries, security checkpoints, and how nutrients enter while waste products leave.'
  },
  {
    id: 2,
    strand: 'i',
    prompt: 'Explain the distinct roles of the nucleus and the nucleolus located inside it.',
    target: 'The nucleus contains genetic material (DNA/chromosomes) and controls all cellular activities and chemical reactions. The nucleolus is a dense region inside the nucleus responsible for producing ribosomal RNA (rRNA) and assembling ribosome subunits.',
    hint: 'Consider where the cell\'s master instructions are kept vs. where protein-building factories are initially constructed.'
  },
  {
    id: 3,
    strand: 'i',
    prompt: 'What vital biological process occurs in mitochondria, and why is it scientifically inaccurate to say mitochondria "create" energy?',
    target: 'Mitochondria carry out aerobic cellular respiration. It is inaccurate to say they "create" energy because energy cannot be created from nothing (Law of Conservation of Energy); mitochondria convert/release stored chemical energy from glucose into usable ATP energy.',
    hint: 'Focus on aerobic respiration and recall that energy is transformed/released from glucose, not created out of nothing.'
  },
  {
    id: 4,
    strand: 'i',
    prompt: 'Describe the main function of ribosomes, and explain where they can be found inside a eukaryotic cell.',
    target: 'Ribosomes are the sites of protein synthesis (translating genetic code into proteins). They can float freely in the cytoplasm (making proteins for internal cell use) or be attached to the Rough Endoplasmic Reticulum (making proteins for membrane insertion or export/secretion).',
    hint: 'Mention what biomolecule ribosomes assemble and the two main locations where they reside.'
  },
  {
    id: 5,
    strand: 'i',
    prompt: 'How do the structures and functions of the Rough Endoplasmic Reticulum (Rough ER) and Smooth Endoplasmic Reticulum (Smooth ER) differ from each other?',
    target: 'Rough ER has ribosomes attached to its surface and is involved in folding, modifying, and transporting proteins destined for membranes or secretion. Smooth ER lacks ribosomes and synthesizes lipids/steroids, metabolizes carbohydrates, and detoxifies toxins and drugs.',
    hint: 'Compare their surface appearance (studded with ribosomes vs smooth) and their main products (proteins vs lipids/detoxification).'
  },
  {
    id: 6,
    strand: 'i',
    prompt: 'What is the main role of the Golgi apparatus (Golgi bodies) in the cell\'s transport system?',
    target: 'The Golgi apparatus modifies, sorts, packages, and tags proteins and lipids received from the ER into membrane-bound vesicles for transport to specific destinations inside the cell or for secretion outside the cell (exocytosis).',
    hint: 'Think of the Golgi apparatus as the cell\'s post office or shipping department.'
  },
  {
    id: 7,
    strand: 'i',
    prompt: 'Which organelle acts as the cell\'s waste disposal and recycling center, and how do its internal enzymes accomplish this?',
    target: 'Lysosomes — membrane-bound sacs containing acidic hydrolytic enzymes that break down waste materials, cellular debris, damaged organelles (autophagy), and foreign invaders like bacteria.',
    hint: 'Name the organelle containing powerful digestive enzymes that break down cellular garbage.'
  },
  {
    id: 8,
    strand: 'i',
    prompt: 'Which organelle enables plant cells to produce their own food, and what chemical reaction takes place inside it?',
    target: 'Chloroplast — carries out photosynthesis, using green chlorophyll pigment to absorb light energy and combine carbon dioxide and water into glucose (sugar) and oxygen.',
    hint: 'Name the green organelle, its chlorophyll pigment, and the light-driven process that makes sugar.'
  },
  {
    id: 9,
    strand: 'i',
    prompt: 'Describe the structural composition and key functions of the plant cell wall.',
    target: 'Made of rigid cellulose fibers located outside the cell membrane. It provides structural support, maintains cell shape, offers mechanical protection, and prevents the plant cell from bursting (lysing) when taking in water.',
    hint: 'Identify the tough carbohydrate material (cellulose) and how it provides rigid support against water pressure.'
  },
  {
    id: 10,
    strand: 'i',
    prompt: 'How does the large permanent vacuole support a plant stem and keep leaves upright?',
    target: 'It stores cell sap (water, minerals, sugars) and pushes against the cytoplasm and cell wall to create turgor pressure (turgidity), keeping the cell firm and preventing the plant from wilting.',
    hint: 'Link water storage in cell sap to turgor pressure pushing against the cell wall.'
  },
  {
    id: 11,
    strand: 'i',
    prompt: 'Distinguish between the cytoplasm (cytosol) and the cytoskeleton, explaining how they work together.',
    target: 'The cytoplasm (cytosol) is the fluid jelly-like matrix where metabolic chemical reactions occur. The cytoskeleton is an internal network of protein microfilaments and microtubules that gives structural shape, anchors organelles in the cytoplasm, and acts as tracks for vesicle movement.',
    hint: 'Differentiate between the fluid medium (cytoplasm) and the internal structural framework (cytoskeleton).'
  },
  {
    id: 12,
    strand: 'i',
    prompt: 'Scenario: During a severe drought, a plant cell\'s chloroplasts lose their green chlorophyll pigment. What vital process stops happening inside the cell, and what will happen to the plant cell as a result?',
    target: 'Photosynthesis stops because chlorophyll is needed to absorb sunlight energy to make glucose (food). Without glucose, the cell cannot generate energy and will starve.',
    hint: 'Think about what process uses chlorophyll and sunlight to make sugar (food) for the plant.'
  },
  {
    id: 13,
    strand: 'ii',
    prompt: 'A student examines a mystery cell under an electron microscope and observes a rigid cellulose cell wall, chloroplasts, and a large permanent vacuole, but no centrioles. Is this a plant or animal cell? Justify your answer thoroughly.',
    target: 'Plant cell — the presence of a cellulose cell wall, chloroplasts, and a large permanent vacuole are definitive plant features. Animal cells lack cell walls and chloroplasts, and possess small temporary vacuoles and centrioles instead.',
    hint: 'State your choice clearly and explain how the presence of cell wall, chloroplasts, and large vacuole rule out an animal cell.'
  },
  {
    id: 14,
    strand: 'ii',
    prompt: 'Scenario: A cell needs to make a protein hormone (like insulin) and export it out of the cell. If a ribosome builds the protein, how do the Rough ER and Golgi bodies work together as a team to package and ship this protein?',
    target: 'The ribosome builds the protein on the Rough ER, which folds it and transports it in a vesicle to the Golgi body. The Golgi body modifies, packages, and dispatches the protein in a vesicle to the cell membrane to be exported.',
    hint: 'Think of the Rough ER as the folding & transport hallway, and the Golgi body as the packaging & shipping post office.'
  },
  {
    id: 15,
    strand: 'ii',
    prompt: 'Scenario: A marathon runner\'s leg muscle cells need constant energy to keep contracting, while a patient\'s liver cells need to safely break down medication. Which organelle is most abundant in muscle cells, and which is most abundant in liver cells? Explain why.',
    target: 'Muscle cells have abundant Mitochondria to continuously supply energy (ATP) for contraction. Liver cells have abundant Smooth ER to detoxify medications, alcohol, and harmful metabolic byproducts.',
    hint: 'Match energy/contraction to Mitochondria, and medication/toxin breakdown to Smooth ER.'
  },
  {
    id: 16,
    strand: 'ii',
    prompt: 'Scenario: A cell\'s lysosome membrane accidentally breaks open, spilling its digestive enzymes into the cell cytoplasm. What will happen to the cell\'s organelles and proteins as a result?',
    target: 'The acidic digestive enzymes will break down and digest the cell\'s own essential proteins and organelles, causing the cell to self-destruct (autolysis).',
    hint: 'Think about what lysosomes contain (digestive enzymes) and what happens when those enzymes leak into the rest of the cell.'
  }
];

export const ORGANELLES: OrganelleInfo[] = [
  {
    id: 'membrane',
    name: 'Cell Membrane',
    foundIn: 'both',
    function: 'Selective barrier & boundary regulation',
    description: 'Phospholipid bilayer that controls which nutrients enter and wastes exit the cell, maintaining homeostasis and protecting cell contents.',
    color: '#4F8FC7'
  },
  {
    id: 'nucleus',
    name: 'Nucleus',
    foundIn: 'both',
    function: 'Control center & genetic storage',
    description: 'Enclosed by a double membrane with pores; stores genomic DNA instructions that direct all cellular activities and protein synthesis.',
    color: '#A8425A'
  },
  {
    id: 'nucleolus',
    name: 'Nucleolus',
    foundIn: 'both',
    function: 'Ribosome assembly & rRNA synthesis',
    description: 'Dense non-membrane structure inside the nucleus where ribosomal RNA (rRNA) is transcribed and combined with proteins to build ribosome subunits.',
    color: '#D946EF'
  },
  {
    id: 'mitochondria',
    name: 'Mitochondria',
    foundIn: 'both',
    function: 'Aerobic respiration & ATP energy release',
    description: 'Double-membraned powerhouse where glucose and oxygen are converted into usable chemical energy (ATP) through aerobic cellular respiration.',
    color: '#E0AD63'
  },
  {
    id: 'ribosomes',
    name: 'Ribosomes',
    foundIn: 'both',
    function: 'Protein synthesis',
    description: 'Tiny complexes of RNA and protein that translate mRNA sequence instructions into polypeptide chains (proteins). Can float free in cytosol or bind to Rough ER.',
    color: '#8A5A1E'
  },
  {
    id: 'rough_er',
    name: 'Rough ER',
    foundIn: 'both',
    function: 'Protein folding & vesicular transport',
    description: 'Interconnected membrane network studded with ribosomes. Folds newly synthesized proteins, tags them, and packages them into vesicles destined for the Golgi.',
    color: '#C05621'
  },
  {
    id: 'smooth_er',
    name: 'Smooth ER',
    foundIn: 'both',
    function: 'Lipid synthesis & detoxification',
    description: 'Tubular membrane network lacking ribosomes. Synthesizes phospholipids, steroids, and hormones, metabolizes carbohydrates, and neutralizes toxins.',
    color: '#DD6B20'
  },
  {
    id: 'golgi',
    name: 'Golgi Apparatus',
    foundIn: 'both',
    function: 'Protein modification, sorting & packaging',
    description: 'Stack of flattened membrane sacs (cisternae) that receives proteins from the ER, adds chemical tags (carbohydrates/lipids), and dispatches them in vesicles.',
    color: '#D69E2E'
  },
  {
    id: 'lysosomes',
    name: 'Lysosomes',
    foundIn: 'animal',
    function: 'Waste digestion & cellular recycling',
    description: 'Spherical membrane sacs packed with acidic hydrolytic enzymes. Digests cellular waste, worn-out organelles (autophagy), foreign pathogens, and debris.',
    color: '#E53E3E'
  },
  {
    id: 'chloroplast',
    name: 'Chloroplast',
    foundIn: 'plant',
    function: 'Photosynthesis & glucose production',
    description: 'Double-membraned organelle containing green chlorophyll pigment. Converts light energy, CO2, and H2O into glucose sugar and oxygen.',
    color: '#48BB78'
  },
  {
    id: 'cellwall',
    name: 'Cell Wall',
    foundIn: 'plant',
    function: 'Rigid outer support & osmotic protection',
    description: 'Tough outer layer made of microfibrillar cellulose. Provides structural rigidity, maintains cell shape, and prevents bursting under high turgor pressure.',
    color: '#2F855A'
  },
  {
    id: 'vacuole',
    name: 'Large Permanent Vacuole',
    foundIn: 'plant',
    function: 'Cell sap storage & turgor pressure',
    description: 'Large central fluid sac filled with cell sap (water, ions, sugars). Maintains turgor pressure against the cell wall to keep plant stems firm and leaves un-wilted.',
    color: '#3182CE'
  },
  {
    id: 'cytoplasm',
    name: 'Cytoplasm & Cytosol',
    foundIn: 'both',
    function: 'Metabolic fluid medium',
    description: 'Semifluid aqueous cytosol matrix filling the cell interior where organelles float and vital metabolic chemical reactions take place.',
    color: '#718096'
  },
  {
    id: 'centrosome',
    name: 'Centrosome & Centrioles',
    foundIn: 'animal',
    function: 'Cell division & chromosome separation',
    description: 'Structures in animal cells that help organize and pull chromosomes apart into two equal sets when a cell divides into two new cells.',
    color: '#319795'
  },
  {
    id: 'peroxisomes',
    name: 'Peroxisomes',
    foundIn: 'both',
    function: 'Fatty acid breakdown & H2O2 detox',
    description: 'Small metabolic organelles containing oxidative enzymes like catalase that break down fatty acids and convert toxic hydrogen peroxide into safe H2O and O2.',
    color: '#805AD5'
  },
  {
    id: 'cytoskeleton',
    name: 'Cytoskeleton',
    foundIn: 'both',
    function: 'Structural scaffolding & intracellular transport',
    description: 'Dynamic network of microfilaments, intermediate filaments, and microtubules that supports cell shape, anchors organelles, and acts as tracks for motor proteins.',
    color: '#4A5568'
  }
];
