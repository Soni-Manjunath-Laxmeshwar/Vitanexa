import { NextRequest, NextResponse } from 'next/server'

const SAFETY_DISCLAIMER = `\n\n⚠️ **Medical Safety Notice**: VitaGuide provides general health information and organizational support only. It cannot diagnose diseases, recommend specific treatments, or prescribe medication. Please consult a qualified healthcare professional for personalized medical advice. If you are experiencing a medical emergency, call your local emergency services (e.g. 112 / 102 / 911) immediately.`

export async function POST(req: NextRequest) {
  try {
    const { message, category } = await req.json()
    if (!message) return NextResponse.json({ error: 'Message is required' }, { status: 400 })

    const lower = message.toLowerCase()

    let reply = ''

    // Check emergency indicators first
    if (
      lower.includes('chest pain') ||
      lower.includes('severe bleeding') ||
      lower.includes('can\'t breathe') ||
      lower.includes('cannot breathe') ||
      lower.includes('stroke') ||
      lower.includes('heart attack') ||
      lower.includes('unconscious') ||
      lower.includes('emergency')
    ) {
      reply = `🚨 **URGENT EMERGENCY ALERT** 🚨\n\nIf you or someone near you is experiencing severe symptoms such as chest pain, severe difficulty breathing, sudden weakness/numbness, or loss of consciousness, **seek immediate emergency medical care**.\n\n- Call **112** or **102** (or your local emergency response line).\n- Go to the nearest Hospital Emergency Room right away.\n- Use the **Emergency SOS** tab in VitaNexa to notify your emergency contacts.`
      return NextResponse.json({ reply, isEmergency: true })
    }

    if (category === 'prep' || lower.includes('prepare') || lower.includes('appointment')) {
      reply = `📋 **Preparing for Your Doctor Appointment**\n\nHere are recommended steps to get the most out of your consultation:\n\n1. **List Your Main Concerns**: Note down your primary symptoms, when they started, and what makes them better or worse.\n2. **Bring Medical History**: Have your past diagnosis records, allergies, and recent lab reports ready (you can upload these under **Medical Records** in VitaNexa).\n3. **Current Medications**: Bring a full list of prescription drugs, over-the-counter meds, and supplements.\n4. **Questions to Ask**:\n   - *What might be causing my symptoms?*\n   - *Do I need any diagnostic tests?*\n   - *What are the treatment options and potential side effects?*\n   - *When should I schedule a follow-up?*`
    } else if (category === 'terms' || lower.includes('explain') || lower.includes('meaning') || lower.includes('what is')) {
      if (lower.includes('hypertension')) {
        reply = `💡 **Hypertension Explained in Simple Terms**\n\nHypertension simply means **high blood pressure**. Blood pressure is the force of blood pushing against the walls of your blood vessels. When it stays high over time, it puts extra strain on your heart and blood vessels.`
      } else if (lower.includes('cbc') || lower.includes('complete blood count')) {
        reply = `💡 **Complete Blood Count (CBC) Explained**\n\nA CBC is a common blood test that checks your overall health. It measures:\n- **Red Blood Cells (RBC)**: Carry oxygen throughout your body.\n- **White Blood Cells (WBC)**: Fight off infections.\n- **Hemoglobin**: Protein carrying oxygen.\n- **Platelets**: Help your blood clot to stop bleeding.`
      } else if (lower.includes('hba1c') || lower.includes('diabetes')) {
        reply = `💡 **HbA1c Test Explained**\n\nThe HbA1c test measures your average blood sugar level over the past 2 to 3 months. It helps monitor diabetes control.`
      } else {
        reply = `💡 **Medical Term Clarification**\n\nMedical terms can often sound complex. In simple terms, understanding your health reports helps you collaborate better with your doctor. If you'd like an explanation of a specific term from your report, please type it in!`
      }
    } else if (category === 'summarize' || lower.includes('summary') || lower.includes('report') || lower.includes('lab')) {
      reply = `📑 **Document Summary Guidance**\n\nYou can upload your medical documents in the **Medical Records** section of VitaNexa. I can help organize key points such as test dates, doctor notes, and reference ranges so you have a clean overview before your visit.`
    } else if (lower.includes('doctor') || lower.includes('book') || lower.includes('specialty')) {
      reply = `🔍 **Navigating VitaNexa Services**\n\nYou can easily book appointments and manage care in the platform:\n- **Find a Doctor**: Click on *Doctor Search* in your dashboard to search by specialty, city, or online availability.\n- **Lab Reports**: Request and download test results under *Lab Reports*.\n- **Prescriptions**: Access active digital prescriptions and set up medication reminders under *Prescriptions*.`
    } else {
      reply = `👋 **Hello! I am VitaGuide**, your digital health assistant on VitaNexa.\n\nI can assist you with:\n- Preparing for upcoming doctor visits\n- Explaining medical terminology in plain language\n- Organizing your questions for your clinician\n- Finding relevant features inside VitaNexa\n- Setting medication & health reminders\n\nHow can I help you today?`
    }

    reply += SAFETY_DISCLAIMER

    return NextResponse.json({ reply, isEmergency: false })
  } catch (error) {
    console.error('VitaGuide error:', error)
    return NextResponse.json({ error: 'Failed to process assistant request' }, { status: 500 })
  }
}
