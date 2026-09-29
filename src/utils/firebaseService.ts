import {
  db,
  collection,
  doc,
  setDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  deleteDoc,
} from '../lib/firebase';
import { TeacherAssignment, StudentRecord, StudentSubmission } from '../types';

// Default initial roster if empty, populated with MYP 2C and demo classes
export const DEFAULT_STUDENTS: StudentRecord[] = [
  // MYP 2C Official GSIS Roster
  { id: 'stu-myp2c-8654', studentId: '8654', name: 'Miraya Sharvil Shridhar', className: 'MYP 2C', email: '8654@gsis.ac.in', createdAt: new Date().toISOString() },
  { id: 'stu-myp2c-8506', studentId: '8506', name: 'Vihaan Yelamarti', className: 'MYP 2C', email: '8506@gsis.ac.in', createdAt: new Date().toISOString() },
  { id: 'stu-myp2c-8559', studentId: '8559', name: 'Mantra Himanshubhai Dobariya', className: 'MYP 2C', email: '8559@gsis.ac.in', createdAt: new Date().toISOString() },
  { id: 'stu-myp2c-8550', studentId: '8550', name: 'Arko Banerjee', className: 'MYP 2C', email: '8550@gsis.ac.in', createdAt: new Date().toISOString() },
  { id: 'stu-myp2c-8547', studentId: '8547', name: 'Aarya Sudhir Bhosle', className: 'MYP 2C', email: '8547@gsis.ac.in', createdAt: new Date().toISOString() },
  { id: 'stu-myp2c-8471', studentId: '8471', name: 'Samanyu Gali', className: 'MYP 2C', email: '8471@gsis.ac.in', createdAt: new Date().toISOString() },
  { id: 'stu-myp2c-8451', studentId: '8451', name: 'Dhrushil Viral Shah', className: 'MYP 2C', email: '8451@gsis.ac.in', createdAt: new Date().toISOString() },
  { id: 'stu-myp2c-8411', studentId: '8411', name: 'Vihan Ashishbhai Marvaniya', className: 'MYP 2C', email: '8411@gsis.ac.in', createdAt: new Date().toISOString() },
  { id: 'stu-myp2c-8325', studentId: '8325', name: 'Mohammad Rehan Shareef', className: 'MYP 2C', email: '8325@gsis.ac.in', createdAt: new Date().toISOString() },
  { id: 'stu-myp2c-8304', studentId: '8304', name: 'Guthi Pragnya', className: 'MYP 2C', email: '8304@gsis.ac.in', createdAt: new Date().toISOString() },
  { id: 'stu-myp2c-8087', studentId: '8087', name: 'Varada Kaul', className: 'MYP 2C', email: '8087@gsis.ac.in', createdAt: new Date().toISOString() },
  { id: 'stu-myp2c-7955', studentId: '7955', name: 'Thaneeksha Gowda R', className: 'MYP 2C', email: '7955@gsis.ac.in', createdAt: new Date().toISOString() },
  { id: 'stu-myp2c-7831', studentId: '7831', name: 'Inaaya Dina Rawthar', className: 'MYP 2C', email: '7831@gsis.ac.in', createdAt: new Date().toISOString() },
  { id: 'stu-myp2c-8645', studentId: '8645', name: 'Virat Anant Jain', className: 'MYP 2C', email: '8645@gsis.ac.in', createdAt: new Date().toISOString() },

  // MYP 4A Official GSIS Roster
  { id: 'stu-myp4a-8046', studentId: '8046', name: 'Neel Bhaveshbhai Kathrotiya', className: 'MYP 4A', email: '8046@gsis.ac.in', createdAt: new Date().toISOString() },
  { id: 'stu-myp4a-7939', studentId: '7939', name: 'Ryann Francy', className: 'MYP 4A', email: '7939@gsis.ac.in', createdAt: new Date().toISOString() },
  { id: 'stu-myp4a-8216', studentId: '8216', name: 'Aaryan Denish Kanasagara', className: 'MYP 4A', email: '8216@gsis.ac.in', createdAt: new Date().toISOString() },
  { id: 'stu-myp4a-7560', studentId: '7560', name: 'Tejeswar', className: 'MYP 4A', email: '7560@gsis.ac.in', createdAt: new Date().toISOString() },
  { id: 'stu-myp4a-7749', studentId: '7749', name: 'Arnav V', className: 'MYP 4A', email: '7749@gsis.ac.in', createdAt: new Date().toISOString() },
  { id: 'stu-myp4a-8426', studentId: '8426', name: 'Mithilesh Gokul Dusane', className: 'MYP 4A', email: '8426@gsis.ac.in', createdAt: new Date().toISOString() },
  { id: 'stu-myp4a-8402', studentId: '8402', name: 'Johan Dalsaniya', className: 'MYP 4A', email: '8402@gsis.ac.in', createdAt: new Date().toISOString() },
  { id: 'stu-myp4a-8477', studentId: '8477', name: 'Gaurangi Bhanot', className: 'MYP 4A', email: '8477@gsis.ac.in', createdAt: new Date().toISOString() },
  { id: 'stu-myp4a-8494', studentId: '8494', name: 'Reyansh Jiwani', className: 'MYP 4A', email: '8494@gsis.ac.in', createdAt: new Date().toISOString() },
  { id: 'stu-myp4a-8191', studentId: '8191', name: 'Jilay Hitesh Sardhara', className: 'MYP 4A', email: '8191@gsis.ac.in', createdAt: new Date().toISOString() },
  { id: 'stu-myp4a-7337', studentId: '7337', name: 'Yaj Sunit Patel', className: 'MYP 4A', email: '7337@gsis.ac.in', createdAt: new Date().toISOString() },
  { id: 'stu-myp4a-8395', studentId: '8395', name: 'Krishiv Amish Mehta', className: 'MYP 4A', email: '8395@gsis.ac.in', createdAt: new Date().toISOString() },
  { id: 'stu-myp4a-8392', studentId: '8392', name: 'Dhruv Pranav Gandhi', className: 'MYP 4A', email: '8392@gsis.ac.in', createdAt: new Date().toISOString() },
  { id: 'stu-myp4a-8472', studentId: '8472', name: 'Siya Kiran Gali', className: 'MYP 4A', email: '8472@gsis.ac.in', createdAt: new Date().toISOString() },
  { id: 'stu-myp4a-8496', studentId: '8496', name: 'Jas Daryani', className: 'MYP 4A', email: '8496@gsis.ac.in', createdAt: new Date().toISOString() },
  { id: 'stu-myp4a-8639', studentId: '8639', name: 'Samar Ajay Meghani', className: 'MYP 4A', email: '8639@gsis.ac.in', createdAt: new Date().toISOString() },
  { id: 'stu-myp4a-8616', studentId: '8616', name: 'Vidhi Siddharth Shah', className: 'MYP 4A', email: '8616@gsis.ac.in', createdAt: new Date().toISOString() },
  { id: 'stu-myp4a-8660', studentId: '8660', name: 'Yashaswini', className: 'MYP 4A', email: '8660@gsis.ac.in', createdAt: new Date().toISOString() },

  // MYP 4C Official GSIS Roster
  { id: 'stu-myp4c-8326', studentId: '8326', name: 'Alex Paresh Bavaliya', className: 'MYP 4C', email: '8326@gsis.ac.in', createdAt: new Date().toISOString() },
  { id: 'stu-myp4c-7966', studentId: '7966', name: 'Virat Sai M', className: 'MYP 4C', email: '7966@gsis.ac.in', createdAt: new Date().toISOString() },
  { id: 'stu-myp4c-8282', studentId: '8282', name: 'Shaan Sakhiya', className: 'MYP 4C', email: '8282@gsis.ac.in', createdAt: new Date().toISOString() },
  { id: 'stu-myp4c-8500', studentId: '8500', name: 'Krishna Reddy Teegala', className: 'MYP 4C', email: '8500@gsis.ac.in', createdAt: new Date().toISOString() },
  { id: 'stu-myp4c-8407', studentId: '8407', name: 'Kayra Sarvesh Salvi Chavan', className: 'MYP 4C', email: '8407@gsis.ac.in', createdAt: new Date().toISOString() },
  { id: 'stu-myp4c-8378', studentId: '8378', name: 'Sukriti Saraswat', className: 'MYP 4C', email: '8378@gsis.ac.in', createdAt: new Date().toISOString() },
  { id: 'stu-myp4c-8165', studentId: '8165', name: 'Aarav Sipani', className: 'MYP 4C', email: '8165@gsis.ac.in', createdAt: new Date().toISOString() },
  { id: 'stu-myp4c-8084', studentId: '8084', name: 'Neev Nirav Patel', className: 'MYP 4C', email: '8084@gsis.ac.in', createdAt: new Date().toISOString() },
  { id: 'stu-myp4c-7889', studentId: '7889', name: 'Yakkshh Mirani', className: 'MYP 4C', email: '7889@gsis.ac.in', createdAt: new Date().toISOString() },
  { id: 'stu-myp4c-7767', studentId: '7767', name: 'Vivaan Sangiliraj', className: 'MYP 4C', email: '7767@gsis.ac.in', createdAt: new Date().toISOString() },
  { id: 'stu-myp4c-8079', studentId: '8079', name: 'Sai Smaran', className: 'MYP 4C', email: '8079@gsis.ac.in', createdAt: new Date().toISOString() },
  { id: 'stu-myp4c-8294', studentId: '8294', name: 'Harshil Bankimbhai Mehta', className: 'MYP 4C', email: '8294@gsis.ac.in', createdAt: new Date().toISOString() },
  { id: 'stu-myp4c-8138', studentId: '8138', name: 'Zayaan Fariya Mansuri', className: 'MYP 4C', email: '8138@gsis.ac.in', createdAt: new Date().toISOString() },
  { id: 'stu-myp4c-7863', studentId: '7863', name: 'Anant Singh Arora', className: 'MYP 4C', email: '7863@gsis.ac.in', createdAt: new Date().toISOString() },
  { id: 'stu-myp4c-8370', studentId: '8370', name: 'Aryaman Pankaj Kotadiya', className: 'MYP 4C', email: '8370@gsis.ac.in', createdAt: new Date().toISOString() },
  { id: 'stu-myp4c-7825', studentId: '7825', name: 'Shaurya Rahul Mane', className: 'MYP 4C', email: '7825@gsis.ac.in', createdAt: new Date().toISOString() },
  { id: 'stu-myp4c-8668', studentId: '8668', name: 'Manya Pinjani', className: 'MYP 4C', email: '8668@gsis.ac.in', createdAt: new Date().toISOString() },

  // MYP 5 Bio Official GSIS Roster
  { id: 'stu-myp5bio-7490', studentId: '7490', name: 'Kuldip Dubishetty', className: 'MYP 5 Bio', email: '7490@gsis.ac.in', createdAt: new Date().toISOString() },
  { id: 'stu-myp5bio-8389', studentId: '8389', name: 'Rudransh Vivek Gandhi', className: 'MYP 5 Bio', email: '8389@gsis.ac.in', createdAt: new Date().toISOString() },
  { id: 'stu-myp5bio-7737', studentId: '7737', name: 'Tiara Agarwal', className: 'MYP 5 Bio', email: '7737@gsis.ac.in', createdAt: new Date().toISOString() },
  { id: 'stu-myp5bio-7973', studentId: '7973', name: 'Pranav Gobinath', className: 'MYP 5 Bio', email: '7973@gsis.ac.in', createdAt: new Date().toISOString() },
  { id: 'stu-myp5bio-8499', studentId: '8499', name: 'Nainesha Reddy Gunreddy', className: 'MYP 5 Bio', email: '8499@gsis.ac.in', createdAt: new Date().toISOString() },
  { id: 'stu-myp5bio-8108', studentId: '8108', name: 'Diva Adeshra', className: 'MYP 5 Bio', email: '8108@gsis.ac.in', createdAt: new Date().toISOString() },
  { id: 'stu-myp5bio-8164', studentId: '8164', name: 'Akshaj Vellore', className: 'MYP 5 Bio', email: '8164@gsis.ac.in', createdAt: new Date().toISOString() },
  { id: 'stu-myp5bio-7632', studentId: '7632', name: 'Saachi Agarwal', className: 'MYP 5 Bio', email: '7632@gsis.ac.in', createdAt: new Date().toISOString() },
  { id: 'stu-myp5bio-7987', studentId: '7987', name: 'Sanvi Sajay', className: 'MYP 5 Bio', email: '7987@gsis.ac.in', createdAt: new Date().toISOString() },
  { id: 'stu-myp5bio-8038', studentId: '8038', name: 'Lakshmi Keerthana', className: 'MYP 5 Bio', email: '8038@gsis.ac.in', createdAt: new Date().toISOString() },
  { id: 'stu-myp5bio-8283', studentId: '8283', name: 'Rudra Sakhiya', className: 'MYP 5 Bio', email: '8283@gsis.ac.in', createdAt: new Date().toISOString() },
  { id: 'stu-myp5bio-8185', studentId: '8185', name: 'Aarnavi Rekha Appasani', className: 'MYP 5 Bio', email: '8185@gsis.ac.in', createdAt: new Date().toISOString() },
  { id: 'stu-myp5bio-8217', studentId: '8217', name: 'Aasmaa Mitesh Gajera', className: 'MYP 5 Bio', email: '8217@gsis.ac.in', createdAt: new Date().toISOString() },
  { id: 'stu-myp5bio-7336', studentId: '7336', name: 'Saanvi Sunit Patel', className: 'MYP 5 Bio', email: '7336@gsis.ac.in', createdAt: new Date().toISOString() },
  { id: 'stu-myp5bio-7645', studentId: '7645', name: 'Yadhavar Babu', className: 'MYP 5 Bio', email: '7645@gsis.ac.in', createdAt: new Date().toISOString() },
  { id: 'stu-myp5bio-7588', studentId: '7588', name: 'Arnav Samra', className: 'MYP 5 Bio', email: '7588@gsis.ac.in', createdAt: new Date().toISOString() },
  { id: 'stu-myp5bio-8223', studentId: '8223', name: 'Dev Darshan Karia', className: 'MYP 5 Bio', email: '8223@gsis.ac.in', createdAt: new Date().toISOString() },
  { id: 'stu-myp5bio-7789', studentId: '7789', name: 'Vidusshi Jain', className: 'MYP 5 Bio', email: '7789@gsis.ac.in', createdAt: new Date().toISOString() },
  { id: 'stu-myp5bio-7839', studentId: '7839', name: 'Sai Siddhiksha Sakhamuri', className: 'MYP 5 Bio', email: '7839@gsis.ac.in', createdAt: new Date().toISOString() },
  { id: 'stu-myp5bio-8024', studentId: '8024', name: 'Anaya Choksi', className: 'MYP 5 Bio', email: '8024@gsis.ac.in', createdAt: new Date().toISOString() },

  // General Demo Students
  { id: 'stu-gsis-001', studentId: 'GSIS-2024-001', name: 'Rahul Sharma', className: 'Grade 8A', email: 'rahul.s@gsis.ac.in', createdAt: new Date().toISOString() },
  { id: 'stu-gsis-002', studentId: 'GSIS-2024-002', name: 'Ananya Patel', className: 'Grade 8A', email: 'ananya.p@gsis.ac.in', createdAt: new Date().toISOString() },
  { id: 'stu-gsis-003', studentId: 'GSIS-2024-003', name: 'David Chen', className: 'Grade 8A', email: 'david.c@gsis.ac.in', createdAt: new Date().toISOString() },
  { id: 'stu-gsis-004', studentId: 'GSIS-2024-004', name: 'Fatima Al-Mansoor', className: 'Grade 8B', email: 'fatima.m@gsis.ac.in', createdAt: new Date().toISOString() },
  { id: 'stu-gsis-005', studentId: 'GSIS-2024-005', name: 'Maya Singh', className: 'Grade 8B', email: 'maya.s@gsis.ac.in', createdAt: new Date().toISOString() },
  { id: 'stu-gsis-006', studentId: 'GSIS-2024-006', name: 'Rohan Verma', className: 'Grade 8A', email: 'rohan.v@gsis.ac.in', createdAt: new Date().toISOString() },
  { id: 'stu-gsis-007', studentId: 'GSIS-2024-007', name: 'Sneha Nair', className: 'Grade 7A', email: 'sneha.n@gsis.ac.in', createdAt: new Date().toISOString() },
  { id: 'stu-gsis-008', studentId: 'GSIS-2024-008', name: 'Liam O\'Connor', className: 'Grade 7A', email: 'liam.o@gsis.ac.in', createdAt: new Date().toISOString() },
];

