import { ActionReducerMap } from "@ngrx/store";
import { LayoutState, layoutReducer } from "./layouts/layout-reducers";
import { ProjectReducer, ProjectState } from "./Project/project_reducer";
import { TaskReducer, TaskState } from "./Task/task_reducer";
import { CRMReducer, CRMState } from "./CRM/crm_reducer";
import { CryptoReducer, CryptoState } from "./Crypto/crypto_reducer";
import { InvoiceReducer, InvoiceState } from "./Invoice/invoice_reducer";
import { FileManagerReducer, FileManagerState } from "./File Manager/filemanager_reducer";
import { ApplicationReducer, ApplicationState } from "./Jobs/jobs_reducer";
import { ApikeyReducer, ApikeyState } from "./APIKey/apikey_reducer";

export interface RootReducerState {
    layout: LayoutState;
    Project: ProjectState;
    Task: TaskState;
    CRM: CRMState;
    Crypto: CryptoState;
    Invoice: InvoiceState;
    FileManager: FileManagerState;
    Jobs: ApplicationState;
    APIKey: ApikeyState;
}

export const rootReducer: ActionReducerMap<RootReducerState> = {
    layout: layoutReducer,
    Project: ProjectReducer,
    Task: TaskReducer,
    CRM: CRMReducer,
    Crypto: CryptoReducer,
    Invoice: InvoiceReducer,
    FileManager: FileManagerReducer,
    Jobs: ApplicationReducer,
    APIKey: ApikeyReducer,
}