import chalk from 'chalk';
import Table from 'cli-table3';

/**
 * S21 Project Registry
 * 
 * Each project defines:
 * - id: unique identifier used in CLI and test module naming
 * - name: human-readable name
 * - category: project category/branch
 * - language: primary language(s)
 * - description: short description
 * - testModule: path to test module (null = not yet implemented)
 * - styleRules: which style checker to use
 */

export const CATEGORIES = {
  C: { name: 'C Language', color: '#ff6b6b', icon: '🔧' },
  CPP: { name: 'C++', color: '#e17055', icon: '⚙️' },
  ALGO: { name: 'Algorithms', color: '#feca57', icon: '🧮' },
  DS: { name: 'Data Science', color: '#48dbfb', icon: '📊' },
  ML: { name: 'Machine Learning', color: '#a29bfe', icon: '🤖' },
  DEVOPS: { name: 'DevOps', color: '#00b894', icon: '🐳' },
  SQL: { name: 'SQL & Databases', color: '#fd79a8', icon: '🗃️' },
  PYTHON: { name: 'Python', color: '#0984e3', icon: '🐍' },
  CYBER: { name: 'Cybersecurity', color: '#d63031', icon: '🔐' },
  BIOINFO: { name: 'Bioinformatics', color: '#6c5ce7', icon: '🧬' },
  QA: { name: 'QA & Testing', color: '#00cec9', icon: '🧪' },
  BSA: { name: 'Business Analysis', color: '#fdcb6e', icon: '📋' },
  PM: { name: 'Project Management', color: '#e84393', icon: '📌' },
  UXUI: { name: 'UX/UI Design', color: '#ff9ff3', icon: '🎨' },
  JS: { name: 'JavaScript', color: '#f9ca24', icon: '🟨' },
  JAVA: { name: 'Java', color: '#eb4d4b', icon: '☕' },
  GO: { name: 'Go', color: '#7ed6df', icon: '🔵' },
  CSHARP: { name: 'C#', color: '#686de0', icon: '🟪' },
  KOTLIN: { name: 'Kotlin', color: '#f0932b', icon: '🟠' },
  SWIFT: { name: 'Swift', color: '#fc5c65', icon: '🍎' },
};