export const DEFAULT_ASSIGNMENTS: TeacherAssignment[] = [
  {
    id: 'asg-myp2c-bio-01',
    code: 'MYP2C-BIO-01',
    title: 'Cell Structure & Organelle Physiology',
    className: 'MYP 2C',
    teacherName: 'Mr. Senthilkumar',
    topicId: '2-cell-structure-function',
    topicTitle: 'Cell Structure & Function',
    level: 'MYP 1–3 (Grade 6–8)',
    slideCount: 6,
    learningOutcomes: [
      'Identify cellular organelle structures and distinguish plant from animal cells',
      'Analyze energy conversions across mitochondria and chloroplasts',
      'Evaluate membrane transport and homeostatic responses under external stimuli'
    ],
    instructions: 'Complete Scaffold Learning 1 (Fundamental Concepts) followed by Scaffold Learning 2 (Comparative Analysis). Submit your verified responses and generate your digital portfolio entry.',
    scaffolds: [
      {
        scaffoldNumber: 1,
        title: 'Scaffold Learning 1: Core Organelle Identification & Definition',
        description: 'Establish clear foundational knowledge of plant and animal cell components and their principal duties.',
        targetOutcome: 'Criterion A (Strand i): State and outline scientific concepts regarding organelle morphology.',
        questionIds: [1, 2, 3]
      },
      {
        scaffoldNumber: 2,
        title: 'Scaffold Learning 2: Structural Analysis & Physiological Linkage',
        description: 'Examine biochemical energy transformation across mitochondria, chloroplasts, and membrane barriers.',
        targetOutcome: 'Criterion A (Strand ii): Apply scientific understanding to solve problems and explain systemic relationships.',
        questionIds: [4, 5, 6]
      }
    ],
    antiCheat: {
      disableCopyPaste: true,
      disableTabSwitch: true,
      maxViolationsAllowed: 3
    },
    createdAt: new Date().toISOString(),
    dueDate: '2026-09-25'
  },
  {
    id: 'asg-myp4a-bio-01',
    code: 'MYP4A-BIO-01',
    title: 'Photosynthesis, Cellular Respiration & Bioenergetics',
    className: 'MYP 4A',
    teacherName: 'Mr. Senthilkumar',
    topicId: '6-plant-nutrition-photosynthesis',
    topicTitle: 'Plant Nutrition & Photosynthesis',
    level: 'MYP 4 & 5 (Grade 9–10)',
    slideCount: 6,
    learningOutcomes: [
      'Explain the light and dark reactions of photosynthesis and carbon fixation',
      'Compare ATP yield in aerobic respiration versus anaerobic fermentation pathways',
      'Evaluate limiting factors on photosynthetic rates in controlled environments'
    ],
    instructions: 'Engage with Scaffold Learning 1 and Scaffold Learning 2. Reason through biochemical mechanisms with the Socratic coach and export your Criterion A evaluation.',
    scaffolds: [
      {
        scaffoldNumber: 1,
        title: 'Scaffold Learning 1: Photosynthetic Pathways & Limiting Factors',
        description: 'State and explain biochemical equations, light absorption, and gas exchange dynamics in chloroplasts.',
        targetOutcome: 'Criterion A (Strand i & ii): Explain scientific knowledge and apply it to predict metabolic outcomes.',
        questionIds: [1, 2, 3]
      },
      {
        scaffoldNumber: 2,
        title: 'Scaffold Learning 2: Bioenergetic Coupling & ATP Synthesis',
        description: 'Analyze cellular respiration gradients, mitochondrial electron transport, and energy conservation.',
        targetOutcome: 'Criterion A (Strand iii): Analyze and evaluate information to make scientifically supported judgments.',
        questionIds: [4, 5, 6]
      }
    ],
    antiCheat: {
      disableCopyPaste: true,
      disableTabSwitch: true,
      maxViolationsAllowed: 3
    },
    createdAt: new Date().toISOString(),
    dueDate: '2026-09-28'
  },
  {
    id: 'asg-myp4c-bio-01',
    code: 'MYP4C-BIO-01',
    title: 'Genetics, Inheritance & DNA Structure',
    className: 'MYP 4C',
    teacherName: 'Mr. Senthilkumar',
    topicId: '17-genetics-inheritance',
    topicTitle: 'Inheritance & Molecular Genetics',
    level: 'MYP 4 & 5 (Grade 9–10)',
    slideCount: 6,
    learningOutcomes: [
      'Describe DNA double helix structure, nucleotide base-pairing, and gene loci',
      'Construct monohybrid and dihybrid Punnett squares to predict phenotypic ratios',
      'Analyze pedigrees and sex-linked genetic conditions'
    ],
    instructions: 'Complete the two scaffold stages focusing on genetic inheritance and chromosome segregation. Submit your responses to update your verified portfolio.',
    scaffolds: [
      {
        scaffoldNumber: 1,
        title: 'Scaffold Learning 1: Chromosomes, Alleles & Mendelian Monohybrid Crosses',
        description: 'Clarify core genetic terminology and calculate simple Mendelian genotypic and phenotypic probabilities.',
        targetOutcome: 'Criterion A (Strand i): State and define genetic terminology precisely.',
        questionIds: [1, 2, 3]
      },
      {
        scaffoldNumber: 2,
        title: 'Scaffold Learning 2: Molecular Genetics & Pedigree Analysis',
        description: 'Apply genetic principles to analyze pedigree inheritance charts and explain molecular gene expressions.',
        targetOutcome: 'Criterion A (Strand ii & iii): Solve complex inheritance problems and evaluate pedigree data.',
        questionIds: [4, 5, 6]
      }
    ],
    antiCheat: {
      disableCopyPaste: true,
      disableTabSwitch: true,
      maxViolationsAllowed: 3
    },
    createdAt: new Date().toISOString(),
    dueDate: '2026-09-28'
  },
  {
    id: 'asg-myp5bio-01',
    code: 'MYP5-BIO-01',
    title: 'Advanced Cell Physiology & Membrane Transport',
    className: 'MYP 5 Bio',
    teacherName: 'Mr. Senthilkumar',
    topicId: '3-movement-in-out-cells',
    topicTitle: 'Cell Membrane Dynamics & Transport',
    level: 'MYP 4 & 5 (Grade 9–10)',
    slideCount: 6,
    learningOutcomes: [
      'Distinguish simple diffusion, facilitated diffusion, osmosis, and active transport mechanisms',
      'Explain water potential gradients and osmotic pressure across selective semi-permeable membranes',
      'Predict cellular behavior in hypertonic, hypotonic, and isotonic solutions with quantitative reasoning'
    ],
    instructions: 'Progress through Scaffold Learning 1 (Transport Principles) and Scaffold Learning 2 (Quantitative Osmotic Analysis). Socratic prompts will push your reasoning to extending depths.',
    scaffolds: [
      {
        scaffoldNumber: 1,
        title: 'Scaffold Learning 1: Membrane Structure & Concentration Gradients',
        description: 'Demonstrate rigorous understanding of phospholipid bilayers and active vs. passive molecular movement.',
        targetOutcome: 'Criterion A (Strand i & ii): Explain physiological mechanisms and apply concepts to model cellular behavior.',
        questionIds: [1, 2, 3]
      },
      {
        scaffoldNumber: 2,
        title: 'Scaffold Learning 2: Osmotic Equilibrium & Thermodynamic Gradients',
        description: 'Analyze experimental solute changes and evaluate physiological disruptions to biological systems.',
        targetOutcome: 'Criterion A (Strand iii): Analyze and evaluate quantitative experimental data to form reasoned judgments.',
        questionIds: [4, 5, 6]
      }
    ],
    antiCheat: {
      disableCopyPaste: true,
      disableTabSwitch: true,
      maxViolationsAllowed: 3
    },
    createdAt: new Date().toISOString(),
    dueDate: '2026-09-30'
  },
  {
    id: 'asg-bio-scaffold-01',
    code: 'BIO-SC-01',
    title: 'Cell Biology & Organelle Physiology',
    className: 'Grade 8A',
    teacherName: 'Mr. Senthilkumar',
    topicId: '2-cell-structure-function',
    topicTitle: 'Cell Structure & Function',
    level: 'MYP 1–3 (Grade 6–8)',
    slideCount: 6,
    learningOutcomes: [
      'Recall cellular organelle structures and distinction between plant and animal cells',
      'Explain energetic and transport functions of mitochondria and chloroplasts',
      'Evaluate cellular respiration failures under environmental stressors'
    ],
    instructions: 'Complete Scaffold Learning 1 (Foundational Concepts), followed by Scaffold Learning 2 (Comparative Analysis). Download your verified PDF and submit your work to the cloud.',
    scaffolds: [
      {
        scaffoldNumber: 1,
        title: 'Scaffold Learning 1: Core Organelle Identification & Definition',
        description: 'Establish clear foundational knowledge of plant and animal cell components and their principal duties.',
        targetOutcome: 'Criterion A (Strand i): State and outline scientific concepts regarding organelle morphology.',
        questionIds: [1, 2, 3]
      },
      {
        scaffoldNumber: 2,
        title: 'Scaffold Learning 2: Structural Analysis & Physiological Linkage',
        description: 'Examine biochemical energy transformation across mitochondria, chloroplasts, and membrane barriers.',
        targetOutcome: 'Criterion A (Strand ii): Apply scientific understanding to solve problems and explain systemic relationships.',
        questionIds: [4, 5, 6]
      }
    ],
    antiCheat: {
      disableCopyPaste: true,
      disableTabSwitch: true,
      maxViolationsAllowed: 3
    },
    createdAt: new Date().toISOString(),
    dueDate: '2026-09-20'
  }
];

