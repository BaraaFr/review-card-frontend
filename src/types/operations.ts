export type OperationalStatus =
  | "HEALTHY"
  | "WARNING"
  | "CRITICAL";

export type OperationalIssueSeverity =
  | "WARNING"
  | "CRITICAL";

export interface OperationalIssue {
  code:
    string;

  severity:
    OperationalIssueSeverity;

  message:
    string;

  value?:
    number;
}

export interface QueueHealth {
  available:
    boolean;

  waiting:
    number | null;

  active:
    number | null;

  delayed:
    number | null;

  failed:
    number | null;
}

export interface GoogleBudgetHealth {
  limit:
    number;

  used:
    number;

  remaining:
    number;

  percentage:
    number;

  resetInSeconds:
    number | null;
}

export interface OperationalHealth {
  generatedAt:
    string;

  status:
    OperationalStatus;

  dependencies: {
    redis: {
      available:
        boolean;
    };
  };

  queues: {
    weeklyReports:
      QueueHealth;

    subscriptionReminders:
      QueueHealth;
  };

  weeklyReports: {
    failed:
      number;

    pending:
      number;

    processing:
      number;

    stalePending:
      number;

    staleProcessing:
      number;
  };

  email: {
    unknown:
      number;

    processing:
      number;

    staleProcessing:
      number;
  };

  google: {
    budget:
      GoogleBudgetHealth |
      null;
  };

  issues:
    OperationalIssue[];
}