export const PROJECTS = [
  // ═══════════════════ C-I Branch ═══════════════════
  { id: 'c-i-ex', name: 'C_Ex', category: 'C', language: 'c', description: 'C basics exercises' },
  { id: 'c-s21-matrix', name: 'C8_s21_matrix', category: 'C', language: 'c', description: 'Matrix library' },
  { id: 'c-s21-decimal', name: 'C5_s21_decimal', category: 'C', language: 'c', description: 'Decimal type implementation' },
  { id: 'c-s21-stringplus', name: 'C3_s21_stringplus', category: 'C', language: 'c', description: 'String library (string.h reimpl)' },
  { id: 'c-simplebashutils', name: 'C2_SimpleBashUtils', category: 'C', language: 'c', description: 'cat & grep implementation' },

  // ═══════════════════ C++ Branch ═══════════════════
  { id: 'cpp-i', name: 'CPP-I', category: 'CPP', language: 'cpp', description: 'C++ Module 1' },
  { id: 'cpp-ii', name: 'CPP-II', category: 'CPP', language: 'cpp', description: 'C++ Module 2' },
  { id: 'cpp-matrix', name: 'CPP8_MonitoringSystem', category: 'CPP', language: 'cpp', description: 'Monitoring system' },
  { id: 'cpp-parallels', name: 'CPP8_Parallels_v1.0', category: 'CPP', language: 'cpp', description: 'Parallel computing' },
  { id: 'cpp-3dviewer', name: 'CPP4_3DViewer_v2.0', category: 'CPP', language: 'cpp', description: '3D Viewer' },
  { id: 'cpp-containers', name: 'CPP2_s21_containers', category: 'CPP', language: 'cpp', description: 'STL containers reimpl' },
  { id: 'cpp-smartcalc', name: 'CPP3_SmartCalc_v2.0', category: 'CPP', language: 'cpp', description: 'Smart Calculator v2' },
  { id: 'cpp-mlp', name: 'CPP7_MLP', category: 'CPP', language: 'cpp', description: 'Multilayer Perceptron' },

  // ═══════════════════ Data Science ═══════════════════
  { id: 'ds-bootcamp-1', name: 'DS_Bootcamp_Part1', category: 'DS', language: 'python', description: 'Data Science Bootcamp Part 1' },
  { id: 'ds-bootcamp-2', name: 'DS_Bootcamp_Part2', category: 'DS', language: 'python', description: 'Data Science Bootcamp Part 2' },
  { id: 'ds-tweets', name: 'DS1_Tweets', category: 'DS', language: 'python', description: 'Twitter data analysis' },
  { id: 'ds-churn', name: 'DS2_Churn_prediction', category: 'DS', language: 'python', description: 'Churn prediction model' },
  { id: 'ds-spotify', name: 'DS3_My_Spotify', category: 'DS', language: 'python', description: 'Spotify data analysis' },
  { id: 'ds-customer', name: 'DS4_Understanding_customer', category: 'DS', language: 'python', description: 'Customer understanding' },
  { id: 'ds-uber', name: 'DS5_Uber', category: 'DS', language: 'python', description: 'Uber data analysis' },
  { id: 'ds-cityinfo', name: 'DS6_City_Info', category: 'DS', language: 'python', description: 'City info analysis' },
  { id: 'ds-amazon', name: 'DS7_Amazon', category: 'DS', language: 'python', description: 'Amazon data analysis' },
  { id: 'ds-friedeggs', name: 'DS8_Fried_Eggs', category: 'DS', language: 'python', description: 'Fried Eggs project' },

  // ═══════════════════ DevOps ═══════════════════
  { id: 'do-linux', name: 'DO1_Linux', category: 'DEVOPS', language: 'bash', description: 'Linux basics' },
  { id: 'do-linux-network', name: 'DO2_Linux_Network', category: 'DEVOPS', language: 'bash', description: 'Linux networking' },
  { id: 'do-linux-monitoring-1', name: 'DO3_LinuxMonitoring_v1.0', category: 'DEVOPS', language: 'bash', description: 'Linux monitoring v1' },
  { id: 'do-linux-monitoring-2', name: 'DO4_LinuxMonitoring_v2.0', category: 'DEVOPS', language: 'bash', description: 'Linux monitoring v2' },
  { id: 'do-simple-docker', name: 'DO5_SimpleDocker', category: 'DEVOPS', language: 'docker', description: 'Docker basics' },
  { id: 'do-cicd', name: 'DO6_CICD', category: 'DEVOPS', language: 'bash', description: 'CI/CD pipelines' },
  { id: 'do-docker-compose', name: 'DO7_Docker_Compose', category: 'DEVOPS', language: 'docker', description: 'Docker Compose' },

  // ═══════════════════ Machine Learning ═══════════════════
  { id: 'ml-intro', name: 'ML1_Introduction', category: 'ML', language: 'python', description: 'ML Introduction' },
  { id: 'ml-supervised', name: 'ML2_Supervised_learning', category: 'ML', language: 'python', description: 'Supervised learning' },
  { id: 'ml-validation', name: 'ML3_Validation', category: 'ML', language: 'python', description: 'Model validation' },
  { id: 'ml-classification', name: 'ML4_Classification_problems', category: 'ML', language: 'python', description: 'Classification' },
  { id: 'ml-decision-trees', name: 'ML5_Decision_trees', category: 'ML', language: 'python', description: 'Decision trees' },
  { id: 'ml-unsupervised', name: 'ML6_Unsupervised_training', category: 'ML', language: 'python', description: 'Unsupervised learning' },
  { id: 'ml-clustering', name: 'ML7_Clustering_algorithms', category: 'ML', language: 'python', description: 'Clustering algorithms' },
  { id: 'ml-neural', name: 'ML8_Neural_networks', category: 'ML', language: 'python', description: 'Neural networks' },
  { id: 'ml-cnn', name: 'ML9_Convolutional_networks', category: 'ML', language: 'python', description: 'Convolutional networks' },
  { id: 'ml-rnns', name: 'ML10_RNNs', category: 'ML', language: 'python', description: 'Recurrent networks' },
  { id: 'ml-attention', name: 'ML11_Attention_mechanism', category: 'ML', language: 'python', description: 'Attention mechanism' },
  { id: 'ml-generative', name: 'ML12_Generative_ML', category: 'ML', language: 'python', description: 'Generative ML' },

  // ═══════════════════ SQL ═══════════════════
  { id: 'sql-do-1', name: 'SQL1 (DO)', category: 'SQL', language: 'sql', description: 'SQL basics (DevOps track)' },
  { id: 'sql-do-ex', name: 'SQL_Ex (DO)', category: 'SQL', language: 'sql', description: 'SQL exercises (DevOps)' },
  { id: 'sql-qa-1', name: 'SQL1 (QA)', category: 'SQL', language: 'sql', description: 'SQL basics (QA track)' },
  { id: 'sql-qa-ex', name: 'SQL_Ex (QA)', category: 'SQL', language: 'sql', description: 'SQL exercises (QA)' },
  { id: 'sql-bsa-1', name: 'SQL1 (BSA)', category: 'SQL', language: 'sql', description: 'SQL basics (BSA track)' },
  { id: 'sql-bsa-ex', name: 'SQL_Ex (BSA)', category: 'SQL', language: 'sql', description: 'SQL exercises (BSA)' },
  { id: 'sql-core', name: 'SQL', category: 'SQL', language: 'sql', description: 'Core SQL module' },

  // ═══════════════════ Python ═══════════════════
  { id: 'py-bootcamp', name: 'APP1_Bootcamp', category: 'PYTHON', language: 'python', description: 'Python Bootcamp' },
  { id: 'py-backend', name: 'APP2_Backend', category: 'PYTHON', language: 'python', description: 'Python Backend' },
  { id: 'py-ex', name: 'APP_Ex', category: 'PYTHON', language: 'python', description: 'Python exercises' },

  // ═══════════════════ Cybersecurity ═══════════════════
  { id: 'cs-networking-1', name: 'CbS1_Networking_basics_Part1', category: 'CYBER', language: 'bash', description: 'Networking basics 1' },
  { id: 'cs-networking-2', name: 'CbS2_Networking_basics_Part2', category: 'CYBER', language: 'bash', description: 'Networking basics 2' },
  { id: 'cs-networking-3', name: 'CbS3_Networking_basics_Part3', category: 'CYBER', language: 'bash', description: 'Networking basics 3' },
  { id: 'cs-linux-basics', name: 'CbS5_Linux_basics', category: 'CYBER', language: 'bash', description: 'Linux basics for security' },
  { id: 'cs-windows-basics', name: 'CbS6_Windows_basics', category: 'CYBER', language: 'powershell', description: 'Windows basics' },
  { id: 'cs-crypto-intro', name: 'CbS7_Crypto_intro', category: 'CYBER', language: 'python', description: 'Cryptography intro' },
  { id: 'cs-crypto-symmetric', name: 'CbS8_Crypto_symmetric', category: 'CYBER', language: 'python', description: 'Symmetric cryptography' },
  { id: 'cs-crypto-asymmetric', name: 'CbS9_Crypto_asymmetric', category: 'CYBER', language: 'python', description: 'Asymmetric cryptography' },
  { id: 'cs-data-channel', name: 'CbS10_Data_channel_protect', category: 'CYBER', language: 'python', description: 'Data channel protection' },
  { id: 'cs-it-landscape', name: 'CbS11_Enterprise_IT_landscape', category: 'CYBER', language: 'bash', description: 'Enterprise IT landscape' },
  { id: 'cs-network-attacks', name: 'CbS12_Network_attacks', category: 'CYBER', language: 'python', description: 'Network attacks' },
  { id: 'cs-threat-detection', name: 'CbS13_Threat_detection_prev', category: 'CYBER', language: 'python', description: 'Threat detection' },
  { id: 'cs-secure-net', name: 'CbS14_Designing_secure_net', category: 'CYBER', language: 'bash', description: 'Secure network design' },
  { id: 'cs-legislation', name: 'CbS15_IS_legislation', category: 'CYBER', language: 'text', description: 'IS legislation' },
  { id: 'cs-project-lifecycle', name: 'CbS16_Project_lifecycle', category: 'CYBER', language: 'text', description: 'Project lifecycle' },
  { id: 'cs-physical', name: 'CbS17_Physical_security', category: 'CYBER', language: 'text', description: 'Physical security' },
  { id: 'cs-social', name: 'CbS18_Social_engineering', category: 'CYBER', language: 'text', description: 'Social engineering' },

  // ═══════════════════ QA ═══════════════════
  { id: 'qa-foundation', name: 'QA1_Foundation', category: 'QA', language: 'text', description: 'QA foundations' },
  { id: 'qa-test-artifacts', name: 'QA2_Test_artifacts', category: 'QA', language: 'text', description: 'Test artifacts' },
  { id: 'qa-test-design', name: 'QA3_Test_design_and_test_an', category: 'QA', language: 'text', description: 'Test design' },
  { id: 'qa-types-levels', name: 'QA4_Types_and_levels_of_tes', category: 'QA', language: 'text', description: 'Types and levels of testing' },
  { id: 'qa-defects', name: 'QA5_Defects', category: 'QA', language: 'text', description: 'Defect management' },
  { id: 'qa-web-testing', name: 'QA6_Web_testing', category: 'QA', language: 'javascript', description: 'Web testing' },
  { id: 'qa-backend-testing', name: 'QA7_Backend_testing', category: 'QA', language: 'javascript', description: 'Backend testing' },
  { id: 'qa-mobile-testing', name: 'QA8_Mobile_testing', category: 'QA', language: 'javascript', description: 'Mobile testing' },
  { id: 'qa-web-security', name: 'QA9_Basics_of_Web_Security', category: 'QA', language: 'javascript', description: 'Web security basics' },

  // ═══════════════════ AQA (Automated QA) ═══════════════════
  { id: 'aqa-basics', name: 'AQA1_Basics', category: 'QA', language: 'java', description: 'AQA basics' },
  { id: 'aqa-api-testing', name: 'AQA2_API_testing', category: 'QA', language: 'java', description: 'API test automation' },
  { id: 'aqa-ui-web', name: 'AQA3_UI_Web_testing', category: 'QA', language: 'java', description: 'UI web test automation' },
  { id: 'aqa-mobile', name: 'AQA4_Mobile_testing', category: 'QA', language: 'java', description: 'Mobile test automation' },

  // ═══════════════════ Bioinformatics ═══════════════════
  { id: 'bio-ds-1', name: 'Bioinformatics DS Part1', category: 'BIOINFO', language: 'python', description: 'Bioinformatics DS 1' },
  { id: 'bio-ds-2', name: 'Bioinformatics DS Part2', category: 'BIOINFO', language: 'python', description: 'Bioinformatics DS 2' },
  { id: 'bio-plasmid', name: 'BInf1_PlasmidGC', category: 'BIOINFO', language: 'python', description: 'Plasmid GC content' },
  { id: 'bio-hibscan', name: 'BInf2_HIBScan', category: 'BIOINFO', language: 'python', description: 'HIB scanning' },
  { id: 'bio-genomematch', name: 'BInf3_GenomeMatch', category: 'BIOINFO', language: 'python', description: 'Genome matching' },
  { id: 'bio-elm', name: 'Bioinformatics-II ELM_space', category: 'BIOINFO', language: 'python', description: 'ELM space' },

  // ═══════════════════ Algorithms (all languages) ═══════════════════
  ...['JS', 'Java', 'Python', 'Go', 'CSHARP', 'Kotlin', 'Swift'].map(lang => ({
    id: `algo-${lang.toLowerCase()}-ex`,
    name: `A_Ex (${lang})`,
    category: 'ALGO',
    language: lang.toLowerCase(),
    description: `Algorithm exercises in ${lang}`,
  })),
  ...['JS', 'Java', 'Python', 'Go', 'CSHARP', 'Kotlin', 'Swift'].map(lang => ({
    id: `algo-${lang.toLowerCase()}-simple-nav`,
    name: `A2_SimpleNavigator (${lang})`,
    category: 'ALGO',
    language: lang.toLowerCase(),
    description: `Simple Navigator in ${lang}`,
  })),
  ...['JS', 'Java', 'Python', 'Go', 'CSHARP', 'Kotlin', 'Swift'].map(lang => ({
    id: `algo-${lang.toLowerCase()}-maze`,
    name: `A1_Maze (${lang})`,
    category: 'ALGO',
    language: lang.toLowerCase(),
    description: `Maze solver in ${lang}`,
  })),

  // ═══════════════════ Exams ═══════════════════
  ...['JS', 'Java', 'Python', 'Go', 'CSHARP', 'Kotlin', 'Swift'].map(lang => ({
    id: `exam-${lang.toLowerCase()}`,
    name: `Exam ${lang}`,
    category: 'ALGO',
    language: lang.toLowerCase(),
    description: `Exam for ${lang}`,
  })),

  // ═══════════════════ Level II Tracks ═══════════════════
  { id: 'js-ii-frontend', name: 'JS-II Frontend', category: 'JS', language: 'javascript', description: 'JS Level II Frontend' },
  { id: 'js-ii-backend', name: 'JS-II Backend', category: 'JS', language: 'javascript', description: 'JS Level II Backend' },
  { id: 'java-ii-mobile', name: 'Java-II Mobile', category: 'JAVA', language: 'java', description: 'Java Level II Mobile' },
  { id: 'java-ii-backend', name: 'Java-II Backend', category: 'JAVA', language: 'java', description: 'Java Level II Backend' },
  { id: 'python-ii-backend', name: 'Python-II Backend', category: 'PYTHON', language: 'python', description: 'Python Level II Backend' },
  { id: 'go-ii-backend', name: 'Go-II Backend', category: 'GO', language: 'go', description: 'Go Level II Backend' },
  { id: 'csharp-ii-backend', name: 'C#-II Backend', category: 'CSHARP', language: 'csharp', description: 'C# Level II Backend' },
  { id: 'kotlin-ii-backend', name: 'Kotlin-II Backend', category: 'KOTLIN', language: 'kotlin', description: 'Kotlin Level II Backend' },
  { id: 'kotlin-ii-mobile', name: 'Kotlin-II Mobile', category: 'KOTLIN', language: 'kotlin', description: 'Kotlin Level II Mobile' },
  { id: 'swift-ii-backend', name: 'Swift-II Backend', category: 'SWIFT', language: 'swift', description: 'Swift Level II Backend' },
  { id: 'swift-ii-mobile', name: 'Swift-II Mobile', category: 'SWIFT', language: 'swift', description: 'Swift Level II Mobile' },

  // ═══════════════════ Bootcamps ═══════════════════
  { id: 'js-bootcamp', name: 'JavaScript Bootcamp-I', category: 'JS', language: 'javascript', description: 'JS Bootcamp' },
  { id: 'java-bootcamp', name: 'Java Bootcamp-I', category: 'JAVA', language: 'java', description: 'Java Bootcamp' },
  { id: 'java-qa-bootcamp', name: 'Java Bootcamp (QA)', category: 'JAVA', language: 'java', description: 'Java QA Bootcamp' },
  { id: 'python-bootcamp', name: 'Python Bootcamp-I', category: 'PYTHON', language: 'python', description: 'Python Bootcamp' },
  { id: 'go-bootcamp', name: 'Go Bootcamp-I', category: 'GO', language: 'go', description: 'Go Bootcamp' },
  { id: 'csharp-bootcamp', name: 'C# Bootcamp-I', category: 'CSHARP', language: 'csharp', description: 'C# Bootcamp' },
  { id: 'kotlin-bootcamp', name: 'Kotlin Bootcamp-I', category: 'KOTLIN', language: 'kotlin', description: 'Kotlin Bootcamp' },
  { id: 'swift-bootcamp', name: 'Swift Bootcamp-I', category: 'SWIFT', language: 'swift', description: 'Swift Bootcamp' },

  // ═══════════════════ BSA (Business Analysis) ═══════════════════
  { id: 'bsa-decomposition', name: 'BSA00_Decomposition', category: 'BSA', language: 'text', description: 'Decomposition' },
  { id: 'bsa-stakeholders', name: 'BSA1_Stakeholders', category: 'BSA', language: 'text', description: 'Stakeholder analysis' },
  { id: 'bsa-requirements', name: 'BSA2_Requirements', category: 'BSA', language: 'text', description: 'Requirements' },
  { id: 'bsa-how-to-req', name: 'BSA3_HowToRequirements', category: 'BSA', language: 'text', description: 'How to Requirements' },
  { id: 'bsa-domains', name: 'BSA4_Domains', category: 'BSA', language: 'text', description: 'Domains' },
  { id: 'bsa-diagrams', name: 'BSA5_Diagrams', category: 'BSA', language: 'text', description: 'Diagrams' },
  { id: 'bsa-bpmn', name: 'BSA6_BPMN', category: 'BSA', language: 'text', description: 'BPMN modeling' },
  { id: 'bsa-userstory', name: 'BSA7_UserStory', category: 'BSA', language: 'text', description: 'User stories' },
  { id: 'bsa-usecase', name: 'BSA8_UseCase', category: 'BSA', language: 'text', description: 'Use cases' },
  { id: 'bsa-objects-roles', name: 'BSA9_Objects_and_Roles', category: 'BSA', language: 'text', description: 'Objects and Roles' },
  { id: 'bsa-fx-design', name: 'BSA10_FX_Design', category: 'BSA', language: 'text', description: 'FX Design' },
  { id: 'bsa-user-interfaces', name: 'BSA11_UserInterfaces', category: 'BSA', language: 'text', description: 'User Interfaces' },
  { id: 'bsa-nfrs', name: 'BSA12_NFRs', category: 'BSA', language: 'text', description: 'Non-functional requirements' },
  { id: 'bsa-backlog-mgmt', name: 'BSA13_BacklogMgmt', category: 'BSA', language: 'text', description: 'Backlog management' },
  { id: 'bsa-system-integration', name: 'BSA14_SystemIntegration', category: 'BSA', language: 'text', description: 'System integration' },
  { id: 'bsa-rest', name: 'BSA15_REST', category: 'BSA', language: 'text', description: 'REST APIs' },
  { id: 'bsa-soap', name: 'BSA16_SOAP', category: 'BSA', language: 'text', description: 'SOAP APIs' },

  // ═══════════════════ Project Management ═══════════════════
  { id: 'pm-projpm', name: 'PjM1_ProjPM', category: 'PM', language: 'text', description: 'Project PM intro' },
  { id: 'pm-lifecycle', name: 'PjM2_LifeCycle', category: 'PM', language: 'text', description: 'Project lifecycle' },
  { id: 'pm-basicm', name: 'PjM3_BasicM', category: 'PM', language: 'text', description: 'Basic methodology' },
  { id: 'pm-pmtools', name: 'PjM4_PMTools', category: 'PM', language: 'text', description: 'PM Tools' },
  { id: 'pm-riskgather', name: 'PjM5_RiskGather', category: 'PM', language: 'text', description: 'Risk gathering' },
  { id: 'pm-probability', name: 'PjM6_Probability', category: 'PM', language: 'text', description: 'Probability management' },
  { id: 'pm-userstory', name: 'PjM7_UserStory', category: 'PM', language: 'text', description: 'User stories' },
  { id: 'pm-riskmng', name: 'PjM8_RiskMng', category: 'PM', language: 'text', description: 'Risk management' },
  { id: 'pm-planstr', name: 'PjM9_PlanStr', category: 'PM', language: 'text', description: 'Plan structure' },
  { id: 'pm-erprun', name: 'PjM10_ERPRun', category: 'PM', language: 'text', description: 'ERP running' },

  // ═══════════════════ UX/UI ═══════════════════
  { id: 'uxui-intro', name: 'UX/UI1_Intro', category: 'UXUI', language: 'figma', description: 'UX/UI intro' },
  { id: 'uxui-ux-design', name: 'UX/UI2_UX_Design', category: 'UXUI', language: 'figma', description: 'UX Design' },
  { id: 'uxui-ui-design', name: 'UX/UI3_UI_Design', category: 'UXUI', language: 'figma', description: 'UI Design' },
  { id: 'uxui-design-ui-kit', name: 'UX/UI4_Design&UI_kit', category: 'UXUI', language: 'figma', description: 'Design & UI Kit' },
  { id: 'uxui-prototyping', name: 'UX/UI5_PrototypStart', category: 'UXUI', language: 'figma', description: 'Prototyping start' },
  { id: 'uxui-website-builder', name: 'UX/UI6_Website_builder', category: 'UXUI', language: 'figma', description: 'Website builder' },
  { id: 'uxui-transferring-layouts', name: 'UX/UI7_Transferring_layouts', category: 'UXUI', language: 'html', description: 'Transferring layouts' },
  { id: 'uxui-team-processes', name: 'UX/UI8_Team_processes', category: 'UXUI', language: 'figma', description: 'Team processes' },
  { id: 'uxui-formation-req', name: 'UX/UI9_Formation_of_require', category: 'UXUI', language: 'text', description: 'Formation of requirements' },
  { id: 'uxui-mobile-app', name: 'UX/UI10_Mobile_application', category: 'UXUI', language: 'figma', description: 'Mobile application design' },
  { id: 'uxui-interface-creation', name: 'UX/UI11_Interface_creation', category: 'UXUI', language: 'figma', description: 'Interface creation' },
  { id: 'uxui-portfolio', name: 'UX/UI12_Portfolio', category: 'UXUI', language: 'figma', description: 'Portfolio' },
];