const LOCAL_STORAGE_ASSIGNMENTS_KEY = 'edutn43_fb_assignments';
const LOCAL_STORAGE_STUDENTS_KEY = 'edutn43_fb_students';
const LOCAL_STORAGE_SUBMISSIONS_KEY = 'edutn43_fb_submissions';
const LOCAL_STORAGE_DELETED_STUDENTS_KEY = 'edutn43_fb_deleted_students';

// Active listeners for real-time local + remote sync
let studentListeners: Array<(students: StudentRecord[]) => void> = [];

export function notifyStudentListeners(updatedStudents: StudentRecord[]): void {
  studentListeners.forEach((cb) => {
    try {
      cb(updatedStudents);
    } catch (e) {
      console.error('Error notifying student listener:', e);
    }
  });
}

// In-memory deleted keys fallback to ensure instant cross-component updates
const memoryDeletedKeys = new Set<string>();

export function normalizeStudentId(id: string | number): string {
  return String(id || '').trim().toLowerCase();
}

export function normalizeClassName(className: string): string {
  return String(className || '').trim().toLowerCase().replace(/\s+/g, ' ');
}

export function getDeletedStudentKeys(): Set<string> {
  const set = new Set<string>(memoryDeletedKeys);
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_DELETED_STUDENTS_KEY);
    if (raw) {
      const arr: string[] = JSON.parse(raw);
      arr.forEach((k) => set.add(k.toLowerCase()));
    }
  } catch (e) {
    // ignore
  }
  return set;
}

