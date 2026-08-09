import { Topic } from '../../types';

export const TOPIC_SET_3: Topic[] = [
  {
    id: '15-drugs',
    title: '15. Medicinal Drugs & Effects',
    level: 'PYP to MYP 5',
    subject: 'Biology',
    description: 'Scaffolded from medicine safety to antibiotic action, drug dependency, alcohol depressant effects on reaction times, and liver health.',
    badgeColor: '#2F855A',
    icon: 'Pill',
    questions: [
      {
        id: 1,
        strand: 'i',
        prompt: 'What is a medicine, and why should children only take medicine given by a parent or doctor?',
        target: 'Medicines are substances that treat illness or reduce pain. Taking wrong doses or unprescribed medicines can be harmful.',
        hint: 'Substances that treat illness, but must be taken safely.'
      },
      {
        id: 2,
        strand: 'i',
        prompt: 'What are Antibiotics used for in medical treatment?',
        target: 'Antibiotics are medicines that kill harmful bacteria causing infections.',
        hint: 'Medicines that kill harmful bacteria.'
      },
      {
        id: 3,
        strand: 'i',
        prompt: 'Define a "Drug" in biological terms.',
        target: 'Any substance taken into the body that modifies or affects chemical reactions inside cells.',
        hint: 'Substance taken into body that affects chemical reactions.'
      },
      {
        id: 4,
        strand: 'i',
        prompt: 'Distinguish between Medicinal Drugs and Misused/Abused Drugs.',
        target: 'Medicinal drugs treat or cure disease (e.g. antibiotics, painkillers). Misused drugs are taken recreationally, causing physical/psychological harm.',
        hint: 'Medicinal drugs treat disease; misused drugs cause harm.'
      },
      {
        id: 5,
        strand: 'i',
        prompt: 'Why do antibiotics kill bacteria but are completely ineffective against viral infections like flu or COVID-19?',
        target: 'Antibiotics target bacterial cell walls and metabolic enzymes. Viruses live inside host human cells and lack cell walls.',
        hint: 'Antibiotics target bacterial cell walls; viruses live inside host cells.'
      },
      {
        id: 6,
        strand: 'i',
        prompt: 'Define "Tolerance", "Withdrawal", and "Addiction" regarding drug misuse.',
        target: 'Tolerance: body needs higher doses for same effect. Withdrawal: painful physical symptoms when stopping. Addiction: chemical dependency on a drug.',
        hint: 'Tolerance = higher dose needed; Withdrawal = sickness without drug; Addiction = dependency.'
      },
      {
        id: 7,
        strand: 'i',
        prompt: 'Is Alcohol a depressant or a stimulant, and how does it affect driver reaction time?',
        target: 'Depressant — it slows down central nervous system activity, increasing reaction time (slowing reflexes) and impairing judgment.',
        hint: 'Depressant that slows brain impulses, increasing reaction times.'
      },
      {
        id: 8,
        strand: 'i',
        prompt: 'What long-term organ damage is caused by chronic heavy Alcohol consumption?',
        target: 'Liver Cirrhosis — alcohol destroys liver cells, replacing functional tissue with non-functional scar tissue, leading to liver failure.',
        hint: 'Liver cirrhosis: healthy tissue destroyed and replaced by scar tissue.'
      },
      {
        id: 9,
        strand: 'i',
        prompt: 'What are Anabolic Steroids, and why do some athletes misuse them despite health risks?',
        target: 'Synthetic testosterone hormones that stimulate protein synthesis and muscle growth, building strength and endurance rapidly.',
        hint: 'Synthetic testosterone that increases protein synthesis and muscle growth.'
      },
      {
        id: 10,
        strand: 'ii',
        prompt: 'Scenario: A patient demands antibiotics for a viral sore throat. Explain why a doctor refuses this prescription.',
        target: 'Antibiotics do not affect viruses. Prescribing antibiotics unnecessarily promotes development of resistant antibiotic superbugs.',
        hint: 'Antibiotics do not kill viruses and create antibiotic resistance.'
      },
      {
        id: 11,
        strand: 'ii',
        prompt: 'Scenario: Explain how heroin affects neurotransmitters across synapses in the brain, leading to addiction.',
        target: 'Heroin mimics natural endorphins, binding opioid receptors and flooding brain with dopamine. Brain stops making natural endorphins, driving addiction.',
        hint: 'Heroin mimics endorphins, flooding brain with dopamine.'
      },
      {
        id: 12,
        strand: 'ii',
        prompt: 'Scenario: Why does tobacco smoke containing nicotine raise blood pressure and increase heart attack risk?',
        target: 'Nicotine stimulates adrenaline release, narrowing blood vessels (vasoconstriction) and increasing heart rate, raising blood pressure.',
        hint: 'Nicotine narrows blood vessels and speeds heart rate, raising blood pressure.'
      }
    ]
  },
  {
    id: '16-reproduction',
    title: '16. Reproduction in Plants & Humans',
    level: 'PYP to MYP 5',
    subject: 'Biology',
    description: 'Scaffolded from flower pollination and seeds to sexual vs. asexual reproduction, human reproductive anatomy, menstrual cycle, and placenta function.',
    badgeColor: '#2F855A',
    icon: 'Heart',
    questions: [
      {
        id: 1,
        strand: 'i',
        prompt: 'What is reproduction, and why is it necessary for living species?',
        target: 'Reproduction is how living things produce offspring so their species continues without going extinct.',
        hint: 'Producing offspring so a species continues.'
      },
      {
        id: 2,
        strand: 'i',
        prompt: 'How do insect-pollinated flowers attract bees and butterflies to help make seeds?',
        target: 'Flowers have bright colorful petals, sweet scent, and sugary nectar.',
        hint: 'Bright colorful petals, scent, and sugary nectar.'
      },
      {
        id: 3,
        strand: 'i',
        prompt: 'Distinguish between Sexual Reproduction and Asexual Reproduction.',
        target: 'Sexual: 2 parents, fusion of gametes (sperm/egg), genetic variation. Asexual: 1 parent, no gametes, produces identical clones.',
        hint: 'Sexual = 2 parents with variation; Asexual = 1 parent producing clones.'
      },
      {
        id: 4,
        strand: 'i',
        prompt: 'Compare Insect-Pollinated Flowers versus Wind-Pollinated Flowers.',
        target: 'Insect: large colorful petals, sticky pollen, enclosed stigma. Wind: small dull petals, feathery exposed stigmas, light smooth pollen.',
        hint: 'Insect = bright petals, sticky pollen; Wind = feathery stigmas, light pollen.'
      },
      {
        id: 5,
        strand: 'i',
        prompt: 'Trace the path of a sperm cell fertilizing an egg inside a flower.',
        target: 'Pollen lands on Stigma → Pollen tube grows down Style into Ovary → Male nucleus enters Ovule to fertilize Egg cell.',
        hint: 'Pollen on stigma -> pollen tube down style into ovary -> fertilizes ovule.'
      },
      {
        id: 6,
        strand: 'i',
        prompt: 'Identify the functions of Testes, Sperm Ducts, Ovaries, and Oviducts (Fallopian tubes) in humans.',
        target: 'Testes: produce sperm/testosterone. Sperm duct: carries sperm. Ovaries: produce eggs/estrogen. Oviduct: site of fertilization.',
        hint: 'Testes = sperm; Sperm duct = carries sperm; Ovaries = eggs; Oviduct = fertilization.'
      },
      {
        id: 7,
        strand: 'i',
        prompt: 'Describe key events of the 28-day Human Menstrual Cycle (Days 1-5, Day 14, Days 15-28).',
        target: 'Days 1-5: Menstruation (uterus lining sheds). Day 14: Ovulation (egg released). Days 15-28: Uterus lining thickens for potential embryo.',
        hint: 'Days 1-5 = period; Day 14 = ovulation; Days 15-28 = lining thickens.'
      },
      {
        id: 8,
        strand: 'i',
        prompt: 'Describe the vital exchange functions of the Placenta and Umbilical Cord during pregnancy.',
        target: 'Placenta: diffuses oxygen, glucose, and nutrients from mother to fetus, and removes fetal CO2 and urea. Maternal and fetal blood do not mix directly.',
        hint: 'Diffuses oxygen/nutrients to fetus and removes CO2/urea without blood mixing.'
      },
      {
        id: 9,
        strand: 'i',
        prompt: 'How do barrier methods (condoms) prevent both unwanted pregnancy and STIs like HIV?',
        target: 'Condoms physically block sperm from entering vagina and stop bodily fluid contact that transmits HIV/STIs.',
        hint: 'Physical barrier blocks sperm and prevents fluid transmission of HIV.'
      },
      {
        id: 10,
        strand: 'ii',
        prompt: 'Scenario: Explain how FSH, Estrogen, LH, and Progesterone hormones interact to control ovulation during the menstrual cycle.',
        target: 'FSH matures follicle → Follicle releases Estrogen (thickens lining) → Estrogen peak triggers LH surge (Ovulation) → Corpus luteum releases Progesterone (maintains lining).',
        hint: 'FSH matures follicle -> Estrogen thickens lining -> LH triggers ovulation -> Progesterone maintains lining.'
      },
      {
        id: 11,
        strand: 'ii',
        prompt: 'Scenario: Why does a pregnant woman drinking alcohol or smoking cigarettes pose serious risks to fetal development?',
        target: 'Alcohol and nicotine diffuse across placenta into fetal blood. Alcohol damages fetal brain cells; nicotine constricts placenta vessels, causing hypoxia and low birth weight.',
        hint: 'Toxins cross placenta, damaging fetal brain cells and reducing oxygen.'
      },
      {
        id: 12,
        strand: 'ii',
        prompt: 'Scenario: Compare evolutionary advantages and disadvantages of Sexual vs Asexual reproduction in a changing environment.',
        target: 'Sexual: creates genetic variation (adapt to new diseases/climate), but requires finding mates. Asexual: fast population growth, but no variation (susceptible to mass extinction).',
        hint: 'Sexual provides variation to adapt; Asexual is fast but lacks variation.'
      }
    ]
  },
  {
    id: '17-inheritance',
    title: '17. Genetics & Inheritance',
    level: 'PYP to MYP 5',
    subject: 'Biology',
    description: 'Scaffolded from inheriting family traits to DNA chromosomes, genes, dominant/recessive alleles, Punnett square crosses, and sex determination.',
    badgeColor: '#2F855A',
    icon: 'Dna',
    questions: [
      {
        id: 1,
        strand: 'i',
        prompt: 'Why do children look similar to their parents (like having similar eye color or hair shape)?',
        target: 'Because children inherit genetic information (genes) passed down from their parents.',
        hint: 'Children inherit genes from parents.'
      },
      {
        id: 2,
        strand: 'i',
        prompt: 'Where inside a cell is genetic code stored, and in what structures?',
        target: 'Inside the nucleus, stored on thread-like structures called chromosomes made of DNA.',
        hint: 'In nucleus on chromosomes made of DNA.'
      },
      {
        id: 3,
        strand: 'i',
        prompt: 'Define a "Gene" and an "Allele".',
        target: 'Gene: a length of DNA coding for a specific protein. Allele: an alternative version of a gene (e.g. blue eye allele vs brown eye allele).',
        hint: 'Gene = DNA length coding for a protein; Allele = alternative version of a gene.'
      },
      {
        id: 4,
        strand: 'i',
        prompt: 'Distinguish between Genotype and Phenotype.',
        target: 'Genotype: the genetic allele combination (e.g. Bb). Phenotype: the observable physical characteristic (e.g. Brown eyes).',
        hint: 'Genotype = allele combination (Bb); Phenotype = physical trait (Brown eyes).'
      },
      {
        id: 5,
        strand: 'i',
        prompt: 'Define Homozygous Dominant, Homozygous Recessive, and Heterozygous.',
        target: 'Homozygous Dominant: 2 identical dominant alleles (BB). Homozygous Recessive: 2 identical recessive alleles (bb). Heterozygous: 1 dominant and 1 recessive allele (Bb).',
        hint: 'BB = homozygous dominant; bb = homozygous recessive; Bb = heterozygous.'
      },
      {
        id: 6,
        strand: 'i',
        prompt: 'How do human sex chromosomes (X and Y) determine whether a baby is biologically Male or Female?',
        target: 'Females have two X chromosomes (XX). Males have one X and one Y chromosome (XY). Father\'s sperm determines baby sex.',
        hint: 'Females = XX; Males = XY.'
      },
      {
        id: 7,
        strand: 'i',
        prompt: 'Draw a Punnett square for two Heterozygous brown-eyed parents (Bb × Bb). What is the ratio of brown to blue eyes in offspring?',
        target: 'Genotypes: 1 BB : 2 Bb : 1 bb. Phenotype ratio: 3 Brown eyes : 1 Blue eye (75% brown, 25% blue).',
        hint: '3 brown eyes to 1 blue eye (3:1 ratio).'
      },
      {
        id: 8,
        strand: 'i',
        prompt: 'Distinguish between Mitosis cell division and Meiosis cell division.',
        target: 'Mitosis: produces 2 genetically identical diploid body cells (for growth/repair). Meiosis: produces 4 genetically unique haploid gametes (for reproduction).',
        hint: 'Mitosis = 2 identical diploid cells; Meiosis = 4 unique haploid gametes.'
      },
      {
        id: 9,
        strand: 'i',
        prompt: 'How does Co-dominance work in ABO blood groups (IA, IB, i alleles)?',
        target: 'IA and IB alleles are co-dominant (both expressed in blood group AB). Allele i is recessive (group O = ii).',
        hint: 'IA and IB are co-dominant, producing AB blood type.'
      },
      {
        id: 10,
        strand: 'ii',
        prompt: 'Scenario: Two unaffected carrier parents for Cystic Fibrosis (Cc × Cc) have a child. What is the probability the child inherits cystic fibrosis?',
        target: '25% chance (1 in 4) of inheriting genotype cc (recessive disorder).',
        hint: '25% probability of genotype cc.'
      },
      {
        id: 11,
        strand: 'ii',
        prompt: 'Scenario: Why are sex-linked recessive conditions (like red-green colorblindness) much more common in human males than females?',
        target: 'Gene is on X chromosome. Males (XY) have only 1 X chromosome, so 1 recessive allele causes the condition. Females (XX) need 2 recessive alleles.',
        hint: 'Males have 1 X chromosome, so 1 recessive allele causes the condition.'
      },
      {
        id: 12,
        strand: 'ii',
        prompt: 'Scenario: Explain how protein synthesis translates mRNA codons into specific amino acid chains at ribosomes.',
        target: 'DNA code transcribed into mRNA in nucleus → mRNA travels to ribosome → tRNA molecules bring matching amino acids complementary to 3-base mRNA codons.',
        hint: 'DNA transcribed to mRNA -> translated at ribosome by tRNA matching 3-base codons.'
      }
    ]
  },
  {
    id: '18-variation-and-selection',
    title: '18. Variation, Evolution & Natural Selection',
    level: 'PYP to MYP 5',
    subject: 'Biology',
    description: 'Scaffolded from human physical variation to genetic vs environmental variation, mutations, Darwin\'s natural selection theory, and selective breeding.',
    badgeColor: '#2F855A',
    icon: 'RefreshCw',
    questions: [
      {
        id: 1,
        strand: 'i',
        prompt: 'Look around a classroom: why do students have different heights, eye colors, and shoe sizes?',
        target: 'Because of variation—differences in genes inherited from parents and environmental influences.',
        hint: 'Differences caused by genes and environment.'
      },
      {
        id: 2,
        strand: 'i',
        prompt: 'Give one example of a human trait caused purely by genes and one caused by environment.',
        target: 'Genetic: ABO blood group or eye color. Environmental: language spoken or scar on skin.',
        hint: 'Genetic = blood group/eye color; Environmental = language/scars.'
      },
      {
        id: 3,
        strand: 'i',
        prompt: 'Distinguish between Continuous Variation and Discontinuous Variation.',
        target: 'Continuous: range of values with no distinct categories (e.g. height, weight). Discontinuous: distinct categories with no intermediates (e.g. blood group, tongue rolling).',
        hint: 'Continuous = smooth range (height); Discontinuous = distinct categories (blood type).'
      },
      {
        id: 4,
        strand: 'i',
        prompt: 'What is a Gene Mutation, and name two mutagens that increase mutation rate.',
        target: 'A random change in DNA base sequence. Mutagens: ionising radiation (gamma/UV rays) and chemical carcinogens (tobacco tar).',
        hint: 'Random change in DNA; UV light and tobacco tar.'
      },
      {
        id: 5,
        strand: 'i',
        prompt: 'Describe Charles Darwin\'s Theory of Natural Selection in four key steps.',
        target: '1) Overproduction of offspring. 2) Genetic variation. 3) Competition for resources (survival of fittest). 4) Fittest pass beneficial alleles to offspring.',
        hint: 'Overproduction -> Variation -> Competition -> Passing beneficial alleles.'
      },
      {
        id: 6,
        strand: 'i',
        prompt: 'How does Selective Breeding (artificial selection) differ from Natural Selection?',
        target: 'Selective breeding: humans choose organisms with desirable traits to breed (e.g. cows giving high milk). Natural selection: environmental pressures select survivors.',
        hint: 'Selective breeding is chosen by humans; Natural selection is driven by environment.'
      },
      {
        id: 7,
        strand: 'i',
        prompt: 'Describe how desert Camels and Cacti are adapted to survive extreme heat and drought.',
        target: 'Camel: fat humps, wide padded feet, concentrated urine. Cactus: widespread roots, thick waxy stem for water storage, spines instead of leaves.',
        hint: 'Fat humps, padded feet; cactus waxy stem and spines.'
      },
      {
        id: 8,
        strand: 'i',
        prompt: 'Explain how natural selection led to Peppered Moths turning dark during the Industrial Revolution.',
        target: 'Soot darkened tree trunks. Dark mutant moths were camouflaged from birds, survived, and passed dark alleles on to future generations.',
        hint: 'Dark soot camouflaged dark moths, so dark alleles increased.'
      },
      {
        id: 9,
        strand: 'i',
        prompt: 'Explain how natural selection drives Antibiotic Resistance in bacteria.',
        target: 'Random mutation gives a bacterium antibiotic resistance. Antibiotic kills non-resistant bacteria, leaving resistant bacteria to multiply rapidly.',
        hint: 'Mutant resistant bacteria survive antibiotic and multiply.'
      },
      {
        id: 10,
        strand: 'ii',
        prompt: 'Scenario: Farmers selectively breed dairy cows for high milk yield. Explain one negative consequence of inbreeding over many generations.',
        target: 'Reduces genetic variation and increases risk of inheriting harmful homozygous recessive genetic defects or vulnerability to new diseases.',
        hint: 'Inbreeding reduces genetic variation and increases genetic defects.'
      },
      {
        id: 11,
        strand: 'ii',
        prompt: 'Scenario: Sickle-cell anemia allele (HbS) causes severe disease in homozygous (HbS HbS), but persists in West Africa. Explain why heterozygous (HbA HbS) has a selective advantage.',
        target: 'Heterozygous individuals (HbA HbS) are resistant to Malaria infection without suffering severe sickle cell anemia, providing a survival advantage.',
        hint: 'Heterozygous individuals are resistant to malaria.'
      },
      {
        id: 12,
        strand: 'ii',
        prompt: 'Scenario: A population of lizards becomes split onto two isolated islands by rising sea levels. Explain how speciation occurs over thousands of years.',
        target: 'Geographical isolation prevents interbreeding. Different selection pressures on each island select different beneficial alleles until populations can no longer interbreed (new species).',
        hint: 'Geographical isolation + different selection pressures lead to new species.'
      }
    ]
  },
  {
    id: '19-organisms-and-environment',
    title: '19. Food Webs & Ecosystem Dynamics',
    level: 'PYP to MYP 5',
    subject: 'Biology',
    description: 'Scaffolded from solar energy entry to food webs, trophic levels, pyramids of numbers vs biomass, carbon/nitrogen cycles, and predator-prey dynamics.',
    badgeColor: '#2F855A',
    icon: 'Leaf',
    questions: [
      {
        id: 1,
        strand: 'i',
        prompt: 'Where does almost all energy on Earth for living plants and animals originally come from?',
        target: 'The Sun.',
        hint: 'The Sun.'
      },
      {
        id: 2,
        strand: 'i',
        prompt: 'What is the difference between a Herbivore and a Carnivore?',
        target: 'Herbivores eat plants; Carnivores eat other animals.',
        hint: 'Herbivores eat plants; Carnivores eat meat.'
      },
      {
        id: 3,
        strand: 'i',
        prompt: 'What is a Food Web, and how is it different from a single Food Chain?',
        target: 'A food chain shows one single line of energy flow. A food web shows all interconnected food chains in an ecosystem.',
        hint: 'Food web shows interconnected food chains.'
      },
      {
        id: 4,
        strand: 'i',
        prompt: 'Define Producer, Primary Consumer, Secondary Consumer, and Tertiary Consumer.',
        target: 'Producer: makes food (plants). Primary Consumer: eats producer (herbivore). Secondary Consumer: eats primary consumer (carnivore). Tertiary: top carnivore.',
        hint: 'Producer (plant) -> Primary (herbivore) -> Secondary (carnivore) -> Tertiary.'
      },
      {
        id: 5,
        strand: 'i',
        prompt: 'Why do food chains rarely have more than 4 or 5 trophic levels?',
        target: 'Because 90% of energy is lost at each level as heat, movement, and waste, leaving too little energy to support higher trophic levels.',
        hint: '90% energy lost at each level leaves too little energy for higher levels.'
      },
      {
        id: 6,
        strand: 'i',
        prompt: 'Compare a Pyramid of Numbers versus a Pyramid of Biomass for an oak tree ecosystem.',
        target: 'Pyramid of Numbers: inverted shape (1 oak tree supports thousands of caterpillars). Pyramid of Biomass: upright pyramid (oak tree dry mass is huge).',
        hint: 'Numbers pyramid inverted (1 tree); Biomass pyramid upright.'
      },
      {
        id: 7,
        strand: 'i',
        prompt: 'Describe the main processes in the Nitrogen Cycle (Nitrogen Fixation, Nitrification, Denitrification).',
        target: 'Nitrogen fixation: bacteria convert N2 gas to ammonium. Nitrification: nitrifying bacteria convert ammonium to nitrates. Denitrification: converts nitrates back to N2 gas.',
        hint: 'Fixation converts N2 gas to ammonium; Nitrification converts to nitrates.'
      },
      {
        id: 8,
        strand: 'i',
        prompt: 'How do Nitrifying bacteria and Decomposers enrich soil fertility for crop growth?',
        target: 'Decomposers break down dead proteins to ammonium. Nitrifying bacteria oxidize ammonium into nitrates that crop roots absorb.',
        hint: 'Break down dead proteins and convert ammonium into absorbable nitrates.'
      },
      {
        id: 9,
        strand: 'i',
        prompt: 'Describe predator-prey population lag cycles (e.g. Lynx and Snowshoe Hare).',
        target: 'As prey population rises, predator population rises shortly after. More predators consume prey, causing prey population to crash, followed by predator decline.',
        hint: 'Predator numbers lag behind prey numbers in cyclical waves.'
      },
      {
        id: 10,
        strand: 'ii',
        prompt: 'Scenario: A disease wipes out all frogs in a pond ecosystem. Predict the immediate effect on grasshoppers (eaten by frogs) and snakes (eat frogs).',
        target: 'Grasshopper population surges due to reduced predation. Snake population drops or switches to alternative prey.',
        hint: 'Grasshoppers increase (fewer predators); Snakes decrease (less food).'
      },
      {
        id: 11,
        strand: 'ii',
        prompt: 'Scenario: Why do waterlogged anaerobic soils suffer from severe nitrate depletion?',
        target: 'Waterlogging creates anaerobic conditions, promoting Denitrifying bacteria which convert soil nitrates into N2 gas, draining soil fertility.',
        hint: 'Anaerobic conditions promote denitrifying bacteria that destroy nitrates.'
      },
      {
        id: 12,
        strand: 'ii',
        prompt: 'Scenario: Explain why eating grain directly provides a much more energy-efficient human food supply than feeding grain to cattle and eating beef.',
        target: 'Eating grain directly operates at Trophic Level 2 (10% energy loss). Feeding grain to cattle operates at Level 3 (90% energy lost as cow heat/waste).',
        hint: 'Direct grain consumption operates at a lower trophic level with less energy loss.'
      }
    ]
  },
  {
    id: '20-human-influences-on-ecosystems',
    title: '20. Human Impacts on Ecosystems',
    level: 'PYP to MYP 5',
    subject: 'Environmental Science',
    description: 'Scaffolded from plastic recycling to deforestation impacts, agricultural eutrophication step-by-step, greenhouse gases, global warming, and conservation.',
    badgeColor: '#2F855A',
    icon: 'Leaf',
    questions: [
      {
        id: 1,
        strand: 'i',
        prompt: 'What is deforestation, and why is cutting down forests bad for wild animals?',
        target: 'Deforestation is clearing large areas of forest trees. It destroys animal habitats and homes, driving species toward extinction.',
        hint: 'Clearing trees destroys animal habitats and homes.'
      },
      {
        id: 2,
        strand: 'i',
        prompt: 'Why should we recycle plastic bottles instead of throwing them into oceans or rivers?',
        target: 'Plastic is non-biodegradable and stays in oceans for hundreds of years. Animals choke on plastic or get trapped in plastic waste.',
        hint: 'Plastic does not rot and harms marine wildlife.'
      },
      {
        id: 3,
        strand: 'i',
        prompt: 'List three negative ecological consequences of Deforestation.',
        target: '1) Loss of biodiversity and animal extinction. 2) Soil erosion and flooding. 3) Increased atmospheric CO2 (enhanced greenhouse effect).',
        hint: 'Habitat loss, soil erosion/flooding, increased CO2.'
      },
      {
        id: 4,
        strand: 'i',
        prompt: 'Explain the step-by-step process of Eutrophication caused by excess fertilizer runoff in lakes.',
        target: '1) Fertilizer washes into river → 2) Algae bloom covers surface → 3) Underwater plants die (no light) → 4) Decomposers multiply and consume oxygen → 5) Fish suffocate.',
        hint: 'Fertilizer runoff -> Algae bloom -> Submerged plants die -> Decomposers use O2 -> Fish die.'
      },
      {
        id: 5,
        strand: 'i',
        prompt: 'Name two primary Greenhouse Gases and state human activities that release them.',
        target: 'Carbon Dioxide (released by burning fossil fuels and deforestation) and Methane (released by cattle farming and landfill waste).',
        hint: 'CO2 from fossil fuels; Methane from cattle and landfills.'
      },
      {
        id: 6,
        strand: 'i',
        prompt: 'How does the Enhanced Greenhouse Effect cause Global Warming?',
        target: 'Excess greenhouse gases trap heat energy re-emitted from Earth\'s surface in the atmosphere, raising average global temperatures.',
        hint: 'Trapping re-emitted heat energy in the atmosphere.'
      },
      {
        id: 7,
        strand: 'i',
        prompt: 'What causes Acid Rain, and what damage does acid rain cause to forests and lakes?',
        target: 'Sulfur dioxide (from burning coal) and Nitrogen oxides dissolve in rain. Acid rain lowers lake pH killing fish and leaches minerals from forest soil.',
        hint: 'Sulfur dioxide dissolves in rain, acidifying lakes and damaging trees.'
      },
      {
        id: 8,
        strand: 'i',
        prompt: 'Why is non-biodegradable plastic pollution particularly dangerous in ocean food chains?',
        target: 'Plastics break into microplastics, absorbing toxic chemicals. Animals consume microplastics, causing intestinal blockage and bioaccumulating toxins up the food web.',
        hint: 'Microplastics absorb toxins and accumulate up food chains.'
      },
      {
        id: 9,
        strand: 'i',
        prompt: 'Describe three methods used in Conservation programs to protect endangered species.',
        target: '1) Protected nature reserves/national parks. 2) Captive breeding and reintroduction. 3) Seed banks and legal protection against poaching.',
        hint: 'Nature reserves, captive breeding, seed banks, anti-poaching laws.'
      },
      {
        id: 10,
        strand: 'ii',
        prompt: 'Scenario: A factory discharges warm water into a river (thermal pollution). Why do fish downstream suffocate even though no toxic chemicals were released?',
        target: 'Warm water holds significantly less dissolved oxygen gas than cold water. Decreased O2 prevents fish from carrying out aerobic respiration.',
        hint: 'Warm water holds less dissolved oxygen, causing fish suffocation.'
      },
      {
        id: 11,
        strand: 'ii',
        prompt: 'Scenario: Explain why sustainable forest management requires replanting trees, quotas, and selective logging rather than clear-cutting.',
        target: 'Selective logging preserves soil structure, maintains carbon sinks, and protects wildlife habitats while supplying sustainable timber.',
        hint: 'Preserves carbon sinks, prevents soil erosion, and protects wildlife.'
      },
      {
        id: 12,
        strand: 'ii',
        prompt: 'Scenario: Predict two severe impacts of melting polar ice caps caused by global warming on coastal human cities.',
        target: '1) Rising sea levels cause widespread coastal flooding and land loss. 2) Extreme weather events (hurricanes, storm surges) damage infrastructure.',
        hint: 'Rising sea levels causing flooding and extreme weather events.'
      }
    ]
  },
  {
    id: '21-biotechnology-and-genetic-modification',
    title: '21. Biotechnology & Genetic Engineering',
    level: 'PYP to MYP 5',
    subject: 'Biology',
    description: 'Scaffolded from bread yeast baking to useful bacterial traits, industrial fermenters, restriction enzymes, GM human insulin, and agricultural GMOs.',
    badgeColor: '#2F855A',
    icon: 'FlaskConical',
    questions: [
      {
        id: 1,
        strand: 'i',
        prompt: 'How is yeast used in everyday life to bake fluffy bread?',
        target: 'Yeast feeds on sugar in dough, releasing carbon dioxide gas bubbles that make the dough rise.',
        hint: 'Yeast produces CO2 gas bubbles that make dough rise.'
      },
      {
        id: 2,
        strand: 'i',
        prompt: 'What are bacteria, and are all bacteria harmful?',
        target: 'Bacteria are microscopic single-celled organisms. Most bacteria are harmless or helpful (like making yogurt), while some cause disease.',
        hint: 'Microscopic single-celled organisms; many are helpful.'
      },
      {
        id: 3,
        strand: 'i',
        prompt: 'Why are Bacteria useful organisms in Biotechnology and Genetic Engineering?',
        target: 'Rapid reproduction rate, simple circular plasmids for DNA insertion, ability to make complex human proteins, and no ethical concerns.',
        hint: 'Fast reproduction, simple plasmids, ability to make proteins.'
      },
      {
        id: 4,
        strand: 'i',
        prompt: 'Describe key control components inside an Industrial Fermenter (water jacket, stirrer, air inlet, pH sensor).',
        target: 'Water jacket: maintains optimum temperature. Stirrer: keeps nutrients/oxygen distributed. Air inlet: supplies sterile O2. pH sensor: monitors optimum pH.',
        hint: 'Water jacket = temperature; Stirrer = mixing; Air inlet = O2 supply.'
      },
      {
        id: 5,
        strand: 'i',
        prompt: 'What roles do Restriction Enzymes and DNA Ligase play in genetic engineering?',
        target: 'Restriction enzymes: cut DNA at specific base sequences leaving "sticky ends". DNA ligase: joins cut DNA fragments together.',
        hint: 'Restriction enzymes cut DNA; DNA ligase joins DNA fragments.'
      },
      {
        id: 6,
        strand: 'i',
        prompt: 'Describe the step-by-step production of Human Insulin using genetically modified bacteria.',
        target: '1) Human insulin gene cut with restriction enzyme. 2) Bacterial plasmid cut with same enzyme. 3) DNA ligase joins gene into plasmid. 4) Recombinant plasmid inserted into bacterium. 5) Transgenic bacteria grown in fermenter.',
        hint: 'Cut insulin gene and plasmid -> join with ligase -> insert into bacteria -> grow in fermenter.'
      },
      {
        id: 7,
        strand: 'i',
        prompt: 'What is Genetically Modified (GM) Bt Corn, and how does it protect crops from pests?',
        target: 'Bt corn contains a bacterial gene producing a protein toxic to insect larvae (caterpillars), protecting corn without chemical insecticide sprays.',
        hint: 'Contains bacterial gene producing a natural insect toxin.'
      },
      {
        id: 8,
        strand: 'i',
        prompt: 'What is "Golden Rice", and how was it engineered to prevent childhood blindness in developing nations?',
        target: 'Golden Rice is engineered with daffodil/bacterial genes to produce Beta-carotene (Vitamin A precursor) in rice grains, preventing Vitamin A deficiency blindness.',
        hint: 'Engineered with genes to produce Vitamin A precursor in rice grains.'
      },
      {
        id: 9,
        strand: 'i',
        prompt: 'List two potential environmental or health concerns regarding Genetically Modified crops.',
        target: '1) Superweeds developing herbicide resistance via gene transfer. 2) Unintended harm to non-target insects (e.g. monarch butterflies).',
        hint: 'Superweeds from gene transfer and harm to non-target insects.'
      },
      {
        id: 10,
        strand: 'ii',
        prompt: 'Scenario: Why must the air inlet in an industrial fermenter pass through a fine sterile filter before entering the culture vessel?',
        target: 'To prevent airborne wild bacteria and fungal spores from entering and contaminating the pure transgenic culture.',
        hint: 'Prevents wild bacteria and fungal spores from contaminating the fermenter.'
      },
      {
        id: 11,
        strand: 'ii',
        prompt: 'Scenario: Why are "sticky ends" (staggered single-stranded DNA cuts) essential when inserting a human gene into a bacterial plasmid?',
        target: 'Sticky ends have complementary exposed base pairs that easily hydrogen-bond together before DNA ligase seals the sugar-phosphate backbone.',
        hint: 'Exposed complementary bases hydrogen bond together before ligase seals them.'
      },
      {
        id: 12,
        strand: 'ii',
        prompt: 'Scenario: Explain why GM crops resistant to herbicides (like Roundup Ready soy) allow farmers to use weedkillers without destroying their own harvest.',
        target: 'GM soy expresses an enzyme resistant to Roundup herbicide. Spraying kills competing weeds while leaving GM soy crop undamaged.',
        hint: 'GM crop expresses enzyme resistant to weedkiller, so weeds die while crop survives.'
      }
    ]
  }
];
