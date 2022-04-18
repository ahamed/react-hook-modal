/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { css } from '@emotion/react';
import React, { useCallback, useContext, useEffect, useState } from 'react';

import { CloseAction, ModalContextType, ModalState } from './types';
import { generateUUID, zIndex } from './utils';

const ModalContext = React.createContext<ModalContextType>({
  showModal: () => Promise.resolve({ action: CloseAction.CLOSE }),
  closeModal: () => {},
});

export const useModal = () => useContext(ModalContext);

interface ModalProviderProps {
  children: React.ReactNode | React.ReactNode[] | null;
}

const styles = {
  container: css`
    position: fixed;
    inset: 0;
    z-index: ${zIndex.modalContainer};
  `,
  backdrop: css`
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: ${zIndex.negative};
    animation: fadeIn 0.2s linear;
  `,
  content: css`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 10px 15px -10px rgba(0, 0, 0, 0.2), 0 24px 38px 0px rgba(0, 0, 0, 0.15),
      0 9px 46px 5px rgba(0, 0, 0, 0.12);
    z-index: ${zIndex.modalContent};
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
  `,
};

export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [modals, setModals] = useState<ModalState[]>([]);

  const showModal = useCallback<ModalContextType['showModal']>(({ component, props, isClosable = true }) => {
    document.body.style.overflow = 'hidden';

    return new Promise((resolve) => {
      setModals((prev) => {
        const newModal = { component, props, resolve, isClosable, id: generateUUID() };

        return [...prev, newModal];
      });
    });
  }, []);

  const closeModal = useCallback<ModalContextType['closeModal']>((data = { action: CloseAction.CLOSE }) => {
    setModals((prev) => {
      const modal = prev.pop();
      modal?.resolve(data);
      return prev.filter((_, index) => index < prev.length - 1);
    });
    document.body.style.overflow = '';
  }, []);

  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal({ action: CloseAction.CLOSE });
      }
    };
    window.addEventListener('keydown', close);

    return () => window.removeEventListener('keydown', close);
  }, [closeModal]);

  return (
    <ModalContext.Provider value={{ showModal, closeModal }}>
      {children}
      {modals.map((modal) => {
        return (
          <div key={modal.id} css={styles.container}>
            <div
              css={styles.content}
              tabIndex={-1}
              onKeyDown={(event) => {
                if (event.key === 'Escape') {
                  closeModal({ action: CloseAction.CLOSE });
                }
              }}
            >
              {React.createElement(modal.component, { ...modal.props, closeModal })}
            </div>
            <div css={styles.backdrop} onClick={() => closeModal({ action: CloseAction.CLOSE })}></div>
          </div>
        );
      })}
    </ModalContext.Provider>
  );
};