export function addDeletedStudentKey(key: string): void {
  const lower = key.trim().toLowerCase();
  if (!lower) return;
  memoryDeletedKeys.add(lower);
  try {
    const set = getDeletedStudentKeys();
    set.add(lower);
    localStorage.setItem(LOCAL_STORAGE_DELETED_STUDENTS_KEY, JSON.stringify(Array.from(set)));
  } catch (e) {
    // ignore
  }
}

export function removeDeletedStudentKey(key: string): void {
  const lower = key.trim().toLowerCase();
  if (!lower) return;
  memoryDeletedKeys.delete(lower);
  try {
    const set = getDeletedStudentKeys();
    set.delete(lower);
    localStorage.setItem(LOCAL_STORAGE_DELETED_STUDENTS_KEY, JSON.stringify(Array.from(set)));
  } catch (e) {
    // ignore
  }
}

// --- Assignments ---

export async function saveAssignment(assignment: TeacherAssignment): Promise<void> {
  // 1. Local backup
  try {
    const existing = getLocalAssignments();
    const filtered = existing.filter((a) => a.id !== assignment.id);
    localStorage.setItem(LOCAL_STORAGE_ASSIGNMENTS_KEY, JSON.stringify([assignment, ...filtered]));
  } catch (e) {
    console.error('Local assignment save error:', e);
  }

  // 2. Firebase Firestore
  try {
    const docRef = doc(db, 'assignments', assignment.id);
    await setDoc(docRef, { ...assignment }, { merge: true });
  } catch (error) {
    console.warn('Firebase assignment save fallback to local:', error);
  }
}

