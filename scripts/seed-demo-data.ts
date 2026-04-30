import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const ORG_ID = "f02c308d-032f-412e-852c-6430f5bf6650";
const USER_ID = "cc852e2d-7b66-42fb-bbd8-31fdf16b9224";

// Client data
const clients = [
  { first_name: "Sarah", last_name: "Mitchell", email: "sarah.m@email.com", phone: "+1-604-555-0142", date_of_birth: "1992-03-15", license_type: "provisional", experience_level: "intermediate", notes: "Very cautious rider. Needs help with highway confidence.", total_sessions: 8, total_paid: 640, status: "active" },
  { first_name: "James", last_name: "O'Brien", email: "james.ob@email.com", phone: "+1-604-555-0198", date_of_birth: "1985-07-22", license_type: "full", experience_level: "advanced", notes: "Track day enthusiast. Working on advanced cornering.", total_sessions: 15, total_paid: 1275, status: "active" },
  { first_name: "Priya", last_name: "Sharma", email: "priya.sh@email.com", phone: "+1-604-555-0267", date_of_birth: "1998-11-08", license_type: "learner", experience_level: "beginner", notes: "Just got her first bike - Ninja 400. Nervous but eager.", total_sessions: 3, total_paid: 225, status: "active" },
  { first_name: "Marcus", last_name: "Chen", email: "marcus.c@email.com", phone: "+1-604-555-0334", date_of_birth: "1990-01-30", license_type: "full", experience_level: "intermediate", notes: "Commuter rider. Wants to improve emergency braking.", total_sessions: 6, total_paid: 480, status: "active" },
  { first_name: "Elena", last_name: "Rodriguez", email: "elena.r@email.com", phone: "+1-604-555-0411", date_of_birth: "1988-09-14", license_type: "provisional", experience_level: "intermediate", notes: "Returning rider after 2-year break. Platinum Ride client.", total_sessions: 12, total_paid: 960, status: "active" },
  { first_name: "David", last_name: "Park", email: "david.p@email.com", phone: "+1-604-555-0523", date_of_birth: "2001-05-19", license_type: "none", experience_level: "beginner", notes: "No license yet. Pre-lessons consultation done.", total_sessions: 1, total_paid: 75, status: "active" },
  { first_name: "Rachel", last_name: "Thompson", email: "rachel.t@email.com", phone: "+1-604-555-0689", date_of_birth: "1995-12-03", license_type: "full", experience_level: "advanced", notes: "Corporate client - TechCorp team building. Excellent progress.", total_sessions: 20, total_paid: 1800, status: "active" },
  { first_name: "Tom", last_name: "Hendricks", email: "tom.h@email.com", phone: "+1-604-555-0745", date_of_birth: "1978-06-25", license_type: "full", experience_level: "advanced", notes: "Hasn't booked in 45 days. Winback candidate.", total_sessions: 18, total_paid: 1530, status: "winback" },
];

// Skill definitions
const skills = [
  { name: "Cornering Line Selection", category: "cornering", description: "Ability to choose optimal racing line through corners" },
  { name: "Throttle Control", category: "cornering", description: "Smooth and progressive throttle application" },
  { name: "Counter-steering", category: "cornering", description: "Quick and precise counter-steering inputs" },
  { name: "Emergency Braking", category: "emergency", description: "Maximum braking without wheel lock-up" },
  { name: "Swerve Avoidance", category: "emergency", description: "Quick obstacle avoidance maneuvers" },
  { name: "Target Fixation Recovery", category: "awareness", description: "Breaking fixation on hazards" },
  { name: "Road Positioning", category: "awareness", description: "Optimal lane positioning for visibility and safety" },
  { name: "Situational Awareness", category: "awareness", description: "360-degree hazard scanning" },
  { name: "Clutch Control", category: "control", description: "Smooth clutch engagement and friction zone control" },
  { name: "Body Positioning", category: "control", description: "Proper body lean and weight distribution" },
  { name: "Visual Scanning", category: "vision", description: "Looking through turns and ahead" },
];

// Generate session dates (spread over last 3 months)
function getSessionDate(dayOffset: number, hour: number = 10): Date {
  const d = new Date();
  d.setDate(d.getDate() + dayOffset);
  d.setHours(hour, 0, 0, 0);
  return d;
}

