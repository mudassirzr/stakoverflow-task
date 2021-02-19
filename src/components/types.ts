export interface ApiResponse {
  owner: { display_name: string };
  title: string;
  creation_date: number;
  question_id: number;
  link: string;
  body: string;
}
export interface QuestionItem {
  author: string;
  title: string;
  creation_date: string;
  question_id: number;
  body: string;
  link: string;
}