export function deduplicateStudents(students: StudentRecord[]): StudentRecord[] {
  const deletedKeys = getDeletedStudentKeys();
  const seenKey = new Set<string>();
  const seenId = new Set<string>();
  const result: StudentRecord[] = [];
  for (const s of students) {
    if (!s || !s.studentId) continue;
    if (s.isDeleted) continue;
    // Exclude any legacy placeholder BIO5- IDs
    if (s.className === 'MYP 5 Bio' && String(s.studentId).startsWith('BIO5-')) {
      continue;
    }
    const normId = normalizeStudentId(s.studentId);
    const normClass = normalizeClassName(s.className);
    const compositeKey = `${normClass}:${normId}`;
    const idKey = s.id ? s.id.trim().toLowerCase() : '';
    const rollKey = `id:${normId}`;

    // If marked deleted in localStorage or tombstoned in Firestore, skip
    if (
      deletedKeys.has(compositeKey) ||
      deletedKeys.has(rollKey) ||
      (idKey && deletedKeys.has(idKey))
    ) {
      continue;
    }

    if (seenKey.has(compositeKey) || (idKey && seenId.has(idKey))) {
      continue;
    }
    seenKey.add(compositeKey);
    if (idKey) seenId.add(idKey);
    result.push(s);
  }
  return result;
}

