-- Seed organization
insert into organizations (id, name, slug) values
  ('00000000-0000-0000-0000-000000000001', 'Incogmoto Training', 'incogmoto');

-- Seed skills
insert into skills (org_id, name, category, description) values
  ('00000000-0000-0000-0000-000000000001', 'Target Fixation', 'vision', 'Looking through the turn, not at the hazard'),
  ('00000000-0000-0000-0000-000000000001', 'Trail Braking', 'emergency', 'Carrying brake into turn entrance smoothly'),
  ('00000000-0000-0000-0000-000000000001', 'Countersteering', 'control', 'Push-pull input for rapid direction change'),
  ('00000000-0000-0000-0000-000000000001', 'Slow Speed Balance', 'control', 'Clutch control and body position at low speed'),
  ('00000000-0000-0000-0000-000000000001', 'Line Selection', 'cornering', 'Choosing optimal racing line through corner types'),
  ('00000000-0000-0000-0000-000000000001', 'Scanning Pattern', 'awareness', 'Systematic hazard identification routine'),
  ('00000000-0000-0000-0000-000000000001', 'Threshold Braking', 'emergency', 'Maximum braking without lockup'),
  ('00000000-0000-0000-0000-000000000001', 'Throttle Control', 'control', 'Smooth roll-on roll-off through corners');
