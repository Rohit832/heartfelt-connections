-- Clear existing tests to avoid duplicates (optional, use with caution if you have custom data)
-- delete from public.tests;

-- Insert a rich set of realistic diagnostic tests
insert into public.tests (name, description, price, turnaround, features, popular)
values
  (
    'Smart Full Body Checkup',
    'Comprehensive health checkup monitoring all vital organs. Ideal for annual screening.',
    799,
    '24 Hours',
    ARRAY['Hemogram (CBC)', 'Thyroid Profile', 'Liver Function Test', 'Kidney Function Test', 'Lipid Profile', 'Urine Routine'],
    true
  ),
  (
    'Vital Screening Package',
    'Essential screening for widely common health issues.',
    399,
    '15 Hours',
    ARRAY['Thyroid (TSH)', 'Liver Enzymes (SGOT/SGPT)', 'Creatinine', 'Blood Sugar Fasting', 'CBC'],
    true
  ),
  (
    'Women Health Package',
    'Specially designed for women monitoring hormonal and nutritional health.',
    999,
    '24 Hours',
    ARRAY['Thyroid Profile', 'Iron Studies', 'Vitamin D', 'Vitamin B12', 'CBC', 'Calcium'],
    true
  ),
  (
    'Senior Citizen Advance Package',
    'Advanced geriatric care package focusing on bone, heart, and metabolic health.',
    1499,
    '30 Hours',
    ARRAY['HbA1c', 'Lipid Profile', 'Heart Risk Markers', 'Bone Health (Calcium/Phosphorus)', 'Kidney Function'],
    false
  ),
  (
    'Thyroid Profile Total',
    'Detailed analysis of thyroid hormones T3, T4, and TSH.',
    199,
    '6 Hours',
    ARRAY['T3 Total', 'T4 Total', 'TSH Ultra Sensitive'],
    false
  ),
  (
    'Diabetes Profile Comprehensive',
    'Gold standard monitoring for diabetics.',
    599,
    '12 Hours',
    ARRAY['HbA1c', 'Average Blood Glucose', 'Fasting Blood Sugar', 'Microalbumin', 'Creatinine'],
    false
  ),
  (
    'Vitamin Profile (D & B12)',
    'Check for common nutritional deficiencies causing fatigue and pain.',
    499,
    '24 Hours',
    ARRAY['Vitamin D Total', 'Vitamin B12'],
    true
  ),
  (
    'Fever Profile (Basic)',
    'Diagnosis for persistent fever including Malaria and Typhoid.',
    650,
    '12 Hours',
    ARRAY['CBC', 'Malaria Parasite', 'Widal Test (Typhoid)', 'Urine Routine'],
    false
  ),
  (
    'Liver Function Test (LFT)',
    'Check liver health and enzyme levels.',
    350,
    '10 Hours',
    ARRAY['Bilirubin', 'SGOT', 'SGPT', 'Alkaline Phosphatase', 'Protein Total'],
    false
  ),
  (
    'Lipid Profile',
    'Assess risk of heart disease by measuring cholesterol levels.',
    300,
    '10 Hours',
    ARRAY['Cholesterol Total', 'Triglycerides', 'HDL', 'LDL', 'VLDL'],
    false
  ),
  (
    'Dengue NS1 Antigen',
    'Early detection of Dengue virus.',
    500,
    '6 Hours',
    ARRAY['Dengue NS1 Antigen'],
    false
  ),
  (
    'Kidney Function Test (KFT)',
    'Evaluate kidney performance and filtration.',
    399,
    '10 Hours',
    ARRAY['Urea', 'Creatinine', 'Uric Acid', 'Bun', 'Calcium'],
    false
  );
