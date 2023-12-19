export interface ConnectEventHandlers {
  onDone: (event: ConnectDoneEvent) => void;
  onCancel: (event: ConnectCancelEvent) => void;
  onError: (event: ConnectErrorEvent) => void;
  onRoute?: (event: ConnectRouteEvent) => void;
  onUser?: (event: any) => void;
  onLoad?: () => void;
}

export interface ConnectProps {
  connectUrl: string;
  eventHandlers: ConnectEventHandlers;
  linkingUri?: string;
  redirectUrl?: string;
}

export interface ConnectCancelEvent {
  code: number;
  reason: string;
}

export interface ConnectErrorEvent {
  code: number;
  reason: string;
}

export interface ConnectDoneEvent {
  code: number;
  reason: string;
  reportData: [
    {
      portfolioId: string;
      type: string;
      reportId: string;
    }
  ];
}

export interface ConnectRouteEvent {
  screen: string;
  params: any;
}