export function deduplicateAssignments(assignments: TeacherAssignment[]): TeacherAssignment[] {
  const seen = new Set<string>();
  const result: TeacherAssignment[] = [];
  for (const a of assignments) {
    if (!a || !a.id) continue;
    const id = a.id.trim().toLowerCase();
    if (!seen.has(id)) {
      seen.add(id);
      result.push(a);
    }
  }
  return result;
}

export function getLocalAssignments(): TeacherAssignment[] {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_ASSIGNMENTS_KEY);
    if (stored) {
      const parsed: TeacherAssignment[] = JSON.parse(stored);
      const combined = [...parsed, ...DEFAULT_ASSIGNMENTS];
      const deduplicated = deduplicateAssignments(combined);
      localStorage.setItem(LOCAL_STORAGE_ASSIGNMENTS_KEY, JSON.stringify(deduplicated));
      return deduplicated;
    }
  } catch (e) {
    console.error(e);
  }
  return deduplicateAssignments(DEFAULT_ASSIGNMENTS);
}

export function listenToAssignments(callback: (assignments: TeacherAssignment[]) => void): () => void {
  callback(getLocalAssignments());

  try {
    const collRef = collection(db, 'assignments');
    const unsubscribe = onSnapshot(
      collRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as TeacherAssignment));
          const combined = [...list, ...DEFAULT_ASSIGNMENTS];
          const deduplicated = deduplicateAssignments(combined);
          localStorage.setItem(LOCAL_STORAGE_ASSIGNMENTS_KEY, JSON.stringify(deduplicated));
          callback(deduplicated);
        } else {
          const defaults = deduplicateAssignments(DEFAULT_ASSIGNMENTS);
          defaults.forEach((a) => saveAssignment(a));
          callback(defaults);
        }
      },
      (error) => {
        console.warn('Firestore assignments listener fallback to local cache:', error);
        callback(getLocalAssignments());
      }
    );
    return unsubscribe;
  } catch (err) {
    console.warn('Firestore assignments listener catch:', err);
    return () => {};
  }
}

