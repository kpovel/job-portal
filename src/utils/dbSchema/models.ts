import type {
  UserType,
  ModerationStatus,
  ResponseBy,
  ResponseResult,
} from "./enums";

export type User = {
  id: number;
  user_uuid: string;
  user_type: UserType;
  login: string;
  password: string;
  last_name: string | null;
  first_name: string | null;
  age: number | null;
  phone_number: string | null;
  email: string | null;
  linkedin_link: string | null;
  github_link: string | null;
};

export type Candidate = {
  candidate_id: number;
};

export type Employer = {
  employer_id: number;
  company_name: string | null;
  company_address: string | null;
};

export type Resume = {
  id: number;
  resume_uuid: string;
  candidate_id: number;
  moderation_status: ModerationStatus;
  work_experience: string | null;
  skills: string | null;
  education: string | null;
  foreign_languages: string | null;
  interests: string | null;
  achievements: string | null;
  specialty: string | null;
  desired_salary: string | null;
  employment: string | null;
  updated_at: Date;
};

export type Vacancy = {
  id: number;
  vacancy_uuid: string;
  employer_id: number;

  specialty: string;
  salary: string | null;
  duties: string | null;
  requirements: string | null;
  conditions: string | null;
  work_schedule: string | null;
  employment: string | null;
  publication_date: Date;
  moderation_status: ModerationStatus;
};

export type Response = {
  id: number;
  response_uuid: string;
  candidate_id: number;
  employer_id: number;
  vacancy_id: number;
  response_by: ResponseBy;

  cover_letter: string;
  response_date: Date;
};

export type FeedbackResult = {
  id: number;
  feedback_result_uuid: string;
  response_id: number;

  response: string;
  response_date: Date;
  response_result: ResponseResult;
};
