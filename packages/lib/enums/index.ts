export enum HttpStatusCode {
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  ERROR = 500,
}

export enum ProcessType {
  SINGLE = 'individual',
  TEAM = 'equipo',
}

export enum ProcessStatus {
  // Coachee has done nothing
  PendingAnswers,

  // Coachee has completed some stuff, needs to finish
  PartialAnswered,

  // Coachee has finished answering, is waiting for evaluators
  WaitingEvaluators,

  // Coachee has finished answering. Coach needs to upload the report.
  PendingReview,

  // Finished process,
  Finished,

  // Process has expired
  Expired,
}