// --- Students Roster ---

export function getLocalStudents(): StudentRecord[] {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_STUDENTS_KEY);
    if (stored) {
      const parsed: StudentRecord[] = JSON.parse(stored);
      const combined = [...parsed, ...DEFAULT_STUDENTS];
      const deduplicated = deduplicateStudents(combined);
      localStorage.setItem(LOCAL_STORAGE_STUDENTS_KEY, JSON.stringify(deduplicated));
      return deduplicated;
    }
  } catch (e) {
    console.error(e);
  }
  const initial = deduplicateStudents(DEFAULT_STUDENTS);
  try {
    localStorage.setItem(LOCAL_STORAGE_STUDENTS_KEY, JSON.stringify(initial));
  } catch (e) {
    // ignore
  }
  return initial;
}

export async function saveStudent(student: StudentRecord): Promise<void> {
  const normId = normalizeStudentId(student.studentId);
  const normClass = normalizeClassName(student.className);
  const compositeKey = `${normClass}:${normId}`;
  const rollKey = `id:${normId}`;
  removeDeletedStudentKey(compositeKey);
  removeDeletedStudentKey(rollKey);
  if (student.id) removeDeletedStudentKey(student.id.trim().toLowerCase());

  const studentToSave: StudentRecord = {
    ...student,
    isDeleted: false,
    updatedAt: new Date().toISOString(),
  };

  try {
    const existing = getLocalStudents();
    const updated = deduplicateStudents([studentToSave, ...existing]);
    localStorage.setItem(LOCAL_STORAGE_STUDENTS_KEY, JSON.stringify(updated));
    notifyStudentListeners(updated);
  } catch (e) {
    console.error('Local student save cache error:', e);
  }

  try {
    const safeDocId = (student.id || `stu_${student.className}_${student.studentId}`).replace(/[^a-zA-Z0-9_-]/g, '_');
    const docRef = doc(db, 'students', safeDocId);
    await setDoc(docRef, { ...studentToSave, id: student.id || safeDocId }, { merge: true });
  } catch (err) {
    console.warn('Firebase student save fallback:', err);
  }
}

export async function deleteStudent(student: StudentRecord): Promise<void> {
  const normId = normalizeStudentId(student.studentId);
  const normClass = normalizeClassName(student.className);
  const compositeKey = `${normClass}:${normId}`;
  const idKey = student.id ? student.id.trim().toLowerCase() : '';
  const rollKey = `id:${normId}`;

  // 1. Immediately register in deleted sets (memory + localStorage)
  addDeletedStudentKey(compositeKey);
  addDeletedStudentKey(rollKey);
  if (idKey) addDeletedStudentKey(idKey);

  // 2. Immediately update local storage and notify all active listeners (instant UI update in React)
  try {
    const current = getLocalStudents();
    const filtered = current.filter((s) => {
      const sId = normalizeStudentId(s.studentId);
      const sClass = normalizeClassName(s.className);
      const sDocId = s.id ? s.id.trim().toLowerCase() : '';
      if (sDocId && idKey && sDocId === idKey) return false;
      if (sId === normId && sClass === normClass) return false;
      if (sId === normId && !sClass) return false;
      return true;
    });
    localStorage.setItem(LOCAL_STORAGE_STUDENTS_KEY, JSON.stringify(filtered));
    notifyStudentListeners(filtered);
  } catch (e) {
    console.error('Local student delete error:', e);
  }

  // 3. Persist deletion in Firebase Firestore
  try {
    const safeDocId = (student.id || `stu_${student.className}_${student.studentId}`).replace(/[^a-zA-Z0-9_-]/g, '_');
    const docRef = doc(db, 'students', safeDocId);

    // Save tombstone in Firestore so Firestore syncs the deletion to all clients and prevents resurrection
    await setDoc(
      docRef,
      {
        id: safeDocId,
        studentId: student.studentId,
        name: student.name,
        className: student.className,
        email: student.email || `${student.studentId}@gsis.ac.in`,
        createdAt: student.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isDeleted: true,
      },
      { merge: true }
    );

    // Also query and clean up any other matching student docs in Firestore
    try {
      const q = query(collection(db, 'students'), where('studentId', '==', student.studentId));
      const snap = await getDocs(q);
      for (const d of snap.docs) {
        if (d.id !== safeDocId) {
          await deleteDoc(d.ref);
        }
      }
    } catch (qErr) {
      console.warn('Firestore student cleanup query warning:', qErr);
    }
  } catch (err) {
    console.warn('Firebase student delete fallback:', err);
  }
}

export async function updateStudent(oldStudent: StudentRecord, updatedStudent: StudentRecord): Promise<void> {
  const isKeyChanged =
    normalizeStudentId(oldStudent.studentId) !== normalizeStudentId(updatedStudent.studentId) ||
    normalizeClassName(oldStudent.className) !== normalizeClassName(updatedStudent.className) ||
    (oldStudent.id && updatedStudent.id && oldStudent.id !== updatedStudent.id);

  if (isKeyChanged) {
    await deleteStudent(oldStudent);
  }

  const finalRecord: StudentRecord = {
    ...oldStudent,
    ...updatedStudent,
    id: updatedStudent.id || oldStudent.id || `stu-${Date.now()}`,
    updatedAt: new Date().toISOString(),
    isDeleted: false,
  };

  await saveStudent(finalRecord);
}