async function seed() {
  console.log("Seeding demo data for TrueLine CRM...\n");

  // 1. Insert clients
  console.log("Creating clients...");
  const clientIds: Record<string, string> = {};
  for (const c of clients) {
    const { data, error } = await supabase
      .from("clients")
      .insert({ ...c, org_id: ORG_ID })
      .select()
      .single();
    if (error) {
      console.error(`Error creating ${c.first_name}:`, error.message);
      continue;
    }
    clientIds[c.first_name] = data.id;
    console.log(`  ✓ ${c.first_name} ${c.last_name}`);
  }

  // 2. Insert skills
  console.log("\nCreating skills...");
  const skillIds: Record<string, string> = {};
  for (const s of skills) {
    const { data, error } = await supabase
      .from("skills")
      .insert({ ...s, org_id: ORG_ID })
      .select()
      .single();
    if (error) {
      console.error(`Error creating skill ${s.name}:`, error.message);
      continue;
    }
    skillIds[s.name] = data.id;
    console.log(`  ✓ ${s.name}`);
  }

  // 3. Insert sessions
  console.log("\nCreating sessions...");
  const sessionConfigs = [
    // Completed sessions (past)
    { day: -60, hour: 10, type: "private", client: "Priya", status: "completed", payment: 75, location: "Richmond Parking Lot", notes: "Great first session. Basic controls covered." },
    { day: -58, hour: 14, type: "private", client: "Sarah", status: "completed", payment: 85, location: "Stanley Park", notes: "Worked on smooth throttle through Sea Wall corners." },
    { day: -52, hour: 9, type: "cornering_clinic", client: "James", status: "completed", payment: 95, location: "Porteau Cove", notes: "Advanced lean angles. Ready for track prep." },
    { day: -45, hour: 10, type: "private", client: "Priya", status: "completed", payment: 75, location: "Richmond Parking Lot", notes: "Clutch control improved significantly." },
    { day: -40, hour: 13, type: "platinum_ride", client: "Elena", status: "completed", payment: 120, location: "Sea to Sky Highway", notes: "Beautiful ride to Squamish. Great body positioning." },
    { day: -35, hour: 10, type: "private", client: "Marcus", status: "completed", payment: 85, location: "Burnaby Mountain", notes: "Emergency braking practice. Needs more work." },
    { day: -30, hour: 14, type: "corporate", client: "Rachel", status: "completed", payment: 150, location: "TechCorp Campus", notes: "Team building session. 3 employees participated." },
    { day: -25, hour: 10, type: "private", client: "Sarah", status: "completed", payment: 85, location: "Stanley Park", notes: "Highway merge practice. Much more confident now." },
    { day: -22, hour: 9, type: "cornering_clinic", client: "James", status: "completed", payment: 95, location: "Porteau Cove", notes: "Counter-steering drills. Excellent progress." },
    { day: -18, hour: 10, type: "private", client: "Priya", status: "completed", payment: 75, location: "Richmond Parking Lot", notes: "Ready for road riding. Big milestone!" },
    { day: -15, hour: 14, type: "private", client: "Elena", status: "completed", payment: 85, location: "West Vancouver", notes: "Returning rider confidence building." },
    { day: -12, hour: 10, type: "private", client: "Marcus", status: "completed", payment: 85, location: "Burnaby Mountain", notes: "Emergency braking finally clicking." },
    { day: -8, hour: 13, type: "platinum_ride", client: "Elena", status: "completed", payment: 120, location: "Horseshoe Bay", notes: "Long distance ride. Endurance good." },
    { day: -5, hour: 10, type: "private", client: "David", status: "completed", payment: 75, location: "Richmond Parking Lot", notes: "Pre-licensing consultation. Ready to book test prep." },
    { day: -3, hour: 14, type: "corporate", client: "Rachel", status: "completed", payment: 150, location: "TechCorp Campus", notes: "Follow-up corporate session. New team members." },
    { day: -2, hour: 10, type: "private", client: "Sarah", status: "completed", payment: 85, location: "Stanley Park", notes: "Independent riding assessment. Ready for solo." },
    // Today's sessions
    { day: 0, hour: 10, type: "private", client: "Priya", status: "scheduled", payment: 75, location: "Richmond Road Routes", notes: "First road ride. Exciting!" },
    { day: 0, hour: 14, type: "cornering_clinic", client: "James", status: "scheduled", payment: 95, location: "Porteau Cove", notes: "Track day prep - apex hitting." },
    { day: 0, hour: 11, type: "private", client: "Marcus", status: "scheduled", payment: 85, location: "Burnaby Mountain", notes: "Advanced braking follow-up." },
    // Tomorrow
    { day: 1, hour: 10, type: "private", client: "Elena", status: "scheduled", payment: 85, location: "West Vancouver", notes: "Platinum ride planning." },
    { day: 1, hour: 14, type: "private", client: "Sarah", status: "scheduled", payment: 85, location: "Stanley Park", notes: "Maintenance check ride." },
    // Future sessions this week
    { day: 3, hour: 9, type: "corporate", client: "Rachel", status: "scheduled", payment: 150, location: "TechCorp Campus", notes: "Quarterly corporate event." },
    { day: 4, hour: 10, type: "platinum_ride", client: "Elena", status: "scheduled", payment: 120, location: "Sea to Sky", notes: "Monthly platinum ride." },
    { day: 5, hour: 13, type: "private", client: "David", status: "scheduled", payment: 75, location: "Richmond ICBC Area", notes: "Road test prep session." },
  ];

  const sessionIds: string[] = [];
  for (const cfg of sessionConfigs) {
    const clientId = clientIds[cfg.client];
    if (!clientId) continue;

    const start = getSessionDate(cfg.day, cfg.hour);
    const end = new Date(start.getTime() + 90 * 60 * 1000);

    const { data, error } = await supabase
      .from("sessions")
      .insert({
        org_id: ORG_ID,
        client_id: clientId,
        session_type: cfg.type,
        scheduled_start: start.toISOString(),
        scheduled_end: end.toISOString(),
        location: cfg.location,
        status: cfg.status,
        payment_amount: cfg.payment,
        payment_method: "stripe",
        notes: cfg.notes,
      })
      .select()
      .single();

    if (error) {
      console.error(`Error creating session for ${cfg.client}:`, error.message);
      continue;
    }
    sessionIds.push(data.id);
    console.log(`  ✓ ${cfg.type} - ${cfg.client} (${cfg.status})`);
  }

  // 4. Insert session_skills scores for completed sessions
  console.log("\nCreating session skill scores...");
  const skillScoreMap: Record<string, { skill: string; min: number; max: number }> = {
    "Priya_0": { skill: "Clutch Control", min: 4, max: 7 },
    "Priya_1": { skill: "Body Positioning", min: 3, max: 6 },
    "Priya_2": { skill: "Visual Scanning", min: 5, max: 8 },
    "Sarah_0": { skill: "Cornering Line Selection", min: 5, max: 7 },
    "Sarah_1": { skill: "Throttle Control", min: 6, max: 8 },
    "James_0": { skill: "Cornering Line Selection", min: 7, max: 9 },
    "James_1": { skill: "Counter-steering", min: 8, max: 10 },
    "Marcus_0": { skill: "Emergency Braking", min: 4, max: 7 },
    "Elena_0": { skill: "Body Positioning", min: 6, max: 9 },
    "Rachel_0": { skill: "Road Positioning", min: 7, max: 9 },
  };

  for (let i = 0; i < sessionIds.length; i++) {
    const key = Object.keys(skillScoreMap)[i % Object.keys(skillScoreMap).length];
    const scoreConfig = skillScoreMap[key];
    if (!scoreConfig || !skillIds[scoreConfig.skill]) continue;

    const score = Math.floor(Math.random() * (scoreConfig.max - scoreConfig.min + 1)) + scoreConfig.min;

    await supabase
      .from("session_skills")
      .insert({
        session_id: sessionIds[i],
        skill_id: skillIds[scoreConfig.skill],
        score,
        coach_note: `Scored ${score}/10 for ${scoreConfig.skill}`,
      });
  }

  // 5. Insert follow-ups
  console.log("\nCreating follow-ups...");
  const followUps = [
    { client: "Tom", type: "winback", daysFromNow: 1, notes: "Hasn't booked in 45 days. Send winback offer." },
    { client: "Priya", type: "rebook", daysFromNow: 2, notes: "Ready for second road ride. Book Richmond loop." },
    { client: "David", type: "rebook", daysFromNow: 3, notes: "Road test prep follow-up. ICBC test scheduled." },
    { client: "Sarah", type: "post_session", daysFromNow: 0, notes: "Post-session check-in. How was the solo ride?" },
    { client: "James", type: "rebook", daysFromNow: 4, notes: "Track day coming up. Pre-track clinic needed." },
    { client: "Marcus", type: "post_session", daysFromNow: 1, notes: "Emergency braking follow-up. Practice at home." },
    { client: "Elena", type: "platinum_invite", daysFromNow: 5, notes: "Invite to next Platinum Ride group event." },
  ];

  for (const fu of followUps) {
    const clientId = clientIds[fu.client];
    if (!clientId) continue;

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + fu.daysFromNow);
    dueDate.setHours(10, 0, 0, 0);

    await supabase
      .from("follow_ups")
      .insert({
        org_id: ORG_ID,
        client_id: clientId,
        type: fu.type,
        due_at: dueDate.toISOString(),
        notes: fu.notes,
      });

    console.log(`  ✓ ${fu.type} - ${fu.client}`);
  }

  console.log("\n✅ Demo data seeded successfully!");
  console.log("\nSummary:");
  console.log(`  ${Object.keys(clientIds).length} clients`);
  console.log(`  ${Object.keys(skillIds).length} skills`);
  console.log(`  ${sessionIds.length} sessions (${sessionConfigs.filter(s => s.status === "completed").length} completed, ${sessionConfigs.filter(s => s.status === "scheduled").length} upcoming)`);
  console.log(`  ${followUps.length} follow-ups`);
}

seed().catch(console.error);
