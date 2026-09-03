export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
}
export interface DoctorProfile {
  name: string;
  designation: string;
}


export interface PrescriptionData {
  patientName: string;
  age: string;
  sex: string;
  contact: string;
  // vitals: {
  //   bloodPressure: string;
  //   heartRate: string;
  //   temperature: string;
  // };
  chiefComplaints: string;
  onExamination: string;
  diagnosis: string;
  investigation: string;
  treatment: string;
  medications: Medication[];

}