/**
 * Get project by ID
 */
export function getProject(id) {
  return PROJECTS.find(p => p.id === id);
}

/**
 * Get projects by category
 */
export function getProjectsByCategory(category) {
  return PROJECTS.filter(p => p.category === category.toUpperCase());
}

/**
 * Search projects
 */
export function searchProjects(query) {
  const q = query.toLowerCase();
  return PROJECTS.filter(
    p => p.id.includes(q) || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
  );
}

/**
 * List all projects grouped by category
 */
export async function listProjects(categoryFilter) {
  const categories = categoryFilter
    ? { [categoryFilter.toUpperCase()]: CATEGORIES[categoryFilter.toUpperCase()] }
    : CATEGORIES;

  for (const [catId, cat] of Object.entries(categories)) {
    const projects = PROJECTS.filter(p => p.category === catId);
    if (projects.length === 0) continue;

    console.log(`\n  ${cat.icon} ${chalk.hex(cat.color).bold(cat.name)} (${projects.length} projects)`);
    console.log(chalk.gray('  ' + '─'.repeat(50)));

    const table = new Table({
      chars: { 'mid': '', 'left-mid': '', 'mid-mid': '', 'right-mid': '' },
      style: { 'padding-left': 4, head: ['cyan'] },
      head: ['ID', 'Name', 'Lang', 'Status'],
    });

    for (const p of projects) {
      const hasTests = false; // Will check test module existence
      table.push([
        chalk.gray(p.id),
        chalk.white(p.name),
        chalk.yellow(p.language),
        hasTests ? chalk.green('✅ Ready') : chalk.gray('📦 No tests'),
      ]);
    }

    console.log(table.toString());
  }
}

