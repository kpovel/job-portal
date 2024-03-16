export type UserType = {
  id: number;
  type: "CANDIDATE" | "EMPLOYER" | "ADMIN";
};

export type StatusType = {
  id: number;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
};

export type User = {
  id: number;
  user_uuid: string;
  user_type_id: UserType["id"];
  login: string;
  password: string;

  last_name: string | null;
  first_name: string | null;
  phone_number: string | null;
  email: string | null;
  linkedin_link: string | null;
  github_link: string | null;
};

export type Candidate = {
  id: User["id"];
};

export type Resume = {
  id: string;
  resume_uuid: string;
  candidate_id: Candidate["id"];

  moderation_status_id: StatusType["id"];
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

export type Employer = {
  id: User["id"];
  company_name: string;
  company_address: string;
};

export type Vacancy = {
  id: number;
  vacancy_uuid: string;
  employer_id: Employer["id"];

  specialty: string;
  salary: string | null;
  duties: string | null;
  requirements: string | null;
  conditions: string | null;
  work_schedule: string | null;
  employment: string | null;
  publication_date: Date;
  moderation_status_id: StatusType["id"];
};

export type Response = {
  id: number;
  response_uuid: string;

  candidate_id: Candidate["id"];
  employer_id: Employer["id"];
  vacancy_id: Vacancy["id"];
  response_by_user_type_id: UserType["id"];

  cover_letter: string;
  response_date: Date;
};

export type FeedbackResult = {
  id: number;
  feedback_result_uuid: string;
  response_id: Response["id"];

  response: string;
  response_date: Date;
  feedback_result_status_id: StatusType["id"];
};
