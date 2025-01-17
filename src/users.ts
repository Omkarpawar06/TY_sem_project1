interface User {
  username: string;
  password: string;
  name: string;
  role: string;
}

export const authorizedUsers: User[] = [
  {
    username: "dr.smith",
    password: "lab123",
    name: "Dr. Sarah Smith",
    role: "Lab Director"
  },
  {
    username: "dr.jones",
    password: "lab456",
    name: "Dr. Michael Jones",
    role: "Senior Pathologist"
  },
  {
    username: "dr.patel",
    password: "lab789",
    name: "Dr. Priya Patel",
    role: "Pathologist"
  },
  {
    username: "tech.wilson",
    password: "lab321",
    name: "James Wilson",
    role: "Lab Technician"
  },
  {
    username: "admin.chen",
    password: "lab654",
    name: "Lisa Chen",
    role: "Lab Administrator"
  }
];