/**
 * Show detailed info about a project
 */
export async function showProjectInfo(projectId) {
  const project = getProject(projectId);
  if (!project) {
    console.log(chalk.red(`  ❌ Project "${projectId}" not found.`));
    console.log(chalk.gray('  Use "verter list" to see all available projects.'));
    return;
  }

  const cat = CATEGORIES[project.category];
  console.log(`  ${cat.icon} ${chalk.hex(cat.color).bold(project.name)}`);
  console.log(chalk.gray('  ' + '─'.repeat(40)));
  console.log(`  ${chalk.cyan('ID:')}          ${project.id}`);
  console.log(`  ${chalk.cyan('Category:')}    ${cat.name}`);
  console.log(`  ${chalk.cyan('Language:')}    ${project.language}`);
  console.log(`  ${chalk.cyan('Description:')} ${project.description}`);
  console.log(`  ${chalk.cyan('Tests:')}       ${chalk.gray('Not yet configured')}`);
  console.log(`  ${chalk.cyan('Style Rules:')} ${getStyleRulesForLanguage(project.language)}`);
  console.log('');
}

/**
 * Get style rules description for a language
 */
function getStyleRulesForLanguage(lang) {
  const rules = {
    c: 'Norminette (School 21 style)',
    cpp: 'Google C++ Style / S21 rules',
    python: 'PEP8 / flake8',
    javascript: 'ESLint / Prettier',
    java: 'Google Java Style',
    go: 'gofmt / golint',
    sql: 'SQL formatting rules',
    bash: 'ShellCheck',
    docker: 'Hadolint',
    kotlin: 'ktlint',
    swift: 'SwiftLint',
    csharp: 'dotnet format',
  };
  return rules[lang] || chalk.gray('N/A');
}