export async function bulkSaveStudents(students: StudentRecord[]): Promise<void> {
  for (const s of students) {
    await saveStudent(s);
  }
}

export function listenToStudents(callback: (students: StudentRecord[]) => void): () => void {
  studentListeners.push(callback);
  callback(getLocalStudents());

  try {
    const collRef = collection(db, 'students');
    const unsubscribe = onSnapshot(
      collRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: StudentRecord[] = [];
          snapshot.docs.forEach((d) => {
            const data = d.data() as StudentRecord;
            const studentDoc: StudentRecord = {
              id: d.id,
              ...data,
            };
            if (studentDoc.isDeleted) {
              const normId = normalizeStudentId(studentDoc.studentId);
              const normClass = normalizeClassName(studentDoc.className);
              if (normId && normClass) addDeletedStudentKey(`${normClass}:${normId}`);
              if (normId) addDeletedStudentKey(`id:${normId}`);
              if (d.id) addDeletedStudentKey(d.id.toLowerCase());
              if (studentDoc.id) addDeletedStudentKey(studentDoc.id.toLowerCase());
            } else {
              list.push(studentDoc);
            }
          });

          const combined = [...list, ...DEFAULT_STUDENTS];
          const deduplicated = deduplicateStudents(combined);
          try {
            localStorage.setItem(LOCAL_STORAGE_STUDENTS_KEY, JSON.stringify(deduplicated));
          } catch (e) {}
          callback(deduplicated);
        } else {
          const defaults = deduplicateStudents(DEFAULT_STUDENTS);
          defaults.forEach((s) => saveStudent(s));
          callback(defaults);
        }
      },
      (error) => {
        console.warn('Firestore students listener fallback:', error);
        callback(getLocalStudents());
      }
    );
    return () => {
      studentListeners = studentListeners.filter((cb) => cb !== callback);
      unsubscribe();
    };
  } catch (err) {
    console.warn('Firestore students listener catch:', err);
    return () => {
      studentListeners = studentListeners.filter((cb) => cb !== callback);
    };
  }
}

// --- Submissions (Scaffold Learning Completed Work) ---

export function getLocalSubmissions(): StudentSubmission[] {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_SUBMISSIONS_KEY);
    if (stored) return JSON.parse(stored);
  } catch (e) {
    console.error(e);
  }
  return [];
}

export async function saveSubmission(submission: StudentSubmission): Promise<void> {
  // 1. Local backup
  try {
    const existing = getLocalSubmissions();
    const filtered = existing.filter((s) => s.id !== submission.id);
    localStorage.setItem(LOCAL_STORAGE_SUBMISSIONS_KEY, JSON.stringify([submission, ...filtered]));
  } catch (e) {
    console.error('Local submission save error:', e);
  }

  // 2. Firebase Firestore
  try {
    const safeDocId = submission.id.replace(/[^a-zA-Z0-9_-]/g, '_');
    const docRef = doc(db, 'submissions', safeDocId);
    await setDoc(docRef, { ...submission }, { merge: true });
  } catch (error) {
    console.warn('Firebase submission save error (stored locally):', error);
  }
}

export async function updateSubmissionTeacherFeedback(submissionId: string, feedback: string): Promise<void> {
  try {
    const existing = getLocalSubmissions();
    const updated = existing.map((s) =>
      s.id === submissionId
        ? { ...s, teacherFeedback: feedback, teacherGradedAt: new Date().toISOString() }
        : s
    );
    localStorage.setItem(LOCAL_STORAGE_SUBMISSIONS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error(e);
  }

  try {
    const safeDocId = submissionId.replace(/[^a-zA-Z0-9_-]/g, '_');
    const docRef = doc(db, 'submissions', safeDocId);
    await setDoc(
      docRef,
      {
        teacherFeedback: feedback,
        teacherGradedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (err) {
    console.warn('Feedback update fallback:', err);
  }
}

export function listenToAllSubmissions(callback: (submissions: StudentSubmission[]) => void): () => void {
  callback(getLocalSubmissions());

  try {
    const collRef = collection(db, 'submissions');
    const unsubscribe = onSnapshot(
      collRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as StudentSubmission));
          localStorage.setItem(LOCAL_STORAGE_SUBMISSIONS_KEY, JSON.stringify(list));
          callback(list);
        } else {
          callback(getLocalSubmissions());
        }
      },
      (error) => {
        console.warn('Firestore submissions listener fallback:', error);
        callback(getLocalSubmissions());
      }
    );
    return unsubscribe;
  } catch (err) {
    console.warn('Firestore submissions catch:', err);
    return () => {};
  }
}

export function listenToStudentSubmissions(
  studentId: string,
  callback: (submissions: StudentSubmission[]) => void
): () => void {
  const localList = getLocalSubmissions().filter(
    (s) => s.studentId.trim().toLowerCase() === studentId.trim().toLowerCase()
  );
  callback(localList);

  try {
    const collRef = collection(db, 'submissions');
    const q = query(collRef, where('studentId', '==', studentId.trim()));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as StudentSubmission));
          callback(list);
        } else {
          callback(localList);
        }
      },
      (error) => {
        console.warn('Firestore student query listener fallback:', error);
        callback(localList);
      }
    );
    return unsubscribe;
  } catch (err) {
    console.warn('Firestore student query catch:', err);
    return () => {};
  }
}
