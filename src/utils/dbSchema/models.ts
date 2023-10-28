import type {
  ModerationStatus,
  QuestionnaireType,
  ResponseBy,
  ResponseResult,
  UserType,
} from "./enums";

export type User = {
  id: string;
  userType: UserType;
  lastName: string | null;
  firstName: string | null;
  middleName: string | null;
  age: string | null;
  phoneNumber: string | null;
  email: string | null;
  linkedinLink: string | null;
  githubLink: string | null;
  telegramLink: string | null;
  login: string;
  password: string;
};

export type Candidate = {
  candidateId: string;
};

export type Employer = {
  employerId: string;
  companyName: string | null;
  companyAddress: string | null;
};

export type Questionnaire = {
  questionnaireId: string;
  questionnaireType: QuestionnaireType;
  candidateId: string | null;
  employerId: string | null;
};

export type Resume = {
  questionnaireId: string;
  candidateId: string;
  moderationStatus: ModerationStatus;
  workExperience: string | null;
  skills: string | null;
  education: string | null;
  foreignLanguages: string | null;
  interests: string | null;
  achievements: string | null;
  specialty: string | null;
  desiredSalary: string | null;
  employment: string | null;
  updatedAt: Date;
};

export type Vacancy = {
  questionnaireId: string;
  employerId: string;
  moderationStatus: ModerationStatus;
  specialty: string;
  salary: string | null;
  duties: string | null;
  requirements: string | null;
  conditions: string | null;
  workSchedule: string | null;
  employment: string | null;
  dateOfPublication: Date;
};

export type Response = {
  responseId: string;
  candidateId: string;
  resumeId: string;
  employerId: string;
  vacancyId: string;
  coverLetter: string;
  responseBy: ResponseBy;
  responseDate: Date;
};

export type FeedbackResult = {
  feedbackResultId: string;
  responseId: string;
  response: string;
  responseResult: ResponseResult;
  responseDate: Date;
};
