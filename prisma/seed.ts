import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding VitaNexa database...')

  const hash = (p: string) => bcrypt.hashSync(p, 10)

  // Specialties
  const specialties = await Promise.all([
    prisma.specialty.upsert({ where: { name: 'Cardiology' }, update: {}, create: { name: 'Cardiology', description: 'Heart and cardiovascular system', icon: 'heart' } }),
    prisma.specialty.upsert({ where: { name: 'Dermatology' }, update: {}, create: { name: 'Dermatology', description: 'Skin, hair and nails', icon: 'skin' } }),
    prisma.specialty.upsert({ where: { name: 'Neurology' }, update: {}, create: { name: 'Neurology', description: 'Brain and nervous system', icon: 'brain' } }),
    prisma.specialty.upsert({ where: { name: 'Orthopedics' }, update: {}, create: { name: 'Orthopedics', description: 'Bones, joints and muscles', icon: 'bone' } }),
    prisma.specialty.upsert({ where: { name: 'Pediatrics' }, update: {}, create: { name: 'Pediatrics', description: "Children's health", icon: 'baby' } }),
    prisma.specialty.upsert({ where: { name: 'Gynecology' }, update: {}, create: { name: 'Gynecology', description: "Women's reproductive health", icon: 'stethoscope' } }),
    prisma.specialty.upsert({ where: { name: 'Ophthalmology' }, update: {}, create: { name: 'Ophthalmology', description: 'Eye care', icon: 'eye' } }),
    prisma.specialty.upsert({ where: { name: 'General Medicine' }, update: {}, create: { name: 'General Medicine', description: 'General health and wellness', icon: 'stethoscope' } }),
    prisma.specialty.upsert({ where: { name: 'Psychiatry' }, update: {}, create: { name: 'Psychiatry', description: 'Mental health', icon: 'brain' } }),
    prisma.specialty.upsert({ where: { name: 'ENT' }, update: {}, create: { name: 'ENT', description: 'Ear, Nose and Throat', icon: 'ear' } }),
  ])

  // Admin
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@vitanexa.com' },
    update: {},
    create: { email: 'admin@vitanexa.com', name: 'System Admin', passwordHash: hash('Admin@1234'), role: 'SYSTEM_ADMIN', isVerified: true, isActive: true, phone: '+91 9000000001' },
  })

  // Hospital Admin
  const hospitalAdminUser = await prisma.user.upsert({
    where: { email: 'hospital@vitanexa.com' },
    update: {},
    create: { email: 'hospital@vitanexa.com', name: 'Apollo Admin', passwordHash: hash('Hospital@1234'), role: 'HOSPITAL_ADMIN', isVerified: true, isActive: true, phone: '+91 9000000002' },
  })

  // Hospital
  const hospital = await prisma.hospital.upsert({
    where: { licenseNo: 'HOSP-MH-2024-001' },
    update: {},
    create: {
      name: 'Apollo Multi-Specialty Hospital',
      type: 'Hospital',
      licenseNo: 'HOSP-MH-2024-001',
      address: '123 Healthcare Avenue',
      city: 'Mumbai',
      state: 'Maharashtra',
      phone: '+91 22 1234 5678',
      email: 'info@apollomumbai.demo',
      description: 'A leading multi-specialty hospital with state-of-the-art facilities.',
      services: 'Cardiology, Neurology, Orthopedics, Pediatrics, Oncology',
      adminUserId: hospitalAdminUser.id,
      isVerified: true,
      isActive: true,
    },
  })

  // Departments
  const deptNames = ['Cardiology', 'Neurology', 'Orthopedics', 'Emergency', 'Pediatrics']
  for (const name of deptNames) {
    const existing = await prisma.department.findFirst({ where: { hospitalId: hospital.id, name } })
    if (!existing) await prisma.department.create({ data: { hospitalId: hospital.id, name } })
  }

  // Doctor users
  const doctorUser1 = await prisma.user.upsert({
    where: { email: 'dr.sharma@vitanexa.com' },
    update: {},
    create: { email: 'dr.sharma@vitanexa.com', name: 'Dr. Priya Sharma', passwordHash: hash('Doctor@1234'), role: 'DOCTOR', isVerified: true, isActive: true, phone: '+91 9000000010' },
  })
  const doctorUser2 = await prisma.user.upsert({
    where: { email: 'dr.mehta@vitanexa.com' },
    update: {},
    create: { email: 'dr.mehta@vitanexa.com', name: 'Dr. Arjun Mehta', passwordHash: hash('Doctor@1234'), role: 'DOCTOR', isVerified: true, isActive: true, phone: '+91 9000000011' },
  })
  const doctorUser3 = await prisma.user.upsert({
    where: { email: 'dr.patel@vitanexa.com' },
    update: {},
    create: { email: 'dr.patel@vitanexa.com', name: 'Dr. Neha Patel', passwordHash: hash('Doctor@1234'), role: 'DOCTOR', isVerified: true, isActive: true, phone: '+91 9000000012' },
  })

  // Doctors
  let doctor1 = await prisma.doctor.findUnique({ where: { userId: doctorUser1.id } })
  if (!doctor1) doctor1 = await prisma.doctor.create({ data: { userId: doctorUser1.id, licenseNumber: 'MCI-2024-001', qualifications: 'MBBS, MD (Cardiology), DM', experience: 15, bio: 'Dr. Priya Sharma is a renowned interventional cardiologist with 15 years of experience.', consultationFee: 1500, onlineConsultationFee: 800, isAvailableOnline: true, languages: 'English, Hindi, Marathi', hospitalId: hospital.id, rating: 4.8, totalRatings: 234, isVerified: true } })
  let doctor2 = await prisma.doctor.findUnique({ where: { userId: doctorUser2.id } })
  if (!doctor2) doctor2 = await prisma.doctor.create({ data: { userId: doctorUser2.id, licenseNumber: 'MCI-2024-002', qualifications: 'MBBS, MD (Neurology), DM', experience: 12, bio: 'Dr. Arjun Mehta is a leading neurologist specializing in stroke management.', consultationFee: 1200, onlineConsultationFee: 700, isAvailableOnline: true, languages: 'English, Hindi, Gujarati', hospitalId: hospital.id, rating: 4.7, totalRatings: 189, isVerified: true } })
  let doctor3 = await prisma.doctor.findUnique({ where: { userId: doctorUser3.id } })
  if (!doctor3) doctor3 = await prisma.doctor.create({ data: { userId: doctorUser3.id, licenseNumber: 'MCI-2024-003', qualifications: 'MBBS, MS (Orthopedics), Fellowship', experience: 10, bio: 'Dr. Neha Patel is an experienced orthopedic surgeon.', consultationFee: 1000, onlineConsultationFee: 600, isAvailableOnline: true, languages: 'English, Hindi', hospitalId: hospital.id, rating: 4.9, totalRatings: 312, isVerified: true } })

  // Doctor Specialties
  const ds1 = await prisma.doctorSpecialty.findUnique({ where: { doctorId_specialtyId: { doctorId: doctor1.id, specialtyId: specialties[0].id } } })
  if (!ds1) await prisma.doctorSpecialty.create({ data: { doctorId: doctor1.id, specialtyId: specialties[0].id } })
  const ds2 = await prisma.doctorSpecialty.findUnique({ where: { doctorId_specialtyId: { doctorId: doctor2.id, specialtyId: specialties[2].id } } })
  if (!ds2) await prisma.doctorSpecialty.create({ data: { doctorId: doctor2.id, specialtyId: specialties[2].id } })
  const ds3 = await prisma.doctorSpecialty.findUnique({ where: { doctorId_specialtyId: { doctorId: doctor3.id, specialtyId: specialties[3].id } } })
  if (!ds3) await prisma.doctorSpecialty.create({ data: { doctorId: doctor3.id, specialtyId: specialties[3].id } })

  // Doctor Availability
  for (const doctor of [doctor1, doctor2, doctor3]) {
    const existingAvail = await prisma.doctorAvailability.findFirst({ where: { doctorId: doctor.id } })
    if (!existingAvail) {
      for (const day of [1, 2, 3, 4, 5]) {
        await prisma.doctorAvailability.create({ data: { doctorId: doctor.id, dayOfWeek: day, startTime: '09:00', endTime: '17:00', slotDuration: 30, isOnline: false, isActive: true } })
      }
      await prisma.doctorAvailability.create({ data: { doctorId: doctor.id, dayOfWeek: 6, startTime: '10:00', endTime: '14:00', slotDuration: 30, isOnline: true, isActive: true } })
    }
  }

  // Patients
  const patientUser1 = await prisma.user.upsert({
    where: { email: 'patient@vitanexa.com' },
    update: {},
    create: { email: 'patient@vitanexa.com', name: 'Rahul Kumar', passwordHash: hash('Patient@1234'), role: 'PATIENT', isVerified: true, isActive: true, phone: '+91 9000000020' },
  })
  const patientUser2 = await prisma.user.upsert({
    where: { email: 'anita@vitanexa.com' },
    update: {},
    create: { email: 'anita@vitanexa.com', name: 'Anita Singh', passwordHash: hash('Patient@1234'), role: 'PATIENT', isVerified: true, isActive: true, phone: '+91 9000000021' },
  })

  let patient1 = await prisma.patient.findUnique({ where: { userId: patientUser1.id } })
  if (!patient1) patient1 = await prisma.patient.create({ data: { userId: patientUser1.id, dateOfBirth: new Date('1990-05-15'), gender: 'Male', bloodGroup: 'O+', address: '45 Residential Colony', city: 'Mumbai', state: 'Maharashtra', pincode: '400002', allergies: 'Penicillin', chronicConditions: 'Hypertension', emergencyName: 'Sunita Kumar', emergencyPhone: '+91 9100000001', emergencyRelation: 'Spouse' } })
  let patient2 = await prisma.patient.findUnique({ where: { userId: patientUser2.id } })
  if (!patient2) patient2 = await prisma.patient.create({ data: { userId: patientUser2.id, dateOfBirth: new Date('1985-08-22'), gender: 'Female', bloodGroup: 'A+', address: '12 Garden Road', city: 'Pune', state: 'Maharashtra', pincode: '411001' } })

  // Emergency contact
  const existingEC = await prisma.emergencyContact.findFirst({ where: { patientId: patient1.id } })
  if (!existingEC) {
    await prisma.emergencyContact.create({ data: { patientId: patient1.id, name: 'Sunita Kumar', phone: '+91 9100000001', relation: 'Spouse', isPrimary: true } })
  }

  // Appointments
  const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1)
  const lastWeek = new Date(); lastWeek.setDate(lastWeek.getDate() - 7)

  const existingAppt = await prisma.appointment.findFirst({ where: { patientId: patient1.id, doctorId: doctor1.id } })
  let appt2: any
  if (!existingAppt) {
    await prisma.appointment.create({ data: { patientId: patient1.id, doctorId: doctor1.id, hospitalId: hospital.id, appointmentDate: tomorrow, startTime: '10:00', endTime: '10:30', type: 'IN_PERSON', status: 'CONFIRMED', reason: 'Routine cardiac checkup', fee: 1500, isPaid: true } })
    appt2 = await prisma.appointment.create({ data: { patientId: patient1.id, doctorId: doctor2.id, hospitalId: hospital.id, appointmentDate: lastWeek, startTime: '11:00', endTime: '11:30', type: 'ONLINE', status: 'COMPLETED', reason: 'Follow-up for migraine', fee: 700, isPaid: true } })
  }

  // Consultation note
  if (appt2) {
    await prisma.consultationNote.create({ data: { appointmentId: appt2.id, doctorId: doctor2.id, chiefComplaint: 'Severe headache', history: 'History of migraines for 3 years.', examination: 'BP: 130/80 mmHg. Neurological exam: Normal.', diagnosis: 'Migraine with aura', plan: 'Continue prophylactic medication. Follow up in 4 weeks.', followUpDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000) } })
  }

  // Medicines
  const med1 = await prisma.medicine.upsert({ where: { id: 'med-metoprolol' }, update: {}, create: { id: 'med-metoprolol', name: 'Metoprolol', genericName: 'Metoprolol Succinate', category: 'Beta Blocker', manufacturer: 'Sun Pharma', description: 'Used for heart conditions' } })
  const med2 = await prisma.medicine.upsert({ where: { id: 'med-sumatriptan' }, update: {}, create: { id: 'med-sumatriptan', name: 'Sumatriptan', genericName: 'Sumatriptan Succinate', category: 'Triptan', manufacturer: 'Cipla', description: 'Migraine treatment' } })
  const med3 = await prisma.medicine.upsert({ where: { id: 'med-topiramate' }, update: {}, create: { id: 'med-topiramate', name: 'Topiramate', genericName: 'Topiramate', category: 'Anticonvulsant', manufacturer: "Dr. Reddy's", description: 'Migraine prevention' } })

  // Prescription for patient
  const existingRx = await prisma.prescription.findFirst({ where: { patientId: patient1.id } })
  if (!existingRx) {
    await prisma.prescription.create({ data: { patientId: patient1.id, doctorId: doctor2.id, diagnosis: 'Migraine with aura', notes: 'Avoid triggers. Maintain headache diary.', validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), isActive: true, medicines: { create: [ { medicineId: med2.id, medicineName: 'Sumatriptan 50mg', dosage: '50mg', frequency: 'As needed for migraine', duration: '3 months', instructions: 'Take at onset of migraine.' }, { medicineId: med3.id, medicineName: 'Topiramate 25mg', dosage: '25mg', frequency: 'Once daily at bedtime', duration: '3 months', instructions: 'Do not stop abruptly.' } ] } } })
  }

  // Medical records
  const existingMR = await prisma.medicalRecord.findFirst({ where: { patientId: patient1.id } })
  if (!existingMR) {
    await prisma.medicalRecord.createMany({ data: [
      { patientId: patient1.id, title: 'ECG Report', documentType: 'BLOOD_TEST', description: 'Normal sinus rhythm', doctorId: doctor1.id, hospitalId: hospital.id, specialty: 'Cardiology', recordDate: lastWeek },
      { patientId: patient1.id, title: 'Complete Blood Count', documentType: 'BLOOD_TEST', description: 'CBC - All values normal', recordDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      { patientId: patient1.id, title: 'Chest X-Ray', documentType: 'XRAY', description: 'No abnormality detected', doctorId: doctor1.id, hospitalId: hospital.id, recordDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
    ] })
  }

  // Health metrics
  const existingMetric = await prisma.healthMetric.findFirst({ where: { patientId: patient1.id } })
  if (!existingMetric) {
    for (let i = 0; i < 10; i++) {
      await prisma.healthMetric.create({ data: { patientId: patient1.id, type: 'BLOOD_PRESSURE', value: `${120 + Math.floor(Math.random() * 20)}/${70 + Math.floor(Math.random() * 15)}`, unit: 'mmHg', measuredAt: new Date(Date.now() - i * 3 * 24 * 60 * 60 * 1000) } })
      await prisma.healthMetric.create({ data: { patientId: patient1.id, type: 'HEART_RATE', value: `${68 + Math.floor(Math.random() * 20)}`, unit: 'bpm', measuredAt: new Date(Date.now() - i * 3 * 24 * 60 * 60 * 1000) } })
    }
  }

  // Lab
  const labAdminUser = await prisma.user.upsert({
    where: { email: 'lab@vitanexa.com' },
    update: {},
    create: { email: 'lab@vitanexa.com', name: 'PathCare Admin', passwordHash: hash('Lab@1234'), role: 'LAB_ADMIN', isVerified: true, isActive: true, phone: '+91 9000000030' },
  })
  const laboratory = await prisma.laboratory.upsert({
    where: { licenseNo: 'LAB-MH-2024-001' },
    update: {},
    create: { name: 'PathCare Diagnostics', licenseNo: 'LAB-MH-2024-001', address: '78 Medical Complex', city: 'Mumbai', state: 'Maharashtra', phone: '+91 22 9876 5432', email: 'info@pathcare.demo', adminUserId: labAdminUser.id, isVerified: true, isActive: true },
  })

  const labTestNames = ['Complete Blood Count (CBC)', 'Lipid Profile', 'HbA1c', 'TSH', 'ECG']
  const labTestPrices = [350, 550, 450, 400, 250]
  const labTests: any[] = []
  for (let i = 0; i < labTestNames.length; i++) {
    const existing = await prisma.labTest.findFirst({ where: { laboratoryId: laboratory.id, name: labTestNames[i] } })
    if (existing) { labTests.push(existing) } else {
      const lt = await prisma.labTest.create({ data: { laboratoryId: laboratory.id, name: labTestNames[i], category: 'Biochemistry', price: labTestPrices[i], turnaroundTime: '24 hours' } })
      labTests.push(lt)
    }
  }

  const existingLR = await prisma.labReport.findFirst({ where: { patientId: patient1.id } })
  if (!existingLR && labTests.length > 0) {
    await prisma.labReport.create({ data: { patientId: patient1.id, laboratoryId: laboratory.id, labTestId: labTests[0].id, testName: 'Complete Blood Count (CBC)', status: 'READY', reportDate: lastWeek, results: JSON.stringify({ WBC: '7.2', RBC: '4.8', Hemoglobin: '14.5 g/dL' }), interpretation: 'All values within normal range.' } })
  }

  // Pharmacy
  const pharmacyAdminUser = await prisma.user.upsert({
    where: { email: 'pharmacy@vitanexa.com' },
    update: {},
    create: { email: 'pharmacy@vitanexa.com', name: 'MedPlus Admin', passwordHash: hash('Pharmacy@1234'), role: 'PHARMACY_ADMIN', isVerified: true, isActive: true, phone: '+91 9000000040' },
  })
  await prisma.pharmacy.upsert({
    where: { licenseNo: 'PHARM-MH-2024-001' },
    update: {},
    create: { name: 'MedPlus Pharmacy', licenseNo: 'PHARM-MH-2024-001', address: '99 Medical Street', city: 'Mumbai', state: 'Maharashtra', phone: '+91 22 1111 2222', email: 'info@medplus.demo', adminUserId: pharmacyAdminUser.id, isVerified: true, isActive: true },
  })

  // Notifications
  const existingNotif = await prisma.notification.findFirst({ where: { userId: patientUser1.id } })
  if (!existingNotif) {
    await prisma.notification.createMany({ data: [
      { userId: patientUser1.id, title: 'Appointment Confirmed', message: 'Your appointment with Dr. Priya Sharma has been confirmed.', type: 'APPOINTMENT', isRead: false, actionUrl: '/patient/appointments' },
      { userId: patientUser1.id, title: 'New Prescription', message: 'Dr. Arjun Mehta has issued a new prescription.', type: 'PRESCRIPTION', isRead: false, actionUrl: '/patient/prescriptions' },
      { userId: patientUser1.id, title: 'Lab Report Ready', message: 'Your CBC test report is now available.', type: 'LAB_REPORT', isRead: true, actionUrl: '/patient/lab-reports' },
      { userId: doctorUser1.id, title: 'New Appointment', message: 'Rahul Kumar has booked an appointment for tomorrow at 10:00 AM.', type: 'APPOINTMENT', isRead: false, actionUrl: '/doctor/appointments' },
    ] })
  }

  console.log('Database seeded successfully!')
  console.log('Demo Credentials:')
  console.log('Admin:    admin@vitanexa.com / Admin@1234')
  console.log('Doctor:   dr.sharma@vitanexa.com / Doctor@1234')
  console.log('Patient:  patient@vitanexa.com / Patient@1234')
  console.log('Hospital: hospital@vitanexa.com / Hospital@1234')
  console.log('Lab:      lab@vitanexa.com / Lab@1234')
  console.log('Pharmacy: pharmacy@vitanexa.com / Pharmacy@1234')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
