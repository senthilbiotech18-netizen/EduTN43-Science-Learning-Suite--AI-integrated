import { Topic } from '../../types';

export const TOPIC_SET_1: Topic[] = [
  {
    id: '1-classification-living-organisms',
    title: '1. Characteristics & Classification of Organisms',
    level: 'PYP to MYP 5',
    subject: 'Biology',
    description: 'Scaffolded from basic living vs. non-living features (MRS GREN) to 5 kingdoms, binomial naming, dichotomous keys, and evolutionary traits.',
    badgeColor: '#2F855A',
    icon: 'Microscope',
    questions: [
      {
        id: 1,
        strand: 'i',
        prompt: 'How can you tell if something is living or non-living? Name three things living things do.',
        target: 'Living things move, grow, breathe/respire, reproduce, respond to surroundings, and need food. Non-living things do not.',
        hint: 'Think about what humans, animals, and plants can do that a rock cannot.'
      },
      {
        id: 2,
        strand: 'i',
        prompt: 'What does the memory word "MRS GREN" stand for in biology?',
        target: 'Movement, Respiration, Sensitivity, Growth, Reproduction, Excretion, Nutrition.',
        hint: 'Recall the 7 characteristics of all living organisms.'
      },
      {
        id: 3,
        strand: 'i',
        prompt: 'What is the key difference between a plant and an animal in how they get food?',
        target: 'Plants make their own food using sunlight (autotrophs). Animals must eat plants or other animals (heterotrophs).',
        hint: 'Plants make food using sunlight; animals must eat food.'
      },
      {
        id: 4,
        strand: 'i',
        prompt: 'Define "Excretion" and explain how it differs from passing out undigested food (egestion).',
        target: 'Excretion is removing toxic chemical waste made inside cells (like urea or CO2). Egestion is passing out undigested food residue via the anus.',
        hint: 'Excretion removes cellular waste; egestion removes undigested gut food.'
      },
      {
        id: 5,
        strand: 'i',
        prompt: 'How does the binomial naming system work, and what do the two words in a scientific name represent (e.g. Homo sapiens)?',
        target: 'The first word is the Genus (capitalized) and the second is the species (lowercase).',
        hint: 'Name the Genus and species taxons.'
      },
      {
        id: 6,
        strand: 'i',
        prompt: 'State the key differences between Kingdom Plantae and Kingdom Animalia cell structures.',
        target: 'Plant cells have cellulose cell walls and chloroplasts for photosynthesis. Animal cells lack cell walls and chloroplasts.',
        hint: 'Compare cell walls and chloroplasts.'
      },
      {
        id: 7,
        strand: 'i',
        prompt: 'What structural features distinguish Kingdom Fungi from plants and animals?',
        target: 'Fungi have cell walls made of chitin (not cellulose) and absorb dissolved organic matter (saprotrophic nutrition).',
        hint: 'Mention chitin cell walls and absorbing dissolved food.'
      },
      {
        id: 8,
        strand: 'i',
        prompt: 'How do Arthropods differ from other invertebrates, and how are Insects distinguished from Arachnids (spiders)?',
        target: 'Arthropods have jointed legs and exoskeletons. Insects have 3 body segments and 6 legs; Arachnids have 2 body segments and 8 legs.',
        hint: 'Compare leg counts (6 vs 8) and body parts.'
      },
      {
        id: 9,
        strand: 'i',
        prompt: 'Why are Viruses not classified within the 5 main kingdoms of living organisms?',
        target: 'Viruses lack cell structure (cytoplasm, organelles) and do not carry out metabolic reactions unless inside a host cell.',
        hint: 'Explain why non-cellular genetic material inside a protein coat is not a living cell.'
      },
      {
        id: 10,
        strand: 'ii',
        prompt: 'Scenario: A scientist discovers a mystery creature with a soft moist body, no backbone, and a hard calcium shell. Which phylum does it belong to?',
        target: 'Phylum Mollusca — soft unsegmented body, muscular foot, and often a protective shell (e.g., snails, clams).',
        hint: 'Name the phylum of soft-bodied shell animals.'
      },
      {
        id: 11,
        strand: 'ii',
        prompt: 'Scenario: How does a dichotomous key help a biologist identify an unknown rainforest insect species?',
        target: 'It presents a series of paired contrasting statements (choices based on visible traits) leading step-by-step to the exact species identity.',
        hint: 'Paired choices based on physical traits.'
      },
      {
        id: 12,
        strand: 'ii',
        prompt: 'Scenario: Compare why fish use gills while land reptiles use internal lungs for gas exchange.',
        target: 'Fish extract dissolved oxygen from water using gills with high surface area. Reptiles live on land and need internal moist lungs protected from drying out.',
        hint: 'Relate gills and lungs to aquatic vs land habitats.'
      }
    ]
  },
  {
    id: '2-organisation-of-organism',
    title: '2. Organisation of the Organism',
    level: 'PYP to MYP 5',
    subject: 'Biology',
    description: 'Scaffolded from basic microscopic cell observation to levels of organization, cell specialization, and magnification calculations.',
    badgeColor: '#2F855A',
    icon: 'Layers',
    questions: [
      {
        id: 1,
        strand: 'i',
        prompt: 'What is a cell, and why do we need a microscope to see most cells?',
        target: 'A cell is the tiny basic unit of living things. Most cells are microscopic and too small to see with human eyes alone.',
        hint: 'Cells are microscopic building blocks.'
      },
      {
        id: 2,
        strand: 'i',
        prompt: 'Name the three basic parts found in almost all animal and plant cells.',
        target: 'Cell membrane, cytoplasm, and nucleus.',
        hint: 'Outer skin, inner jelly, and control center.'
      },
      {
        id: 3,
        strand: 'i',
        prompt: 'Arrange the structural levels of biological organization in order from simplest to most complex.',
        target: 'Cell → Tissue → Organ → Organ System → Organism.',
        hint: 'Start with cell and build up to organism.'
      },
      {
        id: 4,
        strand: 'i',
        prompt: 'Define a "tissue" in biology and give one human and one plant example.',
        target: 'A group of similar specialized cells working together to do a job. Human: muscle tissue. Plant: xylem tissue.',
        hint: 'A group of similar cells working together.'
      },
      {
        id: 5,
        strand: 'i',
        prompt: 'Define an "organ" and explain why a plant leaf is considered an organ.',
        target: 'An organ is made of several different tissues working together. A leaf contains epidermis, mesophyll, xylem, and phloem tissues to make food.',
        hint: 'Multiple tissue types working together as a functional unit.'
      },
      {
        id: 6,
        strand: 'i',
        prompt: 'State the formula for calculating Magnification (I = A × M triangle).',
        target: 'Magnification = Image size / Actual size (M = I / A).',
        hint: 'Magnification = Image size divided by Actual size.'
      },
      {
        id: 7,
        strand: 'i',
        prompt: 'Convert 0.05 millimeters (mm) into micrometers (µm).',
        target: '0.05 mm × 1000 = 50 µm.',
        hint: 'Multiply mm by 1000 to get µm.'
      },
      {
        id: 8,
        strand: 'i',
        prompt: 'How are red blood cells specialized to carry oxygen through blood vessels?',
        target: 'Biconcave disc shape increases surface area, packed with red hemoglobin, and lacks a nucleus to hold more oxygen.',
        hint: 'Biconcave shape, hemoglobin, no nucleus.'
      },
      {
        id: 9,
        strand: 'i',
        prompt: 'How are root hair cells specialized for soaking up water and minerals from soil?',
        target: 'Long hair-like extension greatly increases surface area for fast water absorption from soil.',
        hint: 'Long projection increases absorption surface area.'
      },
      {
        id: 10,
        strand: 'ii',
        prompt: 'Scenario: Under a microscope, a cell image measures 30 mm. If magnification is ×500, calculate the actual cell size in micrometers (µm).',
        target: 'Actual size = Image / Magnification = 30 mm / 500 = 0.06 mm = 60 µm.',
        hint: '30 mm / 500 = 0.06 mm. Multiply by 1000 to get µm.'
      },
      {
        id: 11,
        strand: 'ii',
        prompt: 'Scenario: Explain why a human stomach is classified as an organ, whereas stomach lining tissue is a tissue.',
        target: 'Stomach lining is a single tissue layer of cells. The stomach is an organ because muscle tissue, gland tissue, and nerve tissue work together to digest food.',
        hint: 'Single cell layer vs multiple tissue types working together.'
      },
      {
        id: 12,
        strand: 'ii',
        prompt: 'Scenario: Why would a palisade mesophyll cell be less efficient at photosynthesis if it lacked a large central vacuole pushing chloroplasts outward?',
        target: 'The vacuole pushes chloroplasts close to the cell edge, shortening the light path and maximizing sunlight capture for photosynthesis.',
        hint: 'Pushing chloroplasts to edges maximizes light capture.'
      }
    ]
  },
  {
    id: '3-movement-in-out-of-cells',
    title: '3. Movement into & out of Cells',
    level: 'PYP to MYP 5',
    subject: 'Biology',
    description: 'Scaffolded from everyday scent spreading to diffusion, osmosis, turgor pressure, active transport, and surface area-to-volume ratio.',
    badgeColor: '#2F855A',
    icon: 'FlaskConical',
    questions: [
      {
        id: 1,
        strand: 'i',
        prompt: 'Why does the smell of perfume or baking cookies spread across a room even when there is no wind?',
        target: 'Smell particles move and spread out naturally in the air from where there are many to where there are few (diffusion).',
        hint: 'Particles spread from high to low concentration.'
      },
      {
        id: 2,
        strand: 'i',
        prompt: 'Define "Diffusion" in simple science terms.',
        target: 'Net movement of particles from a region of higher concentration to lower concentration down a concentration gradient.',
        hint: 'Movement from high concentration to low concentration.'
      },
      {
        id: 3,
        strand: 'i',
        prompt: 'What happens when you place a shriveled raisin into a glass of plain water overnight?',
        target: 'The raisin swells up because water moves into it through its skin (osmosis).',
        hint: 'Water enters the raisin, making it swell.'
      },
      {
        id: 4,
        strand: 'i',
        prompt: 'Define "Osmosis" in terms of water potential.',
        target: 'Net movement of water molecules from a high water potential (dilute solution) to low water potential (concentrated solution) across a partially permeable membrane.',
        hint: 'Water moving across a partially permeable membrane.'
      },
      {
        id: 5,
        strand: 'i',
        prompt: 'What is "Active Transport", and why does it require energy from ATP?',
        target: 'Active transport moves molecules across a cell membrane against a concentration gradient (low to high concentration) using ATP energy.',
        hint: 'Pumping substances against concentration gradient using ATP.'
      },
      {
        id: 6,
        strand: 'i',
        prompt: 'What happens to a red blood cell if it is placed in pure distilled water, and why?',
        target: 'Water enters by osmosis down a water potential gradient until the cell bursts (lysis) because it lacks a cell wall.',
        hint: 'Water rushes in and bursts the cell because there is no cell wall.'
      },
      {
        id: 7,
        strand: 'i',
        prompt: 'What happens to a plant cell placed in a very concentrated salt solution (plasmolysis)?',
        target: 'Water leaves the vacuole by osmosis, causing the cytoplasm and membrane to shrink away from the rigid cell wall.',
        hint: 'Water leaves the cell, shrinking cytoplasm away from cell wall.'
      },
      {
        id: 8,
        strand: 'i',
        prompt: 'How does warm temperature affect the rate of diffusion?',
        target: 'Warm temperature gives particles more kinetic energy, making them move faster and increasing diffusion rate.',
        hint: 'Warmth gives particles more energy to move faster.'
      },
      {
        id: 9,
        strand: 'i',
        prompt: 'How do root hair cells use active transport to absorb mineral ions from soil when mineral concentration in soil is very low?',
        target: 'Protein pumps in the root hair membrane use ATP energy to pump mineral ions into the root against the concentration gradient.',
        hint: 'Protein pumps use ATP energy to pull in minerals.'
      },
      {
        id: 10,
        strand: 'ii',
        prompt: 'Scenario: Potato cylinders are placed in sucrose solutions of 0.0M, 0.4M, and 0.8M. Predict which potato cylinder gains mass and which loses mass.',
        target: '0.0M (pure water): gains mass (water enters). 0.8M (sugary solution): loses mass (water leaves). 0.4M: stays similar mass if equal water potential.',
        hint: 'Pure water causes mass gain; concentrated sugar causes mass loss.'
      },
      {
        id: 11,
        strand: 'ii',
        prompt: 'Scenario: Why do small single-celled amoebas rely on simple diffusion for gas exchange, whereas large mammals require lungs and blood vessels?',
        target: 'Amoebas have a large surface area-to-volume ratio and short diffusion distance. Large mammals have a small surface area-to-volume ratio, requiring lungs and blood to transport oxygen.',
        hint: 'Compare surface area-to-volume ratios and diffusion distances.'
      },
      {
        id: 12,
        strand: 'ii',
        prompt: 'Scenario: A runner drinks pure water instead of electrolyte drinks during a marathon. Explain why excessive pure water can cause red blood cells to swell.',
        target: 'Pure water dilutes blood plasma, raising water potential outside cells. Water rushes into red blood cells by osmosis, causing swelling and potential lysis.',
        hint: 'Dilute plasma means water enters red blood cells by osmosis.'
      }
    ]
  },
  {
    id: '4-biological-molecules',
    title: '4. Biological Molecules & Food Tests',
    level: 'PYP to MYP 5',
    subject: 'Biology',
    description: 'Scaffolded from daily food nutrients to chemical elements in carbs/proteins/fats, food test protocols (iodine, Benedict\'s, Biuret, ethanol), and DNA structure.',
    badgeColor: '#2F855A',
    icon: 'FlaskConical',
    questions: [
      {
        id: 1,
        strand: 'i',
        prompt: 'Why do our bodies need food every day, and what are the three main nutrients in our meals?',
        target: 'Food provides energy to run and play, and nutrients to grow and repair. Main nutrients: Carbohydrates, Proteins, and Fats.',
        hint: 'Energy and building materials from food.'
      },
      {
        id: 2,
        strand: 'i',
        prompt: 'Which main nutrient gives our body quick energy—carbohydrates or proteins?',
        target: 'Carbohydrates (sugars and starches) provide quick energy.',
        hint: 'Sugars and starches give energy.'
      },
      {
        id: 3,
        strand: 'i',
        prompt: 'Which nutrient is essential for muscle growth and repairing body tissue?',
        target: 'Protein.',
        hint: 'Proteins build muscles and repair body parts.'
      },
      {
        id: 4,
        strand: 'i',
        prompt: 'Which chemical elements make up Carbohydrates, Fats, and Proteins?',
        target: 'Carbohydrates & Fats: Carbon, Hydrogen, Oxygen (CHO). Proteins: Carbon, Hydrogen, Oxygen, Nitrogen, and sometimes Sulfur (CHON/S).',
        hint: 'Carbs/Fats = CHO; Proteins = CHON.'
      },
      {
        id: 5,
        strand: 'i',
        prompt: 'What chemical liquid test is used to detect starch in food, and what color change occurs?',
        target: 'Iodine solution. Turns from yellow-brown to blue-black in the presence of starch.',
        hint: 'Iodine turns blue-black for starch.'
      },
      {
        id: 6,
        strand: 'i',
        prompt: 'How do you test a food sample for reducing sugars (like glucose) using Benedict\'s solution?',
        target: 'Add Benedict\'s reagent and heat in a hot water bath. Color changes from blue to green → yellow → brick-red precipitate.',
        hint: 'Heat Benedict\'s reagent in a hot water bath; blue to brick-red.'
      },
      {
        id: 7,
        strand: 'i',
        prompt: 'What reagent tests for proteins, and what color change shows a positive result?',
        target: 'Biuret reagent (copper sulfate + sodium hydroxide). Turns from blue to purple/violet.',
        hint: 'Biuret reagent turns purple/violet for protein.'
      },
      {
        id: 8,
        strand: 'i',
        prompt: 'Describe the ethanol emulsion test for lipids (fats and oils).',
        target: 'Dissolve food sample in ethanol, pour liquid into water. A milky-white emulsion indicates lipids present.',
        hint: 'Dissolve in ethanol, pour into water; milky-white emulsion.'
      },
      {
        id: 9,
        strand: 'i',
        prompt: 'What are the basic building block sub-units (monomers) of starch, proteins, and fats?',
        target: 'Starch: glucose sub-units. Proteins: amino acids. Fats/Lipids: glycerol and 3 fatty acids.',
        hint: 'Glucose for starch; amino acids for proteins; glycerol & fatty acids for fats.'
      },
      {
        id: 10,
        strand: 'i',
        prompt: 'Describe the double helix structure of DNA and name the four chemical bases that pair together.',
        target: 'Two strands coiled in a double helix. Bases: Adenine pairs with Thymine (A-T), Guanine pairs with Cytosine (G-C).',
        hint: 'Double helix strands; A pairs with T, G pairs with C.'
      },
      {
        id: 11,
        strand: 'ii',
        prompt: 'Scenario: A student tests an unknown clear liquid. Iodine stays brown, Benedict\'s turns brick-red when heated, and Biuret turns purple. What nutrients are present?',
        target: 'Reducing sugar (glucose) and protein are present. Starch is absent.',
        hint: 'Brick-red Benedict\'s = sugar; purple Biuret = protein; brown Iodine = no starch.'
      },
      {
        id: 12,
        strand: 'ii',
        prompt: 'Scenario: Why must Benedict\'s test be heated in a water bath, whereas Iodine and Biuret tests work at room temperature?',
        target: 'Reducing sugars require thermal kinetic energy to reduce copper(II) ions in Benedict\'s reagent to copper(I) oxide precipitate.',
        hint: 'Reduction reaction requires heat energy to form brick-red precipitate.'
      }
    ]
  },
  {
    id: '5-enzymes',
    title: '5. Enzymes & Biochemical Reactions',
    level: 'PYP to MYP 5',
    subject: 'Biology',
    description: 'Scaffolded from chewing food helpers to lock-and-key model, active site specificity, temperature denaturation, and pH optimum curves.',
    badgeColor: '#2F855A',
    icon: 'FlaskConical',
    questions: [
      {
        id: 1,
        strand: 'i',
        prompt: 'What is an enzyme, and why are enzymes called "biological helpers" or catalysts?',
        target: 'Enzymes are special proteins that speed up chemical reactions in living things without being consumed.',
        hint: 'Proteins that speed up chemical reactions.'
      },
      {
        id: 2,
        strand: 'i',
        prompt: 'Why do we chew food into smaller pieces with our teeth before swallowing?',
        target: 'Chewing breaks food into smaller pieces with larger surface area, helping digestive enzymes break food down faster.',
        hint: 'Smaller pieces give enzymes a larger surface area to work on.'
      },
      {
        id: 3,
        strand: 'i',
        prompt: 'What happens to large food molecules during digestion?',
        target: 'Large insoluble food molecules are broken down by enzymes into small soluble molecules that dissolve into blood.',
        hint: 'Large insoluble molecules broken down into small soluble molecules.'
      },
      {
        id: 4,
        strand: 'i',
        prompt: 'Explain the "Lock and Key" model of enzyme action.',
        target: 'The enzyme\'s active site (lock) has a specific complementary shape that fits only one specific substrate molecule (key).',
        hint: 'Active site shape matches substrate like a lock and key.'
      },
      {
        id: 5,
        strand: 'i',
        prompt: 'What does it mean when an enzyme becomes "denatured" at high temperatures?',
        target: 'Excess heat vibrates bonds, permanently altering the active site shape so substrate molecules no longer fit.',
        hint: 'High heat changes active site shape permanently.'
      },
      {
        id: 6,
        strand: 'i',
        prompt: 'How does increasing temperature from 10°C up to 37°C affect enzyme activity rate?',
        target: 'Higher temperature increases kinetic energy, causing faster particle movement and more frequent successful collisions.',
        hint: 'Warmth increases kinetic energy and successful collision rate.'
      },
      {
        id: 7,
        strand: 'i',
        prompt: 'What is meant by an enzyme\'s "optimum pH"?',
        target: 'The specific pH level at which the enzyme works at its maximum reaction rate.',
        hint: 'The ideal pH level for fastest enzyme activity.'
      },
      {
        id: 8,
        strand: 'i',
        prompt: 'Name the substrate and product for the digestive enzymes Amylase, Protease, and Lipase.',
        target: 'Amylase: breaks starch into maltose/glucose. Protease: breaks proteins into amino acids. Lipase: breaks fats into glycerol and fatty acids.',
        hint: 'Amylase -> starch; Protease -> protein; Lipase -> fats.'
      },
      {
        id: 9,
        strand: 'i',
        prompt: 'Why does pepsin enzyme work effectively in the stomach at pH 2, but loses all activity in the small intestine at pH 8?',
        target: 'Pepsin\'s optimum pH is 2 (acidic). Alkaline pH 8 denatures pepsin by changing its active site shape.',
        hint: 'Alkaline environment denatures stomach pepsin.'
      },
      {
        id: 10,
        strand: 'ii',
        prompt: 'Scenario: Amylase and starch solution are heated to 80°C for 10 minutes, then cooled to 37°C. Will amylase break down starch now? Explain.',
        target: 'No. Heating to 80°C permanently denatures amylase. Cooling back to 37°C cannot restore the active site shape.',
        hint: 'Denaturation at 80°C is irreversible.'
      },
      {
        id: 11,
        strand: 'ii',
        prompt: 'Scenario: Pineapple contains bromelain protease enzyme. Why does adding fresh pineapple prevent gelatin jelly from setting, whereas canned cooked pineapple sets normally?',
        target: 'Fresh pineapple contains active bromelain that digests gelatin protein, preventing setting. Cooking canned pineapple heat-denatures bromelain, allowing gelatin to set.',
        hint: 'Fresh bromelain digests gelatin; cooking denatures the enzyme.'
      },
      {
        id: 12,
        strand: 'ii',
        prompt: 'Scenario: Biological washing powders contain lipase and protease enzymes. Why are clothes washed at 40°C rather than 90°C when using these powders?',
        target: '40°C provides optimum temperature for enzyme activity. 90°C heat would denature the enzymes, rendering them useless.',
        hint: '90°C heat would denature washing powder enzymes.'
      }
    ]
  },
  {
    id: '6-plant-nutrition',
    title: '6. Plant Nutrition & Leaf Structure',
    level: 'PYP to MYP 5',
    subject: 'Biology',
    description: 'Scaffolded from green leaf light absorption to leaf cross-section anatomy, palisade mesophyll adaptations, stomata guard cells, and mineral deficiency symptoms.',
    badgeColor: '#2F855A',
    icon: 'Leaf',
    questions: [
      {
        id: 1,
        strand: 'i',
        prompt: 'Where do plants get their food, and why are most plant leaves green?',
        target: 'Plants make food (sugar) using sunlight. Leaves are green because they contain chlorophyll pigment.',
        hint: 'Plants make food using sunlight; green chlorophyll captures light.'
      },
      {
        id: 2,
        strand: 'i',
        prompt: 'What three ingredients do plants need to carry out photosynthesis?',
        target: 'Sunlight energy, water from soil, and carbon dioxide gas from air.',
        hint: 'Sunlight, water, and carbon dioxide.'
      },
      {
        id: 3,
        strand: 'i',
        prompt: 'What sugar do plants produce in photosynthesis, and what gas do they release into the air?',
        target: 'Plants produce glucose sugar and release oxygen gas.',
        hint: 'Glucose sugar made; oxygen gas released.'
      },
      {
        id: 4,
        strand: 'i',
        prompt: 'Write the word equation for photosynthesis.',
        target: 'Carbon dioxide + Water --(sunlight & chlorophyll)--> Glucose + Oxygen.',
        hint: 'CO2 + Water yields Glucose + Oxygen.'
      },
      {
        id: 5,
        strand: 'i',
        prompt: 'Why do plants convert extra glucose sugar into starch for storage?',
        target: 'Starch is insoluble in water and does not affect water potential or osmosis inside plant cells.',
        hint: 'Starch is insoluble and does not disrupt osmosis.'
      },
      {
        id: 6,
        strand: 'i',
        prompt: 'How is the palisade mesophyll layer in a leaf adapted for maximum photosynthesis?',
        target: 'Located near top surface, packed tightly with chloroplasts, and columnar shape maximizes light absorption.',
        hint: 'Top leaf layer, column shape, packed with chloroplasts.'
      },
      {
        id: 7,
        strand: 'i',
        prompt: 'How does the spongy mesophyll layer facilitate gas exchange inside the leaf?',
        target: 'Loose arrangement with large air spaces allows CO2 and O2 gases to diffuse rapidly between stomata and cells.',
        hint: 'Air spaces allow gases to diffuse rapidly.'
      },
      {
        id: 8,
        strand: 'i',
        prompt: 'Why do plants need Nitrate ions and Magnesium ions from soil?',
        target: 'Nitrate ions supply nitrogen to build amino acids and proteins for growth. Magnesium ions build chlorophyll pigment for photosynthesis.',
        hint: 'Nitrates make proteins for growth; Magnesium makes green chlorophyll.'
      },
      {
        id: 9,
        strand: 'i',
        prompt: 'Describe the steps to test a leaf for starch safely using ethanol and iodine.',
        target: 'Boil leaf in water (kill cell membrane), boil in ethanol (remove green chlorophyll), dip in warm water, add brown iodine. Blue-black color shows starch.',
        hint: 'Boil in water -> boil in ethanol -> wash -> add iodine.'
      },
      {
        id: 10,
        strand: 'ii',
        prompt: 'Scenario: A plant leaf is variegated (green in center, white around edges). Predict which leaf areas test positive for starch after 6 hours in sunlight.',
        target: 'Only green central areas test positive (turn blue-black with iodine) because white areas lack chlorophyll needed for photosynthesis.',
        hint: 'Only green areas with chlorophyll can produce starch.'
      },
      {
        id: 11,
        strand: 'ii',
        prompt: 'Scenario: A potted plant shows stunted growth and yellow leaves (chlorosis). Identify the mineral deficiencies.',
        target: 'Stunted growth = Nitrogen/Nitrate deficiency. Yellow leaves (chlorosis) = Magnesium deficiency (cannot make chlorophyll).',
        hint: 'Yellow leaves = missing magnesium; stunted growth = missing nitrates.'
      },
      {
        id: 12,
        strand: 'ii',
        prompt: 'Scenario: Explain why aquatic plants underwater produce gas bubbles faster when placed near a bright lamp, and state how to identify the gas.',
        target: 'Brighter light increases photosynthetic rate, producing oxygen gas bubbles faster. Test gas with a glowing splint — it relights in oxygen.',
        hint: 'Brighter light speeds up photosynthesis; oxygen relights a glowing splint.'
      }
    ]
  },
  {
    id: '7-human-nutrition',
    title: '7. Human Nutrition & Digestion',
    level: 'PYP to MYP 5',
    subject: 'Biology',
    description: 'Scaffolded from balanced eating habits to 7 food groups, deficiency diseases, digestive organs, peristalsis, stomach acid, bile, and villi absorption.',
    badgeColor: '#2F855A',
    icon: 'Apple',
    questions: [
      {
        id: 1,
        strand: 'i',
        prompt: 'Why do we chew our food with teeth before swallowing it?',
        target: 'Chewing breaks large food pieces into smaller bits, making food easier to swallow and giving digestive enzymes a larger surface area.',
        hint: 'Smaller pieces give enzymes a larger surface area.'
      },
      {
        id: 2,
        strand: 'i',
        prompt: 'Name the 7 essential components of a balanced human diet.',
        target: 'Carbohydrates, Proteins, Fats/Lipids, Vitamins, Minerals, Water, and Dietary Fiber.',
        hint: 'Recall the 7 dietary components.'
      },
      {
        id: 3,
        strand: 'i',
        prompt: 'Why do our intestines need dietary fiber (roughage) even though humans cannot digest it?',
        target: 'Fiber adds bulk to food, helping gut muscles push food through intestines (peristalsis) and preventing constipation.',
        hint: 'Adds bulk to help gut muscles push food along.'
      },
      {
        id: 4,
        strand: 'i',
        prompt: 'Name the vitamin deficiency disease that causes soft weak bones (rickets) and the deficiency disease that causes bleeding gums (scurvy).',
        target: 'Rickets = Vitamin D (or Calcium) deficiency. Scurvy = Vitamin C deficiency.',
        hint: 'Vitamin D = rickets; Vitamin C = scurvy.'
      },
      {
        id: 5,
        strand: 'i',
        prompt: 'Trace the pathway of food through the human alimentary canal from entrance to exit.',
        target: 'Mouth → Esophagus → Stomach → Small Intestine (Duodenum/Ileum) → Large Intestine (Colon) → Rectum → Anus.',
        hint: 'Mouth -> Esophagus -> Stomach -> Small Intestine -> Large Intestine -> Anus.'
      },
      {
        id: 6,
        strand: 'i',
        prompt: 'How do wave-like muscle contractions (peristalsis) move food down the esophagus and gut?',
        target: 'Circular muscles contract behind food while longitudinal muscles contract ahead, squeezing food along the alimentary canal.',
        hint: 'Wave-like muscle contractions squeezing food along gut.'
      },
      {
        id: 7,
        strand: 'i',
        prompt: 'What are the two main functions of hydrochloric acid inside the stomach?',
        target: '1) Kills ingested bacteria/pathogens in food. 2) Provides acidic pH 2 optimum environment for pepsin protease enzyme.',
        hint: 'Kills bacteria in food and creates pH 2 for pepsin enzyme.'
      },
      {
        id: 8,
        strand: 'i',
        prompt: 'Where is Bile produced and stored, and what two jobs does bile perform in the duodenum?',
        target: 'Produced in liver, stored in gallbladder. Jobs: 1) Neutralizes stomach acid. 2) Emulsifies large fat droplets into tiny droplets.',
        hint: 'Neutralizes acid and emulsifies fats into smaller droplets.'
      },
      {
        id: 9,
        strand: 'i',
        prompt: 'How are microscopic villi in the small intestine adapted to absorb digested food into blood?',
        target: 'Finger-like shape provides massive surface area; thin single-cell walls shorten diffusion distance; rich capillary network transports nutrients.',
        hint: 'Massive surface area, thin walls, rich blood capillaries.'
      },
      {
        id: 10,
        strand: 'ii',
        prompt: 'Scenario: A patient with gallstones has their gallbladder surgically removed. Why are they advised to avoid high-fat meals?',
        target: 'Without a gallbladder storing bile, bile cannot be released in large amounts to emulsify heavy fat meals, making fat digestion slow and difficult.',
        hint: 'No gallbladder means less stored bile available to emulsify fats.'
      },
      {
        id: 11,
        strand: 'ii',
        prompt: 'Scenario: Coeliac disease damages and flattens villi in the small intestine. Explain why coeliac patients suffer from weight loss and anemia.',
        target: 'Flattened villi lose surface area for nutrient absorption. Reduced iron absorption causes anemia, and unabsorbed glucose/protein causes weight loss.',
        hint: 'Damaged villi lose surface area needed to absorb iron and food.'
      },
      {
        id: 12,
        strand: 'ii',
        prompt: 'Scenario: Why are antacid tablets taken for acid reflux designed to raise stomach pH toward pH 6-7, and how does this relieve heartburn?',
        target: 'Acid reflux splashes stomach acid (pH 2) into the esophagus, causing burning. Antacid bases neutralize acid, raising pH and stopping esophagus irritation.',
        hint: 'Base neutralizes splashed stomach acid, preventing esophagus burn.'
      }
    ]
  }
];
