import { ModelInit, MutableModel, __modelMeta__, ManagedIdentifier } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled } from "@aws-amplify/datastore";





type EagerPunchLog = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<PunchLog, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly userId: string;
  readonly timestamp: string;
  readonly method?: string | null;
  readonly latitude?: number | null;
  readonly longitude?: number | null;
  readonly address?: string | null;
  readonly photoUrl?: string | null;
  readonly location?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyPunchLog = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<PunchLog, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly userId: string;
  readonly timestamp: string;
  readonly method?: string | null;
  readonly latitude?: number | null;
  readonly longitude?: number | null;
  readonly address?: string | null;
  readonly photoUrl?: string | null;
  readonly location?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type PunchLog = LazyLoading extends LazyLoadingDisabled ? EagerPunchLog : LazyPunchLog

export declare const PunchLog: (new (init: ModelInit<PunchLog>) => PunchLog) & {
  copyOf(source: PunchLog, mutator: (draft: MutableModel<PunchLog>) => MutableModel<PunchLog> | void): PunchLog;
}