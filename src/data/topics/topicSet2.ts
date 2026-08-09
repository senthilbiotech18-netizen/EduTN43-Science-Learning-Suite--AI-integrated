import { Topic } from '../../types';

export const TOPIC_SET_2: Topic[] = [
  {
    id: '8-transport-in-plants',
    title: '8. Transport in Plants',
    level: 'PYP to MYP 5',
    subject: 'Biology',
    description: 'Scaffolded from root water absorption to celery red dye experiments, xylem water columns, stomata transpiration, phloem translocation, and source/sink dynamics.',
    badgeColor: '#2F855A',
    icon: 'TreeLeaf',
    questions: [
      {
        id: 1,
        strand: 'i',
        prompt: 'How does water travel from the soil at the bottom of a plant up to the leaves at the top?',
        target: 'Roots soak up water from soil, and thin inner tubes (xylem) carry water up the stem to the leaves.',
        hint: 'Roots absorb water, and xylem tubes carry water up.'
      },
      {
        id: 2,
        strand: 'i',
        prompt: 'What happens when you place a celery stalk into a jar of red food dye water overnight?',
        target: 'The red water travels up the stem through xylem tubes, turning the celery leaves red.',
        hint: 'Red water moves up the stem, coloring the leaves.'
      },
      {
        id: 3,
        strand: 'i',
        prompt: 'Distinguish between the substances transported by Xylem vessels and Phloem tubes.',
        target: 'Xylem carries water and mineral ions upwards from roots. Phloem carries sucrose sugar and amino acids up and down to growing parts.',
        hint: 'Xylem = water upwards; Phloem = sucrose up and down.'
      },
      {
        id: 4,
        strand: 'i',
        prompt: 'Define "Transpiration" in plant leaves.',
        target: 'The loss of water vapor from leaves by evaporation at mesophyll surfaces followed by diffusion out through stomata.',
        hint: 'Water evaporation from leaf cells diffusing out through stomata.'
      },
      {
        id: 5,
        strand: 'i',
        prompt: 'How does the Transpiration Pull draw water continuously up from roots to leaves?',
        target: 'Water loss at stomata creates tension pulling water up. Cohesion between water molecules keeps the water column unbroken.',
        hint: 'Evaporation creates tension pulling cohesive water molecules up.'
      },
      {
        id: 6,
        strand: 'i',
        prompt: 'How do Temperature and Wind Speed affect the rate of transpiration?',
        target: 'Warm temperature increases water evaporation rate. High wind blows away humid air around stomata, increasing diffusion speed.',
        hint: 'Heat speeds up evaporation; wind blows away humid air.'
      },
      {
        id: 7,
        strand: 'i',
        prompt: 'Define "Translocation" in phloem tissue and state what substances are moved.',
        target: 'Movement of sucrose and amino acids through phloem from food producers (sources) to food users/storage (sinks).',
        hint: 'Transport of sucrose/amino acids from sources to sinks.'
      },
      {
        id: 8,
        strand: 'i',
        prompt: 'Give an example of a plant "source" and "sink" during summer versus early spring.',
        target: 'Summer: photosynthesizing leaves are sources; roots/fruits are sinks. Early spring: stored root tubers are sources; growing leaf buds are sinks.',
        hint: 'Summer source = leaves; early spring source = root tubers.'
      },
      {
        id: 9,
        strand: 'i',
        prompt: 'Why are xylem vessels made of dead hollow cells reinforced with tough lignin rings?',
        target: 'Dead hollow cells allow unobstructed water flow. Lignin prevents xylem walls from collapsing under high negative tension.',
        hint: 'Hollow cells allow free water flow; lignin prevents collapse.'
      },
      {
        id: 10,
        strand: 'ii',
        prompt: 'Scenario: A potted plant is enclosed in a clear plastic bag on a sunny windowsill. Droplets appear inside the bag. Explain what caused them.',
        target: 'Transpiration releases water vapor from stomata. The vapor condenses against the cool plastic bag into liquid water droplets.',
        hint: 'Transpiration releases water vapor, which condenses on plastic.'
      },
      {
        id: 11,
        strand: 'ii',
        prompt: 'Scenario: Using a potometer, a branch absorbs water at 5 mm/min in still air, but 18 mm/min in front of an electric fan. Explain why.',
        target: 'Moving air from the fan removes humid air layer around stomata, steepening the water potential gradient and increasing transpiration.',
        hint: 'Moving air steepens the water potential gradient around stomata.'
      },
      {
        id: 12,
        strand: 'ii',
        prompt: 'Scenario: Bark ringing removes a outer ring of phloem from a tree trunk while leaving inner xylem intact. Predict the effect on roots and leaves.',
        target: 'Leaves receive water via intact xylem and stay green, but sucrose cannot reach roots through severed phloem, causing roots to starve and tree to die.',
        hint: 'Xylem water reaches leaves, but phloem sugar blocked from reaching roots.'
      }
    ]
  },
  {
    id: '9-transport-in-animals',
    title: '9. Transport in Animals',
    level: 'PYP to MYP 5',
    subject: 'Biology',
    description: 'Scaffolded from heart beats and pulse rate to double circulatory system, 4 heart chambers, blood vessels, blood composition, and coronary heart disease.',
    badgeColor: '#2F855A',
    icon: 'Heart',
    questions: [
      {
        id: 1,
        strand: 'i',
        prompt: 'What organ in your chest pumps blood continuously through your body?',
        target: 'The heart pumps blood through blood vessels to all body organs.',
        hint: 'The heart pumps blood.'
      },
      {
        id: 2,
        strand: 'i',
        prompt: 'Why does your heart beat faster and your pulse rate increase when you run or exercise?',
        target: 'To pump blood faster, delivering more oxygen and glucose to active muscle cells for energy.',
        hint: 'To send more oxygen and food to working muscles.'
      },
      {
        id: 3,
        strand: 'i',
        prompt: 'Name the four main components of human blood.',
        target: 'Plasma (liquid), Red blood cells, White blood cells, and Platelets.',
        hint: 'Plasma, red cells, white cells, platelets.'
      },
      {
        id: 4,
        strand: 'i',
        prompt: 'Describe the main function of Red Blood Cells, White Blood Cells, and Platelets.',
        target: 'Red blood cells: transport oxygen. White blood cells: fight pathogens/germs. Platelets: form blood clots to stop bleeding.',
        hint: 'Red = oxygen; White = fight disease; Platelets = blood clotting.'
      },
      {
        id: 5,
        strand: 'i',
        prompt: 'What is a "double circulatory system", and why is it more efficient than a single circulation system?',
        target: 'Blood passes through the heart twice per circuit (pulmonary to lungs, systemic to body). Maintains high blood pressure to body tissues.',
        hint: 'Blood passes through heart twice; maintains high pressure.'
      },
      {
        id: 6,
        strand: 'i',
        prompt: 'Trace the pathway of blood through the four chambers of the heart, including valves.',
        target: 'Vena cava → Right Atrium → Right Ventricle → Pulmonary Artery to lungs → Pulmonary Vein → Left Atrium → Left Ventricle → Aorta to body. Valves prevent backflow.',
        hint: 'Right side (deoxygenated) -> lungs; Left side (oxygenated) -> body.'
      },
      {
        id: 7,
        strand: 'i',
        prompt: 'Why is the muscle wall of the Left Ventricle much thicker than the Right Ventricle?',
        target: 'The left ventricle must pump blood under high pressure around the entire body, whereas the right ventricle pumps blood a short distance to the lungs.',
        hint: 'Left ventricle pumps blood around the whole body.'
      },
      {
        id: 8,
        strand: 'i',
        prompt: 'Compare the structure of Arteries, Veins, and Capillaries.',
        target: 'Arteries: thick elastic walls, small lumen (high pressure). Veins: thin walls, wide lumen, valves (low pressure). Capillaries: 1-cell thick walls for exchange.',
        hint: 'Arteries = thick elastic; Veins = thin with valves; Capillaries = 1 cell thick.'
      },
      {
        id: 9,
        strand: 'i',
        prompt: 'What causes Coronary Heart Disease (CHD), and name three risk factors.',
        target: 'Fatty cholesterol plaque builds up in coronary arteries, reducing oxygen delivery to heart muscle. Risk factors: high saturated fat diet, smoking, lack of exercise, stress.',
        hint: 'Fatty plaque blocks coronary arteries; smoking, high fat diet, inactivity.'
      },
      {
        id: 10,
        strand: 'ii',
        prompt: 'Scenario: A blood test shows a patient has very low platelet count. What clinical symptom will they display?',
        target: 'Their blood will fail to clot properly, leading to excessive bleeding from minor cuts and easy bruising.',
        hint: 'Low platelets mean blood cannot clot normally.'
      },
      {
        id: 11,
        strand: 'ii',
        prompt: 'Scenario: Explain why a hole in the heart septum (between left and right ventricles) causes fatigue and shortness of breath.',
        target: 'Oxygenated blood in left ventricle mixes with deoxygenated blood in right ventricle, lowering oxygen content delivered to body tissues.',
        hint: 'Mixing oxygenated and deoxygenated blood reduces oxygen delivered to body.'
      },
      {
        id: 12,
        strand: 'ii',
        prompt: 'Scenario: Why do leg veins require internal semi-lunar valves, whereas leg arteries do not?',
        target: 'Veins carry low-pressure blood upward against gravity, needing valves to prevent backflow. Arteries carry high-pressure blood propelled directly by heart contractions.',
        hint: 'Veins carry low-pressure blood against gravity, needing valves.'
      }
    ]
  },
  {
    id: '10-disease-and-immunity',
    title: '10. Pathogens, Disease & Immunity',
    level: 'PYP to MYP 5',
    subject: 'Biology',
    description: 'Scaffolded from washing hands to pathogen types, mechanical barriers, white blood cell phagocytosis/lymphocytes, antibodies, vaccines, and antibiotic resistance.',
    badgeColor: '#2F855A',
    icon: 'Shield',
    questions: [
      {
        id: 1,
        strand: 'i',
        prompt: 'What are "germs" (pathogens), and why does washing hands with soap prevent getting sick?',
        target: 'Pathogens are tiny disease-causing microorganisms (bacteria, viruses). Washing hands removes pathogens before they enter our body.',
        hint: 'Pathogens cause illness; soap washes them away.'
      },
      {
        id: 2,
        strand: 'i',
        prompt: 'Name two natural physical barriers your body uses to block germs from entering.',
        target: 'Skin acts as a waterproof outer barrier, and stomach acid kills germs swallowed in food.',
        hint: 'Outer skin and stomach acid.'
      },
      {
        id: 3,
        strand: 'i',
        prompt: 'List the four main types of disease-causing pathogens and give one example of each.',
        target: 'Bacteria (e.g. Salmonella), Viruses (e.g. Influenza), Fungi (e.g. Athlete\'s foot), Protoctists (e.g. Malaria parasite).',
        hint: 'Bacteria, Virus, Fungus, Protoctist.'
      },
      {
        id: 4,
        strand: 'i',
        prompt: 'How do Phagocytes (a type of white blood cell) destroy pathogens?',
        target: 'Phagocytes engulf pathogens into vacuoles and digest them using internal digestive enzymes (phagocytosis).',
        hint: 'Phagocytes engulf and digest pathogens.'
      },
      {
        id: 5,
        strand: 'i',
        prompt: 'How do Lymphocytes defend the body against specific pathogens?',
        target: 'Lymphocytes produce specific Y-shaped antibodies that bind to matching antigens on pathogen surfaces, marking them for destruction.',
        hint: 'Lymphocytes produce antibodies matching pathogen antigens.'
      },
      {
        id: 6,
        strand: 'i',
        prompt: 'How does a vaccine create immunity against a disease without making you sick?',
        target: 'Vaccine introduces harmless weakened/dead pathogen antigens. Lymphocytes produce specific antibodies and memory cells that respond rapidly if infected later.',
        hint: 'Weakened antigens trigger antibodies and memory cells.'
      },
      {
        id: 7,
        strand: 'i',
        prompt: 'Distinguish between Active Immunity and Passive Immunity.',
        target: 'Active immunity: body makes its own antibodies and memory cells (long-term). Passive immunity: receives ready-made antibodies (e.g. breast milk; short-term, no memory cells).',
        hint: 'Active = body makes antibodies (long-term); Passive = ready-made antibodies (short-term).'
      },
      {
        id: 8,
        strand: 'i',
        prompt: 'Why do antibiotics kill bacteria but are completely ineffective against viral infections like flu or COVID-19?',
        target: 'Antibiotics target bacterial cell walls and metabolic enzymes. Viruses reproduce inside host human cells and lack cell walls/bacterial machinery.',
        hint: 'Antibiotics target bacterial cell walls; viruses live inside human cells.'
      },
      {
        id: 9,
        strand: 'i',
        prompt: 'How does overuse or incomplete courses of antibiotics lead to antibiotic-resistant superbugs (like MRSA)?',
        target: 'Stopping antibiotics early leaves resistant mutant bacteria alive to multiply and spread, passing resistance genes to future generations.',
        hint: 'Stopping antibiotics early lets resistant bacteria multiply.'
      },
      {
        id: 10,
        strand: 'ii',
        prompt: 'Scenario: A person receives tetanus antitoxin antibody injection after a rusty nail injury. Is this active or passive immunity?',
        target: 'Passive immunity — pre-made antibodies are injected for immediate protection, but no memory cells are created, so protection is temporary.',
        hint: 'Injected pre-made antibodies give temporary passive immunity.'
      },
      {
        id: 11,
        strand: 'ii',
        prompt: 'Scenario: Why does a second infection by the same virus produce a much faster, stronger antibody response than the first exposure?',
        target: 'Memory lymphocytes from first exposure recognize the antigen instantly, dividing rapidly to produce massive antibody levels before symptoms appear.',
        hint: 'Memory cells recognize the antigen and produce antibodies instantly.'
      },
      {
        id: 12,
        strand: 'ii',
        prompt: 'Scenario: Explain why cholera bacteria cause severe watery diarrhea and dehydration at the cellular intestine level.',
        target: 'Cholera toxin triggers intestinal cells to secrete chloride ions into the gut lumen. Water follows by osmosis out of blood into gut, causing severe watery diarrhea.',
        hint: 'Chloride secretion draws water out of blood into gut by osmosis.'
      }
    ]
  },
  {
    id: '11-gas-exchange',
    title: '11. Gas Exchange & Respiratory System',
    level: 'PYP to MYP 5',
    subject: 'Biology',
    description: 'Scaffolded from breathing in/out to respiratory anatomy, alveoli gas exchange adaptations, breathing mechanics (diaphragm/ribs), and smoking impacts.',
    badgeColor: '#2F855A',
    icon: 'Activity',
    questions: [
      {
        id: 1,
        strand: 'i',
        prompt: 'What gas do humans breathe IN from the air, and what gas do we breathe OUT?',
        target: 'We breathe IN oxygen gas and breathe OUT carbon dioxide gas.',
        hint: 'Breathe in oxygen; breathe out carbon dioxide.'
      },
      {
        id: 2,
        strand: 'i',
        prompt: 'Which organs inside your chest fill up with air when you take a deep breath?',
        target: 'The lungs fill up with air inside the ribcage.',
        hint: 'The lungs fill with air.'
      },
      {
        id: 3,
        strand: 'i',
        prompt: 'Trace the path air takes from nose to alveoli air sacs.',
        target: 'Nose/Mouth → Trachea → Bronchi → Bronchioles → Alveoli air sacs.',
        hint: 'Trachea -> Bronchi -> Bronchioles -> Alveoli.'
      },
      {
        id: 4,
        strand: 'i',
        prompt: 'List four structural adaptations of Alveoli air sacs that maximize gas exchange.',
        target: '1) Massive total surface area. 2) Wall is 1 cell thick (short diffusion distance). 3) Dense capillary network. 4) Moist inner lining.',
        hint: 'Massive surface area, 1-cell thick wall, dense capillaries, moist lining.'
      },
      {
        id: 5,
        strand: 'i',
        prompt: 'Describe the muscle movements of the Diaphragm and Intercostal muscles during Inspiration (breathing in).',
        target: 'Diaphragm contracts and flattens down; external intercostals contract pulling ribs up and out. Thorax volume increases, pressure drops below atmospheric, drawing air in.',
        hint: 'Diaphragm flattens down, ribs move up and out, volume increases.'
      },
      {
        id: 6,
        strand: 'i',
        prompt: 'Describe the muscle movements during Expiration (breathing out).',
        target: 'Diaphragm relaxes and arches up; intercostals relax so ribs move down and in. Thorax volume decreases, pressure rises, pushing air out.',
        hint: 'Diaphragm relaxes up, ribs move down and in, volume decreases.'
      },
      {
        id: 7,
        strand: 'i',
        prompt: 'Compare inspired air versus expired air percentages of Oxygen and Carbon Dioxide.',
        target: 'Inspired: ~21% O2, ~0.04% CO2. Expired: ~16% O2, ~4% CO2 (plus higher water vapor and warmer temperature).',
        hint: 'Inspired = 21% O2, 0.04% CO2; Expired = 16% O2, 4% CO2.'
      },
      {
        id: 8,
        strand: 'i',
        prompt: 'How do mucus and ciliated epithelial cells clean the airways?',
        target: 'Sticky mucus traps dust and pathogens; hair-like cilia beat continuously to sweep mucus upward to the throat to be swallowed.',
        hint: 'Mucus traps dust; cilia sweep mucus up to the throat.'
      },
      {
        id: 9,
        strand: 'i',
        prompt: 'Name three toxic components of cigarette smoke and state their harmful effects on the body.',
        target: 'Tar: paralyzes cilia, causes emphysema/lung cancer. Nicotine: addictive, narrows blood vessels (raises BP). Carbon monoxide: binds hemoglobin, reducing O2 transport.',
        hint: 'Tar = paralyzes cilia/cancer; Nicotine = addictive; CO = binds hemoglobin.'
      },
      {
        id: 10,
        strand: 'ii',
        prompt: 'Scenario: Emphysema breaks down alveolar walls, merging tiny air sacs into large spaces. Why does an emphysema patient suffer severe breathlessness?',
        target: 'Merging alveoli drastically reduces total surface area for gas exchange, so less oxygen diffuses into blood per breath.',
        hint: 'Reduced alveolar surface area means less oxygen diffuses into blood.'
      },
      {
        id: 11,
        strand: 'ii',
        prompt: 'Scenario: Carbon monoxide in smoke binds irreversibly to hemoglobin. Why does this cause a pregnant smoker\'s fetus to suffer stunted growth?',
        target: 'Hemoglobin bound to CO cannot transport oxygen across placenta. Fetal cells receive less oxygen for aerobic respiration, reducing ATP energy for cell growth.',
        hint: 'CO blocks oxygen transport across placenta, reducing ATP for growth.'
      },
      {
        id: 12,
        strand: 'ii',
        prompt: 'Scenario: During hard exercise, blood CO2 levels rise, forming carbonic acid. How does the brain respond to restore blood pH?',
        target: 'Brain receptors detect lower blood pH and signal intercostal muscles and diaphragm to contract faster and deeper, increasing ventilation rate to exhale CO2.',
        hint: 'Brain detects lower pH from CO2 and speeds up breathing rate.'
      }
    ]
  },
  {
    id: '12-respiration',
    title: '12. Respiration (Aerobic & Anaerobic)',
    level: 'PYP to MYP 5',
    subject: 'Biology',
    description: 'Scaffolded from basic cell energy needs to aerobic word/symbol equations, ATP yield, anaerobic respiration in muscles vs. yeast, and oxygen debt.',
    badgeColor: '#2F855A',
    icon: 'Zap',
    questions: [
      {
        id: 1,
        strand: 'i',
        prompt: 'Why do living organisms need to perform respiration every day?',
        target: 'Respiration breaks down food molecules to release energy (ATP) required for cell growth, movement, warmth, and active transport.',
        hint: 'To release energy from food for cell processes.'
      },
      {
        id: 2,
        strand: 'i',
        prompt: 'What is respiration in simple terms?',
        target: 'The chemical process inside living cells that breaks down glucose food to release usable energy.',
        hint: 'Chemical breakdown of food inside cells to release energy.'
      },
      {
        id: 3,
        strand: 'i',
        prompt: 'Write the word and balanced chemical equation for Aerobic Respiration.',
        target: 'Glucose + Oxygen --> Carbon dioxide + Water + Energy. (C6H12O6 + 6O2 --> 6CO2 + 6H2O + ATP).',
        hint: 'Glucose + O2 -> CO2 + H2O + ATP.'
      },
      {
        id: 4,
        strand: 'i',
        prompt: 'Where inside a cell does aerobic respiration take place?',
        target: 'In the mitochondria.',
        hint: 'Mitochondria energy powerhouses.'
      },
      {
        id: 5,
        strand: 'i',
        prompt: 'Write the word equation for Anaerobic Respiration in human muscles during intense exercise.',
        target: 'Glucose --> Lactic acid (+ small amount of energy).',
        hint: 'Glucose breaks down into Lactic acid.'
      },
      {
        id: 6,
        strand: 'i',
        prompt: 'Write the word equation for Anaerobic Respiration in yeast cells (fermentation).',
        target: 'Glucose --> Alcohol (Ethanol) + Carbon dioxide (+ small amount of energy).',
        hint: 'Glucose yields Ethanol + CO2.'
      },
      {
        id: 7,
        strand: 'i',
        prompt: 'Why does anaerobic respiration release much less energy per glucose molecule than aerobic respiration?',
        target: 'Because glucose breakdown is incomplete without oxygen, leaving most chemical energy trapped inside lactic acid or ethanol.',
        hint: 'Incomplete glucose breakdown leaves energy trapped in products.'
      },
      {
        id: 8,
        strand: 'i',
        prompt: 'What is "Oxygen Debt", and why do you continue breathing heavily after finishing a 100-meter sprint?',
        target: 'Extra oxygen required after exercise to break down accumulated toxic lactic acid in the liver into harmless CO2 and water.',
        hint: 'Extra oxygen needed to break down lactic acid built up in muscles.'
      },
      {
        id: 9,
        strand: 'i',
        prompt: 'Give two industrial uses of anaerobic respiration in yeast.',
        target: '1) Bread baking: CO2 gas bubbles make dough rise. 2) Brewing: ethanol alcohol produces beer and wine.',
        hint: 'CO2 makes bread dough rise; ethanol makes alcohol.'
      },
      {
        id: 10,
        strand: 'ii',
        prompt: 'Scenario: Yeast and warm sugar solution are placed in a flask with a balloon over the neck. The balloon inflates. Name the gas and chemical product inside liquid.',
        target: 'Gas inflating balloon = Carbon dioxide (CO2). Chemical product in liquid = Ethanol (alcohol).',
        hint: 'CO2 inflates the balloon; ethanol stays in the liquid.'
      },
      {
        id: 11,
        strand: 'ii',
        prompt: 'Scenario: Germinating seeds inside a thermos flask cause temperature to rise from 20°C to 28°C. Explain why.',
        target: 'Germinating seeds carry out high rates of aerobic respiration. Some chemical energy is released as heat energy, raising flask temperature.',
        hint: 'Aerobic respiration releases heat energy, warming the flask.'
      },
      {
        id: 12,
        strand: 'ii',
        prompt: 'Scenario: Compare the energy efficiency and chemical end-products of aerobic vs anaerobic respiration in humans.',
        target: 'Aerobic: complete glucose breakdown with O2, producing CO2 + H2O and high ATP (~36). Anaerobic: incomplete breakdown without O2, producing lactic acid and low ATP (2).',
        hint: 'Aerobic = complete breakdown (36 ATP); Anaerobic = incomplete breakdown (2 ATP).'
      }
    ]
  },
  {
    id: '13-excretion-in-humans',
    title: '13. Excretion in Humans',
    level: 'PYP to MYP 5',
    subject: 'Biology',
    description: 'Scaffolded from urine/sweat waste removal to kidney anatomy, nephron ultrafiltration, selective reabsorption, ADH hormone water balance, and dialysis.',
    badgeColor: '#2F855A',
    icon: 'Activity',
    questions: [
      {
        id: 1,
        strand: 'i',
        prompt: 'Why does your body produce urine and sweat?',
        target: 'To remove metabolic waste products (like urea) and extra water/salts from blood.',
        hint: 'To remove waste products and extra water/salts.'
      },
      {
        id: 2,
        strand: 'i',
        prompt: 'Which bean-shaped organs in your lower back filter blood to produce urine?',
        target: 'The kidneys.',
        hint: 'The kidneys filter blood.'
      },
      {
        id: 3,
        strand: 'i',
        prompt: 'Define "Excretion" and state three main excretory products produced by human cells.',
        target: 'Excretion is removal of toxic metabolic waste made inside cells. Products: Carbon dioxide (lungs), Urea (kidneys/urine), Excess salts/water (sweat/urine).',
        hint: 'Removal of metabolic waste: CO2, Urea, excess salts/water.'
      },
      {
        id: 4,
        strand: 'i',
        prompt: 'How and where is Urea formed in the human body?',
        target: 'Formed in the liver by deamination of excess unused amino acids into urea and glucose.',
        hint: 'Liver breaks down excess amino acids into urea.'
      },
      {
        id: 5,
        strand: 'i',
        prompt: 'Trace the path of urine from kidney nephrons to exit from the body.',
        target: 'Kidneys → Ureters → Urinary Bladder (storage) → Urethra → Exit.',
        hint: 'Kidney -> Ureter -> Bladder -> Urethra.'
      },
      {
        id: 6,
        strand: 'i',
        prompt: 'Describe Ultrafiltration in the kidney glomerulus/Bowman\'s capsule.',
        target: 'High blood pressure forces small molecules (water, glucose, urea, salts) out of glomerulus capillaries into Bowman\'s capsule. Large proteins/blood cells stay in blood.',
        hint: 'High pressure forces small molecules out of blood into capsule.'
      },
      {
        id: 7,
        strand: 'i',
        prompt: 'What is "Selective Reabsorption", and where in the nephron does all glucose get reabsorbed back into blood?',
        target: 'Useful molecules are pumped back into blood. All glucose is reabsorbed by active transport in the Proximal Convoluted Tubule.',
        hint: 'All glucose is pumped back into blood in the proximal tubule.'
      },
      {
        id: 8,
        strand: 'i',
        prompt: 'How does ADH hormone regulate water potential when you are dehydrated on a hot day?',
        target: 'Pituitary secretes more ADH into blood. ADH makes collecting duct walls more permeable to water, so more water is reabsorbed back into blood (producing concentrated small urine).',
        hint: 'More ADH increases collecting duct water reabsorption.'
      },
      {
        id: 9,
        strand: 'i',
        prompt: 'How does a kidney dialysis machine remove urea from a kidney failure patient\'s blood?',
        target: 'Blood passes through partially permeable tubing surrounded by dialysis fluid. Urea diffuses down concentration gradient from blood into fluid.',
        hint: 'Urea diffuses across partially permeable tubing into dialysis fluid.'
      },
      {
        id: 10,
        strand: 'ii',
        prompt: 'Scenario: A urinalysis test detects glucose in a patient\'s urine. What medical condition does this indicate, and why?',
        target: 'Diabetes mellitus — blood glucose is so high that proximal tubule active transport carriers become saturated, leaving unabsorbed glucose in urine.',
        hint: 'High blood glucose saturates tubule carriers, leaving glucose in urine.'
      },
      {
        id: 11,
        strand: 'ii',
        prompt: 'Scenario: Why must dialysis fluid contain exact normal concentrations of glucose and mineral salts, but zero urea?',
        target: 'Zero urea ensures maximum urea diffuses out of blood. Matching glucose/salt concentration prevents loss of vital blood glucose/salts.',
        hint: 'Zero urea maximizes urea removal; matching glucose prevents loss.'
      },
      {
        id: 12,
        strand: 'ii',
        prompt: 'Scenario: Explain why drinking a large volume of water causes the pituitary gland to release LESS ADH, and describe the resulting urine.',
        target: 'High blood water potential inhibits ADH release. Collecting ducts become impermeable to water, so less water is reabsorbed, producing a large volume of pale dilute urine.',
        hint: 'Less ADH makes collecting duct impermeable, producing dilute urine.'
      }
    ]
  },
  {
    id: '14-coordination-and-response',
    title: '14. Nervous System, Hormones & Tropisms',
    level: 'PYP to MYP 5',
    subject: 'Biology',
    description: 'Scaffolded from touching a hot stove reflex to central nervous system, neurones, reflex arc, eye structure, endocrine hormones, and plant phototropism.',
    badgeColor: '#2F855A',
    icon: 'Zap',
    questions: [
      {
        id: 1,
        strand: 'i',
        prompt: 'What happens automatically if your hand touches a hot stove plate by accident?',
        target: 'You pull your hand away instantly without thinking (a reflex action) to protect yourself from getting burned.',
        hint: 'You pull your hand away quickly.'
      },
      {
        id: 2,
        strand: 'i',
        prompt: 'Which two main organs make up your Central Nervous System (CNS)?',
        target: 'The brain and spinal cord.',
        hint: 'Brain and spinal cord.'
      },
      {
        id: 3,
        strand: 'i',
        prompt: 'Trace the pathway of a Reflex Arc from stimulus to response.',
        target: 'Stimulus → Receptor → Sensory Neurone → Relay Neurone (spinal cord) → Motor Neurone → Effector (muscle) → Response.',
        hint: 'Receptor -> Sensory neurone -> Relay -> Motor neurone -> Muscle.'
      },
      {
        id: 4,
        strand: 'i',
        prompt: 'How do nerve impulses travel across a microscopic gap (synapse) between two neurones?',
        target: 'Impulse triggers release of neurotransmitter chemicals from vesicles, which diffuse across the synaptic gap to bind matching receptors.',
        hint: 'Neurotransmitter chemicals diffuse across synaptic gap.'
      },
      {
        id: 5,
        strand: 'i',
        prompt: 'How does the human eye Pupil respond to bright light versus dim light?',
        target: 'Bright light: circular iris muscles contract, pupil constricts (shrinks) to protect retina. Dim light: radial muscles contract, pupil dilates (enlarges).',
        hint: 'Bright light shrinks pupil; dim light enlarges pupil.'
      },
      {
        id: 6,
        strand: 'i',
        prompt: 'How does the eye lens change shape to focus on a Near object (accommodation)?',
        target: 'Ciliary muscles contract, suspensory ligaments go slack, lens becomes fat/rounded (more refractive).',
        hint: 'Ciliary muscles contract, ligaments go slack, lens becomes rounded.'
      },
      {
        id: 7,
        strand: 'i',
        prompt: 'How do Insulin and Glucagon hormones regulate blood glucose levels after a meal vs during fasting?',
        target: 'High glucose: pancreas releases insulin to store glucose as glycogen in liver. Low glucose: pancreas releases glucagon to break glycogen back to glucose.',
        hint: 'Insulin lowers blood glucose; Glucagon raises blood glucose.'
      },
      {
        id: 8,
        strand: 'i',
        prompt: 'What physiological fight-or-flight responses are triggered by Adrenaline hormone?',
        target: 'Increases heart rate, dilates airways, increases blood glucose, diverts blood to muscles, dilates pupils.',
        hint: 'Increases heart rate, dilates airways, boosts blood glucose.'
      },
      {
        id: 9,
        strand: 'i',
        prompt: 'Define Phototropism and Gravitropism in plant shoots and roots.',
        target: 'Phototropism: plant growth response to light direction. Gravitropism: growth response to gravity.',
        hint: 'Phototropism = growth response to light; Gravitropism = response to gravity.'
      },
      {
        id: 10,
        strand: 'ii',
        prompt: 'Scenario: Explain how Auxin hormone causes a plant shoot tip to bend TOWARD light coming from one side.',
        target: 'Auxin accumulates on shaded side of shoot, stimulating cells on shaded side to elongate faster, causing shoot to bend toward light.',
        hint: 'Auxin accumulates on shaded side, making shaded cells elongate faster.'
      },
      {
        id: 11,
        strand: 'ii',
        prompt: 'Scenario: Compare nervous communication vs endocrine (hormonal) communication speed and duration.',
        target: 'Nervous: electrical impulses via neurones, extremely fast, short-lived localized response. Endocrine: chemical hormones via blood, slower, long-lasting widespread response.',
        hint: 'Nervous = fast electrical impulses; Endocrine = slower chemical hormones in blood.'
      },
      {
        id: 12,
        strand: 'ii',
        prompt: 'Scenario: Why does a person with Type 1 Diabetes require daily insulin injections, whereas Type 2 Diabetes is managed primarily by diet/exercise?',
        target: 'Type 1: autoimmune destruction of pancreas beta cells (cannot produce insulin). Type 2: body cells become resistant to insulin.',
        hint: 'Type 1 cannot make insulin; Type 2 cells are resistant to insulin.'
      }
    ]
  }
];
