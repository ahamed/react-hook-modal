import React from 'react';

export enum CloseAction {
  CLOSE = 'CLOSE',
  CANCEL = 'CANCEL',
  CONFIRM = 'CONFIRM',
}

export interface ModalState {
  id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: React.FunctionComponent<any>;
  resolve: (data: CloseModalActions) => void;
  props?: { [key: string]: unknown };
  isClosable?: boolean;
}

export interface ShowModalOptions<P> {
  component: React.FunctionComponent<P>;
  props?: Omit<P, 'closeModal'>;
  isClosable?: boolean;
}

export interface CloseModalActions {
  action: CloseAction;
  [key: string]: unknown;
}

export interface ModalProps {
  closeModal: (data: CloseModalActions) => void;
}

export interface ModalContextType {
  showModal: <P extends ModalProps>(options: ShowModalOptions<P>) => Promise<CloseModalActions>;
  closeModal: (data: CloseModalActions) => void;
}
